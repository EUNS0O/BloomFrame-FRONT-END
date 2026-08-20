import { api } from "./client";

const TYPE_MAP = { med: "MEDICATION", exercise: "EXERCISE", other: "CUSTOM" };

export async function getReminders() {
  return api.get("/api/v1/reminders");
}

// 서버 스케줄러가 자동으로 만들어둔 리마인더 중, 지금 인증하려는 그 알람(serverId)에 맞는 걸 찾음
// (알림 시간 도달하면 서버가 매 분 00초에 자동 생성하는 방식이라, 우리가 직접 등록하는 API는 없음)
export async function findReminderId(serverId, categoryType) {
  if (!serverId) return null;
  const reminders = await getReminders();
  const backendType = TYPE_MAP[categoryType];
  const match = reminders.find(
    (r) => r.status === "PENDING" && r.targetId === serverId && r.type === backendType
  );
  return match?.id || null;
}

// 터치 인증
export async function touchAuth(reminderId) {
  return api.post("/api/v1/auth-touch", { reminderId });
}