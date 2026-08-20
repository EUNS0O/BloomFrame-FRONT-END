import React, { useEffect, useState } from "react";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BottomNav } from "../components/common/BottomNav";
import healthIcon from "../assets/solar_health-linear.png";

import {
    getHealthConditions,
    createHealthCondition,
    updateHealthCondition,
    deleteHealthCondition,
} from "../api/healthConditions";

export default function HealthCondition() {
    const [conditionName, setConditionName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const scrollId = React.useId().replace(/:/g, "");

    // 건강 상태 목록 조회
    const loadConditions = async () => {
        try {
            const data = await getHealthConditions();
            setConditions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("건강 상태 조회 실패:", error);
        }
    };

    // 페이지 진입 시 기존 건강 상태 조회
    useEffect(() => {
        loadConditions();
    }, []);

    // 추가 / 수정
    const handleConfirm = async () => {
        const value = conditionName.trim();

        if (!value || loading) return;

        try {
            setLoading(true);

            if (editingId !== null) {
                await updateHealthCondition(editingId, value);
                setEditingId(null);
            } else {
                await createHealthCondition(value);
            }

            setConditionName("");

            // 서버 데이터 다시 조회
            await loadConditions();
        } catch (error) {
            console.error("건강 상태 저장 실패:", error);
            alert(error.message || "건강 상태 저장에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 수정 버튼
    const handleEdit = (condition) => {
        setConditionName(condition.conditionName);
        setEditingId(condition.id);
    };

    // 삭제 버튼
    const handleDelete = async (id) => {
        if (loading) return;

        try {
            setLoading(true);

            await deleteHealthCondition(id);

            if (editingId === id) {
                setEditingId(null);
                setConditionName("");
            }

            // 서버 데이터 다시 조회
            await loadConditions();
        } catch (error) {
            console.error("건강 상태 삭제 실패:", error);
            alert(error.message || "건강 상태 삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopBar />

            <style>{`
        .health-scroll-${scrollId} {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .health-scroll-${scrollId}:hover {
          scrollbar-color: ${C.grayLine} transparent;
        }

        .health-scroll-${scrollId}::-webkit-scrollbar {
          width: 3px;
        }

        .health-scroll-${scrollId}::-webkit-scrollbar-track {
          background: transparent;
        }

        .health-scroll-${scrollId}::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }

        .health-scroll-${scrollId}:hover::-webkit-scrollbar-thumb {
          background: ${C.grayLine};
        }
      `}</style>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "0 35px",
                        boxSizing: "border-box",
                        flexShrink: 0,
                    }}
                >
                    {/* 제목 */}
                    <div
                        style={{
                            fontSize: 30,
                            fontWeight: 800,
                            marginTop: 40,
                            marginBottom: 10,
                        }}
                    >
                        건강 상태 업데이트
                    </div>

                    {/* 설명 */}
                    <div
                        style={{
                            fontSize: 18,
                            color: C.gray,
                            lineHeight: 1.45,
                            fontWeight: 500,
                            marginBottom: 43,
                        }}
                    >
                        더 많은 정보를 전달해드리기 위해
                        <br />
                        정확한 병명을 입력해 주세요
                    </div>

                    {/* 입력창 */}
                    <input
                        value={conditionName}
                        onChange={(e) => setConditionName(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleConfirm();
                            }
                        }}
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: 46,
                            boxSizing: "border-box",
                            padding: "0 14px",
                            borderRadius: 5,
                            border: `1px solid ${
                                isFocused ? C.black : C.grayLine
                            }`,
                            background: C.bg,
                            fontSize: 15,
                            outline: "none",
                        }}
                    />

                    {/* 확인 버튼 */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 76,
                        }}
                    >
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            style={{
                                width: 202,
                                height: 43,
                                borderRadius: 5,
                                border: "none",
                                background: C.black,
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: 400,
                                cursor: loading ? "default" : "pointer",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {editingId !== null ? "수정 완료" : "확인"}
                        </button>
                    </div>

                    {/* 건강 상태가 있을 때만 표시 */}
                    {conditions.length > 0 && (
                        <div
                            style={{
                                marginTop: 90,
                                fontSize: 20,
                                fontWeight: 700,
                                color: C.black,
                                marginBottom: 10,
                            }}
                        >
                            현재 건강 상태
                        </div>
                    )}
                </div>

                {/* 건강 상태 목록 */}
                {conditions.length > 0 && (
                    <div
                        className={`health-scroll-${scrollId}`}
                        style={{
                            maxHeight: 230,
                            overflowY: "scroll",
                            flexShrink: 0,
                            marginBottom: 25,
                        }}
                    >
                        <div
                            style={{
                                marginLeft: 35,
                                width: "calc(100% - 67px)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                boxSizing: "border-box",
                            }}
                        >
                            {conditions.map((condition) => (
                                <div
                                    key={condition.id}
                                    style={{
                                        width: "100%",
                                        height: 70,
                                        minHeight: 70,
                                        boxSizing: "border-box",
                                        padding: "0 13px",
                                        borderRadius: 5,
                                        background: "#E8E8E8",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexShrink: 0,
                                    }}
                                >
                                    {/* 아이콘 + 병명 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                background: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img
                                                src={healthIcon}
                                                alt=""
                                                style={{
                                                    width: 17,
                                                    height: 17,
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>

                                        <span
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: C.black,
                                            }}
                                        >
                      {condition.conditionName}
                    </span>
                                    </div>

                                    {/* 수정 / 삭제 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <button
                                            onClick={() => handleEdit(condition)}
                                            disabled={loading}
                                            style={actionBtnStyle}
                                        >
                                            수정
                                        </button>

                                        <button
                                            onClick={() => handleDelete(condition.id)}
                                            disabled={loading}
                                            style={actionBtnStyle}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </>
    );
}

const actionBtnStyle = {
    padding: "5px 12px",
    borderRadius: 20,
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: 11,
    fontWeight: 400,
    cursor: "pointer",
};