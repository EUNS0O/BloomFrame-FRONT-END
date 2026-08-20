// 모든 백엔드 요청이 거치는 공통 지점.
// .env 파일의 VITE_API_BASE_URL로 관리 — 로컬은 .env.local, 배포는 Vercel 환경변수 설정에서 넣어줘야 함
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://1.201.116.60:8080").replace(/\/$/, ""); // 끝에 슬래시 있으면 제거 (경로 이어붙일 때 // 중복 방지)

const TOKEN_KEY = "bloomframe_jwt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // 네트워크 자체가 안 됐을 때(서버 다운, CORS 막힘 등) — 콘솔에 원인 힌트 남김
    console.error(`[API] ${method} ${path} 네트워크 오류:`, err);
    throw new Error("서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.");
  }

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // JSON이 아니면 텍스트 그대로
    }
  }

  if (!res.ok) {
    const message = extractErrorMessage(data) || `요청에 실패했어요 (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// 백엔드마다 에러 메시지를 담는 필드명이 달라서(message/error/errors/필드별 등), 흔한 형태들을 다 시도해봄
function extractErrorMessage(data) {
  if (!data || typeof data !== "object") return null;
  if (data.message) return data.message;
  if (data.error && typeof data.error === "string") return data.error;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    return typeof first === "string" ? first : first.defaultMessage || first.message || JSON.stringify(first);
  }
  // { password: "비밀번호는 8자 이상이어야 합니다." } 같은 "필드명: 메시지" 형태(Spring 검증 에러 흔한 형태)
  const values = Object.values(data);
  if (values.length > 0 && values.every((v) => typeof v === "string")) {
    return values.join(" / ");
  }
  return null;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};