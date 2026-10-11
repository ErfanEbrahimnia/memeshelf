import { SignOutButton } from "@/app/_components/auth/SignOutButton";

export default function MyShelfPage() {
  return (
    <div>
      <p className="text-lg text-zinc-800 dark:text-zinc-200">
        Hello World (Authenticated)
      </p>
      <SignOutButton />
    </div>
  );
}
