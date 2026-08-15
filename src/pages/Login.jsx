import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn, Field } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import { BottomButton } from "../components/common/BottomButton";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!id.trim() || !pw.trim()) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    // 실제 인증은 백엔드 연동 후 여기서 처리 (지금은 입력만 확인하고 통과)
    setError("");
    navigate("/home");
  };

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
          value={id} onChange={(e) => setId(e.target.value)}
          textColor={C.black} placeholderColor={C.linkGray}
          bg={C.bg}
          width="95%"
        />
        <Field
          label="비밀번호" type="password" placeholder="••••••••"
          value={pw} onChange={(e) => setPw(e.target.value)}
          textColor={C.black} placeholderColor={C.linkGray}
          bg={C.bg}
          width="95%"
        />
        {error && <div style={{ fontSize: 12.5, color: "#E5484D", marginTop: 6 }}>{error}</div>}

        <BottomButton variant="high">
          <Btn onClick={handleLogin} padding="10px 14px">확인</Btn>
        </BottomButton>
      </div>
      <BottomNav interactive={false} />
    </>
  );
}