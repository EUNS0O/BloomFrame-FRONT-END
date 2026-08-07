import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { TopBar } from "../components/common/Layout";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { ImageGrid } from "../components/widgets/ImageGrid";
import { BottomNav } from "../components/common/BottomNav";

export default function ImageSelect() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip, setData, imageOnly, setImageOnly } = useApp();

  if (!wip) return null;

  // 마이페이지 "이미지 바꾸기"로 들어온 경우: 카테고리에 반영하지 않고 표시용 이미지만 갱신
  if (imageOnly) {
    const confirmImageOnly = () => {
      setData((d) => ({ ...d, iotImage: wip.image }));
      setWip(null);
      setImageOnly(false);
      navigate("/mypage");
    };
    return (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <BackHeader onBack={() => { setWip(null); setImageOnly(false); navigate(-1); }} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>이미지 선택</div>
          <Sub>IoT 스크린에 들어갈 이미지를 선택해 주세요</Sub>
          <ImageGrid selected={wip.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} />
          <Btn disabled={wip.image == null} onClick={confirmImageOnly}>확인</Btn>
        </div>
        <BottomNav />
      </>
    );
  }

  // 온보딩 / 알림 카테고리 추가 흐름
  const finishCategory = () => {
    setData((d) => ({ ...d, categories: [...d.categories, wip] }));
    setWip(null);
    if (onboarding) navigate("/onboarding/category/more");
    else navigate("/home");
  };

  return (
    <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
      <BackHeader progress={onboarding ? 92 : undefined} />
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>이미지 선택</div>
      <Sub>IoT 스크린에 들어갈 이미지를 선택해 주세요</Sub>
      <ImageGrid selected={wip.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} />
      <Btn disabled={wip.image == null} onClick={finishCategory}>확인</Btn>
    </div>
  );
}
