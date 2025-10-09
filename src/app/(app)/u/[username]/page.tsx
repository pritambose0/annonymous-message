"use client";

import React, { useEffect, useState } from "react";
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
      toast.error("Failed to generate suggestions");
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
      {/* Main Container for the Public Profile Link section */}
      <div className="min-w-[60%] mx-auto p-6 md:p-10 bg-white rounded-xl border border-gray-200 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          Send Anonymous Message
        </h1>
        <p className="text-base text-gray-500 mb-8">
          To:{" "}
          <strong className="text-indigo-600 font-semibold">
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
                  <FormLabel className="text-sm font-medium text-gray-700 block mb-2">
                    Your Anonymous Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your anonymous message here (3-200 characters)..."
                      {...field}
                      // Minimal input styling: clean border, subtle focus ring
                      className="resize-none border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-base font-normal w-full min-h-[100px] transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-600 mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              // Crisp, high-contrast button
              className="w-full bg-gray-900 hover:bg-indigo-600 text-white font-semibold text-base px-6 py-3 rounded-lg shadow-none transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="min-w-[60%] mx-auto p-6 md:p-10 bg-white rounded-xl border border-gray-200 mt-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-600" />
          Message Inspiration
        </h2>

        {/* Generate Button */}
        <Button
          onClick={generateSuggestedMessages}
          disabled={loadingSuggestions}
          // Accent button, distinct from the primary submit button
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition-colors shadow-none mb-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingSuggestions ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Wand className="h-4 w-4 text-indigo-500" /> Generate New
              Questions
            </>
          )}
        </Button>

        {/* Display final, formatted list */}
        {!loadingSuggestions && suggestedMessages.length > 0 && (
          <ul className="space-y-3">
            {suggestedMessages.map((q, i) => (
              <li
                // Minimal list item: light border, slight background on hover
                className="border border-gray-200 rounded-lg p-4 font-normal text-center text-sm text-gray-800 bg-white hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                key={i}
                onClick={() => form.setValue("message", q)}
              >
                {q}
              </li>
            ))}
          </ul>
        )}

        {/* Initial state or post-generation clear state */}
        {!loadingSuggestions && suggestedMessages.length === 0 && (
          <p className="text-gray-500 italic p-4 text-center border-dashed border border-gray-300 rounded-lg">
            Click **Generate New Questions** to get started.
          </p>
        )}
      </div>
    </>
  );
};

export default Page;
