"use client";

import { getImageFilesFromClipboardData } from "@/lib/media/clipboardImages";
import { useEffect } from "react";

type UseMediaPasteOptions = {
  onUploadFiles?: (files: File[]) => void | Promise<void>;
  disabled?: boolean;
};

function isPasteTargetEditable(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const element = target.closest(
    "input, textarea, select, [contenteditable=''], [contenteditable='true']"
  );
  if (!element) {
    return false;
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return !element.readOnly && !element.disabled;
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return true;
  }

  return false;
}

export function useMediaPaste({
  onUploadFiles,
  disabled = false,
}: UseMediaPasteOptions) {
  useEffect(() => {
    if (disabled || !onUploadFiles) {
      return;
    }

    const onPaste = (event: ClipboardEvent) => {
      if (isPasteTargetEditable(event.target)) {
        return;
      }

      const files = getImageFilesFromClipboardData(event.clipboardData);
      if (files.length === 0) {
        return;
      }

      event.preventDefault();
      void onUploadFiles(files);
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [disabled, onUploadFiles]);
}
