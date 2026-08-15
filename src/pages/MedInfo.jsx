import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import medicineIconBlack from "../assets/medicine_icon_black.png";

export default function MedInfo() {
  const navigate = useNavigate();
  const { onboarding, wip, setWip } = useApp();
  const scrollId = React.useId().replace(/:/g, "");

  if (!wip) return null;

  const goEdit = (medId) => {
    setWip((w) => ({ ...w, editingMedId: medId }));
    navigate("/onboarding/med-edit");
  };

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      {/* 스크롤 영역: 헤더+리스트만. 확인 버튼 자리는 절대 침범 안 함 */}
      <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, padding: "0 30px", overflowY: "auto", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>
        <BackHeader progress={onboarding ? 75 : undefined} />
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 10, paddingLeft: 12 }}>약 정보</div>
        <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 28, paddingLeft: 12, fontWeight: 500, paddingBottom: 15 }}>
          AI가 인식한 약 정보에요<br />확인 후 필요하면 수정해 주세요
        </div>

        {wip.meds.map((m) => (
          <div
            key={m.id}
            style={{
              background: C.bg, border: "1px solid #000000", borderRadius: 10,
              height: 95, boxSizing: "border-box", padding: "25px 15px 25px 28px",
              marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={medicineIconBlack} alt="" style={{ width: 50, height: 50, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.black }}>{m.name}</div>
                <div style={{ fontSize: 12.5, color: C.black, marginTop: 2 }}>1일 {m.freq}회 · {m.timing}</div>
              </div>
            </div>
            <button onClick={() => goEdit(m.id)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 11, fontWeight: 400, cursor: "pointer" }}>
              수정
            </button>
          </div>
        ))}

        <button
          onClick={() => goEdit(null)}
          style={{ width: "100%", padding: "14px", borderRadius: 22, border: `1.5px dashed ${C.black}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}
        >
          + 약 추가하기
        </button>
      </div>

      {/* 확인 버튼 — 스크롤 영역 밖, 불투명한 고정 자리 */}
      <div style={{ padding: "14px 30px 40px", background: C.bg, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170 }}>
          <Btn onClick={() => navigate("/onboarding/time-list")} padding="10px 14px">확인</Btn>
        </div>
      </div>
    </div>
  );
}