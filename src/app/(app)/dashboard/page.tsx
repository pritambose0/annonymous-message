"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message, User } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Wand } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
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
    setIsSwitchLoading(true); // Keeping this for UI consistency, though it's mainly for the switch

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

  // const {
  //   completion,
  //   isLoading: isGenerating,
  //   complete,
  //   error: completionError,
  //   setCompletion,
  // } = useCompletion({
  //   api: "/api/suggest-messages",

  //   onError: (error) => {
  //     toast.error(`Error generating suggestions: ${error.message}`);
  //   },
  //   onFinish: (prompt, completion) => {
  //     console.log("✅ Final Completion from Server:", completion);
  //   },
  // });

  // // Function to trigger message generation
  // const generateSuggestedMessages = () => {
  //   setCompletion("");
  //   complete("");
  // };

  // Utility to parse the streamed content
  // const parsedSuggestedMessages = completion
  //   .split("||")
  //   .map((q) => q.trim())
  //   .filter((q) => !!q);

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

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Main Dashboard */}
      <div className="my-10 mx-4 md:mx-8 lg:mx-auto p-8 bg-white rounded-2xl shadow-lg w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          User Dashboard
        </h1>

        {/* Unique Link Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Copy Your Unique Link</h2>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
            <Button
              onClick={copyToClipboard}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Switch */}
        <div className="mb-8 flex items-center gap-3">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="border border-gray-300 shadow-sm hover:ring-1 hover:ring-indigo-500 transition-all"
          />
          <span className="text-gray-700 font-medium">
            Accept Messages:{" "}
            <span className="font-semibold text-indigo-600">
              {acceptMessages ? "On" : "Off"}
            </span>
          </span>
        </div>

        <Separator className="my-8" />

        {/* Refresh Messages Button */}
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:shadow transition-all"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            ) : (
              <RefreshCcw className="h-5 w-5 text-indigo-600" />
            )}
            <span className="hidden md:inline">Refresh Messages</span>
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-gray-500 italic text-center col-span-full mt-6">
              No messages to display.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
