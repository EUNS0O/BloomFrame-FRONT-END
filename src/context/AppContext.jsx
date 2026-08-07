import React, { createContext, useContext, useState } from "react";
import { nextId } from "../utils/format";

const AppContext = createContext(null);

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
  logs: [{ date: "8월 1일", statuses: ["done", "missed", "pending", "pending"] }],
};

export function AppProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [wip, setWip] = useState(null); // 온보딩/알림 추가 중인 카테고리
  const [onboarding, setOnboarding] = useState(true);

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const resetAll = () => {
    setData(initialData);
    setWip(null);
    setOnboarding(true);
  };

  return (
    <AppContext.Provider value={{ data, setData, update, wip, setWip, onboarding, setOnboarding, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp은 AppProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
