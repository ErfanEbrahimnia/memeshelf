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
      <Link href="/my-shelf" className="w-full max-w-xs text-center">
        Go to your shelf
      </Link>
    );
  }

  return (
    <section
      className="flex w-full max-w-xs flex-col"
      aria-label="Authentication"
    >
      <GoogleSignInOption />
    </section>
  );
}

export function AuthSectionPlaceholder() {
  return (
    <span className="w-full max-w-xs text-center" aria-busy="true">
      Loading…
    </span>
  );
}

function GoogleSignInOption() {
  const { signIn } = useAuthActions();

  return (
    <button
      type="button"
      className="w-full"
      onClick={() => void signIn("google")}
    >
      Sign in with Google
    </button>
  );
}
