import { ConvexReactClient } from "convex/react";

// Get Convex URL from environment variable
// This will be set when you run `npx convex dev` in the backend folder
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

if (!convexUrl && typeof window !== "undefined") {
  console.warn(
    "NEXT_PUBLIC_CONVEX_URL is not set. Please configure it in your .env.local file."
  );
}

export const convex = new ConvexReactClient(convexUrl);

