import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";
import { createMedication, analyzeMedicationPhoto } from "../api/medications";
import cameraIcon from "../assets/camera_icon.png";

// ── 조절용 상수 ──────────────────────────────
const VIEWFINDER_WIDTH = "80%"; // 검은 네모 크기 (줄이면 더 작아짐)
const VIEWFINDER_MARGIN_TOP = 70; // 제목-네모 사이 여백 (키우면 더 아래로)
// ─────────────────────────────────────────────

const MAX_FILE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function MedPhoto() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const openCamera = () => {
    if (analyzing) return;
    setError("");
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일 다시 선택해도 onChange가 또 뜨도록 초기화
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("jpg, png, webp, gif 파일만 가능해요.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`파일 용량이 너무 커요 (최대 ${MAX_FILE_MB}MB).`);
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      // 1) AI 분석 API가 "이미 존재하는 medicationId"를 경로에 요구해서, 빈 약 하나를 먼저 만들어 id를 받음
      const placeholder = await createMedication({ name: "분석 중...", dosePerDay: 1, timing: "확인 중" });
      // 2) 그 id 위에 사진을 올려서 실제 AI 분석 실행 (한 장에 여러 약이 있으면 여러 개로 돌아옴)
      const result = await analyzeMedicationPhoto(placeholder.id, file);
      const rawAnalyzed = Array.isArray(result?.medications) ? result.medications : [];
      // 서버가 placeholder 자체는 그대로 두고, 새로 인식된 약들을 별도로 만들어서 돌려주는 방식이라
      // 응답에 placeholder(더미 "분석 중..." 항목)가 그대로 섞여 나옴 — 걸러내고 진짜 분석 결과만 씀
      const analyzed = rawAnalyzed.filter((m) => m.id !== placeholder.id);

      if (analyzed.length === 0) {
        setError("사진에서 약을 인식하지 못했어요. 다시 찍어주시거나 직접 입력해 주세요.");
        setAnalyzing(false);
        return;
      }

      const newMeds = analyzed.map((m) => ({
        id: nextId(),
        serverId: m.id,
        name: m.name,
        freq: String(m.dosePerDay ?? "1"),
        timing: m.timing || "",
        times: [],
      }));

      setWip((w) => ({ ...w, meds: [...(w.meds || []), ...newMeds] }));
      setAnalyzing(false);
      navigate("/onboarding/med-info");
    } catch (err) {
      setError(err.message || "사진 분석에 실패했어요. 다시 시도해 주세요.");
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 30px" }}>
      <BackHeader progress={onboarding ? 70 : undefined} />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>약봉지 촬영</div>

      {/* 화면엔 안 보이지만, 실제 카메라(모바일) 또는 파일 선택(데스크톱)을 여는 진짜 입력창 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      <div
        onClick={openCamera}
        style={{
          width: VIEWFINDER_WIDTH, aspectRatio: "1", background: C.black, borderRadius: 10, margin: `${VIEWFINDER_MARGIN_TOP}px auto 0`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: analyzing ? "default" : "pointer", color: "#fff", position: "relative", opacity: analyzing ? 0.6 : 1,
        }}
      >
        <div style={{ position: "absolute", top: 24, left: 24, width: 26, height: 26, borderTop: "5px solid #fff", borderLeft: "5px solid #fff" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 26, height: 26, borderTop: "5px solid #fff", borderRight: "5px solid #fff" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 26, height: 26, borderBottom: "5px solid #fff", borderLeft: "5px solid #fff" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 26, height: 26, borderBottom: "5px solid #fff", borderRight: "5px solid #fff" }} />
        {analyzing && <div style={{ fontSize: 13 }}>AI가 분석하고 있어요...</div>}
      </div>
      <div style={{ textAlign: "center", fontSize: 15, color: C.gray, margin: "18px 0 20px" }}>약국 봉지 뒷면이나 약을 찍어주세요</div>

      {error && (
        <div style={{ textAlign: "center", fontSize: 13, color: "#E5484D", marginBottom: 20 }}>{error}</div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={cameraIcon}
          alt="촬영"
          onClick={openCamera}
          style={{ width: 90, height: 90, cursor: analyzing ? "default" : "pointer", opacity: analyzing ? 0.6 : 1 }}
        />
      </div>
    </div>
  );
}