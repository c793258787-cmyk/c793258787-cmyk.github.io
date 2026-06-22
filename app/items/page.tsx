import type { Metadata } from "next";
import { DataCard } from "@/components/DataCard";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { getItems } from "@/lib/data";
import { titleCase } from "@/lib/format";

const PAGE_SIZE = 50;

type ItemsPageProps = {
  searchParams?: { page?: string | string[] };
};

export const metadata: Metadata = {
  title: "物品资料库",
  description: "浏览冒险岛怀旧服物品资料，并查询每件物品由哪些怪物掉落。"
};

export const dynamic = "force-dynamic";

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const items = await getItems();
  const requestedPage = Number.parseInt(Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page || "1", 10);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages);
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <PageHeader
        compact
        eyebrow="物品资料"
        title="物品资料库"
        description={`共收录 ${items.length} 条物品，每页 ${PAGE_SIZE} 条 · 第 ${currentPage}/${totalPages} 页`}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="物品列表">
          {pageItems.map((item) => (
            <DataCard
              key={item.id}
              href={`/items/${item.slug}`}
              title={item.name}
              label="物品类型"
              value={titleCase(item.type)}
              meta={`需求等级 ${item.requiredLevel ?? "无"}`}
              accent={item.type === "EQUIPMENT" ? "maple" : "default"}
            />
          ))}
        </section>
        <Pagination basePath="/items" currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
