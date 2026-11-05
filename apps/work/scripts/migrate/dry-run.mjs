#!/usr/bin/env node
// Dry run of the Cloudflare -> Node migration, end to end, with synthetic data.
//
//   node scripts/migrate/dry-run.mjs [--report <file.md>] [--keep]
//
//  1. A disposable Cloudflare environment: `wrangler dev --local` (Miniflare's
//     D1, R2, KV and Durable Objects) with its own config and state in
//     .data/dry-run/<run>/ (git-ignored).
//  2. Synthetic data through the real API: 4 users with passwords, 2 shared
//     workspaces with roles, boards, groups, items, subitems, column values,
//     comments with mentions and replies, attachments (real R2 objects), an
//     avatar and a logo, a document with versions and comments, notifications,
//     an automation with a run, a dashboard, time entries.
//  3. Snapshots of what each user sees through the API, and the bytes of every
//     file. The source is stopped and exported with `wrangler d1 export --local`.
//  4. import-d1-dump.mjs, copy-r2-objects.mjs (from wrangler, and again from a
//     folder of downloaded objects into a second data dir), verify-data-dir.mjs;
//     import and copy run twice to show they are idempotent.
//  5. The Node server (dist/node/server.mjs) on the imported data: every user
//     signs in with the ORIGINAL password and must see the same API responses
//     and file bytes; an outsider must be refused; realtime must work.
//  6. Rollback: export-for-d1.mjs, loaded into a fresh local D1 with
//     `wrangler d1 execute`, objects uploaded to its R2, exported again and
//     re-imported: the checksums must equal the migrated data.
// A Markdown report (counts and results only) is written to --report
// (default docs/migration/dry-run-<date>.md). Exit code 0 when every check passes.

import { execFile, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { crc32, deflateSync } from 'node:zlib';
import { DatabaseSync } from '../../src/node/store/sqlite.ts';
import { APP_ROOT, parseArgs, referencedObjects, tableChecksums } from './lib/common.mjs';

const runFile = promisify(execFile);
const WRANGLER = join(APP_ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const SCRIPTS = join(APP_ROOT, 'scripts', 'migrate');
const today = new Date().toISOString().slice(0, 10);
const { flags } = parseArgs(process.argv.slice(2), { booleans: ['keep'], strings: ['report'] });
const reportFile = resolve(APP_ROOT, flags.report ?? `docs/migration/dry-run-${today}.md`);
const RUN = join(APP_ROOT, '.data', 'dry-run', new Date().toISOString().replace(/[:.]/g, '-'));
const P = {
  source: join(RUN, 'source'),
  dump: join(RUN, 'd1-export.sql'),
  data: join(RUN, 'work-data'),
  dataFromDir: join(RUN, 'work-data-from-folder'),
  objects: join(RUN, 'r2-objects'),
  rollbackSql: join(RUN, 'rollback.sql'),
  rollbackFiles: join(RUN, 'rollback-files'),
  rollback: join(RUN, 'rollback-d1'),
  rollbackDump: join(RUN, 'rollback-d1-export.sql'),
  dataRoundTrip: join(RUN, 'work-data-round-trip'),
};
const env = { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1' };

const steps = [];
const checks = [];
const children = new Set();
let failed = false;

function check(area, name, ok, detail = '') {
  checks.push({ area, name, ok: !!ok, detail });
  if (!ok) failed = true;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${area}: ${name}${detail ? ` (${detail})` : ''}`);
}

async function step(name, fn) {
  const t = Date.now();
  console.log(`\n== ${name}`);
  try {
    const r = await fn();
    steps.push({ name, ms: Date.now() - t, ok: true });
    return r;
  } catch (e) {
    steps.push({ name, ms: Date.now() - t, ok: false, error: e.message });
    throw e;
  }
}

async function node(script, args, { allowFail = false } = {}) {
  try {
    const r = await runFile(process.execPath, [join(SCRIPTS, script), ...args], { cwd: APP_ROOT, env, maxBuffer: 32 * 1024 * 1024 });
    process.stdout.write(r.stdout.replace(/^/gm, '    '));
    return { code: 0, stdout: r.stdout };
  } catch (e) {
    process.stdout.write(`${e.stdout ?? ''}${e.stderr ?? ''}`.replace(/^/gm, '    '));
    if (!allowFail) throw new Error(`${script} exited with ${e.code}`, { cause: e });
    return { code: e.code, stdout: e.stdout ?? '' };
  }
}

async function wrangler(args) {
  const r = await runFile(process.execPath, [WRANGLER, ...args], { cwd: APP_ROOT, env, maxBuffer: 32 * 1024 * 1024 });
  return r.stdout;
}

function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
    s.on('error', rej);
  });
}

function start(cmd, args, extraEnv, logFile) {
  const child = spawn(cmd, args, { cwd: APP_ROOT, env: { ...env, ...extraEnv }, stdio: ['ignore', 'pipe', 'pipe'] });
  const log = [];
  child.stdout.on('data', (d) => log.push(d));
  child.stderr.on('data', (d) => log.push(d));
  child.on('exit', () => writeFileSync(logFile, Buffer.concat(log)));
  children.add(child);
  child.once('exit', () => children.delete(child));
  return child;
}

async function stop(child) {
  if (child.exitCode !== null) return child.exitCode;
  const done = new Promise((r) => child.once('exit', (code, signal) => r(code ?? signal)));
  child.kill('SIGTERM');
  const t = setTimeout(() => child.kill('SIGKILL'), 20_000);
  const code = await done;
  clearTimeout(t);
  return code;
}

async function waitHealthy(base, child, ms = 120_000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    if (child.exitCode !== null) throw new Error(`process exited with ${child.exitCode}`);
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`${base} did not become healthy`);
}

function sourceConfig(name, port) {
  const cfg = JSON.parse(readFileSync(join(RUN, 'base-config.json'), 'utf8'));
  return {
    name: `workos-dry-run-${name}`,
    main: join(APP_ROOT, 'src/worker/index.ts'),
    compatibility_date: cfg.compatibility_date,
    compatibility_flags: cfg.compatibility_flags,
    assets: { directory: join(APP_ROOT, 'dist/client'), binding: 'ASSETS', not_found_handling: 'single-page-application', run_worker_first: true },
    vars: { ...cfg.vars, ENVIRONMENT: 'development', APP_URL: `http://localhost:${port}`, ALLOW_SIGNUP: 'true' },
    d1_databases: [{ binding: 'DB', database_name: `workos-dry-run-${name}-db`, database_id: '00000000-0000-0000-0000-0000000000d1', migrations_dir: join(APP_ROOT, 'migrations') }],
    r2_buckets: [{ binding: 'FILES', bucket_name: `workos-dry-run-${name}-files` }],
    kv_namespaces: [{ binding: 'CACHE', id: '000000000000000000000000000000d1' }],
    durable_objects: { bindings: [{ name: 'BOARD_ROOMS', class_name: 'BoardRoom' }] },
    migrations: [{ tag: 'v1', new_sqlite_classes: ['BoardRoom'] }],
  };
}

// --------------------------------------------------------------- test data

function png(w, h, rgb) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr.set([8, 2, 0, 0, 0], 8);
  const rows = [];
  for (let y = 0; y < h; y++) rows.push(Buffer.from([0, ...Array.from({ length: w }, (_, x) => [rgb[0] ^ x, rgb[1] ^ y, rgb[2]]).flat()]));
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.concat(rows))), chunk('IEND', Buffer.alloc(0))]);
}
const PDF = Buffer.from('%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kids [] /Count 0 >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF\n');
const sha = (b) => createHash('sha256').update(b).digest('hex');

class Client {
  constructor(base, name) {
    this.base = base;
    this.name = name;
    this.cookie = '';
    this.csrf = '';
  }
  async req(method, path, body, headers = {}) {
    const h = { Origin: this.base, ...headers };
    if (this.cookie) h.Cookie = this.cookie;
    if (this.csrf) h['X-CSRF-Token'] = this.csrf;
    let payload = body;
    if (body !== undefined && !(body instanceof FormData)) {
      h['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    return fetch(`${this.base}${path}`, { method, headers: h, body: payload, redirect: 'manual' });
  }
  async json(method, path, body) {
    const res = await this.req(method, path, body);
    const text = await res.text();
    if (!res.ok) throw new Error(`${this.name} ${method} ${path} -> ${res.status}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
  }
  adopt(res, data) {
    this.cookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).filter((c) => c.includes('workos_sid=')).join('; ');
    this.csrf = data.csrfToken;
    this.userId = data.user.id;
    this.workspaceId = data.workspaces[0]?.id;
  }
  async signup(name, email, password) {
    const res = await this.req('POST', '/api/auth/signup', { name, email, password });
    const data = await res.json();
    if (res.status !== 201) throw new Error(`signup ${res.status}`);
    this.adopt(res, data);
  }
  async login(email, password) {
    const res = await this.req('POST', '/api/auth/login', { email, password });
    const data = await res.json().catch(() => ({}));
    if (res.status === 200) this.adopt(res, data);
    return res.status;
  }
}

const USERS = [
  { key: 'ada', name: 'Ada Example', email: 'ada.dry-run@example.com', password: 'Dry-run-password-ada-1' },
  { key: 'ben', name: 'Ben Example', email: 'ben.dry-run@example.com', password: 'Dry-run-password-ben-2' },
  { key: 'cleo', name: 'Cleo Example', email: 'cleo.dry-run@example.com', password: 'Dry-run-password-cleo-3' },
  { key: 'dan', name: 'Dan Outsider', email: 'dan.dry-run@example.com', password: 'Dry-run-password-dan-4' },
];

async function invite(owner, member, role, ws) {
  const inv = await owner.json('POST', `/api/workspaces/${ws}/invitations`, { email: USERS.find((u) => u.key === member.name).email, role });
  await member.json('POST', `/api/auth/invitations/${inv.inviteUrl.split('/invite/')[1]}/accept`, {});
}

async function upload(c, fields, name, bytes, type) {
  const form = new FormData();
  form.set('file', new File([bytes], name, { type }));
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return c.json('POST', '/api/files', form);
}

async function seed(base) {
  const u = Object.fromEntries(USERS.map((x) => [x.key, new Client(base, x.key)]));
  for (const x of USERS) await u[x.key].signup(x.name, x.email, x.password);
  const { ada, ben, cleo, dan } = u;
  const w1 = ada.workspaceId;
  const w2 = ben.workspaceId;
  await ada.json('PATCH', `/api/workspaces/${w1}`, { name: 'Acme Projects' });
  await ben.json('PATCH', `/api/workspaces/${w2}`, { name: 'Beta Operations' });
  await invite(ada, ben, 'admin', w1);
  await invite(ada, cleo, 'viewer', w1);
  await invite(ben, ada, 'member', w2);

  const board = await ada.json('POST', `/api/workspaces/${w1}/boards`, { name: 'Launch plan' });
  const b = await ada.json('GET', `/api/boards/${board.id}`);
  const [person, status, due] = b.columns;
  const backlog = await ada.json('POST', `/api/boards/${board.id}/groups`, { name: 'Backlog', position: 'bottom' });
  const completed = await ada.json('POST', `/api/boards/${board.id}/columns`, { title: 'Completed on', type: 'date' });
  await ada.json('POST', `/api/boards/${board.id}/automations`, {
    name: 'Stamp completion',
    trigger: { type: 'status_changed', columnId: status.id, to: 'done' },
    actions: [{ type: 'set_date_today', columnId: completed.id }],
  });
  const brief = await ada.json('POST', `/api/boards/${board.id}/items`, { name: 'Write launch brief', values: { [person.id]: ben.userId, [status.id]: 'working', [due.id]: '2026-12-01' } });
  const review = await ada.json('POST', `/api/boards/${board.id}/items`, { name: 'Design review', groupId: backlog.id, values: { [person.id]: ada.userId } });
  const ship = await ben.json('POST', `/api/boards/${board.id}/items`, { name: 'Ship it', values: { [status.id]: 'working' } });
  await ben.json('PATCH', `/api/items/${ship.id}`, { values: { [status.id]: 'done' } });
  await ada.json('POST', `/api/boards/${board.id}/items`, { name: 'Draft outline', parentItemId: brief.id });
  await ada.json('POST', `/api/boards/${board.id}/items`, { name: 'Collect quotes', parentItemId: brief.id });
  const note = await ada.json('POST', `/api/items/${brief.id}/updates`, { body: `Kick-off notes for @[Ben Example](user:${ben.userId}): first draft by Friday.` });
  await ben.json('POST', `/api/items/${brief.id}/updates`, { body: 'Noted, on it.', parentUpdateId: note.id });
  await ben.json('POST', `/api/items/${review.id}/updates`, { body: 'Review slots booked; "quotes" and; semicolons; kept.' });
  // Two lines, one of them quoting a backslash-n: the text the D1 export format cannot keep (see repair-text-from-d1.mjs).
  await ben.json('POST', `/api/items/${review.id}/updates`, { body: 'Template line uses printf("%s\\n", name);\nSecond line of the comment.' });
  await ada.json('POST', `/api/items/${brief.id}/time`, { minutes: 45, date: '2026-11-04' });
  await ben.json('POST', `/api/items/${brief.id}/time`, { minutes: 30, date: '2026-11-05' });
  const files = {};
  files.brief = await upload(ada, { scope: 'item', itemId: brief.id }, 'brief.png', png(24, 16, [200, 80, 40]), 'image/png');
  files.spec = await upload(ben, { scope: 'item', itemId: review.id }, 'spec.pdf', PDF, 'application/pdf');
  files.gone = await upload(ada, { scope: 'item', itemId: review.id }, 'old.png', png(4, 4, [1, 2, 3]), 'image/png');
  await ada.json('DELETE', `/api/files/${files.gone.id}`, {});
  await upload(ada, { scope: 'avatar' }, 'ada.png', png(32, 32, [10, 120, 200]), 'image/png');
  await upload(ada, { scope: 'logo', workspaceId: w1 }, 'logo.png', png(48, 48, [20, 160, 140]), 'image/png');

  const para = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] });
  const doc = await ada.json('POST', `/api/workspaces/${w1}/documents`, { title: 'Launch notes', content: { type: 'doc', content: [para('Goals for the launch.')] } });
  await ada.json('PATCH', `/api/documents/${doc.id}`, { content: { type: 'doc', content: [para('Goals for the launch.'), para('Risks and owners.')] }, baseVersion: 1 });
  await ada.json('PATCH', `/api/documents/${doc.id}`, { title: 'Launch notes v2', content: { type: 'doc', content: [para('Goals.'), para('Risks.'), para('Dates.')] }, baseVersion: 2, snapshot: true });
  const comment = await ben.json('POST', `/api/documents/${doc.id}/comments`, { body: `Looks good @[Ada Example](user:${ada.userId})` });
  await ada.json('POST', `/api/documents/${doc.id}/comments`, { body: 'Thanks.', parentId: comment.id });
  const dash = await ada.json('POST', `/api/workspaces/${w1}/dashboards`, { name: 'Launch overview', boardIds: [board.id] });
  await ada.json('POST', `/api/dashboards/${dash.id}/widgets`, { type: 'number', title: 'Open items' });

  const ops = await ben.json('POST', `/api/workspaces/${w2}/boards`, { name: 'Ops backlog' });
  const restock = await ben.json('POST', `/api/boards/${ops.id}/items`, { name: 'Restock spares' });
  await ben.json('POST', `/api/boards/${ops.id}/items`, { name: 'Rotate keys' });
  await ada.json('POST', `/api/items/${restock.id}/updates`, { body: 'I can take this.' });
  await dan.json('POST', `/api/workspaces/${dan.workspaceId}/boards`, { name: 'Private plans' });
  return { u, w1, w2, board: board.id, ops: ops.id, items: [brief.id, review.id, ship.id, restock.id], doc: doc.id, dash: dash.id, files };
}

/** What a user sees: GET responses, with fields that change on every sign-in left out. */
const VOLATILE = new Set(['csrfToken', 'lastLoginAt', 'lastActiveAt', 'lastSeenAt', 'lastActivityAt', 'loginCount', 'time', 'computedAt', 'generatedAt']);
function normalize(v) {
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([k]) => !VOLATILE.has(k)).map(([k, x]) => [k, normalize(x)]));
  return v;
}

async function snapshot(c, ids) {
  const s = {};
  const get = async (path) => {
    const res = await c.req('GET', path);
    s[path] = res.ok ? normalize(await res.json()) : { status: res.status };
  };
  await get('/api/auth/me');
  await get('/api/workspaces');
  for (const ws of [ids.w1, ids.w2]) {
    for (const p of ['boards', 'members', 'documents', 'dashboards']) await get(`/api/workspaces/${ws}/${p}`);
    await get(`/api/notifications?workspaceId=${ws}`);
  }
  for (const board of [ids.board, ids.ops]) {
    await get(`/api/boards/${board}`);
    await get(`/api/boards/${board}/files`);
    await get(`/api/boards/${board}/automations`);
  }
  for (const item of ids.items) {
    await get(`/api/items/${item}`);
    await get(`/api/items/${item}/updates`);
  }
  await get(`/api/documents/${ids.doc}`);
  await get(`/api/documents/${ids.doc}/versions`);
  await get(`/api/documents/${ids.doc}/comments`);
  await get(`/api/dashboards/${ids.dash}`);
  const auto = s[`/api/boards/${ids.board}/automations`];
  if (Array.isArray(auto)) for (const a of auto) await get(`/api/automations/${a.id}/runs`);
  return s;
}

async function fileHashes(c, ids) {
  const out = {};
  for (const [name, f] of Object.entries(ids.files)) {
    const r = await c.req('GET', `/api/files/${f.id}`);
    out[name] = r.ok ? sha(Buffer.from(await r.arrayBuffer())) : `status ${r.status}`;
  }
  for (const [name, path] of [['avatar', `/api/users/${ids.u.ada.userId}/avatar`], ['logo', `/api/workspaces/${ids.w1}/logo`]]) {
    const r = await c.req('GET', path);
    out[name] = r.ok ? sha(Buffer.from(await r.arrayBuffer())) : `status ${r.status}`;
  }
  return out;
}

async function isolation(dan, ids) {
  const paths = [`/api/workspaces/${ids.w1}`, `/api/workspaces/${ids.w1}/boards`, `/api/boards/${ids.board}`, `/api/items/${ids.items[0]}`, `/api/items/${ids.items[0]}/updates`, `/api/files/${ids.files.brief.id}`, `/api/documents/${ids.doc}`, `/api/dashboards/${ids.dash}`, `/api/users/${ids.u.ada.userId}/avatar`, `/api/workspaces/${ids.w1}/logo`];
  const out = {};
  for (const p of paths) out[p] = (await dan.req('GET', p)).status;
  return out;
}

/** How many snapshot responses carry data (an error response is just { status }). */
function withData(api) {
  return Object.values(api).filter((v) => !(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 1 && 'status' in v)).length;
}

function diffKeys(a, b) {
  return Object.keys({ ...a, ...b }).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
}

function countRows(dataDir) {
  const db = new DatabaseSync(join(dataDir, 'db.sqlite'), { readOnly: true });
  const c = tableChecksums(db);
  db.close();
  return c;
}

// --------------------------------------------------------------------- run

async function main() {
  mkdirSync(RUN, { recursive: true });
  const started = Date.now();
  const sourcePort = await freePort();
  const nodePort = await freePort();
  const facts = {};

  await step('Build the client and the Node bundle', async () => {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    if (!existsSync(join(APP_ROOT, 'dist/client/index.html')) || readFileSync(join(APP_ROOT, 'dist/client/index.html'), 'utf8').length < 200) await runFile(npm, ['run', 'build:client'], { cwd: APP_ROOT, env });
    await runFile(npm, ['run', 'build:node'], { cwd: APP_ROOT, env });
    const { unstable_readConfig } = await import('wrangler');
    const base = unstable_readConfig({ config: join(APP_ROOT, 'wrangler.jsonc') });
    writeFileSync(join(RUN, 'base-config.json'), JSON.stringify({ compatibility_date: base.compatibility_date, compatibility_flags: base.compatibility_flags, vars: base.vars }));
    facts.node = process.version;
    facts.wrangler = `wrangler ${(await wrangler(['--version'])).trim().split('\n').pop()}`;
  });

  const ids = await step('Cloudflare source: wrangler dev --local with D1, R2, KV and Durable Objects', async () => {
    mkdirSync(P.source, { recursive: true });
    writeFileSync(join(P.source, 'wrangler.json'), JSON.stringify(sourceConfig('source', sourcePort), null, 2));
    await wrangler(['d1', 'migrations', 'apply', 'DB', '--local', '--config', join(P.source, 'wrangler.json')]);
    const dev = start(process.execPath, [WRANGLER, 'dev', '--local', '--config', join(P.source, 'wrangler.json'), '--ip', '127.0.0.1', '--port', String(sourcePort), '--inspector-port', String(await freePort()), '--show-interactive-dev-session=false'], {}, join(RUN, 'wrangler-dev.log'));
    const base = `http://127.0.0.1:${sourcePort}`;
    await waitHealthy(base, dev);
    const data = await seed(base);
    data.dev = dev;
    data.base = base;
    return data;
  });

  const before = await step('Snapshot what every user sees on the source', async () => {
    const s = {};
    for (const x of USERS) s[x.key] = { api: await snapshot(ids.u[x.key], ids), files: await fileHashes(ids.u[x.key], ids) };
    s.isolation = await isolation(ids.u.dan, ids);
    for (const k of ['ada', 'ben']) check('source', `${USERS.find((x) => x.key === k).name}: all ${Object.keys(s[k].api).length} snapshot responses carry data`, withData(s[k].api) === Object.keys(s[k].api).length);
    check('source', 'Cleo (viewer of one workspace) sees it and is refused the other', withData(s.cleo.api) > 10 && withData(s.cleo.api) < Object.keys(s.cleo.api).length, `${withData(s.cleo.api)} of ${Object.keys(s.cleo.api).length}`);
    const ws = new Set(s.ada.api['/api/workspaces'].map((w) => w.id));
    check('source', 'Ada sees both shared workspaces', ws.has(ids.w1) && ws.has(ids.w2));
    check('source', 'deleted attachment is gone', s.ada.files.gone === 'status 404');
    check('source', 'outsider is refused everywhere', Object.values(s.isolation).every((st) => st === 404 || st === 403), JSON.stringify(Object.values(s.isolation)));
    facts.adaSourceCookie = ids.u.ada.cookie;
    return s;
  });

  await step('Stop the source and export D1 (wrangler d1 export --local)', async () => {
    const code = await stop(ids.dev);
    facts.sourceStopped = code;
    await wrangler(['d1', 'export', 'DB', '--local', '--config', join(P.source, 'wrangler.json'), '--output', P.dump]);
    facts.dumpBytes = readFileSync(P.dump).length;
    check('export', 'dump written', facts.dumpBytes > 0, `${facts.dumpBytes} bytes`);
  });

  await step('Import the dump (import-d1-dump.mjs), twice', async () => {
    const first = await node('import-d1-dump.mjs', [P.dump, P.data]);
    check('import', 'first import succeeds', first.code === 0);
    const refused = await node('import-d1-dump.mjs', [P.dump, P.data], { allowFail: true });
    check('import', 'refuses to overwrite db.sqlite without --replace', refused.code === 2);
    const report1 = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).import;
    const second = await node('import-d1-dump.mjs', [P.dump, P.data, '--replace']);
    const report2 = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).import;
    check('import', 'second import with --replace succeeds and keeps a copy', second.code === 0 && !!report2.backup);
    check('import', 'idempotent: identical per-table checksums', report2.previousRun?.identical === true);
    facts.importReport = report2;
    facts.tablesFirst = report1.tables;
  });

  await step('Check multi-line text against D1 (repair-text-from-d1.mjs)', async () => {
    const r = await node('repair-text-from-d1.mjs', [P.data, '--local', '--wrangler-config', join(P.source, 'wrangler.json')], { allowFail: true });
    const t = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).textRepair;
    check('text', `the D1 export changed text with a backslash-n; repaired from D1 (${t.repaired.map((x) => `${x.table}.${x.column}`).join(', ')})`, r.code === 0 && t.repaired.length >= 1 && t.unexpected.length === 0, `${t.checked.values} values compared`);
    const again = await node('repair-text-from-d1.mjs', [P.data, '--local', '--wrangler-config', join(P.source, 'wrangler.json')], { allowFail: true });
    check('text', 'a second check finds nothing left to repair', again.code === 0 && JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).textRepair.repaired.length === 0);
    facts.textRepair = t;
  });

  await step('Copy R2 objects (copy-r2-objects.mjs from wrangler --local), twice; verify', async () => {
    const cfg = join(P.source, 'wrangler.json');
    const bucket = `workos-dry-run-source-files`;
    const first = await node('copy-r2-objects.mjs', [P.data, '--bucket', bucket, '--local', '--wrangler-config', cfg]);
    const files1 = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).files;
    check('files', 'copy from R2 succeeds', first.code === 0, `${files1.copied} copied, ${files1.verified} verified`);
    check('files', 'deleted attachment reported as expected-missing only', files1.missing.length === 1 && files1.missing[0].note.startsWith('expected'));
    await node('copy-r2-objects.mjs', [P.data, '--bucket', bucket, '--local', '--wrangler-config', cfg]);
    const files2 = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).files;
    check('files', 'idempotent: second copy changes nothing', files2.copied === 0 && files2.alreadyPresent === files1.copied + files1.alreadyPresent);
    facts.files = files1;
    const verify = await node('verify-data-dir.mjs', [P.data], { allowFail: true });
    check('verify', 'verify-data-dir passes', verify.code === 0);
    facts.verify = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).verify;
  });

  await step('Second data dir from a folder of downloaded objects (--from-dir)', async () => {
    const db = new DatabaseSync(join(P.data, 'db.sqlite'), { readOnly: true });
    const refs = referencedObjects(db).filter((r) => !r.deleted);
    db.close();
    for (const r of refs) {
      const file = join(P.objects, ...r.key.split('/'));
      mkdirSync(join(file, '..'), { recursive: true });
      await wrangler(['r2', 'object', 'get', `workos-dry-run-source-files/${r.key}`, '--local', '--config', join(P.source, 'wrangler.json'), '--file', file]);
    }
    await node('import-d1-dump.mjs', [P.dump, P.dataFromDir]);
    await node('repair-text-from-d1.mjs', [P.dataFromDir, '--local', '--wrangler-config', join(P.source, 'wrangler.json')]);
    const copy = await node('copy-r2-objects.mjs', [P.dataFromDir, '--from-dir', P.objects]);
    check('files', 'copy from a folder succeeds', copy.code === 0);
    check('verify', 'verify-data-dir passes for the second data dir', (await node('verify-data-dir.mjs', [P.dataFromDir], { allowFail: true })).code === 0);
    const a = countRows(P.data);
    const b = countRows(P.dataFromDir);
    check('import', 'both data dirs have identical database checksums', diffKeys(a, b).length === 0);
    const objA = JSON.parse(readFileSync(join(P.data, 'migration-report.json'), 'utf8')).verify.files;
    const objB = JSON.parse(readFileSync(join(P.dataFromDir, 'migration-report.json'), 'utf8')).verify.files;
    check('files', 'both sources give the same verified objects', objA.checked === objB.checked && objB.missing === 0 && objB.mismatched === 0, `${objB.checked} objects`);
  });

  const after = await step('Node server on the migrated data: sign in with original passwords, compare', async () => {
    const server = start(process.execPath, [join(APP_ROOT, 'dist/node/server.mjs')], {
      PORT: String(nodePort),
      HOST: '127.0.0.1',
      WORK_DATA_DIR: P.data,
      WORK_STATIC_DIR: join(APP_ROOT, 'dist/client'),
      APP_URL: `http://localhost:${nodePort}`,
      ENVIRONMENT: 'development',
      ALLOW_SIGNUP: 'false',
      WORK_CRON: '0',
      WORK_VERSION: 'dry-run',
    }, join(RUN, 'node-server.log'));
    const base = `http://127.0.0.1:${nodePort}`;
    await waitHealthy(base, server, 30_000);
    const out = {};
    const clients = {};
    for (const x of USERS) {
      const c = new Client(base, x.key);
      check('sign-in', `${x.name}: wrong password refused`, (await c.login(x.email, `${x.password}-wrong`)) === 401);
      const status = await c.login(x.email, x.password);
      check('sign-in', `${x.name}: original password accepted (PBKDF2 hash unchanged)`, status === 200);
      clients[x.key] = c;
    }
    const remap = { ...ids, u: clients };
    for (const x of USERS) {
      const api = await snapshot(clients[x.key], remap);
      const files = await fileHashes(clients[x.key], remap);
      const d = diffKeys(before[x.key].api, api);
      check('same data', `${x.name}: ${Object.keys(api).length} API responses identical to the source (${withData(api)} with data)`, d.length === 0, d.slice(0, 5).join(', '));
      check('same data', `${x.name}: file downloads identical (sha256)`, diffKeys(before[x.key].files, files).length === 0, JSON.stringify(files).length > 0 ? `${Object.values(files).filter((v) => v.length === 64).length} files` : '');
      out[x.key] = { api, files };
    }
    const iso = await isolation(clients.dan, remap);
    check('isolation', 'outsider is refused for every resource of the other workspace', Object.values(iso).every((s) => s === 404 || s === 403) && diffKeys(before.isolation, iso).length === 0, JSON.stringify(Object.values(iso)));
    const old = await fetch(`${base}/api/auth/me`, { headers: { Cookie: facts.adaSourceCookie } });
    check('sign-in', 'a session started on the source is still valid', old.status === 200);
    const health = await (await fetch(`${base}/api/health`)).json();
    check('server', 'health ok on node-sqlite', health.status === 'ok' && health.db === 'ok');
    const { default: WebSocket } = await import('ws');
    const pong = await new Promise((resolveP) => {
      const ws = new WebSocket(`ws://127.0.0.1:${nodePort}/api/live/boards/${ids.board}`, { headers: { Origin: base, Cookie: clients.ada.cookie } });
      const t = setTimeout(() => resolveP('timeout'), 5000);
      ws.on('open', () => ws.send('ping'));
      ws.on('message', (m) => {
        clearTimeout(t);
        ws.close();
        resolveP(m.toString());
      });
      ws.on('unexpected-response', (_q, r) => resolveP(`status ${r.statusCode}`));
      ws.on('error', (e) => resolveP(e.message));
    });
    check('server', 'realtime socket on a migrated board answers ping', pong === 'pong');
    const code = await stop(server);
    check('server', 'graceful shutdown on SIGTERM (exit 0)', code === 0, String(code));
    return out;
  });

  await step('Rollback: export-for-d1.mjs into a fresh local D1 and R2, back again', async () => {
    const exp = await node('export-for-d1.mjs', [P.data, P.rollbackSql, '--files', P.rollbackFiles]);
    check('rollback', 'export with a verified round trip', exp.code === 0);
    mkdirSync(P.rollback, { recursive: true });
    const cfg = join(P.rollback, 'wrangler.json');
    writeFileSync(cfg, JSON.stringify(sourceConfig('rollback', sourcePort), null, 2));
    await wrangler(['d1', 'execute', 'DB', '--local', '--config', cfg, '--file', P.rollbackSql]);
    const manifest = JSON.parse(readFileSync(join(P.rollbackFiles, 'manifest.json'), 'utf8'));
    for (const m of manifest) {
      await wrangler(['r2', 'object', 'put', `workos-dry-run-rollback-files/${m.key}`, '--file', join(P.rollbackFiles, m.file), ...(m.contentType ? ['--content-type', m.contentType] : []), '--local', '--config', cfg]);
    }
    await wrangler(['d1', 'export', 'DB', '--local', '--config', cfg, '--output', P.rollbackDump]);
    await node('import-d1-dump.mjs', [P.rollbackDump, P.dataRoundTrip]);
    await node('repair-text-from-d1.mjs', [P.dataRoundTrip, '--local', '--wrangler-config', cfg]);
    await node('copy-r2-objects.mjs', [P.dataRoundTrip, '--bucket', 'workos-dry-run-rollback-files', '--local', '--wrangler-config', cfg]);
    const v = await node('verify-data-dir.mjs', [P.dataRoundTrip], { allowFail: true });
    const a = countRows(P.data);
    const b = countRows(P.dataRoundTrip);
    const d = diffKeys(a, b);
    check('rollback', 'D1 -> Node -> D1 -> Node: identical database checksums', d.length === 0, d.join(', '));
    check('rollback', 'objects re-uploaded to R2 and verified', v.code === 0, `${manifest.length} objects`);
    facts.rollback = { statements: readFileSync(P.rollbackSql, 'utf8').split('\n').length, objects: manifest.length };
  });

  facts.totalMs = Date.now() - started;
  writeReport(facts, before, after);
}

function writeReport(facts, before, after) {
  const imp = facts.importReport;
  const rows = Object.entries(imp.tables).filter(([, v]) => v.dump > 0 || v.database > 0);
  const lines = [
    `# Migration dry run, ${today}`,
    '',
    'Synthetic data only (users at example.com created for this run). Produced by `node scripts/migrate/dry-run.mjs`;',
    'run it again to repeat every step. Counts and results only: no row content.',
    '',
    `**Result: ${failed ? 'FAILED' : 'all checks passed'}** (${checks.filter((c) => c.ok).length} of ${checks.length} checks, ${(facts.totalMs / 1000).toFixed(0)} s).`,
    '',
    `Environment: Node ${facts.node}, ${facts.wrangler}, SQLite through node:sqlite. Source: \`wrangler dev --local\` (Miniflare D1, R2, KV, Durable Objects) with the Worker from this commit.`,
    '',
    '## Steps',
    '',
    '| Step | Time | Result |',
    '| --- | --- | --- |',
    ...steps.map((s) => `| ${s.name} | ${(s.ms / 1000).toFixed(1)} s | ${s.ok ? 'ok' : `failed: ${s.error}`} |`),
    '',
    '## Data: source dump against the imported database',
    '',
    `Dump: ${imp.dump.bytes} bytes, ${imp.statements.tables} tables, ${imp.statements.rows} rows. Integrity check: ${imp.integrity.length ? 'FAILED' : 'ok'}. Schema: ${imp.schema.differences.length ? 'different' : 'identical to the schema migrations/ produces'}. Migrations recorded in d1_migrations: ${imp.migrations.applied.length} of ${imp.migrations.applied.length + imp.migrations.pending.length}.`,
    '',
    '| Table | Rows in dump | Rows in db.sqlite |',
    '| --- | --- | --- |',
    ...rows.map(([t, v]) => `| ${t} | ${v.dump} | ${v.database} |`),
    '',
    `Rows that failed to insert: ${imp.failedRows.length}. Duplicate primary keys: ${imp.duplicates.length}. Missing relationships (foreign key check): ${imp.foreignKeyViolations.length}. Empty tables: ${Object.values(imp.tables).filter((v) => v.dump === 0).length}.`,
    '',
    '## Multi-line text',
    '',
    `\`wrangler d1 export\` writes text with a line break as replace(...,'\\n',char(10)), so a backslash-n already in such text comes back as a line break. The dry run seeds one such comment. repair-text-from-d1.mjs compared ${facts.textRepair.checked.values} multi-line values with D1 (as hex) and restored ${facts.textRepair.repaired.length} (${facts.textRepair.repaired.map((x) => `${x.table}.${x.column}`).join(', ')}); unexpected differences: ${facts.textRepair.unexpected.length}.`,
    '',
    '## Files',
    '',
    `| Kind | Referenced | Copied and verified |`,
    '| --- | --- | --- |',
    ...Object.entries(facts.files.byKind).map(([k, n]) => `| ${k} | ${n} | ${n - facts.files.missing.filter((m) => m.kind === k).length} |`),
    '',
    `Objects copied: ${facts.files.copied}, verified after copy (size, SHA-256, MD5 etag): ${facts.files.verified}, bytes: ${facts.files.bytes}. Missing: ${facts.files.missing.length} (${facts.files.missing.map((m) => m.note).join('; ') || 'none'}). Size mismatches: ${facts.files.sizeMismatches.length}.`,
    '',
    `verify-data-dir.mjs: ${facts.verify.ok ? 'ok' : 'problems'}; ${facts.verify.files.checked} objects checked, ${facts.verify.files.missing} missing, ${facts.verify.files.mismatched} mismatched, ${facts.verify.files.unreferenced} unreferenced files.`,
    '',
    '## Checks',
    '',
    '| Area | Check | Result |',
    '| --- | --- | --- |',
    ...checks.map((c) => `| ${c.area} | ${c.name}${c.detail ? ` (${c.detail.replace(/\|/g, '/')})` : ''} | ${c.ok ? 'pass' : 'FAIL'} |`),
    '',
    `API responses compared per user (same paths on both runtimes, sign-in timestamps left out): ${Object.keys(after?.ada?.api ?? {}).length}.`,
    '',
    '## Repeat it',
    '',
    '```bash',
    'cd apps/work && npm ci && node scripts/migrate/dry-run.mjs',
    '```',
    '',
    'Working files (dump, data dirs, logs) go to `apps/work/.data/dry-run/<time>/`, which git ignores.',
    '',
  ];
  mkdirSync(join(reportFile, '..'), { recursive: true });
  writeFileSync(reportFile, `${lines.join('\n')}`);
  console.log(`\nReport: ${relative(process.cwd(), reportFile)}`);
}

process.on('SIGINT', () => {
  for (const c of children) c.kill('SIGKILL');
  process.exit(130);
});

main()
  .catch((e) => {
    failed = true;
    console.error(`\nDry run stopped: ${e.message}`);
  })
  .finally(async () => {
    for (const c of children) await stop(c);
    if (!flags.keep && !failed) rmSync(RUN, { recursive: true, force: true });
    else console.log(`Working files kept in ${relative(process.cwd(), RUN)}`);
    console.log(failed ? '\nDRY RUN FAILED' : `\nDry run passed: ${checks.length} checks.`);
    process.exit(failed ? 1 : 0);
  });

