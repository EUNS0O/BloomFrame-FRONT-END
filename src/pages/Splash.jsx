import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";

export default function Splash() {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, background: C.black, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0 0 40px" }}>
      <div style={{ flex: 1 }} />
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 30, fontWeight: 800 }}>BloomFrame<span style={{ color: C.orange }}>+</span></div>
        <div style={{ fontSize: 13, color: "#C9C7C2", marginTop: 8 }}>예술로 피어나는 습관</div>
      </div>
      <div style={{ padding: "0 24px" }}>
        <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "#fff", color: C.black, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>로그인</button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#C9C7C2" }}>
          계정이 없으신가요?{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/signup/type")}>회원가입</span>
        </div>
      </div>
    </div>
  );
}
