import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  await connectDB();

  const username = params.username;
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const email = user.email;

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save to DB
    user.verifyToken = verifyCode;
    user.verifyTokenExpiry = verifyCodeExpiry;
    await user.save();

    // Send Verification Email
    await sendVerificationEmail(email, username, verifyCode);

    return Response.json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
