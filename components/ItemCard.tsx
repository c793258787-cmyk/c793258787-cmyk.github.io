import Link from "next/link";
import type { Item } from "@prisma/client";
import { titleCase } from "@/lib/format";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/items/${item.slug}`}
      className="group rounded-md border border-zinc-800/60 bg-panel p-5 transition-colors hover:border-zinc-700/80"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-zinc-100">{item.name}</h2>
        <span className="rounded bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-500">{titleCase(item.type)}</span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-400">{item.description}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-zinc-500">需求等级</dt>
          <dd className="font-semibold text-amber-400">{item.requiredLevel ?? "无"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">商店价格</dt>
          <dd className="font-semibold text-zinc-100">{item.vendorValue} 金币</dd>
        </div>
      </dl>
    </Link>
  );
}
