import React from "react";
import { C } from "../../styles/tokens";
import { Sub } from "../common/BackHeader";
import { Btn } from "../common/Controls";

export function TimePicker({ value, onChange, onConfirm }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알람 설정</div>
      <Sub>알려드릴 시간을 설정해 주세요</Sub>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "48px 0 80px" }}>
        <div style={{ textAlign: "center" }}>
          <input
            type="number" min={1} max={12} value={value.hour}
            onChange={(e) => set("hour", Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
            style={{ width: 88, textAlign: "center", fontSize: 34, fontWeight: 800, padding: "18px 0", borderRadius: 14, border: "none", background: C.field, color: C.black }}
          />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>시간</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.black }}>:</div>
        <div style={{ textAlign: "center" }}>
          <input
            type="number" min={0} max={59} value={value.minute}
            onChange={(e) => set("minute", Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
            style={{ width: 88, textAlign: "center", fontSize: 34, fontWeight: 800, padding: "18px 0", borderRadius: 14, border: "none", background: C.field, color: C.black }}
          />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>분</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 4 }}>
          {["오전", "오후"].map((ap) => (
            <button key={ap} onClick={() => set("ampm", ap)}
              style={{ padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                background: value.ampm === ap ? C.black : C.field, color: value.ampm === ap ? "#fff" : C.black, fontSize: 13, fontWeight: 700 }}>
              {ap}
            </button>
          ))}
        </div>
      </div>
      <Btn onClick={onConfirm}>확인</Btn>
    </div>
  );
}
