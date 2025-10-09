import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

// Correctly define the font with a variable name
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Send anonymous messages easily and safely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <AuthProvider>
        <body className={`font-poppins antialiased bg-gray-800 `}>
          <Navbar />
          {children}
          <Toaster richColors position="top-center" />
        </body>
      </AuthProvider>
    </html>
  );
}
