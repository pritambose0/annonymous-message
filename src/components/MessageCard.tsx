"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Message } from "@/model/User";

type MessageProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
      onMessageDelete(message?._id as string);
    } catch (error) {
      console.error("Error while deleting message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  return (
    <>
      <Card className="bg-white shadow-md hover:shadow-lg p-3 transition-shadow duration-300 rounded-xl border border-gray-100">
        <CardContent className="pb-2">
          <p className="text-gray-800 text-base break-words">
            {message.content}
          </p>
        </CardContent>

        <CardDescription className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <span className="text-gray-400">
            {message.createdAt
              ? new Date(message.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—"}
          </span>

          <Button
            variant="destructive"
            size="sm"
            className="ml-4 hover:bg-red-600 transition-colors"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </CardDescription>
      </Card>
    </>
  );
};

export default MessageCard;
