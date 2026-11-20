// The modules framework's screens talk to /api/erp/c/<company>/x/... (src/worker/erp/objects/routes.ts). The server decides
// every permission; these types only describe what it answers.
import { useQuery } from '@tanstack/react-query';
import { get } from '../../../lib/api';
import { appUrl } from '../../../lib/base';
import type { FieldDef, LinesDef, StatusDef } from '../../../../shared/erp-objects';

export const xPath = (companyId: string, path = '') => `/erp/c/${encodeURIComponent(companyId)}/x${path}`;
export const modulePage = (companyId: string, module: string, path = '') => `/c/${encodeURIComponent(companyId)}/m/${module}${path}`;
export const recordPage = (companyId: string, module: string, object: string, id: string) => modulePage(companyId, module, `/${object}/${id}`);
export const xHref = (companyId: string, path: string) => appUrl(`/api${xPath(companyId, path)}`);

export interface ObjectInfo {
  key: string;
  module: string;
  label: string;
  plural: string;
  /** The title field, or a template such as '{firstName} {lastName}'. */
  title: string;
  closed: string[];
  what: string;
  notice: string | null;
  sensitiveEditable?: string[];
  can: { view: boolean; create: boolean; edit: boolean; approve: boolean; self: boolean; import: boolean; own: boolean; customFields?: boolean };
  reports: { key: string; label: string; what: string }[];
}

export interface ObjectFull extends ObjectInfo {
  fields: FieldDef[];
  statuses: StatusDef[];
  lines?: LinesDef | null;
}

export interface Rec {
  id: string;
  object: string;
  number: string;
  title: string;
  status: string;
  data: Record<string, unknown>;
  labels: Record<string, string>;
  amountCents: number | null;
  currency: string | null;
  date: string | null;
  dueDate: string | null;
  ownerId: string | null;
  assigneeId: string | null;
  approverId: string | null;
  createdBy: string | null;
  createdByName: string | null;
  approvedBy: string | null;
  approvedAt: number | null;
  sodException: boolean;
  statusAt: number;
  version: number;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
  hidden: string[];
}

export interface Step {
  key: string;
  label: string;
  to: string;
  note: 'required' | 'optional' | null;
  confirm: string | null;
  requires: string[];
  approval: boolean;
  segregation: boolean;
}

export interface Detail {
  object: ObjectFull;
  record: Rec;
  lines: Record<string, unknown>[] | null;
  lineLabels: Record<string, string>;
  can: { edit: boolean; editLines: boolean; remove: boolean; archive: boolean; comment: boolean; attach: boolean };
  steps: Step[];
  actions: { key: string; label: string; what: string; confirm: string | null; input: FieldDef[] }[];
  related: { id: string; object: string; module: string; objectLabel: string; number: string; title: string; status: string; via: string }[];
  files: { id: string; name: string; mime: string; size: number; isImage: boolean; uploadedBy: string; uploadedByName: string | null; createdAt: number; url: string }[];
  comments: { id: string; body: string; at: number; authorId: string; author: string | null }[];
  history: { id: string; action: string; summary: string; actorName: string | null; before: Record<string, unknown> | null; after: Record<string, unknown> | null; at: number }[];
  editableStatus: boolean;
  /** Journals in Finance's ledger (fixed assets, pay runs, revenue schedules). */
  postings: { journals: { number: number | null; date: string | null; amount: number; covers: string; reversed: boolean; reversalNumber: number | null }[]; url: string | null; currency?: string | null } | null;
}

export interface ModuleOverview {
  module: { key: string; label: string; summary: string; area: string; catalogue: number[]; limits: string[]; icon: string };
  objects: (ObjectInfo & { statuses: StatusDef[]; counts: Record<string, number>; dueSoon: number; mine: number })[];
  recent: { id: string; object: string; number: string; title: string; status: string; updatedAt: number }[];
}

export interface CatalogueModule {
  n: number;
  name: string;
  area: string;
  areaLabel: string;
  status: 'live' | 'improved' | 'new' | 'partial' | 'planned';
  statusLabel: string;
  module?: string;
  path: string | null;
  now: string;
  gaps?: string;
  depends?: number[];
  evidence?: string;
  switchOn: boolean;
  opens: boolean;
}

export interface ReportTable {
  key: string;
  label: string;
  what: string;
  columns: { key: string; label: string; kind?: 'money' | 'number' | 'text' | 'date' }[];
  rows: Record<string, unknown>[];
  note?: string;
}

export const useModule = (companyId: string, module: string) => useQuery({ queryKey: ['erp', companyId, 'x', 'm', module], queryFn: () => get<ModuleOverview>(xPath(companyId, `/m/${module}`)), retry: false });

export const TONE_CLASS: Record<string, string> = { neutral: '', info: 'accent', success: 'success', warning: 'warning', danger: 'danger' };

// ------------------------------------------------------------------ favourites and recently used (this computer only)

const FAV = 'bizomat-erp-favourite-modules';
const RECENT = 'bizomat-erp-recent-modules';

function readList(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 30) : [];
  } catch {
    return [];
  }
}

export const favourites = () => readList(FAV);
export function toggleFavourite(path: string): string[] {
  const list = readList(FAV);
  const next = list.includes(path) ? list.filter((x) => x !== path) : [path, ...list].slice(0, 30);
  try {
    localStorage.setItem(FAV, JSON.stringify(next));
  } catch {
    /* private mode: kept for this visit only */
  }
  window.dispatchEvent(new Event('bizomat-modules-changed'));
  return next;
}

export const recentModules = () => readList(RECENT);
export function noteRecent(path: string) {
  const list = readList(RECENT).filter((x) => x !== path);
  try {
    localStorage.setItem(RECENT, JSON.stringify([path, ...list].slice(0, 12)));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('bizomat-modules-changed'));
}

// ------------------------------------------------------------------ values

export function moneyText(cents: unknown, currency = 'AUD'): string {
  if (typeof cents !== 'number') return '';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
  } catch {
    return (cents / 100).toFixed(2);
  }
}

export function valueText(f: FieldDef, v: unknown, label: string | undefined, currency?: string | null): string {
  if (v === null || v === undefined || v === '') return '';
  switch (f.type) {
    case 'money':
      return moneyText(v, currency ?? 'AUD');
    case 'percent':
      return `${v}%`;
    case 'bool':
      return v ? 'Yes' : 'No';
    case 'select':
      return f.options?.[String(v)] ?? String(v);
    case 'ref':
      return label ?? '';
    case 'date':
      return new Date(`${String(v)}T00:00:00`).toLocaleDateString();
    default:
      return String(v);
  }
}
