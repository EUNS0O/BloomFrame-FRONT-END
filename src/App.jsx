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
import MedEdit from "./pages/MedEdit";
import TimeList from "./pages/TimeList";
import TimeSingle from "./pages/TimeSingle";
import ImageSelect from "./pages/ImageSelect";
import Home from "./pages/Home";
import History from "./pages/History";
import AlarmList from "./pages/AlarmList";
import IotHome from "./pages/IotHome";
import IotConnect from "./pages/IotConnect";
import IotDevices from "./pages/IotDevices";
import IoTDeviceEdit from "./pages/IotDeviceEdit";
import MyPage from "./pages/MyPage";
import MedList from "./pages/MedList";
import Guide from "./pages/Guide";
import Inquiry from "./pages/Inquiry";

// 태블릿에서 "액자"로 켜둘 화면 — 폰 목업(Frame) 밖에서 전체화면으로 렌더링됨
import IotDisplay from "./pages/IotDisplay";

// 지금까지 만든 폰 앱 전체 (온보딩, 홈, 마이페이지 등) — Frame(폰 목업)으로 감싸서 보여줌
function PhoneApp() {
  return (
    <Frame>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup/type" element={<SignupType />} />
        <Route path="/signup/info" element={<SignupInfo />} />

        <Route path="/onboarding/category" element={<CategorySelect />} />
        <Route path="/onboarding/category/more" element={<CategorySelect />} />
        <Route path="/onboarding/med-photo" element={<MedPhoto />} />
        <Route path="/onboarding/med-info" element={<MedInfo />} />
        <Route path="/onboarding/med-edit" element={<MedEdit />} />
        <Route path="/onboarding/time-list" element={<TimeList />} />
        <Route path="/onboarding/time-single" element={<TimeSingle />} />
        <Route path="/onboarding/image-select" element={<ImageSelect />} />

        <Route path="/home" element={<Home />} />
        <Route path="/home/history" element={<History />} />
        <Route path="/home/alarms" element={<AlarmList />} />

        <Route path="/iot" element={<IotHome />} />
        <Route path="/iot/connect" element={<IotConnect />} />
        <Route path="/iot/manage" element={<IotDevices />} />
        <Route path="/iot/manage/edit/:id" element={<IotDeviceEdit />} />
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

export default function App() {
  return (
    <Routes>
      {/* 태블릿 액자용 — Frame 없이 전체화면 */}
      <Route path="/display/:deviceId" element={<IotDisplay />} />
      {/* 그 외 전부 폰 앱 */}
      <Route path="/*" element={<PhoneApp />} />
    </Routes>
  );
}