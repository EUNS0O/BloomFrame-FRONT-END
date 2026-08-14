import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import blackCloverSmall from "../assets/black_clover_small.png";

export default function IotDeviceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, setData } = useApp();
  const device = data.devices.find((d) => String(d.id) === id);

  const [name, setName] = useState(device?.name || "");
  const [desc, setDesc] = useState(device?.desc || "");

  if (!device) return null;

  const handleConfirm = () => {
    if (!name.trim()) return;
    setData((d) => ({
      ...d,
      devices: d.devices.map((x) => (String(x.id) === id ? { ...x, name, desc } : x)),
    }));
    navigate("/iot/manage");
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto" }}>
        <BackHeader hideBack />
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 20, marginBottom: 10, paddingLeft: 12 }}>IoT 기기 수정</div>
        <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, paddingLeft: 12, fontWeight: 500, marginBottom: 28 }}>
          기기 이름과 설명을 수정해 주세요
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E8E8E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={blackCloverSmall} alt="" style={{ width: 30, height: 30 }} />
          </div>
        </div>

        <Field
          label="기기 이름" placeholder="IoT_1"
          value={name} onChange={(e) => setName(e.target.value)}
          bg={C.bg} marginBottom={22}
        />
        <Field
          label="설명" placeholder="인천에 있는 김인하의 IoT에 연결되어 있습니다"
          value={desc} onChange={(e) => setDesc(e.target.value)}
          bg={C.bg} marginBottom={22}
        />

        <BottomButton>
          <Btn onClick={handleConfirm} disabled={!name.trim()} padding="10px 14px">확인</Btn>
        </BottomButton>
      </div>
    </>
  );
}