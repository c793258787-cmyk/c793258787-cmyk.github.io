"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { JobRadarChart } from "@/components/JobRadarChart";
import { groupRecommendations, type JobRecommendation } from "@/lib/job-recommendation";

type JobRecommendationResultsProps = {
  recommendations: JobRecommendation[];
  variant?: "default" | "h5";
};

export function JobRecommendationResults({ recommendations, variant = "default" }: JobRecommendationResultsProps) {
  const groups = useMemo(() => groupRecommendations(recommendations), [recommendations]);
  const topJob = recommendations[0];
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(topJob ? [topJob.groupKey] : [])
  );
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  function toggleGroup(key: string) {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleJob(job: JobRecommendation) {
    setSelectedJobId((current) => (current === job.id ? null : job.id));
  }

  const isH5 = variant === "h5";

  return (
    <div className={isH5 ? "quiz-h5-groups" : "mt-6 space-y-3"}>
      <div className={`flex items-center justify-between gap-4 ${isH5 ? "mb-4" : ""}`}>
        <h3 className={isH5 ? "quiz-h5-section-title" : "text-sm font-medium text-zinc-300"}>职业组别排名</h3>
        <span className={isH5 ? "quiz-h5-section-hint" : "text-xs text-zinc-500"}>
          共 12 个职业分支 · 点击职业查看雷达图
        </span>
      </div>

      {groups.map((group) => {
        const expanded = expandedGroups.has(group.key);
        const topInGroup = group.jobs[0];

        return (
          <section
            key={group.key}
            className={
              isH5
                ? "quiz-h5-group"
                : "overflow-hidden rounded-md border border-zinc-800/60 bg-zinc-950/40"
            }
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.key)}
              className={
                isH5
                  ? "quiz-h5-group-trigger"
                  : "flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-zinc-900/50"
              }
              aria-expanded={expanded}
            >
              <div>
                <p className={isH5 ? "quiz-h5-group-label" : "font-medium text-zinc-100"}>{group.label}</p>
                <p className={isH5 ? "quiz-h5-group-meta" : "mt-1 text-xs text-zinc-500"}>
                  {group.jobs.length} 个分支 · 最高匹配 {topInGroup?.name} {topInGroup?.matchRate}%
                </p>
              </div>
              <span className={isH5 ? "quiz-h5-group-toggle" : "shrink-0 text-sm text-zinc-500"}>
                {expanded ? "收起" : "展开"}
              </span>
            </button>

            {expanded ? (
              <ul className={isH5 ? "quiz-h5-group-list" : "border-t border-zinc-800/60 px-2 py-2"}>
                {group.jobs.map((job) => {
                  const selected = selectedJobId === job.id;

                  return (
                    <li key={job.id} className={isH5 ? "quiz-h5-job-item" : "rounded-md"}>
                      <button
                        type="button"
                        onClick={() => toggleJob(job)}
                        aria-expanded={selected}
                        className={
                          isH5
                            ? `quiz-h5-job-trigger ${selected ? "quiz-h5-job-trigger-active" : ""}`
                            : `flex w-full items-center justify-between gap-4 rounded-md px-3 py-3 text-left transition-colors ${
                                selected ? "bg-zinc-900/80" : "hover:bg-zinc-900/50"
                              }`
                        }
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={isH5 ? "quiz-h5-job-rank" : "text-xs font-medium text-zinc-500"}>
                              #{job.rank}
                            </span>
                            <span className={isH5 ? "quiz-h5-job-name" : "font-medium text-zinc-100"}>{job.name}</span>
                            {job.rank === 1 ? (
                              <span
                                className={
                                  isH5
                                    ? "quiz-h5-job-top"
                                    : "rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-400"
                                }
                              >
                                总榜第 1
                              </span>
                            ) : null}
                          </div>
                          <div className={isH5 ? "quiz-h5-job-bar-track" : "mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-900"}>
                            <div
                              className={isH5 ? "quiz-h5-job-bar-fill" : "h-full rounded-full bg-amber-400/80 transition-all"}
                              style={{ width: `${job.matchRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className={isH5 ? "quiz-h5-job-match" : "text-lg font-semibold text-amber-400"}>
                            {job.matchRate}%
                          </p>
                          <p className={isH5 ? "quiz-h5-job-hint" : "text-xs text-zinc-500"}>
                            {selected ? "收起雷达图" : "查看雷达图"}
                          </p>
                        </div>
                      </button>

                      {selected ? (
                        <div
                          className={
                            isH5
                              ? "quiz-h5-radar-panel"
                              : "mx-3 mb-3 rounded-md border border-zinc-800/60 bg-panel px-4 py-4"
                          }
                        >
                          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <JobRadarChart weights={job.weights} size={168} />
                            <div className="w-full sm:max-w-[12rem]">
                              <p className={isH5 ? "quiz-h5-radar-title" : "text-sm font-medium text-zinc-200"}>
                                {job.name} 属性分布
                              </p>
                              <p className={isH5 ? "quiz-h5-radar-desc" : "mt-2 text-xs leading-5 text-zinc-500"}>
                                雷达图展示该职业在输出、控制、社交、成本四个维度的权重表现。
                              </p>
                              {!isH5 ? (
                                <Link
                                  href={job.path}
                                  className="mt-4 inline-flex rounded-md border border-zinc-700/80 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
                                >
                                  查看练级指南
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
