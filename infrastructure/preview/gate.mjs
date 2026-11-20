#!/usr/bin/env node
// BIZOMAT review preview: the gate in front of the local stack (infrastructure/local/compose.yml) for a temporary
// browser preview of a pull request (.github/workflows/review-preview.yml). It never runs in production.
//
// The stack is the production image and expects to be bizomat.ai. The gate lets it answer at another address (a
// temporary Cloudflare quick tunnel) without changing any production code:
//   - requests reach the proxy as bizomat.ai (Host, Origin and Referer rewritten), so routing, sign-in and the
//     apps' origin checks behave exactly as in production;
//   - answers point back at the preview: https://bizomat.ai and https://www.bizomat.ai in Location, Set-Cookie,
//     Content-Security-Policy and in text bodies (HTML, scripts, JSON, CSS, XML) become the preview's own address,
//     so no link leaves the preview for production;
//   - Strict-Transport-Security is dropped and X-Robots-Tag: noindex added, so the preview stays out of search;
//   - with a password set, every request needs HTTP Basic sign-in (user "review").
//
// The same gate fronted the staging app on Fly (role "gate" of infrastructure/fly/entrypoint.sh; the app was retired on
// the owner's request, 20 Nov 2026): there it listens on every interface, takes its address from GATE_PUBLIC_ORIGIN, and
// refuses to start without a password.
//
// Settings: GATE_PORT (default 8090), GATE_HOST (default 127.0.0.1), GATE_UPSTREAM (default http://127.0.0.1:8080),
// GATE_PASSWORD or PREVIEW_PASSWORD (optional on this computer; required when GATE_HOST is not a loopback address),
// GATE_PUBLIC_ORIGIN (optional: the gate's own https address, used instead of the request's Host),
// GATE_REALM (the sign-in prompt's name).
// GET /__gate/health answers without sign-in, for the workflow's own checks.

import http from 'node:http';
import net from 'node:net';
import { timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.GATE_PORT || 8090);
const HOST = process.env.GATE_HOST || '127.0.0.1';
const UPSTREAM = new URL(process.env.GATE_UPSTREAM || 'http://127.0.0.1:8080');
const PASSWORD = process.env.GATE_PASSWORD || process.env.PREVIEW_PASSWORD || '';
const PUBLIC_ORIGIN = pinnedOrigin(process.env.GATE_PUBLIC_ORIGIN);
const REALM = (process.env.GATE_REALM || 'BIZOMAT review preview').replace(/["\r\n]/g, '');
const PRODUCTION = 'https://bizomat.ai';
const MAX_REWRITE_BYTES = 40 * 1024 * 1024;
const TEXT = /^(text\/(html|javascript|css|plain|xml)|application\/(javascript|json|xml|manifest\+json|ld\+json|rss\+xml|atom\+xml))\b/i;
const HOP = new Set(['connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade', 'te', 'trailer']);

/** GATE_PUBLIC_ORIGIN as an https origin (scheme and host only), or '' when unset. Anything else stops the gate. */
export function pinnedOrigin(value) {
  if (!value) return '';
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash || (u.pathname !== '/' && u.pathname !== '')) {
    throw new Error(`GATE_PUBLIC_ORIGIN must be https:// and a host only (got ${value})`);
  }
  return u.origin;
}

/** True when the gate listens only on this computer. */
export function isLoopback(host) {
  return host === '127.0.0.1' || host === '::1' || host === 'localhost';
}

/** The address the browser used: the pinned address when set, else the tunnel's https host, or the local address. */
export function publicOrigin(req, pinned = PUBLIC_ORIGIN) {
  if (pinned) return pinned;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || `127.0.0.1:${PORT}`).split(',')[0].trim();
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https' ? 'https' : 'http';
  return `${proto}://${host}`;
}

/** https://bizomat.ai (and www, and the JSON-escaped forms) -> the preview's address. */
export function toPreview(text, origin) {
  const escaped = origin.replace(/\//g, '\\/');
  return text
    .replace(/https?:\/\/(?:www\.)?bizomat\.ai(?![\w-]|\.[a-z])/gi, origin)
    .replace(/https?:\\\/\\\/(?:www\.)?bizomat\.ai(?![\w-]|\.[a-z])/gi, escaped);
}

/** The preview's address (and the plain local one) -> https://bizomat.ai, for Origin and Referer. */
export function toProduction(value, origin) {
  if (!value) return value;
  return value.startsWith(origin) ? PRODUCTION + value.slice(origin.length) : value;
}

/** HTTP Basic sign-in as "review" with the password; everyone passes when no password is set. */
export function authorisedBy(header, password) {
  if (!password) return true;
  const m = /^Basic\s+(.+)$/i.exec(String(header || ''));
  if (!m) return false;
  const [user, ...rest] = Buffer.from(m[1], 'base64').toString('utf8').split(':');
  const given = Buffer.from(rest.join(':'));
  const want = Buffer.from(password);
  return user === 'review' && given.length === want.length && timingSafeEqual(given, want);
}

function authorised(req) {
  return authorisedBy(req.headers.authorization, PASSWORD);
}

function upstreamHeaders(req, origin) {
  const h = {};
  for (const [k, v] of Object.entries(req.headers)) {
    const key = k.toLowerCase();
    if (HOP.has(key) || key === 'host' || key === 'authorization' || key === 'accept-encoding') continue;
    if (key.startsWith('cf-') || key.startsWith('x-forwarded-') || key === 'cdn-loop') continue;
    h[key] = v;
  }
  h.host = 'bizomat.ai';
  if (h.origin) h.origin = toProduction(String(h.origin), origin);
  if (h.referer) h.referer = toProduction(String(h.referer), origin);
  h['accept-encoding'] = 'identity';
  return h;
}

function downstreamHeaders(res, origin) {
  const out = {};
  for (const [k, v] of Object.entries(res.headers)) {
    const key = k.toLowerCase();
    if (HOP.has(key) || key === 'strict-transport-security' || key === 'content-length') continue;
    if (key === 'location' || key === 'content-security-policy' || key === 'content-security-policy-report-only' || key === 'link') {
      out[key] = toPreview(String(v), origin);
    } else if (key === 'set-cookie') {
      out[key] = [].concat(v).map((c) => c.replace(/;\s*Domain=[^;]*/gi, ''));
    } else {
      out[key] = v;
    }
  }
  out['x-robots-tag'] = 'noindex, nofollow';
  return out;
}

const server = http.createServer((req, res) => {
  if (req.url === '/__gate/health') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end('ok');
  }
  if (!authorised(req)) {
    res.writeHead(401, { 'www-authenticate': `Basic realm="${REALM}", charset="UTF-8"`, 'content-type': 'text/plain' });
    return res.end('This preview needs the review password.');
  }
  const origin = publicOrigin(req);
  const up = http.request(
    { hostname: UPSTREAM.hostname, port: UPSTREAM.port, method: req.method, path: req.url, headers: upstreamHeaders(req, origin) },
    (ures) => {
      const headers = downstreamHeaders(ures, origin);
      const type = String(ures.headers['content-type'] || '');
      const length = Number(ures.headers['content-length'] || 0);
      const rewrite = req.method !== 'HEAD' && TEXT.test(type) && length <= MAX_REWRITE_BYTES && !ures.headers['content-encoding'];
      if (!rewrite) {
        if (ures.headers['content-length'] && !ures.headers['content-encoding']) headers['content-length'] = ures.headers['content-length'];
        res.writeHead(ures.statusCode || 502, headers);
        return ures.pipe(res);
      }
      const chunks = [];
      let size = 0;
      ures.on('data', (c) => {
        size += c.length;
        if (size <= MAX_REWRITE_BYTES) chunks.push(c);
      });
      ures.on('end', () => {
        const body = Buffer.from(toPreview(Buffer.concat(chunks).toString('utf8'), origin), 'utf8');
        headers['content-length'] = String(body.length);
        res.writeHead(ures.statusCode || 502, headers);
        res.end(body);
      });
      ures.on('error', () => res.destroy());
    },
  );
  up.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain' });
    res.end('The preview stack is not answering.');
  });
  req.pipe(up);
});

// WebSockets (live board updates): the same rewriting of the request, then the two connections piped together.
server.on('upgrade', (req, socket, head) => {
  if (!authorised(req)) {
    socket.end(`HTTP/1.1 401 Unauthorized\r\nWWW-Authenticate: Basic realm="${REALM}"\r\nConnection: close\r\n\r\n`);
    return;
  }
  const origin = publicOrigin(req);
  const headers = upstreamHeaders(req, origin);
  delete headers['accept-encoding'];
  headers.connection = 'Upgrade';
  headers.upgrade = req.headers.upgrade;
  const up = net.connect(Number(UPSTREAM.port), UPSTREAM.hostname, () => {
    const lines = [`${req.method} ${req.url} HTTP/1.1`, ...Object.entries(headers).flatMap(([k, v]) => [].concat(v).map((x) => `${k}: ${x}`)), '', ''];
    up.write(lines.join('\r\n'));
    if (head?.length) up.write(head);
    up.pipe(socket);
    socket.pipe(up);
  });
  up.on('error', () => socket.destroy());
  socket.on('error', () => up.destroy());
});

if (import.meta.url === `file://${process.argv[1]}`) {
  // Fail closed: a gate others can reach must have a password, or staging would be open to anyone.
  if (!isLoopback(HOST) && !PASSWORD) {
    console.error(JSON.stringify({ event: 'gate_refused', reason: 'GATE_PASSWORD is required when GATE_HOST is not a loopback address' }));
    process.exit(1);
  }
  server.once('listening', () => {
    const at = server.address();
    console.log(JSON.stringify({ event: 'gate_listening', host: at.address, port: at.port, upstream: UPSTREAM.origin, password: Boolean(PASSWORD), origin: PUBLIC_ORIGIN || null }));
  });
  // '::' (every interface) falls back to 0.0.0.0 where the kernel has no IPv6, as the edge proxy does.
  server.once('error', (err) => {
    if (HOST === '::' && (err.code === 'EAFNOSUPPORT' || err.code === 'EADDRNOTAVAIL')) return server.listen(PORT, '0.0.0.0');
    throw err;
  });
  server.listen(PORT, HOST);
}
