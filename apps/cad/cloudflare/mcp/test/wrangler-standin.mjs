#!/usr/bin/env node
// wrangler for test/move-from-fly.test.ts. Adds each call (its arguments, and the config file it was given) to
// WRANGLER_LOG as one JSON line, then:
// - with --local, runs the real wrangler (REAL_WRANGLER) with the same arguments: wrangler's own local R2;
// - with --remote (or no --local) and FAKE_R2 set, stands for Cloudflare: each folder in FAKE_R2 is a bucket and each
//   file in it an object, for the calls move-from-fly.mjs makes (r2 bucket list, r2 object get, put and delete),
//   with wrangler's own messages. A call without --local or --remote is refused: wrangler 4 would take it as local.
// Throwaway data only.

import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const at = argv.indexOf('--config');
const configPath = at >= 0 ? argv[at + 1] : undefined;
let config = null;
try {
  config = configPath ? JSON.parse(readFileSync(configPath, 'utf8')) : null;
} catch {
  config = 'unreadable';
}
if (process.env.WRANGLER_LOG) appendFileSync(process.env.WRANGLER_LOG, `${JSON.stringify({ argv, config, cwd: process.cwd() })}\n`);

const fail = (message) => {
  process.stderr.write(`\n\u2718 [ERROR] ${message}\n\n`); // as wrangler prints it
  process.exit(1);
};

if (argv.includes('--local')) {
  const r = spawnSync(process.execPath, [process.env.REAL_WRANGLER, ...argv], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

const root = process.env.FAKE_R2;
if (!root) fail('wrangler-standin: no FAKE_R2 for a call without --local');
if (!configPath) fail('wrangler-standin: no --config');
const [g1, g2, g3, target] = argv;
if (g1 === 'r2' && g2 === 'bucket' && g3 === 'list') {
  process.stdout.write('Listing buckets...\n');
  for (const b of readdirSync(root).sort()) process.stdout.write(`name:           ${b}\ncreation_date:  2026-11-01T00:00:00.000Z\n\n`);
  process.exit(0);
}
if (g1 !== 'r2' || g2 !== 'object' || !['get', 'put', 'delete'].includes(g3) || !target) fail(`wrangler-standin does not know: ${argv.join(' ')}`);
if (!argv.includes('--remote')) fail('wrangler-standin: an object call without --remote or --local (wrangler 4 would use local storage)');
const slash = target.indexOf('/');
const bucket = target.slice(0, slash);
const key = target.slice(slash + 1);
const object = join(root, bucket, ...key.split('/'));
const file = argv[argv.indexOf('--file') + 1];
if (g3 === 'get') {
  process.stdout.write(`Downloading "${key}" from "${bucket}".\n`);
  writeFileSync(file, ''); // as wrangler: the file is made before the object is read
  if (!existsSync(object) || !statSync(object).isFile()) fail('The specified key does not exist.');
  copyFileSync(object, file);
  process.stdout.write('Download complete.\n');
} else if (g3 === 'put') {
  if (!existsSync(join(root, bucket))) fail('The specified bucket does not exist.');
  process.stdout.write(`Creating object "${key}" in bucket "${bucket}".\n`);
  mkdirSync(dirname(object), { recursive: true });
  copyFileSync(file, object);
  process.stdout.write('Upload complete.\n');
} else {
  process.stdout.write(`Deleting object "${key}" from bucket "${bucket}".\n`);
  rmSync(object, { force: true });
  process.stdout.write('Delete complete.\n');
}
