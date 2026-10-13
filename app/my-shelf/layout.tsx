import { ConvexAuthProviders } from "@/app/_components/ConvexAuthProviders";
import { ReactNode, Suspense } from "react";

export default function MyShelfLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<MyShelfShellFallback />}>
      <ConvexAuthProviders>{children}</ConvexAuthProviders>
    </Suspense>
  );
}

function MyShelfShellFallback() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="h-16 border-b border-border/60 bg-muted/30" />
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    </div>
  );
}
