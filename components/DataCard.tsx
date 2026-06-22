import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type DataCardProps = {
  title: string;
  label: string;
  value: ReactNode;
  meta?: ReactNode;
  href?: string;
  accent?: "default" | "maple" | "meso";
  image?: string | null;
  imageAlt?: string;
};

const accentStyles = {
  default: "text-zinc-100",
  maple: "text-rose-500",
  meso: "text-amber-400"
} as const;

export function DataCard({ title, label, value, meta, href, accent = "default", image, imageAlt }: DataCardProps) {
  const content = (
    <>
      <div className="relative mb-4 flex h-24 items-center justify-center overflow-hidden rounded-md bg-zinc-950/60">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 768px) 260px, 50vw"
            className="object-contain p-2 [image-rendering:pixelated]"
            unoptimized
          />
        ) : (
          <span className="text-xs text-zinc-600">暂无图片</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
        {meta ? <span className="shrink-0 text-xs text-zinc-500">{meta}</span> : null}
      </div>
      <dl className="mt-5">
        <dt className="text-xs font-medium text-zinc-500">{label}</dt>
        <dd className={`mt-1 text-sm font-semibold ${accentStyles[accent]}`}>{value}</dd>
      </dl>
    </>
  );
  const className = "block rounded-md border border-zinc-800/60 bg-panel p-4 transition-colors hover:border-zinc-700/80 sm:p-5";

  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}
