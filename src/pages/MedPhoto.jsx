import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";

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
    <div style={{ flex: 1, padding: "0 24px 24px" }}>
      <BackHeader progress={onboarding ? 70 : undefined} />
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>약봉지 촬영</div>
      <div
        onClick={handleCapture}
        style={{
          width: "100%", aspectRatio: "1", background: C.black, borderRadius: 20, marginTop: 40,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#fff", position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 24, left: 24, width: 26, height: 26, borderTop: "3px solid #fff", borderLeft: "3px solid #fff" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 26, height: 26, borderTop: "3px solid #fff", borderRight: "3px solid #fff" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 26, height: 26, borderBottom: "3px solid #fff", borderLeft: "3px solid #fff" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 26, height: 26, borderBottom: "3px solid #fff", borderRight: "3px solid #fff" }} />
        {analyzing ? <div style={{ fontSize: 13 }}>AI가 분석하고 있어요...</div> : <Camera size={40} />}
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: C.gray, margin: "14px 0 30px" }}>약국 봉지 뒷면이나 약을 찍어주세요</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleCapture}
          style={{ width: 64, height: 64, borderRadius: "50%", background: C.orange, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Camera size={26} color="#fff" />
        </button>
      </div>
    </div>
  );
}
