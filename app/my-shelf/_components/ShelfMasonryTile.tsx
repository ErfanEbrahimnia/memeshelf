"use client";

import { Button } from "@/components/ui/Button";
import { useCopyShelfImage } from "@/app/my-shelf/_hooks/useCopyShelfImage";
import { useLongPress } from "@/app/my-shelf/_hooks/useLongPress";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import { LongPressCopyIndicator } from "./LongPressCopyIndicator/LongPressCopyIndicator";
import type { ShelfImageItem } from "./ShelfMasonryGrid";

type ShelfMasonryTileProps = {
  item: ShelfImageItem;
};

function useIsMinMd() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQueryList = window.matchMedia("(min-width: 768px)");
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false
  );
}

export function ShelfMasonryTile({ item }: ShelfMasonryTileProps) {
  const isDesktop = useIsMinMd();
  const router = useRouter();
  const imageUrl = item.fullSrc ?? item.src;
  const { copyImage } = useCopyShelfImage(imageUrl);
  const {
    showIndicator,
    indicatorGrowDurationMs,
    longPressTouchHandlers,
    onNavigateClick,
    shouldBlockNavigation,
  } = useLongPress({
    onLongPress: () => void copyImage(),
  });

  const longPressIndicator = (
    <LongPressCopyIndicator
      visible={showIndicator}
      growDurationMs={indicatorGrowDurationMs}
    />
  );

  const overlays = (
    <>
      {item.isProcessing ? (
        <span
          className="absolute left-2 top-2 z-10 rounded-md bg-background/80 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm"
        >
          Labeling…
        </span>
      ) : null}
      {item.processingFailed ? (
        <span
          className="absolute left-2 top-2 z-10 rounded-md bg-destructive/90 px-2 py-0.5 text-xs text-destructive-foreground"
        >
          Labeling failed
        </span>
      ) : null}
    </>
  );

  const image = (
    <img
      alt=""
      className={`block h-auto w-full rounded-lg ${
        item.isProcessing ? "opacity-80" : ""
      }`}
      loading="lazy"
      src={item.src}
      draggable={false}
    />
  );

  const copyButton = (
    <Button
      type="button"
      variant="secondary"
      size="icon-lg"
      className="absolute right-2 top-2 z-10 hidden size-9 rounded-full opacity-0 shadow-md transition-opacity pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 md:inline-flex"
      aria-label="Copy image"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void copyImage();
      }}
    >
      <Copy className="size-4" aria-hidden />
    </Button>
  );

  const shellClassName =
    "group relative block rounded-lg outline-none ring-offset-background transition hover:opacity-95 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2";

  if (item.slug) {
    const detailHref = `/my-shelf/${item.slug}`;
    const imageTarget = isDesktop ? (
      <Link
        href={detailHref}
        className="block rounded-lg"
        onClick={onNavigateClick}
        {...longPressTouchHandlers}
      >
        {image}
      </Link>
    ) : (
      <div
        className="block cursor-pointer rounded-lg"
        role="button"
        tabIndex={0}
        onClick={() => {
          if (shouldBlockNavigation()) {
            return;
          }
          router.push(detailHref);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }
          event.preventDefault();
          if (shouldBlockNavigation()) {
            return;
          }
          router.push(detailHref);
        }}
        {...longPressTouchHandlers}
      >
        {image}
      </div>
    );

    return (
      <div className={shellClassName}>
        {imageTarget}
        {overlays}
        {longPressIndicator}
        {copyButton}
      </div>
    );
  }

  return (
    <div className={shellClassName} {...longPressTouchHandlers}>
      {image}
      {overlays}
      {longPressIndicator}
      {copyButton}
    </div>
  );
}
