import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn, Field } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import { BottomButton } from "../components/common/BottomButton";
import { login } from "../api/auth";
import backIcon from "../assets/back_icon.png";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id.trim() || !pw.trim()) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email: id.trim(), password: pw });
      navigate("/home");
    } catch (e) {
      setError(e.message || "로그인에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "30px 28px 0" }}>
        <button
          onClick={() => navigate("/")}
          style={{ width: 33, height: 33, border: "none", background: "none", padding: 0, marginBottom: 18, cursor: "pointer" }}
        >
          <img src={backIcon} alt="뒤로가기" style={{ width: 33, height: 33 }} />
        </button>
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
          <Btn disabled={loading} onClick={handleLogin} padding="10px 14px">{loading ? "확인 중..." : "확인"}</Btn>
        </BottomButton>
      </div>
      <BottomNav interactive={false} />
    </>
  );
}