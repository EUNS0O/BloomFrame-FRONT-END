import { api, setToken, clearToken } from "./client";
import { stripPhone } from "../utils/format";

// 전화번호 인증번호 발송
// 개발/테스트 단계에서는 응답에 테스트용 인증번호가 같이 옴 (실제 SMS 연동 완료되면 이 필드는 응답에서 빠질 예정)
export async function sendCode(phone) {
  return api.post("/api/v1/auth/send-code", { phone: stripPhone(phone) }, { auth: false });
}

// 전화번호 인증번호 검증
export async function verifyCode(phone, code) {
  return api.post("/api/v1/auth/verify-code", { phone: stripPhone(phone), code }, { auth: false });
}

// 회원가입 — 나이 필드 백엔드 추가 완료(PR 머지됨), 이제 같이 보냄
export async function signup({ name, age, guardianPhone, selfPhone, email, password }) {
  return api.post(
    "/api/v1/auth/signup",
    {
      name,
      age: Number(age),
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
    uid: data.id, // 뉴스레터 등 {uid}가 경로에 들어가는 API에서 씀
    name: data.name,
    age: data.age !== undefined && data.age !== null ? String(data.age) : "",
    guardianPhone: data.caregiverPhone,
    selfPhone: data.selfPhone,
    email: data.email,
  };
}

// 내 정보 수정 — patch에 들어있는 필드만 보냄
export async function updateMe(patch) {
  const body = {};
  if (patch.name !== undefined) body.name = patch.name;
  if (patch.age !== undefined) body.age = Number(patch.age);
  if (patch.guardianPhone !== undefined) body.caregiverPhone = stripPhone(patch.guardianPhone);
  if (patch.selfPhone !== undefined) body.selfPhone = stripPhone(patch.selfPhone);
  return api.patch("/api/v1/users/me", body);
}