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
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900 text-white shadow-md">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-tight">
        Mystery Message
      </Link>

      {/* Auth Status */}
      {status === "authenticated" ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-300">
            Welcome,{" "}
            <span className="font-medium text-white">
              {user.name || user.username}
            </span>
          </span>
          <Button
            variant="secondary"
            className="bg-zinc-800 hover:bg-zinc-700"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Link href="/sign-in">
          <Button className="bg-primary hover:bg-primary/80 text-white">
            Login
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
