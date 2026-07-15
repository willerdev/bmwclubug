"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/utils";

export function LiveCountdown({
  date,
  time,
  variant = "compact",
}: {
  date: string;
  time?: string;
  variant?: "compact" | "grid";
}) {
  const [countdown, setCountdown] = useState(() => getCountdown(date, time));

  useEffect(() => {
    setCountdown(getCountdown(date, time));
    const id = setInterval(() => setCountdown(getCountdown(date, time)), 1000);
    return () => clearInterval(id);
  }, [date, time]);

  if (countdown.expired) {
    return <span className="text-white/45 text-sm">Event started</span>;
  }

  if (variant === "compact") {
    return (
      <span className="text-bmw-blue font-mono text-sm">
        {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
      </span>
    );
  }

  const units = [
    { v: countdown.days, l: "Days" },
    { v: countdown.hours, l: "Hours" },
    { v: countdown.minutes, l: "Min" },
    { v: countdown.seconds, l: "Sec" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {units.map((u) => (
        <div key={u.l}>
          <div className="text-2xl font-bold text-bmw-blue">{u.v}</div>
          <div className="text-[10px] text-white/40">{u.l}</div>
        </div>
      ))}
    </div>
  );
}

export function CountdownBoxes({ date, time }: { date: string; time?: string }) {
  const [countdown, setCountdown] = useState(() => getCountdown(date, time));

  useEffect(() => {
    setCountdown(getCountdown(date, time));
    const id = setInterval(() => setCountdown(getCountdown(date, time)), 1000);
    return () => clearInterval(id);
  }, [date, time]);

  if (countdown.expired) {
    return <p className="text-white/50 text-sm">This event has started or ended.</p>;
  }

  const units = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Min" },
    { value: countdown.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-2 justify-center">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-lg font-bold text-bmw-blue">
            {u.value}
          </div>
          <div className="text-[10px] text-white/40 mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
