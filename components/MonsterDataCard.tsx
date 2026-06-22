import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type MonsterDataCardProps = {
  href: string;
  name: string;
  level: number;
  hp: number;
  exp: number;
  mapName: string;
  image?: string | null;
  imageAlt?: string;
};

function StatBadge({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-zinc-800/70 bg-zinc-950/50 px-2.5 py-1 text-xs text-zinc-400">
      {icon}
      <span>
        {label} {value}
      </span>
    </span>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-rose-500">
      <path
        d="M6 10.2S1.5 7.05 1.5 4.35C1.5 2.85 2.55 1.8 4.05 1.8c.9 0 1.74.45 2.25 1.15.51-.7 1.35-1.15 2.25-1.15 1.5 0 2.55 1.05 2.55 2.55C10.5 7.05 6 10.2 6 10.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-amber-400">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-zinc-500">
      <path
        d="M6 1.5c-1.75 0-3.15 1.35-3.15 3.05 0 2.25 3.15 5.95 3.15 5.95s3.15-3.7 3.15-5.95C9.15 2.85 7.75 1.5 6 1.5Zm0 4.05a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MonsterDataCard({ href, name, level, hp, exp, mapName, image, imageAlt }: MonsterDataCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-md border border-zinc-800/60 bg-panel p-4 transition-colors hover:border-zinc-700/80 sm:p-5"
    >
      <div className="relative mb-4 flex h-24 items-center justify-center overflow-hidden rounded-md bg-zinc-950/60">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || name}
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
        <h2 className="text-base font-semibold text-zinc-100">{name}</h2>
        <span className="shrink-0 text-xs text-zinc-500">{level} 级</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatBadge icon={<HeartIcon />} label="HP" value={hp} />
        <StatBadge icon={<StarIcon />} label="EXP" value={exp} />
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
        <MapPinIcon />
        <span>{mapName}</span>
      </p>
    </Link>
  );
}
