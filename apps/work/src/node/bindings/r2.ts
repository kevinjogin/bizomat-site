// R2Bucket over the Node file store (src/node/store/file-store.ts).
//
// Shapes follow R2 as Miniflare reports them: etag is the hex MD5 of the body,
// httpEtag the quoted etag, checksums.md5 is set, head()/get() carry a range,
// list() returns metadata only for the fields named in `include`, at most
// 1000 keys per page, with an opaque cursor. Features the Worker does not use
// and that would change semantics if silently ignored (conditional requests,
// SSE-C keys, multipart uploads, SHA-1/384/512 checks) throw instead.

import { Readable } from 'node:stream';
import { DigestMismatchError, isValidKey, type FileStore, type StoredObject } from '../store/file-store.ts';

class R2LikeError extends Error {
  code: number;
  constructor(op: string, message: string, code: number) {
    super(`${op}: ${message} (${code})`);
    this.code = code;
  }
}

const invalidKey = (op: string) => new R2LikeError(op, 'The specified object name is not valid.', 10020);
const unsupported = (op: string, what: string) => new R2LikeError(op, `${what} is not supported by the Node runtime.`, 10001);

const HEADER_FIELDS: [keyof R2HTTPMetadata, string][] = [
  ['contentType', 'content-type'],
  ['contentLanguage', 'content-language'],
  ['contentDisposition', 'content-disposition'],
  ['contentEncoding', 'content-encoding'],
  ['cacheControl', 'cache-control'],
  ['cacheExpiry', 'expires'],
];

function storedHttpMetadata(input: R2HTTPMetadata | Headers | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input) return out;
  for (const [field, header] of HEADER_FIELDS) {
    const v = input instanceof Headers ? input.get(header) : (input as R2HTTPMetadata)[field];
    if (v === undefined || v === null || v === '') continue;
    if (field === 'cacheExpiry') {
      const d = v instanceof Date ? v : new Date(String(v));
      if (!Number.isNaN(d.getTime())) out.cacheExpiry = d.toISOString();
    } else out[field] = String(v);
  }
  return out;
}

function publicHttpMetadata(stored: Record<string, string>): R2HTTPMetadata {
  const out: R2HTTPMetadata = {};
  for (const [field] of HEADER_FIELDS) {
    const v = stored[field];
    if (v === undefined) continue;
    if (field === 'cacheExpiry') out.cacheExpiry = new Date(v);
    else (out as Record<string, string>)[field] = v;
  }
  return out;
}

function hexToBuffer(hex: string): ArrayBuffer {
  const b = Buffer.from(hex, 'hex');
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

function digestHex(v: ArrayBuffer | ArrayBufferView | string | undefined): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === 'string') return v.toLowerCase();
  const bytes = v instanceof ArrayBuffer ? new Uint8Array(v) : new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  return Buffer.from(bytes).toString('hex');
}

class NodeR2Checksums implements R2Checksums {
  readonly md5: ArrayBuffer;
  readonly #hex: string;
  constructor(md5Hex: string) {
    this.#hex = md5Hex;
    this.md5 = hexToBuffer(md5Hex);
  }
  toJSON(): R2StringChecksums {
    return { md5: this.#hex };
  }
}

class NodeR2Object implements R2Object {
  readonly key: string;
  readonly version: string;
  readonly size: number;
  readonly etag: string;
  readonly httpEtag: string;
  readonly checksums: R2Checksums;
  readonly uploaded: Date;
  readonly httpMetadata?: R2HTTPMetadata;
  readonly customMetadata?: Record<string, string>;
  readonly range?: R2Range;
  readonly storageClass = 'Standard';
  readonly ssecKeyMd5?: string;

  constructor(o: StoredObject, opts: { range?: R2Range; httpMetadata?: boolean; customMetadata?: boolean } = {}) {
    this.key = o.key;
    this.version = o.version;
    this.size = o.size;
    this.etag = o.md5;
    this.httpEtag = `"${o.md5}"`;
    this.checksums = new NodeR2Checksums(o.md5);
    this.uploaded = new Date(o.uploaded);
    this.httpMetadata = opts.httpMetadata === false ? {} : publicHttpMetadata(o.httpMetadata);
    this.customMetadata = opts.customMetadata === false ? {} : { ...o.customMetadata };
    this.range = opts.range;
  }

  writeHttpMetadata(headers: Headers): void {
    const m = this.httpMetadata ?? {};
    if (m.contentType) headers.set('content-type', m.contentType);
    if (m.contentLanguage) headers.set('content-language', m.contentLanguage);
    if (m.contentDisposition) headers.set('content-disposition', m.contentDisposition);
    if (m.contentEncoding) headers.set('content-encoding', m.contentEncoding);
    if (m.cacheControl) headers.set('cache-control', m.cacheControl);
    if (m.cacheExpiry) headers.set('expires', m.cacheExpiry.toUTCString());
  }
}

class NodeR2ObjectBody extends NodeR2Object implements R2ObjectBody {
  readonly #body: ReadableStream;
  #used = false;

  constructor(o: StoredObject, body: ReadableStream, range: R2Range) {
    super(o, { range });
    this.#body = body;
  }

  get body(): ReadableStream {
    return this.#body;
  }
  get bodyUsed(): boolean {
    return this.#used || this.#body.locked;
  }
  async bytes(): Promise<Uint8Array> {
    if (this.bodyUsed) throw new TypeError('Body has already been used. It can only be used once. Use tee() first if you need to read it twice.');
    this.#used = true;
    return new Uint8Array(await new Response(this.#body).arrayBuffer());
  }
  async arrayBuffer(): Promise<ArrayBuffer> {
    const b = await this.bytes();
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  }
  async text(): Promise<string> {
    return new TextDecoder().decode(await this.bytes());
  }
  async json<T>(): Promise<T> {
    return JSON.parse(await this.text()) as T;
  }
  async blob(): Promise<Blob> {
    return new Blob([await this.bytes()], this.httpMetadata?.contentType ? { type: this.httpMetadata.contentType } : {});
  }
}

function resolveRange(range: R2Range | Headers | undefined, size: number): { offset: number; length: number } {
  if (!range) return { offset: 0, length: size };
  let r: R2Range | undefined = range as R2Range;
  if (range instanceof Headers) {
    const h = range.get('range');
    if (!h) return { offset: 0, length: size };
    const m = /^bytes=(\d*)-(\d*)$/.exec(h.trim());
    if (!m || (m[1] === '' && m[2] === '')) throw new R2LikeError('get', 'The requested range is not satisfiable.', 10039);
    if (m[1] === '') r = { suffix: Number(m[2]) };
    else r = m[2] === '' ? { offset: Number(m[1]) } : { offset: Number(m[1]), length: Number(m[2]) - Number(m[1]) + 1 };
  }
  if ('suffix' in r && r.suffix !== undefined) {
    const length = Math.min(r.suffix, size);
    return { offset: size - length, length };
  }
  const offset = (r as { offset?: number }).offset ?? 0;
  const length = (r as { length?: number }).length ?? size - offset;
  if (offset < 0 || length < 0 || offset > size) throw new R2LikeError('get', 'The requested range is not satisfiable.', 10039);
  return { offset, length: Math.min(length, size - offset) };
}

async function bodyChunks(value: unknown): Promise<Uint8Array | AsyncIterable<Uint8Array>> {
  if (value === null || value === undefined) return new Uint8Array(0);
  if (typeof value === 'string') return new TextEncoder().encode(value);
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  if (value instanceof Blob) return new Uint8Array(await value.arrayBuffer());
  if (value instanceof ReadableStream) {
    const stream = value as ReadableStream<unknown>;
    return (async function* () {
      for await (const chunk of stream as unknown as AsyncIterable<unknown>) {
        if (typeof chunk === 'string') yield new TextEncoder().encode(chunk);
        else if (chunk instanceof ArrayBuffer) yield new Uint8Array(chunk);
        else if (ArrayBuffer.isView(chunk)) yield new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
        else throw new TypeError('put: stream chunks must be bytes or strings');
      }
    })();
  }
  throw new TypeError('put: unsupported value type');
}

const encodeCursor = (key: string) => Buffer.from(key, 'utf8').toString('base64url');
function decodeCursor(cursor: string): string {
  const key = Buffer.from(cursor, 'base64url').toString('utf8');
  if (!cursor || encodeCursor(key) !== cursor) throw new R2LikeError('list', 'The cursor is invalid.', 10024);
  return key;
}

export class NodeR2Bucket implements R2Bucket {
  readonly #store: FileStore;
  readonly #bucket: string;

  constructor(store: FileStore, bucket: string) {
    this.#store = store;
    this.#bucket = bucket;
  }

  async head(key: string): Promise<R2Object | null> {
    if (!isValidKey(key)) throw invalidKey('head');
    const o = this.#store.head(this.#bucket, key);
    return o ? new NodeR2Object(o, { range: { offset: 0, length: o.size } }) : null;
  }

  get(key: string, options: R2GetOptions & { onlyIf: R2Conditional | Headers }): Promise<R2ObjectBody | R2Object | null>;
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>;
  async get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null> {
    if (!isValidKey(key)) throw invalidKey('get');
    if (options?.onlyIf) throw unsupported('get', 'onlyIf');
    if (options?.ssecKey) throw unsupported('get', 'ssecKey');
    const opened = await this.#store.openBody(this.#bucket, key);
    if (!opened) return null;
    const { obj, handle } = opened;
    let range: { offset: number; length: number };
    try {
      range = resolveRange(options?.range, obj.size);
    } catch (e) {
      await handle.close();
      throw e;
    }
    const stream =
      range.length === 0
        ? (await handle.close(), Readable.from([]))
        : handle.createReadStream({ start: range.offset, end: range.offset + range.length - 1, autoClose: true });
    const body = Readable.toWeb(stream) as unknown as ReadableStream;
    return new NodeR2ObjectBody(obj, body, range);
  }

  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions & { onlyIf: R2Conditional | Headers }): Promise<R2Object | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<R2Object>;
  async put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<R2Object> {
    if (!isValidKey(key)) throw invalidKey('put');
    if (options?.onlyIf) throw unsupported('put', 'onlyIf');
    if (options?.ssecKey) throw unsupported('put', 'ssecKey');
    if (options?.sha1 || options?.sha384 || options?.sha512) throw unsupported('put', 'SHA-1/384/512 checksums');
    const customMetadata: Record<string, string> = {};
    for (const [k, v] of Object.entries(options?.customMetadata ?? {})) customMetadata[k] = String(v);
    try {
      const stored = await this.#store.put(this.#bucket, key, await bodyChunks(value), {
        httpMetadata: storedHttpMetadata(options?.httpMetadata),
        customMetadata,
        md5: digestHex(options?.md5),
        sha256: digestHex(options?.sha256),
      });
      return new NodeR2Object(stored);
    } catch (e) {
      if (e instanceof DigestMismatchError) throw new R2LikeError('put', 'The Content-MD5 or checksum you specified did not match what we received.', 10037);
      throw e;
    }
  }

  async createMultipartUpload(): Promise<R2MultipartUpload> {
    throw unsupported('createMultipartUpload', 'Multipart upload');
  }

  resumeMultipartUpload(): R2MultipartUpload {
    throw unsupported('resumeMultipartUpload', 'Multipart upload');
  }

  async delete(keys: string | string[]): Promise<void> {
    const list = Array.isArray(keys) ? keys : [keys];
    if (list.length > 1000) throw new R2LikeError('delete', 'At most 1000 keys can be deleted at once.', 10013);
    for (const k of list) if (!isValidKey(k)) throw invalidKey('delete');
    if (list.length) await this.#store.delete(this.#bucket, list);
  }

  async list(options: R2ListOptions = {}): Promise<R2Objects> {
    const limit = options.limit ?? 1000;
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new R2LikeError('list', 'MaxKeys params must be positive integer <= 1000.', 10022);
    let after = options.startAfter ?? '';
    if (options.cursor) {
      const c = decodeCursor(options.cursor);
      if (c > after) after = c;
    }
    const include = new Set(options.include ?? []);
    const page = this.#store.list(this.#bucket, { prefix: options.prefix ?? '', after, limit, delimiter: options.delimiter });
    const objects = page.objects.map(
      (o) => new NodeR2Object(o, { httpMetadata: include.has('httpMetadata'), customMetadata: include.has('customMetadata') }),
    );
    if (page.truncated && page.lastKey !== undefined) return { objects, delimitedPrefixes: page.delimitedPrefixes, truncated: true, cursor: encodeCursor(page.lastKey) };
    return { objects, delimitedPrefixes: page.delimitedPrefixes, truncated: false };
  }
}
