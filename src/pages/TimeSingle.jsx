import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { nextId } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";
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
    <div style={{ flex: 1, padding: "0 24px 24px" }}>
      <BackHeader progress={onboarding ? 80 : undefined} />
      <TimePicker
        value={wip.draftTime || { hour: 1, minute: 0, ampm: "오전" }}
        onChange={(v) => setWip((w) => ({ ...w, draftTime: v }))}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
