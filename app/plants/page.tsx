import Link from "next/link";

import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { StatusPill } from "@/components/StatusPill";
import { asText } from "@/lib/format";
import { getPlants } from "@/lib/supabase/queries";

export default async function PlantsPage() {
  const plants = await getPlants();

  return (
    <>
      <PageHeader eyebrow="Plant Registry" title="Plants" description="Biological plant IDs stay separate from hardware sensor and camera channels." />
      <DataPanel title="Plant List" subtitle="Read-only rows from plants" empty={plants.data.length === 0}>
        <SourceNotice state={plants} table="plants" />
        <div className="mt-3 overflow-x-auto">
          <table className="monster-table">
            <thead>
              <tr>
                <th>Plant ID</th>
                <th>Strain</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Sensor Channel</th>
              </tr>
            </thead>
            <tbody>
              {plants.data.map((plant) => (
                <tr key={asText(plant.plant_id)}>
                  <td>
                    <Link className="monster-link" href={`/plants/${encodeURIComponent(asText(plant.plant_id))}`}>
                      {asText(plant.plant_id)}
                    </Link>
                  </td>
                  <td>{asText(plant.strain ?? plant.cultivar)}</td>
                  <td>{asText(plant.stage)}</td>
                  <td><StatusPill value={plant.status} /></td>
                  <td>{asText(plant.sensor_channel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </>
  );
}
