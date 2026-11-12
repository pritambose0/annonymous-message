"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MailCheck,
  RotateCcw,
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
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Account verified");
        setVerified(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message ||
        "That code didn't work. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    setIsResending(true);

    try {
      const response = await axios.post<ApiResponse>(
        `/api/resend-code/${params.username}`
      );
      if (response.data.success) {
        toast.success(response.data.message || "Verification code resent");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Couldn't resend the code"
      );
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-success/20 bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            Email verified
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your account for{" "}
            <span className="font-medium text-foreground">
              @{params.username}
            </span>{" "}
            is ready. Sign in to start collecting anonymous messages.
          </p>
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() => router.replace("/sign-in")}
          >
            Continue to sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Verify your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We sent a 6-digit code to the email linked to{" "}
          <span className="font-medium text-foreground">
            @{params.username}
          </span>
          . Enter it below to activate your account.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-7 space-y-5"
          noValidate
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                    className="h-12 text-center text-lg font-semibold tracking-[0.5em]"
                    {...field}
                    value={field.value || ""}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Check your spam folder if the email hasn&apos;t arrived.
                </FormDescription>
                <FormMessage />
                {errorMessage && (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  >
                    {errorMessage}
                  </p>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify account"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isResending}
            className="w-full"
            onClick={handleResendCode}
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Resend code
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Wrong username?{" "}
        <button
          type="button"
          onClick={() => router.replace("/sign-up")}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create a new account
        </button>
      </p>
    </AuthShell>
  );
};

export default VerifyPage;
