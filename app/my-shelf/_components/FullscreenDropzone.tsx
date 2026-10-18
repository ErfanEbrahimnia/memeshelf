"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudUpload, Upload } from "lucide-react";
import { useCallback, type DragEvent, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";

const imageAccept = {
  "image/*": [],
};

export function FullscreenDropzone({ children }: { children: ReactNode }) {
  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    console.log("Dropped files:", acceptedFiles);
  }, []);

  const onDragStartCapture = useCallback((event: DragEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target instanceof HTMLImageElement || target.closest("img")) {
      event.preventDefault();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: imageAccept,
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
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-blue-300/50"
          role="presentation"
        >
          <Alert className="relative w-full flex flex-col items-center justify-center max-w-md text-center border-3 border-sky-500 border-dashed bg-transparent py-4">
            <CloudUpload aria-hidden className="size-14 mb-3 text-sky-500!" />
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
