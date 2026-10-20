import { nanoid } from "nanoid";
import slugify from "slugify";

const MAX_SLUG_LENGTH = 120;
const NANOID_LENGTH = 5;

/** Human-readable stem plus a short id, e.g. `drake-pointing-a1b2c`. */
export function createMediaSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  const stem = (base.length > 0 ? base : "meme").slice(
    0,
    MAX_SLUG_LENGTH - NANOID_LENGTH - 1
  );
  return `${stem}-${nanoid(NANOID_LENGTH)}`;
}
