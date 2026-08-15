import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";
import cameraIcon from "../assets/camera_icon.png";

// ── 조절용 상수 ──────────────────────────────
const VIEWFINDER_WIDTH = "80%"; // 검은 네모 크기 (줄이면 더 작아짐)
const VIEWFINDER_MARGIN_TOP = 70; // 제목-네모 사이 여백 (키우면 더 아래로)
// ─────────────────────────────────────────────

export default function MedPhoto() {
  const navigate = useNavigate();
  const { onboarding, setWip } = useApp();
  const [analyzing, setAnalyzing] = useState(false);

  // 실제 연동 시: 촬영 이미지를 사진 분석 API로 전송하고 결과를 받아 채워 넣습니다.
  const handleCapture = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setWip((w) => ({
        ...w,
        meds: [{ id: nextId(), name: "타이레놀정 500mg", freq: "3", timing: "식후 30분" }],
      }));
      navigate("/onboarding/med-info");
    }, 900);
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 30px" }}>
      <BackHeader progress={onboarding ? 70 : undefined} />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>약봉지 촬영</div>
      <div
        onClick={handleCapture}
        style={{
          width: VIEWFINDER_WIDTH, aspectRatio: "1", background: C.black, borderRadius: 10, margin: `${VIEWFINDER_MARGIN_TOP}px auto 0`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#fff", position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 24, left: 24, width: 26, height: 26, borderTop: "5px solid #fff", borderLeft: "5px solid #fff" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 26, height: 26, borderTop: "5px solid #fff", borderRight: "5px solid #fff" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 26, height: 26, borderBottom: "5px solid #fff", borderLeft: "5px solid #fff" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 26, height: 26, borderBottom: "5px solid #fff", borderRight: "5px solid #fff" }} />
        {analyzing && <div style={{ fontSize: 13 }}>AI가 분석하고 있어요...</div>}
      </div>
      <div style={{ textAlign: "center", fontSize: 15, color: C.gray, margin: "18px 0 65px" }}>약국 봉지 뒷면이나 약을 찍어주세요</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={cameraIcon}
          alt="촬영"
          onClick={handleCapture}
          style={{ width: 90, height: 90, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}