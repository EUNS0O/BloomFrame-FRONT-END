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
  const { data, onboarding, wip, setWip, commitCategory } = useApp();
  const [error, setError] = useState("");

  if (!wip) return null;

  const isDuplicate = (draft, times, excludeId) =>
    times.some((t) => t.id !== excludeId && t.hour === draft.hour && t.minute === draft.minute && t.ampm === draft.ampm);

  // 온보딩 중이어도 "이미 하나 이상 등록한 뒤 또 추가"하는 경우엔 이미지 선택을 다시 안 거침 — 진짜 첫 항목일 때만 거침
  const isFirstCategory = data.categories.length === 0;

  const handleConfirm = () => {
    const draft = wip.draftTime || { hour: 1, minute: 0, ampm: "오전" };
    if (isDuplicate(draft, wip.times || [], wip.editingTimeId)) {
      setError("이미 등록된 시간이에요. 다른 시간을 선택해 주세요.");
      return;
    }
    setError("");

    const updatedWip = wip.editingTimeId
      ? { ...wip, times: wip.times.map((t) => (t.id === wip.editingTimeId ? { ...t, ...wip.draftTime } : t)), editingTimeId: null }
      : { ...wip, times: [...wip.times, { id: nextId(), ...wip.draftTime }] };

    if (wip.type === "med") {
      setWip(updatedWip);
      navigate("/onboarding/time-list");
    } else if (onboarding && isFirstCategory) {
      // 온보딩 중 "진짜 첫 항목"일 때만 IoT 이미지 선택 화면으로 — 이후엔 마이페이지에서 따로 바꿀 수 있어서 안 거침
      setWip(updatedWip);
      navigate("/onboarding/image-select");
    } else {
      commitCategory(updatedWip);
      navigate(onboarding ? "/onboarding/category/more" : "/home");
    }
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