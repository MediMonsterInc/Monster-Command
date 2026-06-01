import Link from "next/link";

import { DataPanel } from "@/components/DataPanel";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { StatusPill } from "@/components/StatusPill";
import { asText, formatDateTime } from "@/lib/format";
import { getDashboardData } from "@/lib/supabase/queries";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const cameraRows = [...data.cameraChannels.data, ...data.cameras.data];
  const openAlerts = data.alerts.data.filter((alert) => asText(alert.status, "").toLowerCase() !== "resolved").length;

  return (
    <>
      <PageHeader
        eyebrow="Dashboard Overview"
        title="Monster Command MVP"
        description="Read-only command view for live plants, sensors, cameras, scores, alerts, seeds, and public export readiness."
      >
        <Link className="rounded-lg border border-monster-green/40 bg-monster-green/15 px-4 py-3 text-sm font-black text-monster-green shadow-slime" href="/exports">
          Generate Public Export
        </Link>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Plants" value={data.plants.data.length} detail={data.plants.source} />
        <MetricCard label="Cameras" value={cameraRows.length} detail={data.cameraChannels.source} />
        <MetricCard label="Sensor Reads" value={data.sensors.data.length} detail={data.sensors.source} />
        <MetricCard label="Scores" value={data.scores.data.length} detail={data.scores.source} />
        <MetricCard label="Open Alerts" value={openAlerts} detail={data.alerts.source} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DataPanel title="Plants" subtitle="plant_id, strain, stage, status, sensor_channel" empty={data.plants.data.length === 0}>
          <SourceNotice state={data.plants} table="plants" />
          <div className="mt-3 overflow-x-auto">
            <table className="monster-table">
              <thead>
                <tr>
                  <th>Plant ID</th>
                  <th>Strain</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Sensor</th>
                </tr>
              </thead>
              <tbody>
                {data.plants.data.slice(0, 8).map((plant) => (
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

        <DataPanel title="Latest Sensors" subtitle="moisture, temperature, humidity, captured_at" empty={data.sensors.data.length === 0}>
          <SourceNotice state={data.sensors} table="sensor_readings" />
          <div className="mt-3 overflow-x-auto">
            <table className="monster-table">
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Moisture</th>
                  <th>Temp</th>
                  <th>Humidity</th>
                  <th>Captured</th>
                </tr>
              </thead>
              <tbody>
                {data.sensors.data.slice(0, 8).map((reading, index) => (
                  <tr key={`${asText(reading.sensor_channel ?? reading.hardware_channel)}-${index}`}>
                    <td>{asText(reading.sensor_channel ?? reading.hardware_channel)}</td>
                    <td>{asText(reading.moisture ?? reading.soil_moisture_pct, "n/a")}</td>
                    <td>{asText(reading.temperature ?? reading.temperature_f, "n/a")}</td>
                    <td>{asText(reading.humidity ?? reading.humidity_pct, "n/a")}</td>
                    <td>{formatDateTime(reading.captured_at)}</td>
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
