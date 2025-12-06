import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new user (called after authentication)
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new user with default values
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: "user",
      subscriptionPlan: "free",
      subscriptionStatus: "active",
      usageCount: 0,
      language: "en",
    });

    return userId;
  },
});

/**
 * Update user profile
 */
export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    language: v.optional(v.union(v.literal("en"), v.literal("ms"), v.literal("zh"))),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updates: {
      name?: string;
      language?: "en" | "ms" | "zh";
      avatarUrl?: string;
    } = {};

    if (args.name !== undefined) {
      updates.name = args.name;
    }
    if (args.language !== undefined) {
      updates.language = args.language;
    }
    if (args.avatarUrl !== undefined) {
      updates.avatarUrl = args.avatarUrl;
    }

    await ctx.db.patch(user._id, updates);
    return null;
  },
});

/**
 * Get user by ID
 */
export const getUser = query({
  args: {
    userId: v.id("users"),
  },
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
      usageCount: v.number(),
      language: v.union(v.literal("en"), v.literal("ms"), v.literal("zh")),
      avatarUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
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
      usageCount: user.usageCount,
      language: user.language,
      avatarUrl: user.avatarUrl,
    };
  },
});

/**
 * Update subscription plan (admin only)
 */
export const updateSubscription = mutation({
  args: {
    userId: v.id("users"),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("cancelled")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    await ctx.db.patch(args.userId, {
      subscriptionPlan: args.plan,
      subscriptionStatus: args.status,
      subscriptionStartDate: Date.now(),
    });

    return null;
  },
});

