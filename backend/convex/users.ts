import { mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create a new user (internal - called by auth actions)
 */
export const createUser = internalMutation({
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

    // Note: With Convex Auth, users are created automatically via the auth system
    // This function is deprecated - users should be created through Convex Auth signIn
    // For now, we'll try to find existing user by email from authAccounts
    const accounts = await ctx.db
      .query("authAccounts")
      .collect();
    
    // Find account with matching providerAccountId (email for email providers)
    const account = accounts.find((acc) => acc.providerAccountId === args.email);
    
    if (account) {
      return account.userId;
    }

    // If no account exists, this function shouldn't create users
    // Users should be created via Convex Auth
    throw new Error("User not found. Please sign up through the authentication system.");
  },
});

/**
 * Create a new user with password hash (internal - called by auth signUp)
 * NOTE: This is no longer needed with Convex Auth - password handling is done by the Password provider
 * Keeping for backward compatibility but it should not be called
 */
export const createUserWithPassword = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // With Convex Auth, users are created via the auth system
    // This function should not be used - password is handled by Convex Auth
    throw new Error("createUserWithPassword is deprecated - use Convex Auth signIn instead");
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
    // Get user ID from Convex Auth
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db.get(userId);

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

    const userRole = ((user as any).role as "user" | "admin" | undefined) || "user";
    const userSubscriptionPlan = ((user as any).subscriptionPlan as "free" | "pro" | "enterprise" | undefined) || "free";
    const userSubscriptionStatus = ((user as any).subscriptionStatus as "active" | "inactive" | "cancelled" | undefined) || "active";
    const userUsageCount = ((user as any).usageCount as number | undefined) || 0;
    const userLanguage = ((user as any).language as "en" | "ms" | "zh" | undefined) || "en";

    return {
      _id: user._id,
      email: user.email || "",
      name: user.name,
      role: userRole,
      subscriptionPlan: userSubscriptionPlan,
      subscriptionStatus: userSubscriptionStatus,
      usageCount: userUsageCount,
      language: userLanguage,
      avatarUrl: user.avatarUrl,
    };
  },
});

/**
 * Get user by email (internal)
 */
export const getByEmail = internalQuery({
  args: {
    email: v.string(),
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
    // Find user by email via authAccounts
    // Query all accounts and find matching providerAccountId
    const accounts = await ctx.db
      .query("authAccounts")
      .collect();
    
    const account = accounts.find((acc) => acc.providerAccountId === args.email);

    if (!account) {
      return null;
    }

    const user = await ctx.db.get(account.userId);
    if (!user) {
      return null;
    }

    const userRole = ((user as any).role as "user" | "admin" | undefined) || "user";
    const userSubscriptionPlan = ((user as any).subscriptionPlan as "free" | "pro" | "enterprise" | undefined) || "free";
    const userSubscriptionStatus = ((user as any).subscriptionStatus as "active" | "inactive" | "cancelled" | undefined) || "active";
    const userUsageCount = ((user as any).usageCount as number | undefined) || 0;
    const userLanguage = ((user as any).language as "en" | "ms" | "zh" | undefined) || "en";

    return {
      _id: user._id,
      email: user.email || args.email,
      name: user.name,
      role: userRole,
      subscriptionPlan: userSubscriptionPlan,
      subscriptionStatus: userSubscriptionStatus,
      usageCount: userUsageCount,
      language: userLanguage,
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
    // Get user ID from Convex Auth
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(userId);
    if (!admin || (admin.role as string) !== "admin") {
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

