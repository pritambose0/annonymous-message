import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You are not logged in",
      },
      { status: 401 }
    );
  }

  const user = session?.user;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: userId,
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json({ success: true, messages: user[0].messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 }
    );
  }
}
