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

async function request(path, { method = "GET", body, auth = true, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
      cache: "no-store", // 브라우저 캐시를 아예 안 씀 — 이 앱은 계속 최신 데이터가 필요한 실시간 폴링 구조라, 304(캐시 응답)가 뜨면 오히려 문제가 됨(res.ok가 false라 에러로 잘못 처리됨)
    });
  } catch (err) {
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
      data = text; 
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

function extractErrorMessage(data) {
  if (!data || typeof data !== "object") return null;
  if (data.message) return data.message;
  if (data.error && typeof data.error === "string") return data.error;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    return typeof first === "string" ? first : first.defaultMessage || first.message || JSON.stringify(first);
  }
  const values = Object.values(data);
  if (values.length > 0 && values.every((v) => typeof v === "string")) {
    return values.join(" / ");
  }
  return null;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  postForm: (path, formData, opts) => request(path, { ...opts, method: "POST", body: formData, isFormData: true }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};