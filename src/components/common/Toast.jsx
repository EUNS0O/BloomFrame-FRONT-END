import React from "react";

// 화면 중앙 위쪽에 잠깐 떴다가 사라지는, 각진 흰색 알림 카드
// message: 문자열 하나 또는 여러 줄이면 배열(["첫째 줄", "둘째 줄"])로 전달
export function Toast({ message, visible }) {
  const lines = Array.isArray(message) ? message : [message];
  return (
    <div
      style={{
        position: "absolute", top: "43%", left: "50%", zIndex: 50,
        transform: `translateX(-50%) translateY(${visible ? "0" : "-12px"})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease, transform 0.25s ease",
        pointerEvents: "none",
        background: "#F3F3F3CC", borderRadius: 10, padding: "40px 62px", minWidth: 220,
        boxShadow: "0 2px 2px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap", textAlign: "center",
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: 20, fontWeight: 600, color: "#111" }}>{line}</div>
      ))}
    </div>
  );
}