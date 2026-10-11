import { ConvexAuthProviders } from "@/app/_components/ConvexAuthProviders";
import { SignOutButton } from "@/app/_components/SignOutButton";

export default function AppHomePage() {
  return (
    <ConvexAuthProviders>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 font-sans">
        <p className="text-lg text-zinc-800 dark:text-zinc-200">
          Hello World (Authenticated)
        </p>
        <SignOutButton />
      </div>
    </ConvexAuthProviders>
  );
}
