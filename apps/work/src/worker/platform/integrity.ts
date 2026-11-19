// Integrity check (Stage 1, R4; docs/platform/company-context.md): counts of records that point at a company that is not
// in the registry, of tools still linked to a deleted company, and of the registry's drift from the companies' own
// tables. Read only, counts only (never names or record content). Platform admins run it from the Control Centre.

import { companyDrift, type CompanyDrift } from '../company/identity';

// A company's own tables: those with a company_id column, apart from the CRM's (there company_id is a CRM company), API
// tokens, the legacy id record and the platform's rollout list (the same rule as test-node/company-queries.ts).
const NOT_COMPANY = /^(crm_|api_tokens$|legacy_company_id_map$|company_rollout$|sys_demo$|d1_|_cf_|sqlite_)/;

export interface IntegrityReport {
  checkedAt: number;
  registry: CompanyDrift;
  /** Tools linked to a company that was deleted. */
  toolsOfDeletedCompanies: number;
  /** Tables checked, and those with records whose company is not in the registry (table: count). */
  tablesChecked: number;
  unknownCompany: Record<string, number>;
  /** Tables that could not be read (named only). */
  skipped: string[];
}

/** The tables with a company_id column, from the database itself. */
export async function companyOwnedTables(db: D1Database): Promise<string[]> {
  const rows = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all<{ name: string }>();
  const out: string[] = [];
  for (const { name } of rows.results) {
    if (NOT_COMPANY.test(name) || !/^[a-z_][a-z0-9_]*$/.test(name)) continue;
    const cols = await db.prepare(`SELECT name FROM pragma_table_info('${name}') WHERE name = 'company_id'`).all<{ name: string }>();
    if (cols.results.length) out.push(name);
  }
  return out;
}

export async function integrityReport(db: D1Database, at = Date.now()): Promise<IntegrityReport> {
  const registry = await companyDrift(db);
  const tools = await db
    .prepare('SELECT COUNT(*) AS n FROM co_tools t JOIN co_companies co ON co.id = t.company_id WHERE co.deleted_at IS NOT NULL')
    .first<{ n: number }>();
  const unknownCompany: Record<string, number> = {};
  const skipped: string[] = [];
  let tables: string[] = [];
  try {
    tables = await companyOwnedTables(db);
  } catch {
    skipped.push('(the list of tables)');
  }
  for (const t of tables) {
    try {
      const r = await db.prepare(`SELECT COUNT(*) AS n FROM ${t} x WHERE x.company_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM companies c WHERE c.id = x.company_id)`).first<{ n: number }>();
      if (r && Number(r.n) > 0) unknownCompany[t] = Number(r.n);
    } catch {
      skipped.push(t);
    }
  }
  return { checkedAt: at, registry, toolsOfDeletedCompanies: Number(tools?.n ?? 0), tablesChecked: tables.length - skipped.length, unknownCompany, skipped };
}
