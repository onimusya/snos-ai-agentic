"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook to get the current authenticated user
 */
export function useAuth() {
  const user = useQuery(api.auth.getCurrentUser);
  const isAdmin = useQuery(api.auth.isAdmin);

  return {
    user,
    isAdmin: isAdmin ?? false,
    isLoading: user === undefined,
    isAuthenticated: user !== null,
  };
}

