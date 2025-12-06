"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

/**
 * Hook to get the current authenticated user
 * Uses Convex Auth for authentication state
 */
export function useAuth() {
  const user = useQuery(api.authQueries.getCurrentUser);
  const isAdmin = useQuery(api.authQueries.isAdmin);
  const { signOut } = useAuthActions();

  return {
    user,
    isAdmin: isAdmin ?? false,
    isLoading: user === undefined,
    isAuthenticated: user !== null,
    signOut,
  };
}

