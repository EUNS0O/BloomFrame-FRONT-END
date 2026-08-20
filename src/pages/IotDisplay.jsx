import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTodaySchedule, getAlarmStatus } from "../utils/alarmStatus";
import { getMe } from "../api/auth";
import { findReminderId, touchAuth } from "../api/reminders";
import { getLatestNewsletter } from "../api/newsletter";
import { loadCategoriesFromServer, loadVerificationsFromServer } from "../api/sync";
import bgIdle from "../assets/iot/bg_idle.webp";
import bgAlarm from "../assets/iot/bg_alarm.webp";
import bgChange from "../assets/iot/bg_change.mp4";
import posterBloom from "../assets/iot/poster_blooming.png";
import posterWilt from "../assets/iot/poster_wilted.png";
import medicineYellow from "../assets/iot/medicine_yellow.png";
import medicineGreen from "../assets/iot/medicine_green.png";
import medicineRed from "../assets/iot/medicine_red.png";
import gymBlue from "../assets/iot/gym_blue.png";
import gymGreen from "../assets/iot/gym_green.png";
import gymRed from "../assets/iot/gym_red.png";
import clockGray from "../assets/iot/clock_gray.png";
import clockGreen from "../assets/iot/clock_green.png";
import clockRed from "../assets/iot/clock_red.png";

// 식물 전환 애니메이션 — 영상 대신 프레임(webp) 연속 재생 방식
// (영상 버퍼링/디코딩 지연으로 인한 깜빡임을 원천 차단하기 위해, 미리 다 불러온 뒤 이미지만 빠르게 바꿔치기함)
const BLOOM_TO_WILT_FRAMES = Object.values(
  import.meta.glob("../assets/iot/frames/bloom_to_wilt/*.webp", { eager: true, import: "default" })
);
const WILT_TO_BLOOM_FRAMES = Object.values(
  import.meta.glob("../assets/iot/frames/wilt_to_bloom/*.webp", { eager: true, import: "default" })
);
const FRAME_INTERVAL_MS = 1000 / 20; // 20fps로 뽑아둔 프레임이라 그 속도에 맞춤

const Z = {
  bg: 0,
  clock: 1,
  plant: 2,
  cards: 3,
  newsletter: 4,
};

const PLANT_OFFSET_Y = -190;

// 식물을 화면 정중앙에서 위로 옮기는 값
// 음수 = 위로, 양수 = 아래로

const CARD_ICON = {
  med: {
    pending: medicineYellow,
    success: medicineGreen,
    missed: medicineRed,
  },
  exercise: {
    pending: gymBlue,
    success: gymGreen,
    missed: gymRed,
  },
  other: {
    pending: clockGray,
    success: clockGreen,
    missed: clockRed,
  },
};

const CARD_LABEL = {
  med: "약",
  exercise: "운동",
  other: "기타",
};

const STATE_STYLE = {
  pending_med: {
    bg: "#FFF2D7BF",
    accent: "#E0A82E",
  },
  pending_exercise: {
    bg: "#C8E8FF99",
    accent: "#4EA1E0",
  },
  pending_other: {
    bg: "#EAE7E2CC",
    accent: "#8A8A8A",
  },
  success: {
    bg: "#D6EFD3CC",
    accent: "#3CAE6B",
  },
  missed: {
    bg: "#FFD4D3CC",
    accent: "#E05353",
  },
};

const MOCK_NEWSLETTER = `안녕하세요 김인하님!
오늘도 보람찬 하루를 보내셨군요☺️

더 나다운, 아름다운 하루가
피어날 수 있도록 팁을 드리겠습니다✔️

💪 인하님을 더 건강하게 만들 핵심 영양소는 통곡물, 푸른 채소, 단백질입니다

오늘 메뉴📋는 현미 차조밥과 달걀 채소 말이, 소고기 장국, 깍두기
오늘 간식🍓은 두유와 딸기가 어떤가요?

🚨 하지만 주의할 점은
절대 과일을 갈아서 먹으면 안 됩니다!

오늘 하루의 화분도
아름다운 꽃으로 남길 바랄게요💐`;

const STAGE1_MS = 3 * 60 * 1000;
const STAGE2_MS = 10 * 60 * 1000;
const PRE_ALARM_MS = 10 * 1000; // 알람 10초 전부터 배경 미리 전환

// 배경이 알림 시각보다 몇 분 일찍 바뀔지
// 기본 5분 전

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatClock(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function formatDate(d) {
  return {
    md: `${d.getMonth() + 1}월 ${d.getDate()}일`,
    day: `${WEEKDAYS[d.getDay()]}요일`,
  };
}

export default function IotDisplay() {
  const { data, update } = useApp();
  const [searchParams] = useSearchParams();
  const scrollId = React.useId().replace(/:/g, "");

  // 마운트되자마자 전환 프레임 전부를 미리 "디코딩"까지 끝내둠 —
  // 파일만 받아두는 것과 달리, decode()까지 미리 해두면 실제 재생 중엔 화면에 그리기만 하면 돼서
  // 느린 기기에서 재생하다가 버벅이는(디코딩 지연) 걸 막을 수 있음
  useEffect(() => {
    [...BLOOM_TO_WILT_FRAMES, ...WILT_TO_BLOOM_FRAMES].forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) img.decode().catch(() => {}); // 디코딩 실패해도(구형 브라우저 등) 무시하고 넘어감
    });
  }, []);

  

  const testIn = searchParams.get("testIn");

  const cardsTest = searchParams.get("cardsTest") === "1";

  const stage1Ms =
    Number(searchParams.get("stage1")) > 0
      ? Number(searchParams.get("stage1")) * 1000
      : STAGE1_MS;

  const stage2Ms =
    Number(searchParams.get("stage2")) > 0
      ? Number(searchParams.get("stage2")) * 1000
      : STAGE2_MS;

  const preAlarmMs =
    searchParams.get("preAlarm") !== null && Number(searchParams.get("preAlarm")) >= 0
      ? Number(searchParams.get("preAlarm")) * 1000
      : PRE_ALARM_MS;

  // ?cardsTest=1 이면:
  // 약/운동 각각 "여유 있음(회색)"/"임박(빨강)"
  // + "성공(초록)"/"실패(빨강)" 카드를 즉시 생성
  const schedule = useMemo(() => {
    if (cardsTest) {
      const nowMs = Date.now();

      return [
        {
          key: "t-med-far",
          at: new Date(nowMs + 45 * 60000),
          label: "med",
        },
        {
          key: "t-med-soon",
          at: new Date(nowMs + 5 * 60000),
          label: "med",
        },
        {
          key: "t-ex-far",
          at: new Date(nowMs + 45 * 60000),
          label: "exercise",
        },
        {
          key: "t-ex-soon",
          at: new Date(nowMs + 5 * 60000),
          label: "exercise",
        },
        {
          key: "t-success",
          at: new Date(nowMs - 60 * 60000),
          label: "med",
        },
        {
          key: "t-missed",
          at: new Date(nowMs - 60 * 60000),
          label: "exercise",
        },
      ];
    }

    if (testIn != null) {
      return [
        {
          key: "test-alarm",
          at: new Date(Date.now() + Number(testIn) * 1000),
          label: "test",
        },
      ];
    }

    // 실제 알람은 alarmStatus.js의 공통 스케줄 계산 사용
    // startDate가 미래인 알람은 여기서 자동으로 제외됨
    return getTodaySchedule(data.categories);
  }, [data.categories, testIn, cardsTest]);

  const [plantState, setPlantState] = useState("BLOOMING");
  const [transition, setTransition] = useState(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false); // 첫 렌더링에선 배경 opacity 트랜지션을 꺼서, "바뀌려다 마는" 것처럼 보이는 걸 방지
  const rafIds = useRef([]);
  const [alarmPhase, setAlarmPhase] = useState(null);
  const [activeAlarmKey, setActiveAlarmKey] = useState(null);
  const [now, setNow] = useState(new Date());
  const [bgVideoPlaying, setBgVideoPlaying] = useState(false);
  const [bgAlarmActive, setBgAlarmActive] = useState(false);

  // 배경 전용
  // 알림 정각보다 preAlarmMs만큼 일찍 켜짐

  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState(null); // 실제 서버에서 받아온 뉴스레터 (없으면 안내 문구로 대체)
  const [uid, setUid] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // 태블릿(IoT 화면)은 마이페이지를 거쳐서 들어오는 게 아닐 수도 있어서, 여기서 따로 내 uid를 받아둠
  useEffect(() => {
    getMe()
      .then((me) => setUid(me.uid))
      .catch((e) => console.error("[IotDisplay] 내 정보 조회 실패:", e));
  }, []);

useEffect(() => {
  const sync = () => {
    loadCategoriesFromServer()
      .then((categories) => update({ categories }))
      .catch((e) => console.error("[IotDisplay] 알림 목록 조회 실패:", e));

    if (uid) {
      loadVerificationsFromServer(uid)
        .then((verifications) => update({ verifications: { ...data.verifications, ...verifications } }))
        .catch((e) => console.error("[IotDisplay] 인증 기록 조회 실패:", e));
    }
  };

  let intervalId = null;
  const startPolling = () => {
    if (intervalId) return;
    sync();
    intervalId = setInterval(sync, 45 * 1000);
  };
  const stopPolling = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [uid]);

  const resolvedKeys = useRef(new Set());
  const outcomes = useRef(new Map());
  const wasAlarmWindow = useRef(false);

  const isTestMode = testIn != null || cardsTest;

  // 실제 알람은 새로고침해도 안 잊어버리게, 매번 data.verifications + 지금 시각으로 다시 판정함
  // (테스트 모드는 verifications를 안 건드리는 가짜 키라 기존처럼 ref 기반 시뮬레이션 유지)
  const resolveEntry = (entry, nowMs) => {
    if (isTestMode) {
      return resolvedKeys.current.has(entry.key)
        ? outcomes.current.get(entry.key)
        : "pending";
    }
    return getAlarmStatus(entry, data.verifications, new Date(nowMs));
  };

  // cardsTest 모드:
  // "이미 지난" 카드 2개는 성공/실패 결과를 미리 심어둠
  useEffect(() => {
    if (cardsTest) {
      resolvedKeys.current.add("t-success");
      outcomes.current.set("t-success", "success");

      resolvedKeys.current.add("t-missed");
      outcomes.current.set("t-missed", "missed");
    }
  }, [cardsTest]);

  useEffect(() => {
    const tick = () => {
      setNow(new Date());

      const nowMs = Date.now();

      // 배경 전용:
      // 알림 정각보다 preAlarmMs만큼 일찍부터
      // stage2Ms 끝날 때까지 "임박" 상태
      const bgCurrent = schedule.find(
        (s) =>
          resolveEntry(s, nowMs) === "pending" &&
          nowMs >= s.at.getTime() - preAlarmMs &&
          nowMs < s.at.getTime() + stage2Ms
      );

      setBgAlarmActive(!!bgCurrent);

      // 꽃 시듦/카드 카운트다운은 기존대로 알림 "정각"부터 시작
      const current = schedule.find(
        (s) =>
          resolveEntry(s, nowMs) === "pending" &&
          nowMs >= s.at.getTime() &&
          nowMs < s.at.getTime() + stage2Ms
      );

      if (!current) {
        setAlarmPhase(null);
        setActiveAlarmKey(null);
        return;
      }

      const elapsed = nowMs - current.at.getTime();

      setActiveAlarmKey(current.key);

      if (elapsed <= stage1Ms) {
        setAlarmPhase(1);
      } else {
        setAlarmPhase((prev) => {
          if (prev !== 2 && plantState === "BLOOMING") {
            setTransition("toWilt");
          }

          return 2;
        });

        if (elapsed >= stage2Ms) {
          // 실제 알람은 시간이 지나면 getAlarmStatus가 자동으로 "missed"를 계산해주니 ref에 안 남겨도 됨.
          // 테스트 모드만 ref에 기록해서 시뮬레이션 유지.
          if (isTestMode) {
            resolvedKeys.current.add(current.key);
            outcomes.current.set(current.key, "missed");
          }

          setAlarmPhase(null);
          setActiveAlarmKey(null);
        }
      }
    };

    tick();

    // hasMounted를 tick()이랑 같은 타이밍에 켜면, "진짜 첫 값"이 반영되는 그 렌더링부터 이미 트랜지션이 걸려서
    // 오히려 그 첫 변화가 애니메이션으로 보여버림(=깜빡이는 것처럼). 최소 한 프레임 이상 늦춰서 켜야 함.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setHasMounted(true));
      rafIds.current.push(raf2);
    });
    rafIds.current.push(raf1);

    const id = setInterval(tick, 1000);

    return () => {
      clearInterval(id);
      rafIds.current.forEach((rid) => cancelAnimationFrame(rid));
      rafIds.current = [];
    };
  }, [
    schedule,
    plantState,
    stage1Ms,
    stage2Ms,
    preAlarmMs,
  ]);

  const handleTransitionEnd = () => {
    setPlantState(
      transition === "toWilt"
        ? "WILTED"
        : "BLOOMING"
    );

    setTransition(null);
  };

  const handleVerify = async () => {
    if (showNewsletter || verifying) return;

    if (!activeAlarmKey) return;

    // 테스트 모드(testIn/cardsTest)의 가짜 알람은 실제 서버 인증 API를 호출하지 않고 로컬에서만 처리
    const isTestAlarm = testIn || cardsTest || activeAlarmKey.startsWith("test-");

    if (!isTestAlarm) {
      setVerifying(true);
      try {
        const entry = schedule.find((s) => s.key === activeAlarmKey);
        const reminderId = entry ? await findReminderId(entry.serverId, entry.label) : null;

        if (!reminderId) {
          // 서버에 아직 이 시간에 대한 리마인더가 안 만들어졌거나(스케줄러 타이밍), 매칭 실패
          console.warn("[IotDisplay] 이 알람에 해당하는 reminderId를 서버에서 못 찾았어요.", entry);
        } else {
          await touchAuth(reminderId);
        }
      } catch (e) {
        console.error("[IotDisplay] 인증 실패:", e);
        setVerifying(false);
        return; // 서버 인증 실패했으면 로컬 상태도 "성공"으로 넘기지 않음
      }
      setVerifying(false);
    }

    resolvedKeys.current.add(activeAlarmKey);
    outcomes.current.set(activeAlarmKey, "success");

    // 테스트 모드(testIn/cardsTest)의 가짜 키는
    // 실제 데이터를 오염시키지 않게 공유 상태에 안 씀
    if (!testIn && !cardsTest) {
      update({
        verifications: {
          ...data.verifications,
          [activeAlarmKey]: "success",
        },
      });
    }

    setAlarmPhase(null);
    setActiveAlarmKey(null);

    if (plantState === "WILTED") {
      setTransition("toBloom");
    }

    // 실제 최신 뉴스레터를 받아와서 보여줌 (실패하면 null로 남아서, 화면에서 안내 문구로 대체됨)
    if (uid && !isTestAlarm) {
      getLatestNewsletter(uid)
        .then(setNewsletterContent)
        .catch((e) => console.error("[IotDisplay] 뉴스레터 조회 실패:", e));
    }

    setShowNewsletter(true);
  };

  const isAlarmWindow =
    alarmPhase === 1 || alarmPhase === 2;

  useEffect(() => {
    if (bgAlarmActive && !wasAlarmWindow.current) {
      // preAlarmMs 전,
      // 배경이 처음 바뀌는 순간에만 전환 영상 재생
      setBgVideoPlaying(true);
    }

    if (!bgAlarmActive) {
      setBgVideoPlaying(false);
    }

    wasAlarmWindow.current = bgAlarmActive;
  }, [bgAlarmActive]);

  const activeFrames =
    transition === "toWilt"
      ? BLOOM_TO_WILT_FRAMES
      : transition === "toBloom"
      ? WILT_TO_BLOOM_FRAMES
      : null;

  // 전환이 시작되면 0번 프레임부터, 일정 간격(FRAME_INTERVAL_MS)마다 다음 프레임으로 —
  // 이미 다 preload된 이미지 배열이라 재생 중 네트워크를 아예 안 탐(버퍼링 자체가 불가능한 구조)
  useEffect(() => {
    if (!activeFrames) return;
    setFrameIndex(0);
    const id = setInterval(() => {
      setFrameIndex((i) => {
        if (i + 1 >= activeFrames.length) {
          clearInterval(id);
          handleTransitionEnd();
          return i;
        }
        return i + 1;
      });
    }, FRAME_INTERVAL_MS);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transition]);

  const { md, day } = formatDate(now);

  const cards = schedule.map((s) => {
    const outcome = resolveEntry(s, now.getTime());
    const isResolved = outcome !== "pending";

    // "pending" | "success" | "missed"
    const status = isResolved
      ? outcome
      : `pending_${s.label}`;

    const style =
      STATE_STYLE[status] ||
      STATE_STYLE.pending_other;

    const iconSet =
      CARD_ICON[s.label] ||
      CARD_ICON.other;

    let subtext = null;
    let subtextColor = "#9A9993";

    // 카드 카운트다운은 각자 자기 시각 기준으로 독립적으로 뜸 (식물 상태만 activeAlarmKey 하나에 묶임)
    const isActiveAlarm =
      !isResolved &&
      now.getTime() >= s.at.getTime() &&
      now.getTime() < s.at.getTime() + stage2Ms;

    if (isActiveAlarm) {
      // 알림 시각부터 경과된 시간을
      // 00:00 → 10:00으로 증가시키며 표시
      const elapsedMs = Math.max(
        0,
        now.getTime() - s.at.getTime()
      );

      const elapsedSec = Math.min(
        Math.floor(elapsedMs / 1000),
        Math.floor(stage2Ms / 1000)
      );

      const mm = Math.floor(elapsedSec / 60);
      const ss = elapsedSec % 60;

      subtext = `${mm}:${String(ss).padStart(2, "0")}`;

      subtextColor =
        elapsedMs <= stage1Ms
          ? "#9A9993"
          : "#E5484D";
    }

    // 아직 알림 시각이 안 된 카드는
    // subtext를 계속 null로 둠

    return {
      key: s.key,
      label: CARD_LABEL[s.label] || "기타",
      timeText: `${String(
        s.at.getHours()
      ).padStart(2, "0")}:${String(
        s.at.getMinutes()
      ).padStart(2, "0")}`,
      iconSrc: iconSet[outcome],
      bg: style.bg,
      subtext,
      subtextColor,
    };
  });

  return (
    <div
      onClick={handleVerify}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#9FC3EC", // bgIdle 로딩 전 잠깐 보이는 기본색 — 검정 대신 파란 배경이랑 비슷한 톤으로 (덜 튀게)
        cursor: "pointer",
        fontFamily: "'NanumSquareRound', sans-serif",
      }}
    >
      <img
        src={bgIdle}
        alt=""
        fetchpriority="high"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgAlarmActive ? 0 : 1,
          transition: hasMounted ? "opacity 1.2s ease" : "none",
          zIndex: Z.bg,
        }}
      />

      <img
        src={bgAlarm}
        alt=""
        fetchpriority="high"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgAlarmActive ? 1 : 0,
          transition: hasMounted ? "opacity 1.2s ease" : "none",
          zIndex: Z.bg,
        }}
      />

      {/* 화면엔 안 보이지만, 마운트되자마자 미리 다운로드만 해두기 위한 숨김 배경 전환 영상 */}
      <video src={bgChange} preload="auto" muted playsInline style={{ display: "none" }} />

      {bgVideoPlaying && (
        <video
          src={bgChange}
          autoPlay
          muted
          playsInline
          onEnded={() => setBgVideoPlaying(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: Z.bg,
          }}
        />
      )}

      {/* 시계 */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          zIndex: Z.clock,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -72,
              top: 55,
              zIndex: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.4,
              color: "rgba(255, 242, 215, 0.75)",
              textShadow:
                "-4px 4px 0 rgba(0,0,0,0.07)",
            }}
          >
            <span>{md}</span>

            <span style={{ marginLeft: 20 }}>
              {day}
            </span>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily:
                "'KERISKEDU', sans-serif",
              fontWeight: 700,
              fontSize: 115,
              color: "#FBEFDD",
              textShadow:
                "-4px 4px 0 rgba(0,0,0,0.15)",
            }}
          >
            {formatClock(now)}
          </div>
        </div>
      </div>

      {/* 식물 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: Z.plant,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* activeFrames가 있으면(전환 중) 지금 프레임을, 없으면(평소) 정지 이미지를 보여줌 —
            둘 다 이미 다운로드 끝난 <img>라서 전환 순간에 네트워크를 아예 안 타 깜빡일 수가 없음 */}
        <img
          src={
            activeFrames
              ? activeFrames[frameIndex]
              : plantState === "BLOOMING"
              ? posterBloom
              : posterWilt
          }
          alt=""
          style={{
            width: "62%",
            maxWidth: 960,
            objectFit: "contain",
            filter: "drop-shadow(-10px 6px 10px rgba(0,0,0,0.22))",
            transform: `translateY(${PLANT_OFFSET_Y}px)`,
          }}
        />
      </div>

      {cards.length > 0 && (
        <>
          <style>{`
            .cards-scroll-${scrollId} {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }

            .cards-scroll-${scrollId}::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div
            className={`cards-scroll-${scrollId}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 50,
              zIndex: 1,
              display: "flex",
              gap: 22,
              overflowX: "auto",
              padding: "0 32px",
            }}
          >
            {cards.map((c) => (
              <div
                key={c.key}
                style={{
                  flex: "0 0 auto",
                  minWidth: 200,
                  background: c.bg,
                  borderRadius: 22,
                  padding: "60px 50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <img
                  src={c.iconSrc}
                  alt=""
                  style={{
                    width: 50,
                    height: 50,
                    flexShrink: 0,
                    marginLeft: -35,
                    marginBottom: -50,
                  }}
                />

                <div
                  style={{
                    textAlign: "right",
                    marginBottom: -20,
                    marginRight: -20,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 38,
                      color: "#111",
                    }}
                  >
                    {c.label}
                  </div>

                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: 36,
                      color: "#111",
                    }}
                  >
                    {c.timeText}
                  </div>

                  {/* 카운트다운 있든 없든 카드 높이가 똑같이 유지되도록, 항상 렌더링하고 내용만 조건부로 */}
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: c.subtextColor,
                      marginTop: 4,
                      minHeight: 20,
                    }}
                  >
                    {c.subtext || "\u00A0"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showNewsletter && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: Z.newsletter,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 600,
              height: "70%",
              overflowY: "auto",
              borderRadius: 32,
              padding: "56px 44px 90px",
              background:
                "linear-gradient(160deg, rgba(220, 235, 251, 0.9) 0%, rgba(234, 241, 252, 0.9) 45%, rgba(243, 240, 250, 0.9) 100%)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
              fontSize: 20,
              lineHeight: 1.7,
              color: "#1a1a1a",
              whiteSpace: "pre-line",
              fontWeight: 500,
            }}
          >
            {newsletterContent
              ? `${newsletterContent.title || ""}\n\n${newsletterContent.body || ""}${
                  newsletterContent.tips?.length ? "\n\n" + newsletterContent.tips.map((t) => `· ${t}`).join("\n") : ""
                }`
              : MOCK_NEWSLETTER}

            <button
              onClick={() => { setShowNewsletter(false); setNewsletterContent(null); }}
              style={{
                position: "absolute",
                right: 36,
                bottom: 32,
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "none",
                background: "#FF6A34",
                color: "#fff",
                fontSize: 26,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}