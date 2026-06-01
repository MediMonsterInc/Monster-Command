import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { StatusPill } from "@/components/StatusPill";
import { asText } from "@/lib/format";
import { getSeedDrops, getSeedInventory } from "@/lib/supabase/queries";

export default async function SeedsPage() {
  const [inventory, drops] = await Promise.all([getSeedInventory(), getSeedDrops()]);

  return (
    <>
      <PageHeader eyebrow="Seeds" title="Seed Inventory and Drops" description="Read-only seed inventory and planned drop visibility for public export previews." />
      <div className="grid gap-4 xl:grid-cols-2">
        <DataPanel title="Seed Inventory" empty={inventory.data.length === 0}>
          <SourceNotice state={inventory} table="seed_inventory" />
          <div className="mt-3 overflow-x-auto">
            <table className="monster-table">
              <thead>
                <tr>
                  <th>Seed ID</th>
                  <th>Strain</th>
                  <th>Breeder</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.data.map((seed, index) => (
                  <tr key={`${asText(seed.seed_id)}-${index}`}>
                    <td>{asText(seed.seed_id)}</td>
                    <td>{asText(seed.strain)}</td>
                    <td>{asText(seed.breeder)}</td>
                    <td>{asText(seed.quantity, "0")}</td>
                    <td><StatusPill value={seed.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>

        <DataPanel title="Seed Drops" empty={drops.data.length === 0}>
          <SourceNotice state={drops} table="seed_drops" />
          <div className="mt-3 overflow-x-auto">
            <table className="monster-table">
              <thead>
                <tr>
                  <th>Drop ID</th>
                  <th>Name</th>
                  <th>Plant ID</th>
                  <th>Product</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drops.data.map((drop, index) => (
                  <tr key={`${asText(drop.drop_id)}-${index}`}>
                    <td>{asText(drop.drop_id)}</td>
                    <td>{asText(drop.name)}</td>
                    <td>{asText(drop.plant_id)}</td>
                    <td>{asText(drop.product_id)}</td>
                    <td><StatusPill value={drop.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      </div>
    </>
  );
}
