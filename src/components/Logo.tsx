import Link from "next/link";
import { Lock, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-400 via-violet-500 to-violet-700 shadow-lg shadow-violet-600/25",
        className
      )}
      aria-hidden="true"
    >
      <MessageSquare className="h-[17px] w-[17px] text-white" strokeWidth={2.4} />
      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-background">
        <Lock className="h-2 w-2 text-violet-300" strokeWidth={3} />
      </span>
    </span>
  );
}

export function Logo({
  href = "/",
  className,
  textClassName,
}: {
  href?: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      aria-label="Mystery Message home"
    >
      <LogoMark />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight text-foreground",
          textClassName
        )}
      >
        Mystery Message
      </span>
    </Link>
  );
}
