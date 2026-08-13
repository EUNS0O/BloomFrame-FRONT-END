import React from "react";

// Frame(전체 프레임)의 position:relative를 기준으로 절대 위치 고정합니다.
// 콘텐츠 길이와 무관하게 프레임 바닥에서 항상 같은 거리(bottom)에 위치합니다.
//
// variant 두 종류를 고정값으로 관리합니다:
// - "low"  : 회원 정보 입력 / 약 정보 / 알림·복용 시간 설정 등 대부분의 화면
// - "high" : 로그인(하단 탭바가 있는 화면), 알람 설정(시간 선택) 등 더 위쪽에 오는 화면
export const BOTTOM_OFFSET = {
  low: 40,
  high: 170,
};

export function BottomButton({ children, width = 170, variant = "low" }) {
  const bottom = BOTTOM_OFFSET[variant];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom, display: "flex", justifyContent: "center" }}>
      <div style={{ width }}>{children}</div>
    </div>
  );
}