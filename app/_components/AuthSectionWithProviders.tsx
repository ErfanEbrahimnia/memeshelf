import { AuthSection } from "@/app/_components/AuthSection";
import { ConvexAuthProviders } from "@/app/_components/ConvexAuthProviders";

export async function AuthSectionWithProviders() {
  return (
    <ConvexAuthProviders>
      <AuthSection />
    </ConvexAuthProviders>
  );
}
