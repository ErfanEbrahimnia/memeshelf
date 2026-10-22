"use node";

import sharp from "sharp";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { internalAction } from "./_generated/server";
import { generateMemeMetadata } from "./lib/memeEnrichmentAi";

const THUMBNAIL_MAX_WIDTH = 480;
const WEBP_QUALITY = 80;

export const process = internalAction({
  args: { mediaId: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await generateThumbnail(ctx, args.mediaId);
    await enrichMedia(ctx, args.mediaId);
    return null;
  },
});

async function generateThumbnail(
  ctx: ActionCtx,
  mediaId: Id<"media">
): Promise<void> {
  const context = await ctx.runQuery(internal.mediaThumbnail.getThumbnailContext, {
    mediaId,
  });

  if (!context) {
    return;
  }

  const blob = await ctx.storage.get(context.storageId);

  if (!blob) {
    return;
  }

  try {
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
      mediaId,
      thumbnailStorageId,
    });
  } catch {
    // Enrichment falls back to the original image.
  }
}

async function enrichMedia(ctx: ActionCtx, mediaId: Id<"media">): Promise<void> {
  const context = await ctx.runQuery(
    internal.mediaEnrichment.getEnrichmentContext,
    { mediaId }
  );

  if (!context) {
    return;
  }

  if (context.processingStatus === "ready") {
    return;
  }

  const shouldProceed = await ctx.runMutation(
    internal.mediaEnrichment.beginProcessing,
    { mediaId }
  );

  if (!shouldProceed) {
    return;
  }

  if (!context.imageUrl) {
    await ctx.runMutation(internal.mediaEnrichment.markEnrichmentFailed, {
      mediaId,
      errorMessage: "Image URL unavailable",
    });
    return;
  }

  try {
    const output = await generateMemeMetadata({
      originalName: context.originalName,
      imageContentType: context.imageContentType,
      imageUrl: context.imageUrl,
    });

    await ctx.runMutation(internal.mediaEnrichment.applyEnrichment, {
      mediaId,
      caption: output.caption,
      title: output.title,
      tags: output.tags,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Metadata enrichment failed";

    await ctx.runMutation(internal.mediaEnrichment.markEnrichmentFailed, {
      mediaId,
      errorMessage: message,
    });
  }
}

