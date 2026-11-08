#!/usr/bin/env node
// A stand-in for flyctl, for test/move-from-fly.test.ts: only the commands scripts/move-from-fly.mjs runs.
// Each Machine is a folder on this computer that stands for its filesystem: /data in a command becomes
// <folder>/data, and a command that names another top-level folder (/tmp, /usr, /app, ...) is refused, so the tool
// can only touch the Machine's /data. `ssh console --command` is split into words as flyctl's ssh server does it
// (no shell runs it) and the words are run here, with this computer's sh, python3 and coreutils.
//
//   FAKEFLY_STATE    a JSON file: {"apps": {"<app>": [{"id", "state", "group", "root"}]}}
//   FAKEFLY_LOG      every call is added to it as one JSON line (its arguments)
//   FAKEFLY_CORRUPT  a regular expression: what a matching ssh command prints has one byte changed
//   FAKEFLY_HANG     a regular expression: a matching ssh command waits a minute before it runs
// Throwaway data only.

import { spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeSync } from 'node:fs';

const die = (message, code = 1) => {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(code);
};

const argv = process.argv.slice(2);
if (process.env.FAKEFLY_LOG) appendFileSync(process.env.FAKEFLY_LOG, `${JSON.stringify(argv)}\n`);
const state = JSON.parse(readFileSync(process.env.FAKEFLY_STATE ?? die('FAKEFLY_STATE is not set'), 'utf8'));

const flags = {};
const pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) {
    pos.push(a);
    continue;
  }
  const k = a.slice(2);
  if (['json', 'quiet'].includes(k)) flags[k] = true;
  else if (['app', 'machine', 'command'].includes(k)) flags[k] = argv[++i];
  else die(`unknown flag: ${a}`, 64);
}

/** POSIX shell words, as flyctl's ssh server splits --command (quotes and backslashes; no shell is run). */
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
      for (i++; i < s.length && s[i] !== '"'; i++) {
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

const apps = state.apps ?? {};
const [c1, c2] = pos;
if (!flags.app || !apps[flags.app]) die(`app ${flags.app} not found`);
const machines = apps[flags.app];

if (c1 === 'machines' && c2 === 'list' && flags.json) {
  const list = machines.map((m) => ({ id: m.id, name: m.id, state: m.state, region: 'syd', config: { metadata: { fly_process_group: m.group ?? 'app' } } }));
  process.stdout.write(`${JSON.stringify(list, null, 2)}\n`);
  process.exit(0);
}

if (c1 === 'ssh' && c2 === 'console' && flags.command !== undefined) {
  const m = machines.find((x) => x.id === flags.machine);
  if (!m) die(`machine ${flags.machine} not found in app ${flags.app}`);
  if (m.state !== 'started') die(`machine ${m.id} is not started`);
  const command = flags.command;
  const outside = /(^|[\s'"=<>;&|(])\/(tmp|var|home|root|etc|usr|app|opt|bin|sbin|lib|lib64|srv|mnt|media|proc|sys|run|boot)(?=$|[\s'"/;&|)])/.exec(command);
  if (outside) die(`fake-fly: the command reaches outside the Machine's /data: /${outside[2]}`, 65);
  const mapped = command.replace(/(^|[\s'"=<>;&|(])\/data(?=$|[\s'"/;&|)<>])/g, `$1${m.root}/data`);
  const w = words(mapped);
  if (process.env.FAKEFLY_HANG && new RegExp(process.env.FAKEFLY_HANG).test(command)) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 60_000);
  }
  const env = { PATH: process.env.PATH ?? '/usr/bin:/bin', LANG: 'C.UTF-8' };
  if (process.env.FAKEFLY_CORRUPT && new RegExp(process.env.FAKEFLY_CORRUPT).test(command)) {
    const r = spawnSync(w[0], w.slice(1), { cwd: m.root, env, stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 30 });
    const out = Buffer.from(r.stdout ?? Buffer.alloc(0));
    if (out.length) {
      // one byte from the middle on: the first letter or digit becomes another (so base64 text decodes to other
      // bytes too); binary without one gets a bit flipped
      const mid = Math.floor(out.length / 2);
      let at = mid;
      while (at < out.length && !/[A-Za-z0-9]/.test(String.fromCharCode(out[at]))) at++;
      if (at < out.length) out[at] = out[at] === 65 ? 66 : 65;
      else out[mid] ^= 1;
    }
    for (let off = 0; off < out.length; ) off += writeSync(1, out, off, out.length - off);
    process.exit(r.status ?? 1);
  }
  const r = spawnSync(w[0], w.slice(1), { cwd: m.root, env, stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.error) die(`${w[0]}: ${r.error.code}`, 127);
  process.exit(r.status ?? 1);
}

die(`fake-fly does not know: ${argv.join(' ')}`, 64);
