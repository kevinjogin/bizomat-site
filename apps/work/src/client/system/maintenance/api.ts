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
  companyRole: 'owner' | 'admin' | 'member';
  approvalRequired: boolean;
  departments: { id: string; name: string; parentId: string | null }[];
  people: { id: string; name: string; role?: MtRole }[];
  can: { manageAssets: boolean; importAssets: boolean; manageWork: boolean; decide: boolean; roles: boolean };
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
