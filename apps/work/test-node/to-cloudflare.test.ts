// scripts/migrate/to-cloudflare.mjs: prepare (from a stand-in for flyctl whose work Machine is a folder, and as a
// rehearsal from a copy of the data folder) and apply (to a stand-in for wrangler that keeps D1 in a SQLite file and R2
// in a folder, and once to the real wrangler's local D1 and R2, which run on workerd as Miniflare does). The source has
// values that are easy to lose: 64-bit integers, REAL values that need all 17 digits, subnormals, text with line
// breaks, quotes, NUL, invalid UTF-8 and characters outside ASCII, blobs (empty and long), NULLs, rows that refer to
// rows of their own table stored after them, and values too long for one D1 statement.

import { execFile } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { appendFileSync, chmodSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FileStore, keyHash, openRuntimeDatabase } from '../src/node/store/file-store.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { DatabaseSync, openDatabase } from '../src/node/store/sqlite.ts';
import { tempDir } from './helpers.ts';
// @ts-expect-error plain JavaScript module without type declarations
import { exactRows, orderClause } from '../scripts/migrate/lib/common.mjs';
// @ts-expect-error plain JavaScript module without type declarations
import { dataTables, literal, Text } from '../scripts/migrate/lib/d1-sql.mjs';

const root = tempDir('work-to-cloudflare-');
const machine = join(root, 'machine');
const work = join(machine, 'data', 'work');
const cf = join(root, 'cloudflare');
const flyLog = join(root, 'fly.log');
const wranglerLog = join(cf, 'wrangler.log');

const SECRET_EMAIL = 'person.secret@example.com';
const SECRET_HASH = 'pbkdf2$100000$c2VjcmV0c2FsdA==$c2VjcmV0aGFzaA==';
const TRICKY = "Line one\nline two\r\nback\\slash\\n; 'quoted' \"double\" -- no comment /* nor this */ \u0000 nul\ttab é ü 漢字 \u{1F642}   end";
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 1, 2, 3, 0x0a, 0x0d]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x0a, 0x0a, 0x0d, 0x0a, 0x00]);
const PDF = Buffer.from('%PDF-1.4\r\n%âã\n1 0 obj synthetic\n', 'latin1');
const NOTE = Buffer.from('Notes é \u{1F642}\nline\r\n', 'utf8');
const BIG = randomBytes(4_500_000); // more than one 4 MiB base64 piece
const t0 = 1_790_000_000_000;

const keys = {
  avatar: 'users/User1AAAAAAAAAAA/avatar-AvatarAAAAAAAA',
  oldAvatar: 'users/User1AAAAAAAAAAA/avatar-OldAAAAAAAAAAA',
  logo: 'ws/WorkspaceAAAAAAA/logo-LogoAAAAAAAAAAA',
  pdf: 'ws/WorkspaceAAAAAAA/boards/BoardAAAAAAAAAAA/AttachAAAAAAAAAA',
  note: 'ws/WorkspaceAAAAAAA/docs/DocAAAAAAAAAAAA/AttachBBBBBBBBBB',
  empty: 'ws/WorkspaceAAAAAAA/boards/BoardAAAAAAAAAAA/AttachEEEEEEEEEE',
  big: 'ws/WorkspaceAAAAAAA/boards/BoardAAAAAAAAAAA/AttachFFFFFFFFFF',
};
const stored: [string, Buffer, Record<string, string>, Record<string, string>?][] = [
  [keys.avatar, PNG, { contentType: 'image/png' }],
  [keys.oldAvatar, PNG.subarray(0, 9), { contentType: 'image/png' }],
  [keys.logo, JPEG, { contentType: 'image/jpeg' }],
  [keys.pdf, PDF, { contentType: 'application/pdf' }, { uploader: 'User1AAAAAAAAAAA' }],
  [keys.note, NOTE, { contentType: 'text/plain; charset=utf-8' }],
  [keys.empty, Buffer.alloc(0), { contentType: 'application/octet-stream' }],
  [keys.big, BIG, { contentType: 'application/zip' }],
];

/** A data folder at the given migrations, filled as the app fills it (rows and stored files). */
async function buildDataFolder(dir: string, migrations = readMigrationsDir('migrations')): Promise<DatabaseSync> {
  mkdirSync(dir, { recursive: true });
  const db = openDatabase(join(dir, 'db.sqlite'));
  applyMigrations(db, migrations);
  const ins = (sql: string, ...v: unknown[]) => db.prepare(sql).run(...(v as never[]));
  ins("INSERT INTO users (id, email, name, password_hash, avatar_key, preferences_json, failed_logins, created_at, updated_at) VALUES ('User1AAAAAAAAAAA', ?, 'Person One', ?, ?, '{\"theme\":\"dark\"}', 'not a number', ?, ?)", SECRET_EMAIL, SECRET_HASH, keys.avatar, t0, t0);
  ins("INSERT INTO users (id, email, name, password_hash, locked_until, created_at, updated_at) VALUES ('User2AAAAAAAAAAA', 'second.person@example.com', ?, ?, ?, ?, ?)", 'Zoë \u{1F642}', SECRET_HASH, 9007199254740993n, t0, t0 + 1);
  ins("INSERT INTO users (id, email, name, created_at, updated_at) VALUES ('User3AAAAAAAAAAA', 'third.person@example.com', 'O''Brien', ?, ?)", t0, t0);
  ins("INSERT INTO workspaces (id, name, description, logo_key, created_by, created_at, updated_at) VALUES ('WorkspaceAAAAAAA', 'Synthetic', ?, ?, 'User1AAAAAAAAAAA', ?, ?)", TRICKY, keys.logo, t0, t0);
  ins("INSERT INTO workspaces (id, name, created_by, created_at, updated_at) VALUES ('WorkspaceBBBBBBB', 'Second', 'User2AAAAAAAAAAA', ?, ?)", t0, t0);
  ins("INSERT INTO workspace_members VALUES ('WorkspaceAAAAAAA', 'User1AAAAAAAAAAA', 'owner', ?), ('WorkspaceAAAAAAA', 'User2AAAAAAAAAAA', 'member', ?), ('WorkspaceBBBBBBB', 'User2AAAAAAAAAAA', 'owner', ?)", t0, t0, t0);
  // Rows stored before the rows they refer to (as a moved or re-parented folder or item is): parents first must be
  // worked out, not taken from the stored order.
  db.exec('PRAGMA defer_foreign_keys = ON; BEGIN');
  ins("INSERT INTO folders (id, workspace_id, scope, parent_id, name, position, created_by, created_at, updated_at) VALUES ('Folder3AAAAAAAAA', 'WorkspaceAAAAAAA', 'boards', 'Folder2AAAAAAAAA', 'Deep', 5e-324, 'User1AAAAAAAAAAA', ?, ?)", t0, t0);
  ins("INSERT INTO folders (id, workspace_id, scope, parent_id, name, position, created_by, created_at, updated_at) VALUES ('Folder2AAAAAAAAA', 'WorkspaceAAAAAAA', 'boards', 'Folder1AAAAAAAAA', 'Middle', ?, 'User1AAAAAAAAAAA', ?, ?)", 1 / 3, t0, t0);
  ins("INSERT INTO folders (id, workspace_id, scope, parent_id, name, position, created_by, created_at, updated_at) VALUES ('Folder1AAAAAAAAA', 'WorkspaceAAAAAAA', 'boards', NULL, 'Top', 0.1, 'User1AAAAAAAAAAA', ?, ?)", t0, t0);
  ins("INSERT INTO boards (id, workspace_id, name, settings_json, position, folder_id, created_by, created_at, updated_at) VALUES ('BoardAAAAAAAAAAA', 'WorkspaceAAAAAAA', 'Board', ?, ?, 'Folder3AAAAAAAAA', 'User1AAAAAAAAAAA', ?, ?)", '{"k":"é\\n"}', 0.1 + 0.2, t0, t0);
  ins("INSERT INTO boards (id, workspace_id, name, position, created_by, created_at, updated_at) VALUES ('BoardBBBBBBBBBBB', 'WorkspaceBBBBBBB', 'Other', 1e300, 'User2AAAAAAAAAAA', ?, ?)", t0, t0);
  ins("INSERT INTO groups (id, workspace_id, board_id, name, position, created_at) VALUES ('GroupAAAAAAAAAAA', 'WorkspaceAAAAAAA', 'BoardAAAAAAAAAAA', 'Group', 1024, ?)", t0);
  ins("INSERT INTO groups (id, workspace_id, board_id, name, position, created_at) VALUES ('GroupBBBBBBBBBBB', 'WorkspaceAAAAAAA', 'BoardAAAAAAAAAAA', 'Huge', ?, ?)", 2 ** 60, t0);
  const item = (id: string, parent: string | null, position: number) =>
    ins("INSERT INTO items (id, workspace_id, board_id, group_id, parent_item_id, name, description, position, values_json, created_by, created_at, updated_at) VALUES (?, 'WorkspaceAAAAAAA', 'BoardAAAAAAAAAAA', 'GroupAAAAAAAAAAA', ?, ?, ?, ?, ?, 'User1AAAAAAAAAAA', ?, ?)", id, parent, `Item ${id}`, TRICKY, position, '{"status":"\u{1F642}"}', t0, t0);
  item('ItemDAAAAAAAAAAA', 'ItemCAAAAAAAAAAA', 1.0000000000000002);
  item('ItemCAAAAAAAAAAA', 'ItemBAAAAAAAAAAA', -1.5e-300);
  item('ItemBAAAAAAAAAAA', null, 123456.789);
  item('ItemAAAAAAAAAAAA', null, 33.333333333333336);
  ins("INSERT INTO updates (id, workspace_id, board_id, item_id, parent_update_id, author_id, body, created_at) VALUES ('UpdateBBBBBBBBBB', 'WorkspaceAAAAAAA', 'BoardAAAAAAAAAAA', 'ItemBAAAAAAAAAAA', 'UpdateAAAAAAAAAA', 'User2AAAAAAAAAAA', ?, ?)", TRICKY, t0);
  ins("INSERT INTO updates (id, workspace_id, board_id, item_id, author_id, body, created_at) VALUES ('UpdateAAAAAAAAAA', 'WorkspaceAAAAAAA', 'BoardAAAAAAAAAAA', 'ItemBAAAAAAAAAAA', 'User1AAAAAAAAAAA', 'First', ?)", t0);
  db.exec('COMMIT');
  // Two documents too long for one D1 statement: one in pieces of hex (line breaks and characters outside ASCII),
  // one in pieces of quoted text (with many quotes).
  const longJson = JSON.stringify({ type: 'doc', text: `é漢\n'\u{1F642}`.repeat(40_000) });
  const longAscii = `{"text":"${"it's a 'quote' ".repeat(9_000)}"}`;
  ins("INSERT INTO documents (id, workspace_id, title, content_json, folder_id, created_by, created_at, updated_at) VALUES ('DocAAAAAAAAAAAA', 'WorkspaceAAAAAAA', 'Long', ?, 'Folder1AAAAAAAAA', 'User1AAAAAAAAAAA', ?, ?)", longJson, t0, t0);
  ins("INSERT INTO documents (id, workspace_id, title, content_json, created_by, created_at, updated_at) VALUES ('DocBBBBBBBBBBBB', 'WorkspaceAAAAAAA', 'Quotes', ?, 'User1AAAAAAAAAAA', ?, ?)", longAscii, t0, t0);
  const attach = (id: string, scope: string, key: string, type: string, size: number, deleted: number | null) =>
    ins(`INSERT INTO attachments (id, workspace_id, board_id, item_id, document_id, scope, uploader_id, file_name, content_type, size, r2_key, created_at, deleted_at) VALUES (?, 'WorkspaceAAAAAAA', 'BoardAAAAAAAAAAA', ?, ?, ?, 'User1AAAAAAAAAAA', ?, ?, ?, ?, ?, ?)`, id, scope === 'item' ? 'ItemAAAAAAAAAAAA' : null, scope === 'document' ? 'DocAAAAAAAAAAAA' : null, scope, `${id}.bin`, type, size, key, t0, deleted);
  attach('AttachAAAAAAAAAA', 'item', keys.pdf, 'application/pdf', PDF.length, null);
  attach('AttachBBBBBBBBBB', 'document', keys.note, 'text/plain; charset=utf-8', NOTE.length, null);
  attach('AttachDDDDDDDDDD', 'item', 'ws/WorkspaceAAAAAAA/boards/BoardAAAAAAAAAAA/AttachDDDDDDDDDD', 'image/png', 3, t0); // deleted in the app: no file
  attach('AttachEEEEEEEEEE', 'item', keys.empty, 'application/octet-stream', 0, null);
  attach('AttachFFFFFFFFFF', 'item', keys.big, 'application/zip', BIG.length, null);
  ins('INSERT INTO rate_limits VALUES (?, ?, ?)', `login:email:${SECRET_EMAIL}`, -9223372036854775808n, 9223372036854775807n);
  ins("INSERT INTO analytics_daily VALUES ('2026-11-06', 'page_views', ?)", 9007199254740993n);
  ins("INSERT INTO system_kv VALUES ('blob', ?, ?), ('empty-blob', ?, ?), ('long-blob', ?, ?), ('nul-text', ?, ?)", Buffer.from([0, 0xff, 0x10]), t0, Buffer.alloc(0), t0, randomBytes(150_000), t0, 'a\u0000b', t0);
  db.exec(`INSERT INTO system_kv VALUES ('invalid-utf8', CAST(X'ff61c3' AS TEXT), ${t0})`);
  ins("INSERT INTO goals (id, workspace_id, title, start_value, target_value, current_value, created_by, created_at, updated_at) VALUES ('GoalAAAAAAAAAAAA', 'WorkspaceAAAAAAA', 'Goal', 0.1, 1e-7, 2.2250738585072014e-308, 'User1AAAAAAAAAAA', ?, ?)", t0, t0);
  ins("INSERT INTO planner_entries (id, workspace_id, user_id, item_id, day, position, created_at) VALUES ('PlanAAAAAAAAAAAA', 'WorkspaceAAAAAAA', 'User1AAAAAAAAAAA', 'ItemAAAAAAAAAAAA', '2026-11-06', 2.5, ?)", t0);
  ins("INSERT INTO notifications (id, workspace_id, user_id, type, title, created_at) VALUES ('NotifAAAAAAAAAAA', 'WorkspaceAAAAAAA', 'User2AAAAAAAAAAA', 'mention', ?, ?)", TRICKY, t0);
  ins("INSERT INTO audit_log (id, action, metadata_json, created_at) VALUES ('AuditAAAAAAAAAAA', 'user.login', '{\"ip\":null}', ?)", t0);
  ins("INSERT INTO app_errors (id, created_at, status) VALUES ('ErrorAAAAAAAAAAA', ?, 500)", t0);
  const rdb = openRuntimeDatabase(join(dir, 'runtime.sqlite'));
  const store = new FileStore(join(dir, 'files'), rdb);
  for (const [key, body, httpMetadata, customMetadata] of stored) await store.put('FILES', key, body, { httpMetadata, customMetadata: customMetadata ?? {} });
  rdb.prepare("INSERT INTO kv_entries (namespace, key, value) VALUES ('CACHE', '__health', X'6f6b')").run();
  rdb.close();
  return db;
}

/** flyctl's stand-in: one work Machine whose /data is machine/data; ssh commands run here with the paths moved. */
const FLY = `#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { appendFileSync } = require('node:fs');
const a = process.argv.slice(2);
appendFileSync(${JSON.stringify(flyLog)}, JSON.stringify(a) + '\\n');
const data = ${JSON.stringify(join(machine, 'data'))};
if (a[0] === 'machines' && a[1] === 'list') { console.log(JSON.stringify([{ id: 'm1', state: 'started', config: { metadata: { fly_process_group: 'work' } } }, { id: 'w1', state: 'started', config: { metadata: { fly_process_group: 'web' } } }])); process.exit(0); }
if (a[0] === 'ssh' && a[1] === 'console') {
  const cmd = a[a.indexOf('--command') + 1].split('/data/').join(data + '/');
  if (process.env.FAKE_FLY_BAD_STREAM && cmd.startsWith('tar ')) {
    // a console that turns line feeds into CR LF, as some Windows consoles do to binary output
    const r = spawnSync('sh', ['-c', cmd], { maxBuffer: 1 << 30 });
    process.stdout.write(Buffer.from(r.stdout.toString('latin1').replace(/\\n/g, '\\r\\n'), 'latin1'));
    process.exit(r.status ?? 1);
  }
  process.exit(spawnSync('sh', ['-c', cmd], { stdio: 'inherit' }).status ?? 1);
}
process.exit(2);
`;

const url = (p: string) => pathToFileURL(resolve(p)).href;

/** wrangler's stand-in: D1 in FAKE_CF/d1/<name>.sqlite (each file one transaction, D1's statement limit), R2 in FAKE_CF/r2. */
const WRANGLER = `import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join, resolve } from 'node:path';
import { DatabaseSync } from ${JSON.stringify(url('src/node/store/sqlite.ts'))};
import { applyMigrations, readMigrationsDir } from ${JSON.stringify(url('src/node/store/migrations.ts'))};
import { splitStatements } from ${JSON.stringify(url('scripts/reorder-dump.mjs'))};
const state = process.env.FAKE_CF;
const a = process.argv.slice(2);
appendFileSync(join(state, 'wrangler.log'), JSON.stringify(a) + '\\n');
const flag = (n) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
const fail = (m, code = 1) => { process.stderr.write('X [ERROR] ' + m + '\\n'); process.exit(code); };
const config = JSON.parse(readFileSync(flag('--config'), 'utf8'));
const remote = a.includes('--remote');
function d1(name) {
  const entry = config.d1_databases.find((d) => d.database_name === name);
  if (!entry) fail("Couldn't find a D1 DB with the name or binding '" + name + "' in your config file.");
  mkdirSync(join(state, 'd1'), { recursive: true });
  return { entry, db: new DatabaseSync(join(state, 'd1', name + '.sqlite'), { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true }) };
}
const [c1, c2] = a;
if (c1 === 'd1' && c2 === 'migrations' && a[2] === 'apply') {
  if (!remote) fail('stand-in: --remote only', 2);
  const { entry, db } = d1(a[3]);
  const done = applyMigrations(db, readMigrationsDir(resolve(dirname(flag('--config')), entry.migrations_dir)));
  console.log(done.length ? done.map((n) => n + ' applied').join('\\n') : 'No migrations to apply!');
} else if (c1 === 'd1' && c2 === 'execute') {
  if (!remote) fail('stand-in: --remote only', 2);
  const { db } = d1(a[2]);
  const file = flag('--file');
  if (file) {
    if (!a.includes('--yes')) fail('stand-in: --yes expected with --file', 2);
    if (process.env.FAKE_D1_FAIL_FILE && basename(file).includes(process.env.FAKE_D1_FAIL_FILE)) fail('D1_ERROR: stand-in failure for ' + basename(file));
    const statements = splitStatements(readFileSync(file, 'utf8'));
    for (const s of statements) {
      if (Buffer.byteLength(s) > 100000) fail('D1_ERROR: statement too long: SQLITE_TOOBIG');
      if (/^(INSERT INTO|UPDATE|DELETE FROM)\\s+"?(sqlite_|_cf_|d1_)/i.test(s)) fail('D1_ERROR: not authorized: SQLITE_AUTH');
    }
    db.exec('BEGIN');
    try {
      for (const s of statements) {
        if (process.env.FAKE_D1_IGNORE_DEFER && /^PRAGMA defer_foreign_keys/i.test(s)) continue; // every statement checked on its own
        db.exec(s);
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      fail('D1_ERROR: ' + e.message);
    }
    console.log(JSON.stringify([{ results: [{ 'Total queries executed': statements.length, 'Rows read': 0, 'Rows written': 0 }], success: true }], null, 2));
  } else {
    const out = splitStatements(flag('--command')).map((s) => ({ results: db.prepare(s).all(), success: true, meta: { duration: 0 } }));
    console.log(JSON.stringify(out, null, 2));
  }
  db.close();
} else if (c1 === 'd1' && c2 === 'time-travel' && a[2] === 'info') {
  console.log(JSON.stringify({ bookmark: '00000085-0000024c-00004c6d-standin' }));
} else if (c1 === 'r2' && c2 === 'bucket' && a[2] === 'list') {
  // the shape of wrangler's own listing: labelled values, one block per bucket
  const buckets = ['other-bucket', ...(process.env.FAKE_R2_NO_BUCKET ? [] : ['bizomat-tasks-files'])];
  console.log('Listing buckets...\\n' + buckets.map((b) => 'name:           ' + b + '\\ncreation_date:  2026-11-06T00:00:00.000Z').join('\\n\\n'));
} else if (c1 === 'r2' && c2 === 'object' && (a[2] === 'put' || a[2] === 'get')) {
  if (!remote) fail('stand-in: --remote only', 2);
  const [bucket, ...rest] = a[3].split('/');
  const key = rest.join('/');
  const dir = join(state, 'r2', bucket);
  const body = join(dir, createHash('sha256').update(key).digest('hex'));
  if (a[2] === 'put') {
    mkdirSync(dir, { recursive: true });
    copyFileSync(flag('--file'), body);
    writeFileSync(body + '.json', JSON.stringify({ key, contentType: flag('--content-type') ?? null }));
    console.log('Upload complete.');
  } else {
    if (!existsSync(body)) fail('The specified key does not exist.');
    copyFileSync(body, flag('--file'));
    console.log('Download complete.');
  }
} else fail('stand-in: unknown command ' + a.slice(0, 3).join(' '), 2);
`;

type Run = { code: number; out: string };
const outputs: string[] = [];

/** Runs to-cloudflare.mjs without blocking this process. */
function toCloudflare(args: string[], extraEnv: Record<string, string> = {}, { standIns = true } = {}): Promise<Run> {
  const env: Record<string, string | undefined> = { ...process.env, FLYCTL: join(root, 'fly.cjs'), FAKE_CF: cf, ...extraEnv };
  if (standIns) env.WRANGLER = join(root, 'wrangler.mjs');
  else delete env.WRANGLER;
  return new Promise((done) => {
    execFile(process.execPath, ['scripts/migrate/to-cloudflare.mjs', ...args], { encoding: 'utf8', env, maxBuffer: 64 << 20 }, (err, stdout, stderr) => {
      const r = { code: err ? Number((err as { code?: number }).code ?? 1) : 0, out: `${stdout}${stderr}` };
      outputs.push(r.out);
      done(r);
    });
  });
}

const lines = (file: string): string[][] => (existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

/** Every file under dir with its SHA-256, for "nothing on the Machine changed" (SQLite's -shm and -wal left out). */
function treeHashes(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (!/-(shm|wal)$/.test(e.name)) out[relative(dir, p).split(sep).join('/')] = sha(readFileSync(p));
    }
  };
  walk(dir);
  return out;
}

/** Every row of every data table, exactly (exactRows), in primary-key order. */
function allRows(db: DatabaseSync): Record<string, unknown[]> {
  const out: Record<string, unknown[]> = {};
  for (const t of dataTables(db) as string[]) out[t] = [...(exactRows(db, t, orderClause(db, t)) as Iterable<unknown[]>)];
  return out;
}

function expectSameRows(sourcePath: string, targetPath: string) {
  const a = new DatabaseSync(sourcePath, { readOnly: true });
  const b = new DatabaseSync(targetPath, { readOnly: true });
  try {
    const x = allRows(a);
    const y = allRows(b);
    expect(Object.keys(y).sort()).toEqual(Object.keys(x).sort());
    for (const t of Object.keys(x)) expect(isDeepStrictEqual(y[t], x[t]), `rows of ${t}`).toBe(true);
    // invalid UTF-8 is kept byte for byte (exactRows decodes text, so compare the bytes themselves)
    const hex = (db: DatabaseSync) => (db.prepare("SELECT hex(CAST(value AS BLOB)) AS h FROM system_kv WHERE key = 'invalid-utf8'").get() as { h: string }).h;
    expect(hex(b)).toBe('FF61C3');
    expect(hex(b)).toBe(hex(a));
    expect(Object.values(x).reduce((s, r) => s + r.length, 0)).toBeGreaterThan(40);
  } finally {
    a.close();
    b.close();
  }
}

let source: DatabaseSync;

beforeAll(async () => {
  mkdirSync(cf, { recursive: true });
  writeFileSync(join(root, 'fly.cjs'), FLY);
  chmodSync(join(root, 'fly.cjs'), 0o755);
  writeFileSync(join(root, 'wrangler.mjs'), WRANGLER);
  mkdirSync(join(machine, 'data', 'incoming'), { recursive: true });
  // the source stays open, as the server holds it: committed rows sit in the WAL, which the copy must include
  source = await buildDataFolder(work);
  writeFileSync(join(work, 'server.lock'), JSON.stringify({ pid: 1, host: 'machine', startedAt: 'now' }));
  const old = await buildDataFolder(join(root, 'old'), readMigrationsDir('migrations').filter((m) => m.name < '0005'));
  old.close();
}, 120_000);

afterAll(() => source?.close());

describe('lib/d1-sql.mjs literals', () => {
  it('writes every double, 64-bit integer, text and blob so that SQLite reads back the same value', () => {
    const db = new DatabaseSync(':memory:');
    const buf = new DataView(new ArrayBuffer(8));
    const doubles = [0.1, 1 / 3, 5e-324, -5e-324, 2.2250738585072014e-308, 1.7976931348623157e308, -1.7976931348623157e308, 2 ** 53, 2 ** 53 + 2, 2 ** 60, 1e21, 123456.789, -0, Infinity, -Infinity];
    for (let i = 0; i < 20_000; i++) {
      buf.setUint32(0, randomBytes(4).readUInt32BE());
      buf.setUint32(4, randomBytes(4).readUInt32BE());
      const v = buf.getFloat64(0);
      if (!Number.isNaN(v)) doubles.push(v);
    }
    for (const v of doubles) {
      const lit = literal(v) as string;
      const got = (db.prepare(`SELECT ${lit} AS v, typeof(${lit}) AS t`).get() as { v: number; t: string });
      expect(Object.is(got.v, v), `${v} as ${lit}`).toBe(true);
      expect(got.t).toBe('real');
      expect(lit).toMatch(/^[\x20-\x7e]+$/);
    }
    for (const v of [0n, -1n, 9007199254740993n, 9223372036854775807n, -9223372036854775808n]) {
      const s = db.prepare(`SELECT ${literal(v)} AS v, typeof(${literal(v)}) AS t`);
      s.setReadBigInts(true);
      expect(s.get()).toEqual({ v, t: 'integer' });
    }
    for (const bytes of [Buffer.from(TRICKY), Buffer.from([0xff, 0x61, 0xc3]), Buffer.alloc(0), Buffer.from("it's")]) {
      const lit = literal(new Text(bytes)) as string;
      expect(lit).toMatch(/^[\x20-\x7e]*$/);
      expect((db.prepare(`SELECT hex(CAST(${lit} AS BLOB)) AS h, typeof(${lit}) AS t`).get() as { h: string; t: string })).toEqual({ h: bytes.toString('hex').toUpperCase(), t: 'text' });
    }
    expect((db.prepare(`SELECT hex(${literal(Buffer.from([0, 1, 255]))}) AS h`).get() as { h: string }).h).toBe('0001FF');
    db.close();
  });
});

describe('to-cloudflare.mjs', { timeout: 240_000 }, () => {
  const folder = join(root, 'move');

  it('prepares from the work Machine without changing it: the copy, the files, the counts and the SQL in parts', async () => {
    const before = treeHashes(work);
    const r = await toCloudflare(['prepare', folder, '--part-bytes', '150000']);
    expect(r.code, r.out).toBe(0);
    expect(r.out).toContain('Nothing on Fly changed');
    expect(r.out).toContain('Project Management was running during the copy');
    expect(r.out).toContain('round trip into an empty database');
    expect(r.out).toMatch(/the database refers to 1 file not stored on Fly either \(1 deleted in the app\)/);
    // read only: the Machine's data is as it was, and the copy there is gone
    expect(treeHashes(work)).toEqual(before);
    expect(readdirSync(join(machine, 'data', 'incoming'))).toEqual([]);
    const fly = lines(flyLog);
    expect(fly.every((c) => (c[0] === 'machines' && c[1] === 'list') || (c[0] === 'ssh' && c[1] === 'console'))).toBe(true);
    // the folder
    const prepared = JSON.parse(readFileSync(join(folder, 'prepared.json'), 'utf8'));
    expect(prepared.source).toMatchObject({ kind: 'fly', app: 'bizomat', machine: 'm1' });
    expect(prepared.migrations.at(-1)).toBe(readMigrationsDir('migrations').at(-1)!.name);
    expect(prepared.parts.length).toBeGreaterThanOrEqual(4);
    const order = prepared.tables.map((t: { name: string }) => t.name);
    for (const [child, parent] of [['workspaces', 'users'], ['folders', 'workspaces'], ['boards', 'folders'], ['items', 'groups'], ['attachments', 'users'], ['documents', 'folders']]) expect(order.indexOf(child), `${child} after ${parent}`).toBeGreaterThan(order.indexOf(parent));
    expect(order).not.toContain('d1_migrations');
    for (const p of prepared.parts) {
      const sql = readFileSync(join(folder, p.file), 'utf8');
      expect(sql.startsWith('PRAGMA defer_foreign_keys=TRUE;\n')).toBe(true);
      expect(sql).toMatch(/^[\x0a\x20-\x7e]*$/); // plain ASCII, one statement per line
      for (const line of sql.split('\n')) expect(Buffer.byteLength(line)).toBeLessThan(100_000);
      expect(sql).not.toMatch(/CREATE TABLE|d1_migrations|sqlite_sequence/);
    }
    const all = prepared.parts.map((p: { file: string }) => readFileSync(join(folder, p.file), 'utf8')).join('');
    expect(all).toMatch(/UPDATE "documents" SET "content_json" = "content_json" \|\| CAST\(X'/);
    expect(all).toMatch(/UPDATE "documents" SET "content_json" = "content_json" \|\| '\{"text":"it''s a ''quote''/);
    expect(all).toMatch(/UPDATE "system_kv" SET "value" = CAST\("value" \|\| X'[0-9a-f]+' AS BLOB\)/);
    expect(all).toContain("-9223372036854775808,9223372036854775807");
    expect(all.indexOf("'Folder1AAAAAAAAA'")).toBeLessThan(all.indexOf("'Folder3AAAAAAAAA'"));
    expect(readFileSync(join(folder, 'sql', 'clear.sql'), 'utf8')).toMatch(/DELETE FROM "items";[\s\S]*DELETE FROM "users";/);
    const files = JSON.parse(readFileSync(join(folder, 'files.json'), 'utf8'));
    expect(files.map((f: { key: string }) => f.key).sort()).toEqual(stored.map(([k]) => k).sort());
    for (const f of files) {
      const [, body, http] = stored.find(([k]) => k === f.key)!;
      expect(f).toMatchObject({ size: body.length, sha256: sha(body), httpMetadata: http });
      expect(sha(readFileSync(join(folder, f.file)))).toBe(sha(body));
    }
    const counts = JSON.parse(readFileSync(join(folder, 'counts.json'), 'utf8'));
    expect(counts.users).toMatchObject({ n: 3 });
    expect(counts.items).toMatchObject({ n: 4 });
    const manifest = readFileSync(join(folder, 'MANIFEST.sha256'), 'utf8');
    expect(manifest).toMatch(/^[0-9a-f]{64} {2}snapshot\/db\.sqlite$/m);
    expect(manifest).toMatch(/^[0-9a-f]{64} {2}sql\/part-0001\.sql$/m);
    expect(manifest).toMatch(/^[0-9a-f]{64} {2}migrations\/0005_password_reset_required\.sql$/m);
  });

  it('fetches the copy file by file in base64 when the binary stream arrives damaged', async () => {
    const other = join(root, 'move-base64');
    const r = await toCloudflare(['prepare', other, '--part-bytes', '150000'], { FAKE_FLY_BAD_STREAM: '1' });
    expect(r.code, r.out).toBe(0);
    expect(r.out).toContain('one by one in base64');
    expect(readFileSync(join(other, 'counts.json'), 'utf8')).toBe(readFileSync(join(folder, 'counts.json'), 'utf8'));
    for (const p of JSON.parse(readFileSync(join(folder, 'prepared.json'), 'utf8')).parts) expect(readFileSync(join(other, p.file), 'utf8')).toBe(readFileSync(join(folder, p.file), 'utf8'));
    expect(readdirSync(join(machine, 'data', 'incoming'))).toEqual([]);
  });

  it('never prepares into a folder used before', async () => {
    const r = await toCloudflare(['prepare', folder]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('was used before');
  });

  it('applies: the schema by migrations, the rows by part, the files; every row and file exactly as on Fly', async () => {
    // every statement checked on its own (no deferred foreign keys): parents come first, across parts too
    const r = await toCloudflare(['apply', folder], { FAKE_D1_IGNORE_DEFER: '1' });
    expect(r.code, r.out).toBe(0);
    expect(r.out).toContain('has no rows beyond those the migrations make');
    expect(r.out).toContain('R2 bizomat-tasks-files: 7 of 7 files read back, size and sha256 equal');
    expect(r.out).toMatch(/Done: \d+ rows in \d+ tables in D1 bizomat-tasks-db/);
    expectSameRows(join(work, 'db.sqlite'), join(cf, 'd1', 'bizomat-tasks-db.sqlite'));
    const d1 = new DatabaseSync(join(cf, 'd1', 'bizomat-tasks-db.sqlite'), { readOnly: true });
    expect((d1.prepare('SELECT name FROM d1_migrations ORDER BY id').all() as { name: string }[]).map((m) => m.name)).toEqual(readMigrationsDir('migrations').map((m) => m.name));
    d1.close();
    for (const [key, body, http] of stored) {
      const p = join(cf, 'r2', 'bizomat-tasks-files', keyHash(key));
      expect(sha(readFileSync(p)), key).toBe(sha(body));
      expect(JSON.parse(readFileSync(`${p}.json`, 'utf8'))).toEqual({ key, contentType: http.contentType });
    }
    const calls = lines(wranglerLog);
    const at = (pred: (c: string[]) => boolean) => calls.findIndex(pred);
    const firstPart = at((c) => c[1] === 'execute' && c.includes('--file') && /part-0001/.test(c[c.indexOf('--file') + 1]));
    expect(at((c) => c[0] === 'r2' && c[1] === 'bucket')).toBeLessThan(at((c) => c[1] === 'migrations'));
    expect(at((c) => c[1] === 'migrations')).toBeLessThan(at((c) => c.includes('--file') && /clear\.sql$/.test(c[c.indexOf('--file') + 1])));
    expect(at((c) => c.includes('--file') && /clear\.sql$/.test(c[c.indexOf('--file') + 1]))).toBeLessThan(firstPart);
    expect(firstPart).toBeLessThan(at((c) => c[0] === 'r2' && c[2] === 'put'));
    expect(calls.filter((c) => c[0] === 'd1' && c[1] !== 'time-travel' && !(c.includes('--remote') && (c[2] === 'bizomat-tasks-db' || c[3] === 'bizomat-tasks-db')))).toEqual([]);
    expect(calls.filter((c) => c[0] === 'r2' && c[1] === 'object' && !(c.includes('--remote') && c[3].startsWith('bizomat-tasks-files/')))).toEqual([]);
    expect(calls.some((c) => c[1] === 'time-travel')).toBe(false);
  });

  it('refuses a target that already has rows unless --replace, which records a restore point first', async () => {
    const d1Path = join(cf, 'd1', 'bizomat-tasks-db.sqlite');
    const before = treeHashes(join(cf, 'd1'));
    const r = await toCloudflare(['apply', folder]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('already has data');
    expect(r.out).toContain('Nothing was deleted');
    expect(r.out).toContain('--replace');
    expect(treeHashes(join(cf, 'd1'))[`bizomat-tasks-db.sqlite`]).toBe(before['bizomat-tasks-db.sqlite']);
    writeFileSync(wranglerLog, '');
    const again = await toCloudflare(['apply', folder, '--replace'], { FAKE_D1_IGNORE_DEFER: '1' });
    expect(again.code, again.out).toBe(0);
    expect(again.out).toContain('bookmark 00000085-0000024c-00004c6d-standin');
    expect(again.out).toContain('wrangler d1 time-travel restore bizomat-tasks-db --bookmark=');
    const calls = lines(wranglerLog);
    expect(calls.findIndex((c) => c[1] === 'time-travel')).toBeLessThan(calls.findIndex((c) => c.includes('--file')));
    expectSameRows(join(work, 'db.sqlite'), d1Path);
  });

  it('stops at the first part that fails and says which', async () => {
    writeFileSync(wranglerLog, '');
    const r = await toCloudflare(['apply', folder, '--replace'], { FAKE_D1_FAIL_FILE: 'part-0002' });
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/sql\/part-0002\.sql failed: part 2 of \d+/);
    expect(r.out).toContain('Part 1 is in D1; this one was rolled back');
    const files = lines(wranglerLog).filter((c) => c.includes('--file') && c[1] === 'execute').map((c) => c[c.indexOf('--file') + 1]);
    expect(files.some((f) => f.endsWith('part-0003.sql'))).toBe(false);
    expect(lines(wranglerLog).some((c) => c[0] === 'r2' && c[2] === 'put')).toBe(false);
    // and the next run puts everything right
    const fixed = await toCloudflare(['apply', folder, '--replace']);
    expect(fixed.code, fixed.out).toBe(0);
    expectSameRows(join(work, 'db.sqlite'), join(cf, 'd1', 'bizomat-tasks-db.sqlite'));
  });

  it('refuses a missing bucket before anything in D1 changes', async () => {
    writeFileSync(wranglerLog, '');
    const r = await toCloudflare(['apply', folder, '--replace'], { FAKE_R2_NO_BUCKET: '1' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('the R2 bucket bizomat-tasks-files was not found');
    expect(lines(wranglerLog).some((c) => c[0] === 'd1')).toBe(false);
  });

  it('refuses a folder changed after it was prepared', async () => {
    const part = join(folder, 'sql', 'part-0001.sql');
    const original = readFileSync(part);
    writeFileSync(wranglerLog, '');
    try {
      appendFileSync(part, ' ');
      const changed = await toCloudflare(['apply', folder, '--replace']);
      expect(changed.code).toBe(1);
      expect(changed.out).toContain('the folder changed since it was prepared (1 changed, 0 missing, 0 added; first: sql/part-0001.sql)');
    } finally {
      writeFileSync(part, original);
    }
    writeFileSync(join(folder, 'sql', 'part-9999.sql'), 'DELETE FROM users;\n');
    try {
      const added = await toCloudflare(['apply', folder, '--replace']);
      expect(added.code).toBe(1);
      expect(added.out).toContain('1 added; first: sql/part-9999.sql');
    } finally {
      rmSync(join(folder, 'sql', 'part-9999.sql'));
    }
    expect(lines(wranglerLog)).toEqual([]);
  });

  it('refuses a database that is not at the repository latest migration', async () => {
    const out = join(root, 'move-old');
    const r = await toCloudflare(['prepare', out, '--from-db', join(root, 'old', 'db.sqlite'), '--from-dir', join(root, 'old')]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('the database is at 0004_founder_admin.sql, not at the repository');
    expect(r.out).toContain('0005_password_reset_required.sql');
    expect(existsSync(join(out, 'prepared.json'))).toBe(false);
  });

  it('a rehearsal into the real wrangler: its local D1 (workerd) holds every row exactly, its local R2 every file', async () => {
    const rehearsal = join(root, 'rehearsal');
    const local = join(root, 'wrangler-local');
    const p = await toCloudflare(['prepare', rehearsal, '--from-db', join(work, 'db.sqlite'), '--from-dir', join(work, 'files')]);
    expect(p.code, p.out).toBe(0);
    expect(p.out).toContain('A rehearsal: Fly was not read');
    const r = await toCloudflare(['apply', rehearsal, '--local', local], {}, { standIns: false });
    expect(r.code, r.out).toBe(0);
    expect(r.out).toContain('R2 bizomat-tasks-files: 7 of 7 files read back, size and sha256 equal');
    const d1Dir = join(local, 'v3', 'd1', 'miniflare-D1DatabaseObject');
    const d1File = readdirSync(d1Dir).find((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite')!;
    expectSameRows(join(work, 'db.sqlite'), join(d1Dir, d1File));
    expect(statSync(join(d1Dir, d1File)).size).toBeGreaterThan(0);
  });

  it('never prints row content or keys of files', () => {
    const everything = [...outputs, readFileSync(flyLog, 'utf8'), readFileSync(wranglerLog, 'utf8')].join('\n');
    expect(outputs.length).toBeGreaterThan(8);
    for (const secret of [SECRET_EMAIL, SECRET_HASH, 'Person One', 'Zoë', 'Line one', "it's a 'quote'", 'second.person@example.com']) expect(everything).not.toContain(secret);
    for (const o of outputs) expect(o).not.toContain(keys.pdf);
  });
});
