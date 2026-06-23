"use client";

import { useEffect, useState } from "react";
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
            ? "完整卡片已适配一屏显示，长按图片 →「保存图片」或「转发给朋友」"
            : "完整卡片已适配一屏显示，长按图片保存后可在微信发送"}
        </p>
        <button type="button" className="quiz-share-preview-close" onClick={onClose} aria-label="关闭预览">
          关闭
        </button>
      </div>

      <div className="quiz-share-preview-stage">
        <div className="quiz-share-preview-image-frame">
          {!imageReady ? <div className="quiz-share-preview-image-skeleton" aria-hidden="true" /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="冒险岛灵魂职业分享卡片"
            className={`quiz-share-preview-image ${imageReady ? "quiz-share-preview-image-ready" : ""}`}
            onLoad={() => setImageReady(true)}
          />
        </div>
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
