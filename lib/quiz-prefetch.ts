import { getAllQuizJobImageUrls } from "@/lib/quiz-job-images";

let assetsPrefetched = false;
let html2canvasModule: typeof import("html2canvas") | null = null;

export function prefetchHtml2Canvas() {
  if (html2canvasModule) {
    return;
  }

  void import("html2canvas").then((module) => {
    html2canvasModule = module;
  });
}

export async function loadHtml2Canvas() {
  if (html2canvasModule) {
    return html2canvasModule.default;
  }

  const loaded = await import("html2canvas");
  html2canvasModule = loaded;
  return loaded.default;
}

export function prefetchQuizAssets() {
  if (assetsPrefetched) {
    prefetchHtml2Canvas();
    return;
  }

  assetsPrefetched = true;
  prefetchHtml2Canvas();

  for (const url of getAllQuizJobImageUrls()) {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
}
