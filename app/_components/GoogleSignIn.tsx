"use client";

import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";

export function GoogleSignIn() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Signed in</p>
      </div>
    );
  }
  return (
    <button
      className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      onClick={() => void signIn("google")}
    >
      Sign in with Google
    </button>
  );
}
