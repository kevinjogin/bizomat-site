// The scan behind test-node/company-queries.test.ts (Stage 1, R4; docs/platform/company-context.md): every SQL statement
// in the server code that touches a company's own table names company_id, so a query cannot reach another company's
// rows by forgetting it. A company's own tables are worked out from the schema: every table with a company_id column,
// apart from the CRM's (there company_id is a CRM company), API tokens, the legacy id record and the platform's rollout
// list. Statements that were there before the check are listed in fixtures/company-queries-baseline.json; the list may
// only shrink.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';

// data_exports: a person's own exports (company_id is set only for a company export, and the person is checked).
const NOT_COMPANY = /^(crm_|api_tokens$|legacy_company_id_map$|company_rollout$|sys_demo$|data_exports$)/;

export function companyTables(migrationsDir: string): Set<string> {
  const db = new DatabaseSync(':memory:');
  try {
    applyMigrations(db, readMigrationsDir(migrationsDir));
    const rows = db
      .prepare("SELECT m.name FROM sqlite_master m WHERE m.type = 'table' AND EXISTS (SELECT 1 FROM pragma_table_info(m.name) p WHERE p.name = 'company_id')")
      .all() as { name: string }[];
    return new Set(rows.map((r) => r.name).filter((n) => !NOT_COMPANY.test(n)));
  } finally {
    db.close();
  }
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') ? [p] : [];
  });
}

const LITERAL = /`(?:[^`\\]|\\.)*`|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/gs;
const STATEMENT = /\b(SELECT|UPDATE|INSERT|DELETE)\b/;
const TABLE = /\b(?:FROM|JOIN|UPDATE|INTO)\s+([a-z_][a-z0-9_]*)\b/gi;

export interface Unscoped {
  key: string;
  file: string;
  line: number;
}

/** Statements on a company's own tables that do not name company_id. key: file and the statement's start. */
export function unscopedStatements(srcDir: string, tables: Set<string>, base: string): Unscoped[] {
  const out: Unscoped[] = [];
  for (const file of files(srcDir)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(LITERAL)) {
      const text = m[0];
      if (!STATEMENT.test(text)) continue;
      const touched = [...text.matchAll(TABLE)].map((t) => t[1]).filter((t) => tables.has(t));
      if (!touched.length || text.includes('company_id')) continue;
      const rel = relative(base, file).replace(/\\/g, '/');
      out.push({ key: `${rel} :: ${text.replace(/\s+/g, ' ').slice(0, 120)}`, file: rel, line: src.slice(0, m.index).split('\n').length });
    }
  }
  return out;
}

export function counts(list: Unscoped[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const u of list) c[u.key] = (c[u.key] ?? 0) + 1;
  return Object.fromEntries(Object.entries(c).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}
