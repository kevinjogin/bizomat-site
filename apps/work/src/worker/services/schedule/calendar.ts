// Working-time calendar. Every schedule calculation runs on a single straight axis of WORKING minutes: offset 0 is the
// first minute of the calendar's epoch day, and each working minute adds one. Weekends, holidays, shutdowns, breaks
// and the hours of the working day are all handled here, once; durations, lags and floats are then plain arithmetic on
// the axis (a lag of 2 working days is 2 x hours-per-day x 60 working minutes, whatever lies in between).
//
// Dates are calendar dates (YYYY-MM-DD) in the calendar's own time zone; times are HH:MM local. Nothing here depends
// on the server's time zone.

import { CalendarDefinition, DEFAULT_CALENDAR, type CalendarException } from '../../../shared/schedule';
import { addDays, diffDays, isIsoDate, parseIsoDate } from '../../../shared/dates';

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$|^24:00$/;

function minutesOf(hhmm: string): number {
  if (hhmm === '24:00') return 1440;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function hhmm(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

/** Problems with a calendar definition, in plain words; empty when it is usable. */
export function calendarProblems(def: CalendarDefinition): string[] {
  const out: string[] = [];
  try {
    new Intl.DateTimeFormat('en', { timeZone: def.timezone });
  } catch {
    out.push(`Unknown time zone: ${def.timezone}`);
  }
  if (!Array.isArray(def.workingDays) || !def.workingDays.length || def.workingDays.some((d) => !Number.isInteger(d) || d < 1 || d > 7)) out.push('Choose at least one working day');
  if (!HHMM.test(def.dayStart) || !HHMM.test(def.dayEnd) || minutesOf(def.dayEnd) <= minutesOf(def.dayStart)) out.push('The working day must end after it starts');
  for (const b of def.breaks ?? []) {
    if (!HHMM.test(b.start) || !HHMM.test(b.end) || minutesOf(b.end) <= minutesOf(b.start)) out.push(`Break ${b.start}-${b.end} is not a time range`);
    else if (minutesOf(b.start) < minutesOf(def.dayStart) || minutesOf(b.end) > minutesOf(def.dayEnd)) out.push(`Break ${b.start}-${b.end} is outside the working day`);
  }
  for (const e of def.exceptions ?? []) {
    if (!isIsoDate(e.start) || !isIsoDate(e.end) || e.end < e.start) out.push(`Exception "${e.name}" needs a start and end date`);
    else if (diffDays(e.start, e.end) > 366) out.push(`Exception "${e.name}" is longer than a year`);
  }
  if (!out.length && new WorkCalendar(def, '2000-01-01').minutesPerDay <= 0) out.push('Breaks cover the whole working day');
  return out;
}

export function normaliseCalendar(input: Partial<CalendarDefinition> | null | undefined): CalendarDefinition {
  const d = { ...DEFAULT_CALENDAR, ...(input ?? {}) };
  return {
    name: String(d.name || DEFAULT_CALENDAR.name).slice(0, 100),
    timezone: d.timezone || 'UTC',
    workingDays: Array.from(new Set(d.workingDays)).sort(),
    dayStart: d.dayStart,
    dayEnd: d.dayEnd,
    breaks: (d.breaks ?? []).slice(0, 6),
    exceptions: (d.exceptions ?? []).slice(0, 500).map((e: CalendarException) => ({ start: e.start, end: e.end, name: String(e.name ?? '').slice(0, 100), working: !!e.working, ...(e.kind ? { kind: e.kind } : {}) })),
  };
}

export class WorkCalendar {
  readonly def: CalendarDefinition;
  readonly epoch: string;
  /** Working intervals of a standard working day, minutes after midnight. */
  readonly intervals: [number, number][];
  readonly minutesPerDay: number;
  readonly hoursPerDay: number;
  readonly daysPerWeek: number;
  private readonly exceptions = new Map<string, boolean>();
  /** cum[i] = working minutes from the epoch to the start of day i. */
  private cum: number[] = [0];

  constructor(def: CalendarDefinition, epoch: string) {
    this.def = def;
    this.epoch = epoch;
    const start = minutesOf(def.dayStart);
    const end = minutesOf(def.dayEnd);
    let iv: [number, number][] = [[start, end]];
    for (const b of [...(def.breaks ?? [])].sort((a, z) => minutesOf(a.start) - minutesOf(z.start))) {
      const bs = minutesOf(b.start);
      const be = minutesOf(b.end);
      iv = iv.flatMap(([s, e]) => (be <= s || bs >= e ? [[s, e] as [number, number]] : ([[s, Math.max(s, bs)], [Math.min(e, be), e]] as [number, number][]).filter(([a, z]) => z > a)));
    }
    this.intervals = iv;
    this.minutesPerDay = iv.reduce((n, [s, e]) => n + (e - s), 0);
    this.hoursPerDay = this.minutesPerDay / 60;
    this.daysPerWeek = def.workingDays.length;
    // Later exceptions win where they overlap (a working day inside a shutdown, for example).
    for (const ex of def.exceptions ?? []) {
      const n = Math.min(366, Math.max(0, diffDays(ex.start, ex.end)));
      for (let i = 0; i <= n; i++) this.exceptions.set(addDays(ex.start, i), ex.working);
    }
  }

  isWorkingDay(date: string): boolean {
    const ex = this.exceptions.get(date);
    if (ex !== undefined) return ex;
    const dow = new Date(parseIsoDate(date)).getUTCDay();
    return this.def.workingDays.includes(dow === 0 ? 7 : dow);
  }

  minutesOn(date: string): number {
    return this.isWorkingDay(date) ? this.minutesPerDay : 0;
  }

  private index(date: string): number {
    return Math.max(0, diffDays(this.epoch, date));
  }

  private dateAt(index: number): string {
    return addDays(this.epoch, index);
  }

  private ensure(index: number) {
    if (index > 400_000) throw new Error('Date out of range for the schedule calendar');
    for (let i = this.cum.length; i <= index; i++) this.cum.push(this.cum[i - 1] + this.minutesOn(this.dateAt(i - 1)));
  }

  private cumAt(index: number): number {
    this.ensure(index);
    return this.cum[index];
  }

  /** The first working minute on or after the start of `date`. */
  startOffset(date: string): number {
    return this.cumAt(this.index(date));
  }

  /** The end of the working time of `date` (for a non-working day: the end of the previous working day). */
  finishOffset(date: string): number {
    return this.cumAt(this.index(date) + 1);
  }

  /** Offset of a local date and time (minutes into the day); times outside working hours snap forward. */
  offsetAt(date: string, minuteOfDay: number): number {
    const base = this.startOffset(date);
    if (!this.isWorkingDay(date)) return base;
    let n = 0;
    for (const [s, e] of this.intervals) {
      if (minuteOfDay <= s) break;
      n += Math.min(e, minuteOfDay) - s;
    }
    return base + n;
  }

  /**
   * Start semantics: the smallest day i with cum[i + 1] > offset (the day on which work at `offset` happens).
   * Finish semantics: the smallest day i with cum[i + 1] >= offset (the day on which work ending at `offset` ends).
   */
  private dayFor(offset: number, finish: boolean): number {
    const need = (last: number) => (finish ? last >= offset : last > offset);
    while (!need(this.cum[this.cum.length - 1])) this.ensure(this.cum.length + 366);
    let lo = 0;
    let hi = this.cum.length - 2;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (need(this.cum[mid + 1])) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  /** The working day on which work at `offset` starts. */
  dateAtStart(offset: number): string {
    return this.dateAt(this.dayFor(Math.max(0, offset), false));
  }

  /** The working day on which work ending at `offset` finishes. */
  dateAtFinish(offset: number): string {
    if (offset <= 0) return this.dateAtStart(0);
    return this.dateAt(this.dayFor(offset, true));
  }

  /** Local HH:MM of an offset, for sub-day durations. */
  timeAt(offset: number, finish: boolean): string {
    const date = finish ? this.dateAtFinish(offset) : this.dateAtStart(offset);
    let left = offset - this.startOffset(date);
    for (const [s, e] of this.intervals) {
      const len = e - s;
      if (finish ? left <= len : left < len) return hhmm(s + left);
      left -= len;
    }
    return hhmm(this.intervals[this.intervals.length - 1]?.[1] ?? 0);
  }

  /** Working minutes from the start of `start` to the end of `finish` (inclusive dates). */
  workingMinutesBetween(start: string, finish: string): number {
    if (finish < start) return 0;
    return this.finishOffset(finish) - this.startOffset(start);
  }

  /** Finish date of work that starts on `start` and lasts `minutes` working minutes. */
  finishDateFor(start: string, minutes: number): string {
    const s = this.startOffset(start);
    return minutes <= 0 ? this.dateAtStart(s) : this.dateAtFinish(s + minutes);
  }

  /** Number of working days in [start, finish], inclusive. */
  workingDaysBetween(start: string, finish: string): number {
    let n = 0;
    for (let d = start; d <= finish; d = addDays(d, 1)) if (this.isWorkingDay(d)) n++;
    return n;
  }
}
