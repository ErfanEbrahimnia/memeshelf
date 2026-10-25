function pastedImageFileName(index: number, mimeType: string): string {
  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  return index === 0 ? `pasted-image.${ext}` : `pasted-image-${index + 1}.${ext}`;
}

function blobToImageFile(blob: Blob, index: number, mimeType: string): File {
  const type =
    blob.type && blob.type.startsWith("image/") ? blob.type : mimeType;
  return new File([blob], pastedImageFileName(index, type), {
    type,
    lastModified: Date.now(),
  });
}

export function getImageFilesFromClipboardData(
  clipboardData: DataTransfer | null
): File[] {
  if (!clipboardData) {
    return [];
  }

  const files: File[] = [];
  for (const item of clipboardData.items) {
    if (item.kind !== "file" || !item.type.startsWith("image/")) {
      continue;
    }
    const file = item.getAsFile();
    if (file) {
      files.push(file);
    }
  }
  return files;
}

/** One-tap `clipboard.read()` works on touch devices; desktop usually needs ⌘V/Ctrl+V. */
export function supportsOneClickClipboardImagePaste(): boolean {
  if (typeof navigator === "undefined" || !navigator.clipboard?.read) {
    return false;
  }
  if (typeof window === "undefined") {
    return false;
  }
  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }
  return navigator.maxTouchPoints > 0 && "ontouchstart" in window;
}

export function isAppleTouchDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) && navigator.maxTouchPoints > 0
  );
}

export function keyboardPasteShortcutLabel(): string {
  if (typeof navigator === "undefined") {
    return "Ctrl+V";
  }
  const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  return isApple ? "⌘V" : "Ctrl+V";
}

/** Call on `pointerdown` so `clipboard.read()` keeps the user gesture (desktop Safari). */
export function startClipboardItemsRead(): Promise<ClipboardItem[]> | null {
  return navigator.clipboard?.read() ?? null;
}

/**
 * Desktop Safari loses the user gesture before `click` if `read()` is not started
 * early. iOS rejects `read()` started on `pointerdown`/`touchstart` with
 * NotAllowedError, so touch devices must start the read in `click` instead.
 */
export function shouldPrefetchClipboardReadOnPointerDown(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(pointer: fine)").matches;
}

async function imageFilesFromClipboardItems(
  items: ClipboardItem[]
): Promise<File[]> {
  const files: File[] = [];

  for (const item of items) {
    const imageType = item.types.find((type) => type.startsWith("image/"));
    if (!imageType) {
      continue;
    }
    const blob = await item.getType(imageType);
    if (blob.size === 0) {
      continue;
    }
    files.push(blobToImageFile(blob, files.length, imageType));
  }

  return files;
}

export async function readClipboardImageFiles(
  itemsPromise: Promise<ClipboardItem[]>
): Promise<File[]> {
  let items: ClipboardItem[];
  try {
    items = await itemsPromise;
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      throw new Error(
        "Paste was blocked. On iPhone and iPad, tap this button again and choose Paste in the bar that appears at the top of the screen."
      );
    }
    throw new Error(
      error instanceof Error ? error.message : "Could not read the clipboard"
    );
  }

  const files = await imageFilesFromClipboardItems(items);
  if (files.length === 0) {
    throw new Error("No image on the clipboard");
  }
  return files;
}
