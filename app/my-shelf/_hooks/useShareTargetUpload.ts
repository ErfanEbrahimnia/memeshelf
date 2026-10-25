"use client";

import { toast } from "@/components/ui/Toast";
import { consumePendingShareTargetFiles } from "@/lib/pwa/shareTarget";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";

type UseShareTargetUploadOptions = {
  onUploadFiles?: (files: File[]) => void | Promise<void>;
  disabled?: boolean;
};

export function useShareTargetUpload({
  onUploadFiles,
  disabled = false,
}: UseShareTargetUploadOptions) {
  const [shareParam, setShareParam] = useQueryState("share", parseAsString);
  const isConsumingRef = useRef(false);

  useEffect(() => {
    if (disabled || !onUploadFiles || isConsumingRef.current) {
      return;
    }

    isConsumingRef.current = true;

    void (async () => {
      try {
        const files = await consumePendingShareTargetFiles();
        if (files.length === 0) {
          if (shareParam === "needs-sw") {
            await setShareParam(null);
            toast.add({
              type: "error",
              title: "Open MemeShelf first",
              description:
                "Open the installed app once, then try Share → MemeShelf again.",
            });
          } else if (shareParam === "1") {
            await setShareParam(null);
            toast.add({
              type: "error",
              title: "Share failed",
              description: "No images were found in what you shared.",
            });
          }
          return;
        }

        await setShareParam(null);
        await onUploadFiles(files);
      } catch (error) {
        toast.add({
          type: "error",
          title: "Share failed",
          description:
            error instanceof Error
              ? error.message
              : "Could not add shared images.",
        });
      } finally {
        isConsumingRef.current = false;
      }
    })();
  }, [disabled, onUploadFiles, setShareParam, shareParam]);
}
