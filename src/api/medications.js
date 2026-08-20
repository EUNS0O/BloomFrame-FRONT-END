import { api } from "./client";

export function isMedicationPlaceholder(medication) {
  return typeof medication?.name === "string" && medication.name.trim().startsWith("분석 중");
}

export async function getMedications() {
  const medications = await api.get("/api/v1/medications");
  return (Array.isArray(medications) ? medications : []).filter(
    (medication) => !isMedicationPlaceholder(medication)
  );
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

export async function analyzeMedicationPhoto(medicationId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.postForm(`/api/v1/medications/${medicationId}/analyze`, formData);
}
