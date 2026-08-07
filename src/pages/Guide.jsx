import React from "react";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { BottomNav } from "../components/common/BottomNav";

export default function Guide() {
  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", fontSize: 13.5, lineHeight: 1.7, color: "#333" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>이용 안내</div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>서비스 설명</div>
        <p style={{ marginTop: 0 }}>
          BloomFrame은 오랜기간 정체되어있던 알림 패러다임에 신선한 변화를 가져왔습니다. 각종 알림을 거대한 화면의 인테리어
          소품으로 느껴보세요. 시인성을 극대화하여 알림의 정시 수행률을 극대화합니다.
        </p>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>앱 이용 안내</div>
        <p style={{ marginTop: 0 }}>하단의 IoT, 홈, 마이페이지 탭을 눌러 각 기능을 살펴볼 수 있습니다.</p>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>IoT 탭</div>
        <p style={{ marginTop: 0 }}>IoT 기기를 연결하고 관리할 수 있습니다. 고유 넘버로 연결하고, 이름 변경·추가·삭제가 가능합니다.</p>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>홈 탭</div>
        <p style={{ marginTop: 0 }}>알림 기록과 목록을 확인하고 추가할 수 있습니다. 초록색은 이행, 빨간색은 미이행, 회색은 예정된 알림입니다.</p>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>마이페이지 탭</div>
        <p style={{ marginTop: 0 }}>개인 정보와 약 목록 확인·수정, 이미지 변경, AI 추천 정보 표시 여부를 설정할 수 있습니다.</p>
      </div>
      <BottomNav />
    </>
  );
}
