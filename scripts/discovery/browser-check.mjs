// Browser checks for the homepage discovery feature on a built dist/ (docs/discovery/DEVLOG.md).
// A local static server serves dist/; /api/discover is mocked per scenario (AI answer, no AI, failure, 429, out of scope).
//   npm run build && node scripts/discovery/browser-check.mjs [dist-dir] [screenshot-dir]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(require.resolve('playwright', { paths: ['/opt/node-tools/node_modules', '/opt/node22/lib/node_modules', '/usr/local/lib/node_modules', '/usr/lib/node_modules'] })); }
const { chromium } = playwright;

const DIST = process.argv[2] || join(process.cwd(), 'dist');
const SHOTS = process.argv[3] || tmpdir();
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webp': 'image/webp', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(DIST, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch { f = f + '.html'; }
  try { const b = await readFile(f); res.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4399);
const BASE = 'http://127.0.0.1:4399';

const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`); };

const browser = await chromium.launch();
async function page({ width = 1280, height = 900, api = (q) => ({ status: 200, body: { ok: true, ai: false } }) } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: width < 700, isMobile: width < 700 });
  const pg = await ctx.newPage();
  const errors = [];
  pg.on('pageerror', (e) => errors.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|cloudflareinsights|turnstile|hcaptcha/i.test(m.text())) errors.push(m.text()); });
  const calls = [];
  await pg.route('**/api/discover', async (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    calls.push(body);
    const r = api(body);
    if (r.abort) return route.abort();
    await route.fulfill({ status: r.status, contentType: 'application/json', body: JSON.stringify(r.body) });
  });
  const events = [];
  await pg.route('**/api/discover/event', async (route) => { events.push(JSON.parse(route.request().postData() || '{}')); await route.fulfill({ status: 204 }); });
  return { ctx, pg, errors, calls, events };
}
const ask = async (pg, q, how = 'enter') => {
  await pg.fill('#discover-question', q);
  if (how === 'enter') await pg.press('#discover-question', 'Enter'); else await pg.click('[data-discover-submit]');
  await pg.waitForFunction(() => !document.querySelector('[data-discover-form]')?.classList.contains('is-busy') && document.querySelector('[data-discover-status]')?.textContent, null, { timeout: 15000 });
};
const latest = (pg) => pg.evaluate(() => {
  const ex = document.querySelector('[data-discover-thread] .dr-exchange');
  if (!ex) return null;
  return {
    say: [...ex.querySelectorAll('.dr-say')].map((n) => n.textContent),
    groups: [...ex.querySelectorAll('.dr-group')].map((g) => ({ title: g.querySelector('.dr-group__title').textContent, links: [...g.querySelectorAll('.dr-card__title a')].map((a) => a.getAttribute('href')), ctas: [...g.querySelectorAll('.dr-card__cta')].map((a) => a.getAttribute('href')) })),
    options: [...ex.querySelectorAll('.dr-options button')].map((b) => b.textContent),
    suggest: !!ex.querySelector('a[href="/contact/"]'),
  };
});
const noSideScroll = (pg) => pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
const exists = async (href) => { const u = new URL(href, BASE); const r = await fetch(BASE + u.pathname); return r.status === 200; };

try {
  // 1. Render and chatbot transition
  {
    const { ctx, pg, errors } = await page();
    await pg.goto(BASE + '/');
    check('hero H1 asks the question', (await pg.textContent('#home-title')).trim() === 'What would you like to solve today?');
    check('question box visible', await pg.isVisible('#discover-question'));
    check('six example chips', (await pg.locator('[data-discover-example]').count()) === 6);
    check('results hidden before asking', await pg.locator('[data-discover-results]').isHidden());
    check('no floating assistant on the homepage', (await pg.locator('.assistant__launcher').count()) === 0);
    check('one hero: no second product hero below it', (await pg.locator('.product, #home-workos-search').count()) === 0 && (await pg.locator('h1').count()) === 1);
    check('dark theme by default', (await pg.getAttribute('html', 'data-theme')) === 'dark');
    check('clear button hidden while the box is empty', await pg.locator('[data-discover-clear]').isHidden());
    check('Explore WORKOS / READOS buttons kept', (await pg.locator('[data-cta="hero-workos"]').count()) === 1 && (await pg.locator('[data-cta="hero-reados"]').count()) === 1);
    // Shift+Enter adds a line, does not submit
    await pg.fill('#discover-question', 'line one');
    await pg.press('#discover-question', 'Shift+Enter');
    await pg.type('#discover-question', 'line two');
    check('Shift+Enter adds a new line without sending', (await pg.inputValue('#discover-question')).includes('\n') && await pg.locator('[data-discover-results]').isHidden());
    // clear button
    check('clear button shows when typing', await pg.isVisible('[data-discover-clear]'));
    await pg.click('[data-discover-clear]');
    check('clear empties the box and hides itself', (await pg.inputValue('#discover-question')) === '' && await pg.locator('[data-discover-clear]').isHidden());
    // empty submit
    await pg.click('[data-discover-submit]');
    check('empty question gives a message', /type a question/i.test(await pg.textContent('[data-discover-status]')));
    check('no console errors on the homepage', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  // 2. A real question, fallback search (AI says ai:false)
  {
    const { ctx, pg, errors, events } = await page();
    await pg.goto(BASE + '/');
    await ask(pg, 'How much money am I losing when my machine is sitting idle?');
    const r = await latest(pg);
    check('results section shown', await pg.locator('[data-discover-results]').isVisible());
    const tools = r.groups.find((g) => g.title === 'Recommended tools');
    check('Recommended tools group with downtime-cost', !!tools && tools.links.some((h) => /downtime-cost/.test(h)), JSON.stringify(tools?.links));
    check('at most 5 tools', tools.links.length <= 5);
    let allExist = true; const missing = [];
    for (const g of r.groups) for (const h of [...g.links, ...g.ctas]) if (!(await exists(h))) { allExist = false; missing.push(h); }
    check('every result link resolves to a built page', allExist, missing.join(', '));
    await pg.waitForTimeout(900);
    check('page scrolled to the results', await pg.evaluate(() => Math.abs(document.getElementById('discover').getBoundingClientRect().top) < 200), String(await pg.evaluate(() => document.getElementById('discover').getBoundingClientRect().top)));
    check('focus moved to results heading', await pg.evaluate(() => document.activeElement?.id === 'discover-title'));
    check('box cleared and placeholder says follow-up', (await pg.inputValue('#discover-question')) === '' && /follow-up/i.test(await pg.getAttribute('#discover-question', 'placeholder')));
    check('anonymous search event sent without the question text', events.length > 0 && !JSON.stringify(events).includes('sitting idle'), JSON.stringify(events[0]));
    // follow-up uses context
    await ask(pg, 'what about for a whole shift?');
    check('follow-up appears above, two exchanges kept', (await pg.locator('.dr-exchange').count()) === 2);
    // keep at most 5
    for (const q of ['bend allowance for sheet metal', 'margin vs markup', 'convert psi to bar', 'how to calculate OEE']) await ask(pg, q);
    check('only the last 5 exchanges kept', (await pg.locator('.dr-exchange').count()) === 5);
    // Open tool link works (calculator app URL loads)
    const cta = await pg.locator('.dr-exchange').first().locator('.dr-group').first().locator('.dr-card__cta').first().getAttribute('href');
    check('Open tool link points at the calculator', /^\/tools\/\?tool=[a-z0-9-]+/.test(cta), cta);
    check('no console errors while asking', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  // 3. AI intent used, summary shown
  {
    const { ctx, pg, calls } = await page({ api: () => ({ status: 200, body: { ok: true, ai: true, intent: { summary: 'cut the cost of machine downtime', terms: ['downtime cost', 'machine utilisation'], ambiguous: false } } }) });
    await pg.goto(BASE + '/');
    await ask(pg, 'my machines keep stopping and it costs us');
    const r = await latest(pg);
    check('AI restatement shown', r.say.some((s) => /I understand you're trying to cut the cost of machine downtime/.test(s)), r.say[0]);
    check('AI terms help ranking (downtime tool found)', r.groups[0]?.links.some((h) => /downtime/.test(h)), JSON.stringify(r.groups[0]?.links));
    check('question sent, context empty on first ask', calls[0].question.startsWith('my machines') && !calls[0].context);
    check('a shortlist of real catalogue entries is sent for the AI to pick from', Array.isArray(calls[0].candidates) && calls[0].candidates.length > 0 && calls[0].candidates.every((c) => c.id && c.name && ['tool', 'chapter', 'book'].includes(c.kind)), JSON.stringify(calls[0].candidates?.slice(0, 2)));
    await ctx.close();
  }
  // 3b. AI picks lead the results
  {
    let sent;
    const { ctx, pg } = await page({ api: (body) => { sent = body.candidates; const tool = body.candidates.filter((c) => c.kind === 'tool')[2]; return { status: 200, body: { ok: true, ai: true, intent: { terms: ['downtime'], ambiguous: false, picks: [tool.id] } } }; } });
    await pg.goto(BASE + '/');
    await ask(pg, 'How can I reduce machine downtime?');
    const pickedId = sent.filter((c) => c.kind === 'tool')[2].id;
    const first = await pg.locator('.dr-exchange .dr-group').first().locator('.dr-card').first();
    check('the AI pick leads the tools and is marked', (await first.getAttribute('class')).includes('dr-card--ai') && (await first.locator('.dr-card__title a').getAttribute('href')).includes(pickedId), pickedId);
    await ctx.close();
  }
  // 4. Broad question -> clarify
  {
    const { ctx, pg } = await page();
    await pg.goto(BASE + '/');
    await ask(pg, 'cost');
    const r = await latest(pg);
    check('broad question asks to clarify with choices', r.options.length >= 2, JSON.stringify(r));
    await pg.locator('.dr-options button').first().click();
    await pg.waitForFunction(() => document.querySelectorAll('.dr-exchange').length === 2, null, { timeout: 15000 });
    check('choosing an option runs a refined question', /^cost: /.test(await pg.locator('.dr-exchange__q').first().textContent()));
    await ctx.close();
  }
  // 5. Out of scope (keyword fallback) and AI-marked out of scope
  {
    const { ctx, pg } = await page();
    await pg.goto(BASE + '/');
    await ask(pg, 'weather forecast tomorrow');
    let r = await latest(pg);
    check('no-match is honest, with suggestion link', r.say.some((s) => /could not find/.test(s)) && r.suggest && !r.groups.some((g) => g.title === 'Recommended tools'), JSON.stringify(r));
    await ctx.close();
    const b = await page({ api: () => ({ status: 200, body: { ok: true, ai: true, intent: { terms: [], ambiguous: false, outOfScope: true } } }) });
    await b.pg.goto(BASE + '/');
    await ask(b.pg, 'plan my wedding');
    r = await latest(b.pg);
    check('AI out-of-scope gives the "outside what KEVOS covers" message', r.say.some((s) => /outside what KEVOS/.test(s)) && r.groups.length === 0);
    await b.ctx.close();
  }
  // 6. Failures: 500, network abort, 429
  {
    for (const [label, api] of [['500', () => ({ status: 500, body: { ok: false } })], ['network failure', () => ({ abort: true })]]) {
      const { ctx, pg } = await page({ api });
      await pg.goto(BASE + '/');
      await ask(pg, 'what is my break even point');
      const r = await latest(pg);
      check(`AI ${label}: falls back to keyword results`, r.groups[0]?.links.some((h) => /break-even/.test(h)), JSON.stringify(r?.groups?.[0]));
      await ctx.close();
    }
    const { ctx, pg } = await page({ api: () => ({ status: 429, body: { ok: false, error: 'Too many questions. Please wait a minute.' } }) });
    await pg.goto(BASE + '/');
    await ask(pg, 'margin vs markup');
    check('429 shows the rate-limit message', /Too many questions/.test(await pg.textContent('[data-discover-status]')));
    await ctx.close();
  }
  // 7. Mobile 390 px, example chip, ?q=
  {
    const { ctx, pg, errors } = await page({ width: 390, height: 844 });
    await pg.goto(BASE + '/');
    check('mobile: no sideways scroll before asking', await noSideScroll(pg));
    await pg.locator('[data-discover-example]').first().click();
    await pg.waitForFunction(() => document.querySelectorAll('.dr-exchange').length === 1, null, { timeout: 15000 });
    check('mobile: example chip runs a question', true);
    check('mobile: no sideways scroll with results', await noSideScroll(pg));
    const small = await pg.evaluate(() => [...document.querySelectorAll('.dq__submit, .dq__clear, .dr-card__cta, .dr__new')].filter((n) => n.offsetParent).map((n) => n.getBoundingClientRect().height).filter((h) => h < 43.5).length);
    check('mobile: touch targets at least 44 px', small === 0, String(small));
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: SHOTS + '/discovery-mobile.png', fullPage: false });
    await pg.goto(BASE + '/?q=' + encodeURIComponent('how much will this beam deflect'));
    await pg.waitForFunction(() => document.querySelectorAll('.dr-exchange').length === 1, null, { timeout: 15000 });
    check('/?q= runs the question on load', (await latest(pg)).groups[0]?.links.some((h) => /beam-deflection/.test(h)));
    check('mobile: no console errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  // 8. Light theme (session), keyboard only, other pages keep the assistant
  {
    const { ctx, pg } = await page();
    await pg.goto(BASE + '/');
    await pg.evaluate(() => { sessionStorage.setItem('kevos-theme', 'light'); });
    await pg.reload();
    check('light theme applies for the session', (await pg.getAttribute('html', 'data-theme')) === 'light');
    await pg.focus('#discover-question');
    await pg.keyboard.type('pressure vessel wall thickness');
    await pg.keyboard.press('Enter');
    await pg.waitForFunction(() => document.querySelectorAll('.dr-exchange').length === 1, null, { timeout: 15000 });
    await pg.keyboard.press('Tab');
    const tag = await pg.evaluate(() => document.activeElement?.tagName + ' ' + (document.activeElement?.className || ''));
    check('keyboard: Tab from results heading reaches a control', /BUTTON|A /.test(tag), tag);
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: SHOTS + '/discovery-desktop-light.png' });
    await pg.goto(BASE + '/tools/');
    check('no floating assistant on /tools/', (await pg.locator('.assistant__launcher').count()) === 0);
    await pg.goto(BASE + '/contact/');
    check('no floating assistant or assistant section on /contact/', (await pg.locator('.assistant__launcher, #assistant').count()) === 0);
    await ctx.close();
  }
  // 8b. WORKOS directory search asks KEVOS AI for a question in plain words
  {
    let asked = 0;
    const { ctx, pg, errors } = await page({ api: (body) => { asked++; return { status: 200, body: { ok: true, ai: true, intent: { terms: ['keyhole welding', 'laser welding'], ambiguous: false, picks: ['fillet-weld-strength'] } } }; } });
    await pg.goto(BASE + '/tools/');
    await pg.fill('[data-lib-input]', 'where is keyhole and how much');
    await pg.waitForSelector('[data-ai-pick]', { timeout: 15000 });
    const first = pg.locator('[data-lib-results-grid] > *').first();
    check('/tools/: the AI pick appears first in the results', (await first.getAttribute('data-tool-id')) === 'fillet-weld-strength' || (await first.innerHTML()).includes('fillet-weld-strength'));
    check('/tools/: the "no match" box is hidden once AI finds a tool', await pg.locator('[data-lib-empty]').isHidden());
    check('/tools/: the note says the AI chose it', /chosen by KEVOS® AI/.test(await pg.textContent('[data-lib-ai-note]')));
    await pg.fill('[data-lib-input]', 'oee');
    await pg.waitForTimeout(1000);
    check('/tools/: a short keyword search with matches does not call the AI', asked === 1 && (await pg.locator('[data-ai-pick]').count()) === 0, String(asked));
    check('/tools/: no console errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  // 9. No-JS fallback
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/');
    await pg.fill('#discover-question', 'bolt torque');
    await pg.click('[data-discover-submit]');
    await pg.waitForLoadState('load');
    check('without JavaScript the box goes to /search/?q=', new URL(pg.url()).pathname === '/search/' && new URL(pg.url()).searchParams.get('q') === 'bolt torque', pg.url());
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
