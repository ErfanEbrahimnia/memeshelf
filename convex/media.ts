import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAuthUser } from "./lib/auth";
import {
  mediaSourceValidator,
  processingStatusValidator,
} from "./lib/mediaValidators";
import { normalizeSearchText } from "./lib/mediaSearchText";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const shelfItemValidator = v.object({
  _id: v.id("media"),
  url: v.union(v.string(), v.null()),
  width: v.number(),
  height: v.number(),
  originalName: v.string(),
  processingStatus: processingStatusValidator,
});

async function toShelfItem(
  ctx: { storage: { getUrl: (id: Id<"_storage">) => Promise<string | null> } },
  doc: Doc<"media">
) {
  const url = await ctx.storage.getUrl(doc.storageId);
  return {
    _id: doc._id,
    url,
    width: doc.width,
    height: doc.height,
    originalName: doc.originalName,
    processingStatus: doc.processingStatus,
  };
}

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireAuthUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const finalizeUpload = mutation({
  args: {
    storageId: v.id("_storage"),
    originalName: v.string(),
    width: v.number(),
    height: v.number(),
    source: mediaSourceValidator,
  },
  returns: v.id("media"),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);
    const metadata = await ctx.db.system.get("_storage", args.storageId);

    if (!metadata) {
      throw new Error("Upload not found");
    }

    const contentType = metadata.contentType ?? "application/octet-stream";

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Only image uploads are supported");
    }

    if (metadata.size > MAX_BYTES) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Image must be 8MB or smaller");
    }

    if (args.width <= 0 || args.height <= 0) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Invalid image dimensions");
    }

    const existing = await ctx.db
      .query("media")
      .withIndex("by_owner_and_sha256", (q) =>
        q.eq("ownerId", user._id).eq("sha256", metadata.sha256)
      )
      .unique();

    if (existing) {
      await ctx.storage.delete(args.storageId);
      return existing._id;
    }

    const now = Date.now();
    const searchText = normalizeSearchText(args.originalName);

    const mediaId = await ctx.db.insert("media", {
      ownerId: user._id,
      storageId: args.storageId,
      originalName: args.originalName,
      contentType,
      size: metadata.size,
      sha256: metadata.sha256,
      width: args.width,
      height: args.height,
      source: args.source,
      processingStatus: "pending",
      searchText,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.mediaEnrichmentNode.enrich, {
      mediaId,
    });

    return mediaId;
  },
});

export const listShelf = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  returns: paginationResultValidator(shelfItemValidator),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);
    const search = args.search?.trim();

    if (search) {
      const result = await ctx.db
        .query("media")
        .withSearchIndex("search_text", (q) =>
          q
            .search("searchText", search)
            .eq("ownerId", user._id)
            .eq("processingStatus", "ready")
        )
        .paginate(args.paginationOpts);

      return {
        ...result,
        page: await Promise.all(
          result.page.map((doc) => toShelfItem(ctx, doc))
        ),
      };
    }

    const result = await ctx.db
      .query("media")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .filter((q) =>
        q.or(
          q.eq(q.field("processingStatus"), "ready"),
          q.eq(q.field("processingStatus"), "pending"),
          q.eq(q.field("processingStatus"), "processing"),
          q.eq(q.field("processingStatus"), "failed")
        )
      )
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: await Promise.all(result.page.map((doc) => toShelfItem(ctx, doc))),
    };
  },
});

export const remove = mutation({
  args: { mediaId: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);
    const media = await ctx.db.get("media", args.mediaId);

    if (!media || media.ownerId !== user._id) {
      throw new Error("Media not found");
    }

    const mediaTags = ctx.db
      .query("mediaTags")
      .withIndex("by_media", (q) => q.eq("mediaId", args.mediaId));

    for await (const tag of mediaTags) {
      await ctx.db.delete("mediaTags", tag._id);
    }

    await ctx.storage.delete(media.storageId);
    await ctx.db.delete("media", args.mediaId);

    return null;
  },
});
