// Object store behind the Node R2 binding. Shared by the server and
// scripts/migrate/*.mjs (erasable TypeScript, `.ts` imports only).
//
// Bodies live in WORK_DATA_DIR/files/<bucket>/<aa>/<bb>/<sha256(key)>.<version>
// where aa/bb are the first hex digits of the hash. The path is computed from
// a hash, never from the key itself, so any key (slashes, dots, "..",
// unicode) is safe and no request can reach outside files/. The index
// (key, size, md5 etag, sha256, upload time, HTTP and custom metadata, and the
// current version) is a table in runtime.sqlite and is the source of truth.
//
// A put writes a new version file: temp file in files/.tmp, fsync, rename into
// place, fsync the directory, then one SQLite transaction switches the index
// to the new version, and only then is the old version's file removed. A crash
// at any point leaves the previous object intact; at worst an unreferenced
// file remains (verify-data-dir.mjs reports it). Readers that already opened
// the old file keep reading it.

import { createHash, randomBytes } from 'node:crypto';
import { createReadStream, mkdirSync } from 'node:fs';
import { mkdir, open, readdir, rename, stat, unlink, type FileHandle } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { openDatabase, type DatabaseSync } from './sqlite.ts';

export const RUNTIME_SCHEMA = `
CREATE TABLE IF NOT EXISTS r2_objects (
  bucket TEXT NOT NULL,
  key TEXT NOT NULL,
  version TEXT NOT NULL,
  size INTEGER NOT NULL,
  md5 TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  uploaded INTEGER NOT NULL,
  http_metadata TEXT NOT NULL DEFAULT '{}',
  custom_metadata TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (bucket, key)
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS kv_entries (
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  value BLOB NOT NULL,
  metadata TEXT,
  expiration INTEGER,
  PRIMARY KEY (namespace, key)
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS runtime_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT OR IGNORE INTO runtime_meta (key, value) VALUES ('schema_version', '1');
`;

export function openRuntimeDatabase(path: string): DatabaseSync {
  const db = openDatabase(path);
  db.exec(RUNTIME_SCHEMA);
  return db;
}

export const MAX_KEY_BYTES = 1024;

/** R2 accepts 1..1024 bytes of UTF-8. Lone surrogates are refused so two keys can never encode to the same bytes. */
export function isValidKey(key: unknown): key is string {
  return typeof key === 'string' && key.length > 0 && !/\p{Surrogate}/u.test(key) && Buffer.byteLength(key, 'utf8') <= MAX_KEY_BYTES;
}

export function keyHash(key: string): string {
  return createHash('sha256').update(key, 'utf8').digest('hex');
}

export interface StoredObject {
  bucket: string;
  key: string;
  version: string;
  size: number;
  md5: string;
  sha256: string;
  /** Upload time, ms since epoch. */
  uploaded: number;
  httpMetadata: Record<string, string>;
  customMetadata: Record<string, string>;
}

export interface PutOptions {
  httpMetadata?: Record<string, string>;
  customMetadata?: Record<string, string>;
  /** Upload time to record (ms); defaults to now. Used when copying objects from R2. */
  uploaded?: number;
  /** Expected digests (hex); the put fails and stores nothing when the body differs. */
  md5?: string;
  sha256?: string;
}

export interface ListOptions {
  prefix?: string;
  /** List keys strictly after this key. */
  after?: string;
  limit: number;
  delimiter?: string;
}

export interface ListResult {
  objects: StoredObject[];
  delimitedPrefixes: string[];
  truncated: boolean;
  /** The last key covered by this page (resume with after = lastKey). */
  lastKey?: string;
}

export class DigestMismatchError extends Error {}

interface Row {
  bucket: string;
  key: string;
  version: string;
  size: number;
  md5: string;
  sha256: string;
  uploaded: number;
  http_metadata: string;
  custom_metadata: string;
}

function parseMeta(s: string): Record<string, string> {
  try {
    const v = JSON.parse(s);
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

function fromRow(r: Row): StoredObject {
  return {
    bucket: r.bucket,
    key: r.key,
    version: r.version,
    size: Number(r.size),
    md5: r.md5,
    sha256: r.sha256,
    uploaded: Number(r.uploaded),
    httpMetadata: parseMeta(r.http_metadata),
    customMetadata: parseMeta(r.custom_metadata),
  };
}

async function fsyncDir(dir: string) {
  let fh: FileHandle | undefined;
  try {
    fh = await open(dir, 'r');
    await fh.sync();
  } catch {
    /* not supported on this platform */
  } finally {
    await fh?.close().catch(() => {});
  }
}

const COLUMNS = 'bucket, key, version, size, md5, sha256, uploaded, http_metadata, custom_metadata';

export class FileStore {
  readonly root: string;
  readonly tmp: string;
  readonly #db: DatabaseSync;

  constructor(filesDir: string, runtimeDb: DatabaseSync) {
    this.root = filesDir;
    this.tmp = join(filesDir, '.tmp');
    this.#db = runtimeDb;
    mkdirSync(this.tmp, { recursive: true, mode: 0o700 });
  }

  /** Where a version of a key lives. Only hex digits come from the key, so the path cannot escape files/. */
  path(bucket: string, key: string, version: string): string {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(bucket)) throw new Error('Invalid bucket name');
    if (!/^[0-9a-f]{32}$/.test(version)) throw new Error('Invalid object version');
    const h = keyHash(key);
    return join(this.root, bucket, h.slice(0, 2), h.slice(2, 4), `${h}.${version}`);
  }

  head(bucket: string, key: string): StoredObject | null {
    const r = this.#db.prepare(`SELECT ${COLUMNS} FROM r2_objects WHERE bucket = ? AND key = ?`).get(bucket, key) as Row | undefined;
    return r ? fromRow(r) : null;
  }

  async put(bucket: string, key: string, body: Uint8Array | AsyncIterable<Uint8Array>, options: PutOptions = {}): Promise<StoredObject> {
    if (!isValidKey(key)) throw new Error('Invalid object key');
    const version = randomBytes(16).toString('hex');
    const final = this.path(bucket, key, version);
    const tmp = join(this.tmp, `${version}.part`);
    const md5 = createHash('md5');
    const sha256 = createHash('sha256');
    let size = 0;
    const fh = await open(tmp, 'wx', 0o600);
    try {
      const write = async (chunk: Uint8Array) => {
        md5.update(chunk);
        sha256.update(chunk);
        size += chunk.byteLength;
        let off = 0;
        while (off < chunk.byteLength) off += (await fh.write(chunk, off, chunk.byteLength - off)).bytesWritten;
      };
      if (body instanceof Uint8Array) await write(body);
      else for await (const chunk of body) await write(chunk);
      await fh.sync();
    } catch (e) {
      await fh.close().catch(() => {});
      await unlink(tmp).catch(() => {});
      throw e;
    }
    await fh.close();
    const digest = { md5: md5.digest('hex'), sha256: sha256.digest('hex') };
    if ((options.md5 && options.md5.toLowerCase() !== digest.md5) || (options.sha256 && options.sha256.toLowerCase() !== digest.sha256)) {
      await unlink(tmp).catch(() => {});
      throw new DigestMismatchError('The body does not match the expected digest');
    }
    const dir = dirname(final);
    const created = await mkdir(dir, { recursive: true, mode: 0o700 });
    await rename(tmp, final);
    await fsyncDir(dir);
    if (created) for (let d = dirname(dir); d.length >= this.root.length; d = dirname(d)) await fsyncDir(d);

    const obj: StoredObject = {
      bucket,
      key,
      version,
      size,
      md5: digest.md5,
      sha256: digest.sha256,
      uploaded: options.uploaded ?? Date.now(),
      httpMetadata: options.httpMetadata ?? {},
      customMetadata: options.customMetadata ?? {},
    };
    let previous: string | undefined;
    this.#db.exec('BEGIN IMMEDIATE');
    try {
      previous = (this.#db.prepare('SELECT version FROM r2_objects WHERE bucket = ? AND key = ?').get(bucket, key) as { version: string } | undefined)?.version;
      this.#db
        .prepare(
          `INSERT INTO r2_objects (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(bucket, key) DO UPDATE SET version = excluded.version, size = excluded.size, md5 = excluded.md5, sha256 = excluded.sha256,
             uploaded = excluded.uploaded, http_metadata = excluded.http_metadata, custom_metadata = excluded.custom_metadata`,
        )
        .run(bucket, key, version, size, digest.md5, digest.sha256, obj.uploaded, JSON.stringify(obj.httpMetadata), JSON.stringify(obj.customMetadata));
      this.#db.exec('COMMIT');
    } catch (e) {
      if (this.#db.isTransaction) this.#db.exec('ROLLBACK');
      await unlink(final).catch(() => {});
      throw e;
    }
    if (previous && previous !== version) await unlink(this.path(bucket, key, previous)).catch(() => {});
    return obj;
  }

  /** Opens the current body of a key. Retries when a concurrent put replaced the version between lookup and open. */
  async openBody(bucket: string, key: string): Promise<{ obj: StoredObject; handle: FileHandle } | null> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const obj = this.head(bucket, key);
      if (!obj) return null;
      try {
        return { obj, handle: await open(this.path(bucket, key, obj.version), 'r') };
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
        const again = this.head(bucket, key);
        if (again && again.version === obj.version) throw new Error('Stored object body is missing (see verify-data-dir)', { cause: e });
      }
    }
    throw new Error('Stored object changed too often while opening it');
  }

  async delete(bucket: string, keys: string[]): Promise<void> {
    const gone: StoredObject[] = [];
    this.#db.exec('BEGIN IMMEDIATE');
    try {
      const sel = this.#db.prepare(`SELECT ${COLUMNS} FROM r2_objects WHERE bucket = ? AND key = ?`);
      const del = this.#db.prepare('DELETE FROM r2_objects WHERE bucket = ? AND key = ?');
      for (const key of keys) {
        const r = sel.get(bucket, key) as Row | undefined;
        if (!r) continue;
        del.run(bucket, key);
        gone.push(fromRow(r));
      }
      this.#db.exec('COMMIT');
    } catch (e) {
      if (this.#db.isTransaction) this.#db.exec('ROLLBACK');
      throw e;
    }
    for (const o of gone) await unlink(this.path(o.bucket, o.key, o.version)).catch(() => {});
  }

  list(bucket: string, options: ListOptions): ListResult {
    const prefix = options.prefix ?? '';
    const after = options.after ?? '';
    const limit = options.limit;
    const delimiter = options.delimiter || '';
    const stmt = this.#db.prepare(
      `SELECT ${COLUMNS} FROM r2_objects WHERE bucket = ? AND key >= ? AND key > ? AND substr(key, 1, length(?)) = ? ORDER BY key`,
    );
    const objects: StoredObject[] = [];
    const prefixes: string[] = [];
    let lastKey: string | undefined;
    let truncated = false;
    let skipPrefix: string | null = null;
    for (const raw of stmt.iterate(bucket, prefix, after, prefix, prefix)) {
      const r = raw as unknown as Row;
      if (skipPrefix !== null && r.key.startsWith(skipPrefix)) {
        lastKey = r.key;
        continue;
      }
      skipPrefix = null;
      if (objects.length + prefixes.length >= limit) {
        truncated = true;
        break;
      }
      if (delimiter) {
        const at = r.key.indexOf(delimiter, prefix.length);
        if (at >= 0) {
          const dp = r.key.slice(0, at + delimiter.length);
          prefixes.push(dp);
          skipPrefix = dp;
          lastKey = r.key;
          continue;
        }
      }
      objects.push(fromRow(r));
      lastKey = r.key;
    }
    return { objects, delimitedPrefixes: prefixes, truncated, lastKey: truncated ? lastKey : undefined };
  }

  /** Every indexed object (for verification and export). */
  *all(bucket?: string): Generator<StoredObject> {
    const stmt = bucket
      ? this.#db.prepare(`SELECT ${COLUMNS} FROM r2_objects WHERE bucket = ? ORDER BY bucket, key`)
      : this.#db.prepare(`SELECT ${COLUMNS} FROM r2_objects ORDER BY bucket, key`);
    for (const r of bucket ? stmt.iterate(bucket) : stmt.iterate()) yield fromRow(r as unknown as Row);
  }

  /** Re-reads a stored body and compares size, sha256 and md5 with the index. */
  async verify(obj: StoredObject): Promise<{ ok: boolean; problem?: 'missing' | 'size' | 'sha256' | 'md5'; size?: number }> {
    const file = this.path(obj.bucket, obj.key, obj.version);
    let size: number;
    try {
      size = (await stat(file)).size;
    } catch {
      return { ok: false, problem: 'missing' };
    }
    if (size !== obj.size) return { ok: false, problem: 'size', size };
    const sha = createHash('sha256');
    const md5 = createHash('md5');
    for await (const chunk of createReadStream(file)) {
      sha.update(chunk as Buffer);
      md5.update(chunk as Buffer);
    }
    if (sha.digest('hex') !== obj.sha256) return { ok: false, problem: 'sha256', size };
    if (md5.digest('hex') !== obj.md5) return { ok: false, problem: 'md5', size };
    return { ok: true, size };
  }

  /** Files under files/ that the index does not reference (left by a crash or a manual copy). */
  async unreferencedFiles(): Promise<string[]> {
    const expected = new Set<string>();
    for (const o of this.all()) expected.add(this.path(o.bucket, o.key, o.version));
    const out: string[] = [];
    const walk = async (dir: string, depth: number) => {
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        const p = join(dir, e.name);
        if (depth === 0 && e.name === '.tmp') continue;
        if (e.isDirectory() && depth < 3) await walk(p, depth + 1);
        else if (!expected.has(p)) out.push(relative(this.root, p).split(sep).join('/'));
      }
    };
    await walk(this.root, 0);
    return out.sort();
  }

  /** Removes partial uploads older than maxAgeMs from files/.tmp (they are never referenced). */
  async cleanTemp(maxAgeMs: number): Promise<number> {
    let removed = 0;
    let entries: string[] = [];
    try {
      entries = await readdir(this.tmp);
    } catch {
      return 0;
    }
    const cutoff = Date.now() - maxAgeMs;
    for (const name of entries) {
      const p = join(this.tmp, name);
      try {
        if ((await stat(p)).mtimeMs < cutoff) {
          await unlink(p);
          removed++;
        }
      } catch {
        /* raced with another cleaner */
      }
    }
    return removed;
  }
}
