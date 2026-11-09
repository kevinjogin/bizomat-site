#!/usr/bin/env node
// apps/cad is CAD Automation exactly as the CADOS repository holds it at one commit. CADOS is what runs and where CAD
// Automation is changed (its tests, the add-in and installer releases); the cad process group of the Fly app bizomat
// is built from apps/cad (infrastructure/fly/Dockerfile). apps/cad-source.json names that CADOS commit and its tree, so
// anyone can prove what runs: git's tree hash of apps/cad must equal the pinned tree. Never edit apps/cad here; change
// CADOS (a pull request there), then bring it across with this script in a gocore-website pull request of its own.
//
//   node scripts/sync-cad.mjs check [--cados <dir> | --github]
//       apps/cad, as committed, is the pinned tree and has no local changes. With a CADOS clone (--cados) or GitHub
//       (--github), also that the pinned commit really has that tree.
//   node scripts/sync-cad.mjs to [<commit>] [--cados <dir>]
//       replace apps/cad with CADOS <commit> (default: origin/main of the CADOS clone, or main on GitHub) and update the
//       pin. Staged, not committed. Refuses when the folder has local changes.
//   node scripts/sync-cad.mjs show
//       the pin as JSON (for scripts such as the laptop's bizomat.ps1).
//
// Without --cados, the CAD repository (kevinjogin/bizomat-cad since 9 Nov 2026, formerly jogkev-creator/CADOS, same
// commits) is fetched from GitHub; it is private, so that needs Git credentials that can read it. Prints commits, trees
// and counts only.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PIN = join(ROOT, 'apps', 'cad-source.json');
const PREFIX = 'apps/cad';
const GITHUB = 'https://github.com/kevinjogin/bizomat-cad';
const HEX40 = /^[0-9a-f]{40}$/;
const USAGE = 'usage: sync-cad.mjs check [--cados <dir> | --github] | to [<commit>] [--cados <dir>] | show';

class Stop extends Error {}
const stop = (s) => { throw new Stop(s); };
const say = (s) => console.log(s);

function git(args, { cwd = ROOT, allowFail = false } = {}) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.error) stop(`git could not run (${r.error.code}): install Git`);
  if (r.status !== 0 && !allowFail) stop(`git ${args.slice(0, 3).join(' ')} failed: ${(r.stderr || '').trim().split('\n').pop()}`);
  return r.status === 0 ? r.stdout.trim() : null;
}

export function readPin(file = PIN) {
  if (!existsSync(file)) stop(`${file} is missing: run node scripts/sync-cad.mjs to <commit>`);
  let pin;
  try { pin = JSON.parse(readFileSync(file, 'utf8')); } catch { stop(`${file} is not JSON`); }
  if (!HEX40.test(pin?.commit ?? '') || !HEX40.test(pin?.tree ?? '')) stop(`${file} needs a 40-character commit and tree`);
  return pin;
}

function parse(argv) {
  const [cmd, ...rest] = argv;
  const o = { cmd, commit: '', cados: '', github: false };
  if (!['check', 'to', 'show'].includes(cmd)) stop(USAGE);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--cados' && rest[i + 1]) o.cados = resolve(rest[++i]);
    else if (a === '--github' && cmd === 'check') o.github = true;
    else if (cmd === 'to' && !a.startsWith('--') && !o.commit) o.commit = a;
    else stop(USAGE);
  }
  if (o.cados && !existsSync(join(o.cados, '.git'))) stop(`${o.cados} is not a git clone of CADOS`);
  return o;
}

/** The tree of a CADOS commit, from a clone or from GitHub (fetched into this repository's objects). */
function cadosTree(o, commit) {
  if (o.cados) {
    if (git(['cat-file', '-e', `${commit}^{commit}`], { cwd: o.cados, allowFail: true }) === null) {
      git(['fetch', '--quiet', '--no-tags', 'origin', commit], { cwd: o.cados, allowFail: true });
    }
    return git(['rev-parse', '--verify', `${commit}^{tree}`], { cwd: o.cados, allowFail: true });
  }
  if (git(['fetch', '--quiet', '--no-tags', '--depth=1', GITHUB, commit], { allowFail: true }) === null) return null;
  return git(['rev-parse', '--verify', 'FETCH_HEAD^{tree}'], { allowFail: true });
}

function check(o) {
  const pin = readPin();
  const committed = git(['rev-parse', '--verify', `HEAD:${PREFIX}`]);
  if (committed !== pin.tree) {
    stop(`apps/cad as committed (tree ${committed.slice(0, 12)}) is not the pinned CADOS tree (${pin.tree.slice(0, 12)}). ` +
      'apps/cad changes only through scripts/sync-cad.mjs to <commit>, from a CADOS commit.');
  }
  const local = git(['status', '--porcelain', '--untracked-files=normal', '--', PREFIX, 'apps/cad-source.json']);
  if (local) stop(`apps/cad has local changes (${local.split('\n').length} paths); a build would not be the pinned CADOS commit`);
  say(`apps/cad is CADOS ${pin.commit.slice(0, 7)} exactly (tree ${pin.tree.slice(0, 12)})`);
  if (o.cados || o.github) {
    const tree = cadosTree(o, pin.commit);
    if (!tree) stop(`CADOS commit ${pin.commit.slice(0, 7)} was not found ${o.cados ? `in ${o.cados}` : 'on GitHub'}`);
    if (tree !== pin.tree) stop(`CADOS commit ${pin.commit.slice(0, 7)} has tree ${tree.slice(0, 12)}, not the pinned ${pin.tree.slice(0, 12)}`);
    say(`and that is the tree of CADOS ${pin.commit.slice(0, 7)} ${o.cados ? `in ${o.cados}` : 'on GitHub'}`);
  }
}

function to(o) {
  if (git(['status', '--porcelain'])) stop('this folder has local changes: commit or undo them first, so the sync is a change of its own');
  let commit;
  let tree;
  let subject = '';
  if (o.cados) {
    const want = o.commit || 'origin/main';
    commit = git(['rev-parse', '--verify', `${want}^{commit}`], { cwd: o.cados, allowFail: true });
    if (!commit) stop(`${want} is not a commit in ${o.cados} (git -C "${o.cados}" fetch origin, then try again)`);
    tree = git(['rev-parse', `${commit}^{tree}`], { cwd: o.cados });
    subject = git(['log', '-1', '--format=%s', commit], { cwd: o.cados });
    git(['fetch', '--quiet', '--no-tags', o.cados, commit]);
  } else {
    git(['fetch', '--quiet', '--no-tags', '--depth=1', GITHUB, o.commit || 'main']);
    commit = git(['rev-parse', 'FETCH_HEAD']);
    tree = git(['rev-parse', 'FETCH_HEAD^{tree}']);
    subject = git(['log', '-1', '--format=%s', 'FETCH_HEAD']);
  }
  const before = git(['rev-parse', '--verify', `HEAD:${PREFIX}`], { allowFail: true });
  if (before === tree) {
    say(`apps/cad is already CADOS ${commit.slice(0, 7)} (tree ${tree.slice(0, 12)}): nothing to change`);
    const pin = existsSync(PIN) ? readPin() : null;
    if (pin && pin.commit === commit) return;
  } else {
    git(['rm', '-r', '-q', '--ignore-unmatch', '--', PREFIX]);
    git(['read-tree', `--prefix=${PREFIX}/`, '-u', commit]);
  }
  const pin = {
    repository: 'kevinjogin/bizomat-cad',
    commit,
    tree,
    subject,
    note: 'apps/cad is this CADOS commit byte for byte (scripts/sync-cad.mjs). Change CAD Automation in CADOS, then sync.',
  };
  writeFileSync(PIN, `${JSON.stringify(pin, null, 2)}\n`);
  git(['add', '--', 'apps/cad-source.json']);
  const staged = git(['write-tree', `--prefix=${PREFIX}/`]);
  if (staged !== tree) stop(`after the copy apps/cad has tree ${staged}, not ${tree}: something else is staged`);
  const stat = git(['diff', '--cached', '--shortstat']);
  say(`apps/cad is now CADOS ${commit.slice(0, 7)}: ${subject}`);
  say(`staged: ${stat || 'the pin only'}. Commit it on a branch of its own and open a pull request.`);
}

function main(argv) {
  const o = parse(argv);
  if (o.cmd === 'show') return say(JSON.stringify(readPin()));
  if (o.cmd === 'check') return check(o);
  return to(o);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error(`sync-cad: ${e instanceof Stop ? e.message : e?.stack || e}`);
    process.exit(1);
  }
}
