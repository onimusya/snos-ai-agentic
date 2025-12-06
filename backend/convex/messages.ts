import { query, mutation, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) =>
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify conversation belongs to user
    const conversation = await ctx.runQuery(internal.conversations.getInternal, {
      conversationId: args.conversationId,
    });
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }

    // Create user message
    const messageId = await ctx.runMutation(internal.messages.create, {
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
      attachments: args.attachments,
    });

    // Update conversation title if it's still "New Conversation"
    // Generate title from first user message (truncate to 50 chars)
    if (conversation.title === "New Conversation" || conversation.title === "") {
      const title = args.content.trim();
      // Truncate to 50 characters, or use a default if empty
      const truncatedTitle = title.length > 50 
        ? title.substring(0, 50).trim() + "..."
        : title || "New Conversation";
      
      await ctx.runMutation(internal.conversations.updateTitleInternal, {
        conversationId: args.conversationId,
        title: truncatedTitle,
      });
    }

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
 * Get a message by ID (internal)
 */
export const getInternal = internalQuery({
  args: {
    messageId: v.id("messages"),
  },
  returns: v.union(
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
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    return message;
  },
});

/**
 * Create a message (internal)
 */
export const create = internalMutation({
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
 * List messages for agent context (internal)
 */
export const listForAgent = internalQuery({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const messages = await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(limit);

    // Reverse to get chronological order
    return messages.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  },
});

/**
 * Update message with risk assessment (internal)
 */
export const updateRisk = internalMutation({
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

