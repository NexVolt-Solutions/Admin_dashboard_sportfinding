const MS_HOUR = 3600000;

function partsInTimeZone(utcMs: number, timeZone: string) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });
  const parts = f.formatToParts(new Date(utcMs));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    h: Number(get("hour")),
    mi: Number(get("minute")),
  };
}

/**
 * Admin UI should show match wall-clock in the same zone users expect (venue / PK),
 * not necessarily the laptop's OS timezone. Consumer apps often hard-code that region.
 *
 * - Default: Asia/Karachi (Pakistan, matches common Peshawar/Lahore usage).
 * - Set VITE_MATCH_DISPLAY_TIMEZONE=browser to use the viewer's OS timezone (old behavior).
 * - Or set to any IANA zone, e.g. Europe/London.
 */
export function getMatchDisplayTimeZone(): string {
  const raw = import.meta.env.VITE_MATCH_DISPLAY_TIMEZONE as string | undefined;
  if (raw === "browser") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  if (raw && raw.trim().length > 0) {
    return raw.trim();
  }
  return "Asia/Karachi";
}

/** "06 May 2026 · 06:30 AM" style (matches list / detail). */
export function formatMatchScheduledAt(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const tz = getMatchDisplayTimeZone();
  const dateStr = d.toLocaleDateString("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} · ${timeStr}`;
}

export function formatMatchScheduledDateTimeParts(iso: string): {
  date: string;
  time: string;
} {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: "—", time: "—" };
  const tz = getMatchDisplayTimeZone();
  return {
    date: d.toLocaleDateString("en-GB", {
      timeZone: tz,
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

/** Values for `<input type="date">` and `<input type="time">` in the display zone. */
export function getMatchScheduleInputsFromIso(iso: string): {
  date: string;
  time: string;
} {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: "", time: "" };
  const tz = getMatchDisplayTimeZone();
  const p = partsInTimeZone(d.getTime(), tz);
  const date = `${String(p.y).padStart(4, "0")}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
  const time = `${String(p.h).padStart(2, "0")}:${String(p.mi).padStart(2, "0")}`;
  return { date, time };
}

/**
 * Convert wall-clock in `timeZone` to UTC epoch ms (for saving `scheduled_at` as ISO).
 * Uses a bounded binary search — good enough for sports scheduling; rare DST edge cases may exist.
 */
export function wallClockInTimeZoneToUtcMs(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  timeZone: string
): number {
  const target = { y, m: mo, d, h, mi };
  let lo = Date.UTC(y, mo - 1, d) - 2 * MS_HOUR;
  let hi = Date.UTC(y, mo - 1, d) + 26 * MS_HOUR;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const p = partsInTimeZone(mid, timeZone);
    const sign =
      p.y !== target.y
        ? p.y - target.y
        : p.m !== target.m
          ? p.m - target.m
          : p.d !== target.d
            ? p.d - target.d
            : p.h !== target.h
              ? p.h - target.h
              : p.mi - target.mi;
    if (sign === 0) return Math.floor(mid);
    if (sign < 0) lo = mid;
    else hi = mid;
  }
  return Math.floor((lo + hi) / 2);
}

export function matchScheduleInputsToUtcIso(
  date: string,
  time: string,
  timeZone = getMatchDisplayTimeZone()
): string | undefined {
  if (!date || !time) return undefined;
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  if ([y, mo, d, h, mi].some((n) => Number.isNaN(n))) return undefined;
  const ms = wallClockInTimeZoneToUtcMs(y, mo, d, h, mi, timeZone);
  return new Date(ms).toISOString();
}
