import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import MotionProvider from "@/components/MotionProvider";
import { googleSiteVerification, siteConfig, siteUrl } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "social",
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: googleSiteVerification
    ? { google: googleSiteVerification }
    : undefined,
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${spaceGrotesk.variable} dark`}
    >
      <AuthProvider>
        <MotionProvider>
          <body className="min-h-screen bg-background font-sans text-foreground antialiased">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
            >
              Skip to content
            </a>
            <Navbar />
            {children}
            <Toaster richColors position="top-center" />
          </body>
        </MotionProvider>
      </AuthProvider>
    </html>
  );
}
