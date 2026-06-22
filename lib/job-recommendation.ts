import type { createEmptyScores } from "@/lib/test-questions";
import {
  jobExtendedWeights,
  jobMatchWeights,
  jobsByName,
  type JobExtendedWeight,
  type JobMatchWeight
} from "@/lib/jobs";

export type TestScores = ReturnType<typeof createEmptyScores>;

export { jobMatchWeights };
export type { JobMatchWeight };

export type JobRecommendation = {
  id: string;
  name: string;
  family: string;
  groupKey: string;
  groupLabel: string;
  path: string;
  weights: JobMatchWeight;
  score: number;
  matchRate: number;
  rank: number;
};

export type GroupedJobRecommendations = {
  key: string;
  label: string;
  family: string;
  jobs: JobRecommendation[];
};

export function buildMatchProfile(scores: TestScores) {
  // Q1–Q3、Q5 核心四维
  return {
    power: scores.power,
    control: scores.control,
    social: scores.social,
    budget: scores.budget
  };
}

/** Q1–Q2、Q4、Q6–Q8、Q9–Q12 扩展维度，见 lib/jobs.ts jobExtendedWeights */

function calculateCoreScore(profile: ReturnType<typeof buildMatchProfile>, weights: JobMatchWeight) {
  return (
    profile.power * weights.power +
    profile.control * weights.control +
    profile.social * weights.social +
    profile.budget * weights.budget
  );
}

function calculateExtendedScore(scores: TestScores, weights: JobExtendedWeight) {
  let total = 0;

  for (const [key, weight] of Object.entries(weights) as [keyof JobExtendedWeight, number][]) {
    if (!weight) continue;
    total += scores[key] * weight;
  }

  return total;
}

export function calculateRecommendation(scores: TestScores): JobRecommendation[] {
  const profile = buildMatchProfile(scores);

  const ranked = Object.entries(jobMatchWeights)
    .map(([name, weights]) => {
      const job = jobsByName[name];
      const extended = jobExtendedWeights[name] ?? {};
      const score = calculateCoreScore(profile, weights) + calculateExtendedScore(scores, extended);

      return {
        id: job.id,
        name: job.name,
        family: job.family,
        groupKey: job.groupKey,
        groupLabel: job.groupLabel,
        path: job.path,
        weights,
        score
      };
    })
    .sort((left, right) => right.score - left.score);

  const topScore = ranked[0]?.score || 1;

  return ranked.map((item, index) => ({
    ...item,
    rank: index + 1,
    matchRate: topScore > 0 ? Math.round((item.score / topScore) * 100) : 0
  }));
}

export function groupRecommendations(recommendations: JobRecommendation[]): GroupedJobRecommendations[] {
  const order = ["战士系", "法师系", "弓手系", "盗贼系", "海盗系"] as const;

  return order.map((family) => {
    const jobs = recommendations.filter((item) => item.family === family);
    return {
      key: jobs[0]?.groupKey ?? family,
      label: jobs[0]?.groupLabel ?? family,
      family,
      jobs
    };
  });
}
