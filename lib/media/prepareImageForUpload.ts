import imageCompression from "browser-image-compression";

const MAX_DIMENSION = 2048;
const MAX_SIZE_MB = 2;
const MAX_GIF_BYTES = 10 * 1024 * 1024;

function isGif(file: File): boolean {
  return file.type === "image/gif" || /\.gif$/i.test(file.name);
}

function webpFileName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/i, "") || originalName;
  return `${base}.webp`;
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (isGif(file)) {
    if (file.size > MAX_GIF_BYTES) {
      throw new Error(
        `GIF is too large (max ${Math.round(MAX_GIF_BYTES / (1024 * 1024))}MB)`
      );
    }
    return file;
  }

  if (typeof window === "undefined") {
    return file;
  }

  const maxBytes = MAX_SIZE_MB * 1024 * 1024;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_DIMENSION,
      fileType: "image/webp",
      useWebWorker: true,
      initialQuality: 0.85,
    });

    return new File([compressed], webpFileName(file.name), {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  } catch {
    if (file.size > maxBytes) {
      throw new Error(
        `Image is too large (max ${MAX_SIZE_MB}MB)`
      );
    }
    return file;
  }
}
