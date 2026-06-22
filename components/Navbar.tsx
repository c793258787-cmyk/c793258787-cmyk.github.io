import Image from "next/image";
import Link from "next/link";
import { DesktopNavLinks, MobileNavMenu } from "@/components/NavLinks";
import { SearchBar } from "@/components/SearchBar";
import { siteName } from "@/lib/seo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/50 bg-[#121214]/70 backdrop-blur-md">
      <div className="relative mx-auto grid max-w-7xl gap-3 px-4 py-3 lg:grid-cols-[auto_1fr_20rem] lg:items-center lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:contents">
          <Link href="/" className="flex shrink-0 items-center gap-1.5">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                priority
                className="absolute left-1/2 top-1/2 h-[3.25rem] w-[3.25rem] -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            </span>
            <span className="text-base font-semibold leading-none text-zinc-100">{siteName}</span>
          </Link>
          <MobileNavMenu />
        </div>

        <DesktopNavLinks />

        <SearchBar variant="nav" />
      </div>
    </header>
  );
}
