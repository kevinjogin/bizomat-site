// Post-release check of homepage discovery on the live site (CLAUDE.md: "check the public site, not just the build").
//   node scripts/discovery/live-check.mjs [base-url]      (default https://kevos.com; Node 22.18+ for the .ts import)
// Waits (up to 15 minutes) for the new homepage, then checks the key pages and markup, and asks the real
// /api/discover a few questions with a shortlist built from the live catalogue. Prints what the AI returned.
import { prepare, search, shortlist } from '../../src/lib/discovery/search.ts';

const BASE = (process.argv[2] || 'https://kevos.com').replace(/\/$/, '');
const results = [];
const check = (name, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  — ${extra}` : ''}`); };
const get = async (path) => { const r = await fetch(BASE + path, { headers: { 'Cache-Control': 'no-cache' } }); return { status: r.status, text: await r.text() }; };

// 1. Wait for the release to be served.
const until = Date.now() + 15 * 60_000;
let home;
for (;;) {
  home = await get(`/?live-check=${Date.now()}`);
  if (home.text.includes('class="home-libs"') || Date.now() > until) break;
  await new Promise((r) => setTimeout(r, 20_000));
}
check('the new homepage is live', home.status === 200 && home.text.includes('class="home-libs"'));

// 2. Pages and markup.
for (const p of ['/', '/tools/', '/reados/', '/about/', '/services/', '/contact/', '/privacy/', '/brand/kevos-favicon-k-orange.svg', '/discovery-index.json']) {
  check(`${p} answers 200`, (await fetch(BASE + p)).status === 200);
}
const h = home.text;
check('hero asks the question', /What would you like to <em[^>]*>solve<\/em> today\?/.test(h));
check('Explore WORKOS and Explore READOS buttons', h.includes('data-cta="hero-workos"') && h.includes('data-cta="hero-reados"'));
check('WORKOS and READOS side by side block', /class="home-lib"[^>]*id="workos"/.test(h) && /class="home-lib"[^>]*id="reados"/.test(h));
check('orange KEVOS wordmark and K favicon', h.includes('kevos-wordmark-orange') && h.includes('kevos-favicon-k-orange'));
check('navigation: WORKOS, READOS, About, REACHOS', ['href="/tools/"', 'href="/reados/"', 'href="/about/"', 'href="/contact/"', 'REACHOS'].every((s) => h.includes(s)));
check('dark theme by default', h.includes('data-theme="dark"'));
check('no floating assistant on the homepage', !h.includes('assistant__launcher'));
const tools = (await get('/tools/')).text;
check('no floating assistant on /tools/', !tools.includes('assistant__launcher'));
check('/tools/ has the AI search note', tools.includes('data-lib-ai-note'));
check('/contact/ has no assistant section', !(await get('/contact/')).text.includes('id="assistant"'));
check('/privacy/ explains homepage questions', (await get('/privacy/')).text.includes('Questions on the homepage'));

// 3. The real AI step, grounded in the live catalogue.
const index = await (await fetch(`${BASE}/discovery-index.json`)).json();
check('the live catalogue lists 1,000+ tools', index.tools.length >= 1000, String(index.tools.length));
const engine = prepare(index);
let aiAnswers = 0;
for (const question of ['where is keyhole and how much', 'How much money am I losing when my machine is sitting idle?', 'what torque should I tighten an M12 bolt to', 'weather forecast tomorrow']) {
  const candidates = shortlist(engine, { question });
  const r = await fetch(`${BASE}/api/discover`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE }, body: JSON.stringify({ question, candidates }) });
  const data = await r.json().catch(() => ({}));
  const intent = data.intent;
  if (data.ai) aiAnswers++;
  const outcome = intent?.outOfScope ? { mode: 'none', tools: [], readings: [] } : search(engine, { question, terms: intent?.terms, picks: intent?.picks });
  check(`/api/discover answers “${question}”`, r.status === 200 && data.ok === true, `ai=${data.ai} terms=${JSON.stringify(intent?.terms ?? [])} picks=${JSON.stringify(intent?.picks ?? [])} outOfScope=${Boolean(intent?.outOfScope)}`);
  console.log(`      → ${outcome.mode}: ${[...outcome.tools, ...outcome.readings].slice(0, 5).map((x) => `${x.ai ? '[AI] ' : ''}${x.title}`).join(' | ') || '(nothing)'}`);
  for (const id of intent?.picks ?? []) check(`  pick ${id} is in the catalogue`, engine.byId.has(id));
}
check('Workers AI answered at least one question', aiAnswers > 0, `${aiAnswers}/4`);

const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} live checks passed`);
process.exit(failed ? 1 : 0);
