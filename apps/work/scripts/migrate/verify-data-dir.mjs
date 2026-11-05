#!/usr/bin/env node
// Verifies a WORK_DATA_DIR for the Node runtime.
//
//   node scripts/migrate/verify-data-dir.mjs <WORK_DATA_DIR> [--delete-unreferenced]
//
// db.sqlite: integrity check, foreign key check, applied migrations against
// migrations/, schema against the schema those migrations produce, rows and
// checksum per table. Files: every object the database references is in the
// file store, its file exists and its size, SHA-256 and MD5 match the index;
// attachment sizes match the database. Also lists objects the database no
// longer references and files the index does not know (--delete-unreferenced
// removes those files). Exit code 0 when sound, 1 when a problem is found.
// Writes the "verify" section of migration-report.json/.md. Prints counts only.

import { existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { FileStore, openRuntimeDatabase } from '../../src/node/store/file-store.ts';
import { FILES_BUCKET, dataLayout } from '../../src/node/store/layout.ts';
import { diffSchema, expectedSchema, migrationStatus, readMigrationsDir, schemaSnapshot } from '../../src/node/store/migrations.ts';
import { lockHolder } from '../../src/node/store/server-lock.ts';
import { DatabaseSync, foreignKeyViolations, integrityProblems } from '../../src/node/store/sqlite.ts';
import { MIGRATIONS_DIR, UsageError, die, loadReport, parseArgs, referencedObjects, saveReport, tableChecksums, textWithNul, unknownKeyColumns } from './lib/common.mjs';

const USAGE = 'usage: verify-data-dir.mjs <WORK_DATA_DIR> [--delete-unreferenced]';

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2), { booleans: ['delete-unreferenced'] });
  } catch (e) {
    die(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e), 2);
  }
  const [dataArg] = args.positional;
  if (!dataArg || args.positional.length !== 1) die(USAGE, 2);
  const layout = dataLayout(dataArg);
  const problems = [];
  const warnings = [];
  if (!existsSync(layout.db)) die(`${layout.db} not found.`, 2);
  const holder = lockHolder(layout.root);
  if (holder && holder.alive !== false) warnings.push(`a server (pid ${holder.pid}) is running on this folder; results reflect a moment in time`);
  const previous = loadReport(layout.root);

  const db = new DatabaseSync(layout.db, { readOnly: true });
  db.exec('BEGIN');
  const integrity = integrityProblems(db);
  if (integrity.length) problems.push(`db.sqlite integrity check: ${integrity.slice(0, 3).join('; ')}`);
  const fk = foreignKeyViolations(db);
  if (fk.length) {
    const byTable = {};
    for (const v of fk) byTable[v.table] = (byTable[v.table] ?? 0) + 1;
    const text = `${fk.length} foreign key violations (${Object.entries(byTable).map(([t, n]) => `${t} ${n}`).join(', ')})`;
    if (previous.import?.acceptedForeignKeyViolations) warnings.push(`${text}, accepted at import as D1 had them`);
    else problems.push(text);
  }
  const repo = readMigrationsDir(MIGRATIONS_DIR);
  const migrations = migrationStatus(db, repo);
  if (migrations.pending.length) warnings.push(`pending migrations (the server applies them when it starts): ${migrations.pending.join(', ')}`);
  if (migrations.unknown.length) warnings.push(`migrations unknown to this code (the database is newer): ${migrations.unknown.join(', ')}`);
  else {
    const applied = migrations.applied.map((n) => repo.find((m) => m.name === n)).filter(Boolean);
    const diff = diffSchema(expectedSchema(applied), schemaSnapshot(db));
    if (diff.length) problems.push(`schema differs from migrations/: ${diff.join('; ')}`);
  }
  const tables = tableChecksums(db);
  const refs = referencedObjects(db);
  const unknownColumns = unknownKeyColumns(db);
  const nulText = textWithNul(db);
  if (Object.keys(nulText).length) warnings.push(`text values containing a NUL character, which node:sqlite in Node 22 returns cut at the NUL: ${Object.entries(nulText).map(([t, n]) => `${t} ${n}`).join(', ')}`);
  db.exec('COMMIT');
  db.close();
  if (unknownColumns.length) warnings.push(`columns that look like object keys are not checked: ${unknownColumns.join(', ')}`);

  const files = { checked: 0, missing: 0, mismatched: 0, expectedMissing: 0, unreferencedObjects: 0, unreferenced: 0, deleted: 0, partialUploads: 0 };
  if (refs.length && !existsSync(layout.runtime)) {
    problems.push(`runtime.sqlite not found: ${refs.length} referenced objects were never copied (copy-r2-objects.mjs)`);
  } else if (existsSync(layout.runtime)) {
    const rdb = openRuntimeDatabase(layout.runtime);
    const rIntegrity = integrityProblems(rdb);
    if (rIntegrity.length) problems.push(`runtime.sqlite integrity check: ${rIntegrity.slice(0, 3).join('; ')}`);
    const store = new FileStore(layout.files, rdb);
    const referenced = new Set();
    for (const r of refs) {
      referenced.add(r.key);
      const obj = store.head(FILES_BUCKET, r.key);
      if (!obj) {
        if (r.deleted) files.expectedMissing++;
        else {
          files.missing++;
          problems.push(`missing object: ${r.kind} ${r.id}`);
        }
        continue;
      }
      files.checked++;
      const v = await store.verify(obj);
      if (!v.ok) {
        files.mismatched++;
        problems.push(`object ${v.problem === 'missing' ? 'file missing' : `${v.problem} mismatch`}: ${r.kind} ${r.id}`);
      } else if (r.size !== undefined && r.size !== obj.size) {
        files.mismatched++;
        problems.push(`size differs from the database: ${r.kind} ${r.id} (${r.size} vs ${obj.size})`);
      }
    }
    for (const o of store.all(FILES_BUCKET)) if (!referenced.has(o.key)) files.unreferencedObjects++;
    if (files.unreferencedObjects) warnings.push(`${files.unreferencedObjects} stored objects are no longer referenced by the database (for example replaced avatars)`);
    const stray = await store.unreferencedFiles();
    files.unreferenced = stray.length;
    if (stray.length) {
      if (args.flags['delete-unreferenced']) {
        for (const rel of stray) unlinkSync(join(layout.files, ...rel.split('/')));
        files.deleted = stray.length;
        warnings.push(`deleted ${stray.length} files the index did not reference`);
      } else warnings.push(`${stray.length} files under files/ are not in the index (re-run with --delete-unreferenced to remove them)`);
    }
    files.partialUploads = existsSync(layout.tmp) ? readdirSync(layout.tmp).length : 0;
    if (files.partialUploads) warnings.push(`${files.partialUploads} partial uploads in files/.tmp (the server removes them after an hour)`);
    rdb.close();
  }

  const ok = problems.length === 0;
  const report = loadReport(layout.root);
  report.verify = { ok, at: new Date().toISOString(), problems, warnings, migrations, tables, files };
  saveReport(layout.root, report);
  const rows = Object.entries(tables).filter(([t]) => t !== 'sqlite_sequence').reduce((s, [, t]) => s + t.rows, 0);
  console.log(`db.sqlite: ${Object.keys(tables).length} tables, ${rows} rows; integrity ${integrity.length ? 'FAILED' : 'ok'}; foreign key violations ${fk.length}`);
  console.log(`Migrations: applied ${migrations.applied.length}, pending ${migrations.pending.length}, unknown ${migrations.unknown.length}`);
  console.log(`Files: referenced ${refs.length}, checked ${files.checked}, missing ${files.missing}, mismatched ${files.mismatched}, deleted in the app ${files.expectedMissing}`);
  for (const w of warnings) console.log(`Note: ${w}`);
  for (const p of problems.slice(0, 50)) console.log(`PROBLEM: ${p}`);
  console.log(ok ? 'Data directory OK.' : `${problems.length} problems found.`);
  process.exit(ok ? 0 : 1);
}

main().catch((e) => die(`Verification failed: ${e instanceof Error ? e.message : String(e)}`));
