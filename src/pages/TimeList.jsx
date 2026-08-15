import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { fmtTime } from "../utils/format";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import medicineIconBlack from "../assets/medicine_icon_black.png";
import gymIconBlack from "../assets/gym_icon_black.png";
import clockIconBlack from "../assets/clock_icon_black.png";

const ICON_BLACK = {
  med: medicineIconBlack,
  exercise: gymIconBlack,
  other: clockIconBlack,
};

export default function TimeList() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();

  if (!wip) return null;
  const icon = ICON_BLACK[wip.type];
  const times = wip.times || []; // 방어: times가 없는 상태로 들어와도 크래시 방지

  const addTime = () => {
    setWip((w) => ({ ...w, draftTime: { hour: 1, minute: 0, ampm: "오전" }, editingTimeId: null }));
    navigate("/onboarding/time-single");
  };

  const editTime = (t) => {
    setWip((w) => ({ ...w, draftTime: { hour: t.hour, minute: t.minute, ampm: t.ampm }, editingTimeId: t.id }));
    navigate("/onboarding/time-single");
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <BackHeader progress={onboarding ? 82 : undefined} />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>알림 · 복용 시간 설정</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 28, paddingLeft: 12, fontWeight: 500, paddingBottom: 15, minHeight: 48 }}>
        알려드릴 시간을 확인해 주세요
      </div>

      {times.map((t, i) => (
        <div
          key={t.id}
          style={{
            background: C.bg, border: "1px solid #000000", borderRadius: 10,
            height: 95, boxSizing: "border-box", padding: "25px 15px 25px 28px",
            marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={icon} alt="" style={{ width: 50, height: 50, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, color: C.black }}>{i + 1}회차</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: C.black }}>{fmtTime(t)}</div>
            </div>
          </div>
          <button onClick={() => editTime(t)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 11, fontWeight: 400, cursor: "pointer" }}>
            수정
          </button>
        </div>
      ))}

      <button
        onClick={addTime}
        style={{ width: "100%", padding: "14px", borderRadius: 22, border: `1.5px dashed ${C.black}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 40 }}
      >
        + 알람 추가하기
      </button>

      <BottomButton>
        <Btn disabled={!times.length} onClick={() => navigate("/onboarding/image-select")} padding="10px 14px">확인</Btn>
      </BottomButton>
    </div>
  );
}