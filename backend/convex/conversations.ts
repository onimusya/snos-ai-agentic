import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all conversations for the current user
 */
export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("conversations"),
      _creationTime: v.number(),
      userId: v.id("users"),
      title: v.string(),
      updatedAt: v.number(),
      messageCount: v.number(),
      riskLevel: v.optional(
        v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
      ),
      riskScore: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
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

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("userId_updatedAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return conversations;
  },
});

/**
 * Get a single conversation by ID
 */
export const get = query({
  args: {
    conversationId: v.id("conversations"),
  },
  returns: v.union(
    v.object({
      _id: v.id("conversations"),
      _creationTime: v.number(),
      userId: v.id("users"),
      title: v.string(),
      updatedAt: v.number(),
      messageCount: v.number(),
      riskLevel: v.optional(
        v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
      ),
      riskScore: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
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

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== user._id) {
      return null;
    }

    return conversation;
  },
});

/**
 * Create a new conversation
 */
export const create = mutation({
  args: {
    title: v.optional(v.string()),
  },
  returns: v.id("conversations"),
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

    const conversationId = await ctx.db.insert("conversations", {
      userId: user._id,
      title: args.title || "New Conversation",
      updatedAt: Date.now(),
      messageCount: 0,
    });

    return conversationId;
  },
});

/**
 * Update conversation title
 */
export const updateTitle = mutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
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

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== user._id) {
      throw new Error("Conversation not found or unauthorized");
    }

    await ctx.db.patch(args.conversationId, {
      title: args.title,
      updatedAt: Date.now(),
    });

    return null;
  },
});

/**
 * Update message count (internal)
 */
export const updateMessageCount = internalMutation({
  args: {
    conversationId: v.id("conversations"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return null;
    }

    const messageCount = await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect()
      .then((messages) => messages.length);

    await ctx.db.patch(args.conversationId, {
      messageCount,
      updatedAt: Date.now(),
    });

    return null;
  },
});

/**
 * Update conversation risk assessment (internal)
 */
export const updateRisk = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    riskLevel: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    riskScore: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      riskLevel: args.riskLevel,
      riskScore: args.riskScore,
      updatedAt: Date.now(),
    });

    return null;
  },
});

/**
 * Delete a conversation
 */
export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
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

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== user._id) {
      throw new Error("Conversation not found or unauthorized");
    }

    // Delete all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the conversation
    await ctx.db.delete(args.conversationId);

    return null;
  },
});
