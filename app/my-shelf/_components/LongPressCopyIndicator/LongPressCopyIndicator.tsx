"use client";

import { Copy } from "lucide-react";
import type { CSSProperties } from "react";

import "./LongPressCopyIndicator.css";

type LongPressCopyIndicatorProps = {
  visible: boolean;
  growDurationMs: number;
};

export function LongPressCopyIndicator({
  visible,
  growDurationMs,
}: LongPressCopyIndicatorProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/30 backdrop-blur-[1px] md:hidden"
      style={
        {
          "--long-press-grow-duration": `${growDurationMs}ms`,
        } as CSSProperties
      }
      aria-hidden
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-background/95 shadow-md">
        <Copy
          className="long-press-copy-icon-grow size-5 origin-center text-foreground"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}
