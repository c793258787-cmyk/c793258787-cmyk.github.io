import Image from "next/image";
import Link from "next/link";
import {
  getEffectiveOrder,
  getEffectiveSort,
  type MonsterListFilters,
  type MonsterSortField,
  monsterSortHref
} from "@/lib/monster-filters";

export type MonsterListItem = {
  id: string;
  slug: string;
  name: string;
  level: number;
  mapName: string;
  hp: number;
  exp: number;
  image?: string | null;
};

type MonsterListTableProps = {
  monsters: MonsterListItem[];
  filters: MonsterListFilters;
};

function SortIcon({ active, order }: { active: boolean; order: "asc" | "desc" }) {
  if (!active) {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-zinc-600">
        <path d="M6 2.5L8.5 6H3.5L6 2.5Z" fill="currentColor" />
        <path d="M6 9.5L3.5 6H8.5L6 9.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (order === "asc") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-sky-400">
        <path d="M6 2.5L8.5 6H3.5L6 2.5Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-sky-400">
      <path d="M6 9.5L3.5 6H8.5L6 9.5Z" fill="currentColor" />
    </svg>
  );
}

function SortHeader({ label, field, filters }: { label: string; field: MonsterSortField; filters: MonsterListFilters }) {
  const activeSort = getEffectiveSort(filters);
  const activeOrder = getEffectiveOrder(filters);
  const active = activeSort === field;

  return (
    <Link
      href={monsterSortHref(filters, field)}
      className={`inline-flex items-center gap-1 border-b pb-0.5 transition-colors hover:text-zinc-300 ${
        active ? "border-sky-400 font-medium text-sky-300" : "border-transparent text-zinc-500"
      }`}
      aria-sort={active ? (activeOrder === "asc" ? "ascending" : "descending") : "none"}
    >
      <span>{label}</span>
      <SortIcon active={active} order={activeOrder} />
    </Link>
  );
}

export function MonsterListTable({ monsters, filters }: MonsterListTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-zinc-800/60 bg-panel">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-zinc-900 text-xs">
          <tr>
            <th className="px-4 py-3 font-medium text-zinc-500">怪物</th>
            <th className="px-4 py-3">
              <SortHeader label="等级" field="level" filters={filters} />
            </th>
            <th className="px-4 py-3 font-medium text-zinc-500">生命</th>
            <th className="px-4 py-3">
              <SortHeader label="经验" field="exp" filters={filters} />
            </th>
            <th className="px-4 py-3 font-medium text-zinc-500">地图</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {monsters.map((monster) => (
            <tr key={monster.id} className="transition-colors hover:bg-zinc-800/30">
              <td className="px-4 py-3">
                <Link href={`/monsters/${monster.slug}`} className="flex items-center gap-3 font-medium text-zinc-100 hover:text-rose-400">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-950/60">
                    {monster.image ? (
                      <Image
                        src={monster.image}
                        alt={`${monster.name}怪物图片`}
                        fill
                        sizes="40px"
                        className="object-contain p-1 [image-rendering:pixelated]"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-600">无图</span>
                    )}
                  </span>
                  <span>{monster.name}</span>
                </Link>
              </td>
              <td className="px-4 py-3 font-medium text-amber-400">{monster.level}</td>
              <td className="px-4 py-3 text-zinc-300">{monster.hp}</td>
              <td className="px-4 py-3 text-zinc-300">{monster.exp}</td>
              <td className="px-4 py-3 text-zinc-300">{monster.mapName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
