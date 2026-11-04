// Date helpers working on ISO calendar dates (YYYY-MM-DD) in UTC.

export const DAY_MS = 86_400_000;

export function isIsoDate(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(v) && !Number.isNaN(Date.parse(v.slice(0, 10)));
}

export function toIsoDate(d: Date | number): string {
  const date = typeof d === 'number' ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}

/** Today's date in the given IANA time zone (falls back to UTC). */
export function todayIn(timeZone = 'UTC', now: number = Date.now()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    return parts;
  } catch {
    return toIsoDate(now);
  }
}

export function parseIsoDate(s: string): number {
  return Date.parse(s.slice(0, 10) + 'T00:00:00Z');
}

export function addDays(iso: string, days: number): string {
  return toIsoDate(parseIsoDate(iso) + days * DAY_MS);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseIsoDate(b) - parseIsoDate(a)) / DAY_MS);
}

/** Monday-based start of week. */
export function startOfWeek(iso: string): string {
  const d = new Date(parseIsoDate(iso));
  const dow = (d.getUTCDay() + 6) % 7;
  return addDays(iso, -dow);
}

export function startOfMonth(iso: string): string {
  return iso.slice(0, 8) + '01';
}

export function addMonths(iso: string, months: number): string {
  const d = new Date(parseIsoDate(iso));
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return toIsoDate(d);
}
