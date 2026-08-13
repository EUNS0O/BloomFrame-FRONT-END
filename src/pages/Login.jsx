import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn, Field } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import { BottomButton } from "../components/common/BottomButton";

export default function Login() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "30px 28px 0" }}>
        <div style={{ fontSize: 29, fontWeight: 800, color: C.black }}>로그인</div>
        <div style={{ fontSize: 17, color: C.linkGray, lineHeight: 1.5, marginTop: 10, marginBottom: 20 }}>
          서비스를 이용하기 위해<br />로그인해 주세요
        </div>
        
        <Field
          label="아이디" placeholder="BloomFrame@email.com"
          textColor={C.black} placeholderColor={C.linkGray}
          bg={C.bg}
          width="95%"
        />
        <Field
          label="비밀번호" type="password" placeholder="••••••••"
          textColor={C.black} placeholderColor={C.linkGray}
          bg={C.bg}
          width="95%"
        />

        <BottomButton variant="high">
          <Btn onClick={() => navigate("/home")} padding="10px 14px">확인</Btn>
        </BottomButton>
      </div>
      <BottomNav interactive={false} />
    </>
  );
}