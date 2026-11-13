// The company area in the browser (served under /company): data hooks and helpers. The server checks every permission
// (src/worker/company/access.ts); roles here only decide what to show.
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { get } from '../lib/api';

export type CompanyRole = 'owner' | 'admin' | 'member';
export type ToolApp = 'tasks' | 'crm' | 'finance';
export const TOOL_APPS: ToolApp[] = ['tasks', 'crm', 'finance'];

export const TOOL_NAMES: Record<ToolApp, string> = { tasks: 'Project Management', crm: 'Customer Relationship Management', finance: 'Finance' };
export const TOOL_ICONS: Record<ToolApp, string> = { tasks: 'grid', crm: 'briefcase', finance: 'dollar' };
export const COMPANY_ROLE_LABELS: Record<CompanyRole, string> = { owner: 'Owner', admin: 'Administrator', member: 'Member' };

/** Each tool's roles, as the tool names them (the owner is set by the company, never chosen here). */
export const TOOL_ROLES: Record<ToolApp, { id: string; label: string }[]> = {
  tasks: [
    { id: 'admin', label: 'Administrator' },
    { id: 'project_manager', label: 'Project manager' },
    { id: 'member', label: 'Member' },
    { id: 'viewer', label: 'Viewer' },
  ],
  crm: [
    { id: 'admin', label: 'Administrator' },
    { id: 'manager', label: 'Manager' },
    { id: 'sales', label: 'Sales Executive' },
    { id: 'member', label: 'Member' },
    { id: 'viewer', label: 'Viewer' },
  ],
  finance: [
    { id: 'admin', label: 'Administrator' },
    { id: 'accountant', label: 'Accountant' },
    { id: 'finance_manager', label: 'Finance Manager' },
    { id: 'contributor', label: 'Contributor' },
    { id: 'viewer', label: 'Viewer' },
  ],
};

export function toolRoleLabel(app: ToolApp, role: string | null | undefined): string {
  if (!role) return 'No access';
  if (role === 'owner') return 'Owner';
  return TOOL_ROLES[app].find((r) => r.id === role)?.label ?? role;
}

/** Where each tool opens, on this host (the tools are served by this app under their own paths). */
export function toolHref(app: ToolApp, id: string): string {
  if (app === 'tasks') return `/tasks/w/${encodeURIComponent(id)}/home`;
  if (app === 'crm') return `/crm/o/${encodeURIComponent(id)}/overview`;
  return `/finance/o/${encodeURIComponent(id)}/dashboard`;
}

export const STATES = [
  { id: 'ACT', label: 'Australian Capital Territory' },
  { id: 'NSW', label: 'New South Wales' },
  { id: 'NT', label: 'Northern Territory' },
  { id: 'QLD', label: 'Queensland' },
  { id: 'SA', label: 'South Australia' },
  { id: 'TAS', label: 'Tasmania' },
  { id: 'VIC', label: 'Victoria' },
  { id: 'WA', label: 'Western Australia' },
] as const;

export type AbnStatus = 'none' | 'format_ok' | 'active' | 'cancelled' | 'not_found';

export interface CompanyDTO {
  id: string;
  name: string;
  kind: 'business' | 'individual';
  legalName: string;
  country: string;
  abn: string | null;
  acn: string | null;
  abnStatus: AbnStatus;
  register: { entityName: string; entityType: string; gstFrom: string | null; state: string; postcode: string; checkedAt: number | null } | null;
  registerLookup: boolean;
  email: string;
  emailConfirmed: boolean;
  phone: string;
  phoneKind: string;
  address: { line1: string; line2: string; suburb: string; state: string; postcode: string };
  website: string;
  createdAt: number;
  warnings: string[];
}

export interface ToolRoles {
  tasks: string | null;
  crm: string | null;
  finance: string | null;
}

export interface CompanyView {
  company: CompanyDTO;
  me: { role: CompanyRole; roleLabel: string; title: string; toolRoles: ToolRoles; headOf: string[] };
  tools: Record<ToolApp, { id: string; name: string; myRole: string | null } | null>;
  counts: { members: number; departments: number; invitations: number };
}

export interface MineDTO {
  companies: { id: string; name: string; kind: string; abnStatus: AbnStatus; emailConfirmed: boolean; suspended: boolean; role: CompanyRole; memberCount: number }[];
  invitations: { id: string; role: string; company: string; inviter: string | null; expiresAt: number }[];
  ownedTools: Record<ToolApp, { id: string; name: string }[]>;
  registerLookup: boolean;
}

export interface MemberDTO {
  userId: string;
  name: string;
  email: string;
  role: CompanyRole;
  title: string;
  toolRoles: ToolRoles;
  departmentIds: string[];
  joinedAt: number;
  lastActiveAt: number | null;
}

export interface DepartmentDTO {
  id: string;
  parentId: string | null;
  name: string;
  description: string;
  headId: string | null;
  memberIds: string[];
  archivedAt: number | null;
  inTools: Record<ToolApp, boolean>;
  canManage: boolean;
  canChangeMembers: boolean;
}

export const co = (companyId: string, path = '') => `/company/c/${encodeURIComponent(companyId)}${path}`;

export function useMine() {
  return useQuery({ queryKey: ['company', 'mine'], queryFn: () => get<MineDTO>('/company/mine') });
}

export function useCompany(id?: string) {
  const params = useParams();
  const companyId = id ?? params.companyId ?? '';
  return useQuery({ queryKey: ['company', companyId], queryFn: () => get<CompanyView>(co(companyId)), enabled: !!companyId, retry: false });
}

export function useMembers(companyId: string) {
  return useQuery({ queryKey: ['company', companyId, 'members'], queryFn: () => get<{ members: MemberDTO[]; toolOnly: { userId: string; name: string; email: string; tools: Partial<Record<ToolApp, string>> }[] }>(co(companyId, '/members')) });
}

export function useDepartments(companyId: string, archived = false) {
  return useQuery({ queryKey: ['company', companyId, 'departments', archived], queryFn: () => get<DepartmentDTO[]>(co(companyId, `/departments${archived ? '?archived=1' : ''}`)) });
}

const LAST = 'bizomat:company';
export function rememberCompany(id: string) {
  try {
    localStorage.setItem(LAST, id);
  } catch {
    /* ignore */
  }
}
export function lastCompany(): string | null {
  try {
    return localStorage.getItem(LAST);
  } catch {
    return null;
  }
}

/** The ABN's state in words, and how sure it is. */
export function abnLabel(c: Pick<CompanyDTO, 'abnStatus' | 'kind'>): { text: string; tone: 'success' | 'warning' | 'danger' | '' } {
  switch (c.abnStatus) {
    case 'active':
      return { text: 'ABN active on the Australian Business Register', tone: 'success' };
    case 'format_ok':
      return { text: 'ABN check digits valid; not yet confirmed with the register', tone: 'warning' };
    case 'cancelled':
      return { text: 'ABN cancelled on the register', tone: 'danger' };
    case 'not_found':
      return { text: 'ABN not found on the register', tone: 'danger' };
    default:
      return { text: c.kind === 'individual' ? 'In your own name, no ABN' : 'No ABN', tone: '' };
  }
}

/** Departments as a tree, in display order with their depth. */
export function departmentTree(depts: DepartmentDTO[]): (DepartmentDTO & { depth: number })[] {
  const out: (DepartmentDTO & { depth: number })[] = [];
  const ids = new Set(depts.map((d) => d.id));
  const walk = (parent: string | null, depth: number) => {
    for (const d of depts.filter((x) => (x.parentId && ids.has(x.parentId) ? x.parentId : null) === parent).sort((a, b) => a.name.localeCompare(b.name))) {
      out.push({ ...d, depth });
      if (depth < 20) walk(d.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}
