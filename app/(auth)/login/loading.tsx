import { AuthSectionPlaceholder } from "@/app/_components/auth/AuthSection";

export default function LoginLoading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <AuthSectionPlaceholder />
    </main>
  );
}
