import React from "react";
import { C } from "../../styles/tokens";

export function Frame({ children }) {
  return (
    <div style={{ background: "#DCDAD5", minHeight: 760, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 24, fontFamily: "'Pretendard Variable','Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <div style={{ width: 412, minHeight: 890, background: C.bg, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.18)", position: "relative", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: C.black }}>BloomFrame</span>
      <span style={{ color: C.orange, fontWeight: 800, fontSize: 22, lineHeight: 0 }}>+</span>
    </div>
  );
}

export function TopBar() {
  return (
    <div style={{ padding: "22px 24px 16px", borderBottom: `1px solid ${C.grayLine}`, background: C.bg }}>
      <Logo />
    </div>
  );
}
