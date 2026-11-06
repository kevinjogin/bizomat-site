#!/usr/bin/env node
// Move CAD Automation from the old Fly app `cados` into the cad group of the BIZOMAT Fly app `bizomat`, with its data,
// and point bizomat.ai/cad at it. Run from the owner's own computer, where flyctl is signed in: the data passes through
// no GitHub runner or CI. The owner runs it as `.\bizomat.ps1 move cad` (CADOS tools/laptop). It needs Node 22 and
// flyctl only: every check on this computer is done here in Node (no bash or Python needed on Windows).
//
//   node infrastructure/migrate/cad/to-fly.mjs check <folder>
//        Read only. Both apps and their Machines, the router's route to the cad group over the private network, the
//        settings (names only), room on both sides, and a copy of the data taken while cados keeps running, brought
//        here and checked file by file. Nothing changes (cados's /tmp holds that copy for a moment).
//   node infrastructure/migrate/cad/to-fly.mjs apply <folder>
//        The move (bizomat.ps1 asks first), in this order:
//          1. cados is kept awake (autostop off; its Machine restarts once)
//          2. bizomat.ai/cad goes to the cad group, whose holding page says "being moved" (the router's UPSTREAM_CAD)
//          3. cados is frozen: every Python process paused, so its data folder is still
//          4. the data is exported there and its settings read (values never shown); the copy comes here and is
//             checked: every file against the manifest, the stores readable, the signing key the one in use
//          5. the copy goes to the cad volume, is checked there and imported (what was there is kept in
//             /data/backups); the settings become /data/cad/.secrets files; the cad Machine restarts with the data
//          6. live checks through bizomat.ai: the same signing key, accounts (setup closed), OAuth, the version
//          7. cados is stopped and kept stopped (autostart off); its volume keeps its data for the way back
//        A failure in 2 to 6 takes the way back at once: the router to cados again, cados resumed.
//   node infrastructure/migrate/cad/to-fly.mjs back <folder>
//        The way back after a move: cados started, bizomat.ai/cad to cados again, the cad Machine into maintenance.
//        Changes made in the cad group since the move (sign-ins, refreshed AI app tokens, new pairings, commands) stay
//        on its volume; they are not carried back.
//   node infrastructure/migrate/cad/to-fly.mjs status [<folder>] [--json]
//        Where bizomat.ai/cad goes and how each side is.
//   node infrastructure/migrate/cad/to-fly.mjs retire-ips [<folder>] [--confirm cados]
//   node infrastructure/migrate/cad/to-fly.mjs delete-app [<folder>] [--confirm cados]
//        Retirement, after the owner confirms CAD Automation works in the cad group. Without --confirm they only show
//        what they would do. retire-ips releases cados's public addresses (cados.fly.dev, and every name that points
//        at them, stops answering); delete-app deletes the app, its Machine and its volume. Neither can be undone.
//
// Options: --from <app> (cados), --to <app> (bizomat), --force (apply: replace CAD data the cad group already holds; it
// is kept in /data/backups). FLYCTL names the flyctl program (default fly). For rehearsals: BIZOMAT_PUBLIC_URL (default
// https://bizomat.ai), BIZOMAT_ROUTER_ADDR (host:port; public requests go there over plain HTTP, Host kept),
// BIZOMAT_READY_URL (default https://<to>.fly.dev/__proxy/ready), BIZOMAT_MOVE_WAIT (seconds, default 180),
// BIZOMAT_FLY_CONFIG (the fly.website.toml the retirement reads; default the one in this repository).
// Prints steps, names, counts, ids and checksums only, never file contents or setting values. <folder> holds a copy of
// the data with every key in it: it stays on this computer; delete it when the rollback window ends.

import { spawn, spawnSync } from 'node:child_process';
import { createHash, createPublicKey, randomBytes } from 'node:crypto';
import dns from 'node:dns/promises';
import { closeSync, createReadStream, createWriteStream, existsSync, fstatSync, mkdirSync, mkdtempSync, openSync, readFileSync, readSync, rmSync, statSync, writeFileSync, writeSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..', '..');
const FLY = process.env.FLYCTL || 'fly';
const PUBLIC = (process.env.BIZOMAT_PUBLIC_URL || 'https://bizomat.ai').replace(/\/+$/, '');
const ROUTER_ADDR = process.env.BIZOMAT_ROUTER_ADDR || '';
const WAIT_S = Number(process.env.BIZOMAT_MOVE_WAIT || 180);
const MIGRATE = '/usr/local/lib/bizomat/migrate';
const HOLDING = '/usr/local/lib/bizomat/cad-holding.py';
const OLD_TMP = '/tmp/bizomat-cad'; // on cados: the move's scripts and its export, removed before cados stops
const RUN_TMP = '/tmp/bizomat-run'; // on either Machine: each remote script, for the moment it runs
const INCOMING = '/data/incoming'; // on the cad Machine (root only; made by the entrypoint)
const MAINTENANCE = '/data/.bizomat-maintenance';
const CAD_PORT = 8001;
const OLD_PORT = 8080;
// What a CAD Automation data folder must hold to be one with accounts (verify.sh says what each file is)
const REQUIRED = ['users.json', 'accounts.enabled', 'secret.keys', 'bridge-signing-key.pem'];
const IMPORTANT = ['sessions.json', 'mcp_oauth.json', 'bridge.sqlite', 'swbridge.json'];
// Settings that move with the data: CAD Automation's own (the cad role is passed OPENSKETCH_* and GOOGLE_CLIENT_*)
const CAD_SETTING = (n) => (/^OPENSKETCH_[A-Z0-9_]+$/.test(n) && !['OPENSKETCH_DATA', 'OPENSKETCH_VERSION'].includes(n)) ||
  n === 'GOOGLE_CLIENT_ID' || n === 'GOOGLE_CLIENT_SECRET';
const USAGE = 'usage: to-fly.mjs check|apply|back <folder> | status [<folder>] [--json] | retire-ips|delete-app [<folder>] [--confirm <app>]  [--from cados] [--to bizomat] [--force]';

class Stop extends Error {}
const say = (s = '') => console.log(s);
const step = (s) => say(`\n== ${s}`);
const note = (s) => say(`note: ${s}`);
const stop = (s) => { throw new Stop(s); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parse(argv) {
  const [cmd, ...rest] = argv;
  if (!['check', 'apply', 'back', 'status', 'retire-ips', 'delete-app'].includes(cmd)) stop(USAGE);
  const o = { cmd, folder: '', from: 'cados', to: 'bizomat', force: false, json: false, confirm: '' };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (['--from', '--to', '--confirm'].includes(a)) {
      const v = rest[++i];
      if (!v || v.startsWith('--')) stop(USAGE);
      o[a.slice(2)] = v;
    } else if (a === '--force') o.force = true;
    else if (a === '--json') o.json = true;
    else if (!a.startsWith('--') && !o.folder) o.folder = resolve(a);
    else stop(USAGE);
  }
  if (['check', 'apply', 'back'].includes(cmd) && !o.folder) stop(USAGE);
  for (const k of ['from', 'to']) if (!/^[a-z0-9-]+$/.test(o[k])) stop(`--${k}: a Fly app name`);
  o.oldUrl = `http://${o.from}.internal:${OLD_PORT}`;
  o.newUrl = `http://cad.process.${o.to}.internal:${CAD_PORT}`;
  o.readyUrl = process.env.BIZOMAT_READY_URL || `https://${o.to}.fly.dev/__proxy/ready`;
  if (o.json) console.log = (...a) => process.stderr.write(`${a.join(' ')}\n`); // --json: the report alone on stdout
  return o;
}

// ----------------------------------------------------------------------------- flyctl

function fly(args, { input, inherit = false, allowFail = false } = {}) {
  const r = spawnSync(FLY, args, {
    encoding: 'utf8', input, maxBuffer: 512 << 20,
    stdio: inherit ? ['ignore', 'inherit', 'inherit'] : ['pipe', 'pipe', 'pipe'],
  });
  if (r.error) stop(`${FLY} could not run (${r.error.code}): install flyctl and sign in (fly auth login)`);
  if (r.status !== 0 && !allowFail) {
    const why = `${r.stderr || ''}${r.stdout || ''}`.trim().split('\n').slice(-3).join(' ').slice(0, 300);
    stop(`fly ${args.slice(0, 3).join(' ')} failed (exit code ${r.status})${why ? `: ${why}` : ''}`);
  }
  return r;
}

function flyJson(args) {
  const out = fly([...args, '--json']).stdout;
  const from = out.search(/[[{]/);
  try { return JSON.parse(from >= 0 ? out.slice(from) : out); } catch { return stop(`fly ${args.slice(0, 2).join(' ')} gave no JSON`); }
}

function machines(app) {
  const list = flyJson(['machines', 'list', '--app', app]);
  return (Array.isArray(list) ? list : []).map((m) => ({
    id: m.id, state: m.state, region: m.region,
    group: m.config?.metadata?.fly_process_group ?? m.process_group ?? '',
    env: m.config?.env ?? {}, mounts: m.config?.mounts ?? [], services: m.config?.services ?? [],
    // the image's tag: bizomat.ps1 deploys with --image-label bizomat-<commit>, so it says which commit runs
    image: m.image_ref?.tag ?? '',
  }));
}

function volumes(app) {
  const list = flyJson(['volumes', 'list', '--app', app]);
  return (Array.isArray(list) ? list : []).map((v) => ({
    id: v.id, name: v.name, region: v.region, size: v.size_gb ?? v.SizeGb ?? 0,
    machine: v.attached_machine_id ?? v.AttachedMachine?.id ?? '', state: v.state,
  }));
}

function secretNames(app) {
  const list = flyJson(['secrets', 'list', '--app', app]);
  return (Array.isArray(list) ? list : []).map((s) => s.name ?? s.Name).filter(Boolean);
}

/** Runs a script on a Machine as root. The script travels in base64 (no quoting problems on any shell) and is
 * removed afterwards; args must be plain tokens. stdin is `input`; stdout and stderr come back (or are shown). */
function remote(app, machine, script, { args = [], input, interp = 'bash', allowFail = false, inherit = false } = {}) {
  for (const a of args) if (!/^[A-Za-z0-9_./:=@%+,-]+$/.test(a)) stop(`internal: unsafe remote argument ${JSON.stringify(a)}`);
  const file = `${RUN_TMP}/bz-${randomBytes(6).toString('hex')}`;
  const b64 = Buffer.from(script).toString('base64');
  const command = `bash -c 'umask 077; mkdir -p ${RUN_TMP} && printf %s ${b64} | base64 -d > ${file} && ${interp} ${file}${args.length ? ` ${args.join(' ')}` : ''}; rc=$?; rm -f ${file}; exit $rc'`;
  return fly(['ssh', 'console', '--app', app, '--machine', machine, '--quiet', '--command', command], { input, inherit, allowFail });
}

const sh = (app, machine, script, opts) => remote(app, machine, script, opts);
const py = (app, machine, script, opts = {}) => remote(app, machine, script, { ...opts, interp: 'python3' });

async function waitSsh(app, machine, what) {
  for (let i = 0; i < Math.ceil(WAIT_S / 3); i++) {
    if (sh(app, machine, 'true', { allowFail: true }).status === 0) return;
    await sleep(3000);
  }
  stop(`${what} did not come back: look at fly logs --app ${app}`);
}

// /healthz on the Machine itself: the CAD server ({ok: true, version}) or the holding page ({ok: false, status})
const PROBE = `import json, sys, urllib.request
try:
    r = urllib.request.urlopen(sys.argv[1] + "/healthz", timeout=8)
    body = r.read().decode("utf-8", "replace")
    try:
        j = json.loads(body)
    except ValueError:
        j = {"ok": False, "status": "not-json"}
    j["http"] = r.status
except Exception as e:
    j = {"ok": False, "status": "no-answer", "error": getattr(getattr(e, "reason", None), "errno", None) or e.__class__.__name__}
print("BZ-PROBE " + json.dumps(j))
`;

function probe(app, machine, url) {
  const out = py(app, machine, PROBE, { args: [url], allowFail: true }).stdout || '';
  const line = out.split('\n').find((l) => l.startsWith('BZ-PROBE '));
  try { return line ? JSON.parse(line.slice(9)) : { ok: false, status: 'no-answer' }; } catch { return { ok: false, status: 'no-answer' }; }
}

async function waitProbe(app, machine, url, test, what) {
  let last = {};
  for (let i = 0; i < Math.ceil(WAIT_S / 4); i++) {
    last = probe(app, machine, url);
    if (test(last)) return last;
    await sleep(4000);
  }
  return stop(`${what}: no (last answer ${JSON.stringify({ ok: last.ok, status: last.status, version: last.version })})`);
}

// ----------------------------------------------------------------------------- files across

function sha256File(file) {
  const h = createHash('sha256');
  const fd = openSync(file, 'r');
  const buf = Buffer.alloc(1 << 20);
  try {
    for (let n; (n = readSync(fd, buf, 0, buf.length, null)) > 0;) h.update(buf.subarray(0, n));
  } finally { closeSync(fd); }
  return h.digest('hex');
}

function remoteSha(app, machine, path) {
  const out = sh(app, machine, `sha256sum ${path} 2>/dev/null || true`).stdout || '';
  return (out.match(/\b[0-9a-f]{64}\b/) || [])[0] || '';
}

/** Raw bytes into a file on the Machine over ssh's stdin (no terminal, so the bytes pass unchanged). */
function streamTo(app, machine, local, remotePath) {
  return new Promise((done) => {
    const command = `bash -c 'umask 077; cat > ${remotePath}'`;
    const child = spawn(FLY, ['ssh', 'console', '--app', app, '--machine', machine, '--quiet', '--command', command], { stdio: ['pipe', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', () => done(false));
    child.on('close', (code) => {
      if (code !== 0) say(`  streaming failed (exit code ${code}): ${err.trim().split('\n').pop() ?? ''}`);
      done(code === 0);
    });
    createReadStream(local).pipe(child.stdin).on('error', () => {});
  });
}

/** Raw bytes from a file on the Machine over ssh's stdout. */
function streamFrom(app, machine, remotePath, local) {
  return new Promise((done) => {
    const child = spawn(FLY, ['ssh', 'console', '--app', app, '--machine', machine, '--quiet', '--command', `cat ${remotePath}`], { stdio: ['ignore', 'pipe', 'pipe'] });
    const out = createWriteStream(local, { mode: 0o600 });
    let err = '';
    child.stderr.on('data', (d) => { err += d; });
    child.stdout.pipe(out);
    child.on('error', () => done(false));
    child.on('close', (code) => out.end(() => {
      if (code !== 0) say(`  streaming failed (exit code ${code}): ${err.trim().split('\n').pop() ?? ''}`);
      done(code === 0);
    }));
  });
}

const PIECE = 3 << 20; // 3 MiB a piece for the base64 ways: text passes where raw bytes might not

async function upload(app, machine, local, remotePath, sha) {
  const part = `${remotePath}.part`;
  const size = statSync(local).size;
  say(`  ${size} bytes to ${app} ${machine}:${remotePath}`);
  const ways = [
    ['over ssh', async () => streamTo(app, machine, local, part)],
    ['with sftp', async () => {
      sh(app, machine, `rm -f ${part}`, { allowFail: true });
      return fly(['ssh', 'sftp', 'put', local, part, '--app', app, '--machine', machine, '--quiet'], { allowFail: true }).status === 0;
    }],
    ['in base64 pieces', async () => {
      sh(app, machine, `: > ${part}`);
      const fd = openSync(local, 'r');
      try {
        const buf = Buffer.alloc(PIECE);
        for (let n, i = 0; (n = readSync(fd, buf, 0, PIECE, null)) > 0; i++) {
          const r = sh(app, machine, `base64 -d >> ${part}`, { input: buf.subarray(0, n).toString('base64'), allowFail: true });
          if (r.status !== 0) return false;
          if ((i + 1) % 10 === 0) say(`    ${Math.round(((i + 1) * PIECE * 100) / size)}%`);
        }
      } finally { closeSync(fd); }
      return true;
    }],
  ];
  for (const [how, go] of ways) {
    if ((await go()) && remoteSha(app, machine, part) === sha) {
      sh(app, machine, `chmod 0600 ${part} && mv ${part} ${remotePath}`);
      say(`  sent ${how}; sha256 ${sha.slice(0, 16)}... the same on both sides`);
      return;
    }
    say(`  not sent ${how}; trying the next way`);
  }
  sh(app, machine, `rm -f ${part}`, { allowFail: true });
  stop(`the copy could not be sent to ${app} intact (sha256 differs every way)`);
}

async function download(app, machine, remotePath, local, sha, size) {
  const ways = [
    ['with sftp', async () => fly(['ssh', 'sftp', 'get', remotePath, local, '--app', app, '--machine', machine, '--quiet'], { allowFail: true }).status === 0],
    ['over ssh', async () => streamFrom(app, machine, remotePath, local)],
    ['in base64 pieces', async () => {
      const pieces = Math.max(1, Math.ceil(size / PIECE));
      const out = openSync(local, 'w', 0o600);
      try {
        for (let i = 0; i < pieces; i++) {
          const r = sh(app, machine, `echo BZ-BEGIN; dd if=${remotePath} bs=${PIECE} skip=${i} count=1 2>/dev/null | base64 -w0; echo; echo BZ-END`, { allowFail: true });
          const m = /BZ-BEGIN\s*\n([A-Za-z0-9+/=]*)\s*\nBZ-END/.exec(r.stdout || '');
          if (r.status !== 0 || !m) return false;
          const b = Buffer.from(m[1], 'base64');
          for (let off = 0; off < b.length;) off += writeSync(out, b, off, b.length - off);
          if ((i + 1) % 10 === 0) say(`    ${Math.round(((i + 1) * 100) / pieces)}%`);
        }
      } finally { closeSync(out); }
      return true;
    }],
  ];
  for (const [how, go] of ways) {
    rmSync(local, { force: true });
    if ((await go()) && existsSync(local) && sha256File(local) === sha) {
      say(`  brought here ${how}: ${statSync(local).size} bytes, sha256 ${sha.slice(0, 16)}... the same on both sides`);
      return;
    }
    say(`  not brought ${how}; trying the next way`);
  }
  rmSync(local, { force: true });
  stop(`the copy could not be brought here intact from ${app}`);
}

// ----------------------------------------------------------------------------- the copy, checked here

function* tarEntries(fd, total) {
  const hdr = Buffer.alloc(512);
  let pos = 0;
  let longName = null;
  while (pos + 512 <= total) {
    readSync(fd, hdr, 0, 512, pos);
    if (hdr.every((b) => b === 0)) return;
    const field = (o, n) => {
      const s = hdr.subarray(o, o + n);
      const z = s.indexOf(0);
      return s.subarray(0, z < 0 ? n : z).toString('utf8');
    };
    let size = 0;
    if (hdr[124] & 0x80) for (let i = 125; i < 136; i++) size = size * 256 + hdr[i];
    else size = parseInt(field(124, 12).trim() || '0', 8);
    const type = hdr[156] ? String.fromCharCode(hdr[156]) : '0';
    pos += 512;
    const padded = Math.ceil(size / 512) * 512;
    if (type === 'L') {
      const b = Buffer.alloc(size);
      readSync(fd, b, 0, size, pos);
      longName = b.toString('utf8').replace(/\0+$/, '');
      pos += padded;
      continue;
    }
    let name = longName ?? field(0, 100);
    if (longName === null && hdr.subarray(257, 263).toString('latin1') === 'ustar\0') {
      const prefix = field(345, 155);
      if (prefix) name = `${prefix}/${name}`;
    }
    longName = null;
    yield { name: name.replace(/^(\.\/)+/, ''), type, size, offset: pos };
    pos += padded;
  }
}

function readEntry(fd, e) {
  const b = Buffer.alloc(e.size);
  if (e.size) readSync(fd, b, 0, e.size, e.offset);
  return b;
}

function shaEntry(fd, e) {
  const h = createHash('sha256');
  const buf = Buffer.alloc(Math.min(1 << 20, Math.max(1, e.size)));
  for (let done = 0; done < e.size;) {
    const n = readSync(fd, buf, 0, Math.min(buf.length, e.size - done), e.offset + done);
    if (n <= 0) break;
    h.update(buf.subarray(0, n));
    done += n;
  }
  return h.digest('hex');
}

/** RFC 7638 thumbprint of a P-256 key: CAD Automation's key id (devicebridge.thumbprint, /v2/keys kid). */
function kidOf(pem) {
  const jwk = createPublicKey(pem).export({ format: 'jwk' });
  return createHash('sha256').update(JSON.stringify({ crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y })).digest('base64url');
}

async function sqliteFacts(files, fd, problems) {
  const db = files.get('bridge.sqlite');
  if (!db) return null;
  let mod;
  const emit = process.emitWarning;
  process.emitWarning = (w, ...rest) => (String(w).includes('SQLite') ? undefined : emit.call(process, w, ...rest));
  try { mod = await import('node:sqlite'); } catch { mod = null; } finally { process.emitWarning = emit; }
  if (!mod) return 'bridge: (checked on the cad Machine; this Node has no node:sqlite)';
  const dir = mkdtempSync(join(tmpdir(), 'bizomat-cad-sqlite-'));
  try {
    for (const suffix of ['', '-wal', '-shm', '-journal']) {
      const e = files.get(`bridge.sqlite${suffix}`);
      if (e) writeFileSync(join(dir, `bridge.sqlite${suffix}`), readEntry(fd, e), { mode: 0o600 });
    }
    const con = new mod.DatabaseSync(join(dir, 'bridge.sqlite'));
    try {
      const ok = Object.values(con.prepare('PRAGMA integrity_check').get() ?? {})[0];
      if (ok !== 'ok') problems.push('bridge.sqlite fails its integrity check');
      const counts = ['devices', 'pairings', 'commands'].map((t) => {
        try { return `${t} ${Object.values(con.prepare(`SELECT count(*) FROM ${t}`).get())[0]}`; } catch { return `${t} (none)`; }
      });
      return `bridge: ${counts.join(', ')}`;
    } finally { con.close(); }
  } catch (e) {
    problems.push(`bridge.sqlite cannot be opened (${e.code || e.name})`);
    return null;
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

/** Every file against the manifest, then the stores: the same checks as verify.sh, with the same fact lines. */
async function verifyArchive(file) {
  const fd = openSync(file, 'r');
  const problems = [];
  const notes = [];
  const facts = [];
  try {
    const files = new Map();
    let manifest = null;
    let info = '';
    for (const e of tarEntries(fd, fstatSync(fd).size)) {
      const parts = e.name.split('/').filter((p) => p && p !== '.');
      if (e.name.startsWith('/') || parts.includes('..')) { problems.push(`unsafe path in the archive: ${e.name}`); continue; }
      if (!parts.length || e.type === '5') continue;
      if (e.type !== '0' && e.type !== '7') { problems.push(`not a file: ${e.name}`); continue; }
      if (parts.length === 1 && parts[0] === 'MANIFEST.sha256') manifest = readEntry(fd, e).toString('utf8');
      else if (parts.length === 1 && parts[0] === 'EXPORT-INFO') info = readEntry(fd, e).toString('utf8');
      else if (parts[0] === 'data' && parts.length > 1) files.set(parts.slice(1).join('/'), e);
      else problems.push(`outside data/: ${e.name}`);
    }
    if (manifest === null) problems.push('MANIFEST.sha256 is missing');
    const listed = new Map();
    for (const line of (manifest ?? '').split('\n')) {
      if (!line) continue;
      const m = /^([0-9a-f]{64}) [ *](data\/.+)$/.exec(line);
      if (!m) { problems.push('a manifest line is not a sha256sum line'); continue; }
      listed.set(m[2].slice(5), m[1]);
    }
    const missing = [];
    const changed = [];
    let bytes = 0;
    for (const [name, sha] of listed) {
      const e = files.get(name);
      if (!e) missing.push(name);
      else if (shaEntry(fd, e) !== sha) changed.push(name);
      else bytes += e.size;
    }
    const extra = [...files.keys()].filter((n) => !listed.has(n));
    say(`  manifest: ${listed.size} listed, ${listed.size - missing.length - changed.length} match, ${missing.length} missing, ${changed.length} changed, ${extra.length} not listed (${bytes} bytes)`);
    for (const [label, names] of [['missing', missing], ['changed', changed], ['not listed', extra]]) {
      if (names.length) problems.push(`${names.length} ${label}, e.g. ${names[0]}`);
    }
    for (const n of REQUIRED) if (!files.has(n)) problems.push(`${n} is missing: this is not a CAD Automation data folder with accounts`);
    for (const n of IMPORTANT) if (!files.has(n)) notes.push(`${n} is not in the folder (that state does not exist on the old server yet)`);
    const json = (n) => {
      const e = files.get(n);
      if (!e) return undefined;
      try { return JSON.parse(readEntry(fd, e).toString('utf8')); } catch { problems.push(`${n} does not parse`); return null; }
    };
    const users = json('users.json');
    if (users && typeof users === 'object') facts.push(`accounts ${(users.users ?? []).length}, invites ${(users.invites ?? []).length}`);
    const sessions = json('sessions.json');
    if (sessions && typeof sessions === 'object') facts.push(`browser sessions ${Object.keys(sessions).length}`);
    const oauth = json('mcp_oauth.json');
    let byHost = {};
    if (oauth && typeof oauth === 'object') {
      facts.push(`AI apps: clients ${Object.keys(oauth.clients ?? {}).length}, grants ${Object.keys(oauth.grants ?? {}).length}`);
      for (const g of Object.values(oauth.grants ?? {})) {
        let host = '?';
        try { host = new URL(g.resource).host; } catch { /* no resource */ }
        byHost[host] = (byHost[host] ?? 0) + 1;
      }
    }
    for (const n of ['swbridge.json', 'google_oauth.json', 'bridge-release.json']) json(n);
    for (const n of ['secret.keys', 'secret', 'ai_keys.secret']) {
      const e = files.get(n);
      if (e && readEntry(fd, e).toString('utf8').trim().length < 32) problems.push(`${n} is shorter than expected`);
    }
    let kid = '';
    const pem = files.get('bridge-signing-key.pem');
    if (pem) {
      const text = readEntry(fd, pem).toString('utf8');
      if (!text.startsWith('-----BEGIN PRIVATE KEY-----')) problems.push('bridge-signing-key.pem is not a PKCS#8 PEM private key');
      else {
        try { kid = kidOf(text); } catch { problems.push('bridge-signing-key.pem does not hold a P-256 key'); }
      }
    }
    const bridge = await sqliteFacts(files, fd, problems);
    if (bridge) facts.push(bridge);
    for (const folder of ['uploads', 'artifacts', 'bridge-files']) {
      const n = [...files.keys()].filter((f) => f.startsWith(`${folder}/`)).length;
      if (n || [...files.keys()].some((f) => f === folder)) facts.push(`${folder} ${n} files`);
    }
    return { problems, notes, facts, kid, files: listed.size, bytes, info, byHost };
  } finally { closeSync(fd); }
}

/** The fact lines verify.sh prints ("verify: accounts 3, invites 0" -> "accounts 3, invites 0"). */
function factsFrom(text) {
  return (text || '').split('\n').map((l) => l.replace(/^verify: /, '').trim())
    .filter((l) => /^(accounts|browser sessions|AI apps:|bridge:|uploads|artifacts|bridge-files) /.test(l));
}

function sameFacts(a, b) {
  // without node:sqlite here, the bridge counts are compared on the cad Machine only (verify.sh, there and installed)
  const noBridge = [...a, ...b].some((x) => x.startsWith('bridge: (checked'));
  const norm = (l) => l.filter((x) => !(noBridge && x.startsWith('bridge:'))).sort().join('\n');
  return norm(a) === norm(b);
}

// ----------------------------------------------------------------------------- public checks (through the router)

function request(url, { method = 'GET', headers = {}, body } = {}) {
  const u = new URL(url);
  let mod = u.protocol === 'https:' ? https : http;
  let host = u.hostname;
  let port = u.port || (u.protocol === 'https:' ? 443 : 80);
  if (ROUTER_ADDR && u.origin === new URL(PUBLIC).origin) {
    mod = http;
    [host, port] = [ROUTER_ADDR.replace(/:\d+$/, ''), Number(ROUTER_ADDR.split(':').pop())];
  }
  return new Promise((done) => {
    const req = mod.request({
      host, port, method, path: `${u.pathname}${u.search}`, timeout: 20_000,
      headers: { Host: u.host, 'User-Agent': 'bizomat-move-cad', ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}), ...headers },
    }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (d) => { if (text.length < 1 << 20) text += d; });
      res.on('end', () => done({ status: res.statusCode, headers: res.headers, text }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (e) => done({ status: 0, headers: {}, text: '', error: e.code || e.message }));
    if (body) req.write(body);
    req.end();
  });
}

const parseJson = (t) => { try { return JSON.parse(t); } catch { return null; } };

async function publicHealth() {
  const r = await request(`${PUBLIC}/cad/healthz`);
  const j = parseJson(r.text);
  return { ...(j && typeof j === 'object' ? j : {}), http: r.status };
}

async function publicKid() {
  const r = await request(`${PUBLIC}/cad/v2/keys`);
  const j = parseJson(r.text);
  return (r.status === 200 && j?.keys?.[0]?.kid) || '';
}

async function within(seconds, test) {
  const end = Date.now() + seconds * 1000;
  let last;
  for (;;) {
    try { last = await test(); } catch (e) { last = { fail: String(e.message || e) }; }
    if (last === true) return true;
    if (Date.now() > end) return last;
    await sleep(3000);
  }
}

const MCP_INIT = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'bizomat-move-cad', version: '1' } } });

async function liveChecks(want) {
  const checks = [
    ['bizomat.ai/cad/healthz: the CAD server answers' + (want.version ? ` (CADOS ${want.version})` : ''), async () => {
      const h = await publicHealth();
      return (h.ok === true && (!want.version || h.version === want.version)) || { fail: `HTTP ${h.http}, ok ${h.ok}, version ${h.version ?? '-'}${h.status ? `, ${h.status}` : ''}` };
    }],
    ['the same signing key: paired computers keep trusting it (/cad/v2/keys)', async () => {
      const kid = await publicKid();
      return (kid && kid === want.kid) || { fail: kid ? 'a different key id' : 'no key' };
    }],
    ['accounts are there: setup is closed (/cad/setup -> sign-in)', async () => {
      const r = await request(`${PUBLIC}/cad/setup`, { headers: { Accept: 'text/html' } });
      return ([302, 303].includes(r.status) && /\/cad\/login/.test(r.headers.location || '')) || { fail: `HTTP ${r.status} ${r.headers.location || ''}` };
    }],
    ['AI apps: /cad/mcp asks for sign-in with the metadata at the root (401)', async () => {
      const r = await request(`${PUBLIC}/cad/mcp`, { method: 'POST', body: MCP_INIT, headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' } });
      return (r.status === 401 && /\/\.well-known\/oauth-protected-resource\/cad\/mcp/.test(r.headers['www-authenticate'] || '')) || { fail: `HTTP ${r.status}` };
    }],
    ['OAuth: the protected resource is still https://bizomat.ai/cad/mcp', async () => {
      const r = await request(`${PUBLIC}/.well-known/oauth-protected-resource/cad/mcp`);
      const j = parseJson(r.text);
      return (r.status === 200 && j?.resource === `${PUBLIC}/cad/mcp`) || { fail: `HTTP ${r.status} ${j?.resource ?? ''}` };
    }],
  ];
  let ok = true;
  for (const [what, test] of checks) {
    const r = await within(60, test);
    if (r === true) say(`  ok    ${what}`);
    else { say(`  FAIL  ${what}: ${r?.fail ?? 'no'}`); ok = false; }
  }
  return ok;
}

// ----------------------------------------------------------------------------- the two sides

function pinShort() {
  try { return JSON.parse(readFileSync(join(ROOT, 'apps', 'cad-source.json'), 'utf8')).commit.slice(0, 7); } catch { return ''; }
}

function autostopOff(m) {
  return m.services.length > 0 && m.services.every((s) => s.autostop === 'off' || s.autostop === false);
}

/** Both apps, read only: Machines, volumes, the route, the cad Machine's state. Starts a Machine only if it is stopped. */
async function sides(o, { quiet = false } = {}) {
  const log = quiet ? () => {} : say;
  if (fly(['auth', 'whoami'], { allowFail: true }).status !== 0) stop('flyctl is not signed in: fly auth login');
  const oldMs = machines(o.from);
  if (oldMs.length !== 1) stop(`${o.from} has ${oldMs.length} Machines; this expects exactly one, the one with the data`);
  const old = oldMs[0];
  const oldVol = volumes(o.from).find((v) => v.machine === old.id);
  if (!oldVol || !old.mounts.some((m) => m.path === '/data')) stop(`${o.from}'s Machine has no volume at /data`);
  const all = machines(o.to);
  const cads = all.filter((m) => m.group === 'cad');
  if (cads.length === 0) stop(`${o.to} has no cad Machine yet: run .\\bizomat.ps1 deploy website first (it makes the cad group and its volume)`);
  if (cads.length > 1) stop(`${o.to} has ${cads.length} cad Machines: it must have exactly one (each would have a volume of its own)`);
  const cad = cads[0];
  const proxies = all.filter((m) => m.group === 'proxy');
  if (proxies.length === 0) stop(`${o.to} has no proxy Machine (the router)`);
  const cadVol = volumes(o.to).find((v) => v.machine === cad.id);
  if (!cadVol || cadVol.name !== 'cad_data') stop(`the cad Machine has no volume cad_data at /data (fly volumes list --app ${o.to})`);
  const ups = [...new Set(proxies.map((p) => p.env.UPSTREAM_CAD || ''))];
  const route = ups.length !== 1 ? 'mixed' : ups[0] === o.oldUrl ? 'old' : ups[0] === o.newUrl ? 'new' : 'other';
  log(`${o.from}: Machine ${old.id} (${old.state}, ${old.region}); volume ${oldVol.name} ${oldVol.id} (${oldVol.size} GB, ${oldVol.region})`);
  log(`${o.to}: cad Machine ${cad.id} (${cad.state}, ${cad.region}); volume ${cadVol.name} ${cadVol.id} (${cadVol.size} GB, ${cadVol.region}); router Machines ${proxies.map((p) => p.id).join(', ')}`);
  log(`bizomat.ai/cad goes to: ${route === 'old' ? `${o.from} (${o.oldUrl})` : route === 'new' ? `the cad group (${o.newUrl})` : ups.join(' | ') || 'nowhere'}`);
  if (cad.region !== 'syd') log(`note: the cad Machine is in ${cad.region}, not syd`);
  return { old, oldVol, cad, cadVol, proxies, route, ups };
}

function ensureStarted(app, m, what) {
  if (m.state === 'started') return false;
  say(`${what} is ${m.state}: starting it`);
  fly(['machine', 'start', m.id, '--app', app], { inherit: true, allowFail: true });
  return true;
}

/** The cad Machine: its image has the move tools, what /healthz says, whether its volume holds CAD data. */
function cadState(o, s) {
  const tools = sh(o.to, s.cad.id, `test -f ${MIGRATE}/cad/import.sh && test -f ${MIGRATE}/cad/verify.sh && test -f ${HOLDING} && echo tools-ok`, { allowFail: true }).stdout || '';
  const data = sh(o.to, s.cad.id, 'if [ -e /data/cad/users.json ] || [ -e /data/cad/accounts.enabled ]; then echo has-data; else echo no-data; fi; if [ -e /data/.bizomat-maintenance ]; then echo maintenance; fi', { allowFail: true }).stdout || '';
  return {
    tools: tools.includes('tools-ok'), hasData: data.includes('has-data'), maintenance: /^maintenance$/m.test(data),
    health: probe(o.to, s.cad.id, `http://127.0.0.1:${CAD_PORT}`),
  };
}

function kb(app, machine, script) {
  const n = Number((sh(app, machine, script, { allowFail: true }).stdout || '').trim().split(/\s+/).pop());
  return Number.isFinite(n) ? n : -1;
}

// Values of the given settings, from the CAD server's own environment (the lowest-numbered process running
// "-m opensketch"), else this session's. Printed as NAME BASE64 lines (NAME - when not set): read by this program
// alone, never shown.
const READ_SETTINGS = `import base64, os, sys
best = None
for d in os.listdir("/proc"):
    if not d.isdigit():
        continue
    try:
        cmd = open("/proc/%s/cmdline" % d, "rb").read().split(b"\\0")
    except OSError:
        continue
    if b"-m" in cmd and b"opensketch" in cmd and (best is None or int(d) < best):
        best = int(d)
env = None
if best is not None:
    try:
        raw = open("/proc/%d/environ" % best, "rb").read()
        env = dict(kv.split(b"=", 1) for kv in raw.split(b"\\0") if b"=" in kv)
    except OSError:
        env = None
print("BZ-SOURCE " + ("server" if env is not None else "session"))
if env is None:
    env = {k.encode(): v.encode() for k, v in os.environ.items()}
for name in sys.argv[1:]:
    v = env.get(name.encode())
    print("BZ-SETTING %s %s" % (name, base64.b64encode(v).decode() if v is not None else "-"))
`;

// Writes NAME BASE64 lines from stdin as /data/cad/.secrets/NAME (root, 0600): the cad role reads them at its start.
const WRITE_SETTINGS = `import base64, os, re, sys
d = "/data/cad/.secrets"
os.makedirs(d, mode=0o700, exist_ok=True)
os.chmod(d, 0o700)
done = []
for line in sys.stdin:
    parts = line.split()
    if len(parts) != 2 or not re.fullmatch(r"[A-Z][A-Z0-9_]{0,127}", parts[0]) or parts[1] == "-":
        continue
    tmp = os.path.join(d, "." + parts[0] + ".tmp")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "wb") as fh:
        fh.write(base64.b64decode(parts[1]))
    os.replace(tmp, os.path.join(d, parts[0]))
    done.append(parts[0])
print("BZ-WRITTEN " + " ".join(done))
`;

function readSettings(o, old, names) {
  if (!names.length) return { values: new Map(), source: 'none' };
  const out = py(o.from, old.id, READ_SETTINGS, { args: names }).stdout || '';
  const values = new Map();
  for (const line of out.split('\n')) {
    const m = /^BZ-SETTING ([A-Z][A-Z0-9_]*) (\S+)$/.exec(line.trim());
    if (m && m[2] !== '-') values.set(m[1], m[2]);
  }
  return { values, source: (/^BZ-SOURCE (\w+)/m.exec(out) || [])[1] || '?' };
}

/** The settings that move with the data, and the plain ones that must already be the same on both sides. */
function settingsPlan(o, s) {
  const secrets = secretNames(o.from);
  const carry = secrets.filter(CAD_SETTING);
  for (const n of ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']) if (s.old.env[n] !== undefined && !carry.includes(n)) carry.push(n);
  const others = secrets.filter((n) => !CAD_SETTING(n));
  const plain = Object.keys(s.old.env).filter((n) => n.startsWith('OPENSKETCH_') && !['OPENSKETCH_DATA', 'OPENSKETCH_VERSION'].includes(n));
  const differ = plain.filter((n) => s.old.env[n] !== s.cad.env[n] && !carry.includes(n));
  const newSecrets = secretNames(o.to).filter(CAD_SETTING);
  return { carry, others, plain, differ, newSecrets };
}

function showPlan(o, plan) {
  say(`settings that move with the data (values never shown): ${plan.carry.join(', ') || 'none'}`);
  if (plan.others.length) note(`${o.from} also has ${plan.others.join(', ')}: not CAD Automation settings, so they do not move`);
  if (plan.newSecrets.length) note(`${o.to} has Fly secrets ${plan.newSecrets.join(', ')}: the moved values (files on the cad volume) take their place for cad`);
  say(`plain settings of ${o.from}, the same on the cad group: ${plan.plain.filter((n) => !plan.differ.includes(n)).join(', ') || 'none'}`);
  if (plan.differ.length) {
    stop(`${o.from} has settings the cad group does not have the same: ${plan.differ.join(', ')}. Add them to fly.website.toml [env] in gocore-website (a pull request), deploy website, then run this again.`);
  }
}

async function putScripts(o, old) {
  sh(o.from, old.id, `mkdir -p ${OLD_TMP} && chmod 0700 ${OLD_TMP}`);
  for (const f of ['freeze.sh', 'export.sh']) {
    const local = join(HERE, f);
    await upload(o.from, old.id, local, `${OLD_TMP}/${f}`, sha256File(local));
  }
}

/** export.sh on the old Machine into its /tmp; returns the archive's name, sha256 and size, and the export's log. */
function exportThere(o, old, name) {
  const r = sh(o.from, old.id, `bash ${OLD_TMP}/export.sh /data > ${OLD_TMP}/${name} 2> ${OLD_TMP}/export.log; rc=$?; cat ${OLD_TMP}/export.log; exit $rc`, { allowFail: true });
  const log = (r.stdout || '').split('\n').filter((l) => l.startsWith('export:') || l.startsWith('  ')).join('\n');
  if (r.status !== 0) stop(`the export failed on ${o.from}:\n${log}`);
  const streamSha = (/stream sha256 ([0-9a-f]{64})/.exec(log) || [])[1] || '';
  const fileSha = remoteSha(o.from, old.id, `${OLD_TMP}/${name}`);
  if (!streamSha || streamSha !== fileSha) stop(`the export on ${o.from} is not intact (its stream and its file differ)`);
  const size = Number((sh(o.from, old.id, `stat -c %s ${OLD_TMP}/${name}`).stdout || '').trim());
  return { name, sha: fileSha, size, log };
}

function stamp() {
  return new Date().toISOString().replace(/\.\d+Z$/, 'Z').replace(/[-:]/g, '').replace('T', '-').replace('Z', '');
}

function printVerify(v) {
  for (const f of v.facts) say(`  ${f}`);
  const hosts = Object.entries(v.byHost);
  if (hosts.length) say(`  AI app connections by the address they were made with: ${hosts.map(([h, n]) => `${h} ${n}`).join(', ')}`);
  for (const n of v.notes) note(n);
  for (const p of v.problems) say(`  PROBLEM ${p}`);
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

// ----------------------------------------------------------------------------- check (read only)

async function check(o) {
  if (existsSync(join(o.folder, 'move.json'))) stop(`${o.folder} holds a move already: give a new folder`);
  mkdirSync(o.folder, { recursive: true });
  step(`The two apps: ${o.from} (now) and ${o.to} (the cad group)`);
  const s = await sides(o);
  if (s.route === 'new') note('bizomat.ai/cad already goes to the cad group: CAD Automation was moved');
  ensureStarted(o.from, s.old, `${o.from}'s Machine`);
  ensureStarted(o.to, s.cad, 'the cad Machine');
  await waitSsh(o.from, s.old.id, `${o.from}'s Machine`);
  await waitSsh(o.to, s.cad.id, 'the cad Machine');

  step('The cad Machine');
  const c = cadState(o, s);
  if (!c.tools) stop(`the cad Machine runs an image without the move tools: run .\\bizomat.ps1 deploy website first`);
  say(`it answers: ${c.health.ok ? `the CAD server (version ${c.health.version})` : `its holding page (${c.health.status})`}; its volume ${c.hasData ? 'holds CAD data' : 'holds no CAD data yet'}${c.maintenance ? '; maintenance mode is on' : ''}`);
  const pin = pinShort();
  if (pin && c.health.version && c.health.version !== pin) note(`the cad group runs CADOS ${c.health.version}, this folder pins ${pin}: deploy website first, so the move lands on the code you checked`);
  if (c.hasData && s.route !== 'new') note('its volume holds CAD data from an earlier attempt: the move needs -Force (that data is kept in /data/backups)');

  step('The route: the router reaches the cad group over the private network');
  const via = probe(o.to, s.proxies[0].id, o.newUrl);
  if (!(via.http === 200)) stop(`the router Machine cannot reach ${o.newUrl}/healthz (${via.status || via.error}): the move would leave bizomat.ai/cad without CAD Automation`);
  say(`ok: ${o.newUrl}/healthz answers the router (${via.ok ? 'the CAD server' : `holding page, ${via.status}`})`);

  step('Settings (names only)');
  const plan = settingsPlan(o, s);
  showPlan(o, plan);

  step('Room');
  const dataKb = kb(o.from, s.old.id, "du -sk /data 2>/dev/null | awk 'END {print $1}'");
  const oldTmpKb = kb(o.from, s.old.id, "df -Pk /tmp | awk 'NR == 2 {print $4}'");
  const newKb = kb(o.to, s.cad.id, "df -Pk /data | awk 'NR == 2 {print $4}'");
  say(`data on ${o.from}: ${Math.ceil(dataKb / 1024)} MB; free: ${o.from} /tmp ${Math.floor(oldTmpKb / 1024)} MB, the cad volume ${Math.floor(newKb / 1024)} MB`);
  if (dataKb < 0 || oldTmpKb < dataKb * 1.2 + 20_480) stop(`${o.from}'s /tmp has too little room for the export`);
  if (newKb < dataKb * 2.2 + 102_400) stop('the cad volume has too little room: extend it (fly volumes extend) and run this again');

  step('What bizomat.ai/cad serves now');
  const before = { health: await publicHealth(), kid: await publicKid() };
  say(`version ${before.health.version ?? `- (HTTP ${before.health.http})`}, signing key id ${before.kid ? `${before.kid.slice(0, 12)}...` : 'none'}`);

  step(`A copy of the data while ${o.from} keeps running (a rehearsal: the move itself freezes it first)`);
  await putScripts(o, s.old);
  const ex = exportThere(o, s.old, `rehearsal-${stamp()}.tar`);
  say(ex.log.split('\n').filter((l) => /files:|bytes:|MISSING|stream sha256/.test(l)).map((l) => `  ${l.trim()}`).join('\n'));
  const local = join(o.folder, ex.name);
  await download(o.from, s.old.id, `${OLD_TMP}/${ex.name}`, local, ex.sha, ex.size);
  sh(o.from, s.old.id, `rm -rf ${OLD_TMP}`, { allowFail: true });
  step('The copy, checked here');
  const v = await verifyArchive(local);
  printVerify(v);
  if (v.kid && before.kid && v.kid !== before.kid) v.problems.push('its signing key is not the one bizomat.ai/cad serves');
  if (v.problems.length) {
    stop(`the rehearsal copy has problems (above). It was taken while CAD Automation kept running: if only bridge.sqlite is named, run the check again; the move freezes the server first.`);
  }
  say(`ok: ${v.files} files, ${v.bytes} bytes; the signing key is the one in use`);

  step('The way to the cad volume (a test file, removed again)');
  const test = join(o.folder, 'upload-test.bin');
  writeFileSync(test, randomBytes(1 << 20));
  await upload(o.to, s.cad.id, test, `${INCOMING}/bizomat-upload-test.bin`, sha256File(test));
  sh(o.to, s.cad.id, `rm -f ${INCOMING}/bizomat-upload-test.bin`, { allowFail: true });
  rmSync(test, { force: true });

  writeJson(join(o.folder, 'check.json'), {
    checked: new Date().toISOString(), from: o.from, to: o.to, route: s.route, old: s.old.id, cad: s.cad.id,
    proxies: s.proxies.map((p) => p.id), carry: plan.carry, kid: before.kid, version: before.health.version ?? '',
    facts: v.facts, files: v.files, bytes: v.bytes, rehearsal: ex.name,
  });
  step('Ready');
  say(`Nothing was changed. The move takes CAD Automation off line for a few minutes (it answers "being moved").`);
  say(`The rehearsal copy is in ${local}: it holds every key of CAD Automation; it stays on this computer.`);
  return { s, plan, v, before };
}

// ----------------------------------------------------------------------------- apply

async function apply(o) {
  mkdirSync(o.folder, { recursive: true });
  if (existsSync(join(o.folder, 'move.json'))) stop(`${o.folder} holds a move already: give a new folder`);
  step(`The two apps: ${o.from} (now) and ${o.to} (the cad group)`);
  const s = await sides(o);
  if (s.route === 'new') stop('bizomat.ai/cad already goes to the cad group: CAD Automation was moved. To move again, take it back first (bizomat.ps1 back cad).');
  if (s.route !== 'old') stop(`the router's Machines do not all send bizomat.ai/cad to ${o.from} (${s.ups.join(' | ')}): put that right first`);
  ensureStarted(o.from, s.old, `${o.from}'s Machine`);
  ensureStarted(o.to, s.cad, 'the cad Machine');
  await waitSsh(o.to, s.cad.id, 'the cad Machine');
  const c = cadState(o, s);
  if (!c.tools) stop('the cad Machine runs an image without the move tools: run .\\bizomat.ps1 deploy website first');
  if (c.hasData && !o.force) stop('the cad volume already holds CAD data (an earlier attempt). Run again with -Force to replace it (it is kept in /data/backups/cad-<time>).');
  const via = probe(o.to, s.proxies[0].id, o.newUrl);
  if (via.http !== 200) stop(`the router cannot reach the cad group (${o.newUrl}): nothing was changed`);
  const plan = settingsPlan(o, s);
  showPlan(o, plan);
  const before = { health: await publicHealth(), kid: await publicKid() };
  if (!before.kid) stop('bizomat.ai/cad/v2/keys gave no signing key: CAD Automation is not answering normally now; nothing was changed');
  const pin = pinShort();
  const state = { started: new Date().toISOString(), from: o.from, to: o.to, old: s.old.id, cad: s.cad.id, proxies: s.proxies.map((p) => p.id), kid: before.kid, oldVersion: before.health.version ?? '', steps: [] };
  const record = (what) => { state.steps.push({ at: new Date().toISOString(), what }); writeJson(join(o.folder, 'progress.json'), state); };
  const undo = { router: false, frozen: false, imported: false };
  let archive;
  try {
    step(`1. Keep ${o.from} awake for the move (autostop off)`);
    if (autostopOff(s.old)) say('autostop is already off');
    else {
      fly(['machine', 'update', s.old.id, '--app', o.from, '--autostop=off', '--yes'], { inherit: true });
      record('cados autostop off');
    }
    await waitSsh(o.from, s.old.id, `${o.from}'s Machine`);
    await waitProbe(o.from, s.old.id, `http://127.0.0.1:${OLD_PORT}`, (h) => h.ok === true, `${o.from}'s CAD server answers`);

    if (c.hasData || c.health.ok === true) {
      step('The cad Machine into maintenance first: it holds CAD data from an earlier attempt, which must not serve');
      sh(o.to, s.cad.id, `touch ${MAINTENANCE}`);
      fly(['machine', 'restart', s.cad.id, '--app', o.to, '--skip-health-checks'], { inherit: true });
      await waitSsh(o.to, s.cad.id, 'the cad Machine');
      await waitProbe(o.to, s.cad.id, `http://127.0.0.1:${CAD_PORT}`, (h) => h.status === 'maintenance', 'the cad Machine is in maintenance');
      undo.imported = true;
    }

    step(`2. bizomat.ai/cad to the cad group (${o.newUrl}): it says "being moved" until the data is there`);
    for (const p of s.proxies) {
      undo.router = true;
      fly(['machine', 'update', p.id, '--app', o.to, '--env', `UPSTREAM_CAD=${o.newUrl}`, '--yes'], { inherit: true });
    }
    record('router to the cad group');
    const held = await within(90, async () => {
      const h = await publicHealth();
      return (h.ok === false && ['waiting-for-data', 'maintenance'].includes(h.status)) || { fail: `HTTP ${h.http}${h.status ? `, ${h.status}` : ''}` };
    });
    if (held !== true) stop(`bizomat.ai/cad does not reach the cad group (${held.fail})`);
    say('ok: bizomat.ai/cad answers from the cad group');

    step(`3. Freeze ${o.from}: its data folder stays still while it is copied`);
    await putScripts(o, s.old);
    undo.frozen = true;
    const fr = sh(o.from, s.old.id, `bash ${OLD_TMP}/freeze.sh stop`).stdout || '';
    const m = /freeze: (\d+) Python processes, (\d+) stopped/.exec(fr);
    if (!m || m[1] === '0' || m[1] !== m[2]) stop(`${o.from} did not freeze completely (${fr.trim()})`);
    say(`ok: ${m[1]} Python processes paused`);
    record('cados frozen');

    step(`4. Export on ${o.from}, its settings, the copy brought here and checked`);
    const ex = exportThere(o, s.old, `cados-data-${stamp()}.tar`);
    say(ex.log.split('\n').filter((l) => /files:|bytes:|MISSING|stream sha256/.test(l)).map((l) => `  ${l.trim()}`).join('\n'));
    writeFileSync(join(o.folder, 'export.log'), `${ex.log}\n`);
    const settings = readSettings(o, s.old, plan.carry);
    say(`settings read from the ${settings.source === 'server' ? 'paused CAD server' : 'Machine'}: ${[...settings.values.keys()].join(', ') || 'none'} (values not shown)`);
    for (const n of plan.carry) if (!settings.values.has(n)) note(`${n} is a secret of ${o.from} but its server does not have it: not moved`);
    archive = join(o.folder, ex.name);
    await download(o.from, s.old.id, `${OLD_TMP}/${ex.name}`, archive, ex.sha, ex.size);
    const v = await verifyArchive(archive);
    printVerify(v);
    if (v.kid !== before.kid) v.problems.push('its signing key is not the one bizomat.ai/cad served');
    if (v.problems.length) stop('the copy has problems (above)');
    say(`ok: ${v.files} files, ${v.bytes} bytes, every file as listed; the signing key is the one paired computers trust`);
    record('exported and checked here');

    step('5. The copy to the cad volume, checked there, imported; the settings; the CAD server started');
    await upload(o.to, s.cad.id, archive, `${INCOMING}/${ex.name}`, ex.sha);
    const there = sh(o.to, s.cad.id, `bash ${MIGRATE}/cad/verify.sh --archive ${INCOMING}/${ex.name} 2>&1`, { allowFail: true });
    const thereFacts = factsFrom(there.stdout);
    if (there.status !== 0) stop(`the copy fails its check on the cad Machine:\n${(there.stdout || '').trim()}`);
    if (!sameFacts(thereFacts, v.facts)) stop(`the cad Machine counts differently: here ${v.facts.join('; ')}; there ${thereFacts.join('; ')}`);
    say(`ok: the same on the cad Machine (${thereFacts.join('; ')})`);
    const imp = sh(o.to, s.cad.id, `bash ${MIGRATE}/cad/import.sh ${INCOMING}/${ex.name}${o.force ? ' --force' : ''} 2>&1`, { allowFail: true });
    // (restore.sh's closing hint about maintenance is for people running it by hand: this program restarts the Machine)
    for (const l of (imp.stdout || '').trim().split('\n')) if (l.trim() && !l.includes('maintenance mode is still on')) say(`  ${l.trim()}`);
    if (imp.status !== 0) stop('the import refused or failed (above); the cad volume keeps what it had');
    undo.imported = true;
    const installed = factsFrom(imp.stdout);
    if (!sameFacts(installed, v.facts)) stop(`the data in place counts differently: ${installed.join('; ')}`);
    record('imported');
    if (settings.values.size) {
      const w = py(o.to, s.cad.id, WRITE_SETTINGS, { input: [...settings.values].map(([k, b64]) => `${k} ${b64}`).join('\n') + '\n' }).stdout || '';
      const written = ((/^BZ-WRITTEN ?(.*)$/m.exec(w) || [])[1] || '').split(' ').filter(Boolean);
      if (written.length !== settings.values.size) stop(`not every setting was written on the cad volume (${written.join(', ')})`);
      say(`settings on the cad volume: ${written.join(', ')}`);
    }
    settings.values.clear();
    sh(o.to, s.cad.id, `rm -f ${MAINTENANCE} ${INCOMING}/${ex.name}`);
    fly(['machine', 'restart', s.cad.id, '--app', o.to, '--skip-health-checks'], { inherit: true });
    await waitSsh(o.to, s.cad.id, 'the cad Machine');
    const up = await waitProbe(o.to, s.cad.id, `http://127.0.0.1:${CAD_PORT}`, (h) => h.ok === true, 'the CAD server started on the cad Machine with the data');
    say(`ok: the CAD server answers on the cad Machine (version ${up.version})`);
    record('cad started with the data');

    step('6. Live checks through bizomat.ai');
    if (pin && up.version !== pin) note(`the cad group runs CADOS ${up.version}; this folder pins ${pin}`);
    if (!(await liveChecks({ kid: before.kid, version: up.version }))) stop('a live check failed (above)');
    const ready = await within(60, async () => {
      const r = parseJson((await request(o.readyUrl)).text);
      return r?.upstreams?.cad?.ok === true || { fail: 'not yet' };
    });
    say(ready === true ? '  ok    the router reports the cad group healthy' : `  note  the router's ready check did not answer (${o.readyUrl})`);
    state.facts = v.facts;
    state.archive = ex.name;
    state.sha256 = ex.sha;
    state.version = up.version;
    record('live checks passed');
  } catch (e) {
    await wayBack(o, s, undo, e instanceof Stop ? e.message : String(e?.message || e));
    throw e;
  }

  step(`7. Stop ${o.from} and keep it stopped (its volume keeps the data as it was, for the way back)`);
  sh(o.from, s.old.id, `rm -rf ${OLD_TMP}`, { allowFail: true });
  fly(['machine', 'update', s.old.id, '--app', o.from, '--autostart=false', '--skip-start', '--yes'], { inherit: true, allowFail: true });
  let oldNow = machines(o.from).find((m) => m.id === s.old.id);
  if (oldNow && oldNow.state !== 'stopped') {
    fly(['machine', 'stop', s.old.id, '--app', o.from], { inherit: true, allowFail: true });
    oldNow = machines(o.from).find((m) => m.id === s.old.id);
  }
  if (oldNow?.state === 'stopped') say(`ok: ${o.from} is stopped and does not start by itself`);
  else note(`${o.from} is ${oldNow?.state ?? 'unknown'}: stop it with fly machine stop ${s.old.id} --app ${o.from}, then fly machine update ${s.old.id} --app ${o.from} --autostart=false --skip-start --yes`);
  state.moved = new Date().toISOString();
  writeJson(join(o.folder, 'move.json'), state);
  rmSync(join(o.folder, 'progress.json'), { force: true });

  step('Done: bizomat.ai/cad is served by the cad group of the Fly app ' + o.to);
  say(`Data: ${state.facts.join('; ')}. Signing key ${before.kid.slice(0, 12)}... (unchanged). CADOS ${state.version}.`);
  say(`The copy in ${archive} holds every key: keep it on this computer until the rollback window ends, then delete the folder.`);
}

// ----------------------------------------------------------------------------- the way back

async function wayBack(o, s, undo, why) {
  step(`The way back: ${why}`);
  if (undo.frozen) {
    const r = sh(o.from, s.old.id, `bash ${OLD_TMP}/freeze.sh cont`, { allowFail: true });
    say(r.status === 0 ? `${o.from} resumed (${(r.stdout || '').trim()})` : `could not resume ${o.from}: run .\\bizomat.ps1 back cad`);
  }
  // the copies on both Machines hold every key: none stays behind
  sh(o.from, s.old.id, `rm -rf ${OLD_TMP}`, { allowFail: true });
  sh(o.to, s.cad.id, `rm -f ${INCOMING}/cados-data-*.tar ${INCOMING}/cados-data-*.tar.part`, { allowFail: true });
  if (undo.router) {
    for (const p of s.proxies) fly(['machine', 'update', p.id, '--app', o.to, '--env', `UPSTREAM_CAD=${o.oldUrl}`, '--yes'], { inherit: true, allowFail: true });
    say(`bizomat.ai/cad goes to ${o.from} again`);
  }
  if (undo.imported) {
    sh(o.to, s.cad.id, `touch ${MAINTENANCE}`, { allowFail: true });
    fly(['machine', 'restart', s.cad.id, '--app', o.to, '--skip-health-checks'], { inherit: true, allowFail: true });
    say('the cad Machine is in maintenance: it keeps its copy (a new attempt needs -Force) and serves nothing');
  }
  const back = await within(120, async () => {
    const h = await publicHealth();
    return h.ok === true || { fail: `HTTP ${h.http}` };
  });
  say(back === true ? `ok: bizomat.ai/cad answers from ${o.from} again` : `bizomat.ai/cad does not answer yet: run .\\bizomat.ps1 back cad`);
}

async function back(o) {
  mkdirSync(o.folder, { recursive: true });
  step(`The two apps: ${o.from} and ${o.to}`);
  const s = await sides(o);
  const moved = existsSync(join(o.folder, 'move.json')) ? JSON.parse(readFileSync(join(o.folder, 'move.json'), 'utf8')) : null;
  step(`1. ${o.from} started again (autostart on), its server resumed`);
  if (!s.old.services.every((x) => x.autostart !== false)) {
    fly(['machine', 'update', s.old.id, '--app', o.from, '--autostart=true', '--autostop=off', '--yes'], { inherit: true });
  } else if (s.old.state !== 'started') fly(['machine', 'start', s.old.id, '--app', o.from], { inherit: true });
  await waitSsh(o.from, s.old.id, `${o.from}'s Machine`);
  sh(o.from, s.old.id, `if [ -f ${OLD_TMP}/freeze.sh ]; then bash ${OLD_TMP}/freeze.sh cont; fi; rm -rf ${OLD_TMP}`, { allowFail: true });
  const up = await waitProbe(o.from, s.old.id, `http://127.0.0.1:${OLD_PORT}`, (h) => h.ok === true, `${o.from}'s CAD server answers`);
  say(`ok: ${o.from} answers (version ${up.version})`);
  step(`2. bizomat.ai/cad to ${o.from} (${o.oldUrl})`);
  if (s.route === 'old') say('it goes there already');
  for (const p of s.proxies) if ((p.env.UPSTREAM_CAD || '') !== o.oldUrl) fly(['machine', 'update', p.id, '--app', o.to, '--env', `UPSTREAM_CAD=${o.oldUrl}`, '--yes'], { inherit: true });
  step('3. The cad Machine into maintenance (it keeps its data, serves nothing)');
  sh(o.to, s.cad.id, `touch ${MAINTENANCE}`, { allowFail: true });
  fly(['machine', 'restart', s.cad.id, '--app', o.to, '--skip-health-checks'], { inherit: true, allowFail: true });
  step('4. Live checks through bizomat.ai');
  const kid = moved?.kid || (await publicKid());
  const ok = await liveChecks({ kid, version: '' });
  writeJson(join(o.folder, 'back.json'), { back: new Date().toISOString(), from: o.from, to: o.to, ok });
  if (!ok) stop('a live check failed (above): look at fly logs --app ' + o.from);
  say(`\nDone: bizomat.ai/cad is served by ${o.from} again. Until a new move, keep UPSTREAM_CAD in fly.website.toml on ${o.oldUrl} (deploy website checks it).`);
}

// ----------------------------------------------------------------------------- status

async function status(o) {
  // Light: works before the cad group exists (bizomat.ps1 deploy website asks it where the router sends CAD)
  if (fly(['auth', 'whoami'], { allowFail: true }).status !== 0) stop('flyctl is not signed in: fly auth login');
  const known = fly(['status', '--app', o.to], { allowFail: true }).status === 0;
  const all = known ? machines(o.to) : [];
  const proxies = all.filter((m) => m.group === 'proxy');
  const cad = all.find((m) => m.group === 'cad') ?? null;
  const ups = [...new Set(proxies.map((p) => p.env.UPSTREAM_CAD || ''))];
  const route = !proxies.length ? 'none' : ups.length !== 1 ? 'mixed' : ups[0] === o.oldUrl ? 'old' : ups[0] === o.newUrl ? 'new' : 'other';
  let old = null;
  if (fly(['status', '--app', o.from], { allowFail: true }).status === 0) {
    const m = machines(o.from)[0];
    if (m) old = { machine: m.id, state: m.state, region: m.region, autostart: m.services.every((x) => x.autostart !== false) };
  }
  const health = await publicHealth();
  const report = {
    route, upstream: ups, old_url: o.oldUrl, new_url: o.newUrl,
    public: { ok: health.ok === true, version: health.version ?? '', status: health.status ?? '', kid: await publicKid() },
    cad: cad ? { machine: cad.id, state: cad.state, region: cad.region, image: cad.image } : null, old,
  };
  if (o.json) return process.stdout.write(`${JSON.stringify(report)}\n`);
  say(`bizomat.ai/cad goes to: ${route === 'old' ? o.from : route === 'new' ? `the cad group of ${o.to}` : route}${ups.length ? ` (${ups.join(' | ')})` : ''}`);
  say(`it answers: ${report.public.ok ? `the CAD server, version ${report.public.version}` : `not the CAD server (${report.public.status || `HTTP ${health.http}`})`}; signing key ${report.public.kid ? `${report.public.kid.slice(0, 12)}...` : 'none'}`);
  say(`cad group: ${cad ? `Machine ${cad.id}, ${cad.state}, ${cad.region}` : 'none yet'}`);
  say(`${o.from}: ${old ? `Machine ${old.machine}, ${old.state}, ${old.region}${old.autostart ? '' : ', does not start by itself'}` : 'no app'}`);
}

// ----------------------------------------------------------------------------- retirement

async function oldHostNames(o) {
  // the names that reach the old app directly: its own fly.dev name and its certificates' host names
  const names = [`${o.from}.fly.dev`];
  try {
    for (const c of flyJson(['certs', 'list', '--app', o.from])) {
      const h = c.hostname ?? c.Hostname;
      if (h && !names.includes(h)) names.push(h);
    }
  } catch { /* none */ }
  return names;
}

async function resolves(name) {
  const out = new Set();
  for (const f of ['resolve4', 'resolve6']) {
    try { for (const a of await dns[f](name)) out.add(a); } catch { /* none */ }
  }
  return [...out];
}

async function retireChecks(o) {
  step('Before retiring: CAD Automation runs in the cad group');
  const s = await sides(o);
  if (s.route !== 'new') stop(`bizomat.ai/cad does not go to the cad group (${s.ups.join(' | ')}): nothing to retire yet`);
  const toml = readFileSync(process.env.BIZOMAT_FLY_CONFIG || join(ROOT, 'fly.website.toml'), 'utf8');
  if (!toml.includes(`UPSTREAM_CAD = "${o.newUrl}"`)) stop('fly.website.toml in this folder still sends bizomat.ai/cad to the old app: merge the switch on GitHub first (then this folder is brought up to date)');
  const h = await publicHealth();
  if (h.ok !== true) stop(`bizomat.ai/cad is not serving now (HTTP ${h.http}): retire nothing`);
  if (s.old.state !== 'stopped') stop(`${o.from} is ${s.old.state}: it should be stopped since the move (bizomat.ps1 move cad stops it)`);
  say(`ok: bizomat.ai/cad is the cad group (version ${h.version}); ${o.from} is stopped; fly.website.toml agrees`);
  return s;
}

async function retireIps(o) {
  await retireChecks(o);
  step(`${o.from}'s public addresses`);
  const ips = flyJson(['ips', 'list', '--app', o.from]).map((i) => ({ address: i.Address ?? i.address, type: i.Type ?? i.type, region: i.Region ?? i.region }));
  if (!ips.length) return say(`${o.from} has no public addresses left: nothing to release`);
  for (const i of ips) say(`  ${i.address} (${i.type}${i.region ? `, ${i.region}` : ''})`);
  const names = await oldHostNames(o);
  const addrs = new Set(ips.map((i) => i.address));
  step('Names that stop answering with them');
  for (const n of names) {
    const a = await resolves(n);
    const here = a.filter((x) => addrs.has(x));
    say(`  ${n}: ${here.length ? `points at ${o.from} (${here.join(', ')}): it stops answering` : a.length ? `points elsewhere (${a.join(', ')})` : 'does not resolve'}`);
  }
  if (o.confirm !== o.from) return say(`\nNothing released (a preview). To release them: --confirm ${o.from}. This cannot be undone.`);
  step(`Releasing ${ips.length} address(es) of ${o.from}`);
  for (const i of ips) fly(['ips', 'release', i.address, '--app', o.from], { inherit: true });
  const left = flyJson(['ips', 'list', '--app', o.from]);
  if (left.length) stop(`${left.length} address(es) are still there: fly ips list --app ${o.from}`);
  const h = await publicHealth();
  say(`done: ${o.from} has no public address; bizomat.ai/cad ${h.ok === true ? `still answers (version ${h.version})` : `answers HTTP ${h.http}: look at it now`}`);
}

async function deleteApp(o) {
  const s = await retireChecks(o);
  const ips = flyJson(['ips', 'list', '--app', o.from]);
  if (ips.length) stop(`${o.from} still has ${ips.length} public address(es): release them first (retire-ips), then delete the app later`);
  step(`What goes with ${o.from}`);
  for (const v of volumes(o.from)) say(`  volume ${v.name} ${v.id} (${v.size} GB, ${v.region}): its data as of the move, and its snapshots`);
  say(`  Machine ${s.old.id}`);
  step('A snapshot of the cad volume now (the newest copy of the data, kept with bizomat)');
  if (o.confirm === o.from) {
    fly(['volumes', 'snapshots', 'create', s.cadVol.id, '--app', o.to], { inherit: true });
  }
  const snaps = flyJson(['volumes', 'snapshots', 'list', s.cadVol.id, '--app', o.to]);
  say(`  the cad volume has ${Array.isArray(snaps) ? snaps.length : 0} snapshot(s)`);
  if (o.confirm !== o.from) return say(`\nNothing deleted (a preview). To delete ${o.from}: --confirm ${o.from}. This cannot be undone.`);
  if (!Array.isArray(snaps) || !snaps.length) stop('the cad volume has no snapshot: nothing deleted');
  step(`Deleting the Fly app ${o.from}`);
  fly(['apps', 'destroy', o.from, '--yes'], { inherit: true });
  const h = await publicHealth();
  say(`done: ${o.from} is deleted; bizomat.ai/cad ${h.ok === true ? `answers (version ${h.version})` : `answers HTTP ${h.http}: look at it now`}`);
}

// ----------------------------------------------------------------------------- main

let current = '';
process.on('SIGINT', () => {
  console.error(`\nInterrupted${current === 'apply' ? ': if CAD Automation is not back, run .\\bizomat.ps1 back cad' : ''}.`);
  process.exit(130);
});

try {
  const o = parse(process.argv.slice(2));
  current = o.cmd;
  const run = { check, apply, back, status, 'retire-ips': retireIps, 'delete-app': deleteApp }[o.cmd];
  await run(o);
} catch (e) {
  console.error(`\nSTOP: ${e instanceof Stop ? e.message : e?.stack || e}`);
  process.exit(1);
}
