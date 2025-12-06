import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Generate an upload URL for file uploads
 * This allows clients to upload files directly to Convex Storage
 */
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Generate upload URL
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
});

/**
 * Get file URL from storage ID
 */
export const getFileUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Get signed URL for the file
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

/**
 * Get file metadata from storage ID
 */
export const getFileMetadata = query({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(
    v.object({
      _id: v.id("_storage"),
      _creationTime: v.number(),
      contentType: v.optional(v.string()),
      sha256: v.string(),
      size: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Get file metadata from system table
    const metadata = await ctx.db.system.get(args.storageId);
    return metadata;
  },
});

/**
 * Get file metadata from storage ID (internal)
 */
export const getFileMetadataInternal = internalQuery({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(
    v.object({
      _id: v.id("_storage"),
      _creationTime: v.number(),
      contentType: v.optional(v.string()),
      sha256: v.string(),
      size: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // Get file metadata from system table
    const metadata = await ctx.db.system.get(args.storageId);
    return metadata;
  },
});

/**
 * Get file URL from storage ID (internal)
 */
export const getFileUrlInternal = internalQuery({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    // Get signed URL for the file
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});
