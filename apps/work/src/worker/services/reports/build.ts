// Builds a project report from recorded data only.
//
// How past states are known: activity_log records every change to a task's columns with the value before and after
// (since the app's first version). The state of a task at a moment T is its current value with every recorded change
// after T undone, newest first. Nothing is inferred from today's status. Where the record has gaps (a column whose
// type was converted, a deleted column, tasks deleted from the board), the report says so in its notes.
//
// Figures are counts of tasks and sums of recorded amounts; achievements are the names of tasks recorded as completed.
// Text that people write for the report (commentary) is kept apart from the recorded data and labelled as such.

import { getColumnType, labelsOf, type ColumnLike } from '../../../shared/columns';
import { addDays, addMonths, startOfMonth, todayIn } from '../../../shared/dates';
import { summariseFinance, type FinanceSummary } from '../../../shared/finance';
import { isFinancialColumn } from '../../../shared/permissions';
import {
  DEFAULT_SECTIONS,
  REPORT_TYPE_LABELS,
  STATUS_LABELS,
  type ReportCommentary,
  type ReportOptions,
  type ReportSection,
} from '../../../shared/reports';
import type { ColumnDTO, GroupDTO, ItemDTO } from '../../../shared/types';
import { parseJson } from '../../lib/util';
import { columnDTO, groupDTO, itemDTO, type ColumnRow, type GroupRow } from '../mappers';
import type { BoardRow, ItemRow } from '../permissions';
import { buildCategorySection, type CategorySection } from './categories';

export const REPORT_SCHEMA_VERSION = 1;
const LIST_LIMIT = 500;
const ACTIVITY_LIMIT = 200_000;

export type StatusClass = 'done' | 'in_progress' | 'not_started' | 'blocked' | 'pending_approval' | 'unknown';

export interface TaskRow {
  id: string;
  name: string;
  group: string;
  status: string;
  statusClass: StatusClass;
  owners: string[];
  due: string | null;
  priority: string | null;
  progress: number | null;
  createdAt: number;
  completedAt: number | null;
  description: string;
  overdue: boolean;
  milestone: boolean;
}

export interface RiskRow {
  kind: 'Risk' | 'Issue' | 'Blocked' | 'Overdue' | 'Dependency' | 'Pending approval';
  task: string;
  taskId: string;
  owners: string[];
  due: string | null;
  impact: string;
  detail: string;
  /** Rule-based suggestion, never recorded data. */
  suggestedAction: string;
}

export interface TimelineEvent {
  at: number;
  type: string;
  text: string;
  taskId: string | null;
  actor: string | null;
}

export interface ReportData {
  schema: number;
  meta: {
    title: string;
    type: string;
    typeLabel: string;
    organisation: string;
    projectName: string;
    boardName: string;
    boardId: string;
    workspaceId: string;
    projectManager: string | null;
    projectStart: string;
    period: { start: string; end: string; label: string; timezone: string };
    generatedAt: number;
    generatedBy: string;
    reportVersion: number | null;
    confidentiality: string | null;
    sections: ReportSection[];
    filters: { statuses: string[]; owners: string[] };
    draft: boolean;
  };
  history: { reliableFrom: number | null; boardCreatedAt: number; notes: string[] };
  summary: {
    status: { calculated: 'on_track' | 'at_risk' | 'off_track' | 'complete' | 'not_started'; label: string; rule: string };
    completion: { done: number; total: number; percent: number };
    achievements: string[];
    developments: string[];
    problems: string[];
    decisions: string[];
    commentary: ReportCommentary & { author: string };
  };
  overview: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    blocked: number;
    pendingApproval: number;
    overdue: number;
    unknown: number;
    percent: number;
    subitems: { total: number; done: number };
    milestones: TaskRow[];
    hasStatusColumn: boolean;
  };
  previous: { completed: TaskRow[]; started: TaskRow[]; created: TaskRow[]; updatedCount: number; updated: TaskRow[]; reassigned: TaskRow[]; reopened: TaskRow[]; milestones: TaskRow[]; comments: { at: number; author: string; task: string; text: string }[] };
  current: { active: TaskRow[] };
  remaining: { outstanding: TaskRow[]; overdue: TaskRow[]; blocked: TaskRow[]; pendingApprovals: TaskRow[]; carriedForward: TaskRow[]; unassigned: number };
  risks: { recorded: RiskRow[]; derived: RiskRow[]; note: string };
  finance: (FinanceSummary & { asOf: string; changes: { at: number; task: string; column: string; before: string; after: string; actor: string | null }[]; note: string }) | null;
  next: { start: string; end: string; planned: TaskRow[]; milestones: TaskRow[]; priorities: TaskRow[]; workload: { owner: string; open: number; overdue: number }[]; unscheduled: number };
  timeline: { events: TimelineEvent[]; truncated: boolean };
  tasks: TaskRow[];
  truncated: string[];
  /** Section K (Categories): present when the report includes it. */
  categories?: CategorySection;
}

// ------------------------------------------------------------------ time

function tzOffsetMs(tz: string, utcMs: number): number {
  try {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(utcMs);
    const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
    return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - Math.floor(utcMs / 1000) * 1000;
  } catch {
    return 0;
  }
}

/** The first millisecond of a calendar day in a time zone. */
export function zonedDayStart(date: string, tz: string): number {
  const guess = Date.parse(`${date}T00:00:00Z`);
  const off = tzOffsetMs(tz, guess);
  let t = guess - off;
  const off2 = tzOffsetMs(tz, t);
  if (off2 !== off) t = guess - off2;
  return t;
}

export function dateIn(ms: number, tz: string): string {
  return todayIn(tz, ms);
}

function validTz(tz: string | undefined): string {
  if (!tz) return 'UTC';
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    return 'UTC';
  }
}

function fmtDate(d: string): string {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** The reporting period for the chosen type, as inclusive calendar dates. */
export function reportPeriod(opts: ReportOptions, board: Pick<BoardRow, 'created_at' | 'start_date'>, tz: string, at = Date.now()): { start: string; end: string } {
  const today = todayIn(tz, at);
  const projectStart = board.start_date && /^\d{4}-\d{2}-\d{2}$/.test(board.start_date) ? board.start_date : dateIn(board.created_at, tz);
  const clampEnd = (e: string) => (e > today ? today : e);
  switch (opts.type) {
    case 'previous_month': {
      const first = addMonths(startOfMonth(today), -1);
      return { start: first, end: addDays(startOfMonth(today), -1) };
    }
    case 'current_month':
      return { start: startOfMonth(today), end: today };
    case 'monthly': {
      const m = opts.month && /^\d{4}-\d{2}$/.test(opts.month) ? `${opts.month}-01` : addMonths(startOfMonth(today), -1);
      return { start: m, end: clampEnd(addDays(addMonths(m, 1), -1)) };
    }
    case 'custom': {
      const s = opts.start && /^\d{4}-\d{2}-\d{2}$/.test(opts.start) ? opts.start : projectStart;
      const e = opts.end && /^\d{4}-\d{2}-\d{2}$/.test(opts.end) ? opts.end : today;
      return s <= e ? { start: s, end: clampEnd(e) } : { start: e, end: clampEnd(s) };
    }
    default:
      return { start: projectStart <= today ? projectStart : today, end: today };
  }
}

// ------------------------------------------------------------------ status

const DONE_WORDS = /\b(done|complete|completed|closed|finished|resolved)\b/i;
const BLOCKED_WORDS = /\b(stuck|blocked|on hold|hold|impeded)\b/i;
const APPROVAL_WORDS = /\b(approval|approve|review|pending|awaiting)\b/i;
const NOT_STARTED_WORDS = /\b(not started|to ?do|todo|backlog|new|planned|open)\b/i;

export function classifyStatus(col: ColumnLike | undefined, value: unknown): StatusClass {
  if (!col) return 'unknown';
  if (value == null || value === '') return 'not_started';
  const label = labelsOf(col).find((l) => l.id === value);
  if (!label) return 'unknown';
  if (label.done) return 'done';
  if (label.id === 'stuck' || BLOCKED_WORDS.test(label.label)) return 'blocked';
  if (APPROVAL_WORDS.test(label.label)) return 'pending_approval';
  if (label.id === 'todo' || NOT_STARTED_WORDS.test(label.label)) return 'not_started';
  if (DONE_WORDS.test(label.label)) return 'done';
  return 'in_progress';
}

// ------------------------------------------------------------------ build

interface Change {
  itemId: string;
  columnId: string;
  oldValue: unknown;
  newValue: unknown;
  at: number;
  actorId: string | null;
}

export interface BuildInput {
  board: BoardRow;
  organisation: string;
  options: ReportOptions;
  generatedBy: { id: string; name: string };
  /** False when the caller may not see financial data: the finance section is left out whatever was asked. */
  financeAllowed: boolean;
  workspaceCurrency: string | null;
  confidentiality: string | null;
  version: number | null;
  draft: boolean;
  at?: number;
}

export async function buildReport(db: D1Database, input: BuildInput): Promise<ReportData> {
  const { board, options } = input;
  const at = input.at ?? Date.now();
  const tz = validTz(options.timezone);
  const period = reportPeriod(options, board, tz, at);
  const S = zonedDayStart(period.start, tz);
  const E = zonedDayStart(addDays(period.end, 1), tz) - 1;
  const notes: string[] = [];
  const truncated: string[] = [];

  const [colRows, groupRows, itemRows, firstActivity, activityRows] = await Promise.all([
    db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').bind(board.id).all<ColumnRow>(),
    db.prepare('SELECT * FROM groups WHERE board_id = ? ORDER BY position').bind(board.id).all<GroupRow>(),
    db.prepare('SELECT * FROM items WHERE board_id = ?').bind(board.id).all<ItemRow>(),
    db.prepare('SELECT MIN(created_at) AS t FROM activity_log WHERE board_id = ?').bind(board.id).first<{ t: number | null }>(),
    db
      .prepare(`SELECT item_id, actor_id, action, column_id, old_value, new_value, created_at FROM activity_log WHERE board_id = ? AND created_at > ? ORDER BY created_at DESC LIMIT ${ACTIVITY_LIMIT}`)
      .bind(board.id, S - 1)
      .all<{ item_id: string | null; actor_id: string | null; action: string; column_id: string | null; old_value: string | null; new_value: string | null; created_at: number }>(),
  ]);
  if (activityRows.results.length >= ACTIVITY_LIMIT) notes.push(`More than ${ACTIVITY_LIMIT.toLocaleString('en')} recorded changes since the period began: older states may be incomplete.`);
  const columns: ColumnDTO[] = colRows.results.map(columnDTO);
  const groups: GroupDTO[] = groupRows.results.map(groupDTO);
  const groupName = new Map(groups.map((g) => [g.id, g.name]));
  const allItems: ItemDTO[] = itemRows.results.map(itemDTO);
  const settings = parseJson<{ statusColumnId?: string; dateColumnId?: string; personColumnId?: string; timelineColumnId?: string }>(board.settings_json, {});
  const statusCol = columns.find((c) => c.id === settings.statusColumnId && c.type === 'status') ?? columns.find((c) => c.type === 'status');
  const priorityCol = columns.find((c) => c.type === 'priority');
  const dateCol = columns.find((c) => c.id === settings.dateColumnId && c.type === 'date') ?? columns.find((c) => c.type === 'date');
  const timelineCol = columns.find((c) => c.id === settings.timelineColumnId && c.type === 'timeline') ?? columns.find((c) => c.type === 'timeline');
  const peopleCols = columns.filter((c) => c.type === 'person' || c.type === 'people');
  const progressCol = columns.find((c) => c.type === 'progress' && (c.settings.mode ?? 'manual') === 'manual');
  const depCol = columns.find((c) => c.type === 'dependency');
  const tagCols = columns.filter((c) => c.type === 'tags' || c.type === 'dropdown');
  const colIds = new Set(columns.map((c) => c.id));

  // Value changes, newest first, by item and column.
  const changes = new Map<string, Change[]>();
  const eventsInPeriod: typeof activityRows.results = [];
  const deletedColumnChanges = new Set<string>();
  for (const r of activityRows.results) {
    if (r.created_at <= E) eventsInPeriod.push(r);
    if (!r.action.startsWith('value_changed') || !r.item_id || !r.column_id) {
      if (r.action === 'column_type_changed' && r.column_id && r.column_id === statusCol?.id) notes.push(`The status column's type was changed on ${dateIn(r.created_at, tz)}: statuses before that date are not reliable.`);
      continue;
    }
    if (!colIds.has(r.column_id)) {
      deletedColumnChanges.add(r.column_id);
      continue;
    }
    const key = `${r.item_id}:${r.column_id}`;
    const list = changes.get(key) ?? [];
    list.push({ itemId: r.item_id, columnId: r.column_id, oldValue: parseJson(r.old_value, null), newValue: parseJson(r.new_value, null), at: r.created_at, actorId: r.actor_id });
    changes.set(key, list);
  }
  if (deletedColumnChanges.size) notes.push(`${deletedColumnChanges.size} column(s) changed during or after the period were later deleted; their history is not shown.`);

  /** A task's value in a column at time T: today's value with every later recorded change undone. */
  const valueAt = (item: ItemDTO, colId: string, T: number): unknown => {
    let v: unknown = item.values[colId] ?? null;
    for (const ch of changes.get(`${item.id}:${colId}`) ?? []) {
      if (ch.at <= T) break;
      v = ch.oldValue;
    }
    return v;
  };
  const valuesAt = (item: ItemDTO, T: number): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const c of columns) {
      const v = valueAt(item, c.id, T);
      if (v != null) out[c.id] = v;
    }
    return out;
  };

  // People.
  const userIds = new Set<string>();
  for (const it of allItems) for (const c of peopleCols) {
    const v = it.values[c.id];
    (Array.isArray(v) ? v : v ? [v] : []).forEach((u) => userIds.add(String(u)));
  }
  for (const list of changes.values()) for (const ch of list) {
    if (ch.actorId) userIds.add(ch.actorId);
    for (const v of [ch.oldValue, ch.newValue]) if (peopleCols.some((p) => p.id === ch.columnId)) (Array.isArray(v) ? v : v ? [v] : []).forEach((u) => userIds.add(String(u)));
  }
  for (const r of eventsInPeriod) if (r.actor_id) userIds.add(r.actor_id);
  if (board.manager_id) userIds.add(board.manager_id);
  const managers = await db.prepare("SELECT user_id FROM board_members WHERE board_id = ? AND role = 'owner'").bind(board.id).all<{ user_id: string }>();
  managers.results.forEach((m) => userIds.add(m.user_id));
  const names = new Map<string, string>();
  const ids = Array.from(userIds);
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db.prepare(`SELECT id, name FROM users WHERE id IN (${chunk.map(() => '?').join(',')})`).bind(...chunk).all<{ id: string; name: string }>();
    rows.results.forEach((u) => names.set(u.id, u.name));
  }
  const nameOf = (id: string | null | undefined) => (id ? names.get(id) ?? 'Former member' : null);
  const ownersAt = (item: ItemDTO, T: number): string[] => {
    const out: string[] = [];
    for (const c of peopleCols) {
      const v = valueAt(item, c.id, T);
      (Array.isArray(v) ? v : v ? [v] : []).forEach((u) => out.push(String(u)));
    }
    return Array.from(new Set(out));
  };
  const dueAt = (item: ItemDTO, T: number): string | null => {
    if (dateCol) {
      const v = valueAt(item, dateCol.id, T);
      if (typeof v === 'string') return v.slice(0, 10);
    }
    if (timelineCol) {
      const v = valueAt(item, timelineCol.id, T) as { end?: string } | null;
      if (v && typeof v.end === 'string') return v.end.slice(0, 10);
    }
    return null;
  };
  const startAt = (item: ItemDTO, T: number): string | null => {
    if (!timelineCol) return null;
    const v = valueAt(item, timelineCol.id, T) as { start?: string } | null;
    return v && typeof v.start === 'string' ? v.start.slice(0, 10) : null;
  };
  const statusAt = (item: ItemDTO, T: number): StatusClass => (statusCol ? classifyStatus(statusCol, valueAt(item, statusCol.id, T)) : 'unknown');
  const statusLabelAt = (item: ItemDTO, T: number): string => {
    if (!statusCol) return '';
    const v = valueAt(item, statusCol.id, T);
    return labelsOf(statusCol).find((l) => l.id === v)?.label ?? (v == null ? 'Not set' : 'Unknown');
  };
  const isMilestone = (item: ItemDTO): boolean => {
    if (timelineCol) {
      const v = item.values[timelineCol.id] as { start?: string; end?: string } | undefined;
      if (v?.start && v.start === v.end) return true;
    }
    return /milestone/i.test(item.name) || /milestone/i.test(groupName.get(item.groupId) ?? '');
  };
  const endDate = period.end;
  const row = (item: ItemDTO, T: number): TaskRow => {
    const cls = statusAt(item, T);
    const due = dueAt(item, T);
    const progress = progressCol ? valueAt(item, progressCol.id, T) : null;
    return {
      id: item.id,
      name: item.name,
      group: groupName.get(item.groupId) ?? '',
      status: statusLabelAt(item, T),
      statusClass: cls,
      owners: ownersAt(item, T).map((u) => nameOf(u)!),
      due,
      priority: priorityCol ? labelsOf(priorityCol).find((l) => l.id === valueAt(item, priorityCol.id, T))?.label ?? null : null,
      progress: typeof progress === 'number' ? progress : null,
      createdAt: item.createdAt,
      completedAt: item.completedAt,
      description: item.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300),
      overdue: cls !== 'done' && !!due && due < (T >= E ? endDate : dateIn(T, tz)),
      milestone: isMilestone(item),
    };
  };

  // The tasks of the report: top-level, existing at the end of the period, not archived by then.
  const archivedBy = (it: ItemDTO, T: number) => it.archivedAt != null && it.archivedAt <= T;
  const top = allItems.filter((i) => !i.parentItemId);
  const atEnd = top.filter((i) => i.createdAt <= E && !archivedBy(i, E));
  const archivedCount = top.filter((i) => i.createdAt <= E && archivedBy(i, E)).length;
  if (archivedCount) notes.push(`${archivedCount} archived task(s) are not included.`);
  const deleted = eventsInPeriod.filter((e) => e.action === 'item_deleted').length;
  if (deleted) notes.push(`${deleted} task(s) deleted during the period are not shown (deleted tasks keep only their deletion in the history).`);
  if (!statusCol) notes.push('This board has no status column, so completion and progress cannot be measured from recorded statuses.');
  const subs = allItems.filter((i) => i.parentItemId && i.createdAt <= E && !archivedBy(i, E));

  const statusFilter = new Set(options.statuses ?? []);
  const ownerFilter = new Set(options.owners ?? []);
  const listed = (it: ItemDTO) =>
    (!statusFilter.size || (statusCol && statusFilter.has(String(valueAt(it, statusCol.id, E))))) && (!ownerFilter.size || ownersAt(it, E).some((u) => ownerFilter.has(u)));
  const cap = (rows: TaskRow[], what: string) => {
    if (rows.length > LIST_LIMIT) truncated.push(`${what}: ${rows.length} tasks, the first ${LIST_LIMIT} are listed`);
    return rows.slice(0, LIST_LIMIT);
  };

  // Transitions within the period.
  const inPeriod = (t: number) => t >= S && t <= E;
  const completedIn: ItemDTO[] = [];
  const startedIn: ItemDTO[] = [];
  const reopenedIn: ItemDTO[] = [];
  for (const it of atEnd) {
    let completed = false;
    let started = false;
    let reopened = false;
    if (statusCol) {
      for (const ch of changes.get(`${it.id}:${statusCol.id}`) ?? []) {
        if (!inPeriod(ch.at)) continue;
        const from = classifyStatus(statusCol, ch.oldValue);
        const to = classifyStatus(statusCol, ch.newValue);
        if (to === 'done' && from !== 'done') completed = true;
        if (from === 'done' && to !== 'done') reopened = true;
        if ((from === 'not_started' || from === 'unknown') && to !== 'not_started' && to !== 'done' && to !== 'unknown') started = true;
      }
      if (inPeriod(it.createdAt)) {
        const initial = statusAt(it, it.createdAt);
        if (initial === 'done') completed = true;
        else if (initial === 'in_progress' || initial === 'blocked' || initial === 'pending_approval') started = true;
      }
    }
    if (completed) completedIn.push(it);
    if (started) startedIn.push(it);
    if (reopened) reopenedIn.push(it);
  }
  const createdIn = atEnd.filter((i) => inPeriod(i.createdAt));
  const touched = new Set(eventsInPeriod.filter((e) => e.item_id).map((e) => e.item_id!));
  const updatedIn = atEnd.filter((i) => touched.has(i.id));
  const reassignedIn = atEnd.filter((i) =>
    peopleCols.some((c) => (changes.get(`${i.id}:${c.id}`) ?? []).some((ch) => inPeriod(ch.at) && ch.oldValue != null && (Array.isArray(ch.oldValue) ? ch.oldValue.length > 0 : true))),
  );

  // States at the end.
  const endRows = atEnd.map((i) => ({ item: i, r: row(i, E) }));
  const count = (cls: StatusClass) => endRows.filter((x) => x.r.statusClass === cls).length;
  const done = count('done');
  const open = endRows.filter((x) => x.r.statusClass !== 'done');
  const overdueRows = open.filter((x) => x.r.overdue);
  const blockedRows = open.filter((x) => x.r.statusClass === 'blocked');
  const pendingRows = open.filter((x) => x.r.statusClass === 'pending_approval');
  const percent = atEnd.length ? Math.round((done / atEnd.length) * 1000) / 10 : 0;
  const carried = atEnd.filter((i) => i.createdAt < S && statusAt(i, S - 1) !== 'done' && statusAt(i, E) !== 'done');

  // Overall status: a fixed, stated rule on recorded data.
  let calc: ReportData['summary']['status']['calculated'];
  if (!atEnd.length || !statusCol) calc = 'not_started';
  else if (done === atEnd.length) calc = 'complete';
  else if (overdueRows.length / Math.max(open.length, 1) > 0.25 || blockedRows.length / Math.max(open.length, 1) > 0.2) calc = 'off_track';
  else if (overdueRows.length || blockedRows.length) calc = 'at_risk';
  else if (done === 0 && count('in_progress') === 0) calc = 'not_started';
  else calc = 'on_track';
  const rule =
    'Calculated from recorded task data: Complete when every task is done; Off track when more than 25% of open tasks are overdue or more than 20% are blocked; At risk when any open task is overdue or blocked; otherwise On track.';

  // Risks and issues.
  const riskGroup = (it: ItemDTO) => /risk|issue/i.test(groupName.get(it.groupId) ?? '');
  const riskTag = (it: ItemDTO) =>
    tagCols.some((c) => {
      const v = it.values[c.id];
      const ids2 = Array.isArray(v) ? v.map(String) : v ? [String(v)] : [];
      const opts = (c.settings.options ?? c.settings.labels ?? []) as { id: string; label: string }[];
      const texts = c.type === 'tags' ? ids2 : ids2.map((x) => opts.find((o) => o.id === x)?.label ?? x);
      return texts.some((t) => /risk|issue/i.test(t));
    });
  const recordedRisks: RiskRow[] = open
    .filter((x) => riskGroup(x.item) || riskTag(x.item))
    .map((x) => ({
      kind: /issue/i.test(groupName.get(x.item.groupId) ?? '') ? 'Issue' : 'Risk',
      task: x.r.name,
      taskId: x.r.id,
      owners: x.r.owners,
      due: x.r.due,
      impact: x.r.priority ? `Priority: ${x.r.priority}` : 'Not recorded',
      detail: x.r.description || x.r.status,
      suggestedAction: x.r.owners.length ? 'Review with the owner and agree a mitigation' : 'Assign an owner',
    }));
  const derived: RiskRow[] = [];
  const doneIds = new Set(endRows.filter((x) => x.r.statusClass === 'done').map((x) => x.r.id));
  for (const x of open) {
    if (riskGroup(x.item) || riskTag(x.item)) continue;
    const base = { task: x.r.name, taskId: x.r.id, owners: x.r.owners, due: x.r.due, impact: x.r.priority ? `Priority: ${x.r.priority}` : 'Not recorded' };
    if (x.r.statusClass === 'blocked') derived.push({ ...base, kind: 'Blocked', detail: `Status: ${x.r.status}`, suggestedAction: 'Resolve the blocker or escalate it' });
    else if (x.r.overdue) derived.push({ ...base, kind: 'Overdue', detail: `Due ${x.r.due}`, suggestedAction: 'Agree a new date or add resources' });
    else if (x.r.statusClass === 'pending_approval') derived.push({ ...base, kind: 'Pending approval', detail: `Status: ${x.r.status}`, suggestedAction: 'Decide or delegate the approval' });
    if (depCol) {
      const deps = valueAt(x.item, depCol.id, E);
      const waiting = (Array.isArray(deps) ? deps.map(String) : []).filter((d) => !doneIds.has(d));
      if (waiting.length) {
        const depNames = waiting.map((d) => allItems.find((i) => i.id === d)?.name ?? 'a deleted task').slice(0, 5);
        derived.push({ ...base, kind: 'Dependency', detail: `Waiting on: ${depNames.join(', ')}`, suggestedAction: 'Complete or re-plan the tasks it depends on' });
      }
    }
  }

  // Finance as recorded at the end of the period.
  let finance: ReportData['finance'] = null;
  const wantFinance = options.includeFinance !== false && input.financeAllowed && columns.some(isFinancialColumn);
  if (wantFinance) {
    const asOf = top.filter((i) => i.createdAt <= E && !archivedBy(i, E)).map((i) => ({ ...i, values: valuesAt(i, E) }));
    const summary = summariseFinance(columns, asOf, groups.filter((g) => !g.archivedAt), { boardCurrency: board.currency ?? null, workspaceCurrency: input.workspaceCurrency });
    const finCols = new Map(columns.filter(isFinancialColumn).map((c) => [c.id, c]));
    const finChanges: NonNullable<ReportData['finance']>['changes'] = [];
    for (const [key, list] of changes) {
      const colId = key.slice(key.indexOf(':') + 1);
      const col = finCols.get(colId);
      if (!col) continue;
      for (const ch of list) {
        if (!inPeriod(ch.at)) continue;
        const it = allItems.find((i) => i.id === ch.itemId);
        const tt = (v: unknown) => (v == null ? 'empty' : getColumnType(col.type).toText(v, col.settings));
        finChanges.push({ at: ch.at, task: it?.name ?? 'Deleted task', column: col.title, before: tt(ch.oldValue), after: tt(ch.newValue), actor: nameOf(ch.actorId) });
      }
    }
    finChanges.sort((a, b) => a.at - b.at);
    finance = {
      ...summary,
      asOf: period.end,
      changes: finChanges.slice(0, 200),
      note:
        'Amounts as recorded on the board at the end of the period, summed over top-level tasks (subitems are not added again). Amounts in different currencies are shown separately and never added together. Remaining budget = approved budget - actual cost - committed expenditure; variance = approved budget - actual cost. Estimated costs are estimates, not actual spending.',
    };
    if (summary.unsetCurrencyColumns) notes.push('Some financial columns have no currency set: their totals are shown without a currency.');
    if (summary.columns.some((c) => c.currencySource === 'column' && !c.currencyConfirmed)) notes.push('Some financial columns keep the currency code they were created with and no administrator has confirmed it yet (Settings > Finance).');
  }

  // Next period.
  const nextStart = addDays(period.end, 1);
  const nextEnd = addDays(addMonths(nextStart, 1), -1);
  const inNext = (d: string | null) => !!d && d >= nextStart && d <= nextEnd;
  const planned = open.filter((x) => inNext(x.r.due) || inNext(startAt(x.item, E)));
  const unscheduled = open.filter((x) => !x.r.due && !startAt(x.item, E)).length;
  const workload = new Map<string, { open: number; overdue: number }>();
  for (const x of open) {
    const owners = x.r.owners.length ? x.r.owners : ['Unassigned'];
    for (const o of owners) {
      const w = workload.get(o) ?? { open: 0, overdue: 0 };
      w.open++;
      if (x.r.overdue) w.overdue++;
      workload.set(o, w);
    }
  }

  // Timeline: significant recorded events in the period, oldest first.
  const itemName = (id: string | null) => (id ? allItems.find((i) => i.id === id)?.name ?? null : null);
  const tl: TimelineEvent[] = [];
  for (const e of eventsInPeriod) {
    const actor = nameOf(e.actor_id) ?? (e.action.endsWith(':automation') ? 'Automation' : null);
    const act = e.action.replace(':automation', '');
    const name = itemName(e.item_id);
    if (act === 'item_created') tl.push({ at: e.created_at, type: 'created', text: `Task created: ${parseJson<{ name?: string }>(e.new_value, {}).name ?? name ?? ''}`, taskId: e.item_id, actor });
    else if (act === 'item_deleted') tl.push({ at: e.created_at, type: 'deleted', text: `Task deleted: ${parseJson<{ name?: string }>(e.old_value, {}).name ?? ''}`, taskId: null, actor });
    else if (act === 'value_changed' && e.column_id && statusCol && e.column_id === statusCol.id) {
      const lab = (v: string | null) => labelsOf(statusCol).find((l) => l.id === parseJson(v, null))?.label ?? 'Not set';
      tl.push({ at: e.created_at, type: 'status', text: `${name ?? 'Task'}: ${lab(e.old_value)} -> ${lab(e.new_value)}`, taskId: e.item_id, actor });
    } else if (act === 'value_changed' && e.column_id && peopleCols.some((p) => p.id === e.column_id)) {
      const ppl = (v: string | null) => {
        const x = parseJson<unknown>(v, null);
        const arr = Array.isArray(x) ? x : x ? [x] : [];
        return arr.length ? arr.map((u) => nameOf(String(u))).join(', ') : 'nobody';
      };
      tl.push({ at: e.created_at, type: 'owner', text: `${name ?? 'Task'}: owner ${ppl(e.old_value)} -> ${ppl(e.new_value)}`, taskId: e.item_id, actor });
    } else if (act === 'value_changed' && e.column_id && (e.column_id === dateCol?.id || e.column_id === timelineCol?.id)) {
      tl.push({ at: e.created_at, type: 'date', text: `${name ?? 'Task'}: dates changed`, taskId: e.item_id, actor });
    } else if (act === 'group_created') tl.push({ at: e.created_at, type: 'group', text: `Group created: ${parseJson<string>(e.new_value, '')}`, taskId: null, actor });
    else if (act === 'archived') tl.push({ at: e.created_at, type: 'archived', text: `Task archived: ${name ?? ''}`, taskId: e.item_id, actor });
  }
  const audits = await db
    .prepare("SELECT event_type, actor_id, metadata_json, created_at FROM audit_events WHERE board_id = ? AND created_at BETWEEN ? AND ? AND event_type IN ('project.membership_changed','report.generated','project.currency_changed') ORDER BY created_at LIMIT 200")
    .bind(board.id, S, E)
    .all<{ event_type: string; actor_id: string | null; metadata_json: string; created_at: number }>();
  for (const a of audits.results) {
    const md = parseJson<{ userId?: string; title?: string }>(a.metadata_json, {});
    const actor = names.get(a.actor_id ?? '') ?? null;
    if (a.event_type === 'report.generated') tl.push({ at: a.created_at, type: 'report', text: `Report generated: ${md.title ?? ''}`, taskId: null, actor });
    else if (a.event_type === 'project.currency_changed') tl.push({ at: a.created_at, type: 'finance', text: 'Project currency changed', taskId: null, actor });
    else tl.push({ at: a.created_at, type: 'membership', text: 'Project access changed', taskId: null, actor });
  }
  tl.sort((a, b) => a.at - b.at);

  // Comments in the period (the most recent first), as written.
  const comments = await db
    .prepare(
      `SELECT up.body, up.created_at, u.name AS author, i.name AS task FROM updates up JOIN users u ON u.id = up.author_id JOIN items i ON i.id = up.item_id
       WHERE up.board_id = ? AND up.deleted_at IS NULL AND up.created_at BETWEEN ? AND ? ORDER BY up.created_at DESC LIMIT 25`,
    )
    .bind(board.id, S, E)
    .all<{ body: string; created_at: number; author: string; task: string }>();

  const sections = (options.sections?.length ? options.sections : DEFAULT_SECTIONS[options.type]).filter((s) => {
    if (s === 'finance') return !!finance;
    if (s === 'risks') return options.includeRisks !== false;
    if (s === 'next') return options.includeUpcoming !== false;
    if (s === 'timeline') return options.includeActivity !== false;
    return true;
  });
  if (options.includeFinance !== false && !input.financeAllowed && columns.some(isFinancialColumn)) notes.push('The financial summary is not included: the person who generated this report may not view financial data.');
  if (!firstActivity?.t && top.length) notes.push('No change has been recorded on this board since its tasks were created: task states are as they were created.');
  if (firstActivity?.t && firstActivity.t > board.created_at + 86_400_000) notes.push(`Recorded history for this board starts on ${dateIn(firstActivity.t, tz)}; the board was created on ${dateIn(board.created_at, tz)}.`);

  const managerName = nameOf(board.manager_id) ?? (managers.results.length ? managers.results.map((m) => nameOf(m.user_id)).join(', ') : null);
  const projectStart = board.start_date ?? dateIn(board.created_at, tz);
  const label = period.start === period.end ? fmtDate(period.start) : `${fmtDate(period.start)} to ${fmtDate(period.end)}`;
  const listedRows = (xs: { item: ItemDTO; r: TaskRow }[]) => xs.filter((x) => listed(x.item)).map((x) => x.r);
  const rowsOf = (items: ItemDTO[]) => items.filter(listed).map((i) => row(i, E));
  const commentary = { ...(options.commentary ?? {}), author: input.generatedBy.name };

  const data: ReportData = {
    schema: REPORT_SCHEMA_VERSION,
    meta: {
      title: `${REPORT_TYPE_LABELS[options.type]}: ${board.name}`,
      type: options.type,
      typeLabel: REPORT_TYPE_LABELS[options.type],
      organisation: input.organisation,
      projectName: board.name,
      boardName: board.name,
      boardId: board.id,
      workspaceId: board.workspace_id,
      projectManager: managerName,
      projectStart,
      period: { start: period.start, end: period.end, label, timezone: tz },
      generatedAt: at,
      generatedBy: input.generatedBy.name,
      reportVersion: input.version,
      confidentiality: input.confidentiality,
      sections,
      filters: { statuses: Array.from(statusFilter).map((s) => (statusCol ? labelsOf(statusCol).find((l) => l.id === s)?.label ?? s : s)), owners: Array.from(ownerFilter).map((o) => nameOf(o)!) },
      draft: input.draft,
    },
    history: { reliableFrom: firstActivity?.t ?? null, boardCreatedAt: board.created_at, notes },
    summary: {
      status: { calculated: calc, label: STATUS_LABELS[calc], rule },
      completion: { done, total: atEnd.length, percent },
      achievements: completedIn.map((i) => i.name).slice(0, 15),
      developments: [
        createdIn.length ? `${createdIn.length} new task(s) were added.` : '',
        startedIn.length ? `${startedIn.length} task(s) were started.` : '',
        reassignedIn.length ? `${reassignedIn.length} task(s) were reassigned.` : '',
        reopenedIn.length ? `${reopenedIn.length} task(s) were reopened after being completed.` : '',
      ].filter(Boolean),
      problems: [
        overdueRows.length ? `${overdueRows.length} open task(s) are overdue.` : '',
        blockedRows.length ? `${blockedRows.length} task(s) are blocked.` : '',
        derived.filter((d) => d.kind === 'Dependency').length ? `${derived.filter((d) => d.kind === 'Dependency').length} task(s) are waiting on unfinished tasks.` : '',
      ].filter(Boolean),
      decisions: pendingRows.map((x) => `${x.r.name} (${x.r.status})`).slice(0, 10),
      commentary,
    },
    overview: {
      total: atEnd.length,
      completed: done,
      inProgress: count('in_progress'),
      notStarted: count('not_started'),
      blocked: count('blocked'),
      pendingApproval: count('pending_approval'),
      overdue: overdueRows.length,
      unknown: count('unknown'),
      percent,
      subitems: { total: subs.length, done: subs.filter((i) => statusAt(i, E) === 'done').length },
      milestones: cap(
        endRows.filter((x) => x.r.milestone).map((x) => x.r),
        'Milestones',
      ),
      hasStatusColumn: !!statusCol,
    },
    previous: {
      completed: cap(rowsOf(completedIn), 'Completed in the period'),
      started: cap(rowsOf(startedIn), 'Started in the period'),
      created: cap(rowsOf(createdIn), 'New tasks'),
      updatedCount: updatedIn.length,
      updated: cap(rowsOf(updatedIn), 'Updated tasks'),
      reassigned: cap(rowsOf(reassignedIn), 'Reassigned tasks'),
      reopened: cap(rowsOf(reopenedIn), 'Reopened tasks'),
      milestones: cap(rowsOf(completedIn.filter(isMilestone)), 'Milestones achieved'),
      comments: comments.results.map((r) => ({ at: r.created_at, author: r.author, task: r.task, text: r.body.replace(/@\[([^\]]+)\]\(user:[^)]+\)/g, '@$1').replace(/<[^>]+>/g, ' ').slice(0, 400) })),
    },
    current: { active: cap(listedRows(open.filter((x) => x.r.statusClass === 'in_progress' || x.r.statusClass === 'blocked' || x.r.statusClass === 'pending_approval')), 'Current activities') },
    remaining: {
      outstanding: cap(listedRows(open), 'Outstanding tasks'),
      overdue: cap(listedRows(overdueRows), 'Overdue tasks'),
      blocked: cap(listedRows(blockedRows), 'Blocked tasks'),
      pendingApprovals: cap(listedRows(pendingRows), 'Pending approvals'),
      carriedForward: cap(rowsOf(carried), 'Carried forward'),
      unassigned: open.filter((x) => !x.r.owners.length).length,
    },
    risks: {
      recorded: recordedRisks.slice(0, 200),
      derived: derived.slice(0, 200),
      note: recordedRisks.length
        ? 'Recorded risks and issues are open tasks in groups named Risks or Issues, or tagged as such. Other entries are derived from task states. Suggested actions are generated by a fixed rule, not recorded data.'
        : 'This board has no risk register (a group named Risks or Issues, or a risk tag). The entries below are derived from task states. Suggested actions are generated by a fixed rule, not recorded data.',
    },
    finance,
    next: {
      start: nextStart,
      end: nextEnd,
      planned: cap(planned.map((x) => x.r), 'Planned next period'),
      milestones: planned.filter((x) => x.r.milestone).map((x) => x.r),
      priorities: open.filter((x) => /critical|high/i.test(x.r.priority ?? '')).map((x) => x.r).slice(0, 20),
      workload: Array.from(workload.entries()).map(([owner, w]) => ({ owner, ...w })).sort((a, b) => b.open - a.open),
      unscheduled,
    },
    timeline: { events: tl.slice(-1000), truncated: tl.length > 1000 },
    tasks: cap(listedRows(endRows), 'Task list'),
    truncated,
  };
  if (sections.includes('categories')) {
    data.categories = buildCategorySection({
      groups: groupRows.results,
      tasks: endRows.map((x) => ({ groupId: x.item.groupId, row: x.r })),
      end: E,
      finance: sections.includes('finance') ? finance : null,
    });
  }
  return data;
}
