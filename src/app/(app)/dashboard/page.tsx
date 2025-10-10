"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data?.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages ?? []);

      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };

  const username = session?.user?.username;

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied to clipboard");
  };

  if (!session || !session.user || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <Loader2 className="animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <>
      {/* Main Dashboard */}
      <div className="my-10 mt-28 px-4 sm:px-6 md:px-8 lg:mx-auto p-6 sm:p-8 bg-gray-900 rounded-2xl shadow-lg max-w-6xl text-white mx-4">
        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center sm:text-left text-white">
          User Dashboard
        </h1>

        {/* Unique Link Section */}
        <div className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-300 text-center sm:text-left">
            Copy Your Unique Link
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm text-white text-sm sm:text-base"
            />
            <Button
              onClick={copyToClipboard}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow w-full sm:w-auto"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Switch */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="border border-gray-700 shadow-sm hover:ring-1 hover:ring-indigo-500 transition-all"
            />
            <span className="text-gray-300 font-medium text-sm sm:text-base">
              Accept Messages:{" "}
              <span className="font-semibold text-indigo-400">
                {acceptMessages ? "On" : "Off"}
              </span>
            </span>
          </div>
        </div>

        <Separator className="my-8 border-gray-700" />

        {/* Refresh Messages Button */}
        <div className="flex justify-center sm:justify-end mb-8">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-800 hover:shadow transition-all text-gray-900 w-full sm:w-auto bg-gray-100"
          >
            {!loading && <RefreshCcw className="h-5 w-5 text-indigo-400" />}
            <span className="text-sm sm:text-base">Refresh Messages</span>
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400 text-center mx-auto col-span-full" />
          )}

          {messages.length > 0 &&
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}

          {messages.length === 0 && (
            <p className="text-gray-500 italic text-center col-span-full mt-6 text-sm sm:text-base">
              No messages to display.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
