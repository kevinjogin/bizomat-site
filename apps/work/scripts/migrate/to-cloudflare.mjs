#!/usr/bin/env node
// Move Project Management's data from the work Machine of the BIZOMAT Fly app back to Cloudflare: a new D1 database and
// a new R2 bucket for the Worker bizomat-tasks. The reverse of to-fly.mjs, run the same way from the owner's computer,
// where flyctl and wrangler are signed in (Windows, macOS or Linux; Node 22.19 or later, nothing else).
//
//   node scripts/migrate/to-cloudflare.mjs prepare <folder> [--app bizomat] [--part-bytes <n>]
//   node scripts/migrate/to-cloudflare.mjs apply <folder> [--db bizomat-tasks-db] [--bucket bizomat-tasks-files] [--replace]
//
// prepare only reads Fly. On the work Machine it makes a consistent copy of /data/work in /data/incoming
// (lib/snapshot-data-dir.mjs: db.sqlite and runtime.sqlite with VACUUM INTO, the stored files by hard link, so the
// copy takes no more space than the two databases), streams it here as tar over fly ssh console (file by file in
// base64 when the binary stream does not arrive intact, as on some Windows consoles), checks it against the SHA-256
// of the databases taken on the Machine and of every file in the index, and removes the copy there. Then, here: the
// database must be at the repository's latest migration with exactly the schema migrations/ make, and pass SQLite's
// integrity and foreign key checks. It writes, in <folder>:
//   snapshot/        the copy (db.sqlite, runtime.sqlite, files/): a data folder, as on the Machine
//   migrations/      the migrations the copy was checked against; apply gives D1 exactly these
//   sql/clear.sql    deletes the rows of every table, children first (guard triggers dropped and created again)
//   sql/part-*.sql   the rows (lib/d1-sql.mjs: exact values, parents first, statements under D1's 100,000 bytes,
//                    each part under --part-bytes, 4 MiB by default), checked by loading them into an empty database
//                    at the same migrations: equal rows in every table (SHA-256 per table)
//   files.json       every stored file: key, size, SHA-256, content type
//   counts.json      per table: rows, and sizes and sums that show the rows arrived whole (no content)
//   prepared.json    where the copy came from, the tables in load order, the parts
//   MANIFEST.sha256  SHA-256 of every other file in the folder
//
// apply checks the folder against MANIFEST.sha256 first, then: the R2 bucket exists; `wrangler d1 migrations apply`
// (the folder's migrations); D1 lists exactly those migrations; D1 has no rows beyond those the migrations make
// (with --replace it may: a Time Travel restore point is recorded, then they are deleted, children first); clear.sql
// and each part with `wrangler d1 execute --remote --file`, stopping at the first that fails; each file with
// `wrangler r2 object put --remote` and its content type; then it compares every table's counts in D1 with
// counts.json and reads every file back from R2 (size and SHA-256).
//
// Rehearsals: prepare --from-db <db.sqlite> --from-dir <data folder or its files/ folder> reads a copy of /data/work on
// this computer instead of Fly; apply --local <dir> writes to wrangler's local D1 and R2 kept in <dir> instead of
// Cloudflare. WRANGLER names the wrangler script run with node (default: this app's node_modules), FLYCTL the flyctl
// program (default fly), TAR the tar program (default tar: built into Windows 10 and 11); CLOUDFLARE_ACCOUNT_ID picks
// the account when the wrangler login has several. Prints names, counts and checksums only, never a row or a file's
// content. <folder> holds real data: it stays on this computer.

import { execFile, spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { closeSync, copyFileSync, createWriteStream, existsSync, lstatSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, readSync, rmSync, statSync, writeFileSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isValidKey, keyHash } from '../../src/node/store/file-store.ts';
import { FILES_BUCKET } from '../../src/node/store/layout.ts';
import { applyMigrations, diffSchema, expectedSchema, migrationStatus, readMigrationsDir, schemaSnapshot } from '../../src/node/store/migrations.ts';
import { DatabaseSync, foreignKeyViolations, integrityProblems } from '../../src/node/store/sqlite.ts';
import { DEFAULT_PART_BYTES, D1_STATEMENT_LIMIT, FINGERPRINT_FIELDS, clearSql, dataTables, fingerprintBatches, loadPlan, localFingerprints, rawChecksums, writeParts } from './lib/d1-sql.mjs';
import { APP_ROOT, MIGRATIONS_DIR, UsageError, parseArgs, referencedObjects } from './lib/common.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_SCRIPT = join(HERE, 'lib', 'snapshot-data-dir.mjs');
/** The event a CREATE TRIGGER statement fires on: INSERT, UPDATE or DELETE. */
function triggerEvent(sql) {
  return /\b(?:BEFORE|AFTER|INSTEAD\s+OF)?\s*(INSERT|UPDATE|DELETE)\b(?:\s+OF\s+[^]*?)?\s+ON\b/i.exec(String(sql))?.[1]?.toUpperCase() ?? 'INSERT';
}

const WRANGLER = process.env.WRANGLER || join(APP_ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const FLY = process.env.FLYCTL || 'fly';
const TAR = process.env.TAR || 'tar';
const DATA = '/data/work';
const REMOTE_DIR = '/data/incoming';
/** wrangler's own limit for one `r2 object put` (300 MiB). */
const R2_PUT_LIMIT = 300 * 1024 * 1024;
const USAGE = [
  'usage: to-cloudflare.mjs prepare <folder> [--app <Fly app>] [--part-bytes <n>] [--from-db <db.sqlite> --from-dir <dir>]',
  '       to-cloudflare.mjs apply <folder> [--db <D1 database>] [--bucket <R2 bucket>] [--replace] [--local <dir>]',
].join('\n');
const HTTP_FLAGS = { contentType: '--content-type', contentDisposition: '--content-disposition', contentEncoding: '--content-encoding', contentLanguage: '--content-language', cacheControl: '--cache-control' };

class Stop extends Error {}
const say = (s) => console.log(s);
const stop = (s) => {
  throw new Stop(s);
};

function parse(argv) {
  let args;
  try {
    args = parseArgs(argv, { booleans: ['replace'], strings: ['app', 'part-bytes', 'from-db', 'from-dir', 'db', 'bucket', 'local'] });
  } catch (e) {
    stop(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e));
  }
  const [cmd, folder, ...extra] = args.positional;
  if (!['prepare', 'apply'].includes(cmd) || !folder || extra.length) stop(USAGE);
  const allowed = cmd === 'prepare' ? ['app', 'part-bytes', 'from-db', 'from-dir'] : ['db', 'bucket', 'replace', 'local'];
  const wrong = Object.keys(args.flags).filter((k) => !allowed.includes(k));
  if (wrong.length) stop(`--${wrong[0]} is not an option of ${cmd}\n${USAGE}`);
  const o = { cmd, folder: resolve(folder), app: 'bizomat', db: 'bizomat-tasks-db', bucket: 'bizomat-tasks-files', partBytes: DEFAULT_PART_BYTES, ...args.flags };
  if (Boolean(o['from-db']) !== Boolean(o['from-dir'])) stop('--from-db and --from-dir go together (a rehearsal without Fly)');
  if (!/^[a-z0-9-]+$/.test(o.app)) stop('--app: a Fly app name');
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(o.db)) stop('--db: a D1 database name (lower-case letters, digits, - and _)');
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(o.bucket)) stop('--bucket: an R2 bucket name (lower-case letters, digits and -)');
  if (args.flags['part-bytes'] !== undefined) {
    o.partBytes = Number(args.flags['part-bytes']);
    if (!Number.isInteger(o.partBytes) || o.partBytes < 1000) stop('--part-bytes: a whole number of bytes, at least 1000');
  }
  if (o.local !== undefined) o.local = resolve(o.local);
  return o;
}

// ----------------------------------------------------------------------------- shared helpers

function sha256File(path) {
  const h = createHash('sha256');
  const buf = Buffer.allocUnsafe(1 << 20);
  const fd = openSync(path, 'r');
  try {
    for (let n; (n = readSync(fd, buf, 0, buf.length, null)) > 0; ) h.update(buf.subarray(0, n));
  } finally {
    closeSync(fd);
  }
  return h.digest('hex');
}

/** Every file under dir, relative with /, in byte order; links are refused. */
function filesUnder(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      const rel = relative(dir, p).split(sep).join('/');
      if (lstatSync(p).isSymbolicLink()) stop(`${rel} is a link: the folder must hold only files`);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) out.push(rel);
      else stop(`${rel} is not a regular file`);
    }
  };
  walk(dir);
  return out.sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
}

const fmtBytes = (n) => (n < 1024 ? `${n} bytes` : n < 1 << 20 ? `${(n / 1024).toFixed(1)} KB` : `${(n / (1 << 20)).toFixed(1)} MB`);
const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** A message without the values a statement may quote (text in quotes, blobs in hex). */
const redact = (s) => String(s).replace(/X'[0-9A-Fa-f]*'/g, "X'...'").replace(/'(?:[^']|'')*'/g, "'...'");
const fmtCounts = (o) => Object.entries(o).map(([k, v]) => `${k} ${v}`).join(', ');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const migrationNames = (dir) => readMigrationsDir(dir).map((m) => m.name);

/** The stored files a snapshot's index lists for the FILES bucket, with where their bodies are in the snapshot. */
function indexedFiles(snap) {
  const runtime = join(snap, 'runtime.sqlite');
  if (!existsSync(runtime)) return { files: [], otherBuckets: 0, kvEntries: 0 };
  const db = new DatabaseSync(runtime, { readOnly: true });
  try {
    const has = (t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
    if (!has('r2_objects')) return { files: [], otherBuckets: 0, kvEntries: 0 };
    const rows = db.prepare('SELECT key, version, size, sha256, http_metadata, custom_metadata FROM r2_objects WHERE bucket = ? ORDER BY key').all(FILES_BUCKET);
    const files = rows.map((r) => {
      const h = keyHash(String(r.key));
      const meta = (s) => {
        try {
          const v = JSON.parse(String(s ?? '{}'));
          return v && typeof v === 'object' ? v : {};
        } catch {
          return {};
        }
      };
      return { key: String(r.key), file: `snapshot/files/${FILES_BUCKET}/${h.slice(0, 2)}/${h.slice(2, 4)}/${h}.${r.version}`, size: Number(r.size), sha256: String(r.sha256), httpMetadata: meta(r.http_metadata), customMetadata: meta(r.custom_metadata) };
    });
    const otherBuckets = Number(db.prepare('SELECT count(*) AS n FROM r2_objects WHERE bucket <> ?').get(FILES_BUCKET).n);
    const kvEntries = has('kv_entries') ? Number(db.prepare('SELECT count(*) AS n FROM kv_entries').get().n) : 0;
    return { files, otherBuckets, kvEntries };
  } finally {
    db.close();
  }
}

/**
 * wrangler puts the key into the request path as it is, so a key must be one that a URL path keeps unchanged:
 * the app's keys (users/<id>/avatar-<id>, ws/<id>/...) are base64url ids and slashes.
 */
const urlSafeKey = (key) => /^[A-Za-z0-9._~!$&'()*+,;=:@/-]+$/.test(key) && key.split('/').every((s) => s !== '.' && s !== '..');

/** Rows the migrations alone put in an empty database (0004 records when analytics started), per table. */
function seedRows(migrations) {
  const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true });
  try {
    applyMigrations(db, migrations);
    return Object.fromEntries(Object.entries(localFingerprints(db, loadPlan(db))).map(([t, f]) => [t, f.n]));
  } finally {
    db.close();
  }
}

// ----------------------------------------------------------------------------- prepare: the copy from Fly

/** Runs flyctl and waits. dataOut: what the command prints is data (a file in base64), so a failure shows stderr only. */
function fly(args, { allowFail = false, dataOut = false } = {}) {
  const r = spawnSync(FLY, args, { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.error) stop(`${FLY} could not run (${r.error.code}): install flyctl and sign in (fly auth login)`);
  if (r.status !== 0 && !allowFail) {
    const why = `${r.stderr || ''}${dataOut ? '' : r.stdout || ''}`.trim().split('\n').slice(-3).join(' ').slice(0, 300);
    stop(`fly ${args.slice(0, 3).join(' ')} failed (exit code ${r.status})${why ? `: ${why}` : ''}`);
  }
  return r;
}

function workMachine(app) {
  let list;
  try {
    list = JSON.parse(fly(['machines', 'list', '--app', app, '--json']).stdout);
  } catch (e) {
    if (e instanceof Stop) throw e;
    stop('fly machines list gave no JSON');
  }
  const work = (list || []).filter((m) => (m.config?.metadata?.fly_process_group ?? m.process_group) === 'work');
  if (work.length === 0) stop(`the app ${app} has no work Machine`);
  if (work.length > 1) stop(`the app ${app} has ${work.length} work Machines: it must have exactly one (each has its own volume)`);
  return { id: work[0].id, state: work[0].state };
}

const sshArgs = (o, m, command) => ['ssh', 'console', '--app', o.app, '--machine', m.id, '--command', command];
const ssh = (o, m, command, opts) => fly(sshArgs(o, m, command), opts);

function snapshotResult(stdout, where) {
  const line = String(stdout || '')
    .split(/\r?\n/)
    .find((l) => l.startsWith('BIZOMAT-SNAPSHOT '));
  if (!line) return null;
  try {
    return JSON.parse(line.slice('BIZOMAT-SNAPSHOT '.length));
  } catch {
    stop(`the copy ${where} gave an answer that is not JSON`);
  }
}

/** Sends lib/snapshot-data-dir.mjs to the Machine in base64 pieces (one command line each) and checks it there. */
function sendScript(o, m, remote) {
  const script = readFileSync(SNAPSHOT_SCRIPT);
  const sha = createHash('sha256').update(script).digest('hex');
  const b64 = script.toString('base64');
  const size = 12_000;
  const pieces = Math.ceil(b64.length / size);
  for (let i = 0; i < pieces; i++) {
    const steps = i === 0 ? [`mkdir -p ${REMOTE_DIR}`] : [];
    steps.push(`printf %s ${b64.slice(i * size, (i + 1) * size)} ${i === 0 ? '>' : '>>'} ${remote}.b64`);
    if (i === pieces - 1) steps.push(`base64 -d ${remote}.b64 > ${remote}.mjs`, `rm -f ${remote}.b64`, `echo "${sha}  ${remote}.mjs" | sha256sum -c --status`);
    ssh(o, m, `sh -c '${steps.join(' && ')}'`);
  }
}

/** Runs a command on the Machine and writes what it prints to a file (no terminal: the bytes pass unchanged where the console allows it). */
function streamDownload(o, m, command, local) {
  return new Promise((done) => {
    const out = createWriteStream(local);
    const child = spawn(FLY, sshArgs(o, m, command), { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    let code = null;
    let pending = 2;
    const finish = () => {
      if (--pending === 0) done(code === 0);
    };
    child.stderr?.on('data', (d) => {
      err += d;
    });
    child.on('error', () => {
      code = -1;
      out.end();
      finish();
    });
    child.on('close', (c) => {
      code = c;
      if (c !== 0) say(`streaming failed (exit code ${c}): ${err.trim().split('\n').pop() ?? ''}`);
      finish();
    });
    out.on('close', finish);
    if (child.stdout) child.stdout.pipe(out);
    else out.end();
  });
}

/** The fallback for one file: base64, 4 MiB at a time, each piece between markers so that nothing else can mix in. */
function fetchBase64(o, m, remote, local, bytes) {
  const step = 4 << 20;
  const pieces = Math.max(1, Math.ceil(bytes / step));
  const tag = randomBytes(8).toString('hex');
  mkdirSync(dirname(local), { recursive: true });
  const fd = openSync(local, 'w');
  try {
    for (let i = 0; i < pieces; i++) {
      const r = ssh(o, m, `sh -c 'echo BEGIN-${tag}; dd if=${remote} bs=${step} skip=${i} count=1 iflag=fullblock 2>/dev/null | base64; echo END-${tag}'`, { dataOut: true });
      const text = r.stdout || '';
      const a = text.indexOf(`BEGIN-${tag}`);
      const b = text.indexOf(`END-${tag}`, a + 1);
      if (a < 0 || b < 0) stop(`a piece of a file did not arrive (${i + 1} of ${pieces})`);
      writeSync(fd, Buffer.from(text.slice(a + tag.length + 6, b), 'base64'));
    }
  } finally {
    closeSync(fd);
  }
}

/** Unpacks the streamed archive into snap, after checking it holds only the copy's own names. False when tar cannot read it. */
function extract(archive, snap) {
  const list = spawnSync(TAR, ['-t', '-f', archive], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (list.error) stop(`tar could not run (${list.error.code}): Windows 10 and 11 have it built in; elsewhere install tar`);
  if (list.status !== 0) return false;
  const names = list.stdout.split(/\r?\n/).filter(Boolean).map((n) => n.replace(/^\.\//, '').replace(/\/$/, ''));
  const odd = names.filter((n) => (!['db.sqlite', 'runtime.sqlite', 'files'].includes(n) && !/^files(\/[A-Za-z0-9._-]+)+$/.test(n)) || n.split('/').includes('..'));
  if (odd.length) stop(`the archive holds something other than the copy: ${odd.slice(0, 3).join(', ')}`);
  mkdirSync(snap, { recursive: true });
  return spawnSync(TAR, ['-x', '-f', archive, '-C', snap], { encoding: 'utf8' }).status === 0;
}

/** What differs between the copy here and the one on the Machine: the databases by their SHA-256 there, files by the index. */
function copyProblems(o, snap, info) {
  const out = [];
  for (const n of info.databases) {
    const p = join(snap, n);
    if (!existsSync(p) || statSync(p).size !== info.sizes[n] || sha256File(p) !== info.sha256[n]) out.push(n);
  }
  if (out.length) return out;
  for (const f of indexedFiles(snap).files) {
    const p = join(o.folder, ...f.file.split('/'));
    if (!existsSync(p) || statSync(p).size !== f.size || sha256File(p) !== f.sha256) out.push('a stored file');
  }
  return out;
}

async function copyFromFly(o, snap) {
  say(`\n== Copy the data of the work Machine of ${o.app} (read only: nothing on Fly changes)`);
  const m = workMachine(o.app);
  say(`work Machine ${m.id} (${m.state})`);
  if (m.state !== 'started') stop(`the work Machine is ${m.state}: start it first (fly machine start ${m.id} --app ${o.app})`);
  const stamp = new Date().toISOString().replace(/\.\d+Z$/, '').replace(/[-:]/g, '').replace('T', '-');
  const name = `cf-export-${stamp}-${randomBytes(3).toString('hex')}`;
  const remote = `${REMOTE_DIR}/${name}`;
  let info;
  try {
    sendScript(o, m, remote);
    const r = ssh(o, m, `node --no-warnings ${remote}.mjs ${DATA}/db.sqlite ${DATA}/runtime.sqlite ${DATA}/files ${remote}`, { allowFail: true });
    info = snapshotResult(r.stdout, 'on the Machine');
    if (!info) stop(`the copy on the Machine did not run (exit code ${r.status}): ${`${r.stderr || ''}`.trim().split('\n').pop() ?? ''}`);
    if (!info.ok) stop(`the copy on the Machine failed: ${info.error}`);
    say(`copy made on the Machine: ${info.databases.join(' and ')} with VACUUM INTO, ${count(info.files.objects, 'file')} (${fmtBytes(info.files.bytes)}) by hard link`);
    if (info.serverRunning) say('Note: Project Management was running during the copy: what it saves from now on is not in this copy. For the final copy, stop it first (maintenance).');
    if (info.files.gone || info.files.mismatched) {
      stop(`${info.files.gone} files were removed while they were copied and ${info.files.mismatched} did not match the index: prepare again${info.serverRunning ? ', with Project Management stopped' : ''} (if it repeats, run verify-data-dir.mjs on the Machine)`);
    }
    const archive = join(o.folder, `${name}.tar`);
    let problems = ['the stream'];
    if (await streamDownload(o, m, `tar -c -f - -C ${remote} ${info.entries.join(' ')}`, archive)) {
      problems = extract(archive, snap) ? copyProblems(o, snap, info) : ['the archive'];
    }
    rmSync(archive, { force: true });
    if (problems.length) {
      say(`${problems[0]} did not arrive intact: fetching the files one by one in base64 instead`);
      rmSync(snap, { recursive: true, force: true });
      for (const n of info.databases) fetchBase64(o, m, `${remote}/${n}`, join(snap, n), info.sizes[n]);
      const { files } = indexedFiles(snap);
      files.forEach((f, i) => {
        fetchBase64(o, m, `${remote}/${f.file.slice('snapshot/'.length)}`, join(o.folder, ...f.file.split('/')), f.size);
        if ((i + 1) % 20 === 0 || i + 1 === files.length) say(`  ${i + 1} of ${files.length} files`);
      });
      problems = copyProblems(o, snap, info);
      if (problems.length) stop(`the copy here does not match the one on the Machine (${problems[0]}): nothing was prepared`);
    }
    say(`downloaded: the databases have the sha256 they had on the Machine, and every file the size and sha256 of its index entry`);
  } finally {
    ssh(o, m, `rm -rf ${remote} ${remote}.mjs ${remote}.b64`, { allowFail: true });
    say('removed the copy from the Machine');
  }
  return { kind: 'fly', app: o.app, machine: m.id, serverRunning: info.serverRunning };
}

function copyRehearsal(o, snap) {
  const db = resolve(o['from-db']);
  const dir = resolve(o['from-dir']);
  if (!existsSync(db)) stop(`${db} not found`);
  let runtime;
  let files;
  if (existsSync(join(dir, 'runtime.sqlite'))) [runtime, files] = [join(dir, 'runtime.sqlite'), join(dir, 'files')];
  else if (existsSync(join(dirname(dir), 'runtime.sqlite'))) [runtime, files] = [join(dirname(dir), 'runtime.sqlite'), dir];
  else stop(`no runtime.sqlite (the index of the stored files) in ${dir} or next to it: give a copy of /data/work or its files folder`);
  say(`\n== Rehearsal: ${db} and the files indexed in ${runtime} stand in for the work Machine`);
  const r = spawnSync(process.execPath, ['--no-warnings', SNAPSHOT_SCRIPT, db, runtime, files, snap], { encoding: 'utf8' });
  const info = snapshotResult(r.stdout, 'here');
  if (!info?.ok) stop(`the copy failed: ${info?.error ?? `${r.stderr || ''}`.trim().split('\n').pop()}`);
  say(`copy made: ${info.databases.join(' and ')} with VACUUM INTO, ${count(info.files.objects, 'file')} (${fmtBytes(info.files.bytes)})`);
  if (info.files.gone || info.files.mismatched) stop(`${info.files.gone} files were missing and ${info.files.mismatched} did not match the index (run verify-data-dir.mjs on the source)`);
  return { kind: 'rehearsal', db: basename(db), serverRunning: info.serverRunning };
}

// ----------------------------------------------------------------------------- prepare: checks and files

/** Loads clear.sql and the parts into an empty database at the folder's migrations, as D1 runs them (one transaction each). */
function loadIntoEmpty(migrations, sqlFiles) {
  const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true });
  applyMigrations(db, migrations);
  for (const file of sqlFiles) {
    db.exec('BEGIN');
    try {
      for (const s of readFileSync(file, 'utf8').split('\n')) {
        if (!s) continue;
        if (Buffer.byteLength(s) > D1_STATEMENT_LIMIT) stop(`${basename(file)} has a statement longer than D1 accepts`);
        db.exec(s);
      }
      db.exec('COMMIT');
    } catch (e) {
      if (db.isTransaction) db.exec('ROLLBACK');
      if (e instanceof Stop) throw e;
      stop(`${basename(file)} does not load into an empty database at the same migrations: ${redact(e?.message).slice(0, 200)}`);
    }
  }
  return db;
}

async function prepare(o) {
  if (existsSync(join(o.folder, 'prepared.json')) || existsSync(join(o.folder, 'snapshot'))) stop(`${o.folder} was used before: give a new folder`);
  mkdirSync(o.folder, { recursive: true });
  const snap = join(o.folder, 'snapshot');
  const source = o['from-db'] ? copyRehearsal(o, snap) : await copyFromFly(o, snap);

  say('\n== Check the copy');
  const repo = readMigrationsDir(MIGRATIONS_DIR);
  const latest = repo.at(-1)?.name;
  const db = new DatabaseSync(join(snap, 'db.sqlite'), { readOnly: true });
  let plan;
  let tables;
  let triggers;
  let refs;
  try {
    const integrity = integrityProblems(db);
    if (integrity.length) stop(`db.sqlite fails SQLite's integrity check: ${integrity.slice(0, 3).join('; ')}`);
    const st = migrationStatus(db, repo);
    if (st.unknown.length) stop(`the database has migrations this repository does not have (${st.unknown.join(', ')}): update the repository first`);
    if (st.pending.length) {
      stop(`the database is at ${st.applied.at(-1) ?? 'no migration'}, not at the repository's latest migration ${latest} (missing: ${st.pending.join(', ')}). Refusing: D1 would get a schema this data was not made with. Run the current release on Fly once (it applies them), then prepare again.`);
    }
    const diff = diffSchema(expectedSchema(repo), schemaSnapshot(db));
    if (diff.length) stop(`the schema differs from the one migrations/ make: ${diff.slice(0, 5).join('; ')}`);
    // Rows are written as plain INSERTs into a schema made by the migrations. Triggers on UPDATE or DELETE (Finance's
    // ledger guards) never fire on an INSERT; a trigger on INSERT would run again in D1, so it is refused, as are views
    // and virtual tables.
    const odd = db.prepare("SELECT type, name, sql FROM sqlite_master WHERE type = 'view' OR (type = 'table' AND sql LIKE 'CREATE VIRTUAL TABLE%') OR type = 'trigger'").all().filter((r) => r.type !== 'trigger' || triggerEvent(r.sql) === 'INSERT');
    if (odd.length) stop(`the schema has ${odd.map((r) => `${r.type} ${r.name}`).join(', ')}: this tool writes plain rows only (triggers on INSERT would run again in D1)`);
    tables = dataTables(db);
    triggers = db.prepare("SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'trigger' ORDER BY name").all().filter((r) => tables.includes(String(r.tbl_name))).map((r) => ({ name: String(r.name), sql: String(r.sql) }));
    const seq = db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'sqlite_sequence'").get() ? db.prepare('SELECT name FROM sqlite_sequence').all().map((r) => String(r.name)).filter((n) => tables.includes(n)) : [];
    if (seq.length) stop(`tables with AUTOINCREMENT (${seq.join(', ')}): their counters are not moved by this tool`);
    const fk = foreignKeyViolations(db);
    if (fk.length) {
      const byTable = {};
      for (const v of fk) byTable[v.table] = (byTable[v.table] ?? 0) + 1;
      stop(`${fk.length} rows refer to rows that do not exist (${fmtCounts(byTable)}): D1 enforces foreign keys and would refuse them`);
    }
    try {
      plan = loadPlan(db, tables);
      // A long row is inserted short and its long values appended by UPDATE: never on a table an UPDATE trigger guards.
      const guarded = new Set(db.prepare("SELECT tbl_name, sql FROM sqlite_master WHERE type = 'trigger'").all().filter((r) => triggerEvent(r.sql) === 'UPDATE').map((r) => String(r.tbl_name)));
      for (const t of plan) if (guarded.has(t.name)) t.noAppend = true;
    } catch (e) {
      stop(String(e.message));
    }
    refs = referencedObjects(db);
    say(`db.sqlite: integrity ok, foreign keys ok, migrations ${st.applied.length} of ${repo.length} (latest: ${latest}), schema identical to migrations/`);
  } finally {
    db.close();
  }

  // the stored files: every body as the index says, and a key wrangler can send as it is
  const { files, otherBuckets, kvEntries } = indexedFiles(snap);
  const bad = { missing: 0, different: 0, key: 0, large: 0 };
  for (const f of files) {
    const p = join(o.folder, ...f.file.split('/'));
    if (!existsSync(p)) bad.missing++;
    else if (statSync(p).size !== f.size || sha256File(p) !== f.sha256) bad.different++;
    if (!isValidKey(f.key) || !urlSafeKey(f.key)) bad.key++;
    if (f.size > R2_PUT_LIMIT) bad.large++;
  }
  if (bad.missing || bad.different) stop(`${bad.missing} stored files are missing from the copy and ${bad.different} do not match the index`);
  if (bad.key) stop(`${bad.key} files have keys that wrangler cannot send unchanged (only letters, digits, / and - . _ ~ ! $ & ' ( ) * + , ; = : @ pass as they are)`);
  if (bad.large) stop(`${bad.large} files are larger than wrangler uploads (300 MiB)`);
  const indexed = new Set(files.map((f) => f.key));
  const refKeys = new Set(refs.map((r) => r.key));
  const missingRefs = refs.filter((r) => !indexed.has(r.key));
  const byKind = {};
  for (const r of refs) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
  const fileBytes = files.reduce((s, f) => s + f.size, 0);
  say(`files: ${files.length} (${fmtBytes(fileBytes)}), size and sha256 as the index says; the database refers to ${refs.length}${refs.length ? ` (${fmtCounts(byKind)})` : ''}; ${files.filter((f) => !refKeys.has(f.key)).length} not referred to (copied too)`);
  if (missingRefs.length) {
    const deleted = missingRefs.filter((r) => r.deleted).length;
    say(`Note: the database refers to ${count(missingRefs.length, 'file')} not stored on Fly either (${deleted} deleted in the app); they stay missing on Cloudflare.`);
  }
  if (otherBuckets) say(`Note: ${otherBuckets} stored objects of other buckets than FILES are not copied (the Worker binds FILES only).`);
  if (kvEntries) say(`Note: ${kvEntries} KV entries (CACHE) are not copied: the Worker keeps only a health check there.`);

  say('\n== Write the rows for D1');
  const sqlDir = join(o.folder, 'sql');
  mkdirSync(sqlDir, { recursive: true });
  const src = new DatabaseSync(join(snap, 'db.sqlite'), { readOnly: true });
  let written;
  let counts;
  let sourceSums;
  try {
    written = writeParts(src, plan, sqlDir, { partBytes: o.partBytes });
    if (Object.keys(written.tooLarge).length) stop(`rows larger than D1 accepts (2,000,000 bytes, or a statement it cannot take in pieces): ${fmtCounts(written.tooLarge)}`);
    counts = localFingerprints(src, plan);
    sourceSums = rawChecksums(src, tables);
  } finally {
    src.close();
  }
  try {
    writeFileSync(join(sqlDir, 'clear.sql'), clearSql(plan, triggers));
  } catch (e) {
    stop(String(e.message));
  }
  const totalRows = Object.values(written.rows).reduce((s, n) => s + n, 0);
  const statements = written.parts.reduce((s, p) => s + p.statements, 0);
  say(`${count(tables.length, 'table')}, ${count(totalRows, 'row')}: ${count(written.parts.length, 'part')}, ${count(statements, 'statement')}, ${fmtBytes(written.parts.reduce((s, p) => s + p.bytes, 0))}${written.inPieces ? `; ${count(written.inPieces, 'long row')} appended in pieces` : ''}`);

  // the migrations this copy matches, for apply; then the round trip through them
  mkdirSync(join(o.folder, 'migrations'));
  for (const mg of repo) copyFileSync(join(MIGRATIONS_DIR, mg.name), join(o.folder, 'migrations', mg.name));
  const check = loadIntoEmpty(readMigrationsDir(join(o.folder, 'migrations')), [join(sqlDir, 'clear.sql'), ...written.parts.map((p) => join(sqlDir, p.file))]);
  let loadedSums;
  try {
    loadedSums = rawChecksums(check, tables);
  } finally {
    check.close();
  }
  const differ = tables.filter((t) => loadedSums[t]?.sha256 !== sourceSums[t].sha256 || loadedSums[t]?.rows !== sourceSums[t].rows);
  if (differ.length) stop(`the SQL does not reproduce the copy exactly (${differ.slice(0, 5).join(', ')}): nothing was prepared`);
  say(`round trip into an empty database at ${latest}: every row of the ${tables.length} tables identical (sha256 per table)`);

  writeFileSync(join(o.folder, 'files.json'), `${JSON.stringify(files, null, 2)}\n`);
  writeFileSync(join(o.folder, 'counts.json'), `${JSON.stringify(counts, null, 2)}\n`);
  const made = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const prepared = {
    tool: 'to-cloudflare.mjs',
    made,
    source,
    migrations: repo.map((m) => m.name),
    tables: plan.map((t) => ({ name: t.name, columns: t.columns })),
    rows: totalRows,
    clear: 'sql/clear.sql',
    parts: written.parts.map((p) => ({ ...p, file: `sql/${p.file}` })),
    files: { count: files.length, bytes: fileBytes },
  };
  writeFileSync(join(o.folder, 'prepared.json'), `${JSON.stringify(prepared, null, 2)}\n`);
  const listed = filesUnder(o.folder).filter((f) => f !== 'MANIFEST.sha256');
  writeFileSync(join(o.folder, 'MANIFEST.sha256'), listed.map((f) => `${sha256File(join(o.folder, ...f.split('/')))}  ${f}\n`).join(''));

  say('\nRows per table:');
  say(
    Object.entries(written.rows)
      .filter(([, n]) => n)
      .map(([t, n]) => `  ${t} ${n}`)
      .join('\n') || '  (none)',
  );
  say(`\nPrepared in ${o.folder} (${count(listed.length, 'file')}, MANIFEST.sha256). ${source.kind === 'fly' ? 'Nothing on Fly changed.' : 'A rehearsal: Fly was not read.'} The folder holds real data: keep it on this computer.`);
}

// ----------------------------------------------------------------------------- apply

/** The folder exactly as prepare left it: every file in MANIFEST.sha256 with its SHA-256, and nothing else. */
function checkFolder(folder) {
  const manifest = join(folder, 'MANIFEST.sha256');
  if (!existsSync(manifest) || !existsSync(join(folder, 'prepared.json'))) stop(`${folder} is not a prepared folder: run prepare first`);
  const listed = new Map();
  for (const line of readFileSync(manifest, 'utf8').split('\n').filter(Boolean)) {
    const m = /^([0-9a-f]{64}) {2}(.+)$/.exec(line);
    if (!m) stop('MANIFEST.sha256 is damaged: prepare again');
    listed.set(m[2], m[1]);
  }
  const present = new Set(filesUnder(folder).filter((f) => f !== 'MANIFEST.sha256'));
  const added = [...present].filter((f) => !listed.has(f));
  const missing = [...listed.keys()].filter((f) => !present.has(f));
  const changed = [...listed].filter(([f, sha]) => present.has(f) && sha256File(join(folder, ...f.split('/'))) !== sha).map(([f]) => f);
  if (added.length || missing.length || changed.length) {
    const first = [...changed, ...missing, ...added][0];
    stop(`the folder changed since it was prepared (${changed.length} changed, ${missing.length} missing, ${added.length} added; first: ${first}): prepare again`);
  }
  say(`the folder is as prepared: ${count(listed.size, 'file')}, sha256 checked`);
}

function stripAnsi(s) {
  return String(s).replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
}

/** What went wrong, from wrangler's output, without the values a statement may quote. */
function wranglerWhy(r) {
  const lines = stripAnsi(`${r.stderr || ''}\n${r.stdout || ''}`)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^(Logs were written|🪵)/.test(l) && !/Proxy environment variables detected/.test(l));
  const picked = lines.filter((l) => /error|✘|fail|could not|couldn't|not found|does not exist|unauthori[sz]ed|forbidden|denied|D1_|SQLITE_/i.test(l));
  return redact((picked.length ? picked.slice(-4) : lines.slice(-3)).join(' ')).slice(0, 500);
}

function parseJson(stdout) {
  const lines = String(stdout || '').split(/\r?\n/);
  const at = lines.findIndex((l) => /^\s*[[{]/.test(l));
  if (at < 0) return undefined;
  try {
    return JSON.parse(lines.slice(at).join('\n'));
  } catch {
    return undefined;
  }
}

/** wrangler, as node runs it, against the target: Cloudflare (--remote) or wrangler's local D1 and R2 (--local). */
function makeTarget(o, folder) {
  const dir = mkdtempSync(join(tmpdir(), 'bizomat-tasks-'));
  mkdirSync(join(dir, 'migrations'));
  for (const f of readdirSync(join(folder, 'migrations'))) copyFileSync(join(folder, 'migrations', f), join(dir, 'migrations', f));
  const config = join(dir, 'wrangler.json');
  writeFileSync(
    config,
    `${JSON.stringify(
      {
        name: 'bizomat-tasks',
        compatibility_date: '2026-10-01',
        d1_databases: [{ binding: 'DB', database_name: o.db, migrations_dir: 'migrations' }],
        r2_buckets: [{ binding: 'FILES', bucket_name: o.bucket }],
      },
      null,
      2,
    )}\n`,
  );
  const where = o.local ? ['--local', '--persist-to', o.local] : ['--remote'];
  const env = { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1', FORCE_COLOR: '0' };
  const argv = (args, located) => [WRANGLER, ...args, ...(located ? where : []), '--config', config];
  return {
    dir,
    local: Boolean(o.local),
    label: o.local ? `wrangler's local storage in ${o.local}` : 'Cloudflare',
    /** Runs wrangler and waits; located: the command takes --remote or --local. */
    run(args, { located = true } = {}) {
      const r = spawnSync(process.execPath, argv(args, located), { cwd: dir, env, encoding: 'utf8', maxBuffer: 512 << 20 });
      if (r.error) stop(`wrangler could not run (${r.error.code}): run npm ci in ${APP_ROOT}`);
      return r;
    },
    /** The same, without blocking (for files, several at a time). */
    runAsync(args) {
      return new Promise((done) => {
        execFile(process.execPath, argv(args, true), { cwd: dir, env, encoding: 'utf8', maxBuffer: 64 << 20 }, (err, stdout, stderr) => {
          done({ status: err ? (typeof err.code === 'number' ? err.code : 1) : 0, stdout, stderr });
        });
      });
    },
    cleanup() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

function d1Query(t, o, sql, what) {
  const r = t.run(['d1', 'execute', o.db, '--json', '--command', sql]);
  const json = parseJson(r.stdout);
  if (r.status !== 0 || !Array.isArray(json)) stop(`${what} failed in D1 ${o.db} (exit code ${r.status}): ${wranglerWhy(r)}`);
  return json;
}

/** The fingerprint of every table, read from D1. */
function remoteFingerprints(t, o, tables) {
  const out = {};
  for (const sql of fingerprintBatches(tables)) {
    for (const res of d1Query(t, o, sql, 'counting the rows')) {
      const row = res?.results?.[0];
      if (row && typeof row.t === 'string') out[row.t] = Object.fromEntries(FINGERPRINT_FIELDS.map((f) => [f, Number(row[f])]));
    }
  }
  return out;
}

async function pool(items, n, fn) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        await fn(items[i], i);
      }
    }),
  );
}

async function apply(o) {
  checkFolder(o.folder);
  const prep = JSON.parse(readFileSync(join(o.folder, 'prepared.json'), 'utf8'));
  const counts = JSON.parse(readFileSync(join(o.folder, 'counts.json'), 'utf8'));
  const files = JSON.parse(readFileSync(join(o.folder, 'files.json'), 'utf8'));
  const tables = prep.tables;
  const from = prep.source.kind === 'fly' ? `the Fly app ${prep.source.app} (work Machine ${prep.source.machine})` : 'a rehearsal copy';
  say(`prepared ${prep.made} from ${from}: ${count(tables.length, 'table')}, ${count(prep.rows, 'row')} in ${count(prep.parts.length, 'part')}; ${count(prep.files.count, 'file')} (${fmtBytes(prep.files.bytes)})`);
  const migrations = readMigrationsDir(join(o.folder, 'migrations'));
  const names = migrations.map((m) => m.name);
  const newer = migrationNames(MIGRATIONS_DIR).filter((n) => !names.includes(n));
  if (newer.length) say(`Note: the repository has migrations this data was prepared without (${newer.join(', ')}); D1 gets the folder's ${names.at(-1)}. Apply the newer ones afterwards, as a deploy does.`);
  if (!existsSync(WRANGLER)) stop(`wrangler is not installed in ${APP_ROOT}: run npm ci there first`);

  const t = makeTarget(o, o.folder);
  try {
    say(`\n== Target: D1 ${o.db} and R2 ${o.bucket} on ${t.label}`);
    if (!t.local) {
      // `r2 bucket list` needs R2 read access only (`r2 bucket info` also asks the analytics API)
      const b = t.run(['r2', 'bucket', 'list'], { located: false });
      if (b.status !== 0) stop(`wrangler could not list the R2 buckets (exit code ${b.status}): ${wranglerWhy(b)}. Nothing was changed.`);
      const names = stripAnsi(b.stdout).split(/\r?\n/).map((l) => /^\s*name:\s+(\S+)\s*$/.exec(l)?.[1]).filter(Boolean);
      if (!names.includes(o.bucket)) stop(`the R2 bucket ${o.bucket} was not found: create it (npx wrangler r2 bucket create ${o.bucket}). Nothing was changed.`);
      say(`R2 bucket ${o.bucket}: found`);
    }

    say(`\n== Schema: wrangler d1 migrations apply ${o.db} (${count(names.length, 'migration')}, to ${names.at(-1)})`);
    const mig = t.run(['d1', 'migrations', 'apply', o.db]);
    if (mig.status !== 0) stop(`the migrations failed in D1 ${o.db} (exit code ${mig.status}): ${wranglerWhy(mig)}. No rows were changed.`);
    const appliedNow = names.filter((n) => stripAnsi(mig.stdout).includes(n));
    say(appliedNow.length ? `applied: ${appliedNow.join(', ')}` : 'none were pending');
    const recorded = d1Query(t, o, 'SELECT name FROM d1_migrations ORDER BY id;', 'reading d1_migrations')[0]?.results?.map((r) => String(r.name)) ?? [];
    if (recorded.join('\n') !== names.join('\n')) {
      stop(`D1 ${o.db} records other migrations than the prepared data has (D1: ${recorded.length}, last ${recorded.at(-1) ?? 'none'}; prepared: ${names.length}, last ${names.at(-1)}): use a new database. No rows were changed.`);
    }
    say(`D1 records the same ${count(names.length, 'migration')}`);

    const seed = seedRows(migrations);
    const before = remoteFingerprints(t, o, tables);
    const lacking = tables.filter((x) => !before[x.name]);
    if (lacking.length) stop(`D1 ${o.db} has no table ${lacking[0].name} after the migrations: use a new database`);
    const extra = tables.filter((x) => before[x.name].n > (seed[x.name] ?? 0));
    if (extra.length) {
      const rows = extra.reduce((s, x) => s + before[x.name].n, 0);
      const list = extra.slice(0, 5).map((x) => `${x.name} ${before[x.name].n}`).join(', ');
      if (!o.replace) stop(`D1 ${o.db} already has data: ${count(rows, 'row')} in ${count(extra.length, 'table')} (${list}${extra.length > 5 ? ', ...' : ''}). Nothing was deleted. To replace them with the prepared data, run apply again with --replace.`);
      say(`\n== Replace: D1 ${o.db} has ${count(rows, 'row')} in ${count(extra.length, 'table')} (${list}${extra.length > 5 ? ', ...' : ''})`);
      if (!t.local) {
        const tt = t.run(['d1', 'time-travel', 'info', o.db, '--json'], { located: false });
        const bookmark = parseJson(tt.stdout)?.bookmark;
        if (tt.status !== 0 || !bookmark) stop(`could not record a Time Travel restore point (${wranglerWhy(tt)}): nothing was deleted`);
        say(`restore point before the deletion: bookmark ${bookmark}`);
        say(`  to undo: npx wrangler d1 time-travel restore ${o.db} --bookmark=${bookmark}`);
      }
    } else say(`D1 ${o.db} has no rows beyond those the migrations make`);

    const sqlFiles = [{ file: prep.clear, label: 'clear (the rows there now, children first)' }, ...prep.parts.map((p, i) => ({ file: p.file, label: `part ${i + 1} of ${prep.parts.length} (${count(p.rows, 'row')}, ${count(p.statements, 'statement')}, ${fmtBytes(p.bytes)})`, part: i + 1 }))];
    say(`\n== Rows: ${count(prep.parts.length, 'part')} with wrangler d1 execute --file`);
    for (const s of sqlFiles) {
      const r = t.run(['d1', 'execute', o.db, '--file', join(o.folder, ...s.file.split('/')), '--yes', '--json']);
      if (r.status !== 0) {
        const done = !s.part ? 'D1 rolled it back.' : `${s.part === 1 ? 'No part is' : s.part === 2 ? 'Part 1 is' : `Parts 1 to ${s.part - 1} are`} in D1; this one was rolled back.`;
        stop(`${s.file} failed: ${s.label} (exit code ${r.status}): ${wranglerWhy(r)}. ${done} Fix the cause, then run apply again with --replace.`);
      }
      say(`${s.label}: done`);
    }

    say(`\n== Files: ${count(files.length, 'file')} to R2 ${o.bucket} with wrangler r2 object put`);
    const notCarried = files.filter((f) => Object.keys(f.customMetadata ?? {}).length).length;
    if (notCarried) say(`Note: wrangler cannot set custom metadata; ${count(notCarried, 'file')} had some (the uploader id; the Worker never reads it).`);
    const failed = [];
    let sent = 0;
    await pool(files, t.local ? 1 : 4, async (f) => {
      const flags = Object.entries(HTTP_FLAGS).flatMap(([k, flag]) => (typeof f.httpMetadata?.[k] === 'string' && f.httpMetadata[k] ? [flag, f.httpMetadata[k]] : []));
      let r;
      for (let attempt = 1; attempt <= 3; attempt++) {
        r = await t.runAsync(['r2', 'object', 'put', `${o.bucket}/${f.key}`, '--file', join(o.folder, ...f.file.split('/')), ...flags]);
        if (r.status === 0) break;
        await sleep(1000 * attempt);
      }
      if (r.status !== 0) failed.push(wranglerWhy(r));
      else if (++sent % 25 === 0) say(`  ${sent} of ${files.length}`);
    });
    if (failed.length) stop(`${failed.length} of ${files.length} files could not be uploaded (first: ${failed[0]}). The rows are in D1. Run apply again with --replace.`);
    say(`${sent} uploaded${files.length ? ' (content types kept)' : ''}`);

    say('\n== Verify');
    const after = remoteFingerprints(t, o, tables);
    const wrong = [];
    for (const x of tables) {
      const want = counts[x.name];
      const got = after[x.name];
      const fields = FINGERPRINT_FIELDS.filter((f) => got?.[f] !== want?.[f]);
      if (fields.length) wrong.push(`${x.name} (${fields.map((f) => `${{ n: 'rows', b: 'text and blob bytes', z: 'NULLs', r: 'REAL values', i: 'integer sum' }[f]} ${got?.[f]} instead of ${want?.[f]}`).join(', ')})`);
    }
    if (wrong.length) stop(`D1 differs from the prepared data in ${wrong.length} tables: ${wrong.slice(0, 5).join('; ')}`);
    say(`D1 ${o.db}: ${count(tables.length, 'table')}, ${count(prep.rows, 'row')}; every table's rows, NULLs, REAL values, text and blob bytes and integer sum equal the copy`);
    const scratch = mkdtempSync(join(tmpdir(), 'bizomat-tasks-check-'));
    const problems = { missing: 0, different: 0 };
    try {
      await pool(files, t.local ? 1 : 4, async (f, i) => {
        const back = join(scratch, `file-${i}`);
        let r;
        for (let attempt = 1; attempt <= 3; attempt++) {
          r = await t.runAsync(['r2', 'object', 'get', `${o.bucket}/${f.key}`, '--file', back]);
          if (r.status === 0 || /does not exist/i.test(`${r.stdout}${r.stderr}`)) break;
          await sleep(1000 * attempt);
        }
        if (r.status !== 0 || !existsSync(back)) problems.missing++;
        else if (statSync(back).size !== f.size || sha256File(back) !== f.sha256) problems.different++;
        rmSync(back, { force: true });
      });
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
    if (problems.missing || problems.different) stop(`R2 ${o.bucket}: ${problems.missing} files missing and ${problems.different} different after the upload. Run apply again with --replace.`);
    say(`R2 ${o.bucket}: ${files.length} of ${files.length} files read back, size and sha256 equal`);

    say('\nRows per table in D1:');
    say(
      tables
        .filter((x) => after[x.name].n)
        .map((x) => `  ${x.name} ${after[x.name].n}`)
        .join('\n') || '  (none)',
    );
    say(`\nDone: ${count(prep.rows, 'row')} in ${count(tables.length, 'table')} in D1 ${o.db}, ${count(files.length, 'file')} (${fmtBytes(prep.files.bytes)}) in R2 ${o.bucket}, on ${t.label}.`);
  } finally {
    t.cleanup();
  }
}

try {
  const o = parse(process.argv.slice(2));
  if (o.cmd === 'prepare') await prepare(o);
  else await apply(o);
} catch (e) {
  console.error(`\nSTOP: ${e instanceof Stop ? e.message : e?.stack || e}`);
  process.exit(1);
}
