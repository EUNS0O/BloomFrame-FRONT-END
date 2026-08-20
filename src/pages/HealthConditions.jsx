import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BottomNav } from "../components/common/BottomNav";
import {
  createHealthCondition,
  deleteHealthCondition,
  getHealthConditions,
} from "../api/healthConditions";
import iconHealth from "../assets/small_health.png";

const PRESETS = ["고혈압", "당뇨", "고지혈증", "관절염", "심장질환"];

const btnStyle = {
  padding: "5px 12px",
  borderRadius: 20,
  border: "none",
  background: C.black,
  color: "#fff",
  fontSize: 11,
  fontWeight: 400,
  cursor: "pointer",
};

export default function HealthConditions() {
  const navigate = useNavigate();
  const scrollId = React.useId().replace(/:/g, "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyName, setBusyName] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await getHealthConditions();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e.status === 401) {
        navigate("/login");
        return;
      }
      setError(e.message || "건강 상태를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const names = items.map((item) => item.conditionName);

  const addPreset = async (name) => {
    if (names.includes(name) || busyName) return;
    setBusyName(name);
    setError("");
    try {
      const created = await createHealthCondition(name);
      setItems((prev) => [...prev, created]);
    } catch (e) {
      if (e.status === 401) {
        navigate("/login");
        return;
      }
      setError(e.message || "추가하지 못했어요.");
    } finally {
      setBusyName("");
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await deleteHealthCondition(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      if (e.status === 401) {
        navigate("/login");
        return;
      }
      setError(e.message || "삭제하지 못했어요.");
    }
  };

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      <TopBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "40px 35px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>건강 상태 업데이트</div>
          <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6, fontWeight: 500, marginBottom: 20 }}>
            등록된 건강 상태를 확인하고 수정할 수 있어요
          </div>
        </div>

        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>

        <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 35px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            {PRESETS.map((name) => {
              const selected = names.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  disabled={selected || busyName === name}
                  onClick={() => addPreset(name)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 20,
                    border: "none",
                    background: selected ? C.black : "#E8E8E8",
                    color: selected ? "#fff" : C.black,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: selected ? "default" : "pointer",
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {error && <div style={{ fontSize: 13, color: C.orange, marginBottom: 12 }}>{error}</div>}
          {loading && <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>불러오는 중...</div>}
          {!loading && items.length === 0 && (
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>등록된 건강 상태가 없어요.</div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: C.bg,
                border: "1px solid #000000",
                borderRadius: 10,
                boxSizing: "border-box",
                padding: "20px 15px 20px 20px",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <img src={iconHealth} alt="" style={{ width: 40, height: 40, flexShrink: 0 }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: C.black }}>{item.conditionName}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() =>
                    navigate("/mypage/health/edit", {
                      state: { id: item.id, conditionName: item.conditionName },
                    })
                  }
                >
                  수정
                </button>
                <button type="button" style={btnStyle} onClick={() => remove(item.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "10px 35px 50px" }}>
          <button
            onClick={() => navigate("/mypage/health/new")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 22,
              border: `1.5px dashed ${C.black}`,
              background: "none",
              color: C.black,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + 건강 상태 추가하기
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
