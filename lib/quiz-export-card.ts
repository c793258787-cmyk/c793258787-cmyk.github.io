export const QUIZ_SHARE_EXPORT_WIDTH = 360;
const EXPORT_MIN_HEIGHT = 640;

export function isWeChatBrowser() {
  return typeof navigator !== "undefined" && /MicroMessenger/i.test(navigator.userAgent);
}

export function isMobileDevice() {
  return typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
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
  return node.matches(".quiz-share-card") ? node : node.querySelector(".quiz-share-card");
}

function prepareExportClone(element: HTMLElement) {
  const sandbox = document.createElement("div");
  sandbox.setAttribute("aria-hidden", "true");
  sandbox.className = "quiz-share-export-sandbox";
  sandbox.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "opacity:0",
    "pointer-events:none",
    "z-index:-1",
    `width:${QUIZ_SHARE_EXPORT_WIDTH}px`,
    "overflow:visible"
  ].join(";");

  const clone = element.cloneNode(true) as HTMLElement;
  normalizeExportClone(clone);

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  return { sandbox, clone };
}

function normalizeExportClone(clone: HTMLElement) {
  const card = getShareCardRoot(clone);

  if (!(card instanceof HTMLElement)) {
    return;
  }

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

function measureExportHeight(clone: HTMLElement) {
  const card = getShareCardRoot(clone);
  const inner = clone.querySelector(".quiz-share-card-inner");
  const targets = [card, inner].filter((node): node is HTMLElement => node instanceof HTMLElement);

  const heights = targets.flatMap((node) => [node.scrollHeight, node.offsetHeight, node.getBoundingClientRect().height]);

  return Math.ceil(Math.max(EXPORT_MIN_HEIGHT, ...heights, 0)) + 40;
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

  try {
    await waitForImages(clone);
    await waitForLayout();

    const exportHeight = measureExportHeight(clone);
    const html2canvas = await import("@/lib/quiz-prefetch").then((m) => m.loadHtml2Canvas());
    const scale = isMobileDevice() ? 2 : Math.min(Math.max(window.devicePixelRatio || 2, 2), 3);

    const canvas = await html2canvas(clone, {
      backgroundColor: "#0f172a",
      scale,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: QUIZ_SHARE_EXPORT_WIDTH,
      height: exportHeight,
      windowWidth: QUIZ_SHARE_EXPORT_WIDTH,
      windowHeight: exportHeight,
      onclone: (_doc, clonedElement) => {
        const root =
          clonedElement instanceof HTMLElement ? clonedElement : _doc.querySelector(".quiz-share-card-hero");

        if (root instanceof HTMLElement) {
          normalizeExportClone(root);
        }
      }
    });

    const expectedMinHeight = Math.floor(exportHeight * scale * 0.92);

    if (canvas.height < expectedMinHeight) {
      return html2canvas(clone, {
        backgroundColor: "#0f172a",
        scale,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (_doc, clonedElement) => {
          const root =
            clonedElement instanceof HTMLElement ? clonedElement : _doc.querySelector(".quiz-share-card-hero");

          if (root instanceof HTMLElement) {
            normalizeExportClone(root);
          }
        }
      });
    }

    return canvas;
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
  const scale = isMobileDevice() ? 2 : 2;
  return size.height >= EXPORT_MIN_HEIGHT * scale * 0.85;
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
