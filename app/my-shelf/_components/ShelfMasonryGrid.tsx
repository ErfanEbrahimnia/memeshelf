"use client";

import { MasonryGrid } from "react-masonry-virtualized";

export type ShelfImageItem = {
  id: string;
  src: string;
  width: number;
  height: number;
};

/** Placeholder shelf items — varied aspect ratios for layout testing. */
export const SHELF_TEST_IMAGES: ShelfImageItem[] = [
  { id: "1", src: "https://picsum.photos/seed/ms-1/480/720", width: 480, height: 720 },
  { id: "2", src: "https://picsum.photos/seed/ms-2/480/320", width: 480, height: 320 },
  { id: "3", src: "https://picsum.photos/seed/ms-3/480/480", width: 480, height: 480 },
  { id: "4", src: "https://picsum.photos/seed/ms-4/480/640", width: 480, height: 640 },
  { id: "5", src: "https://picsum.photos/seed/ms-5/480/360", width: 480, height: 360 },
  { id: "6", src: "https://picsum.photos/seed/ms-6/480/800", width: 480, height: 800 },
  { id: "7", src: "https://picsum.photos/seed/ms-7/480/540", width: 480, height: 540 },
  { id: "8", src: "https://picsum.photos/seed/ms-8/480/400", width: 480, height: 400 },
  { id: "9", src: "https://picsum.photos/seed/ms-9/480/600", width: 480, height: 600 },
  { id: "10", src: "https://picsum.photos/seed/ms-10/480/280", width: 480, height: 280 },
  { id: "11", src: "https://picsum.photos/seed/ms-11/480/520", width: 480, height: 520 },
  { id: "12", src: "https://picsum.photos/seed/ms-12/480/760", width: 480, height: 760 },
  { id: "13", src: "https://picsum.photos/seed/ms-13/480/340", width: 480, height: 340 },
  { id: "14", src: "https://picsum.photos/seed/ms-14/480/500", width: 480, height: 500 },
  { id: "15", src: "https://picsum.photos/seed/ms-15/480/420", width: 480, height: 420 },
  { id: "16", src: "https://picsum.photos/seed/ms-16/480/680", width: 480, height: 680 },
  { id: "17", src: "https://picsum.photos/seed/ms-17/480/300", width: 480, height: 300 },
  { id: "18", src: "https://picsum.photos/seed/ms-18/480/560", width: 480, height: 560 },
  { id: "19", src: "https://picsum.photos/seed/ms-19/480/440", width: 480, height: 440 },
  { id: "20", src: "https://picsum.photos/seed/ms-20/480/900", width: 480, height: 900 },
];

type ShelfMasonryGridProps = {
  items?: ShelfImageItem[];
};

export function ShelfMasonryGrid({ items = SHELF_TEST_IMAGES }: ShelfMasonryGridProps) {
  return (
    <MasonryGrid
      className="w-full"
      gap={16}
      items={items}
      minWidth={280}
      getItemSize={(item) =>
        Promise.resolve({ width: item.width, height: item.height })
      }
      renderItem={(item) => (
        <img
          alt=""
          className="block h-auto w-full rounded-lg"
          loading="lazy"
          src={item.src}
        />
      )}
    />
  );
}
