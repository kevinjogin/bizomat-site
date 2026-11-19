// The verification service (Stage 1, R6; brief Part 6; docs/platform/verification.md). Checks a registered company
// against its country's register, where one can be asked, and keeps its registration status in the company registry
// (companies.registration_status). Every check is recorded (company_verifications), every change of status too
// (company_verification_history, append only), and the company's owner, administrators and the platform admins are
// told of each change.
//
// Rules:
// - Nothing happens unless "Automatic registry checks" (registry_verification_enabled) is on for the company's country.
// - A register that cannot be reached is never a failure: the check is recorded, tried again later, and the platform
//   admins are alerted when a register keeps failing.
// - Names are compared after case, punctuation and "Pty Ltd" / "Limited" / "LLC" are set aside. A close but not exact
//   match goes to manual review, never to an automatic failure.
// - A company can never mark itself verified: only this service and a platform admin's decision set the status.

import type { Env } from '../env';
import { newId, now } from '../lib/util';
import { enqueueEmail } from '../services/email/outbox';
import { flagOn } from '../platform/flags';
import { abrLookup, nameTokens } from './verify';
import { providerFor, type ProviderId } from './countries';
import type { RegistrationStatus } from './identity';

export const RECHECK_DAYS = 30;
const RETRY_AFTER_OUTAGE_MS = 60 * 60_000;
const ALERT_AFTER_FAILURES = 5;

export type Outcome = 'active' | 'inactive' | 'not_found' | 'unavailable';
export type Trigger = 'initial' | 'on_demand' | 'scheduled' | 'details_changed' | 'admin';
export interface Lookup {
  outcome: Outcome;
  names: string[];
  error?: string;
}

// ------------------------------------------------------------------ names

const NAME_SUFFIXES = /\b(PTY|PROPRIETARY|LIMITED|LTD|LLC|L L C|LLP|INC|INCORPORATED|CORP|CORPORATION|PLC|CO|COMPANY|PVT|PRIVATE|THE)\b/g;
// Punctuation first (so "L.L.C." is "L L C"), then the suffixes.
const words = (name: string) => nameTokens(name).join(' ').replace(NAME_SUFFIXES, ' ').split(/\s+/).filter(Boolean);

/** exact: the same words; close: one name's words all in the other, or most words shared; different: neither. */
export function matchNames(entered: string, registered: string[]): 'exact' | 'close' | 'different' {
  const a = new Set(words(entered));
  if (!a.size) return 'different';
  let best: 'exact' | 'close' | 'different' = 'different';
  for (const r of registered) {
    const b = new Set(words(r));
    if (!b.size) continue;
    const shared = [...a].filter((w) => b.has(w)).length;
    if (shared === a.size && shared === b.size) return 'exact';
    const jaccard = shared / new Set([...a, ...b]).size;
    if (shared === a.size || shared === b.size || jaccard >= 0.6) best = 'close';
  }
  return best;
}

// ------------------------------------------------------------------ registers

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;
let chFetchForTests: Fetcher | null = null;
export function setCompaniesHouseFetchForTests(f: Fetcher | null) {
  chFetchForTests = f;
}

export function providerConfigured(env: Env, p: ProviderId): boolean {
  return p === 'abr' ? !!env.ABR_GUID?.trim() : !!env.COMPANIES_HOUSE_API_KEY?.trim();
}

const INACTIVE_CH = new Set(['dissolved', 'liquidation', 'receivership', 'converted-closed', 'closed', 'insolvency-proceedings', 'administration', 'voluntary-arrangement', 'removed']);

async function companiesHouse(env: Env, number: string): Promise<Lookup> {
  const key = env.COMPANIES_HOUSE_API_KEY?.trim();
  if (!key) return { outcome: 'unavailable', names: [], error: 'not_configured' };
  const f = chFetchForTests ?? ((u: string, init?: RequestInit) => fetch(u, { ...init, signal: AbortSignal.timeout(8000) }));
  let res: Response;
  try {
    res = await f(`https://api.company-information.service.gov.uk/company/${encodeURIComponent(number)}`, { headers: { Authorization: `Basic ${btoa(`${key}:`)}`, Accept: 'application/json' } });
  } catch {
    return { outcome: 'unavailable', names: [], error: 'unreachable' };
  }
  if (res.status === 404) return { outcome: 'not_found', names: [] };
  if (res.status === 401 || res.status === 403) return { outcome: 'unavailable', names: [], error: 'rejected' };
  if (!res.ok) return { outcome: 'unavailable', names: [], error: `http_${res.status}` };
  let data: { company_name?: string; company_status?: string; previous_company_names?: { name?: string }[] };
  try {
    data = await res.json();
  } catch {
    return { outcome: 'unavailable', names: [], error: 'unreadable' };
  }
  const status = String(data.company_status ?? '').toLowerCase();
  return { outcome: status === 'active' ? 'active' : INACTIVE_CH.has(status) ? 'inactive' : status ? 'inactive' : 'unavailable', names: [String(data.company_name ?? '')].filter(Boolean) };
}

async function abr(env: Env, number: string): Promise<Lookup> {
  const r = await abrLookup(env, number);
  if (r.status === 'unavailable') return { outcome: 'unavailable', names: [], error: r.reason };
  if (r.status === 'not_found') return { outcome: 'not_found', names: [] };
  return { outcome: r.status === 'active' ? 'active' : 'inactive', names: [r.entityName, ...(r.businessNames ?? [])].filter(Boolean) };
}

let sleepForTests: ((ms: number) => Promise<void>) | null = null;
export function setRetrySleepForTests(f: ((ms: number) => Promise<void>) | null) {
  sleepForTests = f;
}
const sleep = (ms: number) => (sleepForTests ? sleepForTests(ms) : new Promise<void>((r) => setTimeout(r, ms)));

/** Asks a register, three times with a growing pause when it cannot be reached (never when it is not set up). */
export async function lookup(env: Env, provider: ProviderId, number: string): Promise<Lookup> {
  let last: Lookup = { outcome: 'unavailable', names: [] };
  for (const pause of [0, 400, 1200]) {
    if (pause) await sleep(pause);
    last = provider === 'abr' ? await abr(env, number) : await companiesHouse(env, number);
    if (last.outcome !== 'unavailable' || last.error === 'not_configured' || last.error === 'rejected') break;
  }
  return last;
}

async function recordHealth(env: Env, provider: ProviderId, ok: boolean, error: string | undefined, t: number): Promise<number> {
  await env.DB.prepare(
    `INSERT INTO company_registry_providers (id, last_ok_at, last_error_at, last_error, consecutive_failures, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
     ON CONFLICT(id) DO UPDATE SET last_ok_at = COALESCE(?2, last_ok_at), last_error_at = COALESCE(?3, last_error_at), last_error = COALESCE(?4, last_error),
       consecutive_failures = CASE WHEN ?2 IS NOT NULL THEN 0 ELSE consecutive_failures + 1 END, updated_at = ?6`,
  )
    .bind(provider, ok ? t : null, ok ? null : t, ok ? null : (error ?? 'unavailable').slice(0, 100), ok ? 0 : 1, t)
    .run();
  const r = await env.DB.prepare('SELECT consecutive_failures AS n FROM company_registry_providers WHERE id = ?').bind(provider).first<{ n: number }>();
  return Number(r?.n ?? 0);
}

// ------------------------------------------------------------------ status

interface Subject {
  id: string;
  name: string;
  legal_name: string;
  country: string | null;
  registration_type: string | null;
  registration_number: string | null;
  registration_status: RegistrationStatus;
}

async function subject(db: D1Database, companyId: string): Promise<Subject | null> {
  return db
    .prepare(
      `SELECT c.id, co.name, co.legal_name, c.country, c.registration_type, c.registration_number, c.registration_status
         FROM companies c JOIN co_companies co ON co.id = c.id WHERE c.id = ? AND c.type = 'registered' AND c.deleted_at IS NULL`,
    )
    .bind(companyId)
    .first<Subject>();
}

/** The status a register's answer gives, from the name match and the status before. */
export function statusFrom(outcome: Exclude<Outcome, 'unavailable'>, match: 'exact' | 'close' | 'different' | null, before: RegistrationStatus): RegistrationStatus {
  if (outcome === 'not_found') return 'verification_failed';
  if (outcome === 'inactive') return before === 'verified' ? 'status_changed' : 'deregistered';
  if (match === 'exact') return 'verified';
  if (match === 'close') return 'manual_review';
  return before === 'verified' ? 'status_changed' : 'verification_failed';
}

/**
 * Sets a company's registration status with a history record, and tells its owner, administrators and the platform
 * admins when it changed. source: registry (a register answered), manual (a platform admin decided), system.
 */
export async function setStatus(
  env: Env,
  companyId: string,
  status: RegistrationStatus,
  o: { source: 'registry' | 'manual' | 'system'; reason: string; actorId: string | null; nextCheckAt?: number | null; at?: number },
): Promise<{ changed: boolean; before: RegistrationStatus | null }> {
  const t = o.at ?? now();
  const db = env.DB;
  const cur = await db.prepare('SELECT registration_status FROM companies WHERE id = ?').bind(companyId).first<{ registration_status: RegistrationStatus }>();
  if (!cur) return { changed: false, before: null };
  const changed = cur.registration_status !== status;
  await db.batch([
    db
      .prepare(
        `UPDATE companies SET registration_status = ?1, status_source = ?2,
            status_changed_at = CASE WHEN registration_status IS NOT ?1 THEN ?3 ELSE status_changed_at END,
            verified_at = CASE WHEN ?1 = 'verified' THEN ?3 ELSE NULL END, next_check_at = ?4 WHERE id = ?5`,
      )
      .bind(status, o.source, t, o.nextCheckAt ?? null, companyId),
    ...(changed
      ? [db.prepare('INSERT INTO company_verification_history (id, company_id, old_status, new_status, source, reason, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), companyId, cur.registration_status, status, o.source, o.reason.slice(0, 500), o.actorId, t)]
      : []),
  ]);
  if (changed) await notifyStatusChange(env, companyId, cur.registration_status, status, o.source, o.reason, t);
  return { changed, before: cur.registration_status };
}

export const STATUS_LABELS: Record<RegistrationStatus, string> = {
  not_registered: 'Not registered',
  registration_pending: 'Registration pending',
  verification_in_progress: 'Verification in progress',
  verified: 'Verified',
  verification_failed: 'Verification failed',
  manual_review: 'Requires manual review',
  status_changed: 'Registration status changed',
  suspended: 'Suspended',
  deregistered: 'Deregistered',
};

const ACTION: Partial<Record<RegistrationStatus, string>> = {
  verification_failed: 'Check the registration number and legal name in the company settings, or upload a registration certificate and ask for a manual review.',
  manual_review: 'Nothing for now: BIZOMAT will review it. You can add a registration certificate to help.',
  status_changed: 'The register now shows something different. Check the details, or ask for a manual review.',
  deregistered: 'The register shows the registration as cancelled. If that is wrong, ask for a manual review.',
};

/** Email to the company's owner and administrators, and to the platform admins: what changed, how, and what to do. */
async function notifyStatusChange(env: Env, companyId: string, before: RegistrationStatus, after: RegistrationStatus, source: string, reason: string, t: number) {
  const db = env.DB;
  const co = await db.prepare('SELECT name FROM co_companies WHERE id = ?').bind(companyId).first<{ name: string }>();
  if (!co) return;
  const people = await db
    .prepare(
      `SELECT u.id, u.email, u.name FROM co_members m JOIN users u ON u.id = m.user_id AND u.disabled_at IS NULL WHERE m.company_id = ? AND m.role IN ('owner', 'admin')
       UNION SELECT u.id, u.email, u.name FROM platform_admins p JOIN users u ON u.id = p.user_id AND u.disabled_at IS NULL`,
    )
    .bind(companyId)
    .all<{ id: string; email: string; name: string }>();
  const when = new Date(t).toISOString().slice(0, 16).replace('T', ' ');
  for (const p of people.results) {
    await enqueueEmail(env, {
      userId: p.id,
      to: p.email,
      toName: p.name,
      data: {
        template: 'notification',
        organisation: co.name,
        title: `Registration status: ${STATUS_LABELS[after]}`,
        body: `${co.name}'s registration status changed from "${STATUS_LABELS[before]}" to "${STATUS_LABELS[after]}" on ${when} UTC (source: ${source === 'registry' ? 'the official register' : source === 'manual' ? 'a BIZOMAT review' : 'BIZOMAT'}${reason ? `; ${reason}` : ''}). ${ACTION[after] ?? ''} You can ask for a manual review in Company settings, Verification.`.trim(),
        url: null,
      },
      idempotencyKey: `verification:${companyId}:${t}:${p.id}`,
    }).catch(() => null);
  }
}

// ------------------------------------------------------------------ checks

/**
 * Checks one registered company against its register. Records the check; changes the status only on an answer (an
 * unreachable register leaves it as it is and is tried again in an hour). Returns what happened.
 */
export async function verifyCompany(env: Env, companyId: string, trigger: Trigger, actorId: string | null = null, at = now()) {
  const db = env.DB;
  const s = await subject(db, companyId);
  if (!s) return { result: 'not_registered' as const };
  if (!(await flagOn(db, 'registry_verification_enabled', { companyId, country: s.country }))) return { result: 'flag_off' as const };
  const provider = s.country && s.registration_type ? providerFor(s.country, s.registration_type) : null;
  const record = (outcome: string, extra: { provider?: string; names?: string[]; match?: string | null; after?: string; error?: string }) =>
    db
      .prepare(
        'INSERT INTO company_verifications (id, company_id, provider, country, registration_type, registration_number, outcome, registered_name, name_match, status_before, status_after, error, trigger, actor_id, checked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(newId(), companyId, extra.provider ?? 'manual', s.country, s.registration_type, s.registration_number, outcome, extra.names?.[0]?.slice(0, 200) ?? null, extra.match ?? null, s.registration_status, extra.after ?? s.registration_status, extra.error ?? null, trigger, actorId, at)
      .run();
  if (!provider || !s.registration_number) {
    // No register to ask: verified by hand. A company with a number waits for review; one without stays not registered.
    if (s.registration_number && (s.registration_status === 'not_registered' || s.registration_status === 'registration_pending')) {
      await setStatus(env, companyId, 'manual_review', { source: 'system', reason: 'No register can be asked for this country or number: a BIZOMAT review is needed', actorId, at });
    }
    await record('manual', { after: (await subject(db, companyId))?.registration_status });
    return { result: 'manual' as const };
  }
  if (!providerConfigured(env, provider)) {
    await record('skipped', { provider, error: 'not_configured' });
    return { result: 'not_configured' as const };
  }
  const r = await lookup(env, provider, s.registration_number);
  const failures = await recordHealth(env, provider, r.outcome !== 'unavailable', r.error, at);
  if (r.outcome === 'unavailable') {
    // Never a failure: try again later, and tell the platform admins when the register keeps failing.
    await db.prepare('UPDATE companies SET next_check_at = ? WHERE id = ?').bind(at + RETRY_AFTER_OUTAGE_MS, companyId).run();
    await record('unavailable', { provider, error: r.error ?? 'unavailable' });
    if (failures >= ALERT_AFTER_FAILURES) await alertProviderDown(env, provider, failures, at);
    return { result: 'unavailable' as const };
  }
  const match = r.outcome === 'active' ? matchNames(s.legal_name || s.name, r.names) : null;
  const status = statusFrom(r.outcome, match, s.registration_status);
  const reason =
    r.outcome === 'not_found' ? 'The register has no record of this number' : r.outcome === 'inactive' ? 'The register shows the registration as not active' : match === 'exact' ? 'The register shows it active, under the same name' : match === 'close' ? 'The register shows it active, under a similar name' : 'The register shows it active, under another name';
  await setStatus(env, companyId, status, { source: 'registry', reason, actorId, nextCheckAt: at + RECHECK_DAYS * 86_400_000, at });
  await record(r.outcome, { provider, names: r.names, match, after: status });
  return { result: 'checked' as const, status, match };
}

async function alertProviderDown(env: Env, provider: string, failures: number, at: number) {
  const admins = await env.DB.prepare('SELECT u.id, u.email, u.name FROM platform_admins p JOIN users u ON u.id = p.user_id WHERE u.disabled_at IS NULL').all<{ id: string; email: string; name: string }>();
  const day = new Date(at).toISOString().slice(0, 10);
  for (const a of admins.results) {
    await enqueueEmail(env, {
      userId: a.id,
      to: a.email,
      toName: a.name,
      data: { template: 'notification', organisation: 'BIZOMAT platform', title: `A company register cannot be reached: ${provider}`, body: `The last ${failures} checks with ${provider} could not reach it. Nothing is marked failed because of it; checks are tried again every hour. The Control Centre's Verification page shows its health.`, url: null },
      idempotencyKey: `alert:provider:${provider}:${day}:${a.id}`,
    }).catch(() => null);
  }
}

/** The maintenance run: companies due for a check (first checks and the 30-day re-check), a few a run. */
export async function runScheduledVerification(env: Env, at = now(), max = 10): Promise<{ checked: number; skipped?: string }> {
  if (!(await flagOn(env.DB, 'scheduled_reverification'))) return { checked: 0, skipped: 'flag_off' };
  const due = await env.DB
    .prepare(
      `SELECT id FROM companies WHERE type = 'registered' AND deleted_at IS NULL AND registration_number IS NOT NULL
         AND ((next_check_at IS NOT NULL AND next_check_at <= ?1) OR (next_check_at IS NULL AND registration_status IN ('registration_pending', 'verified')))
       ORDER BY COALESCE(next_check_at, 0) LIMIT ?2`,
    )
    .bind(at, max)
    .all<{ id: string }>();
  let checked = 0;
  for (const { id } of due.results) {
    const r = await verifyCompany(env, id, 'scheduled', null, at);
    if (r.result === 'checked' || r.result === 'unavailable' || r.result === 'manual') checked++;
    else await env.DB.prepare('UPDATE companies SET next_check_at = ? WHERE id = ?').bind(at + 86_400_000, id).run();
  }
  return { checked };
}
