"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname === "/quiz" || pathname.startsWith("/quiz/");

  if (immersive) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-zinc-800/50 bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-zinc-500 lg:px-8">
          为冒险岛怀旧服玩家整理资料。
        </div>
      </footer>
    </>
  );
}
