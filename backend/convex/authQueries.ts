import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the current authenticated user
 * This uses Convex Auth to get the authenticated user
 */
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      email: v.string(),
      name: v.optional(v.string()),
      role: v.union(v.literal("user"), v.literal("admin")),
      subscriptionPlan: v.union(
        v.literal("free"),
        v.literal("pro"),
        v.literal("enterprise")
      ),
      subscriptionStatus: v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("cancelled")
      ),
      language: v.union(v.literal("en"), v.literal("ms"), v.literal("zh")),
      avatarUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email || "",
      name: user.name,
      role: (user.role as "user" | "admin") || "user",
      subscriptionPlan: (user.subscriptionPlan as "free" | "pro" | "enterprise") || "free",
      subscriptionStatus: (user.subscriptionStatus as "active" | "inactive" | "cancelled") || "active",
      language: (user.language as "en" | "ms" | "zh") || "en",
      avatarUrl: user.avatarUrl,
    };
  },
});

/**
 * Check if current user is admin
 */
export const isAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const user = await ctx.db.get(userId);
    return (user?.role as string) === "admin" || false;
  },
});

