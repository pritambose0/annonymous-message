"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  Inbox,
  LayoutDashboard,
  Link2,
  Lock,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";
import { siteConfig, siteUrl } from "@/lib/site";
import messages from "@/messages.json";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: siteUrl,
  description: siteConfig.description,
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

type SampleMessage = {
  title: string;
  content: string;
  received: string;
};

const samples = messages as SampleMessage[];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const steps = [
  {
    icon: Link2,
    title: "Create your link",
    description:
      "Set up your account and get a unique anonymous link that belongs to you.",
  },
  {
    icon: Share2,
    title: "Share anywhere",
    description:
      "Drop it in your bio, a group chat, or send it directly to friends and followers.",
  },
  {
    icon: Inbox,
    title: "Receive honest messages",
    description:
      "Messages land privately in your dashboard, ready to read whenever you are.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Completely anonymous",
    description:
      "Senders never need an account, so the focus stays on the message — not the messenger.",
  },
  {
    icon: Zap,
    title: "Instant messages",
    description:
      "Messages appear in your dashboard right away. No waiting, no approval queues.",
  },
  {
    icon: LayoutDashboard,
    title: "Private dashboard",
    description:
      "Everything you receive is kept in one calm, private space that only you can access.",
  },
  {
    icon: Share2,
    title: "Simple sharing",
    description:
      "One link is all you need. Copy it or use your device's share sheet and you're done.",
  },
];

export default function LandingPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const primaryHref = isAuthenticated ? "/dashboard" : "/sign-up";
  const primaryLabel = isAuthenticated ? "Go to dashboard" : "Get Started Free";

  return (
    <main className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-grid opacity-[0.25] mask-fade-bottom" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Your voice. Their growth.
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]"
              >
                Honest feedback starts with{" "}
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-violet-600 bg-clip-text text-transparent">
                  anonymity.
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
              >
                Create your personal link, share it anywhere, and receive
                honest messages from people around you — without revealing
                their identity.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
              >
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-start"
              >
                {[
                  "No account needed to send",
                  "Private by default",
                  "Free to get started",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-success" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Product preview */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-lg lg:mx-0"
            >
              <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0c0c10] shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                  <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                  </span>
                  <div className="mx-auto flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/40 px-2.5 py-1 text-[10px] text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" />
                    mystery.message/u/alex
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-xs font-semibold text-primary">
                        A
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Alex&apos;s dashboard
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Your anonymous inbox
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Collecting
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Total", value: "24" },
                      { label: "Today", value: "3" },
                      { label: "Status", value: "On" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-border/70 bg-card/70 p-2.5"
                      >
                        <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-2">
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                      mystery.message/u/alex
                    </span>
                    <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
                      Copy
                    </span>
                  </div>

                  <div className="space-y-2">
                    {samples.slice(0, 2).map((message, index) => (
                      <div
                        key={message.title}
                        className="rounded-xl border border-border/70 bg-card/70 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <MessageSquare className="h-3 w-3" />
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Anonymous
                          </span>
                          <span className="ml-auto text-[9px] text-muted-foreground/70">
                            {index === 0 ? "just now" : message.received}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground/90">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-5 right-3 flex max-w-[230px] items-center gap-2.5 rounded-xl border border-border bg-popover/95 px-3 py-2.5 shadow-xl shadow-black/40 backdrop-blur"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-foreground">
                    New anonymous message
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    Someone just sent you feedback.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-border/60 bg-surface/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Three steps to honest feedback
            </h2>
            <p className="mt-4 text-muted-foreground">
              No complicated setup. Create a link, share it, and let the
              messages come to you.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground/60">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for honest conversations
            </h2>
            <p className="mt-4 text-muted-foreground">
              Simple by design, private by default. Everything you need to
              collect feedback and nothing you don&apos;t.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                  <feature.icon className="h-[18px] w-[18px]" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample messages */}
      <section className="border-t border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                A calmer inbox
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Every message, without the pressure of a name
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                People can be more open when they don&apos;t have to attach an
                identity. Your inbox keeps those messages private and easy to
                revisit.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  "Messages are delivered straight to your dashboard",
                  "Only you can read, refresh, or delete them",
                  "Turn collection off whenever you need a pause",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Button asChild variant="outline" className="mt-8">
                <Link href={primaryHref}>
                  {isAuthenticated ? "Open your dashboard" : "Start your inbox"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-primary/[0.07] blur-2xl" />
              <div className="relative space-y-3">
                {samples.map((message, index) => (
                  <motion.div
                    key={message.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    style={{
                      marginLeft: `${index === 1 ? 20 : 0}px`,
                      marginRight: `${index === 2 ? 20 : 0}px`,
                    }}
                    className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MessageSquare className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Anonymous
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                      <span className="ml-auto rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                        Private
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                      {message.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-80" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Ready to hear what people really think?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Set up your anonymous link in a minute and start collecting
                honest feedback today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto"
                >
                  <Link href="/sign-in">
                    <UserRound className="h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-surface/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5">
                <LogoMark />
                <span className="text-[15px] font-semibold text-foreground">
                  Mystery Message
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A private space for honest, anonymous feedback. Create your
                link, share it, and listen without judgment.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Account
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/sign-in"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Mystery Message</p>
            <p className="inline-flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              Feedback without the pressure of a name.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
