import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HomeCommunityBanner } from "@/components/HomeCommunityBanner";
import { MonsterDataCard } from "@/components/MonsterDataCard";
import { SearchBar } from "@/components/SearchBar";
import { homeBreadcrumbs } from "@/lib/breadcrumbs";
import { getGuides } from "@/lib/guides/loader";
import { getMonsters } from "@/lib/data";
import { siteDescription, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "怪物资料搜索",
  description: siteDescription
};

const sections = [
  {
    title: "怪物资料",
    href: "/monsters",
    description: "按等级与地图浏览怪物属性、经验和掉落。",
    statLabel: "怪物条目"
  },
  {
    title: "游戏攻略",
    href: "/level-guide",
    description: "练级、职业、日常心得，同步整理抖音短视频内容。",
    statLabel: "攻略文章"
  }
] as const;

const featuredMonsterSlugs = [
  "mob-9300058",
  "mob-1110100",
  "mob-3210100",
  "mob-5130102"
] as const;

export default async function HomePage() {
  const monsters = await getMonsters();
  const guides = getGuides();
  const monsterMap = new Map(monsters.map((monster) => [monster.slug, monster]));
  const featuredMonsters = featuredMonsterSlugs
    .map((slug) => monsterMap.get(slug))
    .filter((monster): monster is NonNullable<typeof monster> => monster != null);
  const counts = [monsters.length, guides.length];

  return (
    <>
      <section className="hero-gradient border-b border-zinc-800/50 py-14 text-center sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 lg:px-8">
          <div className="mb-4 w-full text-left">
            <Breadcrumbs items={homeBreadcrumbs()} />
          </div>
          <p className="text-sm font-medium text-rose-500">冒险岛怀旧服</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">{siteName}</h1>
          <p className="mt-2 max-w-xl text-zinc-400">{siteDescription}</p>
          <div className="mt-6 flex w-full max-w-2xl flex-col items-center gap-3">
            <HomeCommunityBanner />
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8" aria-label="功能入口">
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section, index) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-md border border-zinc-800/60 bg-panel p-5 transition-colors hover:border-zinc-700/80"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-zinc-100 group-hover:text-rose-400">{section.title}</h2>
                <span className="shrink-0 text-xs font-medium text-amber-400">{counts[index]}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{section.statLabel}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-zinc-100">热门怪物</h2>
          <Link href="/monsters" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
            查看全部
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {featuredMonsters.map((monster) => (
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
        </div>
      </section>
    </>
  );
}
