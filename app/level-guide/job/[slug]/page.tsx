import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JobRadarChart } from "@/components/JobRadarChart";
import { jobLevelGuides, jobMatchWeights, jobs, jobsById } from "@/lib/jobs";

type JobLevelGuidePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.id }));
}

export async function generateMetadata({ params }: JobLevelGuidePageProps): Promise<Metadata> {
  const job = jobsById[params.slug];
  if (!job) return {};

  return {
    title: `${job.name}练级指南`,
    description: `${job.name}专属练级路线与阶段提示，适合${job.family}玩家参考。`
  };
}

export default function JobLevelGuidePage({ params }: JobLevelGuidePageProps) {
  const job = jobsById[params.slug];
  const guide = jobLevelGuides[params.slug];

  if (!job || !guide) {
    notFound();
  }

  const sections = [
    { title: "前期（1-50 级）", tips: guide.earlyTips },
    { title: "中期（51-100 级）", tips: guide.midTips },
    { title: "后期（100 级+）", tips: guide.lateTips }
  ];
  const weights = jobMatchWeights[job.name];

  return (
    <>
      <PageHeader
        compact
        eyebrow={`${job.groupLabel} · ${job.family}`}
        title={`${job.name}练级指南`}
        description={guide.summary}
      />
      <section className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        {weights ? (
          <article className="mb-6 rounded-md border border-zinc-800/60 bg-panel p-5">
            <h2 className="font-semibold text-zinc-100">职业属性雷达图</h2>
            <p className="mt-2 text-sm text-zinc-400">该职业在输出、控制、社交、成本四个维度的权重表现。</p>
            <div className="mt-4 flex justify-center sm:justify-start">
              <JobRadarChart weights={weights} size={200} />
            </div>
          </article>
        ) : null}

        <div className="grid gap-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-md border border-zinc-800/60 bg-panel p-5">
              <h2 className="font-semibold text-zinc-100">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">
                {section.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/level-guide"
            className="rounded-md border border-zinc-800/60 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
          >
            返回游戏攻略
          </Link>
          <Link
            href="/quiz"
            className="rounded-md border border-zinc-800/60 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
          >
            重新做职业测试
          </Link>
        </div>
      </section>
    </>
  );
}
