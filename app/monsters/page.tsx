import type { Metadata } from "next";
import { MonsterDataCard } from "@/components/MonsterDataCard";
import { MonsterFilters } from "@/components/MonsterFilters";
import { MonsterListTable } from "@/components/MonsterListTable";
import { MonsterViewToggle } from "@/components/MonsterViewToggle";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { getMonsters } from "@/lib/data";
import {
  filterMonsters,
  hasActiveMonsterFilters,
  monsterListQuery,
  parseMonsterListFilters,
  sortMonsters
} from "@/lib/monster-filters";

const PAGE_SIZE = 50;

type MonstersPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: "怪物资料库",
  description: "按等级和名称筛选冒险岛怀旧服怪物资料，浏览属性、经验和掉落。"
};

export const dynamic = "force-dynamic";

export default async function MonstersPage({ searchParams }: MonstersPageProps) {
  const monsters = await getMonsters();
  const filters = parseMonsterListFilters(searchParams);
  const filteredMonsters = sortMonsters(filterMonsters(monsters, filters), filters);
  const requestedPage = Number.parseInt(
    Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page || "1",
    10
  );
  const totalPages = Math.max(1, Math.ceil(filteredMonsters.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages);
  const pageMonsters = filteredMonsters.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const listQuery = monsterListQuery(filters);
  const filtering = hasActiveMonsterFilters(filters);

  const description = filtering
    ? `筛选结果 ${filteredMonsters.length} 条，每页 ${PAGE_SIZE} 条 · 第 ${currentPage}/${totalPages} 页`
    : `共收录 ${monsters.length} 条怪物，每页 ${PAGE_SIZE} 条 · 第 ${currentPage}/${totalPages} 页`;

  return (
    <>
      <PageHeader compact eyebrow="怪物资料" title="怪物资料库" description={description} />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <MonsterFilters filters={filters} totalCount={monsters.length} filteredCount={filteredMonsters.length} />

        {pageMonsters.length > 0 ? (
          <>
            <div className="mt-6 flex justify-end">
              <MonsterViewToggle filters={filters} />
            </div>

            {filters.view === "list" ? (
              <section className="mt-4" aria-label="怪物列表">
                <MonsterListTable
                  filters={filters}
                  monsters={pageMonsters.map((monster) => ({
                    id: monster.id,
                    slug: monster.slug,
                    name: monster.name,
                    level: monster.level,
                    mapName: monster.mapName,
                    hp: monster.hp,
                    exp: monster.exp,
                    image: "image" in monster && typeof monster.image === "string" ? monster.image : null
                  }))}
                />
              </section>
            ) : (
              <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="怪物列表">
                {pageMonsters.map((monster) => (
                  <MonsterDataCard
                    key={monster.id}
                    href={`/monsters/${monster.slug}`}
                    name={monster.name}
                    level={monster.level}
                    hp={monster.hp}
                    exp={monster.exp}
                    mapName={monster.mapName}
                    image={"image" in monster && typeof monster.image === "string" ? monster.image : null}
                    imageAlt={`${monster.name}怪物图片`}
                  />
                ))}
              </section>
            )}
          </>
        ) : (
          <p className="mt-6 rounded-md border border-zinc-800/60 bg-panel px-4 py-8 text-center text-sm text-zinc-400">
            没有符合筛选条件的怪物，请调整等级或名称后重试。
          </p>
        )}

        <Pagination basePath="/monsters" currentPage={currentPage} totalPages={totalPages} query={listQuery} />
      </div>
    </>
  );
}
