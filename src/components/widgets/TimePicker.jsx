import React, { useState } from "react";
import { C } from "../../styles/tokens";

const pad2 = (n) => String(n).padStart(2, "0");

export function TimePicker({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const [hourFocused, setHourFocused] = useState(false);
  const [minuteFocused, setMinuteFocused] = useState(false);

  const handleHourChange = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(-2);
    if (digits === "") return set("hour", 0); // 입력 중 빈 값은 임시로만 허용
    set("hour", Math.min(12, Number(digits)));
  };

  const handleHourBlur = () => {
    setHourFocused(false);
    if (!value.hour || value.hour < 1) set("hour", 1); // 12시간제: 0시는 없음, 포커스 벗어나면 최소 1로 보정
  };

  const handleMinuteChange = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(-2);
    if (digits === "") return set("minute", 0);
    set("minute", Math.min(59, Number(digits)));
  };

  const boxStyle = (focused) => ({
    width: 130, height: 80, textAlign: "center", fontSize: 45, fontWeight: 500, borderRadius: 10,
    border: focused ? `2px solid ${C.black}` : "2px solid transparent",
    background: C.field, color: C.black, outline: "none", boxSizing: "border-box",
  });

  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>알람 설정</div>
      <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, paddingLeft: 12, fontWeight: 500 }}>
        알려드릴 시간을 설정해 주세요
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", margin: "150px 0 100px" }}>
        <div>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            value={pad2(value.hour)}
            onChange={handleHourChange}
            onFocus={() => setHourFocused(true)}
            onBlur={handleHourBlur}
            style={boxStyle(hourFocused)}
          />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6, textAlign: "left" }}>시간</div>
        </div>

        <div style={{ width: 36, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, color: C.black }}>
          :
        </div>

        <div style={{ marginRight: 8 }}>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            value={pad2(value.minute)}
            onChange={handleMinuteChange}
            onFocus={() => setMinuteFocused(true)}
            onBlur={() => setMinuteFocused(false)}
            style={boxStyle(minuteFocused)}
          />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6, textAlign: "left" }}>분</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${C.black}`, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          {["오전", "오후"].map((ap) => (
            <button key={ap} onClick={() => set("ampm", ap)}
              style={{ padding: "11px 13px", border: "none", cursor: "pointer",
                background: value.ampm === ap ? C.black : "#fff", color: value.ampm === ap ? "#fff" : C.black, fontSize: 12, fontWeight: 500 }}>
              {ap}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}