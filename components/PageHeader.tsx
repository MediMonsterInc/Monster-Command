export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-monster lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-monster-green">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">{description}</p> : null}
      </div>
      {children}
    </header>
  );
}
