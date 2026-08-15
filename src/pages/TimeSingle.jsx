import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { nextId } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { TimePicker } from "../components/widgets/TimePicker";

export default function TimeSingle() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();

  if (!wip) return null;

  const handleConfirm = () => {
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
      <BottomButton variant="high">
        <Btn onClick={handleConfirm} padding="10px 14px">확인</Btn>
      </BottomButton>
    </div>
  );
}