import { AuthSectionPlaceholder } from "@/app/_components/auth/AuthSection";
import { AuthSectionWithProviders } from "@/app/_components/auth/AuthSectionWithProviders";
import { ClipboardPaste, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

const features = [
  {
    icon: ClipboardPaste,
    title: "Drop, paste, or share",
    description:
      "Drag files in, paste from your clipboard, or share straight from your phone.",
  },
  {
    icon: Sparkles,
    title: "Labeled for you",
    description:
      "Every meme gets a title, caption, and tags automatically. No manual sorting.",
  },
  {
    icon: Search,
    title: "Found in a second",
    description:
      "Search by what's in the meme and copy it with a single click or long-press.",
  },
];

const tileTints = [
  "from-rose-200/70 to-orange-100/50 dark:from-rose-500/25 dark:to-orange-400/10",
  "from-sky-200/70 to-indigo-100/50 dark:from-sky-500/25 dark:to-indigo-400/10",
  "from-amber-200/70 to-yellow-100/50 dark:from-amber-500/25 dark:to-yellow-400/10",
  "from-emerald-200/70 to-teal-100/50 dark:from-emerald-500/25 dark:to-teal-400/10",
  "from-violet-200/70 to-fuchsia-100/50 dark:from-violet-500/25 dark:to-fuchsia-400/10",
];

const previewColumns = [
  [
    { height: "h-28", tag: "reaction", tint: tileTints[0] },
    { height: "h-40", tag: "cats", tint: tileTints[1] },
    { height: "h-24", tag: "monday", tint: tileTints[2] },
  ],
  [
    { height: "h-40", tag: "this is fine", tint: tileTints[2] },
    { height: "h-24", tag: "wholesome", tint: tileTints[3] },
    { height: "h-32", tag: "dev", tint: tileTints[4] },
  ],
  [
    { height: "h-24", tag: "dogs", tint: tileTints[4] },
    { height: "h-32", tag: "deadline", tint: tileTints[0] },
    { height: "h-36", tag: "surprised", tint: tileTints[1] },
  ],
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
        <Image
          src="/icons/icon-192x192.png"
          alt=""
          width={64}
          height={64}
          priority
          className="mb-6 dark:invert dark:mix-blend-screen"
        />
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Every meme you save, right where you need it.
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground text-balance">
          MemeShelf is your personal meme library. Toss them in, and they are
          labeled, searchable, and ready to share.
        </p>
        <div className="mt-8 flex w-full justify-center">
          <Suspense fallback={<AuthSectionPlaceholder />}>
            <AuthSectionWithProviders />
          </Suspense>
        </div>
      </section>

      <section aria-hidden className="px-6">
        <ShelfPreview />
      </section>

      <section
        aria-label="Features"
        className="mx-auto grid w-full max-w-4xl gap-10 px-6 py-20 sm:grid-cols-3 sm:gap-8"
      >
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Icon className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 font-medium">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto border-t px-6 py-6 text-center text-sm text-muted-foreground">
        MemeShelf · Your meme library, organized for you.
      </footer>
    </main>
  );
}

function ShelfPreview() {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border bg-card p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex h-10 items-center gap-2 rounded-2xl bg-muted px-4 text-sm text-muted-foreground">
        <Search className="size-4" />
        <span>cat staring at screen</span>
        <span className="h-4 w-px animate-pulse bg-foreground/60" />
      </div>
      <div className="grid h-80 grid-cols-3 gap-2 sm:h-96 sm:gap-3">
        {previewColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-2 sm:gap-3">
            {column.map(({ height, tag, tint }) => (
              <div
                key={tag}
                className={`relative ${height} shrink-0 rounded-xl bg-linear-to-br ${tint}`}
              >
                <span className="absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
                  #{tag}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-card to-transparent" />
    </div>
  );
}
