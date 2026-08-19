let counter = 100;
export const nextId = () => ++counter;

export function fmtTime(t) {
  const h = String(t.hour).padStart(2, "0");
  const m = String(t.minute).padStart(2, "0");
  return `${t.ampm} ${h}:${m}`;
}

// "010-1234-5678" -> "01012345678" — 백엔드로 전화번호를 넘길 때 하이픈 제거용
export function stripPhone(phone) {
  return (phone || "").replace(/\D/g, "");
}