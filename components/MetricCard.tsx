export function MetricCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-monster-panel p-4 shadow-monster">
      <p className="text-xs font-bold uppercase tracking-normal text-zinc-400">{label}</p>
      <strong className="mt-2 block text-3xl font-black text-monster-green">{value}</strong>
      {detail ? <span className="mt-2 block text-sm text-zinc-400">{detail}</span> : null}
    </article>
  );
}
