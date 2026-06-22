import { prisma } from "@/lib/prisma";
import { shouldUseLocalData } from "@/lib/db-source";
import { getCrawledMonster, getCrawledMonsters } from "@/lib/crawler-data";
import { mockDrops, mockItemWithDrops, mockItems, mockLevelBrackets, mockMonsterWithDrops, mockMonsters } from "@/lib/mock-data";

async function resolveFallback<T>(fallback: T | (() => Promise<T>)) {
  return typeof fallback === "function" ? await (fallback as () => Promise<T>)() : fallback;
}

async function fromDb<T>(query: () => Promise<T>, fallback: T | (() => Promise<T>)): Promise<T> {
  if (shouldUseLocalData()) {
    return resolveFallback(fallback);
  }

  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("PostgreSQL 暂不可用，已使用内置演示数据。");
      return resolveFallback(fallback);
    }
    throw error;
  }
}

export function getMonsters(take?: number) {
  const fallback = [...mockMonsters]
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
    .slice(0, take);
  return fromDb(
    () => prisma.monster.findMany({ orderBy: [{ level: "asc" }, { name: "asc" }], ...(take ? { take } : {}) }),
    async () => {
      try {
        const crawled = await getCrawledMonsters(take);
        return (crawled.length > 0 ? crawled : fallback) as never;
      } catch {
        return fallback as never;
      }
    }
  );
}

export function getMonster(slug: string) {
  return fromDb(
    () => prisma.monster.findUnique({
      where: { slug },
      include: { drops: { include: { item: true }, orderBy: { chance: "desc" } } }
    }),
    async () => {
      try {
        return (await getCrawledMonster(slug)) ?? (mockMonsterWithDrops(slug) as never);
      } catch {
        return mockMonsterWithDrops(slug) as never;
      }
    }
  );
}

export function getItems(take?: number) {
  const fallback = [...mockItems]
    .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
    .slice(0, take);
  return fromDb(
    () => prisma.item.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }], ...(take ? { take } : {}) }),
    fallback as never
  );
}

export function getItem(slug: string) {
  return fromDb(
    () => prisma.item.findUnique({
      where: { slug },
      include: { drops: { include: { monster: true }, orderBy: { chance: "desc" } } }
    }),
    mockItemWithDrops(slug) as never
  );
}

export function getDrops() {
  return fromDb(
    () => prisma.drop.findMany({
      include: { monster: true, item: true },
      orderBy: [{ chance: "desc" }, { createdAt: "asc" }]
    }),
    [...mockDrops].sort((a, b) => Number(b.chance) - Number(a.chance)) as never
  );
}

export function getLevelBrackets() {
  return fromDb(
    () => prisma.levelBracket.findMany({ orderBy: { minLevel: "asc" } }),
    [...mockLevelBrackets] as never
  );
}

export function getDropCount() {
  return fromDb(() => prisma.drop.count(), mockDrops.length);
}

export function getSitemapRecords() {
  return fromDb(
    async () => {
      const [monsters, items] = await Promise.all([
        prisma.monster.findMany({ select: { slug: true, updatedAt: true } }),
        prisma.item.findMany({ select: { slug: true, updatedAt: true } })
      ]);
      return { monsters, items };
    },
    {
      monsters: mockMonsters.map(({ slug, updatedAt }) => ({ slug, updatedAt })),
      items: mockItems.map(({ slug, updatedAt }) => ({ slug, updatedAt }))
    }
  );
}
