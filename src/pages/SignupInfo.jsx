import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { useApp } from "../context/AppContext";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";

export default function SignupInfo() {
  const navigate = useNavigate();
  const { data, update, setOnboarding, setWip } = useApp();

  const startOnboardingCategoryFlow = () => {
    setOnboarding(true);
    setWip(null);
    navigate("/onboarding/category");
  };

  return (
    <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
      <BackHeader progress={40} />
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>회원 정보 입력</div>
      <Sub>시니어 · 본인 공통 정보를 입력해주세요</Sub>
      <Field label="이름" placeholder="홍길동" value={data.name} onChange={(e) => update({ name: e.target.value })} />
      <Field label="나이" placeholder="65 (만 나이로 적어주세요)" value={data.age} onChange={(e) => update({ age: e.target.value })} />
      <Field label="전화번호 (대리인)" placeholder="010-0000-0000" value={data.guardianPhone} onChange={(e) => update({ guardianPhone: e.target.value })} />
      {!data.phoneVerifying ? (
        <button onClick={() => update({ phoneVerifying: true })} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.black, color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 16, cursor: "pointer" }}>
          휴대폰 번호 인증하기
        </button>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <input placeholder="문자로 전송된 인증번호를 입력해 주세요" value={data.otp} onChange={(e) => update({ otp: e.target.value })}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 13 }} />
        </div>
      )}
      <Field label="전화번호 (본인)" placeholder="010-0000-0000" value={data.selfPhone} onChange={(e) => update({ selfPhone: e.target.value })} />
      <Field label="이메일" placeholder="BloomFrame@email.com" value={data.email} onChange={(e) => update({ email: e.target.value })} />
      <Field label="비밀번호" type="password" placeholder="••••••••" value={data.password} onChange={(e) => update({ password: e.target.value })} />
      <Field label="비밀번호 확인" type="password" placeholder="••••••••" value={data.passwordConfirm} onChange={(e) => update({ passwordConfirm: e.target.value })} />
      <Btn onClick={startOnboardingCategoryFlow}>확인</Btn>
    </div>
  );
}
