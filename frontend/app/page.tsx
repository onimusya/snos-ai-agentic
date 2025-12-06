"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

function HomeContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Say No to <span className="text-red-500">Online Scam</span>
            <span className="block text-muted-foreground/60">
              Your Digital Private Investigator
            </span>
            <span className="block">Powered by AI</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Protect yourself from digital fraud and online scams with
            multi-modal forensic analysis and real-time threat intelligence.
          </p>

          {/* CTA */}
          <div className="max-w-md mx-auto px-4">
            <div className="hidden sm:flex rounded-full border border-border bg-background overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email to get started"
                className="flex-1 px-6 py-4 text-base bg-transparent focus:outline-none"
              />
              <Link href="/chat" className="flex-shrink-0">
                <Button className="rounded-full m-1.5 px-6 h-11">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="rounded-full border border-border bg-background">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 text-base bg-transparent focus:outline-none text-center"
                />
              </div>
              <Link href="/chat" className="w-full">
                <Button className="rounded-full w-full h-12 text-base">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">50K+</p>
              <p className="text-sm text-muted-foreground">Scams Detected</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">98%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">24/7</p>
              <p className="text-sm text-muted-foreground">Protection</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">100K+</p>
              <p className="text-sm text-muted-foreground">Users Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Protection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze messages, detect deepfakes, scan URLs, and get
              real-time threat intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Message Analysis",
                description:
                  "Analyze SMS, WhatsApp, Email, and social media messages for scam patterns",
              },
              {
                title: "Deepfake Detection",
                description:
                  "Detect AI-generated images, videos, and voice clones with advanced analysis",
              },
              {
                title: "URL Scanner",
                description:
                  "Check if websites are safe before clicking with real-time threat intelligence",
              },
              {
                title: "Voice Clone Detection",
                description:
                  "Identify synthetic voices and audio manipulation",
              },
              {
                title: "Image Authenticity",
                description:
                  "Verify if images have been manipulated or are deepfakes",
              },
              {
                title: "Threat Alerts",
                description:
                  "Get instant alerts about known scams and threats",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border bg-background hover:border-foreground/20 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-violet-600 to-cyan-500 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to protect yourself?
          </h2>
          <p className="text-lg opacity-90 mb-10">
            Start using S.N.O.S. AI today and stay safe online
          </p>
          <Link href="/chat">
            <Button size="lg" variant="secondary" className="rounded-full text-lg px-8 h-14">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold">S.N.O.S. AI</span>
              <span className="text-muted-foreground text-sm ml-2">
                Say No to Online Scam
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2025 S.N.O.S. AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HomeWithCallback() {
  // Note: Callback handling is now done in useAuth hook
  // This keeps the logic centralized
  return <HomeContent />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <HomeWithCallback />
    </Suspense>
  );
}
