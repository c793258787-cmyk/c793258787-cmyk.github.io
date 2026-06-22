export type HomePromoConfig = {
  enabled: boolean;
  href: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  alt?: string;
  openInNewTab?: boolean;
};

/** 本地默认配置：改这里即可；部署时也可用环境变量覆盖 */
export const homePromoConfig: HomePromoConfig = {
  enabled: true,
  href: "/quiz",
  image: "/promo/quiz-float.png",
  imageWidth: 1024,
  imageHeight: 1024,
  alt: "职业本命测试",
  openInNewTab: false
};

function envOverride(key: string) {
  return process.env[key]?.trim() || undefined;
}

export function getHomePromo(): HomePromoConfig | null {
  const enabled =
    envOverride("NEXT_PUBLIC_HOME_PROMO_ENABLED") === "true" ||
    (envOverride("NEXT_PUBLIC_HOME_PROMO_ENABLED") !== "false" && homePromoConfig.enabled);

  const href = envOverride("NEXT_PUBLIC_HOME_PROMO_HREF") ?? homePromoConfig.href;
  const image = envOverride("NEXT_PUBLIC_HOME_PROMO_IMAGE") ?? homePromoConfig.image;

  if (!enabled || !href || !image) {
    return null;
  }

  return {
    enabled: true,
    href,
    image,
    imageWidth: Number(envOverride("NEXT_PUBLIC_HOME_PROMO_IMAGE_WIDTH")) || homePromoConfig.imageWidth || 1024,
    imageHeight: Number(envOverride("NEXT_PUBLIC_HOME_PROMO_IMAGE_HEIGHT")) || homePromoConfig.imageHeight || 341,
    alt: envOverride("NEXT_PUBLIC_HOME_PROMO_ALT") ?? homePromoConfig.alt,
    openInNewTab:
      envOverride("NEXT_PUBLIC_HOME_PROMO_NEW_TAB") === "true" || homePromoConfig.openInNewTab === true
  };
}
