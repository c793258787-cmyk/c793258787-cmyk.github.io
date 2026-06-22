import { absoluteUrl } from "@/lib/seo";

/** 分享卡片二维码：客户端用当前域名，避免构建时未注入 NEXT_PUBLIC_SITE_URL 导致指向 localhost */
export function getQuizShareUrl() {
  if (typeof window !== "undefined") {
    return new URL("/quiz", window.location.origin).href;
  }

  return absoluteUrl("/quiz");
}
