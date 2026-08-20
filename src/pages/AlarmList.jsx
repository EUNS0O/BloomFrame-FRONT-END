import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { fmtTime } from "../utils/format";
import { TopBar } from "../components/common/Layout";
import { Btn } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";
import { deleteAlarmOnServer } from "../api/scheduleSync";

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

export default function AlarmList() {
  const navigate = useNavigate();

  const {
    data,
    setData,
    setWip,
    setOnboarding,
  } = useApp();

  const scrollId = React.useId().replace(/:/g, "");

  /*
   * 알람 삭제
   */
  const removeTime = async (category, time) => {
    try {
      await deleteAlarmOnServer(category.type, time);
    } catch (e) {
      console.error(e);
      return;
    }
    setData((d) => ({
      ...d,
      categories: d.categories.map((cc) =>
        cc.id === category.id
          ? {
              ...cc,
              times: cc.times.filter((x) => x.id !== time.id),
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
  console.log(
  "현재 categories:",
  JSON.stringify(data.categories, null, 2)
);
  const allAlarms = (data.categories || []).flatMap((category) =>
    (category.times || []).map((time) => ({
      key: `${category.id}-${time.id}`,
      category,
      time,
    }))
  );

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
                    removeTime(category, time)
                  }
                  style={btnStyle}
                >
                  삭제
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