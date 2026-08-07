import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { BottomNav } from "../components/common/BottomNav";

export default function IotDevices() {
  const navigate = useNavigate();
  const location = useLocation();
  const editable = location.pathname.endsWith("/manage");
  const { data, setData } = useApp();

  const removeDevice = (id) => setData((d) => ({ ...d, devices: d.devices.filter((x) => x.id !== id) }));

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{editable ? "IoT 기기 관리" : "IoT 기기 목록"}</div>
        {data.devices.map((dev) => (
          <div key={dev.id} style={{ background: C.field, borderRadius: 16, padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🍀</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{dev.name}</div>
                <div style={{ fontSize: 11.5, color: C.gray, maxWidth: 200 }}>{dev.desc}</div>
              </div>
            </div>
            {editable && (
              <button onClick={() => removeDevice(dev.id)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>삭제</button>
            )}
          </div>
        ))}
        {editable && (
          <button onClick={() => navigate("/iot/connect")} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
            + IoT 추가하기
          </button>
        )}
      </div>
      <BottomNav />
    </>
  );
}
