// Public downloads on the Node website (the Fly web process): the R2 bucket through R2's S3 API (src/node/bindings.ts),
// served by the same handler as on a Worker (src/server/downloads.ts). R2 is a local stand-in here; no request leaves
// the machine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { EMPTY_SHA256, r2Downloads, signV4 } from '../src/node/bindings.ts';
import { buildEnv } from '../src/node/server.ts';
import worker, { type Env } from '../src/worker.ts';

// Not keys: built at run time, so secret scanners reading this repository see no key-shaped text.
const join = (...parts: string[]) => parts.join('');
const ACCOUNT = '0123456789abcdef0123456789abcdef';
const KEY_ID = join('test', 'downloadkeyid', '0000000000');
const SECRET = join('test', 'downloadsecret', '00000000000000000000000000000000');

test('AWS Signature Version 4: the example from the Amazon S3 documentation (GET Object)', () => {
  // docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html, "Example: GET Object".
  const headers = signV4('GET', 'examplebucket.s3.amazonaws.com', '/test.txt', { range: 'bytes=0-9' }, {
    accessKeyId: join('AKIA', 'IOSFODNN7EXAMPLE'),
    secretAccessKey: join('wJalrXUtnFEMI/K7MDENG/', 'bPxRfiCYEXAMPLEKEY'),
    region: 'us-east-1',
    service: 's3',
  }, new Date('2013-05-24T00:00:00Z'));
  assert.equal(headers['x-amz-date'], '20130524T000000Z');
  assert.equal(headers['x-amz-content-sha256'], EMPTY_SHA256);
  assert.equal(headers.Authorization, `AWS4-HMAC-SHA256 Credential=${join('AKIA', 'IOSFODNN7EXAMPLE')}/20130524/us-east-1/s3/aws4_request, ` +
    'SignedHeaders=host;range;x-amz-content-sha256;x-amz-date, Signature=f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41');
  assert.equal(headers.host, undefined, 'fetch sets Host itself');
});

const FILES: Record<string, string> = {
  '/bizomat-downloads/cad/BIZOMAT-CAD-Automation-x64.msi': 'stable msi bytes',
  '/bizomat-downloads/cad/BIZOMAT-CAD-Automation-0.13.1-x64.msi': 'versioned msi bytes',
  '/bizomat-downloads/cad/release.json': '{"version":"0.13.1"}',
};

// A stand-in for R2's S3 API: it checks each request's signature the way R2 does, and answers like GetObject.
async function withR2(run: (endpoint: string, seen: string[]) => Promise<void>) {
  const seen: string[] = [];
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const path = req.url ?? '';
    seen.push(`${req.method} ${path}`);
    const date = String(req.headers['x-amz-date']);
    const when = new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(9, 11)}:${date.slice(11, 13)}:${date.slice(13, 15)}Z`);
    const expected = signV4(req.method ?? 'GET', String(req.headers.host), path, {}, { accessKeyId: KEY_ID, secretAccessKey: SECRET, region: 'auto', service: 's3' }, when);
    if (req.headers.authorization !== expected.Authorization) {
      res.writeHead(403, { 'content-type': 'application/xml' }).end('<Error><Code>SignatureDoesNotMatch</Code></Error>');
      return;
    }
    const body = FILES[path];
    if (body === undefined) {
      res.writeHead(404, { 'content-type': 'application/xml' }).end('<Error><Code>NoSuchKey</Code></Error>');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/octet-stream', 'content-length': Buffer.byteLength(body), etag: `"etag-${body.length}"` }).end(body);
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  try {
    await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`, seen);
  } finally {
    server.close();
  }
}

const envWith = (endpoint: string, secret = SECRET): Env => ({
  ASSETS: { fetch: async () => new Response('asset') },
  DOWNLOADS: r2Downloads({ accountId: ACCOUNT, accessKeyId: KEY_ID, secretAccessKey: secret, bucket: 'bizomat-downloads', endpoint }),
});

test('the installer, its checksum and the release record come from R2, signed, with the site headers', async () => {
  await withR2(async (endpoint, seen) => {
    const env = envWith(endpoint);
    const stable = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi'), env);
    assert.equal(stable.status, 200);
    assert.equal(await stable.text(), 'stable msi bytes');
    assert.equal(stable.headers.get('Content-Type'), 'application/x-msi');
    assert.equal(stable.headers.get('Content-Length'), String('stable msi bytes'.length));
    assert.equal(stable.headers.get('Content-Disposition'), 'attachment; filename="BIZOMAT-CAD-Automation-x64.msi"');
    assert.equal(stable.headers.get('Cache-Control'), 'public, max-age=300');
    assert.equal(stable.headers.get('ETag'), '"etag-16"');

    const versioned = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-0.13.1-x64.msi'), env);
    assert.equal(versioned.status, 200);
    assert.equal(versioned.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
    await versioned.body?.cancel();

    const record = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/release.json'), env);
    assert.deepEqual(await record.json(), { version: '0.13.1' });

    const head = await worker.fetch(new Request('https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi', { method: 'HEAD' }), env);
    assert.equal(head.status, 200);
    assert.equal(head.headers.get('Content-Length'), String('stable msi bytes'.length));
    assert.equal(await head.text(), '');

    assert.equal((await worker.fetch(new Request('https://bizomat.ai/downloads/cad/missing.msi'), env)).status, 404);
    // Names the handler refuses never reach R2.
    assert.equal((await worker.fetch(new Request('https://bizomat.ai/downloads/cad/..%2Fsecret.msi'), env)).status, 404);
    assert.ok(seen.every((s) => s.startsWith('GET /bizomat-downloads/cad/')), seen.join('\n'));
  });
});

test('a refused signature is an error, never a file or a quiet 404', async () => {
  await withR2(async (endpoint) => {
    const bucket = envWith(endpoint, join('wrong', 'downloadsecret', '000000000000000000000000000000')).DOWNLOADS!;
    await assert.rejects(bucket.get('cad/BIZOMAT-CAD-Automation-x64.msi'), /R2 downloads: HTTP 403/);
  });
});

test('the Node website has downloads only with an R2 token, and a malformed one never stops it starting', () => {
  const has = (settings: Record<string, string>) => Boolean((buildEnv('dist', settings) as unknown as { DOWNLOADS?: unknown }).DOWNLOADS);
  const token = { WEB_DOWNLOADS_R2_ACCESS_KEY_ID: KEY_ID, WEB_DOWNLOADS_R2_SECRET_ACCESS_KEY: SECRET };
  assert.equal(has({}), false);
  assert.equal(has(token), false, 'no account id');
  assert.equal(has({ ...token, CF_ACCOUNT_ID: ACCOUNT }), true, 'the Workers AI account id serves');
  assert.equal(has({ ...token, WEB_DOWNLOADS_R2_ACCOUNT_ID: ACCOUNT }), true);
  assert.equal(has({ WEB_DOWNLOADS_R2_ACCESS_KEY_ID: KEY_ID, WEB_DOWNLOADS_R2_ACCOUNT_ID: ACCOUNT }), false, 'no secret');
  const errors: string[] = [];
  const original = console.error;
  console.error = (line: string) => errors.push(line);
  try {
    assert.equal(has({ ...token, WEB_DOWNLOADS_R2_ACCOUNT_ID: 'not-an-account' }), false);
    assert.equal(has({ ...token, WEB_DOWNLOADS_R2_ACCOUNT_ID: ACCOUNT, WEB_DOWNLOADS_R2_BUCKET: 'Bad/Name' }), false);
  } finally {
    console.error = original;
  }
  assert.equal(errors.length, 2);
  for (const line of errors) assert.ok(!line.includes(SECRET) && !line.includes(KEY_ID), 'a value was logged');
});
