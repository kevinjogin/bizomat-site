#!/usr/bin/env node
// BIZOMAT smoke test: checks every host and application path through the edge proxy. No dependencies (Node 22).
//
// Everything lives under bizomat.ai: the website at the root, CAD Automation under /cad, Project Management under
// /tasks (infrastructure/proxy/routes.mjs). The old addresses cados.kevos.com and work.kevos.com serve their app at
// the root.
//
//   node infrastructure/smoke/smoke.mjs [base-url] [options]
//
//   base-url        where the proxy answers (default http://127.0.0.1:8080, the compose stack)
//   --mode M        hosts    every request goes to base-url with the product's Host header (compose, a direct run)
//                   preview  for https://<app>.fly.dev before DNS moves: the fly.dev host routes by path as
//                            bizomat.ai does, so the website, /cad/ and /tasks/ are checked there; the old addresses
//                            through the preview cookie (/__preview/cad, /__preview/work: the app at the root);
//                            host-specific checks (redirects, HSTS) are tried with a Host header and only warn if the
//                            edge does not pass it through
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

const PAGES = ['/', '/systems/', '/systems/erp/', '/systems/erp/guide/', '/systems/crm/', '/systems/crm/guide/', '/systems/finance/', '/systems/finance/guide/', '/systems/projects/', '/systems/projects/guide/', '/systems/engineering/', '/systems/engineering/guide/', '/systems/manufacturing/', '/resources/', '/tools/', '/reados/', '/engine-room/', '/privacy/', '/terms/', '/disclaimer/'];
// Pages that moved: the old address answers 301 to the new one (About and Proof of Work became the Engine Room; the
// ERP design preview moved to /system-preview/; the product pages became the Systems pages).
const MOVED = [['/about/', '/engine-room/'], ['/proof-of-work/', '/engine-room/'], ['/erp-design-preview/', '/system-preview/'],
  // The product pages became the Systems pages (owner, 14 Nov 2026).
  ['/products/', '/systems/'], ['/work/', '/systems/projects/'], ['/cad-automation/', '/systems/engineering/'], ['/crm-platform/', '/systems/crm/'], ['/crm-platform/guide/', '/systems/crm/guide/'], ['/finance-platform/', '/systems/finance/'], ['/finance-platform/guide/', '/systems/finance/guide/']];
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

/** The host that stands for bizomat.ai in this mode: the fly.dev host before DNS moves (it routes by path too). */
const platformHost = () => (opts.mode === 'preview' ? base.hostname : 'bizomat.ai');

/** A request to bizomat.ai (preview mode: the fly.dev host): the website, /cad/... and /tasks/... by path. */
function onPlatform(req = {}) {
  return send(platformHost(), req);
}

/** A request to an old address (cados.kevos.com, work.kevos.com), whose app answers at the root (preview mode: the
 * fly.dev host with the preview cookie for that backend). */
async function onOldHost(backend, host, req = {}) {
  if (opts.mode !== 'preview') return send(host, req);
  const cookie = await previewSwitch(backend);
  if (!cookie) return { status: 0, error: 'preview switch did not answer with a cookie (BIZOMAT_PREVIEW_ROUTING=1?)', headers: {}, text: '' };
  return send(base.hostname, { ...req, headers: { ...(req.headers || {}), Cookie: cookie } });
}

const json = (r) => {
  try {
    return r.json();
  } catch {
    return null;
  }
};

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
    await check('proxy', 'no subdomains: cad.bizomat.ai and work.bizomat.ai get 421', async () => {
      for (const host of ['cad.bizomat.ai', 'work.bizomat.ai']) {
        const r = await send(host, { path: '/' });
        if (r.status !== 421) return { fail: `${host}: ${describe(r)}` };
      }
      return true;
    }, { soft: hostDependent });
  }
  await check('proxy', 'www.bizomat.ai redirects to the apex, path and query kept', async () => {
    for (const path of ['/engine-room/?smoke=1', '/cad/docs?smoke=1']) {
      const r = await send('www.bizomat.ai', { path });
      if (r.status !== 301 || r.headers.location !== `https://bizomat.ai${path}`) return { fail: `${path}: ${describe(r)} ${r.headers.location || ''}` };
    }
    return true;
  }, { soft: hostDependent });
  for (const [from, to] of [['/CAD/docs?smoke=1', '/cad/docs?smoke=1'], ['/Tasks', '/tasks']]) {
    await check('proxy', `${from} on bizomat.ai answers 301 to ${to}`, async () => {
      const r = await onPlatform({ path: from });
      return (r.status === 301 && r.headers.location === to) || { fail: `${describe(r)} ${r.headers.location || ''}` };
    });
  }
  const moves = [
    ['kevos.com', '/tools/?smoke=1&x=%2F', 'GET', '/tools/?smoke=1&x=%2F'],
    ['kevos.com', '/reados/', 'GET', '/reados/'],
    ['kevos.com', '/insights/some-old-post/', 'GET', '/insights/some-old-post/'],
    ['kevos.com', '/', 'HEAD', '/'],
    ['www.kevos.com', '/engine-room/', 'GET', '/engine-room/'],
    // kevos.com/cad/ was the CAD Automation page; on bizomat.ai /cad is the application itself
    ['kevos.com', '/cad/?smoke=1', 'GET', '/systems/engineering/?smoke=1'],
  ];
  for (const [host, path, method, to] of moves) {
    await check('proxy', `${method} ${host}${path} -> 301 https://bizomat.ai${to}`, async () => {
      const r = await send(host, { path, method });
      if (r.status !== 301) return { fail: describe(r) };
      if (r.headers.location !== `https://bizomat.ai${to}`) return { fail: `Location ${r.headers.location}` };
      if (opts.mode !== 'preview' && !HSTS.test(r.headers['strict-transport-security'] || '')) return { fail: 'no HSTS on the redirect' };
      return true;
    }, { soft: hostDependent });
  }
}

async function webChecks() {
  if (opts.stub.has('web')) {
    await stubChecks('web', 'bizomat.ai', '/__stub/echo');
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
      const r = await onPlatform({ path: from, headers: { Accept: 'text/html' } });
      const location = r.headers.location || '';
      return (r.status === 301 && (location === to || location.endsWith(`://bizomat.ai${to}`) || new URL(location, 'https://x').pathname === to)) || { fail: `${describe(r)} ${location}` };
    });
  }
  for (const page of PAGES) {
    await check('web', `page ${page}`, async () => {
      const r = await onPlatform({ path: page, headers: { Accept: 'text/html' } });
      if (r.status === 200) return /<html/i.test(r.text) || { fail: 'not an HTML page' };
      if (r.status === 404) return { warn: '404: not built yet' };
      return { fail: describe(r) };
    });
  }
  // The BIZOMAT System preview: static files the image adds to the website (infrastructure/fly/Dockerfile, stage
  // system-preview). In the image it must be there; against a site deployed before it, a 404 only warns.
  await check('web', 'BIZOMAT ERP design preview /system-preview/ (noindex, its script loads)', async () => {
    const r = await onPlatform({ path: '/system-preview/', headers: { Accept: 'text/html' } });
    if (r.status === 404) return opts.mode === 'hosts' ? { fail: '404: not in the image' } : { warn: '404: not deployed yet' };
    if (r.status !== 200) return { fail: describe(r) };
    if (!/<title>BIZOMAT ERP preview<\/title>/.test(r.text)) return { fail: 'not the ERP design preview page' };
    if (!/noindex/.test(r.headers['x-robots-tag'] || '')) return { fail: 'no X-Robots-Tag: noindex' };
    const script = (r.text.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"/) || [])[1];
    if (!script) return { fail: 'no module script' };
    const js = await onPlatform({ path: `/system-preview/${script}` });
    return js.status === 200 || { fail: `${script}: ${describe(js)}` };
  });
  await check('web', 'security headers on /', async () => {
    const r = await onPlatform({ path: '/', headers: { Accept: 'text/html' } });
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
  await check('web', 'paths that only look like the applications\' are the website\'s', async () => {
    for (const path of ['/cadence', '/tasksfoo', '/.well-known/security.txt']) {
      const r = await onPlatform({ path, headers: { Accept: 'text/html' } });
      // the website answers (a page or its 404); CAD Automation would redirect into /cad, Project Management into /tasks
      if (r.status === 0 || r.status >= 500 || /^\/(cad|tasks)(\/|$)/.test(r.headers.location || '')) return { fail: `${path}: ${describe(r)} ${r.headers.location || ''}` };
    }
    return true;
  });
  await check('web', 'POST kevos.com/api/contact is proxied to web (old cached forms)', async () => {
    const r = await send('kevos.com', { method: 'POST', path: '/api/contact', headers: { 'Content-Type': 'application/json', Origin: 'https://kevos.com' }, body: '{}' });
    if (!r.status) return { fail: describe(r) };
    if ([301, 308, 421, 502, 503, 504].includes(r.status)) return { fail: `${describe(r)}: not answered by web` };
    return true;
  }, { soft: opts.mode === 'preview' });
}

const MCP_INIT = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'bizomat-smoke', version: '1' } } });
const MCP_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };

async function cadChecks() {
  if (opts.stub.has('cad')) {
    await stubChecks('cad', 'bizomat.ai', '/cad/__stub/echo');
    await stubChecks('cad', 'cados.kevos.com', '/__stub/echo');
    return;
  }
  // bizomat.ai/cad (preview mode: the fly.dev host, by path)
  await check('cad', 'bizomat.ai/cad/healthz', async () => {
    const r = await onPlatform({ path: '/cad/healthz' });
    return (r.status === 200 && json(r)?.ok === true) || { fail: describe(r) };
  });
  await check('cad', 'bizomat.ai/cad/ is the app, with its page policy and links under /cad', async () => {
    const r = await onPlatform({ path: '/cad/', headers: { Accept: 'text/html' } });
    if (r.status !== 200 || !/text\/html/.test(r.headers['content-type'] || '')) return { fail: describe(r) };
    if (!/script-src 'self'/.test(r.headers['content-security-policy'] || '')) return { fail: 'no page policy (Content-Security-Policy)' };
    if (!r.text.includes('href="/cad/ui/cados.css"')) return { fail: 'its links do not name /cad' };
    return true;
  });
  await check('cad', 'bizomat.ai/cad/login: the sign-in page', async () => {
    const r = await onPlatform({ path: '/cad/login', headers: { Accept: 'text/html' } });
    return (r.status === 200 && /text\/html/.test(r.headers['content-type'] || '')) || { fail: describe(r) };
  });
  await check('cad', 'bizomat.ai/cad/mcp without a token: 401 naming the metadata at the root of the host (RFC 9728)', async () => {
    const r = await onPlatform({ method: 'POST', path: '/cad/mcp', headers: MCP_HEADERS, body: MCP_INIT });
    if (r.status !== 401) return { fail: describe(r) };
    return /resource_metadata="https:\/\/[^/"]+\/\.well-known\/oauth-protected-resource\/cad\/mcp"/.test(r.headers['www-authenticate'] || '') || { fail: `WWW-Authenticate ${r.headers['www-authenticate']}` };
  });
  await check('cad', 'bizomat.ai/.well-known/oauth-protected-resource/cad/mcp and the issuer\'s metadata', async () => {
    const pr = await onPlatform({ path: '/.well-known/oauth-protected-resource/cad/mcp' });
    const j = json(pr);
    if (pr.status !== 200 || !j || !String(j.resource).endsWith('/cad/mcp') || !Array.isArray(j.authorization_servers)) return { fail: `${describe(pr)} ${j && j.resource}` };
    const md = await onPlatform({ path: '/.well-known/oauth-authorization-server/cad' });
    const m = json(md);
    return (md.status === 200 && m && String(m.issuer).endsWith('/cad') && String(m.token_endpoint).endsWith('/cad/oauth/token')) || { fail: `${describe(md)} ${m && m.issuer}` };
  });
  await check('cad', 'bizomat.ai root program paths reach CAD Automation (/healthz, /mcp)', async () => {
    const h = await onPlatform({ path: '/healthz' });
    if (h.status !== 200 || json(h)?.ok !== true || json(h)?.service === 'web') return { fail: `/healthz: ${describe(h)}` };
    const m = await onPlatform({ method: 'POST', path: '/mcp', headers: MCP_HEADERS, body: MCP_INIT });
    return m.status === 401 || { fail: `/mcp: ${describe(m)}` };
  });
  // cados.kevos.com, the old address: programs at its root with its own address, pages moved to bizomat.ai/cad
  const old = 'cados.kevos.com';
  const own = opts.mode !== 'preview'; // through the preview cookie the app sees the fly.dev host, not cados.kevos.com
  await check('cad', `${old} /healthz`, async () => {
    const r = await onOldHost('cad', old, { path: '/healthz' });
    return (r.status === 200 && json(r)?.ok === true) || { fail: describe(r) };
  });
  await check('cad', `${old} /mcp without a token: 401${own ? ' naming its own metadata' : ''}`, async () => {
    const r = await onOldHost('cad', old, { method: 'POST', path: '/mcp', headers: MCP_HEADERS, body: MCP_INIT });
    if (r.status !== 401) return { fail: describe(r) };
    const want = own ? `resource_metadata="https://${old}/.well-known/oauth-protected-resource/mcp"` : 'resource_metadata=';
    return (r.headers['www-authenticate'] || '').includes(want) || { fail: `WWW-Authenticate ${r.headers['www-authenticate']}` };
  });
  await check('cad', `${old} /.well-known/oauth-protected-resource/mcp`, async () => {
    const r = await onOldHost('cad', old, { path: '/.well-known/oauth-protected-resource/mcp' });
    const j = json(r);
    if (r.status !== 200 || !j || !Array.isArray(j.authorization_servers)) return { fail: describe(r) };
    return (own ? j.resource === `https://${old}/mcp` : String(j.resource).endsWith('/mcp')) || { fail: `resource ${j.resource}` };
  });
  await check('cad', own ? `${old} pages answer 301 to https://bizomat.ai/cad` : `${old} sign-in page (preview: the app at the root)`, async () => {
    const r = await onOldHost('cad', old, { path: '/login', headers: { Accept: 'text/html' } });
    if (own) return (r.status === 301 && r.headers.location === 'https://bizomat.ai/cad/login') || { fail: `${describe(r)} ${r.headers.location || ''}` };
    return (r.status === 200 && /text\/html/.test(r.headers['content-type'] || '')) || { fail: describe(r) };
  });
}

async function workChecks() {
  const old = 'work.kevos.com';
  if (opts.stub.has('work')) {
    await stubChecks('work', 'bizomat.ai', '/tasks/__stub/echo');
    await stubChecks('work', old, '/__stub/echo');
    await stubChecks('work', 'bizomat.ai', '/crm/__stub/echo');
    await stubChecks('work', 'bizomat.ai', '/finance/__stub/echo');
    await stubChecks('work', 'bizomat.ai', '/company/__stub/echo');
    await stubChecks('work', 'bizomat.ai', '/system/__stub/echo');
    await stubChecks('work', 'bizomat.ai', '/erp/__stub/echo');
    await check('work', 'WebSocket upgrade under bizomat.ai/tasks reaches work through the proxy', async () => {
      const r = await wsHandshake(platformHost(), '/tasks/__stub/ws');
      return r.status === 101 || { fail: `HTTP ${r.status}` };
    });
    return;
  }
  // bizomat.ai/tasks (preview mode: the fly.dev host, by path)
  await check('work', 'bizomat.ai/tasks/api/health', async () => {
    const r = await onPlatform({ path: '/tasks/api/health' });
    return r.status === 200 || { fail: describe(r) };
  });
  // One system (14 Nov 2026): every tool's pages open inside BIZOMAT ERP, at /erp/<tool>; the API stays.
  await check('work', 'bizomat.ai/tasks/login (the website\'s Sign in) opens the ERP\'s sign-in page', async () => {
    const r = await onPlatform({ path: '/tasks/login', headers: { Accept: 'text/html' } });
    return (r.status === 302 && r.headers.location === '/erp/login') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/erp/tasks/login: Project Management inside the ERP, its files under /erp/tasks/', async () => {
    const r = await onPlatform({ path: '/erp/tasks/login', headers: { Accept: 'text/html' } });
    if (r.status !== 200 || !/text\/html/.test(r.headers['content-type'] || '')) return { fail: describe(r) };
    return r.text.includes('<base href="/erp/tasks/">') || { fail: 'no <base href="/erp/tasks/"> in the page' };
  });
  await check('work', 'bizomat.ai/tasks pages open inside the ERP (302 to /erp/tasks/...)', async () => {
    const r = await onPlatform({ path: '/tasks/w/smoke/home', headers: { Accept: 'text/html' } });
    return (r.status === 302 && r.headers.location === '/erp/tasks/w/smoke/home') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/erp/tasks: a page without a session goes through /tasks (a session there carries over)', async () => {
    const r = await onPlatform({ path: '/erp/tasks/w/smoke/home', headers: { Accept: 'text/html' } });
    return (r.status === 302 && (r.headers.location || '').startsWith('/tasks/api/app-carry?to=')) || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/tasks private API without a session: 401', async () => {
    const r = await onPlatform({ path: '/tasks/api/workspaces', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/erp maintenance API without a session: 401', async () => {
    const r = await onPlatform({ path: '/erp/api/maintenance/companies', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/tasks WebSocket upgrade without a session is refused', async () => {
    const r = await wsHandshake(platformHost(), '/tasks/api/live/boards/smoke-test', { Origin: `https://${platformHost()}` });
    if (r.status === 101) return { fail: 'accepted without a session' };
    return [401, 403, 404, 426].includes(r.status) || { fail: `HTTP ${r.status}` };
  });
  // bizomat.ai/crm: BIZOMAT CRM, served by the same app (work) under its own path
  await check('work', 'bizomat.ai/crm/api/health (the same app)', async () => {
    const r = await onPlatform({ path: '/crm/api/health' });
    return r.status === 200 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/crm/login opens inside the ERP (302 to /erp/crm/login)', async () => {
    const r = await onPlatform({ path: '/crm/login', headers: { Accept: 'text/html' } });
    return (r.status === 302 && r.headers.location === '/erp/crm/login') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/erp/crm/login: the CRM inside the ERP, its files under /erp/crm/', async () => {
    const r = await onPlatform({ path: '/erp/crm/login', headers: { Accept: 'text/html' } });
    if (r.status !== 200) return { fail: describe(r) };
    return (r.text.includes('<base href="/erp/crm/">') && r.text.includes('<title>BIZOMAT ERP</title>')) || { fail: 'no <base href="/erp/crm/"> or ERP title in the page' };
  });
  await check('work', 'bizomat.ai/erp/crm: a page without a session goes through /tasks (a session there carries over)', async () => {
    const r = await onPlatform({ path: '/erp/crm/o/smoke/overview', headers: { Accept: 'text/html' } });
    return (r.status === 302 && (r.headers.location || '').startsWith('/tasks/api/app-carry?to=')) || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/crm private API without a session: 401', async () => {
    const r = await onPlatform({ path: '/crm/api/crm/orgs', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  // bizomat.ai/finance: BIZOMAT Finance, served by the same app (work) under its own path
  await check('work', 'bizomat.ai/finance/api/health (the same app)', async () => {
    const r = await onPlatform({ path: '/finance/api/health' });
    return r.status === 200 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/finance/login opens inside the ERP (302 to /erp/finance/login)', async () => {
    const r = await onPlatform({ path: '/finance/login', headers: { Accept: 'text/html' } });
    return (r.status === 302 && r.headers.location === '/erp/finance/login') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/erp/finance/login: Finance inside the ERP, its files under /erp/finance/', async () => {
    const r = await onPlatform({ path: '/erp/finance/login', headers: { Accept: 'text/html' } });
    if (r.status !== 200) return { fail: describe(r) };
    return (r.text.includes('<base href="/erp/finance/">') && r.text.includes('<title>BIZOMAT ERP</title>')) || { fail: 'no <base href="/erp/finance/"> or ERP title in the page' };
  });
  await check('work', 'bizomat.ai/erp/finance: a page without a session goes through /tasks (a session there carries over)', async () => {
    const r = await onPlatform({ path: '/erp/finance/o/smoke/dashboard', headers: { Accept: 'text/html' } });
    return (r.status === 302 && (r.headers.location || '').startsWith('/tasks/api/app-carry?to=')) || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/finance private API without a session: 401', async () => {
    const r = await onPlatform({ path: '/finance/api/fin/orgs', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  // bizomat.ai/company: BIZOMAT company accounts and their control centre, served by the same app (work)
  await check('work', 'bizomat.ai/company/api/health (the same app)', async () => {
    const r = await onPlatform({ path: '/company/api/health' });
    return r.status === 200 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/company/login opens inside the ERP (302 to /erp/company/login)', async () => {
    const r = await onPlatform({ path: '/company/login', headers: { Accept: 'text/html' } });
    return (r.status === 302 && r.headers.location === '/erp/company/login') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/erp/company/login: the company area inside the ERP, its files under /erp/company/', async () => {
    const r = await onPlatform({ path: '/erp/company/login', headers: { Accept: 'text/html' } });
    if (r.status !== 200) return { fail: describe(r) };
    return (r.text.includes('<base href="/erp/company/">') && r.text.includes('<title>BIZOMAT ERP</title>')) || { fail: 'no <base href="/erp/company/"> or ERP title in the page' };
  });
  await check('work', 'bizomat.ai/erp/company: a page without a session goes through /tasks (a session there carries over)', async () => {
    const r = await onPlatform({ path: '/erp/company/c/smoke', headers: { Accept: 'text/html' } });
    return (r.status === 302 && (r.headers.location || '').startsWith('/tasks/api/app-carry?to=')) || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/company private API without a session: 401', async () => {
    const r = await onPlatform({ path: '/company/api/company/mine', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  // bizomat.ai/erp: BIZOMAT ERP, one shell over every tool, served by the same app (work); /system-preview/ is
  // the website's (checked with the web pages above)
  await check('work', 'bizomat.ai/erp/api/health (the same app)', async () => {
    const r = await onPlatform({ path: '/erp/api/health' });
    return r.status === 200 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/erp/login: BIZOMAT ERP, its files under /erp/ (<base href>)', async () => {
    const r = await onPlatform({ path: '/erp/login', headers: { Accept: 'text/html' } });
    if (r.status !== 200) return { fail: describe(r) };
    return (r.text.includes('<base href="/erp/">') && r.text.includes('<title>BIZOMAT ERP</title>')) || { fail: 'no <base href="/erp/"> or ERP title in the page' };
  });
  await check('work', 'bizomat.ai/erp: a page without a session goes through /tasks (a session there carries over)', async () => {
    const r = await onPlatform({ path: '/erp/smoke', headers: { Accept: 'text/html' } });
    return (r.status === 302 && (r.headers.location || '').startsWith('/tasks/api/app-carry?to=')) || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  await check('work', 'bizomat.ai/erp private API without a session: 401', async () => {
    const r = await onPlatform({ path: '/erp/api/system/me', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  await check('work', 'bizomat.ai/system (the workspace\'s earlier address) leads to /erp', async () => {
    const r = await onPlatform({ path: '/system/c/smoke/home', headers: { Accept: 'text/html' } });
    return (r.status === 302 && r.headers.location === '/erp/c/smoke/home') || { fail: `${describe(r)} ${r.headers.location || ''}` };
  });
  // work.kevos.com, the old address: the app at the root of its host
  await check('work', `${old} /api/health`, async () => {
    const r = await onOldHost('work', old, { path: '/api/health' });
    return r.status === 200 || { fail: describe(r) };
  });
  await check('work', `${old} /login: the app at the root (<base href="/">)`, async () => {
    const r = await onOldHost('work', old, { path: '/login', headers: { Accept: 'text/html' } });
    if (r.status !== 200 || !/text\/html/.test(r.headers['content-type'] || '')) return { fail: describe(r) };
    return r.text.includes('<base href="/">') || { fail: 'no <base href="/"> in the page' };
  });
  await check('work', `${old} private API without a session: 401`, async () => {
    const r = await onOldHost('work', old, { path: '/api/workspaces', headers: { Accept: 'application/json' } });
    return r.status === 401 || { fail: describe(r) };
  });
  await check('work', `${old} WebSocket upgrade without a session is refused`, async () => {
    const cookie = opts.mode === 'preview' ? await previewSwitch('work') : '';
    const host = opts.mode === 'preview' ? base.hostname : old;
    const r = await wsHandshake(host, '/api/live/boards/smoke-test', { Origin: `https://${host}`, ...(cookie ? { Cookie: cookie } : {}) });
    if (r.status === 101) return { fail: 'accepted without a session' };
    return [401, 403, 404, 426].includes(r.status) || { fail: `HTTP ${r.status}` };
  });
}

/** Stand-in backend: the request arrives with the Host and the path kept and one client IP in every header. */
async function stubChecks(backend, host, path) {
  const onPlatformHost = host === 'bizomat.ai';
  await check(backend, `${host}${path} reaches the ${backend} stand-in with clean forwarding headers`, async () => {
    const req = {
      path: `${path}?x=1`,
      headers: { 'X-Forwarded-For': '6.6.6.6', 'CF-Connecting-IP': '6.6.6.6', 'Fly-Client-IP': '6.6.6.6', 'X-Real-IP': '6.6.6.6', 'X-Bizomat-Smoke': '1' },
    };
    const r = onPlatformHost ? await onPlatform(req) : await onOldHost(backend, host, req);
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
    if (e.url !== `${path}?x=1`) problems.push(`path ${e.url}`);
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
