// Project controls (scheduling, critical path, baselines, earned value): types and labels shared by the server and
// the browser. The calculations themselves run on the server only (src/worker/services/schedule/).

export const LINK_TYPES = ['FS', 'SS', 'FF', 'SF'] as const;
export type LinkType = (typeof LINK_TYPES)[number];
export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  FS: 'Finish to start',
  SS: 'Start to start',
  FF: 'Finish to finish',
  SF: 'Start to finish',
};

export const DURATION_UNITS = ['minutes', 'hours', 'days', 'weeks'] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];

export const CONSTRAINT_TYPES = ['ASAP', 'SNET', 'SNLT', 'FNET', 'FNLT', 'MSO', 'MFO'] as const;
export type ConstraintType = (typeof CONSTRAINT_TYPES)[number];
export const CONSTRAINT_LABELS: Record<ConstraintType, string> = {
  ASAP: 'As soon as possible',
  SNET: 'Start no earlier than',
  SNLT: 'Start no later than',
  FNET: 'Finish no earlier than',
  FNLT: 'Finish no later than',
  MSO: 'Must start on',
  MFO: 'Must finish on',
};

export const SCHEDULING_TYPES = ['fixed_duration', 'fixed_work', 'fixed_units'] as const;
export type SchedulingType = (typeof SCHEDULING_TYPES)[number];
export const SCHEDULING_TYPE_LABELS: Record<SchedulingType, string> = {
  fixed_duration: 'Fixed duration (default): changing work or units keeps the duration',
  fixed_work: 'Fixed work: duration = work / units',
  fixed_units: 'Fixed units: work = duration x units',
};

export const EARNING_METHODS = ['percent_complete', 'physical', 'weighted_milestones', 'zero_hundred', 'fifty_fifty', 'units'] as const;
export type EarningMethod = (typeof EARNING_METHODS)[number];
export const EARNING_METHOD_LABELS: Record<EarningMethod, string> = {
  percent_complete: 'Percent complete',
  physical: 'Physical percent complete',
  weighted_milestones: 'Weighted milestones',
  zero_hundred: '0/100 (earned at finish)',
  fifty_fifty: '50/50 (half at start, half at finish)',
  units: 'Units completed',
};

export const PV_PROFILES = ['linear', 'front', 'back', 's_curve', 'start', 'finish', 'custom', 'milestones'] as const;
export type PvProfile = (typeof PV_PROFILES)[number];
export const PV_PROFILE_LABELS: Record<PvProfile, string> = {
  linear: 'Linear (evenly over the task)',
  front: 'Front-loaded',
  back: 'Back-loaded',
  s_curve: 'S-curve',
  start: 'All at start',
  finish: 'All at finish',
  custom: 'Custom curve',
  milestones: 'Milestone payments',
};

export type Criticality = 'critical' | 'near_critical' | 'non_critical' | 'invalid' | 'unscheduled';
export const CRITICALITY_LABELS: Record<Criticality, string> = {
  critical: 'Critical',
  near_critical: 'Near-critical',
  non_critical: 'Non-critical',
  invalid: 'Cannot be calculated',
  unscheduled: 'Not scheduled',
};

export interface CalendarException {
  /** First and last day (inclusive), YYYY-MM-DD. */
  start: string;
  end: string;
  name: string;
  /** false: a holiday or shutdown; true: an extra working day (for example a working Saturday). */
  working: boolean;
  kind?: 'holiday' | 'shutdown' | 'project' | 'working';
}

export interface CalendarDefinition {
  name: string;
  /** IANA time zone in which dates and working hours are read. */
  timezone: string;
  /** ISO weekdays that are working days: 1 = Monday ... 7 = Sunday. */
  workingDays: number[];
  /** Working hours, HH:MM, local time. */
  dayStart: string;
  dayEnd: string;
  breaks: { start: string; end: string }[];
  exceptions: CalendarException[];
}

export const DEFAULT_CALENDAR: CalendarDefinition = {
  name: 'Standard (Monday to Friday)',
  timezone: 'UTC',
  workingDays: [1, 2, 3, 4, 5],
  dayStart: '08:00',
  dayEnd: '17:00',
  breaks: [{ start: '12:00', end: '13:00' }],
  exceptions: [],
};

export interface ScheduleSettings {
  /** Task key prefix, for example LASER (keys LASER-0001). */
  prefix: string | null;
  /** The timeline column holding planned start and finish. */
  timelineColumnId: string | null;
  /** Project start (YYYY-MM-DD); empty: the earliest planned start. */
  projectStart: string | null;
  /** Critical when total float is at or below this many working days; near-critical up to the second. */
  criticalDays: number;
  nearCriticalDays: number;
  defaultEarningMethod: EarningMethod;
  defaultPvProfile: PvProfile;
}

export const DEFAULT_SCHEDULE_SETTINGS: Omit<ScheduleSettings, 'prefix' | 'timelineColumnId'> = {
  projectStart: null,
  criticalDays: 0,
  nearCriticalDays: 5,
  defaultEarningMethod: 'percent_complete',
  defaultPvProfile: 'linear',
};

export interface ScheduleWarning {
  code:
    | 'cycle'
    | 'constraint_conflict'
    | 'date_conflict'
    | 'missing_duration'
    | 'open_start'
    | 'open_end'
    | 'disconnected'
    | 'summary_link'
    | 'actual_conflict';
  message: string;
  itemIds: string[];
}

export interface TaskScheduleDTO {
  itemId: string;
  key: string | null;
  wbs: string;
  name: string;
  groupId: string;
  parentItemId: string | null;
  summary: boolean;
  milestone: boolean;
  /** Planned (current plan) dates from the timeline column. */
  plannedStart: string | null;
  plannedFinish: string | null;
  durationMinutes: number | null;
  durationUnit: DurationUnit;
  /** Working days (duration / hours per day) for display. */
  durationDays: number | null;
  /** Calendar days from start to finish, inclusive. */
  elapsedDays: number | null;
  remainingMinutes: number | null;
  actualStart: string | null;
  actualFinish: string | null;
  actualDurationDays: number | null;
  percentComplete: number | null;
  physicalPercent: number | null;
  constraintType: ConstraintType;
  constraintDate: string | null;
  schedulingType: SchedulingType;
  workMinutes: number | null;
  units: number | null;
  earningMethod: EarningMethod;
  pvProfile: PvProfile;
  owners: string[];
  // CPM results (null when not scheduled).
  earlyStart: string | null;
  earlyFinish: string | null;
  lateStart: string | null;
  lateFinish: string | null;
  totalFloatDays: number | null;
  freeFloatDays: number | null;
  criticality: Criticality;
  predecessors: string[];
  successors: string[];
  conflicts: string[];
}

export interface LinkDTO {
  id: string;
  predecessorId: string;
  successorId: string;
  type: LinkType;
  lagMinutes: number;
  lagUnit: DurationUnit;
  /** 'link': a typed dependency; 'column': taken from the board's Dependency column (finish to start, no lag). */
  source: 'link' | 'column';
  /** Relationship float in working days, and whether it lies on a critical path. */
  floatDays: number | null;
  critical: boolean;
}

export interface ScheduleSummaryDTO {
  projectStart: string | null;
  projectFinish: string | null;
  /** Working days from project start to finish along the critical path. */
  criticalDurationDays: number | null;
  counts: Record<Criticality, number>;
  criticalPaths: string[][];
  valid: boolean;
  hoursPerDay: number;
}

export interface ScheduleDTO {
  boardId: string;
  settings: ScheduleSettings;
  calendar: CalendarDefinition;
  calendarScope: 'project' | 'organisation' | 'default';
  tasks: TaskScheduleDTO[];
  links: LinkDTO[];
  summary: ScheduleSummaryDTO;
  warnings: ScheduleWarning[];
  /** Fingerprint of every input; results are recalculated whenever it changes. */
  inputsVersion: string;
  calculatedAt: number;
  canEdit: boolean;
  canManage: boolean;
}

/** "LASER-0001" for prefix LASER and number 1. */
export function formatTaskKey(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(4, '0')}`;
}

export const TASK_KEY_RE = /^[A-Z][A-Z0-9]{1,9}-\d{1,9}$/;
export const PREFIX_RE = /^[A-Z][A-Z0-9]{1,9}$/;

/** Parses "A FS+2d", "SS-1d", "FF+4h" lag strings into minutes with the calendar's hours per day. */
export function lagToMinutes(value: number, unit: DurationUnit, hoursPerDay: number, daysPerWeek: number): number {
  switch (unit) {
    case 'minutes':
      return Math.round(value);
    case 'hours':
      return Math.round(value * 60);
    case 'weeks':
      return Math.round(value * daysPerWeek * hoursPerDay * 60);
    case 'days':
    default:
      return Math.round(value * hoursPerDay * 60);
  }
}

export function minutesToUnit(minutes: number, unit: DurationUnit, hoursPerDay: number, daysPerWeek: number): number {
  switch (unit) {
    case 'minutes':
      return minutes;
    case 'hours':
      return minutes / 60;
    case 'weeks':
      return minutes / (daysPerWeek * hoursPerDay * 60);
    case 'days':
    default:
      return minutes / (hoursPerDay * 60);
  }
}

/** "FS+2d", "SS", "FF-1d" for display. */
export function formatLink(type: LinkType, lagMinutes: number, unit: DurationUnit, hoursPerDay: number, daysPerWeek: number): string {
  if (!lagMinutes) return type;
  const v = minutesToUnit(lagMinutes, unit, hoursPerDay, daysPerWeek);
  const short = { minutes: 'min', hours: 'h', days: 'd', weeks: 'w' }[unit];
  return `${type}${v > 0 ? '+' : ''}${Math.round(v * 100) / 100}${short}`;
}
