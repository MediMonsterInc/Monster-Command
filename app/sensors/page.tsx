import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { asText, formatDateTime } from "@/lib/format";
import { getSensorReadings } from "@/lib/supabase/queries";

export default async function SensorsPage() {
  const sensors = await getSensorReadings();

  // Deduplicate by sensor_channel; keep latest reading per channel
  const sensorsByChannel = new Map<string, typeof sensors.data[0]>();
  for (const reading of sensors.data) {
    const channel = asText(reading.sensor_channel ?? reading.hardware_channel, "");
    if (channel && !sensorsByChannel.has(channel)) {
      sensorsByChannel.set(channel, reading);
    }
  }
  const uniqueSensors = Array.from(sensorsByChannel.values());

  return (
    <>
      <PageHeader eyebrow="Sensor Board" title="Sensors" description="WH52 and normalized sensor readings shown as decision-support data only." />
      <DataPanel title="Latest Sensor Readings" subtitle="moisture, temperature, EC, captured_at" empty={uniqueSensors.length === 0}>
        <SourceNotice state={sensors} table="sensor_readings" />
        <div className="mt-3 overflow-x-auto">
          <table className="monster-table">
            <thead>
              <tr>
                <th>Sensor Channel</th>
                <th>Plant ID</th>
                <th>Moisture</th>
                <th>Temperature</th>
                <th>EC</th>
                <th>Captured</th>
              </tr>
            </thead>
            <tbody>
              {uniqueSensors.length > 0 ? (
                uniqueSensors.map((reading) => (
                  <tr key={asText(reading.sensor_channel ?? reading.hardware_channel)}>
                    <td>{asText(reading.sensor_channel ?? reading.hardware_channel)}</td>
                    <td>{asText(reading.plant_id)}</td>
                    <td>{asText(reading.moisture ?? reading.soil_moisture_pct, "n/a")}</td>
                    <td>{asText(reading.temperature ?? reading.temperature_f, "n/a")}</td>
                    <td>{asText(reading.ec, "n/a")}</td>
                    <td>{formatDateTime(reading.captured_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400">
                    No reading yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </>
  );
}
