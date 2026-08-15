// 오늘자 알람 스케줄 계산 + 상태(대기/성공/실패) 판정 — Home.jsx, IotDisplay.jsx가 공용으로 씀
// Java #2 API 명세 기준: 알림 정각부터 10분(STAGE2_MS) 안에 인증 안 하면 실패(MISSED) 확정

export const STAGE2_MS = 10 * 60 * 1000;

export function toTodayDate(t) {
  const now = new Date();
  let h = Number(t.hour) % 12;
  if (t.ampm === "오후") h += 12;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, Number(t.minute), 0, 0);
}

// categories → 오늘자 알람 전부를 시간순으로 펼친 배열 [{ key, at, label }]
export function getTodaySchedule(categories) {
  return categories
    .flatMap((c) => c.times.map((t) => ({ key: `${c.id}-${t.id}`, at: toTodayDate(t), label: c.type })))
    .sort((a, b) => a.at - b.at);
}

// 알람 1건의 상태를 "지금 시각" 기준으로 계산
// verifications: { [key]: "success" } — 실제 인증 성공 기록 (AppContext에 저장, IotDisplay에서 기록)
// 반환값: "pending"(아직 판가름 안 남) | "success"(인증함) | "missed"(10분 지나도록 인증 안 함)
export function getAlarmStatus(entry, verifications, now = new Date()) {
  if (verifications?.[entry.key] === "success") return "success";
  if (now.getTime() < entry.at.getTime() + STAGE2_MS) return "pending";
  return "missed";
}