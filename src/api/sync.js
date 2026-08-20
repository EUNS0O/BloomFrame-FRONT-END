import { getMedications } from "./medications";
import { getMedicationAlarms, getExerciseAlarms, getCustomAlarms } from "./alarms";
import { nextId, fromBackendTime } from "../utils/format";

// 서버에 있는 약/운동/기타 정보를 전부 불러와서, 우리 앱 내부에서 쓰는 categories 형태로 변환
// (medication-alarms는 특정 약에 안 묶여있는 구조라, "약" 카테고리 하나가 meds 목록 + 공용 times를 같이 가짐)
export async function loadCategoriesFromServer() {
  const [medications, medAlarms, exerciseAlarms, customAlarms] = await Promise.all([
    getMedications().catch(() => []),
    getMedicationAlarms().catch(() => []),
    getExerciseAlarms().catch(() => []),
    getCustomAlarms().catch(() => []),
  ]);

  const toTime = (a) => ({ id: nextId(), serverId: a.id, ...fromBackendTime(a.alarmTime) });

  const categories = [];

  if (medications.length > 0 || medAlarms.length > 0) {
    categories.push({
      id: nextId(),
      type: "med",
      meds: medications.map((m) => ({
        id: nextId(),
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
      id: nextId(),
      type: "exercise",
      name: "운동",
      times: exerciseAlarms.map((a) => ({ ...toTime(a), exerciseName: a.exerciseName })),
    });
  }

  if (customAlarms.length > 0) {
    categories.push({
      id: nextId(),
      type: "other",
      name: "기타",
      times: customAlarms.map((a) => ({ ...toTime(a), title: a.title })),
    });
  }

  return categories;
}