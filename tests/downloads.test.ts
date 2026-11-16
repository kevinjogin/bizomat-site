// Public downloads on bizomat.ai (src/server/downloads.ts), through the Worker's handler with a stand-in store. On Fly the
// store is the repository's downloads/ folder (tests/downloads-node.test.ts). Installers are never public.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker, { type Env } from '../src/worker.ts';
import type { DownloadsBucket } from '../src/server/downloads.ts';

function bucket(files: Record<string, string>): DownloadsBucket & { asked: string[] } {
  const asked: string[] = [];
  return {
    asked,
    async get(key) {
      asked.push(key);
      if (!(key in files)) return null;
      const bytes = new TextEncoder().encode(files[key]);
      return { body: new Response(bytes).body!, size: bytes.byteLength, httpEtag: `"${key.length}"` };
    },
  };
}

const FILES = {
  'guides/Example-Guide-1.0.0.zip': 'versioned zip',
  'guides/Example-Guide.zip': 'stable zip',
  'guides/Example-Guide.zip.sha256': 'abc  Example-Guide.zip\n',
  'guides/release.json': '{"version":"1.0.0"}',
  'cad/BIZOMAT-CAD-Automation-x64.msi': 'an installer: stays behind sign-in, never public',
  'cad/notes.exe': 'not a kind that is served',
};

const env = (b?: DownloadsBucket): Env => ({
  ASSETS: { fetch: async (input) => new Response(`asset:${new URL(String(input instanceof Request ? input.url : input)).pathname}`) },
  ...(b ? { DOWNLOADS: b } : {}),
});

test('a public file downloads from bizomat.ai with its type, size and caching', async () => {
  const b = bucket(FILES);
  const stable = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/Example-Guide.zip'), env(b));
  assert.equal(stable.status, 200);
  assert.equal(await stable.text(), 'stable zip');
  assert.equal(stable.headers.get('Content-Type'), 'application/zip');
  assert.equal(stable.headers.get('Content-Length'), String('stable zip'.length));
  assert.equal(stable.headers.get('Content-Disposition'), 'attachment; filename="Example-Guide.zip"');
  assert.equal(stable.headers.get('Cache-Control'), 'public, max-age=300', 'the stable name changes with each release');
  assert.ok(stable.headers.get('ETag'));
  assert.ok(stable.headers.get('Content-Security-Policy') || stable.headers.get('X-Content-Type-Options'), 'the site headers are added');

  const versioned = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/Example-Guide-1.0.0.zip'), env(b));
  assert.equal(versioned.status, 200);
  assert.equal(versioned.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');

  const sum = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/Example-Guide.zip.sha256'), env(b));
  assert.equal(sum.headers.get('Content-Type'), 'text/plain; charset=utf-8');
  assert.equal(sum.headers.get('Content-Disposition'), null);
  assert.match(await sum.text(), /Example-Guide\.zip/);

  const manifest = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/release.json'), env(b));
  assert.equal(manifest.headers.get('Content-Type'), 'application/json');
});

test('HEAD answers without a body', async () => {
  const res = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/Example-Guide.zip', { method: 'HEAD' }), env(bucket(FILES)));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Length'), String('stable zip'.length));
  assert.equal(await res.text(), '');
});

test('only files of the listed kinds, one folder down, never an installer, and never without the store', async () => {
  const b = bucket(FILES);
  for (const path of ['/downloads/cad/notes.exe', '/downloads/cad/BIZOMAT-CAD-Automation-x64.msi', '/downloads/guides/missing.zip',
    '/downloads/Example-Guide.zip', '/downloads/guides/sub/file.zip', '/downloads/guides/..%2F..%2Fsecret.zip', '/downloads/',
    '/downloads/guides/', '/downloads/GUIDES/x.zip', '/downloads/guides/.hidden.zip', '/downloads/guides/%E0%A4%A.zip']) {
    const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env(b));
    assert.equal(res.status, 404, path);
  }
  assert.deepEqual(b.asked, ['guides/missing.zip'], 'only a well-formed name of a served kind reaches the store; an installer never does');
  assert.equal((await worker.fetch(new Request('https://bizomat.ai/downloads/guides/Example-Guide.zip'), env())).status, 404);
  const post = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/Example-Guide.zip', { method: 'POST', body: 'x' }), env(b));
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('Allow'), 'GET, HEAD');
});

test('no page or file of the website takes /downloads/, and the bucket is bound by name', () => {
  for (const root of ['src/pages', 'public']) assert.ok(!fs.existsSync(`${root}/downloads`), `${root}/downloads would hide the downloads`);
  const toml = fs.readFileSync('wrangler.toml', 'utf8');
  assert.match(toml, /^\[\[r2_buckets\]\]\nbinding = "DOWNLOADS"\nbucket_name = "bizomat-downloads"$/m);
});
