import React from "react";
import { useNavigate } from "react-router-dom";
import { Pill, Shield, Bell, Image as ImageIcon, ListChecks, MessageCircle, LogOut, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

export default function MyPage() {
  const navigate = useNavigate();
  const { data, update, setOnboarding, setWip, resetAll } = useApp();

  const changeImage = () => {
    setOnboarding(false);
    setWip({ id: nextId(), type: "other", times: [], image: null });
    navigate("/onboarding/image-select");
  };

  const logout = () => {
    resetAll();
    navigate("/");
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>마이페이지</div>
        <div style={{ background: C.black, color: "#fff", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🍀</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>계정 · {data.email || "example.com"}</div>
              <div style={{ fontSize: 12, color: "#C9C7C2" }}>{data.name || "홍길동"} {data.selfPhone || "010-0000-0000"}</div>
            </div>
          </div>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: "#fff", color: C.black, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray, marginBottom: 10 }}>복용약 정보</div>
        <Card onClick={() => navigate("/mypage/meds")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Pill size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>약 목록</span></div>
          <ChevronRight size={16} />
        </Card>
        <Card onClick={() => alert("건강 상태를 업데이트합니다.")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Shield size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>건강 상태 업데이트</span></div>
          <ChevronRight size={16} />
        </Card>

        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray, margin: "18px 0 10px" }}>설정</div>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Bell size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>AI 추천 정보 나타내기</span></div>
          <div onClick={() => update({ aiRecommend: !data.aiRecommend })} style={{ width: 40, height: 24, borderRadius: 20, background: data.aiRecommend ? C.black : C.grayLine, position: "relative", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: data.aiRecommend ? 19 : 3, transition: "left .15s" }} />
          </div>
        </Card>
        <Card onClick={changeImage}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ImageIcon size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>이미지 바꾸기</span></div>
          <ChevronRight size={16} />
        </Card>

        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray, margin: "18px 0 10px" }}>이용 안내</div>
        <Card onClick={() => navigate("/mypage/guide")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ListChecks size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>이용 안내</span></div>
          <ChevronRight size={16} />
        </Card>
        <Card onClick={() => navigate("/mypage/inquiry")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><MessageCircle size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>문의하기</span></div>
          <ChevronRight size={16} />
        </Card>
        <Card onClick={logout}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><LogOut size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>로그아웃</span></div>
          <ChevronRight size={16} />
        </Card>
      </div>
      <BottomNav />
    </>
  );
}
