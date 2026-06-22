const fs = require("node:fs");
const path = require("node:path");
const prisma = require("../lib/prisma");
const { exportMonsters } = require("../exportJson");
const { downloadMonsterImage, getMonsterImagePaths, hasMonsterImage } = require("../imageDownloader");
const { fetchMonsterDetail, fetchMonsterList } = require("../list");
const { parseMonsterDetail } = require("../parse");

const startPage = Math.max(1, Number.parseInt(process.env.START_PAGE || "1", 10));
const MAX_CONSECUTIVE_PAGE_FAILURES = 3;
const ignoredIdsPath = path.resolve(__dirname, "..", "data", "ignored-monster-ids.json");
const ignoredIds = new Set(
  fs.existsSync(ignoredIdsPath) ? JSON.parse(fs.readFileSync(ignoredIdsPath, "utf8")) : []
);

async function crawl() {
  let page = startPage;
  let stored = 0;
  let skipped = 0;
  let resumed = 0;
  let ignored = 0;
  let consecutivePageFailures = 0;
  let previousPageSignature = null;

  while (true) {
    console.log(`\npage: ${page}`);

    let ids;
    try {
      const listResult = await fetchMonsterList(page);
      ids = listResult.ids;
      consecutivePageFailures = 0;

      if (listResult.actualPage < page) {
        console.log(`[完成分页] 请求 page=${page}，站点返回 page=${listResult.actualPage}`);
        break;
      }
    } catch (error) {
      consecutivePageFailures += 1;
      console.error(`[页面跳过] page=${page}：${error.message}`);

      if (consecutivePageFailures >= MAX_CONSECUTIVE_PAGE_FAILURES) {
        console.error(`[停止] 连续 ${MAX_CONSECUTIVE_PAGE_FAILURES} 个列表页请求失败`);
        break;
      }

      page += 1;
      continue;
    }

    if (ids.length === 0) {
      console.log(`[完成分页] page=${page} 列表为空`);
      break;
    }

    const pageSignature = ids.join(",");
    if (pageSignature === previousPageSignature) {
      console.log(`[完成分页] page=${page} 与上一页 mobid 相同`);
      break;
    }
    previousPageSignature = pageSignature;

    for (const mobid of ids) {
      console.log(`mobid: ${mobid}`);
      let imageStatusLogged = false;

      if (ignoredIds.has(mobid)) {
        ignored += 1;
        console.log("image downloaded: false");
        console.log("saved: false");
        console.log(`[清理跳过] mobid=${mobid}`);
        continue;
      }

      try {
        const existing = await prisma.monster.findUnique({ where: { id: mobid } });
        const expectedLocalPath = getMonsterImagePaths(mobid).localPath;
        const canResume = existing && (
          existing.image === null ||
          (existing.image === expectedLocalPath && hasMonsterImage(mobid))
        );

        if (canResume) {
          resumed += 1;
          console.log("image downloaded: false");
          imageStatusLogged = true;
          console.log("saved: true");
          console.log(`[断点跳过] mobid=${mobid}`);
          continue;
        }

        const html = await fetchMonsterDetail(mobid);
        const monster = parseMonsterDetail(html, mobid);

        if (!monster) {
          skipped += 1;
          console.log("image downloaded: false");
          imageStatusLogged = true;
          console.log("saved: false");
          console.warn(`[详情跳过] mobid=${mobid} 数据为空`);
          continue;
        }

        const imageResult = await downloadMonsterImage(monster.image, mobid);
        console.log(`image downloaded: ${imageResult.downloaded}`);
        imageStatusLogged = true;

        if (imageResult.failed) {
          skipped += 1;
          console.log("saved: false");
          continue;
        }

        monster.image = imageResult.localPath;

        await prisma.monster.upsert({
          where: { id: monster.id },
          update: monster,
          create: monster
        });

        stored += 1;
        console.log("saved: true");
      } catch (error) {
        skipped += 1;
        if (!imageStatusLogged) console.log("image downloaded: false");
        console.log("saved: false");
        console.error(`[怪物跳过] mobid=${mobid}：${error.message}`);
      }
    }

    await exportMonsters(prisma);
    page += 1;
  }

  console.log(`\n[完成] 入库 ${stored} 条，断点跳过 ${resumed} 条，清理跳过 ${ignored} 条，失败 ${skipped} 条`);
  await exportMonsters(prisma);
}

crawl()
  .catch((error) => {
    console.error(`[终止] ${error.stack || error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
