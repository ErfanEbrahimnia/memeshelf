"use client";

import { useId } from "react";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { LogIn, LogOut, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { ProfileAvatar } from "@/app/my-shelf/_components/HeaderBar/ProfileAvatar";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export function UserMenu() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const currentAuthUser = useQuery(
    api.users.currentAuthUser,
    isAuthenticated ? {} : "skip"
  );

  const currentAuthUserLoading =
    isAuthenticated && currentAuthUser === undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full p-0"
            aria-label="Account menu"
          />
        }
      >
        <ProfileAvatar
          imageUrl={currentAuthUser?.image}
          alt={currentAuthUser?.name ?? "Profile"}
          isLoading={authLoading || currentAuthUserLoading}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <ThemeMenuGroup />
        <DropdownMenuGroup>
          {authLoading ? (
            <DropdownMenuItem disabled>Loading account…</DropdownMenuItem>
          ) : isAuthenticated ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                void signOut().then(() => {
                  router.replace("/");
                });
              }}
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                void signIn("google");
              }}
            >
              <LogIn />
              Sign in with Google
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeMenuGroup() {
  const { resolvedTheme, setTheme } = useTheme();

  const themeSwitchId = useId();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <div className="flex items-center justify-between gap-3 rounded-xl px-2 py-2">
          <label
            htmlFor={themeSwitchId}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <Moon className="size-4 text-muted-foreground" aria-hidden />
            Dark mode
          </label>
          <Switch
            id={themeSwitchId}
            checked={isDark}
            onCheckedChange={(checked) => {
              setTheme(checked ? "dark" : "light");
            }}
            aria-label="Toggle dark mode"
          />
        </div>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </>
  );
}
