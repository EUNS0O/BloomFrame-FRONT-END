import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

export default function Inquiry() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "20px 24px" }}>
        <BackHeader />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>문의하기</div>
        <textarea
          placeholder="불편한 점이나 궁금한 점을 남겨주세요" rows={8}
          style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 14, border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 14, resize: "none", marginBottom: 16 }}
        />
        <Btn onClick={() => { alert("문의가 접수되었습니다."); navigate(-1); }}>보내기</Btn>
      </div>
      <BottomNav />
    </>
  );
}
