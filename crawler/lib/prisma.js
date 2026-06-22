const { execFileSync } = require("node:child_process");
const { closeSync, existsSync, mkdirSync, openSync } = require("node:fs");
const path = require("node:path");

const crawlerRoot = path.resolve(__dirname, "..");
const schemaPath = path.join(crawlerRoot, "prisma", "schema.prisma");
const clientEntry = path.join(crawlerRoot, "generated", "client", "index.js");
const databaseDir = path.join(crawlerRoot, "prisma");
const prismaCli = require.resolve("prisma/build/index.js");

function runPrisma(...command) {
  execFileSync(process.execPath, [prismaCli, ...command, "--schema", schemaPath], {
    cwd: crawlerRoot,
    stdio: "inherit"
  });
}

function ensureCrawlerDatabase() {
  mkdirSync(databaseDir, { recursive: true });

  if (!existsSync(clientEntry)) {
    console.log("[setup] 正在生成爬虫专用 Prisma Client...");
    runPrisma("generate");
  }

  if (!existsSync(path.join(databaseDir, "monsters.db"))) {
    console.log("[setup] 正在初始化 SQLite 数据库...");
    closeSync(openSync(path.join(databaseDir, "monsters.db"), "a"));
    runPrisma("db", "push");
  }
}

ensureCrawlerDatabase();

const { PrismaClient } = require(clientEntry);

const globalKey = "__mapleCrawlerPrisma";
const prisma = global[globalKey] || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global[globalKey] = prisma;
}

module.exports = prisma;
