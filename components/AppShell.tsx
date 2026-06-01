import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/plants", label: "Plants" },
  { href: "/cameras", label: "Cameras" },
  { href: "/sensors", label: "Sensors" },
  { href: "/scores", label: "Scores" },
  { href: "/alerts", label: "Alerts" },
  { href: "/seeds", label: "Seeds" },
  { href: "/irrigation", label: "Irrigation" },
  { href: "/exports", label: "Exports" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-monster-black text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-black/35 p-6 backdrop-blur-xl lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-monster-green/40 bg-monster-green/15 font-black text-monster-green shadow-slime">
            MC
          </div>
          <div>
            <p className="text-xs uppercase text-zinc-400">Private Grow OS</p>
            <h1 className="text-lg font-black">Monster Command</h1>
          </div>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <Link className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-monster-green" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 rounded-lg border border-monster-green/30 bg-monster-green/10 p-4">
          <p className="text-xs uppercase text-zinc-400">Read-only MVP</p>
          <p className="mt-2 text-sm text-zinc-200">No irrigation, pump, gateway admin, payment, account, blockchain, NFT, or community-card controls are enabled.</p>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
