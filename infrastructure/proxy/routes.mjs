// BIZOMAT edge proxy: the routing table.
//
// Pure functions only (no I/O, no clock), so every rule is unit tested in test/routes.test.mjs.
// The proxy (proxy.mjs) asks `decide()` what to do with each request and carries the answer out.
//
// Routing is by the Host header only. Paths are never rewritten and the Host header is never changed:
// each backend sees the host the visitor used (the apps build links, cookies and CSRF checks from it).
//
//   Host                            Requests                         Action
//   bizomat.ai                      all                              proxy -> web
//   www.bizomat.ai                  GET, HEAD                        301 https://bizomat.ai<path>?<query>
//                                   other methods                    308 https://bizomat.ai<path>?<query>
//   cad.bizomat.ai                  all (all paths, upgrades)        proxy -> cad
//   cados.kevos.com                 all (all paths, upgrades)        proxy -> cad
//   work.bizomat.ai                 all (all paths, WebSockets)      proxy -> work
//   work.kevos.com                  all (all paths, WebSockets)      proxy -> work
//   kevos.com, www.kevos.com        GET, HEAD                        301 https://bizomat.ai<path>?<query>
//                                   other methods to /api or /api/*  proxy -> web (old cached pages still post forms)
//                                   other methods elsewhere          308 https://bizomat.ai<path>?<query>
//   <app>.fly.dev (preview host)    /__proxy/health, /__proxy/ready  the proxy's own health endpoints
//                                   /__preview/{cad,work,web,clear}  set or clear the preview cookie (only when
//                                                                    BIZOMAT_PREVIEW_ROUTING=1), then 303 to /
//                                   everything else                  proxy -> the preview cookie's backend when
//                                                                    preview routing is on, else web
//   any other host (IP, localhost)  /__proxy/health, /__proxy/ready  the proxy's own health endpoints
//                                   everything else                  421 Misdirected Request
//
// Paths the web app already redirects (for example /insights/*) are sent to bizomat.ai unchanged: the web app
// answers them there, so the rules live in one place. The kevos.com site's own paths (/tools/..., /reados/...)
// exist on bizomat.ai with the same names.

export const UPSTREAM_NAMES = Object.freeze(['web', 'work', 'cad']);

export const PREVIEW_COOKIE = 'bizomat_preview';

export const CANONICAL_ORIGIN = 'https://bizomat.ai';

/** Exact production host names. `production: true` hosts get HSTS when the backend does not send it. */
export const HOSTS = Object.freeze({
  'bizomat.ai': Object.freeze({ kind: 'proxy', upstream: 'web' }),
  'www.bizomat.ai': Object.freeze({ kind: 'redirect', origin: CANONICAL_ORIGIN }),
  'cad.bizomat.ai': Object.freeze({ kind: 'proxy', upstream: 'cad' }),
  'cados.kevos.com': Object.freeze({ kind: 'proxy', upstream: 'cad' }),
  'work.bizomat.ai': Object.freeze({ kind: 'proxy', upstream: 'work' }),
  'work.kevos.com': Object.freeze({ kind: 'proxy', upstream: 'work' }),
  'kevos.com': Object.freeze({ kind: 'legacy', origin: CANONICAL_ORIGIN }),
  'www.kevos.com': Object.freeze({ kind: 'legacy', origin: CANONICAL_ORIGIN }),
});

const PREVIEW_HOST = /^[a-z0-9-]+\.fly\.dev$/;
const HOST_NAME = /^[a-z0-9.-]{1,253}$/;
const IPV6_LITERAL = /^\[[0-9a-f:.]+\]$/;

/**
 * The host name from a Host header value: lower case, without the port and without a trailing dot.
 * IPv6 literals keep their brackets. Anything that is not a plausible host name gives ''.
 */
export function normalizeHost(value) {
  if (typeof value !== 'string') return '';
  let v = value.trim().toLowerCase();
  if (v.startsWith('[')) {
    const end = v.indexOf(']');
    if (end < 0) return '';
    v = v.slice(0, end + 1);
    return IPV6_LITERAL.test(v) ? v : '';
  }
  const colon = v.indexOf(':');
  if (colon >= 0) {
    const port = v.slice(colon + 1);
    if (!/^\d{0,5}$/.test(port)) return '';
    v = v.slice(0, colon);
  }
  if (v.endsWith('.')) v = v.slice(0, -1);
  return HOST_NAME.test(v) && !v.includes('..') ? v : '';
}

export function isPreviewHost(host) {
  return PREVIEW_HOST.test(host);
}

/** True for the hosts that get Strict-Transport-Security from the proxy (all production names). */
export function isProductionHost(host) {
  return Object.hasOwn(HOSTS, host);
}

/**
 * Split an origin-form request target into its raw path and raw query (without the '?').
 * Returns null for anything else (absolute-form, authority-form, asterisk-form): the proxy answers 400.
 */
export function splitTarget(target) {
  if (typeof target !== 'string' || !target.startsWith('/')) return null;
  const q = target.indexOf('?');
  return q < 0 ? { path: target, query: '' } : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function redirectTo(origin, path, query, method) {
  const keep = method === 'GET' || method === 'HEAD';
  return {
    action: 'redirect',
    status: keep ? 301 : 308,
    location: origin + path + (query ? `?${query}` : ''),
  };
}

function isApiPath(path) {
  return path === '/api' || path.startsWith('/api/');
}

/**
 * What to do with one request.
 *
 * @param {object} r
 * @param {string} r.host            the Host header value as received
 * @param {string} r.method          the request method
 * @param {string} r.path            the raw path (origin-form, no query)
 * @param {string} r.query           the raw query string without '?', or ''
 * @param {string} [r.previewCookie] the bizomat_preview cookie value, if any
 * @param {boolean} [r.previewRouting] BIZOMAT_PREVIEW_ROUTING=1
 * @returns {{action: string, [k: string]: any}} one of:
 *   { action: 'proxy', upstream, host, production, preview }
 *   { action: 'redirect', status, location, host, production }
 *   { action: 'health' | 'ready', host }
 *   { action: 'preview', target: 'web'|'work'|'cad'|'clear', host }
 *   { action: 'error', status, reason, host, production }
 */
export function decide({ host, method, path, query = '', previewCookie = '', previewRouting = false }) {
  const h = normalizeHost(host);
  const rule = h ? HOSTS[h] : undefined;
  if (rule) {
    const base = { host: h, production: true };
    if (rule.kind === 'proxy') return { ...base, action: 'proxy', upstream: rule.upstream, preview: false };
    if (rule.kind === 'redirect') return { ...base, ...redirectTo(rule.origin, path, query, method) };
    // legacy: kevos.com and www.kevos.com moved to bizomat.ai
    if ((method === 'GET' || method === 'HEAD') || !isApiPath(path)) {
      return { ...base, ...redirectTo(rule.origin, path, query, method) };
    }
    return { ...base, action: 'proxy', upstream: 'web', preview: false };
  }

  // Not a product host: the proxy's own endpoints, the preview host, or a host this app does not serve.
  if (path === '/__proxy/health') return { action: 'health', host: h };
  if (path === '/__proxy/ready') return { action: 'ready', host: h };
  if (path.startsWith('/__proxy/')) return { action: 'error', status: 404, reason: 'not_found', host: h, production: false };

  if (h && isPreviewHost(h)) {
    if (path === '/__preview' || path.startsWith('/__preview/')) {
      if (!previewRouting) return { action: 'error', status: 404, reason: 'preview_off', host: h, production: false };
      if (method !== 'GET' && method !== 'HEAD') return { action: 'error', status: 405, reason: 'method', host: h, production: false };
      const target = path.slice('/__preview/'.length).replace(/\/+$/, '');
      if (target === 'clear' || UPSTREAM_NAMES.includes(target)) return { action: 'preview', target, host: h };
      return { action: 'error', status: 404, reason: 'not_found', host: h, production: false };
    }
    const chosen = previewRouting && UPSTREAM_NAMES.includes(previewCookie) ? previewCookie : 'web';
    return { action: 'proxy', upstream: chosen, host: h, production: false, preview: true };
  }

  return { action: 'error', status: 421, reason: 'unknown_host', host: h, production: false };
}

/** The preview cookie for a /__preview/<target> answer (host-only: no Domain attribute). */
export function previewCookieHeader(target, secure) {
  const flags = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  if (target === 'clear') return `${PREVIEW_COOKIE}=; Max-Age=0; ${flags}`;
  return `${PREVIEW_COOKIE}=${target}; Max-Age=28800; ${flags}`;
}

/** Where /__preview/<target>?next=/path sends the browser: a same-site path only. */
export function previewNext(query) {
  const params = new URLSearchParams(query || '');
  const next = params.get('next') || '/';
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\') || /[\r\n]/.test(next)) return '/';
  return next;
}
