"use client";

import { useEffect, useRef, useState } from "react";
import { isWeChatBrowser } from "@/lib/quiz-export-card";

type QuizShareImagePreviewProps = {
  imageUrl: string;
  onClose: () => void;
  onShare?: () => void;
  sharing?: boolean;
  canNativeShare?: boolean;
};

export function QuizShareImagePreview({
  imageUrl,
  onClose,
  onShare,
  sharing = false,
  canNativeShare = false
}: QuizShareImagePreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const inWeChat = isWeChatBrowser();

  useEffect(() => {
    setImageReady(false);
  }, [imageUrl]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [imageUrl]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="quiz-share-preview" role="dialog" aria-modal="true" aria-label="分享卡片预览">
      <div className="quiz-share-preview-topbar">
        <p className="quiz-share-preview-hint">
          {inWeChat
            ? "长按下方完整图片 →「保存图片」或「转发给朋友」"
            : "长按下方完整图片保存；保存后在微信聊天中选择图片发送"}
        </p>
        <button type="button" className="quiz-share-preview-close" onClick={onClose} aria-label="关闭预览">
          关闭
        </button>
      </div>

      <div ref={scrollRef} className="quiz-share-preview-scroll">
        <div className="quiz-share-preview-image-wrap">
          {!imageReady ? <div className="quiz-share-preview-image-skeleton" aria-hidden="true" /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="冒险岛灵魂职业分享卡片"
            className={`quiz-share-preview-image ${imageReady ? "quiz-share-preview-image-ready" : ""}`}
            onLoad={() => setImageReady(true)}
          />
        </div>
        <p className="quiz-share-preview-footnote">↑ 可上下滑动查看完整卡片，请长按图片本身保存</p>
      </div>

      {canNativeShare && onShare ? (
        <div className="quiz-share-preview-footer">
          <button
            type="button"
            className="quiz-share-preview-btn quiz-share-preview-btn-primary"
            onClick={onShare}
            disabled={sharing}
          >
            {sharing ? "正在唤起分享…" : "系统分享"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
