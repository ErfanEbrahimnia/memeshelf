"use client";

import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

export function SignOutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => {
        void signOut().then(() => {
          router.replace(redirectTo);
        });
      }}
    >
      Sign out
    </Button>
  );
}
