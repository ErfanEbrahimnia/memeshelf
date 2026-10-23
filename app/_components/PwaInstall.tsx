"use client";

import "@khmyznikov/pwa-install";

export function PwaInstall() {
  return (
    <pwa-install
      manifest-url="/manifest.webmanifest"
      use-local-storage
    />
  );
}
