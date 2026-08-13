import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";
import medicineIconGreen from "../assets/medicine_icon_green.png";
import medicineIconRed from "../assets/medicine_icon_red.png";
import medicineIconSmall from "../assets/medicine_icon_small.png";
import gymIconSmall from "../assets/gym_icon_small.png";

const PENDING_ICON = { med: medicineIconSmall, exercise: gymIconSmall, other: medicineIconSmall };
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKS_IN_GRID = 6;

const MOCK_RECORDS = {
  "2026-8-1": ["done", "missed", "pending", "pending"],
  "2026-8-5": ["done", "done", "done", "missed"],
  "2026-8-12": ["missed", "missed", "pending", "pending"],
};

const today = new Date();

export default function History() {
  const navigate = useNavigate();
  const { data } = useApp();

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

  const recordKey = `${selected.year}-${selected.month + 1}-${selected.day}`;
  const record = MOCK_RECORDS[recordKey] || ["pending", "pending", "pending", "pending"];

  const allTypes = [];
  data.categories.forEach((c) => c.times.forEach(() => allTypes.push(c.type)));
  const iconData = record.map((status, i) => ({
    status,
    type: allTypes[i] || "med",
  }));

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 20px 100px", overflowY: "auto" }}>
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
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 42, marginLeft: 40, marginBottom: 30, width: "max-content" }}>
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

        <BottomButton variant="high">
          <Btn onClick={() => navigate(-1)} padding="10px 14px">확인</Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}