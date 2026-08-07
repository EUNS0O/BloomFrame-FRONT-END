import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { CATEGORY_META } from "../constants/categoryMeta";
import { nextId } from "../utils/format";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn, Card } from "../components/common/Controls";

export default function CategorySelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMore = location.pathname.endsWith("/more");
  const { setWip } = useApp();

  const pickCategory = (type) => {
    if (type === "med") {
      setWip({ id: nextId(), type, meds: [], times: [], image: null });
      navigate("/onboarding/med-photo");
    } else {
      setWip({ id: nextId(), type, name: CATEGORY_META[type].label, times: [], image: null, draftTime: { hour: 1, minute: 0, ampm: "오전" } });
      navigate("/onboarding/time-single");
    }
  };

  return (
    <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
      <BackHeader
        onBack={() => (isMore ? navigate("/home") : navigate("/signup/info"))}
        progress={isMore ? undefined : 60}
        title={isMore ? "알림 카테고리 추가" : undefined}
      />
      {!isMore && <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알림 카테고리 선택</div>}
      <Sub>{isMore ? "다른 항목도 추가로 설정할 수 있어요" : "알려드릴 항목을 선택해 주세요"}</Sub>
      {Object.entries(CATEGORY_META).map(([key, meta]) => (
        <Card key={key} onClick={() => pickCategory(key)}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <meta.icon size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</div>
              <div style={{ fontSize: 12, color: C.gray }}>{meta.desc}</div>
            </div>
          </div>
          <ChevronRight size={18} />
        </Card>
      ))}
      {isMore && (
        <div style={{ marginTop: 24 }}>
          <Btn onClick={() => navigate("/home")}>완료</Btn>
        </div>
      )}
    </div>
  );
}
