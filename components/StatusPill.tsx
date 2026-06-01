import { statusTone } from "@/lib/format";

const tones = {
  good: "border-monster-green/35 bg-monster-green/15 text-monster-green",
  watch: "border-yellow-300/30 bg-yellow-300/10 text-yellow-200",
  bad: "border-monster-pink/35 bg-monster-pink/15 text-monster-pink",
  neutral: "border-white/15 bg-white/10 text-zinc-300",
};

export function StatusPill({ value }: { value: unknown }) {
  const label = value ? String(value) : "unknown";
  const tone = statusTone(value);

  return (
    <span className={`inline-flex min-h-7 items-center justify-center rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      {label}
    </span>
  );
}
