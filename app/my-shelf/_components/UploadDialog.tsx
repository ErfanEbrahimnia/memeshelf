"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import {
  keyboardPasteShortcutLabel,
  readClipboardImageFiles,
  startClipboardItemsRead,
  supportsOneClickClipboardImagePaste,
} from "@/lib/media/clipboardImages";
import { cn } from "cn";
import { ClipboardPaste, CloudUpload, Plus } from "lucide-react";
import { useCallback, useRef, useSyncExternalStore, useState } from "react";
import { useDropzone } from "react-dropzone";

import { dropzoneConfig } from "../_lib/dropzoneConfig";

type UploadDialogProps = {
  onUploadFiles?: (files: File[]) => void | Promise<void>;
  disabled?: boolean;
};

function subscribeNoop() {
  return () => {};
}

const clipboardUiServerSnapshot = {
  showPasteButton: false,
  pasteShortcut: "Ctrl+V",
};

let clipboardUiClientSnapshotCache: typeof clipboardUiServerSnapshot | null =
  null;

function getClipboardUiClientSnapshot() {
  clipboardUiClientSnapshotCache ??= {
    showPasteButton: supportsOneClickClipboardImagePaste(),
    pasteShortcut: keyboardPasteShortcutLabel(),
  };
  return clipboardUiClientSnapshotCache;
}

export function UploadDialog({
  onUploadFiles,
  disabled = false,
}: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const clipboardItemsReadRef = useRef<Promise<ClipboardItem[]> | null>(null);
  const { showPasteButton, pasteShortcut } = useSyncExternalStore(
    subscribeNoop,
    getClipboardUiClientSnapshot,
    () => clipboardUiServerSnapshot
  );

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled || acceptedFiles.length === 0) return;
      setOpen(false);
      onUploadFiles?.(acceptedFiles);
    },
    [disabled, onUploadFiles]
  );

  const onPastePointerDown = useCallback(() => {
    if (disabled || isPasting || clipboardItemsReadRef.current) {
      return;
    }
    clipboardItemsReadRef.current = startClipboardItemsRead();
  }, [disabled, isPasting]);

  const onPasteFromClipboard = useCallback(() => {
    if (disabled || isPasting) {
      return;
    }

    const itemsRead =
      clipboardItemsReadRef.current ?? startClipboardItemsRead();
    clipboardItemsReadRef.current = null;

    if (!itemsRead) {
      toast.add({
        type: "error",
        title: "Paste failed",
        description: "Paste is not supported in this browser.",
      });
      return;
    }

    setIsPasting(true);
    void readClipboardImageFiles(itemsRead)
      .then((files) => {
        setOpen(false);
        void onUploadFiles?.(files);
      })
      .catch((error) => {
        toast.add({
          type: "error",
          title: "Paste failed",
          description:
            error instanceof Error ? error.message : "Could not paste image.",
        });
      })
      .finally(() => {
        setIsPasting(false);
      });
  }, [disabled, isPasting, onUploadFiles]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    accept: dropzoneConfig.accept,
    disabled,
    onDropAccepted,
  });

  return (
    <>
      <Button
        type="button"
        size="icon-lg"
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg"
        disabled={disabled}
        aria-label="Upload images"
        onClick={() => setOpen(true)}
      >
        <Plus aria-hidden className="size-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload images</DialogTitle>
            <DialogDescription>
              PNG, JPG, GIF, and other image formats are supported.
              {!showPasteButton ? (
                <>
                  {" "}
                  You can also paste from your clipboard with {pasteShortcut}{" "}
                  anywhere on this page.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div
            {...getRootProps({
              className: cn(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors",
                "hover:border-primary/40 hover:bg-muted/40",
                isDragActive && "border-sky-500 bg-sky-500/10",
                disabled && "pointer-events-none opacity-50"
              ),
            })}
          >
            <input {...getInputProps()} />
            <div className="rounded-full bg-sky-500/10 p-3">
              <CloudUpload aria-hidden className="size-8 text-sky-500" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop images here" : "Drag and drop images here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or use the button below
            </p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              className="w-full"
              disabled={disabled}
              onClick={() => openFileDialog()}
            >
              Choose files
            </Button>
            {showPasteButton ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={disabled || isPasting}
                onPointerDown={onPastePointerDown}
                onClick={onPasteFromClipboard}
              >
                <ClipboardPaste aria-hidden className="size-4" />
                {isPasting ? "Pasting…" : "Paste from clipboard"}
              </Button>
            ) : null}
            <DialogClose variant="outline" className="w-full">
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
