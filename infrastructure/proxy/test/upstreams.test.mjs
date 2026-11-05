import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { Upstream, isConnectError } from '../upstreams.mjs';

test('URL forms: names, IPv4, bracketed IPv6, and refusals', () => {
  const internal = new Upstream('web', 'http://web.process.bizomat.internal:8003');
  assert.equal(internal.hostname, 'web.process.bizomat.internal');
  assert.equal(internal.port, 8003);
  assert.equal(internal.family, 6, '.internal names are IPv6 only');
  assert.ok(internal.requestOptions().lookup, 'names use the lookup hook');

  const v6 = new Upstream('cad', 'http://[fdaa:0:3b99:a7b:ef::2]:8001');
  assert.equal(v6.hostname, 'fdaa:0:3b99:a7b:ef::2', 'brackets removed for connecting');
  assert.equal(v6.display, '[fdaa:0:3b99:a7b:ef::2]:8001', 'brackets kept for display');
  assert.equal(v6.family, 6);
  assert.equal(v6.requestOptions().family, 6);
  assert.equal(v6.requestOptions().lookup, undefined);

  const v4 = new Upstream('work', 'http://127.0.0.1:8002');
  assert.equal(v4.family, 4);

  const plain = new Upstream('work', 'http://work:8002');
  assert.equal(plain.family, 0, 'other names: system order');

  assert.throws(() => new Upstream('web', 'https://web:8003'), /http:\/\//);
  assert.throws(() => new Upstream('web', 'http://web:8003/base'), /scheme, host and port/);
  assert.throws(() => new Upstream('web', 'not a url'), /not a URL/);
  for (const u of [internal, v6, v4, plain]) u.close();
});

test('lookup hook: both callback forms, round robin, cache and invalidation', async () => {
  const calls = [];
  const up = new Upstream('web', 'http://web.process.bizomat.internal:8003', {
    ttlMs: 60_000,
    resolve: async (host, opts) => {
      calls.push([host, opts.family, opts.all]);
      return [{ address: 'fdaa::a', family: 6 }, { address: 'fdaa::b', family: 6 }];
    },
  });
  const one = (opts) => new Promise((resolve, reject) => up.lookup('ignored', opts, (err, address, family) => (err ? reject(err) : resolve([address, family]))));
  const many = () => new Promise((resolve, reject) => up.lookup('ignored', { all: true }, (err, list) => (err ? reject(err) : resolve(list))));
  assert.deepEqual(await one({}), ['fdaa::a', 6]);
  assert.deepEqual(await one({}), ['fdaa::b', 6], 'round robin');
  assert.deepEqual((await many()).map((a) => a.address), ['fdaa::a', 'fdaa::b']);
  assert.equal(calls.length, 1, 'cached');
  assert.deepEqual(calls[0], ['web.process.bizomat.internal', 6, true]);
  up.invalidate();
  await one({});
  assert.equal(calls.length, 2, 'looked up again after invalidate');
  up.close();
});

test('a lookup that fails or finds nothing reaches the caller as an error', async () => {
  const up = new Upstream('web', 'http://web.process.bizomat.internal:8003', { resolve: async () => [] });
  await assert.rejects(() => up.addresses(), (err) => err.code === 'ENOTFOUND');
  up.close();
});

test('re-resolves after a refused connection: the second lookup answer is used', async () => {
  const server = http.createServer((req, res) => res.end('ok'));
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  // 127.0.0.2 is loopback too, but nothing listens there for this port: connection refused
  const answers = [[{ address: '127.0.0.2', family: 4 }], [{ address: '127.0.0.1', family: 4 }]];
  let lookups = 0;
  const up = new Upstream('cad', `http://cad.example.test:${port}`, {
    resolve: async () => answers[Math.min(lookups++, answers.length - 1)],
  });
  const get = () => new Promise((resolve) => {
    const req = http.request(up.requestOptions({ path: '/', method: 'GET', agent: false }));
    req.on('response', (res) => {
      res.resume();
      res.on('end', () => resolve({ ok: true, status: res.statusCode }));
    });
    req.on('error', (err) => resolve({ ok: false, err }));
    req.end();
  });
  const first = await get();
  assert.equal(first.ok, false);
  assert.ok(isConnectError(first.err), `connect error, got ${first.err && first.err.code}`);
  up.invalidate();
  const second = await get();
  assert.deepEqual(second, { ok: true, status: 200 });
  assert.equal(lookups, 2);
  up.close();
  server.close();
});

test('probe reports status and time and never throws', async () => {
  const server = http.createServer((req, res) => {
    res.statusCode = req.url === '/healthz' ? 200 : 503;
    res.end('{}');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const up = new Upstream('web', `http://127.0.0.1:${server.address().port}`);
  const ok = await up.probe('/healthz');
  assert.equal(ok.ok, true);
  assert.equal(ok.status, 200);
  assert.equal(typeof ok.ms, 'number');
  const bad = await up.probe('/other');
  assert.equal(bad.ok, false);
  assert.equal(bad.status, 503);
  server.close();
  await new Promise((r) => server.once('close', r));
  const down = await up.probe('/healthz', 500);
  assert.equal(down.ok, false);
  assert.equal(down.status, 0);
  assert.equal(down.error, 'ECONNREFUSED');
  up.close();
});
