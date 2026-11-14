// robots.txt for bizomat.ai. Public content (the website, Systems, Resources, the Library) is open to every search
// engine and AI search crawler; the crawlers that answer questions with sources (Google, Bing, Apple, OpenAI, Anthropic,
// Perplexity) are named so their own rules say so too (a crawler follows only its own group when one exists).
//
// Closed: the website's APIs and on-site search and chat (not pages), and the applications' APIs. The signed-in
// applications' pages (/erp, /tasks, /crm, /finance, /company, /system, /cad) are NOT disallowed here: they answer
// X-Robots-Tag: noindex, nofollow (infrastructure/proxy/headers.mjs), and Google only sees a noindex on a page it may
// crawl; a disallowed address can still be listed, without its content, when something links to it.
import type { APIContext } from 'astro';
import { SITE } from '../config/site.ts';

/** Crawlers named in their own group (each gets the same rules as everyone else). */
export const NAMED_CRAWLERS = ['Googlebot', 'Bingbot', 'Applebot', 'Google-Extended', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot'];

/** Never pages: the website's APIs, on-site search and chat, and every application's API. */
export const DISALLOW = ['/api/', '/search/', '/chat/', '/erp/api/', '/tasks/api/', '/crm/api/', '/finance/api/', '/company/api/', '/system/api/', '/cad/api/'];

export function robotsTxt(site: string): string {
  const rules = ['Allow: /', ...DISALLOW.map((p) => `Disallow: ${p}`)].join('\n');
  const groups = ['*', ...NAMED_CRAWLERS].map((agent) => `User-agent: ${agent}\n${rules}`).join('\n\n');
  const base = site.replace(/\/$/, '');
  return `# bizomat.ai: public pages are open to search engines and AI search. Signed-in applications answer noindex.\n# A summary for AI systems: ${base}/llms.txt\n\n${groups}\n\nSitemap: ${new URL('sitemap-index.xml', `${base}/`).href}\n`;
}

export function GET(context: APIContext) {
  return new Response(robotsTxt(String(context.site ?? SITE.url)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
