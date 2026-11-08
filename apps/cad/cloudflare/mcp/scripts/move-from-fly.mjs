#!/usr/bin/env node
// Move CAD Automation's data folder from its Fly.io Machine into the R2 bucket that its Cloudflare Container restores
// from (the Worker bizomat-mcp: opensketch/persist.py restores the folder through src/persist.ts). Run it from the
// owner's computer, where flyctl and wrangler are signed in (Windows, macOS or Linux; Node 22.19 or later; nothing
// else: wrangler comes from this folder's node_modules).
//
//   node scripts/move-from-fly.mjs prepare <folder> [--app cados] [--group <process group>] [--data <folder>]
//   node scripts/move-from-fly.mjs apply <folder> [--bucket bizomat-mcp-data] [--replace] [--local <dir>]
//
// prepare only reads Fly. The app's one Machine (or the one in --group: for the app bizomat, --group cad) must be
// started. Its data folder is /data, or /data/cad with --group cad (bizomat gives each role a folder of its own),
// unless --data names another. A small Python script goes to the Machine (fly ssh console, in base64 pieces) and
// copies the state files of the data folder, by persist.py's rules, into a new folder
// /data/incoming/cf-cad-<time>-<hex>: SQLite databases through the online backup (a consistent copy while the server
// runs), other files byte for byte. It refuses a data folder without accounts.enabled (the container does not start
// from a store without it, and an empty server could be claimed by whoever opens it first) and a state file over
// 64 MiB (the store refuses those).
// The copies come here in one stream (file by file in base64 pieces when the stream does not arrive intact, as on
// some Windows consoles) and are checked against the SHA-256 taken on the Machine. The folder on the Machine is
// removed at the end, also when something fails. Here every SQLite copy must pass PRAGMA integrity_check. In
// <folder> (new or empty) it writes:
//   files/<name>      the state files
//   manifest.json     the name, size and SHA-256 of each, the app, the Machine and the time (no content)
//   MANIFEST.sha256   the SHA-256 of the two above
//
// apply checks the folder against MANIFEST.sha256 first. The bucket must exist and must not hold a store yet:
// data/accounts.enabled is absent (wrangler's `r2 object get` says the key does not exist), and so is every state file
// the server writes (KNOWN) that this copy does not have, or the container would restore it with the rest. --replace
// allows both: what the bucket holds of these names is saved in <folder>/replaced-<time>/ first, then
// data/accounts.enabled is removed, and so are the server's files this copy does not have. Each file goes up as
// data/<name> (`wrangler r2 object put`) and is read back (`r2 object get`: size and SHA-256). accounts.enabled goes
// last, so a copy that stops half-way never looks like a store: the container keeps refusing to start, and apply can
// simply run again. Pause the Worker (CAD_PAUSED, README "Pause") before --replace, so that the server on Cloudflare
// cannot write over the new copy (tools/laptop/cloudflare.ps1 move cad -Replace does).
//
// Rehearsals: apply --local <dir> writes to wrangler's local R2 in <dir> instead of Cloudflare (--local
// .wrangler/state is the one `npx wrangler dev` uses here). wrangler runs with a temporary config that names the
// bucket and nothing else. WRANGLER names the wrangler script run with node (default: this folder's node_modules),
// FLYCTL the flyctl program (default fly); CLOUDFLARE_ACCOUNT_ID picks the account when the wrangler login has several.
// Prints names, sizes, counts and checksums only, never a file's content. <folder> holds every key of CAD Automation:
// it stays on this computer; delete it when the move is done.

import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import {
  closeSync, copyFileSync, createWriteStream, existsSync, lstatSync, mkdirSync, mkdtempSync, openSync, readdirSync,
  readFileSync, readSync, realpathSync, renameSync, rmSync, statSync, writeFileSync, writeSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE = resolve(HERE, '..');
const CHECKOUT = resolve(PACKAGE, '..', '..'); // this repository: private, but it may be shared
const WRANGLER = process.env.WRANGLER || join(PACKAGE, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const FLY = process.env.FLYCTL || 'fly';
const INCOMING = '/data/incoming';
export const DEFAULT_BUCKET = 'bizomat-mcp-data'; // wrangler.jsonc r2_buckets (binding DATA)

/**
 * The state files, as opensketch/persist.py chooses them (NAME, SKIP_SUFFIXES, SQLITE_SUFFIXES, MARKER, MAX_FILE,
 * PREFIX). A copy of its rules: test/move-from-fly.test.ts checks that they stay equal.
 */
export const RULES = {
  name: '[A-Za-z0-9][A-Za-z0-9._-]{0,127}',
  skip: ['.lock', '.tmp', '.part', '.restore', '-journal', '-wal', '-shm'],
  sqlite: ['.sqlite', '.sqlite3', '.db'],
  marker: 'accounts.enabled',
  maxFile: 64 * 2 ** 20,
  prefix: 'data/',
};

/**
 * The state files the server writes (opensketch: accounts.py, auth.py, mcpauth.py, oauth.py, secretbox.py, swbridge.py,
 * devicebridge.py). wrangler cannot list a bucket, so apply looks for these by name: one in the bucket that the copy
 * does not have (google_oauth.json after Google sign-in was removed, say) would come back at the next start.
 */
export const KNOWN = [
  'accounts.enabled', 'ai_keys.secret', 'bridge-release.json', 'bridge-signing-key.pem', 'bridge.sqlite',
  'google_oauth.json', 'mcp_oauth.json', 'secret', 'secret.keys', 'sessions.json', 'swbridge.json', 'users.json',
];

const NAME_RE = new RegExp(`^(?:${RULES.name})$`);
export const isStateName = (n) => typeof n === 'string' && NAME_RE.test(n) && !n.includes('..') && !RULES.skip.some((s) => n.endsWith(s));
const isSqlite = (n) => RULES.sqlite.some((s) => n.endsWith(s));

/**
 * The script prepare runs on the Machine with the image's python3 (python:3.12-slim). It changes nothing in the data
 * folder: it reads it and writes the new folder. (A read-only SQLite connection to a database that no connection has
 * open leaves an empty -wal and -shm, owned like the database, as the server's own data store copies do; the server's
 * next query removes them.)
 */
export const SNAPSHOT_PY = String.raw`# CAD Automation's data folder, copied on the Fly Machine for move-from-fly.mjs (cloudflare/mcp/scripts).
#   python3 -I <this file> <data folder> <new folder>
# The state files are the ones opensketch/persist.py keeps in R2, by its rules: the regular files at the top of the
# data folder (never a link or a folder), named with letters, digits, dot, dash and underscore, never a lock,
# temporary or journal file. Each is copied into <new folder>: a SQLite database through the online backup, so the
# copy is consistent while the server runs, any other file byte for byte. Prints one line:
#   BIZOMAT-CAD-SNAPSHOT {"ok": true, "files": [{"name", "size", "sha256"}], "skipped": {...}}
# Names, sizes and checksums only, never a file's content.
import hashlib
import json
import os
import re
import sqlite3
import stat
import sys
import urllib.parse

NAME = re.compile(${JSON.stringify(RULES.name)})
SKIP_SUFFIXES = tuple(${JSON.stringify(RULES.skip)})
SQLITE_SUFFIXES = tuple(${JSON.stringify(RULES.sqlite)})
MARKER = ${JSON.stringify(RULES.marker)}
MAX_FILE = ${RULES.maxFile}
RESERVE = 64 * 2**20  # free space left on the volume after the copy: the server keeps writing there


class Refused(Exception):
    pass


def valid(name):
    return NAME.fullmatch(name) is not None and ".." not in name


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            block = f.read(1 << 20)
            if not block:
                return h.hexdigest()
            h.update(block)


def state_files(data, skipped, own):
    out = []
    for name in sorted(os.listdir(data)):
        if os.path.join(data, name) == own:  # the folder this copy goes into (/data/incoming, when the data is /data)
            continue
        try:
            st = os.lstat(os.path.join(data, name))
        except FileNotFoundError:
            continue
        if stat.S_ISLNK(st.st_mode):
            skipped["links"] += 1
        elif stat.S_ISDIR(st.st_mode):
            if valid(name):
                skipped["folders"].append(name)
            else:
                skipped["other"] += 1
        elif not valid(name):
            skipped["other"] += 1
        elif name.endswith(SKIP_SUFFIXES):
            skipped["temporary"] += 1
        elif not stat.S_ISREG(st.st_mode):
            skipped["other"] += 1
        else:
            out.append((name, st.st_size))
    return out


def copy_bytes(src, dst):
    fd = os.open(dst, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "wb") as out, open(src, "rb") as f:
        while True:
            block = f.read(1 << 20)
            if not block:
                return
            out.write(block)


def copy_sqlite(src, dst):
    s = sqlite3.connect("file:" + urllib.parse.quote(src) + "?mode=ro", uri=True, timeout=15)
    try:
        d = sqlite3.connect(dst)
        try:
            s.backup(d)
        finally:
            d.close()
    finally:
        s.close()
    os.chmod(dst, 0o600)


def main(data, out):
    os.umask(0o077)
    if not os.path.isdir(data):
        raise Refused(data + " is not a folder on this Machine: give the data folder with --data")
    skipped = {"folders": [], "temporary": 0, "links": 0, "other": 0}
    names = state_files(data, skipped, os.path.dirname(out))
    if MARKER not in [n for n, _ in names]:
        raise Refused(MARKER + " is not in " + data + ": this data folder has no accounts. The container does not "
                      "start from a store without it, and an empty server could be claimed by whoever opens it first")
    big = ["%s (%d MiB)" % (n, size // 2**20) for n, size in names if size > MAX_FILE]
    if big:
        raise Refused("over the %d MiB the store takes: %s" % (MAX_FILE // 2**20, ", ".join(big)))
    need = RESERVE
    for n, size in names:
        need += size
        if n.endswith(SQLITE_SUFFIXES) and os.path.exists(os.path.join(data, n + "-wal")):
            need += os.path.getsize(os.path.join(data, n + "-wal"))
    st = os.statvfs(os.path.dirname(out))
    if st.f_bavail * st.f_frsize < need:
        raise Refused("not enough free space for the copy next to the data (%d MiB needed)" % (need // 2**20))
    os.mkdir(out, 0o700)
    files = []
    for n, _ in names:
        src, dst = os.path.join(data, n), os.path.join(out, n)
        if n.endswith(SQLITE_SUFFIXES):
            copy_sqlite(src, dst)
        else:
            copy_bytes(src, dst)
        size = os.path.getsize(dst)
        if size > MAX_FILE:
            raise Refused("%s: its copy is %d MiB, over the %d MiB the store takes" % (n, size // 2**20, MAX_FILE // 2**20))
        files.append({"name": n, "size": size, "sha256": sha256(dst)})
    return {"ok": True, "files": files, "skipped": skipped}


if __name__ == "__main__":
    try:
        result = main(sys.argv[1], sys.argv[2])
    except Refused as e:
        result = {"ok": False, "error": str(e)}
    except Exception as e:  # the kind and SQLite's or the system's own words: paths, never content
        result = {"ok": False, "error": type(e).__name__ + ": " + str(e)}
    sys.stdout.write("BIZOMAT-CAD-SNAPSHOT " + json.dumps(result) + "\n")
    sys.stdout.flush()
    sys.exit(0 if result.get("ok") else 1)
`;

const USAGE = [
  'usage: move-from-fly.mjs prepare <folder> [--app cados] [--group <process group>] [--data /data; /data/cad with --group cad]',
  '       move-from-fly.mjs apply <folder> [--bucket bizomat-mcp-data] [--replace] [--local <dir>]',
].join('\n');

class Stop extends Error {}
const say = (s = '') => console.log(s);
const stop = (s) => {
  throw new Stop(s);
};
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const fmtBytes = (n) => (n < 1024 ? `${n} bytes` : n < 1 << 20 ? `${(n / 1024).toFixed(1)} KB` : `${(n / (1 << 20)).toFixed(1)} MB`);
const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const short = (sha) => `${sha.slice(0, 16)}...`;
const stamp = () => new Date().toISOString().replace(/\.\d+Z$/, '').replace(/[-:]/g, '').replace('T', '-');

// Ctrl-C: the step under way ends, then the tool stops; the copy on the Machine and the temporary files are still
// removed (fly() and run() check this; prepare's copy is removed in copyFromFly's finally).
let interrupted = false;
const onSignal = () => {
  if (!interrupted) console.error('\nstopping (Ctrl-C): the step under way ends first');
  interrupted = true;
};

function parse(argv) {
  const [cmd, ...rest] = argv;
  if (!['prepare', 'apply'].includes(cmd)) stop(USAGE);
  const values = cmd === 'prepare' ? ['app', 'group', 'data'] : ['bucket', 'local'];
  const booleans = cmd === 'apply' ? ['replace'] : [];
  const o = { cmd, folder: '', app: 'cados', group: '', data: '', bucket: DEFAULT_BUCKET, local: '', replace: false };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (!a.startsWith('--')) {
      if (o.folder) stop(USAGE);
      o.folder = resolve(a);
      continue;
    }
    const [k, inline] = a.slice(2).split(/=(.*)/s);
    if (booleans.includes(k)) {
      if (inline !== undefined) stop(`--${k} takes no value\n${USAGE}`);
      o[k] = true;
    } else if (values.includes(k)) {
      const v = inline ?? rest[++i];
      if (!v || v.startsWith('--')) stop(`--${k} needs a value\n${USAGE}`);
      o[k] = v;
    } else stop(`--${k} is not an option of ${cmd}\n${USAGE}`);
  }
  if (!o.folder) stop(USAGE);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(o.app)) stop('--app: a Fly app name');
  if (o.group && !/^[a-z0-9][a-z0-9_-]*$/.test(o.group)) stop('--group: a Fly process group name');
  // the cad group of the app bizomat keeps CAD Automation's data in /data/cad (gocore-website infrastructure/fly)
  o.data = (o.data || (o.group === 'cad' ? '/data/cad' : '/data')).replace(/\/+$/, '') || '/';
  if (!/^\/data(\/[A-Za-z0-9._-]+)*$/.test(o.data) || o.data.split('/').some((p) => p === '.' || p === '..') ||
      o.data === INCOMING || o.data.startsWith(`${INCOMING}/`)) {
    stop('--data: the data folder on the Machine, under /data: /data (the app cados) or /data/cad (the cad group of bizomat)');
  }
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(o.bucket)) stop('--bucket: an R2 bucket name (lower-case letters, digits and -)');
  if (o.local) o.local = resolve(o.local);
  return o;
}

// ----------------------------------------------------------------------------- files here

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

/** Every file under dir, relative with /, sorted; links are refused. Top-level folders named in `except` are left out. */
function filesUnder(dir, except = () => false) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      const rel = relative(dir, p).split(sep).join('/');
      if (d === dir && except(e.name)) continue;
      if (lstatSync(p).isSymbolicLink()) stop(`${rel} is a link: the folder must hold only files`);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) out.push(rel);
      else stop(`${rel} is not a regular file`);
    }
  };
  walk(dir);
  return out.sort();
}

/** The bytes [start, start + length) of an open file, into a new file. */
function copyRange(fd, start, length, to) {
  const out = openSync(to, 'wx', 0o600);
  try {
    const buf = Buffer.allocUnsafe(1 << 20);
    for (let done = 0; done < length; ) {
      const n = readSync(fd, buf, 0, Math.min(buf.length, length - done), start + done);
      if (n <= 0) break;
      for (let off = 0; off < n; ) off += writeSync(out, buf, off, n - off);
      done += n;
    }
  } finally {
    closeSync(out);
  }
}

const sameAs = (path, f) => existsSync(path) && statSync(path).size === f.size && sha256File(path) === f.sha256;

/** node:sqlite (Node 22.13 and later), without its "experimental" warning on the output. */
async function loadSqlite() {
  const emit = process.emitWarning;
  process.emitWarning = (w, ...rest) => (String(w?.message ?? w).includes('SQLite') ? undefined : emit.call(process, w, ...rest));
  try {
    return await import('node:sqlite');
  } finally {
    process.emitWarning = emit;
  }
}

/** PRAGMA integrity_check of a copy of the database, in a folder of its own (opening it may add -wal and -shm). */
async function integrityProblems(file) {
  const { DatabaseSync } = await loadSqlite();
  const dir = mkdtempSync(join(tmpdir(), 'bizomat-cad-check-'));
  try {
    const copy = join(dir, 'check.sqlite');
    copyFileSync(file, copy);
    const db = new DatabaseSync(copy, { readOnly: true });
    try {
      const said = db.prepare('PRAGMA integrity_check').all().map((r) => String(Object.values(r)[0]));
      return said.length === 1 && said[0] === 'ok' ? [] : said.slice(0, 3);
    } finally {
      db.close();
    }
  } catch (e) {
    return [`it does not open as a SQLite database (${e?.code ?? e?.name})`];
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ----------------------------------------------------------------------------- flyctl

/** Runs flyctl and waits. dataOut: what it prints is a file's content (base64), so a failure shows stderr only. */
function fly(args, { allowFail = false, dataOut = false, cleanup = false, timeout = 180_000 } = {}) {
  if (interrupted && !cleanup) stop('stopped by Ctrl-C');
  const r = spawnSync(FLY, args, { encoding: 'utf8', maxBuffer: 256 << 20, timeout, stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error?.code === 'ETIMEDOUT') r.status ??= -1;
  else if (r.error) stop(`${FLY} could not run (${r.error.code}): install flyctl and sign in (fly auth login)`);
  if (r.signal === 'SIGINT') interrupted = true;
  if (interrupted && !cleanup) stop('stopped by Ctrl-C');
  if (r.status !== 0 && !allowFail) {
    const why = `${r.stderr || ''}${dataOut ? '' : r.stdout || ''}`.trim().split('\n').slice(-3).join(' ').slice(0, 300);
    stop(`fly ${args.slice(0, 2).join(' ')} failed (${r.error?.code === 'ETIMEDOUT' ? `no answer in ${timeout / 1000} s` : `exit code ${r.status}`})${why ? `: ${why}` : ''}`);
  }
  return r;
}

function pickMachine(o) {
  const out = fly(['machines', 'list', '--app', o.app, '--json']).stdout;
  let list;
  try {
    const at = out.search(/[[{]/);
    list = JSON.parse(at >= 0 ? out.slice(at) : out);
  } catch {
    stop('fly machines list gave no JSON');
  }
  const all = Array.isArray(list) ? list : [];
  const group = (m) => m?.config?.metadata?.fly_process_group ?? m?.process_group ?? '';
  const ms = o.group ? all.filter((m) => group(m) === o.group) : all;
  const where = o.group ? `the process group ${o.group} of the app ${o.app}` : `the app ${o.app}`;
  if (ms.length === 0) stop(`${where} has no Machine`);
  if (ms.length > 1) {
    const groups = [...new Set(all.map(group))].filter(Boolean).sort();
    stop(`${where} has ${ms.length} Machines: it must have exactly one${o.group ? '' : ` (give its process group with --group: ${groups.join(', ') || 'none named'})`}`);
  }
  const m = { id: String(ms[0].id ?? ''), state: String(ms[0].state ?? 'unknown'), group: group(ms[0]) };
  if (!/^[A-Za-z0-9]+$/.test(m.id)) stop('fly machines list gave a Machine without a usable id');
  return m;
}

const sshArgs = (o, m, command) => ['ssh', 'console', '--app', o.app, '--machine', m.id, '--quiet', '--command', command];
const ssh = (o, m, command, opts) => fly(sshArgs(o, m, command), opts);
const MADE_INCOMING = 'BIZOMAT-MADE-INCOMING';

/** Sends SNAPSHOT_PY to the Machine in base64 pieces (one command line each) and checks it there. */
function sendScript(o, m, remote, state) {
  const script = Buffer.from(SNAPSHOT_PY, 'utf8');
  const sha = createHash('sha256').update(script).digest('hex');
  const b64 = script.toString('base64');
  const size = 12_000;
  const pieces = Math.ceil(b64.length / size);
  for (let i = 0; i < pieces; i++) {
    const steps = ['umask 077'];
    if (i === 0) steps.push(`if [ ! -d ${INCOMING} ]; then mkdir -p ${INCOMING} && echo ${MADE_INCOMING}; fi`);
    steps.push(`printf %s ${b64.slice(i * size, (i + 1) * size)} ${i === 0 ? '>' : '>>'} ${remote}.b64`);
    if (i === pieces - 1) steps.push(`base64 -d ${remote}.b64 > ${remote}.py`, `rm -f ${remote}.b64`, `echo "${sha}  ${remote}.py" | sha256sum -c --status`);
    const r = ssh(o, m, `sh -c '${steps.join(' && ')}'`, { allowFail: true });
    if (i === 0 && String(r.stdout).includes(MADE_INCOMING)) state.madeIncoming = true;
    if (r.status !== 0) stop(`the script could not be sent to the Machine (exit code ${r.status}): ${String(r.stderr || '').trim().split('\n').pop() ?? ''}`);
  }
}

/** Runs a command on the Machine and writes what it prints to a file (no terminal: the bytes pass unchanged where the console allows it). */
function streamDownload(o, m, command, local) {
  return new Promise((done) => {
    if (interrupted) return done(false);
    const out = createWriteStream(local, { flags: 'wx', mode: 0o600 });
    const child = spawn(FLY, sshArgs(o, m, command), { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    let code = null;
    let pending = 2;
    const finish = () => {
      if (--pending === 0) done(code === 0);
    };
    child.stderr.on('data', (d) => {
      err += d;
    });
    child.on('error', () => {
      code = -1;
      out.end();
      finish();
    });
    child.on('close', (c, signal) => {
      code = c;
      if (signal === 'SIGINT') interrupted = true;
      if (c !== 0 && !interrupted) say(`the stream stopped (exit code ${c ?? signal}): ${err.trim().split('\n').pop() ?? ''}`);
      finish();
    });
    out.on('close', finish);
    child.stdout.pipe(out);
  });
}

/** The fallback for one file: base64, 4 MiB at a time, each piece between markers so that nothing else can mix in. */
function fetchBase64(o, m, remotePath, local, bytes) {
  const step = 4 << 20;
  const pieces = Math.max(1, Math.ceil(bytes / step));
  const tag = randomBytes(8).toString('hex');
  const fd = openSync(local, 'wx', 0o600);
  try {
    for (let i = 0; i < pieces; i++) {
      const r = ssh(o, m, `sh -c 'echo BEGIN-${tag}; dd if=${remotePath} bs=${step} skip=${i} count=1 iflag=fullblock 2>/dev/null | base64; echo END-${tag}'`, { dataOut: true, allowFail: true });
      const text = String(r.stdout || '');
      const a = text.indexOf(`BEGIN-${tag}`);
      const b = text.indexOf(`END-${tag}`, a + 1);
      if (r.status !== 0 || a < 0 || b < 0) return false;
      const piece = Buffer.from(text.slice(a + tag.length + 6, b), 'base64');
      for (let off = 0; off < piece.length; ) off += writeSync(fd, piece, off, piece.length - off);
    }
  } finally {
    closeSync(fd);
  }
  return true;
}

/** The list the script printed on the Machine: only names the store takes, each once, sizes the store takes. */
function checkListing(info) {
  const files = Array.isArray(info?.files) ? info.files : null;
  const bad = !files || files.some((f) => !isStateName(f?.name) || !Number.isSafeInteger(f?.size) || f.size < 0 || f.size > RULES.maxFile || !/^[0-9a-f]{64}$/.test(String(f?.sha256)));
  if (bad) stop('the copy on the Machine gave a list this tool does not take: nothing was prepared');
  const names = files.map((f) => f.name);
  if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) stop('the data folder has two state files whose names differ only in capitals: this computer may not keep them apart');
  if (!names.includes(RULES.marker)) stop(`the copy on the Machine has no ${RULES.marker}: nothing was prepared`);
  return files;
}

/** What the script skipped, as numbers and the names of folders the store would take (nothing else is kept). */
function cleanSkipped(s) {
  const n = (v) => (Number.isSafeInteger(v) && v >= 0 ? v : 0);
  return {
    folders: Array.isArray(s?.folders) ? s.folders.filter(isStateName) : [],
    temporary: n(s?.temporary),
    links: n(s?.links),
    other: n(s?.other),
  };
}

function skippedText(s) {
  if (!s || typeof s !== 'object') return '';
  const parts = [];
  const folders = Array.isArray(s.folders) ? s.folders.filter(isStateName) : [];
  if (folders.length) parts.push(`${count(folders.length, 'folder')} (${folders.join(', ')})`);
  if (s.temporary) parts.push(count(s.temporary, 'lock, temporary or journal file', 'lock, temporary or journal files'));
  if (s.links) parts.push(count(s.links, 'link'));
  if (s.other) parts.push(count(s.other, 'other entry', 'other entries') + ' (names the store does not take, or not regular files)');
  return parts.join('; ');
}

async function copyFromFly(o, filesDir) {
  say(`\n== The data folder ${o.data} on the Fly app ${o.app}${o.group ? `, process group ${o.group}` : ''} (read only)`);
  const m = pickMachine(o);
  say(`Machine ${m.id} (${m.state})`);
  if (m.state !== 'started') stop(`the Machine ${m.id} is ${m.state}: start it first (fly machine start ${m.id} --app ${o.app}), then run prepare again`);
  const remote = `${INCOMING}/cf-cad-${stamp()}-${randomBytes(4).toString('hex')}`;
  say(`a copy is made on the Machine in ${remote} and removed at the end`);
  const state = { madeIncoming: false, removed: false };
  let info;
  let files;
  try {
    sendScript(o, m, remote, state);
    const r = ssh(o, m, `python3 -I ${remote}.py ${o.data} ${remote}`, { allowFail: true, timeout: 900_000 });
    const line = String(r.stdout || '').split(/\r?\n/).find((l) => l.startsWith('BIZOMAT-CAD-SNAPSHOT '));
    try {
      info = line ? JSON.parse(line.slice('BIZOMAT-CAD-SNAPSHOT '.length)) : null;
    } catch {
      stop('the copy on the Machine gave an answer that is not JSON');
    }
    if (!info) stop(`the copy on the Machine did not run (exit code ${r.status}): ${String(r.stderr || '').trim().split('\n').pop() ?? ''}`);
    if (!info.ok) stop(`the copy on the Machine was refused: ${String(info.error ?? 'no reason given').slice(0, 500)}. Nothing was prepared.`);
    files = checkListing(info);
    const total = files.reduce((s, f) => s + f.size, 0);
    const dbs = files.filter((f) => isSqlite(f.name)).map((f) => f.name);
    say(`copy made on the Machine: ${count(files.length, 'state file')} (${fmtBytes(total)})${dbs.length ? `; through the online backup: ${dbs.join(', ')}` : ''}`);
    const skipped = skippedText(cleanSkipped(info.skipped));
    if (skipped) say(`skipped, as the container's data store skips them: ${skipped}`);

    say('downloading the copy in one stream');
    const stream = join(filesDir, `.stream-${randomBytes(4).toString('hex')}.part`);
    let bad = files;
    try {
      const streamed = await streamDownload(o, m, `cat ${files.map((f) => `${remote}/${f.name}`).join(' ')}`, stream);
      if (interrupted) stop('stopped by Ctrl-C');
      if (streamed && statSync(stream).size === total) {
        bad = [];
        const fd = openSync(stream, 'r');
        try {
          let at = 0;
          for (const f of files) {
            const part = join(filesDir, `${f.name}.part`);
            copyRange(fd, at, f.size, part);
            at += f.size;
            if (sameAs(part, f)) renameSync(part, join(filesDir, f.name));
            else {
              rmSync(part, { force: true });
              bad.push(f);
            }
          }
        } finally {
          closeSync(fd);
        }
      }
    } finally {
      rmSync(stream, { force: true });
    }
    if (bad.length) {
      say(`${count(bad.length, 'file')} did not arrive intact in the stream (another size or sha256): fetching ${bad.length === 1 ? 'it' : 'them'} in base64 pieces`);
      for (const f of bad) {
        const part = join(filesDir, `${f.name}.part`);
        const arrived = fetchBase64(o, m, `${remote}/${f.name}`, part, f.size);
        if (!arrived || !sameAs(part, f)) {
          rmSync(part, { force: true });
          stop(`${f.name} did not arrive intact (its size or sha256 differs from the copy on the Machine every way): nothing was prepared`);
        }
        renameSync(part, join(filesDir, f.name));
      }
    }
    say(`downloaded: ${files.length} of ${files.length} files with the size and sha256 they have on the Machine`);
  } finally {
    const rmdir = state.madeIncoming ? `rmdir ${INCOMING} 2>/dev/null; ` : '';
    const command = `sh -c 'rm -rf ${remote} ${remote}.py ${remote}.b64; ${rmdir}test ! -e ${remote} && test ! -e ${remote}.py && test ! -e ${remote}.b64'`;
    const r = fly(sshArgs(o, m, command), { allowFail: true, cleanup: true });
    state.removed = r.status === 0;
    state.removeBy = `${FLY} ssh console --app ${o.app} --machine ${m.id} --command "rm -rf ${remote} ${remote}.py ${remote}.b64"`;
    if (state.removed) say('removed the copy from the Machine');
    else console.error(`could not remove the copy from the Machine (exit code ${r.status ?? r.signal}). Remove it with:\n  ${state.removeBy}`);
  }
  return { app: o.app, group: o.group || m.group || null, machine: m.id, data: o.data, files, skipped: cleanSkipped(info.skipped), state };
}

/** Whether a folder is inside this repository's checkout (its .git is there). */
function inCheckout(folder) {
  const inside = relative(CHECKOUT, folder);
  return existsSync(join(CHECKOUT, '.git')) && inside !== '..' && !inside.startsWith(`..${sep}`) && !isAbsolute(inside);
}

async function prepare(o) {
  if (inCheckout(o.folder)) stop(`${o.folder} is inside this repository: give a folder outside it, so these keys can never be committed`);
  if (existsSync(o.folder) && (!statSync(o.folder).isDirectory() || readdirSync(o.folder).length)) {
    stop(`${o.folder} is not an empty folder: give a new one (each prepare makes a new copy)`);
  }
  const made = !existsSync(o.folder);
  mkdirSync(o.folder, { recursive: true, mode: 0o700 });
  const filesDir = join(o.folder, 'files');
  mkdirSync(filesDir, { mode: 0o700 });
  let done = false;
  try {
    const source = await copyFromFly(o, filesDir);

    say('\n== Check the copy here');
    for (const f of source.files.filter((x) => isSqlite(x.name))) {
      const problems = await integrityProblems(join(filesDir, f.name));
      if (problems.length) stop(`${f.name} fails SQLite's integrity check: ${problems.join('; ')}. Nothing was prepared.`);
      say(`${f.name}: integrity ok`);
    }
    const here = filesUnder(filesDir);
    if (here.join('\n') !== source.files.map((f) => f.name).sort().join('\n')) stop('the files here are not the files of the copy: nothing was prepared');
    say(`${RULES.marker} is there: the container will start with these accounts`);

    const manifest = {
      format: 1,
      tool: 'move-from-fly.mjs',
      made: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
      source: { app: source.app, group: source.group, machine: source.machine, data: source.data },
      files: source.files.map((f) => ({ name: f.name, size: f.size, sha256: f.sha256 })),
      skipped: source.skipped,
    };
    writeFileSync(join(o.folder, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
    const listed = ['manifest.json', ...manifest.files.map((f) => `files/${f.name}`)].sort();
    writeFileSync(join(o.folder, 'MANIFEST.sha256'), listed.map((rel) => `${sha256File(join(o.folder, ...rel.split('/')))}  ${rel}\n`).join(''), { mode: 0o600, flag: 'wx' });

    say('\nFiles:');
    const width = Math.max(...manifest.files.map((f) => f.name.length));
    for (const f of manifest.files) say(`  ${f.name.padEnd(width)}  ${fmtBytes(f.size).padStart(10)}  sha256 ${short(f.sha256)}`);
    done = true;
    if (!source.state.removed) stop(`prepared in ${o.folder}, but the copy on the Machine could not be removed. Remove it with:\n  ${source.state.removeBy}`);
    say(`\nPrepared in ${o.folder} (${count(manifest.files.length, 'file')}, manifest.json, MANIFEST.sha256). Nothing on Fly changed: the copy made there was removed.`);
    say('The folder holds every key of CAD Automation: keep it on this computer.');
    say(`Next: node scripts/move-from-fly.mjs apply ${/\s/.test(o.folder) ? `"${o.folder}"` : o.folder} (add --local <dir> for a rehearsal on this computer)`);
  } finally {
    if (!done) {
      if (made) rmSync(o.folder, { recursive: true, force: true });
      else for (const e of ['files', 'manifest.json', 'MANIFEST.sha256']) rmSync(join(o.folder, e), { recursive: true, force: true });
    }
  }
}

// ----------------------------------------------------------------------------- apply

const isReplaced = (n) => /^replaced-/.test(n);

/** The folder exactly as prepare left it: every file in MANIFEST.sha256 with its SHA-256, nothing else (but the
 * replaced-* folders of earlier --replace runs), and manifest.json agreeing with both. */
function checkFolder(folder) {
  const sums = join(folder, 'MANIFEST.sha256');
  const manifestFile = join(folder, 'manifest.json');
  if (!existsSync(sums) || !existsSync(manifestFile)) stop(`${folder} is not a prepared folder (no MANIFEST.sha256 or manifest.json): run prepare first`);
  const listed = new Map();
  for (const line of readFileSync(sums, 'utf8').split('\n').filter(Boolean)) {
    const m = /^([0-9a-f]{64}) {2}(manifest\.json|files\/[^/\\]+)$/.exec(line);
    if (!m || listed.has(m[2])) stop('MANIFEST.sha256 is damaged: prepare again');
    listed.set(m[2], m[1]);
  }
  const present = new Set(filesUnder(folder, isReplaced).filter((f) => f !== 'MANIFEST.sha256'));
  const added = [...present].filter((f) => !listed.has(f));
  const missing = [...listed.keys()].filter((f) => !present.has(f));
  const changed = [...listed].filter(([f, sha]) => present.has(f) && sha256File(join(folder, ...f.split('/'))) !== sha).map(([f]) => f);
  if (added.length || missing.length || changed.length) {
    stop(`the folder changed since it was prepared (${changed.length} changed, ${missing.length} missing, ${added.length} added; first: ${[...changed, ...missing, ...added][0]}): prepare again`);
  }
  let prep;
  try {
    prep = JSON.parse(readFileSync(manifestFile, 'utf8'));
  } catch {
    stop('manifest.json does not parse: prepare again');
  }
  const files = Array.isArray(prep?.files) ? prep.files : [];
  const ok = prep?.format === 1 && files.length > 0 && files.every((f) => isStateName(f?.name) && Number.isSafeInteger(f?.size) &&
    f.size >= 0 && f.size <= RULES.maxFile && listed.get(`files/${f.name}`) === f.sha256 && statSync(join(folder, 'files', f.name)).size === f.size);
  const inFiles = [...listed.keys()].filter((f) => f.startsWith('files/')).length;
  if (!ok || inFiles !== files.length || new Set(files.map((f) => f.name)).size !== files.length) stop('manifest.json does not match the files: prepare again');
  if (!files.some((f) => f.name === RULES.marker)) stop(`the copy has no ${RULES.marker}: prepare again`);
  say(`the folder is as prepared: ${count(listed.size, 'file')} besides MANIFEST.sha256, sha256 checked`);
  return prep;
}

const stripAnsi = (s) => String(s).replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');

/** What went wrong, from wrangler's output (it never prints an object's content). */
function wranglerWhy(r) {
  const lines = stripAnsi(`${r.stderr || ''}\n${r.stdout || ''}`)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/Logs were written/.test(l) && !/Proxy environment variables detected/.test(l));
  const picked = lines.filter((l) => /error|\u2718|fail|could not|couldn't|not found|does not exist|unauthori[sz]ed|forbidden|denied|account/i.test(l));
  return (picked.length ? picked.slice(-4) : lines.slice(-3)).join(' ').slice(0, 500) || `exit code ${r.status}`;
}

const keyMissing = (r) => r.status !== 0 && /The specified key does not exist/i.test(stripAnsi(`${r.stdout}${r.stderr}`));

/** wrangler, run with node, against Cloudflare (--remote) or wrangler's local R2 (--local --persist-to). */
function target(o) {
  const dir = mkdtempSync(join(tmpdir(), 'bizomat-mcp-move-'));
  const config = join(dir, 'wrangler.json');
  // the bucket and nothing else: no Worker, no other binding, no account, no secret is read or sent
  writeFileSync(config, `${JSON.stringify({ name: 'bizomat-mcp', compatibility_date: '2026-10-01', r2_buckets: [{ binding: 'DATA', bucket_name: o.bucket }] }, null, 2)}\n`);
  const where = o.local ? ['--local', '--persist-to', o.local] : ['--remote'];
  // no banner (it asks npm for a newer wrangler), no metrics, no colours, no questions
  const env = { ...process.env, CI: 'true', WRANGLER_HIDE_BANNER: 'true', WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1', FORCE_COLOR: '0' };
  const run = (args, located = true) => {
    if (interrupted) stop('stopped by Ctrl-C');
    const r = spawnSync(process.execPath, [WRANGLER, ...args, ...(located ? where : []), '--config', config], {
      cwd: dir, env, encoding: 'utf8', maxBuffer: 64 << 20, timeout: 600_000, stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (r.error?.code === 'ETIMEDOUT') r.status ??= -1;
    else if (r.error) stop(`wrangler could not run (${r.error.code}): run npm ci in ${PACKAGE}`);
    if (r.signal === 'SIGINT') interrupted = true;
    if (interrupted) stop('stopped by Ctrl-C');
    return r;
  };
  const key = (name) => `${o.bucket}/${RULES.prefix}${name}`;
  /** Up to three tries; a key that does not exist is an answer, not a failure. */
  const retried = (args, what) => {
    let r;
    for (let attempt = 1; attempt <= 3; attempt++) {
      r = run(args);
      if (r.status === 0 || keyMissing(r)) return r;
      if (attempt < 3) sleep(1000 * attempt);
    }
    return stop(`${what} failed (${wranglerWhy(r)})`);
  };
  return {
    local: Boolean(o.local),
    label: o.local ? `wrangler's local R2 in ${o.local}` : 'Cloudflare',
    run,
    /** Downloads data/<name> into file: true, or false when the bucket does not hold it. */
    get(name, file) {
      return retried(['r2', 'object', 'get', key(name), '--file', file], `reading data/${name} from R2 ${o.bucket}`).status === 0;
    },
    put(name, file) {
      const r = retried(['r2', 'object', 'put', key(name), '--file', file, '--content-type', 'application/octet-stream'], `uploading data/${name} to R2 ${o.bucket}`);
      if (r.status !== 0) stop(`uploading data/${name} to R2 ${o.bucket} failed (${wranglerWhy(r)})`);
    },
    del(name) {
      const r = retried(['r2', 'object', 'delete', key(name)], `removing data/${name} from R2 ${o.bucket}`);
      if (r.status !== 0) stop(`removing data/${name} from R2 ${o.bucket} failed (${wranglerWhy(r)})`);
    },
    cleanup() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

/** Saves what the bucket holds of these names in <folder>/replaced-<time>/files/, with its own MANIFEST.sha256. */
function saveReplaced(t, o, names) {
  const dir = join(o.folder, `replaced-${stamp()}-${randomBytes(2).toString('hex')}`);
  mkdirSync(join(dir, 'files'), { recursive: true, mode: 0o700 });
  const kept = [];
  for (const name of names) {
    const file = join(dir, 'files', name);
    if (!t.get(name, file)) {
      rmSync(file, { force: true }); // wrangler makes the file before it learns the key does not exist
      continue;
    }
    kept.push({ name, size: statSync(file).size, sha256: sha256File(file) });
  }
  if (!kept.length) {
    rmSync(dir, { recursive: true, force: true });
    return { dir: null, kept };
  }
  writeFileSync(join(dir, 'MANIFEST.sha256'), kept.map((f) => `${f.sha256}  files/${f.name}\n`).join(''), { mode: 0o600 });
  say(`kept what the bucket held in ${dir}:`);
  const width = Math.max(...kept.map((f) => f.name.length)) + 5;
  for (const f of kept) say(`  ${`data/${f.name}`.padEnd(width)}  ${fmtBytes(f.size).padStart(10)}  sha256 ${short(f.sha256)}`);
  return { dir, kept };
}

async function apply(o) {
  if (o.local && inCheckout(o.local) && !relative(CHECKOUT, o.local).split(sep).includes('.wrangler')) {
    stop(`--local ${o.local} is inside this repository: use .wrangler/state (git leaves it out) or a folder outside it`);
  }
  const prep = checkFolder(o.folder);
  const files = prep.files;
  const names = new Set(files.map((f) => f.name));
  const total = files.reduce((s, f) => s + f.size, 0);
  const src = prep.source ?? {};
  say(`prepared ${prep.made} from the Fly app ${src.app}${src.group ? `, process group ${src.group}` : ''} (Machine ${src.machine}, ${src.data}): ${count(files.length, 'file')} (${fmtBytes(total)})`);
  if (!existsSync(WRANGLER)) stop(`wrangler is not installed in ${PACKAGE}: run npm ci there first`);

  const t = target(o);
  const scratch = mkdtempSync(join(tmpdir(), 'bizomat-mcp-check-'));
  try {
    say(`\n== Target: R2 bucket ${o.bucket} on ${t.label}`);
    if (!t.local) {
      const b = t.run(['r2', 'bucket', 'list'], false);
      if (b.status !== 0) stop(`wrangler could not list the R2 buckets (${wranglerWhy(b)}). Nothing was changed.`);
      const buckets = stripAnsi(b.stdout).split(/\r?\n/).map((l) => /^\s*name:\s+(\S+)\s*$/.exec(l)?.[1]).filter(Boolean);
      if (!buckets.includes(o.bucket)) stop(`the R2 bucket ${o.bucket} was not found: deploy the Worker first (its first deploy makes it), or make it with npx wrangler r2 bucket create ${o.bucket}. Nothing was changed.`);
      say(`R2 bucket ${o.bucket}: found`);
    } else say('(wrangler makes a local bucket when it is first used)');

    const probe = join(scratch, 'probe');
    const live = t.get(RULES.marker, probe);
    rmSync(probe, { force: true });
    if (live && !o.replace) {
      stop(`R2 ${o.bucket} already holds a store (data/${RULES.marker}): the container restores it at its next start. Nothing was changed. To replace it with this copy, run apply again with --replace (it keeps what the bucket holds in ${o.folder}${sep}replaced-<time> first).`);
    }
    say(live ? `data/${RULES.marker} is there: the bucket holds a store, and --replace replaces it (with the Worker paused first, CAD_PAUSED, the server cannot write over the new copy)` : `data/${RULES.marker} is not there: the bucket holds no store`);

    // the server's own state files that this copy does not have: they would come back at the next start
    const others = KNOWN.filter((n) => !names.has(n));
    let stale;
    let saved = { dir: null, kept: [] };
    if (o.replace) {
      saved = saveReplaced(t, o, [...files.map((f) => f.name), ...others]);
      stale = saved.kept.map((f) => f.name).filter((n) => !names.has(n));
    } else {
      stale = others.filter((n) => {
        const found = t.get(n, probe);
        rmSync(probe, { force: true });
        return found;
      });
      if (stale.length) {
        stop(`R2 ${o.bucket} holds ${stale.map((n) => `data/${n}`).join(', ')} from an earlier upload, and this copy has no such file: the container would restore it with the rest. Nothing was changed. Run apply again with --replace: it keeps what the bucket holds, then removes ${stale.length === 1 ? 'it' : 'them'}.`);
      }
    }
    if (live) {
      t.del(RULES.marker);
      say(`removed data/${RULES.marker} first: until the upload is complete the bucket does not look like a store`);
    }
    for (const n of stale) {
      t.del(n);
      say(`removed data/${n}: this copy does not have it (kept in ${saved.dir})`);
    }

    say(`\n== Upload: ${count(files.length, 'file')} as data/<name>, ${RULES.marker} last`);
    const order = [...files.filter((f) => f.name !== RULES.marker), ...files.filter((f) => f.name === RULES.marker)];
    const width = Math.max(...files.map((f) => f.name.length));
    order.forEach((f, i) => {
      t.put(f.name, join(o.folder, 'files', f.name));
      const back = join(scratch, `back-${i}`);
      if (!t.get(f.name, back)) stop(`data/${f.name} is not in R2 ${o.bucket} after its upload. ${RULES.marker === f.name ? '' : `${RULES.marker} is not uploaded yet, so the container does not start from this half copy. `}Run apply again.`);
      if (!sameAs(back, f)) stop(`data/${f.name} reads back from R2 ${o.bucket} with another size or sha256 than the copy. ${RULES.marker === f.name ? '' : `${RULES.marker} is not uploaded yet, so the container does not start from this half copy. `}Run apply again.`);
      rmSync(back, { force: true });
      say(`  ${f.name.padEnd(width)}  ${fmtBytes(f.size).padStart(10)}  sha256 ${short(f.sha256)}  uploaded, read back equal`);
    });

    say(`\nDone: ${count(files.length, 'file')} (${fmtBytes(total)}) in R2 ${o.bucket} on ${t.label}, each read back with the same size and sha256, ${RULES.marker} last.`);
    say('The container restores them when it next starts. Changes made on Fly after the copy stay on Fly.');
  } finally {
    rmSync(scratch, { recursive: true, force: true });
    t.cleanup();
  }
}

// ----------------------------------------------------------------------------- main

const isMain = (() => {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (isMain) {
  try {
    const [major, minor] = process.versions.node.split('.').map(Number);
    if (major < 22 || (major === 22 && minor < 19)) stop(`Node 22.19 or later is needed (this is ${process.versions.node})`);
    const o = parse(process.argv.slice(2));
    process.on('SIGINT', onSignal);
    process.on('SIGTERM', onSignal);
    if (o.cmd === 'prepare') await prepare(o);
    else await apply(o);
  } catch (e) {
    console.error(`\nSTOP: ${e instanceof Stop ? e.message : e?.stack || e}`);
    process.exit(interrupted ? 130 : 1);
  }
}
