import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";

export default function IotDeviceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, setData } = useApp();
  const device = data.devices.find((d) => String(d.id) === id);

  const [name, setName] = useState("");

  if (!device) return null;

  const handleConfirm = () => {
    setData((d) => ({
      ...d,
      devices: d.devices.map((x) => (String(x.id) === id ? { ...x, name: name || device.name } : x)),
    }));
    setName("");
    navigate(-1);
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "40px 35px 100px", overflowY: "auto" }}>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>IoT 기기 수정</div>
        <div style={{ fontSize: 17, color: C.gray, lineHeight: 1.6, marginBottom: 40, fontWeight: 500 }}>
          IoT 기기의 수정할 이름을
          <br />
          써주세요
        </div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={device.name}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px",
            borderRadius: 5,
            border: `1px solid ${C.grayLine}`,
            background: C.bg,
            fontSize: 15,
          }}
        />

        <BottomButton variant="high">
          <Btn onClick={handleConfirm}>확인</Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}