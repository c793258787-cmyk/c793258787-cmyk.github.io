import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "加入群聊",
  description: "扫描微信二维码，添加作者或加入冒险岛像素报团。"
};

const qrCards = [
  {
    src: "/community/wechat-author.png",
    alt: "添加作者微信：像素观察员"
  },
  {
    src: "/community/group-1.png",
    alt: "【冒险岛】像素报团 1 群"
  },
  {
    src: "/community/group-2.png",
    alt: "【冒险岛】像素报团 2 群"
  }
] as const;

export default function CommunityPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <h1 className="text-center text-2xl font-semibold text-zinc-100">加入群聊</h1>
        <p className="mt-2 text-center text-sm text-zinc-400 sm:text-base">
          微信扫码添加作者，或加入玩家交流群。群聊二维码失效可添加作者
        </p>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-xl border border-zinc-700/60 bg-white">
          <div className="flex flex-col divide-y divide-zinc-300 sm:flex-row sm:divide-x sm:divide-y-0">
            {qrCards.map((card) => (
              <div key={card.src} className="flex flex-1 items-center justify-center p-4 sm:p-5">
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={320}
                  height={480}
                  className="h-auto w-full max-w-[280px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
