import { api } from "./client";

// 복약 알림 — medicationId 연결은 오늘 마감 리스크 때문에 일단 보류, 시간만 등록
export async function getMedicationAlarms() {
  return api.get("/api/v1/medication-alarms");
}
export async function createMedicationAlarm({ alarmTime, startDate }) {
  return api.post("/api/v1/medication-alarms", { alarmTime, startDate });
}
export async function updateMedicationAlarm(alarmId, patch) {
  return api.patch(`/api/v1/medication-alarms/${alarmId}`, patch);
}
export async function deleteMedicationAlarm(alarmId) {
  return api.delete(`/api/v1/medication-alarms/${alarmId}`);
}

// 운동 알림 — exerciseName은 선택값
export async function getExerciseAlarms() {
  return api.get("/api/v1/exercise-alarms");
}
export async function createExerciseAlarm({ exerciseName, alarmTime, startDate }) {
  const body = { alarmTime, startDate };
  if (exerciseName) body.exerciseName = exerciseName;
  return api.post("/api/v1/exercise-alarms", body);
}
export async function updateExerciseAlarm(alarmId, patch) {
  return api.patch(`/api/v1/exercise-alarms/${alarmId}`, patch);
}
export async function deleteExerciseAlarm(alarmId) {
  return api.delete(`/api/v1/exercise-alarms/${alarmId}`);
}

// 기타 알림 — title은 선택값
export async function getCustomAlarms() {
  return api.get("/api/v1/custom-alarms");
}
export async function createCustomAlarm({ title, alarmTime, startDate }) {
  const body = { alarmTime, startDate };
  if (title) body.title = title;
  return api.post("/api/v1/custom-alarms", body);
}
export async function updateCustomAlarm(alarmId, patch) {
  return api.patch(`/api/v1/custom-alarms/${alarmId}`, patch);
}
export async function deleteCustomAlarm(alarmId) {
  return api.delete(`/api/v1/custom-alarms/${alarmId}`);
}
