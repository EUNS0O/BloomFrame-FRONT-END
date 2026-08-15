import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { useApp } from "../context/AppContext";
import { BackHeader } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";
import agreeIcon from "../assets/agree.png";
import nonAgreeIcon from "../assets/non_agree.png";

const FIELD_MB = 20; // 필드 사이 간격 (조절용)

export default function SignupInfo() {
  const navigate = useNavigate();
  const { data, update, setOnboarding, setWip, accountEditMode, setAccountEditMode } = useApp();
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [permissionsAgreed, setPermissionsAgreed] = useState(false);
  const scrollId = React.useId().replace(/:/g, "");

  const handleConfirm = () => {
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

  const showPhoneVerifyButton = phoneFocused && !data.phoneVerifying;

  // 회원가입(수정 아님) 흐름에서만 권한 동의가 확인 버튼을 막음
  const confirmDisabled = !accountEditMode && !permissionsAgreed;

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
        <Field label="나이" placeholder="65 (만 나이로 적어주세요)" value={data.age} onChange={(e) => update({ age: e.target.value })} {...fieldProps} />
        <Field
          label="전화번호 (대리인)" placeholder="010-0000-0000"
          value={data.guardianPhone} onChange={(e) => update({ guardianPhone: e.target.value })}
          onFocus={() => setPhoneFocused(true)}
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

        <Field label="전화번호 (본인)" placeholder="010-0000-0000" value={data.selfPhone} onChange={(e) => update({ selfPhone: e.target.value })} {...fieldProps} />
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
      </div>

      {/* 확인 버튼 — 스크롤 영역 밖, 불투명한 고정 자리 */}
      <div style={{ padding: "14px 32px 55px", background: C.bg, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170 }}>
          <Btn disabled={confirmDisabled} onClick={handleConfirm} padding="10px 14px">확인</Btn>
        </div>
      </div>
    </div>
  );
}