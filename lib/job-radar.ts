import type { JobMatchWeight } from "@/lib/jobs";

export const radarDimensions = [
  { key: "power" as const, label: "输出" },
  { key: "control" as const, label: "控制" },
  { key: "social" as const, label: "社交" },
  { key: "budget" as const, label: "成本" }
];

export const radarMax = 3;

export function getRadarValues(weights: JobMatchWeight) {
  return radarDimensions.map(({ key, label }) => ({
    key,
    label,
    value: weights[key],
    normalized: weights[key] / radarMax
  }));
}

export function radarPoint(index: number, normalized: number, radius: number, center: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / radarDimensions.length;
  const distance = normalized * radius;
  return {
    x: center + distance * Math.cos(angle),
    y: center + distance * Math.sin(angle)
  };
}

export function radarLabelPoint(index: number, radius: number, center: number, offset = 14) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / radarDimensions.length;
  const distance = radius + offset;
  return {
    x: center + distance * Math.cos(angle),
    y: center + distance * Math.sin(angle)
  };
}
