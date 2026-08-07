import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, User, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BackHeader, Sub } from "../components/common/BackHeader";
import { Btn, Card } from "../components/common/Controls";

export default function SignupType() {
  const navigate = useNavigate();
  const { data, update } = useApp();

  return (
    <div style={{ flex: 1, padding: "0 24px 24px" }}>
      <BackHeader onBack={() => navigate("/")} progress={20} />
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>누가 사용하시나요?</div>
      <Sub>이 앱을 대리인이 사용하는지,<br />시니어 본인이 사용하는지 선택해주세요</Sub>
      {[
        { key: "self", label: "본인", desc: "시니어 본인이 직접 사용해요", icon: User },
        { key: "guardian", label: "대리인", desc: "자녀 · 보호자가 사용해요", icon: Users },
      ].map((o) => (
        <Card key={o.key} active={data.userType === o.key} onClick={() => update({ userType: o.key })}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: data.userType === o.key ? "rgba(255,255,255,.25)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <o.icon size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{o.label}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{o.desc}</div>
            </div>
          </div>
          <ChevronRight size={18} />
        </Card>
      ))}
      <div style={{ marginTop: 24 }}>
        <Btn disabled={!data.userType} onClick={() => navigate("/signup/info")}>다음</Btn>
      </div>
    </div>
  );
}
