import { getMedications } from "./medications";
import { getMedicationAlarms, getExerciseAlarms, getCustomAlarms } from "./alarms";
import { getTodayAuthLogs } from "./authLogs";
import { fromBackendTime } from "../utils/format";

const CATEGORY_ID_BY_BACKEND_TYPE = {
  MEDICATION: "cat-med",
  EXERCISE: "cat-exercise",
  CUSTOM: "cat-other",
};


export async function loadCategoriesFromServer(existingCategories = []) {
  let failCount = 0;
  const safe = (promise) => promise.catch(() => { failCount += 1; return []; });

  const [medications, medAlarms, exerciseAlarms, customAlarms] = await Promise.all([
    safe(getMedications()),
    safe(getMedicationAlarms()),
    safe(getExerciseAlarms()),
    safe(getCustomAlarms()),
  ]);

 
  if (failCount === 4) {
    throw new Error("서버에서 알림 목록을 하나도 못 받아왔어요 (서버 다운 추정)");
  }

  const existingStartDate = {};
  existingCategories.forEach((c) => {
    (c.times || []).forEach((t) => {
      if (t.serverId && t.startDate) existingStartDate[t.serverId] = t.startDate;
    });
  });

  const toTime = (a) => ({
    id: a.id,
    serverId: a.id,
    ...fromBackendTime(a.alarmTime),
    ...(existingStartDate[a.id] ? { startDate: existingStartDate[a.id] } : {}),
  });

  const categories = [];

  if (medications.length > 0 || medAlarms.length > 0) {
    categories.push({
      id: "cat-med",
      type: "med",
      meds: medications.map((m) => ({
        id: m.id,
        serverId: m.id,
        name: m.name,
        freq: String(m.dosePerDay ?? "1"),
        timing: m.timing || "",
      })),
      times: medAlarms.map(toTime),
    });
  }

  if (exerciseAlarms.length > 0) {
    categories.push({
      id: "cat-exercise",
      type: "exercise",
      name: "운동",
      times: exerciseAlarms.map((a) => ({ ...toTime(a), exerciseName: a.exerciseName })),
    });
  }

  if (customAlarms.length > 0) {
    categories.push({
      id: "cat-other",
      type: "other",
      name: "기타",
      times: customAlarms.map((a) => ({ ...toTime(a), title: a.title })),
    });
  }

  return categories;
}


export async function loadVerificationsFromServer(uid) {
  if (!uid) return {};
  const logs = await getTodayAuthLogs(uid).catch(() => []);
  const verifications = {};
  (Array.isArray(logs) ? logs : []).forEach((log) => {
    if (log.status !== "SUCCESS") return;
    const categoryId = CATEGORY_ID_BY_BACKEND_TYPE[log.type];
    if (!categoryId) return;
    verifications[`${categoryId}-${log.targetId}`] = "success";
  });
  return verifications;
}