import { api } from "./client";

export async function getHealthConditions() {
  return api.get("/api/v1/health-conditions");
}
export async function createHealthCondition(conditionName) {
  return api.post("/api/v1/health-conditions", { conditionName });
}
export async function updateHealthCondition(conditionId, conditionName) {
  return api.patch(`/api/v1/health-conditions/${conditionId}`, { conditionName });
}
export async function deleteHealthCondition(conditionId) {
  return api.delete(`/api/v1/health-conditions/${conditionId}`);
}