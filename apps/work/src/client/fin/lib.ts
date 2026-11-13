// BIZOMAT Finance in the browser: data hooks, formatting and small helpers shared by every Finance page. The server
// checks every permission (src/worker/fin/access.ts); `perms` here only decides what to show.
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { get } from '../lib/api';
import { formatMoney, fromMinor, toMinor } from '../../shared/crm/money';
import type { FinPerms, FinRole, WorkspaceKind } from '../../shared/fin/roles';
import type { DocKind, FinSettings } from '../../shared/fin/settings';
import { ACCOUNT_TYPE_LABELS, SUBTYPES, type AccountType } from '../../shared/fin/charts';

export type { FinPerms, FinRole, WorkspaceKind, DocKind, FinSettings };

export interface FinOrgSummary {
  id: string;
  name: string;
  kind: WorkspaceKind;
  logoUrl: string | null;
  role: FinRole;
  memberCount: number;
}

export interface FinInvitationSummary {
  id: string;
  role: FinRole;
  orgName: string;
  orgKind: WorkspaceKind;
  inviter: string | null;
  message: string;
  createdAt: number;
  expiresAt: number;
}

export interface FinOrgDTO {
  id: string;
  name: string;
  kind: WorkspaceKind;
  currency: string;
  country: string;
  timezone: string;
  fyStartMonth: number;
  gstRegistered: boolean;
  /** GST applies: a business registered for GST. */
  gst: boolean;
  gstBasis: 'cash' | 'accrual';
  gstPeriod: 'monthly' | 'quarterly' | 'annual';
  basMethod: 'simpler' | 'full';
  legalName: string;
  abn: string;
  address: string;
  email: string;
  phone: string;
  lockDate: string | null;
  logoUrl: string | null;
  settings: FinSettings;
  createdAt: number;
  role: FinRole;
  perms: FinPerms;
  emailConnected: boolean;
}

export interface FinMemberDTO {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: FinRole;
  title: string;
  joinedAt: number;
}

export type { AccountType };

export interface AccountDTO {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype: string;
  parentId: string | null;
  description: string;
  taxCodeId: string | null;
  systemKey: string | null;
  bankName: string;
  bankNumber: string;
  isDefault: boolean;
  position: number;
  archived: boolean;
  /** A money account (bank, cash, credit card, loan): transactions are recorded against it. */
  money: boolean;
  /** In the account's natural sign (assets and expenses debit positive; the rest credit positive), when visible. */
  balance?: number;
}

export interface TaxCodeDTO {
  id: string;
  code: string;
  name: string;
  rateBp: number;
  direction: 'sales' | 'purchases' | 'both';
  bas: string[];
  systemKey: string | null;
  archived: boolean;
}

export interface TrackingDTO {
  id: string;
  kind: 'department' | 'project' | 'cost_centre';
  name: string;
  code: string;
  archived: boolean;
}

export interface ContactDTO {
  id: string;
  name: string;
  kind: 'customer' | 'supplier' | 'both';
  email: string;
  phone: string;
  abn: string;
  address: string;
  termsDays: number | null;
  defaultAccountId: string | null;
  defaultTaxCodeId: string | null;
  notes: string;
  archived: boolean;
  createdBy: string | null;
  createdAt: number;
  receivable: number;
  payable: number;
}

export interface FinNotificationDTO {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  createdAt: number;
  readAt: number | null;
}

/** API path of a workspace: fin(orgId, '/accounts') is /fin/orgs/<id>/accounts (the client adds /api). */
export const fin = (orgId: string, path = '') => `/fin/orgs/${orgId}${path}`;

export function useOrgId(): string {
  const { orgId } = useParams();
  return orgId ?? '';
}

export function useFinOrgs() {
  return useQuery({ queryKey: ['fin', 'orgs'], queryFn: () => get<{ orgs: FinOrgSummary[]; invitations: FinInvitationSummary[] }>('/fin/orgs') });
}

export function useFinOrg(id?: string) {
  const current = useOrgId();
  const orgId = id ?? current;
  return useQuery({ queryKey: ['fin', orgId, 'org'], queryFn: () => get<FinOrgDTO>(fin(orgId)), enabled: !!orgId, staleTime: 30_000 });
}

/** The current workspace; only call under the shell (which waits for it). */
export function useCurrentOrg(): FinOrgDTO {
  const q = useFinOrg();
  if (!q.data) throw new Error('Workspace not loaded');
  return q.data;
}

export function useMembers() {
  const orgId = useOrgId();
  return useQuery({ queryKey: ['fin', orgId, 'members'], queryFn: () => get<FinMemberDTO[]>(fin(orgId, '/members')), enabled: !!orgId, staleTime: 60_000 });
}

/** The chart of accounts, with balances for people who may see them. */
export function useAccounts() {
  const orgId = useOrgId();
  return useQuery({ queryKey: ['fin', orgId, 'accounts'], queryFn: () => get<AccountDTO[]>(fin(orgId, '/accounts')), enabled: !!orgId, staleTime: 30_000 });
}

export function useTaxCodes() {
  const orgId = useOrgId();
  return useQuery({ queryKey: ['fin', orgId, 'tax-codes'], queryFn: () => get<TaxCodeDTO[]>(fin(orgId, '/tax-codes')), enabled: !!orgId, staleTime: 60_000 });
}

export function useTracking() {
  const orgId = useOrgId();
  return useQuery({ queryKey: ['fin', orgId, 'tracking'], queryFn: () => get<TrackingDTO[]>(fin(orgId, '/tracking')), enabled: !!orgId, staleTime: 60_000 });
}

export function useContacts(enabled = true) {
  const orgId = useOrgId();
  return useQuery({ queryKey: ['fin', orgId, 'contacts'], queryFn: () => get<{ rows: ContactDTO[] } | ContactDTO[]>(fin(orgId, '/contacts')).then((r) => (Array.isArray(r) ? r : r.rows)), enabled: !!orgId && enabled, staleTime: 30_000 });
}

/** Refetch everything of the current workspace after a change (or only the named parts: 'accounts', 'org', ...). */
export function useRefresh() {
  const qc = useQueryClient();
  const orgId = useOrgId();
  return (...parts: string[]) => qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'fin' && q.queryKey[1] === orgId && (!parts.length || parts.includes(String(q.queryKey[2]))) });
}

export function useMoney() {
  const org = useFinOrg().data;
  const currency = org?.currency ?? 'AUD';
  return {
    currency,
    /** Cents to "$1,234.56" (or "A$1.2k" compact). */
    fmt: (minor: number | null | undefined, compact = false) => formatMoney(minor ?? 0, currency, { compact }),
    /** Cents to the plain number a person types ("1234.56"). */
    plain: (minor: number | null | undefined) => (minor === null || minor === undefined ? '' : fromMinor(minor, currency)),
    /** Typed text to cents, or null when empty; throws on text that is not an amount. */
    parse: (text: string) => toMinor(text.replace(/[^\d.,-]/g, '').replace(/,(?=\d{3}(\D|$))/g, ''), currency),
  };
}

/** People by id, with a label for former members. */
export function usePeople() {
  const members = useMembers().data ?? [];
  const map = new Map(members.map((m) => [m.userId, m]));
  return { members, name: (id: string | null | undefined) => (id ? (map.get(id)?.name ?? 'Former member') : '') };
}

/** An account's label: personal charts have four-digit codes kept out of sight, business charts show their codes. */
export function accountLabel(a: Pick<AccountDTO, 'code' | 'name'> | undefined | null): string {
  if (!a) return '';
  return a.code && !/^\d{4}$/.test(a.code) ? `${a.code} ${a.name}` : a.name;
}

export { ACCOUNT_TYPE_LABELS, SUBTYPES };
export const subtypeLabel = (k: string) => SUBTYPES[k]?.label ?? k;

/** Accounts grouped as the chart lists them: parents then their children, in position order. */
export function orderedAccounts(list: AccountDTO[]): AccountDTO[] {
  const byParent = new Map<string | null, AccountDTO[]>();
  for (const a of list) {
    const k = a.parentId && list.some((x) => x.id === a.parentId) ? a.parentId : null;
    byParent.set(k, [...(byParent.get(k) ?? []), a]);
  }
  const sort = (xs: AccountDTO[]) => [...xs].sort((x, y) => x.position - y.position || x.code.localeCompare(y.code) || x.name.localeCompare(y.name));
  const out: AccountDTO[] = [];
  const walk = (parent: string | null) => {
    for (const a of sort(byParent.get(parent) ?? [])) {
      out.push(a);
      walk(a.id);
    }
  };
  walk(null);
  return out;
}

/** Category options for a transaction or document line: income, expenses and (for transfers in a business) others. */
export function categoryOptions(accounts: AccountDTO[], direction: 'in' | 'out' | 'any'): AccountDTO[] {
  const ok = (a: AccountDTO) => !a.archived && !a.money && !a.systemKey && (direction === 'any' || (direction === 'in' ? a.type === 'revenue' || a.type === 'liability' || a.type === 'equity' || a.type === 'asset' : a.type !== 'revenue'));
  const list = orderedAccounts(accounts.filter(ok));
  // Income first for money in, expenses first for money out.
  const first = direction === 'in' ? 'revenue' : 'expense';
  return [...list.filter((a) => a.type === first), ...list.filter((a) => a.type !== first)];
}

export function moneyAccounts(accounts: AccountDTO[]): AccountDTO[] {
  return orderedAccounts(accounts.filter((a) => a.money && !a.archived));
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}

export function longDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function dateTime(ms: number | null | undefined): string {
  if (!ms) return '';
  return new Date(ms).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDaysIso(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Percent from basis points: 1000 -> "10%". */
export const pct = (bp: number) => `${+(bp / 100).toFixed(2)}%`;

/** Opens a file the API serves (CSV, PDF) as a download, with the session cookie. */
export function download(apiPath: string) {
  const a = document.createElement('a');
  a.href = apiPath;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const LAST_ORG = 'workos:fin:lastOrg';
export function rememberOrg(id: string) {
  try {
    localStorage.setItem(LAST_ORG, id);
  } catch {
    /* storage unavailable */
  }
}
export function lastOrg(): string | null {
  try {
    return localStorage.getItem(LAST_ORG);
  } catch {
    return null;
  }
}

/** The full API URL of a path, for links that download (CSV, PDF, files). */
export { appUrl } from '../lib/base';
