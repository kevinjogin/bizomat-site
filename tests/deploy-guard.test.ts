// The website Worker deploys from the owner's laptop only, from a clean checkout that is exactly origin/main
// (scripts/deploy-guard.mjs, run by wrangler before every build). Each case runs the guard in a scratch repository
// with its own origin.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const GUARD = path.resolve('scripts/deploy-guard.mjs');
const TOML = 'name = "bizomat"\nmain = "src/worker.ts"\nroutes = [\n  { pattern = "bizomat.ai/*", zone_name = "bizomat.ai" },\n]\n';

function sh(cwd: string, ...args: string[]) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.com', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.com' } });
  assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}

/** A clone whose origin is a local bare repository holding one commit on main. */
function checkout(toml = TOML) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-guard-'));
  const origin = path.join(root, 'origin.git');
  const work = path.join(root, 'work');
  sh(root, 'init', '--quiet', '--bare', '--initial-branch=main', origin);
  sh(root, 'clone', '--quiet', origin, work);
  fs.writeFileSync(path.join(work, 'wrangler.toml'), toml);
  sh(work, 'add', 'wrangler.toml');
  sh(work, 'commit', '--quiet', '-m', 'site');
  sh(work, 'push', '--quiet', 'origin', 'HEAD:main');
  return { root, origin, work };
}

function guard(cwd: string, env: Record<string, string>) {
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('WORKERS_CI') && k !== 'npm_lifecycle_event' && k !== 'BIZOMAT_DEPLOY'));
  return spawnSync(process.execPath, [GUARD], { cwd, env: { ...clean, ...env }, encoding: 'utf8' });
}

test('npm run preview goes through; Workers Builds never does', () => {
  const { work } = checkout();
  assert.equal(guard(work, { npm_lifecycle_event: 'preview' }).status, 0);
  const builds: Record<string, string>[] = [{ WORKERS_CI: '1' }, { WORKERS_CI_BUILD_UUID: 'b' }, { WORKERS_CI: '1', npm_lifecycle_event: 'preview', BIZOMAT_DEPLOY: 'website' }];
  for (const env of builds) {
    const r = guard(work, env);
    assert.equal(r.status, 1, JSON.stringify(env));
    assert.match(r.stderr, /Workers Builds/);
  }
});

test('a deploy needs the laptop tool', () => {
  const { work } = checkout();
  const plain: Record<string, string>[] = [{}, { npm_lifecycle_event: 'deploy' }, { BIZOMAT_DEPLOY: '1' }];
  for (const env of plain) {
    const r = guard(work, env);
    assert.equal(r.status, 1, JSON.stringify(env));
    assert.match(r.stderr, /cloudflare\.ps1 deploy website/);
  }
});

test('the laptop tool deploys a clean checkout of origin/main', () => {
  const { work } = checkout();
  const r = guard(work, { BIZOMAT_DEPLOY: 'website' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /bizomat from origin\/main [0-9a-f]{12}/);
});

test('changes, a commit that is not on main, or a stale checkout stop it', () => {
  const { origin, work, root } = checkout();
  fs.writeFileSync(path.join(work, 'notes.txt'), 'x');
  assert.match(guard(work, { BIZOMAT_DEPLOY: 'website' }).stderr, /has changes/);
  fs.rmSync(path.join(work, 'notes.txt'));

  sh(work, 'commit', '--quiet', '--allow-empty', '-m', 'local only');
  assert.match(guard(work, { BIZOMAT_DEPLOY: 'website' }).stderr, /is not origin\/main/);
  sh(work, 'reset', '--quiet', '--hard', 'HEAD~1');

  // someone else moved main on: this checkout is behind
  const other = path.join(root, 'other');
  sh(root, 'clone', '--quiet', origin, other);
  sh(other, 'commit', '--quiet', '--allow-empty', '-m', 'newer');
  sh(other, 'push', '--quiet', 'origin', 'HEAD:main');
  const r = guard(work, { BIZOMAT_DEPLOY: 'website' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /is not origin\/main/);
});

test('only the Worker bizomat, and never kevos.com', () => {
  const kevos = checkout('name = "throbbing-block-6c61"\nmain = "src/worker.ts"\n');
  assert.match(guard(kevos.work, { npm_lifecycle_event: 'preview' }).stderr, /this site is the Worker "bizomat"/);
  const route = checkout(`${TOML.replace(']\n', '  { pattern = "kevos.com/*", zone_name = "kevos.com" },\n]\n')}`);
  assert.match(guard(route.work, { BIZOMAT_DEPLOY: 'website' }).stderr, /kevos\.com stays the KEVOS site/);
});

test('wrangler runs the guard before every build of this repository\'s Worker', () => {
  const toml = fs.readFileSync('wrangler.toml', 'utf8');
  assert.match(toml, /^name = "bizomat"$/m);
  // a table header ends the top-level keys: [build] must come after name, main, routes and the others
  assert.match(toml, /^\[build\]\ncommand = "node scripts\/deploy-guard\.mjs"$/m);
  assert.ok(toml.indexOf('\n[build]\n') > toml.indexOf('\nroutes = ['), '[build] must not capture the top-level keys');
  assert.doesNotMatch(toml.replace(/^#.*$/gm, ''), /kevos\.com\/\*|zone_name = "kevos\.com"/);
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts.deploy, 'wrangler deploy');
  assert.doesNotMatch(pkg.scripts.preview, /npx/, 'npx would hide npm run preview from the guard');
});
