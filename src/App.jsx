import React from "react";
import { Routes, Route } from "react-router-dom";
import { Frame } from "./components/common/Layout";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import SignupType from "./pages/SignupType";
import SignupInfo from "./pages/SignupInfo";
import CategorySelect from "./pages/CategorySelect";
import MedPhoto from "./pages/MedPhoto";
import MedInfo from "./pages/MedInfo";
import TimeList from "./pages/TimeList";
import TimeSingle from "./pages/TimeSingle";
import ImageSelect from "./pages/ImageSelect";
import Home from "./pages/Home";
import History from "./pages/History";
import AlarmList from "./pages/AlarmList";
import IotHome from "./pages/IotHome";
import IotConnect from "./pages/IotConnect";
import IotDevices from "./pages/IotDevices";
import MyPage from "./pages/MyPage";
import MedList from "./pages/MedList";
import Guide from "./pages/Guide";
import Inquiry from "./pages/Inquiry";

export default function App() {
  return (
    <Frame>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup/type" element={<SignupType />} />
        <Route path="/signup/info" element={<SignupInfo />} />

        {/* 알림 카테고리 등록 흐름 (온보딩 중 + 홈에서 알람 추가 시 공용) */}
        <Route path="/onboarding/category" element={<CategorySelect />} />
        <Route path="/onboarding/category/more" element={<CategorySelect />} />
        <Route path="/onboarding/med-photo" element={<MedPhoto />} />
        <Route path="/onboarding/med-info" element={<MedInfo />} />
        <Route path="/onboarding/time-list" element={<TimeList />} />
        <Route path="/onboarding/time-single" element={<TimeSingle />} />
        <Route path="/onboarding/image-select" element={<ImageSelect />} />

        <Route path="/home" element={<Home />} />
        <Route path="/home/history" element={<History />} />
        <Route path="/home/alarms" element={<AlarmList />} />

        <Route path="/iot" element={<IotHome />} />
        <Route path="/iot/connect" element={<IotConnect />} />
        <Route path="/iot/manage" element={<IotDevices />} />
        <Route path="/iot/list" element={<IotDevices />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/meds" element={<MedList />} />
        <Route path="/mypage/guide" element={<Guide />} />
        <Route path="/mypage/inquiry" element={<Inquiry />} />

        <Route path="*" element={<Splash />} />
      </Routes>
    </Frame>
  );
}
