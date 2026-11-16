// .github/scripts/stage-secrets.sh (the deploy's "Stage settings from repository secrets" step): what it stages on Fly,
// what it refuses, and that no value is ever printed. flyctl is a stand-in that records what it was given.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, chmodSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Not keys: shaped like the real ones, built at run time (secret scanners read this repository).
const fake = (...parts: string[]) => parts.join('_');
const CAD = 'ab'.repeat(32);
const STRIPE = fake('rk', 'live', 'stageScriptNotAKey123');
const PUBLISHABLE = fake('pk', 'live', 'stageScriptNotAKey456');
const WEBHOOK = fake('whsec', 'stageScriptNotASecret789');

function stage(env: Record<string, string>, mode = 'live') {
  const dir = mkdtempSync(join(tmpdir(), 'stage-'));
  const config = join(dir, 'fly.website.toml');
  writeFileSync(config, `[env]\nWORK_STRIPE_ENVIRONMENT = "${mode}"\n`);
  const staged = join(dir, 'staged.txt');
  writeFileSync(join(dir, 'flyctl'), `#!/usr/bin/env bash\ncat > "${staged}"\n`);
  chmodSync(join(dir, 'flyctl'), 0o755);
  const r = spawnSync('bash', ['.github/scripts/stage-secrets.sh'], {
    env: { PATH: `${dir}:${process.env.PATH}`, APP: 'bizomat', CONFIG: config, ...env },
    encoding: 'utf8',
  });
  const lines = existsSync(staged) ? readFileSync(staged, 'utf8').trim().split('\n') : [];
  return { code: r.status, out: `${r.stdout}${r.stderr}`, names: lines.map((l) => l.split('=')[0]), lines };
}

const VALUES = [CAD, STRIPE, PUBLISHABLE, WEBHOOK];

test('every setting staged on standard input, by name only in the log', () => {
  const r = stage({ CAD_CLIENT_SECRET: CAD, STRIPE_SECRET: STRIPE, STRIPE_PUBLISHABLE: PUBLISHABLE, STRIPE_WEBHOOK: WEBHOOK });
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(r.names, ['WORK_BIZOMAT_ID_CLIENTS', 'WORK_STRIPE_SECRET_KEY', 'WORK_STRIPE_PUBLISHABLE_KEY', 'WORK_STRIPE_WEBHOOK_SECRET']);
  assert.ok(!r.lines[0].includes(CAD) && r.lines[0].includes('https://bizomat.ai/cad/auth/bizomat/callback'), 'only the hash of the CAD secret');
  for (const v of VALUES) assert.ok(!r.out.includes(v), 'a value was printed');
});

test('nothing set stages nothing; billing keys stay in GitHub when billing is not live', () => {
  const none = stage({});
  assert.equal(none.code, 0);
  assert.deepEqual(none.names, []);
  const notLive = stage({ STRIPE_SECRET: STRIPE }, 'test');
  assert.equal(notLive.code, 0, notLive.out);
  assert.deepEqual(notLive.names, []);
  assert.match(notLive.out, /NOT staged/);
});

test('a wrong value stops the step before anything is staged, and is not printed', () => {
  for (const env of [
    { STRIPE_PUBLISHABLE: 'not-a-publishable-key' },
    { STRIPE_WEBHOOK: 'has spaces and = signs' },
    { STRIPE_SECRET: fake('sk', 'test', 'stageScriptNotAKey') },
  ] as Record<string, string>[]) {
    const r = stage(env);
    assert.equal(r.code, 1, JSON.stringify(Object.keys(env)));
    assert.deepEqual(r.names, [], 'nothing staged');
    assert.match(r.out, /Nothing was staged/);
    for (const v of Object.values(env)) assert.ok(!r.out.includes(v), 'a value was printed');
  }
});
