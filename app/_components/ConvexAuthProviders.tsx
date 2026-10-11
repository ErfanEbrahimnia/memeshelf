import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { connection } from "next/server";
import { ReactNode } from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";

export async function ConvexAuthProviders({
  children,
}: {
  children: ReactNode;
}) {
  await connection();

  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
