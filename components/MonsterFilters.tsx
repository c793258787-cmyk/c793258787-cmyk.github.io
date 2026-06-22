import Link from "next/link";
import { type MonsterListFilters } from "@/lib/monster-filters";

type MonsterFiltersProps = {
  filters: MonsterListFilters;
  totalCount: number;
  filteredCount: number;
};

export function MonsterFilters({ filters, totalCount, filteredCount }: MonsterFiltersProps) {
  const active = filters.q || filters.levelMin !== null || filters.levelMax !== null;

  return (
    <form method="get" action="/monsters" className="rounded-md border border-zinc-800/60 bg-panel p-4 sm:p-5">
      {filters.view === "list" ? <input type="hidden" name="view" value="list" /> : null}
      {filters.sort ? <input type="hidden" name="sort" value={filters.sort} /> : null}
      {filters.sort ? <input type="hidden" name="order" value={filters.order} /> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_auto] lg:items-end">
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-zinc-500">名称搜索</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="输入怪物名称、地图或 slug"
            className="h-10 w-full rounded-md border border-zinc-800/60 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-zinc-500">最低等级</span>
          <input
            type="number"
            name="levelMin"
            min={0}
            defaultValue={filters.levelMin ?? ""}
            placeholder="不限"
            className="h-10 w-full rounded-md border border-zinc-800/60 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-zinc-500">最高等级</span>
          <input
            type="number"
            name="levelMax"
            min={0}
            defaultValue={filters.levelMax ?? ""}
            placeholder="不限"
            className="h-10 w-full rounded-md border border-zinc-800/60 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="h-10 rounded-md border border-zinc-700/80 bg-zinc-800 px-4 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
          >
            筛选
          </button>
          {active ? (
            <Link
              href="/monsters"
              className="inline-flex h-10 items-center rounded-md border border-zinc-800/60 px-4 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            >
              重置
            </Link>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        {active ? `筛选结果 ${filteredCount} 条，共收录 ${totalCount} 条怪物` : `共收录 ${totalCount} 条怪物`}
      </p>
    </form>
  );
}
