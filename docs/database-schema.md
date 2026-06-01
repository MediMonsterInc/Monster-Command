# Database Schema Documentation

This document summarizes the tables used by the Monster Command MVP.

## plants

- `plant_id`
- `strain`
- `stage`
- `status`
- `sensor_channel`
- `camera_id` or `camera_channel`
- `zone`

## cameras / camera_channels

- `camera_id`
- `name`
- `status`
- `public_channel`
- `purpose`
- `embed_url`
- `snapshot_url`

Only public-safe camera fields should be shown.

## camera_status

- `camera_id`
- `online` or `is_online`
- `status`
- `last_seen_at`

## sensor_readings

- `sensor_channel` or `hardware_channel`
- `plant_id`
- `moisture` or `soil_moisture_pct`
- `temperature` or `temperature_f`
- `humidity` or `humidity_pct`
- `captured_at`

## scores

- `plant_id`
- `stress_score`
- `breeding_score`
- `grow_score`
- `badge`

## alerts

- `alert_type`
- `severity`
- `status`
- `title`
- `message`

## seed_inventory

- `seed_id`
- `strain`
- `breeder`
- `quantity`
- `status`

## seed_drops

- `drop_id`
- `name`
- `plant_id`
- `product_id`
- `status`

## public_exports

- `export_type`
- `payload`
- `created_at`
