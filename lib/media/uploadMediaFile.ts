import type { Id } from "@/convex/_generated/dataModel";

import { getImageDimensions } from "./getImageDimensions";

export type FinalizeUploadArgs = {
  storageId: Id<"_storage">;
  originalName: string;
  width: number;
  height: number;
  source: { kind: "upload" };
};

export async function uploadMediaFile(
  file: File,
  generateUploadUrl: () => Promise<string>,
  finalizeUpload: (args: FinalizeUploadArgs) => Promise<unknown>,
) {
  const { width, height } = await getImageDimensions(file);
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const { storageId } = (await response.json()) as {
    storageId: Id<"_storage">;
  };
  await finalizeUpload({
    storageId,
    originalName: file.name,
    width,
    height,
    source: { kind: "upload" },
  });
}
