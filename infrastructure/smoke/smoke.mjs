#!/usr/bin/env node
// BIZOMAT smoke test: checks every host through the edge proxy. No dependencies (Node 22).
//
//   node infrastructure/smoke/smoke.mjs [base-url] [options]
//
//   base-url        where the proxy answers (default http://127.0.0.1:8080, the compose stack)
//   --mode M        hosts    every request goes to base-url with the product's Host header (compose, a direct run)
//                   preview  for https://<app>.fly.dev before DNS moves: web through the fly.dev host, cad and
//                            work through the preview cookie (/__preview/cad, /__preview/work); host-specific
//                            checks (redirects, HSTS) are tried with a Host header and only warn if the edge
//                            does not pass it through
//                   live     after the DNS cutover: each product host by its real name; base-url only for the
//                            proxy's own endpoints
//                   default: preview for *.fly.dev, else hosts
//   --skip a,b      skip groups (proxy, web, work, cad)
//   --stub a,b      these backends are stand-ins (infrastructure/local/stub-upstream.mjs): check that requests
//                   reach them through the proxy with clean headers instead of checking the real app
//   --wait N        wait up to N seconds for /__proxy/health (and /__proxy/ready) first
//   --json          print the report as JSON as well
// Exit 0 when nothing failed (warnings: pages not built yet, edge-dependent checks in preview mode).

import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';

const PAGES = ['/', '/cad/', '/work/', '/resources/', '/tools/', '/reados/', '/engine-room/', '/privacy/', '/terms/', '/disclaimer/'];
// Pages that moved: the old address answers 301 to the new one (About and Proof of Work became the Engine Room).
const MOVED = [['/about/', '/engine-room/'], ['/proof-of-work/', '/engine-room/']];
const HSTS = /max-age=\d{7,}/;

function parseArgs(argv) {
  const opts = { base: 'http://127.0.0.1:8080', mode: '', skip: new Set(), stub: new Set(), wait: 0, json: false };
  const rest = [...argv];
  while (rest.length) {
    const a = rest.shift();
    if (a === '--mode') opts.mode = rest.shift();
    else if (a === '--skip') for (const g of (rest.shift() || '').split(',')) opts.skip.add(g.trim());
    else if (a === '--stub') for (const g of (rest.shift() || '').split(',')) opts.stub.add(g.trim());
    else if (a === '--wait') opts.wait = Number(rest.shift() || 0);
    else if (a === '--json') opts.json = true;
    else if (a === '-h' || a === '--help') {
      process.stdout.write(`${readHelp()}\n`);
      process.exit(0);
    } else if (!a.startsWith('--')) opts.base = a;
    else throw new Error(`unknown option ${a}`);
  }
  const base = new URL(opts.base);
  if (!opts.mode) opts.mode = /\.fly\.dev$/.test(base.hostname) ? 'preview' : 'hosts';
  if (!['hosts', 'preview', 'live'].includes(opts.mode)) throw new Error(`--mode must be hosts, preview or live`);
  opts.baseUrl = base;
  return opts;
}

function readHelp() {
  return 'usage: node infrastructure/smoke/smoke.mjs [base-url] [--mode hosts|preview|live] [--skip groups] [--stub groups] [--wait seconds] [--json]';
}

const opts = parseArgs(process.argv.slice(2));
const base = opts.baseUrl;
const baseTls = base.protocol === 'https:';
const basePort = Number(base.port || (baseTls ? 443 : 80));

// ------------------------------------------------------------------------------------------- HTTP plumbing

/** Where a request for `host` goes in this mode: {connectHost, port, tls, servername, hostHeader}. */
function target(host) {
  if (opts.mode === 'live' && host !== base.hostname) return { connectHost: host, port: 443, tls: true, servername: host, hostHeader: host };
  return { connectHost: base.hostname, port: basePort, tls: baseTls, servername: base.hostname, hostHeader: host };
}

function send(host, { method = 'GET', path = '/', headers = {}, body } = {}) {
  const t = target(host);
  return new Promise((resolve) => {
    const lib = t.tls ? https : http;
    const req = lib.request({
      host: t.connectHost.replace(/^\[|\]$/g, ''),
      port: t.port,
      servername: t.tls && !net.isIP(t.servername) ? t.servername : undefined,
      method,
      path,
      headers: { Host: t.hostHeader, 'User-Agent': 'bizomat-smoke/1', ...headers },
      agent: false,
      setHost: false,
      timeout: 20_000,
    });
    req.on('timeout', () => req.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })));
    req.on('response', (res) => {
      const chunks = [];
      let size = 0;
      res.on('data', (c) => {
        size += c.length;
        if (size <= 2_000_000) chunks.push(c);
      });
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve({ status: res.statusCode, headers: res.headers, text, json: () => JSON.parse(text) });
      });
      res.on('error', (err) => resolve({ status: 0, error: err.code || err.message, headers: {}, text: '' }));
    });
    req.on('error', (err) => resolve({ status: 0, error: err.code || err.message, headers: {}, text: '' }));
    if (body !== undefined) req.end(body);
    else req.end();
  });
}

/** A WebSocket handshake: resolves the status code of the answer (101 when accepted). */
function wsHandshake(host, path, headers = {}) {
  const t = target(host);
  return new Promise((resolve) => {
    const opts2 = { host: t.connectHost.replace(/^\[|\]$/g, ''), port: t.port };
    const socket = t.tls ? tls.connect({ ...opts2, servername: net.isIP(t.servername) ? undefined : t.servername }) : net.connect(opts2);
    const done = (status, head = '') => {
      socket.destroy();
      resolve({ status, head });
    };
    socket.setTimeout(20_000, () => done(0));
    socket.on('error', () => done(0));
    socket.once(t.tls ? 'secureConnect' : 'connect', () => {
      const lines = [`GET ${path} HTTP/1.1`, `Host: ${t.hostHeader}`, 'Upgrade: websocket', 'Connection: Upgrade',
        'Sec-WebSocket-Version: 13', `Sec-WebSocket-Key: ${Buffer.from('bizomat-smoke-16').toString('base64')}`];
      for (const [k, v] of Object.entries(headers)) lines.push(`${k}: ${v}`);
      socket.write(`${lines.join('\r\n')}\r\n\r\n`);
    });
    let buf = '';
    socket.on('data', (c) => {
      buf += c.toString('latin1');
      const end = buf.indexOf('\r\n\r\n');
      if (end >= 0) done(Number(buf.split(' ')[1]) || 0, buf.slice(0, end));
    });
  });
}

// ------------------------------------------------------------------------------------------- reporting

const results = [];
function record(level, group, name, detail = '') {
  results.push({ level, group, name, detail });
  const tag = { pass: 'PASS', warn: 'WARN', fail: 'FAIL', skip: 'SKIP' }[level];
  process.stdout.write(`${tag}  ${group.padEnd(5)}  ${name}${detail ? `  (${detail})` : ''}\n`);
}
const pass = (g, n, d) => record('pass', g, n, d);
const fail = (g, n, d) => record('fail', g, n, d);
const warn = (g, n, d) => record('warn', g, n, d);
const skip = (g, n, d) => record('skip', g, n, d);
const describe = (r) => (r.status ? `HTTP ${r.status}` : `no answer: ${r.error}`);

async function check(group, name, fn, { soft = false } = {}) {
  if (opts.skip.has(group)) return;
  try {
    const out = await fn();
    if (out === true) pass(group, name);
    else if (out && out.skip) skip(group, name, out.skip);
    else if (out && out.warn) warn(group, name, out.warn);
    else if (soft) warn(group, name, `${out && out.fail ? out.fail : 'failed'}; the edge may not pass this Host through before DNS`);
    else fail(group, name, out && out.fail ? out.fail : 'failed');
  } catch (err) {
    if (soft) warn(group, name, String(err.message || err));
    else fail(group, name, String(err.message || err));
  }
}

// ------------------------------------------------------------------------------------------- checks

const previewCookie = {};
async function previewSwitch(backend) {
  if (opts.mode !== 'preview') return '';
  if (previewCookie[backend] !== undefined) return previewCookie[backend];
  const r = await send(base.hostname, { path: `/__preview/${backend}` });
  const set = [].concat(r.headers['set-cookie'] || []).find((c) => c.startsWith('bizomat_preview='));
  previewCookie[backend] = r.status === 303 && set ? set.split(';')[0] : '';
  return previewCookie[backend];
}

/** Request to a backend by its product host (preview mode: the fly.dev host plus the preview cookie). */
async function toBackend(backend, productHost, req = {}) {
  if (opts.mode !== 'preview' || backend === 'web') {
    const host = opts.mode === 'preview' ? base.hostname : productHost;
    return send(host, req);
  }
  const cookie = await previewSwitch(backend);
  if (!cookie) return { status: 0, error: 'preview switch did not answer with a cookie (BIZOMAT_PREVIEW_ROUTING=1?)', headers: {}, text: '' };
  return send(base.hostname, { ...req, headers: { ...(req.headers || {}), Cookie: cookie } });
}

async function waitForProxy() {
  if (!opts.wait) return;
  const until = Date.now() + opts.wait * 1000;
  for (;;) {
    const h = await send(base.hostname, { path: '/__proxy/health' });
    const r = h.status === 200 ? await send(base.hostname, { path: '/__proxy/ready' }) : h;
    if (r.status === 200) return;
    if (Date.now() > until) return;
    await new Promise((res) => setTimeout(res, 3000));
  }
}

async function proxyChecks() {
  await check('proxy', '/__proxy/health answers', async () => {
    const r = await send(base.hostname, { path: '/__proxy/health' });
    return (r.status === 200 && r.json().ok === true) || { fail: describe(r) };
  });
  await check('proxy', '/__proxy/ready: every backend answers its health check', async () => {
    const r = await send(base.hostname, { path: '/__proxy/ready' });
    if (r.status === 200) return true;
    let detail = describe(r);
    try {
      const down = Object.entries(r.json().upstreams || {}).filter(([, v]) => !v.ok).map(([k, v]) => `${k}: ${v.status || v.error}`);
      if (down.length) detail += `; down: ${down.join(', ')}`;
    } catch { /* not JSON */ }
    return { fail: detail };
  });
  const hostDependent = opts.mode === 'preview';
  if (opts.mode !== 'live') {
    await check('proxy', 'an unknown host gets 421', async () => {
      const r = await send('unknown.invalid', { path: '/' });
      return r.status === 421 || { fail: describe(r) };
    }, { soft: hostDependent });
  }
  await check('proxy', 'www.bizomat.ai redirects to the apex, path and query kept', async () => {
    const r = await send('www.bizomat.ai', { path: '/about/?smoke=1' });
    return (r.status === 301 && r.headers.location === 'https://bizomat.ai/about/?smoke=1') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  }, { soft: hostDependent });
  const moves = [
    ['kevos.com', '/tools/?smoke=1&x=%2F', 'GET'],
    ['kevos.com', '/reados/', 'GET'],
    ['kevos.com', '/insights/some-old-post/', 'GET'],
    ['kevos.com', '/', 'HEAD'],
    ['www.kevos.com', '/about/', 'GET'],
  ];
  for (const [host, path, method] of moves) {
    await check('proxy', `${method} ${host}${path} -> 301 https://bizomat.ai${path}`, async () => {
      const r = await send(host, { path, method });
      if (r.status !== 301) return { fail: describe(r) };
      if (r.headers.location !== `https://bizomat.ai${path}`) return { fail: `Location ${r.headers.location}` };
      if (opts.mode !== 'preview' && !HSTS.test(r.headers['strict-transport-security'] || '')) return { fail: 'no HSTS on the redirect' };
      return true;
    }, { soft: hostDependent });
  }
}

async function webChecks() {
  const host = 'bizomat.ai';
  if (opts.stub.has('web')) {
    await stubChecks('web', host);
    await check('web', 'POST to kevos.com outside /api is 308 to bizomat.ai', async () => {
      const r = await send('kevos.com', { method: 'POST', path: '/__stub/echo', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      return (r.status === 308 && r.headers.location === 'https://bizomat.ai/__stub/echo') || { fail: describe(r) };
    }, { soft: opts.mode === 'preview' });
    await check('web', 'POST kevos.com/api/... is proxied, not redirected', async () => {
      const r = await send('kevos.com', { method: 'POST', path: '/api/contact', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      return (r.headers['x-bizomat-stub'] === 'web') || { fail: `${describe(r)} did not reach web` };
    }, { soft: opts.mode === 'preview' });
    return;
  }
  for (const [from, to] of MOVED) {
    await check('web', `${from} moved to ${to}`, async () => {
      const r = await toBackend('web', host, { path: from, headers: { Accept: 'text/html' } });
      const location = r.headers.location || '';
      return (r.status === 301 && (location === to || location.endsWith(`://${host}${to}`) || new URL(location, 'https://x').pathname === to)) || { fail: `${describe(r)} ${location}` };
    });
  }
  for (const page of PAGES) {
    await check('web', `page ${page}`, async () => {
      const r = await toBackend('web', host, { path: page, headers: { Accept: 'text/html' } });
      if (r.status === 200) return /<html/i.test(r.text) || { fail: 'not an HTML page' };
      if (r.status === 404) return { warn: '404: not built yet' };
      return { fail: describe(r) };
    });
  }
  await check('web', 'security headers on /', async () => {
    const r = await toBackend('web', host, { path: '/', headers: { Accept: 'text/html' } });
    if (r.status !== 200) return { fail: describe(r) };
    const h = r.headers;
    const missing = [];
    if (opts.mode !== 'preview' && !HSTS.test(h['strict-transport-security'] || '')) missing.push('Strict-Transport-Security');
    if ((h['x-content-type-options'] || '').toLowerCase() !== 'nosniff') missing.push('X-Content-Type-Options');
    if (!h['content-security-policy']) missing.push('Content-Security-Policy');
    if (!/deny|sameorigin/i.test(h['x-frame-options'] || '') && !/frame-ancestors/.test(h['content-security-policy'] || '')) missing.push('X-Frame-Options or frame-ancestors');
    if (!h['referrer-policy']) missing.push('Referrer-Policy');
    return missing.length === 0 || { fail: `missing ${missing.join(', ')}` };
  });
  await check('web', '/healthz', async () => {
    const r = await toBackend('web', host, { path: '/healthz' });
    return r.status === 200 || { fail: describe(r) };
  });
  await check('web', 'POST kevos.com/api/contact is proxied to web (old cached forms)', async () => {
    const r = await send('kevos.com', { method: 'POST', path: '/api/contact', headers: { 'Content-Type': 'application/json', Origin: 'https://kevos.com' }, body: '{}' });
    if (!r.status) return { fail: describe(r) };
    if ([301, 308, 421, 502, 503, 504].includes(r.status)) return { fail: `${describe(r)}: not answered by web` };
    return true;
  }, { soft: opts.mode === 'preview' });
}

async function cadChecks() {
  const hosts = ['cad.bizomat.ai', 'cados.kevos.com'];
  if (opts.stub.has('cad')) {
    for (const h of hosts) await stubChecks('cad', h);
    return;
  }
  for (const host of hosts) {
    await check('cad', `${host} /healthz`, async () => {
      const r = await toBackend('cad', host, { path: '/healthz' });
      return (r.status === 200 && typeof r.json() === 'object') || { fail: describe(r) };
    });
    await check('cad', `${host} /mcp without a token: 401 with WWW-Authenticate`, async () => {
      const r = await toBackend('cad', host, {
        method: 'POST',
        path: '/mcp',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'bizomat-smoke', version: '1' } } }),
      });
      if (r.status !== 401) return { fail: describe(r) };
      return /resource_metadata=/i.test(r.headers['www-authenticate'] || '') || { fail: 'no resource_metadata in WWW-Authenticate' };
    });
    await check('cad', `${host} /.well-known/oauth-protected-resource/mcp`, async () => {
      const r = await toBackend('cad', host, { path: '/.well-known/oauth-protected-resource/mcp' });
      if (r.status !== 200) return { fail: describe(r) };
      const j = r.json();
      return (typeof j.resource === 'string' && j.resource.endsWith('/mcp') && Array.isArray(j.authorization_servers)) || { fail: 'unexpected metadata' };
    });
    await check('cad', `${host} sign-in page`, async () => {
      const r = await toBackend('cad', host, { path: '/login', headers: { Accept: 'text/html' } });
      return (r.status === 200 && /text\/html/.test(r.headers['content-type'] || '')) || { fail: describe(r) };
    });
  }
}

async function workChecks() {
  const hosts = ['work.bizomat.ai', 'work.kevos.com'];
  if (opts.stub.has('work')) {
    for (const h of hosts) await stubChecks('work', h);
    await check('work', 'WebSocket upgrade reaches work through the proxy', async () => {
      const cookie = opts.mode === 'preview' ? await previewSwitch('work') : '';
      const host = opts.mode === 'preview' ? base.hostname : hosts[0];
      const r = await wsHandshake(host, '/__stub/ws', cookie ? { Cookie: cookie } : {});
      return r.status === 101 || { fail: `HTTP ${r.status}` };
    });
    return;
  }
  for (const host of hosts) {
    await check('work', `${host} /api/health`, async () => {
      const r = await toBackend('work', host, { path: '/api/health' });
      return r.status === 200 || { fail: describe(r) };
    });
    await check('work', `${host} /login`, async () => {
      const r = await toBackend('work', host, { path: '/login', headers: { Accept: 'text/html' } });
      return (r.status === 200 && /text\/html/.test(r.headers['content-type'] || '')) || { fail: describe(r) };
    });
    await check('work', `${host} private API without a session: 401`, async () => {
      const r = await toBackend('work', host, { path: '/api/workspaces', headers: { Accept: 'application/json' } });
      return r.status === 401 || { fail: describe(r) };
    });
  }
  await check('work', 'WebSocket upgrade without a session is refused', async () => {
    const cookie = opts.mode === 'preview' ? await previewSwitch('work') : '';
    const host = opts.mode === 'preview' ? base.hostname : hosts[0];
    const origin = opts.mode === 'preview' ? `https://${base.hostname}` : `https://${hosts[0]}`;
    const r = await wsHandshake(host, '/api/live/boards/smoke-test', { Origin: origin, ...(cookie ? { Cookie: cookie } : {}) });
    if (r.status === 101) return { fail: 'accepted without a session' };
    return [401, 403, 404, 426].includes(r.status) || { fail: `HTTP ${r.status}` };
  });
}

/** Stand-in backend: the request arrives, with the Host kept and one client IP in every header. */
async function stubChecks(backend, host) {
  await check(backend, `${host} reaches the ${backend} stand-in with clean forwarding headers`, async () => {
    const r = await toBackend(backend, host, {
      path: '/__stub/echo?x=1',
      headers: { 'X-Forwarded-For': '6.6.6.6', 'CF-Connecting-IP': '6.6.6.6', 'Fly-Client-IP': '6.6.6.6', 'X-Real-IP': '6.6.6.6', 'X-Bizomat-Smoke': '1' },
    });
    if (r.status !== 200) return { fail: describe(r) };
    const e = r.json();
    if (e.stub !== backend) return { fail: `reached ${e.stub}` };
    const h = e.headers;
    const ip = h['x-forwarded-for'];
    const problems = [];
    if (!ip || ip.includes(',') || ip === '6.6.6.6') problems.push(`X-Forwarded-For ${ip}`);
    for (const k of ['cf-connecting-ip', 'fly-client-ip', 'x-real-ip']) if (h[k] !== ip) problems.push(`${k} ${h[k]}`);
    if (h['x-bizomat-smoke'] !== undefined) problems.push('X-Bizomat-* passed through');
    const wantHost = opts.mode === 'preview' ? base.hostname : host;
    if (h.host !== wantHost) problems.push(`Host ${h.host}`);
    if (e.url !== '/__stub/echo?x=1') problems.push(`path ${e.url}`);
    return problems.length === 0 || { fail: problems.join('; ') };
  });
}

// ------------------------------------------------------------------------------------------- run

await waitForProxy();
process.stdout.write(`BIZOMAT smoke test: ${base.origin} (mode ${opts.mode}${opts.stub.size ? `, stand-ins: ${[...opts.stub].join(', ')}` : ''})\n`);
await proxyChecks();
if (!opts.skip.has('web')) await webChecks();
if (!opts.skip.has('cad')) await cadChecks();
if (!opts.skip.has('work')) await workChecks();

const count = (l) => results.filter((r) => r.level === l).length;
process.stdout.write(`\n${count('pass')} passed, ${count('warn')} warnings, ${count('fail')} failed, ${count('skip')} skipped\n`);
if (opts.json) process.stdout.write(`${JSON.stringify({ base: base.origin, mode: opts.mode, results }, null, 2)}\n`);
process.exit(count('fail') ? 1 : 0);
