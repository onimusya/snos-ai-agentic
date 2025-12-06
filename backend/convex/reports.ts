import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

    const reportId = await ctx.db.insert("reports", {
      userId: user._id,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      return [];
    }

    let query = ctx.db.query("reports");

    // If admin, show all reports; otherwise, show only user's reports
    if (user.role !== "admin") {
      query = query.withIndex("userId", (q) => q.eq("userId", user._id));
    } else if (args.status) {
      query = query.withIndex("status", (q) => q.eq("status", args.status));
    }

    const reports = await query.collect();

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

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
      reviewedBy: admin._id,
      reviewedAt: Date.now(),
    });

    // If verified, add to threats database
    if (args.status === "verified" && args.riskLevel && report.type !== "content") {
      await ctx.db.insert("threats", {
        type: report.type as "phone" | "url" | "email",
        value: report.value,
        verified: true,
        verifiedBy: admin._id,
        verifiedAt: Date.now(),
        reportId: args.reportId,
        riskLevel: args.riskLevel,
      });
    }

    return null;
  },
});

