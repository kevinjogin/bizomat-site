#!/usr/bin/env node
// Copies every R2 object that WORK_DATA_DIR/db.sqlite references into the
// Node file store (WORK_DATA_DIR/files + runtime.sqlite).
//
//   node scripts/migrate/copy-r2-objects.mjs <WORK_DATA_DIR> --from-dir <dir>
//   node scripts/migrate/copy-r2-objects.mjs <WORK_DATA_DIR> --bucket <bucket> --remote [--jurisdiction <j>]
//   node scripts/migrate/copy-r2-objects.mjs <WORK_DATA_DIR> --bucket <bucket> --local --wrangler-config <file>
//
// Referenced keys: attachments.r2_key, users.avatar_key, workspaces.logo_key
// (the only objects the Worker writes); other columns that look like object
// keys are reported. Sources:
//   --from-dir   a folder of downloaded objects, each at <dir>/<key> (key
//                segments as folders) or at <dir>/<sha256 of the key>;
//   --remote     `wrangler r2 object get <bucket>/<key> --remote` for each key
//                (needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID);
//   --local      the same against a local wrangler state (for dry runs).
// Each object is hashed (SHA-256), its size checked against the database,
// stored atomically with the metadata the Worker gave it (attachments: the
// content type and uploader recorded in the database; avatars and logos: the
// image type of the bytes, as the upload check set it), then read back and
// verified. Objects already stored with the same content are skipped, so
// running it again changes nothing. Missing objects and size mismatches are
// reported by kind and row id (keys and content are never printed).

import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { FileStore, isValidKey, keyHash, openRuntimeDatabase } from '../../src/node/store/file-store.ts';
import { FILES_BUCKET, dataLayout } from '../../src/node/store/layout.ts';
import { lockHolder } from '../../src/node/store/server-lock.ts';
import { DatabaseSync } from '../../src/node/store/sqlite.ts';
import { APP_ROOT, UsageError, die, loadReport, parseArgs, referencedObjects, saveReport, sha256Hex, sniffImageType, unknownKeyColumns } from './lib/common.mjs';

const run = promisify(execFile);
const USAGE = 'usage: copy-r2-objects.mjs <WORK_DATA_DIR> (--from-dir <dir> | --bucket <bucket> (--remote | --local --wrangler-config <file>)) [--jurisdiction <j>] [--concurrency <n>]';
const WRANGLER = join(APP_ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

class Missing extends Error {}

function fromDirSource(dir) {
  const root = resolve(dir);
  return {
    describe: `folder ${root}`,
    async fetch(key) {
      const segments = key.split('/');
      const safe = !key.includes('\\') && !key.includes('\u0000') && segments.every((s) => s !== '' && s !== '.' && s !== '..');
      const candidates = [...(safe ? [join(root, ...segments)] : []), join(root, keyHash(key))];
      for (const p of candidates) {
        if (!p.startsWith(root)) continue;
        if (existsSync(p) && statSync(p).isFile()) return readFileSync(p);
      }
      throw new Missing('not found in the folder');
    },
  };
}

function wranglerSource(bucket, mode, flags, work) {
  const base = ['r2', 'object', 'get'];
  const extra = mode === 'remote' ? ['--remote'] : ['--local', '--config', resolve(flags['wrangler-config'])];
  if (flags.jurisdiction) extra.push('--jurisdiction', flags.jurisdiction);
  let n = 0;
  return {
    describe: `wrangler r2 object get ${bucket}/<key> ${mode === 'remote' ? '--remote' : '--local'}`,
    async fetch(key) {
      const file = join(work, `object-${++n}`);
      try {
        await run(process.execPath, [WRANGLER, ...base, `${bucket}/${key}`, ...extra, '--file', file], {
          cwd: APP_ROOT,
          env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
          maxBuffer: 16 * 1024 * 1024,
        });
      } catch (e) {
        const out = `${e.stdout ?? ''}\n${e.stderr ?? ''}`;
        if (/does not exist|NoSuchKey|10007|not found/i.test(out)) throw new Missing('not found in the bucket');
        throw new Error(`wrangler failed: ${out.split('\n').filter((l) => /error|✘/i.test(l)).slice(0, 3).join(' ').slice(0, 300) || e.message}`, { cause: e });
      }
      if (!existsSync(file)) throw new Missing('wrangler wrote no file');
      const bytes = readFileSync(file);
      rmSync(file, { force: true });
      return bytes;
    },
  };
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2), { booleans: ['remote', 'local'], strings: ['from-dir', 'bucket', 'wrangler-config', 'jurisdiction', 'concurrency'] });
  } catch (e) {
    die(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e), 2);
  }
  const [dataArg] = args.positional;
  if (!dataArg || args.positional.length !== 1) die(USAGE, 2);
  const f = args.flags;
  const layout = dataLayout(dataArg);
  if (!existsSync(layout.db)) die(`${layout.db} not found: import the database first (import-d1-dump.mjs).`, 2);
  const holder = lockHolder(layout.root);
  if (holder && holder.alive !== false) die(`A server (pid ${holder.pid} on ${holder.host}) is using ${layout.root}. Stop it first.`, 2);
  const mode = f['from-dir'] ? 'dir' : f.bucket && f.remote ? 'remote' : f.bucket && f.local && f['wrangler-config'] ? 'local' : null;
  if (!mode) die(USAGE, 2);
  if (mode === 'dir' && !existsSync(f['from-dir'])) die(`Folder not found: ${f['from-dir']}`, 2);
  if (mode === 'remote' && (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID)) die('--remote needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.', 2);
  const work = mkdtempSync(join(layout.root, '.copy-'));
  const source = mode === 'dir' ? fromDirSource(f['from-dir']) : wranglerSource(f.bucket, mode, f, work);
  const concurrency = Math.max(1, Math.min(16, Number(f.concurrency ?? 4) || 4));

  const db = new DatabaseSync(layout.db, { readOnly: true });
  const refs = referencedObjects(db);
  const unknownColumns = unknownKeyColumns(db);
  db.close();
  const seen = new Set();
  const unique = refs.filter((r) => (seen.has(r.key) ? false : (seen.add(r.key), true)));
  const byKind = {};
  for (const r of refs) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;

  const rdb = openRuntimeDatabase(layout.runtime);
  const store = new FileStore(layout.files, rdb);
  const result = { copied: 0, alreadyPresent: 0, verified: 0, bytes: 0, missing: [], sizeMismatches: [], verifyFailures: [] };

  const copyOne = async (ref) => {
    if (!isValidKey(ref.key)) {
      result.missing.push({ kind: ref.kind, id: ref.id, note: 'the key is not a valid R2 key' });
      return;
    }
    let bytes;
    try {
      bytes = await source.fetch(ref.key);
    } catch (e) {
      if (!(e instanceof Missing)) throw e;
      result.missing.push({ kind: ref.kind, id: ref.id, note: ref.deleted ? 'expected: the attachment was deleted in the app' : e.message });
      return;
    }
    const sha256 = sha256Hex(bytes);
    if (ref.size !== undefined && ref.size !== bytes.length) result.sizeMismatches.push({ kind: ref.kind, id: ref.id, expected: ref.size, actual: bytes.length });
    const contentType = ref.kind === 'attachment' ? ref.contentType : (sniffImageType(bytes) ?? 'application/octet-stream');
    const existing = store.head(FILES_BUCKET, ref.key);
    if (existing && existing.sha256 === sha256 && existing.size === bytes.length && existing.httpMetadata.contentType === contentType) result.alreadyPresent++;
    else {
      await store.put(FILES_BUCKET, ref.key, bytes, { httpMetadata: { contentType }, customMetadata: ref.customMetadata ?? {}, uploaded: ref.uploaded, sha256 });
      result.copied++;
    }
    result.bytes += bytes.length;
    const stored = store.head(FILES_BUCKET, ref.key);
    const check = stored ? await store.verify(stored) : { ok: false, problem: 'missing' };
    if (check.ok && stored.sha256 === sha256) result.verified++;
    else result.verifyFailures.push({ kind: ref.kind, id: ref.id, problem: check.problem ?? 'sha256' });
  };

  try {
    let next = 0;
    let failure = null;
    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        while (!failure && next < unique.length) {
          try {
            await copyOne(unique[next++]);
          } catch (e) {
            failure ??= e;
          }
        }
      }),
    );
    if (failure) throw failure;
  } finally {
    rdb.close();
    rmSync(work, { recursive: true, force: true });
  }

  const unexpectedMissing = result.missing.filter((m) => !m.note.startsWith('expected'));
  const ok = unexpectedMissing.length === 0 && result.verifyFailures.length === 0;
  const report = loadReport(layout.root);
  report.files = { ok, at: new Date().toISOString(), source: source.describe, referenced: refs.length, byKind, unknownKeyColumns: unknownColumns, ...result };
  saveReport(layout.root, report);
  console.log(`Referenced objects: ${refs.length} (${Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'})`);
  console.log(`Copied ${result.copied}, already present ${result.alreadyPresent}, verified ${result.verified}, ${result.bytes} bytes`);
  console.log(`Missing ${result.missing.length} (${result.missing.length - unexpectedMissing.length} expected because deleted), size mismatches ${result.sizeMismatches.length}, verification failures ${result.verifyFailures.length}`);
  if (unknownColumns.length) console.log(`Note: columns that look like object keys were not copied: ${unknownColumns.join(', ')}`);
  console.log(ok ? 'All referenced objects are in the file store.' : 'Some objects are missing or failed verification: see the report.');
  console.log(`Report: ${join(layout.root, 'migration-report.md')}`);
  process.exit(ok ? 0 : 1);
}

main().catch((e) => die(`Copy failed: ${e instanceof Error ? e.message : String(e)}`));
