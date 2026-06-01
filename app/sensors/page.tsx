import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { asText, formatDateTime } from "@/lib/format";
import { getSensorReadings } from "@/lib/supabase/queries";

export default async function SensorsPage() {
  const sensors = await getSensorReadings();

  return (
    <>
      <PageHeader eyebrow="Sensor Board" title="Sensors" description="WH52 and normalized sensor readings shown as decision-support data only." />
      <DataPanel title="Latest Sensor Readings" subtitle="moisture, temperature, humidity, captured_at" empty={sensors.data.length === 0}>
        <SourceNotice state={sensors} table="sensor_readings" />
        <div className="mt-3 overflow-x-auto">
          <table className="monster-table">
            <thead>
              <tr>
                <th>Sensor Channel</th>
                <th>Plant ID</th>
                <th>Moisture</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Captured</th>
              </tr>
            </thead>
            <tbody>
              {sensors.data.map((reading, index) => (
                <tr key={`${asText(reading.sensor_channel ?? reading.hardware_channel)}-${index}`}>
                  <td>{asText(reading.sensor_channel ?? reading.hardware_channel)}</td>
                  <td>{asText(reading.plant_id)}</td>
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
    </>
  );
}
