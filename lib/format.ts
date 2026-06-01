export function asText(value: unknown, fallback = "Unknown") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function asNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatDateTime(value: unknown) {
  if (!value) return "No timestamp";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "No timestamp";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusTone(value: unknown) {
  const normalized = asText(value, "").toLowerCase();
  if (["online", "active", "open", "ok", "healthy", "resolved"].includes(normalized)) return "good";
  if (["warning", "watch", "pending", "planned", "relay_needed"].includes(normalized)) return "watch";
  if (["critical", "offline", "error", "failed", "dry"].includes(normalized)) return "bad";
  return "neutral";
}
