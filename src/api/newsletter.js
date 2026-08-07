import { apiFetch } from "./client";

// GET /api/devices/{device_id}/newsletter/latest
export function getLatestNewsletter(deviceId) {
  return apiFetch(`/api/devices/${deviceId}/newsletter/latest`);
}
