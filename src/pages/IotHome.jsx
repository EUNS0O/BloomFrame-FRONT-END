import React from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

export default function IotHome() {
  const navigate = useNavigate();
  const { data } = useApp();

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>IoT 기기 관리</div>
        <div onClick={() => navigate("/iot/connect")} style={{ background: C.black, color: "#fff", borderRadius: 18, padding: "20px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🍀</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>기기 연결</div>
            <div style={{ fontSize: 12, color: "#C9C7C2" }}>알림 받을 AAC 액자를 찾아 연결하세요</div>
          </div>
        </div>
        <Card onClick={() => navigate("/iot/manage")}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Wifi size={20} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>기기 관리</div>
              <div style={{ fontSize: 12, color: C.gray }}>연결 설정 · 이름 변경</div>
            </div>
          </div>
          <ChevronRight size={18} />
        </Card>
        <Card onClick={() => navigate("/iot/list")}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Wifi size={20} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>연결된 기기 목록</div>
              <div style={{ fontSize: 12, color: C.gray }}>{data.devices.length}개 기기 연결됨</div>
            </div>
          </div>
          <ChevronRight size={18} />
        </Card>
      </div>
      <BottomNav />
    </>
  );
}
