"use client";

import { useQuery } from "convex/react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import type { FunctionReference } from "convex/server";

/**
 * Hook to use Convex queries in client components
 */
export function useConvexQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: Parameters<Query["_args"]> extends [infer Args]
    ? Args extends Record<string, never>
      ? []
      : [Args]
    : []
) {
  return useQuery(query, ...(args as any));
}

/**
 * Hook to use preloaded Convex queries
 */
export function usePreloadedConvexQuery<Query extends FunctionReference<"query">>(
  preloadedQuery: Preloaded<Query>
) {
  return usePreloadedQuery(preloadedQuery);
}

