"use client";

import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { cn } from "cn";
import Link from "next/link";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button, buttonVariants } from "@/components/ui/Button";

export function AuthSection() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <AuthSectionPlaceholder />;
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/my-shelf"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "w-full max-w-xs"
        )}
      >
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
    <span
      className="h-9 w-full max-w-xs flex items-center justify-center"
      aria-busy="true"
    >
      Loading…
    </span>
  );
}

function GoogleSignInOption() {
  const { signIn } = useAuthActions();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => void signIn("google")}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
