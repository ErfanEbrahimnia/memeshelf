import { getAuthUserId } from "@convex-dev/auth/server";

import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

export async function getAuthUser(ctx: AuthCtx): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    return null;
  }

  return ctx.db.get("users", userId);
}

export async function requireAuthUser(ctx: AuthCtx): Promise<Doc<"users">> {
  const user = await getAuthUser(ctx);
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
}
