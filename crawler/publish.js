const prisma = require("./lib/prisma");
const { exportMonsters } = require("./exportJson");

exportMonsters(prisma)
  .catch((error) => {
    console.error(`[发布失败] ${error.stack || error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
