"use client";

import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import Link from "next/link";

export function AuthSection() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <AuthSectionPlaceholder />;
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/app"
        className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Go to your shelf
      </Link>
    );
  }

  return (
    <section
      className="flex w-full max-w-xs flex-col gap-3"
      aria-label="Authentication"
    >
      <GoogleSignInOption />
    </section>
  );
}

export function AuthSectionPlaceholder() {
  return (
    <span
      className="flex h-12 items-center justify-center rounded-full bg-foreground/70 px-5 text-sm text-background"
      aria-busy="true"
    >
      Loading…
    </span>
  );
}

function GoogleSignInOption() {
  const { signIn } = useAuthActions();

  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      onClick={() => void signIn("google")}
    >
      Sign in with Google
    </button>
  );
}
