import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signupSchema } from "@/schemas/signupSchema";

export async function POST(request: Request) {
  await connectDB();

  try {
    const body = await request.json();

    const result = signupSchema.safeParse(body);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const emailErrors = result.error.format().email?._errors || [];
      const passwordErrors = result.error.format().password?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : emailErrors?.length > 0
                ? emailErrors.join(", ")
                : passwordErrors?.length > 0
                  ? passwordErrors.join(", ")
                  : "Invalid username, email or password",
        },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email is already taken" },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyToken = verifyCode;
      existingUserByEmail.verifyTokenExpiry = new Date(
        Date.now() + 10 * 60 * 1000
      );
      await existingUserByEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyToken: verifyCode,
        verifyTokenExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    // console.log("Email Response:", emailResponse);

    if (!emailResponse.success) {
      await UserModel.deleteOne({ email });
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      { success: false, message: "Failed to register user" },
      { status: 500 }
    );
  }
}
