import { getMedications } from "./medications";
import { getMedicationAlarms, getExerciseAlarms, getCustomAlarms } from "./alarms";
import { getTodayAuthLogs } from "./authLogs";
import { getReminders } from "./reminders";
import { fromBackendTime } from "../utils/format";

const CATEGORY_ID_BY_BACKEND_TYPE = {
  MEDICATION: "cat-med",
  EXERCISE: "cat-exercise",
  CUSTOM: "cat-other",
};

const REMINDER_CACHE_TTL_MS = 30 * 1000;
let reminderTargetCache = new Map();
let reminderCacheLoadedAt = 0;

async function loadReminderTargetMap(force = false) {
  const cacheIsFresh =
    reminderTargetCache.size > 0 &&
    Date.now() - reminderCacheLoadedAt < REMINDER_CACHE_TTL_MS;

  if (!force && cacheIsFresh) return reminderTargetCache;

  const reminders = await getReminders();
  reminderTargetCache = new Map(
    (Array.isArray(reminders) ? reminders : [])
      .filter((reminder) => reminder?.id && reminder?.targetId)
      .map((reminder) => [String(reminder.id), String(reminder.targetId)])
  );
  reminderCacheLoadedAt = Date.now();
  return reminderTargetCache;
}


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
  const logs = await getTodayAuthLogs(uid);
  const relevantLogs = (Array.isArray(logs) ? logs : []).filter(
    (log) => log.status === "SUCCESS" || log.status === "MISSED"
  );

  let reminderTargets = await loadReminderTargetMap();

  // 인증 로그의 targetId는 알람 ID가 아니라 reminder 문서 ID다.
  // 막 생성된 reminder가 캐시에 없으면 목록을 한 번만 즉시 갱신한다.
  if (
    relevantLogs.some(
      (log) => log.targetId && !reminderTargets.has(String(log.targetId))
    )
  ) {
    reminderTargets = await loadReminderTargetMap(true);
  }

  const verifications = {};
  relevantLogs.forEach((log) => {
    const categoryId = CATEGORY_ID_BY_BACKEND_TYPE[log.type];
    if (!categoryId) return;

    const alarmId =
      log.alarmId ||
      log.originalTargetId ||
      reminderTargets.get(String(log.targetId));
    if (!alarmId) return;

    const key = `${categoryId}-${alarmId}`;
    const status = log.status === "SUCCESS" ? "success" : "missed";

    // 같은 알람에 복수 로그가 있더라도 성공 기록을 우선한다.
    if (verifications[key] !== "success") {
      verifications[key] = status;
    }
  });
  return verifications;
}
