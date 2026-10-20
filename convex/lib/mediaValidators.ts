import { v } from "convex/values";

export const mediaSourceValidator = v.union(
  v.object({ kind: v.literal("upload") }),
  v.object({ kind: v.literal("url"), url: v.string() }),
);

export const processingStatusValidator = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("ready"),
  v.literal("failed"),
);
