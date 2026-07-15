import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  const parsed = parseLocalDateTime(date);
  return parsed.toLocaleDateString("en-UG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Parse YYYY-MM-DD (and optional time) as local time — avoids UTC midnight timezone bugs. */
export function parseLocalDateTime(targetDate: string, targetTime?: string): Date {
  const datePart = String(targetDate).slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return new Date(targetDate);

  let hours = 0;
  let minutes = 0;
  const time = String(targetTime || "").trim();
  if (time) {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (match) {
      hours = Number(match[1]);
      minutes = Number(match[2]);
      const meridiem = match[3]?.toLowerCase();
      if (meridiem === "pm" && hours < 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;
    }
  } else {
    // Default to noon if no time so the countdown stays meaningful for the event day
    hours = 12;
  }

  return new Date(y, m - 1, d, hours, minutes, 0, 0);
}

export function getCountdown(targetDate: string, targetTime?: string) {
  const target = parseLocalDateTime(targetDate, targetTime).getTime();
  const diff = target - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

/** True when an upcoming event is within the next N days (not yet started). */
export function isEventUrgent(date: string, time?: string, withinDays = 4) {
  const countdown = getCountdown(date, time);
  return !countdown.expired && countdown.days < withinDays;
}

/** Whole years since a join/registration date (floored, min 0). */
export function yearsSinceJoined(joinedAt?: string | null) {
  if (!joinedAt) return 0;
  const joined = parseLocalDateTime(String(joinedAt).slice(0, 10));
  if (Number.isNaN(joined.getTime())) return 0;
  const now = new Date();
  let years = now.getFullYear() - joined.getFullYear();
  const monthDiff = now.getMonth() - joined.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < joined.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

export function formatMemberTenure(joinedAt?: string | null) {
  const years = yearsSinceJoined(joinedAt);
  if (years >= 1) return { short: `${years}y`, long: `${years} year${years === 1 ? "" : "s"} in club` };

  if (!joinedAt) return { short: "New", long: "New member" };
  const joined = parseLocalDateTime(String(joinedAt).slice(0, 10));
  const months =
    (new Date().getFullYear() - joined.getFullYear()) * 12 +
    (new Date().getMonth() - joined.getMonth());
  const adjusted = new Date().getDate() < joined.getDate() ? months - 1 : months;
  const m = Math.max(0, adjusted);
  if (m >= 1) return { short: `${m}mo`, long: `${m} month${m === 1 ? "" : "s"} in club` };
  return { short: "New", long: "New member" };
}
