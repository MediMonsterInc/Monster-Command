# Supabase Schema Notes (selected tables)

This document describes the purpose, important columns, relationships, and suggested indexes for the core MVP tables observed in the live dataset.

Guiding conventions
- PKs: uuid with default uuid_generate_v4()
- Timestamps: created_at timestamptz NOT NULL DEFAULT now(); use separate recorded_at/observed_at where needed
- Metadata: jsonb for extensible fields
- Foreign keys: explicit FK constraints with ON DELETE behavior documented

1) plants
- Purpose: canonical plant registry (physical plants / tracked units)
- Example columns:
  - id uuid PK
  - nickname text
  - external_id text (hardware or external ref)
  - species text
  - variety text
  - location text (or geometry)
  - planted_at timestamptz
  - last_seen_at timestamptz
  - metadata jsonb
  - created_at timestamptz
- Relationships: one-to-many -> seed_drops, one-to-many -> scores, one-to-many -> manual_actions
- Indexes: index on external_id, planted_at, last_seen_at

2) camera_channels
- Purpose: channel-level configuration / recording streams associated with cameras
- Example columns:
  - id uuid PK
  - camera_id uuid FK -> cameras.id
  - channel_label text
  - stream_url text
  - resolution text
  - metadata jsonb
  - created_at timestamptz
- Indexes: camera_id, channel_label

3) cameras
- Purpose: physical camera devices
- Example columns:
  - id uuid PK
  - label text
  - model text
  - location text (or geometry)
  - installed_at timestamptz
  - manufacturer text
  - metadata jsonb
  - created_at timestamptz
- Indexes: label, model

4) camera_status
- Purpose: runtime/health/status info for cameras (last seen, connectivity)
- Example columns:
  - id uuid PK
  - camera_id uuid FK -> cameras.id
  - status text (enum: online, offline, degraded)
  - last_heartbeat timestamptz
  - details jsonb
  - created_at timestamptz
- Indexes: camera_id, last_heartbeat

5) sensor_readings
- Purpose: time-series readings from sensors (soil moisture, temp, etc.)
- Example columns:
  - id uuid PK
  - sensor_id uuid (nullable; if there is a sensor registry)
  - plant_id uuid (nullable) — optional link to plant observed
  - recorded_at timestamptz NOT NULL
  - value jsonb (or numeric value + unit)
  - unit text
  - metadata jsonb
  - created_at timestamptz
- Notes: consider hypertable (Timescale) or partitioning for high-volume series
- Indexes: (sensor_id, recorded_at), (plant_id, recorded_at)

6) scores
- Purpose: per-plant scoring snapshots (stress, grow, breeding, etc.)
- Example columns:
  - id uuid PK
  - plant_id uuid FK -> plants.id
  - snapshot_at timestamptz NOT NULL
  - stress_score integer
  - breeding_score integer
  - grow_score integer
  - details jsonb
  - created_at timestamptz
- Indexes: plant_id, snapshot_at

7) manual_actions
- Purpose: operator-recorded interventions (topping, pruning, etc.)
- Example columns:
  - id uuid PK
  - plant_id uuid FK -> plants.id
  - action_type text (enum or lookup)
  - performed_by text
  - performed_at timestamptz
  - notes text
  - created_at timestamptz
- Indexes: plant_id, performed_at

8) alerts
- Purpose: generated alerts/warnings (low moisture, camera offline)
- Example columns:
  - id uuid PK
  - plant_id uuid (nullable)
  - camera_id uuid (nullable)
  - alert_type text
  - severity text (info, warning, critical)
  - detail text
  - active boolean
  - detected_at timestamptz
  - resolved_at timestamptz (nullable)
  - created_at timestamptz
- Indexes: alert_type, active, detected_at

9) seed_inventory
- Purpose: inventory of seeds / batches
- Example columns:
  - id uuid PK
  - seed_type text
  - batch text
  - quantity integer
  - location text
  - received_at timestamptz
  - notes text
  - created_at timestamptz
- Indexes: batch, seed_type

10) seed_drops
- Purpose: events where seeds are planted/dropped
- Example columns:
  - id uuid PK
  - plant_id uuid FK -> plants.id (nullable)
  - seed_inventory_id uuid FK -> seed_inventory.id (nullable)
  - dropped_at timestamptz
  - quantity integer
  - method text
  - metadata jsonb
  - created_at timestamptz
- Indexes: plant_id, dropped_at

11) public_exports
- Purpose: metadata for generated public exports (CSV/JSON/GeoJSON) and storage links
- Example columns:
  - id uuid PK
  - name text
  - format text
  - url text
  - generated_by text
  - generated_at timestamptz
  - metadata jsonb
  - created_at timestamptz
- Indexes: name, format, generated_at

Operational recommendations (brief)
- Snapshot live schema and commit baseline migrations (supabase/migrations/).
- Generate TypeScript types from the current schema and place them in types/.
- For sensor_readings, consider time-series optimization (partitioning or Timescale) if volume grows.
- Keep all service-role keys out of repo; use repo secrets for CI workflows that apply migrations.
