import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";

const architectureNotes = [
  {
    label: "LinkTap",
    detail: "Reservoir fill telemetry and manual water event context only.",
  },
  {
    label: "Ecowitt AC1100",
    detail: "Future pump power layer. No pump controls are exposed in this MVP.",
  },
  {
    label: "WH52",
    detail: "Decision-support soil sensors for moisture, temperature, and dryback context.",
  },
  {
    label: "Hydro Halo",
    detail: "Delivery rings for even irrigation once an approved manual or future safe automation event is triggered.",
  },
];

export default function IrrigationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Irrigation Status"
        title="Irrigation Architecture"
        description="Architecture notes only. No LinkTap, pump, AC1100, or irrigation control actions are built in this read-only MVP."
      />
      <DataPanel title="Irrigation System Notes">
        <div className="grid gap-4 md:grid-cols-2">
          {architectureNotes.map((item) => (
            <article className="rounded-lg border border-white/10 bg-black/20 p-4" key={item.label}>
              <h3 className="text-lg font-black text-monster-green">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </DataPanel>
    </>
  );
}
