"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

/**
 * Hook to get the current authenticated user
 * Uses Convex Auth for authentication state
 * 
 * This hook includes special handling for magic link/OTP callbacks:
 * - Detects callback parameters in the URL
 * - Polls the auth state to check if it has updated
 * - Forces a page reload if auth state doesn't update within 5 seconds
 */
export function useAuth() {
  const user = useQuery(api.authQueries.getCurrentUser);
  const isAdmin = useQuery(api.authQueries.isAdmin);
  const { signOut } = useAuthActions();
  const callbackProcessedRef = useRef(false);
  const pollCountRef = useRef(0);

  // Debug logging
  useEffect(() => {
    console.log("[useAuth] User state changed:", {
      user: user ? { email: user.email, name: user.name } : null,
      isLoading: user === undefined,
      isAuthenticated: user !== null,
    });
  }, [user]);

  // Handle auth callbacks with polling
  useEffect(() => {
    if (typeof window === "undefined" || callbackProcessedRef.current) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const hasCallback = 
      urlParams.has("code") || 
      urlParams.has("token") || 
      urlParams.has("callbackUrl") ||
      urlParams.has("state") ||
      window.location.search.includes("callback");

    if (hasCallback) {
      callbackProcessedRef.current = true;
      console.log("[useAuth] Callback detected:", window.location.search);
      console.log("[useAuth] Current user state:", user);
      console.log("[useAuth] Starting auth state polling...");

      // Poll for auth state update (check every 500ms, max 10 times = 5 seconds)
      const pollInterval = setInterval(() => {
        pollCountRef.current += 1;
        console.log(`[useAuth] Poll ${pollCountRef.current}/10, user:`, user);
        
        // Check if user is now authenticated
        if (user !== null && user !== undefined) {
          console.log("[useAuth] ✅ Auth state updated successfully! User:", user.email);
          clearInterval(pollInterval);
          // Remove callback params
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
          return;
        }

        // If we've polled 10 times (5 seconds) and still no auth, reload
        if (pollCountRef.current >= 10) {
          console.log("[useAuth] ⚠️ Auth state not updated after 5s, reloading page...");
          clearInterval(pollInterval);
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
          window.location.reload();
        }
      }, 500);

      return () => clearInterval(pollInterval);
    }
  }, [user]);

  return {
    user,
    isAdmin: isAdmin ?? false,
    isLoading: user === undefined,
    isAuthenticated: user !== null,
    signOut,
  };
}

