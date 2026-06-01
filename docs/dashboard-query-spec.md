# Dashboard Query Spec — Monster Command

This document defines the minimal read-only queries and fields required for the Monster Command Codex dashboard. This is documentation only — no application code, workflows, secrets, or deployments are created.

1. Dashboard Overview

Provide high-level metrics for the dashboard home view:

- total_plants: COUNT(*) FROM plants
- active_cameras: COUNT(*) FROM cameras WHERE active = true (or camera_status indicates online)
- latest_sensor_readings_count: COUNT(*) FROM sensor_readings WHERE recorded_at > now() - interval '1 day' (or other window)
- open_alerts: COUNT(*) FROM alerts WHERE active = true
- seed_inventory_count: SUM(quantity) FROM seed_inventory
- seed_drops_count: COUNT(*) FROM seed_drops

2. Plants List

Fields required for listing plants (one row per plant):

- plant_id (plants.id)
- strain (plants.species or plants.variety)
- round (metadata->>'round' or a dedicated column)
- plant_type (metadata->>'plant_type' or a dedicated column)
- stage (metadata->>'stage' or latest stage field)
- status (derived or plants.status)
- sensor_channel (latest sensor channel id/string associated)
- camera_channel (camera_channels.channel_label or link)
- public_visibility (boolean flag; plants.metadata->>'public' or dedicated column)

Suggested query pattern: select plants.id, species, variety, metadata->>'round' as round, metadata->>'plant_type' as plant_type, metadata->>'stage' as stage, plants.status, cc.channel_label as camera_channel, sc.channel_label as sensor_channel, (plants.metadata->>'public')::boolean as public_visibility from plants left join camera_channels cc on cc.camera_id = plants.metadata->>'camera_id' left join sensor_channels sc on sc.camera_id = cc.camera_id;

3. Plant Detail View

For a single plant (by plant_id), provide:

- plant profile: all canonical metadata (nickname, species, variety, planted_at, location, metadata)
- latest sensor_reading: most recent sensor_readings row for this plant
- latest scores: most recent scores row for this plant
- recent manual_actions: last N manual_actions (e.g., 10) ordered by performed_at desc
- open alerts: alerts WHERE plant_id = :plant_id AND active = true

Suggested queries:
- SELECT * FROM plants WHERE id = :plant_id;
- SELECT * FROM sensor_readings WHERE plant_id = :plant_id ORDER BY recorded_at DESC LIMIT 1;
- SELECT * FROM scores WHERE plant_id = :plant_id ORDER BY snapshot_at DESC LIMIT 1;
- SELECT * FROM manual_actions WHERE plant_id = :plant_id ORDER BY performed_at DESC LIMIT 10;
- SELECT * FROM alerts WHERE plant_id = :plant_id AND active = true;

4. Camera Status View

Per-camera status listing:

- camera name (cameras.label)
- is_active (derived from camera_status or camera.active boolean)
- online (camera_status.status = 'online')
- last_seen_at (camera_status.last_heartbeat)
- linked camera channel if available (camera_channels.channel_label)

Suggested query:
- SELECT c.id, c.label, (cs.status = 'online') AS online, cs.last_heartbeat, cc.channel_label FROM cameras c LEFT JOIN camera_status cs ON cs.camera_id = c.id LEFT JOIN camera_channels cc ON cc.camera_id = c.id;

5. Sensor Board

Per-plant latest sensor readings and channel info:

- latest reading by plant_id (one row per plant)
- hardware_channel (sensor id or channel identifier)
- moisture (value->>'moisture' or numeric column)
- temperature (value->>'temperature' or numeric column)
- humidity (value->>'humidity' or numeric column)
- captured_at (recorded_at)

Suggested query pattern using DISTINCT ON (Postgres):
- SELECT DISTINCT ON (plant_id) plant_id, sensor_id as hardware_channel, value->>'moisture' AS moisture, value->>'temperature' AS temperature, value->>'humidity' AS humidity, recorded_at FROM sensor_readings ORDER BY plant_id, recorded_at DESC;

6. Score Board

Latest scores per plant with derived badges/status:

- latest stress_score
- latest breeding_score
- latest grow_score
- badge (derive from score thresholds, e.g., breeding_score >= 90 => 'breeder')
- status (derived state e.g., 'good', 'warning', 'critical')

Suggested query:
- Use DISTINCT ON to pick the latest scores per plant: SELECT DISTINCT ON (plant_id) plant_id, stress_score, breeding_score, grow_score, snapshot_at FROM scores ORDER BY plant_id, snapshot_at DESC;

Badge computation should be performed in the application layer or via SQL CASE expressions if desired.

7. Irrigation Panel

Requirements:

- latest WH52 readings (from sensor_readings for WH52 hardware channels)
- LinkTap reservoir-fill architecture note (documentation only)
- Ecowitt AC1100 pump-control architecture note (documentation only)
- manual confirmation required (UI note)
- automation_status = not_enabled (flag for UI)

Suggested query for WH52: SELECT DISTINCT ON (sensor_id) sensor_id, value->>'moisture' AS moisture, recorded_at FROM sensor_readings WHERE metadata->>'hardware_model' = 'WH52' ORDER BY sensor_id, recorded_at DESC;

8. Public Export Preview

Needs:

- public_exports latest row (SELECT * FROM public_exports ORDER BY created_at DESC LIMIT 1)
- public_visible plants (SELECT * FROM plants WHERE (metadata->>'public')::boolean = true)
- public camera channels (camera_channels joined to cameras where camera or channel is public)
- seed drops (recent public-facing seed_drops as needed)
- public sensor snapshot (small aggregated snapshot for public consumption)

Suggested query examples:
- SELECT * FROM public_exports ORDER BY created_at DESC LIMIT 1;
- SELECT id, nickname, species, metadata FROM plants WHERE (metadata->>'public')::boolean = true;

Important notes (security & operational)
- All dashboard queries MUST be read-only and use a least-privilege key. Do NOT expose service-role keys client-side.
- Prefer SQL views for complex joins/aggregation so the dashboard uses simple SELECT * FROM view_name; this improves auditability and testability.
- Add limits and pagination to all list queries.
- For large time-series (sensor_readings), use sampling or aggregated views (last 24h avg/min/max) to avoid pulling huge datasets into the UI.

