import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/Stat";
import { absoluteUrl, serverName } from "@/lib/seo";
import { formatDropChance, titleCase } from "@/lib/format";
import { getItem } from "@/lib/data";
import { breadcrumbs } from "@/lib/breadcrumbs";

type ItemDetailPageProps = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ItemDetailPageProps): Promise<Metadata> {
  const item = await getItem(params.slug);

  if (!item) {
    return {};
  }

  return {
    title: `${item.name} 掉落来源和物品资料`,
    description: `${serverName}${item.name}资料：类型为${titleCase(item.type)}，商店价格${item.vendorValue}金币，并提供怪物掉落来源。`,
    alternates: {
      canonical: absoluteUrl(`/items/${item.slug}`)
    }
  };
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const item = await getItem(params.slug);

  if (!item) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: item.name,
    description: item.description,
    url: absoluteUrl(`/items/${item.slug}`)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow={titleCase(item.type)}
        title={item.name}
        description={item.description}
        breadcrumbs={breadcrumbs({ label: "物品资料", href: "/items" }, { label: item.name })}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <dl className="grid gap-4 sm:grid-cols-3">
          <Stat label="类型" value={titleCase(item.type)} />
          <Stat label="需求等级" value={item.requiredLevel ?? "无"} />
          <Stat label="商店价格" value={`${item.vendorValue} 金币`} />
        </dl>
        <section className="mt-8 rounded-md border border-zinc-800/60 bg-panel p-6">
          <h2 className="text-xl font-semibold text-zinc-100">{item.name}掉落来源</h2>
          <div className="mt-5 overflow-x-auto rounded-md border border-zinc-800/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-xs text-zinc-500">
                <tr>
                  <th className="px-4 py-3">怪物</th>
                  <th className="px-4 py-3">等级</th>
                  <th className="px-4 py-3">地图</th>
                  <th className="px-4 py-3">概率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-panel">
                {item.drops.map((drop) => (
                  <tr key={drop.id}>
                    <td className="px-4 py-3">
                      <Link href={`/monsters/${drop.monster.slug}`} className="font-medium text-zinc-100 hover:text-rose-500">
                        {drop.monster.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-amber-400">{drop.monster.level}</td>
                    <td className="px-4 py-3 text-zinc-400">{drop.monster.mapName}</td>
                    <td className="px-4 py-3 font-semibold text-amber-400">{formatDropChance(drop.chance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
}
