# Monster Command — Current Supabase Status

This document records the current live state of the Supabase/Postgres MVP backing Monster Command (observed snapshot).

Snapshot (tables & row counts)

- plants: 15 rows
- camera_channels: 9 rows
- cameras: 3 rows
- camera_status: 3 rows
- seed_inventory: 23 rows
- seed_drops: 4 rows
- public_exports: 1 row
- sensor_readings: 1 row
- scores: 3 rows
- manual_actions: 3 rows
- alerts: 1 row

Notes on working data (high level)

- Recent sensor reading:
  - First WH52 test reading recorded for Chocolope (plant nickname) / R1.1CHLP / WH52-CH1.

- Glass Slipper (plant) — scores snapshot:
  - stress_score: 88
  - breeding_score: 92
  - grow_score: 84

- Glass Slipper manual action recorded:
  - topping

- Glass Slipper alert recorded:
  - low_moisture (warning)

- Camera records currently present (3 cameras):
  - Photoperiod Rooftop Cam
  - Autoflower Rooftop Cam
  - Breeding House Cam

Irrigation architecture (live/dev description)

- LinkTap fills the main reservoir.
- An Ecowitt AC1100 device controls pump power (on/off control).
- The pump sends reservoir water to Hydro Halo rings (point irrigation around plants).
- WH52 (soil moisture) sensors are currently used for decision-support only (no automatic shutoff tied to WH52 readings yet).

Operational notes

- This document is for project and engineering tracking only. Do NOT commit any secrets or production keys in repo files.
- The current dataset is minimal (MVP). Before adding migrations or automation, snapshot the DB (dump) and record schema versions.
- If you plan any schema changes, create SQL migrations and run them through a gated workflow (manual deploy) with the service role key kept in GitHub Secrets.

Recommended immediate actions

1. Backup: create a safe DB snapshot or export of the current data (off-repo storage).
2. Schema inventory: generate the current schema SQL from the live DB and add it to supabase/migrations as baseline (with a note linking to this status file).
3. Types: generate TypeScript/ORM types from the live schema and place them under types/ for use by the dashboard.
4. Dashboard plan: start a Codex dashboard spec (endpoints / queries / visuals) that consumes small-scope tables first (plants, cameras, sensor_readings, scores).

