import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";

export default function Inquiry() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const send = () => {
    alert("문의가 접수되었습니다.");
    navigate(-1);
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "40px 35px 100px", overflowY: "auto" }}>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>문의하기</div>
        <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
          불편한 점이나 궁금한 점을 남겨주세요
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용을 입력해 주세요"
          rows={8}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px",
            borderRadius: 8,
            border: `1px solid ${C.black}`,
            background: "#fff",
            fontSize: 15,
            resize: "none",
            outline: "none",
          }}
        />

        <BottomButton variant="high">
          <Btn disabled={!text.trim()} onClick={send} padding="10px 14px">보내기</Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}