import { api } from "./client";

export async function getMedications() {
  return api.get("/api/v1/medications");
}

export async function createMedication({ name, dosePerDay, timing, imageUrl = null }) {
  return api.post("/api/v1/medications", { name, dosePerDay, timing, imageUrl });
}

export async function updateMedication(medicationId, patch) {
  return api.patch(`/api/v1/medications/${medicationId}`, patch);
}

export async function deleteMedication(medicationId) {
  return api.delete(`/api/v1/medications/${medicationId}`);
}