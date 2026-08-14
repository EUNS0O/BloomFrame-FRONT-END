import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pill, Dumbbell } from "lucide-react";
import { useApp } from "../context/AppContext";
import bgIdle from "../assets/iot/bg_idle.webp";
import bgAlarm from "../assets/iot/bg_alarm.webp";
import bgChange from "../assets/iot/bg_change.mp4";
import bloomToWilt from "../assets/iot/bloom_to_wilt.mp4";
import wiltToBloom from "../assets/iot/wilt_to_bloom.mp4";
import posterBloom from "../assets/iot/poster_blooming.png";
import posterWilt from "../assets/iot/poster_wilted.png";

const Z = { bg: 0, clock: 1, plant: 2, cards: 3, newsletter: 4 };

const CARD_ICON = { med: Pill, exercise: Dumbbell, other: Pill };
const CARD_LABEL = { med: "약", exercise: "운동", other: "기타" };
const STATE_STYLE = {
  pending_med: { bg: "#FBF0DA", accent: "#E0A82E" },
  pending_exercise: { bg: "#DCEEFB", accent: "#4EA1E0" },
  pending_other: { bg: "#EAE7E2", accent: "#8A8A8A" },
  success: { bg: "#DCEEDD", accent: "#3CAE6B" },
  missed: { bg: "#FBD9D9", accent: "#E05353" },
};
const URGENT_THRESHOLD_MIN = 10;

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

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
function formatClock(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function formatDate(d) {
  return { md: `${d.getMonth() + 1}월 ${d.getDate()}일`, day: `${WEEKDAYS[d.getDay()]}요일` };
}
function toTodayDate(t) {
  const now = new Date();
  let h = Number(t.hour) % 12;
  if (t.ampm === "오후") h += 12;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, Number(t.minute), 0, 0);
}

export default function IotDisplay() {
  const { data } = useApp();
  const [searchParams] = useSearchParams();

  const testIn = searchParams.get("testIn");
  const stage1Ms = Number(searchParams.get("stage1")) > 0 ? Number(searchParams.get("stage1")) * 1000 : STAGE1_MS;
  const stage2Ms = Number(searchParams.get("stage2")) > 0 ? Number(searchParams.get("stage2")) * 1000 : STAGE2_MS;

  const schedule = useMemo(() => {
    if (testIn != null) {
      return [{ key: "test-alarm", at: new Date(Date.now() + Number(testIn) * 1000), label: "test" }];
    }
    return data.categories
      .flatMap((c) => c.times.map((t) => ({ key: `${c.id}-${t.id}`, at: toTodayDate(t), label: c.type })))
      .sort((a, b) => a.at - b.at);
  }, [data.categories, testIn]);

  const [plantState, setPlantState] = useState("BLOOMING");
  const [transition, setTransition] = useState(null);
  const [alarmPhase, setAlarmPhase] = useState(null);
  const [activeAlarmKey, setActiveAlarmKey] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [now, setNow] = useState(new Date());
  const [bgVideoPlaying, setBgVideoPlaying] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const resolvedKeys = useRef(new Set());
  const outcomes = useRef(new Map());
  const wasAlarmWindow = useRef(false);

  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      const nowMs = Date.now();
      const current = schedule.find((s) => !resolvedKeys.current.has(s.key) && nowMs >= s.at.getTime() && nowMs < s.at.getTime() + stage2Ms);

      if (!current) {
        setAlarmPhase(null);
        setActiveAlarmKey(null);
        setRemainingSeconds(null);
        return;
      }

      const elapsed = nowMs - current.at.getTime();
      setActiveAlarmKey(current.key);

      if (elapsed <= stage1Ms) {
        setAlarmPhase(1);
        setRemainingSeconds(Math.max(0, Math.ceil((stage1Ms - elapsed) / 1000)));
      } else {
        setAlarmPhase((prev) => {
          if (prev !== 2 && plantState === "BLOOMING") setTransition("toWilt");
          return 2;
        });
        setRemainingSeconds(Math.max(0, Math.ceil((stage2Ms - elapsed) / 1000)));

        if (elapsed >= stage2Ms) {
          resolvedKeys.current.add(current.key);
          outcomes.current.set(current.key, "missed");
          setAlarmPhase(null);
          setActiveAlarmKey(null);
          setRemainingSeconds(null);
        }
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [schedule, plantState, stage1Ms, stage2Ms]);

  const handleTransitionEnd = () => {
    setPlantState(transition === "toWilt" ? "WILTED" : "BLOOMING");
    setTransition(null);
  };

  const handleVerify = () => {
    if (showNewsletter) return;
    if (!activeAlarmKey) return;
    resolvedKeys.current.add(activeAlarmKey);
    outcomes.current.set(activeAlarmKey, "success");
    setAlarmPhase(null);
    setActiveAlarmKey(null);
    if (plantState === "WILTED") setTransition("toBloom");
    setShowNewsletter(true);
  };

  const isAlarmWindow = alarmPhase === 1 || alarmPhase === 2;

  useEffect(() => {
    if (isAlarmWindow && !wasAlarmWindow.current) {
      setBgVideoPlaying(true);
    }
    if (!isAlarmWindow) {
      setBgVideoPlaying(false);
    }
    wasAlarmWindow.current = isAlarmWindow;
  }, [isAlarmWindow]);

  const videoSrc = transition === "toWilt" ? bloomToWilt : transition === "toBloom" ? wiltToBloom : null;
  const { md, day } = formatDate(now);

  const cards = schedule.map((s) => {
    const isResolved = resolvedKeys.current.has(s.key);
    const status = isResolved ? outcomes.current.get(s.key) : `pending_${s.label}`;
    const style = STATE_STYLE[status] || STATE_STYLE.pending_other;

    let subtext = null;
    let subtextColor = "#9A9993";
    if (!isResolved) {
      const deadline = now.getTime() >= s.at.getTime() ? s.at.getTime() + stage2Ms : s.at.getTime();
      const totalMin = Math.max(0, Math.ceil((deadline - now.getTime()) / 60000));
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      subtext = `${h}:${String(m).padStart(2, "0")}`;
      subtextColor = totalMin <= URGENT_THRESHOLD_MIN ? "#E5484D" : "#9A9993";
    }

    return {
      key: s.key,
      label: CARD_LABEL[s.label] || "기타",
      timeText: `${String(s.at.getHours()).padStart(2, "0")}:${String(s.at.getMinutes()).padStart(2, "0")}`,
      Icon: CARD_ICON[s.label] || Pill,
      bg: style.bg,
      accent: style.accent,
      subtext,
      subtextColor,
    };
  });

  return (
    <div
      onClick={handleVerify}
      style={{
        position: "fixed", inset: 0, width: "100vw", height: "100vh", overflow: "hidden", background: "#000", cursor: "pointer",
        fontFamily: "'NanumSquareRound', sans-serif",
      }}
    >
      <img src={bgIdle} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: isAlarmWindow ? 0 : 1, transition: "opacity 1.2s ease", zIndex: Z.bg }} />
      <img src={bgAlarm} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: isAlarmWindow ? 1 : 0, transition: "opacity 1.2s ease", zIndex: Z.bg }} />

      {bgVideoPlaying && (
        <video
          src={bgChange}
          autoPlay
          muted
          playsInline
          onEnded={() => setBgVideoPlaying(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: Z.bg }}
        />
      )}

      {/* 시계 — 흰 테두리처럼 보이던 반투명 8자리hex 제거(불투명 색으로), fontWeight를 실제 등록된 700으로, 그림자는 왼쪽 아래로 */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, zIndex: Z.clock, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              position: "absolute", left: -72, top: 55, zIndex: 0,
              fontSize: 17, fontWeight: 700, lineHeight: 1.4,
              color: "rgba(255, 242, 215, 0.75)", textShadow: "-4px 4px 0 rgba(0,0,0,0.07)",
            }}
          >
            {md}
            <br />
            {day}
          </div>
          <div
            style={{
              position: "relative", zIndex: 1,
              fontFamily: "'KERISKEDU', sans-serif", fontWeight: 700, fontSize: 114,
              color: "#FBEFDD", textShadow: "-4px 4px 0 rgba(0,0,0,0.15)",
            }}
          >
            {formatClock(now)}
          </div>
        </div>

        {remainingSeconds != null && (
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: alarmPhase === 1 ? "#9A9993" : "#E5484D" }}>
            {remainingSeconds}초
          </div>
        )}
      </div>

      {/* 식물 — 정지 이미지에는 왼쪽·아래로 옅은 drop-shadow 추가 (영상은 알파가 없어 사각형 그림자로 어색해서 제외) */}
      <div style={{ position: "absolute", inset: 0, zIndex: Z.plant, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {videoSrc ? (
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            onEnded={handleTransitionEnd}
            style={{ width: "39%", maxWidth: 600, mixBlendMode: "screen" }}
          />
        ) : (
          <img
            src={plantState === "BLOOMING" ? posterBloom : posterWilt}
            alt=""
            style={{ width: "39%", maxWidth: 600, objectFit: "contain", filter: "drop-shadow(-10px 6px 10px rgba(0,0,0,0.22))" }}
          />
        )}
      </div>

      {cards.length > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 32, zIndex: Z.cards, display: "flex", gap: 14, overflowX: "auto", padding: "0 32px" }}>
          {cards.map((c) => (
            <div
              key={c.key}
              style={{
                flex: "0 0 auto", minWidth: 200, background: c.bg, borderRadius: 22,
                padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <c.Icon size={20} color={c.accent} strokeWidth={2} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: "#111" }}>{c.label}</div>
                <div style={{ fontWeight: 700, fontSize: 22, color: "#111" }}>{c.timeText}</div>
                {c.subtext && (
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.subtextColor, marginTop: 2 }}>{c.subtext}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewsletter && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", inset: 0, zIndex: Z.newsletter, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 32, background: "rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              position: "relative", width: "100%", maxWidth: 640, maxHeight: "82%", overflowY: "auto",
              borderRadius: 32, padding: "56px 44px 90px",
              background: "linear-gradient(160deg, #DCEBFB 0%, #EAF1FC 45%, #F3F0FA 100%)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              fontSize: 20, lineHeight: 1.7, color: "#1a1a1a", whiteSpace: "pre-line", fontWeight: 500,
            }}
          >
            {MOCK_NEWSLETTER}

            <button
              onClick={() => setShowNewsletter(false)}
              style={{
                position: "absolute", right: 36, bottom: 32, width: 64, height: 64, borderRadius: "50%",
                border: "none", background: "#FF6A34", color: "#fff", fontSize: 26, fontWeight: 800,
                cursor: "pointer", boxShadow: "0 6px 16px rgba(255,106,52,0.4)",
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