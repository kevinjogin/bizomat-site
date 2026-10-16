// The site's Cloudflare Worker. Deployed by `wrangler deploy` (see wrangler.toml), and also bundled into
// dist/_worker.js for Cloudflare Pages "advanced mode" deployments.
//
// One file handles the whole site, so every deployment method works the same way, including
// dashboard drag-and-drop (which does not compile a functions/ folder):
//   /api/chat     → KEVOS® Assistant (Workers AI)
//   /api/contact  → optional contact-form backend
//   /api/assessment                → Engineering Problem Assessment enquiries (server-side validation)
//   /api/assessment/stripe-webhook → optional Stripe payment verification (signature-checked)
//   everything else → the static site from dist/ (env.ASSETS)
import { handleChat, type ChatEnv } from './server/chat/handler.ts';
import { handleContact, type ContactEnv } from './server/contact/handler.ts';
import { handleAssessment } from './server/assessment/handler.ts';
import { handleStripeWebhook, type StripeEnv } from './server/assessment/stripe.ts';

interface AssetsBinding {
  fetch(input: Request | string | URL): Promise<Response>;
}
export interface Env extends ChatEnv, ContactEnv, StripeEnv {
  ASSETS: AssetsBinding;
}

// Injected at build time from the same values written to dist/_headers.
declare const __SECURITY_HEADERS__: Record<string, string>;
const SECURITY_HEADERS: Record<string, string> = typeof __SECURITY_HEADERS__ === 'undefined' ? {} : __SECURITY_HEADERS__;

/** Apply security and caching headers (only where not already present). */
export function withHeaders(response: Response, url: URL): Response {
  const res = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) if (!res.headers.has(name)) res.headers.set(name, value);
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
    let response: Response;
    if (url.pathname === '/api/chat' || url.pathname === '/api/chat/') response = await handleChat(request, env);
    else if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') response = await handleContact(request, env);
    else if (url.pathname === '/api/assessment' || url.pathname === '/api/assessment/') response = await handleAssessment(request, env);
    else if (url.pathname === '/api/assessment/stripe-webhook') response = await handleStripeWebhook(request, env);
    else if (url.pathname.startsWith('/api/')) response = new Response('Not found', { status: 404 });
    else response = await env.ASSETS.fetch(request);
    return withHeaders(response, url);
  },
};
