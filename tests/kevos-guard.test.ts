// kevos.com is the KEVOS site again (Stage 0): nothing in this repository may publish to its Worker. wrangler runs
// scripts/kevos-guard.mjs before every deploy and upload ([build] in wrangler.toml), and so does `npm run deploy`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

function guard(env: Record<string, string>) {
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('WORKERS_CI') && k !== 'npm_lifecycle_event'));
  return spawnSync(process.execPath, ['scripts/kevos-guard.mjs'], { env: { ...clean, ...env }, encoding: 'utf8' });
}

test('the guard stops Cloudflare Workers Builds, npm run deploy and a direct wrangler deploy', () => {
  for (const env of [{ WORKERS_CI: '1' }, { WORKERS_CI_BUILD_UUID: 'b' }, { WORKERS_CI: '1', npm_lifecycle_event: 'preview' },
    { npm_lifecycle_event: 'deploy' }, { npm_lifecycle_event: 'npx' }, {}]) {
    const r = guard(env);
    assert.equal(r.status, 1, JSON.stringify(env));
    assert.match(r.stderr, /kevos\.com stays the KEVOS site/);
  }
  assert.match(guard({ WORKERS_CI: '1' }).stderr, /Settings > Build > Disconnect/);
});

test('npm run preview (wrangler dev on this computer) still runs', () => {
  assert.equal(guard({ npm_lifecycle_event: 'preview' }).status, 0);
});

test('wrangler runs the guard before every build, and npm run deploy is the guard', () => {
  const toml = fs.readFileSync('wrangler.toml', 'utf8');
  // a table header ends the top-level keys: [build] must come after name, main, routes and the others
  assert.match(toml, /^\[build\]\ncommand = "node scripts\/kevos-guard\.mjs"$/m);
  assert.ok(toml.indexOf('\n[build]\n') > toml.indexOf('\nroutes = ['), '[build] must not capture the top-level keys');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts.deploy, 'node scripts/kevos-guard.mjs');
  assert.doesNotMatch(pkg.scripts.preview, /npx/, 'npx would hide npm run preview from the guard');
});
