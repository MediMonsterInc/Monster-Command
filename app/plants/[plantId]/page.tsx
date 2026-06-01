import { notFound } from "next/navigation";

import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { StatusPill } from "@/components/StatusPill";
import { asText } from "@/lib/format";
import { getPlantByPlantId, getScores, getSensorReadings } from "@/lib/supabase/queries";

export default async function PlantDetailPage({ params }: { params: Promise<{ plantId: string }> }) {
  const { plantId } = await params;
  const decodedPlantId = decodeURIComponent(plantId);
  const [plantResult, sensors, scores] = await Promise.all([
    getPlantByPlantId(decodedPlantId),
    getSensorReadings(),
    getScores(),
  ]);
  const plant = plantResult.data[0];

  if (!plant) notFound();

  const plantSensors = sensors.data.filter((reading) => reading.plant_id === decodedPlantId || reading.sensor_channel === plant.sensor_channel || reading.hardware_channel === plant.sensor_channel);
  const plantScores = scores.data.filter((score) => score.plant_id === decodedPlantId);

  return (
    <>
      <PageHeader eyebrow="Plant Detail" title={asText(plant.plant_id)} description={asText(plant.strain ?? plant.cultivar)} />
      <div className="grid gap-4 xl:grid-cols-3">
        <DataPanel title="Plant Record">
          <SourceNotice state={plantResult} table="plants" />
          <dl className="mt-4 grid gap-3 text-sm">
            <div><dt className="text-zinc-500">Plant ID</dt><dd className="text-zinc-100">{asText(plant.plant_id)}</dd></div>
            <div><dt className="text-zinc-500">Strain</dt><dd className="text-zinc-100">{asText(plant.strain ?? plant.cultivar)}</dd></div>
            <div><dt className="text-zinc-500">Stage</dt><dd className="text-zinc-100">{asText(plant.stage)}</dd></div>
            <div><dt className="text-zinc-500">Status</dt><dd><StatusPill value={plant.status} /></dd></div>
            <div><dt className="text-zinc-500">Sensor Channel</dt><dd className="text-zinc-100">{asText(plant.sensor_channel)}</dd></div>
            <div><dt className="text-zinc-500">Camera Channel</dt><dd className="text-zinc-100">{asText(plant.camera_id ?? plant.camera_channel)}</dd></div>
          </dl>
        </DataPanel>

        <DataPanel title="Recent Sensor Readings" empty={plantSensors.length === 0}>
          <div className="grid gap-3">
            {plantSensors.slice(0, 5).map((reading, index) => (
              <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm" key={index}>
                <strong className="text-monster-green">{asText(reading.sensor_channel ?? reading.hardware_channel)}</strong>
                <p className="mt-1 text-zinc-400">Moisture {asText(reading.moisture ?? reading.soil_moisture_pct, "n/a")} / Temp {asText(reading.temperature ?? reading.temperature_f, "n/a")}</p>
              </div>
            ))}
          </div>
        </DataPanel>

        <DataPanel title="Scores" empty={plantScores.length === 0}>
          <div className="grid gap-3">
            {plantScores.slice(0, 5).map((score, index) => (
              <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm" key={index}>
                <strong className="text-monster-green">{asText(score.badge ?? score.score_type, "Score")}</strong>
                <p className="mt-1 text-zinc-400">Grow {asText(score.grow_score ?? score.value, "n/a")} / Stress {asText(score.stress_score, "n/a")} / Breeding {asText(score.breeding_score, "n/a")}</p>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
    </>
  );
}
