import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { BottomNav } from "../components/common/BottomNav";
import { getDevices, deleteDevice } from "../api/devices";
import blackCloverSmall from "../assets/black_clover_small.png";

export default function IotDevices() {
  const navigate = useNavigate();
  const location = useLocation();
  const editable = location.pathname.endsWith("/manage");
  const { data, setData } = useApp();
  const scrollId = React.useId().replace(/:/g, "");
  const [deletingId, setDeletingId] = useState(null);

  // 들어올 때마다 서버에 실제로 등록된 기기 목록을 다시 받아옴
  useEffect(() => {
    getDevices()
      .then((list) => {
        const devices = (Array.isArray(list) ? list : []).map((dev) => ({
          id: nextId(),
          serverId: dev.deviceUuid || dev.id,
          name: dev.deviceName || dev.deviceUuid || dev.id,
          desc: `인천에 있는 김인하의 IoT에 연결되어 있습니다`, // 명세에 별도 설명 필드가 없어서 기존 문구 유지
        }));
        setData((d) => ({ ...d, devices }));
      })
      .catch((e) => console.error("[IotDevices] 기기 목록 조회 실패:", e));
  }, []);

  const removeDevice = async (device) => {
    if (deletingId) return;
    if (!device.serverId) {
      setData((d) => ({ ...d, devices: d.devices.filter((x) => x.id !== device.id) }));
      return;
    }
    setDeletingId(device.id);
    try {
      await deleteDevice(device.serverId);
      setData((d) => ({ ...d, devices: d.devices.filter((x) => x.id !== device.id) }));
    } catch (e) {
      alert(e.message || "기기 삭제에 실패했어요.");
    } finally {
      setDeletingId(null);
    }
  };

  const btnStyle = { padding: "3px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 9, fontWeight: 400, cursor: "pointer" };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "40px 35px 0" }}>
          <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 40 }}>{editable ? "IoT 기기 관리" : "IoT 기기 목록"}</div>
        </div>

        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>

        <div className={`vscroll-${scrollId}`} style={{ flex: 1, overflowY: "auto", padding: "12px 25px" }}>
          {data.devices.map((dev) => (
            <div key={dev.id} style={{ background: "#E8E8E8", borderRadius: 10, padding: "30px 18px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={blackCloverSmall} alt="" style={{ width: 50, height: 50 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{dev.name}</div>
                  <div style={{ fontSize: 9, color: C.black, maxWidth: 200, marginTop: 4 }}>{dev.desc}</div>
                </div>
              </div>
              {editable && (
                <div style={{ display: "flex", gap:7 }}>
                  <button onClick={() => navigate(`/iot/manage/edit/${dev.id}`)} style={btnStyle}>수정</button>
                  <button onClick={() => removeDevice(dev)} disabled={deletingId === dev.id} style={{ ...btnStyle, opacity: deletingId === dev.id ? 0.5 : 1 }}>
                    {deletingId === dev.id ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* "+ IoT 추가하기" 버튼 — 항상 화면 하단(하단 탭 바로 위)에 고정 */}
        {editable && (
          <div style={{ padding: "10px 35px 50px" }}>
            <button onClick={() => navigate("/iot/connect")} style={{ width: "100%", padding: "14px", borderRadius: 22, border: `1.5px dashed ${C.black}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
              + IoT 추가하기
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}