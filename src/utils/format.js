let counter = Date.now();

export const nextId = () => ++counter;

export function fmtTime(t) {
  const h = String(t.hour).padStart(2, "0");
  const m = String(t.minute).padStart(2, "0");
  return `${t.ampm} ${h}:${m}`;
}

// "backendTime" 형태의 시간 문자열을 프론트 형태로 변환
// { hour: 9, minute: 0, ampm: "오전" } <-> "09:00" (24시간제)
export function toBackendTime(t) {
  let h = Number(t.hour) % 12;
  if (t.ampm === "오후") h += 12;
  return `${String(h).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

export function fromBackendTime(hhmm) {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const ampm = h >= 12 ? "오후" : "오전";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour: hour12, minute: Number(mStr), ampm };
}

// "010-1234-5678" -> "01012345678" — 백엔드로 전화번호를 넘길 때 하이픈 제거용
export function stripPhone(phone) {
  return (phone || "").replace(/\D/g, "");
}