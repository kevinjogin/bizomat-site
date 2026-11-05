import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { NodeKVNamespace } from '../src/node/bindings/kv.ts';
import { openRuntimeDatabase } from '../src/node/store/file-store.ts';
import { tempDir } from './helpers.ts';

const db = openRuntimeDatabase(join(tempDir('work-kv-'), 'runtime.sqlite'));
const kv = new NodeKVNamespace(db, 'CACHE');
const other = new NodeKVNamespace(db, 'OTHER');

const errorOf = async (p: Promise<unknown>) => {
  try {
    await p;
  } catch (e) {
    return e as Error;
  }
  throw new Error('expected an error');
};

describe('KV binding', () => {
  it('returns null for missing keys (the admin health check)', async () => {
    expect(await kv.get('__health')).toBeNull();
    expect(await kv.getWithMetadata('__health')).toEqual({ value: null, metadata: null, cacheStatus: null });
  });

  it('stores values with metadata and reads them as text, json, arrayBuffer or stream', async () => {
    await kv.put('k', '{"a":1}', { metadata: { m: 1 } });
    expect(await kv.get('k')).toBe('{"a":1}');
    expect(await kv.get('k', 'json')).toEqual({ a: 1 });
    expect(await kv.get('k', { type: 'json' })).toEqual({ a: 1 });
    expect(new TextDecoder().decode((await kv.get('k', 'arrayBuffer'))!)).toBe('{"a":1}');
    expect(await new Response((await kv.get('k', 'stream'))!).text()).toBe('{"a":1}');
    expect(await kv.getWithMetadata('k', 'json')).toEqual({ value: { a: 1 }, metadata: { m: 1 }, cacheStatus: null });
    expect(await kv.get(['k', 'missing'])).toEqual(new Map([['k', '{"a":1}'], ['missing', null]]));
    expect(await other.get('k')).toBeNull();
  });

  it('expires entries and validates TTLs like KV', async () => {
    expect((await errorOf(kv.put('t', 'v', { expirationTtl: 10 }))).message).toBe('KV PUT failed: 400 Invalid expiration_ttl of 10. Expiration TTL must be at least 60.');
    await kv.put('t', 'v', { expirationTtl: 60 });
    expect(await kv.get('t')).toBe('v');
    const list = await kv.list({ prefix: 't' });
    expect(list.keys[0].name).toBe('t');
    expect(list.keys[0].expiration).toBeGreaterThan(Date.now() / 1000);
    vi.useFakeTimers({ now: Date.now() + 61_000 });
    try {
      expect(await kv.get('t')).toBeNull();
      expect(kv.purgeExpired()).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('lists keys in order with a cursor', async () => {
    for (const k of ['p/1', 'p/2', 'p/3']) await kv.put(k, k);
    const a = await kv.list({ prefix: 'p/', limit: 2 });
    expect(a.keys.map((k) => k.name)).toEqual(['p/1', 'p/2']);
    expect(a.list_complete).toBe(false);
    const b = await kv.list({ prefix: 'p/', limit: 2, cursor: a.list_complete ? undefined : a.cursor });
    expect(b.keys.map((k) => k.name)).toEqual(['p/3']);
    expect(b.list_complete).toBe(true);
  });

  it('deletes keys and refuses invalid names', async () => {
    await kv.put('d', 'x');
    await kv.delete('d');
    expect(await kv.get('d')).toBeNull();
    expect((await errorOf(kv.put('', 'x'))).message).toMatch(/Invalid key name/);
    expect((await errorOf(kv.put('k'.repeat(513), 'x'))).message).toMatch(/exceeds key length limit/);
  });
});
