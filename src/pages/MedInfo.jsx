import React from "react";
import { useNavigate } from "react-router-dom";
import { Pill } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";

export default function MedInfo() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();

  if (!wip) return null;

  const editMed = (m) => {
    const name = prompt("약 이름", m.name) || m.name;
    const freq = prompt("1일 몇 회인지 (숫자만)", m.freq) || m.freq;
    const timing = prompt("언제 먹어야 하는지", m.timing) || m.timing;
    setWip((w) => ({ ...w, meds: w.meds.map((x) => (x.id === m.id ? { ...x, name, freq, timing } : x)) }));
  };

  return (
    <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
      <BackHeader progress={onboarding ? 75 : undefined} />
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>약 정보</div>
      <Sub>AI가 인식한 약 정보에요<br />확인 후 필요하면 수정해 주세요</Sub>
      {wip.meds.map((m) => (
        <div key={m.id} style={{ background: C.field, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Pill size={16} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: C.gray }}>1일 {m.freq}회 · {m.timing}</div>
            </div>
          </div>
          <button onClick={() => editMed(m)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            수정
          </button>
        </div>
      ))}
      <button
        onClick={() => setWip((w) => ({ ...w, meds: [...w.meds, { id: nextId(), name: "새 약 이름", freq: "1", timing: "식후" }] }))}
        style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 30 }}
      >
        + 약 추가하기
      </button>
      <Btn onClick={() => navigate("/onboarding/time-list")}>확인</Btn>
    </div>
  );
}
