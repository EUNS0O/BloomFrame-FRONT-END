import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { CATEGORY_META } from "../constants/categoryMeta";
import { fmtTime } from "../utils/format";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";

export default function TimeList() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();

  if (!wip) return null;
  const meta = CATEGORY_META[wip.type];

  const addTime = () => {
    setWip((w) => ({ ...w, draftTime: { hour: 1, minute: 0, ampm: "오전" }, editingTimeId: null }));
    navigate("/onboarding/time-single");
  };

  const editTime = (t) => {
    setWip((w) => ({ ...w, draftTime: { hour: t.hour, minute: t.minute, ampm: t.ampm }, editingTimeId: t.id }));
    navigate("/onboarding/time-single");
  };

  const removeTime = (id) => setWip((w) => ({ ...w, times: w.times.filter((x) => x.id !== id) }));

  return (
    <div style={{ flex: 1, padding: "0 24px 24px" }}>
      <BackHeader progress={onboarding ? 82 : undefined} />
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알림 · 복용 시간 설정</div>
      <Sub>알려드릴 시간을 확인해 주세요</Sub>
      {wip.times.map((t, i) => (
        <div key={t.id} style={{ border: `1px solid ${C.grayLine}`, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.field, display: "flex", alignItems: "center", justifyContent: "center" }}><meta.icon size={16} /></div>
            <div>
              <div style={{ fontSize: 12, color: C.gray }}>{i + 1}회차</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtTime(t)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => editTime(t)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
            <button onClick={() => removeTime(t.id)} aria-label="삭제" style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.field, color: C.black, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      <button onClick={addTime} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 30 }}>
        + 알람 추가하기
      </button>
      <Btn disabled={!wip.times.length} onClick={() => navigate("/onboarding/image-select")}>확인</Btn>
    </div>
  );
}
