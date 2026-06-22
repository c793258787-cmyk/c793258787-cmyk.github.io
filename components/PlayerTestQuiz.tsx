"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { JobRecommendationResults } from "@/components/JobRecommendationResults";
import { QuizAtmosphere } from "@/components/quiz/QuizAtmosphere";
import { QuizResultHero } from "@/components/quiz/QuizResultHero";
import { jobResultContent } from "@/lib/job-result-content";
import { getJobPersona, personaTierMeta, resolvePersonaTier } from "@/lib/job-persona";
import { calculateRecommendation } from "@/lib/job-recommendation";
import { applyEffect, createEmptyScores, questions, type TestEffect } from "@/lib/test-questions";

type Phase = "intro" | "quiz" | "result";

export function PlayerTestQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(createEmptyScores);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const question = questions[step];
  const progress = phase === "result" ? 100 : Math.round((step / questions.length) * 100);

  const recommendations = useMemo(() => calculateRecommendation(scores), [scores]);
  const topJob = recommendations[0];

  const personaTier = useMemo(() => resolvePersonaTier(scores), [scores]);
  const tierMeta = personaTierMeta[personaTier];
  const jobPersona = topJob ? getJobPersona(topJob.id, personaTier) : null;

  function handleSelect(effect: TestEffect, index: number) {
    if (transitioning) return;

    setSelectedIndex(index);
    setTransitioning(true);

    window.setTimeout(() => {
      const nextScores = { ...scores };
      applyEffect(nextScores, effect);
      setScores(nextScores);
      setSelectedIndex(null);

      if (step >= questions.length - 1) {
        setPhase("result");
        setTransitioning(false);
        return;
      }

      setStep((current) => current + 1);
      setTransitioning(false);
    }, 420);
  }

  function restart() {
    setStep(0);
    setScores(createEmptyScores());
    setSelectedIndex(null);
    setTransitioning(false);
    setPhase("intro");
  }

  function startQuiz() {
    setPhase("quiz");
  }

  return (
    <div className="quiz-h5-shell">
      <QuizAtmosphere />

      <header className="quiz-h5-header">
        <Link href="/" className="quiz-h5-back">
          <span aria-hidden="true">←</span>
          返回
        </Link>
        {phase === "quiz" ? (
          <span className="quiz-h5-counter">
            {step + 1} / {questions.length}
          </span>
        ) : null}
      </header>

      {phase === "quiz" ? (
        <div className="quiz-h5-progress-track">
          <div className="quiz-h5-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      <div className="quiz-h5-content">
        {phase === "intro" ? (
          <section className="quiz-h5-intro quiz-animate-in">
            <p className="quiz-h5-eyebrow">冒险岛 · 职业本命测试</p>
            <h1 className="quiz-h5-title">
              在重生里
              <br />
              遇见<span className="quiz-h5-accent">当年的自己</span>
            </h1>
            <p className="quiz-h5-lead">
              12 道题，约 3 分钟。
              <br />
              没有标准答案，只有更接近你的冒险方式。
            </p>
            <button type="button" onClick={startQuiz} className="quiz-h5-cta">
              开始测试
            </button>
            <p className="quiz-h5-footnote">滑动选择 · 沉浸式体验</p>
          </section>
        ) : null}

        {phase === "quiz" && question ? (
          <section
            key={step}
            className={`quiz-h5-question ${transitioning ? "quiz-h5-question-leaving" : "quiz-animate-in"}`}
          >
            {question.dimension ? <p className="quiz-h5-dimension">{question.dimension}</p> : null}
            <h2 className="quiz-h5-question-title">{question.title}</h2>
            <div className="quiz-h5-options">
              {question.options.map((option, index) => {
                const selected = selectedIndex === index;
                return (
                  <button
                    key={option.text}
                    type="button"
                    disabled={transitioning}
                    onClick={() => handleSelect(option.effect, index)}
                    className={`quiz-h5-option ${selected ? "quiz-h5-option-selected" : ""}`}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <span className="quiz-h5-option-index">{String.fromCharCode(65 + index)}</span>
                    <span className="quiz-h5-option-text">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {phase === "result" ? (
          <section className="quiz-h5-result quiz-animate-in">
            {topJob && jobResultContent[topJob.id] && jobPersona ? (
              <>
                <QuizResultHero
                  job={topJob}
                  content={jobResultContent[topJob.id]}
                  persona={jobPersona}
                  tierMeta={tierMeta}
                />

                <div className="quiz-h5-glass">
                  <JobRecommendationResults recommendations={recommendations} variant="h5" />
                </div>

                <div className="quiz-h5-actions">
                  <button type="button" onClick={restart} className="quiz-h5-ghost-btn">
                    重新测试
                  </button>
                  <Link href="/" className="quiz-h5-ghost-btn">
                    回到首页
                  </Link>
                </div>
              </>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
