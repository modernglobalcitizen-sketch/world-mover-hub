import { useState, useEffect } from "react";

const WEBINAR_DATE = new Date("2026-03-12T15:00:00Z");

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = Math.max(0, WEBINAR_DATE.getTime() - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: diff === 0,
    };
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft.expired) {
    return (
      <p className="text-lg font-semibold text-primary-foreground animate-pulse">
        🔴 The webinar is live now!
      </p>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm px-4 py-3 min-w-[4rem]"
        >
          <span className="text-2xl sm:text-3xl font-bold font-display text-primary-foreground tabular-nums">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
