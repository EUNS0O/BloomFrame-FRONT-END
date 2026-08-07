// 서버 주소는 .env 파일의 VITE_API_URL로 관리합니다.
// 예: VITE_API_URL=https://api.bloomframe.example.com
const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  // 204 No Content 등 바디가 없는 응답 대비
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}
