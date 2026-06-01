import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { formatDateTime } from "@/lib/format";
import { getPublicExportPreview, getPublicExports } from "@/lib/supabase/queries";

export default async function ExportsPage() {
  const [preview, publicExports] = await Promise.all([getPublicExportPreview(), getPublicExports()]);

  return (
    <>
      <PageHeader
        eyebrow="Public Export Preview"
        title="Generate Public Export"
        description="This page generates a read-only preview from current Supabase records. It does not write to public_exports or expose private gateway URLs."
      >
        <a className="rounded-lg border border-monster-green/40 bg-monster-green/15 px-4 py-3 text-sm font-black text-monster-green shadow-slime" href="/exports">
          Generate Public Export
        </a>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DataPanel title="public-grow-export.json Preview">
          <pre className="max-h-[720px] overflow-auto rounded-lg border border-monster-green/20 bg-black/40 p-4 text-xs leading-5 text-green-100">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </DataPanel>

        <DataPanel title="Existing Export Records" empty={publicExports.data.length === 0}>
          <SourceNotice state={publicExports} table="public_exports" />
          <div className="mt-3 grid gap-3">
            {publicExports.data.map((item, index) => (
              <article className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm" key={index}>
                <strong className="text-monster-green">{String(item.export_type ?? "public-grow-export")}</strong>
                <p className="mt-1 text-zinc-400">{formatDateTime(item.created_at)}</p>
              </article>
            ))}
          </div>
        </DataPanel>
      </div>
    </>
  );
}
