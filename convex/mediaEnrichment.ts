import { v } from "convex/values";

import { internalMutation, internalQuery } from "./_generated/server";
import { processingStatusValidator } from "./lib/mediaValidators";
import { normalizeSearchText, normalizeTags } from "./lib/mediaSearchText";

const enrichmentContextValidator = v.object({
  originalName: v.string(),
  contentType: v.string(),
  processingStatus: processingStatusValidator,
  imageUrl: v.union(v.string(), v.null()),
});

export const getEnrichmentContext = internalQuery({
  args: { mediaId: v.id("media") },
  returns: v.union(enrichmentContextValidator, v.null()),
  handler: async (ctx, args) => {
    const media = await ctx.db.get("media", args.mediaId);

    if (!media) {
      return null;
    }

    const imageUrl = await ctx.storage.getUrl(media.storageId);

    return {
      originalName: media.originalName,
      contentType: media.contentType,
      processingStatus: media.processingStatus,
      imageUrl,
    };
  },
});

export const beginProcessing = internalMutation({
  args: { mediaId: v.id("media") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const media = await ctx.db.get("media", args.mediaId);

    if (!media) {
      return false;
    }

    if (
      media.processingStatus === "ready" ||
      media.processingStatus === "failed"
    ) {
      return false;
    }

    if (media.processingStatus === "processing") {
      return true;
    }

    await ctx.db.patch("media", args.mediaId, {
      processingStatus: "processing",
      updatedAt: Date.now(),
    });

    return true;
  },
});

export const applyEnrichment = internalMutation({
  args: {
    mediaId: v.id("media"),
    caption: v.string(),
    tags: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const media = await ctx.db.get("media", args.mediaId);

    if (!media) {
      return null;
    }

    const caption = args.caption.trim();
    const tags = normalizeTags(args.tags);
    const searchText = normalizeSearchText(media.originalName, caption);

    const existingTags = ctx.db
      .query("mediaTags")
      .withIndex("by_media", (q) => q.eq("mediaId", args.mediaId));

    for await (const row of existingTags) {
      await ctx.db.delete("mediaTags", row._id);
    }

    for (const tag of tags) {
      await ctx.db.insert("mediaTags", {
        ownerId: media.ownerId,
        mediaId: args.mediaId,
        tag,
      });
    }

    await ctx.db.patch("media", args.mediaId, {
      caption: caption.length > 0 ? caption : undefined,
      searchText,
      processingStatus: "ready",
      processingError: undefined,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const markEnrichmentFailed = internalMutation({
  args: {
    mediaId: v.id("media"),
    errorMessage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const media = await ctx.db.get("media", args.mediaId);

    if (!media || media.processingStatus === "ready") {
      return null;
    }

    await ctx.db.patch("media", args.mediaId, {
      processingStatus: "failed",
      processingError: args.errorMessage.slice(0, 500),
      updatedAt: Date.now(),
    });

    return null;
  },
});
