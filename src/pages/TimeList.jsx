import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { fmtTime } from "../utils/format";
import { toTodayDate } from "../utils/alarmStatus";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
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
  const { data, onboarding, wip, setWip, commitCategory } = useApp();
  const scrollId = React.useId().replace(/:/g, "");

  if (!wip) return null;
  const icon = ICON_BLACK[wip.type];
  const times = wip.times || []; // 방어: times가 없는 상태로 들어와도 크래시 방지
  // 등록 순서가 아니라 실제 시간순으로 "1회차/2회차..."가 매겨지도록 표시용 정렬(원본 배열은 안 건드림)
  const sortedTimes = [...times].sort((a, b) => toTodayDate(a) - toTodayDate(b));
  // 온보딩 중이어도 "이미 하나 이상 등록한 뒤 또 추가"하는 경우엔 이미지 선택을 다시 안 거침 — 진짜 첫 항목일 때만 거침
  const isFirstCategory = data.categories.length === 0;

  const addTime = () => {
    setWip((w) => ({ ...w, draftTime: { hour: 1, minute: 0, ampm: "오전" }, editingTimeId: null }));
    navigate("/onboarding/time-single");
  };

  const editTime = (t) => {
    setWip((w) => ({ ...w, draftTime: { hour: t.hour, minute: t.minute, ampm: t.ampm }, editingTimeId: t.id }));
    navigate("/onboarding/time-single");
  };

  const handleConfirm = () => {
    // 온보딩 중 "진짜 첫 항목"일 때만 IoT 이미지 선택 화면으로 — 이후엔 마이페이지에서 따로 바꿀 수 있어서 안 거침
    if (onboarding && isFirstCategory) {
      navigate("/onboarding/image-select");
    } else {
      commitCategory(wip);
      navigate(onboarding ? "/onboarding/category/more" : "/home");
    }
  };

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      {/* 스크롤 영역: 헤더+리스트만. 확인 버튼 자리는 절대 침범 안 함 */}
      <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, padding: "0 30px", overflowY: "auto", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>
        <BackHeader progress={onboarding ? 82 : undefined} />
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>알림 · 복용 시간 설정</div>
        <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 28, paddingLeft: 12, fontWeight: 500, paddingBottom: 15, minHeight: 48 }}>
          알려드릴 시간을 확인해 주세요
        </div>

        {sortedTimes.map((t, i) => (
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
          style={{ width: "100%", padding: "14px", borderRadius: 22, border: `1.5px dashed ${C.black}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}
        >
          + 알람 추가하기
        </button>
      </div>

      {/* 확인 버튼 — 스크롤 영역 밖, 불투명한 고정 자리. 리스트가 여기 뒤로 절대 안 비침 */}
      <div style={{ padding: "14px 30px 40px", background: C.bg, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170 }}>
          <Btn disabled={!times.length} onClick={handleConfirm} padding="10px 14px">확인</Btn>
        </div>
      </div>
    </div>
  );
}