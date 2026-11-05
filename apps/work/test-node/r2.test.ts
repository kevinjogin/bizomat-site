import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { NodeR2Bucket } from '../src/node/bindings/r2.ts';
import { FileStore, keyHash, openRuntimeDatabase } from '../src/node/store/file-store.ts';
import { tempDir } from './helpers.ts';

const root = tempDir('work-r2-');
const filesDir = join(root, 'files');
const runtimeDb = openRuntimeDatabase(join(root, 'runtime.sqlite'));
const store = new FileStore(filesDir, runtimeDb);
const bucket = new NodeR2Bucket(store, 'FILES');

const md5 = (b: Uint8Array | string) => createHash('md5').update(b).digest('hex');
const sha256 = (b: Uint8Array | string) => createHash('sha256').update(b).digest('hex');

function allFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...allFiles(p));
    else out.push(relative(filesDir, p).split(sep).join('/'));
  }
  return out;
}

const errorOf = async (p: Promise<unknown>) => {
  try {
    await p;
  } catch (e) {
    return e as Error;
  }
  throw new Error('expected an error');
};

describe('R2 binding', () => {
  it('put() returns R2 object metadata with an MD5 etag', async () => {
    const body = new Uint8Array([1, 2, 3]);
    const o = await bucket.put('ws/a/boards/b/file1', body, { httpMetadata: { contentType: 'image/png', cacheControl: 'no-cache' }, customMetadata: { uploader: 'u1' } });
    expect(o.key).toBe('ws/a/boards/b/file1');
    expect(o.size).toBe(3);
    expect(o.etag).toBe(md5(body));
    expect(o.httpEtag).toBe(`"${md5(body)}"`);
    expect(o.checksums.toJSON()).toEqual({ md5: md5(body) });
    expect(o.uploaded).toBeInstanceOf(Date);
    expect(o.version).toMatch(/^[0-9a-f]{32}$/);
    expect(o.httpMetadata).toEqual({ contentType: 'image/png', cacheControl: 'no-cache' });
    expect(o.customMetadata).toEqual({ uploader: 'u1' });
    const row = store.head('FILES', 'ws/a/boards/b/file1')!;
    expect(row.sha256).toBe(sha256(body));
  });

  it('get() streams the body and exposes arrayBuffer/text/json/writeHttpMetadata', async () => {
    await bucket.put('doc.json', JSON.stringify({ a: 1 }), { httpMetadata: { contentType: 'application/json', contentDisposition: 'inline' } });
    const o = (await bucket.get('doc.json'))!;
    expect(o.size).toBe(7);
    expect(o.range).toEqual({ offset: 0, length: 7 });
    const h = new Headers();
    o.writeHttpMetadata(h);
    expect(h.get('content-type')).toBe('application/json');
    expect(h.get('content-disposition')).toBe('inline');
    expect(await o.json()).toEqual({ a: 1 });
    expect(o.bodyUsed).toBe(true);
    expect(await (await bucket.get('doc.json'))!.text()).toBe('{"a":1}');
    const res = new Response((await bucket.get('doc.json'))!.body);
    expect(await res.text()).toBe('{"a":1}');
    expect(new Uint8Array(await (await bucket.get('ws/a/boards/b/file1'))!.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('get() supports ranges', async () => {
    await bucket.put('range', 'abcdefghij');
    expect(await (await bucket.get('range', { range: { offset: 2, length: 3 } }))!.text()).toBe('cde');
    expect(await (await bucket.get('range', { range: { suffix: 2 } }))!.text()).toBe('ij');
    expect(await (await bucket.get('range', { range: new Headers({ range: 'bytes=1-2' }) }))!.text()).toBe('bc');
  });

  it('head() and get() return null for missing keys; put(null) stores an empty object', async () => {
    expect(await bucket.head('missing')).toBeNull();
    expect(await bucket.get('missing')).toBeNull();
    const o = await bucket.put('empty', null);
    expect(o.size).toBe(0);
    expect(o.etag).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(await (await bucket.get('empty'))!.text()).toBe('');
  });

  it('accepts streams and Blobs as values', async () => {
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode('hello '));
        c.enqueue(new TextEncoder().encode('world'));
        c.close();
      },
    });
    expect((await bucket.put('stream', stream)).size).toBe(11);
    expect(await (await bucket.get('stream'))!.text()).toBe('hello world');
    await bucket.put('blob', new Blob(['xyz']));
    expect(await (await bucket.get('blob'))!.text()).toBe('xyz');
  });

  it('checks expected digests and stores nothing on mismatch', async () => {
    const e = await errorOf(bucket.put('digest', 'abc', { md5: '00000000000000000000000000000000' }));
    expect(e.message).toMatch(/^put: .*\(10037\)$/);
    expect(await bucket.head('digest')).toBeNull();
    expect((await bucket.put('digest', 'abc', { md5: md5('abc'), sha256: sha256('abc') })).etag).toBe(md5('abc'));
  });

  it('stores bodies under a hash of the key, so no key can escape files/', async () => {
    const keys = ['../../../etc/passwd', '/absolute/path', 'a\\b\\..\\c', 'dots/./../..', 'spaces and ? # % & = +', 'unicode/ü/日本/🙂', `nul\u0000byte`, 'k'.repeat(1024)];
    for (const k of keys) {
      await bucket.put(k, `body of ${k.length}`);
      expect(await (await bucket.get(k))!.text()).toBe(`body of ${k.length}`);
      const o = store.head('FILES', k)!;
      const h = keyHash(k);
      const file = join(filesDir, 'FILES', h.slice(0, 2), h.slice(2, 4), `${h}.${o.version}`);
      expect(existsSync(file)).toBe(true);
    }
    for (const f of allFiles(filesDir)) expect(f).toMatch(/^(FILES\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{64}\.[0-9a-f]{32})$/);
    expect(existsSync(join(root, '..', 'etc'))).toBe(false);
  });

  it('refuses invalid keys like R2', async () => {
    expect((await errorOf(bucket.put('', 'x'))).message).toBe('put: The specified object name is not valid. (10020)');
    expect((await errorOf(bucket.put('k'.repeat(1025), 'x'))).message).toBe('put: The specified object name is not valid. (10020)');
    expect((await errorOf(bucket.put('\ud800lone', 'x'))).message).toBe('put: The specified object name is not valid. (10020)');
    expect((await errorOf(bucket.get(''))).message).toBe('get: The specified object name is not valid. (10020)');
  });

  it('replacing an object is atomic and removes the old version file', async () => {
    const first = await bucket.put('replace', 'one');
    const h = keyHash('replace');
    const dir = join(filesDir, 'FILES', h.slice(0, 2), h.slice(2, 4));
    expect(readdirSync(dir).filter((f) => f.startsWith(h))).toEqual([`${h}.${first.version}`]);
    const open = (await bucket.get('replace'))!;
    const second = await bucket.put('replace', 'two');
    expect(readdirSync(dir).filter((f) => f.startsWith(h))).toEqual([`${h}.${second.version}`]);
    expect(await open.text()).toBe('one');
    expect(await (await bucket.get('replace'))!.text()).toBe('two');
    expect(readdirSync(join(filesDir, '.tmp'))).toEqual([]);
  });

  it('concurrent puts to one key leave exactly one consistent object', async () => {
    const bodies = Array.from({ length: 10 }, (_, i) => `body-${i}`.repeat(1000));
    await Promise.all(bodies.map((b) => bucket.put('race', b)));
    const o = store.head('FILES', 'race')!;
    const text = await (await bucket.get('race'))!.text();
    expect(bodies).toContain(text);
    expect(o.size).toBe(text.length);
    expect(o.md5).toBe(md5(text));
    const h = keyHash('race');
    expect(readdirSync(join(filesDir, 'FILES', h.slice(0, 2), h.slice(2, 4))).filter((f) => f.startsWith(h))).toHaveLength(1);
  });

  it('delete() removes one or many keys and their files', async () => {
    await bucket.put('del/1', '1');
    await bucket.put('del/2', '2');
    await bucket.put('del/3', '3');
    const v = store.head('FILES', 'del/1')!.version;
    await bucket.delete('del/1');
    expect(await bucket.head('del/1')).toBeNull();
    expect(existsSync(store.path('FILES', 'del/1', v))).toBe(false);
    await bucket.delete(['del/2', 'del/3', 'del/missing']);
    expect((await bucket.list({ prefix: 'del/' })).objects).toEqual([]);
  });

  it('list() pages by prefix with a cursor and honours include and delimiter', async () => {
    for (const k of ['l/a', 'l/b', 'l/c', 'l/d/1', 'l/d/2', 'm']) await bucket.put(k, k, { httpMetadata: { contentType: 'text/plain' }, customMetadata: { k } });
    const p1 = await bucket.list({ prefix: 'l/', limit: 2 });
    expect(p1.objects.map((o) => o.key)).toEqual(['l/a', 'l/b']);
    expect(p1.truncated).toBe(true);
    const p2 = await bucket.list({ prefix: 'l/', limit: 2, cursor: p1.truncated ? p1.cursor : undefined });
    expect(p2.objects.map((o) => o.key)).toEqual(['l/c', 'l/d/1']);
    const p3 = await bucket.list({ prefix: 'l/', limit: 2, cursor: p2.truncated ? p2.cursor : undefined });
    expect(p3.objects.map((o) => o.key)).toEqual(['l/d/2']);
    expect(p3.truncated).toBe(false);
    expect(p1.objects[0].httpMetadata).toEqual({});
    expect(p1.objects[0].customMetadata).toEqual({});
    const inc = await bucket.list({ prefix: 'l/a', include: ['httpMetadata', 'customMetadata'] });
    expect(inc.objects[0].httpMetadata).toEqual({ contentType: 'text/plain' });
    expect(inc.objects[0].customMetadata).toEqual({ k: 'l/a' });
    const d = await bucket.list({ prefix: 'l/', delimiter: '/' });
    expect(d.objects.map((o) => o.key)).toEqual(['l/a', 'l/b', 'l/c']);
    expect(d.delimitedPrefixes).toEqual(['l/d/']);
    expect((await bucket.list({ startAfter: 'l/c', prefix: 'l/' })).objects.map((o) => o.key)).toEqual(['l/d/1', 'l/d/2']);
    expect((await errorOf(bucket.list({ limit: 0 }))).message).toBe('list: MaxKeys params must be positive integer <= 1000. (10022)');
    expect((await errorOf(bucket.list({ limit: 1001 }))).message).toBe('list: MaxKeys params must be positive integer <= 1000. (10022)');
  });

  it('refuses features it does not implement instead of ignoring them', async () => {
    expect((await errorOf(bucket.get('m', { onlyIf: { etagMatches: 'x' } }))).message).toMatch(/onlyIf is not supported/);
    expect((await errorOf(bucket.createMultipartUpload())).message).toMatch(/Multipart upload is not supported/);
  });

  it('survives a reopen and verifies stored bodies against the index', async () => {
    await bucket.put('persist', 'kept');
    const again = new FileStore(filesDir, openRuntimeDatabase(join(root, 'runtime.sqlite')));
    const o = again.head('FILES', 'persist')!;
    expect(await again.verify(o)).toEqual({ ok: true, size: 4 });
    writeFileSync(again.path('FILES', 'persist', o.version), 'KEPT');
    expect((await again.verify(o)).problem).toBe('sha256');
    writeFileSync(again.path('FILES', 'persist', o.version), 'longer');
    expect((await again.verify(o)).problem).toBe('size');
    expect(readFileSync(again.path('FILES', 'persist', o.version), 'utf8')).toBe('longer');
    expect(statSync(filesDir).isDirectory()).toBe(true);
  });

  it('reports files the index does not reference and cleans old partial uploads', async () => {
    const stray = join(filesDir, 'FILES', 'ab', 'cd');
    const { mkdirSync, utimesSync } = await import('node:fs');
    mkdirSync(stray, { recursive: true });
    writeFileSync(join(stray, 'stray'), 'x');
    expect(await store.unreferencedFiles()).toContain('FILES/ab/cd/stray');
    const part = join(filesDir, '.tmp', 'old.part');
    writeFileSync(part, 'partial');
    utimesSync(part, new Date(Date.now() - 2 * 3600_000), new Date(Date.now() - 2 * 3600_000));
    expect(await store.cleanTemp(3600_000)).toBe(1);
    expect(existsSync(part)).toBe(false);
  });
});
