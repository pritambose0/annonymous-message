"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Lock,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof messageSchema>;
type BlockedReason = "notfound" | "closed" | null;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [blocked, setBlocked] = useState<BlockedReason>(null);
  const [pageError, setPageError] = useState("");
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<FormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const content = form.watch("content") ?? "";
  const characterCount = content.length;
  const nearLimit = characterCount >= 180;

  const generateSuggestedMessages = async () => {
    if (loadingSuggestions) return;
    setLoadingSuggestions(true);

    try {
      const response = await axios.post("/api/suggest-messages");
      const text = response.data as string;
      const parsed = text
        .split("||")
        .map((question) => question.trim())
        .filter(Boolean);
      setSuggestedMessages(parsed);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Couldn't generate suggestions. Please try again."
      );
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (loading) return;
    setLoading(true);
    setPageError("");

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast.success(response.data.message || "Message sent");
      setSent(true);
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const status = axiosError.response?.status;

      if (status === 404) {
        setBlocked("notfound");
      } else if (status === 403) {
        setBlocked("closed");
      } else {
        const message =
          axiosError.response?.data.message ??
          "Couldn't send your message. Please try again.";
        setPageError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (blocked) {
    return (
      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <Card className="relative w-full max-w-md border-border bg-card">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-xl font-semibold text-foreground">
              {blocked === "notfound"
                ? "This link isn't available"
                : "Messages are paused"}
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {blocked === "notfound"
                ? `We couldn't find a user called @${username}. Double-check the link you were given.`
                : `@${username} isn't accepting anonymous messages right now. Please try again later.`}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-radial-fade opacity-80" />

      <div className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Anonymous &amp; private
          </span>
          <h1 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Send an anonymous message
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            To{" "}
            <span className="font-medium text-foreground">@{username}</span>.
            Your identity stays hidden — they&apos;ll only see what you write.
          </p>
        </div>

        {pageError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{pageError}</p>
          </div>
        )}

        {sent ? (
          <Card className="mt-8 border-border bg-card">
            <CardContent className="flex flex-col items-center px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-success/20 bg-success/10 text-success">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-foreground">
                Message sent
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Your anonymous message is on its way to @{username}. No one
                knows it came from you.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setSent(false)}
              >
                <Send className="h-4 w-4" />
                Send another message
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 border-border bg-card">
            <CardContent className="p-5 sm:p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <FormLabel className="text-sm font-medium">
                            Your message
                          </FormLabel>
                          <span
                            className={cn(
                              "text-xs tabular-nums transition-colors",
                              nearLimit
                                ? "text-warning"
                                : "text-muted-foreground"
                            )}
                          >
                            {characterCount}/200
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Say what's on your mind. Honest, kind, or curious — it's up to you."
                            maxLength={200}
                            className="min-h-[160px] resize-none text-[15px] leading-relaxed"
                            aria-describedby="message-help"
                            {...field}
                          />
                        </FormControl>
                        <p
                          id="message-help"
                          className="text-xs text-muted-foreground"
                        >
                          Between 3 and 200 characters. Messages can&apos;t be
                          traced back to you.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Inspiration */}
        <Card className="mt-4 border-border bg-card/60">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Lightbulb className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Need some inspiration?
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Generate a few prompts, pick one you like, and make it your
                    own.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSuggestedMessages}
                disabled={loadingSuggestions}
                className="w-full shrink-0 sm:w-auto"
              >
                {loadingSuggestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : suggestedMessages.length > 0 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Regenerate
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate ideas
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4">
              {loadingSuggestions ? (
                <div className="grid gap-2">
                  {[0, 1, 2].map((item) => (
                    <Skeleton key={item} className="h-11 rounded-xl" />
                  ))}
                </div>
              ) : suggestedMessages.length > 0 ? (
                <div className="grid gap-2">
                  {suggestedMessages.map((message, index) => (
                    <button
                      key={`${message}-${index}`}
                      type="button"
                      onClick={() =>
                        form.setValue("content", message, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className="group flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 px-3.5 py-3 text-left text-sm leading-relaxed text-muted-foreground transition-all hover:border-primary/40 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary/70 transition-colors group-hover:text-primary" />
                      <span>{message}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
                  Your generated prompts will appear here.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Powered by Mystery Message · Your identity is never shared with the
          recipient.
        </p>
      </div>
    </main>
  );
};

export default Page;
