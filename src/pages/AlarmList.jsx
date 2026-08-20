import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { fmtTime } from "../utils/format";
import { toTodayDate } from "../utils/alarmStatus";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import { deleteMedicationAlarm, deleteExerciseAlarm, deleteCustomAlarm } from "../api/alarms";

import medicineIconWhiteSmall from "../assets/medicine_icon_white_small.png";
import gymIconWhiteSmall from "../assets/gym_icon_white_small.png";
import clockIconWhiteSmall from "../assets/clock_icon_white_small.png";

const LIST_ICON = {
  med: medicineIconWhiteSmall,
  exercise: gymIconWhiteSmall,
  other: clockIconWhiteSmall,
};

const LABEL = {
  med: "약",
  exercise: "운동",
  other: "기타",
};

const DELETE_FN = {
  med: deleteMedicationAlarm,
  exercise: deleteExerciseAlarm,
  other: deleteCustomAlarm,
};

export default function AlarmList() {
  const navigate = useNavigate();

  const {
    data,
    setData,
    setWip,
    setOnboarding,
  } = useApp();

  const scrollId = React.useId().replace(/:/g, "");
  const [deletingKey, setDeletingKey] = useState(null);

  /*
   * 알람 삭제 — 서버에 실제로 지운 뒤에 로컬 목록에서도 지움
   */
  const removeTime = async (category, time, key) => {
    if (deletingKey) return;

    if (time.serverId) {
      setDeletingKey(key);
      try {
        await DELETE_FN[category.type](time.serverId);
      } catch (e) {
        alert(e.message || "삭제에 실패했어요.");
        setDeletingKey(null);
        return;
      }
      setDeletingKey(null);
    }

    setData((d) => ({
      ...d,

      categories: d.categories.map((cc) =>
        cc.id === category.id
          ? {
              ...cc,
              times: cc.times.filter(
                (x) => x.id !== time.id
              ),
            }
          : cc
      ),
    }));
  };

  /*
   * 알람 수정
   *
   * 기존 category 전체와
   * 어떤 time을 수정하는지를 wip에 저장
   */
  const editEntry = (category, time) => {
    setOnboarding(false);

    setWip({
      ...category,

      draftTime: {
        hour: time.hour,
        minute: time.minute,
        ampm: time.ampm,
      },

      editingTimeId: time.id,
    });

    if (category.type === "med") {
      navigate("/onboarding/med-info");
    } else {
      navigate("/onboarding/time-single");
    }
  };

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

  /*
   * ------------------------------------------------------------
   * 등록된 모든 알람을 평탄화
   * ------------------------------------------------------------
   *
   * 기존:
   *
   * getTodaySchedule(data.categories)
   *
   * → 오늘 적용되는 알람만 표시
   *
   * 변경:
   *
   * data.categories
   *   → 모든 category
   *   → 모든 times
   *
   * 따라서 startDate가 내일인 알람도
   * "등록된 알람"이므로 목록에 표시됨.
   */
  const allAlarms = data.categories
    .flatMap((category) =>
      category.times.map((time) => ({
        key: `${category.id}-${time.id}`,
        category,
        time,
      }))
    )
    .sort((a, b) => toTodayDate(a.time) - toTodayDate(b.time)); // 시간순 정렬 — 서버에서 받아온 순서(등록 순서)와 무관하게 항상 시간순으로 보여줌

  return (
    <div
      style={{
        height: 890,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />

      {/* ========================================================
          스크롤 영역
          ======================================================== */}
      <div
        className={`vscroll-${scrollId}`}
        style={{
          flex: 1,
          minHeight: 0,
          padding: "40px 35px 0",
          overflowY: "auto",
        }}
      >
        <style>{`
          .vscroll-${scrollId} {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }

          .vscroll-${scrollId}:hover {
            scrollbar-color: ${C.grayLine} transparent;
          }

          .vscroll-${scrollId}::-webkit-scrollbar {
            width: 3px;
          }

          .vscroll-${scrollId}::-webkit-scrollbar-track {
            background: transparent;
          }

          .vscroll-${scrollId}::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 4px;
          }

          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb {
            background: ${C.grayLine};
          }
        `}</style>

        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 60,
          }}
        >
          알림 목록
        </div>

        {/* 등록된 알람이 하나도 없는 경우 */}
        {allAlarms.length === 0 && (
          <div
            style={{
              fontSize: 13,
              color: C.gray,
            }}
          >
            아직 등록된 알림이 없어요.
          </div>
        )}

        {/* ======================================================
            등록된 모든 알람
            ====================================================== */}
        {allAlarms.map(({ key, category, time }) => {
          return (
            <div
              key={key}
              style={{
                background: C.field,
                borderRadius: 5,
                minHeight: 70,
                boxSizing: "border-box",
                padding: "10px 12px",
                marginBottom: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <img
                  src={LIST_ICON[category.type]}
                  alt=""
                  style={{
                    width: 32,
                    height: 32,
                  }}
                />

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {LABEL[category.type]}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: C.black,
                    }}
                  >
                    {fmtTime(time)} · 진행 중
                  </div>

                  
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                }}
              >
                <button
                  style={btnStyle}
                  onClick={() =>
                    editEntry(category, time)
                  }
                >
                  수정
                </button>

                <button
                  onClick={() =>
                    removeTime(category, time, key)
                  }
                  disabled={deletingKey === key}
                  style={{ ...btnStyle, opacity: deletingKey === key ? 0.5 : 1 }}
                >
                  {deletingKey === key ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          확인 버튼
          ======================================================== */}
      <div
        style={{
          padding: "14px 35px 20px",
          background: C.bg,
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 170 }}>
          <Btn
            onClick={() => navigate(-1)}
            padding="10px 14px"
          >
            확인
          </Btn>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}