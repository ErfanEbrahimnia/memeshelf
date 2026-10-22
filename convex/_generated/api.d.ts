/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_mediaSearchText from "../lib/mediaSearchText.js";
import type * as lib_mediaSlug from "../lib/mediaSlug.js";
import type * as lib_mediaValidators from "../lib/mediaValidators.js";
import type * as media from "../media.js";
import type * as mediaEnrichment from "../mediaEnrichment.js";
import type * as mediaProcessingNode from "../mediaProcessingNode.js";
import type * as mediaThumbnail from "../mediaThumbnail.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/mediaSearchText": typeof lib_mediaSearchText;
  "lib/mediaSlug": typeof lib_mediaSlug;
  "lib/mediaValidators": typeof lib_mediaValidators;
  media: typeof media;
  mediaEnrichment: typeof mediaEnrichment;
  mediaProcessingNode: typeof mediaProcessingNode;
  mediaThumbnail: typeof mediaThumbnail;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
