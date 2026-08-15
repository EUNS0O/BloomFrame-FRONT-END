import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { nextId } from "../utils/format";
import { C } from "../styles/tokens";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { TimePicker } from "../components/widgets/TimePicker";

export default function TimeSingle() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();
  const [error, setError] = useState("");

  if (!wip) return null;

  const isDuplicate = (draft, times, excludeId) =>
    times.some((t) => t.id !== excludeId && t.hour === draft.hour && t.minute === draft.minute && t.ampm === draft.ampm);

  const handleConfirm = () => {
    const draft = wip.draftTime || { hour: 1, minute: 0, ampm: "오전" };
    if (isDuplicate(draft, wip.times || [], wip.editingTimeId)) {
      setError("이미 등록된 시간이에요. 다른 시간을 선택해 주세요.");
      return;
    }
    setError("");
    setWip((w) => {
      if (w.editingTimeId) {
        return {
          ...w,
          times: w.times.map((t) => (t.id === w.editingTimeId ? { ...t, ...w.draftTime } : t)),
          editingTimeId: null,
        };
      }
      return { ...w, times: [...w.times, { id: nextId(), ...w.draftTime }] };
    });
    if (wip.type === "med") navigate("/onboarding/time-list");
    else navigate("/onboarding/image-select");
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto" }}>
      <BackHeader progress={onboarding ? 80 : undefined} />
      <TimePicker
        value={wip.draftTime || { hour: 1, minute: 0, ampm: "오전" }}
        onChange={(v) => setWip((w) => ({ ...w, draftTime: v }))}
      />
      {error && <div style={{ fontSize: 12.5, color: "#E5484D", textAlign: "center", marginTop: -70, marginBottom: 40, paddingLeft: 12 }}>{error}</div>}
      <BottomButton variant="high">
        <Btn onClick={handleConfirm} padding="10px 14px">확인</Btn>
      </BottomButton>
    </div>
  );
}