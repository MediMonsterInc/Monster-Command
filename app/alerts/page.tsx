import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { StatusPill } from "@/components/StatusPill";
import { asText } from "@/lib/format";
import { getAlerts } from "@/lib/supabase/queries";

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <>
      <PageHeader eyebrow="Alerts" title="Alerts" description="Read-only alert queue. No acknowledgement or resolution writes are enabled in the MVP." />
      <DataPanel title="Alert Rows" subtitle="alert_type, severity, status" empty={alerts.data.length === 0}>
        <SourceNotice state={alerts} table="alerts" />
        <div className="mt-3 overflow-x-auto">
          <table className="monster-table">
            <thead>
              <tr>
                <th>Alert Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {alerts.data.map((alert, index) => (
                <tr key={`${asText(alert.alert_type)}-${index}`}>
                  <td>{asText(alert.alert_type)}</td>
                  <td><StatusPill value={alert.severity} /></td>
                  <td><StatusPill value={alert.status} /></td>
                  <td>{asText(alert.title ?? alert.message, "No message")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </>
  );
}
