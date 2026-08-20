import { api } from "./client";

export async function registerDevice(deviceUuid) {
  return api.post("/api/v1/devices", { deviceUuid });
}
export async function getDevices() {
  return api.get("/api/v1/devices");
}
export async function renameDevice(deviceUuid, deviceName) {
  return api.patch(`/api/v1/devices/${deviceUuid}`, { deviceName });
}
export async function connectDevice(deviceUuid) {
  return api.patch(`/api/v1/devices/${deviceUuid}/connect`);
}
export async function disconnectDevice(deviceUuid) {
  return api.patch(`/api/v1/devices/${deviceUuid}/disconnect`);
}
export async function deleteDevice(deviceUuid) {
  return api.delete(`/api/v1/devices/${deviceUuid}`);
}