import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Sub } from "../components/common/BackHeader";
import { Btn, Field } from "../components/common/Controls";

export default function Login() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "24px 24px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>로그인</div>
        <Sub>서비스를 이용하기 위해<br />로그인해 주세요</Sub>
        <Field label="아이디" placeholder="BloomFrame@email.com" />
        <Field label="비밀번호" type="password" placeholder="••••••••" />
        <div style={{ marginTop: 40 }}>
          <Btn onClick={() => navigate("/home")}>확인</Btn>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: C.gray }}>
          계정이 없으신가요?{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer", color: C.black }} onClick={() => navigate("/signup/type")}>회원가입</span>
        </div>
      </div>
    </>
  );
}
