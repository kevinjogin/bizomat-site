import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOUDFLARE_RANGES, SIX_PN, cidrList, clientInfo, clientResponseHeaders, hasRequestBody, inList, normalizeIp, readCookie,
  redactPath, stripCookie, upstreamRequestHeaders,
} from '../headers.mjs';

const fly = { mode: 'fly', untrusted: cidrList(SIX_PN), cloudflare: false, cloudflareRanges: cidrList(CLOUDFLARE_RANGES) };
const flyCf = { ...fly, cloudflare: true };
const socketMode = { mode: 'socket', untrusted: cidrList(SIX_PN), cloudflare: false, cloudflareRanges: cidrList([]) };

const pairs = (raw) => {
  const out = [];
  for (let i = 0; i < raw.length; i += 2) out.push([raw[i].toLowerCase(), raw[i + 1]]);
  return out;
};
const all = (raw, name) => pairs(raw).filter(([n]) => n === name).map(([, v]) => v);

test('normalizeIp', () => {
  assert.equal(normalizeIp('::ffff:203.0.113.5'), '203.0.113.5');
  assert.equal(normalizeIp('[FDAA::3]'), 'fdaa::3');
  assert.equal(normalizeIp('fe80::1%eth0'), 'fe80::1');
  assert.equal(normalizeIp('203.0.113.5'), '203.0.113.5');
  assert.equal(normalizeIp('203.0.113.5, 10.0.0.1'), '');
  assert.equal(normalizeIp('not-an-ip'), '');
  assert.equal(normalizeIp(undefined), '');
});

test('cidrList and inList', () => {
  const l = cidrList(['fdaa::/16', '10.0.0.0/8', '192.0.2.7']);
  assert.ok(inList(l, 'fdaa:0:1:a7b::2'));
  assert.ok(inList(l, '10.200.1.1'));
  assert.ok(inList(l, '192.0.2.7'));
  assert.ok(!inList(l, '192.0.2.8'));
  assert.ok(!inList(l, '2001:db8::1'));
  assert.throws(() => cidrList(['10.0.0.0/33']));
  assert.throws(() => cidrList(['nope/8']));
  assert.ok(inList(cidrList(CLOUDFLARE_RANGES), '104.16.0.1'));
  assert.ok(inList(cidrList(CLOUDFLARE_RANGES), '2606:4700::1111'));
});

test('socket mode: nothing the client sends is trusted', () => {
  const c = clientInfo({
    peer: '::ffff:192.0.2.10',
    headers: { 'fly-client-ip': '1.2.3.4', 'x-forwarded-for': '5.6.7.8', 'cf-connecting-ip': '9.9.9.9', 'x-forwarded-proto': 'https' },
    trust: socketMode,
  });
  assert.deepEqual(c, { ip: '192.0.2.10', proto: 'http', edge: false, cdn: '' });
});

test('socket mode with PROXY_ASSUME_HTTPS (the local stack): https for the backends, still nothing trusted', () => {
  const local = { ...socketMode, assumeHttps: true };
  const c = clientInfo({ peer: '::ffff:192.0.2.10', headers: { 'fly-client-ip': '1.2.3.4', 'x-forwarded-proto': 'http' }, trust: local });
  assert.deepEqual(c, { ip: '192.0.2.10', proto: 'https', edge: false, cdn: '' });
  // a 6PN peer in fly mode is not the edge, and assumeHttps never applies there
  const flyLocal = { ...fly, assumeHttps: true };
  assert.equal(clientInfo({ peer: 'fdaa:0:3b99:a7b:ef:8cc4:dc49:2', headers: {}, trust: flyLocal }).proto, 'http');
});

test('fly mode: the edge sets Fly-Client-IP and X-Forwarded-Proto; spoofed copies are ignored', () => {
  const c = clientInfo({
    peer: '172.19.4.1',
    headers: { 'fly-client-ip': '203.0.113.9', 'x-forwarded-for': '6.6.6.6, 203.0.113.9', 'cf-connecting-ip': '6.6.6.6', 'x-forwarded-proto': 'https' },
    trust: fly,
  });
  assert.deepEqual(c, { ip: '203.0.113.9', proto: 'https', edge: true, cdn: '' });
  assert.equal(clientInfo({ peer: '172.19.4.1', headers: { 'fly-client-ip': '203.0.113.9' }, trust: fly }).proto, 'https', 'https by default');
  assert.equal(clientInfo({ peer: '172.19.4.1', headers: { 'x-forwarded-proto': 'http' }, trust: fly }).proto, 'http');
  // no Fly-Client-IP (a health check from the platform): the socket address
  assert.equal(clientInfo({ peer: '172.19.4.1', headers: {}, trust: fly }).ip, '172.19.4.1');
  // garbage in Fly-Client-IP: the socket address
  assert.equal(clientInfo({ peer: '172.19.4.1', headers: { 'fly-client-ip': '1.2.3.4, 5.6.7.8' }, trust: fly }).ip, '172.19.4.1');
});

test('fly mode: a peer on the private network (6PN) is not the edge', () => {
  const c = clientInfo({
    peer: 'fdaa:0:3b99:a7b:ef:8cc4:dc49:2',
    headers: { 'fly-client-ip': '203.0.113.9', 'x-forwarded-proto': 'https', 'cf-connecting-ip': '203.0.113.9' },
    trust: fly,
  });
  assert.deepEqual(c, { ip: 'fdaa:0:3b99:a7b:ef:8cc4:dc49:2', proto: 'http', edge: false, cdn: '' });
});

test('Cloudflare is trusted only when enabled and only from its ranges', () => {
  const headers = { 'fly-client-ip': '172.64.1.1', 'cf-connecting-ip': '198.51.100.20' };
  assert.equal(clientInfo({ peer: '172.19.4.1', headers, trust: fly }).ip, '172.64.1.1', 'off by default');
  assert.deepEqual(clientInfo({ peer: '172.19.4.1', headers, trust: flyCf }), { ip: '198.51.100.20', proto: 'https', edge: true, cdn: 'cloudflare' });
  const notCf = { 'fly-client-ip': '198.51.100.99', 'cf-connecting-ip': '1.1.1.1' };
  assert.equal(clientInfo({ peer: '172.19.4.1', headers: notCf, trust: flyCf }).ip, '198.51.100.99', 'spoofed from outside Cloudflare');
});

test('upstream request headers: one client IP everywhere, spoofed and hop-by-hop headers removed', () => {
  const raw = [
    'Host', 'bizomat.ai',
    'Accept', 'text/html',
    'X-Forwarded-For', '6.6.6.6',
    'x-forwarded-for', '7.7.7.7',
    'X-Forwarded-Host', 'evil.com',
    'X-Forwarded-Proto', 'http',
    'X-Forwarded-Port', '1',
    'Forwarded', 'for=6.6.6.6',
    'X-Real-IP', '6.6.6.6',
    'True-Client-IP', '6.6.6.6',
    'CF-Connecting-IP', '6.6.6.6',
    'CF-IPCountry', 'XX',
    'Fly-Client-IP', '6.6.6.6',
    'Fly-Request-Id', 'abc',
    'X-Bizomat-Route', 'cad',
    'x-bizomat-anything', '1',
    'Connection', 'keep-alive, X-Private-Hop',
    'X-Private-Hop', 'secret',
    'Keep-Alive', 'timeout=5',
    'TE', 'trailers',
    'Proxy-Authorization', 'Basic xyz',
    'Expect', '100-continue',
    'Cookie', 'a=1; bizomat_preview=cad',
    'Cookie', 'b=2',
    'Set-Cookie-Ish', 'kept',
  ];
  const client = { ip: '203.0.113.9', proto: 'https', edge: true, cdn: '' };
  const out = upstreamRequestHeaders(raw, { client, host: 'bizomat.ai', requestId: 'r1', upgrade: '', dropCookie: 'bizomat_preview' });
  assert.deepEqual(all(out, 'x-forwarded-for'), ['203.0.113.9']);
  assert.deepEqual(all(out, 'x-real-ip'), ['203.0.113.9']);
  assert.deepEqual(all(out, 'cf-connecting-ip'), ['203.0.113.9']);
  assert.deepEqual(all(out, 'fly-client-ip'), ['203.0.113.9']);
  assert.deepEqual(all(out, 'x-forwarded-proto'), ['https']);
  assert.deepEqual(all(out, 'x-forwarded-host'), ['bizomat.ai']);
  assert.deepEqual(all(out, 'host'), ['bizomat.ai']);
  assert.deepEqual(all(out, 'fly-request-id'), ['abc'], 'from the edge');
  assert.deepEqual(all(out, 'x-bizomat-request-id'), ['r1']);
  assert.deepEqual(all(out, 'cookie'), ['a=1; b=2'], 'preview cookie dropped, cookie headers joined');
  assert.deepEqual(all(out, 'set-cookie-ish'), ['kept']);
  for (const gone of ['x-forwarded-port', 'forwarded', 'true-client-ip', 'cf-ipcountry', 'x-bizomat-route', 'x-bizomat-anything',
    'connection', 'x-private-hop', 'keep-alive', 'te', 'proxy-authorization', 'expect', 'upgrade']) {
    assert.deepEqual(all(out, gone), [], gone);
  }
});

test('upstream request headers: edge headers are dropped when the request did not come through the edge', () => {
  const out = upstreamRequestHeaders(['Host', 'x', 'Fly-Request-Id', 'abc', 'Fly-Region', 'syd'], {
    client: { ip: '192.0.2.1', proto: 'http', edge: false, cdn: '' }, host: 'x', requestId: '', upgrade: '', dropCookie: '',
  });
  assert.deepEqual(all(out, 'fly-request-id'), []);
  assert.deepEqual(all(out, 'fly-region'), []);
  assert.deepEqual(all(out, 'fly-client-ip'), ['192.0.2.1']);
});

test('upstream request headers: Cloudflare headers pass only when Cloudflare is the verified CDN', () => {
  const raw = ['Host', 'x', 'CF-Ray', 'r', 'CF-IPCountry', 'AU', 'CF-Worker', 'w'];
  const viaCf = upstreamRequestHeaders(raw, { client: { ip: '198.51.100.20', proto: 'https', edge: true, cdn: 'cloudflare' }, host: 'x', upgrade: '' });
  assert.deepEqual(all(viaCf, 'cf-ray'), ['r']);
  assert.deepEqual(all(viaCf, 'cf-ipcountry'), ['AU']);
  assert.deepEqual(all(viaCf, 'cf-worker'), []);
  const direct = upstreamRequestHeaders(raw, { client: { ip: '198.51.100.20', proto: 'https', edge: true, cdn: '' }, host: 'x', upgrade: '' });
  assert.deepEqual(all(direct, 'cf-ray'), []);
});

test('upgrade requests keep Connection: Upgrade and the Upgrade token', () => {
  const raw = ['Host', 'work.kevos.com', 'Connection', 'keep-alive, Upgrade', 'Upgrade', 'websocket', 'Sec-WebSocket-Key', 'k', 'Sec-WebSocket-Version', '13'];
  const out = upstreamRequestHeaders(raw, { client: { ip: '192.0.2.1', proto: 'https', edge: true, cdn: '' }, host: 'work.kevos.com', upgrade: 'websocket' });
  assert.deepEqual(all(out, 'connection'), ['Upgrade']);
  assert.deepEqual(all(out, 'upgrade'), ['websocket']);
  assert.deepEqual(all(out, 'sec-websocket-key'), ['k']);
});

test('client response headers: hop-by-hop removed, Set-Cookie repeats kept, HSTS and noindex added', () => {
  const raw = ['Content-Type', 'text/html', 'Connection', 'close, X-Up-Hop', 'X-Up-Hop', '1', 'Keep-Alive', 'timeout=5',
    'Transfer-Encoding', 'chunked', 'Set-Cookie', 'a=1', 'Set-Cookie', 'b=2'];
  const prod = clientResponseHeaders(raw, { production: true });
  assert.deepEqual(all(prod, 'set-cookie'), ['a=1', 'b=2']);
  assert.deepEqual(all(prod, 'strict-transport-security'), ['max-age=31536000; includeSubDomains']);
  for (const gone of ['connection', 'x-up-hop', 'keep-alive', 'transfer-encoding']) assert.deepEqual(all(prod, gone), [], gone);
  const own = clientResponseHeaders(['Strict-Transport-Security', 'max-age=60'], { production: true });
  assert.deepEqual(all(own, 'strict-transport-security'), ['max-age=60'], 'the backend wins');
  const preview = clientResponseHeaders(['Content-Type', 'text/html'], { production: false, preview: true });
  assert.deepEqual(all(preview, 'strict-transport-security'), []);
  assert.deepEqual(all(preview, 'x-robots-tag'), ['noindex']);
});

test('client response headers: application pages are kept out of search engines, the website is not', () => {
  const app = clientResponseHeaders(['Content-Type', 'text/html'], { production: true, app: true });
  assert.deepEqual(all(app, 'x-robots-tag'), ['noindex, nofollow']);
  const own = clientResponseHeaders(['Content-Type', 'text/html', 'X-Robots-Tag', 'noindex'], { production: true, app: true });
  assert.deepEqual(all(own, 'x-robots-tag'), ['noindex'], 'the app\'s own header wins');
  const site = clientResponseHeaders(['Content-Type', 'text/html'], { production: true });
  assert.deepEqual(all(site, 'x-robots-tag'), [], 'website pages stay indexable');
});

test('hasRequestBody', () => {
  assert.equal(hasRequestBody({}), false);
  assert.equal(hasRequestBody({ 'content-length': '0' }), false);
  assert.equal(hasRequestBody({ 'content-length': '12' }), true);
  assert.equal(hasRequestBody({ 'transfer-encoding': 'chunked' }), true);
});

test('cookies', () => {
  assert.equal(readCookie('a=1; bizomat_preview=cad; b=2', 'bizomat_preview'), 'cad');
  assert.equal(readCookie('xbizomat_preview=cad', 'bizomat_preview'), '');
  assert.equal(readCookie(undefined, 'bizomat_preview'), '');
  assert.equal(stripCookie('a=1; bizomat_preview=cad; b=2', 'bizomat_preview'), 'a=1; b=2');
  assert.equal(stripCookie('bizomat_preview=cad', 'bizomat_preview'), '');
});

test('redactPath: no query, no credentials, website paths kept', () => {
  assert.equal(redactPath('/tools/beam/?secret=1'), '/tools/beam/');
  assert.equal(redactPath('/mcp/0123456789abcdef0123456789abcdef'), '/mcp/:redacted');
  assert.equal(redactPath('/mcp/0123456789abcdef0123456789abcdef/'), '/mcp/:redacted/');
  assert.equal(redactPath('/solidworks/mcp/abc'), '/solidworks/mcp/:redacted');
  assert.equal(redactPath('/mcp'), '/mcp');
  assert.equal(redactPath('/mcp/sw/next'), '/mcp/sw/next');
  assert.equal(redactPath('/mcp/uploads/9f86d081884c7d659a2feaa0c55ad015'), '/mcp/uploads/:redacted');
  assert.equal(redactPath('/join/Zm9vYmFyYmF6cXV4'), '/join/:redacted');
  assert.equal(redactPath('/invite/x'), '/invite/:redacted');
  // the same addresses under the applications' paths on bizomat.ai
  assert.equal(redactPath('/cad/mcp/k3y'), '/cad/mcp/:redacted');
  assert.equal(redactPath('/cad/solidworks/mcp/k3y'), '/cad/solidworks/mcp/:redacted');
  assert.equal(redactPath('/cad/mcp/sw/next'), '/cad/mcp/sw/next');
  assert.equal(redactPath('/cad/join/x'), '/cad/join/:redacted');
  assert.equal(redactPath('/tasks/invite/x'), '/tasks/invite/:redacted');
  assert.equal(redactPath('/tasks/api/live/boards/12'), '/tasks/api/live/boards/12');
  assert.equal(redactPath('/cadence/mcp/x'), '/cadence/mcp/x', 'not an application path');
  assert.equal(redactPath('/api/files/550e8400-e29b-41d4-a716-446655440000'), '/api/files/:redacted');
  assert.equal(redactPath('/x/aB3_dE5-fG7hJ9kL1mN'), '/x/:redacted');
  assert.equal(redactPath('/reados/books/business-volume-02/bubbles-currencies-and-capital-flows/'), '/reados/books/business-volume-02/bubbles-currencies-and-capital-flows/');
  assert.equal(redactPath('/api/live/boards/12'), '/api/live/boards/12');
  assert.ok(redactPath(`/${'a'.repeat(300)}`).length <= 203);
});
