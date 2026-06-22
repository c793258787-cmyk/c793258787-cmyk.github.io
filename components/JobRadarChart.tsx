import type { JobMatchWeight } from "@/lib/jobs";
import { getRadarValues, radarDimensions, radarLabelPoint, radarMax, radarPoint } from "@/lib/job-radar";

type JobRadarChartProps = {
  weights: JobMatchWeight;
  size?: number;
  className?: string;
};

export function JobRadarChart({ weights, size = 160, className = "" }: JobRadarChartProps) {
  const center = size / 2;
  const radius = size * 0.32;
  const values = getRadarValues(weights);
  const polygonPoints = values
    .map((item, index) => {
      const point = radarPoint(index, item.normalized, radius, center);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  const gridLevels = [1 / 3, 2 / 3, 1];

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="职业四维雷达图">
        {gridLevels.map((level) => {
          const points = radarDimensions
            .map((_, index) => {
              const point = radarPoint(index, level, radius, center);
              return `${point.x},${point.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.12}
              className="text-zinc-400"
            />
          );
        })}

        {radarDimensions.map((_, index) => {
          const end = radarPoint(index, 1, radius, center);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeOpacity={0.12}
              className="text-zinc-400"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="rgba(244, 63, 94, 0.22)"
          stroke="rgb(251, 191, 36)"
          strokeWidth={1.5}
        />

        {values.map((item, index) => {
          const point = radarPoint(index, item.normalized, radius, center);
          return <circle key={item.key} cx={point.x} cy={point.y} r={3} fill="rgb(251, 191, 36)" />;
        })}

        {values.map((item, index) => {
          const label = radarLabelPoint(index, radius, center);
          return (
            <text
              key={item.key}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-zinc-400 text-[10px]"
            >
              {item.label}
            </text>
          );
        })}
      </svg>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {values.map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded border border-zinc-800/60 px-2 py-1.5">
            <dt className="text-zinc-500">{item.label}</dt>
            <dd className="font-medium text-amber-400">
              {item.value}/{radarMax}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
