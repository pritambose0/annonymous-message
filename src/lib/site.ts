const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const siteUrl = configuredUrl.replace(/\/+$/, "");

export const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "";

export const siteConfig = {
  name: "Mystery Message",
  title: "Mystery Message — Honest feedback starts with anonymity",
  description:
    "Create your personal anonymous link, share it anywhere, and receive honest messages from people around you without revealing their identity.",
  tagline: "Your voice. Their growth.",
  url: siteUrl,
  keywords: [
    "anonymous message",
    "anonymous messages",
    "send anonymous message",
    "anonymous feedback",
    "anonymous questions",
    "honest feedback",
    "private inbox",
    "mystery message",
  ],
};
