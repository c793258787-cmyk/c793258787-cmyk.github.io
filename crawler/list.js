const axios = require("axios");
const { parseListApiUrl, parseMobIds } = require("./parse");

const BASE_URL = "https://mxd079.dvg.cn";
const PAGE_SIZE = 40;
const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 500;

const http = axios.create({
  timeout: 15000,
  headers: {
    Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
    "User-Agent": "MapleStory-Reborn-Tools-Crawler/1.0 (+data-research; low-rate)"
  },
  validateStatus: (status) => status >= 200 && status < 300
});

let listApiUrl = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

async function requestWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await sleep(randomDelay());

    try {
      return await http.get(url, options);
    } catch (error) {
      lastError = error;
      console.error(`[请求失败] ${url}，尝试 ${attempt}/2：${error.message}`);
    }
  }

  throw lastError;
}

async function discoverListApi() {
  if (listApiUrl) return listApiUrl;

  const listPageUrl = new URL("/mob_list.php", BASE_URL);
  listPageUrl.search = new URLSearchParams({
    page: "1",
    pageSize: String(PAGE_SIZE),
    sortKey: "mobid",
    sortDir: "asc"
  }).toString();

  const response = await requestWithRetry(listPageUrl.toString());
  listApiUrl = parseListApiUrl(response.data);

  if (!listApiUrl) throw new Error("无法从 mob_list.php 发现列表 API");
  return listApiUrl;
}

async function fetchMonsterList(page) {
  const apiUrl = await discoverListApi();
  const response = await requestWithRetry(apiUrl, {
    params: {
      page,
      pageSize: PAGE_SIZE,
      sortKey: "mobid",
      sortDir: "asc"
    },
    headers: { Accept: "application/json" }
  });

  const ids = parseMobIds(response.data);
  const actualPage = Number(response.data?.meta?.page) || page;
  return { actualPage, ids };
}

async function fetchMonsterDetail(mobid) {
  const url = new URL("/mob_info.php", BASE_URL);
  url.searchParams.set("id", String(mobid));
  const response = await requestWithRetry(url.toString());
  return response.data;
}

module.exports = {
  fetchMonsterDetail,
  fetchMonsterList
};
