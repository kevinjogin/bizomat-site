// Search rules (owner, 14 Nov 2026: "clean SEO and create proper rules so nothing is negative for this site"): robots.txt
// keeps public content open to search engines and AI search, the applications' APIs closed, and never hides an
// application page that must show its noindex; llms.txt says only what the site says.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DISALLOW, NAMED_CRAWLERS, robotsTxt } from '../src/pages/robots.txt.ts';
import { llmsTxt } from '../src/pages/llms.txt.ts';
import { checkRobots } from '../scripts/seo/validate.mjs';
import { SYSTEMS } from '../src/config/systems.ts';

const robots = robotsTxt('https://bizomat.ai');

test('robots.txt passes the SEO validator: every crawler group leaves the public pages open', () => {
  assert.deepEqual(checkRobots(robots), []);
  assert.match(robots, /^Sitemap: https:\/\/bizomat\.ai\/sitemap-index\.xml$/m);
});

test('robots.txt names the search and AI crawlers, each with the same rules as everyone else', () => {
  for (const agent of ['*', ...NAMED_CRAWLERS]) {
    const group = robots.split(/\n\n/).find((g) => g.startsWith(`User-agent: ${agent}\n`));
    assert.ok(group, agent);
    assert.match(group!, /^Allow: \/$/m, agent);
    for (const p of DISALLOW) assert.ok(group!.includes(`Disallow: ${p}\n`) || group!.endsWith(`Disallow: ${p}`), `${agent} ${p}`);
  }
  for (const agent of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Bingbot', 'Applebot']) assert.ok(NAMED_CRAWLERS.includes(agent), agent);
});

test('robots.txt closes the APIs but never an application page, whose noindex crawlers must be able to read', () => {
  for (const api of ['/api/', '/erp/api/', '/tasks/api/', '/crm/api/', '/finance/api/', '/company/api/', '/system/api/', '/cad/api/']) assert.ok(DISALLOW.includes(api), api);
  for (const page of ['/erp/', '/tasks/', '/crm/', '/finance/', '/company/', '/system/', '/cad/', '/systems/', '/resources/']) {
    assert.ok(!DISALLOW.includes(page), page);
  }
});

test('llms.txt lists every system with its page, says what is planned, and claims nothing the site does not', () => {
  const text = llmsTxt('https://bizomat.ai');
  assert.match(text, /^# BIZOMAT$/m);
  for (const s of SYSTEMS) assert.ok(text.includes(`[${s.name}](https://bizomat.ai${s.url})`), s.name);
  assert.match(text, /Manufacturing and Operations.*\(Planned\)/);
  assert.match(text, /not a certified tax, payroll or statutory accounting product/);
  for (const banned of [/rating/i, /\breviews?\b/i, /testimonial/i, /\btrusted by\b/i, /\b(our|happy|satisfied) customers\b/i, /\d+ (customers|users|companies)\b/i, /system-preview/]) assert.doesNotMatch(text, banned);
});

test('the retired design preview is linked from nowhere on the website, and its addresses answer 301', () => {
  const redirects = fs.readFileSync('public/_redirects', 'utf8');
  for (const from of ['/system-preview', '/system-preview/*', '/erp-design-preview', '/erp-design-preview/*']) {
    assert.match(redirects, new RegExp(`^${from.replace(/[*/]/g, '\\$&')} /systems/erp/ 301$`, 'm'), from);
  }
  const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
  for (const file of [...walk('src/pages'), ...walk('src/config'), ...walk('src/components')].filter((f) => /\.(astro|ts|tsx|md|mdx)$/.test(f))) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /system-preview|erp-design-preview/, file);
  }
  assert.doesNotMatch(fs.readFileSync('apps/work/src/client/system/SystemApp.tsx', 'utf8'), /system-preview/);
});
