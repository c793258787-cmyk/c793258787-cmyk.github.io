import { ItemType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { shouldUseLocalData } from "@/lib/db-source";
import { searchCrawledMonsters } from "@/lib/crawler-data";
import { mockItems, mockMonsters } from "@/lib/mock-data";

const RESULT_LIMIT = 10;

const itemTypeKeywords: Record<ItemType, string[]> = {
  EQUIPMENT: ["equipment", "装备"],
  USE: ["use", "消耗"],
  ETC: ["etc", "其他"],
  MATERIAL: ["material", "材料"],
  QUEST: ["quest", "任务"]
};

export type MonsterSearchResult = {
  id: string;
  slug: string;
  name: string;
  level: number;
  mapName: string;
};

export type ItemSearchResult = {
  id: string;
  slug: string;
  name: string;
  type: ItemType;
  requiredLevel: number | null;
};

export type SearchResult = {
  monsters: MonsterSearchResult[];
  items: ItemSearchResult[];
};

function matchingItemTypes(query: string): ItemType[] {
  return Object.entries(itemTypeKeywords)
    .filter(([type, keywords]) => [type, ...keywords].some((value) => value.toLowerCase().includes(query)))
    .map(([type]) => type as ItemType);
}

function searchMockData(query: string, itemTypes: ItemType[]): SearchResult {
  const includesQuery = (value: string) => value.toLowerCase().includes(query);

  const monsters = mockMonsters
    .filter((monster) => includesQuery(monster.name) || includesQuery(monster.mapName) || includesQuery(monster.slug))
    .slice(0, RESULT_LIMIT)
    .map(({ id, slug, name, level, mapName }) => ({ id, slug, name, level, mapName }));

  const items = mockItems
    .filter((item) => includesQuery(item.name) || includesQuery(item.slug) || itemTypes.includes(item.type as ItemType))
    .slice(0, RESULT_LIMIT)
    .map(({ id, slug, name, type, requiredLevel }) => ({
      id,
      slug,
      name,
      type: type as ItemType,
      requiredLevel
    }));

  return { monsters, items };
}

export async function searchDatabase(rawQuery: string): Promise<SearchResult> {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return { monsters: [], items: [] };
  }

  const itemTypes = matchingItemTypes(query);
  const monsterWhere: Prisma.MonsterWhereInput = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { mapName: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } }
    ]
  };
  const itemWhere: Prisma.ItemWhereInput = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } },
      ...(itemTypes.length > 0 ? [{ type: { in: itemTypes } }] : [])
    ]
  };

  if (shouldUseLocalData()) {
    const fallback = searchMockData(query, itemTypes);
    try {
      const monsters = await searchCrawledMonsters(query, RESULT_LIMIT);
      return { monsters: monsters.length > 0 ? monsters : fallback.monsters, items: fallback.items };
    } catch {
      return fallback;
    }
  }

  try {
    const [monsters, items] = await Promise.all([
      prisma.monster.findMany({
        where: monsterWhere,
        select: { id: true, slug: true, name: true, level: true, mapName: true },
        orderBy: [{ level: "asc" }, { name: "asc" }],
        take: RESULT_LIMIT
      }),
      prisma.item.findMany({
        where: itemWhere,
        select: { id: true, slug: true, name: true, type: true, requiredLevel: true },
        orderBy: { name: "asc" },
        take: RESULT_LIMIT
      })
    ]);

    return { monsters, items };
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("PostgreSQL 暂不可用，怪物搜索已切换到爬虫 SQLite 数据。");
    const fallback = searchMockData(query, itemTypes);

    try {
      const monsters = await searchCrawledMonsters(query, RESULT_LIMIT);
      return { monsters: monsters.length > 0 ? monsters : fallback.monsters, items: fallback.items };
    } catch {
      return fallback;
    }
  }
}
