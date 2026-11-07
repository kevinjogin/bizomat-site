// BIZOMAT edge proxy: the routing table.
//
// Pure functions only (no I/O, no clock), so every rule is unit tested in test/routes.test.mjs.
// The proxy (proxy.mjs) asks `decide()` what to do with each request and carries the answer out.
//
// Everything lives under bizomat.ai, with no subdomains (owner's decision, 5 Nov 2026): the website at the root, CAD
// Automation under /cad and Project Management under /tasks. On bizomat.ai the proxy routes by path, as the website's
// Worker does (src/worker.ts routeApps, src/server/platform-paths.ts CAD_PATHS); every other host is routed by its name. Paths are never
// rewritten and the Host header is never changed: each backend sees the address the visitor used. The two apps take
// their prefix off themselves and write it back into the links they make (apps/cad/opensketch/canonical.py,
// apps/work/src/worker/mount.ts).
//
//   Host                            Requests                                  Action
//   bizomat.ai                      /cad, /cad/... and CAD Automation's       proxy -> cad
//                                   root paths (CAD_PATHS below)
//                                   /tasks, /tasks/...                        proxy -> work
//                                   GET, HEAD /CAD..., /Tasks/... (any case)  301 to the lowercase path, query kept
//                                   GET, HEAD /login, /log-in, /signin,       301 /sign-in/ (the platform's sign-in page,
//                                   /logon (any case, optional /)             which offers each application's)
//                                   everything else                           proxy -> web
//   www.bizomat.ai                  GET, HEAD                                 301 https://bizomat.ai<path>?<query>
//                                   other methods                             308 https://bizomat.ai<path>?<query>
//   cados.kevos.com                 all (all paths, upgrades)                 proxy -> cad (CAD Automation's old address)
//   work.kevos.com                  all (all paths, WebSockets)               proxy -> work (Project Management's old address)
//   kevos.com, www.kevos.com        GET, HEAD /cad, /cad/                     301 https://bizomat.ai/cad-automation/?<query>
//                                                                             (the old CAD Automation page: /cad is the app)
//                                   GET, HEAD                                 301 https://bizomat.ai<path>?<query>
//                                   other methods to /api or /api/*           proxy -> web (old cached pages still post forms)
//                                   other methods elsewhere                   308 https://bizomat.ai<path>?<query>
//   <app>.fly.dev (preview host)    /__proxy/health, /__proxy/ready           the proxy's own health endpoints
//                                   /__preview/{cad,work,web,clear}           set or clear the preview cookie (only when
//                                                                             BIZOMAT_PREVIEW_ROUTING=1), then 303 to /
//                                   everything else, with the preview cookie  proxy -> the cookie's backend at the root, as
//                                   and preview routing on                    the old addresses serve the apps
//                                   everything else, preview routing on       as on bizomat.ai, by path
//                                   everything else, preview routing off      301 (GET, HEAD) or 308 to
//                                                                             https://bizomat.ai<path>?<query>
//   any other host (IP, localhost)  /__proxy/health, /__proxy/ready           the proxy's own health endpoints
//                                   everything else                           421 Misdirected Request
//
// A path is matched as the website's Node server reads it (WHATWG URL: `.` and `..` segments resolved), so the proxy
// and the web process always agree on which requests are an application's: the website never has one to pass on.
// Paths the web app already redirects (for example /insights/*) are sent to bizomat.ai unchanged: the web app answers
// them there, so the rules live in one place. The kevos.com site's own paths (/tools/..., /reados/...) exist on
// bizomat.ai with the same names.

export const UPSTREAM_NAMES = Object.freeze(['web', 'work', 'cad']);

export const PREVIEW_COOKIE = 'bizomat_preview';

export const CANONICAL_ORIGIN = 'https://bizomat.ai';

/**
 * The paths of bizomat.ai that belong to CAD Automation: /cad and /cad/...; its OAuth metadata, which RFC 9728 and
 * RFC 8414 put at the root of the host (/.well-known/oauth-protected-resource/cad/mcp,
 * /.well-known/oauth-authorization-server/cad); the root addresses programs call, kept for connectors and computers
 * set up while CAD answered there (/mcp, /mcp/..., /solidworks/mcp, /oauth/..., /v2/..., /healthz); and
 * /.well-known/acme-challenge/. The same expression as the website's Worker (src/server/platform-paths.ts, CAD_PATHS; the tests
 * check that the two are equal). The CAD app's own list: apps/cad/opensketch/canonical.py (KEEP_PREFIXES).
 */
export const CAD_PATHS = /^\/cad(?:\/|$)|^\/(?:mcp|solidworks\/mcp)(?:\/|$)|^\/oauth\/|^\/v2\/|^\/healthz$|^\/\.well-known\/(?:oauth-protected-resource|oauth-authorization-server|openid-configuration|acme-challenge)(?:\/|$)/;

/** The paths of bizomat.ai that belong to Project Management. */
export const TASKS_PATHS = /^\/tasks(?:\/|$)/;

// An application's path in another case (/CAD, /Tasks/...): one address per page, in lowercase.
const APP_ANY_CASE = /^\/(cad|tasks)(?=\/|$)/i;

/** The platform's sign-in page (the website's): it offers each application's own sign-in. */
export const SIGN_IN_PATH = '/sign-in/';
// Sign-in addresses people type on bizomat.ai (/login, /Log-In, /signin): the platform's sign-in page. Each application
// signs in under its own path (/tasks/login, /cad/login).
const SIGN_IN_ALIASES = /^\/(?:login|log-in|signin|logon)\/?$/i;

/**
 * Exact production host names. `production: true` hosts get HSTS when the backend does not send it.
 * `platform` routes by path (platformUpstream); `proxy` sends every path to one backend.
 */
export const HOSTS = Object.freeze({
  'bizomat.ai': Object.freeze({ kind: 'platform' }),
  'www.bizomat.ai': Object.freeze({ kind: 'redirect', origin: CANONICAL_ORIGIN }),
  'cados.kevos.com': Object.freeze({ kind: 'proxy', upstream: 'cad' }),
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

/**
 * The path as the website's Node server reads a request (src/node/server.ts: `new URL(req.url, origin)`): dot
 * segments resolved, a leading `//` read as another host. Matching on it keeps the proxy and the web process in
 * agreement. The raw path itself is what the backend receives.
 */
export function routingPath(path) {
  try {
    return new URL(path, 'http://bizomat.invalid').pathname;
  } catch {
    return path;
  }
}

/** The backend that serves this path of bizomat.ai (and of the preview host): cad, work or web. */
export function platformUpstream(path) {
  const p = routingPath(path);
  if (CAD_PATHS.test(p)) return 'cad';
  if (TASKS_PATHS.test(p)) return 'work';
  return 'web';
}

/** For GET and HEAD of /CAD..., /Tasks/... (an application's path in another case): the lowercase path, else ''. */
export function lowercaseLocation(path, query, method) {
  if (method !== 'GET' && method !== 'HEAD') return '';
  const p = routingPath(path);
  const m = APP_ANY_CASE.exec(p);
  if (!m || m[1] === m[1].toLowerCase()) return '';
  return `/${m[1].toLowerCase()}${p.slice(m[0].length)}${query ? `?${query}` : ''}`;
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
 * While Project Management still runs outside this app, /tasks/... answers a temporary redirect to its own address
 * (TASKS_REDIRECT_ORIGIN, for example https://work.kevos.com) with the /tasks prefix taken off, as the website's
 * Worker did before its TASKS binding: 302 for GET and HEAD, 307 for other methods (method and body kept). Never
 * cached, so it can be lifted at any time.
 */
export function tasksRedirect(origin, path, query, method) {
  const p = routingPath(path);
  const rest = p.slice('/tasks'.length) || '/';
  const read = method === 'GET' || method === 'HEAD';
  return { action: 'redirect', status: read ? 302 : 307, location: origin + rest + (query ? `?${query}` : ''), temporary: true };
}

/** The answer for a path of bizomat.ai (and of the preview host): a 301 to the lowercase path, or a backend. */
function byPath(base, path, query, method, preview, tasksOrigin) {
  if ((method === 'GET' || method === 'HEAD') && SIGN_IN_ALIASES.test(routingPath(path))) {
    return { ...base, action: 'redirect', status: 301, location: SIGN_IN_PATH + (query ? `?${query}` : '') };
  }
  const lower = lowercaseLocation(path, query, method);
  if (lower) return { ...base, action: 'redirect', status: 301, location: lower };
  const upstream = platformUpstream(path);
  if (upstream === 'work' && tasksOrigin) return { ...base, ...tasksRedirect(tasksOrigin, path, query, method) };
  return { ...base, action: 'proxy', upstream, preview };
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
 * @param {string} [r.tasksOrigin]    TASKS_REDIRECT_ORIGIN: /tasks/... redirects there instead of reaching work
 * @returns {{action: string, [k: string]: any}} one of:
 *   { action: 'proxy', upstream, host, production, preview }
 *   { action: 'redirect', status, location, host, production }
 *   { action: 'health' | 'ready', host }
 *   { action: 'preview', target: 'web'|'work'|'cad'|'clear', host }
 *   { action: 'error', status, reason, host, production }
 */
export function decide({ host, method, path, query = '', previewCookie = '', previewRouting = false, tasksOrigin = '' }) {
  const h = normalizeHost(host);
  const rule = h ? HOSTS[h] : undefined;
  if (rule) {
    const base = { host: h, production: true };
    if (rule.kind === 'platform') return byPath(base, path, query, method, false, tasksOrigin);
    if (rule.kind === 'proxy') return { ...base, action: 'proxy', upstream: rule.upstream, preview: false };
    if (rule.kind === 'redirect') return { ...base, ...redirectTo(rule.origin, path, query, method) };
    // legacy: kevos.com and www.kevos.com moved to bizomat.ai
    const read = method === 'GET' || method === 'HEAD';
    const p = routingPath(path);
    if (read && (p === '/cad' || p === '/cad/')) return { ...base, ...redirectTo(rule.origin, '/cad-automation/', query, method) };
    if (read || !isApiPath(path)) {
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
    if (previewRouting && UPSTREAM_NAMES.includes(previewCookie)) {
      return { action: 'proxy', upstream: previewCookie, host: h, production: false, preview: true };
    }
    // Outside a cutover (preview routing off) the app's own address is not a second address of the platform: every
    // request goes to the same path on bizomat.ai (the proxy's endpoints above stay, for checks and monitoring).
    if (!previewRouting) return { host: h, production: false, ...redirectTo(CANONICAL_ORIGIN, path, query, method) };
    return byPath({ host: h, production: false }, path, query, method, true, tasksOrigin);
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
