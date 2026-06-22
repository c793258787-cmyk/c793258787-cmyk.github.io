"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { getQuizShareUrl } from "@/lib/quiz-share-url";

export function QuizShareQrCode() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(getQuizShareUrl(), {
      width: 128,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff"
      }
    })
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!src) {
    return (
      <div className="quiz-share-card-qr" aria-hidden="true">
        <div className="quiz-share-card-qr-placeholder" />
      </div>
    );
  }

  return (
    <div className="quiz-share-card-qr" data-ready="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="quiz-share-card-qr-image" />
      <p className="quiz-share-card-qr-caption">扫码测测你的本命职业</p>
    </div>
  );
}
