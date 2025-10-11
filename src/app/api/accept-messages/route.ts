import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";

export async function POST(request: Request) {
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
  const userId = user._id;
  const body = await request.json();

  const result = acceptMessagesSchema.safeParse(body);

  if (!result.success) {
    const acceptMessagesErrors =
      result.error.format().acceptMessages?._errors || [];

    return Response.json(
      {
        success: false,
        message:
          acceptMessagesErrors?.length > 0
            ? acceptMessagesErrors.join(", ")
            : "Invalid acceptMessages value",
      },
      { status: 400 }
    );
  }

  const isAcceptingMessage = result.data.acceptMessages;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages acceptance updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting messages:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user status to accept messages:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get user status to accept messages",
      },
      { status: 500 }
    );
  }
}
