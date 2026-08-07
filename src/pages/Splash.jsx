import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import blackClover from "../assets/black_clover.png";
import logoWhite from "../assets/logo_white.webp";

// black_clover.png(1080x1081) 기준 클로버 검은 영역 좌표를 실측하여 계산한 값입니다.
// 상단 잎(머리) + 좌우 잎이 화면 폭 끝까지 벌어지는 지점(어깨선)까지만 잘라 보여줍니다.
// ZOOM 값을 올리면 클로버가 더 확대되고, 그만큼 아래 여백(로고/버튼 영역)이 줄어듭니다.
const ZOOM = 1.4;
const SCALE = (412 * ZOOM) / 640; // 클로버 검은 영역 폭(640px) → 프레임 폭(412px) 기준 배율
const IMG_DISPLAY_WIDTH = 1080 * SCALE;
const CROP_TOP = 220;
const BBOX_CENTER_X = (220 + 858) / 2;
const WINDOW_HEIGHT = (500 - CROP_TOP) * SCALE;
const IMG_SHIFT_TOP = -CROP_TOP * SCALE;
const IMG_SHIFT_LEFT = 206 - BBOX_CENTER_X * SCALE;

// logo_white.webp(640x640) 안에서 실제 워드마크 잉크 영역만 실측한 값입니다.
// (위아래로 투명 여백이 커서, img를 그대로 쓰면 로고와 태그라인 사이가 벌어져 보입니다)
const LOGO_BBOX = { left: 50, top: 275, right: 595, bottom: 342 };
const LOGO_DISPLAY_WIDTH = 260; // 로고 크기 — 이 값만 조절하면 됨
const LOGO_SCALE = LOGO_DISPLAY_WIDTH / (LOGO_BBOX.right - LOGO_BBOX.left);
const LOGO_DISPLAY_HEIGHT = (LOGO_BBOX.bottom - LOGO_BBOX.top) * LOGO_SCALE;
const LOGO_IMG_FULL = 640 * LOGO_SCALE;
const LOGO_SHIFT_LEFT = -LOGO_BBOX.left * LOGO_SCALE;
const LOGO_SHIFT_TOP = -LOGO_BBOX.top * LOGO_SCALE;

const PURE_BLACK = "#000000"; // black_clover.png와 동일한 순검정

export default function Splash() {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, background: PURE_BLACK, display: "flex", flexDirection: "column" }}>
      {/* 클로버 실루엣 창 */}
      <div style={{ position: "relative", width: "100%", height: WINDOW_HEIGHT, overflow: "hidden", background: C.bg, flexShrink: 0 }}>
        <img
          src={blackClover}
          alt=""
          style={{
            position: "absolute",
            top: IMG_SHIFT_TOP,
            left: IMG_SHIFT_LEFT,
            width: IMG_DISPLAY_WIDTH,
            height: "auto",
          }}
        />
      </div>

      {/* 로고 + 태그라인: 클로버 바로 아래, 붙여서 배치 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16 }}>
        <div style={{ position: "relative", width: LOGO_DISPLAY_WIDTH, height: LOGO_DISPLAY_HEIGHT, overflow: "hidden" }}>
          <img
            src={logoWhite}
            alt="BloomFrame+"
            style={{ position: "absolute", top: LOGO_SHIFT_TOP, left: LOGO_SHIFT_LEFT, width: LOGO_IMG_FULL, height: "auto" }}
          />
        </div>
        <div style={{ fontSize: 14, color: "#C9C7C2", marginTop: 6, fontWeight: 500 }}>예술로 피어나는 습관</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* 로그인 버튼 영역 */}
      <div style={{ padding: "0 40px 40px" }}>
        <button
          onClick={() => navigate("/login")}
          style={{ width: "100%", padding: "16px", borderRadius: 10, border: "none", background: C.bg, color: PURE_BLACK, fontWeight: 700, fontSize: 15, cursor: "pointer" }}
        >
          로그인
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: C.linkGray }}>
          계정이 없으신가요?{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/signup/type")}>회원가입</span>
        </div>
      </div>
    </div>
  );
}
