"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

const navItems = [
  ["怪物资料", "/monsters"],
  ["游戏攻略", "/level-guide"]
] as const;

const quizHref = "/quiz";
const quizLabel = "职业本命测试";

function linkClass(isActive: boolean, mobile = false) {
  const base = mobile
    ? "block rounded-md px-3 py-2 text-sm transition-colors"
    : "py-2 text-sm transition-colors";
  return isActive
    ? `${base} font-medium text-zinc-100`
    : `${base} text-zinc-400 hover:text-zinc-100`;
}

function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function MapleLeafIcon() {
  const gradId = useId();

  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden
      className="nav-quiz-promo-leaf"
      fill="none"
    >
      <defs>
        <linearGradient id={gradId} x1="3" y1="2" x2="13" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" />
          <stop offset="0.55" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M8 1.2c-.9 1.4-2.1 2-3.4 3.2-1.2 1.1-1.4 2.8-.4 4.1.6.8 1.5 1.6 2.5 2.3-.9-.1-1.8-.4-2.6-.9-1.5 1-2.4 2.6-2.1 4.3.2 1.2 1 2.2 2.1 2.8 1-.5 2-1.3 2.7-2.2.7.9 1.7 1.7 2.7 2.2 1.1-.6 1.9-1.6 2.1-2.8.3-1.7-.6-3.3-2.1-4.3-.8.5-1.7.8-2.6.9 1-.7 1.9-1.5 2.5-2.3 1-1.3.8-3-.4-4.1C10.1 3.2 8.9 2.6 8 1.2Z"
      />
    </svg>
  );
}

function QuizNavPromo({
  mobile = false,
  active,
  onNavigate
}: {
  mobile?: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={quizHref}
      onClick={onNavigate}
      className={`nav-quiz-promo ${active ? "nav-quiz-promo-active" : ""} ${mobile ? "nav-quiz-promo-mobile" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className="nav-quiz-promo-aurora" aria-hidden="true" />
      <MapleLeafIcon />
      <span className="nav-quiz-promo-text">{quizLabel}</span>
    </Link>
  );
}

export function DesktopNavLinks() {
  const pathname = usePathname();
  const quizActive = isNavActive(pathname, quizHref);

  return (
    <nav className="hidden items-center gap-5 md:flex lg:justify-end" aria-label="全站导航">
      {navItems.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className={linkClass(isNavActive(pathname, href))}
          aria-current={isNavActive(pathname, href) ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
      <QuizNavPromo active={quizActive} />
    </nav>
  );
}

export function MobileNavMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const quizActive = isNavActive(pathname, quizHref);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-md border border-zinc-800/60 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        {open ? "关闭" : "菜单"}
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          className="absolute left-0 right-0 top-full border-b border-zinc-800/50 bg-[#121214]/95 px-4 py-3 backdrop-blur-md"
          aria-label="移动端导航"
        >
          <div className="flex flex-col gap-2">
            <QuizNavPromo mobile active={quizActive} onNavigate={() => setOpen(false)} />
            <div className="border-t border-zinc-800/60" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              {navItems.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={linkClass(isNavActive(pathname, href), true)}
                  aria-current={isNavActive(pathname, href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
