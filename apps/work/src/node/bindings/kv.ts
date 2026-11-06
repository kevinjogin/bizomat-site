// KVNamespace over a table in runtime.sqlite. The Worker only reads one key
// (the admin health check), but the binding implements get / getWithMetadata
// (single and bulk), put with expiration / expirationTtl / metadata, delete
// and list with KV's limits, so new code behaves as it would on Cloudflare.
// Unlike KV this store is strongly consistent; the Worker never relies on
// KV for security decisions either way.

import type { DatabaseSync } from 'node:sqlite';

type ValueType = 'text' | 'json' | 'arrayBuffer' | 'stream';

const MAX_KEY_BYTES = 512;
const MAX_VALUE_BYTES = 25 * 1024 * 1024;
const MAX_METADATA_BYTES = 1024;

function kvError(op: string, message: string): Error {
  return new Error(`KV ${op} failed: ${message}`);
}

function checkKey(op: string, key: unknown): string {
  if (typeof key !== 'string') throw new TypeError(`KV ${op}: key must be a string`);
  if (key === '' || key === '.' || key === '..') throw kvError(op, `400 Invalid key name "${key}".`);
  if (Buffer.byteLength(key, 'utf8') > MAX_KEY_BYTES) throw kvError(op, `414 UTF-8 encoded length of ${Buffer.byteLength(key)} exceeds key length limit of ${MAX_KEY_BYTES}.`);
  return key;
}

function valueType(arg: unknown): ValueType {
  const t = typeof arg === 'string' ? arg : (arg as { type?: string } | undefined)?.type;
  if (t === undefined) return 'text';
  if (t === 'text' || t === 'json' || t === 'arrayBuffer' || t === 'stream') return t;
  throw new TypeError(`Unknown response type. Possible types are "text", "arrayBuffer", "json", and "stream".`);
}

function decode(value: Uint8Array, type: ValueType): unknown {
  switch (type) {
    case 'text':
      return new TextDecoder().decode(value);
    case 'json':
      return JSON.parse(new TextDecoder().decode(value));
    case 'arrayBuffer':
      return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
    case 'stream':
      return new Blob([value]).stream();
  }
}

async function encode(value: unknown): Promise<Uint8Array> {
  if (typeof value === 'string') return new TextEncoder().encode(value);
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer);
  if (value instanceof ReadableStream) return new Uint8Array(await new Response(value).arrayBuffer());
  throw new TypeError('KV put() accepts only strings, ArrayBuffers, ArrayBufferViews, and ReadableStreams as values.');
}

interface Row {
  key: string;
  value: Uint8Array;
  metadata: string | null;
  expiration: number | null;
}

export class NodeKVNamespace implements KVNamespace {
  readonly #db: DatabaseSync;
  readonly #ns: string;

  constructor(db: DatabaseSync, namespace: string) {
    this.#db = db;
    this.#ns = namespace;
  }

  #row(key: string): Row | null {
    const r = this.#db
      .prepare('SELECT key, value, metadata, expiration FROM kv_entries WHERE namespace = ? AND key = ? AND (expiration IS NULL OR expiration > ?)')
      .get(this.#ns, key, Math.floor(Date.now() / 1000)) as Row | undefined;
    return r ?? null;
  }

  async get(key: any, typeOrOptions?: any): Promise<any> {
    const type = valueType(typeOrOptions);
    if (Array.isArray(key)) {
      if (type !== 'text' && type !== 'json') throw new TypeError('Bulk get only supports the "text" and "json" types.');
      if (key.length > 100) throw kvError('GET', '400 You can request a maximum of 100 keys.');
      const out = new Map<string, unknown>();
      for (const k of key) {
        const r = this.#row(checkKey('GET', k));
        out.set(k, r ? decode(r.value, type) : null);
      }
      return out;
    }
    const r = this.#row(checkKey('GET', key));
    return r ? decode(r.value, type) : null;
  }

  async getWithMetadata(key: any, typeOrOptions?: any): Promise<any> {
    const type = valueType(typeOrOptions);
    const one = (k: string) => {
      const r = this.#row(checkKey('GET', k));
      return { value: r ? decode(r.value, type) : null, metadata: r?.metadata ? JSON.parse(r.metadata) : null, cacheStatus: null };
    };
    if (Array.isArray(key)) return new Map(key.map((k: string) => [k, one(k)]));
    return one(key);
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options: KVNamespacePutOptions = {}): Promise<void> {
    checkKey('PUT', key);
    const bytes = await encode(value);
    if (bytes.byteLength > MAX_VALUE_BYTES) throw kvError('PUT', `413 Value length of ${bytes.byteLength} exceeds limit of ${MAX_VALUE_BYTES}.`);
    const nowS = Math.floor(Date.now() / 1000);
    let expiration: number | null = null;
    if (options.expirationTtl !== undefined) {
      const ttl = Number(options.expirationTtl);
      if (!Number.isFinite(ttl) || ttl < 60) throw kvError('PUT', `400 Invalid expiration_ttl of ${options.expirationTtl}. Expiration TTL must be at least 60.`);
      expiration = nowS + Math.floor(ttl);
    } else if (options.expiration !== undefined) {
      const exp = Number(options.expiration);
      if (!Number.isFinite(exp) || exp < nowS + 60) {
        throw kvError('PUT', `400 Invalid expiration of ${options.expiration}. Expiration times must be at least 60 seconds in the future.`);
      }
      expiration = Math.floor(exp);
    }
    let metadata: string | null = null;
    if (options.metadata !== undefined && options.metadata !== null) {
      metadata = JSON.stringify(options.metadata);
      if (Buffer.byteLength(metadata) > MAX_METADATA_BYTES) throw kvError('PUT', `413 Metadata length of ${Buffer.byteLength(metadata)} exceeds limit of ${MAX_METADATA_BYTES}.`);
    }
    this.#db
      .prepare(
        `INSERT INTO kv_entries (namespace, key, value, metadata, expiration) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(namespace, key) DO UPDATE SET value = excluded.value, metadata = excluded.metadata, expiration = excluded.expiration`,
      )
      .run(this.#ns, key, bytes, metadata, expiration);
  }

  async delete(key: string): Promise<void> {
    checkKey('DELETE', key);
    this.#db.prepare('DELETE FROM kv_entries WHERE namespace = ? AND key = ?').run(this.#ns, key);
  }

  async list<Metadata = unknown>(options: KVNamespaceListOptions = {}): Promise<KVNamespaceListResult<Metadata, string>> {
    const limit = options.limit ?? 1000;
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw kvError('LIST', `400 Invalid limit of ${limit}. Please specify an integer between 1 and 1000.`);
    const prefix = options.prefix ?? '';
    const after = options.cursor ? Buffer.from(options.cursor, 'base64url').toString('utf8') : '';
    const rows = this.#db
      .prepare(
        `SELECT key, metadata, expiration FROM kv_entries
         WHERE namespace = ? AND key > ? AND substr(key, 1, length(?)) = ? AND (expiration IS NULL OR expiration > ?)
         ORDER BY key LIMIT ?`,
      )
      .all(this.#ns, after, prefix, prefix, Math.floor(Date.now() / 1000), limit + 1) as { key: string; metadata: string | null; expiration: number | null }[];
    const page = rows.slice(0, limit);
    const keys = page.map((r) => ({
      name: r.key,
      ...(r.expiration != null ? { expiration: Number(r.expiration) } : {}),
      ...(r.metadata ? { metadata: JSON.parse(r.metadata) as Metadata } : {}),
    }));
    if (rows.length > limit) {
      return { keys, list_complete: false, cursor: Buffer.from(page[page.length - 1].key, 'utf8').toString('base64url'), cacheStatus: null };
    }
    return { keys, list_complete: true, cacheStatus: null };
  }

  /** Deletes expired entries (called by the Node scheduler). */
  purgeExpired(): number {
    const r = this.#db.prepare('DELETE FROM kv_entries WHERE expiration IS NOT NULL AND expiration <= ?').run(Math.floor(Date.now() / 1000));
    return Number(r.changes);
  }
}
