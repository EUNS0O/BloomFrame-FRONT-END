import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { ImageGrid } from "../components/widgets/ImageGrid";
import { BottomNav } from "../components/common/BottomNav";
import plant1 from "../assets/plants/plant_1.png";
import plant2 from "../assets/plants/plant_2.webp";
import plant3 from "../assets/plants/plant_3.webp";
import plant4 from "../assets/plants/plant_4.webp";
import plant5 from "../assets/plants/plant_5.webp";
import plant6 from "../assets/plants/plant_6.webp";
import plant7 from "../assets/plants/plant_7.webp";
import plant8 from "../assets/plants/plant_8.webp";
import plant9 from "../assets/plants/plant_9.webp";

// 9개 칸 전부 채움 — "1"(plant1)만 실제로 애니메이션까지 완성된 기본 식물
const PLANT_THUMBNAILS = [plant1, plant2, plant3, plant4, plant5, plant6, plant7, plant8, plant9];
const DEFAULT_PLANT_INDEX = 0; // 실제로 동작하는 유일한 식물의 칸 번호 ("1")

export default function ImageSelect() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip, setData, imageOnly, setImageOnly } = useApp();

  if (!wip) return null;

  // 아직 실제로 구현 안 된 식물을 골랐을 때 — 알림창 디자인은 나중에 받으면 교체 예정, 지금은 임시 alert
  const showComingSoon = () => {
    alert("준비 중입니다");
  };

  // 마이페이지 "이미지 바꾸기"로 들어온 경우: 카테고리에 반영하지 않고 표시용 이미지만 갱신
  if (imageOnly) {
    const confirmImageOnly = () => {
      if (wip.image !== DEFAULT_PLANT_INDEX) return showComingSoon();
      setData((d) => ({ ...d, iotImage: wip.image }));
      setWip(null);
      setImageOnly(false);
      navigate("/mypage");
    };
    return (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "40px 35px 100px", overflowY: "auto" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>이미지 선택</div>
          <div style={{ fontSize: 17, color: C.gray, lineHeight: 1.6, fontWeight: 500 }}>
            IoT 스크린에 들어갈 이미지를 선택해 주세요
          </div>
          <ImageGrid selected={wip.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} thumbnails={PLANT_THUMBNAILS} />
          <BottomButton variant="high">
            <Btn disabled={wip.image == null} onClick={confirmImageOnly} padding="10px 14px">확인</Btn>
          </BottomButton>
        </div>
        <BottomNav />
      </>
    );
  }

  // 온보딩 / 알림 카테고리 추가 흐름
  const finishCategory = () => {
    if (wip.image !== DEFAULT_PLANT_INDEX) return showComingSoon();
    setData((d) => ({ ...d, categories: [...d.categories, wip] }));
    setWip(null);
    if (onboarding) navigate("/onboarding/category/more");
    else navigate("/home");
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto" }}>
      <BackHeader progress={onboarding ? 100 : undefined} />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>이미지 선택</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, paddingLeft: 12, fontWeight: 500 }}>
        IoT 스크린에 들어갈 이미지를 선택해 주세요
      </div>
      <ImageGrid selected={wip.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} thumbnails={PLANT_THUMBNAILS} />
      <BottomButton>
        <Btn disabled={wip.image == null} onClick={finishCategory} padding="10px 14px">확인</Btn>
      </BottomButton>
    </div>
  );
}