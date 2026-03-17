export const WEBINAR_DATE = new Date("2026-03-28T15:00:00Z");

export function getLocalWebinarTime(): string {
  return WEBINAR_DATE.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "long",
  });
}

const POPULAR_TIMEZONES = [
  { zone: "America/New_York", label: "EST" },
  { zone: "America/Chicago", label: "CST" },
  { zone: "America/Los_Angeles", label: "PST" },
  { zone: "Europe/London", label: "GMT" },
  { zone: "Africa/Lagos", label: "WAT" },
  { zone: "Africa/Nairobi", label: "EAT" },
  { zone: "Asia/Kolkata", label: "IST" },
  { zone: "Asia/Manila", label: "PHT" },
];

export function getWebinarTimeInZones(): { label: string; time: string }[] {
  return POPULAR_TIMEZONES.map(({ zone, label }) => ({
    label,
    time: WEBINAR_DATE.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: zone,
    }),
  }));
}
