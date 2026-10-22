"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { CloudUpload } from "lucide-react";
import { useCallback, type DragEvent, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";

const imageAccept = {
  "image/*": [],
};

type FullscreenDropzoneProps = {
  children: ReactNode;
  onUploadFiles?: (files: File[]) => void | Promise<void>;
  disabled?: boolean;
};

export function FullscreenDropzone({
  children,
  onUploadFiles,
  disabled = false,
}: FullscreenDropzoneProps) {
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled || acceptedFiles.length === 0) return;
      onUploadFiles?.(acceptedFiles);
    },
    [disabled, onUploadFiles]
  );

  const onDragStartCapture = useCallback((event: DragEvent<HTMLDivElement>) => {
    const target = event.target;

    if (!(target instanceof Element)) return;
    if (target instanceof HTMLImageElement || target.closest("img")) {
      event.preventDefault();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: imageAccept,
    disabled,
    noClick: true,
    noKeyboard: true,
    onDropAccepted,
  });

  return (
    <div
      {...getRootProps({
        className:
          "relative flex min-h-dvh w-full flex-1 flex-col [&_img]:[-webkit-user-drag:none]",
        onDragStartCapture,
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <div
          className="pointer-events-none fixed inset-0 z-100 flex items-end justify-center bg-blue-300/50"
          role="presentation"
        >
          <Alert className="relative bottom-16 w-full flex flex-col items-center justify-center max-w-md text-center border py-4 animate-in slide-in-from-bottom-full duration-200">
            <div className="animate-pulse rounded-full bg-sky-500/10 p-2 size-20 flex items-center justify-center">
              <CloudUpload aria-hidden className="size-14 text-sky-500!" />
            </div>
            <AlertTitle className="text-lg font-semibold text-sky-500">
              Drop images to upload
            </AlertTitle>
            <AlertDescription className="px-4 pb-4 text-sky-500">
              PNG, JPG, GIF, and other image formats are supported.
            </AlertDescription>
          </Alert>
        </div>
      ) : null}
      {children}
    </div>
  );
}
