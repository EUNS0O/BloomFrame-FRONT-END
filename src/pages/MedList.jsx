import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BottomNav } from "../components/common/BottomNav";
import { isMedicationPlaceholder } from "../api/medications";
import medicineIconBlack from "../assets/medicine_icon_black.png";

export default function MedList() {
  const navigate = useNavigate();
  const { data, setOnboarding, setWip } = useApp();
  const meds = data.categories
    .filter((c) => c.type === "med")
    .flatMap((c) => c.meds)
    .filter((medication) => !isMedicationPlaceholder(medication));
  const scrollId = React.useId().replace(/:/g, "");

  const addMed = () => {
    setOnboarding(false);
    setWip(null);
    navigate("/onboarding/category");
  };

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "40px 35px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>약 목록</div>
          <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
            등록된 약 정보를 확인하고 수정할 수 있어요
          </div>
        </div>

        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>

        <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 35px" }}>
          {meds.length === 0 && <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>등록된 약이 없어요.</div>}
          {meds.map((m) => (
            <div
              key={m.id}
              style={{
                background: C.bg, border: "1px solid #000000", borderRadius: 10,
                boxSizing: "border-box", padding: "20px 15px 20px 20px",
                marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={medicineIconBlack} alt="" style={{ width: 40, height: 40, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.black }}>{m.name}</div>
                  <div style={{ fontSize: 12.5, color: C.black, marginTop: 2 }}>1일 {m.freq}회 · {m.timing}</div>
                </div>
              </div>
              <button style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 11, fontWeight: 400, cursor: "pointer" }}>
                수정
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: "10px 35px 50px" }}>
          <button
            onClick={addMed}
            style={{ width: "100%", padding: "14px", borderRadius: 22, border: `1.5px dashed ${C.black}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
          >
            + 약 추가하기
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
