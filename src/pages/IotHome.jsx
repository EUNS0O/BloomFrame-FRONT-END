import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import rightSmall from "../assets/right_2.png";
import iotMark from "../assets/IoT_mark_small.png";
import cloverOrange from "../assets/clover_orange.png";

export default function IotHome() {
  const navigate = useNavigate();
  const { data } = useApp();

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "40px 35px 100px", overflowY: "auto" }}>
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 50 }}>IoT 기기 관리</div>

        <div onClick={() => navigate("/iot/connect")} style={{ background: C.black, color: "#fff", borderRadius: 8, padding: "40px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 50 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={cloverOrange} alt="" style={{ width: 50, height: 50 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>기기 연결</div>
            <div style={{ fontSize: 12, color: "#C9C7C2" }}>알림 받을 AAC 액자를 찾아 연결하세요</div>
          </div>
        </div>

        <Card onClick={() => navigate("/iot/manage")} bg="#E8E8E8" borderRadius={8} padding="25px 18px" marginBottom={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={iotMark} alt="" style={{ width: 40, height: "auto" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>기기 관리</div>
              <div style={{ fontSize: 12, color: C.black }}>연결 설정 · 이름 변경</div>
            </div>
          </div>
          <img src={rightSmall} alt="" style={{ width: 10, height: "auto" }} />
        </Card>
        <Card onClick={() => navigate("/iot/list")} bg="#E8E8E8" borderRadius={8} padding="25px 18px" marginBottom={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={iotMark} alt="" style={{ width: 40, height: "auto" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>연결된 기기 목록</div>
              <div style={{ fontSize: 12, color: C.black }}>{data.devices.length}개 기기 연결됨</div>
            </div>
          </div>
          <img src={rightSmall} alt="" style={{ width: 10, height: "auto" }} />
        </Card>
      </div>
      <BottomNav />
    </>
  );
}