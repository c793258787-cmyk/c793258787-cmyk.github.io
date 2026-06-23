"use client";

import { useEffect } from "react";
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
  const inWeChat = isWeChatBrowser();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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
      <button type="button" className="quiz-share-preview-backdrop" aria-label="关闭预览" onClick={onClose} />

      <div className="quiz-share-preview-panel">
        <p className="quiz-share-preview-hint">
          {inWeChat
            ? "长按下方图片，选择「保存图片」存入相册，或「转发给朋友」直接发送图片"
            : "长按下方图片保存到相册；保存后在微信聊天中选择图片发送给好友"}
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="冒险岛灵魂职业分享卡片" className="quiz-share-preview-image" />

        <div className="quiz-share-preview-actions">
          {canNativeShare && onShare ? (
            <button type="button" className="quiz-share-preview-btn quiz-share-preview-btn-primary" onClick={onShare} disabled={sharing}>
              {sharing ? "正在唤起分享…" : "系统分享"}
            </button>
          ) : null}
          <button type="button" className="quiz-share-preview-btn" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
