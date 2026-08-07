import React from "react";
import { useNavigate } from "react-router-dom";
import { Pill } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { BottomNav } from "../components/common/BottomNav";

export default function MedList() {
  const navigate = useNavigate();
  const { data, setOnboarding, setWip } = useApp();
  const meds = data.categories.filter((c) => c.type === "med").flatMap((c) => c.meds);

  const addMed = () => {
    setOnboarding(false);
    setWip(null);
    navigate("/onboarding/category");
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>약 정보</div>
        <Sub>AI가 인식한 약 정보에요<br />확인 후 필요하면 수정해 주세요</Sub>
        {meds.length === 0 && <div style={{ fontSize: 13, color: C.gray }}>등록된 약이 없어요.</div>}
        {meds.map((m) => (
          <div key={m.id} style={{ background: C.field, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Pill size={16} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: C.gray }}>1일 {m.freq}회 · {m.timing}</div>
              </div>
            </div>
            <button style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
          </div>
        ))}
        <button onClick={addMed} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
          + 약 추가하기
        </button>
      </div>
      <BottomNav />
    </>
  );
}
