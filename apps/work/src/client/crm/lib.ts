// BIZOMAT CRM in the browser: data hooks, formatting and small helpers shared by every CRM page. The server checks every
// permission; `perms` here only decides what to show.
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { get } from '../lib/api';
import type { CrmMemberDTO, CrmOrgDTO, CrmOrgSummary, CustomFieldDTO, PipelineDTO, TagDTO } from '../../shared/crm/types';
import { formatMoney } from '../../shared/crm/money';
import { ACTIVITY_STATUSES, COMPANY_SIZES, DEAL_STATUSES, PRIORITIES, type ListOption, type OrgSettings } from '../../shared/crm/defaults';
import type { CrmEntity, FieldDef, RecordEntity } from '../../shared/crm/fields';

export const crm = (orgId: string, path = '') => `/crm/orgs/${orgId}${path}`;

export function useOrgId(): string {
  const { orgId } = useParams();
  return orgId ?? '';
}

export function useOrgs() {
  return useQuery({ queryKey: ['crm', 'orgs'], queryFn: () => get<{ orgs: CrmOrgSummary[]; invitations: { id: string; role: string; orgName: string; inviter: string | null; message: string; createdAt: number; expiresAt: number }[] }>('/crm/orgs') });
}

export function useOrg(id?: string) {
  const current = useOrgId();
  const orgId = id ?? current;
  return useQuery({ queryKey: ['crm', orgId, 'org'], queryFn: () => get<CrmOrgDTO>(crm(orgId)), enabled: !!orgId, staleTime: 30_000 });
}

/** The current organisation; only call under the shell (which waits for it). */
export function useCurrentOrg(): CrmOrgDTO {
  const q = useOrg();
  if (!q.data) throw new Error('Organisation not loaded');
  return q.data;
}

export function useMembers(id?: string) {
  const current = useOrgId();
  const orgId = id ?? current;
  return useQuery({ queryKey: ['crm', orgId, 'members'], queryFn: () => get<CrmMemberDTO[]>(crm(orgId, '/members')), enabled: !!orgId, staleTime: 60_000 });
}

export function usePipelines(id?: string) {
  const current = useOrgId();
  const orgId = id ?? current;
  return useQuery({ queryKey: ['crm', orgId, 'pipelines'], queryFn: () => get<PipelineDTO[]>(crm(orgId, '/pipelines')), enabled: !!orgId, staleTime: 60_000 });
}

export function useTags(id?: string) {
  const current = useOrgId();
  const orgId = id ?? current;
  return useQuery({ queryKey: ['crm', orgId, 'tags'], queryFn: () => get<(TagDTO & { uses: number })[]>(crm(orgId, '/tags')), enabled: !!orgId, staleTime: 60_000 });
}

export function useCustomFields(id?: string) {
  const current = useOrgId();
  const orgId = id ?? current;
  return useQuery({ queryKey: ['crm', orgId, 'custom-fields'], queryFn: () => get<CustomFieldDTO[]>(crm(orgId, '/custom-fields')), enabled: !!orgId, staleTime: 60_000 });
}

/** Refetch everything of one organisation after a change (lists, records, dashboard). */
export function useRefreshOrg() {
  const qc = useQueryClient();
  const orgId = useOrgId();
  return (...parts: string[]) => qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'crm' && q.queryKey[1] === orgId && (!parts.length || parts.includes(String(q.queryKey[2]))) });
}

export function useMoney() {
  const org = useOrg().data;
  const currency = org?.currency ?? 'AUD';
  return { currency, fmt: (minor: number | null | undefined, compact = false) => formatMoney(minor, currency, { compact }) };
}

/** People by id, with a label for former members. */
export function usePeople() {
  const members = useMembers().data ?? [];
  const map = new Map(members.map((m) => [m.userId, m]));
  return { members, name: (id: string | null | undefined) => (id ? (map.get(id)?.name ?? 'Former member') : 'Unassigned'), get: (id: string | null | undefined) => (id ? map.get(id) : undefined) };
}

export function optionsOf(list: FieldDef['list'] | undefined, settings: OrgSettings): ListOption[] {
  switch (list) {
    case 'priorities':
      return PRIORITIES;
    case 'companySizes':
      return COMPANY_SIZES;
    case 'dealStatuses':
      return DEAL_STATUSES;
    case 'activityStatuses':
      return ACTIVITY_STATUSES;
    case undefined:
      return [];
    default:
      return settings[list].filter((o) => !o.archived);
  }
}

export function labelOf(list: ListOption[], key: string | null | undefined): string {
  if (!key) return '';
  return list.find((o) => o.key === key)?.label ?? key;
}

export const ENTITY_PATH: Record<CrmEntity, string> = { lead: 'leads', contact: 'contacts', company: 'companies', deal: 'deals', activity: 'activities' };

export function recordPath(orgId: string, entity: RecordEntity | 'activity', id: string) {
  return `/o/${orgId}/${ENTITY_PATH[entity]}/${id}`;
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}

export function dateTime(ms: number | null | undefined): string {
  if (!ms) return '';
  return new Date(ms).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
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

/** Categorical chart colours, checked for colour-blind separation on each theme's surface (CRM charts only). */
const SERIES_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];
const SERIES_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];
export function seriesColor(i: number): string {
  const dark = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark';
  const list = dark ? SERIES_DARK : SERIES_LIGHT;
  return list[Math.min(i, list.length - 1)];
}

/** Minor units to the currency's major units, for chart scales. */
export function major(minor: number, currency: string): number {
  return currency === 'JPY' ? minor : minor / 100;
}

export function download(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const LAST_ORG = 'workos:crm:lastOrg';
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
