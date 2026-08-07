import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { ImageGrid } from "../components/widgets/ImageGrid";

export default function ImageSelect() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip, setData } = useApp();

  if (!wip) return null;

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
