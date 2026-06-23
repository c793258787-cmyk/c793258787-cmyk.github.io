"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { JobRecommendation } from "@/lib/job-recommendation";
import {
  canvasToBlob,
  downloadBlob,
  getQuizShareFilename,
  isMobileDevice,
  isWeChatBrowser,
  renderQuizShareCard,
  tryNativeShare
} from "@/lib/quiz-export-card";
import { QuizShareImagePreview } from "@/components/quiz/QuizShareImagePreview";

type QuizResultShareProps = {
  cardRef: RefObject<HTMLDivElement | null>;
  job: JobRecommendation;
};

type PreviewState = {
  imageUrl: string;
  blob: Blob;
  filename: string;
  canNativeShare: boolean;
};

export function QuizResultShare({ cardRef, job }: QuizResultShareProps) {
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function closePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreview(null);
  }

  async function openPreview(blob: Blob, filename: string) {
    const file = new File([blob], filename, { type: "image/png" });
    const canNativeShare = Boolean(
      typeof navigator.share === "function" &&
        ("canShare" in navigator ? navigator.canShare({ files: [file] }) : true)
    );

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const imageUrl = URL.createObjectURL(blob);
    previewUrlRef.current = imageUrl;

    setPreview({
      imageUrl,
      blob,
      filename,
      canNativeShare
    });
  }

  async function handleShare() {
    if (!cardRef.current || generating) return;

    setGenerating(true);

    try {
      const canvas = await renderQuizShareCard(cardRef.current);
      const blob = await canvasToBlob(canvas);
      const filename = getQuizShareFilename(job.name);
      const mobile = isMobileDevice();
      const weChat = isWeChatBrowser();

      if (!mobile && !weChat) {
        downloadBlob(blob, filename);
        return;
      }

      if (!weChat) {
        const result = await tryNativeShare(blob, filename, "我的冒险岛灵魂职业");

        if (result === "shared" || result === "cancelled") {
          return;
        }
      }

      await openPreview(blob, filename);
    } catch {
      window.alert("图片生成失败，请稍后重试。");
    } finally {
      setGenerating(false);
    }
  }

  async function handleNativeShareFromPreview() {
    if (!preview || sharing) return;

    setSharing(true);

    try {
      const result = await tryNativeShare(preview.blob, preview.filename, "我的冒险岛灵魂职业");

      if (result === "shared") {
        closePreview();
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <div className="quiz-share-section quiz-share-section-compact quiz-reveal quiz-reveal-4">
        <button type="button" onClick={handleShare} disabled={generating} className="quiz-share-btn">
          {generating ? "正在生成图片…" : "保存 / 分享卡片"}
        </button>
        <p className="quiz-share-section-tip">生成图片后可保存到相册，或发送给微信好友</p>
      </div>

      {preview ? (
        <QuizShareImagePreview
          imageUrl={preview.imageUrl}
          onClose={closePreview}
          onShare={handleNativeShareFromPreview}
          sharing={sharing}
          canNativeShare={preview.canNativeShare}
        />
      ) : null}
    </>
  );
}
