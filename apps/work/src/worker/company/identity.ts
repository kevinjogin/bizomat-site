// One company identity (Stage 1, R3; migration 0030_company_identity.sql, docs/platform/company-identity.md).
//
// `companies` has one row for every company of every kind, with the id it already had: registered companies
// (co_companies), each person's own company (sys_companies) and example companies (sys_demo). Those tables stay the
// source of their own details (expand first: they are folded in only with the owner's approval). This file keeps the
// registry in step: syncCompany after every write to one of them, and syncAllCompanies in the 15-minute maintenance run
// as a repair, so a missed call is put right within minutes. companyDrift says what is out of step (the console's
// integrity check reads it).
//
// Registration. Until the verification service of R6 takes over, a registered company's status comes from its ABN
// checks, claiming no more than they found: a number whose format was checked, or that the Australian Business Register
// found active, is pending (the register was never compared with the company's name), never verified. A cancelled ABN
// is deregistered and an ABN the register did not find goes to manual review. A status a platform admin set by hand
// (status_source manual) is kept until the number changes.

import { now } from '../lib/util';

export type CompanyType = 'registered' | 'personal' | 'example';

export const REGISTRATION_STATUSES = [
  'not_registered',
  'registration_pending',
  'verification_in_progress',
  'verified',
  'verification_failed',
  'manual_review',
  'status_changed',
  'suspended',
  'deregistered',
] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

// The ABN, else the ACN when no other live company holds the same ACN without an ABN (the ACN is not unique in
// co_companies, and the registry allows one company per number).
const REG_TYPE = `CASE WHEN co.abn IS NOT NULL THEN 'ABN' WHEN co.acn IS NOT NULL AND (SELECT COUNT(*) FROM co_companies x WHERE x.acn = co.acn AND x.abn IS NULL AND x.deleted_at IS NULL) = 1 THEN 'ACN' END`;
const REG_NUMBER = `CASE WHEN co.abn IS NOT NULL THEN co.abn WHEN co.acn IS NOT NULL AND (SELECT COUNT(*) FROM co_companies x WHERE x.acn = co.acn AND x.abn IS NULL AND x.deleted_at IS NULL) = 1 THEN co.acn END`;
const REG_STATUS = `CASE co.abn_status WHEN 'format_ok' THEN 'registration_pending' WHEN 'active' THEN 'registration_pending' WHEN 'cancelled' THEN 'deregistered' WHEN 'not_found' THEN 'manual_review' ELSE 'not_registered' END`;
const REG_SOURCE = `CASE co.abn_status WHEN 'none' THEN 'none' WHEN 'format_ok' THEN 'format' ELSE 'registry' END`;
// Keep a status a person decided while the number is the same.
const KEEP_MANUAL = `companies.status_source = 'manual' AND companies.registration_number IS excluded.registration_number`;

// ?1: one company id, or NULL for every company. ?2 (registered companies only): the time now.
const REGISTERED = `
  INSERT INTO companies (id, type, name, owner_id, country, legal_structure, registration_type, registration_number, registration_status, status_source, status_changed_at, created_at, updated_at, suspended_at, deleted_at)
  SELECT co.id, 'registered', co.name, (SELECT m.user_id FROM co_members m WHERE m.company_id = co.id AND m.role = 'owner'), co.country, co.kind,
         ${REG_TYPE}, ${REG_NUMBER}, ${REG_STATUS}, ${REG_SOURCE}, CASE WHEN co.abn_status = 'none' THEN NULL ELSE ?2 END,
         co.created_at, co.updated_at, co.suspended_at, co.deleted_at
    FROM co_companies co WHERE (?1 IS NULL OR co.id = ?1)
  ON CONFLICT(id) DO UPDATE SET
    type = 'registered', name = excluded.name, owner_id = excluded.owner_id, country = excluded.country, legal_structure = excluded.legal_structure,
    registration_type = excluded.registration_type, registration_number = excluded.registration_number,
    registration_status = CASE WHEN ${KEEP_MANUAL} THEN companies.registration_status ELSE excluded.registration_status END,
    status_source = CASE WHEN ${KEEP_MANUAL} THEN companies.status_source ELSE excluded.status_source END,
    status_changed_at = CASE WHEN ${KEEP_MANUAL} THEN companies.status_changed_at
                             WHEN excluded.registration_status IS NOT companies.registration_status THEN ?2 ELSE companies.status_changed_at END,
    verified_at = CASE WHEN ${KEEP_MANUAL} THEN companies.verified_at ELSE NULL END,
    updated_at = excluded.updated_at, suspended_at = excluded.suspended_at, deleted_at = excluded.deleted_at
  WHERE companies.name IS NOT excluded.name OR companies.owner_id IS NOT excluded.owner_id OR companies.country IS NOT excluded.country
     OR companies.legal_structure IS NOT excluded.legal_structure OR companies.registration_number IS NOT excluded.registration_number
     OR companies.registration_type IS NOT excluded.registration_type
     OR (companies.registration_status IS NOT excluded.registration_status AND NOT (${KEEP_MANUAL}))
     OR companies.suspended_at IS NOT excluded.suspended_at
     OR companies.deleted_at IS NOT excluded.deleted_at OR companies.type <> 'registered'`;

const PERSONAL = `
  INSERT INTO companies (id, type, name, owner_id, created_at, updated_at)
  SELECT s.id, 'personal', s.name, s.owner_id, s.created_at, s.updated_at FROM sys_companies s WHERE (?1 IS NULL OR s.id = ?1)
  ON CONFLICT(id) DO UPDATE SET type = 'personal', name = excluded.name, owner_id = excluded.owner_id, updated_at = excluded.updated_at, deleted_at = NULL
  WHERE companies.name IS NOT excluded.name OR companies.owner_id IS NOT excluded.owner_id OR companies.deleted_at IS NOT NULL
     OR companies.type <> 'personal'`;

const EXAMPLE = `
  INSERT INTO companies (id, type, name, owner_id, created_at, updated_at, deleted_at)
  SELECT d.company_id, 'example', d.name, d.user_id, d.created_at, d.updated_at, CASE WHEN d.status = 'removed' THEN COALESCE(d.removed_at, d.updated_at) END
    FROM sys_demo d WHERE (?1 IS NULL OR d.company_id = ?1)
  ON CONFLICT(id) DO UPDATE SET type = 'example', name = excluded.name, owner_id = excluded.owner_id, updated_at = excluded.updated_at, deleted_at = excluded.deleted_at
  WHERE companies.name IS NOT excluded.name OR companies.owner_id IS NOT excluded.owner_id OR companies.deleted_at IS NOT excluded.deleted_at
     OR companies.type <> 'example'`;

// A registry row whose source is gone (a person's account was deleted, which removes their own and example company) is
// marked deleted, never removed: company_settings and later records keep their company.
const ORPHANS = `
  UPDATE companies SET deleted_at = ?1, updated_at = ?1
   WHERE deleted_at IS NULL AND (
         (type = 'registered' AND id NOT IN (SELECT id FROM co_companies))
      OR (type = 'personal' AND id NOT IN (SELECT id FROM sys_companies))
      OR (type = 'example' AND id NOT IN (SELECT company_id FROM sys_demo)))`;

/** The statements that bring one company's registry row in step (only one of them finds the company). */
export function syncCompanyStatements(db: D1Database, companyId: string, at = now()): D1PreparedStatement[] {
  return [db.prepare(REGISTERED).bind(companyId, at), db.prepare(PERSONAL).bind(companyId), db.prepare(EXAMPLE).bind(companyId)];
}

/** Brings one company's registry row in step after a write to co_companies, co_members (its owner), sys_companies or
 * sys_demo. Rows already in step are not touched. */
export async function syncCompany(db: D1Database, companyId: string, at = now()): Promise<void> {
  await db.batch(syncCompanyStatements(db, companyId, at));
}

/** The repair: every company in step, and rows whose source is gone marked deleted. Returns the rows changed. */
export async function syncAllCompanies(db: D1Database, at = now()): Promise<{ changed: number; orphaned: number }> {
  const [r, p, e, o] = await db.batch([
    db.prepare(REGISTERED).bind(null, at),
    db.prepare(PERSONAL).bind(null),
    db.prepare(EXAMPLE).bind(null),
    db.prepare(ORPHANS).bind(at),
  ]);
  return { changed: (r.meta.changes ?? 0) + (p.meta.changes ?? 0) + (e.meta.changes ?? 0), orphaned: o.meta.changes ?? 0 };
}

export interface CompanyDrift {
  /** Companies with no registry row. */
  missing: number;
  /** Registry rows whose name, owner, type or deletion differs from the company's own table. */
  mismatched: number;
  /** Live registry rows whose company is gone. */
  orphaned: number;
}

/** What is out of step between the registry and the companies' own tables (counts only, never names). */
export async function companyDrift(db: D1Database): Promise<CompanyDrift> {
  const row = await db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM co_companies co WHERE NOT EXISTS (SELECT 1 FROM companies c WHERE c.id = co.id))
       + (SELECT COUNT(*) FROM sys_companies s WHERE NOT EXISTS (SELECT 1 FROM companies c WHERE c.id = s.id))
       + (SELECT COUNT(*) FROM sys_demo d WHERE NOT EXISTS (SELECT 1 FROM companies c WHERE c.id = d.company_id)) AS missing,
         (SELECT COUNT(*) FROM co_companies co JOIN companies c ON c.id = co.id
           WHERE c.type <> 'registered' OR c.name IS NOT co.name OR c.deleted_at IS NOT co.deleted_at OR c.suspended_at IS NOT co.suspended_at
              OR c.owner_id IS NOT (SELECT m.user_id FROM co_members m WHERE m.company_id = co.id AND m.role = 'owner'))
       + (SELECT COUNT(*) FROM sys_companies s JOIN companies c ON c.id = s.id
           WHERE c.type <> 'personal' OR c.name IS NOT s.name OR c.owner_id IS NOT s.owner_id OR c.deleted_at IS NOT NULL)
       + (SELECT COUNT(*) FROM sys_demo d JOIN companies c ON c.id = d.company_id
           WHERE c.type <> 'example' OR c.name IS NOT d.name OR c.owner_id IS NOT d.user_id OR (c.deleted_at IS NULL) <> (d.status <> 'removed')) AS mismatched,
         (SELECT COUNT(*) FROM companies c WHERE c.deleted_at IS NULL AND (
              (c.type = 'registered' AND c.id NOT IN (SELECT id FROM co_companies))
           OR (c.type = 'personal' AND c.id NOT IN (SELECT id FROM sys_companies))
           OR (c.type = 'example' AND c.id NOT IN (SELECT company_id FROM sys_demo)))) AS orphaned`,
    )
    .first<CompanyDrift>();
  return { missing: Number(row?.missing ?? 0), mismatched: Number(row?.mismatched ?? 0), orphaned: Number(row?.orphaned ?? 0) };
}

/** A company of any kind by id, from the registry (null when there is none, or it was deleted). */
export async function companyById(db: D1Database, companyId: string) {
  return db
    .prepare('SELECT id, type, name, owner_id, country, registration_type, registration_number, registration_status, suspended_at FROM companies WHERE id = ? AND deleted_at IS NULL')
    .bind(companyId)
    .first<{
      id: string;
      type: CompanyType;
      name: string;
      owner_id: string | null;
      country: string | null;
      registration_type: string | null;
      registration_number: string | null;
      registration_status: RegistrationStatus;
      suspended_at: number | null;
    }>();
}

/** How a person's email was proven (users.email_verified_via; migration 0030). */
export type EmailVerifiedVia = 'link' | 'google' | 'admin' | 'invitation' | 'legacy';
