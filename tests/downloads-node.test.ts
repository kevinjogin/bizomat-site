// Public downloads on the Node website (the Fly web process): the repository's downloads/ folder, copied into the image
// (src/node/bindings.ts folderDownloads), served by the same handler as on a Worker (src/server/downloads.ts). Only files
// listed in downloads/SHA256SUMS are served, and only while their bytes match the list. No cloud storage is involved.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { folderDownloads, parseSums } from '../src/node/bindings.ts';
import { handleDownload } from '../src/server/downloads.ts';
import { buildEnv } from '../src/node/server.ts';
import worker, { type Env } from '../src/worker.ts';

const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const PDF = Buffer.from('%PDF-1.4\nexample public guide\n%%EOF\n');
const NOTES = 'Release notes for an example.\n';

/** A downloads folder like the image's: a listed PDF and text file, an unlisted file, a secret outside, a link out. */
function folder() {
  const root = mkdtempSync(join(tmpdir(), 'downloads-'));
  const dir = join(root, 'downloads');
  mkdirSync(join(dir, 'guides'), { recursive: true });
  mkdirSync(join(dir, 'cad'), { recursive: true });
  writeFileSync(join(dir, 'guides', 'Example-Guide-1.0.0.pdf'), PDF);
  writeFileSync(join(dir, 'guides', 'notes.txt'), NOTES);
  writeFileSync(join(dir, 'guides', 'unlisted.txt'), 'not listed\n');
  writeFileSync(join(dir, 'cad', 'BIZOMAT-CAD-Automation-x64.msi'), 'an installer');
  writeFileSync(join(root, 'secret.txt'), 'outside the folder\n');
  symlinkSync(join(root, 'secret.txt'), join(dir, 'guides', 'link.txt'));
  writeFileSync(
    join(dir, 'SHA256SUMS'),
    [
      '# public downloads',
      `${sha(PDF)}  guides/Example-Guide-1.0.0.pdf`,
      `${sha(NOTES)}  guides/notes.txt`,
      `${sha('outside the folder\n')}  guides/link.txt`,
      `${sha('an installer')}  cad/BIZOMAT-CAD-Automation-x64.msi`,
      `${sha('gone')}  guides/missing.txt`,
      '',
    ].join('\n'),
  );
  return dir;
}

const get = (bucket: ReturnType<typeof folderDownloads>, path: string, method = 'GET') =>
  handleDownload(new Request(`https://bizomat.ai/downloads/${path}`, { method }), bucket);

test('a listed file is served whole, with its checksum, type and cache headers, and HEAD sends no body', async () => {
  const bucket = folderDownloads(folder());
  const res = await get(bucket, 'guides/Example-Guide-1.0.0.pdf');
  assert.equal(res.status, 200);
  const body = Buffer.from(await res.arrayBuffer());
  assert.equal(sha(body), sha(PDF), 'the bytes match SHA256SUMS');
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  assert.equal(res.headers.get('content-length'), String(PDF.length));
  assert.equal(res.headers.get('etag'), `"${sha(PDF).slice(0, 32)}"`);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.match(res.headers.get('cache-control') ?? '', /max-age=31536000, immutable/, 'a versioned name never changes');
  const sum = await get(bucket, 'guides/Example-Guide-1.0.0.pdf.sha256');
  assert.equal(sum.status, 200);
  assert.equal(await sum.text(), `${sha(PDF)}  Example-Guide-1.0.0.pdf\n`);
  const head = await get(bucket, 'guides/notes.txt', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), String(Buffer.byteLength(NOTES)));
  assert.equal(await head.text(), '');
  assert.match((await get(bucket, 'guides/notes.txt')).headers.get('cache-control') ?? '', /max-age=300/);
});

test('missing, unlisted and invalid paths answer 404, and other methods 405', async () => {
  const bucket = folderDownloads(folder());
  for (const path of [
    'guides/missing.txt', // listed, but not in the folder
    'guides/unlisted.txt', // in the folder, not listed
    'guides/unlisted.txt.sha256',
    'guides/nothing.pdf',
    'guides/../../secret.txt',
    'guides/%2e%2e/%2e%2e/secret.txt',
    'guides%2F..%2F..%2Fsecret.txt',
    'SHA256SUMS',
    'guides',
    'a/b/c.txt',
    '.hidden/x.txt',
    'guides/notes.exe',
    'guides/%ZZ.txt',
  ]) {
    assert.equal((await get(bucket, path)).status, 404, path);
  }
  const post = await get(bucket, 'guides/notes.txt', 'POST');
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});

test('installers are never public, and a link out of the folder is never followed', async () => {
  const bucket = folderDownloads(folder());
  // Listed with the right checksum, but .msi is not a public download kind: the CAD installer stays behind sign-in.
  assert.equal((await get(bucket, 'cad/BIZOMAT-CAD-Automation-x64.msi')).status, 404);
  assert.equal((await get(bucket, 'guides/link.txt')).status, 404, 'a symbolic link to a file outside downloads/');
});

test('a file whose bytes no longer match SHA256SUMS is never sent', async () => {
  const dir = folder();
  const bucket = folderDownloads(dir);
  assert.equal((await get(bucket, 'guides/notes.txt')).status, 200);
  writeFileSync(join(dir, 'guides', 'notes.txt'), 'Release notes for an example!\n'); // same size, other bytes
  const res = await get(bucket, 'guides/notes.txt');
  assert.equal(res.status, 500);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.doesNotMatch(await res.text(), /example/);
});

test('SHA256SUMS must be well formed; without it nothing is served', async () => {
  assert.deepEqual([...parseSums(`# c\n\n${'a'.repeat(64)}  x/y.txt\n${'b'.repeat(64)} *x/z.pdf\n`).entries()], [
    ['x/y.txt', 'a'.repeat(64)],
    ['x/z.pdf', 'b'.repeat(64)],
  ]);
  assert.throws(() => parseSums('not a checksum line'));
  assert.throws(() => parseSums(`${'a'.repeat(64)}  x/y.txt\n${'b'.repeat(64)}  x/y.txt`), /twice/);
  const empty = folderDownloads(join(mkdtempSync(join(tmpdir(), 'downloads-')), 'none'));
  assert.deepEqual(empty.listed(), []);
  assert.equal((await get(empty, 'guides/notes.txt')).status, 404);
});

test('the Node website serves downloads/ next to its built site, with no setting and no cloud storage', async () => {
  const dir = folder();
  const site = join(dir, '..', 'dist');
  mkdirSync(site, { recursive: true });
  const env = buildEnv(site, {}) as Env & { DOWNLOADS?: ReturnType<typeof folderDownloads> };
  assert.ok(env.DOWNLOADS, 'downloads are on without any setting');
  assert.deepEqual(env.DOWNLOADS!.listed().sort(), ['cad/BIZOMAT-CAD-Automation-x64.msi', 'guides/Example-Guide-1.0.0.pdf', 'guides/link.txt', 'guides/missing.txt', 'guides/notes.txt']);
  const res = await worker.fetch(new Request('https://bizomat.ai/downloads/guides/notes.txt'), env, { waitUntil() {}, passThroughOnException() {} } as never);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), NOTES);
  // A broken SHA256SUMS never stops the website: downloads are off, the rest works.
  writeFileSync(join(dir, 'SHA256SUMS'), 'broken');
  assert.doesNotThrow(() => buildEnv(site, {}));
});

test("the repository's own downloads/SHA256SUMS is valid, and every listed file is there with its listed checksum", () => {
  const dir = join(import.meta.dirname, '..', 'downloads');
  const sums = parseSums(readFileSync(join(dir, 'SHA256SUMS'), 'utf8'));
  for (const [key, sum] of sums) {
    assert.match(key, /^[a-z0-9-]{1,40}\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/, key);
    assert.doesNotMatch(key, /\.(msi|exe)$/i, `${key}: installers are never public`);
    assert.equal(sha(readFileSync(join(dir, ...key.split('/')))), sum, `${key} does not match SHA256SUMS`);
  }
});
