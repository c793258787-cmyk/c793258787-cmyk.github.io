"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { HomePromoConfig } from "@/lib/home-promo";

const dismissStorageKey = "home-promo-dismissed";

type HomePromoFloatingProps = {
  promo: HomePromoConfig;
};

function isUnoptimizedImage(src: string) {
  return /\.(svg|gif)$/i.test(src);
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5l7 7M9.5 2.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HomePromoFloating({ promo }: HomePromoFloatingProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isExternal = /^https?:\/\//.test(promo.href);
  const openInNewTab = promo.openInNewTab || isExternal;
  const width = promo.imageWidth ?? 144;
  const height = promo.imageHeight ?? 144;

  useEffect(() => {
    setVisible(localStorage.getItem(dismissStorageKey) !== "1");
  }, []);

  if (!visible || pathname === "/quiz" || pathname.startsWith("/quiz/")) {
    return null;
  }

  function handleDismiss(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    localStorage.setItem(dismissStorageKey, "1");
    setVisible(false);
  }

  const linkContent = (
    <>
      <span className="home-promo-float-ring" aria-hidden="true" />
      <Image
        src={promo.image}
        alt={promo.alt ?? ""}
        width={width}
        height={height}
        unoptimized={isUnoptimizedImage(promo.image)}
        className="relative z-[1] h-full w-full object-cover object-center"
        sizes="92px"
      />
    </>
  );

  return (
    <div className="home-promo-float-shell">
      <button type="button" className="home-promo-float-close" onClick={handleDismiss} aria-label="关闭推广">
        <CloseIcon />
      </button>
      {openInNewTab ? (
        <a
          href={promo.href}
          target="_blank"
          rel="noopener noreferrer"
          className="home-promo-float group"
          aria-label={promo.alt}
        >
          {linkContent}
        </a>
      ) : (
        <Link href={promo.href} className="home-promo-float group" aria-label={promo.alt}>
          {linkContent}
        </Link>
      )}
    </div>
  );
}
