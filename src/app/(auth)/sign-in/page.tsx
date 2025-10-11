"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Login Successfull");
    }

    if (response?.error) {
      toast.error("Login Failed", { description: response.error });
      setIsSubmitting(false);
    }

    if (response?.url) {
      setIsSubmitting(false);
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl p-8 shadow-2xl space-y-8 border border-white/10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-400">Login to your account</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username / Email */}
            <FormField
              name="identifier"
              control={form.control}
              rules={{ required: "Oops! 😅 You gotta tell me who you are!" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/10 text-white border border-white/20 placeholder-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              rules={{ required: "Oops! 😅 You gotta tell me who you are!" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-white/10 text-white border border-white/20 placeholder-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Must be at least 8 characters.
                  </FormDescription>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInPage;
