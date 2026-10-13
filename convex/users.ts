import { v } from "convex/values";

import { query } from "./_generated/server";
import { getAuthUser } from "./lib/auth";

const currentAuthUserReturn = v.object({
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  image: v.optional(v.string()),
});

export const currentAuthUser = query({
  args: {},
  returns: v.union(currentAuthUserReturn, v.null()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      image: user.image,
    };
  },
});
