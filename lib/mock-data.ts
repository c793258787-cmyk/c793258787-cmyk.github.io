const now = new Date("2026-01-01T00:00:00.000Z");

export const mockMonsters = [
  { id: "monster-green-snail", slug: "green-snail", name: "绿蜗牛", region: "射手村", level: 1, hp: 8, exp: 3, element: "NEUTRAL", weakness: null, description: "新手最早接触的怪物，行动缓慢，适合熟悉基础操作和收集任务材料。", mapName: "射手训练场一", spawnRate: "极高", createdAt: now, updatedAt: now },
  { id: "monster-blue-snail", slug: "blue-snail", name: "蓝蜗牛", region: "明珠港", level: 2, hp: 15, exp: 4, element: "NEUTRAL", weakness: null, description: "比绿蜗牛稍强，适合刚出新手村的角色练级和刷壳。", mapName: "小森林小路", spawnRate: "高", createdAt: now, updatedAt: now },
  { id: "monster-red-snail", slug: "red-snail", name: "红蜗牛", region: "射手村", level: 4, hp: 45, exp: 8, element: "NEUTRAL", weakness: null, description: "早期血量较高的蜗牛怪，适合顺手刷基础补给和任务材料。", mapName: "射手村东边小山", spawnRate: "高", createdAt: now, updatedAt: now },
  { id: "monster-slime", slug: "slime", name: "绿水灵", region: "魔法密林", level: 6, hp: 50, exp: 10, element: "NEUTRAL", weakness: null, description: "经典低级练级怪，刷新快、地图紧凑，非常适合新手阶段反复刷怪。", mapName: "南部森林树洞", spawnRate: "极高", createdAt: now, updatedAt: now },
  { id: "monster-stump", slug: "stump", name: "木妖", region: "勇士部落", level: 8, hp: 80, exp: 14, element: "NEUTRAL", weakness: "FIRE", description: "移动较慢的木系怪物，树枝掉落稳定，适合早期材料收集。", mapName: "勇士部落街角", spawnRate: "高", createdAt: now, updatedAt: now },
  { id: "monster-orange-mushroom", slug: "orange-mushroom", name: "蘑菇仔", region: "射手村", level: 10, hp: 120, exp: 18, element: "NEUTRAL", weakness: null, description: "早期热门练级目标，近战和远程职业都能较快清理。", mapName: "蘑菇花园", spawnRate: "高", createdAt: now, updatedAt: now },
  { id: "monster-ribbon-pig", slug: "ribbon-pig", name: "漂漂猪", region: "猪的海岸", level: 12, hp: 175, exp: 24, element: "NEUTRAL", weakness: null, description: "金币和低级装备收益不错，是前期刷钱和练级的常见选择。", mapName: "猪的海岸", spawnRate: "极高", createdAt: now, updatedAt: now },
  { id: "monster-green-mushroom", slug: "green-mushroom", name: "绿蘑菇", region: "射手村", level: 15, hp: 250, exp: 32, element: "NEUTRAL", weakness: null, description: "承接 10 级后的稳定练级怪，经验和材料收益都比较均衡。", mapName: "蘑菇森林", spawnRate: "高", createdAt: now, updatedAt: now },
  { id: "monster-horny-mushroom", slug: "horny-mushroom", name: "刺蘑菇", region: "蚂蚁洞", level: 22, hp: 550, exp: 55, element: "NEUTRAL", weakness: null, description: "洞穴地图密度高，适合 20 级后持续刷怪提升经验。", mapName: "蚂蚁洞一", spawnRate: "极高", createdAt: now, updatedAt: now },
  { id: "monster-evil-eye", slug: "evil-eye", name: "邪恶眼", region: "蚂蚁洞", level: 27, hp: 720, exp: 72, element: "DARK", weakness: "HOLY", description: "前中期洞穴怪物，可顺带关注手套卷轴等稀有掉落。", mapName: "蚂蚁洞深处", spawnRate: "高", createdAt: now, updatedAt: now }
] as const;

export const mockItems = [
  { id: "item-snail-shell", slug: "snail-shell", name: "蜗牛壳", type: "ETC", requiredLevel: null, vendorValue: 1, description: "新手任务常用材料，也可以少量出售换金币。", createdAt: now, updatedAt: now },
  { id: "item-blue-snail-shell", slug: "blue-snail-shell", name: "蓝蜗牛壳", type: "ETC", requiredLevel: null, vendorValue: 2, description: "从蓝蜗牛身上获得的外壳，常用于早期收集任务。", createdAt: now, updatedAt: now },
  { id: "item-red-snail-shell", slug: "red-snail-shell", name: "红蜗牛壳", type: "ETC", requiredLevel: null, vendorValue: 3, description: "较硬的蜗牛壳，适合提前囤一些做任务。", createdAt: now, updatedAt: now },
  { id: "item-slime-bubble", slug: "slime-bubble", name: "绿水灵泡泡", type: "ETC", requiredLevel: null, vendorValue: 5, description: "绿水灵掉落的黏性泡泡，是低级任务常见材料。", createdAt: now, updatedAt: now },
  { id: "item-tree-branch", slug: "tree-branch", name: "树枝", type: "MATERIAL", requiredLevel: null, vendorValue: 6, description: "木妖掉落的基础材料，可用于任务和制作需求。", createdAt: now, updatedAt: now },
  { id: "item-mushroom-spore", slug: "mushroom-spore", name: "蘑菇孢子", type: "ETC", requiredLevel: null, vendorValue: 8, description: "蘑菇类怪物掉落的材料，适合刷怪时顺手收集。", createdAt: now, updatedAt: now },
  { id: "item-pig-headband", slug: "pig-headband", name: "小猪头巾", type: "EQUIPMENT", requiredLevel: 10, vendorValue: 120, description: "前期可用的趣味头部装备，提供少量防御。", createdAt: now, updatedAt: now },
  { id: "item-green-bandana", slug: "green-bandana", name: "绿色头巾", type: "EQUIPMENT", requiredLevel: 15, vendorValue: 180, description: "轻便的低级头部装备，适合新手过渡使用。", createdAt: now, updatedAt: now },
  { id: "item-blue-potion", slug: "blue-potion", name: "蓝色药水", type: "USE", requiredLevel: null, vendorValue: 50, description: "恢复少量魔法值，法师和技能练级角色需求较高。", createdAt: now, updatedAt: now },
  { id: "item-glove-dex-scroll-10", slug: "glove-dex-scroll-10", name: "手套敏捷卷轴 10%", type: "USE", requiredLevel: null, vendorValue: 1, description: "稀有强化卷轴，有机会提升手套敏捷属性。", createdAt: now, updatedAt: now }
] as const;

const dropSeed = [
  ["green-snail", "snail-shell", 0.62], ["green-snail", "blue-potion", 0.015],
  ["blue-snail", "blue-snail-shell", 0.61], ["blue-snail", "blue-potion", 0.018],
  ["red-snail", "red-snail-shell", 0.59], ["red-snail", "green-bandana", 0.003],
  ["slime", "slime-bubble", 0.6], ["slime", "blue-potion", 0.025],
  ["stump", "tree-branch", 0.64], ["stump", "blue-potion", 0.018],
  ["orange-mushroom", "mushroom-spore", 0.57], ["orange-mushroom", "green-bandana", 0.004],
  ["ribbon-pig", "pig-headband", 0.006], ["ribbon-pig", "blue-potion", 0.03],
  ["green-mushroom", "mushroom-spore", 0.59], ["green-mushroom", "green-bandana", 0.005],
  ["horny-mushroom", "mushroom-spore", 0.64], ["horny-mushroom", "blue-potion", 0.04],
  ["evil-eye", "glove-dex-scroll-10", 0.0015], ["evil-eye", "blue-potion", 0.055]
] as const;

export const mockDrops = dropSeed.map(([monsterSlug, itemSlug, chance], index) => {
  const monster = mockMonsters.find((entry) => entry.slug === monsterSlug)!;
  const item = mockItems.find((entry) => entry.slug === itemSlug)!;
  return {
    id: `drop-${index + 1}`,
    monsterId: monster.id,
    itemId: item.id,
    chance,
    quantityMin: 1,
    quantityMax: 1,
    notes: null,
    createdAt: now,
    updatedAt: now,
    monster,
    item
  };
});

export const mockLevelBrackets = [
  { id: "level-1-10", minLevel: 1, maxLevel: 10, title: "新手阶段到一转", summary: "优先选择安全、刷新快的低级怪，同时顺手收集任务材料。", recommendedMaps: ["射手训练场一", "小森林小路", "南部森林树洞"], monsterSlugs: ["green-snail", "blue-snail", "red-snail", "slime"], tips: ["选择平坦地图，减少药水消耗。", "蜗牛壳和绿水灵泡泡可以先留着做任务。", "能稳定一到两下击杀后，可以转去刷绿水灵。"], createdAt: now, updatedAt: now },
  { id: "level-11-20", minLevel: 11, maxLevel: 20, title: "维多利亚岛前期刷怪", summary: "转向蘑菇和漂漂猪，兼顾经验、金币和低级装备收益。", recommendedMaps: ["蘑菇花园", "猪的海岸", "蘑菇森林"], monsterSlugs: ["orange-mushroom", "ribbon-pig", "green-mushroom"], tips: ["频道不拥挤时优先刷猪的海岸。", "有用的低级装备可以先存仓库，不必急着卖店。", "比起越级打怪，紧凑地图通常效率更高。"], createdAt: now, updatedAt: now },
  { id: "level-21-30", minLevel: 21, maxLevel: 30, title: "蚂蚁洞练级路线", summary: "利用洞穴地图的高怪物密度练级，同时关注稀有卷轴掉落。", recommendedMaps: ["蚂蚁洞一", "蚂蚁洞深处"], monsterSlugs: ["horny-mushroom", "evil-eye"], tips: ["进洞前准备足够的蓝色药水。", "纵向地图适合组队分层清怪。", "稀有掉落和普通材料收益建议分开记录。"], createdAt: now, updatedAt: now }
] as const;

export function mockMonsterWithDrops(slug: string) {
  const monster = mockMonsters.find((entry) => entry.slug === slug);
  return monster ? { ...monster, drops: mockDrops.filter((drop) => drop.monster.slug === slug) } : null;
}

export function mockItemWithDrops(slug: string) {
  const item = mockItems.find((entry) => entry.slug === slug);
  return item ? { ...item, drops: mockDrops.filter((drop) => drop.item.slug === slug) } : null;
}
