import { unstable_noStore as noStore } from "next/cache";

import { getSupabaseClient } from "@/lib/supabase/client";
import {
  placeholderAlerts,
  placeholderCameraChannels,
  placeholderCameraStatus,
  placeholderPlants,
  placeholderScores,
  placeholderSeedDrops,
  placeholderSeedInventory,
  placeholderSensors,
} from "@/lib/supabase/placeholders";
import type {
  Alert,
  CameraChannel,
  CameraStatus,
  DashboardData,
  Plant,
  PublicExport,
  PublicGrowExportPreview,
  QueryState,
  Score,
  SeedDrop,
  SeedInventory,
  SensorReading,
  UnknownRow,
} from "@/types/monster-command";

type ReadOptions = {
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
};

function placeholderState<T>(data: T[], error?: string): QueryState<T> {
  return { data, error, source: "placeholder" };
}

function supabaseState<T>(data: T[], error?: string): QueryState<T> {
  return { data, error, source: error ? "placeholder" : "supabase" };
}

async function readTable<T extends UnknownRow>(
  table: string,
  fallback: T[],
  options: ReadOptions = {},
): Promise<QueryState<T>> {
  noStore();
  const client = getSupabaseClient();
  if (!client) {
    return placeholderState(fallback, "Supabase environment variables are not configured.");
  }

  const limit = options.limit ?? 100;
  let query = client.from(table).select("*").limit(limit);
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }

  let result = await query;

  if (result.error && options.orderBy) {
    result = await client.from(table).select("*").limit(limit);
  }

  if (result.error) {
    return supabaseState(fallback, `${table}: ${result.error.message}`);
  }

  return supabaseState((result.data ?? []) as T[]);
}

export async function getPlants() {
  return readTable<Plant>("plants", placeholderPlants, { limit: 200 });
}

export async function getPlantByPlantId(plantId: string) {
  noStore();
  const client = getSupabaseClient();
  if (!client) {
    const plant = placeholderPlants.find((item) => item.plant_id === plantId);
    return placeholderState(plant ? [plant] : [], "Supabase environment variables are not configured.");
  }

  const result = await client.from("plants").select("*").eq("plant_id", plantId).limit(1);
  if (result.error) {
    const plant = placeholderPlants.find((item) => item.plant_id === plantId);
    return supabaseState(plant ? [plant] : [], `plants: ${result.error.message}`);
  }

  return supabaseState((result.data ?? []) as Plant[]);
}

export async function getCameraChannels() {
  return readTable<CameraChannel>("camera_channels", placeholderCameraChannels, { limit: 100 });
}

export async function getCameras() {
  return readTable<CameraChannel>("cameras", [], { limit: 100 });
}

export async function getCameraStatus() {
  return readTable<CameraStatus>("camera_status", placeholderCameraStatus, { limit: 100 });
}

export async function getSensorReadings() {
  return readTable<SensorReading>("sensor_readings", placeholderSensors, {
    limit: 100,
    orderBy: "captured_at",
    ascending: false,
  });
}

export async function getScores() {
  return readTable<Score>("scores", placeholderScores, {
    limit: 100,
    orderBy: "calculated_at",
    ascending: false,
  });
}

export async function getAlerts() {
  return readTable<Alert>("alerts", placeholderAlerts, {
    limit: 100,
    orderBy: "created_at",
    ascending: false,
  });
}

export async function getSeedInventory() {
  return readTable<SeedInventory>("seed_inventory", placeholderSeedInventory, { limit: 100 });
}

export async function getSeedDrops() {
  return readTable<SeedDrop>("seed_drops", placeholderSeedDrops, { limit: 100 });
}

export async function getPublicExports() {
  return readTable<PublicExport>("public_exports", [], {
    limit: 20,
    orderBy: "created_at",
    ascending: false,
  });
}

export async function getDashboardData(): Promise<DashboardData> {
  const [
    plants,
    cameraChannels,
    cameras,
    cameraStatus,
    sensors,
    scores,
    alerts,
    seedInventory,
    seedDrops,
    publicExports,
  ] = await Promise.all([
    getPlants(),
    getCameraChannels(),
    getCameras(),
    getCameraStatus(),
    getSensorReadings(),
    getScores(),
    getAlerts(),
    getSeedInventory(),
    getSeedDrops(),
    getPublicExports(),
  ]);

  return {
    plants,
    cameraChannels,
    cameras,
    cameraStatus,
    sensors,
    scores,
    alerts,
    seedInventory,
    seedDrops,
    publicExports,
  };
}

function firstNumber(...values: unknown[]) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }

  return null;
}

function onlineStatusFor(cameraId: string | undefined, statuses: CameraStatus[]) {
  const status = statuses.find((item) => item.camera_id === cameraId);
  if (!status) return "unknown";
  if (status.online === true || status.is_online === true) return "online";
  return String(status.status ?? "offline");
}

export async function getPublicExportPreview(): Promise<PublicGrowExportPreview> {
  const data = await getDashboardData();
  const cameraRows = [...data.cameraChannels.data, ...data.cameras.data];

  return {
    export_type: "public-grow-export",
    generated_at: new Date().toISOString(),
    source: "monster-command-mvp",
    plants: data.plants.data.map((plant) => ({
      plant_id: plant.plant_id,
      strain: plant.strain ?? plant.cultivar,
      stage: plant.stage,
      status: plant.status,
      sensor_channel: plant.sensor_channel,
    })),
    cameras: cameraRows.map((camera) => ({
      camera_id: camera.camera_id,
      name: camera.name,
      status: camera.status,
      online_status: onlineStatusFor(camera.camera_id, data.cameraStatus.data),
    })),
    latest_sensor_readings: data.sensors.data.map((reading) => ({
      sensor_channel: reading.sensor_channel ?? reading.hardware_channel,
      plant_id: reading.plant_id,
      moisture: firstNumber(reading.moisture, reading.soil_moisture_pct),
      temperature: firstNumber(reading.temperature, reading.temperature_f),
      humidity: firstNumber(reading.humidity, reading.humidity_pct),
      captured_at: reading.captured_at,
    })),
    scores: data.scores.data.map((score) => ({
      plant_id: score.plant_id,
      stress_score: firstNumber(score.stress_score),
      breeding_score: firstNumber(score.breeding_score),
      grow_score: firstNumber(score.grow_score, score.value),
      badge: score.badge,
    })),
    alerts: data.alerts.data.map((alert) => ({
      alert_type: alert.alert_type,
      severity: alert.severity,
      status: alert.status,
    })),
    seed_inventory: data.seedInventory.data.map((seed) => ({
      seed_id: seed.seed_id,
      strain: seed.strain,
      breeder: seed.breeder,
      quantity: seed.quantity,
      status: seed.status,
    })),
    seed_drops: data.seedDrops.data.map((drop) => ({
      drop_id: drop.drop_id,
      name: drop.name,
      plant_id: drop.plant_id,
      status: drop.status,
      product_id: drop.product_id,
    })),
    safety: {
      read_only: true,
      private_gateway_urls_excluded: true,
      irrigation_controls_excluded: true,
      pump_controls_excluded: true,
    },
  };
}
