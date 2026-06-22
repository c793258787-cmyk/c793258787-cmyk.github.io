export const siteName = "冒险岛像素观察站";
export const serverName = "冒险岛怀旧服";
export const siteDescription =
  "为冒险岛怀旧服玩家准备的怪物资料与游戏攻略";

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}
