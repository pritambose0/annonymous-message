import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Verify your email to activate your Mystery Message account.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
