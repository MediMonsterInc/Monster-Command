# Dashboard Component & API Plan — Monster Command

This document defines the planned component hierarchy, read-only API endpoints, response shapes, Supabase source tables, component props/state, pagination/caching rules, and tests for the Codex dashboard. This is documentation only — no app code, package files, workflows, secrets, or deployments are created.

1. Component hierarchy

- DashboardShell
  - OverviewCards
  - PlantsList
  - PlantDetailPanel
  - CameraStatusPanel
  - SensorBoard
  - ScoreBoard
  - IrrigationPanel
  - AlertsPanel
  - PublicExportPreview

Notes: Components should be composed so that DashboardShell fetches high-level overview data and delegates list/detail fetches to child components. PlantDetailPanel can be an overlay or route-driven panel.

2. API endpoint plan (read-only)

- GET /api/dashboard/overview
- GET /api/plants
- GET /api/plants/:plant_id
- GET /api/cameras/status
- GET /api/sensors/latest
- GET /api/scores/latest
- GET /api/alerts/open
- GET /api/public-export/preview

All endpoints are read-only and should use a least-privilege DB role or Supabase anon key on server-side endpoints. Prefer server-side-only endpoints that return aggregated views.

3. Expected JSON response shape for each endpoint

GET /api/dashboard/overview
{
  "total_plants": 15,
  "active_cameras": 3,
  "latest_sensor_readings_count": 10,
  "open_alerts": 1,
  "seed_inventory_count": 240,
  "seed_drops_count": 4
}

GET /api/plants (paginated)
{
  "data": [
    {
      "plant_id": "uuid",
      "strain": "Chocolope",
      "round": "R1",
      "plant_type": "mother",
      "stage": "flower",
      "status": "healthy",
      "sensor_channel": "WH52-CH1",
      "camera_channel": "Cam-01-CH1",
      "public_visibility": true
    }
  ],
  "pagination": { "limit": 50, "offset": 0, "total": 15 }
}

GET /api/plants/:plant_id
{
  "plant": {
    "plant_id": "uuid",
    "nickname": "Glass Slipper",
    "species": "",
    "variety": "",
    "planted_at": "2026-...",
    "location": "R1.1",
    "metadata": { ... }
  },
  "latest_sensor_reading": { "sensor_id": "uuid", "value": {"moisture": 0.34}, "unit": "pct", "recorded_at": "..." },
  "latest_scores": { "stress_score": 88, "breeding_score": 92, "grow_score": 84, "snapshot_at": "..." },
  "recent_manual_actions": [ { "action_type": "topping", "performed_by": "operator", "performed_at": "..." } ],
  "open_alerts": [ { "alert_type": "low_moisture", "severity": "warning", "detected_at": "..." } ]
}

GET /api/cameras/status
{
  "data": [
    { "camera_id": "uuid", "label": "Photoperiod Rooftop Cam", "is_active": true, "online": true, "last_seen_at": "...", "channel_label": "CH1" }
  ]
}

GET /api/sensors/latest
{
  "data": [
    { "plant_id": "uuid", "sensor_id": "uuid", "hardware_channel": "WH52-CH1", "moisture": 0.34, "temperature": 22.5, "humidity": 52, "captured_at": "..." }
  ]
}

GET /api/scores/latest
{
  "data": [
    { "plant_id": "uuid", "stress_score": 88, "breeding_score": 92, "grow_score": 84, "snapshot_at": "...", "badge": "breeder", "status": "good" }
  ]
}

GET /api/alerts/open
{
  "data": [
    { "alert_id": "uuid", "plant_id": "uuid", "alert_type": "low_moisture", "severity": "warning", "detected_at": "..." }
  ]
}

GET /api/public-export/preview
{
  "public_export": { "id": "uuid", "name": "latest-export", "format": "csv", "url": "https://...", "generated_at": "..." },
  "public_plants_count": 5,
  "public_camera_channels": [ { "camera_id": "uuid", "channel_label": "CH1" } ],
  "seed_drops": [ { "id": "uuid", "plant_id": "uuid", "dropped_at": "..." } ],
  "sensor_snapshot": { /* small aggregated snapshot */ }
}

4. Supabase source tables used by each endpoint

- /api/dashboard/overview: plants, cameras, sensor_readings, alerts, seed_inventory, seed_drops
- /api/plants: plants, camera_channels, sensor_channels (if present), scores (for optional fields)
- /api/plants/:plant_id: plants, sensor_readings, scores, manual_actions, alerts
- /api/cameras/status: cameras, camera_status, camera_channels
- /api/sensors/latest: sensor_readings (filter by recent), sensors (if registry exists)
- /api/scores/latest: scores
- /api/alerts/open: alerts
- /api/public-export/preview: public_exports, plants, camera_channels, seed_drops, sensor_readings (aggregated)

5. Required props/state for each component

DashboardShell
- state: overview (object), loading flags, selectedPlantId
- props: none (root-level)

OverviewCards
- props: overview (object)
- state: none

PlantsList
- props: pageSize, initialFilter
- state: plants[], pagination {limit, offset, total}, selectedPlantId

PlantDetailPanel
- props: plantId
- state: plant, latestSensor, latestScores, manualActions[], alerts[]

CameraStatusPanel
- props: none
- state: cameras[]

SensorBoard
- props: refreshInterval
- state: latestReadings[]

ScoreBoard
- props: plantIds[] (optional)
- state: scores[]

IrrigationPanel
- props: none
- state: wh52Readings[], automationStatus

AlertsPanel
- props: filter (active only)
- state: alerts[]

PublicExportPreview
- props: none
- state: publicExport, publicPlants[], publicChannels[], seedDrops[]

6. Pagination / caching plan

- Overview: cache for short-term (30s - 60s) in server or CDN; update on page load and on manual refresh.
- latest sensor readings: cache very short-term (10s - 30s); clients may poll via a safe endpoint.
- time-series sensor readings: paginated by recorded_at (cursor-based pagination); server should provide aggregated summaries for charts (e.g., downsampled hourly) and provide on-demand detailed pages.
- alerts: filter by status (active/inactive) and paginate if many. Cache active alerts short-term (10-30s).
- manual_actions: return recent N (limit 10) by default; paginate if historical view requested.

7. Tests

API endpoint tests
- Verify /api/dashboard/overview returns correct aggregates for a seeded DB.
- Verify /api/plants pagination and filters behave correctly.
- Verify /api/plants/:plant_id returns correct nested objects (latest sensor, scores, actions).
- Verify /api/cameras/status returns camera online statuses.
- Verify RLS/permission enforced (least-privilege key cannot write; endpoints reject write attempts).

Component render tests
- OverviewCards renders metrics correctly given mock data.
- PlantsList renders empty state and list state.
- PlantDetailPanel shows latest sensor and scores when available and handles missing gracefully.

Empty state tests
- Each component shows appropriate empty / loading state when API returns no data.

RLS / permission behavior tests
- Mock different keys (limited vs. elevated) and validate API enforces read-only access.

Important notes (doc-only)
- Keep endpoints read-only and server-side. Do not embed service role keys in client bundles.
- Prefer SQL views for complex aggregations and join logic. Keep views small and documented.
- Add rate limits to endpoints that may be polled frequently (sensor board).

