import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyToken === code.code;
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
