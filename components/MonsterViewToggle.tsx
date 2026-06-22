import Link from "next/link";
import { type MonsterListFilters, type MonsterListView, monsterListHref } from "@/lib/monster-filters";

type MonsterViewToggleProps = {
  filters: MonsterListFilters;
};

const views: { value: MonsterListView; label: string }[] = [
  { value: "card", label: "卡片" },
  { value: "list", label: "列表" }
];

export function MonsterViewToggle({ filters }: MonsterViewToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-zinc-800/60 bg-panel p-1" role="group" aria-label="视图切换">
      {views.map(({ value, label }) => {
        const active = filters.view === value;
        return (
          <Link
            key={value}
            href={monsterListHref(filters, value)}
            aria-current={active ? "true" : undefined}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              active
                ? "bg-zinc-800 font-medium text-zinc-100"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
