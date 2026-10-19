import Link from "next/link";
import { HeaderSearch } from "./HeaderSearch";
import { UserMenu } from "./UserMenu";

export function HeaderBar() {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex w-full items-center px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-foreground"
        >
          MemeShelf
        </Link>
        <div className="flex items-center justify-center w-full ml-12 mr-4">
          <div className="pointer-events-auto w-full">
            <HeaderSearch />
          </div>
        </div>
        <div className="relative ml-auto flex items-center justify-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
