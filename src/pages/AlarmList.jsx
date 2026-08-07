import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { CATEGORY_META } from "../constants/categoryMeta";
import { fmtTime } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

export default function AlarmList() {
  const navigate = useNavigate();
  const { data, setData } = useApp();

  const removeTime = (categoryId, timeId) => {
    setData((d) => ({
      ...d,
      categories: d.categories.map((cc) => (cc.id === categoryId ? { ...cc, times: cc.times.filter((x) => x.id !== timeId) } : cc)),
    }));
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>알림 목록</div>
        {data.categories.flatMap((c) =>
          c.times.map((t) => (
            <div key={t.id} style={{ background: C.field, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {React.createElement(CATEGORY_META[c.type].icon, { size: 18 })}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{CATEGORY_META[c.type].label}</div>
                  <div style={{ fontSize: 12, color: C.gray }}>{fmtTime(t)} · 진행 중</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ padding: "7px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
                <button onClick={() => removeTime(c.id, t.id)} style={{ padding: "7px 12px", borderRadius: 20, border: "none", background: "#fff", color: C.black, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>삭제</button>
              </div>
            </div>
          ))
        )}
        <div style={{ marginTop: 20 }}>
          <Btn onClick={() => navigate(-1)}>확인</Btn>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
