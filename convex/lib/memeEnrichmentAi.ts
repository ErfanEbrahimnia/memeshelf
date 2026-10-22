"use node";

import { createGateway, generateText, jsonSchema, Output } from "ai";

import { env } from "../_generated/server";

const DEFAULT_MODEL = "google/gemini-3.5-flash-lite";

export type MemeMetadata = {
  title: string;
  caption: string;
  tags: string[];
};

const memeMetadataSchema = jsonSchema<MemeMetadata>({
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

export function isMemeAiMockEnabled(): boolean {
  const value = env.MEME_AI_MOCK?.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

export function mockMemeMetadata(originalName: string): MemeMetadata {
  const baseName = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  const title = baseName.length > 0 ? baseName.slice(0, 200) : "Untitled meme";
  const words = baseName
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1);

  const tags = ["mock", "local", ...words].slice(0, 10);

  return {
    title,
    caption: `Local mock caption for "${title}".`,
    tags,
  };
}

export async function generateMemeMetadata(args: {
  originalName: string;
  imageContentType: string;
  imageUrl: string;
}): Promise<MemeMetadata> {
  if (isMemeAiMockEnabled()) {
    return mockMemeMetadata(args.originalName);
  }

  const apiKey = env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    throw new Error(
      "AI_GATEWAY_API_KEY is not set. Set MEME_AI_MOCK=true for local mock enrichment."
    );
  }

  const gateway = createGateway({ apiKey });
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
            text: `Original filename: ${args.originalName}`,
          },
          {
            type: "file",
            mediaType: args.imageContentType,
            data: args.imageUrl,
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

  return output;
}
