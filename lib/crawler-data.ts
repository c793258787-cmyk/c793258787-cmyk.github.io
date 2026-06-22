import type { Monster } from "@prisma/client";
import crawledMonsters from "@/data/crawled-monsters.json";

type CrawledMonster = (typeof crawledMonsters)[number];
type WebsiteMonster = Monster & { image: string | null };

function toWebsiteMonster(monster: CrawledMonster): WebsiteMonster {
  const now = new Date(0);

  return {
    id: `crawler-${monster.id}`,
    slug: `mob-${monster.id}`,
    name: monster.name || `未知怪物 ${monster.id}`,
    region: "爬虫资料",
    level: monster.level ?? 0,
    hp: monster.hp ?? 0,
    exp: monster.exp ?? 0,
    element: "NEUTRAL",
    weakness: null,
    description: `${monster.name || "该怪物"}的冒险岛 079 版本资料，数据来源编号 ${monster.id}。`,
    mapName: monster.map || "未知地图",
    spawnRate: "未知",
    image: monster.image,
    createdAt: now,
    updatedAt: now
  };
}

export async function getCrawledMonsters(take?: number) {
  const monsters = [...crawledMonsters]
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0) || a.id - b.id)
    .slice(0, take);

  return monsters.map(toWebsiteMonster);
}

export async function getCrawledMonster(slug: string) {
  const id = Number.parseInt(slug.replace(/^mob-/, ""), 10);
  if (!slug.startsWith("mob-") || !Number.isInteger(id)) return null;

  const monster = crawledMonsters.find((entry) => entry.id === id);
  return monster ? { ...toWebsiteMonster(monster), drops: [] } : null;
}

export async function searchCrawledMonsters(query: string, take = 10) {
  const normalized = query.toLowerCase();

  return crawledMonsters
    .filter((monster) =>
      monster.name?.toLowerCase().includes(normalized) ||
      monster.map?.toLowerCase().includes(normalized) ||
      String(monster.id).includes(normalized)
    )
    .slice(0, take)
    .map((monster) => ({
      id: `crawler-${monster.id}`,
      slug: `mob-${monster.id}`,
      name: monster.name || `未知怪物 ${monster.id}`,
      level: monster.level ?? 0,
      mapName: monster.map || "未知地图"
    }));
}
