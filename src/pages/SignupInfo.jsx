import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { useApp } from "../context/AppContext";
import { BackHeader } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";
import { stripPhone } from "../utils/format";
import agreeIcon from "../assets/agree.png";
import nonAgreeIcon from "../assets/non_agree.png";

const FIELD_MB = 20; // 필드 사이 간격 (조절용)

export default function SignupInfo() {
  const navigate = useNavigate();
  const { data, update, setOnboarding, setWip, accountEditMode, setAccountEditMode } = useApp();
  const [permissionsAgreed, setPermissionsAgreed] = useState(false);
  const [originalGuardianPhone, setOriginalGuardianPhone] = useState("");
  const scrollId = React.useId().replace(/:/g, "");

  // 회원가입(수정 모드 아님)으로 들어온 거면, 예전 테스트/이전 세션에 남아있던 값 대신 항상 빈 칸으로 시작
  // 수정 모드로 들어온 거면, "원래 저장돼 있던 대리인 번호"를 기억해둠 — 이걸 실제로 바꿨을 때만 인증하기 버튼이 뜨게 하기 위함
  useEffect(() => {
    if (!accountEditMode) {
      update({ name: "", age: "", guardianPhone: "", selfPhone: "", email: "", password: "", passwordConfirm: "", phoneVerifying: false, otp: "" });
      setOriginalGuardianPhone("");
    } else {
      update({ phoneVerifying: false, otp: "" }); // 예전 세션에 인증 진행 중이던 상태가 남아있지 않게 항상 리셋
      setOriginalGuardianPhone(data.guardianPhone || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 매 렌더마다 다시 계산 — 값이 바뀌는 즉시 버튼 활성/비활성이 바로 반영됨
  const errors = [];
  if (!data.name?.trim()) errors.push("이름을 입력해 주세요.");
  if (!data.age?.trim() || !/^\d+$/.test(data.age.trim())) errors.push("나이는 숫자로 입력해 주세요.");
  if (!data.guardianPhone?.trim() || stripPhone(data.guardianPhone).length < 11) errors.push("대리인 전화번호를 정확히 입력해 주세요.");
  if (!data.selfPhone?.trim() || stripPhone(data.selfPhone).length < 11) errors.push("사용자 전화번호를 정확히 입력해 주세요.");
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.push("올바른 이메일 형식이 아니에요.");
  if (!data.password || data.password.length < 4) errors.push("비밀번호는 4자 이상 입력해 주세요.");
  if (data.password !== data.passwordConfirm) errors.push("비밀번호가 서로 일치하지 않아요.");
  if (!accountEditMode && !permissionsAgreed) errors.push("앱 접근 권한에 동의해 주세요."); // 수정 모드에선 재동의 요구 안 함

  const handleConfirm = () => {
    if (errors.length > 0) return; // 버튼이 disabled라 사실상 여기 안 오지만, 방어적으로 한 번 더 막음

    // 실제 백엔드 연동 시 이 payload를 그대로 API에 보내면 됨 (전화번호는 하이픈 뺀 숫자만)
    // 화면에 보여주는 data.guardianPhone/selfPhone 자체는 하이픈 포함된 채로 그대로 둠(입력 편의성 유지)
    const payload = {
      ...data,
      guardianPhone: stripPhone(data.guardianPhone),
      selfPhone: stripPhone(data.selfPhone),
    };
    // TODO: 백엔드 연동 시 여기서 payload로 회원가입/수정 API 호출
    console.log("[백엔드로 넘길 payload]", payload);

    if (accountEditMode) {
      setAccountEditMode(false);
      navigate("/mypage"); // 온보딩으로 새지 않고 마이페이지로 복귀
    } else {
      startOnboardingCategoryFlow();
    }
  };

  const startOnboardingCategoryFlow = () => {
    setOnboarding(true);
    setWip(null);
    navigate("/onboarding/category");
  };

  const fieldProps = {
    bg: C.bg,
    textColor: C.black,
    placeholderColor: C.linkGray,
    marginBottom: FIELD_MB,
    width: "95%",
    borderColor: C.black,
    borderRadius: 6,
    padding: "7px 14px",
    labelFontSize: 15,
  };

  // 클릭만 해도 뜨는 게 아니라, 전화번호를 "다 입력했을 때"(숫자 11자리) + "원래 값에서 실제로 바뀌었을 때"만 인증하기 버튼 노출
  const isPhoneComplete = stripPhone(data.guardianPhone).length >= 11;
  const phoneChanged = data.guardianPhone !== originalGuardianPhone;
  const showPhoneVerifyButton = isPhoneComplete && phoneChanged && !data.phoneVerifying;

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      {/* 스크롤 영역: 헤더+입력창들만. 확인 버튼 자리는 절대 침범 안 함 */}
      <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, padding: "0 32px", overflowY: "auto" }}>
        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>
        <BackHeader progress={accountEditMode ? undefined : 40} />
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 20, marginBottom: 8 }}>{accountEditMode ? "회원 정보 수정" : "회원 정보 입력"}</div>
        <div style={{ fontSize: 13.5, color: C.gray, lineHeight: 1.6, marginBottom: 28 }}>
          시니어 · 본인 공통 정보를 {accountEditMode ? "수정해" : "입력해"} 주세요
        </div>

        <Field label="이름" placeholder="홍길동" value={data.name} onChange={(e) => update({ name: e.target.value })} {...fieldProps} />
        <Field
          label="나이" placeholder="65 (만 나이로 적어주세요)"
          value={data.age} onChange={(e) => update({ age: e.target.value.replace(/[^0-9]/g, "") })}
          inputMode="numeric"
          {...fieldProps}
        />
        <Field
          label="전화번호 (대리인)" placeholder="010-0000-0000"
          value={data.guardianPhone} onChange={(e) => update({ guardianPhone: e.target.value.replace(/[^0-9-]/g, "") })}
          inputMode="numeric"
          {...fieldProps}
          marginBottom={showPhoneVerifyButton || data.phoneVerifying ? 12 : FIELD_MB}
        />

        {showPhoneVerifyButton && (
          <button
            onClick={() => update({ phoneVerifying: true })}
            style={{ display: "block", width: "95%", margin: "0 auto", padding: "6px 13px", borderRadius: 6, border: "none", background: C.black, color: "#fff", fontSize: 13.5, fontWeight: 700, marginBottom: FIELD_MB, cursor: "pointer" }}
          >
            휴대폰 번호 인증하기
          </button>
        )}
        {data.phoneVerifying && (
          <div style={{ width: "95%", margin: "0 auto", marginBottom: FIELD_MB }}>
            <input
              placeholder="문자로 전송된 인증번호를 입력해 주세요" value={data.otp} onChange={(e) => update({ otp: e.target.value })}
              style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "6px 13px", borderRadius: 6, border: `1px solid ${C.grayLine}`, background: C.bg, fontSize: 13, color: C.black, outline: "none" }}
            />
          </div>
        )}

        <Field
          label="전화번호 (사용자)" placeholder="010-0000-0000"
          value={data.selfPhone} onChange={(e) => update({ selfPhone: e.target.value.replace(/[^0-9-]/g, "") })}
          inputMode="numeric"
          {...fieldProps}
        />
        <Field label="이메일" placeholder="BloomFrame@email.com" value={data.email} onChange={(e) => update({ email: e.target.value })} {...fieldProps} />
        <Field label="비밀번호" type="password" placeholder="••••••••" value={data.password} onChange={(e) => update({ password: e.target.value })} {...fieldProps} />
        <Field label="비밀번호 확인" type="password" placeholder="••••••••" value={data.passwordConfirm} onChange={(e) => update({ passwordConfirm: e.target.value })} {...fieldProps} marginBottom={20} />

        {/* 앱 접근 권한 동의 — 수정 모드에선 안 보임(가입 때 이미 동의했으므로 재확인 불필요) */}
        {!accountEditMode && (
          <div
            onClick={() => setPermissionsAgreed((v) => !v)}
            style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "4px 2px 20px" }}
          >
            <img src={permissionsAgreed ? agreeIcon : nonAgreeIcon} alt="" style={{ width: 20, height: 20, flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.black }}>앱 접근 권한에 동의하십니까?</div>
              <div style={{ fontSize: 12.5, color: C.black, marginTop: 3 }}>알림&nbsp;&nbsp;&nbsp;사진/카메라&nbsp;&nbsp;&nbsp;연락처</div>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div style={{ border: "1px solid #E5484D", borderRadius: 6, padding: "12px 14px", marginBottom: 20 }}>
            {errors.map((e, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "#B92020", lineHeight: 1.6 }}>· {e}</div>
            ))}
          </div>
        )}
      </div>

      {/* 확인 버튼 — 스크롤 영역 밖, 불투명한 고정 자리 */}
      <div style={{ padding: "14px 32px 55px", background: C.bg, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170 }}>
          <Btn disabled={errors.length > 0} onClick={handleConfirm} padding="10px 14px">확인</Btn>
        </div>
      </div>
    </div>
  );
}