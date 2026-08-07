import React from "react";
import { C } from "../../styles/tokens";
import logoBlack from "../../assets/logo_black.png";

export function Frame({ children }) {
  return (
    <div style={{ background: "#DCDAD5", minHeight: 760, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 24, fontFamily: "'Pretendard Variable','Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <div style={{ width: 412, minHeight: 890, background: C.bg, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.18)", position: "relative", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

// logo_black.png(232x232) 안에서 실제 워드마크 잉크 영역(18,99)~(215,124)만 실측하여 크롭합니다.
const LOGO_BBOX = { left: 18, top: 99, right: 215, bottom: 124 };
const LOGO_DISPLAY_WIDTH = 180;
const LOGO_SCALE = LOGO_DISPLAY_WIDTH / (LOGO_BBOX.right - LOGO_BBOX.left);
const LOGO_DISPLAY_HEIGHT = (LOGO_BBOX.bottom - LOGO_BBOX.top) * LOGO_SCALE;
const LOGO_IMG_FULL = 232 * LOGO_SCALE;
const LOGO_SHIFT_LEFT = -LOGO_BBOX.left * LOGO_SCALE;
const LOGO_SHIFT_TOP = -LOGO_BBOX.top * LOGO_SCALE;

export function Logo() {
  return (
    <div style={{ position: "relative", width: LOGO_DISPLAY_WIDTH, height: LOGO_DISPLAY_HEIGHT, overflow: "hidden" }}>
      <img
        src={logoBlack}
        alt="BloomFrame+"
        style={{ position: "absolute", top: LOGO_SHIFT_TOP, left: LOGO_SHIFT_LEFT, width: LOGO_IMG_FULL, height: "auto" }}
      />
    </div>
  );
}

export function TopBar() {
  return (
    <div style={{ padding: "28px 28px 23px", borderBottom: `1px solid ${C.grayLine}`, background: C.bg }}>
      <Logo />
    </div>
  );
}