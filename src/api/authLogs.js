import { api } from "./client";

// 인증 로그 조회 — from/to는 ISO-8601 형식 필수
export async function getAuthLogs(uid, from, to) {
  const params = new URLSearchParams({ from, to });
  return api.get(`/api/v1/users/${uid}/auth-logs?${params.toString()}`);
}

// 오늘 하루치 로그만 편하게 조회
export async function getTodayAuthLogs(uid) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return getAuthLogs(uid, start.toISOString(), end.toISOString());
}