"use client";

import { Button } from "@/components/ui/Button";
import { MasonryGrid } from "react-masonry-virtualized";

export type ShelfImageItem = {
  id: string;
  src: string;
  width: number;
  height: number;
  isProcessing?: boolean;
  processingFailed?: boolean;
};

type ShelfMasonryGridProps = {
  items: ShelfImageItem[];
  isLoading?: boolean;
  isEmpty?: boolean;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
};

export function ShelfMasonryGrid({
  items,
  isLoading = false,
  isEmpty = false,
  canLoadMore = false,
  onLoadMore,
}: ShelfMasonryGridProps) {
  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">Loading shelf…</p>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium text-foreground">Your shelf is empty</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Drop images anywhere on this page to start your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MasonryGrid
        className="w-full"
        gap={16}
        items={items}
        minWidth={280}
        getItemSize={(item) =>
          Promise.resolve({ width: item.width, height: item.height })
        }
        renderItem={(item) => (
          <div className="relative">
            <img
              alt=""
              className={`block h-auto w-full rounded-lg ${
                item.isProcessing ? "opacity-80" : ""
              }`}
              loading="lazy"
              src={item.src}
            />
            {item.isProcessing ? (
              <span
                className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm"
              >
                Labeling…
              </span>
            ) : null}
            {item.processingFailed ? (
              <span
                className="absolute right-2 top-2 rounded-md bg-destructive/90 px-2 py-0.5 text-xs text-destructive-foreground"
              >
                Labeling failed
              </span>
            ) : null}
          </div>
        )}
      />
      {canLoadMore ? (
        <div className="flex justify-center pb-4">
          <Button type="button" variant="outline" onClick={onLoadMore}>
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}
