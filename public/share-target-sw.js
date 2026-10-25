/**
 * Handles Web Share Target POSTs for the installed PWA.
 * Keep cache keys in sync with `lib/pwa/shareTarget.ts`.
 */
const SHARE_CACHE = "memeshelf-share-v1";
const SHARE_MANIFEST_ID = "manifest";
const SHARE_ENTRY_PREFIX = "file-";
const SHARE_ACTION_PATH = "/share-target";
const SHARE_FORM_FIELD = "media";

function shareCacheRequestUrl(id) {
  return `${self.location.origin}/__pwa_share__/${encodeURIComponent(id)}`;
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "POST" ||
    url.pathname !== SHARE_ACTION_PATH
  ) {
    return;
  }

  event.respondWith(handleShareTargetPost(event.request));
});

async function handleShareTargetPost(request) {
  const formData = await request.formData();
  const shared = formData.getAll(SHARE_FORM_FIELD);
  const files = shared.filter((entry) => entry instanceof File);

  if (files.length > 0) {
    await storeSharedFiles(files);
  }

  const redirectUrl = new URL("/my-shelf", request.url);
  if (files.length > 0) {
    redirectUrl.searchParams.set("share", "1");
  }
  return Response.redirect(redirectUrl.href, 303);
}

async function storeSharedFiles(files) {
  const cache = await caches.open(SHARE_CACHE);
  const entryIds = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const entryId = `${SHARE_ENTRY_PREFIX}${index}`;
    await cache.put(
      shareCacheRequestUrl(entryId),
      new Response(file, {
        headers: {
          "x-share-filename": encodeURIComponent(file.name || `image-${index + 1}`),
          "x-share-type": file.type || "application/octet-stream",
        },
      })
    );
    entryIds.push(entryId);
  }

  await cache.put(
    shareCacheRequestUrl(SHARE_MANIFEST_ID),
    new Response(JSON.stringify({ entryIds }), {
      headers: { "content-type": "application/json" },
    })
  );
}
