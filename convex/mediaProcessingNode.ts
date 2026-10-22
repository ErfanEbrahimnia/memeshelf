"use node";

import { createGateway, generateText, jsonSchema, Output } from "ai";
import sharp from "sharp";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { env, internalAction } from "./_generated/server";

const THUMBNAIL_MAX_WIDTH = 480;
const WEBP_QUALITY = 80;
const DEFAULT_MODEL = "google/gemini-3.5-flash-lite";

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
    const gateway = createGateway({
      apiKey: env.AI_GATEWAY_API_KEY,
    });
    const { output } = await generateText({
      model: gateway(DEFAULT_MODEL),
      providerOptions: {
        gateway: {
          has: ["vision", "structured-output"],
        },
      },
      instructions:
        "You label meme images for a personal library. Be concise and literal. " +
        "Title: short display name (roughly 3–8 words), no quotes, suitable for a page heading. " +
        "Caption: one sentence, no quotes. Tags: 3–10 short lowercase phrases.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Original filename: ${context.originalName}`,
            },
            {
              type: "file",
              mediaType: context.imageContentType,
              data: context.imageUrl,
            },
          ],
        },
      ],
      output: Output.object({
        schema: memeMetadataSchema,
        name: "meme_metadata",
        description: "Title, caption, and tags for a meme image",
      }),
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

const memeMetadataSchema = jsonSchema<{
  title: string;
  caption: string;
  tags: string[];
}>({
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "Short human-readable name for the meme, used as a page title.",
    },
    caption: {
      type: "string",
      description:
        "Short plain-language description of the meme image for search.",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description:
        "Lowercase topical tags (meme format, subjects, mood). No hashtags.",
    },
  },
  required: ["title", "caption", "tags"],
  additionalProperties: false,
});
