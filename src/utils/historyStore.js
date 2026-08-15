// 프론트엔드만으로 "이전 기록"을 유지하기 위한 localStorage 저장소.
// 오늘자 실제 알림 상태(Home.jsx가 계산한 것)를 매번 스냅샷으로 저장해두고,
// History.jsx에서 지난 날짜를 조회할 때 이걸 읽어옵니다.
// (나중에 백엔드가 생기면 이 파일의 두 함수만 API 호출로 바꾸면 됩니다.)

const STORAGE_KEY = "bloomframe_history_records";

function dateKey(year, month, day) {
  return `${year}-${month + 1}-${day}`; // month는 0-indexed로 받아서 +1
}

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

// 오늘자 상태 목록(예: [{type:"med", status:"success"}, ...])을 오늘 날짜로 저장
export function saveTodayRecord(iconData) {
  const now = new Date();
  const key = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const all = loadAll();
  all[key] = iconData;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage 못 쓰는 환경(시크릿 모드 등)이면 조용히 무시 — 기록 저장만 안 될 뿐 앱은 정상 동작
  }
}

// 특정 날짜의 저장된 기록을 가져옴. 기록이 없으면 null (그 날은 앱을 안 썼거나 데이터가 없다는 뜻)
export function getRecord(year, month, day) {
  const all = loadAll();
  return all[dateKey(year, month, day)] || null;
}