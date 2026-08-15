import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../../styles/tokens";
import backIcon from "../../assets/back_icon.png";

export function BackHeader({ title, onBack, progress, hideBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  return (
    <div style={{ padding: "70px 12px 8px", background: C.bg }}>
      {progress != null && (
        <div style={{ height: 8, background: C.grayLine, borderRadius: 4, marginBottom: 22, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: C.black, borderRadius: 4, transition: "width .25s" }} />
        </div>
      )}
      {!hideBack && (
        <button
          onClick={handleBack}
          style={{
            width: 30, height: 20, border: "none", background: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0, marginTop: 25,marginLeft: 2, marginBottom: -10, cursor: "pointer",
          }}
        >
          <img src={backIcon} alt="뒤로가기" style={{ width: 33, height: 33 }} />
        </button>
      )}
      
      {title && <div style={{ fontSize: 22, fontWeight: 800, color: C.black, marginBottom: 4 }}>{title}</div>}
    </div>
  );
}

export function Sub({ children }) {
  return <div style={{ fontSize: 13.5, color: C.gray, lineHeight: 1.5, marginBottom: 20 }}>{children}</div>;
}