import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { StatusPill } from "@/components/StatusPill";
import { asText } from "@/lib/format";
import { getCameraChannels, getCameras, getCameraStatus } from "@/lib/supabase/queries";

function cameraOnline(cameraId: string, statuses: Awaited<ReturnType<typeof getCameraStatus>>["data"]) {
  const status = statuses.find((item) => item.camera_id === cameraId);
  if (!status) return "unknown";
  if (status.online === true || status.is_online === true) return "online";
  return status.status ?? "offline";
}

export default async function CamerasPage() {
  const [cameraChannels, cameras, cameraStatus] = await Promise.all([getCameraChannels(), getCameras(), getCameraStatus()]);
  const rows = [...cameraChannels.data, ...cameras.data];

  return (
    <>
      <PageHeader eyebrow="Camera Status" title="Cameras" description="Read-only public-safe camera status. Private gateway/admin URLs are not queried or displayed." />
      <DataPanel title="Camera Registry" subtitle="camera name and online status" empty={rows.length === 0}>
        <div className="mb-3 grid gap-2">
          <SourceNotice state={cameraChannels} table="camera_channels" />
          <SourceNotice state={cameraStatus} table="camera_status" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((camera, index) => {
            const cameraId = asText(camera.camera_id, `camera-${index}`);
            return (
              <article className="rounded-lg border border-white/10 bg-black/20 p-4" key={`${cameraId}-${index}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-lg text-white">{asText(camera.name)}</strong>
                    <p className="mt-1 text-sm text-zinc-400">{cameraId}</p>
                  </div>
                  <StatusPill value={cameraOnline(cameraId, cameraStatus.data)} />
                </div>
                <p className="mt-4 text-sm text-zinc-400">{asText(camera.purpose ?? camera.status, "No notes")}</p>
              </article>
            );
          })}
        </div>
      </DataPanel>
    </>
  );
}
