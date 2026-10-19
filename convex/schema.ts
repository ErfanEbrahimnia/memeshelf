import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const mediaSource = v.union(
  v.object({ kind: v.literal("upload") }),
  v.object({ kind: v.literal("url"), url: v.string() }),
);

const processingStatus = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("ready"),
  v.literal("failed"),
);

export default defineSchema({
  ...authTables,

  media: defineTable({
    ownerId: v.id("users"),
    storageId: v.id("_storage"),
    originalName: v.string(),
    contentType: v.string(),
    size: v.number(),
    sha256: v.string(),
    width: v.number(),
    height: v.number(),
    source: mediaSource,
    processingStatus,
    caption: v.optional(v.string()),
    searchText: v.string(),
    processingError: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_and_status", ["ownerId", "processingStatus"])
    .index("by_owner_and_sha256", ["ownerId", "sha256"])
    .searchIndex("search_text", {
      searchField: "searchText",
      filterFields: ["ownerId", "processingStatus"],
    }),

  mediaTags: defineTable({
    ownerId: v.id("users"),
    mediaId: v.id("media"),
    tag: v.string(),
  })
    .index("by_media", ["mediaId"])
    .index("by_owner_and_tag", ["ownerId", "tag"]),
});
