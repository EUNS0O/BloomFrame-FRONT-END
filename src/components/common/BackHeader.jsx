import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { C } from "../../styles/tokens";

// onBack이 없으면 브라우저 히스토리로 한 단계 뒤로갑니다.
// hideBack이 true면 뒤로가기 버튼 자체를 숨깁니다 (진행바만 표시).
export function BackHeader({ title, onBack, progress, hideBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  return (
    <div style={{ padding: "70px 12px 8px", background: C.bg }}>
      {!hideBack && (
        <button onClick={handleBack} style={{ background: "none", border: "none", padding: 0, marginBottom: 18, cursor: "pointer", color: C.black }}>
          <ChevronLeft size={24} />
        </button>
      )}
      {progress != null && (
        <div style={{ height: 8, background: C.grayLine, borderRadius: 4, marginBottom: 22, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: C.black, borderRadius: 4, transition: "width .25s" }} />
        </div>
      )}
      {title && <div style={{ fontSize: 22, fontWeight: 800, color: C.black, marginBottom: 4 }}>{title}</div>}
    </div>
  );
}

export function Sub({ children }) {
  return <div style={{ fontSize: 13.5, color: C.gray, lineHeight: 1.5, marginBottom: 20 }}>{children}</div>;
}