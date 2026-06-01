export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-monster-green/25 bg-black/20 p-5 text-sm text-zinc-300">
      <strong className="block text-zinc-100">{title}</strong>
      {detail ? <p className="mt-2 text-zinc-400">{detail}</p> : null}
    </div>
  );
}
