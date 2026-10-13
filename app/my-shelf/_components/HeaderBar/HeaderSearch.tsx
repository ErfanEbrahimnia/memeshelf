"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function HeaderSearch() {
  return (
    <form
      className="relative w-full"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <Search
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        name="q"
        placeholder="Search memes"
        className="h-11 rounded-full border-border/60 bg-muted/50 pl-11 shadow-none focus-visible:bg-background"
        aria-label="Search memes"
      />
    </form>
  );
}
