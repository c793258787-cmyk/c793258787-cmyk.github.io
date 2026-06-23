import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideMarkdown } from "@/components/guides/GuideMarkdown";
import { PageHeader } from "@/components/PageHeader";
import { categoryAccent, formatGuideDate } from "@/lib/guides/format";
import { getGuide, getGuides } from "@/lib/guides/loader";
import { breadcrumbs } from "@/lib/breadcrumbs";

type GuideArticlePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getGuides().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: GuideArticlePageProps): Promise<Metadata> {
  const post = getGuide(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default function GuideArticlePage({ params }: GuideArticlePageProps) {
  const post = getGuide(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <PageHeader
        compact
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={breadcrumbs({ label: "游戏攻略", href: "/level-guide" }, { label: post.title })}
      />

      <section className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-zinc-800/60 pb-6 text-sm text-zinc-500">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryAccent(post.category)}`}>
            {post.category}
          </span>
          <time dateTime={post.publishedAt}>{formatGuideDate(post.publishedAt)}</time>
          <span>{post.author}</span>
          {post.douyinUrl ? (
            <a
              href={post.douyinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
            >
              查看抖音原视频
            </a>
          ) : null}
        </div>

        <GuideMarkdown content={post.body} />

        <div className="mt-10 flex flex-wrap gap-3 border-t border-zinc-800/60 pt-6">
          <Link
            href="/level-guide"
            className="rounded-md border border-zinc-800/60 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
          >
            返回攻略列表
          </Link>
          <Link
            href="/quiz"
            className="rounded-md border border-zinc-800/60 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
          >
            去做职业本命测试
          </Link>
        </div>
      </section>
    </>
  );
}
