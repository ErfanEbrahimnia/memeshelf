import { defineApp } from "convex/server";
import { v } from "convex/values";

const app = defineApp({
  env: {
    AI_GATEWAY_API_KEY: v.optional(v.string()),
    /** Set to "true" in .env.local to skip the AI gateway during local dev. */
    MEME_AI_MOCK: v.optional(v.string()),
  },
});

export default app;
