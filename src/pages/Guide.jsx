import React from "react";
import { C } from "../styles/tokens";
import { TopBar } from "../components/common/Layout";
import { BottomNav } from "../components/common/BottomNav";

const SECTIONS = [
  {
    title: "서비스 설명",
    body: "BloomFrame은 오랜기간 정체되어있던 알림 패러다임에 신선한 변화를 가져왔습니다. 각종 알림을 거대한 화면의 인테리어 소품으로 느껴보세요. 시인성을 극대화하여 알림의 정시 수행률을 극대화합니다.",
  },
  {
    title: "앱 이용 안내",
    body: "밑에 있는 프레임의 IoT, 홈, 마이페이지를 각각 탭하여 각각의 기능들을 살펴볼 수 있습니다.",
  },
  {
    title: "IoT 탭",
    body: "IoT 기기를 연결하고 관리할 수 있습니다. \n 기기 연결 탭을 통해 고유 넘버를 입력하여 IoT를 연결할 수 있고, \n 기기 관리 탭을 통해 기기의 이름을 바꾸고 추가 및 삭제하는 등의 관리를 할 수 있습니다.",
  },
  {
    title: "홈 탭",
    body: "홈 화면에서는 알람 기록과 목록을 확인하고 추가할 수 있습니다. \n 초록색은 이행한 것, 빨간색은 이행하지 않은 것, 회색은 예정된 알림입니다. \n 알림 목록을 통해 당일에 이행해야 할 알림의 목록을 확인하고 취소 및 제거할 수 있습니다.",
  },
  {
    title: "마이페이지 탭",
    body: "마이페이지에서는 전체적인 정보를 확인하고 수정할 수 있습니다.",
  },
];

export default function Guide() {
  const scrollId = React.useId().replace(/:/g, "");

  return (
    <div style={{ height: 890, display: "flex", flexDirection: "column" }}>
      <TopBar />
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "40px 35px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 35 }}>이용 안내</div>
        </div>

        <style>{`
          .vscroll-${scrollId} { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .vscroll-${scrollId}:hover { scrollbar-color: ${C.grayLine} transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar { width: 3px; }
          .vscroll-${scrollId}::-webkit-scrollbar-track { background: transparent; }
          .vscroll-${scrollId}::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .vscroll-${scrollId}:hover::-webkit-scrollbar-thumb { background: ${C.grayLine}; }
        `}</style>

        <div className={`vscroll-${scrollId}`} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 35px 40px" }}>
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{ marginBottom: i === SECTIONS.length - 1 ? 0 : 28 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.black, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 16, color: C.black, lineHeight: 1.6, fontWeight: 500, whiteSpace: "pre-line" }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}