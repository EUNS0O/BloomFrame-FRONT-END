import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { fmtTime } from "../utils/format";
import { getTodaySchedule } from "../utils/alarmStatus";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import medicineIconWhiteSmall from "../assets/medicine_icon_white_small.png";
import gymIconWhiteSmall from "../assets/gym_icon_white_small.png";
import clockIconWhiteSmall from "../assets/clock_icon_white_small.png";


const LIST_ICON = { med: medicineIconWhiteSmall, exercise: gymIconWhiteSmall, other: clockIconWhiteSmall };
const LABEL = { med: "약", exercise: "운동", other: "기타" };

export default function AlarmList() {
  const navigate = useNavigate();
  const { data, setData, setWip, setOnboarding } = useApp();
  const scrollId = React.useId().replace(/:/g, "");

  const removeTime = (categoryId, timeId) => {
    setData((d) => ({
      ...d,
      categories: d.categories.map((cc) => (cc.id === categoryId ? { ...cc, times: cc.times.filter((x) => x.id !== timeId) } : cc)),
    }));
  };

  // 수정: 해당 카테고리 전체(+ 어떤 시간을 고쳤는지)를 wip에 담아서
  // 약이면 "약 정보 수정 → 알람 설정(시간 목록) → 이미지 선택", 운동/기타면 "알람 설정 → 이미지 선택" 순으로 이어짐
  const editEntry = (category, time) => {
    setOnboarding(false); // 온보딩이 아니라 기존 항목 수정 흐름
    setWip({
      ...category,
      draftTime: { hour: time.hour, minute: time.minute, ampm: time.ampm },
      editingTimeId: time.id,
    });
    if (category.type === "med") {
      navigate("/onboarding/med-info");
    } else {
      navigate("/onboarding/time-single");
    }
  };

  const btnStyle = { padding: "5px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 11, fontWeight: 400, cursor: "pointer" };

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      <TopBar />
      {/* 스크롤 영역: 제목+리스트만. 확인 버튼 자리는 절대 침범 안 함 */}
      <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, padding: "40px 35px 0", overflowY: "auto" }}>
        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 60 }}>알림 목록</div>

        {(() => {
          // key(`${categoryId}-${timeId}`) → {카테고리, 시간} 원본 찾기용 맵
          const lookup = {};
          data.categories.forEach((c) => c.times.forEach((t) => { lookup[`${c.id}-${t.id}`] = { c, t }; }));

          return getTodaySchedule(data.categories).map(({ key }) => {
            const { c, t } = lookup[key];
            return (
              <div
                key={t.id}
                style={{
                  background: C.field, borderRadius: 5, height: 70, boxSizing: "border-box",
                  padding: "0 12px", marginBottom: 15, display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={LIST_ICON[c.type]} alt="" style={{ width: 32, height: 32 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{LABEL[c.type]}</div>
                    <div style={{ fontSize: 12, color: C.black }}>{fmtTime(t)} · 진행 중</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={btnStyle} onClick={() => editEntry(c, t)}>수정</button>
                  <button onClick={() => removeTime(c.id, t.id)} style={btnStyle}>삭제</button>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* 확인 버튼 — 스크롤 영역 밖, 불투명한 고정 자리. BottomNav 바로 위 */}
      <div style={{ padding: "14px 35px 20px", background: C.bg, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170 }}>
          <Btn onClick={() => navigate(-1)} padding="10px 14px">확인</Btn>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}