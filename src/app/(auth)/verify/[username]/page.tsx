"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      if (response.data.success) {
        router.replace("/sign-in");
        toast.success(response.data.message || "Verification successful");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error while verifying code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Verification failed");
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await axios.post(`/api/resend-code/${params.username}`);
      if (response.data.success) {
        toast.success(response.data.message || "Code resent successfully");
      }
      setIsResending(false);
    } catch (error) {
      console.error("Error while resending code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Code resending failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-lg p-8 shadow-2xl space-y-8 border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Verify your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter the 6-digit code we sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter 6-digit code"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    This is your 6-digit verification code.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Verifying
                </>
              ) : (
                "Verify"
              )}
            </Button>
            <Button
              type="submit"
              disabled={isResending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition duration-200"
              onClick={handleResendCode}
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin" /> Resending
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyPage;
