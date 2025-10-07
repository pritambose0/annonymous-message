import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/model/User";

export async function DELETE({ params }: { params: { messageid: string } }) {
  const messageId = params.messageid;
  await connectDB();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You are not logged in",
      },
      { status: 401 }
    );
  }

  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting message", error);
    return Response.json(
      { success: false, message: "Failed to delete message" },
      { status: 500 }
    );
  }
}
