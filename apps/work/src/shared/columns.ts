// Column type registry.
//
// Every column type is described ONCE here and used by both the API (for
// validation, conversion, filtering, sorting and automations) and the UI (for
// rendering metadata and default settings). Boards never hard-code column
// implementations; they store a `type` and a `settings` object and delegate to
// this registry.

import { isIsoDate } from './dates';

export const COLUMN_TYPES = [
  'text',
  'long_text',
  'status',
  'priority',
  'person',
  'people',
  'date',
  'timeline',
  'number',
  'currency',
  'percentage',
  'checkbox',
  'tags',
  'dropdown',
  'link',
  'email',
  'phone',
  'progress',
  'files',
  'formula',
  'created_at',
  'updated_at',
  'dependency',
  'rating',
  'location',
] as const;
export type ColumnType = (typeof COLUMN_TYPES)[number];

export interface LabelOption {
  id: string;
  label: string;
  color: string;
  /** For status columns: marks the item as complete. */
  done?: boolean;
}

export interface ColumnSettings {
  labels?: LabelOption[];
  options?: LabelOption[];
  multiple?: boolean;
  currency?: string;
  decimals?: number;
  max?: number;
  min?: number;
  maxLength?: number;
  pattern?: string;
  includeTime?: boolean;
  formula?: string;
  mode?: 'manual' | 'subitems' | 'status';
  progressStatusColumnId?: string;
  [k: string]: unknown;
}

export interface ColumnLike {
  id: string;
  title: string;
  type: string;
  settings: ColumnSettings;
  required?: boolean;
}

export interface ValueContext {
  /** Resolve a user id to a display name. */
  userName?: (id: string) => string | undefined;
  /** Resolve an item id to its name (dependency columns). */
  itemName?: (id: string) => string | undefined;
}

export type NormalizeResult = { ok: true; value: unknown } | { ok: false; error: string };

export type FilterOperator =
  | 'is'
  | 'is_not'
  | 'contains'
  | 'not_contains'
  | 'is_empty'
  | 'is_not_empty'
  | 'any_of'
  | 'none_of'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'before'
  | 'after'
  | 'on'
  | 'within_next_days'
  | 'within_last_days'
  | 'overdue'
  | 'today'
  | 'this_week'
  | 'includes_me';

export interface ColumnTypeDef {
  type: ColumnType;
  label: string;
  category: 'basic' | 'people' | 'time' | 'numbers' | 'choice' | 'contact' | 'advanced' | 'system';
  /** Computed types are never written by clients. */
  computed?: boolean;
  defaultSettings: () => ColumnSettings;
  normalize: (value: unknown, settings: ColumnSettings) => NormalizeResult;
  toText: (value: unknown, settings: ColumnSettings, ctx?: ValueContext) => string;
  /** Primitive used for sorting / comparisons / charts. */
  sortKey: (value: unknown, settings: ColumnSettings) => string | number | null;
  operators: FilterOperator[];
  /** Types this type can be safely converted to without data loss surprises. */
  convertibleTo: ColumnType[];
}

const ok = (value: unknown): NormalizeResult => ({ ok: true, value });
const fail = (error: string): NormalizeResult => ({ ok: false, error });

export const PALETTE = [
  '#00a36c', '#f5a524', '#e5484d', '#5b5bd6', '#0ea5e9', '#a855f7',
  '#ec4899', '#64748b', '#14b8a6', '#f97316', '#84cc16', '#334155',
];

function rid(prefix: string, i: number) {
  return `${prefix}${i}`;
}

export function defaultStatusLabels(): LabelOption[] {
  return [
    { id: 'todo', label: 'Not started', color: '#94a3b8' },
    { id: 'working', label: 'Working on it', color: '#f5a524' },
    { id: 'stuck', label: 'Stuck', color: '#e5484d' },
    { id: 'done', label: 'Done', color: '#00a36c', done: true },
  ];
}

export function defaultPriorityLabels(): LabelOption[] {
  return [
    { id: 'critical', label: 'Critical', color: '#7f1d1d' },
    { id: 'high', label: 'High', color: '#e5484d' },
    { id: 'medium', label: 'Medium', color: '#f5a524' },
    { id: 'low', label: 'Low', color: '#0ea5e9' },
  ];
}

const textOps: FilterOperator[] = ['is', 'is_not', 'contains', 'not_contains', 'is_empty', 'is_not_empty'];
const numberOps: FilterOperator[] = ['is', 'is_not', 'gt', 'gte', 'lt', 'lte', 'between', 'is_empty', 'is_not_empty'];
const labelOps: FilterOperator[] = ['is', 'is_not', 'any_of', 'none_of', 'is_empty', 'is_not_empty'];
const dateOps: FilterOperator[] = [
  'on', 'before', 'after', 'between', 'today', 'this_week', 'overdue',
  'within_next_days', 'within_last_days', 'is_empty', 'is_not_empty',
];
const personOps: FilterOperator[] = ['is', 'is_not', 'any_of', 'none_of', 'includes_me', 'is_empty', 'is_not_empty'];

const STRINGISH: ColumnType[] = ['text', 'long_text', 'link', 'email', 'phone'];
const NUMERIC: ColumnType[] = ['number', 'currency', 'percentage', 'rating', 'progress'];
const LABELS: ColumnType[] = ['status', 'priority', 'dropdown'];

function str(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function stringNormalizer(maxDefault: number, check?: (s: string) => string | null) {
  return (value: unknown, settings: ColumnSettings): NormalizeResult => {
    if (value == null || value === '') return ok(null);
    if (typeof value !== 'string' && typeof value !== 'number') return fail('Expected text');
    const s = String(value).trim();
    const max = settings.maxLength ?? maxDefault;
    if (s.length > max) return fail(`Must be at most ${max} characters`);
    if (settings.pattern) {
      try {
        if (!new RegExp(settings.pattern).test(s)) return fail('Does not match the required format');
      } catch {
        /* invalid pattern configured: ignore */
      }
    }
    const err = check?.(s);
    if (err) return fail(err);
    return ok(s);
  };
}

function numberNormalizer(defaults: { min?: number; max?: number; integer?: boolean } = {}) {
  return (value: unknown, settings: ColumnSettings): NormalizeResult => {
    if (value == null || value === '') return ok(null);
    const n = typeof value === 'number' ? value : Number(String(value).replace(/[, ]/g, ''));
    if (!Number.isFinite(n)) return fail('Expected a number');
    const min = settings.min ?? defaults.min;
    const max = settings.max ?? defaults.max;
    if (min != null && n < min) return fail(`Must be at least ${min}`);
    if (max != null && n > max) return fail(`Must be at most ${max}`);
    return ok(defaults.integer ? Math.round(n) : n);
  };
}

function labelList(settings: ColumnSettings): LabelOption[] {
  return settings.labels ?? settings.options ?? [];
}

function labelNormalizer(value: unknown, settings: ColumnSettings): NormalizeResult {
  if (value == null || value === '') return ok(null);
  if (typeof value !== 'string') return fail('Expected a label id');
  const labels = labelList(settings);
  const found = labels.find((l) => l.id === value) ?? labels.find((l) => l.label.toLowerCase() === value.toLowerCase());
  if (!found) return fail('Unknown label');
  return ok(found.id);
}

function labelText(value: unknown, settings: ColumnSettings) {
  const labels = labelList(settings);
  if (Array.isArray(value)) return value.map((v) => labels.find((l) => l.id === v)?.label ?? '').filter(Boolean).join(', ');
  return labels.find((l) => l.id === value)?.label ?? '';
}

function idList(value: unknown, max = 200): NormalizeResult {
  if (value == null || value === '') return ok(null);
  const arr = Array.isArray(value) ? value : [value];
  if (!arr.every((v) => typeof v === 'string' && v.length > 0 && v.length <= 64)) return fail('Expected a list of ids');
  const uniq = Array.from(new Set(arr as string[]));
  if (uniq.length > max) return fail('Too many values');
  return ok(uniq.length ? uniq : null);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()0-9 .\-x]{3,32}$/;

export function isSafeUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' || u.protocol === 'mailto:';
  } catch {
    return false;
  }
}

const defs: Record<ColumnType, ColumnTypeDef> = {
  text: {
    type: 'text', label: 'Text', category: 'basic',
    defaultSettings: () => ({}),
    normalize: stringNormalizer(1000),
    toText: (v) => str(v),
    sortKey: (v) => (v == null ? null : str(v).toLowerCase()),
    operators: textOps,
    convertibleTo: ['long_text', 'link', 'email', 'phone', 'number', 'status', 'dropdown', 'tags'],
  },
  long_text: {
    type: 'long_text', label: 'Long text', category: 'basic',
    defaultSettings: () => ({}),
    normalize: stringNormalizer(20000),
    toText: (v) => str(v),
    sortKey: (v) => (v == null ? null : str(v).toLowerCase()),
    operators: textOps,
    convertibleTo: ['text'],
  },
  status: {
    type: 'status', label: 'Status', category: 'choice',
    defaultSettings: () => ({ labels: defaultStatusLabels() }),
    normalize: labelNormalizer,
    toText: labelText,
    sortKey: (v, s) => {
      const i = labelList(s).findIndex((l) => l.id === v);
      return i < 0 ? null : i;
    },
    operators: labelOps,
    convertibleTo: ['priority', 'dropdown', 'text'],
  },
  priority: {
    type: 'priority', label: 'Priority', category: 'choice',
    defaultSettings: () => ({ labels: defaultPriorityLabels() }),
    normalize: labelNormalizer,
    toText: labelText,
    sortKey: (v, s) => {
      const i = labelList(s).findIndex((l) => l.id === v);
      return i < 0 ? null : i;
    },
    operators: labelOps,
    convertibleTo: ['status', 'dropdown', 'text'],
  },
  dropdown: {
    type: 'dropdown', label: 'Dropdown', category: 'choice',
    defaultSettings: () => ({ options: [{ id: 'opt1', label: 'Option 1', color: PALETTE[3] }], multiple: true }),
    normalize: (value, settings) => {
      if (value == null || value === '') return ok(null);
      const arr = Array.isArray(value) ? value : [value];
      const labels = labelList(settings);
      const ids: string[] = [];
      for (const v of arr) {
        if (typeof v !== 'string') return fail('Expected option ids');
        const f = labels.find((l) => l.id === v) ?? labels.find((l) => l.label.toLowerCase() === v.toLowerCase());
        if (!f) return fail('Unknown option');
        if (!ids.includes(f.id)) ids.push(f.id);
      }
      if (!settings.multiple && ids.length > 1) return fail('Only one option allowed');
      return ok(ids.length ? ids : null);
    },
    toText: labelText,
    sortKey: (v, s) => {
      const first = Array.isArray(v) ? v[0] : v;
      const i = labelList(s).findIndex((l) => l.id === first);
      return i < 0 ? null : i;
    },
    operators: labelOps,
    convertibleTo: ['status', 'priority', 'tags', 'text'],
  },
  person: {
    type: 'person', label: 'Person', category: 'people',
    defaultSettings: () => ({}),
    normalize: (value) => {
      if (value == null || value === '') return ok(null);
      if (Array.isArray(value)) value = value[0];
      if (typeof value !== 'string' || value.length > 64) return fail('Expected a user id');
      return ok(value);
    },
    toText: (v, _s, ctx) => (typeof v === 'string' ? ctx?.userName?.(v) ?? '' : ''),
    sortKey: (v) => (typeof v === 'string' ? v : null),
    operators: personOps,
    convertibleTo: ['people'],
  },
  people: {
    type: 'people', label: 'Multiple people', category: 'people',
    defaultSettings: () => ({}),
    normalize: (v) => idList(v, 50),
    toText: (v, _s, ctx) => (Array.isArray(v) ? v.map((id) => ctx?.userName?.(id) ?? '').filter(Boolean).join(', ') : ''),
    sortKey: (v) => (Array.isArray(v) && v.length ? v.length : null),
    operators: personOps,
    convertibleTo: ['person'],
  },
  date: {
    type: 'date', label: 'Date', category: 'time',
    defaultSettings: () => ({ includeTime: false }),
    normalize: (value) => {
      if (value == null || value === '') return ok(null);
      if (!isIsoDate(value)) return fail('Expected a date (YYYY-MM-DD)');
      return ok(value);
    },
    toText: (v) => str(v),
    sortKey: (v) => (typeof v === 'string' ? v : null),
    operators: dateOps,
    convertibleTo: ['timeline', 'text'],
  },
  timeline: {
    type: 'timeline', label: 'Timeline', category: 'time',
    defaultSettings: () => ({}),
    normalize: (value) => {
      if (value == null || value === '') return ok(null);
      if (typeof value !== 'object') return fail('Expected {start, end}');
      const { start, end } = value as { start?: unknown; end?: unknown };
      if (!isIsoDate(start) || !isIsoDate(end)) return fail('Timeline needs start and end dates');
      if (end.slice(0, 10) < start.slice(0, 10)) return fail('End date must be after start date');
      return ok({ start: start.slice(0, 10), end: end.slice(0, 10) });
    },
    toText: (v) => (v && typeof v === 'object' ? `${(v as any).start} → ${(v as any).end}` : ''),
    sortKey: (v) => (v && typeof v === 'object' ? (v as any).start : null),
    operators: dateOps,
    convertibleTo: ['date', 'text'],
  },
  number: {
    type: 'number', label: 'Number', category: 'numbers',
    defaultSettings: () => ({ decimals: 0 }),
    normalize: numberNormalizer(),
    toText: (v, s) => (typeof v === 'number' ? v.toFixed(s.decimals ?? 0) : ''),
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: numberOps,
    convertibleTo: ['currency', 'percentage', 'rating', 'progress', 'text'],
  },
  currency: {
    type: 'currency', label: 'Currency', category: 'numbers',
    defaultSettings: () => ({ currency: 'USD', decimals: 2 }),
    normalize: numberNormalizer(),
    toText: (v, s) => {
      if (typeof v !== 'number') return '';
      try {
        return new Intl.NumberFormat('en', { style: 'currency', currency: s.currency || 'USD', maximumFractionDigits: s.decimals ?? 2 }).format(v);
      } catch {
        return v.toFixed(2);
      }
    },
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: numberOps,
    convertibleTo: ['number', 'percentage', 'text'],
  },
  percentage: {
    type: 'percentage', label: 'Percentage', category: 'numbers',
    defaultSettings: () => ({ decimals: 0 }),
    normalize: numberNormalizer(),
    toText: (v, s) => (typeof v === 'number' ? `${v.toFixed(s.decimals ?? 0)}%` : ''),
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: numberOps,
    convertibleTo: ['number', 'progress', 'text'],
  },
  rating: {
    type: 'rating', label: 'Rating', category: 'numbers',
    defaultSettings: () => ({ max: 5 }),
    normalize: (v, s) => numberNormalizer({ min: 0, max: s.max ?? 5, integer: true })(v, { ...s, min: undefined, max: undefined }),
    toText: (v, s) => (typeof v === 'number' ? `${v}/${s.max ?? 5}` : ''),
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: numberOps,
    convertibleTo: ['number', 'text'],
  },
  progress: {
    type: 'progress', label: 'Progress', category: 'numbers',
    defaultSettings: () => ({ mode: 'manual' }),
    normalize: (v, s) => numberNormalizer({ min: 0, max: 100 })(v, { ...s, min: undefined, max: undefined }),
    toText: (v) => (typeof v === 'number' ? `${Math.round(v)}%` : ''),
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: numberOps,
    convertibleTo: ['number', 'percentage', 'text'],
  },
  checkbox: {
    type: 'checkbox', label: 'Checkbox', category: 'basic',
    defaultSettings: () => ({}),
    normalize: (v) => {
      if (v == null || v === '') return ok(null);
      if (typeof v === 'boolean') return ok(v || null);
      if (v === 'true' || v === 1) return ok(true);
      if (v === 'false' || v === 0) return ok(null);
      return fail('Expected true or false');
    },
    toText: (v) => (v ? 'Yes' : 'No'),
    sortKey: (v) => (v ? 1 : 0),
    operators: ['is', 'is_not'],
    convertibleTo: ['text'],
  },
  tags: {
    type: 'tags', label: 'Tags', category: 'choice',
    defaultSettings: () => ({}),
    normalize: (value) => {
      if (value == null || value === '') return ok(null);
      const arr = Array.isArray(value) ? value : String(value).split(',');
      const tags: string[] = [];
      for (const t of arr) {
        if (typeof t !== 'string') return fail('Tags must be text');
        const s = t.trim();
        if (!s) continue;
        if (s.length > 50) return fail('Tags must be at most 50 characters');
        if (!tags.includes(s)) tags.push(s);
      }
      if (tags.length > 50) return fail('Too many tags');
      return ok(tags.length ? tags : null);
    },
    toText: (v) => (Array.isArray(v) ? v.join(', ') : ''),
    sortKey: (v) => (Array.isArray(v) && v.length ? String(v[0]).toLowerCase() : null),
    operators: ['contains', 'not_contains', 'any_of', 'none_of', 'is_empty', 'is_not_empty'],
    convertibleTo: ['text', 'dropdown'],
  },
  link: {
    type: 'link', label: 'Link', category: 'contact',
    defaultSettings: () => ({}),
    normalize: stringNormalizer(2000, (s) => (isSafeUrl(s) ? null : 'Expected an http(s) URL')),
    toText: (v) => str(v),
    sortKey: (v) => (v == null ? null : str(v).toLowerCase()),
    operators: textOps,
    convertibleTo: ['text', 'long_text'],
  },
  email: {
    type: 'email', label: 'Email', category: 'contact',
    defaultSettings: () => ({}),
    normalize: stringNormalizer(320, (s) => (EMAIL_RE.test(s) ? null : 'Expected an email address')),
    toText: (v) => str(v),
    sortKey: (v) => (v == null ? null : str(v).toLowerCase()),
    operators: textOps,
    convertibleTo: ['text', 'long_text'],
  },
  phone: {
    type: 'phone', label: 'Phone', category: 'contact',
    defaultSettings: () => ({}),
    normalize: stringNormalizer(32, (s) => (PHONE_RE.test(s) ? null : 'Expected a phone number')),
    toText: (v) => str(v),
    sortKey: (v) => (v == null ? null : str(v)),
    operators: textOps,
    convertibleTo: ['text', 'long_text'],
  },
  files: {
    type: 'files', label: 'Files', category: 'advanced',
    defaultSettings: () => ({}),
    normalize: (v) => idList(v, 100),
    toText: (v) => (Array.isArray(v) ? `${v.length} file(s)` : ''),
    sortKey: (v) => (Array.isArray(v) ? v.length : null),
    operators: ['is_empty', 'is_not_empty'],
    convertibleTo: [],
  },
  formula: {
    type: 'formula', label: 'Formula', category: 'advanced', computed: true,
    defaultSettings: () => ({ formula: '' }),
    normalize: () => fail('Formula columns are computed'),
    toText: (v) => (v == null ? '' : typeof v === 'number' ? String(Math.round(v * 1000) / 1000) : String(v)),
    sortKey: (v) => (typeof v === 'number' ? v : v == null ? null : String(v)),
    operators: ['is', 'is_not', 'gt', 'gte', 'lt', 'lte', 'contains', 'is_empty', 'is_not_empty'],
    convertibleTo: [],
  },
  created_at: {
    type: 'created_at', label: 'Created date', category: 'system', computed: true,
    defaultSettings: () => ({}),
    normalize: () => fail('Created date is computed'),
    toText: (v) => (typeof v === 'number' ? new Date(v).toISOString().slice(0, 10) : ''),
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: dateOps,
    convertibleTo: [],
  },
  updated_at: {
    type: 'updated_at', label: 'Updated date', category: 'system', computed: true,
    defaultSettings: () => ({}),
    normalize: () => fail('Updated date is computed'),
    toText: (v) => (typeof v === 'number' ? new Date(v).toISOString().slice(0, 10) : ''),
    sortKey: (v) => (typeof v === 'number' ? v : null),
    operators: dateOps,
    convertibleTo: [],
  },
  dependency: {
    type: 'dependency', label: 'Dependency', category: 'advanced',
    defaultSettings: () => ({}),
    normalize: (v) => idList(v, 50),
    toText: (v, _s, ctx) => (Array.isArray(v) ? v.map((id) => ctx?.itemName?.(id) ?? '').filter(Boolean).join(', ') : ''),
    sortKey: (v) => (Array.isArray(v) ? v.length : null),
    operators: ['is_empty', 'is_not_empty'],
    convertibleTo: [],
  },
  location: {
    type: 'location', label: 'Location', category: 'advanced',
    defaultSettings: () => ({}),
    normalize: (value) => {
      if (value == null || value === '') return ok(null);
      if (typeof value === 'string') return value.length <= 300 ? ok({ address: value.trim() }) : fail('Address too long');
      if (typeof value !== 'object') return fail('Expected a location');
      const { address, lat, lng } = value as { address?: unknown; lat?: unknown; lng?: unknown };
      const out: { address: string; lat?: number; lng?: number } = { address: str(address).trim().slice(0, 300) };
      if (lat != null || lng != null) {
        const la = Number(lat);
        const ln = Number(lng);
        if (!Number.isFinite(la) || la < -90 || la > 90 || !Number.isFinite(ln) || ln < -180 || ln > 180) {
          return fail('Invalid coordinates');
        }
        out.lat = la;
        out.lng = ln;
      }
      if (!out.address && out.lat == null) return ok(null);
      return ok(out);
    },
    toText: (v) => (v && typeof v === 'object' ? str((v as any).address) || `${(v as any).lat}, ${(v as any).lng}` : ''),
    sortKey: (v) => (v && typeof v === 'object' ? str((v as any).address).toLowerCase() : null),
    operators: ['contains', 'is_empty', 'is_not_empty'],
    convertibleTo: ['text'],
  },
};

export const columnTypes = defs;

export function getColumnType(type: string): ColumnTypeDef {
  const d = (defs as Record<string, ColumnTypeDef>)[type];
  if (!d) throw new Error(`Unknown column type: ${type}`);
  return d;
}

export function isColumnType(type: string): type is ColumnType {
  return (COLUMN_TYPES as readonly string[]).includes(type);
}

export function isComputed(type: string): boolean {
  return !!(defs as Record<string, ColumnTypeDef>)[type]?.computed;
}

export function isEmptyValue(v: unknown): boolean {
  return v == null || v === '' || v === false || (Array.isArray(v) && v.length === 0);
}

/** Validate a value for a column, including `required`. */
export function normalizeColumnValue(col: ColumnLike, value: unknown): NormalizeResult {
  const def = getColumnType(col.type);
  const res = def.normalize(value, col.settings ?? {});
  if (res.ok && col.required && isEmptyValue(res.value)) return fail(`${col.title} is required`);
  return res;
}

export function canConvert(from: string, to: string): boolean {
  if (from === to) return true;
  const def = (defs as Record<string, ColumnTypeDef>)[from];
  return !!def && def.convertibleTo.includes(to as ColumnType);
}

/**
 * Convert a stored value from one column type to another. Returns null when the
 * value cannot be represented in the new type. Only called when canConvert().
 */
export function convertValue(
  from: ColumnLike,
  toType: string,
  toSettings: ColumnSettings,
  value: unknown,
  ctx?: ValueContext,
): unknown {
  if (value == null) return null;
  const target = getColumnType(toType);
  const attempt = (v: unknown) => {
    const r = target.normalize(v, toSettings);
    return r.ok ? r.value : null;
  };
  if (STRINGISH.includes(from.type as ColumnType) && STRINGISH.includes(toType as ColumnType)) return attempt(value);
  if (NUMERIC.includes(from.type as ColumnType) && NUMERIC.includes(toType as ColumnType)) return attempt(value);
  if (LABELS.includes(from.type as ColumnType) && (LABELS.includes(toType as ColumnType) || toType === 'tags')) {
    const text = getColumnType(from.type).toText(value, from.settings);
    if (!text) return null;
    if (toType === 'tags') return attempt(text.split(', '));
    const parts = toType === 'dropdown' ? text.split(', ') : [text.split(', ')[0]];
    return attempt(toType === 'dropdown' ? parts : parts[0]);
  }
  if (from.type === 'person' && toType === 'people') return attempt([value]);
  if (from.type === 'people' && toType === 'person') return attempt(Array.isArray(value) ? value[0] : null);
  if (from.type === 'date' && toType === 'timeline') return attempt({ start: value, end: value });
  if (from.type === 'timeline' && toType === 'date') return attempt((value as any)?.end);
  if (from.type === 'tags' && toType === 'dropdown') return attempt(value);
  if (from.type === 'text' && (toType === 'status' || toType === 'dropdown' || toType === 'number' || toType === 'tags')) {
    return attempt(toType === 'dropdown' ? [value] : value);
  }
  // Fallback: via text representation.
  return attempt(getColumnType(from.type).toText(value, from.settings, ctx));
}

/** For label columns, make sure every label has a unique id and colour. */
export function sanitizeLabels(labels: unknown): LabelOption[] {
  if (!Array.isArray(labels)) return [];
  const seen = new Set<string>();
  const out: LabelOption[] = [];
  labels.slice(0, 50).forEach((l, i) => {
    if (!l || typeof l !== 'object') return;
    const label = str((l as any).label).trim().slice(0, 60);
    if (!label) return;
    let id = str((l as any).id).trim().slice(0, 40) || rid('l', i);
    while (seen.has(id)) id = id + '_';
    seen.add(id);
    const color = /^#[0-9a-fA-F]{6}$/.test(str((l as any).color)) ? str((l as any).color) : PALETTE[i % PALETTE.length];
    out.push({ id, label, color, ...((l as any).done ? { done: true } : {}) });
  });
  return out;
}

/** Sanitise user-supplied column settings for a given type. */
export function sanitizeColumnSettings(type: string, input: unknown): ColumnSettings {
  const def = getColumnType(type);
  const base = def.defaultSettings();
  const s = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const out: ColumnSettings = { ...base };
  if ('labels' in base || s.labels) {
    if (type === 'status' || type === 'priority') out.labels = s.labels ? sanitizeLabels(s.labels) : base.labels;
  }
  if (type === 'dropdown') {
    out.options = s.options ? sanitizeLabels(s.options) : base.options;
    out.multiple = s.multiple === undefined ? base.multiple : !!s.multiple;
  }
  for (const k of ['min', 'max', 'decimals', 'maxLength'] as const) {
    if (s[k] !== undefined && s[k] !== null && s[k] !== '') {
      const n = Number(s[k]);
      if (Number.isFinite(n)) out[k] = n;
    }
  }
  if (typeof s.pattern === 'string' && s.pattern.length <= 200) out.pattern = s.pattern;
  if (typeof s.currency === 'string' && /^[A-Z]{3}$/.test(s.currency)) out.currency = s.currency;
  if (typeof s.includeTime === 'boolean') out.includeTime = s.includeTime;
  if (type === 'formula' && typeof s.formula === 'string') out.formula = s.formula.slice(0, 2000);
  if (type === 'progress' && (s.mode === 'manual' || s.mode === 'subitems' || s.mode === 'status')) out.mode = s.mode;
  if (type === 'progress' && typeof s.progressStatusColumnId === 'string') out.progressStatusColumnId = s.progressStatusColumnId;
  return out;
}

export function doneLabelIds(col: ColumnLike): string[] {
  return labelList(col.settings ?? {}).filter((l) => l.done).map((l) => l.id);
}

export function labelsOf(col: ColumnLike): LabelOption[] {
  return labelList(col.settings ?? {});
}
