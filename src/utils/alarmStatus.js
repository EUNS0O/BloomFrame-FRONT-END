// 오늘자 알람 스케줄 계산 + 상태(대기/성공/실패) 판정
// Home.jsx, IotDisplay.jsx가 공용으로 씀
//
// Java #2 API 명세 기준:
// 알림 정각부터 10분(STAGE2_MS) 안에 인증 안 하면 실패(MISSED) 확정

export const STAGE2_MS = 10 * 60 * 1000;

export function toTodayDate(t) {
  const now = new Date();

  let h = Number(t.hour) % 12;

  if (t.ampm === "오후") {
    h += 12;
  }

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    h,
    Number(t.minute),
    0,
    0
  );
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
export function getTodayDateString() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// categories → 오늘 실제로 적용되는 알람만 시간순으로 펼친 배열
// [{ key, at, label }]
export function getTodaySchedule(categories) {
  const today = getTodayDateString();

  return categories
    .flatMap((c) =>
      c.times
        .filter((t) => {
          // 기존에 등록된 알람처럼 startDate가 없는 경우
          // 기존 동작과 호환되도록 오늘부터 적용
          if (!t.startDate) {
            return true;
          }

          // startDate가 오늘보다 미래라면 아직 적용되지 않은 알람
          return t.startDate <= today;
        })
        .map((t) => ({
          key: `${c.id}-${t.id}`,
          at: toTodayDate(t),
          label: c.type,
        }))
    )
    .sort((a, b) => a.at - b.at);
}

// 알람 1건의 상태를 "지금 시각" 기준으로 계산
//
// verifications:
// { [key]: "success" }
//
// 실제 인증 성공 기록
// AppContext에 저장, IotDisplay에서 기록
//
// 반환값:
// "pending"  → 아직 판가름 안 남
// "success"  → 인증함
// "missed"   → 10분 지나도록 인증 안 함
export function getAlarmStatus(entry, verifications, now = new Date()) {
  if (verifications?.[entry.key] === "success") {
    return "success";
  }

  if (now.getTime() < entry.at.getTime() + STAGE2_MS) {
    return "pending";
  }

  return "missed";
}