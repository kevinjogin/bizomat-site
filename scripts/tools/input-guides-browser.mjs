// WORKOS input guides: browser sweep over every tool in a real Chromium.
//
//   node scripts/tools/input-guides-browser.mjs [base-url]     (default http://127.0.0.1:4322, a static server on dist/)
//
// For each of the 837 tools it opens the calculator in place, then checks that every input has its guide, that each
// figure draws inside its box, that the figure follows a typed value, that the tool still shows a result, and that the
// page logs no errors. It also checks keyboard opening, a 360 px wide screen and reduced motion on sample tools.
// Results go to docs/tool-input-guides-browser.json; `input-guides.mjs inventory` folds them into the inventory.
// Needs Playwright with Chromium (pre-installed in the KEVOS cloud environment).
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(require.resolve('playwright', { paths: ['/opt/node22/lib/node_modules', '/usr/local/lib/node_modules', '/usr/lib/node_modules'] })); }
const base = process.argv[2] || 'http://127.0.0.1:4322';

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(`${base}/tools/`, { waitUntil: 'load' });
// Tool files load on demand; the page's map lists every tool id.
const ids = await page.evaluate(() => Object.keys(JSON.parse(document.getElementById('workos-tool-files').textContent)));
/** Opens a tool in place and waits until its files have loaded and it has calculated (at most 15 s). */
const openIn = (p, id) => p.evaluate(async (id) => {
  history.pushState({}, '', `?tool=${id}`);
  dispatchEvent(new PopStateEvent('popstate'));
  for (let i = 0; i < 300 && window.WORKOS_UI.state()?.t.id !== id; i++) await new Promise((r) => setTimeout(r, 50));
}, id);

const results = [];
for (const id of ids) {
  errors = [];
  await openIn(page, id);
  const r = await page.evaluate(async (id) => {
    const t = (window.GOCORE_TOOLS || []).find((x) => x.id === id);
    if (!t || window.WORKOS_UI.state()?.t.id !== id) return { id, inputs: 0, figures: 0, issues: ['tool did not open within 15 s'] };
    const fields = t.fields.filter((f) => f.type !== 'heading');
    const form = document.querySelector('#tool-form');
    const issues = [];
    let figures = 0;
    for (const f of fields) {
      const input = form.querySelector(`#f-${CSS.escape(f.key)}`);
      if (!input) { issues.push(`${f.key}: input missing`); continue; }
      const details = form.querySelector(`details[data-ig-for="f-${CSS.escape(f.key)}"]`);
      const what = document.getElementById(`ig-${f.key}-what`);
      if (!what || !what.textContent.trim()) issues.push(`${f.key}: no definition`);
      if (!(input.getAttribute('aria-describedby') || '').includes(`ig-${f.key}-what`)) issues.push(`${f.key}: input not described by its guide`);
      if (!details) { if (!form.querySelector(`#ig-${CSS.escape(f.key)}-what.ig-unclear`)) issues.push(`${f.key}: guide missing`); continue; }
      details.open = true;
      const svg = details.querySelector('svg');
      if (!svg) continue;
      figures++;
      const box = svg.viewBox.baseVal;
      for (const el of svg.querySelectorAll('text')) {
        if (!el.textContent.trim()) continue;
        const b = el.getBBox();
        if (b.x < -2 || b.x + b.width > box.width + 2) issues.push(`${f.key}: figure text "${el.textContent.slice(0, 30)}" leaves the figure`);
      }
    }
    // The figure follows a typed value (first numeric input), then the value goes back.
    const num = fields.find((f) => (f.type || 'number') === 'number' && form.querySelector(`details[data-ig-key="${f.key}"] svg`));
    if (num) {
      const input = form.querySelector(`#f-${CSS.escape(num.key)}`);
      const before = input.value;
      input.value = String(Number(num.default) + (num.step || 1));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const shown = form.querySelector(`details[data-ig-key="${num.key}"] [data-ig-live]`).textContent;
      if (!shown.includes(input.value)) issues.push(`${num.key}: figure did not follow the typed value (${shown})`);
      input.value = before;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    await new Promise((res) => setTimeout(res, 220));
    if (!document.querySelector('#result .result-status')?.textContent.trim()) issues.push('no result shown');
    return { id, inputs: fields.length, figures, issues };
  }, id);
  if (errors.length) r.issues.push(...errors.map((e) => `console: ${e.slice(0, 160)}`));
  r.ok = r.issues.length === 0;
  results.push(r);
}

// Every tool again on a 360 px phone screen with all guides open: no sideways scroll, every panel and figure
// inside the screen, and tap targets of at least 24 px (WCAG 2.2 target size).
const phone = await browser.newPage({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true });
await phone.goto(`${base}/tools/`, { waitUntil: 'load' });
for (const r of results) {
  await openIn(phone, r.id);
  const issues = await phone.evaluate((id) => {
    const out = [];
    const form = document.querySelector('#tool-form');
    form.querySelectorAll('details.ig').forEach((d) => (d.open = true));
    if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`phone: page scrolls sideways (${document.documentElement.scrollWidth} px)`);
    for (const el of form.querySelectorAll('.ig-panel, .ig-fig')) {
      const b = el.getBoundingClientRect();
      if (b.left < -1 || b.right > innerWidth + 1) { out.push(`phone: ${el.className} leaves the screen`); break; }
    }
    for (const sm of form.querySelectorAll('summary.ig-sum')) {
      if (sm.getBoundingClientRect().height < 24) { out.push('phone: guide control shorter than 24 px'); break; }
    }
    return out;
  }, r.id);
  if (issues.length) { r.issues.push(...issues); r.ok = false; }
}
await phone.close();

// Keyboard, narrow screen and reduced motion on a sample spread across the collection.
const sample = ids.filter((_, i) => i % 60 === 0);
const extra = [];
const mobile = await browser.newPage({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
for (const id of sample) {
  await page.goto(`${base}/tools/?tool=${id}`, { waitUntil: 'load' });
  const summary = page.locator('#tool-form summary.ig-sum').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  const opened = await page.evaluate(() => document.querySelector('#tool-form details.ig')?.open === true);
  await page.keyboard.press('Enter');
  const closed = await page.evaluate(() => document.querySelector('#tool-form details.ig')?.open === false);
  await mobile.goto(`${base}/tools/?tool=${id}`, { waitUntil: 'load' });
  const m = await mobile.evaluate(() => {
    document.querySelectorAll('#tool-form details.ig').forEach((d) => (d.open = true));
    const anim = [...document.querySelectorAll('#tool-form .ig-svg *')].filter((el) => getComputedStyle(el).animationName !== 'none').length;
    return { overflow: document.documentElement.scrollWidth > innerWidth + 1, animated: anim };
  });
  extra.push({ id, keyboardOpens: opened, keyboardCloses: closed, mobileOverflow: m.overflow, reducedMotionAnimations: m.animated });
}
await browser.close();

const failed = results.filter((r) => !r.ok);
const out = {
  generated: new Date().toISOString().slice(0, 10),
  base,
  tools: results.length,
  passed: results.length - failed.length,
  inputs: results.reduce((n, r) => n + r.inputs, 0),
  figures: results.reduce((n, r) => n + r.figures, 0),
  sample: extra,
  failures: failed,
  results: results.map(({ id, ok, inputs, figures }) => ({ id, ok, inputs, figures })),
};
writeFileSync(join(process.cwd(), 'docs', 'tool-input-guides-browser.json'), `${JSON.stringify(out, null, 1)}\n`);
console.log(`tools ${out.tools} · passed ${out.passed} · inputs ${out.inputs} · figures ${out.figures}`);
for (const f of failed.slice(0, 40)) console.log(`  ${f.id}: ${f.issues.slice(0, 4).join(' | ')}`);
for (const s of extra) if (!s.keyboardOpens || !s.keyboardCloses || s.mobileOverflow || s.reducedMotionAnimations) console.log(`  sample ${s.id}: ${JSON.stringify(s)}`);
process.exitCode = failed.length || extra.some((s) => !s.keyboardOpens || !s.keyboardCloses || s.mobileOverflow || s.reducedMotionAnimations) ? 1 : 0;
