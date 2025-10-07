"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="w-full bg-zinc-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Mystery Message
        </Link>

        {/* Auth Status */}
        {status === "authenticated" ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-zinc-300">
              Welcome,&nbsp;
              <span className="font-medium text-white">
                {user.name || user.username || "User"}
              </span>
            </span>
            <Button
              variant="outline"
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-200"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
