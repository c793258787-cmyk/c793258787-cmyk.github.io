"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isWeChatBrowser } from "@/lib/quiz-export-card";
import { computeImageFitSize } from "@/lib/quiz-share-image-fit";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const [fitSize, setFitSize] = useState<{ width: number; height: number } | null>(null);
  const [stageSize, setStageSize] = useState({ width: 320, height: 520 });
  const inWeChat = isWeChatBrowser();

  useEffect(() => {
    setImageReady(false);
    setFitSize(null);
  }, [imageUrl]);

  useLayoutEffect(() => {
    function measureStage() {
      if (!stageRef.current) {
        return;
      }

      const rect = stageRef.current.getBoundingClientRect();
      setStageSize({
        width: Math.max(240, Math.floor(rect.width - 4)),
        height: Math.max(320, Math.floor(rect.height - 4))
      });
    }

    measureStage();
    window.addEventListener("resize", measureStage);
    window.addEventListener("orientationchange", measureStage);

    return () => {
      window.removeEventListener("resize", measureStage);
      window.removeEventListener("orientationchange", measureStage);
    };
  }, []);

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

  function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget;
    const rect = stageRef.current?.getBoundingClientRect();
    const maxWidth = rect ? Math.max(240, Math.floor(rect.width - 4)) : stageSize.width;
    const maxHeight = rect ? Math.max(320, Math.floor(rect.height - 4)) : stageSize.height;
    const nextFit = computeImageFitSize(img.naturalWidth, img.naturalHeight, maxWidth, maxHeight);
    setFitSize(nextFit);
    setImageReady(true);
  }

  return (
    <div className="quiz-share-preview" role="dialog" aria-modal="true" aria-label="分享卡片预览">
      <div className="quiz-share-preview-topbar">
        <p className="quiz-share-preview-hint">
          {inWeChat
            ? "完整卡片已缩放到一屏内，请长按下方图片 →「保存图片」"
            : "完整卡片已缩放到一屏内，长按下方图片保存"}
        </p>
        <button type="button" className="quiz-share-preview-close" onClick={onClose} aria-label="关闭预览">
          关闭
        </button>
      </div>

      <div ref={stageRef} className="quiz-share-preview-stage">
        <div
          className="quiz-share-preview-image-frame"
          style={fitSize ? { width: fitSize.width, height: fitSize.height } : undefined}
        >
          {!imageReady ? <div className="quiz-share-preview-image-skeleton" aria-hidden="true" /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="冒险岛灵魂职业分享卡片"
            className={`quiz-share-preview-image ${imageReady ? "quiz-share-preview-image-ready" : ""}`}
            width={fitSize?.width}
            height={fitSize?.height}
            onLoad={handleImageLoad}
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
