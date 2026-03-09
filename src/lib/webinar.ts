export const WEBINAR_DATE = new Date("2026-03-12T15:00:00Z");

export function getLocalWebinarTime(): string {
  return WEBINAR_DATE.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
