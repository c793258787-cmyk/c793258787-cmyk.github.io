import Link from "next/link";
import { guideCategories, type GuideCategory } from "@/lib/guides/types";

type GuideCategoryNavProps = {
  active?: GuideCategory;
};

export function GuideCategoryNav({ active }: GuideCategoryNavProps) {
  const items: Array<{ label: string; href: string; value?: GuideCategory }> = [
    { label: "全部", href: "/level-guide" },
    ...guideCategories.map((category) => ({
      label: category,
      href: `/level-guide?category=${encodeURIComponent(category)}`,
      value: category
    }))
  ];

  return (
    <nav className="flex flex-wrap gap-2" aria-label="攻略分类">
      {items.map((item) => {
        const isActive = item.value ? active === item.value : !active;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                : "border-zinc-800/60 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
