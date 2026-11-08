// The site's Cloudflare Worker. Deployed by `wrangler deploy` (see wrangler.toml), and also bundled into
// dist/_worker.js for Cloudflare Pages "advanced mode" deployments.
//
// One file handles the whole site, so every deployment method works the same way, including
// dashboard drag-and-drop (which does not compile a functions/ folder):
//   /api/contact  → optional contact-form backend
//   /downloads/<folder>/<file> → public downloads from the R2 bucket bizomat-downloads (src/server/downloads.ts)
//   everything else → the static site from dist/ (env.ASSETS)
//
// On bizomat.ai the applications live under the website's address (routeApps below):
//   /cad/...   → CAD Automation: the Worker bizomat-mcp (the CAD service binding); without it, the origin of the
//                bizomat.ai record (Fly)
//   /tasks/... → Project Management: the Worker bizomat-tasks (the TASKS service binding); without it, the origin
import { handleContact, type ContactEnv } from './server/contact/handler.ts';
import { API_HEADERS, BASELINE_HEADERS, withinEdgeLimit, type RateLimiter } from './server/security.ts';
import { DOWNLOADS_PATH, handleDownload, type DownloadsBucket } from './server/downloads.ts';
import { CAD_PATHS, PLATFORM_HOST, retiredTarget } from './server/platform-paths.ts';

interface AssetsBinding {
  fetch(input: Request | string | URL): Promise<Response>;
}
interface ServiceBinding {
  fetch(request: Request): Promise<Response>;
}
export interface Env extends ContactEnv {
  ASSETS: AssetsBinding;
  /** Project Management's Worker, bizomat-tasks (wrangler.toml [[services]]); without it, /tasks goes to the origin. */
  TASKS?: ServiceBinding;
  /** CAD Automation's Worker, bizomat-mcp (wrangler.toml [[services]]); without it, CAD_PATHS go to the origin. */
  CAD?: ServiceBinding;
  /** Public downloads, the R2 bucket bizomat-downloads (wrangler.toml [[r2_buckets]]); without it, /downloads/ is 404. */
  DOWNLOADS?: DownloadsBucket;
  /** Per-IP burst limit for the contact form (wrangler.toml [[ratelimits]]). Optional: absent bindings allow requests. */
  FORM_LIMITER?: RateLimiter;
}

/** Production hosts of the website: bizomat.ai (www.bizomat.ai answers 301 there). kevos.com is the KEVOS site, another Worker. */
const PRODUCTION_HOSTS = new Set(['bizomat.ai', 'www.bizomat.ai']);

const redirect = (location: string, status: number, cache = 'public, max-age=86400'): Response =>
  new Response(null, { status, headers: { Location: location, 'Cache-Control': cache } });

/** The applications under bizomat.ai, or null when the request is for the website. */
async function routeApps(request: Request, url: URL, env: Env): Promise<Response | null> {
  const read = request.method === 'GET' || request.method === 'HEAD';
  // /CAD, /Tasks/...: one address per page, in lowercase (other methods are left alone and find nothing)
  const app = /^\/(cad|tasks)(?=\/|$)/i.exec(url.pathname);
  if (app && app[1] !== app[1].toLowerCase() && read) {
    return redirect(`/${app[1].toLowerCase()}${url.pathname.slice(app[0].length)}${url.search}`, 301);
  }
  if (CAD_PATHS.test(url.pathname)) return env.CAD ? env.CAD.fetch(request) : fetch(request);
  // without the binding, the origin of the bizomat.ai record (Fly, until it is retired), as for CAD_PATHS
  if (/^\/tasks(?:\/|$)/.test(url.pathname)) return env.TASKS ? env.TASKS.fetch(request) : fetch(request);
  return null;
}

// Injected at build time from the same values written to dist/_headers.
declare const __SECURITY_HEADERS__: Record<string, string>;
const SECURITY_HEADERS: Record<string, string> = typeof __SECURITY_HEADERS__ === 'undefined' ? {} : __SECURITY_HEADERS__;

/** Apply security and caching headers (only where not already present). */
function withHeaders(response: Response, url: URL): Response {
  const res = new Response(response.body, response);
  const isApi = url.pathname.startsWith('/api/');
  for (const set of [SECURITY_HEADERS, BASELINE_HEADERS, isApi ? API_HEADERS : {}]) {
    for (const [name, value] of Object.entries(set)) if (!res.headers.has(name)) res.headers.set(name, value);
  }
  // The page CSP (built with script hashes) describes documents; an API response gets the locked-down one.
  if (isApi) res.headers.set('Content-Security-Policy', API_HEADERS['Content-Security-Policy']);
  if (url.pathname.startsWith('/_astro/')) res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  // Keep preview addresses (Cloudflare, Fly.io) out of search engines; bizomat.ai is the canonical domain.
  if (/\.(pages|workers|fly)\.dev$/.test(url.hostname)) res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const read = request.method === 'GET' || request.method === 'HEAD';
    // Certificate checks for the CAD app's origin are answered there, over either scheme.
    if (url.hostname === PLATFORM_HOST && url.pathname.startsWith('/.well-known/acme-challenge/')) return fetch(request);
    // www.bizomat.ai is another name for bizomat.ai (308 keeps a POST's method and body).
    if (url.hostname === `www.${PLATFORM_HOST}`) {
      return redirect(`https://${PLATFORM_HOST}${url.pathname}${url.search}`, read ? 301 : 308);
    }
    // Upgrade plain-HTTP page requests on the production domains (HSTS then keeps browsers on HTTPS).
    if (url.protocol === 'http:' && PRODUCTION_HOSTS.has(url.hostname) && read) {
      url.protocol = 'https:';
      return new Response(null, { status: 301, headers: { Location: url.href, 'Cache-Control': 'public, max-age=3600' } });
    }
    if (url.hostname === PLATFORM_HOST) {
      const app = await routeApps(request, url, env);
      if (app) return app;
    }
    // The CAD Automation page was /cad/; on bizomat.ai that address is the application itself.
    if ((url.pathname === '/cad' || url.pathname === '/cad/') && read) {
      return withHeaders(redirect(`/cad-automation/${url.search}`, 301), url);
    }
    // Retired sections (Resources, Tools, Library, Insights, AI search and the old service pages; 8 Nov 2026): a 301 to
    // the retained page that replaces each (src/server/platform-paths.ts), the same answer as public/_redirects.
    const retired = read ? retiredTarget(url.pathname) : null;
    if (retired) return withHeaders(redirect(retired, 301), url);
    let response: Response;
    if (/^\/api\/contact\/?$/.test(url.pathname) && request.method === 'POST' && !(await withinEdgeLimit(env.FORM_LIMITER, 'form', request))) {
      const body = JSON.stringify({ ok: false, success: false, error: 'Too many requests. Please wait a minute and try again.', message: 'Too many requests. Please wait a minute and try again.' });
      return withHeaders(new Response(body, { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Retry-After': '60' } }), url);
    }
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') response = await handleContact(request, env);
    else if (url.pathname.startsWith('/api/')) response = new Response('Not found', { status: 404 });
    else if (url.pathname.startsWith(DOWNLOADS_PATH)) response = await handleDownload(request, env.DOWNLOADS);
    else response = await env.ASSETS.fetch(request);
    return withHeaders(response, url);
  },
};
