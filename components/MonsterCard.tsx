import Link from "next/link";
import type { Monster } from "@prisma/client";
import { formatMonsterHeaderDescription, formatMonsterMapLabel } from "@/lib/format";

export function MonsterCard({ monster }: { monster: Monster }) {
  return (
    <Link
      href={`/monsters/${monster.slug}`}
      className="group rounded-md border border-zinc-800/60 bg-panel p-5 transition-colors hover:border-zinc-700/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">{monster.name}</h2>
          <p className="mt-1 text-sm text-zinc-500">{formatMonsterMapLabel(monster.mapName)}</p>
        </div>
        <span className="rounded bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-400">{monster.level} 级</span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-400">{formatMonsterHeaderDescription(monster.mapName)}</p>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-zinc-500">生命</dt>
          <dd className="font-semibold text-zinc-100">{monster.hp}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">经验</dt>
          <dd className="font-semibold text-zinc-100">{monster.exp}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">刷新</dt>
          <dd className="font-semibold text-zinc-100">{monster.spawnRate}</dd>
        </div>
      </dl>
    </Link>
  );
}
