import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create a community report
 */
export const create = mutation({
  args: {
    type: v.union(
      v.literal("phone"),
      v.literal("url"),
      v.literal("email"),
      v.literal("content")
    ),
    value: v.string(),
    description: v.string(),
    evidence: v.optional(v.array(v.id("_storage"))),
  },
  returns: v.id("reports"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const reportId = await ctx.db.insert("reports", {
      userId,
      type: args.type,
      value: args.value,
      description: args.description,
      evidence: args.evidence,
      status: "pending",
    });

    return reportId;
  },
});

/**
 * List reports (admin only, or user's own reports)
 */
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected"),
        v.literal("investigating")
      )
    ),
    type: v.optional(
      v.union(
        v.literal("phone"),
        v.literal("url"),
        v.literal("email"),
        v.literal("content")
      )
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("reports"),
      _creationTime: v.number(),
      userId: v.id("users"),
      type: v.union(
        v.literal("phone"),
        v.literal("url"),
        v.literal("email"),
        v.literal("content")
      ),
      value: v.string(),
      description: v.string(),
      evidence: v.optional(v.array(v.id("_storage"))),
      status: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected"),
        v.literal("investigating")
      ),
      reviewedBy: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }

    let reports;
    
    // Type guard to ensure we have a user document
    const userRole = (user as any).role as string | undefined;
    
    // If admin, show all reports; otherwise, show only user's reports
    if (userRole !== "admin") {
      reports = await ctx.db
        .query("reports")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .collect();
    } else if (args.status) {
      reports = await ctx.db
        .query("reports")
        .withIndex("status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      reports = await ctx.db
        .query("reports")
        .collect();
    }

    // Filter by type if provided
    if (args.type) {
      return reports.filter((report) => report.type === args.type);
    }

    return reports;
  },
});

/**
 * Review a report (admin only)
 */
export const review = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(
      v.literal("verified"),
      v.literal("rejected"),
      v.literal("investigating")
    ),
    riskLevel: v.optional(
      v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(userId);
    if (!admin) {
      throw new Error("User not found");
    }
    
    const adminRole = (admin as any).role as string | undefined;
    if (adminRole !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
      reviewedBy: userId,
      reviewedAt: Date.now(),
    });

    // If verified, add to threats database
    if (args.status === "verified" && args.riskLevel && report.type !== "content") {
      await ctx.db.insert("threats", {
        type: report.type as "phone" | "url" | "email",
        value: report.value,
        verified: true,
        verifiedBy: userId,
        verifiedAt: Date.now(),
        reportId: args.reportId,
        riskLevel: args.riskLevel,
      });
    }

    return null;
  },
});

