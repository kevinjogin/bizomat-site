// Browser checks for the homepage discovery feature on a built dist/ (docs/discovery/DEVLOG.md).
// A local static server serves dist/; /api/discover and /api/learn/* are mocked per scenario (AI answer, no AI, failure, 429, out of scope).
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
async function page({ width = 1280, height = 900, api = (q) => ({ status: 200, body: { ok: true, ai: false } }), learn = () => ({ status: 200, body: { ok: true, ai: false } }) } = {}) {
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
  // Learning paths: /api/learn/{intent,plan,lesson,ask}, mocked per scenario (default: no AI, as without the binding).
  const learnCalls = [];
  await pg.route('**/api/learn/*', async (route) => {
    const step = new URL(route.request().url()).pathname.split('/').pop();
    const raw = route.request().postData() || '{}';
    const body = JSON.parse(raw);
    learnCalls.push({ step, body, size: raw.length });
    const r = await learn(step, body);
    if (r.abort) return route.abort();
    await route.fulfill({ status: r.status, contentType: 'application/json', body: JSON.stringify(r.body) });
  });
  const events = [];
  await pg.route('**/api/discover/event', async (route) => { events.push(JSON.parse(route.request().postData() || '{}')); await route.fulfill({ status: 204 }); });
  return { ctx, pg, errors, calls, events, learnCalls };
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
    check('hero H1 asks the question', (await pg.textContent('#home-title')).trim() === 'What would you like to learn or achieve?');
    check('question box visible', await pg.isVisible('#discover-question'));
    check('seven example prompts', (await pg.locator('[data-discover-example]').count()) === 7);
    check('results hidden before asking', await pg.locator('[data-discover-results]').isHidden());
    check('no floating assistant on the homepage', (await pg.locator('.assistant__launcher').count()) === 0);
    check('one hero: no second product hero below it', (await pg.locator('.product, #home-workos-search').count()) === 0 && (await pg.locator('h1').count()) === 1);
    check('dark theme by default', (await pg.getAttribute('html', 'data-theme')) === 'dark');
    check('clear button hidden while the box is empty', await pg.locator('[data-discover-clear]').isHidden());
    check('Explore Tools / Library buttons kept', (await pg.locator('[data-cta="hero-workos"]').count()) === 1 && (await pg.locator('[data-cta="hero-reados"]').count()) === 1);
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
    check('empty question gives a message', /describe what you would like to learn/i.test(await pg.textContent('[data-discover-status]')));
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
  // 3c. Your Solution Path: a keyword path first, then the AI path in its place
  {
    let release;
    const gate = new Promise((r) => { release = r; });
    let sent;
    const { ctx, pg, errors } = await page({ api: (body) => { sent = body.candidates; return { status: 200, body: { ok: true, ai: true, intent: (() => {
      const n = (pred) => body.candidates.findIndex(pred) + 1;
      return { summary: 'tighten an M12 bolt to the right torque', terms: ['bolt torque'], ambiguous: false, plan: { type: 'calculation', missing: ['the bolt property class'], assumptions: ['A steel joint'], outcome: 'A tightening torque for your bolt, checked against proof load',
        steps: [
          { do: 'Read how torque becomes preload', why: 'Friction takes most of the torque', reads: [body.candidates[n((c) => c.kind === 'chapter') - 1].id] },
          { do: 'Calculate the tightening torque', why: 'The tool applies the nut factor method', tools: ['bolt-torque-preload'], check: 'Compare with the fastener supplier table' },
        ] } };
    })() } }; } });
    // Hold the AI answer so the first (keyword) path can be seen.
    await pg.route('**/api/discover', async (route) => { const b = JSON.parse(route.request().postData() || '{}'); await gate; const n = (pred) => b.candidates.findIndex(pred) + 1; const ch = b.candidates[n((c) => c.kind === 'chapter') - 1]; await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, ai: true, intent: { summary: 'tighten an M12 bolt to the right torque', terms: ['bolt torque'], ambiguous: false, plan: { type: 'calculation', missing: ['the bolt property class'], assumptions: ['A steel joint'], outcome: 'A tightening torque for your bolt, checked against proof load', steps: [{ do: 'Read how torque becomes preload', why: 'Friction takes most of the torque', reads: ch ? [ch.id] : [] }, { do: 'Calculate the tightening torque', why: 'The tool applies the nut factor method', tools: ['bolt-torque-preload'], check: 'Compare with the fastener supplier table' }] } } }) }); });
    await pg.goto(BASE + '/');
    await pg.fill('#discover-question', 'what torque should I tighten an M12 bolt to');
    await pg.press('#discover-question', 'Enter');
    await pg.waitForSelector('.sp', { timeout: 15000 });
    check('path: a first path appears before the AI answers', (await pg.locator('.sp__pending').count()) === 1 && /workflow/.test(await pg.textContent('.sp__by')));
    check('path: titled "Your Solution Path" with numbered steps', (await pg.textContent('.sp__title')) === 'Your Solution Path' && (await pg.locator('.sp__step').count()) >= 2);
    release();
    await pg.waitForFunction(() => document.querySelector('.sp__by')?.textContent?.includes('KEVOS® AI') && !document.querySelector('.sp__pending'), null, { timeout: 15000 });
    check('path: the AI path replaces the first one in place', (await pg.locator('.dr-exchange').count()) === 1 && (await pg.locator('.sp').count()) === 1);
    const labels = await pg.$$eval('.sp__step:nth-child(2) .sp__label', (n) => n.map((x) => x.textContent));
    check('path: a tool step shows why, tool, inputs, output and check', ['Why it matters', 'Which tool to use', 'Required inputs', 'Expected output', 'How to check the result'].every((l) => labels.includes(l)), labels.join(' | '));
    check('path: inputs come from the tool', /Nominal diameter \(mm\)/.test(await pg.textContent('.sp__step:nth-child(2)')) && (await pg.locator('.sp__step:nth-child(2) .sp__src', { hasText: 'from the tool' }).count()) >= 2);
    check('path: missing information, assumptions and outcome shown', /bolt property class/.test(await pg.textContent('.sp__missing')) && /steel joint/.test(await pg.textContent('.sp__assume')) && /tightening torque/.test(await pg.textContent('.sp__outcome')));
    const hrefs = await pg.$$eval('.sp a', (as) => as.map((a) => a.getAttribute('href')));
    const bad = []; for (const h of hrefs) if (!(await exists(h))) bad.push(h);
    check('path: every path link opens a real page', hrefs.length >= 3 && bad.length === 0, bad.join(', '));
    check('path: existing resource groups are kept below', (await pg.locator('.dr-all').count()) === 1 && (await pg.locator('.dr-group__title', { hasText: 'Recommended tools' }).count()) === 1);
    check('path: no console errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  // 3d. Path on a phone, and without AI
  {
    const { ctx, pg } = await page({ width: 390, height: 844 });
    await pg.goto(BASE + '/');
    await ask(pg, 'why does my bearing keep failing');
    check('path (no AI): troubleshooting workflow path shown', /Troubleshooting/.test(await pg.textContent('.sp__type')) && !(await pg.locator('.sp__pending').count()));
    check('path (no AI): first step lists the information to gather', /Information to gather/.test(await pg.textContent('.sp__step:first-child')));
    check('path: no sideways scroll on a phone', await noSideScroll(pg));
    await pg.locator('.sp').screenshot({ path: SHOTS + '/solution-path-mobile.png' });
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
    const b = await page({ api: () => ({ status: 200, body: { ok: true, ai: true, intent: { terms: [], ambiguous: false, outOfScope: true } } }), learn: (step) => (step === 'intent' ? { status: 200, body: { ok: true, ai: true, intent: { subject: 'a wedding', objective: '', outcome: '', level: 'mixed', depth: 'structured', topics: [], outOfScope: true } } } : { status: 200, body: { ok: true, ai: false } }) });
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
    await pg.fill('#discover-question', 'How much money am I losing when my machine is sitting idle?');
    await pg.click('[data-discover-submit]');
    await pg.waitForFunction(() => document.querySelectorAll('.dr-exchange').length === 1, null, { timeout: 15000 });
    check('mobile: a question runs from the button', true);
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
  // 10. Learning paths ("Build My Learning Path"), with KEVOS® AI mocked
  {
    const plan = (body) => {
      // A plan over the numbered candidates the browser sent: three modules of two lessons.
      const n = body.readings.length;
      const lesson = (i, t) => ({ title: `Lesson on ${body.readings[i % n].title}`, objective: 'Explain the idea and apply it to your own site.', reads: [(i % n) + 1], tools: t });
      return { ok: true, ai: true, course: { title: 'Manufacturing process improvement, step by step', description: 'From losses to lasting improvement.', level: 'mixed', objectives: ['Find the biggest losses', 'Run an improvement trial'], outcomes: ['A measured improvement'], gaps: ['Statistical process control in depth'],
        modules: [{ title: 'Foundations', summary: 'What improvement means.', lessons: [lesson(0, body.tools.length ? [body.tools[0].id] : []), lesson(1, [])] }, { title: 'Methods', summary: '', lessons: [lesson(2, []), lesson(3, [])] }, { title: 'Application', summary: '', lessons: [lesson(4, []), lesson(5, [])] }].map((m) => ({ ...m, lessons: m.lessons.map((l) => ({ ...l, reads: [body.readings[l.reads[0] - 1].id], tools: l.tools })) })) } };
    };
    const lessonReply = { ok: true, ai: true, lesson: { explanation: 'Improvement starts with seeing where time and material are lost.', why: 'You fix the biggest loss first.', concepts: ['Losses', 'Standard work'],
      key: { principle: 'Measure the loss before you change the process.', essential: 'A baseline.', why: 'Without one you cannot tell if a change helped.', misunderstandings: ['Busy machines are not productive machines.'], implications: 'Record stops for a week first.', remember: ['Measure first', 'Change one thing at a time', 'Standardise what works'], basis: 'source' },
      example: 'A press line records every stop for a week before changing anything.', exercises: [{ task: 'Enter your own shift data in the tool.', tool: 1 }],
      checks: [{ q: 'What comes first?', options: ['Change the process', 'Measure the loss'], answer: 1, explain: 'A baseline shows whether a change helped.' }],
      verify: ['I can name my biggest loss.'], completion: ['Knowledge check answered'], readingNotes: [{ n: 1, why: 'It explains the losses.', understand: 'How losses are classified.' }], toolNotes: [], assumptions: ['Your site records stops.'] } };
    const learn = (step, body) => step === 'intent'
      ? { status: 200, body: { ok: true, ai: true, intent: { subject: 'manufacturing process improvement', objective: 'Improve a process', outcome: 'Less waste', level: 'mixed', depth: 'complete', topics: [{ name: 'Lean and continuous improvement', terms: ['continuous improvement', 'lean'] }, { name: 'Downtime and OEE', terms: ['oee', 'downtime'] }] } } }
      : step === 'plan' ? { status: 200, body: plan(body) }
      : step === 'lesson' ? { status: 200, body: lessonReply }
      : { status: 200, body: { ok: true, ai: true, answer: { answer: 'Start with the line that loses the most time.', basis: 'source', refs: [1] } } };
    const { ctx, pg, errors, learnCalls } = await page({ learn });
    await pg.goto(BASE + '/');
    // Example prompts fill the box; they do not send.
    await pg.locator('[data-discover-example]').nth(1).click();
    check('learn: an example fills the box without sending', (await pg.inputValue('#discover-question')) === 'I want to become better at manufacturing management.' && await pg.locator('[data-discover-results]').isHidden() && learnCalls.length === 0);
    check('learn: the button says Build My Learning Path', /Build My Learning Path/.test(await pg.textContent('[data-discover-submit]')));
    await ask(pg, 'I want to learn manufacturing process improvement.', 'click');
    await pg.waitForSelector('.lc', { timeout: 15000 });
    await pg.waitForFunction(() => /Planned by KEVOS® AI/.test(document.querySelector('.lc__eyebrow')?.textContent ?? ''), null, { timeout: 15000 });
    check('learn: the AI course replaces the Library draft in place', (await pg.locator('.lc').count()) === 1 && (await pg.textContent('.lc__title')) === 'Manufacturing process improvement, step by step');
    check('learn: results titled "Your learning path"', (await pg.textContent('#discover-title')).trim() === 'Your learning path');
    const facts = await pg.locator('.lc__facts dt').allTextContents();
    check('learn: overview shows level, depth, modules, lessons and study time', ['Level', 'Learning depth', 'Modules', 'Lessons', 'Estimated study time'].every((f) => facts.includes(f)), facts.join(' | '));
    check('learn: Complete Course is the selected depth', (await pg.locator('.lc-chip[aria-pressed="true"]').first().textContent()) === 'Complete Course');
    check('learn: 3 modules, 6 lessons in the contents', (await pg.locator('.lc-mod').count()) === 3 && (await pg.locator('.lc-mod__lessons .lc-navlink').count()) === 6);
    check('learn: missing coverage is named', /Statistical process control/.test(await pg.textContent('.lc-gap')));
    const planCall = learnCalls.find((c) => c.step === 'plan');
    check('learn: the plan gets real catalogue entries only, by id', planCall && planCall.body.readings.length >= 6 && planCall.body.readings.every((r) => /^\/reados\//.test(r.id)) && planCall.body.depth === 'complete');
    await pg.click('.lc-primary');
    await pg.waitForSelector('.lc-key .lc-key__label', { timeout: 15000 });
    await pg.waitForFunction(() => document.activeElement?.classList.contains('lc-lesson__title'), null, { timeout: 5000 }).catch(() => {});
    check('learn: opening a lesson moves focus to its title', await pg.evaluate(() => document.activeElement?.classList.contains('lc-lesson__title')));
    const keyLabels = await pg.locator('.lc-key__label').allTextContents();
    await pg.locator('.lc__main').screenshot({ path: SHOTS + '/learning-lesson-desktop.png' });
    check('learn: THE KEY THINGS TO UNDERSTAND box with principle, misunderstandings and what to remember', (await pg.textContent('.lc-key__title')) === 'THE KEY THINGS TO UNDERSTAND' && ['Central principle', 'Common misunderstandings', 'What to remember'].every((l) => keyLabels.includes(l)), keyLabels.join(' | '));
    check('learn: the key things say they summarise the Library readings', /summary of the Library readings/.test(await pg.textContent('.lc-key')));
    const secs = await pg.locator('.lc-sec__title').allTextContents();
    check('learn: Learn, Read, Apply, Practise and Verify sections', ['Learn', 'Read', 'Apply', 'Practise', 'Verify'].every((t) => secs.some((x) => x.startsWith(t))), secs.join(' | '));
    const lessonCall = learnCalls.find((c) => c.step === 'lesson');
    check('learn: a lesson sends short Library excerpts, not whole chapters', lessonCall && lessonCall.size < 24000 && lessonCall.body.sources.length >= 1 && typeof lessonCall.body.sources[0].outline.s === 'string', String(lessonCall?.size));
    const hrefs = await pg.locator('.lc a').evaluateAll((as) => as.map((x) => x.getAttribute('href')));
    const bad = []; for (const h of new Set(hrefs)) if (!(await exists(h))) bad.push(h);
    check('learn: every course link opens a real page', hrefs.length >= 3 && bad.length === 0, bad.join(', '));
    // Knowledge check and retake
    await pg.locator('.lc-quiz input[value="1"]').check();
    await pg.click('.lc-quiz button[type="submit"]');
    check('learn: knowledge check marks the answer', (await pg.textContent('.lc-quiz__result')) === '1 of 1 correct.' && (await pg.locator('.lc-quiz__fb.is-right').count()) === 1);
    await pg.click('.lc-quiz button:has-text("Retake")');
    check('learn: retake clears the check', (await pg.textContent('.lc-quiz__result')) === '' && !(await pg.locator('.lc-quiz input:checked').count()));
    // Follow-up question in the lesson's context
    await pg.fill('.lc-ask__form input', 'Where should I start?');
    await pg.click('.lc-ask__form button');
    await pg.waitForFunction(() => /Start with the line/.test(document.querySelector('.lc-ask__a')?.textContent ?? ''), null, { timeout: 10000 });
    const askCall = learnCalls.find((c) => c.step === 'ask');
    check('learn: a follow-up is answered in the lesson context', askCall?.body.lesson.title.startsWith('Lesson on') && /Based on the lesson’s readings/.test(await pg.textContent('.lc-ask__item')));
    // Simpler explanation
    await pg.click('.lc-actions button:has-text("Explain more simply")');
    await pg.waitForFunction(() => document.querySelector('.lc-actions button[aria-pressed="true"]')?.textContent === 'Explain more simply', null, { timeout: 10000 });
    check('learn: "Explain more simply" asks for a simpler lesson', learnCalls.some((c) => c.step === 'lesson' && c.body.style === 'simpler'));
    // Complete, next, previous, progress
    await pg.click('.lc-lessonnav button:has-text("Mark lesson complete")');
    await pg.waitForFunction(() => /1 of 6 lessons complete/.test(document.querySelector('.lc__progress-text')?.textContent ?? ''), null, { timeout: 5000 }).catch(() => {});
    check('learn: completing a lesson opens the next and updates progress', /1 of 6 lessons complete \(17%\)/.test(await pg.textContent('.lc__progress-text')) && /Lesson 1\.2/.test(await pg.textContent('.lc-crumb')));
    check('learn: progress says it stays in this tab', /kept in this browser tab only/.test(await pg.textContent('.lc__progress-text')));
    await pg.click('.lc-lessonnav button:has-text("Previous lesson")');
    await pg.waitForFunction(() => /Lesson 1\.1/.test(document.querySelector('.lc-crumb')?.textContent ?? ''), null, { timeout: 5000 });
    check('learn: Previous goes back; the done lesson is ticked in the contents', (await pg.locator('.lc-navlink--done').count()) === 1 && (await pg.locator('.lc-lessonnav button:has-text("Completed ✓")').count()) === 1);
    await pg.click('.lc-lessonnav button:has-text("Course contents")');
    check('learn: Course contents moves focus to the contents', await pg.evaluate(() => !!document.activeElement?.closest('.lc__nav')));
    await pg.click('.lc-lessonnav button:has-text("Back to course")');
    check('learn: Back to course shows the overview', (await pg.textContent('.lc__h')) === 'Course overview' && /Continue the course/.test(await pg.textContent('.lc-primary')));
    check('learn: progress is in sessionStorage only', await pg.evaluate(() => Object.keys(sessionStorage).some((k) => k.startsWith('kevos-learn-')) && !Object.keys(localStorage).some((k) => k.startsWith('kevos-learn-'))));
    check('learn: no sideways scroll on desktop', await noSideScroll(pg));
    await pg.locator('.lc').screenshot({ path: SHOTS + '/learning-desktop.png' });
    // Depth: Structured Learning re-plans; Quick Understanding gives the solution path
    await pg.click('.lc__depth button:has-text("Structured Learning")');
    await pg.waitForFunction(() => document.querySelector('.lc__depth [aria-pressed="true"]')?.textContent === 'Structured Learning', null, { timeout: 15000 });
    check('learn: changing depth re-plans the same course view', (await pg.locator('.lc').count()) === 1 && learnCalls.filter((c) => c.step === 'plan').at(-1).body.depth === 'structured');
    await pg.click('.lc__depth button:has-text("Quick Understanding")');
    await pg.waitForSelector('.dr-exchange .dr-group, .dr-exchange .sp', { timeout: 15000 });
    check('learn: Quick Understanding shows the quick answer', (await pg.locator('.dr-exchange').count()) >= 1);
    // Repeated question: same course, progress kept for the tab
    await ask(pg, 'I want to learn manufacturing process improvement.');
    await pg.waitForFunction(() => /Planned by KEVOS® AI/.test(document.querySelector('.lc .lc__eyebrow')?.textContent ?? ''), null, { timeout: 15000 });
    check('learn: asking the same again keeps this tab’s progress', /1 of 6 lessons complete/.test(await pg.locator('.lc').first().locator('.lc__progress-text').textContent()));
    check('learn: no console errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  // 11. Learning paths without AI, with failures, clarification and out-of-scope requests
  {
    const { ctx, pg, errors } = await page({ learn: () => ({ abort: true }) });
    await pg.goto(BASE + '/');
    await ask(pg, 'Teach me electrical engineering fundamentals.');
    await pg.waitForSelector('.lc', { timeout: 15000 });
    await pg.waitForFunction(() => !/planning your personalised course/.test(document.querySelector('.lc__status')?.textContent ?? ''), null, { timeout: 15000 });
    check('learn (AI down): the Library course stays, with a note', /Arranged from the Library/.test(await pg.textContent('.lc__eyebrow')) && /could not plan a course/.test(await pg.textContent('.lc__status')));
    await pg.click('.lc-primary');
    await pg.waitForFunction(() => /could not write this lesson/.test(document.querySelector('.lc-lesson__status')?.textContent ?? ''), null, { timeout: 15000 });
    check('learn (AI down): the key things come from the Library text, labelled', /From the Library/.test(await pg.textContent('.lc-key')) && (await pg.locator('.lc-key .lc-key__row').count()) >= 1);
    check('learn (AI down): readings and tools are still listed', (await pg.locator('.lc-card').count()) >= 1);
    check('learn (AI down): no console errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  {
    const clarify = (step) => step === 'intent' ? { status: 200, body: { ok: true, ai: true, intent: { subject: 'engineering', objective: '', outcome: '', level: 'mixed', depth: 'complete', topics: [{ name: 'Engineering', terms: ['engineering design'] }], clarify: 'Which branch of engineering?', options: ['Mechanical engineering', 'Electrical engineering'] } } } : { status: 200, body: { ok: true, ai: false } };
    const { ctx, pg } = await page({ learn: clarify });
    await pg.goto(BASE + '/');
    await ask(pg, 'learn engineering');
    check('learn: a broad request asks one question with options', /Which branch of engineering/.test(await pg.textContent('.dr-exchange .dr-say')) && (await pg.locator('.dr-options button').count()) === 3);
    await ctx.close();
    const out = (step) => step === 'intent' ? { status: 200, body: { ok: true, ai: true, intent: { subject: 'sourdough', objective: '', outcome: '', level: 'mixed', depth: 'complete', topics: [], outOfScope: true } } } : { status: 200, body: { ok: true, ai: false } };
    const o = await page({ learn: out });
    await o.pg.goto(BASE + '/');
    await ask(o.pg, 'teach me how to bake sourdough bread');
    check('learn: an unsupported subject is declined, no course', (await o.pg.locator('.lc').count()) === 0 && /outside what KEVOS® covers/.test(await o.pg.textContent('[data-discover-status]')));
    await o.ctx.close();
    const busy = await page({ learn: () => ({ status: 429, body: { ok: false, error: 'You have made a lot of requests in a short time. Please wait a little and try again.' } }) });
    await busy.pg.goto(BASE + '/');
    await ask(busy.pg, 'Teach me mechanical engineering from beginner to advanced.');
    check('learn: 429 shows the rate-limit message', /a lot of requests/.test(await busy.pg.textContent('[data-discover-status]')));
    await busy.pg.evaluate(() => { const t = document.querySelector('#discover-question'); t.removeAttribute('maxlength'); t.value = 'x'.repeat(1200); });
    await busy.pg.click('[data-discover-submit]');
    check('learn: a very long request is refused with a message', /under 1,000 characters/.test(await busy.pg.textContent('[data-discover-status]')));
    await busy.ctx.close();
  }
  // 12. Learning paths on a phone
  {
    const learn = (step, body) => step === 'plan' ? { status: 200, body: { ok: true, ai: true, course: { title: 'Mechanical engineering from the ground up', description: '', level: 'mixed', objectives: [], outcomes: [], gaps: [], modules: [{ title: 'Machine elements', summary: '', lessons: body.readings.slice(0, 3).map((r) => ({ title: r.title, objective: 'Understand it.', reads: [r.id], tools: body.tools.slice(0, 1).map((t) => t.id) })) }] } } } : { status: 200, body: { ok: true, ai: false } };
    const { ctx, pg, errors } = await page({ width: 390, height: 844, learn });
    await pg.goto(BASE + '/');
    await ask(pg, 'Teach me mechanical engineering from beginner to advanced.');
    await pg.waitForFunction(() => /Planned by KEVOS® AI/.test(document.querySelector('.lc__eyebrow')?.textContent ?? ''), null, { timeout: 15000 });
    check('learn (mobile): no sideways scroll with a course', await noSideScroll(pg));
    check('learn (mobile): contents stack above the lesson', await pg.evaluate(() => { const n = document.querySelector('.lc__nav').getBoundingClientRect(); const m = document.querySelector('.lc__main').getBoundingClientRect(); return n.bottom <= m.top + 1; }));
    await pg.click('.lc-primary');
    await pg.waitForSelector('.lc-lessonnav', { timeout: 15000 });
    await pg.waitForTimeout(400);
    check('learn (mobile): no sideways scroll in a lesson', await noSideScroll(pg));
    const small = await pg.evaluate(() => [...document.querySelectorAll('.lc-nb, .lc-chip, .lc-navlink, .lc-card__cta, .lc-primary')].filter((n) => n.offsetParent).map((n) => n.getBoundingClientRect().height).filter((h) => h < 39.5).length);
    check('learn (mobile): course controls at least 40 px tall', small === 0, String(small));
    await pg.screenshot({ path: SHOTS + '/learning-mobile.png', fullPage: false });
    check('learn (mobile): no console errors', errors.length === 0, errors.join(' | '));
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
