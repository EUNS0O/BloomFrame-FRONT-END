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

    const loadConditions = async () => {
        try {
            const data = await getHealthConditions();
            setConditions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("건강 상태 조회 실패:", error);
        }
    };

    useEffect(() => {
        loadConditions();
    }, []);

    const handleConfirm = async () => {
        const value = conditionName.trim();

        if (!value) return;

        try {
            if (editingId !== null) {
                await updateHealthCondition(editingId, value);
                setEditingId(null);
            } else {
                await createHealthCondition(value);
            }

            setConditionName("");
            await loadConditions();
        } catch (error) {
            console.error("건강 상태 저장 실패:", error);
            alert(error.message);
        }
    };

    const handleEdit = (condition) => {
        setConditionName(condition.conditionName);
        setEditingId(condition.id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteHealthCondition(id);

            if (editingId === id) {
                setEditingId(null);
                setConditionName("");
            }

            await loadConditions();
        } catch (error) {
            console.error("건강 상태 삭제 실패:", error);
            alert(error.message);
        }
    };

    return (
        <>
            <TopBar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                }}
            >
                <div
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "hidden",
                        padding: "0 30px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* 제목 */}
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            marginTop: 40,
                            marginBottom: 10,
                            paddingLeft: 12,
                        }}
                    >
                        건강 상태 업데이트
                    </div>

                    {/* 설명 */}
                    <div
                        style={{
                            fontSize: 15,
                            color: C.gray,
                            lineHeight: 1.6,
                            marginBottom: 28,
                            paddingLeft: 12,
                            fontWeight: 500,
                            paddingBottom: 15,
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
                            if (e.key === "Enter") handleConfirm();
                        }}
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
                            style={{
                                width: 202,
                                height: 43,
                                borderRadius: 5,
                                border: "none",
                                background: C.black,
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: 400,
                                cursor: "pointer",
                            }}
                        >
                            {editingId !== null ? "수정 완료" : "확인"}
                        </button>
                    </div>

                    {/* 건강 상태가 있을 때만 표시 */}
                    {conditions.length > 0 && (
                        <div style={{ marginTop: 110 }}>
                            <div
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: C.black,
                                    marginBottom: 10,
                                }}
                            >
                                현재 건강 상태
                            </div>

                            {/* 건강 상태 목록만 스크롤 */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    maxHeight: 230,
                                    overflowY: "auto",
                                    paddingRight: 3,
                                    boxSizing: "border-box",
                                    scrollbarGutter: "stable",
                                }}
                            >
                                {conditions.map((condition) => (
                                    <div
                                        key={condition.id}
                                        style={{
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
                                            {/* 흰색 원 */}
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
                                                style={actionBtnStyle}
                                            >
                                                수정
                                            </button>

                                            <button
                                                onClick={() => handleDelete(condition.id)}
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