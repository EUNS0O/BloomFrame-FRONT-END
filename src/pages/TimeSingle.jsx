import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { nextId, toBackendTime } from "../utils/format";
import { C } from "../styles/tokens";
import { BackHeader } from "../components/common/BackHeader";
import { Btn } from "../components/common/Controls";
import { BottomButton } from "../components/common/BottomButton";
import { TimePicker } from "../components/widgets/TimePicker";
import { createExerciseAlarm, updateExerciseAlarm, createCustomAlarm, updateCustomAlarm } from "../api/alarms";

export default function TimeSingle() {
  const navigate = useNavigate();
  const { data, onboarding, wip, setWip, commitCategory } = useApp();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!wip) return null;

  const isDuplicate = (draft, times, excludeId) =>
    times.some(
      (t) =>
        t.id !== excludeId &&
        t.hour === draft.hour &&
        t.minute === draft.minute &&
        t.ampm === draft.ampm
    );

  // 현재 알람 시간이 오늘 기준으로 이미 지났다면 내일부터 적용
  const getAlarmStartDate = (time) => {
    const now = new Date();

    let hour = Number(time.hour) % 12;
    if (time.ampm === "오후") {
      hour += 12;
    }

    const alarmDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      Number(time.minute),
      0,
      0
    );

    // 현재 시각보다 이전이면 내일부터 적용
    if (alarmDate < now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    return `${alarmDate.getFullYear()}-${String(
      alarmDate.getMonth() + 1
    ).padStart(2, "0")}-${String(alarmDate.getDate()).padStart(2, "0")}`;
  };

  // 온보딩 중이어도 "이미 하나 이상 등록한 뒤 또 추가"하는 경우엔
  // 이미지 선택을 다시 안 거침
  const isFirstCategory = data.categories.length === 0;

  const handleConfirm = async () => {
    if (submitting) return;

    const draft = wip.draftTime || {
      hour: 1,
      minute: 0,
      ampm: "오전",
    };

    const currentTimes = Array.isArray(wip.times) ? wip.times : [];

    if (isDuplicate(draft, currentTimes, wip.editingTimeId)) {
      setError("이미 등록된 시간이에요. 다른 시간을 선택해 주세요.");
      return;
    }

    setSubmitting(true);
    setError("");

    const startDate = getAlarmStartDate(draft);
    const alarmTime = toBackendTime(draft);

    try {
      // 약(med)은 이 화면에서 직접 서버 호출 안 함 — TimeList.jsx에서 회차별로 따로 처리
      if (wip.type !== "med") {
        const isExercise = wip.type === "exercise";
        const editingTime = wip.editingTimeId ? currentTimes.find((t) => t.id === wip.editingTimeId) : null;

        if (editingTime?.serverId) {
          // 기존에 등록된 알람 수정
          if (isExercise) await updateExerciseAlarm(editingTime.serverId, { alarmTime });
          else await updateCustomAlarm(editingTime.serverId, { alarmTime });
        } else {
          // 새 알람 등록
          const res = isExercise
            ? await createExerciseAlarm({ exerciseName: wip.name, alarmTime })
            : await createCustomAlarm({ title: wip.name, alarmTime });
          // 서버가 새로 만들어준 id를 저장해둬야 나중에 수정/삭제할 때 씀
          if (res?.id) draft.serverId = res.id;
        }
      }
    } catch (e) {
      setError(e.message || "알람 저장에 실패했어요.");
      setSubmitting(false);
      return;
    }

    const updatedWip = wip.editingTimeId
      ? {
          ...wip,
          times: currentTimes.map((t) =>
            t.id === wip.editingTimeId
              ? {
                  ...t,
                  ...draft,
                  startDate,
                }
              : t
          ),
          editingTimeId: null,
        }
      : {
          ...wip,
          times: [
            ...currentTimes,
            {
              id: nextId(),
              ...draft,
              startDate,
            },
          ],
        };

    setSubmitting(false);

    if (wip.type === "med") {
      setWip(updatedWip);
      navigate("/onboarding/time-list");
    } else if (onboarding && isFirstCategory) {
      setWip(updatedWip);
      navigate("/onboarding/image-select");
    } else {
      commitCategory(updatedWip);
      navigate(onboarding ? "/onboarding/category/more" : "/home");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "0 30px 100px",
        overflowY: "auto",
      }}
    >
      <BackHeader progress={onboarding ? 80 : undefined} />

      <TimePicker
        value={
          wip.draftTime || {
            hour: 1,
            minute: 0,
            ampm: "오전",
          }
        }
        onChange={(v) =>
          setWip((w) => ({
            ...w,
            draftTime: v,
          }))
        }
      />

      {error && (
        <div
          style={{
            fontSize: 12.5,
            color: "#E5484D",
            textAlign: "center",
            marginTop: -70,
            marginBottom: 40,
            paddingLeft: 12,
          }}
        >
          {error}
        </div>
      )}

      <BottomButton variant="high">
        <Btn
          disabled={submitting}
          onClick={handleConfirm}
          padding="10px 14px"
        >
          {submitting ? "저장 중..." : "확인"}
        </Btn>
      </BottomButton>
    </div>
  );
}