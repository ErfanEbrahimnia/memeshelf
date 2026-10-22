import { v } from "convex/values";

import { internalMutation, internalQuery } from "./_generated/server";

const thumbnailContextValidator = v.object({
  storageId: v.id("_storage"),
});

export const getThumbnailContext = internalQuery({
  args: { mediaId: v.id("media") },
  returns: v.union(thumbnailContextValidator, v.null()),
  handler: async (ctx, args) => {
    const media = await ctx.db.get("media", args.mediaId);

    if (!media) {
      return null;
    }

    return {
      storageId: media.storageId,
    };
  },
});

export const applyThumbnail = internalMutation({
  args: {
    mediaId: v.id("media"),
    thumbnailStorageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const media = await ctx.db.get("media", args.mediaId);

    if (!media) {
      await ctx.storage.delete(args.thumbnailStorageId);
      return null;
    }

    const previousThumbnailId = media.thumbnailStorageId;

    await ctx.db.patch("media", args.mediaId, {
      thumbnailStorageId: args.thumbnailStorageId,
      updatedAt: Date.now(),
    });

    if (
      previousThumbnailId &&
      previousThumbnailId !== args.thumbnailStorageId
    ) {
      await ctx.storage.delete(previousThumbnailId);
    }

    return null;
  },
});
