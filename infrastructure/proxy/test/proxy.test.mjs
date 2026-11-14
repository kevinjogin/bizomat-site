import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import { deadPort, request, sleep, startProxy, startUpstream, wsFrame, wsOpen, wsRead } from './helpers.mjs';
import { loadConfig } from '../config.mjs';

let web;
let work;
let cad;
let p; // the default proxy: socket mode, preview routing on
const urls = () => ({ web: web.url, work: work.url, cad: cad.url });

before(async () => {
  web = await startUpstream('web');
  work = await startUpstream('work');
  cad = await startUpstream('cad');
  p = await startProxy(urls(), { BIZOMAT_PREVIEW_ROUTING: '1', BIZOMAT_VERSION: 'test123' });
});

after(async () => {
  await p.close();
  await Promise.all([web.close(), work.close(), cad.close()]);
});

const hdrPairs = (raw, name) => {
  const out = [];
  for (let i = 0; i < raw.length; i += 2) if (raw[i].toLowerCase() === name) out.push(raw[i + 1]);
  return out;
};

test('each host and path reaches its backend with path, query and Host unchanged', async () => {
  const cases = [
    ['bizomat.ai', '/some/path/?q=1&r=%2F', 'web'],
    ['bizomat.ai', '/cad/some/path/?q=1&r=%2F', 'cad'],
    ['bizomat.ai', '/cad?q=1', 'cad'],
    ['bizomat.ai', '/mcp/sw/next?q=1', 'cad'],
    ['bizomat.ai', '/.well-known/oauth-protected-resource/cad/mcp', 'cad'],
    ['bizomat.ai', '/tasks/some/path/?q=1&r=%2F', 'work'],
    ['bizomat.ai', '/tasks', 'work'],
    ['bizomat.ai', '/cad-automation/?q=1', 'web'],
    ['bizomat.ai', '/./cad/x', 'cad'],
    ['cados.kevos.com', '/some/path/?q=1&r=%2F', 'cad'],
    ['CADOS.KEVOS.COM:443', '/some/path/', 'cad'],
    ['work.kevos.com', '/some/path/?q=1&r=%2F', 'work'],
    ['bizomat.fly.dev', '/some/path/?q=1', 'web'],
    ['bizomat.fly.dev', '/cad/some/path/?q=1', 'cad'],
    ['bizomat.fly.dev', '/tasks/some/path/?q=1', 'work'],
  ];
  for (const [host, path, name] of cases) {
    const r = await request(p.port, { host, path });
    assert.equal(r.status, 200, `${host}${path}`);
    const echo = r.json();
    assert.equal(echo.name, name, `${host}${path}`);
    assert.equal(echo.url, path, 'the path is never rewritten');
    assert.equal(echo.headers.host, host, 'Host is never rewritten');
  }
});

test('bizomat.ai: an application path in another case answers 301 to the lowercase one, with HSTS', async () => {
  const r = await request(p.port, { host: 'bizomat.ai', path: '/CAD/docs?x=1' });
  assert.equal(r.status, 301);
  assert.equal(r.headers.location, '/cad/docs?x=1');
  assert.equal(r.headers['strict-transport-security'], 'max-age=31536000; includeSubDomains');
  const tasks = await request(p.port, { host: 'bizomat.ai', method: 'HEAD', path: '/Tasks' });
  assert.equal(tasks.status, 301);
  assert.equal(tasks.headers.location, '/tasks');
  const post = await request(p.port, { host: 'bizomat.ai', method: 'POST', path: '/CAD', body: 'x' });
  assert.equal(post.json().name, 'web', 'other methods are the website\'s');
});

test('POST bodies and methods pass through', async () => {
  const r = await request(p.port, { host: 'bizomat.ai', method: 'PATCH', path: '/tasks/api/items/1', headers: { 'Content-Type': 'application/json' }, body: '{"a":1}' });
  assert.equal(r.status, 200);
  assert.equal(r.json().name, 'work');
  assert.equal(r.json().method, 'PATCH');
  const up = await request(p.port, { host: 'bizomat.ai', method: 'PUT', path: '/cad/upload', body: Buffer.alloc(3 * 1024 * 1024, 7) });
  assert.equal(up.json().name, 'cad');
  assert.equal(up.json().bytes, 3 * 1024 * 1024);
  const old = await request(p.port, { host: 'cados.kevos.com', method: 'PUT', path: '/upload', body: Buffer.alloc(1024, 7) });
  assert.equal(old.json().bytes, 1024);
});

test('kevos.com and www hosts redirect with path and query; kevos.com API posts reach web', async () => {
  const r = await request(p.port, { host: 'kevos.com', path: '/tools/beam/?units=si&x=%20' });
  assert.equal(r.status, 301);
  assert.equal(r.headers.location, 'https://bizomat.ai/tools/beam/?units=si&x=%20');
  assert.equal(r.headers['strict-transport-security'], 'max-age=31536000; includeSubDomains');
  const head = await request(p.port, { host: 'www.kevos.com', method: 'HEAD', path: '/reados/' });
  assert.equal(head.status, 301);
  assert.equal(head.headers.location, 'https://bizomat.ai/reados/');
  assert.equal(head.body.length, 0);
  const insights = await request(p.port, { host: 'kevos.com', path: '/insights/old-post/' });
  assert.equal(insights.headers.location, 'https://bizomat.ai/insights/old-post/', 'sent as-is: the web app redirects it');
  const cadPage = await request(p.port, { host: 'kevos.com', path: '/cad/?ref=x' });
  assert.equal(cadPage.status, 301);
  assert.equal(cadPage.headers.location, 'https://bizomat.ai/systems/engineering/?ref=x', 'the old CAD page, not the app');
  const www = await request(p.port, { host: 'www.bizomat.ai', path: '/about/?a=b' });
  assert.equal(www.status, 301);
  assert.equal(www.headers.location, 'https://bizomat.ai/about/?a=b');
  const form = await request(p.port, { host: 'kevos.com', method: 'POST', path: '/api/contact', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(form.status, 200);
  assert.equal(form.json().name, 'web');
  assert.equal(form.json().headers.host, 'kevos.com');
  const other = await request(p.port, { host: 'kevos.com', method: 'POST', path: '/contact/', body: 'x' });
  assert.equal(other.status, 308);
  assert.equal(other.headers.location, 'https://bizomat.ai/contact/');
});

test('unknown hosts get 421, as text or as a page without script', async () => {
  const r = await request(p.port, { host: 'example.com', path: '/' });
  assert.equal(r.status, 421);
  assert.match(r.headers['content-type'], /text\/plain/);
  assert.match(r.text, /BIZOMAT/);
  const page = await request(p.port, { host: 'example.com', path: '/', headers: { Accept: 'text/html' } });
  assert.equal(page.status, 421);
  assert.match(page.headers['content-type'], /text\/html/);
  assert.match(page.text, /BIZOMAT/);
  assert.doesNotMatch(page.text, /<script|style=|<style/i);
  assert.match(page.headers['content-security-policy'], /default-src 'none'/);
  const ip = await request(p.port, { host: '10.1.2.3', path: '/' });
  assert.equal(ip.status, 421);
});

test('header hygiene (socket mode): spoofed client IP headers never reach a backend', async () => {
  const r = await request(p.port, {
    host: 'bizomat.ai',
    path: '/tasks/echo',
    headers: {
      'X-Forwarded-For': '6.6.6.6, 7.7.7.7',
      'X-Real-IP': '6.6.6.6',
      'CF-Connecting-IP': '6.6.6.6',
      'Fly-Client-IP': '6.6.6.6',
      'True-Client-IP': '6.6.6.6',
      Forwarded: 'for=6.6.6.6;proto=https',
      'X-Forwarded-Host': 'evil.example',
      'X-Forwarded-Proto': 'https',
      'X-Bizomat-Upstream': 'cad',
      'X-Bizomat-Admin': '1',
      'CF-IPCountry': 'XX',
    },
  });
  const h = r.json().headers;
  assert.equal(h['x-forwarded-for'], '127.0.0.1');
  assert.equal(h['x-real-ip'], '127.0.0.1');
  assert.equal(h['cf-connecting-ip'], '127.0.0.1');
  assert.equal(h['fly-client-ip'], '127.0.0.1');
  assert.equal(h['x-forwarded-proto'], 'http', 'socket mode: the proxy itself speaks plain http');
  assert.equal(h['x-forwarded-host'], 'bizomat.ai');
  for (const gone of ['true-client-ip', 'forwarded', 'x-bizomat-upstream', 'x-bizomat-admin', 'cf-ipcountry']) assert.equal(h[gone], undefined, gone);
  assert.match(h['x-bizomat-request-id'], /^[0-9a-f]{16}$/, 'the proxy sets its own request id');
});

test('header hygiene (fly mode): Fly-Client-IP from the edge is the client; other spoofs are ignored', async () => {
  const fly = await startProxy(urls(), { PROXY_CLIENT_IP_MODE: 'fly' });
  try {
    const r = await request(fly.port, {
      host: 'bizomat.ai',
      path: '/cad/echo',
      headers: { 'Fly-Client-IP': '203.0.113.9', 'X-Forwarded-For': '6.6.6.6', 'CF-Connecting-IP': '6.6.6.6', 'X-Forwarded-Proto': 'https', 'Fly-Request-Id': 'req-1' },
    });
    const h = r.json().headers;
    assert.equal(h['x-forwarded-for'], '203.0.113.9');
    assert.equal(h['cf-connecting-ip'], '203.0.113.9');
    assert.equal(h['fly-client-ip'], '203.0.113.9');
    assert.equal(h['x-real-ip'], '203.0.113.9');
    assert.equal(h['x-forwarded-proto'], 'https');
    assert.equal(h['fly-request-id'], 'req-1');
  } finally {
    await fly.close();
  }
});

test('header hygiene (fly mode): a peer on the private network cannot claim a client IP', async () => {
  // the test connects from 127.0.0.1; treat it like a 6PN neighbour
  const fly = await startProxy(urls(), { PROXY_CLIENT_IP_MODE: 'fly', PROXY_UNTRUSTED_PEERS: 'fdaa::/16,127.0.0.0/8' });
  try {
    const r = await request(fly.port, { host: 'cados.kevos.com', path: '/echo', headers: { 'Fly-Client-IP': '203.0.113.9', 'X-Forwarded-Proto': 'https', 'Fly-Request-Id': 'x' } });
    const h = r.json().headers;
    assert.equal(h['x-forwarded-for'], '127.0.0.1');
    assert.equal(h['cf-connecting-ip'], '127.0.0.1');
    assert.equal(h['fly-client-ip'], '127.0.0.1');
    assert.equal(h['x-forwarded-proto'], 'http');
    assert.equal(h['fly-request-id'], undefined);
  } finally {
    await fly.close();
  }
});

test('hop-by-hop headers are removed both ways; repeated Set-Cookie headers survive', async () => {
  const r = await request(p.port, {
    host: 'bizomat.ai',
    path: '/echo',
    headers: { Connection: 'keep-alive, X-Client-Hop', 'X-Client-Hop': 'secret', 'Keep-Alive': 'timeout=9', TE: 'trailers', 'Proxy-Authorization': 'Basic Zm9vOmJhcg==' },
  });
  const h = r.json().headers;
  for (const gone of ['x-client-hop', 'keep-alive', 'te', 'proxy-authorization']) assert.equal(h[gone], undefined, gone);
  const hop = await request(p.port, { host: 'bizomat.ai', path: '/hop' });
  assert.equal(hop.headers['x-up-hop'], undefined);
  assert.equal(hop.headers['keep-alive'], undefined);
  assert.deepEqual(hdrPairs(hop.rawHeaders, 'set-cookie'), ['a=1; Path=/', 'b=2; Path=/']);
});

test('HSTS on production hosts when absent; the backend value wins; noindex on the preview host', async () => {
  for (const [host, path] of [['bizomat.ai', '/cad/echo'], ['bizomat.ai', '/tasks/echo'], ['cados.kevos.com', '/echo'], ['work.kevos.com', '/echo']]) {
    const prod = await request(p.port, { host, path });
    assert.equal(prod.headers['strict-transport-security'], 'max-age=31536000; includeSubDomains', `${host}${path}`);
  }
  const own = await request(p.port, { host: 'bizomat.ai', path: '/hsts' });
  assert.deepEqual(hdrPairs(own.rawHeaders, 'strict-transport-security'), ['max-age=60']);
  const preview = await request(p.port, { host: 'bizomat.fly.dev', path: '/echo' });
  assert.equal(preview.headers['strict-transport-security'], undefined);
  assert.equal(preview.headers['x-robots-tag'], 'noindex');
});

test('a slow chunked response is streamed, not buffered', async () => {
  const t0 = performance.now();
  const times = [];
  await new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: p.port, path: '/stream', headers: { Host: 'bizomat.ai' }, agent: false }, (res) => {
      res.on('data', (c) => times.push([Math.round(performance.now() - t0), c.toString()]));
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.end();
  });
  assert.equal(times.map(([, s]) => s).join(''), 'one\ntwo\nthree\n');
  assert.ok(times[0][0] < 250, `first chunk after ${times[0][0]} ms`);
  assert.ok(times.at(-1)[0] >= 550, `last chunk after ${times.at(-1)[0]} ms`);
  assert.ok(times.length >= 3, 'arrived in pieces');
});

test('a request body is streamed: the backend sees the first bytes before the client finishes', async () => {
  let notify;
  const firstSeen = new Promise((r) => { notify = r; });
  const up = await startUpstream('cad', { onBodyChunk: (chunk, total) => { if (total > 0) notify(total); } });
  const px = await startProxy({ ...urls(), cad: up.url });
  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({ host: '127.0.0.1', port: px.port, method: 'POST', path: '/cad/upload', headers: { Host: 'bizomat.ai', 'Transfer-Encoding': 'chunked' }, agent: false }, (r) => {
        const chunks = [];
        r.on('data', (c) => chunks.push(c));
        r.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
      });
      req.on('error', reject);
      req.write(Buffer.alloc(64 * 1024, 1));
      // the rest is sent only once the backend has seen the start: a buffering proxy would hang here
      firstSeen.then(() => {
        for (let i = 0; i < 16; i += 1) req.write(Buffer.alloc(256 * 1024, 2));
        req.end();
      });
    });
    assert.equal(res.bytes, 64 * 1024 + 16 * 256 * 1024);
  } finally {
    await px.close();
    await up.close();
  }
});

test('WebSocket upgrade passes through both ways, with the same header hygiene', async () => {
  const { socket, status, head, rest } = await wsOpen(p.port, { host: 'bizomat.ai', path: '/tasks/ws', headers: { 'X-Forwarded-For': '6.6.6.6', 'CF-Connecting-IP': '6.6.6.6' } });
  try {
    assert.equal(status, 101);
    assert.match(head, /sec-websocket-accept:/i);
    assert.match(head, /x-upstream: work/i);
    socket.write(wsFrame('hello', true));
    const frame = await wsRead(socket, rest);
    assert.equal(frame.text, 'work:hello');
    socket.write(wsFrame('again', true));
    assert.equal((await wsRead(socket)).text, 'work:again');
    const seen = work.seen.filter((s) => s.upgrade).at(-1);
    assert.equal(seen.url, '/tasks/ws', 'the path is never rewritten');
    assert.equal(seen.headers['x-forwarded-for'], '127.0.0.1');
    assert.equal(seen.headers['cf-connecting-ip'], '127.0.0.1');
    assert.equal(seen.headers.host, 'bizomat.ai');
    assert.equal(seen.headers.upgrade, 'websocket');
  } finally {
    socket.destroy();
  }
  // the old address, at the root
  const old = await wsOpen(p.port, { host: 'work.kevos.com', path: '/ws' });
  try {
    assert.equal(old.status, 101);
    old.socket.write(wsFrame('hi', true));
    assert.equal((await wsRead(old.socket, old.rest)).text, 'work:hi');
  } finally {
    old.socket.destroy();
  }
});

test('a refused WebSocket upgrade passes the backend answer on (no 101)', async () => {
  const { socket, status, head } = await wsOpen(p.port, { host: 'bizomat.ai', path: '/tasks/ws-deny/1' });
  socket.destroy();
  assert.equal(status, 401);
  assert.match(head, /connection: close/i);
});

test('WebSocket to unknown hosts and moved hosts is answered by the proxy', async () => {
  const unknown = await wsOpen(p.port, { host: 'example.com', path: '/ws' });
  unknown.socket.destroy();
  assert.equal(unknown.status, 421);
  const moved = await wsOpen(p.port, { host: 'kevos.com', path: '/ws' });
  moved.socket.destroy();
  assert.equal(moved.status, 301);
  assert.match(moved.head, /location: https:\/\/bizomat\.ai\/ws/i);
  const gone = await wsOpen(p.port, { host: 'work.bizomat.ai', path: '/ws' });
  gone.socket.destroy();
  assert.equal(gone.status, 421, 'no subdomains');
});

test('preview cookie: /__preview/<backend> routes this browser there without rewriting Host', async () => {
  const set = await request(p.port, { host: 'bizomat.fly.dev', path: '/__preview/cad?next=/login', headers: { 'X-Forwarded-Proto': 'https' } });
  assert.equal(set.status, 303);
  assert.equal(set.headers.location, '/login');
  const cookie = set.headers['set-cookie'][0];
  assert.match(cookie, /^bizomat_preview=cad;/);
  assert.match(cookie, /HttpOnly/);
  assert.doesNotMatch(cookie, /Domain=/i, 'host-only');
  const routed = await request(p.port, { host: 'bizomat.fly.dev', path: '/login', headers: { Cookie: 'session=abc; bizomat_preview=cad' } });
  const echo = routed.json();
  assert.equal(echo.name, 'cad');
  assert.equal(echo.headers.host, 'bizomat.fly.dev');
  assert.equal(echo.headers.cookie, 'session=abc', 'the preview cookie stays with the proxy');
  const ws = await wsOpen(p.port, { host: 'bizomat.fly.dev', path: '/ws', headers: { Cookie: 'bizomat_preview=work' } });
  ws.socket.write(wsFrame('ping', true));
  assert.equal((await wsRead(ws.socket, ws.rest)).text, 'work:ping');
  ws.socket.destroy();
  const clear = await request(p.port, { host: 'bizomat.fly.dev', path: '/__preview/clear' });
  assert.equal(clear.status, 303);
  assert.match(clear.headers['set-cookie'][0], /Max-Age=0/);
  // without the cookie the preview host routes by path, as bizomat.ai does
  for (const [path, name] of [['/cad/login', 'cad'], ['/tasks/login', 'work'], ['/sign-in/', 'web']]) {
    assert.equal((await request(p.port, { host: 'bizomat.fly.dev', path })).json().name, name, path);
  }
  const signIn = await request(p.port, { host: 'bizomat.fly.dev', path: '/login' });
  assert.equal(signIn.status, 301);
  assert.equal(signIn.headers.location, '/sign-in/');
  // on a production host the cookie means nothing
  const prod = await request(p.port, { host: 'bizomat.ai', path: '/x', headers: { Cookie: 'bizomat_preview=cad' } });
  assert.equal(prod.json().name, 'web');
});

test('preview routing off: the switch is 404 and the app address sends people to bizomat.ai', async () => {
  const off = await startProxy(urls());
  try {
    assert.equal((await request(off.port, { host: 'bizomat.fly.dev', path: '/__preview/cad' })).status, 404);
    const r = await request(off.port, { host: 'bizomat.fly.dev', path: '/tasks/login?x=1', headers: { Cookie: 'bizomat_preview=cad' } });
    assert.equal(r.status, 301);
    assert.equal(r.headers.location, 'https://bizomat.ai/tasks/login?x=1');
    assert.equal((await request(off.port, { host: 'bizomat.fly.dev', path: '/__proxy/health' })).status, 200);
  } finally {
    await off.close();
  }
});

test('a dead backend gives a 502 page; logs say why without the address', async () => {
  const port = await deadPort();
  const px = await startProxy({ ...urls(), cad: `http://127.0.0.1:${port}` });
  try {
    const r = await request(px.port, { host: 'bizomat.ai', path: '/cad/mcp', headers: { Accept: 'text/html' } });
    assert.equal(r.status, 502);
    assert.match(r.text, /BIZOMAT/);
    assert.doesNotMatch(r.text, /<script/i);
    assert.equal(r.headers['retry-after'], '10');
    assert.equal(r.headers['strict-transport-security'], 'max-age=31536000; includeSubDomains');
    assert.equal((await request(px.port, { host: 'bizomat.ai', path: '/tools/' })).status, 200, 'the website does not depend on cad');
    const text = await request(px.port, { host: 'bizomat.ai', path: '/v2/device/next' });
    assert.equal(text.status, 502);
    assert.match(text.headers['content-type'], /text\/plain/);
    await sleep(20);
    const line = px.logs.find((l) => l.status === 502);
    assert.equal(line.upstream, 'cad');
    assert.equal(line.err, 'ECONNREFUSED');
    assert.doesNotMatch(JSON.stringify(px.logs), /127\.0\.0\.1/);
  } finally {
    await px.close();
  }
});

test('a backend that stays silent past the idle timeout gives 504', async () => {
  const px = await startProxy(urls(), { PROXY_IDLE_TIMEOUT_MS: '300' });
  try {
    const r = await request(px.port, { host: 'bizomat.ai', path: '/tasks/slow?ms=3000' });
    assert.equal(r.status, 504);
  } finally {
    await px.close();
  }
});

test('one retry with a fresh lookup when the first address refuses (a replaced Machine)', async () => {
  let lookups = 0;
  const port = web.port;
  const resolve = async () => (lookups++ === 0 ? [{ address: '127.0.0.2', family: 4 }] : [{ address: '127.0.0.1', family: 4 }]);
  const px = await startProxy({ ...urls(), web: `http://web.process.test.internal:${port}` }, {}, { resolve });
  try {
    const r = await request(px.port, { host: 'bizomat.ai', method: 'POST', path: '/upload', body: 'abc' });
    assert.equal(r.status, 200);
    assert.equal(r.json().bytes, 3, 'the body was not lost by the failed first try');
    assert.equal(lookups, 2);
  } finally {
    await px.close();
  }
});

test('/__proxy/health and /__proxy/ready', async () => {
  const h = await request(p.port, { host: 'bizomat.fly.dev', path: '/__proxy/health' });
  assert.equal(h.status, 200);
  assert.deepEqual(h.json(), { ok: true, service: 'bizomat-proxy', version: 'test123' });
  const viaIp = await request(p.port, { host: '127.0.0.1:8080', path: '/__proxy/health' });
  assert.equal(viaIp.status, 200);
  const ready = await request(p.port, { host: 'bizomat.fly.dev', path: '/__proxy/ready' });
  assert.equal(ready.status, 200);
  const body = ready.json();
  assert.equal(body.ok, true);
  assert.deepEqual(Object.keys(body.upstreams).sort(), ['cad', 'web', 'work']);
  assert.doesNotMatch(ready.text, /127\.0\.0\.1/, 'no addresses in the answer');
  // on a product host the path belongs to the backend
  const onCad = await request(p.port, { host: 'cados.kevos.com', path: '/__proxy/health' });
  assert.equal(onCad.json().name, 'cad');
  assert.equal((await request(p.port, { host: 'bizomat.ai', path: '/__proxy/health' })).json().name, 'web');

  const port = await deadPort();
  const px = await startProxy({ ...urls(), work: `http://127.0.0.1:${port}` });
  try {
    const notReady = await request(px.port, { host: 'localhost', path: '/__proxy/ready' });
    assert.equal(notReady.status, 503);
    const b = notReady.json();
    assert.equal(b.ok, false);
    assert.equal(b.upstreams.work.ok, false);
    assert.equal(b.upstreams.web.ok, true);
  } finally {
    await px.close();
  }
});

test('request log: one JSON line per request, no query, no addresses, no credentials', async () => {
  const before = p.logs.length;
  await request(p.port, { host: 'bizomat.ai', path: '/cad/mcp/0123456789abcdef0123456789abcdef?token=secret', headers: { Cookie: 'opensketch_user=supersecret', Authorization: 'Bearer abc.def' } });
  await request(p.port, { host: 'cados.kevos.com', path: '/mcp/0123456789abcdef0123456789abcdef', headers: { Cookie: 'opensketch_session=supersecret' } });
  await sleep(20);
  const lines = p.logs.slice(before);
  assert.equal(lines.length, 2);
  const line = lines[0];
  assert.deepEqual(Object.keys(line).sort(), ['host', 'id', 'method', 'ms', 'path', 'status', 't', 'upstream']);
  assert.equal(line.host, 'bizomat.ai');
  assert.equal(line.method, 'GET');
  assert.equal(line.path, '/cad/mcp/:redacted');
  assert.equal(line.status, 200);
  assert.equal(line.upstream, 'cad');
  assert.equal(lines[1].host, 'cados.kevos.com');
  assert.equal(lines[1].path, '/mcp/:redacted');
  assert.equal(typeof line.ms, 'number');
  const all = JSON.stringify(p.logs);
  for (const bad of ['secret', 'supersecret', 'abc.def', '127.0.0.1', '0123456789abcdef0123456789abcdef']) assert.ok(!all.includes(bad), bad);
});

test('absolute-form request targets are refused', async () => {
  const reply = await new Promise((resolve) => {
    const s = net.connect(p.port, '127.0.0.1');
    let buf = '';
    s.on('data', (c) => { buf += c.toString(); });
    s.on('end', () => resolve(buf));
    s.on('close', () => resolve(buf));
    s.write('GET http://bizomat.ai/ HTTP/1.1\r\nHost: bizomat.ai\r\n\r\n');
  });
  assert.match(reply, /^HTTP\/1\.1 400/);
});

test('an idle keep-alive connection is not cut by the header timeout', async () => {
  const px = await startProxy(urls(), { PROXY_HEADERS_TIMEOUT_MS: '400', PROXY_KEEPALIVE_TIMEOUT_MS: '5000' });
  const agent = new http.Agent({ keepAlive: true, maxSockets: 1 });
  const get = () => new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: px.port, path: '/echo', headers: { Host: 'bizomat.ai' }, agent }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, reused: req.reusedSocket }));
    });
    req.on('error', reject);
    req.end();
  });
  try {
    assert.equal((await get()).status, 200);
    await sleep(1200);
    const second = await get();
    assert.equal(second.status, 200);
    assert.equal(second.reused, true);
  } finally {
    agent.destroy();
    await px.close();
  }
});

test('graceful stop: an open request finishes, new connections are refused', async () => {
  const px = await startProxy(urls(), { PROXY_SHUTDOWN_GRACE_MS: '3000' });
  const pending = request(px.port, { host: 'bizomat.ai', path: '/slow?ms=400' });
  await sleep(100);
  const closed = px.close();
  const r = await pending;
  assert.equal(r.status, 200);
  await closed;
  await assert.rejects(() => request(px.port, { host: 'bizomat.ai', path: '/' }), (err) => err.code === 'ECONNREFUSED');
});

test('graceful stop cuts what is still open after the grace time (long polls, WebSockets)', async () => {
  const px = await startProxy(urls(), { PROXY_SHUTDOWN_GRACE_MS: '300' });
  const ws = await wsOpen(px.port, { host: 'bizomat.ai', path: '/tasks/ws' });
  assert.equal(ws.status, 101);
  const pending = request(px.port, { host: 'bizomat.ai', path: '/cad/slow?ms=10000' }).catch((err) => err);
  await sleep(50);
  const t0 = performance.now();
  await px.close();
  assert.ok(performance.now() - t0 < 2000, 'did not wait for the long poll');
  const result = await pending;
  assert.ok(result instanceof Error || result.status >= 500, 'the long poll was cut');
  await new Promise((r) => (ws.socket.destroyed ? r() : ws.socket.once('close', r)));
});

test('TASKS_REDIRECT_ORIGIN: /tasks/... answers an uncached redirect to Project Management, a WebSocket too; nothing reaches work', async () => {
  const t = await startProxy(urls(), { TASKS_REDIRECT_ORIGIN: 'https://work.kevos.com' });
  try {
    const before = work.seen.length;
    const page = await request(t.port, { host: 'bizomat.ai', path: '/tasks/w/7?view=kanban' });
    assert.equal(page.status, 302);
    assert.equal(page.headers.location, 'https://work.kevos.com/w/7?view=kanban');
    assert.equal(page.headers['cache-control'], 'no-store');
    const post = await request(t.port, { host: 'bizomat.ai', method: 'POST', path: '/tasks/api/auth/login', body: '{}' });
    assert.equal(post.status, 307);
    const ws = await wsOpen(t.port, { host: 'bizomat.ai', path: '/tasks/api/live/boards/b1' });
    assert.match(ws.head, /^HTTP\/1\.1 302 Found\r\n/);
    assert.match(ws.head, /\r\nlocation: https:\/\/work\.kevos\.com\/api\/live\/boards\/b1\r\n/i);
    assert.match(ws.head, /\r\ncache-control: no-store\r\n/i);
    ws.socket.destroy();
    assert.equal(work.seen.length, before, 'the work backend is never asked');
    assert.equal((await request(t.port, { host: 'bizomat.ai', path: '/' })).status, 200); // the website still answers
  } finally {
    await t.close();
  }
});

test('TASKS_REDIRECT_ORIGIN must be an https origin', () => {
  for (const bad of ['http://work.kevos.com', 'https://work.kevos.com/x', 'https://u:p@work.kevos.com', 'work.kevos.com']) {
    assert.throws(() => loadConfig({ TASKS_REDIRECT_ORIGIN: bad }), /TASKS_REDIRECT_ORIGIN/, bad);
  }
  assert.equal(loadConfig({ TASKS_REDIRECT_ORIGIN: 'https://work.kevos.com/' }).tasksOrigin, 'https://work.kevos.com');
  assert.equal(loadConfig({}).tasksOrigin, '');
});
