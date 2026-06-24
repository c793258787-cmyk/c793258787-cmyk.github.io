export const QUIZ_SHARE_EXPORT_WIDTH = 360;

export function isWeChatBrowser() {
  return typeof navigator !== "undefined" && /MicroMessenger/i.test(navigator.userAgent);
}

export function isMobileDevice() {
  return typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
}

export function getPhoneViewportFitBox(maxWidth?: number, maxHeight?: number) {
  if (typeof window === "undefined") {
    return {
      maxWidth: maxWidth ?? QUIZ_SHARE_EXPORT_WIDTH,
      maxHeight: maxHeight ?? 680
    };
  }

  const gutter = 20;

  return {
    maxWidth: maxWidth ?? Math.min(QUIZ_SHARE_EXPORT_WIDTH, Math.max(280, Math.floor(window.innerWidth - gutter * 2))),
    maxHeight: maxHeight ?? Math.max(360, Math.floor(window.innerHeight - gutter * 2))
  };
}

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

function waitForLayout() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function getShareCardRoot(node: HTMLElement) {
  const card = node.matches(".quiz-share-card") ? node : node.querySelector(".quiz-share-card");
  return card instanceof HTMLElement ? card : node;
}

function measureCardHeight(card: HTMLElement) {
  const inner = card.querySelector(".quiz-share-card-inner");
  const innerHeight = inner instanceof HTMLElement ? inner.scrollHeight : 0;

  return Math.ceil(Math.max(card.scrollHeight, card.offsetHeight, card.getBoundingClientRect().height, innerHeight + 32));
}

function prepareExportClone(element: HTMLElement) {
  const cardSource = getShareCardRoot(element);
  const sandbox = document.createElement("div");
  sandbox.setAttribute("aria-hidden", "true");
  sandbox.className = "quiz-share-export-sandbox";

  const clone = cardSource.cloneNode(true) as HTMLElement;
  normalizeExportClone(clone);

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  return { sandbox, clone };
}

function normalizeExportClone(clone: HTMLElement) {
  const card = getShareCardRoot(clone);

  card.classList.add("quiz-share-card-exporting");
  card.style.width = `${QUIZ_SHARE_EXPORT_WIDTH}px`;
  card.style.maxWidth = "none";
  card.style.height = "auto";
  card.style.minHeight = "auto";
  card.style.overflow = "visible";
  card.style.transform = "none";
  card.style.animation = "none";
  card.style.margin = "0";
  card.style.boxShadow = "none";

  clone.querySelectorAll(".quiz-share-card-portrait-skeleton").forEach((node) => node.remove());

  clone.querySelectorAll(".quiz-share-card-portrait").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.opacity = "1";
    }
  });

  let parent: HTMLElement | null = card;

  while (parent) {
    parent.style.overflow = "visible";
    parent.style.height = "auto";
    parent.style.maxHeight = "none";
    parent = parent.parentElement;
  }
}

export function fitCanvasToPhoneViewport(source: HTMLCanvasElement, captureScale: number, fitBox?: { maxWidth: number; maxHeight: number }) {
  const { maxWidth, maxHeight } = fitBox ?? getPhoneViewportFitBox();
  const outputScale = Math.min(Math.max(window.devicePixelRatio || 2, 2), 2);

  const displayWidth = source.width / captureScale;
  const displayHeight = source.height / captureScale;
  const fitScale = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
  const fittedWidth = Math.max(1, Math.round(displayWidth * fitScale));
  const fittedHeight = Math.max(1, Math.round(displayHeight * fitScale));

  const output = document.createElement("canvas");
  output.width = Math.round(fittedWidth * outputScale);
  output.height = Math.round(fittedHeight * outputScale);

  const ctx = output.getContext("2d");

  if (!ctx) {
    return source;
  }

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, output.width, output.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, output.width, output.height);

  return output;
}

async function captureShareCard(clone: HTMLElement, captureScale: number) {
  const card = getShareCardRoot(clone);
  const exportHeight = measureCardHeight(card);
  const html2canvas = await import("@/lib/quiz-prefetch").then((m) => m.loadHtml2Canvas());
  const expectedHeight = Math.floor(exportHeight * captureScale * 0.9);

  card.style.height = `${exportHeight}px`;

  const sandbox = card.parentElement;

  if (sandbox instanceof HTMLElement) {
    sandbox.style.width = `${QUIZ_SHARE_EXPORT_WIDTH}px`;
    sandbox.style.height = `${exportHeight}px`;
  }

  const baseOptions = {
    backgroundColor: "#0f172a",
    scale: captureScale,
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    onclone: (_doc: Document, clonedElement: HTMLElement) => {
      if (clonedElement instanceof HTMLElement) {
        normalizeExportClone(clonedElement);
        clonedElement.style.height = `${exportHeight}px`;
      }
    }
  };

  let canvas = await html2canvas(card, {
    ...baseOptions,
    width: QUIZ_SHARE_EXPORT_WIDTH,
    height: exportHeight,
    windowWidth: QUIZ_SHARE_EXPORT_WIDTH,
    windowHeight: exportHeight
  });

  if (canvas.height < expectedHeight) {
    canvas = await html2canvas(card, baseOptions);
  }

  return canvas;
}

export async function waitForShareCardReady(element: HTMLElement) {
  await waitForQrCode(element);
  await waitForImages(element);
  await document.fonts.ready;
  await waitForLayout();
}

export async function renderQuizShareCard(element: HTMLElement) {
  await waitForShareCardReady(element);

  const { sandbox, clone } = prepareExportClone(element);
  const captureScale = isMobileDevice() ? 2 : Math.min(Math.max(window.devicePixelRatio || 2, 2), 3);
  const exportHeight = measureCardHeight(clone);

  try {
    await waitForImages(clone);
    await waitForLayout();

    let rawCanvas = await captureShareCard(clone, captureScale);
    const expectedHeight = Math.floor(exportHeight * captureScale * 0.9);

    if (rawCanvas.height < expectedHeight) {
      rawCanvas = await captureShareCard(clone, captureScale);
    }

    const fitBox = getPhoneViewportFitBox();
    return fitCanvasToPhoneViewport(rawCanvas, captureScale, fitBox);
  } finally {
    sandbox.remove();
  }
}

export async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Failed to create image blob"));
    }, "image/png");
  });
}

export async function readBlobImageSize(blob: Blob) {
  const url = URL.createObjectURL(blob);

  try {
    return await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => reject(new Error("Failed to read image size"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function isLikelyCompleteShareExport(size: { width: number; height: number }) {
  const { maxWidth, maxHeight } = getPhoneViewportFitBox();
  const outputScale = 2;

  return size.width >= 120 && size.height >= 120 && size.width <= maxWidth * outputScale * 1.08 && size.height <= maxHeight * outputScale * 1.08;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function tryNativeShare(blob: Blob, filename: string, title: string) {
  if (!("share" in navigator) || typeof navigator.share !== "function") {
    return "unsupported";
  }

  const file = new File([blob], filename, { type: "image/png" });

  if ("canShare" in navigator && typeof navigator.canShare === "function" && !navigator.canShare({ files: [file] })) {
    return "unsupported";
  }

  try {
    await navigator.share({ files: [file], title });
    return "shared";
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return "cancelled";
    }

    return "failed";
  }
}

export function getQuizShareFilename(jobName: string) {
  return `冒险岛灵魂职业-${jobName}.png`;
}
