"use client";

import { useState, type RefObject } from "react";
import type { JobRecommendation } from "@/lib/job-recommendation";

type QuizResultShareProps = {
  cardRef: RefObject<HTMLDivElement | null>;
  job: JobRecommendation;
};

function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

function waitForQrCode(root: HTMLElement, timeoutMs = 5000) {
  return new Promise<void>((resolve) => {
    const start = Date.now();

    const check = () => {
      const ready = root.querySelector('.quiz-share-card-qr[data-ready="true"] img');
      if (ready instanceof HTMLImageElement && ready.complete && ready.naturalWidth > 0) {
        resolve();
        return;
      }

      if (Date.now() - start >= timeoutMs) {
        resolve();
        return;
      }

      window.setTimeout(check, 80);
    };

    check();
  });
}

export function QuizResultShare({ cardRef, job }: QuizResultShareProps) {
  const [generating, setGenerating] = useState(false);

  async function handleShare() {
    if (!cardRef.current || generating) return;

    setGenerating(true);

    try {
      await waitForQrCode(cardRef.current);
      await waitForImages(cardRef.current);
      await document.fonts.ready;

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (_doc, clonedElement) => {
          const root =
            clonedElement instanceof HTMLElement
              ? clonedElement
              : _doc.querySelector(".quiz-share-card-hero");

          if (root instanceof HTMLElement) {
            root.style.transform = "none";
            root.style.animation = "none";
          }
        }
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `冒险岛灵魂职业-${job.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      window.alert("图片生成失败，请稍后重试。");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="quiz-share-section quiz-share-section-compact quiz-reveal quiz-reveal-4">
      <button type="button" onClick={handleShare} disabled={generating} className="quiz-share-btn">
        {generating ? "正在生成图片…" : "保存我的灵魂职业卡片"}
      </button>
    </div>
  );
}
