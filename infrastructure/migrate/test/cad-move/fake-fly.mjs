#!/usr/bin/env node
// A stand-in for flyctl, for rehearsing infrastructure/migrate/cad/to-fly.mjs on one Linux computer (rehearse.sh).
// Only the commands and flags the move uses. Each Machine of the old app and the cad group is a process tree in its own
// mount and PID namespaces (unshare), with its own /data, /tmp and /usr/local/lib/bizomat; `ssh console` runs the
// command inside it (nsenter), split as hallpass splits it (shell words, no shell). The router (proxy group) is the real
// proxy, started on this computer with the Machine's environment; the private network names are mapped to local ports.
// State: $FAKEFLY_HOME/state.json. Needs root, unshare and nsenter. Throwaway values only.
//
// Failure injection for the rehearsal: FAKEFLY_FAIL=<word>[,<word>]: sftp-get, sftp-put, ssh-stdin, ssh-stdout (the
// raw ways fail, so the next way is used), script:<text> (a remote script containing <text> exits 1).

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, existsSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HOME = process.env.FAKEFLY_HOME;
if (!HOME) { console.error('FAKEFLY_HOME is not set'); process.exit(2); }
const STATE = join(HOME, 'state.json');
const FAIL = new Set((process.env.FAKEFLY_FAIL || '').split(',').filter(Boolean));
const load = () => JSON.parse(readFileSync(STATE, 'utf8'));
const save = (s) => writeFileSync(STATE, `${JSON.stringify(s, null, 2)}\n`);
const die = (msg, code = 1) => { process.stderr.write(`Error: ${msg}\n`); process.exit(code); };

// ----------------------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const flags = {};
const pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const [k, v] = a.slice(2).split(/=(.*)/s);
    const boolean = ['json', 'yes', 'quiet', 'skip-start', 'skip-health-checks'].includes(k);
    const value = v !== undefined ? v : boolean ? 'true' : argv[++i];
    if (k === 'env') (flags.env ??= []).push(value);
    else flags[k] = value;
  } else pos.push(a);
}
const app = flags.app;

/** POSIX shell words: what hallpass does with --command (no shell is run). */
function words(s) {
  const out = [];
  let cur = '';
  let have = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'") {
      const j = s.indexOf("'", i + 1);
      if (j < 0) die('unterminated quote in the command');
      cur += s.slice(i + 1, j);
      i = j;
      have = true;
    } else if (c === '"') {
      i++;
      for (; i < s.length && s[i] !== '"'; i++) {
        if (s[i] === '\\' && '"\\$`'.includes(s[i + 1])) i++;
        cur += s[i];
      }
      have = true;
    } else if (c === '\\') {
      cur += s[++i] ?? '';
      have = true;
    } else if (/\s/.test(c)) {
      if (have) out.push(cur);
      cur = '';
      have = false;
    } else {
      cur += c;
      have = true;
    }
  }
  if (have) out.push(cur);
  return out;
}

// ----------------------------------------------------------------------------- Machines

function hostPidOf(m) {
  if (!m.pid) return 0;
  try { return existsSync(`/proc/${m.pid}`) ? m.pid : 0; } catch { return 0; }
}

function mapUrl(s, state) {
  let out = s;
  for (const [from, to] of Object.entries(state.network)) out = out.split(from).join(to);
  return out;
}

function startMachine(state, id) {
  const m = state.machines[id];
  const log = openSync(join(HOME, `${id}.log`), 'a');
  const env = { PATH: '/usr/local/bin:/usr/bin:/bin', ...m.env, ...state.apps[m.app].secrets, FLY_APP_NAME: m.app, FLY_MACHINE_ID: id, FLY_REGION: m.region, FLY_PROCESS_GROUP: m.group };
  if (m.kind === 'proxy') {
    env.UPSTREAM_CAD = mapUrl(env.UPSTREAM_CAD || '', state);
    const child = spawn(process.execPath, [m.main], { env, detached: true, stdio: ['ignore', log, log] });
    child.unref();
    m.pid = child.pid;
  } else {
    const binds = m.binds.map(([from, to]) => `mount --bind '${from}' '${to}'`).join(' && ');
    const child = spawn('unshare', ['--mount', '--pid', '--fork', '--mount-proc', '--propagation', 'private', '/bin/sh', '-c', `${binds} && ${m.main} & wait`],
      { env, detached: true, stdio: ['ignore', log, log] });
    child.unref();
    // the namespace's first process (sh) is the child of unshare
    let pid = 0;
    for (let i = 0; i < 100 && !pid; i++) {
      try { pid = Number(readFileSync(`/proc/${child.pid}/task/${child.pid}/children`, 'utf8').trim().split(/\s+/)[0]) || 0; } catch { pid = 0; }
      if (!pid) spawnSync('sleep', ['0.05']);
    }
    if (!pid) die(`machine ${id} did not start`);
    m.pid = pid;
  }
  closeSync(log);
  m.state = 'started';
  spawnSync('sleep', ['0.3']);
}

function stopMachine(state, id) {
  const m = state.machines[id];
  const pid = hostPidOf(m);
  if (pid) {
    try { process.kill(pid, 'SIGKILL'); } catch { /* gone */ }
    for (let i = 0; i < 100 && existsSync(`/proc/${pid}`); i++) spawnSync('sleep', ['0.05']);
  }
  m.pid = 0;
  m.state = 'stopped';
}

function machineJson(state, id) {
  const m = state.machines[id];
  if (m.state === 'started' && !hostPidOf(m)) m.state = 'stopped';
  return {
    id, name: id, state: m.state, region: m.region, image_ref: { repository: m.app, tag: 'rehearsal' },
    config: { env: m.env, metadata: { fly_process_group: m.group }, mounts: m.mounts, services: m.services },
  };
}

function needStarted(state, id) {
  const m = state.machines[id];
  if (!m || m.app !== app) die(`machine ${id} not found in app ${app}`);
  if (m.state !== 'started' || !hostPidOf(m)) die(`machine ${id} is not started`);
  return m;
}

/** A command inside the Machine (or on this computer for the router), stdio passed through. */
function inMachine(m, args, stdio) {
  const cmd = m.kind === 'proxy' ? args : ['nsenter', '--target', String(m.pid), '--mount', '--pid', '--', ...args];
  return spawnSync(cmd[0], cmd.slice(1), { stdio, maxBuffer: 1 << 30 });
}

// ----------------------------------------------------------------------------- commands

const out = (v) => process.stdout.write(`${JSON.stringify(v, null, 2)}\n`);
const state = load();
const [c1, c2, c3] = pos;

if (c1 === 'auth' && c2 === 'whoami') { console.log('owner@example.test'); process.exit(0); }
if (c1 === 'status') { if (!state.apps[app]) die(`app ${app} not found`); console.log(`App ${app}`); process.exit(0); }
if (c1 === 'apps' && c2 === 'destroy') { // flyctl: apps destroy <APPNAME> [--yes]
  const name = c3 || app;
  if (!state.apps[name]) die(`app ${name} not found`);
  if (flags.yes !== 'true') die('yes flag must be specified when not running interactively');
  for (const id of state.apps[name].machines) stopMachine(state, id);
  delete state.apps[name];
  save(state);
  console.log(`Destroyed app ${name}`);
  process.exit(0);
}
if (!state.apps[app]) die(`app ${app} not found`);
const A = state.apps[app];

if ((c1 === 'machines' || c1 === 'machine') && c2 === 'list') { out(A.machines.map((id) => machineJson(state, id))); save(state); process.exit(0); }
if (c1 === 'volumes' && c2 === 'list') { out(A.volumes); process.exit(0); }
if (c1 === 'volumes' && c2 === 'snapshots') {
  const vol = pos[3];
  A.snapshots ??= {};
  if (c3 === 'create') { (A.snapshots[vol] ??= []).push({ id: `vs_${Date.now()}`, created_at: new Date().toISOString() }); save(state); console.log('Snapshot creation started'); process.exit(0); }
  if (c3 === 'list') { out(A.snapshots[vol] ?? []); process.exit(0); }
}
if (c1 === 'secrets' && c2 === 'list') { out(Object.keys(A.secrets).map((name) => ({ name, digest: createHash('sha256').update(A.secrets[name]).digest('hex').slice(0, 16) }))); process.exit(0); }
if (c1 === 'ips' && c2 === 'list') { out(A.ips); process.exit(0); }
if (c1 === 'ips' && c2 === 'release') {
  const addr = c3;
  if (!A.ips.some((i) => i.Address === addr)) die(`${addr} is not an address of ${app}`);
  A.ips = A.ips.filter((i) => i.Address !== addr);
  save(state);
  console.log(`Released ${addr} from ${app}`);
  process.exit(0);
}
if (c1 === 'certs' && c2 === 'list') { out(A.certs ?? []); process.exit(0); }

if (c1 === 'machine' && ['start', 'stop', 'restart', 'update'].includes(c2)) {
  const id = c3;
  const m = state.machines[id];
  if (!m || m.app !== app) die(`machine ${id} not found in app ${app}`);
  if (c2 === 'stop') stopMachine(state, id);
  if (c2 === 'start' && (m.state !== 'started' || !hostPidOf(m))) startMachine(state, id);
  if (c2 === 'restart') { stopMachine(state, id); startMachine(state, id); }
  if (c2 === 'update') {
    for (const kv of flags.env ?? []) { const [k, v] = kv.split(/=(.*)/s); m.env[k] = v; }
    for (const s of m.services) {
      if (flags.autostop !== undefined) s.autostop = flags.autostop;
      if (flags.autostart !== undefined) s.autostart = flags.autostart === 'true';
    }
    stopMachine(state, id);
    if (flags['skip-start'] !== 'true') startMachine(state, id);
  }
  save(state);
  console.log(`Machine ${id} ${c2} done`);
  process.exit(0);
}

if (c1 === 'ssh' && c2 === 'console') {
  const m = needStarted(state, flags.machine);
  let command = flags.command || '';
  // the move sends its scripts in base64: decode it to match failure injection on the script's text
  const b64 = /printf %s ([A-Za-z0-9+/=]+) \| base64 -d/.exec(command);
  const text = b64 ? Buffer.from(b64[1], 'base64').toString('utf8') : command;
  for (const f of FAIL) {
    if (f.startsWith('script:') && text.includes(f.slice(7))) { process.stderr.write(`fake-fly: failing a script with ${f.slice(7)}\n`); process.exit(1); }
  }
  if (FAIL.has('ssh-stdin') && /^bash -c 'umask 077; cat > /.test(command)) process.exit(1);
  if (FAIL.has('ssh-stdout') && /^cat \//.test(command)) process.exit(1);
  command = mapUrl(command, state);
  const r = inMachine(m, words(command), 'inherit');
  process.exit(r.status ?? 1);
}

if (c1 === 'ssh' && c2 === 'sftp') {
  const m = needStarted(state, flags.machine);
  const [, , , from, to] = pos;
  if (c3 === 'get') {
    if (FAIL.has('sftp-get')) die('sftp: injected failure');
    if (existsSync(to)) die(`file ${to} is already there`);
    const fd = openSync(to, 'w', 0o600);
    const r = inMachine(m, ['cat', from], ['ignore', fd, 'inherit']);
    closeSync(fd);
    process.exit(r.status ?? 1);
  }
  if (c3 === 'put') {
    if (FAIL.has('sftp-put')) die('sftp: injected failure');
    const fd = openSync(from, 'r');
    const r = inMachine(m, ['sh', '-c', `cat > '${to}'`], [fd, 'inherit', 'inherit']);
    closeSync(fd);
    process.exit(r.status ?? 1);
  }
}

die(`fake-fly does not know: ${argv.join(' ')}`, 64);
