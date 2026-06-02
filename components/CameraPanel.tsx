import { asText, formatDateTime } from "@/lib/format";
import { DataPanel } from "@/components/DataPanel";
import { SourceNotice } from "@/components/SourceNotice";
import type { CameraChannel } from "@/types/monster-command";

interface CameraPanelProps {
  snapshots: Array<{
    camera_id?: string;
    image_url?: string;
    captured_at?: string;
  }>;
  channels: CameraChannel[];
  source: "supabase" | "placeholder";
}

export function CameraPanel({ snapshots, channels, source }: CameraPanelProps) {
  // Get latest snapshot per camera_id
  const latestByCamera = new Map();
  for (const snapshot of snapshots) {
    const cameraId = asText(snapshot.camera_id ?? "", "");
    if (cameraId && !latestByCamera.has(cameraId)) {
      latestByCamera.set(cameraId, snapshot);
    }
  }

  const displaySnapshots = Array.from(latestByCamera.values()).slice(0, 3);

  return (
    <DataPanel 
      title="Camera Snapshots" 
      subtitle="Latest captures from CAM-CH1, CAM-CH2, CAM-CH3"
      empty={displaySnapshots.length === 0}
    >
      <SourceNotice state={{ data: snapshots, source }} table="camera_snapshots" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displaySnapshots.map((snapshot) => {
          const channel = channels.find(
            (c) => asText(c.camera_id) === asText(snapshot.camera_id)
          );
          return (
            <div
              key={asText(snapshot.camera_id)}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3 overflow-hidden"
            >
              <div className="mb-2">
                <p className="text-xs font-bold uppercase text-zinc-400">
                  {asText(snapshot.camera_id)}
                </p>
                {channel?.name && (
                  <p className="text-sm font-semibold text-white">
                    {asText(channel.name)}
                  </p>
                )}
              </div>
              {snapshot.image_url ? (
                <div className="relative bg-black rounded overflow-hidden mb-2">
                  <img
                    src={asText(snapshot.image_url)}
                    alt={`${asText(snapshot.camera_id)} snapshot`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='128'%3E%3Crect fill='%23111' width='200' height='128'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='12' fill='%23666'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ) : (
                <div className="bg-black rounded h-32 flex items-center justify-center mb-2 text-xs text-zinc-500">
                  No snapshot
                </div>
              )}
              <p className="text-xs text-zinc-400">
                {formatDateTime(snapshot.captured_at)}
              </p>
            </div>
          );
        })}
      </div>
    </DataPanel>
  );
}
