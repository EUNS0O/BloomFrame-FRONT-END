import {
  createCustomAlarm,
  createExerciseAlarm,
  createMedicationAlarm,
  deleteCustomAlarm,
  deleteExerciseAlarm,
  deleteMedicationAlarm,
  getCustomAlarms,
  getExerciseAlarms,
  getMedicationAlarms,
  updateCustomAlarm,
  updateExerciseAlarm,
  updateMedicationAlarm,
} from "./alarm";
import { createMedication, getMedications, updateMedication } from "./medications";
import { fromBackendTime, toBackendTime } from "../utils/format";
import { withStartDate } from "../utils/alarmStatus";

function asList(data) {
  return Array.isArray(data) ? data : [];
}

export function toFrontTime(alarmTime) {
  if (!alarmTime) return { hour: 12, minute: 0, ampm: "오전" };
  if (typeof alarmTime === "string") return fromBackendTime(alarmTime);
  const hour = Number(alarmTime.hour ?? 0);
  const minute = Number(alarmTime.minute ?? 0);
  return fromBackendTime(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
}

function toAlarmTime(t) {
  return toBackendTime(t);
}

async function persistTimes(times, { create, update }) {
  const saved = [];
  for (const time of times || []) {
    const alarmTime = toAlarmTime(time);
    if (time.serverId) {
      await update(time.serverId, { alarmTime });
      saved.push(time);
    } else {
      const created = await create({ alarmTime });
      saved.push({ ...time, id: created.id, serverId: created.id });
    }
  }
  return saved;
}

export async function persistCategory(category) {
  if (category.type === "med") {
    const meds = [];
    for (const med of category.meds || []) {
      const body = {
        name: med.name,
        dosePerDay: Number(med.freq) || 1,
        timing: med.timing?.trim() ? med.timing : "식후",
      };
      if (med.serverId) {
        await updateMedication(med.serverId, body);
        meds.push(med);
      } else {
        const created = await createMedication(body);
        meds.push({ ...med, id: created.id, serverId: created.id });
      }
    }
    const times = await persistTimes(category.times, {
      create: ({ alarmTime }) => createMedicationAlarm({ alarmTime }),
      update: (id, patch) => updateMedicationAlarm(id, patch),
    });
    return { ...category, meds, times };
  }

  if (category.type === "exercise") {
    const exerciseName = category.name || "운동";
    const times = await persistTimes(category.times, {
      create: ({ alarmTime }) => createExerciseAlarm({ exerciseName, alarmTime }),
      update: (id, patch) => updateExerciseAlarm(id, { ...patch, exerciseName }),
    });
    return { ...category, times };
  }

  const title = category.name || "기타";
  const times = await persistTimes(category.times, {
    create: ({ alarmTime }) => createCustomAlarm({ title, alarmTime }),
    update: (id, patch) => updateCustomAlarm(id, { ...patch, title }),
  });
  return { ...category, times };
}

export async function deleteAlarmOnServer(type, time) {
  const id = time.serverId || (typeof time.id === "string" ? time.id : null);
  if (!id) return;
  if (type === "med") await deleteMedicationAlarm(id);
  else if (type === "exercise") await deleteExerciseAlarm(id);
  else await deleteCustomAlarm(id);
}

function groupAlarms(alarms, nameKey, type, fallbackName, idPrefix) {
  const groups = new Map();
  for (const alarm of alarms) {
    const name = alarm[nameKey] || fallbackName;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(alarm);
  }
  return [...groups.entries()].map(([name, items]) => ({
    id: `${idPrefix}-${name}`,
    type,
    name,
    times: items.map((alarm) =>
      withStartDate({
        id: alarm.id,
        serverId: alarm.id,
        ...toFrontTime(alarm.alarmTime),
      })
    ),
  }));
}

export async function loadSchedule() {
  const [meds, medAlarms, exerciseAlarms, customAlarms] = await Promise.all([
    getMedications().catch(() => []),
    getMedicationAlarms().catch(() => []),
    getExerciseAlarms().catch(() => []),
    getCustomAlarms().catch(() => []),
  ]);

  const categories = [];
  const medList = asList(meds);
  const medTimes = asList(medAlarms);
  if (medList.length > 0 || medTimes.length > 0) {
    categories.push({
      id: "med",
      type: "med",
      meds: medList.map((med) => ({
        id: med.id,
        serverId: med.id,
        name: med.name,
        freq: String(med.dosePerDay ?? 1),
        timing: med.timing || "",
      })),
      times: medTimes.map((alarm) =>
        withStartDate({
          id: alarm.id,
          serverId: alarm.id,
          ...toFrontTime(alarm.alarmTime),
        })
      ),
    });
  }

  categories.push(
    ...groupAlarms(asList(exerciseAlarms), "exerciseName", "exercise", "운동", "exercise")
  );
  categories.push(
    ...groupAlarms(asList(customAlarms), "title", "other", "기타 추가", "other")
  );

  return { categories };
}
