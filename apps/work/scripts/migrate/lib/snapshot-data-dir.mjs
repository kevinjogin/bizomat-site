#!/usr/bin/env node
// A consistent copy of a Project Management data folder (WORK_DATA_DIR), for to-cloudflare.mjs. It uses Node's
// built-in modules only: to-cloudflare.mjs sends this file to the work Machine of the Fly app and runs it there with the
// image's node (through fly ssh console, as root); a rehearsal runs it on this computer.
//
//   node --no-warnings snapshot-data-dir.mjs <db.sqlite> <runtime.sqlite | -> <files dir> <new folder>
//
// 1. db.sqlite, then runtime.sqlite (the index of the stored files), with VACUUM INTO: each is a transaction-consistent
//    copy, made while the server keeps working (as backup-data-dir.mjs does). db.sqlite goes first: a file uploaded
//    between the two copies is then only an extra file, never a row without its file.
// 2. Every file the copied index lists for the FILES bucket, at <files dir>/FILES/<aa>/<bb>/<sha256 of key>.<version>:
//    a hard link where the new folder is on the same volume (a stored body is never changed in place, so the link keeps
//    it as it was even if the server removes it, and takes no space), else a copy; then its size and SHA-256 are
//    compared with the index.
// The new folder has the layout of a data folder. Prints one line, "BIZOMAT-SNAPSHOT <json>": the names to pack, the
// size and SHA-256 of the two database copies, counts. Never a row or a file's content.

import { createHash } from 'node:crypto';
import { closeSync, copyFileSync, existsSync, linkSync, mkdirSync, openSync, readSync, statSync, statfsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const result = { ok: false };

function sha256OfFile(path) {
  const h = createHash('sha256');
  const buf = Buffer.allocUnsafe(1 << 20);
  const fd = openSync(path, 'r');
  try {
    for (let n; (n = readSync(fd, buf, 0, buf.length, null)) > 0; ) h.update(buf.subarray(0, n));
  } finally {
    closeSync(fd);
  }
  return h.digest('hex');
}

const sizeOf = (p) => (existsSync(p) ? statSync(p).size : 0);

try {
  const [dbPath, runtimePath, filesDir, out] = process.argv.slice(2);
  if (!dbPath || !runtimePath || !filesDir || !out) throw new Error('usage: snapshot-data-dir.mjs <db.sqlite> <runtime.sqlite | -> <files dir> <new folder>');
  if (!existsSync(dbPath)) throw new Error(`${dbPath} not found`);
  // node:sqlite (Node 22.13 and later, no flag); --no-warnings keeps its "experimental" note off the output
  const { DatabaseSync } = await import('node:sqlite');
  result.serverRunning = existsSync(join(dirname(dbPath), 'server.lock'));
  const databases = [['db.sqlite', dbPath]];
  if (runtimePath !== '-' && existsSync(runtimePath)) databases.push(['runtime.sqlite', runtimePath]);

  // The copies of the databases are the only new bytes on the volume: never fill it (the live server writes there).
  const free = () => {
    const s = statfsSync(dirname(out));
    return Number(s.bavail) * Number(s.bsize);
  };
  const reserve = 64 << 20;
  const need = databases.reduce((s, [, p]) => s + sizeOf(p) + sizeOf(`${p}-wal`), 0) + reserve;
  if (free() < need) throw new Error(`not enough free space for a copy of the databases (${need} bytes needed, ${free()} free)`);

  mkdirSync(out, { mode: 0o700 }); // a new folder: fails if it exists
  for (const [name, from] of databases) {
    const db = new DatabaseSync(from, { readOnly: true, timeout: 15_000 });
    try {
      db.prepare('VACUUM INTO ?').run(join(out, name));
    } finally {
      db.close();
    }
  }
  result.databases = databases.map(([name]) => name);
  result.sizes = Object.fromEntries(result.databases.map((n) => [n, statSync(join(out, n)).size]));
  result.sha256 = Object.fromEntries(result.databases.map((n) => [n, sha256OfFile(join(out, n))]));

  const files = { objects: 0, bytes: 0, linked: 0, copied: 0, gone: 0, mismatched: 0 };
  if (existsSync(join(out, 'runtime.sqlite'))) {
    const index = new DatabaseSync(join(out, 'runtime.sqlite'), { readOnly: true });
    let rows = [];
    try {
      if (index.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'r2_objects'").get()) {
        rows = index.prepare("SELECT key, version, size, sha256 FROM r2_objects WHERE bucket = 'FILES' ORDER BY key").all();
      }
    } finally {
      index.close();
    }
    for (const r of rows) {
      if (!/^[0-9a-f]{32}$/.test(String(r.version))) throw new Error('the file index has an entry with an invalid version');
      const h = createHash('sha256').update(String(r.key), 'utf8').digest('hex');
      const rel = join('FILES', h.slice(0, 2), h.slice(2, 4), `${h}.${r.version}`);
      const from = join(filesDir, rel);
      const to = join(out, 'files', rel);
      mkdirSync(dirname(to), { recursive: true, mode: 0o700 });
      try {
        linkSync(from, to);
        files.linked++;
      } catch (e) {
        if (e?.code === 'ENOENT') {
          files.gone++; // removed by the server after the index was copied
          continue;
        }
        if (free() < Number(r.size) + reserve) throw new Error(`a file could not be linked (${e?.code}) and there is not enough free space to copy it`, { cause: e });
        copyFileSync(from, to);
        files.copied++;
      }
      if (statSync(to).size !== Number(r.size) || sha256OfFile(to) !== r.sha256) files.mismatched++;
      files.objects++;
      files.bytes += Number(r.size);
    }
  }
  result.files = files;
  result.entries = ['db.sqlite', 'runtime.sqlite', 'files'].filter((e) => existsSync(join(out, e)));
  result.ok = true;
} catch (e) {
  result.error = e instanceof Error ? e.message : String(e);
}
process.stdout.write(`BIZOMAT-SNAPSHOT ${JSON.stringify(result)}\n`);
process.exitCode = result.ok ? 0 : 1;
