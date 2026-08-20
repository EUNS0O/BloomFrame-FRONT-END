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

 
  // 일부 요청만 실패한 결과로 기존 전체 목록을 덮어쓰면, 실패한 종류의
  // 알람과 로컬 startDate가 사라진다. 모든 조회가 성공했을 때만 교체한다.
  if (failCount > 0) {
    throw new Error("서버에서 일부 알림 목록을 불러오지 못했어요. 기존 목록을 유지합니다.");
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
    // 서버 값을 기준으로 하고, 백엔드 배포 전 데이터에는 로컬 값을 임시 호환한다.
    ...(a.startDate || existingStartDate[a.id]
      ? { startDate: a.startDate || existingStartDate[a.id] }
      : {}),
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
