// scripts/migrate/to-fly.mjs, the owner's `bizomat.ps1 move tasks`: prepare (a rehearsal from a dump in the format of
// `wrangler d1 export` and a folder of objects) and apply against a stand-in for flyctl whose Machine is a folder.
// The stand-in's apply.sh runs restore.sh's own archive checks (safe_tar.py, manifest.py) instead of restore.sh, which
// needs root and the image's users.

import { execFile, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { tempDir } from './helpers.ts';
// @ts-expect-error plain JavaScript module without type declarations
import { exactRows } from '../scripts/migrate/lib/common.mjs';

const MIGRATE = resolve('../../infrastructure/migrate');
const root = tempDir('work-to-fly-');
const machine = join(root, 'machine');
const flyLog = join(root, 'fly.log');
let readyUrl = '';
let server: Server;

/** A dump in the format of `wrangler d1 export` (as test-node/migrate.test.ts writes it), of a database at 0004. */
function d1Dump(): string {
  const db = openDatabase(join(root, 'source.sqlite'), { journal: 'DELETE' });
  applyMigrations(db, readMigrationsDir('migrations').filter((m) => m.name < '0005'));
  const t = 1_790_000_000_000;
  db.prepare("INSERT INTO users (id, email, name, password_hash, avatar_key, created_at, updated_at) VALUES ('User1AAAAAAAAAAA', 'one@example.com', 'One', 'pbkdf2$1$c2FsdA==$aGFzaA==', 'users/User1AAAAAAAAAAA/avatar-A', ?, ?)").run(t, t);
  db.prepare("INSERT INTO workspaces (id, name, created_by, created_at, updated_at) VALUES ('WorkspaceAAAAAAA', 'W', 'User1AAAAAAAAAAA', ?, ?)").run(t, t);
  const lit = (v: unknown) => (v === null ? 'NULL' : typeof v === 'number' || typeof v === 'bigint' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
  const out = ['PRAGMA defer_foreign_keys=TRUE;'];
  for (const tb of db.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all() as { name: string; sql: string }[]) {
    out.push(`${tb.sql};`);
    const cols = (db.prepare(`PRAGMA table_info("${tb.name}")`).all() as { name: string }[]).map((c) => `"${c.name}"`).join(',');
    for (const row of exactRows(db, tb.name, 'rowid') as Iterable<unknown[]>) out.push(`INSERT INTO "${tb.name}" (${cols}) VALUES(${row.map(lit).join(',')});`);
  }
  for (const i of db.prepare("SELECT sql FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL ORDER BY name").all() as { sql: string }[]) out.push(`${i.sql};`);
  db.close();
  return `${out.join('\n')}\n`;
}

/** flyctl's stand-in: one work Machine whose /data is machine/data; ssh commands run here with the paths moved. */
const FLY = `#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { appendFileSync } = require('node:fs');
const a = process.argv.slice(2);
appendFileSync(${JSON.stringify(flyLog)}, JSON.stringify(a) + '\\n');
const data = ${JSON.stringify(join(machine, 'data'))};
if (a[0] === 'machines' && a[1] === 'list') { console.log(JSON.stringify([{ id: 'm1', state: 'started', config: { metadata: { fly_process_group: 'work' } } }, { id: 'w1', state: 'started', config: { metadata: { fly_process_group: 'web' } } }])); process.exit(0); }
if (a[0] === 'machine') process.exit(0);
if (a[0] === 'ssh' && a[1] === 'console') {
  let cmd = a[a.indexOf('--command') + 1].split('/data/').join(data + '/');
  const apply = cmd.match(/^bash \\/usr\\/local\\/lib\\/bizomat\\/migrate\\/work\\/apply\\.sh (\\S+)$/);
  if (apply) {
    if (process.env.FAKE_APPLY_FAIL) process.exit(3);
    const stage = data + '/.check-' + Date.now();
    cmd = 'mkdir -m 700 ' + stage + ' && python3 ${MIGRATE}/lib/safe_tar.py extract ' + apply[1] + ' ' + stage + ' && python3 ${MIGRATE}/lib/manifest.py check ' + stage + ' && echo applied';
  }
  process.exit(spawnSync('sh', ['-c', cmd], { stdio: 'inherit' }).status ?? 1);
}
process.exit(2);
`;

/** Runs to-fly.mjs without blocking this process, whose HTTP server stands in for the router's /__proxy/ready. */
function toFly(args: string[], extraEnv: Record<string, string> = {}): Promise<{ code: number; out: string }> {
  const env = { ...process.env, FLYCTL: join(root, 'fly.cjs'), BIZOMAT_READY_URL: readyUrl, ...extraEnv };
  return new Promise((done) => {
    execFile(process.execPath, ['scripts/migrate/to-fly.mjs', ...args], { encoding: 'utf8', env, maxBuffer: 16 << 20 }, (err, stdout, stderr) => {
      done({ code: err ? Number((err as { code?: number }).code ?? 1) : 0, out: `${stdout}${stderr}` });
    });
  });
}
const calls = (): string[][] => (existsSync(flyLog) ? readFileSync(flyLog, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : []);
const sshCommands = () => calls().filter((c) => c[0] === 'ssh').map((c) => c[c.indexOf('--command') + 1]);

beforeAll(async () => {
  writeFileSync(join(root, 'dump.sql'), d1Dump());
  mkdirSync(join(root, 'objects', 'users', 'User1AAAAAAAAAAA'), { recursive: true });
  writeFileSync(join(root, 'objects', 'users', 'User1AAAAAAAAAAA', 'avatar-A'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2]));
  writeFileSync(join(root, 'fly.cjs'), FLY);
  chmodSync(join(root, 'fly.cjs'), 0o755);
  mkdirSync(join(machine, 'data', 'work'), { recursive: true });
  server = createServer((_q, s) => { s.setHeader('content-type', 'application/json'); s.end('{"ok":true,"upstreams":{"work":{"ok":true}}}'); });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const addr = server.address();
  readyUrl = `http://127.0.0.1:${typeof addr === 'object' && addr ? addr.port : 0}/__proxy/ready`;
});
afterAll(() => new Promise<void>((r) => server.close(() => r())));

describe('to-fly.mjs', { timeout: 120_000 }, () => {
  const folder = join(root, 'move');

  it('prepares an archive in the layout of pack.sh that restore.sh accepts', async () => {
    const r = await toFly(['prepare', folder, '--from-dump', join(root, 'dump.sql'), '--from-dir', join(root, 'objects')]);
    expect(r.code, r.out).toBe(0);
    expect(r.out).toContain('Nothing on Fly changed');
    const info = JSON.parse(readFileSync(join(folder, 'archive.json'), 'utf8'));
    expect(info.name).toMatch(/^work-\d{8}-\d{6}\.tar$/);
    const stage = join(root, 'check');
    mkdirSync(stage, { mode: 0o700 });
    const extract = spawnSync('python3', [join(MIGRATE, 'lib/safe_tar.py'), 'extract', join(folder, info.name), stage], { encoding: 'utf8' });
    expect(extract.status, extract.stderr).toBe(0);
    const check = spawnSync('python3', [join(MIGRATE, 'lib/manifest.py'), 'check', stage], { encoding: 'utf8' });
    expect(check.status, `${check.stdout}${check.stderr}`).toBe(0);
    expect(existsSync(join(stage, 'data', 'db.sqlite'))).toBe(true);
    expect(readFileSync(join(stage, 'MANIFEST.sha256'), 'utf8')).toMatch(/^[0-9a-f]{64} {2}data\/db\.sqlite$/m);
    // no data on screen: counts and names only
    expect(r.out).not.toContain('one@example.com');
  });

  it('never prepares into a folder used before', async () => {
    expect((await toFly(['prepare', folder, '--from-dump', join(root, 'dump.sql'), '--from-dir', join(root, 'objects')])).out).toContain('was used before');
  });

  it('uploads, checks the sha256 on the Machine, applies in maintenance and ends maintenance', async () => {
    const r = await toFly(['apply', folder]);
    expect(r.code, r.out).toBe(0);
    const info = JSON.parse(readFileSync(join(folder, 'archive.json'), 'utf8'));
    const cmds = sshCommands();
    const at = (s: string) => cmds.findIndex((c) => c.includes(s));
    expect(at('cat > /data/incoming/')).toBeGreaterThan(-1);
    expect(at('sha256sum')).toBeGreaterThan(at('cat > '));
    expect(at(`touch /data/.bizomat-maintenance`)).toBeGreaterThan(at('sha256sum'));
    expect(at('migrate/work/apply.sh')).toBeGreaterThan(at('touch /data/.bizomat-maintenance'));
    expect(at('rm -f /data/.bizomat-maintenance')).toBeGreaterThan(at('migrate/work/apply.sh'));
    expect(calls().filter((c) => c[0] === 'machine' && c[1] === 'restart')).toHaveLength(2);
    expect(r.out).toContain('applied');
    expect(r.out).toContain('Project Management answers on Fly');
    expect(existsSync(join(machine, 'data', 'incoming', info.name))).toBe(true);
    expect(existsSync(join(machine, 'data', '.bizomat-maintenance'))).toBe(false);
  });

  it('ends maintenance even when applying fails', async () => {
    writeFileSync(flyLog, '');
    const r = await toFly(['apply', folder], { FAKE_APPLY_FAIL: '1' });
    expect(r.code).toBe(1);
    expect(sshCommands().at(-1)).toBe('rm -f /data/.bizomat-maintenance');
    expect(existsSync(join(machine, 'data', '.bizomat-maintenance'))).toBe(false);
  });

  it('refuses an archive changed after it was prepared', async () => {
    const info = JSON.parse(readFileSync(join(folder, 'archive.json'), 'utf8'));
    appendFileSync(join(folder, info.name), 'x');
    const r = await toFly(['apply', folder]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('the archive changed since it was prepared');
  });
});
