// Calendar arithmetic for BIZOMAT Finance on 'YYYY-MM-DD' dates (no time zones: a date is the workspace's local day).
// The financial year starts on the first day of a configurable month: 1 July in Australia.

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isIsoDate(s: unknown): s is string {
  if (typeof s !== 'string') return false;
  const m = ISO.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

const toDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const fromDate = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(iso: string, n: number): string {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return fromDate(d);
}

/** The same day n months on, clamped to the month's last day (31 Jan + 1 month = 28 or 29 Feb). */
export function addMonths(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1 + n, 1));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  first.setUTCDate(Math.min(d, last));
  return fromDate(first);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000);
}

export const monthOf = (iso: string) => iso.slice(0, 7);
export const startOfMonth = (iso: string) => `${iso.slice(0, 7)}-01`;
export function endOfMonth(iso: string): string {
  return addDays(addMonths(startOfMonth(iso), 1), -1);
}

/** 'YYYY-MM' months from the month of `from` to the month of `to`, inclusive (at most 60). */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let m = startOfMonth(from);
  while (m <= to && out.length < 60) {
    out.push(monthOf(m));
    m = addMonths(m, 1);
  }
  return out;
}

/** The first day of the financial year containing the date. */
export function fyStart(iso: string, startMonth: number): string {
  const [y, m] = iso.split('-').map(Number);
  const year = m >= startMonth ? y : y - 1;
  return `${year}-${String(startMonth).padStart(2, '0')}-01`;
}

export function fyEnd(iso: string, startMonth: number): string {
  return addDays(addMonths(fyStart(iso, startMonth), 12), -1);
}

/** "FY 2026-27" for a year starting 1 July 2026; "2026" for a calendar year. */
export function fyLabel(startIso: string, startMonth: number): string {
  const y = Number(startIso.slice(0, 4));
  return startMonth === 1 ? String(y) : `FY ${y}-${String((y + 1) % 100).padStart(2, '0')}`;
}

export const PERIODS = {
  this_month: 'This month',
  last_month: 'Last month',
  this_quarter: 'This quarter',
  last_quarter: 'Last quarter',
  this_fy: 'This financial year',
  last_fy: 'Last financial year',
  last_12_months: 'Last 12 months',
} as const;
export type PeriodKey = keyof typeof PERIODS;

/** Quarters follow the financial year (July to September is the first quarter of an Australian year). */
export function period(key: PeriodKey, today: string, startMonth: number): { from: string; to: string } {
  switch (key) {
    case 'this_month':
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case 'last_month': {
      const s = addMonths(startOfMonth(today), -1);
      return { from: s, to: endOfMonth(s) };
    }
    case 'this_quarter':
    case 'last_quarter': {
      const fy = fyStart(today, startMonth);
      const q = Math.floor(monthsBetween(fy, today).length - 1) / 3;
      let from = addMonths(fy, Math.floor(q) * 3);
      if (key === 'last_quarter') from = addMonths(from, -3);
      return { from, to: addDays(addMonths(from, 3), -1) };
    }
    case 'this_fy':
      return { from: fyStart(today, startMonth), to: fyEnd(today, startMonth) };
    case 'last_fy': {
      const from = addMonths(fyStart(today, startMonth), -12);
      return { from, to: addDays(fyStart(today, startMonth), -1) };
    }
    case 'last_12_months':
      return { from: addMonths(startOfMonth(today), -11), to: endOfMonth(today) };
  }
}

export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';
export const FREQUENCIES: Frequency[] = ['weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];
export const FREQUENCY_LABELS: Record<Frequency, string> = { weekly: 'Weekly', fortnightly: 'Fortnightly', monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' };

export function nextDate(iso: string, f: Frequency, anchorDay?: number): string {
  switch (f) {
    case 'weekly':
      return addDays(iso, 7);
    case 'fortnightly':
      return addDays(iso, 14);
    case 'monthly':
    case 'quarterly':
    case 'yearly': {
      const n = f === 'monthly' ? 1 : f === 'quarterly' ? 3 : 12;
      const next = addMonths(iso, n);
      // Keep the original day of the month when the previous month was too short for it (31st -> 28th -> 31st).
      if (!anchorDay) return next;
      const last = Number(endOfMonth(next).slice(8));
      return `${next.slice(0, 8)}${String(Math.min(anchorDay, last)).padStart(2, '0')}`;
    }
  }
}

/** Today in a time zone, as 'YYYY-MM-DD'. */
export function todayIn(timeZone: string, at = Date.now()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(at));
  } catch {
    return new Date(at).toISOString().slice(0, 10);
  }
}
