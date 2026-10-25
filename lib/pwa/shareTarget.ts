/** Must match `public/share-target-sw.js`. */
export const SHARE_TARGET_CACHE_NAME = "memeshelf-share-v1";
export const SHARE_TARGET_ACTION_PATH = "/share-target";
export const SHARE_TARGET_FORM_FIELD = "media";
export const SHARE_PENDING_MANIFEST_ID = "manifest";
export const SHARE_PENDING_ENTRY_PREFIX = "file-";

function shareCacheRequestUrl(id: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://local";
  return `${origin}/__pwa_share__/${encodeURIComponent(id)}`;
}

export function sharePendingEntryId(index: number): string {
  return `${SHARE_PENDING_ENTRY_PREFIX}${index}`;
}

async function fileFromCachedResponseAsync(
  response: Response,
  index: number
): Promise<File | null> {
  const type =
    response.headers.get("x-share-type") ?? "application/octet-stream";
  const encodedName = response.headers.get("x-share-filename");
  const name = encodedName
    ? decodeURIComponent(encodedName)
    : `shared-image-${index + 1}`;

  const blob = await response.blob();
  if (blob.size === 0) {
    return null;
  }
  return new File([blob], name, {
    type: blob.type || type,
    lastModified: Date.now(),
  });
}

export async function consumePendingShareTargetFiles(): Promise<File[]> {
  if (typeof caches === "undefined") {
    return [];
  }

  const cache = await caches.open(SHARE_TARGET_CACHE_NAME);
  const manifestResponse = await cache.match(
    shareCacheRequestUrl(SHARE_PENDING_MANIFEST_ID)
  );
  if (!manifestResponse) {
    return [];
  }

  let entryIds: string[];
  try {
    const manifest = (await manifestResponse.json()) as { entryIds?: string[] };
    entryIds = manifest.entryIds ?? [];
  } catch {
    await cache.delete(shareCacheRequestUrl(SHARE_PENDING_MANIFEST_ID));
    return [];
  }

  const files: File[] = [];
  for (let index = 0; index < entryIds.length; index++) {
    const entryId = entryIds[index] ?? sharePendingEntryId(index);
    const requestUrl = shareCacheRequestUrl(entryId);
    const response = await cache.match(requestUrl);
    if (!response) {
      continue;
    }
    const file = await fileFromCachedResponseAsync(response, index);
    if (file) {
      files.push(file);
    }
    await cache.delete(requestUrl);
  }

  await cache.delete(shareCacheRequestUrl(SHARE_PENDING_MANIFEST_ID));
  return files;
}

export function registerShareTargetServiceWorker(): void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  void navigator.serviceWorker
    .register("/share-target-sw.js", { scope: "/" })
    .catch(() => {
      // Registration can fail on insecure origins or restrictive browsers.
    });
}
