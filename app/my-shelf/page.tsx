"use client";

import { api } from "@/convex/_generated/api";
import { useDebounce } from "@uidotdev/usehooks";
import { usePaginatedQuery } from "convex/react";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import { FullscreenDropzone } from "./_components/FullscreenDropzone";
import { HeaderBar } from "./_components/HeaderBar/HeaderBar";
import { ShelfMasonryGrid } from "./_components/ShelfMasonryGrid";
import { UploadDialog } from "./_components/UploadDialog";
import { useMediaPaste } from "./_hooks/useMediaPaste";
import { useShelfMediaUpload } from "./_hooks/useShelfMediaUpload";

export default function MyShelfPage() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const debouncedSearch = useDebounce(search.trim(), 250);
  const { isUploading, onUploadFiles } = useShelfMediaUpload();
  useMediaPaste({ onUploadFiles, disabled: isUploading });

  const { results, status, loadMore } = usePaginatedQuery(
    api.media.listShelf,
    debouncedSearch && debouncedSearch.length > 3
      ? { search: debouncedSearch }
      : {},
    { initialNumItems: 24 }
  );

  const items = useMemo(
    () =>
      results
        .filter((item) => item.url)
        .map((item) => ({
          id: item._id,
          src: item.url!,
          fullSrc: item.fullUrl ?? item.url!,
          width: item.width,
          height: item.height,
          slug: item.slug,
          isProcessing:
            item.processingStatus === "pending" ||
            item.processingStatus === "processing",
          processingFailed: item.processingStatus === "failed",
        })),
    [results]
  );

  return (
    <FullscreenDropzone onUploadFiles={onUploadFiles} disabled={isUploading}>
      <HeaderBar search={search} onSearchChange={setSearch} />
      <main className="flex flex-1 flex-col gap-4 p-6">
        <ShelfMasonryGrid
          items={items}
          isLoading={status === "LoadingFirstPage"}
          isEmpty={status !== "LoadingFirstPage" && items.length === 0}
          canLoadMore={status === "CanLoadMore"}
          onLoadMore={() => loadMore(24)}
        />
      </main>
      <UploadDialog onUploadFiles={onUploadFiles} disabled={isUploading} />
    </FullscreenDropzone>
  );
}
