import { apiFetch } from "./client";

// POST /api/verifications
// type: "MEDICATION" | "EXERCISE" | "CUSTOM"
export function postVerification({ deviceId, type, targetId, alertStage, scheduledAt }) {
  return apiFetch("/api/verifications", {
    method: "POST",
    body: JSON.stringify({
      device_id: deviceId,
      type,
      target_id: targetId,
      alert_stage: alertStage,
      scheduled_at: scheduledAt,
    }),
  });
}

// GET /api/verifications?user_id={id}&from={date}&to={date}
export function getVerificationLogs({ userId, from, to }) {
  const params = new URLSearchParams({ user_id: userId, from, to });
  return apiFetch(`/api/verifications?${params.toString()}`);
}
