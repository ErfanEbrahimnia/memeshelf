"use client";

import { toast } from "@/components/ui/Toast";
import { useCallback } from "react";

function mimeTypeSupportedForClipboardWrite(type: string): boolean {
  if (typeof ClipboardItem === "undefined") {
    return false;
  }
  if (typeof ClipboardItem.supports === "function") {
    return ClipboardItem.supports(type);
  }
  return type === "image/png" || type === "image/jpeg";
}

async function blobToPngBlob(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not prepare image");
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const pngBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!pngBlob) {
    throw new Error("Could not convert image");
  }
  return pngBlob;
}

async function copyImageToClipboard(imageUrl: string): Promise<void> {
  if (!navigator.clipboard?.write) {
    throw new Error("Clipboard is not supported in this browser");
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("Could not load image");
  }

  let blob = await response.blob();
  let type =
    blob.type && blob.type !== "application/octet-stream"
      ? blob.type
      : "image/png";

  if (!mimeTypeSupportedForClipboardWrite(type)) {
    blob = await blobToPngBlob(blob);
    type = "image/png";
  }

  if (!mimeTypeSupportedForClipboardWrite(type)) {
    throw new Error("Copying images is not supported in this browser");
  }

  await navigator.clipboard.write([
    new ClipboardItem({ [type]: blob }),
  ]);
}

export function useCopyShelfImage(imageUrl: string | undefined) {
  const copyImage = useCallback(async () => {
    if (!imageUrl) {
      return;
    }

    try {
      await copyImageToClipboard(imageUrl);
      toast.add({
        type: "success",
        title: "Copied",
        description: "Image copied to clipboard.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Copy failed",
        description:
          error instanceof Error ? error.message : "Could not copy image.",
      });
    }
  }, [imageUrl]);

  return { copyImage };
}
