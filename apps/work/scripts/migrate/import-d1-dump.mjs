#!/usr/bin/env node
// Imports a `wrangler d1 export` SQL dump into WORK_DATA_DIR/db.sqlite.
//
//   node scripts/migrate/import-d1-dump.mjs <dump.sql> <WORK_DATA_DIR> [--replace] [--accept-fk-violations]
//
// The dump is reordered with scripts/reorder-dump.mjs (all tables first, then
// rows, then indexes) and loaded into a NEW database in a temporary folder
// inside WORK_DATA_DIR, with the dump's own CREATE statements, so the schema is
// exactly D1's. Foreign keys are checked after loading, not during, so row
// order does not matter. Then it verifies:
//   * PRAGMA integrity_check;
//   * PRAGMA foreign_key_check (every violation is listed; the import fails
//     unless --accept-fk-violations, which keeps them as D1 had them);
//   * applied migrations (d1_migrations) against migrations/, and the schema
//     against the schema those migrations produce;
//   * rows per table in the dump against rows in the database;
//   * rows that failed to insert and duplicate primary keys (table and key only).
// Only when every check passes is the database moved into place. An existing
// db.sqlite is never overwritten without --replace, and with --replace a
// timestamped copy is kept first. Running it twice on the same dump gives the
// same per-table checksums (the report says whether they match the last run).
// migration-report.json and migration-report.md are written next to the
// database. No row content is printed or written: only table names, counts,
// keys that look like ids (others are hashed) and checksums.

import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync, unlinkSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { reorder, splitStatements } from '../reorder-dump.mjs';
import { dataLayout } from '../../src/node/store/layout.ts';
import { FileStore, openRuntimeDatabase } from '../../src/node/store/file-store.ts';
import { lockHolder } from '../../src/node/store/server-lock.ts';
import { diffSchema, expectedSchema, migrationStatus, readMigrationsDir, schemaSnapshot } from '../../src/node/store/migrations.ts';
import { DatabaseSync, foreignKeyViolations, integrityProblems, openDatabase } from '../../src/node/store/sqlite.ts';
import {
  MIGRATIONS_DIR,
  UsageError,
  die,
  fsyncPath,
  loadReport,
  parseArgs,
  quoteIdent,
  referencedObjects,
  rowKey,
  safeValue,
  saveReport,
  sha256Hex,
  tableChecksums,
  multilineText,
  tableInfo,
  textWithNul,
  unknownKeyColumns,
  userTables,
} from './lib/common.mjs';

const USAGE = 'usage: import-d1-dump.mjs <dump.sql> <WORK_DATA_DIR> [--replace] [--accept-fk-violations]';

const IDENT = /^("(?:[^"]|"")+"|`(?:[^`]|``)+`|\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_$]*)/;
function unquote(id) {
  if (id.startsWith('"')) return id.slice(1, -1).replace(/""/g, '"');
  if (id.startsWith('`')) return id.slice(1, -1).replace(/``/g, '`');
  if (id.startsWith('[')) return id.slice(1, -1);
  return id;
}
const head = (s) => s.replace(/^(\s*--[^\n]*\n)+/g, '').trim();
function target(stmt, prefix) {
  const rest = stmt.replace(prefix, '');
  const m = IDENT.exec(rest);
  return m ? unquote(m[1]) : null;
}

/** SQLite stops reading a literal at a NUL byte; D1's export writes them raw. Rewrite them as char(0). */
function fixNul(stmt) {
  if (!stmt.includes('\u0000')) return { sql: stmt, fixed: false };
  let out = '';
  let inString = false;
  for (let i = 0; i < stmt.length; i++) {
    const c = stmt[i];
    if (c === "'") {
      if (inString && stmt[i + 1] === "'") {
        out += "''";
        i++;
        continue;
      }
      inString = !inString;
      out += c;
    } else if (c === '\u0000' && inString) out += "'||char(0)||'";
    else out += c;
  }
  return { sql: out, fixed: true };
}

const CODE_NAMES = { 1: 'SQLITE_ERROR', 19: 'SQLITE_CONSTRAINT', 20: 'SQLITE_MISMATCH', 25: 'SQLITE_RANGE' };
function reasonFor(e, pk) {
  const msg = String(e?.message ?? '');
  const unique = /UNIQUE constraint failed: (.+)$/.exec(msg);
  if (unique || e?.errcode === 1555) {
    const cols = unique ? unique[1].split(', ').map((c) => c.split('.').pop()) : pk;
    return cols.length === pk.length && cols.every((c) => pk.includes(c)) ? 'duplicate primary key' : `unique constraint (${cols.join(', ')})`;
  }
  const nn = /NOT NULL constraint failed: (\S+)$/.exec(msg);
  if (nn) return `not null (${nn[1].split('.').pop()})`;
  if (/CHECK constraint failed/.test(msg)) return 'check constraint';
  if (/no such table/.test(msg)) return 'table missing from the dump';
  if (/datatype mismatch/.test(msg)) return 'datatype mismatch';
  return `statement could not be executed (${CODE_NAMES[(e?.errcode ?? 1) & 0xff] ?? 'SQLITE_ERROR'})`;
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2), { booleans: ['replace', 'accept-fk-violations'] });
  } catch (e) {
    die(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e), 2);
  }
  const [dumpArg, dataArg] = args.positional;
  if (!dumpArg || !dataArg || args.positional.length > 2) die(USAGE, 2);
  const dumpFile = resolve(dumpArg);
  const dataDir = resolve(dataArg);
  const replace = !!args.flags.replace;
  const acceptFk = !!args.flags['accept-fk-violations'];
  if (!existsSync(dumpFile)) die(`Dump not found: ${dumpFile}`, 2);
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const layout = dataLayout(dataDir);
  if (existsSync(layout.db) && !replace) die(`${layout.db} already exists. Pass --replace to replace it (a timestamped copy is kept).`, 2);
  const holder = lockHolder(dataDir);
  if (holder && holder.alive !== false) die(`A server (pid ${holder.pid} on ${holder.host}) is using ${dataDir}. Stop it first.`, 2);

  const dumpBytes = readFileSync(dumpFile);
  const dump = { file: basename(dumpFile), bytes: dumpBytes.length, sha256: sha256Hex(dumpBytes) };
  const statements = splitStatements(reorder(dumpBytes.toString('utf8')));

  const creates = [];
  const inserts = [];
  const sequence = [];
  const post = [];
  const appends = [];
  const skipped = [];
  for (const s of statements) {
    const h = head(s);
    if (/^CREATE\s+TABLE/i.test(h)) {
      const t = target(h, /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?/i);
      if (t?.startsWith('sqlite_')) skipped.push(t);
      else creates.push({ sql: s, table: t });
    } else if (/^DELETE\s+FROM\s+["`[]?sqlite_sequence/i.test(h)) {
      /* handled below */
    } else if (/^INSERT\s+(?:OR\s+\w+\s+)?INTO/i.test(h)) {
      const t = target(h, /^INSERT\s+(?:OR\s+\w+\s+)?INTO\s+/i);
      if (t === 'sqlite_sequence') sequence.push(s);
      else if (t?.startsWith('sqlite_')) skipped.push(t);
      else inserts.push({ sql: s, table: t });
    } else if (/^CREATE\s+(?:UNIQUE\s+)?INDEX|^CREATE\s+(?:TEMP\s+|TEMPORARY\s+)?(?:TRIGGER|VIEW)/i.test(h)) post.push(s);
    // export-for-d1.mjs appends long text in chunks: UPDATE "t" SET "c" = "c" || '...' WHERE <key>.
    else if (/^UPDATE\s+("(?:[^"]|"")+")\s+SET\s+("(?:[^"]|"")+")\s*=\s*\2\s*\|\|/i.test(h)) appends.push(s);
    else if (/^ANALYZE\b/i.test(h)) skipped.push('ANALYZE');
    else die(`Unexpected statement in the dump (starts with "${h.split(/\s+/).slice(0, 2).join(' ')}"); not a wrangler d1 export?`, 1);
  }
  if (creates.length === 0) die('The dump contains no tables.', 1);

  const work = mkdtempSync(join(dataDir, '.import-'));
  const tmpDb = join(work, 'db.sqlite');
  let ok = false;
  try {
    const db = openDatabase(tmpDb, { journal: 'DELETE' });
    db.exec('PRAGMA foreign_keys = OFF');
    const dumpCounts = {};
    const failedRows = [];
    const duplicates = [];
    let nulFixups = 0;
    const infoCache = new Map();
    const info = (t) => {
      if (!infoCache.has(t)) infoCache.set(t, tableInfo(db, t));
      return infoCache.get(t);
    };
    // Constraint-free copies of the tables, used only to read the key of a row that failed.
    const shadow = new DatabaseSync(':memory:');
    const shadowTables = new Set();
    const keyOf = (table, sql) => {
      try {
        const { columns, pk } = info(table);
        if (!shadowTables.has(table)) {
          shadow.exec(`CREATE TABLE ${quoteIdent(table)} (${columns.map(quoteIdent).join(', ')})`);
          shadowTables.add(table);
        }
        shadow.exec(sql);
        const cols = pk.length ? pk : columns.slice(0, 1);
        const row = shadow.prepare(`SELECT ${cols.map(quoteIdent).join(', ')} FROM ${quoteIdent(table)} WHERE rowid = last_insert_rowid()`).get();
        shadow.exec(`DELETE FROM ${quoteIdent(table)}`);
        const values = cols.map((c) => row?.[c] ?? null);
        // A row with this primary key already loaded means a duplicate key, whichever UNIQUE index SQLite named.
        const exists = pk.length > 0 && !!db.prepare(`SELECT 1 FROM ${quoteIdent(table)} WHERE ${pk.map((c) => `${quoteIdent(c)} IS ?`).join(' AND ')}`).get(...values);
        return { display: values.map(safeValue).join(','), exists };
      } catch {
        return null;
      }
    };

    db.exec('BEGIN');
    for (const c of creates) db.exec(c.sql);
    inserts.forEach((ins, n) => {
      dumpCounts[ins.table] = (dumpCounts[ins.table] ?? 0) + 1;
      const { sql, fixed } = fixNul(ins.sql);
      if (fixed) nulFixups++;
      try {
        db.exec(sql);
      } catch (e) {
        const known = creates.some((c) => c.table === ins.table);
        const pk = known ? info(ins.table).pk : [];
        const key = known ? keyOf(ins.table, sql) : null;
        const reason = !known ? 'table missing from the dump' : key?.exists && /constraint/i.test(String(e?.message)) ? 'duplicate primary key' : reasonFor(e, pk);
        const primaryKey = key?.display ?? `statement ${n + 1}`;
        failedRows.push({ table: ins.table, primaryKey, reason });
        if (reason === 'duplicate primary key') duplicates.push({ table: ins.table, primaryKey });
      }
    });
    for (const s of appends) db.exec(fixNul(s).sql);
    if (db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'sqlite_sequence'").get()) {
      db.exec('DELETE FROM sqlite_sequence');
      for (const s of sequence) db.exec(s);
    }
    for (const s of post) db.exec(s);
    db.exec('COMMIT');
    shadow.close();

    const integrity = integrityProblems(db);
    const fkList = (t) => db.prepare(`PRAGMA foreign_key_list(${quoteIdent(t)})`).all();
    const foreignKeyViolationsList = foreignKeyViolations(db).map((v) => ({
      table: v.table,
      primaryKey: rowKey(db, v.table, v.rowid),
      column: fkList(v.table)
        .filter((f) => Number(f.id) === v.fkid)
        .map((f) => f.from)
        .join(', '),
      parent: v.parent,
    }));
    const repo = readMigrationsDir(MIGRATIONS_DIR);
    const migrations = migrationStatus(db, repo);
    const appliedKnown = migrations.applied.map((n) => repo.find((m) => m.name === n)).filter(Boolean);
    const schemaDifferences = migrations.unknown.length ? [`unknown migrations ${migrations.unknown.join(', ')}`] : diffSchema(expectedSchema(appliedKnown), schemaSnapshot(db));
    const checksums = tableChecksums(db);
    const tables = {};
    for (const t of userTables(db)) tables[t] = { dump: dumpCounts[t] ?? 0, database: checksums[t].rows, sha256: checksums[t].sha256 };
    for (const t of Object.keys(dumpCounts)) if (!tables[t]) tables[t] = { dump: dumpCounts[t], database: 0, sha256: null };
    if (checksums.sqlite_sequence) tables.sqlite_sequence = { dump: sequence.length, database: checksums.sqlite_sequence.rows, sha256: checksums.sqlite_sequence.sha256 };
    const countMismatch = Object.entries(tables).filter(([, v]) => v.dump !== v.database).map(([t]) => t);

    const refs = referencedObjects(db);
    const byKind = {};
    for (const r of refs) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
    let presentInStore = 0;
    if (existsSync(layout.runtime)) {
      const rdb = openRuntimeDatabase(layout.runtime);
      const store = new FileStore(layout.files, rdb);
      presentInStore = refs.filter((r) => store.head('FILES', r.key)).length;
      rdb.close();
    }
    const unknownColumns = unknownKeyColumns(db);
    const nulText = textWithNul(db);
    const multiline = multilineText(db);
    db.close();

    const reasons = [];
    if (integrity.length) reasons.push('integrity check failed');
    if (failedRows.length) reasons.push(`${failedRows.length} rows failed to insert`);
    if (foreignKeyViolationsList.length && !acceptFk) reasons.push(`${foreignKeyViolationsList.length} foreign key violations (re-run with --accept-fk-violations to keep them as D1 has them)`);
    if (schemaDifferences.length) reasons.push('schema differs from migrations/');
    if (countMismatch.length) reasons.push(`row counts differ for ${countMismatch.join(', ')}`);
    ok = reasons.length === 0;

    const previous = loadReport(dataDir);
    const at = new Date().toISOString();
    let previousRun;
    if (previous.import?.ok && previous.import.dump?.sha256 === dump.sha256) {
      const prev = previous.import.tables ?? {};
      const identical = Object.keys(tables).length === Object.keys(prev).length && Object.entries(tables).every(([t, v]) => prev[t]?.sha256 === v.sha256 && prev[t]?.database === v.database);
      previousRun = { at: previous.import.at, identical };
    }

    let backup = null;
    if (ok) {
      fsyncPath(tmpDb);
      if (existsSync(layout.db)) {
        const old = new DatabaseSync(layout.db, { timeout: 0 });
        try {
          old.exec('BEGIN IMMEDIATE');
          old.exec('COMMIT');
          const cp = old.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
          if (cp && Number(cp.busy) !== 0) throw new Error('busy');
        } catch {
          old.close();
          throw new Error(`${layout.db} is in use. Stop the server before replacing its database.`);
        }
        old.close();
        backup = `${layout.db}.bak-${at.replace(/[:.]/g, '-')}`;
        copyFileSync(layout.db, backup);
        fsyncPath(backup);
      }
      for (const ext of ['-wal', '-shm', '-journal']) if (existsSync(layout.db + ext)) unlinkSync(layout.db + ext);
      renameSync(tmpDb, layout.db);
      fsyncPath(dataDir);
    }

    const report = {
      ...previous,
      ...(ok ? { verify: undefined, export: undefined } : {}),
      import: {
        ok,
        reasons,
        at,
        dump,
        database: ok ? 'db.sqlite' : null,
        bytes: ok ? statSync(layout.db).size : null,
        replaced: !!backup,
        backup: backup ? basename(backup) : null,
        previousRun,
        statements: { tables: creates.length, rows: inserts.length, textAppends: appends.length, sequence: sequence.length, indexesAndTriggers: post.length, skipped },
        nulFixups,
        textWithNul: nulText,
        multilineText: multiline,
        integrity,
        migrations,
        schema: { differences: schemaDifferences },
        tables,
        failedRows,
        duplicates,
        foreignKeyViolations: foreignKeyViolationsList,
        acceptedForeignKeyViolations: acceptFk && foreignKeyViolationsList.length > 0,
        files: { referenced: refs.length, byKind, presentInStore },
        unknownKeyColumns: unknownColumns,
      },
    };
    saveReport(dataDir, report);

    const rows = Object.entries(tables).filter(([t]) => t !== 'sqlite_sequence').reduce((s, [, v]) => s + v.database, 0);
    console.log(`Dump ${dump.file}: ${creates.length} tables, ${inserts.length} rows (sha256 ${dump.sha256.slice(0, 16)})`);
    console.log(`Database: ${rows} rows; failed ${failedRows.length}; duplicate keys ${duplicates.length}; foreign key violations ${foreignKeyViolationsList.length}; integrity ${integrity.length ? 'FAILED' : 'ok'}; schema ${schemaDifferences.length ? 'DIFFERENT' : 'matches migrations/'}`);
    console.log(`Migrations applied ${migrations.applied.length}, pending ${migrations.pending.length} (${migrations.pending.join(', ') || 'none'}), unknown ${migrations.unknown.length}`);
    console.log(`Files referenced: ${refs.length} (${Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}); in the file store now: ${presentInStore}`);
    if (previousRun) console.log(`Same dump imported at ${previousRun.at}: checksums ${previousRun.identical ? 'identical' : 'DIFFERENT'}`);
    if (unknownColumns.length) console.log(`Note: columns that look like object keys are not copied by copy-r2-objects.mjs: ${unknownColumns.join(', ')}`);
    if (Object.keys(multiline).length) console.log(`Rows with multi-line text: ${Object.values(multiline).reduce((a, b) => a + b, 0)}. The D1 export cannot keep a backslash-n inside such text: run repair-text-from-d1.mjs against D1 next.`);
    if (Object.keys(nulText).length) console.log(`Note: text values containing a NUL character (stored intact; the Node runtime reads them up to the NUL): ${Object.entries(nulText).map(([t, n]) => `${t} ${n}`).join(', ')}`);
    console.log(ok ? `Imported into ${layout.db}${backup ? ` (previous database kept as ${basename(backup)})` : ''}` : `NOT imported: ${reasons.join('; ')}`);
    console.log(`Report: ${join(dataDir, 'migration-report.md')}`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  process.exit(ok ? 0 : 1);
}

try {
  main();
} catch (e) {
  die(`Import failed: ${e instanceof Error ? e.message : String(e)}`);
}
