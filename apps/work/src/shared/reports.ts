// Project report definitions shared by the server (which builds and renders reports) and the client (which offers
// the options). A report is built from recorded data only; see src/worker/services/reports/build.ts.

export const REPORT_TYPES = [
  'inception',
  'previous_month',
  'current_month',
  'custom',
  'monthly',
  'completion',
  'financial',
  'outstanding',
  'project_controls',
  'critical_path',
  'baseline_comparison',
  'earned_value',
  'completion_forecast',
] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  inception: 'Project inception to date',
  previous_month: 'Previous month',
  current_month: 'Current month to date',
  custom: 'Custom date range',
  monthly: 'Monthly progress report',
  completion: 'Project completion report',
  financial: 'Financial report',
  outstanding: 'Outstanding tasks report',
  project_controls: 'Project controls report',
  critical_path: 'Critical path report',
  baseline_comparison: 'Baseline comparison report',
  earned_value: 'Earned value report',
  completion_forecast: 'Project completion forecast',
};

/**
 * Report types about project controls (schedule, baseline, earned value). Their period runs from the project start to
 * the status date: the chosen end date, or today when none is chosen (never later than today).
 */
export const CONTROLS_REPORT_TYPES: readonly ReportType[] = ['project_controls', 'critical_path', 'baseline_comparison', 'earned_value', 'completion_forecast'];

export function isControlsReportType(type: ReportType): boolean {
  return CONTROLS_REPORT_TYPES.includes(type);
}

export const REPORT_SECTIONS = ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories', 'schedule', 'baseline', 'evm'] as const;
export type ReportSection = (typeof REPORT_SECTIONS)[number];

export const SECTION_LABELS: Record<ReportSection, string> = {
  cover: 'A. Project cover',
  summary: 'B. Executive summary',
  overview: 'C. Project overview',
  previous: 'D. Activities in the reporting period',
  current: 'E. Current activities',
  remaining: 'F. Remaining work',
  risks: 'G. Risks and issues',
  finance: 'H. Financial summary',
  next: 'I. Next period plan',
  timeline: 'J. Activity timeline',
  categories: 'K. Categories',
  schedule: 'L. Schedule and critical path',
  baseline: 'M. Baseline comparison',
  evm: 'N. Earned value and forecasts',
};

/** Project controls sections: built from the schedule at the report's status date (services/reports/controls.ts). */
export const CONTROLS_SECTIONS: readonly ReportSection[] = ['schedule', 'baseline', 'evm'];

/** Sections each report type starts with (people can switch any of them on or off). */
export const DEFAULT_SECTIONS: Record<ReportType, ReportSection[]> = {
  inception: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
  previous_month: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
  current_month: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'next', 'categories'],
  custom: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
  monthly: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
  completion: ['cover', 'summary', 'overview', 'previous', 'remaining', 'risks', 'finance', 'timeline', 'categories'],
  financial: ['cover', 'summary', 'finance'],
  outstanding: ['cover', 'overview', 'current', 'remaining', 'risks', 'next', 'categories'],
  project_controls: ['cover', 'summary', 'schedule', 'baseline', 'evm'],
  critical_path: ['cover', 'schedule'],
  baseline_comparison: ['cover', 'baseline'],
  earned_value: ['cover', 'evm'],
  completion_forecast: ['cover', 'summary', 'schedule', 'evm'],
};

export type ExportFormat = 'pdf' | 'xlsx' | 'html' | 'csv';

export interface ReportCommentary {
  summary?: string;
  achievements?: string;
  problems?: string;
  decisions?: string;
  nextPriorities?: string;
  resources?: string;
  /** The project manager's own assessment, shown next to the calculated status. */
  statusAssessment?: 'on_track' | 'at_risk' | 'off_track' | 'complete' | null;
}

export interface ReportOptions {
  type: ReportType;
  /**
   * Inclusive calendar dates (YYYY-MM-DD) in `timezone`. Needed for custom; computed for the others, except that the
   * project controls types take `end` as their status date (today when not given).
   */
  start?: string;
  end?: string;
  /** YYYY-MM for a monthly report. */
  month?: string;
  timezone?: string;
  /** Status label ids to list (empty: all). Totals always count every task. */
  statuses?: string[];
  /** Owners to list (empty: all). */
  owners?: string[];
  includeFinance?: boolean;
  includeActivity?: boolean;
  includeRisks?: boolean;
  includeUpcoming?: boolean;
  sections?: ReportSection[];
  commentary?: ReportCommentary;
  confidentiality?: string;
  /** The approved baseline the project controls sections compare with (empty: the latest). */
  baselineId?: string;
}

export const STATUS_LABELS: Record<'on_track' | 'at_risk' | 'off_track' | 'complete' | 'not_started', string> = {
  on_track: 'On track',
  at_risk: 'At risk',
  off_track: 'Off track',
  complete: 'Complete',
  not_started: 'Not started',
};
