import React, { createContext, useContext, useEffect, useState } from "react";
import { nextId } from "../utils/format";

const AppContext = createContext(null);

const STORAGE_KEY = "bloomframe_app_data";

const initialData = {
  userType: null,
  name: "",
  age: "",
  guardianPhone: "",
  selfPhone: "",
  email: "",
  password: "",
  passwordConfirm: "",
  phoneVerifying: false,
  otp: "",
  categories: [],
  devices: [
    { id: nextId(), name: "IoT_1", desc: "인천에 있는 김인하의 IoT에 연결되어 있습니다" },
    { id: nextId(), name: "IoT_2", desc: "인천에 있는 김인하의 IoT에 연결되어 있습니다" },
  ],
  aiRecommend: true,
  iotImage: null,
  logs: [{ date: "8월 1일", statuses: ["done", "missed", "pending", "pending"] }],
  verifications: {}, // { [알람key]: "success" } — IotDisplay에서 인증 성공 시 기록, Home 등에서 같이 읽음
};

// localStorage에 저장된 게 있으면 그걸로 시작 (같은 브라우저에서 새 탭/새로고침해도 데이터 유지)
// 저장된 데이터에 없는 새 필드가 나중에 추가될 수도 있으니 initialData와 merge
function loadInitialData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return { ...initialData, ...saved };
  } catch {
    // 저장된 값이 깨져있거나 localStorage를 못 쓰는 환경이면 그냥 기본값으로
  }
  return initialData;
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadInitialData);
  const [wip, setWip] = useState(null); // 온보딩/알림 추가 중인 카테고리
  const [onboarding, setOnboarding] = useState(true);
  const [imageOnly, setImageOnly] = useState(false); // 마이페이지 "이미지 바꾸기" 단독 흐름 여부
  const [accountEditMode, setAccountEditMode] = useState(false); // 마이페이지 "수정"으로 SignupInfo 재사용하는 흐름 여부

  // data가 바뀔 때마다 localStorage에 동기화 — 새 탭/새로고침해도 이걸로 복원됨
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 저장 실패해도 앱 동작에는 지장 없음 (그냥 지속성만 못 챙기는 것)
    }
  }, [data]);

  // 같은 브라우저의 다른 탭(IoT 화면/홈 화면)에서 알람 상태만 즉시 반영한다.
  // 회원가입 입력값까지 통째로 교체하면 다른 탭의 오래된 값이 작성 중인 폼을 덮어쓸 수 있다.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const next = JSON.parse(event.newValue);
        setData((current) => ({
          ...current,
          ...(Array.isArray(next.categories) ? { categories: next.categories } : {}),
          verifications: {
            ...current.verifications,
            ...(next.verifications || {}),
          },
        }));
      } catch {
        // 깨진 저장 값은 무시하고 현재 정상 상태를 유지한다.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

const commitCategory = (category) => {
  setData((d) => {
    const cleanedCategory = {
      ...category,
      times: (category.times || []).filter(
        (time, index, arr) =>
          index === arr.findIndex(
            (t) =>
              t.id === time.id ||
              (
                t.hour === time.hour &&
                t.minute === time.minute &&
                t.ampm === time.ampm
              )
          )
      ),
    };

    const exists = d.categories.some(
      (c) => c.id === category.id
    );

    return {
      ...d,
      categories: exists
        ? d.categories.map((c) =>
            c.id === category.id
              ? cleanedCategory
              : c
          )
        : [...d.categories, cleanedCategory],
    };
  });

  setWip(null);
};

  const resetAll = () => {
    setData(initialData);
    setWip(null);
    setOnboarding(true);
    setImageOnly(false);
    setAccountEditMode(false);
  };

  return (
    <AppContext.Provider value={{ data, setData, update, commitCategory, wip, setWip, onboarding, setOnboarding, imageOnly, setImageOnly, accountEditMode, setAccountEditMode, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp은 AppProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
