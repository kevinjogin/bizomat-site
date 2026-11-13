// Small helpers shared by the CRM routes: links, history and audit statements, search text, normalisation.

import type { Env } from '../env';
import { appBase } from '../services/app-url';
import { newId, now } from '../lib/util';
import type { RecordEntity } from '../../shared/crm/fields';

/** The CRM is served at /crm on the same host as the app (https://bizomat.ai/crm in production). */
export const CRM_MOUNT = '/crm';

/**
 * An absolute CRM address for emails, built from configuration (the app's validated public address), never from the
 * request: https://bizomat.ai/tasks gives https://bizomat.ai/crm/<path>.
 */
export function crmUrl(env: Env, path: string): string {
  const b = appBase(env);
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${b.origin}${CRM_MOUNT}${clean}`;
}

export function recordLink(orgId: string, entity: RecordEntity | 'activity', id: string): string {
  const seg = entity === 'company' ? 'companies' : entity === 'activity' ? 'activities' : `${entity}s`;
  return `/o/${orgId}/${seg}/${id}`;
}

export interface RecordRefs {
  contactId?: string | null;
  companyId?: string | null;
  dealId?: string | null;
  leadId?: string | null;
}

/** One line of record history (crm_events), shown on the timelines of every record it names. */
export function eventStmt(db: D1Database, e: { orgId: string; type: string; actorId: string | null; refs: RecordRefs; summary: string; data?: Record<string, unknown>; at?: number }) {
  return db
    .prepare('INSERT INTO crm_events (id, org_id, type, actor_id, contact_id, company_id, deal_id, lead_id, summary, data_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), e.orgId, e.type, e.actorId, e.refs.contactId ?? null, e.refs.companyId ?? null, e.refs.dealId ?? null, e.refs.leadId ?? null, e.summary.slice(0, 500), JSON.stringify(e.data ?? {}), e.at ?? now());
}

/** The audit trail of important changes. Never put passwords, tokens or message bodies here. */
export function auditStmt(db: D1Database, e: { orgId: string; actorId: string | null; action: string; targetType?: string; targetId?: string; before?: unknown; after?: unknown; metadata?: Record<string, unknown>; ip?: string | null }) {
  return db
    .prepare('INSERT INTO crm_audit_log (id, org_id, actor_id, action, target_type, target_id, before_json, after_json, metadata_json, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(
      newId(),
      e.orgId,
      e.actorId,
      e.action,
      e.targetType ?? null,
      e.targetId ?? null,
      e.before === undefined ? null : JSON.stringify(e.before),
      e.after === undefined ? null : JSON.stringify(e.after),
      JSON.stringify(e.metadata ?? {}),
      e.ip ?? null,
      now(),
    );
}

/** Lower-cased text used by search (LIKE over one column per record). */
export function searchText(...parts: (string | null | undefined)[]): string {
  return parts
    .filter((p): p is string => !!p)
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
}

/** The last nine digits of each phone number, space-delimited (" 412345678 298765432 "), for duplicate checks. */
export function phoneKeys(...phones: (string | null | undefined)[]): string {
  const keys = new Set<string>();
  for (const p of phones) {
    const d = (p ?? '').replace(/\D/g, '');
    if (d.length >= 6) keys.add(d.slice(-9));
  }
  return keys.size ? ` ${[...keys].join(' ')} ` : '';
}

export function phoneKey(phone: string | null | undefined): string | null {
  const d = (phone ?? '').replace(/\D/g, '');
  return d.length >= 6 ? d.slice(-9) : null;
}

/** "https://www.Example.com.au/about" -> "example.com.au". */
export function domainOf(website: string | null | undefined): string {
  const raw = (website ?? '').trim().toLowerCase();
  if (!raw) return '';
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:\/\//.test(raw) ? raw : `https://${raw}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function fullName(first: string | null | undefined, last: string | null | undefined): string {
  return `${first ?? ''} ${last ?? ''}`.replace(/\s+/g, ' ').trim();
}

/** Today's date in UTC as YYYY-MM-DD, and a date some days away. */
export function isoDate(t = now()): string {
  return new Date(t).toISOString().slice(0, 10);
}
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Today in the organisation's time zone (falls back to UTC for an unknown zone). */
export function todayIn(timezone: string, t = now()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: timezone || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
  } catch {
    return isoDate(t);
  }
}

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** The display name of each record kind, for one id (used in notifications and the timeline). */
export async function recordName(db: D1Database, orgId: string, entity: RecordEntity | 'activity', id: string): Promise<string | null> {
  const sql: Record<string, string> = {
    contact: "SELECT TRIM(first_name || ' ' || last_name) AS n FROM crm_contacts WHERE org_id = ? AND id = ?",
    lead: "SELECT TRIM(first_name || ' ' || last_name) AS n FROM crm_leads WHERE org_id = ? AND id = ?",
    company: 'SELECT name AS n FROM crm_companies WHERE org_id = ? AND id = ?',
    deal: 'SELECT title AS n FROM crm_deals WHERE org_id = ? AND id = ?',
    activity: 'SELECT title AS n FROM crm_activities WHERE org_id = ? AND id = ?',
  };
  const r = await db.prepare(sql[entity]).bind(orgId, id).first<{ n: string }>();
  return r ? r.n || '(no name)' : null;
}

/** @mentions in a note: "@[Name](userId)" tokens written by the client's mention picker. */
export function mentionedIds(body: string): string[] {
  const out = new Set<string>();
  for (const m of body.matchAll(/@\[[^\]]{1,100}\]\(([A-Za-z0-9_-]{8,40})\)/g)) out.add(m[1]);
  return [...out].slice(0, 50);
}
