"use node";

import sharp from "sharp";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const THUMBNAIL_MAX_WIDTH = 480;
const WEBP_QUALITY = 80;

export const generate = internalAction({
  args: { mediaId: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.mediaThumbnail.getThumbnailContext, {
      mediaId: args.mediaId,
    });

    if (!context) {
      return null;
    }

    const blob = await ctx.storage.get(context.storageId);

    if (!blob) {
      return null;
    }

    const input = Buffer.from(await blob.arrayBuffer());
    const thumbnailBytes = await sharp(input, { animated: false })
      .rotate()
      .resize({
        width: THUMBNAIL_MAX_WIDTH,
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const thumbnailBlob = new Blob([thumbnailBytes], { type: "image/webp" });
    const thumbnailStorageId = await ctx.storage.store(thumbnailBlob);

    await ctx.runMutation(internal.mediaThumbnail.applyThumbnail, {
      mediaId: args.mediaId,
      thumbnailStorageId,
    });

    return null;
  },
});
