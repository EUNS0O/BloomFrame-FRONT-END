import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

export default function IotConnect() {
  const navigate = useNavigate();
  const { setData } = useApp();
  const [code, setCode] = useState("");

  const handleConfirm = () => {
    setData((d) => ({
      ...d,
      devices: [...d.devices, { id: nextId(), name: `IoT_${d.devices.length + 1}`, desc: `시리얼 코드 ${code} 로 연결되었습니다` }],
    }));
    setCode("");
    navigate(-1);
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>IoT 기기 연결</div>
        <Sub>IoT 기기에 연결하기 위해<br />고유 넘버를 입력해 주세요</Sub>
        <input
          autoFocus value={code} onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: 12, border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 15, marginBottom: 320 }}
        />
        <Btn disabled={!code} onClick={handleConfirm}>확인</Btn>
      </div>
      <BottomNav />
    </>
  );
}
