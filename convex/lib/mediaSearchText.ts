const MAX_TAGS = 16;

export function normalizeSearchText(originalName: string, caption?: string) {
  const parts = [originalName.replace(/\.[^.]+$/, ""), caption].filter(Boolean);
  return parts.join(" ").trim().toLowerCase();
}

export function normalizeTags(tags: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();

    if (!tag || seen.has(tag)) continue;

    seen.add(tag);
    normalized.push(tag);

    if (normalized.length >= MAX_TAGS) break;
  }

  return normalized;
}
