#!/usr/bin/env node
// Confirms multi-line text in WORK_DATA_DIR/db.sqlite against D1 itself and
// repairs what the D1 export changed.
//
//   node scripts/migrate/repair-text-from-d1.mjs <WORK_DATA_DIR> --remote [--database DB] [--env preview]
//   node scripts/migrate/repair-text-from-d1.mjs <WORK_DATA_DIR> --local --wrangler-config <file> [--database DB]
//
// Why: `wrangler d1 export` writes a text value that contains a line break as
// replace('...\n...','\n',char(10)) (and \r with char(13)). A backslash
// followed by n (or r) that was already in such a value becomes a line break
// as well, so a comment like `use "\n" here` written over two lines changes.
// Only values that contain a line break are written that way, so only they can
// be affected. This script reads exactly those values from D1 as hex (exact),
// compares them with db.sqlite and writes D1's bytes where they differ.
// Run it after import-d1-dump.mjs, with D1 still reachable (the operator has
// it, having just exported). Reports table, key and column only, never text.

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { dataLayout } from '../../src/node/store/layout.ts';
import { lockHolder } from '../../src/node/store/server-lock.ts';
import { DatabaseSync } from '../../src/node/store/sqlite.ts';
import { APP_ROOT, UsageError, die, loadReport, parseArgs, quoteIdent, safeValue, saveReport, tableChecksums, tableInfo, userTables } from './lib/common.mjs';

const run = promisify(execFile);
const USAGE = 'usage: repair-text-from-d1.mjs <WORK_DATA_DIR> (--remote [--env <env>] | --local --wrangler-config <file>) [--database <name or binding>]';
const WRANGLER = join(APP_ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const PAGE = 200;

const multiline = (c) => `(typeof(${quoteIdent(c)}) = 'text' AND (instr(${quoteIdent(c)}, char(10)) > 0 OR instr(${quoteIdent(c)}, char(13)) > 0))`;

/** The query both sides answer: key columns, then hex of each multi-line text value (NULL otherwise). */
function candidateQuery(table, pk, columns) {
  const hexes = columns.map((c, i) => `CASE WHEN ${multiline(c)} THEN hex(CAST(${quoteIdent(c)} AS BLOB)) END AS "h${i}"`);
  return `SELECT ${[...pk.map(quoteIdent), ...hexes].join(', ')} FROM ${quoteIdent(table)} WHERE ${columns.map(multiline).join(' OR ')} ORDER BY ${pk.map(quoteIdent).join(', ')}`;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2), { booleans: ['remote', 'local'], strings: ['database', 'env', 'wrangler-config'] });
  } catch (e) {
    die(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e), 2);
  }
  const [dataArg] = args.positional;
  const f = args.flags;
  if (!dataArg || args.positional.length !== 1 || (!f.remote && !(f.local && f['wrangler-config']))) die(USAGE, 2);
  // --remote: wrangler signs in with CLOUDFLARE_API_TOKEN (CI) or, on the owner's computer, with its own login
  // (wrangler login). With more than one account it needs CLOUDFLARE_ACCOUNT_ID, and says so.
  if (f.remote && !process.env.CLOUDFLARE_API_TOKEN) console.log('No CLOUDFLARE_API_TOKEN: wrangler uses its own login (wrangler login).');
  const layout = dataLayout(dataArg);
  if (!existsSync(layout.db)) die(`${layout.db} not found: import the database first.`, 2);
  const holder = lockHolder(layout.root);
  if (holder && holder.alive !== false) die(`A server (pid ${holder.pid} on ${holder.host}) is using ${layout.root}. Stop it first.`, 2);

  const target = [f.database ?? 'DB', ...(f.remote ? ['--remote', ...(f.env ? ['--env', f.env] : [])] : ['--local', '--config', resolve(f['wrangler-config'])])];
  const d1 = async (sql) => {
    let out;
    try {
      out = (await run(process.execPath, [WRANGLER, 'd1', 'execute', ...target, '--json', '--command', sql], { cwd: APP_ROOT, env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' }, maxBuffer: 256 * 1024 * 1024 })).stdout;
    } catch (e) {
      throw new Error(`wrangler d1 execute failed: ${String(e.stderr ?? e.message).split('\n').filter((l) => /error|✘/i.test(l)).slice(0, 3).join(' ').slice(0, 300)}`, { cause: e });
    }
    const json = JSON.parse(out.slice(out.indexOf('[')));
    return json[0]?.results ?? [];
  };

  const db = new DatabaseSync(layout.db);
  const checked = { tables: 0, values: 0 };
  const repaired = [];
  const unexpected = [];
  const updates = [];
  for (const table of userTables(db)) {
    const { columns, pk } = tableInfo(db, table);
    if (!pk.length) continue;
    const local = new Map();
    for (const r of db.prepare(candidateQuery(table, pk, columns)).all()) local.set(JSON.stringify(pk.map((c) => r[c])), r);
    // The import keeps every real line break, so a table without multi-line text here has none in D1 either.
    if (local.size === 0) continue;
    const sql = candidateQuery(table, pk, columns);
    checked.tables++;
    for (let offset = 0; ; offset += PAGE) {
      const rows = await d1(`${sql} LIMIT ${PAGE} OFFSET ${offset}`);
      for (const remote of rows) {
        const key = JSON.stringify(pk.map((c) => remote[c]));
        const mine = local.get(key);
        const display = pk.map((c) => safeValue(remote[c])).join(',');
        if (!mine) {
          unexpected.push({ table, primaryKey: display, problem: 'row has a line break in D1 but not in db.sqlite' });
          continue;
        }
        local.delete(key);
        columns.forEach((c, i) => {
          const want = remote[`h${i}`] ?? null;
          const have = mine[`h${i}`] ?? null;
          if (want === null && have === null) return;
          checked.values++;
          if (want === have) return;
          if (want === null) {
            unexpected.push({ table, primaryKey: display, column: c, problem: 'line break in db.sqlite but not in D1' });
            return;
          }
          repaired.push({ table, primaryKey: display, column: c });
          updates.push({ sql: `UPDATE ${quoteIdent(table)} SET ${quoteIdent(c)} = CAST(X'${want}' AS TEXT) WHERE ${pk.map((p) => `${quoteIdent(p)} = ?`).join(' AND ')}`, params: pk.map((p) => mine[p]) });
        });
      }
      if (rows.length < PAGE) break;
    }
    for (const [, mine] of local) unexpected.push({ table, primaryKey: pk.map((c) => safeValue(mine[c])).join(','), problem: 'line break in db.sqlite but row not found in D1' });
  }
  if (updates.length) {
    db.exec('BEGIN IMMEDIATE');
    try {
      for (const u of updates) db.prepare(u.sql).run(...u.params);
      db.exec('COMMIT');
    } catch (e) {
      if (db.isTransaction) db.exec('ROLLBACK');
      throw e;
    }
  }
  const tables = tableChecksums(db);
  db.close();

  const report = loadReport(layout.root);
  report.textRepair = { at: new Date().toISOString(), source: f.remote ? `D1 ${f.database ?? 'DB'} (remote${f.env ? `, env ${f.env}` : ''})` : 'local D1 (wrangler state)', checked, repaired, unexpected, tables };
  saveReport(layout.root, report);
  console.log(`Multi-line text values compared with D1: ${checked.values} in ${checked.tables} tables`);
  console.log(`Repaired: ${repaired.length}${repaired.length ? ` (${[...new Set(repaired.map((r) => `${r.table}.${r.column}`))].join(', ')})` : ''}; unexpected differences: ${unexpected.length}`);
  for (const u of unexpected.slice(0, 20)) console.log(`PROBLEM: ${u.table} ${u.primaryKey}${u.column ? ` ${u.column}` : ''}: ${u.problem}`);
  process.exit(unexpected.length ? 1 : 0);
}

main().catch((e) => die(`Repair failed: ${e instanceof Error ? e.message : String(e)}`));
