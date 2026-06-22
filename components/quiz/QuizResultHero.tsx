"use client";

import { useRef } from "react";
import type { JobRecommendation } from "@/lib/job-recommendation";
import type { JobResultContent } from "@/lib/job-result-content";
import type { JobPersonaProfile, PersonaTierMeta } from "@/lib/job-persona";
import { QuizShareCard } from "@/components/quiz/QuizShareCard";
import { QuizResultShare } from "@/components/quiz/QuizResultShare";

type QuizResultHeroProps = {
  job: JobRecommendation;
  content: JobResultContent;
  persona: JobPersonaProfile;
  tierMeta: PersonaTierMeta;
};

export function QuizResultHero({ job, content, persona, tierMeta }: QuizResultHeroProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="quiz-result-hero">
      <div className="quiz-result-hero-card quiz-animate-in">
        <QuizShareCard
          ref={cardRef}
          job={job}
          content={content}
          persona={persona}
          tierMeta={tierMeta}
          className="quiz-share-card-hero"
        />
      </div>

      <div className="quiz-result-hero-supplement quiz-animate-in">
        <div className="quiz-share-card quiz-share-card-supplement">
          <div className="quiz-share-card-inner">
            <blockquote className="quiz-persona-mirror">{persona.mirror}</blockquote>
            <div className="quiz-share-card-divider" />
            <p className="quiz-persona-legacy">{content.resonance}</p>
          </div>
        </div>
      </div>

      <QuizResultShare cardRef={cardRef} job={job} />
    </div>
  );
}
