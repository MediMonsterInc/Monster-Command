import { EmptyState } from "@/components/EmptyState";

export function DataPanel({
  title,
  subtitle,
  children,
  empty,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-monster">
      <div className="mb-4">
        <h3 className="text-lg font-black text-white">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
      </div>
      {empty ? <EmptyState title={`No ${title.toLowerCase()} records found`} detail="The page is wired and will show rows when Supabase returns data." /> : children}
    </section>
  );
}
