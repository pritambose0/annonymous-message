import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";

const verifyCodeSchema = z.object({
  username: usernameValidation,
  code: verifySchema,
});

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, code } = await request.json();

    const result = verifyCodeSchema.safeParse({ username, code });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const codeErrors = result.error.format().code?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : codeErrors?.length > 0
                ? codeErrors.join(", ")
                : "Invalid username or code",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyToken === code;
    const isCodeNotExpired = user.verifyTokenExpiry > new Date();

    if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }

    await UserModel.findOneAndUpdate({ username }, { isVerified: true });

    return Response.json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      { success: false, message: "Failed to verify user" },
      { status: 500 }
    );
  }
}
