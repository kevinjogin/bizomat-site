// Project Management under a path of another site's address: https://bizomat.ai/tasks.
//
// The BIZOMAT website owns the rest of bizomat.ai and hands /tasks/... to this app with the address unchanged: on
// Cloudflare its Worker through a service binding, on the BIZOMAT platform (Fly.io) the edge proxy by path
// (infrastructure/proxy/routes.mjs). A request under MOUNT is served with the path taken off, so routes, the session
// check and the static files are the same as on a host of its own; the root paths the app writes get it back:
// Location headers and cookie paths here, and every page carries <base href> so the client builds its addresses
// under it (src/client/lib/base.ts). The session cookie under MOUNT is scoped to it (Path=/tasks), so the website and the
// other applications on bizomat.ai never receive it; a __Host- cookie must have Path=/, so it is __Secure- there.
//
// Without the path the app answers at the root of its host, as before (work.kevos.com). With CANONICAL_URL set
// ("https://bizomat.ai/tasks"), a page asked for on another host answers 301 to the same path there; /api/ keeps
// working on every host, for open tabs and anything that calls it.
//
// The same app also answers under /crm (BIZOMAT CRM, src/worker/crm and src/client/crm), /finance (BIZOMAT Finance,
// src/worker/fin and src/client/fin) and /company (company accounts and their control centre, src/worker/company and
// src/client/company): one Worker, one database and one session for all four. The session cookie is written for each
// path (Path=/tasks, /crm, /finance and /company), so signing in to one signs in to all, while the website and CAD
// Automation, at other paths of bizomat.ai, still never receive it.
//
// One system (owner, 14 Nov 2026): every tool also opens inside BIZOMAT System, under /system/tasks, /system/crm,
// /system/finance and /system/company, with the System's module rail around it (src/client/components/layout/SuiteRail.tsx).
// Those are the same app with a longer path taken off; their cookies are written for /system (and the other paths).
// A page asked for at a tool's own address answers 302 to the same page inside the System (suiteRedirect).
import type { Env } from './env';

export const MOUNT = '/tasks';
/** BIZOMAT CRM, served by this app at https://bizomat.ai/crm. */
export const CRM_MOUNT = '/crm';
/** BIZOMAT Finance, served by this app at https://bizomat.ai/finance. */
export const FIN_MOUNT = '/finance';
/** BIZOMAT company accounts and their control centre, served by this app at https://bizomat.ai/company. */
export const COMPANY_MOUNT = '/company';
/** BIZOMAT System, every tool in one place by company, served by this app at https://bizomat.ai/system. */
export const SYSTEM_MOUNT = '/system';
/** Every path this app is served under on another site's address; the session cookie is written for each. */
export const MOUNTS = [MOUNT, CRM_MOUNT, FIN_MOUNT, COMPANY_MOUNT, SYSTEM_MOUNT] as const;
/** The tools that also open inside BIZOMAT System, at /system/<tool>. */
export const SUITE_APPS = [MOUNT, CRM_MOUNT, FIN_MOUNT, COMPANY_MOUNT] as const;
/** /system/tasks, /system/crm, /system/finance and /system/company. */
export const SUITE_MOUNTS = SUITE_APPS.map((m) => `${SYSTEM_MOUNT}${m}`);
const ALL_MOUNTS = [...SUITE_MOUNTS, ...MOUNTS];

/** The path the request came in under: one of MOUNTS or SUITE_MOUNTS (the longest that fits), or '' at the root. */
export function mountOf(url: URL): string {
  for (const m of ALL_MOUNTS) if (url.pathname === m || url.pathname.startsWith(`${m}/`)) return m;
  return '';
}

/** The tool a path serves: '/system/crm' -> '/crm'; any other path as it is. */
export const appOf = (base: string): string => (base.startsWith(`${SYSTEM_MOUNT}/`) ? base.slice(SYSTEM_MOUNT.length) : base);
/** The path its cookies are written for: '/system/crm' -> '/system'; any other path as it is. */
export const topOf = (base: string): string => (base.startsWith(`${SYSTEM_MOUNT}/`) ? SYSTEM_MOUNT : base);

const underMount = (value: string) => MOUNTS.some((m) => value === m || value.startsWith(`${m}/`) || value.startsWith(`${m}?`));

/** The same request with the mount taken off its path (body, method and headers unchanged). */
export function unmount(request: Request, base: string): Request {
  const url = new URL(request.url);
  url.pathname = url.pathname.slice(base.length) || '/';
  return new Request(url.toString(), request);
}

/** A root path the app wrote, under the mount ("/login" -> "/tasks/login"); anything else as it is. */
export function addBase(value: string, base: string): string {
  if (!base || !value.startsWith('/') || value.startsWith('//')) return value;
  // Already an address of this app under one of its paths (/tasks/..., /crm/...): as it is.
  if (underMount(value)) return value;
  return base + value;
}

function cookieUnder(header: string, base: string): string {
  return header.replace(/(;\s*path=)(\/[^;]*)/i, (_m, attr: string, path: string) => attr + (path === '/' ? base : addBase(path, base)));
}

/** A cookie the app wrote (Path=/...) for every mount, the request's own first (under the System: /system). */
function cookieForMounts(header: string, base: string): string[] {
  if (!/;\s*path=\//i.test(header)) return [header];
  const own = topOf(base);
  return [own, ...MOUNTS.filter((m) => m !== own)].map((m) => cookieUnder(header, m));
}

/** Location headers and cookie paths under the mount. A WebSocket upgrade passes untouched. */
export function remount(res: Response, base: string): Response {
  if (!base || res.status === 101 || res.webSocket) return res;
  const location = res.headers.get('Location');
  const cookies = res.headers.getSetCookie();
  if (!(location && location.startsWith('/')) && !cookies.length) return res;
  const out = new Response(res.body, res);
  if (location) out.headers.set('Location', addBase(location, base));
  if (cookies.length) {
    out.headers.delete('Set-Cookie');
    const seen = new Set<string>();
    for (const c of cookies) {
      for (const each of cookieForMounts(c, base)) {
        if (seen.has(each)) continue;
        seen.add(each);
        out.headers.append('Set-Cookie', each);
      }
    }
  }
  return out;
}

/**
 * A page with <base href> first in its head: the client takes its addresses from it. On Cloudflare the page streams
 * through HTMLRewriter. The Node runtime (src/node) has no HTMLRewriter; there a page is one small file that its
 * assets never compress (src/node/assets.ts), so its text is rewritten whole.
 */
export async function withBaseHref(res: Response, base: string): Promise<Response> {
  if (!(res.headers.get('Content-Type') ?? '').includes('text/html')) return res;
  const tag = `<base href="${base}/">`;
  // Under /crm, /finance, /company and /system the page is that product: its title before the script sets the page's own.
  const app = appOf(base);
  const title = base.startsWith(SYSTEM_MOUNT) ? 'BIZOMAT System' : app === CRM_MOUNT ? 'BIZOMAT Customer Relationship Management' : app === FIN_MOUNT ? 'BIZOMAT Finance' : app === COMPANY_MOUNT ? 'BIZOMAT Company' : null;
  if (typeof HTMLRewriter === 'function') {
    let rw = new HTMLRewriter().on('head', { element: (e) => void e.prepend(tag, { html: true }) });
    if (title) rw = rw.on('title', { element: (e) => void e.setInnerContent(title) });
    return rw.transform(res);
  }
  if (!res.body || res.headers.has('Content-Encoding')) return res;
  let html = await res.text();
  if (title) html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  const at = head ? head.index + head[0].length : -1;
  const headers = new Headers(res.headers);
  headers.delete('Content-Length');
  return new Response(at < 0 ? html : html.slice(0, at) + tag + html.slice(at), { status: res.status, statusText: res.statusText, headers });
}

/**
 * A CRM or Finance page asked for on another host than the canonical one (work.kevos.com/crm, bizomat.fly.dev/finance):
 * 301 to the same path on the canonical host (https://bizomat.ai/crm/...), so the session cookie and every link are on
 * one address.
 */
export function crmCanonicalRedirect(request: Request, env: Pick<Env, 'CANONICAL_URL'>, base: string = CRM_MOUNT): Response | null {
  const target = (env.CANONICAL_URL ?? '').trim();
  if (!/^https:\/\/[a-z0-9.-]+(\/[a-z0-9-]+)*\/?$/i.test(target)) return null;
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  const canon = new URL(target);
  if (url.host === canon.host) return null;
  if (url.pathname.startsWith(`${base}/api/`) || !(request.headers.get('Accept') ?? '').includes('text/html')) return null;
  return new Response(null, { status: 301, headers: { Location: `${canon.origin}${url.pathname}${url.search}`, 'Cache-Control': 'public, max-age=3600' } });
}

/**
 * One system: a page asked for at a tool's own address (bizomat.ai/crm/o/x) answers 302 to the same page inside
 * BIZOMAT System (/system/crm/o/x), so every signed-in person works in one place. The API, files and a customer's
 * online document (/finance/view/...) stay where they are. Project Management's sign-in and sign-up pages without a
 * `next` (the website's Sign in) open the System's own, so people land on the System's home.
 */
export function suiteRedirect(request: Request, base: string): Response | null {
  if (!(SUITE_APPS as readonly string[]).includes(base)) return null;
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  if (!(request.headers.get('Accept') ?? '').includes('text/html')) return null;
  const url = new URL(request.url);
  const rest = url.pathname.slice(base.length) || '/';
  if (rest === '/api' || rest.startsWith('/api/') || rest.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(rest)) return null;
  if (base === FIN_MOUNT && rest.startsWith('/view/')) return null;
  const front = base === MOUNT && (rest === '/login' || rest === '/signup') && !url.searchParams.has('next');
  const to = front ? `${SYSTEM_MOUNT}${rest}${url.search}` : `${SYSTEM_MOUNT}${base}${rest}${url.search}`;
  return new Response(null, { status: 302, headers: { Location: to, 'Cache-Control': 'no-store' } });
}

/** The 301 to the canonical address for a page asked for on another host, or null. */
export function canonicalRedirect(request: Request, env: Pick<Env, 'CANONICAL_URL'>): Response | null {
  const target = (env.CANONICAL_URL ?? '').trim().replace(/\/$/, '');
  if (!/^https:\/\/[a-z0-9.-]+(\/[a-z0-9-]+)*$/i.test(target)) return null;
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  const canon = new URL(target);
  if (url.host === canon.host) return null;
  // pages only: /api/ and the static files keep working here (open tabs load them from this host)
  if (url.pathname.startsWith('/api/') || url.pathname === '/api' || !(request.headers.get('Accept') ?? '').includes('text/html')) return null;
  const path = canon.pathname.replace(/\/$/, '') + (url.pathname === '/' ? '/' : url.pathname);
  return new Response(null, { status: 301, headers: { Location: `${canon.origin}${path}${url.search}`, 'Cache-Control': 'public, max-age=3600' } });
}
