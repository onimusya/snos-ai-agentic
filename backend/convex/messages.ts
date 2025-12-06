import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * List messages in a conversation
 */
export const list = query({
  args: {
    conversationId: v.id("conversations"),
  },
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
      conversationId: v.id("conversations"),
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      attachments: v.optional(v.array(v.id("_storage"))),
      riskLevel: v.optional(
        v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
      ),
      riskScore: v.optional(v.number()),
      toolCalls: v.optional(
        v.array(
          v.object({
            tool: v.string(),
            input: v.any(),
            output: v.any(),
          })
        )
      ),
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

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== user._id) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("conversationId_creationTime", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

/**
 * Send a message and trigger AI agent
 */
export const send = action({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    attachments: v.optional(v.array(v.id("_storage"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.auth.getCurrentUser);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify conversation belongs to user
    const conversation = await ctx.runQuery(internal.conversations.get, {
      conversationId: args.conversationId,
    });
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Create user message
    const messageId = await ctx.runMutation(internal.messages.create, {
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
      attachments: args.attachments,
    });

    // Update conversation
    await ctx.runMutation(internal.conversations.updateMessageCount, {
      conversationId: args.conversationId,
    });

    // Trigger AI agent investigation
    await ctx.runAction(internal.agent.investigate, {
      conversationId: args.conversationId,
      messageId,
    });

    return null;
  },
});

/**
 * Create a message (internal)
 */
export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    attachments: v.optional(v.array(v.id("_storage"))),
    riskLevel: v.optional(
      v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
    ),
    riskScore: v.optional(v.number()),
    toolCalls: v.optional(
      v.array(
        v.object({
          tool: v.string(),
          input: v.any(),
          output: v.any(),
        })
      )
    ),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      attachments: args.attachments,
      riskLevel: args.riskLevel,
      riskScore: args.riskScore,
      toolCalls: args.toolCalls,
    });

    return messageId;
  },
});

/**
 * Update message with risk assessment (internal)
 */
export const updateRisk = mutation({
  args: {
    messageId: v.id("messages"),
    riskLevel: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    riskScore: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      riskLevel: args.riskLevel,
      riskScore: args.riskScore,
    });

    return null;
  },
});

