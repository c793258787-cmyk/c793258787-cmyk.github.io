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
  const topChrome = 88;

  return {
    maxWidth: maxWidth ?? Math.min(QUIZ_SHARE_EXPORT_WIDTH, Math.max(280, Math.floor(window.innerWidth - gutter * 2))),
    maxHeight: maxHeight ?? Math.max(360, Math.floor(window.innerHeight - topChrome - gutter * 2))
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

function waitForQrCode(root: HTMLElement, timeoutMs = 8000) {
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

export function getShareCardRoot(node: HTMLElement) {
  const card = node.matches(".quiz-share-card") ? node : node.querySelector(".quiz-share-card");
  return card instanceof HTMLElement ? card : node;
}

function prepareLiveCardForExport(card: HTMLElement) {
  card.classList.add("quiz-share-card-exporting");

  card.querySelectorAll(".quiz-share-card-portrait-skeleton").forEach((node) => node.remove());
  card.querySelectorAll(".quiz-share-card-portrait").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.opacity = "1";
    }
  });
}

function prepareCloneForExport(card: HTMLElement) {
  prepareLiveCardForExport(card);
  card.style.width = `${QUIZ_SHARE_EXPORT_WIDTH}px`;
  card.style.maxWidth = "none";
  card.style.height = "auto";
  card.style.minHeight = "auto";
  card.style.overflow = "visible";
  card.style.transform = "none";
  card.style.animation = "none";
  card.style.boxShadow = "none";

  card.querySelectorAll(".quiz-share-card-inner").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.overflow = "visible";
    }
  });
}

function cleanupCardExport(card: HTMLElement) {
  card.classList.remove("quiz-share-card-exporting");

  card.querySelectorAll(".quiz-share-card-portrait").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.removeProperty("opacity");
    }
  });
}

export function isCanvasBlank(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  if (!ctx || canvas.width === 0 || canvas.height === 0) {
    return true;
  }

  const sampleWidth = Math.min(canvas.width, 64);
  const sampleHeight = Math.min(canvas.height, 64);
  const regions = [
    { x: 0, y: 0 },
    { x: Math.max(0, Math.floor(canvas.width / 2 - sampleWidth / 2)), y: Math.max(0, Math.floor(canvas.height / 2 - sampleHeight / 2)) },
    { x: Math.max(0, canvas.width - sampleWidth), y: Math.max(0, canvas.height - sampleHeight) }
  ];
  let brightPixels = 0;

  for (const region of regions) {
    const data = ctx.getImageData(region.x, region.y, sampleWidth, sampleHeight).data;

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];

      if (alpha < 8) {
        continue;
      }

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];

      if (red + green + blue > 80) {
        brightPixels += 1;
      }
    }
  }

  return brightPixels < 12;
}

export function fitCanvasToPhoneViewport(source: HTMLCanvasElement, captureScale: number, fitBox?: { maxWidth: number; maxHeight: number }) {
  if (isCanvasBlank(source)) {
    return source;
  }

  const { maxWidth, maxHeight } = fitBox ?? getPhoneViewportFitBox();
  const outputScale = Math.min(Math.max(window.devicePixelRatio || 2, 2), 2);

  const displayWidth = source.width / captureScale;
  const displayHeight = source.height / captureScale;
  const fitScale = Math.min(maxWidth / displayWidth, maxHeight / displayHeight, 1);
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

export async function waitForShareCardReady(element: HTMLElement) {
  await waitForQrCode(element);
  await waitForImages(element);
  await document.fonts.ready;
  await waitForLayout();
}

export async function renderQuizShareCard(element: HTMLElement) {
  await waitForShareCardReady(element);

  const card = getShareCardRoot(element);
  card.scrollIntoView({ block: "center", inline: "nearest" });
  await waitForLayout();

  prepareLiveCardForExport(card);

  const captureScale = isMobileDevice() ? 2 : Math.min(Math.max(window.devicePixelRatio || 2, 2), 3);
  const html2canvas = await import("@/lib/quiz-prefetch").then((m) => m.loadHtml2Canvas());

  try {
    const rawCanvas = await html2canvas(card, {
      backgroundColor: "#0f172a",
      scale: captureScale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      onclone: (_doc, clonedElement) => {
        if (!(clonedElement instanceof HTMLElement)) {
          return;
        }

        prepareCloneForExport(getShareCardRoot(clonedElement));
      }
    });

    if (isCanvasBlank(rawCanvas)) {
      throw new Error("Share card export rendered blank");
    }

    return fitCanvasToPhoneViewport(rawCanvas, captureScale);
  } finally {
    cleanupCardExport(card);
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
  return size.width >= 120 && size.height >= 200;
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

export function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read image data"));
    };

    reader.onerror = () => reject(new Error("Failed to read image data"));
    reader.readAsDataURL(blob);
  });
}
