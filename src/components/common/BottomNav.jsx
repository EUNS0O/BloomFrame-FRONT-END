import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C } from "../../styles/tokens";
import iotMark from "../../assets/IoT_mark.png";
import homeMark from "../../assets/home_mark.png";
import myPageMark from "../../assets/myPage_mark.png";

const TABS = [
  { key: "iot", label: "IoT", icon: iotMark, path: "/iot" },
  { key: "home", label: "홈", icon: homeMark, path: "/home" },
  { key: "mypage", label: "마이페이지", icon: myPageMark, path: "/mypage" },
];

export function BottomNav({ interactive = true }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ borderTop: `1px solid ${C.grayLine}`, background: C.bg, display: "flex", padding: "24px 0 16px" }}>
      {TABS.map((tab) => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.key}
            onClick={interactive ? () => navigate(tab.path) : undefined}
            style={{ flex: 1, background: "none", border: "none", cursor: interactive ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}
          >
            {active && (
              <span style={{ position: "absolute", top: -12, width: 5, height: 5, borderRadius: "50%", background: "#FE731C" }} />
            )}
            <img src={tab.icon} alt="" style={{ height: 20, width: "auto" }} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: C.black }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}