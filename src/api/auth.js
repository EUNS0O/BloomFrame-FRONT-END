import { api, setToken, clearToken } from "./client";
import { stripPhone } from "../utils/format";

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
 
export async function login({ email, password }) {
  const data = await api.post("/api/v1/auth/login", { email, password }, { auth: false });
  const token = data?.accessToken || data?.token || data?.access_token || data?.jwt;
  if (!token) {
    console.warn("[auth] 로그인 응답에서 토큰을 못 찾았어요. 실제 응답:", data);
  }
  setToken(token);
  return data;
}

export function logout() {
  clearToken();
}

export async function getMe() {
  const data = await api.get("/api/v1/users/me");
  return {
    name: data.name,
    guardianPhone: data.caregiverPhone,
    selfPhone: data.selfPhone,
    email: data.email,
  };
}

export async function updateMe(patch) {
  const body = {};
  if (patch.name !== undefined) body.name = patch.name;
  if (patch.guardianPhone !== undefined) body.caregiverPhone = stripPhone(patch.guardianPhone);
  if (patch.selfPhone !== undefined) body.selfPhone = stripPhone(patch.selfPhone);
  return api.patch("/api/v1/users/me", body);
}