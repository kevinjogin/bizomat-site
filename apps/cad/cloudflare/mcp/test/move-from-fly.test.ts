// scripts/move-from-fly.mjs end to end: the real tool against a stand-in flyctl whose Machine is a folder here
// (fake-fly.mjs) and wrangler's real local R2 (wrangler-standin.mjs logs each call and runs wrangler). What lands in
// the local R2 is then restored by the server's own client (opensketch/persist.py, through python3) from the Worker's
// store (src/persist.ts) on that same local R2, and compared with the data folder it came from.
import { execFile, execFileSync, spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, truncateSync, writeFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { handlePersist, PERSIST_HOST, type StoreBucket } from '../src/persist';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const TOOL = here('../scripts/move-from-fly.mjs');
const FAKE_FLY = here('./fake-fly.mjs');
const STANDIN = here('./wrangler-standin.mjs');
const REAL_WRANGLER = here('../node_modules/wrangler/bin/wrangler.js');
const REPO = here('../../..');
const PYTHON = process.env.PYTHON ?? 'python3';
const BUCKET = 'bizomat-mcp-data';
const MINUTES = 60_000;
const work = mkdtempSync(join(tmpdir(), 'move-from-fly-'));
afterAll(() => rmSync(work, { recursive: true, force: true }));

type Rules = { name: string; skip: string[]; sqlite: string[]; marker: string; maxFile: number; prefix: string };
type ToolModule = { RULES: Rules; KNOWN: string[]; SNAPSHOT_PY: string; DEFAULT_BUCKET: string; isStateName(n: string): boolean };
type Manifest = { format: number; source: Record<string, unknown>; files: { name: string; size: number; sha256: string }[]; skipped: Record<string, unknown> };
type WranglerCall = { argv: string[]; config: unknown; cwd: string };
type Machine = { id: string; state: string; group?: string; root: string };

const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const jsonLines = <T>(file: string): T[] => (existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T) : []);
const readJson = <T>(file: string) => JSON.parse(readFileSync(file, 'utf8')) as T;

/** The tool's own exports (it runs nothing when imported). */
const toolModule = async () => (await import(/* @vite-ignore */ pathToFileURL(TOOL).href)) as ToolModule;

/** A stand-in flyctl and its apps; every call of flyctl and wrangler is logged in the world's folder. */
function world(name: string, apps: (dir: string) => Record<string, Machine[]>) {
  const dir = join(work, name);
  mkdirSync(dir, { recursive: true });
  const state = join(dir, 'fly-state.json');
  const setApps = (a: Record<string, Machine[]>) => writeFileSync(state, JSON.stringify({ apps: a }));
  setApps(apps(dir));
  const fly = join(dir, 'fly');
  writeFileSync(fly, `#!/bin/sh\nexec "${process.execPath}" "${FAKE_FLY}" "$@"\n`);
  chmodSync(fly, 0o755);
  const env: Record<string, string> = {
    FLYCTL: fly,
    FAKEFLY_STATE: state,
    FAKEFLY_LOG: join(dir, 'fly.log'),
    WRANGLER: STANDIN,
    REAL_WRANGLER,
    WRANGLER_LOG: join(dir, 'wrangler.log'),
  };
  return {
    dir,
    env,
    setApps,
    flyCalls: () => jsonLines<string[]>(join(dir, 'fly.log')),
    wranglerCalls: () => jsonLines<WranglerCall>(join(dir, 'wrangler.log')),
  };
}

const oneMachine = (id = 'm1') => (dir: string) => ({ cados: [{ id, state: 'started', group: 'app', root: join(dir, 'machine') }] });

type Run = { code: number; out: string };
function run(args: string[], env: Record<string, string>): Promise<Run> {
  return new Promise((done) => {
    execFile(process.execPath, [TOOL, ...args], { env: { ...process.env, ...env }, maxBuffer: 64 << 20, timeout: 5 * MINUTES }, (err, stdout, stderr) => {
      const code = err ? (typeof (err as { code?: unknown }).code === 'number' ? Number((err as { code: number }).code) : 1) : 0;
      done({ code, out: `${stdout}${stderr}` });
    });
  });
}

/**
 * A data folder as the server keeps it: its state files, and what the store leaves out (locks, temporary files, the
 * folders of files in transit, names it does not take, a link, a pipe). bridge.sqlite stays open in WAL mode with
 * automatic checkpoints off, so its rows are in bridge.sqlite-wal only, as on a running server. Every file holds a
 * marker that must never show in the tool's output. Throwaway values only.
 */
function fill(data: string, { accounts = true, extra = true } = {}) {
  mkdirSync(data, { recursive: true });
  const markers: string[] = [];
  const mark = (what: string) => {
    const m = `CONTENT-${what}-${randomBytes(6).toString('hex')}`;
    markers.push(m);
    return m;
  };
  const put = (name: string, value: string | Buffer) => writeFileSync(join(data, name), value);
  if (accounts) put('accounts.enabled', '');
  put('users.json', JSON.stringify({ users: [{ id: 'u1', email: 'owner@example.test', role: 'owner', note: mark('users') }], invites: [] }));
  put('sessions.json', JSON.stringify({ [randomBytes(32).toString('hex')]: { user: 'u1', expires: 4102444800, note: mark('sessions') } }));
  put('mcp_oauth.json', JSON.stringify({ clients: { c1: { note: mark('oauth') } }, grants: {}, access: {} }));
  put('swbridge.json', JSON.stringify({ keys: { u1: 1 }, note: mark('swbridge') }));
  put('secret', `${randomBytes(32).toString('hex')}${mark('secret')}`);
  put('secret.keys', Buffer.concat([randomBytes(300), Buffer.from(mark('keys')), randomBytes(300)]));
  put('bridge-signing-key.pem', `-----BEGIN PRIVATE KEY-----\n${mark('pem')}\n-----END PRIVATE KEY-----\n`); // not a key: a stand-in
  if (extra) {
    put('users.json.lock', '');
    put('sessions.json.9f3a.tmp', mark('tmp'));
    put('upload.part', mark('part'));
    put('x.restore', mark('restore'));
    put('legacy.db-journal', mark('journal'));
    put('.users.json.restore', mark('hidden-restore'));
    put('.hidden', mark('hidden'));
    put('bad name.json', mark('space'));
    put('a..b', mark('dots'));
    put('x'.repeat(129), mark('long'));
    put('\u00fc.json', mark('unicode'));
    put('-dash.json', mark('dash'));
    for (const folder of ['uploads', 'artifacts', 'bridge-files']) {
      mkdirSync(join(data, folder, 'u1'), { recursive: true });
      writeFileSync(join(data, folder, 'u1', 'in-transit.json'), mark(folder));
    }
    symlinkSync('users.json', join(data, 'link.json'));
    symlinkSync('uploads', join(data, 'uploads-link'));
    execFileSync('mkfifo', [join(data, 'fifo.json')]);
  }
  const db = new DatabaseSync(join(data, 'bridge.sqlite'));
  db.exec('PRAGMA journal_mode=WAL');
  db.exec('PRAGMA wal_autocheckpoint=0');
  db.exec('CREATE TABLE devices (id TEXT PRIMARY KEY, owner TEXT, note TEXT)');
  const devicesNote = mark('devices');
  const insert = db.prepare('INSERT INTO devices VALUES (?, ?, ?)');
  for (let i = 0; i < 400; i++) insert.run(`d${String(i).padStart(3, '0')}`, 'u1', `${devicesNote}-${i}`);
  return { db, markers };
}

/** The regular files of a folder (not its links), name -> sha256: what must stay as it was. */
function regularFiles(dir: string, leaveOut: (n: string) => boolean = () => false) {
  const out: Record<string, string> = {};
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && !leaveOut(e.name)) out[e.name] = sha(readFileSync(join(dir, e.name)));
  }
  return out;
}

/** Contents of every regular file under dir (for the no-content check). */
function contentsUnder(dir: string): Buffer[] {
  const out: Buffer[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (e.isFile()) out.push(readFileSync(join(e.parentPath, e.name)));
  }
  return out;
}

/** No marker, and no piece of any file in base64 (as a base64 fallback would carry it), in what the tool printed. */
function expectNoContent(out: string, markers: string[], contents: Buffer[]) {
  for (const m of markers) expect(out.includes(m), `a file's content (${m.split('-')[1]}) in the output`).toBe(false);
  for (const c of contents) {
    const b64 = c.toString('base64');
    for (let i = 0; i + 24 <= b64.length; i += 4) {
      if (out.includes(b64.slice(i, i + 24))) expect.fail('a piece of a file, in base64, in the output');
    }
  }
}

const RULES_PY = `
import json, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
from opensketch import persist
print(json.dumps({"name": persist.NAME.pattern, "skip": list(persist.SKIP_SUFFIXES), "sqlite": list(persist.SQLITE_SUFFIXES),
                  "marker": persist.MARKER, "maxFile": persist.MAX_FILE, "prefix": persist.PREFIX,
                  "files": [p.name for p in persist.state_files(Path(sys.argv[2]))]}))
`;

/** opensketch/persist.py's own rules, and the state files it would keep in R2 from this folder. */
function persistPy(folder: string) {
  return JSON.parse(execFileSync(PYTHON, ['-I', '-c', RULES_PY, REPO, folder], { encoding: 'utf8' })) as Rules & { files: string[] };
}

const RESTORE_PY = `
import json, os, sys
from pathlib import Path
repo, url, folder = sys.argv[1:4]
sys.path.insert(0, repo)
os.environ["OPENSKETCH_PERSIST_URL"] = url
from opensketch import persist
got = persist.restore(Path(folder), log=lambda m: None)
print(json.dumps({"restored": sorted(got), "modes": sorted({oct((Path(folder) / n).stat().st_mode & 0o777) for n in got})}))
`;

/** wrangler's local R2 kept in persistTo, opened with the miniflare that wrangler itself uses. */
async function localR2<T>(persistTo: string, use: (bucket: StoreBucket & { put(key: string, value: string): Promise<unknown> }) => Promise<T>): Promise<T> {
  const fromWrangler = createRequire(join(REAL_WRANGLER, '..', '..', 'package.json'));
  const { Miniflare, convertV4MiniflareOptions } = fromWrangler('miniflare');
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    script: 'export default { fetch() { return new Response(null, { status: 404 }); } }',
    resourcePersistencePath: join(persistTo, 'v3'),
    r2Buckets: { DATA: BUCKET },
  }));
  try {
    return await use(await mf.getR2Bucket('DATA'));
  } finally {
    await mf.dispose();
  }
}

const keysIn = (bucket: StoreBucket) => bucket.list({ prefix: '' }).then((l) => l.objects.map((o) => o.key).sort());

/**
 * What the container does at its start: opensketch/persist.py restores the data folder from the Worker's store
 * (src/persist.ts), here served over HTTP on the local R2 the tool wrote. Returns the bucket's keys too.
 */
async function restoreFrom(persistTo: string, folder: string) {
  return localR2(persistTo, async (bucket) => {
    const keys = await keysIn(bucket);
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      void (async () => {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string' && k !== 'host' && k !== 'connection') headers.set(k, v);
        const method = req.method ?? 'GET';
        const r = await handlePersist(new Request(`http://${PERSIST_HOST}${req.url}`, { method, headers, body: method === 'PUT' ? Buffer.concat(chunks) : undefined }), bucket);
        res.writeHead(r.status, Object.fromEntries(r.headers));
        res.end(Buffer.from(await r.arrayBuffer()));
      })().catch((e) => {
        res.statusCode = 500;
        res.end(String(e));
      });
    });
    await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok));
    try {
      const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      const out = await new Promise<string>((ok, bad) => {
        execFile(PYTHON, ['-I', '-c', RESTORE_PY, REPO, url, folder], { timeout: MINUTES }, (err, stdout, stderr) => (err ? bad(new Error(`${err.message}\n${stderr}`)) : ok(stdout)));
      });
      return { keys, ...(JSON.parse(out) as { restored: string[]; modes: string[] }) };
    } finally {
      await new Promise((ok) => server.close(ok));
    }
  });
}

const rows = (file: string) => {
  const db = new DatabaseSync(file, { readOnly: true });
  try {
    return db.prepare('SELECT * FROM devices ORDER BY id').all();
  } finally {
    db.close();
  }
};

/** Every /data path a command on the Machine names: the data folder it reads, or the tool's own copy. */
function expectOnlyItsCopy(calls: string[][], data: string) {
  const commands = calls.filter((a) => a[0] === 'ssh').map((a) => a[a.indexOf('--command') + 1]);
  expect(commands.length).toBeGreaterThan(0);
  for (const c of commands) {
    for (const [, p] of c.matchAll(/(?:^|[\s'"=<>;&|(])(\/data[^\s'";&|)]*)/g)) {
      expect(p === data || p === '/data/incoming' || /^\/data\/incoming\/cf-cad-\d{8}-\d{6}-[0-9a-f]{8}(\.py|\.b64|\/[A-Za-z0-9._-]+)?$/.test(p), `${p} in: ${c.slice(0, 120)}`).toBe(true);
    }
  }
}

// Linux and macOS only: the stand-ins are POSIX (a fly script run with sh, python3, mkfifo, symlinks). They run in CI
// and on Linux; on the Windows laptop deploy mcp runs the typecheck and the other tests.
describe.skipIf(process.platform === 'win32')('move-from-fly.mjs', () => {
  it('keeps the rules of opensketch/persist.py', async () => {
    const t = await toolModule();
    const dir = join(work, 'rules');
    const { db } = fill(dir);
    db.close();
    writeFileSync(join(dir, 'A_1-b.c'), 'x');
    writeFileSync(join(dir, 'y'.repeat(128)), 'x');
    writeFileSync(join(dir, 'other.sqlite-wal'), 'x');
    writeFileSync(join(dir, 'other.db-shm'), 'x');
    const py = persistPy(dir);
    const { files, ...rules } = py;
    expect(t.RULES).toEqual(rules);
    expect(files).toContain('accounts.enabled');
    expect(files).toContain('y'.repeat(128));

    // the script the tool sends to the Machine picks exactly persist.py's files
    const script = join(work, 'rules-snapshot.py');
    writeFileSync(script, t.SNAPSHOT_PY);
    mkdirSync(join(work, 'rules-incoming'));
    const out = execFileSync(PYTHON, ['-I', script, dir, join(work, 'rules-incoming', 'copy')], { encoding: 'utf8' });
    const info = JSON.parse(out.trim().replace(/^BIZOMAT-CAD-SNAPSHOT /, '')) as { ok: boolean; files: { name: string }[]; skipped: Record<string, unknown> };
    expect(info.ok).toBe(true);
    expect(info.files.map((f) => f.name)).toEqual(files);
    expect(readdirSync(join(work, 'rules-incoming', 'copy')).sort()).toEqual([...files].sort());
    // 7 lock, temporary or journal files; 8 others: 7 names the store does not take and a pipe
    expect(info.skipped).toEqual({ folders: ['artifacts', 'bridge-files', 'uploads'], temporary: 7, links: 2, other: 8 });

    // the names the tool takes back from the Machine are the store's, by name
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isFile()) expect(t.isStateName(e.name), e.name).toBe(files.includes(e.name));
    }
    // the server's own state files are names the store takes; the default bucket is the Worker's
    for (const n of t.KNOWN) expect(t.isStateName(n), n).toBe(true);
    expect(/"bucket_name":\s*"([^"]+)"/.exec(readFileSync(here('../wrangler.jsonc'), 'utf8'))?.[1]).toBe(t.DEFAULT_BUCKET);
  });

  it('copies the data folder of a running server into R2, and the container restores it exactly', async () => {
    const w = world('roundtrip', oneMachine());
    const data = join(w.dir, 'machine', 'data');
    const { db, markers } = fill(data);
    try {
      expect(statSync(join(data, 'bridge.sqlite-wal')).size).toBeGreaterThan(0); // the rows are only in the -wal file
      const before = regularFiles(data, (n) => n.endsWith('-shm'));
      const want = persistPy(data).files;
      expect(want).toEqual(['accounts.enabled', 'bridge-signing-key.pem', 'bridge.sqlite', 'mcp_oauth.json', 'secret', 'secret.keys', 'sessions.json', 'swbridge.json', 'users.json']);

      const copy = join(w.dir, 'copy');
      const prep = await run(['prepare', copy], w.env);
      expect(prep.code, prep.out).toBe(0);
      expect(prep.out).toMatch(/through the online backup: bridge\.sqlite/);
      // the open database's -wal and -shm count with the lock and temporary files
      expect(prep.out).toMatch(/skipped, as the container's data store skips them: 3 folders \(artifacts, bridge-files, uploads\); 7 lock, temporary or journal files; 2 links; 8 other entries/);
      expect(prep.out).toMatch(/bridge\.sqlite: integrity ok/);
      expect(prep.out).toMatch(/removed the copy from the Machine/);

      // the folder: the state files persist.py keeps, and nothing else
      const manifest = readJson<Manifest>(join(copy, 'manifest.json'));
      expect(manifest.format).toBe(1);
      expect(manifest.source).toEqual({ app: 'cados', group: 'app', machine: 'm1', data: '/data' });
      expect(manifest.files.map((f) => f.name)).toEqual(want);
      expect(readdirSync(join(copy, 'files')).sort()).toEqual(want);
      expect(readdirSync(copy).sort()).toEqual(['MANIFEST.sha256', 'files', 'manifest.json']);
      for (const f of manifest.files) {
        const bytes = readFileSync(join(copy, 'files', f.name));
        expect([bytes.length, sha(bytes)]).toEqual([f.size, f.sha256]);
        if (f.name !== 'bridge.sqlite') expect(bytes.equals(readFileSync(join(data, f.name))), f.name).toBe(true);
        expect(statSync(join(copy, 'files', f.name)).mode & 0o777).toBe(0o600);
      }
      expect(readFileSync(join(copy, 'MANIFEST.sha256'), 'utf8').split('\n').filter(Boolean).length).toBe(want.length + 1);
      expect(JSON.stringify(manifest)).not.toMatch(/CONTENT-/);

      // on the Machine: the data folder as it was, no copy left, and no /data/incoming (it made it, so it removed it)
      expect(regularFiles(data, (n) => n.endsWith('-shm'))).toEqual(before);
      expect(existsSync(join(data, 'incoming'))).toBe(false);
      expectOnlyItsCopy(w.flyCalls(), '/data');

      const r2 = join(w.dir, 'r2');
      const applied = await run(['apply', copy, '--local', r2], w.env);
      expect(applied.code, applied.out).toBe(0);
      expect(applied.out).toMatch(/data\/accounts\.enabled is not there: the bucket holds no store/);
      expect(applied.out).toMatch(/Done: 9 files .* accounts\.enabled last/);

      // wrangler: the temporary config names the bucket and nothing else, every call is local, and accounts.enabled
      // goes up last, after every other file was uploaded and read back
      const calls = w.wranglerCalls();
      for (const c of calls) {
        expect(c.config).toEqual({ name: 'bizomat-mcp', compatibility_date: '2026-10-01', r2_buckets: [{ binding: 'DATA', bucket_name: BUCKET }] });
        expect(c.argv.join(' ')).toContain(`--local --persist-to ${r2}`);
        expect(c.argv).not.toContain('--remote');
        expect(existsSync(c.cwd)).toBe(false); // the temporary config is gone
      }
      const step = (verb: string, name: string, from = 0) => calls.findIndex((c, i) => i >= from && c.argv[2] === verb && c.argv[3] === `${BUCKET}/data/${name}`);
      const puts = calls.filter((c) => c.argv[2] === 'put').map((c) => c.argv[3]);
      expect([...puts].sort()).toEqual(want.map((n) => `${BUCKET}/data/${n}`));
      expect(puts.at(-1)).toBe(`${BUCKET}/data/accounts.enabled`);
      const markerPut = step('put', 'accounts.enabled');
      for (const n of want.filter((x) => x !== 'accounts.enabled')) {
        const put = step('put', n);
        const readBack = step('get', n, put);
        expect(put).toBeGreaterThan(-1);
        expect(readBack).toBeGreaterThan(put);
        expect(readBack).toBeLessThan(markerPut);
      }
      expect(calls.at(-1)!.argv.slice(2, 4)).toEqual(['get', `${BUCKET}/data/accounts.enabled`]);
      for (const c of calls.filter((x) => x.argv[2] === 'put')) expect(c.argv.join(' ')).toContain('--content-type application/octet-stream');
      expect(calls.some((c) => c.argv[2] === 'delete')).toBe(false);

      // the container's start: persist.py restores exactly the state files, the open database's rows included
      const restored = join(w.dir, 'restored');
      const back = await restoreFrom(r2, restored);
      expect(back.keys).toEqual(want.map((n) => `data/${n}`));
      expect(back.restored).toEqual(want);
      expect(back.modes).toEqual(['0o600']);
      for (const n of want.filter((x) => x !== 'bridge.sqlite')) expect(readFileSync(join(restored, n)).equals(readFileSync(join(data, n))), n).toBe(true);
      const live = db.prepare('SELECT * FROM devices ORDER BY id').all();
      expect(live.length).toBe(400);
      expect(rows(join(restored, 'bridge.sqlite'))).toEqual(live);

      expectNoContent(`${prep.out}\n${applied.out}`, markers, contentsUnder(data));
    } finally {
      db.close();
    }
  }, 5 * MINUTES);

  it('refuses a data folder without accounts.enabled or with a file the store refuses, and leaves nothing behind', async () => {
    const w = world('refusals', oneMachine());
    const data = join(w.dir, 'machine', 'data');
    const { db, markers } = fill(data, { accounts: false, extra: false });
    db.close();
    const copy = join(w.dir, 'copy');
    const none = await run(['prepare', copy], w.env);
    expect(none.code).toBe(1);
    // (the script names the folder as the Machine sees it: here the stand-in's own path for /data)
    expect(none.out).toMatch(/STOP: the copy on the Machine was refused: accounts\.enabled is not in \S+\/data: this data folder has no accounts/);
    expect(none.out).toMatch(/removed the copy from the Machine/);
    expect(existsSync(join(data, 'incoming'))).toBe(false);
    expect(existsSync(copy)).toBe(false);

    writeFileSync(join(data, 'accounts.enabled'), '');
    writeFileSync(join(data, 'bridge-release.json'), '');
    truncateSync(join(data, 'bridge-release.json'), 64 * 2 ** 20 + 1); // sparse: no disk used
    const big = await run(['prepare', copy], w.env);
    expect(big.code).toBe(1);
    expect(big.out).toMatch(/over the 64 MiB the store takes: bridge-release\.json \(64 MiB\)/);
    expect(existsSync(join(data, 'incoming'))).toBe(false);
    expect(existsSync(copy)).toBe(false);
    rmSync(join(data, 'bridge-release.json'));
    expectNoContent(`${none.out}\n${big.out}`, markers, contentsUnder(data));
  }, 2 * MINUTES);

  it('finds a damaged download by its SHA-256', async () => {
    const w = world('damaged', oneMachine());
    const data = join(w.dir, 'machine', 'data');
    const { db, markers } = fill(data, { extra: false });
    db.close();

    // one byte of the stream changed: the file it falls in is fetched again, in base64 pieces
    const copy = join(w.dir, 'copy');
    const once = await run(['prepare', copy], { ...w.env, FAKEFLY_CORRUPT: '^cat ' });
    expect(once.code, once.out).toBe(0);
    expect(once.out).toMatch(/1 file did not arrive intact in the stream \(another size or sha256\): fetching it in base64 pieces/);
    for (const f of readJson<Manifest>(join(copy, 'manifest.json')).files) {
      const bytes = readFileSync(join(copy, 'files', f.name));
      expect(sha(bytes), f.name).toBe(f.sha256);
      if (f.name !== 'bridge.sqlite') expect(bytes.equals(readFileSync(join(data, f.name))), f.name).toBe(true);
    }
    expect(rows(join(copy, 'files', 'bridge.sqlite')).length).toBe(400);

    // damaged every way: nothing is prepared, and the copy on the Machine is removed all the same
    const copy2 = join(w.dir, 'copy2');
    const always = await run(['prepare', copy2], { ...w.env, FAKEFLY_CORRUPT: '^cat |dd if=' });
    expect(always.code).toBe(1);
    expect(always.out).toMatch(/STOP: \S+ did not arrive intact \(its size or sha256 differs from the copy on the Machine every way\): nothing was prepared/);
    expect(always.out).toMatch(/removed the copy from the Machine/);
    expect(existsSync(join(data, 'incoming'))).toBe(false);
    expect(existsSync(copy2)).toBe(false);
    expectNoContent(`${once.out}\n${always.out}`, markers, contentsUnder(data));
  }, 2 * MINUTES);

  it('copies from exactly one started Machine, by process group', async () => {
    const w = world('machines', (dir) => ({
      cados: [
        { id: 'c1', state: 'started', group: 'app', root: join(dir, 'c1') },
        { id: 'c2', state: 'stopped', group: 'app', root: join(dir, 'c2') },
      ],
      bizomat: [
        { id: 'p1', state: 'started', group: 'proxy', root: join(dir, 'p1') },
        { id: 'w1', state: 'started', group: 'web', root: join(dir, 'w1') },
        { id: 'k1', state: 'suspended', group: 'cad', root: join(dir, 'k1') },
      ],
    }));
    const two = await run(['prepare', join(w.dir, 'a')], w.env);
    expect(two.code).toBe(1);
    expect(two.out).toMatch(/the app cados has 2 Machines: it must have exactly one \(give its process group with --group: app\)/);
    const groups = await run(['prepare', join(w.dir, 'a'), '--app', 'bizomat'], w.env);
    expect(groups.out).toMatch(/the app bizomat has 3 Machines: it must have exactly one \(give its process group with --group: cad, proxy, web\)/);
    const nothing = await run(['prepare', join(w.dir, 'a'), '--app', 'bizomat', '--group', 'work'], w.env);
    expect(nothing.out).toMatch(/the process group work of the app bizomat has no Machine/);
    const asleep = await run(['prepare', join(w.dir, 'a'), '--app', 'bizomat', '--group', 'cad'], w.env);
    expect(asleep.code).toBe(1);
    expect(asleep.out).toMatch(/the Machine k1 is suspended: start it first \(fly machine start k1 --app bizomat\), then run prepare again/);
    expect(w.flyCalls().every((a) => a[0] === 'machines')).toBe(true); // nothing ran on a Machine yet

    // the cad group of bizomat, as tools/laptop/cloudflare.ps1 asks for it: its data in /data/cad (the default with
    // --group cad), and /data/incoming already there (the platform's own)
    const root = join(w.dir, 'k1');
    const { db } = fill(join(root, 'data', 'cad'), { extra: false });
    db.close();
    mkdirSync(join(root, 'data', 'incoming'));
    writeFileSync(join(root, 'data', 'incoming', 'keep.txt'), 'not the tool\'s');
    w.setApps({ bizomat: [{ id: 'p1', state: 'started', group: 'proxy', root: join(w.dir, 'p1') }, { id: 'k1', state: 'started', group: 'cad', root }] });
    const copy = join(w.dir, 'copy');
    const cad = await run(['prepare', copy, '--app', 'bizomat', '--group', 'cad'], w.env);
    expect(cad.code, cad.out).toBe(0);
    expect(readJson<Manifest>(join(copy, 'manifest.json')).source).toEqual({ app: 'bizomat', group: 'cad', machine: 'k1', data: '/data/cad' });
    expect(readdirSync(join(root, 'data', 'incoming'))).toEqual(['keep.txt']); // kept: the tool did not make it
    expectOnlyItsCopy(w.flyCalls(), '/data/cad');

    const bad = await run(['prepare', join(w.dir, 'b'), '--data', '/etc'], w.env);
    expect(bad.out).toMatch(/--data: the data folder on the Machine, under \/data/);
    // --data still names another folder: here the volume's root, which holds no accounts of its own
    const root2 = await run(['prepare', join(w.dir, 'b'), '--app', 'bizomat', '--group', 'cad', '--data', '/data'], w.env);
    expect(root2.out).toMatch(/accounts\.enabled is not in \S+\/data: this data folder has no accounts/);
  }, 2 * MINUTES);

  it('checks the prepared folder before it changes anything', async () => {
    const w = world('folder', oneMachine());
    const { db } = fill(join(w.dir, 'machine', 'data'), { extra: false });
    db.close();
    const copy = join(w.dir, 'copy');
    expect((await run(['prepare', copy], w.env)).code).toBe(0);
    const again = await run(['prepare', copy], w.env);
    expect(again.out).toMatch(/is not an empty folder: give a new one/);
    const inRepo = join(REPO, 'cloudflare', 'mcp', `move-test-${randomBytes(3).toString('hex')}`);
    const refusedHere = await run(['prepare', inRepo], w.env);
    expect(refusedHere.out).toMatch(/is inside this repository: give a folder outside it, so these keys can never be committed/);
    expect(existsSync(inRepo)).toBe(false);

    const users = join(copy, 'files', 'users.json');
    const original = readFileSync(users);
    writeFileSync(users, Buffer.concat([original, Buffer.from(' ')]));
    const changed = await run(['apply', copy, '--local', join(w.dir, 'r2')], w.env);
    expect(changed.code).toBe(1);
    expect(changed.out).toMatch(/the folder changed since it was prepared \(1 changed, 0 missing, 0 added; first: files\/users\.json\): prepare again/);
    writeFileSync(users, original);
    writeFileSync(join(copy, 'files', 'google_oauth.json'), '{}');
    const added = await run(['apply', copy, '--local', join(w.dir, 'r2')], w.env);
    expect(added.out).toMatch(/\(0 changed, 0 missing, 1 added; first: files\/google_oauth\.json\)/);
    expect(w.wranglerCalls()).toEqual([]); // wrangler never ran

    const localInRepo = await run(['apply', copy, '--local', join(REPO, 'cloudflare', 'mcp', 'r2-test')], w.env);
    expect(localInRepo.out).toMatch(/is inside this repository: use \.wrangler\/state \(git leaves it out\) or a folder outside it/);
    const notPrepared = await run(['apply', join(w.dir, 'machine')], w.env);
    expect(notPrepared.out).toMatch(/is not a prepared folder/);
    const wrong = await run(['apply', copy, '--app', 'cados'], w.env);
    expect(wrong.out).toMatch(/--app is not an option of apply/);
  }, 2 * MINUTES);

  it('refuses a bucket that holds a store; with --replace it keeps a copy of it first', async () => {
    const w = world('replace', oneMachine());
    const data = join(w.dir, 'machine', 'data');
    const { db, markers } = fill(data, { extra: false });
    db.close();
    for (const n of ['sessions.json', 'mcp_oauth.json', 'swbridge.json', 'secret']) rmSync(join(data, n));
    const copy = join(w.dir, 'copy');
    expect((await run(['prepare', copy], w.env)).code).toBe(0);
    const names = readJson<Manifest>(join(copy, 'manifest.json')).files.map((f) => f.name);
    expect(names).toEqual(['accounts.enabled', 'bridge-signing-key.pem', 'bridge.sqlite', 'secret.keys', 'users.json']);
    const r2 = join(w.dir, 'r2');

    // what an upload that stopped half-way left: a file of the server's that this copy does not have
    await localR2(r2, async (b) => {
      await b.put('data/google_oauth.json', '{"left": "behind"}');
    });
    const leftover = await run(['apply', copy, '--local', r2], w.env);
    expect(leftover.code).toBe(1);
    expect(leftover.out).toMatch(/holds data\/google_oauth\.json from an earlier upload, and this copy has no such file/);

    // an earlier copy: a store, with sessions.json, which this copy does not have either
    const earlier: Record<string, string> = { 'accounts.enabled': '', 'users.json': '{"users": ["earlier"]}', 'sessions.json': '{"earlier": 1}', 'bridge.sqlite': 'not a database' };
    await localR2(r2, async (b) => {
      for (const [n, v] of Object.entries(earlier)) await b.put(`data/${n}`, v);
    });
    const before = w.wranglerCalls().length;
    const refused = await run(['apply', copy, '--local', r2], w.env);
    expect(refused.code).toBe(1);
    expect(refused.out).toMatch(/already holds a store \(data\/accounts\.enabled\): the container restores it at its next start\. Nothing was changed\. To replace it with this copy, run apply again with --replace/);
    expect(w.wranglerCalls().slice(before).map((c) => c.argv.slice(2, 4))).toEqual([['get', `${BUCKET}/data/accounts.enabled`]]);

    const replaced = await run(['apply', copy, '--local', r2, '--replace'], w.env);
    expect(replaced.code, replaced.out).toBe(0);
    expect(replaced.out).toMatch(/removed data\/accounts\.enabled first: until the upload is complete the bucket does not look like a store/);
    expect(replaced.out).toMatch(/removed data\/google_oauth\.json: this copy does not have it/);
    expect(replaced.out).toMatch(/removed data\/sessions\.json: this copy does not have it/);

    // the copy of what the bucket held
    const saved = readdirSync(copy).filter((n) => n.startsWith('replaced-'));
    expect(saved.length).toBe(1);
    const keptDir = join(copy, saved[0]);
    const kept = { ...earlier, 'google_oauth.json': '{"left": "behind"}' };
    expect(readdirSync(join(keptDir, 'files')).sort()).toEqual(Object.keys(kept).sort());
    for (const [n, v] of Object.entries(kept)) expect(readFileSync(join(keptDir, 'files', n), 'utf8'), n).toBe(v);
    expect(readFileSync(join(keptDir, 'MANIFEST.sha256'), 'utf8').split('\n').filter(Boolean).sort()).toEqual(Object.entries(kept).map(([n, v]) => `${sha(v)}  files/${n}`).sort());

    // the order: the old marker removed before anything is written, the new one written last
    const calls = w.wranglerCalls().slice(before + 1).map((c) => `${c.argv[2]} ${c.argv[3].replace(`${BUCKET}/data/`, '')}`);
    const firstWrite = calls.findIndex((c) => c.startsWith('put') || c.startsWith('delete'));
    expect(calls[firstWrite]).toBe('delete accounts.enabled');
    expect(calls.filter((c) => c.startsWith('put')).at(-1)).toBe('put accounts.enabled');

    // the bucket now holds this copy and nothing else, and it restores
    const back = await restoreFrom(r2, join(w.dir, 'restored'));
    expect(back.keys).toEqual(names.map((n) => `data/${n}`));
    expect(readFileSync(join(w.dir, 'restored', 'users.json')).equals(readFileSync(join(data, 'users.json')))).toBe(true);
    expect(rows(join(w.dir, 'restored', 'bridge.sqlite')).length).toBe(400);

    // a later apply of the same folder: refused again (a store), the replaced-* folder does not upset the folder check
    const later = await run(['apply', copy, '--local', r2], w.env);
    expect(later.out).toMatch(/the folder is as prepared/);
    expect(later.out).toMatch(/already holds a store/);
    expectNoContent([leftover, refused, replaced, later].map((r) => r.out).join('\n'), markers, contentsUnder(data));
  }, 5 * MINUTES);

  it('on Cloudflare: needs the bucket, and sends every object call with --remote', async () => {
    const w = world('remote', oneMachine());
    const { db, markers } = fill(join(w.dir, 'machine', 'data'), { extra: false });
    db.close();
    const copy = join(w.dir, 'copy');
    expect((await run(['prepare', copy], w.env)).code).toBe(0);
    const cloudflare = join(w.dir, 'cloudflare');
    mkdirSync(join(cloudflare, 'other-bucket'), { recursive: true });
    const env = { ...w.env, FAKE_R2: cloudflare };

    const missing = await run(['apply', copy], env);
    expect(missing.code).toBe(1);
    expect(missing.out).toMatch(/the R2 bucket bizomat-mcp-data was not found: deploy the Worker first/);
    expect(w.wranglerCalls().map((c) => c.argv.slice(0, 3).join(' '))).toEqual(['r2 bucket list']);

    mkdirSync(join(cloudflare, BUCKET));
    const applied = await run(['apply', copy], env);
    expect(applied.code, applied.out).toBe(0);
    expect(applied.out).toMatch(/R2 bucket bizomat-mcp-data: found/);
    const objectCalls = w.wranglerCalls().filter((c) => c.argv[1] === 'object');
    for (const c of objectCalls) {
      expect(c.argv).toContain('--remote');
      expect(c.argv).not.toContain('--local');
      expect(c.argv).not.toContain('--persist-to');
    }
    expect(objectCalls.filter((c) => c.argv[2] === 'put').at(-1)!.argv[3]).toBe(`${BUCKET}/data/accounts.enabled`);
    for (const f of readJson<Manifest>(join(copy, 'manifest.json')).files) {
      expect(readFileSync(join(cloudflare, BUCKET, 'data', f.name)).equals(readFileSync(join(copy, 'files', f.name))), f.name).toBe(true);
    }
    const again = await run(['apply', copy], env);
    expect(again.code).toBe(1);
    expect(again.out).toMatch(/already holds a store/);
    expectNoContent(`${missing.out}\n${applied.out}\n${again.out}`, markers, contentsUnder(join(w.dir, 'machine', 'data')));
  }, 2 * MINUTES);

  it('removes its copy on the Machine when stopped with Ctrl-C', async () => {
    const w = world('ctrl-c', oneMachine());
    const data = join(w.dir, 'machine', 'data');
    const { db } = fill(data, { extra: false });
    db.close();
    const copy = join(w.dir, 'copy');
    // the download waits a minute on the Machine: Ctrl-C comes in the middle of it
    const child = spawn(process.execPath, [TOOL, 'prepare', copy], { env: { ...process.env, ...w.env, FAKEFLY_HANG: '^cat ' }, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const exited = new Promise<number | null>((ok) => child.on('exit', (code) => ok(code)));
    await new Promise<void>((ok, bad) => {
      const timer = setTimeout(() => bad(new Error(`no download started: ${out}`)), MINUTES);
      const seen = (d: Buffer) => {
        out += d;
        if (out.includes('downloading the copy')) {
          clearTimeout(timer);
          ok();
        }
      };
      child.stdout.on('data', seen);
      child.stderr.on('data', seen);
    });
    await new Promise((ok) => setTimeout(ok, 500));
    expect(readdirSync(join(data, 'incoming')).length).toBeGreaterThan(0); // the copy is on the Machine now
    process.kill(-child.pid!, 'SIGINT'); // the whole process group, as Ctrl-C in a terminal
    expect(await exited).toBe(130);
    expect(out).toMatch(/stopping \(Ctrl-C\)/);
    expect(out).toMatch(/removed the copy from the Machine/);
    expect(existsSync(join(data, 'incoming'))).toBe(false);
    expect(existsSync(copy)).toBe(false);
  }, 2 * MINUTES);
});
