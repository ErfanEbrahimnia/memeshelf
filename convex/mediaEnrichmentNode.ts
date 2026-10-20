"use node";

import { createGateway, generateText, jsonSchema, Output } from "ai";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { env, internalAction } from "./_generated/server";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

export const enrich = internalAction({
  args: { mediaId: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(
      internal.mediaEnrichment.getEnrichmentContext,
      {
        mediaId: args.mediaId,
      }
    );

    if (!context) {
      return null;
    }

    if (context.processingStatus === "ready") {
      return null;
    }

    const shouldProceed = await ctx.runMutation(
      internal.mediaEnrichment.beginProcessing,
      { mediaId: args.mediaId }
    );

    if (!shouldProceed) {
      return null;
    }

    if (!context.imageUrl) {
      await ctx.runMutation(internal.mediaEnrichment.markEnrichmentFailed, {
        mediaId: args.mediaId,
        errorMessage: "Image URL unavailable",
      });

      return null;
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
                mediaType: context.contentType,
                data: context.imageUrl,
              },
            ],
          },
        ],
        output: Output.object({
          schema: memeMetadataSchema,
          name: "meme_metadata",
          description: "Caption and tags for a meme image",
        }),
      });

      await ctx.runMutation(internal.mediaEnrichment.applyEnrichment, {
        mediaId: args.mediaId,
        caption: output.caption,
        tags: output.tags,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Metadata enrichment failed";

      await ctx.runMutation(internal.mediaEnrichment.markEnrichmentFailed, {
        mediaId: args.mediaId,
        errorMessage: message,
      });
    }

    return null;
  },
});

const memeMetadataSchema = jsonSchema<{
  caption: string;
  tags: string[];
}>({
  type: "object",
  properties: {
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
  required: ["caption", "tags"],
  additionalProperties: false,
});
