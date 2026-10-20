"use client";

import { api } from "@/convex/_generated/api";
import { toast } from "@/components/ui/Toast";
import { uploadMediaFile } from "@/lib/media/uploadMediaFile";
import { useMutation } from "convex/react";
import PQueue from "p-queue";
import { useCallback, useState } from "react";

const UPLOAD_CONCURRENCY = 3;

function uploadDescription(fileCount: number) {
  return fileCount === 1
    ? "Adding your file to the shelf…"
    : `Adding ${fileCount} files to the shelf…`;
}

function successDescription(fileCount: number) {
  return fileCount === 1
    ? "Your file was added to the shelf."
    : `${fileCount} files were added to the shelf.`;
}

export function useShelfMediaUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const finalizeUpload = useMutation(api.media.finalizeUpload);

  const onUploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsUploading(true);

      const queue = new PQueue({ concurrency: UPLOAD_CONCURRENCY });
      const uploadPromise = queue.addAll(
        files.map(
          (file) => () =>
            uploadMediaFile(
              file,
              () => generateUploadUrl(),
              (args) => finalizeUpload(args)
            )
        )
      );

      try {
        await toast.promise(uploadPromise, {
          loading: {
            type: "loading",
            title: "Uploading…",
            description: uploadDescription(files.length),
          },
          success: {
            type: "success",
            title: "Upload complete",
            description: successDescription(files.length),
          },
          error: (error) => ({
            type: "error",
            title: "Upload failed",
            description:
              error instanceof Error ? error.message : "Upload failed",
          }),
        });
      } finally {
        setIsUploading(false);
      }
    },
    [finalizeUpload, generateUploadUrl]
  );

  return { isUploading, onUploadFiles };
}
