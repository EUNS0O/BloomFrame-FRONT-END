import { api, setToken, clearToken } from "./client";
import { stripPhone } from "../utils/format";

// 회원가입 — 명세엔 "나이" 필드가 없어서 안 보냄 (UI에만 남아있는 값)
export async function signup({ name, guardianPhone, selfPhone, email, password }) {
  return api.post(
    "/api/v1/auth/signup",
    {
      name,
      caregiverPhone: stripPhone(guardianPhone),
      selfPhone: stripPhone(selfPhone),
      email,
      password,
    },
    { auth: false }
  );
}

// 로그인 — 팀원 확인 완료: 토큰은 응답의 accessToken 필드, Authorization: Bearer <accessToken>으로 사용
export async function login({ email, password }) {
  const data = await api.post("/api/v1/auth/login", { email, password }, { auth: false });
  const token = data?.accessToken;
  if (!token) {
    console.warn("[auth] 로그인 응답에서 accessToken을 못 찾았어요. 실제 응답:", data);
  }
  setToken(token);
  return data;
}

export function logout() {
  clearToken();
}

// 내 정보 조회
export async function getMe() {
  const data = await api.get("/api/v1/users/me");
  // 백엔드 필드명(caregiverPhone) -> 프론트 필드명(guardianPhone)으로 변환
  return {
    name: data.name,
    guardianPhone: data.caregiverPhone,
    selfPhone: data.selfPhone,
    email: data.email,
  };
}

// 내 정보 수정 — patch에 들어있는 필드만 보냄
export async function updateMe(patch) {
  const body = {};
  if (patch.name !== undefined) body.name = patch.name;
  if (patch.guardianPhone !== undefined) body.caregiverPhone = stripPhone(patch.guardianPhone);
  if (patch.selfPhone !== undefined) body.selfPhone = stripPhone(patch.selfPhone);
  return api.patch("/api/v1/users/me", body);
}