import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Pill, Dumbbell, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { CATEGORY_META } from "../constants/categoryMeta";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

const STATUS_COLOR = { done: "#3CB371", missed: "#E4523A", pending: "#D9D7D2" };
const iconFor = (t) => (t === "med" ? Pill : t === "exercise" ? Dumbbell : Clock);

export default function Home() {
  const navigate = useNavigate();
  const { data, setOnboarding, setWip } = useApp();

  const startAddAlarm = () => {
    setOnboarding(false);
    setWip(null);
    navigate("/onboarding/category");
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>홈</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>알림 기록</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          {(data.logs[0]?.statuses || []).map((s, i) => {
            const Icon = i < data.categories.length ? iconFor(data.categories[i].type) : Pill;
            return (
              <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: STATUS_COLOR[s], display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color="#fff" />
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: C.gray, cursor: "pointer", marginBottom: 26 }} onClick={() => navigate("/home/history")}>
          이전 기록 보기 &gt;
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>알림 목록</div>
        {data.categories.length === 0 && <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>아직 등록된 알림이 없어요.</div>}
        {data.categories.map((c) => {
          const meta = CATEGORY_META[c.type];
          return (
            <Card key={c.id} onClick={() => navigate("/home/alarms")}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <meta.icon size={18} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</div>
                  <div style={{ fontSize: 12, color: C.gray }}>알림 {c.times.length}건 · 진행 중</div>
                </div>
              </div>
              <ChevronRight size={18} />
            </Card>
          );
        })}
        <button onClick={startAddAlarm} style={{ width: "100%", padding: "16px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 10 }}>
          + 알람 추가하기
        </button>
      </div>
      <BottomNav />
    </>
  );
}
