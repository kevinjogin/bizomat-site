// The data store the server's supervisor (opensketch/persist.py) talks to, run on Node with a stand-in bucket.
import { describe, expect, it } from 'vitest';
import { handlePersist, MAX_OBJECT, PERSIST_HOST, type StoreBucket } from '../src/persist';
import { bucket, sha } from './bucket';

const call = (b: StoreBucket, method: string, path: string, init: RequestInit = {}) =>
  handlePersist(new Request(`http://${PERSIST_HOST}${path}`, { method, ...init }), b);
const size = (body: string | Uint8Array) => String(typeof body === 'string' ? new TextEncoder().encode(body).byteLength : body.byteLength);
/** A PUT as persist.py sends it: Content-Length and the body's checksum. */
const put = async (b: StoreBucket, key: string, body: string | Uint8Array, sum?: string) =>
  call(b, 'PUT', `/o/${key}`, { body, headers: { 'content-length': size(body), 'x-content-sha256': sum ?? (await sha(body)) } });

describe('data store', () => {
  it('stores, lists and returns a state file with its checksum', async () => {
    const b = bucket();
    const body = '{"users": []}';
    expect((await put(b, 'data/users.json', body)).status).toBe(204);
    expect(b.items.get('data/users.json')?.customMetadata).toEqual({ sha256: await sha(body) });

    const got = await call(b, 'GET', '/o/data/users.json');
    expect(got.status).toBe(200);
    expect(got.headers.get('content-length')).toBe(String(body.length));
    expect(await got.text()).toBe(body);

    const list = await call(b, 'GET', '/list');
    expect(list.status).toBe(200);
    expect(await list.json()).toEqual({ objects: [{ key: 'data/users.json', size: body.length, sha256: await sha(body) }] });
  });

  it('takes the checksum in any letter case and keeps binary files byte for byte', async () => {
    const b = bucket();
    const body = new Uint8Array([0, 255, 1, 254, 10, 13]);
    expect((await put(b, 'data/bridge.sqlite', body, (await sha(body)).toUpperCase())).status).toBe(204);
    const got = new Uint8Array(await (await call(b, 'GET', '/o/data/bridge.sqlite')).arrayBuffer());
    expect([...got]).toEqual([...body]);
  });

  it('refuses a body whose checksum does not match, and keeps what it had', async () => {
    const b = bucket();
    await put(b, 'data/users.json', 'old');
    const r = await put(b, 'data/users.json', 'new', await sha('something else'));
    expect(r.status).toBe(400);
    expect(await r.text()).toMatch(/^not stored: /);
    expect(new TextDecoder().decode(b.items.get('data/users.json')!.bytes)).toBe('old');
  });

  it('needs the length and a well-formed checksum before it reads anything', async () => {
    const b = bucket();
    const noLength = await call(b, 'PUT', '/o/data/users.json', { body: 'x', headers: { 'x-content-sha256': await sha('x') } });
    expect(noLength.status).toBe(411);
    const noSum = await call(b, 'PUT', '/o/data/users.json', { body: 'x', headers: { 'content-length': '1' } });
    expect(noSum.status).toBe(400);
    const badSum = await call(b, 'PUT', '/o/data/users.json', { body: 'x', headers: { 'content-length': '1', 'x-content-sha256': 'abc' } });
    expect(badSum.status).toBe(400);
    expect(b.items.size).toBe(0);
  });

  it('keeps the old copy when R2 fails', async () => {
    const b = bucket();
    await put(b, 'data/users.json', 'old');
    b.failPuts = true;
    const r = await put(b, 'data/users.json', 'new');
    expect(r.status).toBe(400);
    expect(new TextDecoder().decode(b.items.get('data/users.json')!.bytes)).toBe('old');
  });

  it('stores an empty file', async () => {
    const b = bucket();
    expect((await put(b, 'data/accounts.enabled', '')).status).toBe(204);
    expect(b.items.get('data/accounts.enabled')!.bytes.byteLength).toBe(0);
    const got = await call(b, 'GET', '/o/data/accounts.enabled');
    expect(got.status).toBe(200);
    expect((await got.arrayBuffer()).byteLength).toBe(0);
  });

  it('refuses a body over the limit before reading it', async () => {
    const b = bucket();
    const r = await call(b, 'PUT', '/o/data/big.bin', {
      body: 'x',
      headers: { 'content-length': String(MAX_OBJECT + 1), 'x-content-sha256': await sha('x') },
    });
    expect(r.status).toBe(413);
    expect(b.items.size).toBe(0);
  });

  it('lists every page of a long listing, objects without a checksum included', async () => {
    const b = bucket(2);
    for (let i = 0; i < 5; i++) await put(b, `data/f${i}.json`, `v${i}`);
    b.items.set('data/legacy.json', { bytes: new Uint8Array([1]) });
    b.items.set('other/outside.json', { bytes: new Uint8Array([1]) }); // not under data/: never listed
    b.lists = 0;
    const { objects } = (await (await call(b, 'GET', '/list')).json()) as { objects: { key: string; sha256: string | null }[] };
    expect(objects.map((o) => o.key)).toEqual(['data/f0.json', 'data/f1.json', 'data/f2.json', 'data/f3.json', 'data/f4.json', 'data/legacy.json']);
    expect(objects.find((o) => o.key === 'data/legacy.json')!.sha256).toBeNull();
    expect(b.lists).toBe(3);
  });

  it('answers 404 for a missing file and deletes', async () => {
    const b = bucket();
    expect((await call(b, 'GET', '/o/data/none.json')).status).toBe(404);
    await put(b, 'data/gone.json', 'x');
    expect((await call(b, 'DELETE', '/o/data/gone.json')).status).toBe(204);
    expect(b.items.has('data/gone.json')).toBe(false);
    expect((await call(b, 'DELETE', '/o/data/gone.json')).status).toBe(204); // deleting twice is fine
  });

  it('accepts only names in the one data folder', async () => {
    const b = bucket();
    const bad = [
      '/o/data/../secrets.json',
      '/o/data%2F..%2Fsecrets.json',
      '/o/data/a..b',
      '/o/data/.hidden',
      '/o/data/sub/file.json',
      '/o/data%2Fsub%2Ffile.json',
      '/o/other/file.json',
      '/o/data/',
      '/o/data/space%20name.json',
      '/o/data/%E0%A4%A', // not valid percent-encoding
      `/o/data/${'a'.repeat(129)}`,
    ];
    for (const path of bad) {
      for (const method of ['GET', 'PUT', 'DELETE']) {
        const init = method === 'PUT' ? { body: 'x', headers: { 'content-length': '1', 'x-content-sha256': await sha('x') } } : {};
        const r = await call(b, method, path, init);
        expect([400, 404], `${method} ${path}`).toContain(r.status);
      }
    }
    expect(b.items.size).toBe(0);
    // the names the server really uses
    for (const name of ['users.json', 'bridge.sqlite', 'bridge-signing-key.pem', 'accounts.enabled', 'oauth_clients.json', 'A_1-b.c']) {
      expect((await put(b, `data/${name}`, name)).status, name).toBe(204);
    }
  });

  it('answers only the methods it knows', async () => {
    const b = bucket();
    expect((await call(b, 'POST', '/list')).status).toBe(405);
    expect((await call(b, 'PATCH', '/o/data/users.json', { body: 'x' })).status).toBe(405);
    expect((await call(b, 'GET', '/')).status).toBe(404);
    expect((await call(b, 'GET', '/objects/data/users.json')).status).toBe(404);
  });
});
