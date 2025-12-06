import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
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
    subscriptionStartDate: v.optional(v.number()),
    subscriptionEndDate: v.optional(v.number()),
    usageCount: v.number(),
    language: v.union(v.literal("en"), v.literal("ms"), v.literal("zh")),
    avatarUrl: v.optional(v.string()),
  })
    .index("email", ["email"]),

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    updatedAt: v.number(),
    messageCount: v.number(),
    riskLevel: v.optional(v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    )),
    riskScore: v.optional(v.number()),
  })
    .index("userId", ["userId"])
    .index("userId_updatedAt", ["userId", "updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    attachments: v.optional(v.array(v.id("_storage"))),
    riskLevel: v.optional(v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    )),
    riskScore: v.optional(v.number()),
    toolCalls: v.optional(v.array(v.object({
      tool: v.string(),
      input: v.any(),
      output: v.any(),
    }))),
  })
    .index("conversationId", ["conversationId"]),

  reports: defineTable({
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
    .index("userId", ["userId"])
    .index("status", ["status"])
    .index("type", ["type"]),

  threats: defineTable({
    type: v.union(
      v.literal("phone"),
      v.literal("url"),
      v.literal("email")
    ),
    value: v.string(),
    verified: v.boolean(),
    verifiedBy: v.id("users"),
    verifiedAt: v.number(),
    reportId: v.id("reports"),
    riskLevel: v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
  })
    .index("type", ["type"])
    .index("type_value", ["type", "value"])
    .index("verified", ["verified"]),

  news: defineTable({
    title: v.string(),
    content: v.string(),
    source: v.optional(v.string()),
    url: v.optional(v.string()),
    publishedAt: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
    createdBy: v.id("users"),
  })
    .index("status", ["status"])
    .index("status_publishedAt", ["status", "publishedAt"]),
});

