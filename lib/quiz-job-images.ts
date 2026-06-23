import { jobResultContent } from "@/lib/job-result-content";

export function getQuizJobImageUrl(jobId: string) {
  return `/quiz/jobs/thumbs/${jobId}.webp`;
}

export function getAllQuizJobImageUrls() {
  return Object.keys(jobResultContent).map((jobId) => getQuizJobImageUrl(jobId));
}
