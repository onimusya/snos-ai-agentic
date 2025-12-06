import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current authenticated user
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      language: user.language,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    return user?.role === "admin" || false;
  },
});

