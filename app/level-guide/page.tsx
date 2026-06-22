import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { GuideCard } from "@/components/guides/GuideCard";
import { GuideCategoryNav } from "@/components/guides/GuideCategoryNav";
import { getGuides, getGuidesByCategory } from "@/lib/guides/loader";
import { guideCategories, type GuideCategory } from "@/lib/guides/types";

export const metadata: Metadata = {
  title: "游戏攻略",
  description: "冒险岛怀旧服游戏攻略与资讯，同步整理抖音短视频里的练级、职业与日常心得。"
};

type LevelGuidePageProps = {
  searchParams?: { category?: string };
};

function parseCategory(value?: string): GuideCategory | undefined {
  if (!value) return undefined;
  return (guideCategories as readonly string[]).includes(value) ? (value as GuideCategory) : undefined;
}

export default function LevelGuidePage({ searchParams }: LevelGuidePageProps) {
  const category = parseCategory(searchParams?.category);
  const guides = category ? getGuidesByCategory(category) : getGuides();
  const [featured, ...rest] = guides;

  return (
    <>
      <PageHeader
        compact
        eyebrow="游戏攻略"
        title="攻略与资讯"
        description="把抖音里的怀旧服心得整理成可收藏的图文攻略。新增内容只需在 content/guides/ 添加 Markdown 文件。"
      />

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <GuideCategoryNav active={category} />

        {guides.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-800/80 bg-panel p-10 text-center">
            <p className="text-zinc-300">这个分类下还没有攻略。</p>
            <p className="mt-2 text-sm text-zinc-500">去 content/guides/ 新建一篇 Markdown 就能在这里显示。</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured ? <GuideCard post={featured} featured /> : null}
            {rest.map((post) => (
              <GuideCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
