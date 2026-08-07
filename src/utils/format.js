let counter = 100;
export const nextId = () => ++counter;

export function fmtTime(t) {
  const h = String(t.hour).padStart(2, "0");
  const m = String(t.minute).padStart(2, "0");
  return `${t.ampm} ${h}:${m}`;
}
