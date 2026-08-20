import { getMedications } from "./medications";
import { getMedicationAlarms, getExerciseAlarms, getCustomAlarms } from "./alarms";
import { fromBackendTime } from "../utils/format";

// 서버에 있는 약/운동/기타 정보를 전부 불러와서, 우리 앱 내부에서 쓰는 categories 형태로 변환
// (medication-alarms는 특정 약에 안 묶여있는 구조라, "약" 카테고리 하나가 meds 목록 + 공용 times를 같이 가짐)
//
// ⚠️ id는 매번 새로 만들지 않고 서버 id(serverId)를 그대로 씀 — 안 그러면 새로고침할 때마다
// 같은 알람인데도 "키"가 바뀌어서, 오늘 이미 인증한 기록이 다시 "대기 중"으로 보이는 버그가 생김.
// 카테고리 id도 타입별로 고정값 사용(우리 구조상 타입당 카테고리가 하나뿐이라 안전함).
export async function loadCategoriesFromServer() {
  const [medications, medAlarms, exerciseAlarms, customAlarms] = await Promise.all([
    getMedications().catch(() => []),
    getMedicationAlarms().catch(() => []),
    getExerciseAlarms().catch(() => []),
    getCustomAlarms().catch(() => []),
  ]);

  const toTime = (a) => ({ id: a.id, serverId: a.id, ...fromBackendTime(a.alarmTime) });

  const categories = [];

  if (medications.length > 0 || medAlarms.length > 0) {
    categories.push({
      id: "cat-med",
      type: "med",
      meds: medications.map((m) => ({
        id: m.id,
        serverId: m.id,
        name: m.name,
        freq: String(m.dosePerDay ?? "1"),
        timing: m.timing || "",
      })),
      times: medAlarms.map(toTime),
    });
  }

  if (exerciseAlarms.length > 0) {
    categories.push({
      id: "cat-exercise",
      type: "exercise",
      name: "운동",
      times: exerciseAlarms.map((a) => ({ ...toTime(a), exerciseName: a.exerciseName })),
    });
  }

  if (customAlarms.length > 0) {
    categories.push({
      id: "cat-other",
      type: "other",
      name: "기타",
      times: customAlarms.map((a) => ({ ...toTime(a), title: a.title })),
    });
  }

  return categories;
}