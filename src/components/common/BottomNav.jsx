import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wifi, Home as HomeIcon, Image as ImageIcon } from "lucide-react";
import { C } from "../../styles/tokens";

const TABS = [
  { key: "iot", label: "IoT", icon: Wifi, path: "/iot" },
  { key: "home", label: "홈", icon: HomeIcon, path: "/home" },
  { key: "mypage", label: "마이페이지", icon: ImageIcon, path: "/mypage" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ borderTop: `1px solid ${C.grayLine}`, background: C.bg, display: "flex", padding: "10px 0 16px" }}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? C.black : C.gray }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
