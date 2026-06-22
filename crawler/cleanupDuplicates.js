const fs = require("node:fs");
const path = require("node:path");
const prisma = require("./lib/prisma");
const { exportMonsters } = require("./exportJson");

const crawlerRoot = __dirname;
const projectRoot = path.resolve(crawlerRoot, "..");
const imageDir = path.join(projectRoot, "public", "images", "monsters");
const databasePath = path.join(crawlerRoot, "prisma", "monsters.db");
const backupDir = path.join(crawlerRoot, "backups");
const ignoredIdsPath = path.join(crawlerRoot, "data", "ignored-monster-ids.json");

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasMapName(monster) {
  return normalizeText(monster.map).length > 0;
}

function completenessScore(monster) {
  let score = 0;
  if (hasMapName(monster)) score += 16;
  if (monster.level != null) score += 8;
  if (monster.hp != null) score += 4;
  if (monster.exp != null) score += 4;
  if (normalizeText(monster.image)) score += 2;
  return score;
}

function pickKeeper(monsters) {
  return [...monsters].sort((left, right) => {
    const scoreDiff = completenessScore(right) - completenessScore(left);
    if (scoreDiff !== 0) return scoreDiff;
    return left.id - right.id;
  })[0];
}

function appendIgnoredIds(removeIds) {
  fs.mkdirSync(path.dirname(ignoredIdsPath), { recursive: true });
  const existingIgnoredIds = fs.existsSync(ignoredIdsPath) ? JSON.parse(fs.readFileSync(ignoredIdsPath, "utf8")) : [];
  const ignoredIds = Array.from(new Set([...existingIgnoredIds, ...removeIds])).sort((a, b) => a - b);
  fs.writeFileSync(ignoredIdsPath, `${JSON.stringify(ignoredIds, null, 2)}\n`);
  return ignoredIds;
}

async function cleanup() {
  const monsters = await prisma.monster.findMany({ orderBy: { id: "asc" } });
  const removeIdSet = new Set();

  for (const monster of monsters) {
    if (!hasMapName(monster)) removeIdSet.add(monster.id);
  }

  const withMap = monsters.filter((monster) => !removeIdSet.has(monster.id));
  const groups = new Map();

  for (const monster of withMap) {
    const name = normalizeText(monster.name);
    if (!name) {
      removeIdSet.add(monster.id);
      continue;
    }

    const group = groups.get(name) || [];
    group.push(monster);
    groups.set(name, group);
  }

  const duplicateGroups = [];

  for (const [name, group] of groups.entries()) {
    if (group.length <= 1) continue;

    const keeper = pickKeeper(group);
    const remove = group.filter((monster) => monster.id !== keeper.id);
    duplicateGroups.push({ name, keep: keeper.id, remove: remove.map((monster) => monster.id) });
    for (const monster of remove) removeIdSet.add(monster.id);
  }

  const removeIds = Array.from(removeIdSet).sort((a, b) => a - b);

  if (removeIds.length === 0) {
    console.log("[清理] 没有需要删除的数据");
    return;
  }

  const runId = timestamp();
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `monsters-${runId}.db`);
  const reportPath = path.join(backupDir, `cleanup-${runId}.json`);
  fs.copyFileSync(databasePath, backupPath);
  fs.writeFileSync(
    reportPath,
    `${JSON.stringify(
      {
        removedCount: removeIds.length,
        remainingCount: monsters.length - removeIds.length,
        removedWithoutMap: monsters.filter((monster) => !hasMapName(monster)).map((monster) => monster.id),
        duplicateGroups
      },
      null,
      2
    )}\n`
  );

  await prisma.monster.deleteMany({ where: { id: { in: removeIds } } });

  const ignoredIds = appendIgnoredIds(removeIds);

  for (const id of removeIds) {
    fs.rmSync(path.join(imageDir, `${id}.png`), { force: true });
  }

  await exportMonsters(prisma);

  console.log(`[清理完成] 删除 ${removeIds.length} 条，保留 ${monsters.length - removeIds.length} 条`);
  console.log(`[无地图] ${monsters.filter((monster) => !hasMapName(monster)).length} 条`);
  console.log(`[重名去重] ${duplicateGroups.reduce((sum, group) => sum + group.remove.length, 0)} 条`);
  console.log(`[数据库备份] ${backupPath}`);
  console.log(`[审计报告] ${reportPath}`);
  console.log(`[忽略清单] ${ignoredIdsPath} (${ignoredIds.length} 个 ID)`);
}

cleanup()
  .catch((error) => {
    console.error(`[清理失败] ${error.stack || error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
