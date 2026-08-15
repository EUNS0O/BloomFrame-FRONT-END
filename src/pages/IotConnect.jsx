import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";

export default function IotConnect() {
  const navigate = useNavigate();
  const { setData } = useApp();
  const [code, setCode] = useState("");

  const handleConfirm = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setData((d) => ({
      ...d,
      devices: [...d.devices, { id: nextId(), name: `IoT_${d.devices.length + 1}`, desc: `시리얼 코드 ${trimmed} 로 연결되었습니다` }],
    }));
    setCode("");
    navigate(-1);
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "40px 35px 100px", overflowY: "auto" }}>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>IoT 기기 연결</div>
        <div style={{ fontSize: 17, color: C.gray, lineHeight: 1.6, marginBottom: 40, fontWeight: 500 }}>
          IoT 기기에 연결하기 위해<br />고유 넘버를 입력해 주세요
        </div>
        <input
          autoFocus value={code} onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: 5, border: `1px solid ${C.grayLine}`, background: C.bg, fontSize: 15 }}
        />

        <BottomButton variant="high">
          <Btn disabled={!code.trim()} onClick={handleConfirm}>확인</Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}