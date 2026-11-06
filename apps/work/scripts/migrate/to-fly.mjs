#!/usr/bin/env node
// Move Project Management's data from Cloudflare (D1 and R2) to the work Machine of the BIZOMAT Fly app, from the
// owner's own computer, where wrangler and flyctl are signed in: the data passes through no GitHub runner or CI.
// The owner runs it as `.\bizomat.ps1 move tasks` (CADOS tools/laptop); it works the same on Windows, macOS and Linux.
//
//   node scripts/migrate/to-fly.mjs prepare <folder> [options]   export, import, repair, copy files, verify, pack
//   node scripts/migrate/to-fly.mjs apply <folder> [options]     upload the archive, check it there, put it in place
//
// prepare only reads Cloudflare and writes <folder>; nothing on Fly changes. Its steps are the ones of
// docs/BIZOMAT-MIGRATION.md, section 2 (import-d1-dump, repair-text-from-d1, copy-r2-objects, verify-data-dir), and the
// archive has the layout of infrastructure/migrate/work/pack.sh (MANIFEST.sha256, EXPORT-INFO, data/).
// apply checks the archive is the one prepare made, streams it to the Machine and compares its SHA-256 there (by
// chunks over the same channel if streaming fails), puts the Machine in maintenance, runs
// infrastructure/migrate/work/apply.sh (what /data/work held is moved to /data/backups, never deleted), always ends
// maintenance again, and waits until the router reports Project Management healthy.
//
// Options: --app <Fly app> (bizomat), --database <D1 database> (workos-platform-preview-db), --bucket <R2 bucket>
// (workos-platform-preview-files), --env <wrangler environment> (preview).
// A rehearsal without Cloudflare: prepare --from-dump <dump.sql> --from-dir <objects folder> (no repair step).
// FLYCTL names the flyctl program (default fly); TAR the tar program (default tar: bsdtar on Windows, GNU tar elsewhere).
// Prints step names, counts, ids and checksums only, never rows or file contents. <folder> holds real data: it stays on
// this computer.

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(HERE, '..', '..');
const WRANGLER = join(APP_ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const FLY = process.env.FLYCTL || 'fly';
const TAR = process.env.TAR || 'tar';
const REMOTE_DIR = '/data/incoming';
const APPLY = '/usr/local/lib/bizomat/migrate/work/apply.sh';
const MAINTENANCE = '/data/.bizomat-maintenance';
const USAGE = 'usage: to-fly.mjs (prepare|apply) <folder> [--app <name>] [--database <D1>] [--bucket <R2>] [--env <env>] [--from-dump <file> --from-dir <dir>]';

class Stop extends Error {}
const say = (s) => console.log(s);
const stop = (s) => { throw new Stop(s); };

function parse(argv) {
  const [cmd, folder, ...rest] = argv;
  if (!['prepare', 'apply'].includes(cmd) || !folder || folder.startsWith('--')) stop(USAGE);
  const o = { cmd, folder: resolve(folder), app: 'bizomat', database: 'workos-platform-preview-db', bucket: 'workos-platform-preview-files', env: 'preview' };
  for (let i = 0; i < rest.length; i += 2) {
    const k = rest[i]?.replace(/^--/, '');
    const v = rest[i + 1];
    if (!['app', 'database', 'bucket', 'env', 'from-dump', 'from-dir'].includes(k) || v === undefined || v.startsWith('--')) stop(USAGE);
    o[k] = v;
  }
  if (Boolean(o['from-dump']) !== Boolean(o['from-dir'])) stop('--from-dump and --from-dir go together (a rehearsal without Cloudflare)');
  if (!/^[a-z0-9-]+$/.test(o.app)) stop('--app: a Fly app name');
  return o;
}

const sha256File = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

/** Runs one of this folder's migration scripts (or wrangler) with node, output on screen; stops on failure. */
function node(step, args) {
  say(`\n== ${step}`);
  const r = spawnSync(process.execPath, args, { cwd: APP_ROOT, stdio: 'inherit' });
  if (r.status !== 0) stop(`${step} failed (exit code ${r.status ?? r.signal}). Nothing on Fly was changed.`);
}

// ----------------------------------------------------------------------------- prepare

/** Every file under dir (relative, with /), refusing links and names a sha256sum manifest cannot hold. */
function filesUnder(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      const rel = relative(dir, p).split(sep).join('/');
      if (lstatSync(p).isSymbolicLink()) stop(`${rel} is a link: the data folder must hold only files`);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) {
        if (/[\n\r\\]/.test(rel)) stop(`a file name the manifest cannot hold: ${JSON.stringify(rel)}`);
        if (!rel.endsWith('.tmp')) out.push(rel);
      } else stop(`${rel} is not a regular file`);
    }
  };
  walk(dir);
  // the order of LC_ALL=C sort, as pack.sh lists them
  return out.sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
}

function pack(folder) {
  say('\n== Pack (the layout of infrastructure/migrate/work/pack.sh)');
  const stage = join(folder, 'stage');
  const data = join(stage, 'data');
  if (existsSync(join(data, 'server.lock'))) stop('the data folder is in use by a server (server.lock): stop it first');
  const files = filesUnder(data);
  if (!files.includes('db.sqlite')) stop('the data folder has no db.sqlite');
  let bytes = 0;
  const lines = files.map((rel) => {
    const p = join(data, ...rel.split('/'));
    bytes += statSync(p).size;
    return `${sha256File(p)}  data/${rel}\n`;
  });
  writeFileSync(join(stage, 'MANIFEST.sha256'), lines.join(''));
  const made = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  writeFileSync(join(stage, 'EXPORT-INFO'), `source: Project Management migration (D1 + R2 export)\nmade: ${made}\nfiles: ${files.length}\nbytes: ${bytes}\n`);
  const name = `work-${made.replace(/[-:]/g, '').replace('T', '-').replace('Z', '')}.tar`;
  const archive = join(folder, name);
  const r = spawnSync(TAR, ['-c', '-f', archive, '-C', stage, 'MANIFEST.sha256', 'EXPORT-INFO', 'data'], { stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.error) stop(`tar could not run (${r.error.code}): Windows 10 and 11 have it built in; elsewhere install tar`);
  if (r.status !== 0) stop(`tar failed (exit code ${r.status})`);
  // what went in: the two top files and data/ only, every manifest entry once
  const list = spawnSync(TAR, ['-t', '-f', archive], { encoding: 'utf8' });
  if (list.status !== 0) stop('tar could not read the archive back');
  const entries = list.stdout.split(/\r?\n/).filter(Boolean).map((n) => n.replace(/^\.\//, '').replace(/\/$/, ''));
  const odd = entries.filter((n) => !['MANIFEST.sha256', 'EXPORT-INFO', 'data'].includes(n) && !n.startsWith('data/'));
  if (odd.length) stop(`the archive holds something outside data/: ${odd.slice(0, 3).join(', ')}`);
  const inArchive = new Set(entries.filter((n) => n.startsWith('data/')).map((n) => n.slice(5)));
  const lost = files.filter((f) => !inArchive.has(f));
  if (lost.length) stop(`${lost.length} files did not go into the archive, e.g. ${lost[0]}`);
  const info = { name, sha256: sha256File(archive), bytes: statSync(archive).size, files: files.length, dataBytes: bytes, made };
  writeFileSync(join(folder, 'archive.json'), `${JSON.stringify(info, null, 2)}\n`);
  say(`packed ${files.length} files (${bytes} bytes) into ${name}, ${info.bytes} bytes, sha256 ${info.sha256}`);
}

function prepare(o) {
  const dump = join(o.folder, 'work-d1.sql');
  const data = join(o.folder, 'stage', 'data');
  if (existsSync(join(o.folder, 'stage')) || existsSync(join(o.folder, 'archive.json'))) stop(`${o.folder} was used before: give a new folder`);
  mkdirSync(o.folder, { recursive: true });
  if (!o['from-dump'] && !existsSync(WRANGLER)) stop(`wrangler is not installed in ${APP_ROOT}: run npm ci there first`);
  if (o['from-dump']) say(`Rehearsal: the dump ${o['from-dump']} and the objects in ${o['from-dir']} stand in for Cloudflare.`);
  else node(`Export D1 ${o.database} (read only)`, [WRANGLER, 'd1', 'export', o.database, '--remote', '--env', o.env, '--output', dump]);
  node('Import into a new data folder', ['scripts/migrate/import-d1-dump.mjs', o['from-dump'] ? resolve(o['from-dump']) : dump, data]);
  // The export writes only text with a line break through replace(...), so the repair has work only when the import
  // found such text (import.multilineText in its report).
  const report = JSON.parse(readFileSync(join(data, 'migration-report.json'), 'utf8'));
  const multiline = Object.values(report.import?.multilineText ?? {}).reduce((a, b) => a + Number(b), 0);
  if (multiline === 0) say('\n== Repair multi-line text from D1: the export has none, so there is nothing to repair');
  else if (o['from-dump']) say(`\n== Repair multi-line text from D1: ${multiline} values; a rehearsal does not read D1`);
  else node(`Repair multi-line text from D1 (read only; ${multiline} values)`, ['scripts/migrate/repair-text-from-d1.mjs', data, '--remote', '--env', o.env, '--database', o.database]);
  node('Copy the referenced files', o['from-dir']
    ? ['scripts/migrate/copy-r2-objects.mjs', data, '--from-dir', resolve(o['from-dir'])]
    : ['scripts/migrate/copy-r2-objects.mjs', data, '--bucket', o.bucket, '--remote']);
  node('Verify the data folder', ['scripts/migrate/verify-data-dir.mjs', data]);
  pack(o.folder);
  say(`\nPrepared in ${o.folder}. Nothing on Fly changed; Cloudflare was only read.`);
}

// ----------------------------------------------------------------------------- apply

function fly(args, { input, inherit = false, allowFail = false } = {}) {
  const r = spawnSync(FLY, args, { encoding: 'utf8', input, stdio: inherit ? ['ignore', 'inherit', 'inherit'] : undefined, maxBuffer: 64 << 20 });
  if (r.error) stop(`${FLY} could not run (${r.error.code}): install flyctl and sign in (fly auth login)`);
  if (r.status !== 0 && !allowFail) {
    const why = `${r.stderr || ''}${r.stdout || ''}`.trim().split('\n').slice(-3).join(' ').slice(0, 300);
    stop(`fly ${args.slice(0, 3).join(' ')} failed (exit code ${r.status})${why ? `: ${why}` : ''}`);
  }
  return r;
}

function workMachine(app) {
  const out = fly(['machines', 'list', '--app', app, '--json']).stdout;
  let list;
  try { list = JSON.parse(out); } catch { stop('fly machines list gave no JSON'); }
  const work = (list || []).filter((m) => (m.config?.metadata?.fly_process_group ?? m.process_group) === 'work');
  if (work.length === 0) stop(`the app ${app} has no work Machine yet: deploy the website (with Project Management) first`);
  if (work.length > 1) stop(`the app ${app} has ${work.length} work Machines: it must have exactly one (each has its own volume)`);
  return { id: work[0].id, state: work[0].state };
}

function sshArgs(o, m, command) { return ['ssh', 'console', '--app', o.app, '--machine', m.id, '--command', command]; }
const ssh = (o, m, command, opts) => fly(sshArgs(o, m, command), opts);

/** Streams the archive into `cat` on the Machine (no terminal, so the bytes pass unchanged). */
function streamUpload(o, m, archive, remote) {
  return new Promise((done) => {
    const child = spawn(FLY, sshArgs(o, m, `sh -c 'cat > ${remote}'`), { stdio: ['pipe', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', () => done(false));
    child.on('close', (code) => { if (code !== 0) say(`streaming failed (exit code ${code}): ${err.trim().split('\n').pop() ?? ''}`); done(code === 0); });
    createReadStream(archive).pipe(child.stdin).on('error', () => {});
  });
}

/** The fallback: the archive in base64 pieces small enough for one command line each. */
function chunkUpload(o, m, archive, remote) {
  const b64 = readFileSync(archive).toString('base64');
  const size = 12_000;
  const pieces = Math.ceil(b64.length / size) || 1;
  say(`sending it in ${pieces} pieces instead`);
  ssh(o, m, `sh -c ': > ${remote}.b64'`);
  for (let i = 0; i < pieces; i++) {
    ssh(o, m, `sh -c 'printf %s ${b64.slice(i * size, (i + 1) * size)} >> ${remote}.b64'`);
    if ((i + 1) % 20 === 0 || i + 1 === pieces) say(`  ${i + 1} of ${pieces}`);
  }
  ssh(o, m, `sh -c 'base64 -d ${remote}.b64 > ${remote} && rm -f ${remote}.b64'`);
}

function remoteSha(o, m, remote) {
  const out = ssh(o, m, `sha256sum ${remote}`, { allowFail: true }).stdout || '';
  return (out.match(/\b[0-9a-f]{64}\b/) || [])[0] || '';
}

async function upload(o, m, info, archive) {
  const remote = `${REMOTE_DIR}/${info.name}.part`;
  say(`\n== Upload ${info.name} (${info.bytes} bytes) to the work Machine ${m.id}`);
  ssh(o, m, `mkdir -p ${REMOTE_DIR}`);
  let ok = (await streamUpload(o, m, archive, remote)) && remoteSha(o, m, remote) === info.sha256;
  if (!ok) {
    chunkUpload(o, m, archive, remote);
    ok = remoteSha(o, m, remote) === info.sha256;
  }
  if (!ok) stop('the archive on the Machine does not match this one (sha256): nothing was applied');
  ssh(o, m, `mv ${remote} ${REMOTE_DIR}/${info.name}`);
  say(`on the Machine: ${REMOTE_DIR}/${info.name}, sha256 ${info.sha256} (the same as here)`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForSsh(o, m) {
  for (let i = 0; i < 40; i++) {
    if (ssh(o, m, 'true', { allowFail: true }).status === 0) return;
    await sleep(3000);
  }
  stop(`the work Machine ${m.id} did not come back after its restart: look at fly logs --app ${o.app}`);
}

async function restart(o, m, why) {
  say(`restarting the work Machine (${why})`);
  fly(['machine', 'restart', m.id, '--app', o.app, '--skip-health-checks'], { inherit: true });
  await waitForSsh(o, m);
}

async function waitHealthy(o) {
  const url = process.env.BIZOMAT_READY_URL || `https://${o.app}.fly.dev/__proxy/ready`;
  say(`\n== Waiting until the router reports Project Management healthy (${url})`);
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      const j = await r.json();
      if (j?.upstreams?.work?.ok === true) return say('Project Management answers on Fly.');
    } catch { /* not yet */ }
    await sleep(3000);
  }
  stop(`Project Management did not report healthy within 3 minutes: look at fly logs --app ${o.app}`);
}

async function apply(o) {
  const info = JSON.parse(readFileSync(join(o.folder, 'archive.json'), 'utf8'));
  const archive = join(o.folder, info.name);
  if (!/^work-[0-9-]+\.tar$/.test(info.name) || !existsSync(archive)) stop('no prepared archive in this folder: run prepare first');
  if (sha256File(archive) !== info.sha256) stop('the archive changed since it was prepared: prepare again');
  const m = workMachine(o.app);
  say(`work Machine ${m.id} (${m.state})`);
  if (m.state !== 'started') fly(['machine', 'start', m.id, '--app', o.app], { inherit: true });
  await upload(o, m, info, archive);
  say('\n== Maintenance: Project Management on Fly stops while its data is replaced');
  ssh(o, m, `touch ${MAINTENANCE}`);
  await restart(o, m, 'into maintenance');
  let failure;
  try {
    say('\n== Put the data in place (apply.sh: checks the archive, keeps what was there in /data/backups)');
    fly(sshArgs(o, m, `bash ${APPLY} ${REMOTE_DIR}/${info.name}`), { inherit: true });
  } catch (e) {
    failure = e;
  } finally {
    say('\n== End maintenance');
    ssh(o, m, `rm -f ${MAINTENANCE}`);
    fly(['machine', 'restart', m.id, '--app', o.app, '--skip-health-checks'], { inherit: true });
  }
  if (failure) throw failure;
  await waitHealthy(o);
  say(`\nDone: the data from ${info.made} is on Fly (${info.files} files). Check it on https://${o.app}.fly.dev/__preview/work before the switch.`);
}

try {
  const o = parse(process.argv.slice(2));
  if (o.cmd === 'prepare') prepare(o);
  else await apply(o);
} catch (e) {
  console.error(`\nSTOP: ${e instanceof Stop ? e.message : e?.stack || e}`);
  process.exit(1);
}
