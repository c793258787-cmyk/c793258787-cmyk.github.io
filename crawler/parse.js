const cheerio = require("cheerio");

const BASE_URL = "https://mxd079.dvg.cn";

function toInteger(value) {
  const normalized = String(value ?? "").replace(/,/g, "").match(/-?\d+/);
  return normalized ? Number.parseInt(normalized[0], 10) : null;
}

function absoluteUrl(value) {
  if (!value) return null;

  try {
    return new URL(value, BASE_URL).toString();
  } catch {
    return null;
  }
}

function readStat($, label) {
  const labelNode = $("div")
    .filter((_, element) => $(element).children().length === 0 && $(element).text().trim() === label)
    .first();

  return toInteger(labelNode.next("div").text());
}

function parseMonsterDetail(html, mobid) {
  const $ = cheerio.load(html);
  const name = $("main h1").first().text().trim() || null;
  const level = readStat($, "等级");
  const hp = readStat($, "HP");
  const exp = readStat($, "EXP");
  const image = absoluteUrl($("[data-ui-item-tip='mxd-mob'] img").first().attr("src"));
  const map = $("a[href^='/map_info.php?id=']").first().text().trim() || null;

  if (!name && level === null && hp === null && exp === null) {
    return null;
  }

  return {
    id: Number(mobid),
    name,
    level,
    hp,
    exp,
    image,
    map
  };
}

function parseListApiUrl(html) {
  const $ = cheerio.load(html);
  const scripts = $("script").map((_, element) => $(element).html() || "").get().join("\n");
  const match = scripts.match(/apiUrl\s*:\s*['\"]([^'\"]+)['\"]/);
  return absoluteUrl(match?.[1] || "/api/mob-list.php");
}

function parseMobIds(payload) {
  if (!payload || payload.ok !== true || !Array.isArray(payload.items)) return [];

  return [...new Set(payload.items
    .map((item) => toInteger(item?.mobid))
    .filter((id) => Number.isInteger(id) && id > 0))];
}

module.exports = {
  parseListApiUrl,
  parseMobIds,
  parseMonsterDetail
};
