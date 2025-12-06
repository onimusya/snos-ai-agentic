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
    
    console.log("[authQueries.getCurrentUser] getAuthUserId returned:", userId);
    
    if (!userId) {
      console.log("[authQueries.getCurrentUser] No userId, returning null");
      return null;
    }

    const user = await ctx.db.get(userId);
    console.log("[authQueries.getCurrentUser] User from DB:", user ? { _id: user._id, name: user.name, email: user.email } : null);
    
    if (!user) {
      console.log("[authQueries.getCurrentUser] User not found in DB, returning null");
      return null;
    }

    // Try to get email from user table first (Convex Auth stores it there)
    let email = user.email;
    
    // If email is not in user table, try to get it from authAccounts
    if (!email) {
      console.log("[authQueries.getCurrentUser] Email not in user table, checking authAccounts...");
      const authAccount = await ctx.db
        .query("authAccounts")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      console.log("[authQueries.getCurrentUser] AuthAccount:", authAccount ? { providerAccountId: authAccount.providerAccountId, providerId: authAccount.providerId } : null);

      // For email providers, providerAccountId is the email
      if (authAccount && authAccount.providerAccountId) {
        email = authAccount.providerAccountId;
        console.log("[authQueries.getCurrentUser] Found email in authAccount.providerAccountId:", email);
      }
    }

    if (!email) {
      console.log("[authQueries.getCurrentUser] No email found, returning null");
      return null;
    }

    const result = {
      _id: user._id,
      email: email, // Use email from user table or authAccount
      name: user.name,
      role: (user.role as "user" | "admin") || "user",
      subscriptionPlan: (user.subscriptionPlan as "free" | "pro" | "enterprise") || "free",
      subscriptionStatus: (user.subscriptionStatus as "active" | "inactive" | "cancelled") || "active",
      language: (user.language as "en" | "ms" | "zh") || "en",
      avatarUrl: user.avatarUrl,
    };
    
    console.log("[authQueries.getCurrentUser] Returning user:", { email: result.email, name: result.name });
    return result;
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

