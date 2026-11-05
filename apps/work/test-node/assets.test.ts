import { mkdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';
import { beforeAll, describe, expect, it } from 'vitest';
import { StaticAssets } from '../src/node/assets.ts';
import { silentLogger } from '../src/node/log.ts';
import { tempDir } from './helpers.ts';

const root = tempDir('work-assets-');
const dir = join(root, 'client');
const INDEX = '<!doctype html><title>App</title><div id="root"></div>' + ' '.repeat(2000);
let assets: StaticAssets;

beforeAll(async () => {
  mkdirSync(join(dir, 'assets'), { recursive: true });
  mkdirSync(join(dir, 'fonts'), { recursive: true });
  mkdirSync(join(dir, 'docs'), { recursive: true });
  writeFileSync(join(dir, 'index.html'), INDEX);
  writeFileSync(join(dir, 'assets', 'index-abc123.js'), 'console.log(1);'.repeat(200));
  writeFileSync(join(dir, 'assets', 'index-abc123.css'), 'body{}');
  writeFileSync(join(dir, 'favicon.svg'), '<svg/>');
  writeFileSync(join(dir, 'fonts', 'inter.woff2'), 'woff2');
  writeFileSync(join(dir, 'about.html'), '<p>about</p>');
  writeFileSync(join(dir, 'docs', 'index.html'), '<p>docs</p>');
  writeFileSync(join(dir, '.env'), 'SECRET=1');
  writeFileSync(join(root, 'outside.txt'), 'outside');
  symlinkSync(join(root, 'outside.txt'), join(dir, 'link.txt'));
  assets = new StaticAssets(dir, silentLogger);
  await assets.precompress();
});

const get = (path: string, headers: Record<string, string> = {}, method = 'GET') => assets.fetch(new Request(`http://app.test${path}`, { method, headers }));

describe('static assets', () => {
  it('serves files with the right content type and cache policy', async () => {
    const js = await get('/assets/index-abc123.js');
    expect(js.status).toBe(200);
    expect(js.headers.get('content-type')).toBe('text/javascript; charset=utf-8');
    expect(js.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect((await get('/assets/index-abc123.css')).headers.get('content-type')).toBe('text/css; charset=utf-8');
    const svg = await get('/favicon.svg');
    expect(svg.headers.get('content-type')).toBe('image/svg+xml');
    expect(svg.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate');
    expect((await get('/fonts/inter.woff2')).headers.get('content-type')).toBe('font/woff2');
    expect(await (await get('/favicon.svg')).text()).toBe('<svg/>');
  });

  it('falls back to index.html for unknown paths (single-page application)', async () => {
    for (const p of ['/', '/w/abc/boards', '/login', '/assets/missing.js', '/no/such/file.png']) {
      const r = await get(p);
      expect(r.status, p).toBe(200);
      expect(r.headers.get('content-type'), p).toBe('text/html; charset=utf-8');
      expect(await r.text(), p).toBe(INDEX);
    }
  });

  it('applies auto-trailing-slash html handling', async () => {
    expect((await get('/index.html')).headers.get('location')).toBe('/');
    expect((await get('/about.html')).status).toBe(307);
    expect((await get('/about.html')).headers.get('location')).toBe('/about');
    expect(await (await get('/about')).text()).toBe('<p>about</p>');
    expect((await get('/docs')).headers.get('location')).toBe('/docs/');
    expect(await (await get('/docs/')).text()).toBe('<p>docs</p>');
  });

  it('never lists directories, serves hidden files or follows paths out of the directory', async () => {
    for (const p of ['/assets/', '/fonts', '/.env', '/link.txt', '/..%2foutside.txt', '/%2e%2e/outside.txt', '/assets/..%2F..%2Foutside.txt', '/%2e%2e%2f%2e%2e%2fetc%2fpasswd', '/assets%5c..%5c..%5coutside.txt', '/%ZZ']) {
      const r = await get(p);
      const body = await r.text();
      expect(body, p).toBe(INDEX);
      expect(body, p).not.toContain('outside');
      expect(body, p).not.toContain('SECRET');
    }
  });

  it('answers conditional requests and HEAD', async () => {
    const first = await get('/favicon.svg');
    const etag = first.headers.get('etag')!;
    expect(etag).toMatch(/^".+"$/);
    expect((await get('/favicon.svg', { 'If-None-Match': etag })).status).toBe(304);
    const head = await get('/favicon.svg', {}, 'HEAD');
    expect(head.status).toBe(200);
    expect(head.headers.get('content-length')).toBe('6');
    expect(await head.text()).toBe('');
    expect((await get('/favicon.svg', {}, 'POST')).status).toBe(405);
  });

  it('serves precompressed variants to clients that accept them', async () => {
    const br = await get('/assets/index-abc123.js', { 'Accept-Encoding': 'gzip, deflate, br' });
    expect(br.headers.get('content-encoding')).toBe('br');
    expect(br.headers.get('vary')).toBe('Accept-Encoding');
    expect(brotliDecompressSync(Buffer.from(await br.arrayBuffer())).toString()).toBe('console.log(1);'.repeat(200));
    const gz = await get('/assets/index-abc123.js', { 'Accept-Encoding': 'gzip' });
    expect(gz.headers.get('content-encoding')).toBe('gzip');
    expect(gunzipSync(Buffer.from(await gz.arrayBuffer())).toString()).toBe('console.log(1);'.repeat(200));
    expect(gz.headers.get('etag')).not.toBe(br.headers.get('etag'));
    const plain = await get('/assets/index-abc123.js', { 'Accept-Encoding': 'br;q=0' });
    expect(plain.headers.get('content-encoding')).toBeNull();
    expect((await get('/favicon.svg', { 'Accept-Encoding': 'br' })).headers.get('content-encoding')).toBeNull();
  });
});
