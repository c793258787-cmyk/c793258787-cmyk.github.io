export const QUIZ_SHARE_EXPORT_WIDTH = 360;

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

function prepareExportClone(element: HTMLElement) {
  const sandbox = document.createElement("div");
  sandbox.setAttribute("aria-hidden", "true");
  sandbox.className = "quiz-share-export-sandbox";
  sandbox.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    "z-index:-1",
    `width:${QUIZ_SHARE_EXPORT_WIDTH}px`,
    "pointer-events:none",
    "overflow:visible"
  ].join(";");

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${QUIZ_SHARE_EXPORT_WIDTH}px`;
  clone.style.maxWidth = "none";
  clone.style.margin = "0";
  clone.style.overflow = "visible";
  clone.style.transform = "none";
  clone.style.animation = "none";
  clone.style.boxShadow = "none";

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  return { sandbox, clone };
}

function waitForLayout() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

export async function renderQuizShareCard(element: HTMLElement) {
  element.scrollIntoView({ block: "center", inline: "center" });

  await waitForQrCode(element);
  await waitForImages(element);
  await document.fonts.ready;

  const { sandbox, clone } = prepareExportClone(element);

  try {
    await waitForImages(clone);
    await waitForLayout();

    const exportHeight = Math.ceil(clone.scrollHeight || clone.getBoundingClientRect().height);
    const html2canvas = (await import("html2canvas")).default;
    const scale = Math.min(Math.max(window.devicePixelRatio || 2, 2), 3);

    return html2canvas(clone, {
      backgroundColor: "#0f172a",
      scale,
      useCORS: true,
      logging: false,
      width: QUIZ_SHARE_EXPORT_WIDTH,
      height: exportHeight,
      windowWidth: QUIZ_SHARE_EXPORT_WIDTH,
      windowHeight: exportHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (_doc, clonedElement) => {
        const root =
          clonedElement instanceof HTMLElement ? clonedElement : _doc.querySelector(".quiz-share-card-hero");

        if (!(root instanceof HTMLElement)) {
          return;
        }

        root.style.position = "static";
        root.style.left = "0";
        root.style.top = "0";
        root.style.width = `${QUIZ_SHARE_EXPORT_WIDTH}px`;
        root.style.maxWidth = "none";
        root.style.height = "auto";
        root.style.overflow = "visible";
        root.style.transform = "none";
        root.style.animation = "none";
        root.style.margin = "0";

        let parent = root.parentElement;

        while (parent) {
          parent.style.overflow = "visible";
          parent.style.height = "auto";
          parent = parent.parentElement;
        }
      }
    });
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
