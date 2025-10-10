"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-950 text-white shadow-xl fixed top-0 z-[999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          Mystery Message
        </Link>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <Button className="border-gray-700 bg-blue-600 hover:bg-blue-700 hover:text-white text-gray-200 rounded-lg transition">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-200 rounded-lg transition"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-2 transition">
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 shadow-inner">
          <div className="flex flex-col items-center gap-3 py-4">
            {status === "authenticated" ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-2 hover:bg-gray-800 rounded-lg transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-center py-2 hover:bg-gray-800 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-2 hover:bg-gray-800 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-2 hover:bg-gray-800 rounded-lg transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
