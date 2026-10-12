import { SignOutButton } from "@/app/_components/auth/SignOutButton";

export default function MyShelfPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">My shelf</h1>
        <SignOutButton />
      </div>
      <p>Hello World (Authenticated)</p>
    </main>
  );
}
