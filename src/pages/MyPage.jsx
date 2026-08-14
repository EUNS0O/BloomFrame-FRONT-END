import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { nextId } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import cloverOrange from "../assets/clover_orange.png";
import rightSmall from "../assets/right_small.png";
import iconMedicine from "../assets/small_medicine.png";
import iconHealth from "../assets/small_health.png";
import iconAlarm from "../assets/small_alarm.png";
import iconImage from "../assets/small_image.png";
import iconMenu from "../assets/small_menu.png";
import iconChat from "../assets/small_chat.png";
import iconLogout from "../assets/small_logout.png";

// IotDevices.jsx의 수정 버튼과 동일한 모양 (배경/글자색만 흑백 반전 — 검정 카드 위에 얹히므로 흰 배경/검정 글자)
const editBtnStyle = { padding: "3px 12px", borderRadius: 20, border: "none", background: "#fff", color: C.black, fontSize: 9, fontWeight: 400, cursor: "pointer" };

export default function MyPage() {
  const navigate = useNavigate();
  const { data, update, setWip, setImageOnly, resetAll } = useApp();

  const changeImage = () => {
    setImageOnly(true);
    setWip({ id: nextId(), type: "other", times: [], image: data.iotImage });
    navigate("/onboarding/image-select");
  };

  const logout = () => {
    resetAll();
    navigate("/");
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "40px 35px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>마이페이지</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 35px 40px" }}>
          <div style={{ background: C.black, color: "#fff", borderRadius: 9, padding: "27px 19px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={cloverOrange} alt="" style={{ width: 50, height: 50 }} />
              </div>
              <div>
                <div style={{ fontWeight: 300, fontSize: 18 }}>계정 · {data.email || "example.com"}</div>
                <div style={{ fontSize: 12, color: "#C9C7C2" }}>{data.name || "홍길동"} {data.selfPhone || "010-0000-0000"}</div>
              </div>
            </div>
            <button style={editBtnStyle}>수정</button>
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: C.black, marginBottom: 10 }}>복용약 정보</div>
          <Card onClick={() => navigate("/mypage/meds")} borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconMedicine} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>약 목록</span>
            </div>
            <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
          </Card>
          <Card onClick={() => alert("건강 상태를 업데이트합니다.")} borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconHealth} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>건강 상태 업데이트</span>
            </div>
            <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
          </Card>

          <div style={{ fontSize: 20, fontWeight: 700, color: C.black, margin: "20px 0 10px" }}>설정</div>
          <Card borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconAlarm} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>AI 추천 정보 나타내기</span>
            </div>
            <div onClick={() => update({ aiRecommend: !data.aiRecommend })} style={{ width: 38, height: 18, borderRadius: 20, background: data.aiRecommend ? C.black : C.grayLine, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: data.aiRecommend ? 21 : 3, transition: "left .15s" }} />
            </div>
          </Card>
          <Card onClick={changeImage} borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconImage} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>이미지 바꾸기</span>
            </div>
            <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
          </Card>

          <div style={{ fontSize: 20, fontWeight: 700, color: C.black, margin: "20px 0 10px" }}>이용 안내</div>
          <Card onClick={() => navigate("/mypage/guide")} borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconMenu} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>이용 안내</span>
            </div>
            <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
          </Card>
          <Card onClick={() => navigate("/mypage/inquiry")} borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconChat} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>문의하기</span>
            </div>
            <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
          </Card>
          <Card onClick={logout} borderRadius={8} padding="10px 18px">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={iconLogout} alt="" style={{ width: 26, height: 26 }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>로그아웃</span>
            </div>
            <img src={rightSmall} alt="" style={{ width: 8, height: "auto" }} />
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  );
}