import type { APIContext } from 'astro';
import { SITE } from '../config/site.ts';

export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site ?? SITE.url).href;
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
