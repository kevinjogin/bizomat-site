#!/usr/bin/env node
// Consistent backup of a WORK_DATA_DIR, safe while the server runs.
//
//   node scripts/migrate/backup-data-dir.mjs <WORK_DATA_DIR> <BACKUP_DIR>
//
// 1. db.sqlite and runtime.sqlite are copied with SQLite's VACUUM INTO (a
//    transaction-consistent snapshot; the server keeps working).
// 2. Every object the copied index lists is copied from files/ (object files
//    are never changed in place, only added and removed) and its SHA-256
//    checked against the index. An object deleted between steps 1 and 2 is
//    reported; it was deleted in the app as well.
// BACKUP_DIR must not exist yet. Restore: stop the server, copy BACKUP_DIR to
// an empty WORK_DATA_DIR, run verify-data-dir.mjs, start the server.

import { createHash } from 'node:crypto';
import { copyFileSync, createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { FileStore, openRuntimeDatabase } from '../../src/node/store/file-store.ts';
import { dataLayout } from '../../src/node/store/layout.ts';
import { DatabaseSync } from '../../src/node/store/sqlite.ts';
import { UsageError, die, fsyncPath, parseArgs } from './lib/common.mjs';

const USAGE = 'usage: backup-data-dir.mjs <WORK_DATA_DIR> <BACKUP_DIR>';

async function sha256File(p) {
  const h = createHash('sha256');
  for await (const chunk of createReadStream(p)) h.update(chunk);
  return h.digest('hex');
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    die(e instanceof UsageError ? `${e.message}\n${USAGE}` : String(e), 2);
  }
  const [srcArg, dstArg] = args.positional;
  if (!srcArg || !dstArg || args.positional.length !== 2) die(USAGE, 2);
  const src = dataLayout(srcArg);
  const dst = dataLayout(resolve(dstArg));
  if (!existsSync(src.db)) die(`${src.db} not found.`, 2);
  if (existsSync(dst.root)) die(`${dst.root} already exists; choose a new folder.`, 2);
  mkdirSync(dst.root, { recursive: true, mode: 0o700 });

  for (const [from, to] of [
    [src.db, dst.db],
    [src.runtime, dst.runtime],
  ]) {
    if (!existsSync(from)) continue;
    const db = new DatabaseSync(from, { readOnly: true, timeout: 10_000 });
    db.prepare('VACUUM INTO ?').run(to);
    db.close();
    fsyncPath(to);
  }

  let copied = 0;
  let bytes = 0;
  const gone = [];
  const bad = [];
  if (existsSync(dst.runtime)) {
    const rdb = openRuntimeDatabase(dst.runtime);
    const index = new FileStore(dst.files, rdb);
    const live = new FileStore(src.files, rdb);
    for (const o of index.all()) {
      const from = live.path(o.bucket, o.key, o.version);
      const to = index.path(o.bucket, o.key, o.version);
      if (!existsSync(from)) {
        gone.push(o);
        continue;
      }
      mkdirSync(dirname(to), { recursive: true, mode: 0o700 });
      copyFileSync(from, to);
      fsyncPath(to);
      if (statSync(to).size !== o.size || (await sha256File(to)) !== o.sha256) bad.push(o);
      copied++;
      bytes += o.size;
    }
    rdb.close();
  }
  fsyncPath(dst.root);
  console.log(`Backup in ${dst.root}: databases copied with VACUUM INTO; ${copied} objects (${bytes} bytes) copied and checked.`);
  if (gone.length) console.log(`${gone.length} objects were deleted while the backup ran (deleted in the app too); run verify-data-dir.mjs on the backup for details.`);
  if (bad.length) die(`${bad.length} objects did not match their checksums; the source folder needs verify-data-dir.mjs.`, 1);
  process.exit(0);
}

main().catch((e) => die(`Backup failed: ${e instanceof Error ? e.message : String(e)}`));
