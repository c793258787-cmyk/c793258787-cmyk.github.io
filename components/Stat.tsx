type StatProps = {
  label: string;
  value: string | number;
};

export function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-md border border-zinc-800/60 bg-panel p-4">
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-amber-400">{value}</dd>
    </div>
  );
}
