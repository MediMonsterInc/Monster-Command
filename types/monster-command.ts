export type UnknownRow = Record<string, unknown>;

export type QueryState<T> = {
  data: T[];
  error?: string;
  source: "supabase" | "placeholder";
};

export type Plant = UnknownRow & {
  plant_id?: string;
  strain?: string;
  cultivar?: string;
  stage?: string;
  status?: string;
  sensor_channel?: string;
  camera_channel?: string;
  camera_id?: string;
  zone?: string;
};

export type CameraChannel = UnknownRow & {
  camera_id?: string;
  name?: string;
  purpose?: string;
  public_channel?: string;
  status?: string;
};

export type CameraStatus = UnknownRow & {
  camera_id?: string;
  online?: boolean;
  is_online?: boolean;
  status?: string;
  last_seen_at?: string;
};

export type SensorReading = UnknownRow & {
  sensor_channel?: string;
  hardware_channel?: string;
  plant_id?: string;
  moisture?: number;
  soil_moisture_pct?: number;
  temperature?: number;
  temperature_f?: number;
  ec?: number;
  humidity?: number;
  humidity_pct?: number;
  captured_at?: string;
};

export type Score = UnknownRow & {
  plant_id?: string;
  stress_score?: number;
  breeding_score?: number;
  grow_score?: number;
  badge?: string;
  score_type?: string;
  value?: number;
};

export type Alert = UnknownRow & {
  alert_type?: string;
  severity?: string;
  status?: string;
  title?: string;
  message?: string;
};

export type SeedInventory = UnknownRow & {
  seed_id?: string;
  strain?: string;
  breeder?: string;
  quantity?: number;
  status?: string;
};

export type SeedDrop = UnknownRow & {
  drop_id?: string;
  name?: string;
  plant_id?: string;
  status?: string;
  product_id?: string;
};

export type PublicExport = UnknownRow & {
  export_type?: string;
  payload?: UnknownRow;
  created_at?: string;
};

export type DashboardData = {
  plants: QueryState<Plant>;
  cameraChannels: QueryState<CameraChannel>;
  cameras: QueryState<CameraChannel>;
  cameraStatus: QueryState<CameraStatus>;
  sensors: QueryState<SensorReading>;
  scores: QueryState<Score>;
  alerts: QueryState<Alert>;
  seedInventory: QueryState<SeedInventory>;
  seedDrops: QueryState<SeedDrop>;
  publicExports: QueryState<PublicExport>;
};

export type PublicGrowExportPreview = {
  export_type: "public-grow-export";
  generated_at: string;
  source: "monster-command-mvp";
  plants: Array<Pick<Plant, "plant_id" | "strain" | "stage" | "status" | "sensor_channel">>;
  cameras: Array<Pick<CameraChannel, "camera_id" | "name" | "status"> & { online_status?: string }>;
  latest_sensor_readings: Array<Pick<SensorReading, "sensor_channel" | "plant_id" | "captured_at"> & {
    moisture?: number | null;
    temperature?: number | null;
    humidity?: number | null;
  }>;
  scores: Array<Pick<Score, "plant_id" | "badge"> & {
    stress_score?: number | null;
    breeding_score?: number | null;
    grow_score?: number | null;
  }>;
  alerts: Array<Pick<Alert, "alert_type" | "severity" | "status">>;
  seed_inventory: Array<Pick<SeedInventory, "seed_id" | "strain" | "breeder" | "quantity" | "status">>;
  seed_drops: Array<Pick<SeedDrop, "drop_id" | "name" | "plant_id" | "status" | "product_id">>;
  safety: {
    read_only: true;
    private_gateway_urls_excluded: true;
    irrigation_controls_excluded: true;
    pump_controls_excluded: true;
  };
};
