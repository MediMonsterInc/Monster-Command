import type {
  Alert,
  CameraChannel,
  CameraStatus,
  Plant,
  Score,
  SeedDrop,
  SeedInventory,
  SensorReading,
} from "@/types/monster-command";

export const placeholderPlants: Plant[] = [
  {
    plant_id: "R1.1CHLP",
    strain: "Chocolope",
    stage: "Flower W3",
    status: "active",
    sensor_channel: "WH52-CH1",
  },
  {
    plant_id: "R1.1KM",
    strain: "Kush Mints",
    stage: "Flower W3",
    status: "watch",
    sensor_channel: "WH52-CH2",
  },
  {
    plant_id: "R1.1CPOG-01",
    strain: "Cherry Pie OG",
    stage: "Flower W3",
    status: "active",
    sensor_channel: "WH52-CH3",
  },
  {
    plant_id: "R1.1ZK-01",
    strain: "Zkittlez",
    stage: "Flower W3",
    status: "active",
    sensor_channel: "WH52-CH4",
  },
  {
    plant_id: "R1.1GS",
    strain: "Glass Slipper",
    stage: "Flower W3",
    status: "active",
    sensor_channel: "WH52-CH5",
  },
];

export const placeholderCameraChannels: CameraChannel[] = [
  { camera_id: "CAM-CH1", name: "Photoperiod", status: "relay_needed", public_channel: "CH1" },
  { camera_id: "CAM-CH2", name: "Auto Flower", status: "relay_needed", public_channel: "CH2" },
  { camera_id: "CAM-CH3", name: "Breeding House", status: "priority_live_proof", public_channel: "CH3" },
];

export const placeholderCameraStatus: CameraStatus[] = [
  { camera_id: "CAM-CH1", online: false, status: "relay_needed" },
  { camera_id: "CAM-CH2", online: false, status: "relay_needed" },
  { camera_id: "CAM-CH3", online: false, status: "priority_live_proof" },
];

export const placeholderSensors: SensorReading[] = [
  {
    sensor_channel: "WH52-CH1",
    plant_id: "R1.1CHLP",
    moisture: 36,
    temperature: 69.8,
    humidity: 52,
    captured_at: new Date().toISOString(),
  },
  {
    sensor_channel: "WH52-CH2",
    plant_id: "R1.1KM",
    moisture: 31,
    temperature: 70.4,
    humidity: 51,
    captured_at: new Date().toISOString(),
  },
  {
    sensor_channel: "WH52-CH3",
    plant_id: "R1.1CPOG-01",
    moisture: 38,
    temperature: 70.1,
    humidity: 53,
    captured_at: new Date().toISOString(),
  },
  {
    sensor_channel: "WH52-CH4",
    plant_id: "R1.1ZK-01",
    moisture: 34,
    temperature: 69.5,
    humidity: 50,
    captured_at: new Date().toISOString(),
  },
  {
    sensor_channel: "WH52-CH5",
    plant_id: "R1.1GS",
    moisture: 40,
    temperature: 70.2,
    humidity: 54,
    captured_at: new Date().toISOString(),
  },
];

export const placeholderScores: Score[] = [
  { plant_id: "R1.1CHLP", stress_score: 12, breeding_score: 78, grow_score: 92, badge: "Best rhythm" },
  { plant_id: "R1.1KM", stress_score: 28, breeding_score: 71, grow_score: 86, badge: "Needs watch" },
  { plant_id: "R1.1CPOG-01", stress_score: 15, breeding_score: 82, grow_score: 89, badge: "Stable" },
  { plant_id: "R1.1ZK-01", stress_score: 18, breeding_score: 79, grow_score: 91, badge: "Strong" },
  { plant_id: "R1.1GS", stress_score: 88, breeding_score: 92, grow_score: 84, badge: "Breeder Elite" },
];

export const placeholderAlerts: Alert[] = [
  { alert_type: "dryback", severity: "info", status: "open", title: "Kush Mints dryback watch" },
];

export const placeholderSeedInventory: SeedInventory[] = [
  { seed_id: "INV-001", strain: "Rooftop Proven Test Lot", breeder: "Medi Monster", quantity: 20, status: "stored" },
];

export const placeholderSeedDrops: SeedDrop[] = [
  { drop_id: "DROP-001", name: "Rooftop Proven R1.1", plant_id: "R1.1GS", status: "planned", product_id: "RP-R11" },
];
