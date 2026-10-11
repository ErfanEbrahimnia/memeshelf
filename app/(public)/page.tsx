import { AuthSectionPlaceholder } from "@/app/_components/AuthSection";
import { AuthSectionWithProviders } from "@/app/_components/AuthSectionWithProviders";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          MemeShelf
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Your meme library, organized for you.
        </p>
      </div>
      <Suspense fallback={<AuthSectionPlaceholder />}>
        <AuthSectionWithProviders />
      </Suspense>
    </main>
  );
}
