import React from "react";
import { Pill } from "lucide-react";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { BottomNav } from "../components/common/BottomNav";

export default function History() {
  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>이전 기록</div>
        <div style={{ border: `1px solid ${C.grayLine}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>8월 2026</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, fontSize: 12, color: C.gray, textAlign: "center" }}>
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => <div key={d}>{d}</div>)}
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} style={{ padding: "6px 0", borderRadius: 8, color: i + 1 === 1 ? C.orange : C.black, fontWeight: i + 1 === 1 ? 700 : 400 }}>{i + 1}</div>
            ))}
          </div>
        </div>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>8월 1일</div>
        <div style={{ display: "flex", gap: 12 }}>
          {["#3CB371", "#E4523A", "#D9D7D2", "#D9D7D2"].map((c, i) => (
            <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center" }}><Pill size={16} color="#fff" /></div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
