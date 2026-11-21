// Asset Management and Maintenance in BIZOMAT ERP: the shapes the API returns (src/worker/maintenance), the fixed lists
// with their plain-language labels, and the data hooks. The server decides what each person may see and do; the
// screens only show it.
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { formatMoney } from '../../../shared/crm/money';

export type MtRole = 'admin' | 'supervisor' | 'technician' | 'requester';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type WoStatus = 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'closed' | 'cancelled';
export type RequestStatus = 'submitted' | 'awaiting_approval' | 'approved' | 'declined' | 'info_requested' | 'converted' | 'completed' | 'closed';

export const ROLE_LABELS: Record<MtRole, string> = { admin: 'Administrator', supervisor: 'Supervisor', technician: 'Technician', requester: 'Requester' };
export const ROLE_HINTS: Record<MtRole, string> = {
  admin: 'Everything, including the asset import, roles and settings.',
  supervisor: 'Assets, approving requests and managing work orders.',
  technician: 'Works on the work orders assigned to them.',
  requester: 'Raises requests, follows their own and views assets.',
};
export const PRIORITY_LABELS: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };
export const CRITICALITY_LABELS: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };
export const ASSET_STATUS_LABELS: Record<string, string> = { operating: 'Operating', standby: 'Standby', under_maintenance: 'Under maintenance', out_of_service: 'Out of service', disposed: 'Disposed' };
export const STRATEGY_LABELS: Record<string, string> = { run_to_failure: 'Run to failure', preventive: 'Preventive', condition_based: 'Condition based', predictive: 'Predictive' };
export const JOB_TYPE_LABELS: Record<string, string> = {
  corrective: 'Corrective',
  preventive: 'Preventive',
  breakdown: 'Breakdown',
  inspection: 'Inspection',
  emergency_repair: 'Emergency repair',
  electrical: 'Electrical',
  mechanical: 'Mechanical',
  calibration: 'Calibration',
  planned_shutdown: 'Planned shutdown',
  general: 'General',
};
export const WO_STATUS_LABELS: Record<WoStatus, string> = { open: 'Open', assigned: 'Assigned', in_progress: 'In progress', on_hold: 'On hold', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' };
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: 'Submitted',
  awaiting_approval: 'Awaiting approval',
  approved: 'Approved',
  declined: 'Declined',
  info_requested: 'More information requested',
  converted: 'Work order made',
  completed: 'Completed',
  closed: 'Closed',
};

export interface MtMe {
  company: { id: string; name: string; kind: 'registered' | 'own' | 'demo' };
  user: { id: string; name: string };
  role: MtRole;
  roleIsDefault: boolean;
  companyRole: 'owner' | 'admin' | 'manager' | 'employee' | 'read_only';
  approvalRequired: boolean;
  /** Completing a work order needs a sign-off (migration 0040). */
  requireSignature: boolean;
  /** Technicians may record their own work already done. */
  techniciansRecordWork: boolean;
  departments: { id: string; name: string; parentId: string | null }[];
  people: { id: string; name: string; role?: MtRole }[];
  can: { manageAssets: boolean; importAssets: boolean; manageWork: boolean; decide: boolean; roles: boolean; managePm: boolean; manageSetup: boolean; manageStores: boolean; reports: boolean; readings: boolean; prestart: boolean; recordWork: boolean };
}

export interface Asset {
  id: string;
  number: string;
  name: string;
  description: string;
  category: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  registrationNumber: string;
  purchaseDate: string | null;
  commissioningDate: string | null;
  warrantyUntil: string | null;
  supplier: string;
  purchaseCostCents: number | null;
  replacementCostCents: number | null;
  location: string;
  department: string;
  departmentId: string | null;
  departmentName: string | null;
  responsibleId: string | null;
  responsibleName: string | null;
  criticality: string;
  status: string;
  strategy: string;
  specs: { key: string; value: string }[];
  parentId: string | null;
  parentNumber: string | null;
  parentName: string | null;
  archived: boolean;
  siteId: string | null;
  siteCode: string | null;
  siteName: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface MtFile {
  id: string;
  name: string;
  mime: string;
  size: number;
  isImage: boolean;
  uploadedBy: string | null;
  uploadedByName: string | null;
  createdAt: number;
  url: string;
}

export interface MtEvent {
  id: string;
  action: string;
  summary: string;
  actorId: string | null;
  actorName: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  at: number;
}

export interface MtComment {
  id: string;
  body: string;
  authorId: string | null;
  authorName: string | null;
  at: number;
}

export interface MtRequest {
  id: string;
  number: string;
  description: string;
  assetId: string | null;
  assetNumber: string | null;
  assetName: string | null;
  priority: Priority;
  department: string;
  departmentId: string | null;
  departmentName: string | null;
  location: string;
  neededBy: string | null;
  notes: string;
  status: RequestStatus;
  requestedBy: string | null;
  requestedByName: string | null;
  decidedByName: string | null;
  decidedAt: number | null;
  decisionNote: string;
  workOrderId: string | null;
  workOrderNumber: string | null;
  workOrderStatus: WoStatus | null;
  createdAt: number;
}

export interface WorkOrder {
  id: string;
  number: string;
  assetId: string;
  assetNumber: string | null;
  assetName: string | null;
  description: string;
  jobType: string;
  priority: Priority;
  status: WoStatus;
  department: string;
  departmentId: string | null;
  departmentName: string | null;
  trade: string;
  assignedTo: string | null;
  assignedToName: string | null;
  contractor: string;
  dueStart: string | null;
  dueFinish: string | null;
  estimatedMinutes: number | null;
  instructions: string;
  safety: string;
  projectRef: string;
  customerRef: string;
  completionNotes: string;
  completedAt: number | null;
  completedByName: string | null;
  closedAt: number | null;
  cancelledAt: number | null;
  createdAt: number;
  actualMinutes: number | null;
  timerRunning: boolean;
  createdBy?: string | null;
  /** The sign-off: a typed name and a picture drawn on screen, not a verified electronic signature. */
  signedByName: string | null;
  signedByRole: string;
  signedAt: number | null;
  signatureFileId: string | null;
  signatureUrl: string | null;
  /** Made and completed in one step for work already done. */
  recordedDone: boolean;
}

export const mtPath = (companyId: string, path = '') => `/maintenance/c/${encodeURIComponent(companyId)}${path}`;
/** The address of a maintenance page inside the ERP (router paths, under /erp). */
export const mtPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/maintenance${path}`;

export const useMtMe = (companyId: string) => useQuery({ queryKey: ['mt', companyId, 'me'], queryFn: () => get<MtMe>(mtPath(companyId, '/me')), retry: false, enabled: !!companyId });

export function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const money = (cents: number | null | undefined) => (cents === null || cents === undefined ? '' : formatMoney(cents, 'AUD'));

/** 150 -> "2 h 30 min". */
export function minutesText(m: number | null | undefined): string {
  if (m === null || m === undefined) return '';
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? (r ? `${h} h ${r} min` : `${h} h`) : `${r} min`;
}

/** A date stored as YYYY-MM-DD, shown as "14 Nov 2026". */
export function dateText(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export const dateTimeText = (t: number | null | undefined) => (t ? new Date(t).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');

// ------------------------------------------------------------------ stages M2 and M3

export const TRIGGER_LABELS: Record<string, string> = { time: 'Time based', meter: 'Meter based', condition: 'Condition based' };
export const UNIT_LABELS: Record<string, string> = { day: 'Days', week: 'Weeks', month: 'Months' };
export const BASIS_LABELS: Record<string, string> = { completion: 'From the last completion', fixed: 'On fixed dates' };
export const ITEM_KIND_LABELS: Record<string, string> = { pass_fail: 'Pass or fail', number: 'Number', text: 'Text' };
export const FAIL_ACTION_LABELS: Record<string, string> = { work_order: 'Make a corrective work order', request: 'Raise a request', none: 'Nothing (record only)' };

export interface Site {
  id: string;
  code: string;
  name: string;
  address: string;
  notes: string;
  archived: boolean;
  assets: number;
}

export interface Schedule {
  id: string;
  assetId: string;
  assetNumber: string | null;
  assetName: string | null;
  siteId: string | null;
  templateId: string | null;
  templateName: string | null;
  name: string;
  description: string;
  triggerKind: 'time' | 'meter' | 'condition';
  intervalN: number | null;
  intervalUnit: 'day' | 'week' | 'month' | null;
  basis: 'completion' | 'fixed';
  meterInterval: number | null;
  condBelow: number | null;
  condAbove: number | null;
  startDate: string | null;
  jobType: string;
  priority: Priority;
  tasks: string[];
  parts: { part: string; quantity: number }[];
  estimatedMinutes: number | null;
  leadDays: number;
  trade: string;
  assignedTo: string | null;
  assignedToName: string | null;
  inspectionTemplateId: string | null;
  inspectionTemplateName: string | null;
  instructions: string;
  safety: string;
  active: boolean;
  meterId: string | null;
  meterName: string | null;
  meterUnit: string | null;
  meterTotal: number | null;
  nextDueDate: string | null;
  nextDueMeter: number | null;
  lastDoneDate: string | null;
  lastDoneMeter: number | null;
  openWorkOrder: { id: string; number: string; status: WoStatus; dueFinish: string | null } | null;
}

export interface Meter {
  id: string;
  assetId: string;
  assetNumber: string | null;
  assetName: string | null;
  name: string;
  unit: string;
  rising: boolean;
  rolloverValue: number | null;
  expectedMin: number | null;
  expectedMax: number | null;
  lastValue: number | null;
  lastTotal: number | null;
  lastReadAt: number | null;
  readings: number;
  archived: boolean;
}

export interface InspItem {
  id: string;
  position: number;
  label: string;
  kind: 'pass_fail' | 'number' | 'text';
  unit: string;
  min: number | null;
  max: number | null;
  required: boolean;
  critical: boolean;
}

export interface InspResult {
  id: string;
  itemId: string | null;
  label: string;
  kind: string;
  unit: string;
  min: number | null;
  max: number | null;
  critical: boolean;
  passed: boolean | null;
  value: number | null;
  text: string;
  note: string;
  recordedByName: string | null;
  recordedAt: number;
}

/** In words: "every 30 days from the last completion", "every 250 h", "when a reading is above 80". */
export function triggerText(s: Pick<Schedule, 'triggerKind' | 'intervalN' | 'intervalUnit' | 'basis' | 'meterInterval' | 'meterUnit' | 'condBelow' | 'condAbove'>): string {
  if (s.triggerKind === 'time') return `Every ${s.intervalN} ${(s.intervalUnit ?? 'day') + (s.intervalN === 1 ? '' : 's')}, ${s.basis === 'fixed' ? 'on fixed dates' : 'from the last completion'}`;
  if (s.triggerKind === 'meter') return `Every ${s.meterInterval}${s.meterUnit ? ` ${s.meterUnit}` : ' units'}`;
  const parts = [s.condBelow != null ? `below ${s.condBelow}` : '', s.condAbove != null ? `above ${s.condAbove}` : ''].filter(Boolean);
  return `When a reading is ${parts.length ? parts.join(' or ') : 'outside the expected range'}`;
}

/** What is next for a schedule, in words. */
export function nextDueText(s: Schedule): string {
  if (s.openWorkOrder) return `Work order ${s.openWorkOrder.number} is open`;
  if (s.triggerKind === 'time') return s.nextDueDate ? `Due ${dateText(s.nextDueDate)}` : '';
  if (s.triggerKind === 'meter') return s.nextDueMeter != null ? `Due at ${s.nextDueMeter}${s.meterUnit ? ` ${s.meterUnit}` : ''} (now ${s.meterTotal ?? 'no reading'})` : '';
  return 'On the next reading outside the limits';
}

export const useSites = (companyId: string) => useQuery({ queryKey: ['mt', companyId, 'sites'], queryFn: () => get<{ sites: Site[]; unplaced: number; can: { manage: boolean } }>(mtPath(companyId, '/sites')) });

/** A random key for a phone submission, so the same tap sent twice is recorded once. */
export const requestKey = () => `k-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** A local date and time (from a datetime-local field) as milliseconds, or null. */
export const localToMs = (v: string) => (v ? new Date(v).getTime() : null);
/** Milliseconds as a datetime-local value in the browser's time zone. */
export function msToLocal(t: number | null | undefined): string {
  if (!t) return '';
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
