import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { CATEGORY_META } from "../constants/categoryMeta";
import { nextId } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { Card, Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import { BottomButton } from "../components/common/BottomButton";
import rightIcon from "../assets/right_icon.png";
import rightIconWhite from "../assets/right_icon_white.png";
import medicineIcon from "../assets/medicine_icon.png";
import medicineIconWhite from "../assets/medicine_icon_white.png";
import gymIcon from "../assets/gym_icon.png";
import gymIconWhite from "../assets/gym_icon_white.png";
import clockIcon from "../assets/clock_icon.png";
import clockIconWhite from "../assets/clock_icon_white.png";

const CARD_BG = "#E8E8E8";
const CARD_BG_ACTIVE = "#FE731C";

const ICONS = {
  med: { normal: medicineIcon, white: medicineIconWhite },
  exercise: { normal: gymIcon, white: gymIconWhite },
  other: { normal: clockIcon, white: clockIconWhite },
};

export default function CategorySelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMore = location.pathname.endsWith("/more");
  const { onboarding, setWip } = useApp();
  const [selected, setSelected] = useState(null); // 현재 주황색으로 선택된 카테고리 key

  const pickCategory = (type) => {
    setSelected(type);
    setTimeout(() => {
      if (type === "med") {
        setWip({ id: nextId(), type, meds: [], times: [], image: null });
        navigate("/onboarding/med-photo");
      } else {
        setWip({ id: nextId(), type, name: CATEGORY_META[type].label, times: [], image: null, draftTime: { hour: 1, minute: 0, ampm: "오전" } });
        navigate("/onboarding/time-single");
      }
    }, 180);
  };

  // 홈 화면 "+ 알람 추가하기"로 들어온 경우 (온보딩 아님): 앱 셸(TopBar/BottomNav) 있는 화면
  if (!onboarding) {
    return (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알림 카테고리 추가</div>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 18 }}>다른 항목도 추가로 설정할 수 있어요</div>
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
        </div>
        <BottomNav />
      </>
    );
  }

  // 온보딩 중 "카테고리 추가"(반복 등록) — 앱 셸 없이, 완료 버튼으로 마무리 (카드 디자인은 최초 선택 화면과 동일)
  if (isMore) {
    return (
      <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto" }}>
        <BackHeader />
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>알림 카테고리 추가</div>
        <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 100, paddingLeft: 12, fontWeight: 500 }}>
          다른 항목도 추가로 설정할 수 있어요
        </div>

        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const active = selected === key;
          return (
            <div
              key={key}
              onClick={() => pickCategory(key)}
              style={{
                background: active ? CARD_BG_ACTIVE : CARD_BG, borderRadius: 8, padding: "35px 18px", display: "flex", alignItems: "center",
                justifyContent: "space-between", cursor: "pointer", width: "77%", margin: "0 auto 28px",
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <img src={active ? ICONS[key].white : ICONS[key].normal} alt="" style={{ width: 56, height: 56, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: active ? "#fff" : C.black }}>{meta.label}</div>
                  <div style={{ fontSize: 13, color: active ? "#fff" : C.black, marginTop: 3 }}>{meta.desc}</div>
                </div>
              </div>
              <img src={active ? rightIconWhite : rightIcon} alt="" style={{ width: 15, height: "auto" }} />
            </div>
          );
        })}

        <BottomButton>
          <Btn onClick={() => navigate("/home")} padding="10px 14px">완료</Btn>
        </BottomButton>
      </div>
    );
  }

  // 온보딩 중 최초 "카테고리 선택" 화면 (progress bar 있음, isMore는 위에서 이미 처리됨)
  return (
    <div style={{ flex: 1, padding: "0 30px 30px" }}>
      <BackHeader
        onBack={() => navigate("/signup/info")}
        progress={60}
      />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>알림 카테고리 선택</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 100, paddingLeft: 12, fontWeight: 500 }}>
        알려드릴 항목을 선택해 주세요
      </div>

      {Object.entries(CATEGORY_META).map(([key, meta]) => {
        const active = selected === key;
        return (
          <div
            key={key}
            onClick={() => pickCategory(key)}
            style={{
              background: active ? CARD_BG_ACTIVE : CARD_BG, borderRadius: 8, padding: "35px 18px", display: "flex", alignItems: "center",
              justifyContent: "space-between", cursor: "pointer", width: "77%", margin: "0 auto 28px",
              transition: "background 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img src={active ? ICONS[key].white : ICONS[key].normal} alt="" style={{ width: 56, height: 56, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: active ? "#fff" : C.black }}>{meta.label}</div>
                <div style={{ fontSize: 13, color: active ? "#fff" : C.black, marginTop: 3 }}>{meta.desc}</div>
              </div>
            </div>
            <img src={active ? rightIconWhite : rightIcon} alt="" style={{ width: 15, height: "auto" }} />
          </div>
        );
      })}
    </div>
  );
}