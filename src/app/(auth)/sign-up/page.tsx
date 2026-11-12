"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
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
import { signupSchema } from "@/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResponse";

type UsernameStatus = "idle" | "checking" | "available" | "unavailable" | "error";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    let cancelled = false;

    const checkUsernameUnique = async () => {
      if (!username) {
        setUsernameStatus("idle");
        setUsernameMessage("");
        return;
      }

      setUsernameStatus("checking");
      setUsernameMessage("Checking availability...");

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );
        if (cancelled) return;
        setUsernameStatus("available");
        setUsernameMessage(
          response.data.message || "Username is available"
        );
      } catch (error) {
        if (cancelled) return;
        const axiosError = error as AxiosError<ApiResponse>;
        const status = axiosError.response?.status;
        setUsernameStatus(status === 400 ? "unavailable" : "error");
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      }
    };

    checkUsernameUnique();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);

      if (response.data.success) {
        toast.success("Account created", {
          description: response.data.message,
        });
        router.replace(`/verify/${data.username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Sign up failed", {
        description:
          axiosError.response?.data.message ??
          "Please check your details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameBlocked =
    usernameStatus === "unavailable" || usernameStatus === "checking";

  return (
    <AuthShell>
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start collecting anonymous messages in a minute.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-7 space-y-5"
          noValidate
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="yourname"
                    autoComplete="username"
                    autoFocus
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setUsernameStatus("idle");
                      setUsernameMessage("");
                      debounced(event.target.value);
                    }}
                  />
                </FormControl>
                <div
                  aria-live="polite"
                  className="min-h-[20px] text-xs"
                  role="status"
                >
                  {usernameStatus === "checking" && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Checking availability...
                    </span>
                  )}
                  {usernameStatus === "available" && (
                    <span className="inline-flex items-center gap-1.5 text-success">
                      <Check className="h-3.5 w-3.5" />
                      {usernameMessage}
                    </span>
                  )}
                  {usernameStatus === "unavailable" && (
                    <span className="inline-flex items-center gap-1.5 text-destructive">
                      <X className="h-3.5 w-3.5" />
                      {usernameMessage}
                    </span>
                  )}
                  {usernameStatus === "error" && (
                    <span className="inline-flex items-center gap-1.5 text-warning">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {usernameMessage}
                    </span>
                  )}
                </div>
                <FormDescription>
                  2–20 characters, letters and numbers only.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className="pr-11"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>Use at least 6 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting || isUsernameBlocked}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default Page;
