import type { Decimal } from "@prisma/client/runtime/library";

export function formatDropChance(chance: Decimal | number) {
  return `${(Number(chance) * 100).toFixed(Number(chance) < 0.01 ? 2 : 1)}%`;
}

const labels: Record<string, string> = {
  EQUIPMENT: "装备",
  USE: "消耗",
  ETC: "其他",
  MATERIAL: "材料",
  QUEST: "任务",
  NEUTRAL: "无属性",
  FIRE: "火属性",
  ICE: "冰属性",
  LIGHTNING: "雷属性",
  POISON: "毒属性",
  HOLY: "圣属性",
  DARK: "暗属性"
};

export function titleCase(value: string) {
  return labels[value] ?? value;
}

export function formatMonsterMapLabel(mapName: string | null | undefined) {
  const map = mapName?.trim();
  if (map && map !== "未知地图") return map;
  return "地图信息暂缺";
}

export function formatMonsterHeaderDescription(mapName: string | null | undefined) {
  const map = mapName?.trim();
  if (map && map !== "未知地图") return `出没地图：${map}`;
  return "地图信息暂缺";
}
