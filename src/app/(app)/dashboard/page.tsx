"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Inbox,
  Link2,
  Loader2,
  Radio,
  RefreshCcw,
  Share2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  tone?: "primary" | "success" | "neutral";
};

const StatCard = ({ icon: Icon, label, value, hint, tone }: StatCardProps) => (
  <Card className="border-border bg-card">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            tone === "success"
              ? "bg-success/10 text-success"
              : tone === "primary"
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </CardContent>
  </Card>
);

const MessageSkeleton = () => (
  <Card className="border-border bg-card">
    <CardContent className="p-5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => (
  <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="mt-3 h-8 w-64" />
    <Skeleton className="mt-3 h-4 w-full max-w-md" />
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-[116px] rounded-2xl" />
      ))}
    </div>
    <Skeleton className="mt-4 h-48 rounded-2xl" />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <MessageSkeleton key={item} />
      ))}
    </div>
  </main>
);

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof acceptMessagesSchema>>({
    resolver: zodResolver(acceptMessagesSchema),
    defaultValues: { acceptMessages: false },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const username = session?.user?.username;

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      setProfileUrl(`${window.location.origin}/u/${username}`);
    }
  }, [username]);

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue(
        "acceptMessages",
        response.data?.isAcceptingMessage ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Couldn't load your collection status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages ?? []);

      if (refresh) {
        toast.success("Messages refreshed");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message ??
        "Couldn't load your messages. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((current) =>
      current.filter((message) => String(message._id) !== messageId)
    );
  };

  const handleSwitchChange = async () => {
    if (isSwitchLoading || isToggling) return;
    const nextValue = !acceptMessages;
    setIsToggling(true);
    setValue("acceptMessages", nextValue);

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: nextValue,
      });
      toast.success(
        response.data.message ||
          (nextValue ? "Messages are on" : "Messages are paused")
      );
    } catch (error) {
      setValue("acceptMessages", !nextValue);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Couldn't update your collection setting"
      );
    } finally {
      setIsToggling(false);
    }
  };

  const copyToClipboard = useCallback(async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  }, [profileUrl]);

  const handleShare = async () => {
    if (!profileUrl) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Mystery Message",
          text: "Send me an anonymous message",
          url: profileUrl,
        });
      } catch (error) {
        if ((error as DOMException)?.name !== "AbortError") {
          await copyToClipboard();
        }
      }
      return;
    }

    await copyToClipboard();
  };

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  const totalMessages = messages.length;
  const today = new Date().toDateString();
  const messagesToday = messages.filter(
    (message) =>
      message.createdAt && new Date(message.createdAt).toDateString() === today
  ).length;

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-radial-fade opacity-70" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {username}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {todayLabel} · Here&apos;s what&apos;s happening in your anonymous
              inbox.
            </p>
          </div>

          {username && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/u/${username}`} target="_blank">
                Preview public page
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Inbox}
            label="Total messages"
            value={loading ? "—" : String(totalMessages)}
            hint="All time"
            tone="primary"
          />
          <StatCard
            icon={CalendarDays}
            label="Received today"
            value={loading ? "—" : String(messagesToday)}
            hint="Since midnight"
          />
          <StatCard
            icon={Radio}
            label="Collection status"
            value={
              isSwitchLoading ? "—" : acceptMessages ? "Accepting" : "Paused"
            }
            hint={
              acceptMessages
                ? "Your link is open"
                : "New messages are paused"
            }
            tone={acceptMessages ? "success" : "neutral"}
          />
        </div>

        {/* Link + toggle */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="border-border bg-card lg:col-span-2">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Link2 className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Your anonymous link
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Anyone with this link can send you a message — no account
                    or email required.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Input
                  readOnly
                  value={profileUrl}
                  aria-label="Your anonymous message link"
                  onFocus={(event) => event.currentTarget.select()}
                  className="h-10 flex-1 font-mono text-xs sm:text-sm"
                  placeholder="Loading your link..."
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={copyToClipboard}
                    disabled={!profileUrl}
                    className="flex-1 sm:flex-none"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShare}
                    disabled={!profileUrl}
                    className="flex-1 sm:flex-none"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Tip: add this link to your bio so people can reach you from
                anywhere.
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-border bg-card transition-colors",
              acceptMessages && "border-success/20"
            )}
          >
            <CardContent className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    acceptMessages
                      ? "bg-success/10 text-success"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Radio className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Message collection
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Pause new messages any time without losing the ones
                    you&apos;ve already received.
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isSwitchLoading
                      ? "Checking..."
                      : acceptMessages
                        ? "Accepting messages"
                        : "Paused"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {acceptMessages
                      ? "Your link is live."
                      : "Your link is temporarily closed."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isToggling && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Switch
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading || isToggling}
                    aria-label="Accept anonymous messages"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <section className="mt-8" aria-labelledby="messages-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h2
                  id="messages-heading"
                  className="text-lg font-semibold tracking-tight text-foreground"
                >
                  Messages
                </h2>
                <span className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {loading ? "…" : totalMessages}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Newest messages appear first.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                fetchMessages(true);
              }}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <MessageSkeleton key={item} />
                ))}
              </div>
            ) : error ? (
              <Card className="border-destructive/20 bg-card">
                <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    Couldn&apos;t load messages
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => fetchMessages()}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Try again
                  </Button>
                </CardContent>
              </Card>
            ) : totalMessages === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground">
                    <Inbox className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    No messages yet
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Share your anonymous link and the first honest message will
                    show up here.
                  </p>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={copyToClipboard}
                      disabled={!profileUrl}
                    >
                      <Copy className="h-4 w-4" />
                      Copy my link
                    </Button>
                    {username && (
                      <Button asChild variant="outline">
                        <Link href={`/u/${username}`} target="_blank">
                          View public page
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                layout
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <MessageCard
                      key={String(message._id)}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
