"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { confirm } from "@/components/ui/Confirm";
import { toast } from "@/components/ui/Toast";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";

type MediaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = use(params);
  const media = useQuery(api.media.getBySlug, { slug });
  const { deleteMedia, isDeleting } = useDeleteMedia();

  if (media === undefined) {
    return <MediaDetailSkeleton />;
  }

  if (media === null) {
    return (
      <PageShell className="items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-foreground">Meme not found</p>
        <Button
          type="button"
          variant="outline"
          render={<Link href="/my-shelf" />}
        >
          Back to shelf
        </Button>
      </PageShell>
    );
  }

  const heading = media.title ?? "Untitled meme";

  return (
    <PageShell>
      <div className="flex shrink-0 items-center justify-between gap-4">
        <Link
          href="/my-shelf"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to shelf
        </Link>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="size-9 rounded-full"
          disabled={isDeleting}
          aria-label={isDeleting ? "Deleting meme" : "Delete meme"}
          onClick={() => void deleteMedia(media._id)}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="size-4" aria-hidden />
          )}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:overflow-hidden">
        <h1 className="shrink-0 text-2xl font-semibold tracking-tight text-foreground">
          {heading}
        </h1>

        {media.url ? (
          <div className="flex min-h-0 flex-1 items-center justify-center md:min-h-0">
            <img
              alt={heading}
              className="max-h-full max-w-full rounded-lg object-contain"
              src={media.url}
              width={media.width}
              height={media.height}
            />
          </div>
        ) : null}

        <div className="flex shrink-0 flex-col gap-4">
          {media.caption ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {media.caption}
            </p>
          ) : null}

          {media.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {media.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

function MediaDetailSkeleton() {
  return (
    <PageShell aria-busy="true" aria-label="Loading meme">
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:overflow-hidden">
        <div className="h-8 w-2/3 max-w-md animate-pulse rounded-md bg-muted" />

        <div className="flex min-h-0 flex-1 items-center justify-center md:min-h-0">
          <div className="aspect-[4/3] w-full max-h-full max-w-full animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="flex shrink-0 flex-col gap-4">
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-14 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto flex h-dvh max-h-dvh w-full max-w-3xl flex-col gap-4 overflow-y-auto p-6 md:overflow-hidden ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
}

function useDeleteMedia() {
  const router = useRouter();
  const removeMedia = useMutation(api.media.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMedia = useCallback(
    async (mediaId: Id<"media">) => {
      const confirmed = await confirm({
        title: "Delete this meme?",
        description:
          "This removes the image and its tags from your shelf. This can't be undone.",
        confirmLabel: "Delete",
        destructive: true,
      });

      if (!confirmed) {
        return;
      }

      setIsDeleting(true);

      try {
        await removeMedia({ mediaId });
        router.push("/my-shelf");
      } catch (error) {
        toast.add({
          type: "error",
          title: "Delete failed",
          description:
            error instanceof Error
              ? error.message
              : "Could not delete this meme.",
        });
      } finally {
        setIsDeleting(false);
      }
    },
    [removeMedia, router]
  );

  return { deleteMedia, isDeleting };
}
