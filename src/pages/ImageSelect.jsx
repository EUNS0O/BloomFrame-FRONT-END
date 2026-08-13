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
        <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto" }}>
          <BackHeader hideBack />
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>이미지 선택</div>
          <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, paddingLeft: 12, fontWeight: 500 }}>
            IoT 스크린에 들어갈 이미지를 선택해 주세요
          </div>
          <ImageGrid selected={wip.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} />
          <BottomButton>
            <Btn disabled={wip.image == null} onClick={confirmImageOnly} padding="10px 14px">확인</Btn>
          </BottomButton>
        </div>
        <BottomNav />
      </>
    );
  }

  // 온보딩 / 알림 카테고리 추가 / 알림 목록에서 수정 흐름
  const finishCategory = () => {
    setData((d) => {
      const isEditing = d.categories.some((c) => c.id === wip.id);
      const categories = isEditing
        ? d.categories.map((c) => (c.id === wip.id ? wip : c)) // 기존 항목 수정: 덮어쓰기
        : [...d.categories, wip]; // 새 항목: 추가
      return { ...d, categories };
    });
    setWip(null);
    if (onboarding) navigate("/onboarding/category/more");
    else navigate("/home");
  };

  return (
    <div style={{ flex: 1, padding: "0 30px 100px", overflowY: "auto" }}>
      <BackHeader progress={onboarding ? 100 : undefined} hideBack />
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>이미지 선택</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, paddingLeft: 12, fontWeight: 500 }}>
        IoT 스크린에 들어갈 이미지를 선택해 주세요
      </div>
      <ImageGrid selected={wip.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} />
      <BottomButton>
        <Btn disabled={wip.image == null} onClick={finishCategory} padding="10px 14px">확인</Btn>
      </BottomButton>
    </div>
  );
}