import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import medicineIconGreen from "../assets/medicine_icon_green.png";
import medicineIconRed from "../assets/medicine_icon_red.png";
import medicineIconSmall from "../assets/medicine_icon_small.png";
import gymIconSmall from "../assets/gym_icon_small.png";
import medicineIconWhiteSmall from "../assets/medicine_icon_white_small.png";
import gymIconWhiteSmall from "../assets/gym_icon_white_small.png";
import rightSmall from "../assets/right_small.png";

// 카테고리 타입별 아이콘/라벨 매핑 (기타는 별도 아이콘이 아직 없어 medicine 아이콘으로 대체)
const PENDING_ICON = { med: medicineIconSmall, exercise: gymIconSmall, other: medicineIconSmall };
const LIST_ICON = { med: medicineIconWhiteSmall, exercise: gymIconWhiteSmall, other: medicineIconWhiteSmall };
const LABEL = { med: "약", exercise: "운동", other: "기타" };

export default function Home() {
  const navigate = useNavigate();
  const { data, setOnboarding, setWip } = useApp();
  const scrollId = React.useId().replace(/:/g, "");

  const startAddAlarm = () => {
    setOnboarding(false);
    setWip(null);
    navigate("/onboarding/category");
  };

  // 같은 타입의 카테고리가 여러 번 등록돼 있어도 알림 목록엔 타입당 한 줄로 합쳐서 표시
  const grouped = [];
  data.categories.forEach((c) => {
    const existing = grouped.find((g) => g.type === c.type);
    if (existing) existing.count += c.times.length;
    else grouped.push({ type: c.type, count: c.times.length });
  });

  // 실제 등록된 알림(카테고리별 시간)을 등록 순서대로 펼쳐서 아이콘 목록 생성
  // 완료/미완료 여부는 백엔드 인증 로그(GET /api/verifications) 연동 전까지는 mock 데이터를 순서대로 재사용하고,
  // 그 외는 전부 '예정(pending)'으로 표시합니다.
  const mockStatuses = data.logs[0]?.statuses || [];
  const allSlots = [];
  data.categories.forEach((c) => {
    c.times.forEach(() => allSlots.push({ type: c.type }));
  });
  const iconData = allSlots.map((slot, i) => ({
    type: slot.type,
    status: mockStatuses[i] || "pending",
  }));

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "40px 35px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 48 }}>홈</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>알림 기록</div>

          {/* 아이콘이 많아지면 가로 스크롤 되도록 wrapper 분리 (프레임 밖으로 잘리지 않게) */}
          <style>{`
            .hscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
            .hscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
            .hscroll-${scrollId}::-webkit-scrollbar { height: 3px; }
            .hscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
            .hscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
            .hscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
          `}</style>
          <div className={`hscroll-${scrollId}`} style={{ overflowX: "auto", marginBottom: 14 }}>
            {/* 아이콘 사이(오른쪽 끝~다음 아이콘 왼쪽 끝) 구간만 잇는 회색 연결선 */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 42, marginLeft: 22, width: "max-content" }}>
              {iconData.length > 1 && (
                <div style={{ position: "absolute", left: 40, right: 40, top: "50%", transform: "translateY(-50%)", height: 1, background: C.grayLine, zIndex: 0 }} />
              )}
              {iconData.map((d, i) => {
                let icon;
                if (d.status === "done") icon = medicineIconGreen;
                else if (d.status === "missed") icon = medicineIconRed;
                else icon = PENDING_ICON[d.type] || medicineIconSmall;
                return <img key={i} src={icon} alt="" style={{ width: 40, height: 40, position: "relative", zIndex: 1, display: "block", flexShrink: 0 }} />;
              })}
            </div>
          </div>

          <div style={{ textAlign: "right", fontSize: 12, color: C.gray, cursor: "pointer", marginBottom: 65 }} onClick={() => navigate("/home/history")}>
            이전 기록 보기 &gt;
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>알림 목록</div>
        </div>

        {/* 알림 목록만 내부 스크롤 — 늘어나도 버튼 위치는 안 바뀜 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 35px" }}>
          {grouped.length === 0 && <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>아직 등록된 알림이 없어요.</div>}
          {grouped.map((g) => (
            <Card key={g.type} onClick={() => navigate("/home/alarms")} borderRadius={6} padding="11px 11px" width="99%" marginBottom={6}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={LIST_ICON[g.type]} alt="" style={{ width: 30, height: 30 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{LABEL[g.type]}</div>
                  <div style={{ fontSize: 12, color: C.black }}>알림 {g.count}건 · 진행 중</div>
                </div>
              </div>
              <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
            </Card>
          ))}
        </div>

        {/* 알람 추가하기 버튼 — 항상 하단 탭 바로 위에 고정 */}
        <div style={{ padding: "10px 30px 50px" }}>
          <button onClick={startAddAlarm} style={{ width: "100%", padding: "14px", borderRadius: 22, border: `1.5px dashed ${C.black}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            + 알람 추가하기
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}