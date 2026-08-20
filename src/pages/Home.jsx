import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { C } from "../styles/tokens";
import { getTodaySchedule, getAlarmStatus } from "../utils/alarmStatus";
import { saveTodayRecord } from "../utils/historyStore";
import { loadCategoriesFromServer, loadVerificationsFromServer } from "../api/sync";
import { getMe } from "../api/auth";
import { TopBar } from "../components/common/Layout";
import { Card } from "../components/common/Controls";
import { BottomNav } from "../components/common/BottomNav";

import medicineIconGreen from "../assets/medicine_icon_green.webp";
import medicineIconRed from "../assets/medicine_icon_red.webp";
import medicineIconSmall from "../assets/medicine_icon_small.webp";
import gymIconSmall from "../assets/gym_icon_small.webp";
import clockIconSmall from "../assets/clock_icon_small.webp";
import gymIconGreen from "../assets/gym_icon_green.webp";
import gymIconRed from "../assets/gym_icon_red.webp";
import clockIconGreen from "../assets/clock_icon_green.webp";
import clockIconRed from "../assets/clock_icon_red.webp";
import medicineIconWhiteSmall from "../assets/medicine_icon_white_small.png";
import gymIconWhiteSmall from "../assets/gym_icon_white_small.png";
import clockIconWhiteSmall from "../assets/clock_icon_white_small.png";
import rightSmall from "../assets/right_small.png";


const PENDING_ICON = {
  med: medicineIconSmall,
  exercise: gymIconSmall,
  other: clockIconSmall,
};

const SUCCESS_ICON = {
  med: medicineIconGreen,
  exercise: gymIconGreen,
  other: clockIconGreen,
};

const MISSED_ICON = {
  med: medicineIconRed,
  exercise: gymIconRed,
  other: clockIconRed,
};

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

export default function Home() {
  const navigate = useNavigate();
  const { data, setData, update, setOnboarding, setWip } = useApp();

  const scrollId = React.useId().replace(/:/g, "");

  const [now, setNow] = useState(new Date());
  const [uid, setUid] = useState(null);
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]); 


  useEffect(() => {
    getMe()
      .then((me) => setUid(me.uid))
      .catch((e) => console.error("[Home] 내 정보 조회 실패:", e));
  }, []);

   useEffect(() => {
    let categoryInFlight = false;
    let verificationInFlight = false;
    const syncCategories = () => {
      if (categoryInFlight) return;
      categoryInFlight = true;
      loadCategoriesFromServer(dataRef.current.categories)
        .then((categories) => setData((d) => ({ ...d, categories })))
        .catch((e) => console.error("[Home] 알림 목록 조회 실패:", e))
        .finally(() => { categoryInFlight = false; });
    };

    const syncVerifications = () => {
      if (uid && !verificationInFlight) {
        verificationInFlight = true;
        loadVerificationsFromServer(uid)
          .then((verifications) => update({ verifications: { ...dataRef.current.verifications, ...verifications } }))
          .catch((e) => console.error("[Home] 인증 기록 조회 실패:", e))
          .finally(() => { verificationInFlight = false; });
      }
    };

    let categoryIntervalId = null;
    let verificationIntervalId = null;
    const startPolling = () => {
      if (categoryIntervalId || verificationIntervalId) return;
      syncCategories();
      syncVerifications();
      categoryIntervalId = setInterval(syncCategories, 45 * 1000);
      verificationIntervalId = setInterval(syncVerifications, 5 * 1000);
    };
    const stopPolling = () => {
      if (categoryIntervalId) clearInterval(categoryIntervalId);
      if (verificationIntervalId) clearInterval(verificationIntervalId);
      categoryIntervalId = null;
      verificationIntervalId = null;
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") startPolling();
      else stopPolling();
    };

    if (document.visibilityState === "visible") startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    
  }, [uid]);

  
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const startAddAlarm = () => {
    setOnboarding(false);
    setWip(null);
    navigate("/onboarding/category");
  };

  
  const grouped = [];

  data.categories.forEach((c) => {
    const existing = grouped.find((g) => g.type === c.type);

    if (existing) {
      existing.count += c.times.length;
    } else {
      grouped.push({
        type: c.type,
        count: c.times.length,
      });
    }
  });

  
  const todaySchedule = getTodaySchedule(data.categories);

  
  const iconData = todaySchedule.map((entry) => ({
    type: entry.label,
    status: getAlarmStatus(
      entry,
      data.verifications,
      now
    ),
  }));

  
  useEffect(() => {
    if (iconData.length > 0) {
      saveTodayRecord(iconData);
    }
  }, [JSON.stringify(iconData)]);

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
        <div style={{ padding: "40px 35px 0" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 48,
            }}
          >
            홈
          </div>

          {/* =====================================================
              오늘의 알림 기록
              ===================================================== */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            알림 기록
          </div>

          {/* 아이콘이 많아지면 가로 스크롤 */}
          <style>{`
            .hscroll-${scrollId} {
              scrollbar-width: thin;
              scrollbar-color: transparent transparent;
            }

            .hscroll-${scrollId}:hover {
              scrollbar-color: ${C.grayLine} transparent;
            }

            .hscroll-${scrollId}::-webkit-scrollbar {
              height: 3px;
            }

            .hscroll-${scrollId}::-webkit-scrollbar-track {
              background: transparent;
            }

            .hscroll-${scrollId}::-webkit-scrollbar-thumb {
              background: transparent;
              border-radius: 4px;
            }

            .hscroll-${scrollId}:hover::-webkit-scrollbar-thumb {
              background: ${C.grayLine};
            }
          `}</style>

          <div
            className={`hscroll-${scrollId}`}
            style={{
              overflowX: "auto",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 42,
                marginLeft: 22,
                width: "max-content",
              }}
            >
              {iconData.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 40,
                    right: 40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: 1,
                    background: C.grayLine,
                    zIndex: 0,
                  }}
                />
              )}

              {iconData.map((d, i) => {
                let icon;

                if (d.status === "success") {
                  icon =
                    SUCCESS_ICON[d.type] ||
                    SUCCESS_ICON.other;
                } else if (d.status === "missed") {
                  icon =
                    MISSED_ICON[d.type] ||
                    MISSED_ICON.other;
                } else {
                  icon =
                    PENDING_ICON[d.type] ||
                    PENDING_ICON.other;
                }

                return (
                  <img
                    key={i}
                    src={icon}
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      position: "relative",
                      zIndex: 1,
                      display: "block",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              color: C.gray,
              cursor: "pointer",
              marginBottom: 65,
            }}
            onClick={() => navigate("/home/history")}
          >
            이전 기록 보기 &gt;
          </div>

          {/* =====================================================
              등록된 전체 알림 목록
              ===================================================== */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            알림 목록
          </div>
        </div>

        {/* 알림 목록만 내부 스크롤 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 35px",
          }}
        >
          {grouped.length === 0 && (
            <div
              style={{
                fontSize: 13,
                color: C.gray,
                marginBottom: 16,
              }}
            >
              아직 등록된 알림이 없어요.
            </div>
          )}

          {grouped.map((g) => (
            <Card
              key={g.type}
              onClick={() => navigate("/home/alarms")}
              borderRadius={6}
              padding="11px 11px"
              width="99%"
              marginBottom={6}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img
                  src={LIST_ICON[g.type]}
                  alt=""
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 2,
                    }}
                  >
                    {LABEL[g.type]}
                  </div>

                  {/* 등록된 전체 알람 개수 */}
                  <div
                    style={{
                      fontSize: 12,
                      color: C.black,
                    }}
                  >
                    알림 {g.count}건 · 진행 중
                  </div>
                </div>
              </div>

              <img
                src={rightSmall}
                alt=""
                style={{
                  width: 8,
                  height: "auto",
                }}
              />
            </Card>
          ))}
        </div>

        {/* 알람 추가하기 버튼 */}
        <div
          style={{
            padding: "10px 30px 50px",
          }}
        >
          <button
            onClick={startAddAlarm}
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
            + 알람 추가하기
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
