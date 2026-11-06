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
import type { Env } from './env';

export const MOUNT = '/tasks';

/** The path the request came in under: MOUNT, or '' at the root of the host. */
export function mountOf(url: URL): string {
  return url.pathname === MOUNT || url.pathname.startsWith(`${MOUNT}/`) ? MOUNT : '';
}

/** The same request with the mount taken off its path (body, method and headers unchanged). */
export function unmount(request: Request, base: string): Request {
  const url = new URL(request.url);
  url.pathname = url.pathname.slice(base.length) || '/';
  return new Request(url.toString(), request);
}

/** A root path the app wrote, under the mount ("/login" -> "/tasks/login"); anything else as it is. */
export function addBase(value: string, base: string): string {
  if (!base || !value.startsWith('/') || value.startsWith('//')) return value;
  if (value === base || value.startsWith(`${base}/`) || value.startsWith(`${base}?`)) return value;
  return base + value;
}

function cookieUnder(header: string, base: string): string {
  return header.replace(/(;\s*path=)(\/[^;]*)/i, (_m, attr: string, path: string) => attr + (path === '/' ? base : addBase(path, base)));
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
    for (const c of cookies) out.headers.append('Set-Cookie', cookieUnder(c, base));
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
  if (typeof HTMLRewriter === 'function') {
    return new HTMLRewriter().on('head', { element: (e) => void e.prepend(tag, { html: true }) }).transform(res);
  }
  if (!res.body || res.headers.has('Content-Encoding')) return res;
  const html = await res.text();
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  const at = head ? head.index + head[0].length : -1;
  const headers = new Headers(res.headers);
  headers.delete('Content-Length');
  return new Response(at < 0 ? html : html.slice(0, at) + tag + html.slice(at), { status: res.status, statusText: res.statusText, headers });
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
