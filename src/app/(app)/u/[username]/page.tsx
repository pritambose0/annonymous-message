"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Lightbulb, Loader2, Send, Wand } from "lucide-react";

type FormData = {
  message: string;
};

const Page = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      message: "",
    },
  });

  const generateSuggestedMessages = async () => {
    setLoadingSuggestions(true);
    try {
      setLoadingSuggestions(true);
      const response = await axios.post("/api/suggest-messages");
      const text = response.data;
      const parsed = text
        .split("||")
        .map((q: string) => q.trim())
        .filter(Boolean);
      setSuggestedMessages(parsed);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: params.username,
        content: data.message,
      });

      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <>
      {/* Main Container for Anonymous Message */}
      <div className="w-[95%] md:w-full max-w-3xl mx-auto p-6 md:p-10 bg-gray-900 text-gray-100 rounded-2xl border border-gray-700 shadow-md mt-28">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Send Anonymous Message
        </h1>
        <p className="text-gray-400 mb-8">
          To:{" "}
          <strong className="text-indigo-400 font-semibold">
            {params.username}
          </strong>
        </p>

        {/* Message Submission Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              rules={{
                required: "🤭 Oops! Don’t be shy, type something fun!",
                minLength: {
                  value: 3,
                  message: "😅 Just a few letters, not nothing!",
                },
                maxLength: {
                  value: 200,
                  message: "😎 Easy there! That’s a novel, keep it shorter!",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-2 block text-gray-300">
                    Your Anonymous Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your anonymous message here (3-200 characters)..."
                      {...field}
                      className="w-full min-h-[120px] p-4 rounded-xl border border-gray-600 bg-gray-900 text-gray-100 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Suggested Messages Section */}
      <div className="w-[95%] md:w-full max-w-3xl mx-auto p-6 md:p-10 bg-gray-900 text-gray-100 rounded-2xl border border-gray-700 shadow-md my-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-400" />
          Message Inspiration
        </h2>

        {/* Generate Button */}
        <Button
          onClick={generateSuggestedMessages}
          disabled={loadingSuggestions}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 border border-gray-600 text-gray-100 font-medium hover:bg-gray-700 flex items-center justify-center gap-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingSuggestions ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Wand className="h-4 w-4 text-indigo-400" /> Generate New
              Questions
            </>
          )}
        </Button>

        {/* Display suggested messages */}
        {!loadingSuggestions && suggestedMessages.length > 0 ? (
          <ul className="space-y-3">
            {suggestedMessages.map((msg, i) => (
              <li
                key={i}
                onClick={() => form.setValue("message", msg)}
                className="border border-gray-700 rounded-xl p-4 text-center text-gray-100 text-sm font-normal hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              >
                {msg}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic p-4 text-center border-dashed border border-gray-700 rounded-xl">
            Click **Generate New Questions** to get started.
          </p>
        )}
      </div>
    </>
  );
};

export default Page;
