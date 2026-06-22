import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { formatDropChance, titleCase } from "@/lib/format";
import { getDrops } from "@/lib/data";

export const metadata: Metadata = {
  title: "掉落查询",
  description: "冒险岛怀旧服掉落表，包含怪物、物品、掉落概率和地图资料。"
};

export const dynamic = "force-dynamic";

export default async function DropsPage() {
  const drops = await getDrops();

  return (
    <>
      <PageHeader
        compact
        eyebrow="掉落查询"
        title="冒险岛掉落查询"
        description={`共 ${drops.length} 条掉落记录，按怪物、物品、概率和地图整理，点击名称可进入详情页。`}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="overflow-x-auto rounded-md border border-zinc-800/60 bg-panel">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs text-zinc-500">
              <tr>
                <th className="px-4 py-3">怪物</th>
                <th className="px-4 py-3">物品</th>
                <th className="px-4 py-3">类型</th>
                <th className="px-4 py-3">地图</th>
                <th className="px-4 py-3">概率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {drops.map((drop) => (
                <tr key={drop.id} className="bg-panel transition-colors hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <Link href={`/monsters/${drop.monster.slug}`} className="font-medium text-zinc-100 hover:text-rose-500">
                      {drop.monster.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/items/${drop.item.slug}`} className="font-medium text-zinc-100 hover:text-rose-500">
                      {drop.item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{titleCase(drop.item.type)}</td>
                  <td className="px-4 py-3 text-zinc-400">{drop.monster.mapName}</td>
                  <td className="px-4 py-3 font-semibold text-amber-400">{formatDropChance(drop.chance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
