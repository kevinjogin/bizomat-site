// Shared pieces of maintenance stages M2 and M3 (ERP Release 4, part B): date arithmetic for schedules, once-only keys
// (mt_done), history lines written only when a guard holds, and the people and sites of a company without an access
// object (the cron has none).

import { HttpError, newId, now } from '../lib/util';
import { validDate } from './util';

export const DAY_MS = 86_400_000;

/** The UTC date (YYYY-MM-DD) of a time in milliseconds. */
export const utcDate = (t: number) => new Date(t).toISOString().slice(0, 10);

export function addDays(date: string, n: number): string {
  return utcDate(Date.parse(`${date}T00:00:00Z`) + n * DAY_MS);
}

/** Whole days from a to b (b later: positive). */
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);

const daysInMonth = (y: number, m0: number) => new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();

export type IntervalUnit = 'day' | 'week' | 'month';

/**
 * The date `n` units after `date`. Months keep the anchor day where the month has it (31 Jan, 28 Feb, 31 Mar for an
 * anchor of 31), so a monthly schedule never drifts to the end of shorter months for good.
 */
export function addInterval(date: string, n: number, unit: IntervalUnit, anchorDay?: number | null): string {
  if (unit === 'day') return addDays(date, n);
  if (unit === 'week') return addDays(date, 7 * n);
  const [y, m, d] = date.split('-').map(Number);
  const total = m - 1 + n;
  const ny = y + Math.floor(total / 12);
  const nm = ((total % 12) + 12) % 12;
  const day = Math.min(anchorDay ?? d, daysInMonth(ny, nm));
  return `${ny}-${String(nm + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** The server's date, or the caller's own date when it is within a day of it (their time zone). */
export function todayNear(q: string | undefined, t = now()): string {
  const server = utcDate(t);
  if (q && validDate(q) && Math.abs(daysBetween(server, q)) <= 1) return q;
  return server;
}

/** A once-only key: a second transaction writing the same key fails whole. */
export const doneStmt = (db: D1Database, companyId: string, key: string, t = now()) => db.prepare('INSERT INTO mt_done (company_id, key, created_at) VALUES (?, ?, ?)').bind(companyId, key.slice(0, 200), t);

export const isUnique = (e: unknown) => /UNIQUE constraint failed|SQLITE_CONSTRAINT/i.test(String((e as Error)?.message ?? e));

/** A line of history written only when `guard` (a SQL condition) holds in the same transaction. */
export function eventIfStmt(db: D1Database, e: { companyId: string; actorId: string | null; action: string; assetId?: string | null; requestId?: string | null; workOrderId?: string | null; summary: string; before?: unknown; after?: unknown; at?: number }, guard: string, guardArgs: unknown[]) {
  return db
    .prepare(
      `INSERT INTO mt_events (id, company_id, actor_id, action, asset_id, request_id, work_order_id, summary, before_json, after_json, created_at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE ${guard}`,
    )
    .bind(
      newId(),
      e.companyId,
      e.actorId,
      e.action,
      e.assetId ?? null,
      e.requestId ?? null,
      e.workOrderId ?? null,
      e.summary.slice(0, 500),
      e.before === undefined ? null : JSON.stringify(e.before).slice(0, 8000),
      e.after === undefined ? null : JSON.stringify(e.after).slice(0, 8000),
      e.at ?? now(),
      ...guardArgs,
    );
}

/** Whether a person is in the company (a member of a registered company, or the owner of an own or example company). */
export async function inCompany(db: D1Database, companyId: string, userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const r = await db
    .prepare(
      `SELECT 1 AS ok FROM co_members m JOIN users u ON u.id = m.user_id AND u.disabled_at IS NULL WHERE m.company_id = ?1 AND m.user_id = ?2
       UNION ALL SELECT 1 FROM sys_companies WHERE id = ?1 AND owner_id = ?2
       UNION ALL SELECT 1 FROM sys_demo WHERE company_id = ?1 AND user_id = ?2 AND status IN ('building','ready') LIMIT 1`,
    )
    .bind(companyId, userId)
    .first<{ ok: number }>();
  return !!r;
}

/** A site of the company that is not archived, or 400. */
export async function assertSite(db: D1Database, companyId: string, siteId: string | null | undefined, allowArchived = false) {
  if (!siteId) return null;
  const s = await db.prepare('SELECT id, code, name, archived_at FROM mt_sites WHERE company_id = ? AND id = ?').bind(companyId, siteId).first<{ id: string; code: string; name: string; archived_at: number | null }>();
  if (!s) throw new HttpError(400, 'Choose a site of this company');
  if (s.archived_at && !allowArchived) throw new HttpError(400, `Site ${s.code} is archived`);
  return s;
}

/** SQL for "the asset is in the site" (bind: siteId), on an asset alias. */
export const inSiteSql = (assetAlias: string) => `EXISTS (SELECT 1 FROM mt_asset_sites xs WHERE xs.company_id = ${assetAlias}.company_id AND xs.asset_id = ${assetAlias}.id AND xs.site_id = ?)`;

/** Rounds to two decimals (hours, percentages). */
export const r2 = (n: number) => Math.round(n * 100) / 100;
