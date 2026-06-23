"use client";

import { forwardRef, useState, type CSSProperties } from "react";
import type { JobRecommendation } from "@/lib/job-recommendation";
import type { JobResultContent } from "@/lib/job-result-content";
import type { JobPersonaProfile, PersonaTierMeta } from "@/lib/job-persona";
import { getJobResultTheme } from "@/lib/job-result-themes";
import { getQuizJobImageUrl } from "@/lib/quiz-job-images";
import { QuizShareQrCode } from "@/components/quiz/QuizShareQrCode";

type QuizShareCardProps = {
  job: JobRecommendation;
  content: JobResultContent;
  persona: JobPersonaProfile;
  tierMeta: PersonaTierMeta;
  className?: string;
};

function estimateBadgeWidth(text: string) {
  let width = 16;

  for (const char of text) {
    width += /[\u4e00-\u9fff]/.test(char) ? 10 : 6;
  }

  return Math.max(width, 40);
}

function QuizShareBadge({ text, fill }: { text: string; fill: string }) {
  const width = estimateBadgeWidth(text);

  return (
    <span className="quiz-share-card-badge">
      <svg width={width} height={22} viewBox={`0 0 ${width} 22`} aria-hidden="true">
        <rect width={width} height={22} rx={11} fill={fill} />
        <text
          x={width / 2}
          y={12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill="#fde68a"
          fontFamily='-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
        >
          {text}
        </text>
      </svg>
      <span className="sr-only">{text}</span>
    </span>
  );
}

export const QuizShareCard = forwardRef<HTMLDivElement, QuizShareCardProps>(function QuizShareCard(
  { job, content, persona, tierMeta, className },
  ref
) {
  const imageSrc = content.image ? getQuizJobImageUrl(job.id) : null;
  const [portraitLoaded, setPortraitLoaded] = useState(false);
  const theme = getJobResultTheme(job.id);
  const cardClassName = className ? `quiz-share-card ${className}` : "quiz-share-card";

  const cardStyle = {
    "--quiz-share-sky-from": theme.shareSkyFrom,
    "--quiz-share-sky-to": theme.shareSkyTo,
    "--quiz-share-border": theme.shareBorder,
    "--quiz-share-badge-bg": theme.shareBadgeBg,
    "--quiz-share-accent": theme.accent
  } as CSSProperties;

  return (
    <div ref={ref} className={cardClassName} style={cardStyle}>
      <div className="quiz-share-card-sky" aria-hidden="true" />
      <div className="quiz-share-card-inner">
        <div className="quiz-share-card-header">
          <span>冒险岛怀旧服</span>
          <span>冒险者心理诊断</span>
        </div>

        {imageSrc ? (
          <div className="quiz-share-card-portrait-wrap">
            {!portraitLoaded ? <div className="quiz-share-card-portrait-skeleton" aria-hidden="true" /> : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              width={320}
              height={320}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={`quiz-share-card-portrait ${portraitLoaded ? "quiz-share-card-portrait-loaded" : ""}`}
              crossOrigin="anonymous"
              onLoad={() => setPortraitLoaded(true)}
              onError={() => setPortraitLoaded(true)}
            />
          </div>
        ) : (
          <div className="quiz-share-card-portrait-fallback">{job.name.slice(0, 1)}</div>
        )}

        <div className="quiz-share-card-badges">
          <QuizShareBadge text={tierMeta.label} fill={theme.shareBadgeBg} />
          <QuizShareBadge text={tierMeta.subtitle} fill={theme.shareBadgeBg} />
          <QuizShareBadge text={`匹配 ${job.matchRate}%`} fill={theme.shareBadgeBg} />
        </div>

        <h3 className="quiz-share-card-archetype">{persona.archetype}</h3>
        <p className="quiz-share-card-job">{job.name}</p>
        <p className="quiz-share-card-tagline">「{persona.tagline}」</p>

        <div className="quiz-share-card-divider" />

        <p className="quiz-share-card-report">{persona.report.replace(/^报告摘要：/, "")}</p>

        <div className="quiz-share-card-footer-block">
          <p className="quiz-share-card-footer">在重生里，遇见当年的自己</p>
          <QuizShareQrCode />
        </div>
      </div>
    </div>
  );
});
