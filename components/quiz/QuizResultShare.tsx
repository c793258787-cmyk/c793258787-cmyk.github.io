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

function waitForPortrait(root: HTMLElement | null) {
  if (!root) {
    return Promise.resolve();
  }

  const img = root.querySelector(".quiz-share-card-portrait");

  if (!(img instanceof HTMLImageElement) || (img.complete && img.naturalWidth > 0)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

export function QuizResultShare({ cardRef, job }: QuizResultShareProps) {
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [exportReady, setExportReady] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const exportCacheRef = useRef<{ jobId: string; blob: Blob } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    exportCacheRef.current = null;
    setExportReady(false);

    const warmExport = async () => {
      await waitForPortrait(cardRef.current);

      if (cancelled || !cardRef.current) {
        return;
      }

      try {
        const canvas = await renderQuizShareCard(cardRef.current);
        const blob = await canvasToBlob(canvas);

        if (cancelled) {
          return;
        }

        exportCacheRef.current = { jobId: job.id, blob };
        setExportReady(true);
      } catch {
        if (!cancelled) {
          setExportReady(false);
        }
      }
    };

    const startWarm = () => {
      void warmExport();
    };

    let idleId = 0;
    let timerId = 0;
    const hasIdleCallback = typeof window.requestIdleCallback === "function";

    if (hasIdleCallback) {
      idleId = window.requestIdleCallback(startWarm, { timeout: 1200 });
    } else {
      timerId = window.setTimeout(startWarm, 500);
    }

    return () => {
      cancelled = true;

      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }

      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [cardRef, job.id]);

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

  async function deliverBlob(blob: Blob, filename: string) {
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
  }

  async function handleShare() {
    if (!cardRef.current || generating) return;

    const filename = getQuizShareFilename(job.name);
    const cached = exportCacheRef.current?.jobId === job.id ? exportCacheRef.current.blob : null;

    if (cached) {
      await deliverBlob(cached, filename);
      return;
    }

    setGenerating(true);

    try {
      const canvas = await renderQuizShareCard(cardRef.current);
      const blob = await canvasToBlob(canvas);
      exportCacheRef.current = { jobId: job.id, blob };
      setExportReady(true);
      await deliverBlob(blob, filename);
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

  const buttonLabel = generating ? "正在生成图片…" : exportReady ? "保存 / 分享卡片" : "准备分享卡片…";

  return (
    <>
      <div className="quiz-share-section quiz-share-section-compact quiz-reveal quiz-reveal-4">
        <button
          type="button"
          onClick={handleShare}
          disabled={generating}
          className="quiz-share-btn"
        >
          {buttonLabel}
        </button>
        <p className="quiz-share-section-tip">
          {exportReady ? "生成图片后可保存到相册，或发送给微信好友" : "正在后台准备高清分享图，请稍候…"}
        </p>
      </div>

      {generating ? (
        <div className="quiz-share-generating" role="status" aria-live="polite">
          <div className="quiz-share-generating-spinner" aria-hidden="true" />
          <p className="quiz-share-generating-title">正在生成分享卡片</p>
          <p className="quiz-share-generating-sub">马上就好，请不要关闭页面</p>
        </div>
      ) : null}

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
