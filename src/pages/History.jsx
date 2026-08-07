import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pill } from "lucide-react";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

const TODAY = 1;

// 날짜별 mock 기록 (실제 연동 시 GET /api/verifications 결과로 대체)
const MOCK_RECORDS = {
  1: ["done", "missed", "pending", "pending"],
  5: ["done", "done", "done", "missed"],
  12: ["missed", "missed", "pending", "pending"],
};

export default function History() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const record = MOCK_RECORDS[selectedDay] || ["pending", "pending", "pending", "pending"];

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>이전 기록</div>
        <div style={{ border: `1px solid ${C.grayLine}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>8월 2026</div>
            <div style={{ display: "flex", gap: 4, color: C.gray }}>
              <ChevronLeft size={16} style={{ cursor: "pointer" }} />
              <ChevronRight size={16} style={{ cursor: "pointer" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, fontSize: 12, color: C.gray, textAlign: "center", marginBottom: 4 }}>
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, fontSize: 13, textAlign: "center" }}>
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isToday = day === TODAY;
              const isSelected = day === selectedDay;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: "6px 0", borderRadius: 8, cursor: "pointer",
                    background: isSelected && !isToday ? C.black : "transparent",
                    color: isSelected && !isToday ? "#fff" : isToday ? C.orange : C.black,
                    fontWeight: isToday || isSelected ? 700 : 400,
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>8월 {selectedDay}일</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
          {record.map((s, i) => {
            const color = { done: "#3CB371", missed: "#E4523A", pending: "#D9D7D2" }[s];
            return (
              <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Pill size={16} color="#fff" />
              </div>
            );
          })}
        </div>
        <Btn onClick={() => navigate(-1)}>확인</Btn>
      </div>
      <BottomNav />
    </>
  );
}
