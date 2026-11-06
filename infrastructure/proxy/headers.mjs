// BIZOMAT edge proxy: request and response header hygiene, the client IP trust model, cookies and log redaction.
// Pure functions (tested in test/headers.test.mjs).
//
// Trust model (who may tell the proxy the client's IP address and scheme)
// -----------------------------------------------------------------------
// The proxy is the only public service of the Fly app. Fly's edge (Fly Proxy) terminates TLS and opens a
// connection to this Machine over the Machine's local virtual interface. Fly Proxy sets Fly-Client-IP to the
// address it accepted the connection from, and X-Forwarded-Proto to the client's scheme; both are set by the
// edge, whatever the client sent. Everything else that can reach port 8080 is on the organisation's private
// IPv6 network (6PN, fdaa::/16): other Machines and apps of the org, and WireGuard peers such as `fly proxy`.
//
// mode "fly" (the default when FLY_APP_NAME is set, i.e. on Fly):
//   - a connection from a 6PN address (PROXY_UNTRUSTED_PEERS, default fdaa::/16) is NOT the edge: its
//     Fly-Client-IP, X-Forwarded-*, CF-* and X-Real-IP headers are ignored; its client IP is the socket address
//     and its scheme is http.
//   - any other peer is Fly Proxy: the client IP is Fly-Client-IP (when it is a valid IP address), the scheme
//     is X-Forwarded-Proto (http or https), https when absent.
//   - optional (PROXY_TRUST_CLOUDFLARE=1, only for DNS records proxied through Cloudflare, "orange cloud"):
//     when the edge's client IP is inside Cloudflare's published ranges, CF-Connecting-IP becomes the client IP
//     and Cloudflare's CF-Ray / CF-IPCountry / CF-Visitor headers are passed on.
// mode "socket" (the default elsewhere: local runs, compose): no header is trusted; the client IP is the socket
//   address and the scheme is http.
//
// Whatever the mode, the backends get exactly one client IP, overwritten in every header they may read:
// X-Forwarded-For (one address, never a list), X-Real-IP, CF-Connecting-IP (the work app reads it),
// Fly-Client-IP (the cad app reads it). Client-sent copies of these, of every X-Forwarded-* / Forwarded header,
// of every Fly-* and CF-* header and of every X-Bizomat-* header are removed before the request goes on.

import net from 'node:net';

export const HOP_BY_HOP = new Set([
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'proxy-connection',
  'te', 'trailer', 'trailers', 'transfer-encoding', 'upgrade', 'http2-settings',
]);

// Request headers a client may never set for the backends: the proxy sets its own, or they belong to the edge.
const STRIP_REQUEST_PREFIXES = ['x-forwarded-', 'x-bizomat-', 'fly-', 'cf-'];
const STRIP_REQUEST_EXACT = new Set([
  'forwarded', 'x-real-ip', 'x-client-ip', 'true-client-ip', 'x-cluster-client-ip', 'client-ip',
  'x-original-forwarded-for', 'x-originating-ip', 'x-remote-ip', 'x-remote-addr', 'expect',
]);
// Edge headers passed on when the request really came through the edge (informational, set by the edge).
const FLY_PASS = new Set(['fly-request-id', 'fly-region', 'fly-forwarded-port']);
const CLOUDFLARE_PASS = new Set(['cf-ray', 'cf-ipcountry', 'cf-visitor']);

// Cloudflare's published address ranges (https://www.cloudflare.com/ips/), used only with PROXY_TRUST_CLOUDFLARE=1.
// Override with PROXY_CLOUDFLARE_RANGES (comma separated) if Cloudflare publishes changes.
export const CLOUDFLARE_RANGES = Object.freeze([
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
  '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
  '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
  '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29',
  '2c0f:f248::/32',
]);

export const SIX_PN = Object.freeze(['fdaa::/16']);

export const HSTS_VALUE = 'max-age=31536000; includeSubDomains';

/** An address without brackets, zone id or the IPv4-mapped prefix; '' when it is not an IP address. */
export function normalizeIp(value) {
  if (typeof value !== 'string') return '';
  let v = value.trim();
  if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1);
  const zone = v.indexOf('%');
  if (zone >= 0) v = v.slice(0, zone);
  if (/^::ffff:\d+\.\d+\.\d+\.\d+$/i.test(v)) v = v.slice(7);
  const kind = net.isIP(v);
  if (!kind) return '';
  return kind === 6 ? v.toLowerCase() : v;
}

/** A net.BlockList for a list of CIDR strings ("10.0.0.0/8", "fdaa::/16") or single addresses. */
export function cidrList(entries) {
  const list = new net.BlockList();
  for (const raw of entries || []) {
    const entry = String(raw).trim();
    if (!entry) continue;
    const [addr, bits] = entry.split('/');
    const ip = normalizeIp(addr);
    if (!ip) throw new Error(`not an address range: ${entry}`);
    const type = net.isIP(ip) === 6 ? 'ipv6' : 'ipv4';
    if (bits === undefined) list.addAddress(ip, type);
    else {
      const prefix = Number(bits);
      const max = type === 'ipv6' ? 128 : 32;
      if (!Number.isInteger(prefix) || prefix < 0 || prefix > max) throw new Error(`bad prefix length: ${entry}`);
      list.addSubnet(ip, prefix, type);
    }
  }
  return list;
}

export function inList(list, ip) {
  if (!list || !ip) return false;
  return list.check(ip, net.isIP(ip) === 6 ? 'ipv6' : 'ipv4');
}

function one(value) {
  if (Array.isArray(value)) return value[0];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Who the client is, as far as the proxy can tell.
 * @param {object} p
 * @param {string} p.peer       the TCP peer address (socket.remoteAddress)
 * @param {object} p.headers    req.headers (lower-case names)
 * @param {object} p.trust      { mode: 'fly'|'socket', untrusted: BlockList, cloudflare: boolean, cloudflareRanges: BlockList,
 *                              assumeHttps?: boolean (socket mode: the scheme the local stack's missing TLS edge would give) }
 * @returns {{ip: string, proto: 'http'|'https', edge: boolean, cdn: ''|'cloudflare'}}
 */
export function clientInfo({ peer, headers, trust }) {
  const socketIp = normalizeIp(peer) || '0.0.0.0';
  if (!trust || trust.mode !== 'fly' || inList(trust.untrusted, socketIp)) {
    return { ip: socketIp, proto: trust?.mode === 'socket' && trust.assumeHttps ? 'https' : 'http', edge: false, cdn: '' };
  }
  const xfp = String(one(headers['x-forwarded-proto']) || '').trim().toLowerCase();
  const proto = xfp === 'http' ? 'http' : 'https';
  const flyIp = normalizeIp(one(headers['fly-client-ip']) || '');
  if (!flyIp) return { ip: socketIp, proto, edge: true, cdn: '' };
  if (trust.cloudflare && inList(trust.cloudflareRanges, flyIp)) {
    const cfIp = normalizeIp(one(headers['cf-connecting-ip']) || '');
    if (cfIp) return { ip: cfIp, proto, edge: true, cdn: 'cloudflare' };
  }
  return { ip: flyIp, proto, edge: true, cdn: '' };
}

function connectionTokens(rawHeaders) {
  const tokens = new Set();
  for (let i = 0; i < rawHeaders.length; i += 2) {
    if (rawHeaders[i].toLowerCase() === 'connection') {
      for (const t of String(rawHeaders[i + 1]).split(',')) {
        const name = t.trim().toLowerCase();
        if (name) tokens.add(name);
      }
    }
  }
  return tokens;
}

/** The Cookie header without one cookie (the preview switch is the proxy's own, the backends never see it). */
export function stripCookie(header, name) {
  if (!header) return '';
  return String(header).split(';').map((p) => p.trim()).filter((p) => p && p.split('=')[0].trim() !== name).join('; ');
}

export function readCookie(header, name) {
  if (!header) return '';
  for (const part of String(header).split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return '';
}

/**
 * Request headers for the backend, as a flat raw list (case, order and repeats kept).
 * @param {string[]} rawHeaders req.rawHeaders
 * @param {object} ctx { client: clientInfo(), host: the Host header value, requestId, upgrade: boolean,
 *                       dropCookie: cookie name to remove or '' }
 */
export function upstreamRequestHeaders(rawHeaders, ctx) {
  const hop = connectionTokens(rawHeaders);
  const out = [];
  let cookieParts = [];
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const name = rawHeaders[i];
    const value = rawHeaders[i + 1];
    const lower = name.toLowerCase();
    if (lower === 'host') continue; // set once below, as received
    if (lower === 'cookie') {
      cookieParts.push(value);
      continue;
    }
    if (ctx.upgrade && (lower === 'connection' || lower === 'upgrade')) continue; // set below
    if (HOP_BY_HOP.has(lower) || hop.has(lower)) continue;
    if (STRIP_REQUEST_EXACT.has(lower)) continue;
    if (STRIP_REQUEST_PREFIXES.some((p) => lower.startsWith(p))) {
      const edgeHeader = ctx.client.edge && FLY_PASS.has(lower);
      const cdnHeader = ctx.client.cdn === 'cloudflare' && CLOUDFLARE_PASS.has(lower);
      if (!edgeHeader && !cdnHeader) continue;
    }
    out.push(name, value);
  }
  out.push('Host', ctx.host);
  if (cookieParts.length) {
    let cookie = cookieParts.join('; ');
    if (ctx.dropCookie) cookie = stripCookie(cookie, ctx.dropCookie);
    if (cookie) out.push('Cookie', cookie);
  }
  if (ctx.upgrade) {
    out.push('Connection', 'Upgrade', 'Upgrade', ctx.upgrade);
  }
  const ip = ctx.client.ip;
  out.push(
    'X-Forwarded-For', ip,
    'X-Real-IP', ip,
    'CF-Connecting-IP', ip,
    'Fly-Client-IP', ip,
    'X-Forwarded-Proto', ctx.client.proto,
    'X-Forwarded-Host', ctx.host,
  );
  if (ctx.requestId) out.push('X-Bizomat-Request-Id', ctx.requestId);
  return out;
}

/**
 * Response headers for the client, as a flat raw list: hop-by-hop headers removed; HSTS added on production
 * hosts and X-Robots-Tag: noindex on the preview host when the backend did not send them.
 */
export function clientResponseHeaders(rawHeaders, { production = false, preview = false, keepUpgrade = false } = {}) {
  const hop = connectionTokens(rawHeaders);
  const out = [];
  let hasHsts = false;
  let hasRobots = false;
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const name = rawHeaders[i];
    const lower = name.toLowerCase();
    if (keepUpgrade && (lower === 'connection' || lower === 'upgrade')) {
      out.push(name, rawHeaders[i + 1]);
      continue;
    }
    if (HOP_BY_HOP.has(lower) || hop.has(lower)) continue;
    if (lower === 'strict-transport-security') hasHsts = true;
    if (lower === 'x-robots-tag') hasRobots = true;
    out.push(name, rawHeaders[i + 1]);
  }
  if (production && !hasHsts) out.push('Strict-Transport-Security', HSTS_VALUE);
  if (preview && !hasRobots) out.push('X-Robots-Tag', 'noindex');
  return out;
}

/** Does this request carry a body? (HTTP/1.1: a Content-Length or a Transfer-Encoding header.) */
export function hasRequestBody(headers) {
  if (headers['transfer-encoding'] !== undefined) return true;
  const len = headers['content-length'];
  return len !== undefined && len !== '0';
}

// Path segments that look like credentials (private connector addresses, invite and reset links, signed ids), at the
// root of a host or under an application's path on bizomat.ai (/cad/mcp/<key>, /tasks/invite/<token>).
const TOKEN_ROUTES = [
  { re: /^((?:\/cad)?\/(?:solidworks\/)?mcp)\/([^/]+)/, keep: new Set(['sw', 'uploads', 'artifacts']) },
  { re: /^((?:\/cad|\/tasks)?\/(?:join|invite|reset|reset-password|verify|magic))\/([^/]+)/, keep: new Set() },
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function tokenLike(seg) {
  if (seg.length < 16 || !/^[A-Za-z0-9_~.%=-]+$/.test(seg)) return false;
  if (UUID.test(seg)) return true;
  const digit = /\d/.test(seg);
  if (!seg.includes('-') && digit) return true; // hex and base62 tokens
  return digit && /[a-z]/.test(seg) && /[A-Z]/.test(seg); // base64url tokens
}

/** The path for the log: no query, credential-like segments replaced, at most 200 characters. */
export function redactPath(path) {
  let p = typeof path === 'string' ? path : '';
  const q = p.indexOf('?');
  if (q >= 0) p = p.slice(0, q);
  for (const { re, keep } of TOKEN_ROUTES) {
    p = p.replace(re, (all, prefix, seg) => (keep.has(seg) ? all : `${prefix}/:redacted`));
  }
  p = p.split('/').map((seg) => (tokenLike(seg) ? ':redacted' : seg)).join('/');
  return p.length > 200 ? `${p.slice(0, 200)}...` : p;
}
