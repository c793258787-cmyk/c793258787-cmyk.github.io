export type JobResultTheme = {
  glow: string;
  glowSecondary: string;
  accent: string;
  shareSkyFrom: string;
  shareSkyTo: string;
  shareBorder: string;
  shareBadgeBg: string;
};

const defaultTheme: JobResultTheme = {
  glow: "rgba(244, 63, 94, 0.32)",
  glowSecondary: "rgba(168, 85, 247, 0.18)",
  accent: "#fb7185",
  shareSkyFrom: "#5eb8f5",
  shareSkyTo: "#9ad4fb",
  shareBorder: "#b45309",
  shareBadgeBg: "rgba(180, 83, 9, 0.28)"
};

export const jobResultThemes: Record<string, JobResultTheme> = {
  hero: {
    glow: "rgba(220, 38, 38, 0.42)",
    glowSecondary: "rgba(251, 191, 36, 0.22)",
    accent: "#fda4af",
    shareSkyFrom: "#ef4444",
    shareSkyTo: "#fbbf24",
    shareBorder: "#dc2626",
    shareBadgeBg: "rgba(220, 38, 38, 0.32)"
  },
  paladin: {
    glow: "rgba(37, 99, 235, 0.38)",
    glowSecondary: "rgba(212, 175, 55, 0.2)",
    accent: "#93c5fd",
    shareSkyFrom: "#2563eb",
    shareSkyTo: "#fde68a",
    shareBorder: "#1d4ed8",
    shareBadgeBg: "rgba(37, 99, 235, 0.32)"
  },
  "dark-knight": {
    glow: "rgba(165, 0, 0, 0.4)",
    glowSecondary: "rgba(106, 13, 173, 0.28)",
    accent: "#86efac",
    shareSkyFrom: "#7f1d1d",
    shareSkyTo: "#581c87",
    shareBorder: "#6b21a8",
    shareBadgeBg: "rgba(107, 33, 168, 0.32)"
  },
  "fire-poison": {
    glow: "rgba(249, 115, 22, 0.42)",
    glowSecondary: "rgba(34, 197, 94, 0.22)",
    accent: "#fdba74",
    shareSkyFrom: "#f97316",
    shareSkyTo: "#22c55e",
    shareBorder: "#ea580c",
    shareBadgeBg: "rgba(234, 88, 12, 0.32)"
  },
  "ice-lightning": {
    glow: "rgba(56, 189, 248, 0.38)",
    glowSecondary: "rgba(147, 197, 253, 0.2)",
    accent: "#bae6fd",
    shareSkyFrom: "#0ea5e9",
    shareSkyTo: "#818cf8",
    shareBorder: "#0284c7",
    shareBadgeBg: "rgba(14, 165, 233, 0.32)"
  },
  bishop: {
    glow: "rgba(212, 175, 55, 0.32)",
    glowSecondary: "rgba(56, 178, 172, 0.22)",
    accent: "#fde68a",
    shareSkyFrom: "#fbbf24",
    shareSkyTo: "#2dd4bf",
    shareBorder: "#ca8a04",
    shareBadgeBg: "rgba(202, 138, 4, 0.32)"
  },
  marksman: {
    glow: "rgba(22, 163, 74, 0.36)",
    glowSecondary: "rgba(147, 51, 234, 0.2)",
    accent: "#86efac",
    shareSkyFrom: "#16a34a",
    shareSkyTo: "#9333ea",
    shareBorder: "#15803d",
    shareBadgeBg: "rgba(22, 163, 74, 0.32)"
  },
  bowmaster: {
    glow: "rgba(22, 163, 74, 0.34)",
    glowSecondary: "rgba(244, 114, 182, 0.22)",
    accent: "#fde047",
    shareSkyFrom: "#22c55e",
    shareSkyTo: "#f472b6",
    shareBorder: "#16a34a",
    shareBadgeBg: "rgba(34, 197, 94, 0.32)"
  },
  "night-lord": {
    glow: "rgba(147, 51, 234, 0.38)",
    glowSecondary: "rgba(220, 38, 38, 0.18)",
    accent: "#c4b5fd",
    shareSkyFrom: "#9333ea",
    shareSkyTo: "#dc2626",
    shareBorder: "#7c3aed",
    shareBadgeBg: "rgba(124, 58, 237, 0.32)"
  },
  shadower: {
    glow: "rgba(234, 88, 12, 0.32)",
    glowSecondary: "rgba(45, 212, 191, 0.18)",
    accent: "#fdba74",
    shareSkyFrom: "#ea580c",
    shareSkyTo: "#14b8a6",
    shareBorder: "#c2410c",
    shareBadgeBg: "rgba(194, 65, 12, 0.32)"
  },
  corsair: {
    glow: "rgba(220, 38, 38, 0.34)",
    glowSecondary: "rgba(212, 175, 55, 0.22)",
    accent: "#f9a8d4",
    shareSkyFrom: "#dc2626",
    shareSkyTo: "#f9a8d4",
    shareBorder: "#be123c",
    shareBadgeBg: "rgba(190, 18, 60, 0.32)"
  },
  buccaneer: {
    glow: "rgba(220, 38, 38, 0.36)",
    glowSecondary: "rgba(251, 191, 36, 0.2)",
    accent: "#86efac",
    shareSkyFrom: "#dc2626",
    shareSkyTo: "#fbbf24",
    shareBorder: "#b91c1c",
    shareBadgeBg: "rgba(185, 28, 28, 0.32)"
  }
};

export function getJobResultTheme(jobId: string): JobResultTheme {
  return jobResultThemes[jobId] ?? defaultTheme;
}
