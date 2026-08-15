import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { BackHeader } from "../components/common/BackHeader";
import meIcon from "../assets/me_icon.png";
import parentsIcon from "../assets/parents_icon.png";
import parentsIconWhite from "../assets/parents_icon_white.png";
import rightIcon from "../assets/right_icon.png";
import rightIconWhite from "../assets/right_icon_white.png";

const CARD_BG = "#E8E8E8";
const CARD_BG_ACTIVE = "#FE731C";

export default function SignupType() {
  const navigate = useNavigate();
  const { update } = useApp();
  const [guardianSelected, setGuardianSelected] = useState(false);

  const chooseSelf = () => {
    update({ userType: "self" });
    navigate("/signup/info");
  };

  const chooseGuardian = () => {
    update({ userType: "guardian" });
    setGuardianSelected(true);
    setTimeout(() => navigate("/signup/info"), 180);
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 30px" }}>
      <BackHeader progress={20} />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>누가 사용하시나요?</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 100, paddingLeft: 12, fontWeight: 500 }}>
        이 앱을 대리인이 사용하는지,<br />시니어 본인이 사용하는지 선택해 주세요
      </div>

      {/* 본인 카드 (추후 개발 예정 — 항상 기본 스타일 유지) */}
      <div
        onClick={chooseSelf}
        style={{
          background: CARD_BG, borderRadius: 8, padding: "35px 18px", display: "flex", alignItems: "center",
          justifyContent: "space-between", cursor: "pointer", marginBottom: 28, width: "77%", margin: "0 auto 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={meIcon} alt="" style={{ width: 56, height: 56, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.black }}>본인</div>
            <div style={{ fontSize: 13, color: C.black, marginTop: 3 }}>시니어 본인이 직접 사용해요</div>
          </div>
        </div>
        <img src={rightIcon} alt="" style={{ width: 15, height: "auto" }} />
      </div>

      {/* 대리인 카드 (클릭 시 주황색 + 흰색으로 전환) */}
      <div
        onClick={chooseGuardian}
        style={{
          background: guardianSelected ? CARD_BG_ACTIVE : CARD_BG, borderRadius: 8, padding: "35px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: 28,
          transition: "background 0.15s",width: "77%", margin: "0 auto 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={guardianSelected ? parentsIconWhite : parentsIcon} alt="" style={{ width: 56, height: 56, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: guardianSelected ? "#fff" : C.black }}>대리인</div>
            <div style={{ fontSize: 13, color: guardianSelected ? "#fff" : C.black, marginTop: 3 }}>자녀 · 보호자가 사용해요</div>
          </div>
        </div>
        <img src={guardianSelected ? rightIconWhite : rightIcon} alt="" style={{ width: 15, height: "auto" }} />
      </div>
    </div>
  );
}