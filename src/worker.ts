// The site's Cloudflare Worker. Deployed by `wrangler deploy` (see wrangler.toml), and also bundled into
// dist/_worker.js for Cloudflare Pages "advanced mode" deployments.
//
// One file handles the whole site, so every deployment method works the same way, including
// dashboard drag-and-drop (which does not compile a functions/ folder):
//   /api/chat     → KEVOS® Assistant (Workers AI)
//   /api/discover → homepage discovery: question → search terms (Workers AI); /api/discover/event → anonymous statistics
//   /api/learn/{intent,plan,lesson,ask} → learning paths built from the Library and Tools (src/server/learn/handler.ts)
//   /api/contact  → optional contact-form backend
//   /api/assessment                → Engineering Problem Assessment enquiries (server-side validation)
//   /api/assessment/stripe-webhook → optional Stripe payment verification (signature-checked)
//   everything else → the static site from dist/ (env.ASSETS)
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
export interface Env extends ChatEnv, ContactEnv, StripeEnv, DiscoverEnv, LearnEnv {
  ASSETS: AssetsBinding;
  /** Per-IP burst limits (wrangler.toml [[ratelimits]]). Optional: absent bindings allow requests. */
  CHAT_LIMITER?: RateLimiter;
  FORM_LIMITER?: RateLimiter;
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
  // Keep Cloudflare preview addresses out of search engines; kevos.com is the canonical domain.
  if (/\.(pages|workers)\.dev$/.test(url.hostname)) res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // Upgrade plain-HTTP page requests on the production domain (HSTS then keeps browsers on HTTPS).
    if (url.protocol === 'http:' && url.hostname === 'kevos.com' && (request.method === 'GET' || request.method === 'HEAD')) {
      url.protocol = 'https:';
      return new Response(null, { status: 301, headers: { Location: url.href, 'Cache-Control': 'public, max-age=3600' } });
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
