import { api } from "./client";

// 목록 조회 — 최신순이라고 가정하면 [0]이 최신
export async function getNewsletters(uid) {
  return api.get(`/api/v1/users/${uid}/newsletters`);
}

export async function createNewsletter(uid, body) {
  return api.post(`/api/v1/users/${uid}/newsletters`, body);
}

export async function sendNewsletter(uid, issueId) {
  return api.post(`/api/v1/users/${uid}/newsletters/${issueId}/send`);
}

// 가장 최근 뉴스레터 하나만 편하게 가져오는 헬퍼
export async function getLatestNewsletter(uid) {
  const list = await getNewsletters(uid);
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}