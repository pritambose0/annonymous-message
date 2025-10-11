"use client";

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import messages from "@/messages.json";
import Link from "next/link";

type Message = {
  title: string;
  content: string;
  received: string;
};

export default function LandingPage() {
  const features = [
    {
      title: "Anonymous",
      description: "Your identity stays hidden while giving honest feedback.",
    },
    {
      title: "Instant",
      description: "Send and receive messages in real-time without any delay.",
    },
    {
      title: "Secure",
      description: "All messages are encrypted and private.",
    },
    {
      title: "Easy",
      description: "No sign-up required — just share the link.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <main className="flex flex-col items-center bg-gray-900 text-white">
        <section className="text-center py-24 px-6 md:px-24 max-w-3xl">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Share Feedback Anonymously
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg md:text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            True Feedback — Speak your mind freely while staying anonymous.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href={"/sign-up"}>
              <Button className="bg-blue-600 text-white px-10 py-4 rounded-2xl shadow hover:bg-blue-700 transition">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Compact Messages Carousel */}
        <section className="w-full max-w-2xl mb-24 px-6 md:px-0">
          <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full">
            <CarouselContent>
              {messages.map((msg: Message, i: number) => (
                <CarouselItem key={i}>
                  <Card className="bg-gray-800 border border-gray-700 shadow-sm rounded-xl p-6 hover:shadow-md transition z-10">
                    <CardHeader className="text-gray-400 font-medium text-sm mb-2 text-center">
                      {msg.title}
                    </CardHeader>
                    <CardContent className="text-center text-gray-100 font-semibold text-lg">
                      {msg.content}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-400 hover:text-white transition" />
            <CarouselNext className="text-gray-400 hover:text-white transition" />
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl w-full px-6 md:px-0 mb-24 z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose True Feedback?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {f.title}
                </h3>
                <p className="text-gray-300">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-24 px-6 md:px-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of users sharing feedback anonymously today.
          </p>
          <Link href={"/sign-up"}>
            <Button className="bg-blue-600 text-white px-10 py-4 rounded-2xl shadow hover:bg-blue-700 transition">
              Get Started
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 bg-gray-950 border-t border-gray-800 text-gray-400 text-sm">
        © 2025 True Feedback. Built with 💭 anonymity in mind.
      </footer>
    </>
  );
}
