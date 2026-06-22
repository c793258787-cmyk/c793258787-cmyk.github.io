import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { MonsterElement, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SqliteMonsterRow = Record<string, unknown>;

const devDbPath = process.env.LOCAL_DEV_DB_PATH ?? path.join(__dirname, "dev.db");
const crawlerDbPath = path.join(__dirname, "..", "crawler", "prisma", "monsters.db");

function ensureDevDb() {
  if (existsSync(devDbPath)) return;

  if (!existsSync(crawlerDbPath)) {
    throw new Error(`本地 dev.db 不存在，且未找到备用库: ${crawlerDbPath}`);
  }

  copyFileSync(crawlerDbPath, devDbPath);
  console.log(`[seed] 已从 ${crawlerDbPath} 复制到 ${devDbPath}`);
}

function readMonstersFromDevDb(): SqliteMonsterRow[] {
  ensureDevDb();

  const output = execFileSync("sqlite3", ["-json", devDbPath, "SELECT * FROM Monster;"], {
    encoding: "utf8"
  }).trim();

  if (!output) return [];

  return JSON.parse(output) as SqliteMonsterRow[];
}

function isFullMonsterRow(row: SqliteMonsterRow) {
  return typeof row.slug === "string" && typeof row.region === "string";
}

function readImage(row: SqliteMonsterRow) {
  return typeof row.image === "string" && row.image.trim() ? row.image.trim() : null;
}

function mapRow(row: SqliteMonsterRow): Prisma.MonsterCreateInput {
  if (isFullMonsterRow(row)) {
    return {
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      region: String(row.region),
      level: Number(row.level),
      hp: Number(row.hp),
      exp: Number(row.exp),
      element: (row.element as MonsterElement) ?? MonsterElement.NEUTRAL,
      weakness: row.weakness ? (row.weakness as MonsterElement) : null,
      description: String(row.description),
      mapName: String(row.mapName),
      spawnRate: String(row.spawnRate),
      image: readImage(row),
      ...(row.createdAt ? { createdAt: new Date(String(row.createdAt)) } : {}),
      ...(row.updatedAt ? { updatedAt: new Date(String(row.updatedAt)) } : {})
    };
  }

  const id = Number(row.id);
  const name = String(row.name ?? `未知怪物 ${id}`);

  return {
    id: `crawler-${id}`,
    slug: `mob-${id}`,
    name,
    region: "爬虫资料",
    level: Number(row.level ?? 0),
    hp: Number(row.hp ?? 0),
    exp: Number(row.exp ?? 0),
    element: MonsterElement.NEUTRAL,
    weakness: null,
    description: `${name}的冒险岛 079 版本资料，数据来源编号 ${id}。`,
    mapName: String(row.map ?? "未知地图"),
    spawnRate: "未知",
    image: readImage(row)
  };
}

async function main() {
  const rows = readMonstersFromDevDb();
  console.log(`[seed] 从 ${devDbPath} 读取 ${rows.length} 条 Monster 记录`);

  if (rows.length === 0) {
    console.log("[seed] 没有可同步的数据，已跳过");
    return;
  }

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const data = mapRow(row);
    const existing = await prisma.monster.findUnique({
      where: { slug: data.slug },
      select: { id: true }
    });

    await prisma.monster.upsert({
      where: { slug: data.slug },
      create: data,
      update: {
        name: data.name,
        region: data.region,
        level: data.level,
        hp: data.hp,
        exp: data.exp,
        element: data.element,
        weakness: data.weakness,
        description: data.description,
        mapName: data.mapName,
        spawnRate: data.spawnRate,
        image: data.image
      }
    });

    if (existing) updated += 1;
    else created += 1;
  }

  const withImage = rows.filter((row) => readImage(row)).length;
  console.log(`[seed] 已同步 ${rows.length} 条 Monster（新增 ${created}，更新 ${updated}，含图片 ${withImage} 条）`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
