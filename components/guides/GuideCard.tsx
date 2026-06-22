import Image from "next/image";
import Link from "next/link";
import { categoryAccent, formatGuideDate } from "@/lib/guides/format";
import type { GuidePostMeta } from "@/lib/guides/types";

type GuideCardProps = {
  post: GuidePostMeta;
  featured?: boolean;
};

export function GuideCard({ post, featured = false }: GuideCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-lg border border-zinc-800/60 bg-panel transition-colors hover:border-zinc-700/80 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr]" : ""
      }`}
    >
      <Link href={`/level-guide/${post.slug}`} className={`block ${featured ? "md:min-h-[220px]" : ""}`}>
        <div className={`relative overflow-hidden bg-zinc-900/80 ${featured ? "h-full min-h-[180px]" : "aspect-[16/9]"}`}>
          {post.cover ? (
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]">
              <span className="text-4xl opacity-80">🍁</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#18181b] to-transparent" />
        </div>
      </Link>

      <div className={`flex flex-col p-5 ${featured ? "md:justify-center" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryAccent(post.category)}`}>
            {post.category}
          </span>
          <time dateTime={post.publishedAt} className="text-xs text-zinc-500">
            {formatGuideDate(post.publishedAt)}
          </time>
          {post.douyinUrl ? (
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
              来自抖音
            </span>
          ) : null}
        </div>

        <h2 className={`mt-3 font-semibold text-zinc-100 group-hover:text-rose-400 ${featured ? "text-2xl" : "text-lg"}`}>
          <Link href={`/level-guide/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className={`mt-2 text-sm leading-6 text-zinc-400 ${featured ? "line-clamp-4" : "line-clamp-3"}`}>{post.excerpt}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-500">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
