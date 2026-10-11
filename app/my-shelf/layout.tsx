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
  return "Loading...";
}
