import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";
import { renameDevice } from "../api/devices";

export default function IotDeviceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, setData } = useApp();
  const device = data.devices.find((d) => String(d.id) === id);

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!device) return null;

  const handleConfirm = async () => {
    if (submitting) return;
    const newName = name || device.name;
    setSubmitting(true);
    setError("");

    try {
      if (device.serverId) {
        await renameDevice(device.serverId, newName);
      }
      setData((d) => ({
        ...d,
        devices: d.devices.map((x) => (String(x.id) === id ? { ...x, name: newName } : x)),
      }));
      setName("");
      navigate(-1);
    } catch (e) {
      setError(e.message || "기기 이름 수정에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
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
        {error && (
          <div style={{ fontSize: 12.5, color: "#E5484D", marginTop: 12 }}>{error}</div>
        )}

        <BottomButton variant="high">
          <Btn disabled={submitting} onClick={handleConfirm}>
            {submitting ? "저장 중..." : "확인"}
          </Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}