// Public downloads on bizomat.ai from the R2 bucket bizomat-downloads (src/server/downloads.ts), through the Worker.
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
  'cad/BIZOMAT-CAD-Automation-0.13.0-x64.msi': 'versioned msi',
  'cad/BIZOMAT-CAD-Automation-x64.msi': 'stable msi',
  'cad/BIZOMAT-CAD-Automation-x64.msi.sha256': 'abc  BIZOMAT-CAD-Automation-x64.msi\n',
  'cad/release.json': '{"version":"0.13.0"}',
  'cad/notes.exe': 'not a kind that is served',
};

const env = (b?: DownloadsBucket): Env => ({
  ASSETS: { fetch: async (input) => new Response(`asset:${new URL(String(input instanceof Request ? input.url : input)).pathname}`) },
  ...(b ? { DOWNLOADS: b } : {}),
});

test('the installer downloads from bizomat.ai with its type, size and caching', async () => {
  const b = bucket(FILES);
  const stable = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi'), env(b));
  assert.equal(stable.status, 200);
  assert.equal(await stable.text(), 'stable msi');
  assert.equal(stable.headers.get('Content-Type'), 'application/x-msi');
  assert.equal(stable.headers.get('Content-Length'), String('stable msi'.length));
  assert.equal(stable.headers.get('Content-Disposition'), 'attachment; filename="BIZOMAT-CAD-Automation-x64.msi"');
  assert.equal(stable.headers.get('Cache-Control'), 'public, max-age=300', 'the stable name changes with each release');
  assert.ok(stable.headers.get('ETag'));
  assert.ok(stable.headers.get('Content-Security-Policy') || stable.headers.get('X-Content-Type-Options'), 'the site headers are added');

  const versioned = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-0.13.0-x64.msi'), env(b));
  assert.equal(versioned.status, 200);
  assert.equal(versioned.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');

  const sum = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi.sha256'), env(b));
  assert.equal(sum.headers.get('Content-Type'), 'text/plain; charset=utf-8');
  assert.equal(sum.headers.get('Content-Disposition'), null);
  assert.match(await sum.text(), /BIZOMAT-CAD-Automation-x64\.msi/);

  const manifest = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/release.json'), env(b));
  assert.equal(manifest.headers.get('Content-Type'), 'application/json');
});

test('HEAD answers without a body', async () => {
  const res = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi', { method: 'HEAD' }), env(bucket(FILES)));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Length'), String('stable msi'.length));
  assert.equal(await res.text(), '');
});

test('only files of the listed kinds, one folder down, and never without the bucket', async () => {
  const b = bucket(FILES);
  for (const path of ['/downloads/cad/notes.exe', '/downloads/cad/missing.msi', '/downloads/BIZOMAT-CAD-Automation-x64.msi',
    '/downloads/cad/sub/file.msi', '/downloads/cad/..%2F..%2Fsecret.msi', '/downloads/', '/downloads/cad/', '/downloads/CAD/x.msi',
    '/downloads/cad/.hidden.msi', '/downloads/cad/%E0%A4%A.msi']) {
    const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env(b));
    assert.equal(res.status, 404, path);
  }
  assert.deepEqual(b.asked, ['cad/missing.msi'], 'only a well-formed name of a served kind reaches R2');
  assert.equal((await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi'), env())).status, 404);
  const post = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi', { method: 'POST', body: 'x' }), env(b));
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('Allow'), 'GET, HEAD');
});

test('no page or file of the website takes /downloads/, and the bucket is bound by name', () => {
  for (const root of ['src/pages', 'public']) assert.ok(!fs.existsSync(`${root}/downloads`), `${root}/downloads would hide the downloads`);
  const toml = fs.readFileSync('wrangler.toml', 'utf8');
  assert.match(toml, /^\[\[r2_buckets\]\]\nbinding = "DOWNLOADS"\nbucket_name = "bizomat-downloads"$/m);
});
