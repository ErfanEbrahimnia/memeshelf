"use client";

import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export function SignOutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <button
      type="button"
      className="flex h-12 items-center justify-center gap-2 rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      onClick={() => {
        void signOut().then(() => {
          router.replace(redirectTo);
        });
      }}
    >
      Sign out
    </button>
  );
}
