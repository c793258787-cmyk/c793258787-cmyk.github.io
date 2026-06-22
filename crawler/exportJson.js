const { mkdir, rename, writeFile } = require("node:fs/promises");
const path = require("node:path");

const outputDir = path.resolve(__dirname, "..", "data");
const outputPath = path.join(outputDir, "crawled-monsters.json");

async function exportMonsters(prisma) {
  const monsters = await prisma.monster.findMany({ orderBy: { id: "asc" } });
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;

  await mkdir(outputDir, { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(monsters, null, 2)}\n`, "utf8");
  await rename(temporaryPath, outputPath);
  console.log(`[发布] 已导出 ${monsters.length} 条到 data/crawled-monsters.json`);
}

module.exports = { exportMonsters };
