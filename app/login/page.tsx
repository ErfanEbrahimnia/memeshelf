import { AuthSection } from "@/app/_components/AuthSection";
import { ConvexAuthProviders } from "@/app/_components/ConvexAuthProviders";

export default function LoginPage() {
  return (
    <ConvexAuthProviders>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">Sign in</h1>
        <AuthSection />
      </div>
    </ConvexAuthProviders>
  );
}
