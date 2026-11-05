#!/usr/bin/env node
// Rollback to Cloudflare: writes WORK_DATA_DIR/db.sqlite as SQL for a NEW D1
// database, and optionally every stored object for re-upload to R2.
//
//   node scripts/migrate/export-for-d1.mjs <WORK_DATA_DIR> <out.sql> [--files <dir>]
//   npx wrangler d1 execute <new-database> --remote --file <out.sql>
//
// The SQL has the shape of `wrangler d1 export`, ordered so it loads into an
// empty database: PRAGMA defer_foreign_keys, every CREATE TABLE (the stored
// text, so the schema is unchanged), every row, sqlite_sequence, then indexes
// and triggers. d1_migrations is included, so wrangler sees the migrations as
// applied. Text with control characters is written as CAST(X'..' AS TEXT)
// (lossless; D1's own export rewrites newlines with replace()); REAL values
// keep their type; text values longer than D1's statement limit are appended
// in chunks with UPDATE statements. The file is then loaded into an empty
// in-memory database and its per-table checksums compared with the source
// (the round trip). With --files <dir>, objects are written to
// <dir>/objects/<sha256 of key> with manifest.json and upload-to-r2.sh
// (wrangler r2 object put commands with each object's content type).
// Prints table names and counts only.

import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { once } from 'node:events';
import { basename, dirname, join, resolve } from 'node:path';
import { splitStatements } from '../reorder-dump.mjs';
import { FileStore, keyHash, openRuntimeDatabase } from '../../src/node/store/file-store.ts';
import { FILES_BUCKET, dataLayout } from '../../src/node/store/layout.ts';
import { lockHolder } from '../../src/node/store/server-lock.ts';
import { DatabaseSync } from '../../src/node/store/sqlite.ts';
import { UsageError, die, exactRows, fsyncPath, loadReport, orderClause, parseArgs, quoteIdent, saveReport, sha256Hex, tableChecksums, tableInfo } from './lib/common.mjs';

const USAGE = 'usage: export-for-d1.mjs <WORK_DATA_DIR> <out.sql> [--files <dir>]';
const D1_STATEMENT_LIMIT = 100_000;
const CHUNK_CHARS = 20_000;

function textLiteral(s) {
  if (/[\u0000-\u001f\u007f]/.test(s)) return `CAST(X'${Buffer.from(s, 'utf8').toString('hex')}' AS TEXT)`;
  return `'${s.replace(/'/g, "''")}'`;
}

function literal(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'number') {
    if (Number.isNaN(v)) return 'NULL';
    if (!Number.isFinite(v)) return v > 0 ? '9e999' : '-9e999';
    if (Object.is(v, -0)) return '-0.0';
    const s = String(v);
    return /[.eE]/.test(s) ? s : `${s}.0`;
  }
  if (typeof v === 'string') return textLiteral(v);
  if (v instanceof Uint8Array) return `X'${Buffer.from(v).toString('hex')}'`;
  throw new Error(`Unsupported value type ${typeof v}`);
}

function shq(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2), { strings: ['files'] });
  } catch (e) {
    die(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e), 2);
  }
  const [dataArg, outArg] = args.positional;
  if (!dataArg || !outArg || args.positional.length !== 2) die(USAGE, 2);
  const layout = dataLayout(dataArg);
  const out = resolve(outArg);
  if (!existsSync(layout.db)) die(`${layout.db} not found.`, 2);
  const holder = lockHolder(layout.root);
  if (holder && holder.alive !== false) console.log(`Note: a server (pid ${holder.pid}) is running; the export is a consistent snapshot, but writes after it are not included. Stop the server for a final rollback export.`);
  mkdirSync(dirname(out), { recursive: true });

  const db = new DatabaseSync(layout.db, { readOnly: true });
  db.exec('BEGIN'); // one snapshot for the whole export
  const master = db
    .prepare("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE sql IS NOT NULL AND substr(name, 1, 7) <> 'sqlite_' AND substr(name, 1, 4) <> '_cf_' ORDER BY rowid")
    .all();
  const tablesInOrder = master.filter((m) => m.type === 'table');
  const stream = createWriteStream(out, { encoding: 'utf8' });
  const write = async (s) => {
    if (!stream.write(`${s}\n`)) await once(stream, 'drain');
  };
  const counts = {};
  let oversize = 0;
  await write('PRAGMA defer_foreign_keys=TRUE;');
  for (const t of tablesInOrder) await write(`${t.sql};`);
  for (const t of tablesInOrder) {
    const { columns, pk } = tableInfo(db, t.name);
    const colList = columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
    let n = 0;
    for (const row of exactRows(db, t.name, orderClause(db, t.name))) {
      n++;
      let values = row.map(literal);
      const insert = () => `INSERT INTO ${quoteIdent(t.name)} (${colList}) VALUES(${values.join(',')});`;
      if (insert().length <= D1_STATEMENT_LIMIT) {
        await write(insert());
        continue;
      }
      // Too long for one D1 statement: insert with the long text values empty, then append them in chunks.
      const long = row.map((v, i) => (typeof v === 'string' && values[i].length > CHUNK_CHARS ? i : -1)).filter((i) => i >= 0);
      if (!pk.length || long.length === 0) {
        oversize++;
        await write(insert());
        continue;
      }
      values = values.map((v, i) => (long.includes(i) ? "''" : v));
      await write(insert());
      const where = pk.map((c) => `${quoteIdent(c)} = ${literal(row[columns.indexOf(c)])}`).join(' AND ');
      for (const i of long) {
        for (const chunk of String(row[i]).match(/[\s\S]{1,20000}/gu) ?? []) {
          await write(`UPDATE ${quoteIdent(t.name)} SET ${quoteIdent(columns[i])} = ${quoteIdent(columns[i])} || ${textLiteral(chunk)} WHERE ${where};`);
        }
      }
    }
    counts[t.name] = n;
  }
  if (db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'sqlite_sequence'").get()) {
    await write('DELETE FROM sqlite_sequence;');
    for (const [name, seq] of exactRows(db, 'sqlite_sequence', orderClause(db, 'sqlite_sequence'))) await write(`INSERT INTO "sqlite_sequence" ("name","seq") VALUES(${literal(name)},${literal(seq)});`);
  }
  for (const m of master) if (m.type !== 'table') await write(`${m.sql};`);
  stream.end();
  await once(stream, 'finish');
  fsyncPath(out);
  const source = tableChecksums(db);
  db.exec('COMMIT');
  db.close();

  // Round trip: load the file into an empty database the way D1 would (one
  // transaction, foreign keys deferred to the commit) and compare checksums.
  const sql = readFileSync(out, 'utf8');
  const check = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true });
  let foreignKeysRejected = false;
  const load = (fk) => {
    check.exec(`PRAGMA foreign_keys = ${fk ? 'ON' : 'OFF'}`);
    check.exec('BEGIN');
    for (const s of splitStatements(sql)) check.exec(s);
    check.exec('COMMIT');
  };
  try {
    load(true);
  } catch (e) {
    if (!/FOREIGN KEY/.test(String(e?.message))) throw e;
    foreignKeysRejected = true;
    if (check.isTransaction) check.exec('ROLLBACK');
    for (const t of check.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all()) check.exec(`DROP TABLE IF EXISTS ${quoteIdent(t.name)}`);
    load(false);
  }
  const loaded = tableChecksums(check);
  check.close();
  const mismatched = Object.keys({ ...source, ...loaded }).filter((t) => source[t]?.sha256 !== loaded[t]?.sha256);
  const roundTrip = mismatched.length === 0;

  let files;
  if (args.flags.files) {
    const dir = resolve(args.flags.files);
    mkdirSync(join(dir, 'objects'), { recursive: true });
    if (!existsSync(layout.runtime)) die('runtime.sqlite not found: there are no stored objects to export.', 1);
    const rdb = openRuntimeDatabase(layout.runtime);
    const store = new FileStore(layout.files, rdb);
    const manifest = [];
    const script = [
      '#!/bin/sh',
      '# Uploads the exported objects to an R2 bucket. Usage: BUCKET=<bucket> sh upload-to-r2.sh',
      '# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID; run from this folder.',
      'set -eu',
      ': "${BUCKET:?set BUCKET to the R2 bucket name}"',
    ];
    let bytes = 0;
    for (const o of store.all(FILES_BUCKET)) {
      const opened = await store.openBody(FILES_BUCKET, o.key);
      if (!opened) continue;
      const body = await opened.handle.readFile();
      await opened.handle.close();
      if (sha256Hex(body) !== opened.obj.sha256) die(`Stored object does not match its checksum; run verify-data-dir.mjs (row ${manifest.length + 1}).`, 1);
      const file = `objects/${keyHash(o.key)}`;
      writeFileSync(join(dir, file), body);
      bytes += body.length;
      manifest.push({ key: o.key, file, size: o.size, sha256: o.sha256, md5: o.md5, contentType: o.httpMetadata.contentType ?? null, customMetadata: o.customMetadata });
      script.push(`npx wrangler r2 object put "$BUCKET"/${shq(o.key)} --file ${shq(file)}${o.httpMetadata.contentType ? ` --content-type ${shq(o.httpMetadata.contentType)}` : ''} --remote`);
    }
    rdb.close();
    writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    writeFileSync(join(dir, 'upload-to-r2.sh'), `${script.join('\n')}\n`, { mode: 0o700 });
    files = { dir, count: manifest.length, bytes };
  }

  const bytes = statSync(out).size;
  const fileSha = createHash('sha256').update(sql).digest('hex');
  const report = loadReport(layout.root);
  report.export = { at: new Date().toISOString(), file: basename(out), bytes, sha256: fileSha, tables: counts, roundTrip, mismatched, foreignKeysRejected, oversizeStatements: oversize, files };
  saveReport(layout.root, report);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  console.log(`Wrote ${out}: ${Object.keys(counts).length} tables, ${total} rows, ${bytes} bytes (sha256 ${fileSha.slice(0, 16)})`);
  for (const [t, n] of Object.entries(counts)) if (n) console.log(`  ${t}: ${n}`);
  console.log(`Round trip into an empty database: ${roundTrip ? 'identical checksums' : `DIFFERENT for ${mismatched.join(', ')}`}`);
  if (foreignKeysRejected) console.log('Warning: the data has foreign key violations; D1 will refuse this file until they are fixed.');
  if (oversize) console.log(`Warning: ${oversize} rows produce statements longer than D1 accepts (${D1_STATEMENT_LIMIT} bytes).`);
  if (files) console.log(`Objects: ${files.count} (${files.bytes} bytes) in ${files.dir}; upload with: BUCKET=<bucket> sh upload-to-r2.sh`);
  process.exit(roundTrip && !foreignKeysRejected && !oversize ? 0 : 1);
}

main().catch((e) => die(`Export failed: ${e instanceof Error ? e.message : String(e)}`));
