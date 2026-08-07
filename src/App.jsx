import React, { useState, useRef } from "react";
import {
  Wifi, Home as HomeIcon, User, Users, ChevronRight, ChevronLeft,
  Camera, Plus, Trash2, Bell, Pill, Dumbbell, Clock, Check,
  MessageCircle, LogOut, Image as ImageIcon, Shield, ListChecks,
} from "lucide-react";

/* ─────────────────────────────────────────────
   BloomFrame+  ── 프론트엔드 프로토타입
   기획서 / IA / 플로우차트 / API 명세 / 목업 이미지 기반
   실제 백엔드 연동 없이 화면 흐름 + 상태만 재현한 바이브 코딩 베이스입니다.
───────────────────────────────────────────── */

const C = {
  bg: "#F3F2EF",
  panel: "#FFFFFF",
  field: "#EBEAE7",
  black: "#17171A",
  orange: "#FF6A34",
  orangeSoft: "#FFE3D6",
  gray: "#9A9993",
  grayLine: "#E3E1DC",
};

let uid = 100;
const nextId = () => ++uid;

const CATEGORY_META = {
  med: { label: "약", icon: Pill, desc: "촬영으로 자동 등록해요" },
  exercise: { label: "운동", icon: Dumbbell, desc: "원하는 시간에 알려드려요" },
  other: { label: "기타", icon: Clock, desc: "직접 항목을 추가해요" },
};

function fmtTime(t) {
  const h = String(t.hour).padStart(2, "0");
  const m = String(t.minute).padStart(2, "0");
  return `${t.ampm} ${h}:${m}`;
}

/* ── 재사용 UI 조각들 ───────────────────────── */

function Frame({ children }) {
  return (
    <div style={{ background: "#DCDAD5", minHeight: 760, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 24, fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <div style={{ width: 412, minHeight: 890, background: C.bg, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.18)", position: "relative", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: C.black }}>BloomFrame</span>
      <span style={{ color: C.orange, fontWeight: 800, fontSize: 22, lineHeight: 0 }}>+</span>
    </div>
  );
}

function TopBar() {
  return (
    <div style={{ padding: "22px 24px 16px", borderBottom: `1px solid ${C.grayLine}`, background: C.bg }}>
      <Logo />
    </div>
  );
}

function BackHeader({ title, onBack, progress }) {
  return (
    <div style={{ padding: "20px 24px 8px", background: C.bg }}>
      <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, marginBottom: 18, cursor: "pointer", color: C.black }}>
        <ChevronLeft size={24} />
      </button>
      {progress != null && (
        <div style={{ height: 4, background: C.grayLine, borderRadius: 4, marginBottom: 22, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: C.black, borderRadius: 4, transition: "width .25s" }} />
        </div>
      )}
      {title && <div style={{ fontSize: 22, fontWeight: 800, color: C.black, marginBottom: 4 }}>{title}</div>}
    </div>
  );
}

function Sub({ children }) {
  return <div style={{ fontSize: 13.5, color: C.gray, lineHeight: 1.5, marginBottom: 20 }}>{children}</div>;
}

function Btn({ children, onClick, variant = "primary", disabled, icon: Icon }) {
  const styles = {
    primary: { background: disabled ? "#C9C8C3" : C.black, color: "#fff" },
    ghost: { background: C.field, color: C.black },
    orange: { background: disabled ? "#F4C4AC" : C.orange, color: "#fff" },
  }[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: "100%", padding: "15px 16px", borderRadius: 14, border: "none",
        fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        ...styles,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 13.5, fontWeight: 700, color: C.black, marginBottom: 8 }}>{label}</div>}
      <input
        {...props}
        style={{
          width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 12,
          border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 14.5, color: C.black, outline: "none",
        }}
      />
    </div>
  );
}

function Card({ children, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? C.orange : C.field, color: active ? "#fff" : C.black,
        borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center",
        justifyContent: "space-between", cursor: onClick ? "pointer" : "default", marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { key: "iot", label: "IoT", icon: Wifi },
    { key: "home", label: "홈", icon: HomeIcon },
    { key: "mypage", label: "마이페이지", icon: ImageIcon },
  ];
  return (
    <div style={{ borderTop: `1px solid ${C.grayLine}`, background: C.bg, display: "flex", padding: "10px 0 16px" }}>
      {items.map((it) => {
        const Icon = it.icon;
        const activeTab = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: activeTab ? C.black : C.gray }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 11, fontWeight: activeTab ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── 시간 선택 위젯 ───────────────────────── */
function TimePicker({ value, onChange, onConfirm }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알람 설정</div>
      <Sub>알려드릴 시간을 설정해 주세요</Sub>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "48px 0 80px" }}>
        <div style={{ textAlign: "center" }}>
          <input
            type="number" min={1} max={12} value={value.hour}
            onChange={(e) => set("hour", Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
            style={{ width: 88, textAlign: "center", fontSize: 34, fontWeight: 800, padding: "18px 0", borderRadius: 14, border: "none", background: C.field, color: C.black }}
          />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>시간</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.black }}>:</div>
        <div style={{ textAlign: "center" }}>
          <input
            type="number" min={0} max={59} value={value.minute}
            onChange={(e) => set("minute", Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
            style={{ width: 88, textAlign: "center", fontSize: 34, fontWeight: 800, padding: "18px 0", borderRadius: 14, border: "none", background: C.field, color: C.black }}
          />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>분</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 4 }}>
          {["오전", "오후"].map((ap) => (
            <button key={ap} onClick={() => set("ampm", ap)}
              style={{ padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                background: value.ampm === ap ? C.black : C.field, color: value.ampm === ap ? "#fff" : C.black, fontSize: 13, fontWeight: 700 }}>
              {ap}
            </button>
          ))}
        </div>
      </div>
      <Btn onClick={onConfirm}>확인</Btn>
    </div>
  );
}

/* ── 이미지 선택 그리드 ───────────────────────── */
const IMAGE_SWATCHES = ["#FBD5C4", "#F6C9DA", "#C9E4C5", "#C6DCF0", "#EADFF5", "#F9E3AE", "#D8E8DD", "#F0D0D0", "#D6E0F0"];
function ImageGrid({ selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "24px 0 40px" }}>
      {IMAGE_SWATCHES.map((color, i) => (
        <div key={i} onClick={() => onSelect(i)}
          style={{
            aspectRatio: "1", borderRadius: 12, background: color, cursor: "pointer",
            border: selected === i ? `3px solid ${C.orange}` : "3px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
          🌿
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("home");
  const [onboarding, setOnboarding] = useState(true);

  const [data, setData] = useState({
    userType: null,
    name: "", age: "", guardianPhone: "", selfPhone: "", email: "", password: "", passwordConfirm: "",
    phoneVerifying: false, otp: "",
    categories: [],
    devices: [
      { id: nextId(), name: "IoT_1", desc: "인천에 있는 김인하의 IoT에 연결되어 있습니다" },
      { id: nextId(), name: "IoT_2", desc: "인천에 있는 김인하의 IoT에 연결되어 있습니다" },
    ],
    aiRecommend: true,
    logs: [
      { date: "8월 1일", statuses: ["done", "missed", "pending", "pending"] },
    ],
  });
  const [wip, setWip] = useState(null); // 온보딩/알림 추가 중인 카테고리
  const [analyzing, setAnalyzing] = useState(false);
  const [newDeviceCode, setNewDeviceCode] = useState("");

  function go(next) {
    setHistory((h) => [...h, screen]);
    setScreen(next);
  }
  function back(fallback) {
    setHistory((h) => {
      if (h.length === 0) {
        if (fallback) setScreen(fallback);
        return h;
      }
      setScreen(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }
  function goHome() {
    setHistory([]);
    setScreen("home");
    setTab("home");
  }

  function update(patch) {
    setData((d) => ({ ...d, ...patch }));
  }

  function startCategoryFlow(fromOnboarding) {
    setOnboarding(fromOnboarding);
    setWip(null);
    go("category-select");
  }

  function pickCategory(type) {
    if (type === "med") {
      setWip({ id: nextId(), type, meds: [], times: [], image: null });
      go("med-photo");
    } else {
      setWip({ id: nextId(), type, name: CATEGORY_META[type].label, times: [], image: null, draftTime: { hour: 1, minute: 0, ampm: "오전" } });
      go("time-single");
    }
  }

  function finishCategory() {
    setData((d) => ({ ...d, categories: [...d.categories, wip] }));
    setWip(null);
    if (onboarding) go("category-more");
    else goHome();
  }

  const wipMeta = wip ? CATEGORY_META[wip.type] : null;

  /* ── 스크린별 렌더 ───────────────────────── */
  let body = null;

  if (screen === "splash") {
    body = (
      <div style={{ flex: 1, background: C.black, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0 0 40px" }}>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>BloomFrame<span style={{ color: C.orange }}>+</span></div>
          <div style={{ fontSize: 13, color: "#C9C7C2", marginTop: 8 }}>예술로 피어나는 습관</div>
        </div>
        <div style={{ padding: "0 24px" }}>
          <button onClick={() => go("login")} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "#fff", color: C.black, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>로그인</button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#C9C7C2" }}>
            계정이 없으신가요?{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => go("signup-type")}>회원가입</span>
          </div>
        </div>
      </div>
    );
  } else if (screen === "login") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "24px 24px 0" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>로그인</div>
          <Sub>서비스를 이용하기 위해<br />로그인해 주세요</Sub>
          <Field label="아이디" placeholder="BloomFrame@email.com" />
          <Field label="비밀번호" type="password" placeholder="••••••••" />
          <div style={{ marginTop: 40 }}>
            <Btn onClick={goHome}>확인</Btn>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: C.gray }}>
            계정이 없으신가요?{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer", color: C.black }} onClick={() => go("signup-type")}>회원가입</span>
          </div>
        </div>
      </>
    );
  } else if (screen === "signup-type") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px" }}>
        <BackHeader onBack={() => back("splash")} progress={20} />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>누가 사용하시나요?</div>
        <Sub>이 앱을 대리인이 사용하는지,<br />시니어 본인이 사용하는지 선택해주세요</Sub>
        {[{ key: "self", label: "본인", desc: "시니어 본인이 직접 사용해요", icon: User },
          { key: "guardian", label: "대리인", desc: "자녀 · 보호자가 사용해요", icon: Users }].map((o) => (
          <Card key={o.key} active={data.userType === o.key} onClick={() => update({ userType: o.key })}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: data.userType === o.key ? "rgba(255,255,255,.25)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <o.icon size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{o.label}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{o.desc}</div>
              </div>
            </div>
            <ChevronRight size={18} />
          </Card>
        ))}
        <div style={{ marginTop: 24 }}>
          <Btn disabled={!data.userType} onClick={() => go("signup-info")}>다음</Btn>
        </div>
      </div>
    );
  } else if (screen === "signup-info") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
        <BackHeader onBack={back} progress={40} />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>회원 정보 입력</div>
        <Sub>시니어 · 본인 공통 정보를 입력해주세요</Sub>
        <Field label="이름" placeholder="홍길동" value={data.name} onChange={(e) => update({ name: e.target.value })} />
        <Field label="나이" placeholder="65 (만 나이로 적어주세요)" value={data.age} onChange={(e) => update({ age: e.target.value })} />
        <Field label="전화번호 (대리인)" placeholder="010-0000-0000" value={data.guardianPhone} onChange={(e) => update({ guardianPhone: e.target.value })} />
        {!data.phoneVerifying ? (
          <button onClick={() => update({ phoneVerifying: true })} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.black, color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 16, cursor: "pointer" }}>
            휴대폰 번호 인증하기
          </button>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <input placeholder="문자로 전송된 인증번호를 입력해 주세요" value={data.otp} onChange={(e) => update({ otp: e.target.value })}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 13 }} />
          </div>
        )}
        <Field label="전화번호 (본인)" placeholder="010-0000-0000" value={data.selfPhone} onChange={(e) => update({ selfPhone: e.target.value })} />
        <Field label="이메일" placeholder="BloomFrame@email.com" value={data.email} onChange={(e) => update({ email: e.target.value })} />
        <Field label="비밀번호" type="password" placeholder="••••••••" value={data.password} onChange={(e) => update({ password: e.target.value })} />
        <Field label="비밀번호 확인" type="password" placeholder="••••••••" value={data.passwordConfirm} onChange={(e) => update({ passwordConfirm: e.target.value })} />
        <Btn onClick={() => startCategoryFlow(true)}>확인</Btn>
      </div>
    );
  } else if (screen === "category-select" || screen === "category-more") {
    const isMore = screen === "category-more";
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
        <BackHeader onBack={() => (isMore ? goHome() : back("signup-info"))} progress={isMore ? undefined : 60} title={isMore ? "알림 카테고리 추가" : undefined} />
        {!isMore && <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알림 카테고리 선택</div>}
        <Sub>{isMore ? "다른 항목도 추가로 설정할 수 있어요" : "알려드릴 항목을 선택해 주세요"}</Sub>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <Card key={key} onClick={() => pickCategory(key)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <meta.icon size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{meta.desc}</div>
              </div>
            </div>
            <ChevronRight size={18} />
          </Card>
        ))}
        {isMore && (
          <div style={{ marginTop: 24 }}>
            <Btn onClick={goHome}>완료</Btn>
          </div>
        )}
      </div>
    );
  } else if (screen === "med-photo") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px" }}>
        <BackHeader onBack={back} progress={onboarding ? 70 : undefined} />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>약봉지 촬영</div>
        <div
          onClick={() => {
            setAnalyzing(true);
            setTimeout(() => {
              setAnalyzing(false);
              setWip((w) => ({
                ...w,
                meds: [
                  { id: nextId(), name: "타이레놀정 500mg", freq: "3", timing: "식후 30분" },
                ],
              }));
              go("med-info");
            }, 900);
          }}
          style={{
            width: "100%", aspectRatio: "1", background: C.black, borderRadius: 20, marginTop: 40,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff", position: "relative",
          }}
        >
          {["10%,10%", "10%,10%", "10%,10%", "10%,10%"].map((_, i) => null)}
          <div style={{ position: "absolute", top: 24, left: 24, width: 26, height: 26, borderTop: "3px solid #fff", borderLeft: "3px solid #fff" }} />
          <div style={{ position: "absolute", top: 24, right: 24, width: 26, height: 26, borderTop: "3px solid #fff", borderRight: "3px solid #fff" }} />
          <div style={{ position: "absolute", bottom: 24, left: 24, width: 26, height: 26, borderBottom: "3px solid #fff", borderLeft: "3px solid #fff" }} />
          <div style={{ position: "absolute", bottom: 24, right: 24, width: 26, height: 26, borderBottom: "3px solid #fff", borderRight: "3px solid #fff" }} />
          {analyzing ? <div style={{ fontSize: 13 }}>AI가 분석하고 있어요...</div> : <Camera size={40} />}
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: C.gray, margin: "14px 0 30px" }}>약국 봉지 뒷면이나 약을 찍어주세요</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => {
              setAnalyzing(true);
              setTimeout(() => {
                setAnalyzing(false);
                setWip((w) => ({
                  ...w,
                  meds: [{ id: nextId(), name: "타이레놀정 500mg", freq: "3", timing: "식후 30분" }],
                }));
                go("med-info");
              }, 900);
            }}
            style={{ width: 64, height: 64, borderRadius: "50%", background: C.orange, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Camera size={26} color="#fff" />
          </button>
        </div>
      </div>
    );
  } else if (screen === "med-info") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
        <BackHeader onBack={back} progress={onboarding ? 75 : undefined} />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>약 정보</div>
        <Sub>AI가 인식한 약 정보에요<br />확인 후 필요하면 수정해 주세요</Sub>
        {wip?.meds.map((m) => (
          <div key={m.id} style={{ background: C.field, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Pill size={16} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: C.gray }}>1일 {m.freq}회 · {m.timing}</div>
              </div>
            </div>
            <button
              onClick={() => {
                const name = prompt("약 이름", m.name) || m.name;
                const freq = prompt("1일 몇 회인지 (숫자만)", m.freq) || m.freq;
                const timing = prompt("언제 먹어야 하는지", m.timing) || m.timing;
                setWip((w) => ({ ...w, meds: w.meds.map((x) => (x.id === m.id ? { ...x, name, freq, timing } : x)) }));
              }}
              style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              수정
            </button>
          </div>
        ))}
        <button
          onClick={() => setWip((w) => ({ ...w, meds: [...w.meds, { id: nextId(), name: "새 약 이름", freq: "1", timing: "식후" }] }))}
          style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 30 }}
        >
          + 약 추가하기
        </button>
        <Btn onClick={() => go("time-list")}>확인</Btn>
      </div>
    );
  } else if (screen === "time-list") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px" }}>
        <BackHeader onBack={back} progress={onboarding ? 82 : undefined} />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>알림 · 복용 시간 설정</div>
        <Sub>알려드릴 시간을 확인해 주세요</Sub>
        {wip?.times.map((t, i) => (
          <div key={t.id} style={{ border: `1px solid ${C.grayLine}`, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.field, display: "flex", alignItems: "center", justifyContent: "center" }}><wipMeta.icon size={16} /></div>
              <div>
                <div style={{ fontSize: 12, color: C.gray }}>{i + 1}회차</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtTime(t)}</div>
              </div>
            </div>
            <button
              onClick={() => setWip((w) => ({ ...w, times: w.times.filter((x) => x.id !== t.id) }))}
              style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.field, color: C.black, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >삭제</button>
          </div>
        ))}
        <button
          onClick={() => { setWip((w) => ({ ...w, draftTime: { hour: 1, minute: 0, ampm: "오전" } })); go("time-single"); }}
          style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 30 }}
        >
          + 알람 추가하기
        </button>
        <Btn disabled={!wip?.times.length} onClick={() => go("image-select")}>확인</Btn>
      </div>
    );
  } else if (screen === "time-single") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px" }}>
        <BackHeader onBack={back} progress={onboarding ? 80 : undefined} />
        <TimePicker
          value={wip?.draftTime || { hour: 1, minute: 0, ampm: "오전" }}
          onChange={(v) => setWip((w) => ({ ...w, draftTime: v }))}
          onConfirm={() => {
            setWip((w) => ({ ...w, times: [...w.times, { id: nextId(), ...w.draftTime }] }));
            if (wip.type === "med") go("time-list");
            else go("image-select");
          }}
        />
      </div>
    );
  } else if (screen === "image-select") {
    body = (
      <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
        <BackHeader onBack={back} progress={onboarding ? 92 : undefined} />
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>이미지 선택</div>
        <Sub>IoT 스크린에 들어갈 이미지를 선택해 주세요</Sub>
        <ImageGrid selected={wip?.image} onSelect={(i) => setWip((w) => ({ ...w, image: i }))} />
        <Btn disabled={wip?.image == null} onClick={finishCategory}>확인</Btn>
      </div>
    );
  } else if (screen === "home") {
    const doneColor = { done: "#3CB371", missed: "#E4523A", pending: "#D9D7D2" };
    const iconFor = (t) => (t === "med" ? Pill : t === "exercise" ? Dumbbell : Clock);
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>홈</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>알림 기록</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            {(data.logs[0]?.statuses || []).map((s, i) => {
              const Icon = i < data.categories.length ? iconFor(data.categories[i].type) : Pill;
              return (
                <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: doneColor[s], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="#fff" />
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: C.gray, cursor: "pointer", marginBottom: 26 }} onClick={() => go("history")}>이전 기록 보기 &gt;</div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>알림 목록</div>
          {data.categories.length === 0 && (
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>아직 등록된 알림이 없어요.</div>
          )}
          {data.categories.map((c) => {
            const meta = CATEGORY_META[c.type];
            return (
              <Card key={c.id} onClick={() => go("alarm-list")}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <meta.icon size={18} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</div>
                    <div style={{ fontSize: 12, color: C.gray }}>알림 {c.times.length}건 · 진행 중</div>
                  </div>
                </div>
                <ChevronRight size={18} />
              </Card>
            );
          })}
          <button onClick={() => startCategoryFlow(false)} style={{ width: "100%", padding: "16px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 10 }}>
            + 알람 추가하기
          </button>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "history") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>이전 기록</div>
          <div style={{ border: `1px solid ${C.grayLine}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>8월 2026</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, fontSize: 12, color: C.gray, textAlign: "center" }}>
              {["일","월","화","수","목","금","토"].map((d) => <div key={d}>{d}</div>)}
              {Array.from({ length: 31 }, (_, i) => (
                <div key={i} style={{ padding: "6px 0", borderRadius: 8, color: i + 1 === 1 ? C.orange : C.black, fontWeight: i + 1 === 1 ? 700 : 400 }}>{i + 1}</div>
              ))}
            </div>
          </div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>8월 1일</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["#3CB371", "#E4523A", "#D9D7D2", "#D9D7D2"].map((c, i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center" }}><Pill size={16} color="#fff" /></div>
            ))}
          </div>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "alarm-list") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>알림 목록</div>
          {data.categories.flatMap((c) =>
            c.times.map((t) => (
              <div key={t.id} style={{ background: C.field, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {React.createElement(CATEGORY_META[c.type].icon, { size: 18 })}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{CATEGORY_META[c.type].label}</div>
                    <div style={{ fontSize: 12, color: C.gray }}>{fmtTime(t)} · 진행 중</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "7px 12px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
                  <button
                    onClick={() => setData((d) => ({ ...d, categories: d.categories.map((cc) => cc.id === c.id ? { ...cc, times: cc.times.filter((x) => x.id !== t.id) } : cc) }))}
                    style={{ padding: "7px 12px", borderRadius: 20, border: "none", background: "#fff", color: C.black, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >삭제</button>
                </div>
              </div>
            ))
          )}
          <div style={{ marginTop: 20 }}>
            <Btn onClick={back}>확인</Btn>
          </div>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "iot-home") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>IoT 기기 관리</div>
          <div onClick={() => go("iot-connect")} style={{ background: C.black, color: "#fff", borderRadius: 18, padding: "20px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🍀</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>기기 연결</div>
              <div style={{ fontSize: 12, color: "#C9C7C2" }}>알림 받을 AAC 액자를 찾아 연결하세요</div>
            </div>
          </div>
          <Card onClick={() => go("iot-manage")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Wifi size={20} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>기기 관리</div>
                <div style={{ fontSize: 12, color: C.gray }}>연결 설정 · 이름 변경</div>
              </div>
            </div>
            <ChevronRight size={18} />
          </Card>
          <Card onClick={() => go("iot-list")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Wifi size={20} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>연결된 기기 목록</div>
                <div style={{ fontSize: 12, color: C.gray }}>{data.devices.length}개 기기 연결됨</div>
              </div>
            </div>
            <ChevronRight size={18} />
          </Card>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "iot-connect") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>IoT 기기 연결</div>
          <Sub>IoT 기기에 연결하기 위해<br />고유 넘버를 입력해 주세요</Sub>
          <input autoFocus value={newDeviceCode} onChange={(e) => setNewDeviceCode(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: 12, border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 15, marginBottom: 320 }} />
          <Btn
            disabled={!newDeviceCode}
            onClick={() => {
              setData((d) => ({ ...d, devices: [...d.devices, { id: nextId(), name: `IoT_${d.devices.length + 1}`, desc: `시리얼 코드 ${newDeviceCode} 로 연결되었습니다` }] }));
              setNewDeviceCode("");
              back();
            }}
          >확인</Btn>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "iot-manage" || screen === "iot-list") {
    const editable = screen === "iot-manage";
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{editable ? "IoT 기기 관리" : "IoT 기기 목록"}</div>
          {data.devices.map((dev) => (
            <div key={dev.id} style={{ background: C.field, borderRadius: 16, padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🍀</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{dev.name}</div>
                  <div style={{ fontSize: 11.5, color: C.gray, maxWidth: 200 }}>{dev.desc}</div>
                </div>
              </div>
              {editable && (
                <button onClick={() => setData((d) => ({ ...d, devices: d.devices.filter((x) => x.id !== dev.id) }))}
                  style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>삭제</button>
              )}
            </div>
          ))}
          {editable && (
            <button onClick={() => go("iot-connect")} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              + IoT 추가하기
            </button>
          )}
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "mypage") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>마이페이지</div>
          <div style={{ background: C.black, color: "#fff", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🍀</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>계정 · {data.email || "example.com"}</div>
                <div style={{ fontSize: 12, color: "#C9C7C2" }}>{data.name || "홍길동"} {data.selfPhone || "010-0000-0000"}</div>
              </div>
            </div>
            <button style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: "#fff", color: C.black, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray, marginBottom: 10 }}>복용약 정보</div>
          <Card onClick={() => go("med-list")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Pill size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>약 목록</span></div>
            <ChevronRight size={16} />
          </Card>
          <Card onClick={() => alert("건강 상태를 업데이트합니다.")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Shield size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>건강 상태 업데이트</span></div>
            <ChevronRight size={16} />
          </Card>

          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray, margin: "18px 0 10px" }}>설정</div>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Bell size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>AI 추천 정보 나타내기</span></div>
            <div onClick={() => update({ aiRecommend: !data.aiRecommend })} style={{ width: 40, height: 24, borderRadius: 20, background: data.aiRecommend ? C.black : C.grayLine, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: data.aiRecommend ? 19 : 3, transition: "left .15s" }} />
            </div>
          </Card>
          <Card onClick={() => { setOnboarding(false); setWip({ id: nextId(), type: "other", times: [], image: null }); go("image-select"); }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ImageIcon size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>이미지 바꾸기</span></div>
            <ChevronRight size={16} />
          </Card>

          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray, margin: "18px 0 10px" }}>이용 안내</div>
          <Card onClick={() => go("guide")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ListChecks size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>이용 안내</span></div>
            <ChevronRight size={16} />
          </Card>
          <Card onClick={() => go("inquiry")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><MessageCircle size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>문의하기</span></div>
            <ChevronRight size={16} />
          </Card>
          <Card onClick={() => { setScreen("splash"); setHistory([]); }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><LogOut size={17} /><span style={{ fontWeight: 600, fontSize: 14 }}>로그아웃</span></div>
            <ChevronRight size={16} />
          </Card>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "med-list") {
    const meds = data.categories.filter((c) => c.type === "med").flatMap((c) => c.meds);
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>약 정보</div>
          <Sub>AI가 인식한 약 정보에요<br />확인 후 필요하면 수정해 주세요</Sub>
          {meds.length === 0 && <div style={{ fontSize: 13, color: C.gray }}>등록된 약이 없어요.</div>}
          {meds.map((m) => (
            <div key={m.id} style={{ background: C.field, borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Pill size={16} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: C.gray }}>1일 {m.freq}회 · {m.timing}</div>
                </div>
              </div>
              <button style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: C.black, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>수정</button>
            </div>
          ))}
          <button onClick={() => startCategoryFlow(false)} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1.5px dashed ${C.grayLine}`, background: "none", color: C.black, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>+ 약 추가하기</button>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "guide") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", fontSize: 13.5, lineHeight: 1.7, color: "#333" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>이용 안내</div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>서비스 설명</div>
          <p style={{ marginTop: 0 }}>BloomFrame은 오랜기간 정체되어있던 알림 패러다임에 신선한 변화를 가져왔습니다. 각종 알림을 거대한 화면의 인테리어 소품으로 느껴보세요. 시인성을 극대화하여 알림의 정시 수행률을 극대화합니다.</p>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>앱 이용 안내</div>
          <p style={{ marginTop: 0 }}>하단의 IoT, 홈, 마이페이지 탭을 눌러 각 기능을 살펴볼 수 있습니다.</p>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>IoT 탭</div>
          <p style={{ marginTop: 0 }}>IoT 기기를 연결하고 관리할 수 있습니다. 고유 넘버로 연결하고, 이름 변경·추가·삭제가 가능합니다.</p>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>홈 탭</div>
          <p style={{ marginTop: 0 }}>알림 기록과 목록을 확인하고 추가할 수 있습니다. 초록색은 이행, 빨간색은 미이행, 회색은 예정된 알림입니다.</p>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>마이페이지 탭</div>
          <p style={{ marginTop: 0 }}>개인 정보와 약 목록 확인·수정, 이미지 변경, AI 추천 정보 표시 여부를 설정할 수 있습니다.</p>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  } else if (screen === "inquiry") {
    body = (
      <>
        <TopBar />
        <div style={{ flex: 1, padding: "20px 24px" }}>
          <BackHeader onBack={back} />
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>문의하기</div>
          <textarea placeholder="불편한 점이나 궁금한 점을 남겨주세요" rows={8}
            style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 14, border: `1px solid ${C.grayLine}`, background: C.field, fontSize: 14, resize: "none", marginBottom: 16 }} />
          <Btn onClick={() => { alert("문의가 접수되었습니다."); back(); }}>보내기</Btn>
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setScreen(t === "iot" ? "iot-home" : t === "mypage" ? "mypage" : "home"); }} />
      </>
    );
  }

  return <Frame>{body}</Frame>;
}
