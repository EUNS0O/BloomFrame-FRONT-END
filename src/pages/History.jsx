import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";
import { getTodaySchedule, getAlarmStatus } from "../utils/alarmStatus";
import { getRecord, saveTodayRecord } from "../utils/historyStore";
import { loadCategoriesFromServer, loadVerificationsFromServer } from "../api/sync";
import { getMe } from "../api/auth";
import medicineIconGreen from "../assets/medicine_icon_green.webp";
import medicineIconRed from "../assets/medicine_icon_red.webp";
import medicineIconSmall from "../assets/medicine_icon_small.webp";
import gymIconSmall from "../assets/gym_icon_small.webp";
import gymIconGreen from "../assets/gym_icon_green.webp";
import gymIconRed from "../assets/gym_icon_red.webp";
import clockIconGreen from "../assets/clock_icon_green.webp";
import clockIconRed from "../assets/clock_icon_red.webp";
import clockIconSmall from "../assets/clock_icon_small.webp";

const PENDING_ICON = { med: medicineIconSmall, exercise: gymIconSmall, other: clockIconSmall };
const SUCCESS_ICON = { med: medicineIconGreen, exercise: gymIconGreen, other: clockIconGreen };
const MISSED_ICON = { med: medicineIconRed, exercise: gymIconRed, other: clockIconRed };
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKS_IN_GRID = 6;

export default function History() {
  const navigate = useNavigate();
  const { data, update } = useApp();
  const scrollId = React.useId().replace(/:/g, "");
  const [uid, setUid] = useState(null);
  const [now, setNow] = useState(new Date());
  const today = now;
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]); // 폴링이 항상 "지금 이 순간"의 data를 보게 함

  // 내 uid 확보 (인증 기록 조회에 필요)
  useEffect(() => {
    getMe()
      .then((me) => setUid(me.uid))
      .catch((e) => console.error("[History] 내 정보 조회 실패:", e));
  }, []);

  // Home.jsx랑 동일한 패턴 — "오늘" 부분을 실시간으로 보여주는 화면이라 여기도 최신 데이터가 필요함
  // 화면이 안 보일 때는 폴링 멈춤
  useEffect(() => {
    let categoryInFlight = false;
    let verificationInFlight = false;
    const syncCategories = () => {
      if (categoryInFlight) return;
      categoryInFlight = true;
      loadCategoriesFromServer(dataRef.current.categories)
        .then((categories) => update({ categories }))
        .catch((e) => console.error("[History] 알림 목록 조회 실패:", e))
        .finally(() => { categoryInFlight = false; });
    };

    const syncVerifications = () => {
      if (uid && !verificationInFlight) {
        verificationInFlight = true;
        loadVerificationsFromServer(uid)
          .then((verifications) => update({ verifications: { ...dataRef.current.verifications, ...verifications } }))
          .catch((e) => console.error("[History] 인증 기록 조회 실패:", e))
          .finally(() => { verificationInFlight = false; });
      }
    };

    let categoryIntervalId = null;
    let verificationIntervalId = null;
    const startPolling = () => {
      if (categoryIntervalId || verificationIntervalId) return;
      syncCategories();
      syncVerifications();
      categoryIntervalId = setInterval(syncCategories, 45 * 1000);
      verificationIntervalId = setInterval(syncVerifications, 5 * 1000);
    };
    const stopPolling = () => {
      if (categoryIntervalId) clearInterval(categoryIntervalId);
      if (verificationIntervalId) clearInterval(verificationIntervalId);
      categoryIntervalId = null;
      verificationIntervalId = null;
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") startPolling();
      else stopPolling();
    };

    if (document.visibilityState === "visible") startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);


  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() });

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = WEEKS_IN_GRID * 7;

  const isSelectedToday = selected.year === today.getFullYear() && selected.month === today.getMonth() && selected.day === today.getDate();

  // 오늘이면 Home.jsx와 똑같이 실시간으로 계산, 그 외 날짜는 저장된 스냅샷(localStorage)을 조회
  let iconData;
  if (isSelectedToday) {
    const todaySchedule = getTodaySchedule(data.categories);
    iconData = todaySchedule.map((entry) => ({
      type: entry.label,
      status: getAlarmStatus(entry, data.verifications, now),
    }));
  } else {
    const stored = getRecord(selected.year, selected.month, selected.day);
    iconData = stored || []; // 기록이 없으면 빈 배열 (그 날은 앱을 안 썼다는 뜻)
  }

  useEffect(() => {
    if (isSelectedToday && iconData.length > 0) saveTodayRecord(iconData);
  }, [isSelectedToday, JSON.stringify(iconData)]);

  return (
    <>
      <TopBar />
      <div className={`vscroll-${scrollId}`} style={{ flex: 1, padding: "20px 20px 100px", overflowY: "auto" }}>
        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 25, marginBottom: 16 }}>이전 기록</div>

        <div style={{ border: `2px solid ${C.black}`, borderRadius: 12, padding: 10, marginBottom: 40, width: "94%", margin: "40px auto 60px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{viewMonth + 1}월 {viewYear}</span>
            <div style={{ display: "flex", gap: 15, color: C.black }}>
              <ChevronLeft size={20} style={{ cursor: "pointer" }} onClick={goPrevMonth} />
              <ChevronRight size={20} style={{ cursor: "pointer" }} onClick={goNextMonth} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 47px)", width: "max-content", margin: "10px 0 8px", gap: 4, fontSize: 12, color: C.gray, textAlign: "center" }}>
            {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 47px)", width: "max-content", margin: "0 8px 0", gap: 4, fontSize: 18, textAlign: "center" }}>
            {Array.from({ length: totalCells }, (_, idx) => {
              const day = idx - firstWeekday + 1;
              if (day < 1 || day > daysInMonth) {
                return <div key={`blank-${idx}`} style={{ width: 30, aspectRatio: "1 / 1.2" }} />;
              }
              const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
              const isSelected = viewYear === selected.year && viewMonth === selected.month && day === selected.day;
              return (
                <div
                  key={day}
                  onClick={() => setSelected({ year: viewYear, month: viewMonth, day })}
                  style={{ width: 30, aspectRatio: "1 / 1.2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isToday ? C.orangeSoft : isSelected ? C.black : "transparent",
                      color: isToday ? "#FE731C" : isSelected ? "#fff" : C.black,
                      fontWeight: isToday || isSelected ? 700 : 400,
                    }}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ fontWeight: 700, marginBottom: 16, marginLeft: 12 }}>{selected.month + 1}월 {selected.day}일</div>
        {iconData.length === 0 ? (
          <div style={{ fontSize: 13, color: C.gray, marginLeft: 12, marginBottom: 30 }}>
            {isSelectedToday ? "오늘 등록된 알림이 없어요." : "이 날짜엔 기록이 없어요."}
          </div>
        ) : (
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 42, marginLeft: 40, marginBottom: 30, width: "max-content" }}>
            {iconData.length > 1 && (
              <div style={{ position: "absolute", left: 40, right: 40, top: "50%", transform: "translateY(-50%)", height: 1, background: C.grayLine, zIndex: 0 }} />
            )}
            {iconData.map((d, i) => {
              let icon;
              if (d.status === "success") icon = SUCCESS_ICON[d.type] || SUCCESS_ICON.other;
              else if (d.status === "missed") icon = MISSED_ICON[d.type] || MISSED_ICON.other;
              else icon = PENDING_ICON[d.type] || PENDING_ICON.other;
              return <img key={i} src={icon} alt="" style={{ width: 40, height: 40, position: "relative", zIndex: 1, display: "block", flexShrink: 0 }} />;
            })}
          </div>
        )}

        <BottomButton variant="medium">
          <Btn onClick={() => navigate(-1)} padding="10px 14px">확인</Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}
