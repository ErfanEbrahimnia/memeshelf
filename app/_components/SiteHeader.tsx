import { ThemeToggle } from "@/app/_components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="fixed top-0 right-0 p-4">
      <ThemeToggle />
    </header>
  );
}
