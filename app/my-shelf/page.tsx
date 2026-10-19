"use client";

import { api } from "@/convex/_generated/api";
import { uploadMediaFile } from "@/lib/media/uploadMediaFile";
import { useDebounce } from "@uidotdev/usehooks";
import { useMutation, usePaginatedQuery } from "convex/react";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useMemo, useState } from "react";

import { FullscreenDropzone } from "./_components/FullscreenDropzone";
import { HeaderBar } from "./_components/HeaderBar/HeaderBar";
import { ShelfMasonryGrid } from "./_components/ShelfMasonryGrid";

export default function MyShelfPage() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const debouncedSearch = useDebounce(search.trim(), 250);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const finalizeUpload = useMutation(api.media.finalizeUpload);

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
          width: item.width,
          height: item.height,
        })),
    [results]
  );

  const onUploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setUploadError(null);
      setIsUploading(true);

      try {
        for (const file of files) {
          await uploadMediaFile(
            file,
            () => generateUploadUrl(),
            (args) => finalizeUpload(args)
          );
        }
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [finalizeUpload, generateUploadUrl]
  );

  return (
    <FullscreenDropzone onUploadFiles={onUploadFiles} disabled={isUploading}>
      <HeaderBar search={search} onSearchChange={setSearch} />
      <main className="flex flex-1 flex-col gap-4 p-6">
        {uploadError ? (
          <p className="text-sm text-destructive" role="alert">
            {uploadError}
          </p>
        ) : null}
        {isUploading ? (
          <p className="text-sm text-muted-foreground">Uploading…</p>
        ) : null}
        <ShelfMasonryGrid
          items={items}
          isLoading={status === "LoadingFirstPage"}
          isEmpty={status !== "LoadingFirstPage" && items.length === 0}
          canLoadMore={status === "CanLoadMore"}
          onLoadMore={() => loadMore(24)}
        />
      </main>
    </FullscreenDropzone>
  );
}
