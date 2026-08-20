import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { useApp } from "../context/AppContext";
import { BackHeader } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";
import { stripPhone } from "../utils/format";
import { signup, login, updateMe, sendCode, verifyCode } from "../api/auth";
import agreeIcon from "../assets/agree.png";
import nonAgreeIcon from "../assets/non_agree.png";

const FIELD_MB = 20; // 필드 사이 간격 (조절용)
const PHONE_PLACEHOLDER = "01000000000 ( -은 빼고 숫자만 적어주세요)";

export default function SignupInfo() {
  const navigate = useNavigate();
  const { data, update, setOnboarding, setWip, accountEditMode, setAccountEditMode } = useApp();
  const [permissionsAgreed, setPermissionsAgreed] = useState(false);
  const [originalGuardianPhone, setOriginalGuardianPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false); // 실제로 백엔드 인증까지 성공했는지
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const scrollId = React.useId().replace(/:/g, "");

  // 회원가입(수정 모드 아님)으로 들어온 거면, 예전 테스트/이전 세션에 남아있던 값 대신 항상 빈 칸으로 시작
  // 수정 모드로 들어온 거면, "원래 저장돼 있던 본인(등록자) 번호"를 기억해둠 — 이걸 실제로 바꿨을 때만 인증하기 버튼이 뜨게 하기 위함
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

  // 클릭만 해도 뜨는 게 아니라, 전화번호(본인)를 "다 입력했을 때"(숫자 11자리) + "원래 값에서 실제로 바뀌었을 때"만 인증하기 버튼 노출
  const isPhoneComplete = stripPhone(data.guardianPhone).length >= 11;
  const phoneChanged = data.guardianPhone !== originalGuardianPhone;
  const showPhoneVerifyButton = isPhoneComplete && phoneChanged && !data.phoneVerifying;

  // 번호가 바뀌면 이전 인증은 무효 — 다시 인증해야 함
  useEffect(() => {
    setPhoneVerified(false);
    setPhoneError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.guardianPhone]);

  const verificationRequired = isPhoneComplete && phoneChanged; // 번호를 새로 입력/변경했을 때만 인증이 필요
  const verified = !verificationRequired || phoneVerified;

  const [devCode, setDevCode] = useState(""); // 백엔드가 테스트용으로 같이 보내주는 인증번호 (실서비스 땐 자동으로 안 옴)

  const handleSendCode = async () => {
    setPhoneError("");
    setDevCode("");
    setSendingCode(true);
    try {
      const res = await sendCode(data.guardianPhone);
      // 백엔드가 테스트용 인증번호를 같이 보내주면(verificationCode 필드) 화면에 표시 — 실서비스 전환 후엔 이 필드가 안 와서 자동으로 안 뜸
      if (res?.verificationCode) setDevCode(String(res.verificationCode));
      update({ phoneVerifying: true, otp: "" });
    } catch (e) {
      setPhoneError(e.message || "인증번호 발송에 실패했어요.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (code) => {
    setPhoneError("");
    setVerifyingCode(true);
    try {
      await verifyCode(data.guardianPhone, code);
      setPhoneVerified(true);
    } catch (e) {
      setPhoneError(e.message || "인증번호가 올바르지 않아요.");
      setPhoneVerified(false);
    } finally {
      setVerifyingCode(false);
    }
  };

  // 인증번호 6자리를 다 입력하면 자동으로 서버에 검증 요청
  useEffect(() => {
    const code = (data.otp || "").trim();
    if (data.phoneVerifying && code.length === 6 && !phoneVerified && !verifyingCode) {
      handleVerifyCode(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.otp]);

  // 매 렌더마다 다시 계산 — 값이 바뀌는 즉시 버튼 활성/비활성이 바로 반영됨
  const errors = [];
  if (!data.name?.trim()) errors.push("이름을 입력해 주세요.");
  if (!data.age?.trim() || !/^\d+$/.test(data.age.trim())) errors.push("나이는 숫자로 입력해 주세요.");
  if (!data.selfPhone?.trim() || stripPhone(data.selfPhone).length < 11) errors.push("전화번호(시니어)를 정확히 입력해 주세요.");
  if (!data.guardianPhone?.trim() || stripPhone(data.guardianPhone).length < 11) errors.push("전화번호(본인)를 정확히 입력해 주세요.");
  if (!verified) errors.push("전화번호(본인) 인증을 완료해 주세요.");
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.push("올바른 이메일 형식이 아니에요.");
  if (!data.password || data.password.length < 8) errors.push("비밀번호는 8자 이상 입력해 주세요.");
  if (data.password !== data.passwordConfirm) errors.push("비밀번호가 서로 일치하지 않아요.");
  if (!accountEditMode && !permissionsAgreed) errors.push("앱 접근 권한에 동의해 주세요."); // 수정 모드에선 재동의 요구 안 함

  const handleConfirm = async () => {
    if (errors.length > 0) return; // 버튼이 disabled라 사실상 여기 안 오지만, 방어적으로 한 번 더 막음
    setApiError("");
    setLoading(true);
    try {
      if (accountEditMode) {
        await updateMe({ name: data.name, age: data.age, guardianPhone: data.guardianPhone, selfPhone: data.selfPhone });
        setAccountEditMode(false);
        navigate("/mypage"); // 온보딩으로 새지 않고 마이페이지로 복귀
      } else {
        await signup({
          name: data.name,
          age: data.age,
          guardianPhone: data.guardianPhone,
          selfPhone: data.selfPhone,
          email: data.email,
          password: data.password,
        });
        // 명세에 회원가입 응답에 토큰이 있는지 안 나와있어서, 안전하게 가입 직후 로그인을 한 번 더 호출함
        await login({ email: data.email, password: data.password });
        startOnboardingCategoryFlow();
      }
    } catch (e) {
      setApiError(e.message || "요청 처리 중 문제가 생겼어요.");
    } finally {
      setLoading(false);
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
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 20, marginBottom: 25, marginLeft: 12 }}>{accountEditMode ? "회원 정보 수정" : "회원 정보 입력"}</div>

        {/* 그룹 1: 시니어의 정보 */}
        <div style={{ fontSize: 16, color: C.gray, lineHeight: 1.6, marginBottom: 20 }}>
          시니어의 정보를 {accountEditMode ? "수정해" : "입력해"} 주세요
        </div>

        <Field label="이름" placeholder="홍길동" value={data.name} onChange={(e) => update({ name: e.target.value.replace(/[0-9]/g, "") })} {...fieldProps} />
        <Field
          label="나이" placeholder="65 (만 나이로 적어주세요)"
          value={data.age} onChange={(e) => update({ age: e.target.value.replace(/[^0-9]/g, "") })}
          inputMode="numeric"
          {...fieldProps}
        />
        <Field
          label="전화번호 (시니어)" placeholder={PHONE_PLACEHOLDER}
          value={data.selfPhone} onChange={(e) => update({ selfPhone: e.target.value.replace(/[^0-9]/g, "") })}
          inputMode="numeric"
          {...fieldProps}
          marginBottom={36}
        />

        <div style={{ height: 1, background: C.grayLine, margin: "0 0 28px" }} />

        {/* 그룹 2: 본인(등록자)의 정보 */}
        <div style={{ fontSize: 16, color: C.gray, lineHeight: 1.6, marginBottom: 20 }}>
          본인의 정보를 {accountEditMode ? "수정해" : "입력해"} 주세요
        </div>

        <Field
          label="전화번호 (본인)" placeholder={PHONE_PLACEHOLDER}
          value={data.guardianPhone} onChange={(e) => update({ guardianPhone: e.target.value.replace(/[^0-9]/g, "") })}
          inputMode="numeric"
          {...fieldProps}
          marginBottom={showPhoneVerifyButton || data.phoneVerifying ? 12 : FIELD_MB}
        />

        {showPhoneVerifyButton && (
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendingCode}
            style={{ display: "block", width: "95%", margin: "0 auto", padding: "6px 13px", borderRadius: 6, border: "none", background: C.black, color: "#fff", fontSize: 13.5, fontWeight: 700, marginBottom: FIELD_MB, cursor: sendingCode ? "default" : "pointer", opacity: sendingCode ? 0.6 : 1 }}
          >
            {sendingCode ? "발송 중..." : "휴대폰 번호 인증하기"}
          </button>
        )}
        {phoneError && !data.phoneVerifying && (
          <div style={{ width: "95%", margin: `-${FIELD_MB - 6}px auto ${FIELD_MB}px`, fontSize: 12, color: "#E5484D" }}>
            {phoneError}
          </div>
        )}
        {data.phoneVerifying && (
          <div style={{ width: "95%", margin: "0 auto", marginBottom: FIELD_MB }}>
            {devCode && (
              <div style={{ fontSize: 12, color: "#FE731C", fontWeight: 700, marginBottom: 6 }}>
                (테스트용) 인증번호: {devCode}
              </div>
            )}
            <input
              placeholder="문자로 전송된 인증번호를 입력해 주세요" value={data.otp} onChange={(e) => update({ otp: e.target.value.replace(/[^0-9]/g, "") })}
              style={{
                display: "block", width: "100%", boxSizing: "border-box", padding: "6px 13px", borderRadius: 6,
                border: `1px solid ${C.grayLine}`,
                background: phoneVerified ? C.grayLine : C.bg,
                fontSize: 13, color: C.black, outline: "none",
              }}
            />
            {verifyingCode && <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>확인 중...</div>}
            {phoneError && <div style={{ fontSize: 12, color: "#E5484D", marginTop: 6 }}>{phoneError}</div>}
            {phoneVerified && (
              <div style={{ fontSize: 12, color: "#FE731C", fontWeight: 700, marginTop: 6 }}>✓ 인증 완료</div>
            )}
          </div>
        )}

        <Field label="이메일" placeholder="BloomFrame@email.com" value={data.email} onChange={(e) => update({ email: e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "") })} {...fieldProps} />
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

        {(errors.length > 0 || apiError) && (
          <div style={{ border: "1px solid #E5484D", borderRadius: 6, padding: "12px 14px", marginBottom: 20 }}>
            {errors.map((e, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "#B92020", lineHeight: 1.6 }}>· {e}</div>
            ))}
            {apiError && <div style={{ fontSize: 12.5, color: "#B92020", lineHeight: 1.6 }}>· {apiError}</div>}
          </div>
        )}
      </div>

      {/* 확인 버튼 — 스크롤 영역 밖, 불투명한 고정 자리 */}
      <div style={{ padding: "14px 32px 55px", background: C.bg, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170 }}>
          <Btn disabled={errors.length > 0 || loading} onClick={handleConfirm} padding="10px 14px">{loading ? "처리 중..." : "확인"}</Btn>
        </div>
      </div>
    </div>
  );
}
