import { apiFetch } from "./client";

// GET /api/devices/{device_id}/plant-state
export function getPlantState(deviceId) {
  return apiFetch(`/api/devices/${deviceId}/plant-state`);
}
