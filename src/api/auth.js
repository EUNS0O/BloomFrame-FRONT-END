import { api, setToken, clearToken } from "./client";
import { stripPhone } from "../utils/format";

export async function sendCode(phone) {
  return api.post("/api/v1/auth/send-code", { phone: stripPhone(phone) }, { auth: false });
}

export async function verifyCode(phone, code) {
  return api.post(
    "/api/v1/auth/verify-code",
    { phone: stripPhone(phone), code },
    { auth: false }
  );
}

export async function signup({ name, age, guardianPhone, selfPhone, email, password }) {
  const caregiverPhone = stripPhone(guardianPhone);
  const sent = await sendCode(caregiverPhone);
  if (!sent?.verificationCode) {
    throw new Error("인증번호를 받아오지 못했어요.");
  }
  await verifyCode(caregiverPhone, sent.verificationCode);

  return api.post(
    "/api/v1/auth/signup",
    {
      name,
      age: Number(age),
      caregiverPhone,
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