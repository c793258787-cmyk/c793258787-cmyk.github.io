import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/Stat";
import { formatDropChance, titleCase } from "@/lib/format";
import { absoluteUrl, serverName } from "@/lib/seo";
import { getMonster } from "@/lib/data";

type MonsterDetailPageProps = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MonsterDetailPageProps): Promise<Metadata> {
  const monster = await getMonster(params.slug);

  if (!monster) {
    return {};
  }

  return {
    title: `${monster.name} 掉落、属性和地图`,
    description: `${serverName}${monster.name}资料：${monster.level}级，生命${monster.hp}，经验${monster.exp}，出没地图为${monster.mapName}。`,
    alternates: {
      canonical: absoluteUrl(`/monsters/${monster.slug}`)
    }
  };
}

export default async function MonsterDetailPage({ params }: MonsterDetailPageProps) {
  const monster = await getMonster(params.slug);

  if (!monster) {
    notFound();
  }

  const monsterImage = "image" in monster && typeof monster.image === "string" ? monster.image : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${monster.name}怪物资料`,
    description: monster.description,
    url: absoluteUrl(`/monsters/${monster.slug}`),
    about: serverName,
    ...(monsterImage ? { image: absoluteUrl(monsterImage) } : {})
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow={`${monster.region}怪物`}
        title={monster.name}
        description={monster.description}
        image={monsterImage}
        imageAlt={`${monster.name}怪物图片`}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="等级" value={monster.level} />
          <Stat label="生命" value={monster.hp} />
          <Stat label="经验" value={monster.exp} />
          <Stat label="刷新" value={monster.spawnRate} />
        </dl>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section className="rounded-md border border-zinc-800/60 bg-panel p-6">
            <h2 className="text-xl font-semibold text-zinc-100">怪物详情</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-zinc-800/60 pb-3">
                <dt className="text-zinc-500">地图</dt>
                <dd className="text-right font-semibold text-zinc-100">{monster.mapName}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-800/60 pb-3">
                <dt className="text-zinc-500">属性</dt>
                <dd className="font-semibold text-zinc-100">{titleCase(monster.element)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">弱点</dt>
                <dd className="font-semibold text-rose-500">{monster.weakness ? titleCase(monster.weakness) : "无"}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-md border border-zinc-800/60 bg-panel p-6">
            <h2 className="text-xl font-semibold text-zinc-100">{monster.name}掉落表</h2>
            <div className="mt-5 overflow-x-auto rounded-md border border-zinc-800/60">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-xs text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">物品</th>
                    <th className="px-4 py-3">类型</th>
                    <th className="px-4 py-3">概率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-panel">
                  {monster.drops.map((drop) => (
                    <tr key={drop.id}>
                      <td className="px-4 py-3">
                        <Link href={`/items/${drop.item.slug}`} className="font-medium text-zinc-100 hover:text-rose-500">
                          {drop.item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{titleCase(drop.item.type)}</td>
                      <td className="px-4 py-3 font-semibold text-amber-400">{formatDropChance(drop.chance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
