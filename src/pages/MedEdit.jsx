import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";

export default function MedEdit() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();

  if (!wip) return null;

  const editingMed = wip.editingMedId ? wip.meds.find((m) => m.id === wip.editingMedId) : null;

  const [name, setName] = useState(editingMed?.name || "");
  const [freq, setFreq] = useState(editingMed?.freq || "");
  const [timing, setTiming] = useState(editingMed?.timing || "");

  const handleConfirm = () => {
    if (!name.trim()) return;
    setWip((w) => {
      if (w.editingMedId) {
        return {
          ...w,
          meds: w.meds.map((m) => (m.id === w.editingMedId ? { ...m, name, freq: freq || "1", timing } : m)),
          editingMedId: null,
        };
      }
      return { ...w, meds: [...w.meds, { id: nextId(), name, freq: freq || "1", timing }] };
    });
    navigate("/onboarding/med-info");
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <BackHeader progress={onboarding ? 75 : undefined} />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>약 정보</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 28, paddingLeft: 12, fontWeight: 500, paddingBottom: 15, minHeight: 48 }}>
        AI가 인식한 약 정보를<br />확인하고 수정해 주세요
      </div>

      <Field
        label="약 이름" placeholder="타이레놀정 500mg"
        value={name} onChange={(e) => setName(e.target.value)}
        bg={C.bg} marginBottom={30} placeholderColor={C.gray}
      />
      <Field
        label="1일 몇 회인지 작성해 주세요( 숫자만 적어주세요 )" placeholder="1"
        value={freq} onChange={(e) => setFreq(e.target.value.replace(/[^0-9]/g, ""))}
        bg={C.bg} marginBottom={30} placeholderColor={C.gray}
      />
      <Field
        label="언제 먹어야 하는지 작성해 주세요" placeholder="기상 직후 / 식후 30분 / 아침 식후 / 취침 전"
        value={timing} onChange={(e) => setTiming(e.target.value)}
        bg={C.bg} marginBottom={30} placeholderColor={C.gray}
      />

      <BottomButton>
        <Btn onClick={handleConfirm} disabled={!name.trim()} padding="10px 14px">확인</Btn>
      </BottomButton>
    </div>
  );
}