// The site's Cloudflare Worker. Deployed by `wrangler deploy` (see wrangler.toml), and also bundled into
// dist/_worker.js for Cloudflare Pages "advanced mode" deployments.
//
// One file handles the whole site, so every deployment method works the same way, including
// dashboard drag-and-drop (which does not compile a functions/ folder):
//   /api/chat     → BIZOMAT Assistant (Workers AI)
//   /api/discover → homepage discovery: question → search terms (Workers AI); /api/discover/event → anonymous statistics
//   /api/learn/{intent,plan,lesson,ask} → learning paths built from the Library and Tools (src/server/learn/handler.ts)
//   /api/contact  → optional contact-form backend
//   /api/assessment                → Engineering Problem Assessment enquiries (server-side validation)
//   /api/assessment/stripe-webhook → optional Stripe payment verification (signature-checked)
//   everything else → the static site from dist/ (env.ASSETS)
//
// On bizomat.ai the applications live under the website's address (routeApps below):
//   /cad/...   → CAD Automation: the Worker bizomat-mcp (the CAD service binding); without it, the origin of the
//                bizomat.ai record (Fly)
//   /tasks/... → Project Management: the Worker bizomat-tasks (the TASKS service binding); without it, the origin
import { handleChat, type ChatEnv } from './server/chat/handler.ts';
import { handleDiscover, handleDiscoverEvent, type DiscoverEnv } from './server/discover/handler.ts';
import { handleLearnAsk, handleLearnIntent, handleLearnLesson, handleLearnPlan, type LearnEnv } from './server/learn/handler.ts';
import { handleContact, type ContactEnv } from './server/contact/handler.ts';
import { handleAssessment } from './server/assessment/handler.ts';
import { handleStripeWebhook, type StripeEnv } from './server/assessment/stripe.ts';
import { API_HEADERS, BASELINE_HEADERS, withinEdgeLimit, type RateLimiter } from './server/security.ts';

interface AssetsBinding {
  fetch(input: Request | string | URL): Promise<Response>;
}
interface ServiceBinding {
  fetch(request: Request): Promise<Response>;
}
export interface Env extends ChatEnv, ContactEnv, StripeEnv, DiscoverEnv, LearnEnv {
  ASSETS: AssetsBinding;
  /** Project Management's Worker, bizomat-tasks (wrangler.toml [[services]]); without it, /tasks goes to the origin. */
  TASKS?: ServiceBinding;
  /** CAD Automation's Worker, bizomat-mcp (wrangler.toml [[services]]); without it, CAD_PATHS go to the origin. */
  CAD?: ServiceBinding;
  /** Per-IP burst limits (wrangler.toml [[ratelimits]]). Optional: absent bindings allow requests. */
  CHAT_LIMITER?: RateLimiter;
  FORM_LIMITER?: RateLimiter;
}

/** Production hosts of the website: bizomat.ai (www.bizomat.ai answers 301 there). kevos.com is the KEVOS site, another Worker. */
const PRODUCTION_HOSTS = new Set(['bizomat.ai', 'www.bizomat.ai']);

/** The BIZOMAT platform's address: the website at the root, each application under a path of its own. */
export const PLATFORM_HOST = 'bizomat.ai';

/**
 * Paths of bizomat.ai that belong to CAD Automation. They go to the Worker bizomat-mcp (the CAD binding), or, where it
 * is not bound, to the origin of the bizomat.ai record (the CAD app on Fly) with fetch(request); either way the app
 * answers with its own headers. Besides /cad/... it owns:
 * - the OAuth metadata, which RFC 9728 and RFC 8414 put at the root of the host
 *   (/.well-known/oauth-protected-resource/cad/mcp, /.well-known/oauth-authorization-server/cad);
 * - the addresses programs call at the root, kept for connectors and computers set up while CAD answered there:
 *   the MCP endpoints and the add-in's link (/mcp, /mcp/..., /solidworks/mcp), OAuth (/oauth/...), the Companion's
 *   API (/v2/...) and /healthz;
 * - /.well-known/acme-challenge/..., so Fly can renew the certificate that Cloudflare checks when it connects (always
 *   the origin, see fetch below).
 * The website has none of these paths. The CAD app's list: apps/cad/opensketch/canonical.py (KEEP_PREFIXES).
 */
export const CAD_PATHS = /^\/cad(?:\/|$)|^\/(?:mcp|solidworks\/mcp)(?:\/|$)|^\/oauth\/|^\/v2\/|^\/healthz$|^\/\.well-known\/(?:oauth-protected-resource|oauth-authorization-server|openid-configuration|acme-challenge)(?:\/|$)/;

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
export function withHeaders(response: Response, url: URL): Response {
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
    // The Insights section is retired. public/_redirects sends each /insights/<slug>/ to its Library chapter;
    // anything those rules cannot match exactly reaches the Worker: add the missing trailing slash so the
    // exact rule applies, and send unknown addresses to the Library.
    if (url.pathname === '/insights' || url.pathname.startsWith('/insights/')) {
      const location = url.pathname.endsWith('/') ? new URL('/reados/', url) : new URL(`${url.pathname}/${url.search}`, url);
      return withHeaders(new Response(null, { status: 301, headers: { Location: location.href, 'Cache-Control': 'public, max-age=86400' } }), url);
    }
    let response: Response;
    // Discovery shares the assistant's per-IP limiter, with its own counter (scope).
    const scope = url.pathname.startsWith('/api/chat') ? 'chat' : url.pathname === '/api/discover' || url.pathname === '/api/discover/' ? 'discover' : url.pathname === '/api/discover/event' ? 'discover-event' : url.pathname.startsWith('/api/learn/') ? 'learn' : /^\/api\/(contact|assessment)\/?$/.test(url.pathname) ? 'form' : '';
    if (scope && request.method === 'POST' && !(await withinEdgeLimit(scope === 'form' ? env.FORM_LIMITER : env.CHAT_LIMITER, scope, request))) {
      const body = JSON.stringify({ ok: false, success: false, error: 'Too many requests. Please wait a minute and try again.', message: 'Too many requests. Please wait a minute and try again.' });
      return withHeaders(new Response(body, { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Retry-After': '60' } }), url);
    }
    if (url.pathname === '/api/chat' || url.pathname === '/api/chat/') response = await handleChat(request, env);
    else if (url.pathname === '/api/discover' || url.pathname === '/api/discover/') response = await handleDiscover(request, env);
    else if (url.pathname === '/api/discover/event') response = await handleDiscoverEvent(request, env);
    else if (url.pathname === '/api/learn/intent') response = await handleLearnIntent(request, env);
    else if (url.pathname === '/api/learn/plan') response = await handleLearnPlan(request, env);
    else if (url.pathname === '/api/learn/lesson') response = await handleLearnLesson(request, env);
    else if (url.pathname === '/api/learn/ask') response = await handleLearnAsk(request, env);
    else if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') response = await handleContact(request, env);
    else if (url.pathname === '/api/assessment' || url.pathname === '/api/assessment/') response = await handleAssessment(request, env);
    else if (url.pathname === '/api/assessment/stripe-webhook') response = await handleStripeWebhook(request, env);
    else if (url.pathname.startsWith('/api/')) response = new Response('Not found', { status: 404 });
    else response = await env.ASSETS.fetch(request);
    return withHeaders(response, url);
  },
};
