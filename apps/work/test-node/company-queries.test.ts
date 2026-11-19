// Every SQL statement on a company's own tables names company_id (Stage 1, R4; the scan is company-queries.ts). The
// statements from before the check are listed in fixtures/company-queries-baseline.json: a new one fails here, and a
// fixed one must be taken off the list, so the list only shrinks.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { companyTables, counts, unscopedStatements } from './company-queries.ts';

const baseline = JSON.parse(readFileSync('test-node/fixtures/company-queries-baseline.json', 'utf8')) as { statements: Record<string, number> };

describe('company scope in SQL', () => {
  const tables = companyTables('migrations');
  const found = unscopedStatements('src/worker', tables, '.');
  const now = counts(found);

  it('knows the company tables from the schema', () => {
    for (const t of ['erp_products', 'mt_work_orders', 'whs_incidents', 'co_members', 'company_settings']) expect(tables.has(t), t).toBe(true);
    for (const t of ['crm_contacts', 'users', 'workspaces', 'api_tokens']) expect(tables.has(t), t).toBe(false);
  });

  it('finds a statement that forgets company_id', () => {
    const probe = unscopedStatements('test-node/fixtures/company-queries-probe', tables, '.');
    expect(probe.map((p) => p.key)).toEqual([`test-node/fixtures/company-queries-probe/probe.ts :: 'SELECT * FROM erp_products WHERE id = ?'`]);
  });

  it('has no new statement on a company table without company_id', () => {
    const added = Object.entries(now)
      .filter(([k, n]) => n > (baseline.statements[k] ?? 0))
      .map(([k]) => {
        const at = found.find((f) => f.key === k)!;
        return `${at.file}:${at.line}  ${k.split(' :: ')[1]}`;
      });
    expect(added, 'Scope these statements by company_id (or, if the row was already found within the company, say so in review and add them to the baseline)').toEqual([]);
  });

  it('keeps the baseline as short as the code (take fixed statements off the list)', () => {
    const stale = Object.entries(baseline.statements).filter(([k, n]) => (now[k] ?? 0) < n).map(([k]) => k);
    expect(stale).toEqual([]);
  });
});
