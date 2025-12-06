"use client";

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function ChatContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Wait a bit after mount to allow auth state to settle (for OTP/magic link callbacks)
  // Also poll for auth state updates
  useEffect(() => {
    let pollCount = 0;
    const maxPolls = 20; // Poll for up to 10 seconds (20 * 500ms)
    
    const pollInterval = setInterval(() => {
      pollCount++;
      console.log(`[Chat] Polling auth state ${pollCount}/${maxPolls}:`, {
        isLoading,
        isAuthenticated,
        user: user ? { email: user.email } : null,
      });
      
      // If we get authenticated, stop polling early
      if (isAuthenticated && user) {
        console.log("[Chat] ✅ User authenticated, stopping poll");
        clearInterval(pollInterval);
        setAuthCheckComplete(true);
        return;
      }
      
      // If we've polled enough times, mark as complete
      if (pollCount >= maxPolls) {
        console.log("[Chat] Max polls reached, marking auth check as complete");
        clearInterval(pollInterval);
        setAuthCheckComplete(true);
      }
    }, 500);
    
    // Set auth check complete after max time (fallback)
    const timer = setTimeout(() => {
      clearInterval(pollInterval);
      setAuthCheckComplete(true);
    }, 10000); // 10 seconds max wait
    
    return () => {
      clearTimeout(timer);
      clearInterval(pollInterval);
    };
  }, [isLoading, isAuthenticated, user]);

  // Only redirect if auth check is complete and user is definitely not authenticated
  useEffect(() => {
    console.log("[Chat] Auth state check:", {
      authCheckComplete,
      isLoading,
      isAuthenticated,
      user: user ? { email: user.email, name: user.name } : null,
    });

    if (authCheckComplete && !isLoading && !isAuthenticated) {
      console.log("[Chat] ⚠️ Not authenticated after grace period, redirecting to login");
      router.push("/auth/login?redirect=/chat");
    }
  }, [authCheckComplete, isLoading, isAuthenticated, router, user]);

  // Show loading while checking auth or waiting for auth state to settle
  if (isLoading || !authCheckComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Chat with S.N.O.S. AI</h1>
        <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Chat interface coming soon...</p>
          <p className="text-sm mt-2">Welcome, {user?.name || user?.email}!</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

