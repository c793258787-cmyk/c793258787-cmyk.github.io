import { PrismaClient, ItemType, MonsterElement } from "@prisma/client";

const prisma = new PrismaClient();

const monsters = [
  { slug: "green-snail", name: "绿蜗牛", region: "射手村", level: 1, hp: 8, exp: 3, element: MonsterElement.NEUTRAL, description: "新手最早接触的怪物，行动缓慢，适合熟悉基础操作和收集任务材料。", mapName: "射手训练场一", spawnRate: "极高" },
  { slug: "blue-snail", name: "蓝蜗牛", region: "明珠港", level: 2, hp: 15, exp: 4, element: MonsterElement.NEUTRAL, description: "比绿蜗牛稍强，适合刚出新手村的角色练级和刷壳。", mapName: "小森林小路", spawnRate: "高" },
  { slug: "red-snail", name: "红蜗牛", region: "射手村", level: 4, hp: 45, exp: 8, element: MonsterElement.NEUTRAL, description: "早期血量较高的蜗牛怪，适合顺手刷基础补给和任务材料。", mapName: "射手村东边小山", spawnRate: "高" },
  { slug: "slime", name: "绿水灵", region: "魔法密林", level: 6, hp: 50, exp: 10, element: MonsterElement.NEUTRAL, description: "经典低级练级怪，刷新快、地图紧凑，非常适合新手阶段反复刷怪。", mapName: "南部森林树洞", spawnRate: "极高" },
  { slug: "stump", name: "木妖", region: "勇士部落", level: 8, hp: 80, exp: 14, element: MonsterElement.NEUTRAL, weakness: MonsterElement.FIRE, description: "移动较慢的木系怪物，树枝掉落稳定，适合早期材料收集。", mapName: "勇士部落街角", spawnRate: "高" },
  { slug: "orange-mushroom", name: "蘑菇仔", region: "射手村", level: 10, hp: 120, exp: 18, element: MonsterElement.NEUTRAL, description: "早期热门练级目标，近战和远程职业都能较快清理。", mapName: "蘑菇花园", spawnRate: "高" },
  { slug: "ribbon-pig", name: "漂漂猪", region: "猪的海岸", level: 12, hp: 175, exp: 24, element: MonsterElement.NEUTRAL, description: "金币和低级装备收益不错，是前期刷钱和练级的常见选择。", mapName: "猪的海岸", spawnRate: "极高" },
  { slug: "green-mushroom", name: "绿蘑菇", region: "射手村", level: 15, hp: 250, exp: 32, element: MonsterElement.NEUTRAL, description: "承接 10 级后的稳定练级怪，经验和材料收益都比较均衡。", mapName: "蘑菇森林", spawnRate: "高" },
  { slug: "horny-mushroom", name: "刺蘑菇", region: "蚂蚁洞", level: 22, hp: 550, exp: 55, element: MonsterElement.NEUTRAL, description: "洞穴地图密度高，适合 20 级后持续刷怪提升经验。", mapName: "蚂蚁洞一", spawnRate: "极高" },
  { slug: "evil-eye", name: "邪恶眼", region: "蚂蚁洞", level: 27, hp: 720, exp: 72, element: MonsterElement.DARK, weakness: MonsterElement.HOLY, description: "前中期洞穴怪物，可顺带关注手套卷轴等稀有掉落。", mapName: "蚂蚁洞深处", spawnRate: "高" }
];

const items = [
  { slug: "snail-shell", name: "蜗牛壳", type: ItemType.ETC, vendorValue: 1, description: "新手任务常用材料，也可以少量出售换金币。" },
  { slug: "blue-snail-shell", name: "蓝蜗牛壳", type: ItemType.ETC, vendorValue: 2, description: "从蓝蜗牛身上获得的外壳，常用于早期收集任务。" },
  { slug: "red-snail-shell", name: "红蜗牛壳", type: ItemType.ETC, vendorValue: 3, description: "较硬的蜗牛壳，适合提前囤一些做任务。" },
  { slug: "slime-bubble", name: "绿水灵泡泡", type: ItemType.ETC, vendorValue: 5, description: "绿水灵掉落的黏性泡泡，是低级任务常见材料。" },
  { slug: "tree-branch", name: "树枝", type: ItemType.MATERIAL, vendorValue: 6, description: "木妖掉落的基础材料，可用于任务和制作需求。" },
  { slug: "mushroom-spore", name: "蘑菇孢子", type: ItemType.ETC, vendorValue: 8, description: "蘑菇类怪物掉落的材料，适合刷怪时顺手收集。" },
  { slug: "pig-headband", name: "小猪头巾", type: ItemType.EQUIPMENT, requiredLevel: 10, vendorValue: 120, description: "前期可用的趣味头部装备，提供少量防御。" },
  { slug: "green-bandana", name: "绿色头巾", type: ItemType.EQUIPMENT, requiredLevel: 15, vendorValue: 180, description: "轻便的低级头部装备，适合新手过渡使用。" },
  { slug: "blue-potion", name: "蓝色药水", type: ItemType.USE, vendorValue: 50, description: "恢复少量魔法值，法师和技能练级角色需求较高。" },
  { slug: "glove-dex-scroll-10", name: "手套敏捷卷轴 10%", type: ItemType.USE, vendorValue: 1, description: "稀有强化卷轴，有机会提升手套敏捷属性。" }
];

const drops = [
  ["green-snail", "snail-shell", 0.6200], ["green-snail", "blue-potion", 0.0150],
  ["blue-snail", "blue-snail-shell", 0.6100], ["blue-snail", "blue-potion", 0.0180],
  ["red-snail", "red-snail-shell", 0.5900], ["red-snail", "green-bandana", 0.0030],
  ["slime", "slime-bubble", 0.6000], ["slime", "blue-potion", 0.0250],
  ["stump", "tree-branch", 0.6400], ["stump", "blue-potion", 0.0180],
  ["orange-mushroom", "mushroom-spore", 0.5700], ["orange-mushroom", "green-bandana", 0.0040],
  ["ribbon-pig", "pig-headband", 0.0060], ["ribbon-pig", "blue-potion", 0.0300],
  ["green-mushroom", "mushroom-spore", 0.5900], ["green-mushroom", "green-bandana", 0.0050],
  ["horny-mushroom", "mushroom-spore", 0.6400], ["horny-mushroom", "blue-potion", 0.0400],
  ["evil-eye", "glove-dex-scroll-10", 0.0015], ["evil-eye", "blue-potion", 0.0550]
] as const;

const levelBrackets = [
  {
    minLevel: 1,
    maxLevel: 10,
    title: "新手阶段到一转",
    summary: "优先选择安全、刷新快的低级怪，同时顺手收集任务材料。",
    recommendedMaps: ["射手训练场一", "小森林小路", "南部森林树洞"],
    monsterSlugs: ["green-snail", "blue-snail", "red-snail", "slime"],
    tips: ["选择平坦地图，减少药水消耗。", "蜗牛壳和绿水灵泡泡可以先留着做任务。", "能稳定一到两下击杀后，可以转去刷绿水灵。"]
  },
  {
    minLevel: 11,
    maxLevel: 20,
    title: "维多利亚岛前期刷怪",
    summary: "转向蘑菇和漂漂猪，兼顾经验、金币和低级装备收益。",
    recommendedMaps: ["蘑菇花园", "猪的海岸", "蘑菇森林"],
    monsterSlugs: ["orange-mushroom", "ribbon-pig", "green-mushroom"],
    tips: ["频道不拥挤时优先刷猪的海岸。", "有用的低级装备可以先存仓库，不必急着卖店。", "比起越级打怪，紧凑地图通常效率更高。"]
  },
  {
    minLevel: 21,
    maxLevel: 30,
    title: "蚂蚁洞练级路线",
    summary: "利用洞穴地图的高怪物密度练级，同时关注稀有卷轴掉落。",
    recommendedMaps: ["蚂蚁洞一", "蚂蚁洞深处"],
    monsterSlugs: ["horny-mushroom", "evil-eye"],
    tips: ["进洞前准备足够的蓝色药水。", "纵向地图适合组队分层清怪。", "稀有掉落和普通材料收益建议分开记录。"]
  }
];

async function main() {
  await prisma.drop.deleteMany();
  await prisma.levelBracket.deleteMany();
  await prisma.monster.deleteMany();
  await prisma.item.deleteMany();

  for (const monster of monsters) {
    await prisma.monster.create({ data: monster });
  }

  for (const item of items) {
    await prisma.item.create({ data: item });
  }

  for (const [monsterSlug, itemSlug, chance] of drops) {
    const monster = await prisma.monster.findUniqueOrThrow({ where: { slug: monsterSlug } });
    const item = await prisma.item.findUniqueOrThrow({ where: { slug: itemSlug } });
    await prisma.drop.create({
      data: {
        monsterId: monster.id,
        itemId: item.id,
        chance,
        quantityMin: 1,
        quantityMax: 1
      }
    });
  }

  for (const bracket of levelBrackets) {
    await prisma.levelBracket.create({ data: bracket });
  }
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
