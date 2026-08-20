import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { Btn, Field } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { BottomNav } from "../components/common/BottomNav";
import { createHealthCondition, updateHealthCondition } from "../api/healthConditions";

export default function HealthConditionEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.pathname.endsWith("/edit");
  const existing = location.state || {};

  const [name, setName] = useState(existing.conditionName || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing && !existing.id) {
      navigate("/mypage/health", { replace: true });
    }
  }, [editing, existing.id, navigate]);

  if (editing && !existing.id) return null;

  const handleConfirm = async () => {
    const conditionName = name.trim();
    if (!conditionName || saving) return;
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateHealthCondition(existing.id, conditionName);
      } else {
        await createHealthCondition(conditionName);
      }
      navigate("/mypage/health");
    } catch (e) {
      if (e.status === 401) {
        navigate("/login");
        return;
      }
      setError(e.message || "저장하지 못했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopBar />
      <div style={{ flex: 1, padding: "40px 35px 100px", overflowY: "auto" }}>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          {editing ? "건강 상태 수정" : "건강 상태 추가"}
        </div>
        <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
          {editing ? "건강 상태 이름을 수정해 주세요" : "가지고 있는 건강 상태를 입력해 주세요"}
        </div>

        <Field
          label="건강 상태"
          placeholder="예: 고혈압"
          value={name}
          onChange={(e) => setName(e.target.value)}
          bg={C.bg}
          marginBottom={16}
          placeholderColor={C.gray}
        />
        {error && <div style={{ fontSize: 13, color: C.orange, marginBottom: 12 }}>{error}</div>}

        <BottomButton variant="high">
          <Btn onClick={handleConfirm} disabled={!name.trim() || saving} padding="10px 14px">
            {saving ? "저장 중..." : "확인"}
          </Btn>
        </BottomButton>
      </div>
      <BottomNav />
    </>
  );
}
