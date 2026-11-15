// BIZOMAT WHS: hours worked and injury frequency rates (owner's brief of 15 Nov 2026, task 2).
//
// Hours worked are entered by a WHS manager (or an ERP administrator, who may do what a WHS manager does) per site and
// month. BIZOMAT does not track hours and has no payroll link. The site '' is hours for the whole company, not split by
// site; a month holds either one whole-company figure or figures by site, never both, so no hours are counted twice.
// Every change is kept in whs_hours_revisions (migrations/0028_whs_hours.sql, append-only): the hours before and after,
// who and when, and the reason, which is required to change or remove a figure already recorded.
//
// Frequency rates are worked out only over whole calendar months (hours are entered by month), only when every site
// in use in a month has hours for it (0 for a site that did not operate), and only from the classification recorded on each incident (its outcome),
// never from the confidential health record. They are BIZOMAT's counting rules, said on the screen, not a regulator's
// definition:
//   LTIFR = lost time injuries x 1,000,000 / hours worked     (incidents classified "Lost time")
//   TRIFR = recordable injuries x 1,000,000 / hours worked    (classified Medical treatment, Restricted or alternative
//                                                              duties, Lost time, Admitted to hospital, or Death)
// When hours are missing no figure is shown: the screen says which months and sites lack hours.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, now } from '../lib/util';
import { incidentScope, requireWhs, type WhsAccess } from './access';
import { OUTCOMES, eventStmt, isoDate, zLong, zMonth } from './util';

/** The most hours one site may have in one month: about 13,000 people working around the clock. */
export const HOURS_MAX = 10_000_000;
/** The earliest month hours may be entered for. */
export const HOURS_FIRST_MONTH = '2000-01';
/** The longest period rates are worked out for, in months. */
const MAX_RATE_MONTHS = 120;

export const LTI_OUTCOMES = ['lost_time'] as const;
export const RECORDABLE_OUTCOMES = ['medical_treatment', 'restricted_duties', 'lost_time', 'hospital_inpatient', 'fatality'] as const;

export const RATE_FORMULA = {
  ltifr: 'LTIFR = lost time injuries x 1,000,000 / hours worked',
  trifr: 'TRIFR = recordable injuries x 1,000,000 / hours worked',
};
export const RATE_COUNTING = `Lost time injuries are incidents classified "${OUTCOMES.lost_time}". Recordable injuries are incidents classified ${RECORDABLE_OUTCOMES.map((o) => `"${OUTCOMES[o]}"`).join(', ').replace(/, ([^,]*)$/, ' or $1')}. These are BIZOMAT's counting rules from each incident's recorded outcome, not a regulator's definition; medical details are never used.`;

/** The latest month hours may be entered for: the current month (a day's grace for time zones ahead of UTC). */
export const latestHoursMonth = (t = now()) => isoDate(t + 86_400_000).slice(0, 7);

export const monthAfter = (m: string) => {
  const y = Number(m.slice(0, 4));
  const n = Number(m.slice(5, 7));
  return n === 12 ? `${y + 1}-01` : `${y}-${String(n + 1).padStart(2, '0')}`;
};
const monthBefore = (m: string) => {
  const y = Number(m.slice(0, 4));
  const n = Number(m.slice(5, 7));
  return n === 1 ? `${y - 1}-12` : `${y}-${String(n - 1).padStart(2, '0')}`;
};
const lastDayOf = (m: string) => new Date(Date.UTC(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0)).getUTCDate();
/** "Mar 2026" */
export const monthLabel = (m: string) => new Date(Date.UTC(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 1, 1)).toLocaleString('en-AU', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/**
 * The whole calendar months inside a period of dates (YYYY-MM-DD): a month counts only when the period starts on or
 * before its first day and ends on or after its last. [] when there is none; null when there are more than ten years.
 */
export function wholeMonths(from: string, to: string): string[] | null {
  const first = from.slice(8, 10) === '01' ? from.slice(0, 7) : monthAfter(from.slice(0, 7));
  const last = Number(to.slice(8, 10)) === lastDayOf(to.slice(0, 7)) ? to.slice(0, 7) : monthBefore(to.slice(0, 7));
  const out: string[] = [];
  for (let m = first; m <= last; m = monthAfter(m)) {
    out.push(m);
    if (out.length > MAX_RATE_MONTHS) return null;
  }
  return out;
}

const round2 = (x: number) => Math.round(x * 100) / 100;
const siteKey = (id: string | null | undefined) => id ?? '';

// ------------------------------------------------------------------ entering hours

const zEntry = z.object({
  siteId: z.string().max(64).nullable(),
  month: zMonth,
  hours: z.number().finite('Enter a number of hours').min(0, 'Hours cannot be negative').max(HOURS_MAX, `Hours for one site and month cannot be more than ${HOURS_MAX.toLocaleString('en-AU')}`).nullable(),
});

export const hoursRoutes = new Hono<AppEnv>();

/** Hours worked per site and month (WHS managers and ERP administrators). `hours: null` removes a month's figure. */
hoursRoutes.put('/c/:company/hours', async (c) => {
  const a = await requireWhs(c, 'manage');
  const db = c.env.DB;
  const input = await body(c, z.object({ entries: z.array(zEntry).min(1).max(120), reason: zLong(500).optional() }));
  const latest = latestHoursMonth();
  const seen = new Set<string>();
  for (const e of input.entries) {
    if (e.month < HOURS_FIRST_MONTH) throw new HttpError(400, `Hours can be entered from ${monthLabel(HOURS_FIRST_MONTH)}`);
    if (e.month > latest) throw new HttpError(400, `${monthLabel(e.month)} has not started yet: hours can be entered up to the current month`);
    const key = `${siteKey(e.siteId)}|${e.month}`;
    if (seen.has(key)) throw new HttpError(400, 'Enter each site and month once');
    seen.add(key);
  }
  const siteIds = [...new Set(input.entries.map((e) => e.siteId).filter((x): x is string => !!x))];
  const sites = siteIds.length ? (await db.prepare(`SELECT id, name FROM mt_sites WHERE company_id = ? AND id IN (${siteIds.map(() => '?').join(',')})`).bind(a.companyId, ...siteIds).all<{ id: string; name: string }>()).results : [];
  if (sites.length !== siteIds.length) throw new HttpError(400, 'Choose a site of this company');
  const siteName = (id: string) => (id ? (sites.find((s) => s.id === id)?.name ?? 'a site') : 'the whole company');

  // What is recorded now for the months concerned, and what it would be after this save.
  const months = [...new Set(input.entries.map((e) => e.month))];
  const existing = (await db.prepare(`SELECT site_id, month, hours FROM whs_hours WHERE company_id = ? AND month IN (${months.map(() => '?').join(',')})`).bind(a.companyId, ...months).all<{ site_id: string; month: string; hours: number }>()).results;
  const state = new Map<string, Map<string, number>>(months.map((m) => [m, new Map()]));
  for (const r of existing) state.get(r.month)!.set(r.site_id, Number(r.hours));
  const before = new Map(existing.map((r) => [`${r.site_id}|${r.month}`, Number(r.hours)]));
  const changes: { site: string; month: string; before: number | null; after: number | null }[] = [];
  for (const e of input.entries) {
    const site = siteKey(e.siteId);
    const after = e.hours === null ? null : round2(e.hours);
    const was = before.get(`${site}|${e.month}`) ?? null;
    if (after === null) state.get(e.month)!.delete(site);
    else state.get(e.month)!.set(site, after);
    if (was === after) continue;
    changes.push({ site, month: e.month, before: was, after });
  }
  // A month has one figure for the whole company or figures by site, never both.
  for (const e of input.entries) {
    const m = state.get(e.month)!;
    if (!m.has('') || m.size < 2) continue;
    throw new HttpError(
      400,
      siteKey(e.siteId) === ''
        ? `${monthLabel(e.month)} already has hours by site. Enter them by site, or remove the site figures first, so no hours are counted twice.`
        : `${monthLabel(e.month)} already has hours for the whole company, not split by site. Remove that figure first, or keep one figure for the whole company, so no hours are counted twice.`,
    );
  }
  if (!changes.length) return c.json({ ok: true, changed: 0 });
  const reason = (input.reason ?? '').trim();
  if (changes.some((x) => x.before !== null) && reason.length < 3) throw new HttpError(400, 'Give a reason for changing or removing hours already recorded');

  const t = now();
  await db.batch([
    ...changes.flatMap((x) => [
      // the figure before is read inside the same transaction, so the history is exact even when two people save at once
      db
        .prepare('INSERT INTO whs_hours_revisions (id, company_id, site_id, month, before_hours, after_hours, reason, changed_by, changed_at) VALUES (?, ?, ?, ?, (SELECT hours FROM whs_hours WHERE company_id = ? AND site_id = ? AND month = ?), ?, ?, ?, ?)')
        .bind(newId(), a.companyId, x.site, x.month, a.companyId, x.site, x.month, x.after, x.before === null ? '' : reason, a.userId, t),
      x.after === null
        ? db.prepare('DELETE FROM whs_hours WHERE company_id = ? AND site_id = ? AND month = ?').bind(a.companyId, x.site, x.month)
        : db
            .prepare('INSERT INTO whs_hours (company_id, site_id, month, hours, entered_by, entered_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(company_id, site_id, month) DO UPDATE SET hours = excluded.hours, entered_by = excluded.entered_by, entered_at = excluded.entered_at')
            .bind(a.companyId, x.site, x.month, x.after, a.userId, t),
    ]),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'settings.hours',
      entityType: 'settings',
      entityId: a.companyId,
      summary:
        changes.length === 1
          ? `Hours worked, ${siteName(changes[0].site)}, ${monthLabel(changes[0].month)}: ${changes[0].before === null ? 'entered' : changes[0].after === null ? 'removed' : 'changed'}${reason && changes[0].before !== null ? ` (${reason.slice(0, 120)})` : ''}`
          : `Hours worked: ${changes.length} site-months entered or changed${reason ? ` (${reason.slice(0, 120)})` : ''}`,
      before: { entries: changes.map((x) => ({ siteId: x.site || null, month: x.month, hours: x.before })) },
      after: { entries: changes.map((x) => ({ siteId: x.site || null, month: x.month, hours: x.after })), reason: reason || undefined },
      at: t,
    }),
  ]);
  return c.json({ ok: true, changed: changes.length });
});

/** Hours worked as WHS settings shows them, with their history: only people who read the WHS registers. */
export async function hoursView(db: D1Database, a: WhsAccess) {
  if (!a.can.view) return { hours: [], hoursHistory: [], hoursSites: [], hoursLimits: { latestMonth: latestHoursMonth(), firstMonth: HOURS_FIRST_MONTH, maxHours: HOURS_MAX }, hoursVisible: false };
  const [hours, history, sites] = await db.batch([
    db.prepare('SELECT h.*, s.name AS site_name, u.name AS entered_by_name FROM whs_hours h LEFT JOIN mt_sites s ON s.company_id = h.company_id AND s.id = h.site_id LEFT JOIN users u ON u.id = h.entered_by WHERE h.company_id = ? ORDER BY h.month DESC, s.name LIMIT 600').bind(a.companyId),
    db.prepare('SELECT r.*, s.name AS site_name, u.name AS changed_by_name FROM whs_hours_revisions r LEFT JOIN mt_sites s ON s.company_id = r.company_id AND s.id = r.site_id LEFT JOIN users u ON u.id = r.changed_by WHERE r.company_id = ? ORDER BY r.changed_at DESC, r.rowid DESC LIMIT 100').bind(a.companyId),
    db.prepare('SELECT id, name, archived_at FROM mt_sites WHERE company_id = ? ORDER BY archived_at IS NOT NULL, name').bind(a.companyId),
  ]);
  return {
    hours: (hours.results as any[]).map((h) => ({ siteId: h.site_id || null, siteName: h.site_id ? (h.site_name ?? null) : null, month: h.month, hours: Number(h.hours), enteredByName: h.entered_by_name ?? null, enteredAt: h.entered_at })),
    hoursHistory: (history.results as any[]).map((r) => ({
      id: r.id,
      siteId: r.site_id || null,
      siteName: r.site_id ? (r.site_name ?? null) : null,
      month: r.month,
      before: r.before_hours === null ? null : Number(r.before_hours),
      after: r.after_hours === null ? null : Number(r.after_hours),
      reason: r.reason,
      byName: r.changed_by_name ?? null,
      at: r.changed_at,
    })),
    // every site, archived ones too: an archived site may need hours for the months it was in use
    hoursSites: (sites.results as any[]).map((x) => ({ id: x.id, name: x.name, archived: x.archived_at !== null })),
    hoursLimits: { latestMonth: latestHoursMonth(), firstMonth: HOURS_FIRST_MONTH, maxHours: HOURS_MAX },
    hoursVisible: true,
  };
}

// ------------------------------------------------------------------ frequency rates

export interface MissingHours {
  month: string;
  siteId: string | null;
  siteName: string | null;
  /** missing: no figure; not_split: the month has a whole-company figure only; both: whole-company and site figures */
  reason: 'missing' | 'not_split' | 'both';
}

export interface RateFigures {
  available: boolean;
  /** The whole months the rates cover (YYYY-MM), or null when there is none. */
  period: { from: string; to: string; months: number } | null;
  hours: number;
  lti: number;
  recordable: number;
  ltifr: number | null;
  trifr: number | null;
  missing: MissingHours[];
  note: string;
}

interface SiteRow {
  id: string;
  name: string;
  created_at: number;
  archived_at: number | null;
}

const joinAnd = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const monthList = (ms: string[]) => (ms.length > 6 ? `${ms.slice(0, 6).map(monthLabel).join(', ')} and ${ms.length - 6} more` : ms.map(monthLabel).join(', '));

/** "Cannot be calculated: hours worked missing for ..." from the months and sites without hours. */
export function missingNote(missing: MissingHours[]): string {
  const both = missing.filter((x) => x.reason === 'both').map((x) => x.month);
  const groups = new Map<string, string[]>();
  for (const x of missing) {
    if (x.reason === 'both') continue;
    const label = x.siteName ?? (x.siteId ? 'a site' : 'the whole company');
    groups.set(label, [...(groups.get(label) ?? []), x.month]);
  }
  const parts: string[] = [];
  if (groups.size) parts.push(`Cannot be calculated: hours worked missing for ${joinAnd([...groups].map(([label, ms]) => `${label} (${monthList(ms)})`))}.`);
  if (missing.some((x) => x.reason === 'not_split')) parts.push('Some of those months have one figure for the whole company, which cannot be split by site.');
  if (both.length) parts.push(`${groups.size ? '' : 'Cannot be calculated: '}${monthList(both)} ${both.length === 1 ? 'has' : 'have'} hours for the whole company and by site; keep one, so no hours are counted twice.`);
  parts.push('A WHS manager enters hours in WHS settings.');
  return parts.join(' ');
}

const unavailable = (period: RateFigures['period'], note: string, extra: Partial<RateFigures> = {}): RateFigures => ({ available: false, period, hours: 0, lti: 0, recordable: 0, ltifr: null, trifr: null, missing: [], note, ...extra });

/**
 * LTIFR and TRIFR for a period, company-wide (or for the site filtered) and for each site. The incidents counted are
 * those the person may see (the dashboard's own rule): for someone who does not read confidential reports the screen
 * says so. Department and incident-type filters give no rates: hours are entered by site.
 */
export async function frequencyRates(db: D1Database, a: WhsAccess, f: { from: string; to: string; site?: string; department?: string; kind?: string }): Promise<{ company: RateFigures; sites: Record<string, RateFigures>; formula: typeof RATE_FORMULA; counting: string; scope: string | null }> {
  const meta = { formula: RATE_FORMULA, counting: RATE_COUNTING, scope: a.can.confidential ? null : 'Counts the incidents you can see. The figures of WHS managers also count confidential reports.' };
  if (f.department || f.kind) return { ...meta, company: unavailable(null, 'Rates are not worked out for a department or an incident type: hours worked are entered by site.'), sites: {} };
  const months = wholeMonths(f.from, f.to);
  if (months === null) return { ...meta, company: unavailable(null, 'Cannot be calculated: choose a period of ten years or less.'), sites: {} };
  if (!months.length) return { ...meta, company: unavailable(null, 'Cannot be calculated: rates use whole calendar months, because hours are entered by month, and this period has none. Choose a period that covers at least one whole month.'), sites: {} };
  const period = { from: months[0], to: months[months.length - 1], months: months.length };
  const scope = incidentScope(a, 'i');
  const lastDate = `${period.to}-${String(lastDayOf(period.to)).padStart(2, '0')}`;
  const marks = (xs: readonly string[]) => xs.map(() => '?').join(',');
  const [siteRows, hourRows, incRows] = await db.batch([
    db.prepare('SELECT id, name, created_at, archived_at FROM mt_sites WHERE company_id = ? ORDER BY name').bind(a.companyId),
    db.prepare('SELECT site_id, month, hours FROM whs_hours WHERE company_id = ? AND month >= ? AND month <= ?').bind(a.companyId, period.from, period.to),
    db
      .prepare(
        `SELECT COALESCE(i.site_id, '') AS site, substr(i.occurred_date, 1, 7) AS m, COUNT(*) AS n,
                SUM(CASE WHEN i.outcome IN (${marks(LTI_OUTCOMES)}) THEN 1 ELSE 0 END) AS lti,
                SUM(CASE WHEN i.outcome IN (${marks(RECORDABLE_OUTCOMES)}) THEN 1 ELSE 0 END) AS recordable
           FROM whs_incidents i WHERE i.company_id = ? AND ${scope.sql} AND i.occurred_date >= ? AND i.occurred_date <= ? GROUP BY site, m`,
      )
      .bind(...LTI_OUTCOMES, ...RECORDABLE_OUTCOMES, a.companyId, ...scope.args, `${period.from}-01`, lastDate),
  ]);
  const sites = siteRows.results as unknown as SiteRow[];
  const hours = new Map<string, Map<string, number>>();
  for (const r of hourRows.results as any[]) {
    if (!hours.has(r.month)) hours.set(r.month, new Map());
    hours.get(r.month)!.set(r.site_id, Number(r.hours));
  }
  const inc = new Map<string, { n: number; lti: number; recordable: number }>();
  for (const r of incRows.results as any[]) inc.set(`${r.site}|${r.m}`, { n: Number(r.n), lti: Number(r.lti ?? 0), recordable: Number(r.recordable ?? 0) });
  const monthOf = (t: number) => isoDate(t).slice(0, 7);
  /**
   * Whether a site needs hours for a month. A site in use needs them for every month (enter 0 for a month it did not
   * operate): the date a site was added to BIZOMAT is not the date it opened, so leaving a site out because it was added
   * later could undercount hours and overstate the rates. An archived site needs them from the month it was added to
   * the month it was archived, and any month it has hours or incidents.
   */
  const worked = (s: SiteRow, m: string) => s.archived_at === null || (monthOf(s.created_at) <= m && monthOf(s.archived_at) >= m) || !!hours.get(m)?.has(s.id) || (inc.get(`${s.id}|${m}`)?.n ?? 0) > 0;
  const finish = (h: number, lti: number, recordable: number, missing: MissingHours[]): RateFigures => {
    if (missing.length) return unavailable(period, missingNote(missing), { hours: h, lti, recordable, missing: missing.slice(0, 60) });
    if (h <= 0) return unavailable(period, 'Cannot be calculated: the hours worked entered for this period add up to zero.', { lti, recordable });
    return {
      available: true,
      period,
      hours: round2(h),
      lti,
      recordable,
      ltifr: round2((lti * 1_000_000) / h),
      trifr: round2((recordable * 1_000_000) / h),
      missing: [],
      note: `Per million hours worked, over the whole months ${monthLabel(period.from)} to ${monthLabel(period.to)}, from the hours entered in WHS settings.`,
    };
  };

  const siteFigures = (s: SiteRow): RateFigures => {
    let h = 0;
    let lti = 0;
    let recordable = 0;
    let counted = 0;
    const missing: MissingHours[] = [];
    for (const m of months) {
      if (!worked(s, m)) continue;
      counted++;
      const row = hours.get(m);
      const c = inc.get(`${s.id}|${m}`);
      lti += c?.lti ?? 0;
      recordable += c?.recordable ?? 0;
      if (row?.has(s.id)) h += row.get(s.id)!;
      else missing.push({ month: m, siteId: s.id, siteName: s.name, reason: row?.has('') ? 'not_split' : 'missing' });
    }
    if (!counted) return unavailable(period, 'The site was not in use in this period.');
    return finish(h, lti, recordable, missing);
  };

  const companyFigures = (): RateFigures => {
    let h = 0;
    let lti = 0;
    let recordable = 0;
    const missing: MissingHours[] = [];
    for (const m of months) {
      for (const [k, c] of inc) {
        if (!k.endsWith(`|${m}`)) continue;
        lti += c.lti;
        recordable += c.recordable;
      }
      const row = hours.get(m) ?? new Map<string, number>();
      const whole = row.get('');
      const bySite = [...row].filter(([k]) => k !== '');
      if (whole !== undefined && bySite.length) {
        missing.push({ month: m, siteId: null, siteName: null, reason: 'both' });
        continue;
      }
      if (whole !== undefined) {
        h += whole;
        continue;
      }
      const lacking = sites.filter((s) => worked(s, m) && !row.has(s.id));
      if (!bySite.length && !lacking.length) {
        missing.push({ month: m, siteId: null, siteName: null, reason: 'missing' });
        continue;
      }
      if (lacking.length) {
        for (const s of lacking) missing.push({ month: m, siteId: s.id, siteName: s.name, reason: 'missing' });
        continue;
      }
      h += bySite.reduce((sum, [, v]) => sum + v, 0);
    }
    return finish(h, lti, recordable, missing);
  };

  const bySite: Record<string, RateFigures> = {};
  for (const s of sites) if (s.archived_at === null) bySite[s.id] = siteFigures(s);
  let company: RateFigures;
  if (f.site) {
    const s = sites.find((x) => x.id === f.site);
    company = s ? (bySite[s.id] ?? siteFigures(s)) : unavailable(period, 'Choose a site of this company.');
  } else company = companyFigures();
  return { ...meta, company, sites: bySite };
}
