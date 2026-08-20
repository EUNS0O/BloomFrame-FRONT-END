import { api } from "./client";

const TYPE_MAP = { med: "MEDICATION", exercise: "EXERCISE", other: "CUSTOM" };

export async function getReminders() {
  return api.get("/api/v1/reminders");
}

// 서버 스케줄러가 자동으로 만들어둔 리마인더 중, 지금 인증하려는 그 알람(serverId)에 맞는 걸 찾음
// (알림 시간 도달하면 서버가 매 분 00초에 자동 생성하는 방식이라, 우리가 직접 등록하는 API는 없음)
export async function findReminderId(serverId, categoryType, scheduledAt) {
  if (!serverId) return null;
  const reminders = await getReminders();
  const backendType = TYPE_MAP[categoryType];
  const matches = (Array.isArray(reminders) ? reminders : []).filter(
    (r) =>
      r.status === "PENDING" &&
      String(r.targetId) === String(serverId) &&
      r.type === backendType
  );

  if (matches.length === 0) return null;

  // 같은 반복 알람의 오래된 PENDING 리마인더가 남아 있을 수 있으므로
  // 가능한 경우 현재 알람 시각과 가장 가까운 리마인더를 선택한다.
  const targetMs = scheduledAt instanceof Date ? scheduledAt.getTime() : new Date(scheduledAt).getTime();
  if (Number.isFinite(targetMs)) {
    matches.sort((a, b) => {
      const aMs = new Date(a.scheduledAt || a.createdAt || 0).getTime();
      const bMs = new Date(b.scheduledAt || b.createdAt || 0).getTime();
      const aDiff = Number.isFinite(aMs) ? Math.abs(aMs - targetMs) : Number.MAX_SAFE_INTEGER;
      const bDiff = Number.isFinite(bMs) ? Math.abs(bMs - targetMs) : Number.MAX_SAFE_INTEGER;
      return aDiff - bDiff;
    });
  }

  return matches[0]?.id || null;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 서버 스케줄러와 정각 터치가 겹치면 리마인더 생성보다 조회가 먼저 갈 수 있다.
export async function findReminderIdWithRetry(serverId, categoryType, scheduledAt, attempts = 6) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const reminderId = await findReminderId(serverId, categoryType, scheduledAt);
    if (reminderId) return reminderId;
    if (attempt < attempts - 1) await wait(1000);
  }
  return null;
}

// 터치 인증
export async function touchAuth(reminderId) {
  return api.post("/api/v1/auth-touch", { reminderId });
}
