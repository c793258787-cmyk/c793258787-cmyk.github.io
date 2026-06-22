const axios = require("axios");
const { existsSync } = require("node:fs");
const { mkdir, rename, unlink, writeFile } = require("node:fs/promises");
const path = require("node:path");

const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 500;
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "public", "images", "monsters");

const http = axios.create({
  timeout: 15000,
  maxContentLength: 10 * 1024 * 1024,
  maxBodyLength: 10 * 1024 * 1024,
  responseType: "arraybuffer",
  headers: {
    Accept: "image/*",
    "User-Agent": "MapleStory-Reborn-Tools-Crawler/1.0 (+data-research; low-rate)"
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

function getMonsterImagePaths(mobid) {
  const filename = `${Number(mobid)}.png`;
  return {
    absolutePath: path.join(outputDir, filename),
    localPath: `/images/monsters/${filename}`
  };
}

function hasMonsterImage(mobid) {
  return existsSync(getMonsterImagePaths(mobid).absolutePath);
}

async function downloadMonsterImage(imageUrl, mobid) {
  const { absolutePath, localPath } = getMonsterImagePaths(mobid);

  if (!imageUrl) {
    return { downloaded: false, failed: false, localPath: null };
  }

  if (existsSync(absolutePath)) {
    return { downloaded: false, failed: false, localPath };
  }

  await mkdir(outputDir, { recursive: true });
  const temporaryPath = `${absolutePath}.${process.pid}.tmp`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await sleep(randomDelay());

    try {
      const response = await http.get(imageUrl);
      const contentType = String(response.headers["content-type"] || "");

      if (!contentType.startsWith("image/") || response.data.byteLength === 0) {
        throw new Error(`无效图片响应 (${contentType || "unknown"})`);
      }

      await writeFile(temporaryPath, response.data);
      await rename(temporaryPath, absolutePath);
      return { downloaded: true, failed: false, localPath };
    } catch (error) {
      await unlink(temporaryPath).catch(() => {});
      console.error(`[图片失败] mobid=${mobid}，尝试 ${attempt}/2：${error.message}`);
    }
  }

  return { downloaded: false, failed: true, localPath: null };
}

module.exports = {
  downloadMonsterImage,
  getMonsterImagePaths,
  hasMonsterImage
};
