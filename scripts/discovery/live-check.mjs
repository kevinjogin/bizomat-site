// Post-release check of homepage discovery on the live site (CLAUDE.md: "check the public site, not just the build").
//   node scripts/discovery/live-check.mjs [base-url]      (default https://kevos.com; Node 22.18+ for the .ts import)
// Waits (up to 15 minutes) for the new homepage, then checks the key pages and markup, and asks the real
// /api/discover a few questions with a shortlist built from the live catalogue, then plans one learning path through
// /api/learn/intent and /api/learn/plan. Prints what the AI returned.
import { prepare, search, shortlist } from '../../src/lib/discovery/search.ts';
import { buildPath } from '../../src/lib/discovery/plan.ts';
import { gatherCandidates, localIntent } from '../../src/lib/learning/retrieve.ts';

const BASE = (process.argv[2] || 'https://kevos.com').replace(/\/$/, '');
const results = [];
const check = (name, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  — ${extra}` : ''}`); };
const get = async (path) => { const r = await fetch(BASE + path, { headers: { 'Cache-Control': 'no-cache' } }); return { status: r.status, text: await r.text() }; };

// 1. Wait for the release to be served.
const until = Date.now() + 15 * 60_000;
let home;
for (;;) {
  home = await get(`/?live-check=${Date.now()}`);
  if ((home.text.includes('id="products"') && home.text.includes('Ask KEVOS')) || Date.now() > until) break;
  await new Promise((r) => setTimeout(r, 20_000));
}
check('the new homepage is live', home.status === 200 && home.text.includes('id="products"'));

// 2. Pages and markup.
for (const p of ['/', '/products/', '/solutions/', '/resources/', '/tools/', '/reados/', '/library/', '/about/', '/services/', '/contact/', '/privacy/', '/terms/', '/brand/kevos-favicon-k-orange.svg', '/discovery-index.json']) {
  check(`${p} answers 200`, (await fetch(BASE + p)).status === 200);
}
const h = home.text;
check('hero: Make difficult work simple.', />Make difficult work simple\.</.test(h));
check('Ask KEVOS box and four example prompts', h.includes('What would you like to accomplish today?') && />Ask KEVOS</.test(h) && (h.match(/data-discover-example/g) ?? []).length === 4);
check('Explore Tools and Explore Library buttons', />Explore Tools</.test(h) && />Explore Library</.test(h));
check('homepage says Tools and Library, not WORKOS / READOS', !/>\s*(WORKOS|READOS)\s*</.test(h));
check('product cards: Work and CADOS link out, Desk is coming soon', h.includes('href="https://work.kevos.com/"') && h.includes('href="https://cados.kevos.com/"') && /Coming soon/.test(h));
check('orange KEVOS wordmark and K favicon', h.includes('kevos-wordmark-orange') && h.includes('kevos-favicon-k-orange'));
check('navigation: Products, Solutions, Tools, Resources, About, Get Started', ['Products', 'Solutions', 'Resources', 'About'].every((l) => new RegExp(`<summary[^>]*>\\s*${l}`).test(h)) && /href="\/tools\/"[^>]*>Tools<\/a>/.test(h) && /href="\/#ask"[^>]*>Get Started<\/a>/.test(h));
check('Library page title', (await get('/reados/')).text.includes('<title>Engineering, Manufacturing &amp; Business Knowledge Library | KEVOS</title>'));
check('light theme by default', h.includes('data-theme="light"'));
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
const details = await (await fetch(`${BASE}/discovery-details.json`)).json().catch(() => null);
check('the live tool details list every tool', details && Object.keys(details.tools).length === index.tools.length);
const QUESTIONS = ['where is keyhole and how much', 'How much money am I losing when my machine is sitting idle?', 'what torque should I tighten an M12 bolt to', 'why does my bearing keep failing', 'should I buy or lease equipment', 'What speed should I run my cutter?', 'weather forecast tomorrow'];
let aiPaths = 0;
for (const question of QUESTIONS) {
  const candidates = shortlist(engine, { question }, 14, 8);
  const r = await fetch(`${BASE}/api/discover`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE }, body: JSON.stringify({ question, candidates }) });
  const data = await r.json().catch(() => ({}));
  const intent = data.intent;
  if (data.ai) aiAnswers++;
  const outcome = intent?.outOfScope ? { mode: 'none', tools: [], readings: [] } : search(engine, { question, terms: intent?.terms, picks: intent?.picks });
  check(`/api/discover answers “${question}”`, r.status === 200 && data.ok === true, `ai=${data.ai} terms=${JSON.stringify(intent?.terms ?? [])} picks=${JSON.stringify(intent?.picks ?? [])} outOfScope=${Boolean(intent?.outOfScope)}`);
  console.log(`      → ${outcome.mode}: ${[...outcome.tools, ...outcome.readings].slice(0, 5).map((x) => `${x.ai ? '[AI] ' : ''}${x.title}`).join(' | ') || '(nothing)'}`);
  for (const id of intent?.picks ?? []) check(`  pick ${id} is in the catalogue`, engine.byId.has(id));
  // Your Solution Path, as the homepage builds it: the AI's steps when usable, otherwise the workflow.
  const path = outcome.mode === 'results' && !intent?.clarify ? buildPath(engine, question, outcome, details, intent?.plan) : null;
  if (path?.source === 'ai') aiPaths++;
  if (path) {
    console.log(`      path (${path.source}, ${path.typeLabel}): ${path.steps.map((st, i) => `${i + 1}. ${st.do}${st.tools.length ? ` [${st.tools.map((t) => t.title).join(', ')}]` : ''}${st.reads.length ? ` {${st.reads.length} reading}` : ''}`).join(' → ')}`);
    if (path.missing.length) console.log(`      missing: ${path.missing.join('; ')}`);
    for (const st of path.steps) for (const l of [...st.tools, ...st.reads]) check(`  path link ${l.url} is in the catalogue`, engine.byId.has(l.kind === 'tool' ? l.app.replace('/tools/?tool=', '') : l.url) || index.books.some((b) => b.u === l.url));
  }
}
check('Workers AI answered at least one question', aiAnswers > 0, `${aiAnswers}/${QUESTIONS.length}`);
check('Workers AI returned a usable solution path for at least half the in-scope questions', aiPaths >= Math.ceil((QUESTIONS.length - 1) / 2), `${aiPaths}/${QUESTIONS.length - 1}`);

// 3. A learning path: intent, then a plan over candidates from the live catalogue (all by id, all real).
{
  const question = 'I want to learn manufacturing process improvement.';
  const shard = await fetch(`${BASE}/learning/0.json`);
  check('chapter outlines are served (/learning/0.json)', shard.status === 200 && Object.keys((await shard.json()).chapters ?? {}).length > 0);
  let t0 = Date.now();
  const ir = await fetch(`${BASE}/api/learn/intent`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE }, body: JSON.stringify({ question }) });
  const idata = await ir.json().catch(() => ({}));
  check('/api/learn/intent answers', ir.status === 200 && idata.ok === true, `ai=${idata.ai} ${Date.now() - t0} ms subject=${idata.intent?.subject ?? ''} depth=${idata.intent?.depth ?? ''} topics=${(idata.intent?.topics ?? []).map((t) => t.name).join(' / ')}`);
  const local = localIntent(question, engine);
  const intent = idata.intent ? { ...idata.intent, source: 'ai', topics: idata.intent.topics?.length ? idata.intent.topics : local.topics } : local;
  const c = gatherCandidates(engine, question, intent);
  check('the live catalogue gives readings for the course', c.readings.length >= 6, `${c.readings.length} readings, ${c.tools.length} tools`);
  t0 = Date.now();
  const pr = await fetch(`${BASE}/api/learn/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE }, body: JSON.stringify({
    question, depth: 'complete', intent: { subject: intent.subject, objective: intent.objective, outcome: intent.outcome, level: intent.level },
    readings: c.readings.map((r) => ({ id: r.url, title: r.title, book: r.book, topic: r.topic, about: r.about.slice(0, 200) })),
    tools: c.tools.map((t) => ({ id: t.id, name: t.name, about: t.about.slice(0, 180), linked: [] })),
  }) });
  const pdata = await pr.json().catch(() => ({}));
  check('/api/learn/plan answers', pr.status === 200 && pdata.ok === true, `ai=${pdata.ai} ${Date.now() - t0} ms title=${pdata.course?.title ?? ''} modules=${pdata.course?.modules?.length ?? 0}`);
  const ids = new Set([...c.readings.map((r) => r.url), ...c.tools.map((t) => t.id)]);
  const used = (pdata.course?.modules ?? []).flatMap((m) => m.lessons.flatMap((l) => [...l.reads, ...l.tools]));
  if (pdata.ai) check('  every planned reading and tool was in the list sent', used.length > 0 && used.every((id) => ids.has(id)), `${used.length} references`);
}

const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} live checks passed`);
process.exit(failed ? 1 : 0);
