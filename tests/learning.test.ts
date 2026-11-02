import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDiscoveryIndex } from '../src/utils/discovery-index.ts';
import { prepare } from '../src/lib/discovery/search.ts';
import { gatherCandidates, localIntent, type Intent } from '../src/lib/learning/retrieve.ts';
import { courseFromPlan, draftCourse, estimateMinutes, formatDuration, lessons, type PlanFromWorker } from '../src/lib/learning/course.ts';
import { outlineForUrl, outlineOf, plainText } from '../src/utils/learning-outlines.ts';
import { completeJson, jsonObject, type AiProvider } from '../src/server/ai/provider.ts';
import { parseAnswer, parseCoursePlan, parseLearnIntent, parseLesson, text } from '../src/server/learn/schema.ts';
import { handleLearnAsk, handleLearnIntent, handleLearnLesson, handleLearnPlan, INTENT_PROMPT, lessonPrompt, planPrompt } from '../src/server/learn/handler.ts';
import worker, { type Env } from '../src/worker.ts';

// KEVOS® learning paths ("What would you like to learn or achieve?"): chapter outlines, Library and Tools retrieval,
// the draft and AI-planned course, the structured-output validators and the /api/learn endpoints.

const index = buildDiscoveryIndex();
const engine = prepare(index);
const chapterUrls = new Set(index.chapters.map((c) => c.u));
const toolIds = new Set(index.tools.map((t) => t.id));
const ROOT = process.cwd();

// ---------------------------------------------------------------- Chapter outlines

test('chapter outlines come from the chapter text: headings, bold terms, summary, mistakes, questions, reading time', () => {
  const md = `---\ntitle: X\n---\nOpening paragraph about **overall equipment effectiveness** and [a link](/x/).\n\n## Availability losses\n\nText with **planned stops**.\n\n## Common mistakes\n\n- Counting changeovers as running time.\n- Ignoring minor stops.\n\n## Bringing it together\n\nOEE multiplies three ratios.\n\n## Frequently asked questions\n\n### What is a good OEE?\n\nIt depends.\n`;
  const o = outlineOf(md);
  assert.ok(o.h.includes('Availability losses'));
  assert.ok(!o.h.some((h) => /Bringing it together|Frequently asked/.test(h)));
  assert.ok(o.t.includes('overall equipment effectiveness') && o.t.includes('planned stops'));
  assert.match(o.s, /^Opening paragraph about overall equipment effectiveness and a link\.?$/, 'markup and links become plain text');
  assert.match(o.sum ?? '', /OEE multiplies three ratios/);
  assert.ok((o.mis ?? []).some((m) => /changeovers/.test(m)));
  assert.ok((o.q ?? []).some((q) => /good OEE/.test(q)));
  assert.ok(o.m >= 1);
  assert.equal(plainText('**bold** and `code` and [link](https://x.example)'), 'bold and code and link');
});

test('every published chapter has an outline and the index carries its reading time and key terms', () => {
  let withTerms = 0;
  for (const c of index.chapters) {
    const o = outlineForUrl(c.u);
    assert.ok(o, `outline for ${c.u}`);
    assert.equal(c.m, o!.m);
    if (c.k) withTerms++;
  }
  assert.ok(withTerms / index.chapters.length > 0.9, 'nearly every chapter has key terms for search');
  const page = readFileSync(join(ROOT, 'src/pages/learning/[book].json.ts'), 'utf8');
  assert.match(page, /getStaticPaths/);
});

// ---------------------------------------------------------------- Intent without AI

test('the request is read without AI: depth and level', () => {
  const li = (q: string) => localIntent(q, engine);
  assert.equal(li('Teach me mechanical engineering from beginner to advanced.').level, 'mixed');
  assert.equal(li('Teach me mechanical engineering from beginner to advanced.').depth, 'complete');
  assert.equal(li('Teach me electrical engineering fundamentals.').level, 'beginner');
  assert.equal(li('I want to learn advanced vibration analysis').depth, 'professional');
  assert.equal(li('Help me develop an equipment investment business case.').depth, 'structured');
  assert.equal(li('Explain how to implement continuous improvement in a manufacturing facility.').depth, 'structured');
  assert.equal(li('What rpm for a 10 mm drill in steel?').depth, 'quick', 'one specific question stays a quick answer');
  assert.equal(li('How can I reduce machine downtime?').depth, 'quick', 'a short problem question gets the solution path');
  assert.equal(li('How can I improve factory productivity and reduce manufacturing costs?').depth, 'structured');
  assert.equal(li('teech me mechanicle enginering').depth, 'complete', 'a misspelt "teach me" is still a course');
  assert.equal(li('Teach me mechanical engineering').source, 'local');
});

test('a one-word field asks one clarifying question; an unsupported subject finds nothing', () => {
  for (const q of ['learn engineering', 'Teach me about business', 'I want to learn manufacturing']) {
    const i = localIntent(q, engine);
    assert.ok(i.clarify && (i.options?.length ?? 0) >= 2, q);
  }
  assert.equal(localIntent('Teach me mechanical engineering', engine).clarify, undefined);
  const bread = localIntent('teach me how to bake sourdough bread', engine);
  assert.equal(bread.topics.length, 0);
  const c = gatherCandidates(engine, 'teach me how to bake sourdough bread', bread);
  assert.equal(c.readings.length, 0, 'no near-miss chapters for a subject KEVOS does not cover');
  assert.equal(draftCourse('teach me how to bake sourdough bread', bread, c, null, 'complete'), null);
});

// ---------------------------------------------------------------- The ten requests

const TEN: { q: string; reading: RegExp; tool?: RegExp }[] = [
  { q: 'Teach me mechanical engineering from beginner to advanced.', reading: /Machine Elements|Mechanical/i, tool: /stress|belt|bearing|shaft|beam|bolt|alignment/ },
  { q: 'I want to learn manufacturing process improvement.', reading: /Lean|Continuous Improvement/i, tool: /oee|process|downtime/ },
  { q: 'Help me understand engineering project management.', reading: /Project/i, tool: /project|earned-value|pert|schedule/ },
  { q: 'Teach me how to calculate manufacturing costs.', reading: /[Cc]ost/, tool: /cost|rate|quote/ },
  { q: 'I want to learn AI and automation for business.', reading: /AI in Business/ },
  { q: 'Help me develop an equipment investment business case.', reading: /Investment Appraisal|Business Case/i, tool: /investment|irr|npv|payback|economic-life/ },
  { q: 'I want to improve factory productivity and reduce downtime.', reading: /Lean|Maintenance|Downtime|Breakdown/i, tool: /downtime|oee|mtbf|spares/ },
  { q: 'Teach me electrical engineering fundamentals.', reading: /Transformer|Drive|Electric|Motor/i, tool: /motor|power|enclosure/ },
  { q: 'I want to learn software development from scratch.', reading: /Software/i },
  { q: 'Explain how to implement continuous improvement in a manufacturing facility.', reading: /Lean|Continuous Improvement/i, tool: /oee|process|downtime/ },
];

for (const { q, reading, tool } of TEN) {
  test(`learning path without AI: ${q}`, () => {
    const intent = localIntent(q, engine);
    assert.notEqual(intent.depth, 'quick');
    const c = gatherCandidates(engine, q, intent);
    assert.ok(c.readings.length >= 3, 'enough Library readings');
    assert.equal(new Set(c.readings.map((r) => r.url)).size, c.readings.length, 'no duplicate readings');
    for (const r of c.readings) assert.ok(chapterUrls.has(r.url), `real chapter ${r.url}`);
    for (const t of c.tools) {
      assert.ok(toolIds.has(t.id), `real tool ${t.id}`);
      assert.match(t.url, /^\/tools\/([a-z0-9-]+\/|\?tool=[a-z0-9-]+)$/);
    }
    // Tools joined to the chosen chapters by reviewed links come before keyword matches.
    const firstUnlinked = c.tools.findIndex((t) => !t.linkedTo.length);
    if (firstUnlinked >= 0) assert.ok(c.tools.slice(firstUnlinked).every((t) => !t.linkedTo.length), 'linked tools first');
    for (const t of c.tools) for (const u of t.linkedTo) assert.ok(index.links.some(([a, b]) => a === t.id && b === u), 'a link is a reviewed knowledge link');
    const course = draftCourse(q, intent, c, null, intent.depth as Exclude<typeof intent.depth, 'quick'>)!;
    assert.ok(course, 'a course is drafted');
    assert.equal(course.source, 'library');
    assert.match([...course.modules.map((m) => m.title), ...lessons(course).flatMap((l) => l.readings.map((r) => `${r.book} ${r.title}`))].join(' | '), reading, 'relevant Library books');
    if (tool) assert.ok(lessons(course).some((l) => l.tools.some((t) => tool.test(t.id))) || c.tools.some((t) => tool.test(t.id)), 'relevant Tools');
    const all = lessons(course);
    assert.ok(all.length >= 3);
    assert.equal(new Set(all.flatMap((l) => l.readings.map((r) => r.url))).size, all.flatMap((l) => l.readings).length, 'each chapter once');
    assert.ok(course.modules.length <= (intent.depth === 'structured' ? 3 : 6));
    assert.ok(course.minutes > 0 && course.minutes === estimateMinutes(course.modules));
    assert.match(course.title, /^Learning path: /);
    assert.doesNotMatch(JSON.stringify(course), /WORKOS|READOS/, 'no retired names');
  });
}

test('AI topics retrieve the chapters of each topic and report a topic with nothing as a gap', () => {
  const q = 'Teach me electrical engineering fundamentals.';
  const intent: Intent = {
    subject: 'electrical engineering', objective: '', outcome: '', level: 'beginner', depth: 'complete', source: 'ai',
    topics: [
      { name: 'Transformers', terms: ['transformer', 'distribution transformer'] },
      { name: 'Motors and drives', terms: ['variable speed drive', 'motor'] },
      { name: 'Quantum chromodynamics', terms: ['gluon', 'quark colour charge'] },
    ],
  };
  const c = gatherCandidates(engine, q, intent);
  const by = (t: string) => c.readings.filter((r) => r.topic === t);
  assert.ok(by('Transformers').some((r) => /Transformer/i.test(`${r.book} ${r.title}`)));
  assert.ok(by('Motors and drives').some((r) => /Drive|Motor/i.test(`${r.book} ${r.title}`)));
  assert.equal(c.coverage.find((x) => x.topic === 'Quantum chromodynamics')?.readings, 0);
  const course = draftCourse(q, intent, c, null, 'complete')!;
  assert.ok(course.gaps.some((g) => /Quantum chromodynamics/.test(g)), 'missing coverage is named');
});

test('an AI plan becomes a course of real readings and tools only', () => {
  const q = 'Help me develop an equipment investment business case.';
  const intent = localIntent(q, engine);
  const c = gatherCandidates(engine, q, intent);
  const plan: PlanFromWorker = {
    title: 'Equipment investment business case', description: 'Build and test a business case.', level: 'intermediate',
    objectives: ['Appraise an investment'], outcomes: ['A defensible case'], gaps: [],
    modules: [{ title: 'Appraisal', summary: '', lessons: [
      { title: 'Cash flows', objective: 'List cash flows', reads: [c.readings[0].url, '/reados/not/real/'], tools: [c.tools[0].id, 'not-a-tool'] },
      { title: 'Risk', objective: 'Test risks', reads: [c.readings[1].url], tools: [] },
    ] }, { title: 'Empty', summary: '', lessons: [] }],
  };
  const course = courseFromPlan(q, intent, plan, c, null, 'structured')!;
  assert.equal(course.source, 'ai');
  assert.equal(course.modules.length, 1, 'an empty module is dropped');
  assert.deepEqual(course.modules[0].lessons[0].readings.map((r) => r.url), [c.readings[0].url], 'an unknown chapter is dropped');
  assert.deepEqual(course.modules[0].lessons[0].tools.map((t) => t.id), [c.tools[0].id], 'an unknown tool is dropped');
  assert.equal(course.modules[0].lessons[0].id, '1.1');
  assert.match(formatDuration(45), /minutes/);
  assert.match(formatDuration(300), /hours/);
});

// ---------------------------------------------------------------- Structured-output validation

test('AI text is plain: links, markup and stated results are removed', () => {
  assert.equal(text('See https://evil.example now', 200), '');
  assert.equal(text('<script>alert(1)</script>', 200), '');
  assert.equal(text('OEE multiplies three ratios. With these figures OEE = 85 %. Check each loss.', 200), 'OEE multiplies three ratios. Check each loss.');
  assert.equal(text('The payback comes to 3.2 years.', 200), '');
  assert.equal(text(42, 200), '');
  assert.ok(text('word '.repeat(100), 50).length <= 50);
});

test('the intent validator keeps only safe fields and asks for clarification only with options', () => {
  const i = parseLearnIntent({ subject: 'mechanical engineering', level: 'expert', depth: 'everything', topics: [{ name: 'Statics', terms: ['Free body diagram', 'https://x.example'] }, { name: '', terms: ['x'] }, { name: 'No terms', terms: [] }], clarify: 'Which branch?', options: ['one'] })!;
  assert.equal(i.level, 'mixed');
  assert.equal(i.depth, 'complete');
  assert.deepEqual(i.topics, [{ name: 'Statics', terms: ['free body diagram'] }]);
  assert.equal(i.clarify, undefined, 'one option is not a choice');
  assert.equal(parseLearnIntent({ subject: 'x', topics: [] }), null);
  assert.deepEqual(parseLearnIntent({ inScope: false, topics: [] })?.outOfScope, true);
});

test('the plan validator resolves numbers to the ids sent, uses each reading once and sizes the course by depth', () => {
  const readings = ['/r/1/', '/r/2/', '/r/3/'];
  const tools = ['t1', 't2'];
  const lesson = (reads: unknown, t: unknown = []) => ({ title: 'L', objective: 'O', reads, tools: t });
  const p = parseCoursePlan({ title: 'T', modules: [{ title: 'M1', lessons: [lesson([1, 9, 'x', 1], [2, 5]), lesson([1, 2])] }, { title: 'M2', lessons: [lesson([3])] }] }, readings, tools, 'structured')!;
  assert.deepEqual(p.modules[0].lessons[0].reads, ['/r/1/']);
  assert.deepEqual(p.modules[0].lessons[0].tools, ['t2']);
  assert.deepEqual(p.modules[0].lessons[1].reads, ['/r/2/'], 'a reading already used is not repeated');
  const many = { title: 'T', modules: Array.from({ length: 10 }, (_, i) => ({ title: `M${i}`, lessons: Array.from({ length: 6 }, () => lesson([1])) })) };
  const s = parseCoursePlan(many, readings, tools, 'structured')!;
  assert.ok(s.modules.length <= 4 && s.modules.every((m) => m.lessons.length <= 3));
  assert.equal(parseCoursePlan({ modules: [{ title: 'M', lessons: [lesson([])] }] }, readings, tools, 'complete'), null, 'a plan without readings is rejected');
  assert.equal(parseCoursePlan({ modules: 'nope' }, readings, tools, 'complete'), null);
});

test('the lesson validator needs the key things, valid checks and real source numbers', () => {
  const good = {
    explanation: 'Availability, performance and quality each describe a loss.', why: 'It shows where time goes.',
    concepts: ['Availability'], key: { principle: 'OEE separates losses.', essential: 'Three ratios.', why: 'Targets the biggest loss.', misunderstandings: ['OEE is not utilisation.'], implications: 'Measure stops.', remember: ['Three ratios', 'Planned time'], basis: 'source' },
    checks: [{ q: 'Which ratio covers stops?', options: ['Availability', 'Quality'], answer: 0, explain: 'Stops reduce availability.' }, { q: 'Bad', options: ['a', 'b'], answer: 7 }, { q: 'One', options: ['a'], answer: 0 }],
    exercises: [{ task: 'Enter your own shift data in the tool.', tool: 1 }, { task: 'Use tool 9', tool: 9 }],
    readingNotes: [{ n: 1, why: 'Defines OEE.', understand: 'The three ratios.' }, { n: 4, why: 'x' }],
    verify: ['I can name the three ratios.'], completion: ['Quiz passed'],
  };
  const l = parseLesson(good, 1, 1)!;
  assert.equal(l.key.basis, 'source');
  assert.equal(l.checks.length, 1, 'checks with a bad answer index or one option are dropped');
  assert.deepEqual(l.exercises.map((e) => e.tool), [1, undefined]);
  assert.deepEqual(l.readingNotes.map((n) => n.n), [1]);
  assert.equal(parseLesson(good, 0, 0)!.key.basis, 'general', 'no excerpts means general knowledge');
  assert.equal(parseLesson({ ...good, key: { ...good.key, remember: ['only one'] } }, 1, 1), null);
  assert.equal(parseLesson({ ...good, explanation: 'Visit www.evil.example' }, 1, 1), null);
  const a = parseAnswer({ answer: 'Planned stops are excluded.', basis: 'source', refs: [1, 3] }, 1)!;
  assert.deepEqual(a, { answer: 'Planned stops are excluded.', basis: 'source', refs: [1] });
  assert.equal(parseAnswer({ answer: 'x', basis: 'source', refs: [] }, 1)!.basis, 'general');
});

test('the prompts forbid invented resources and calculated results and use the current names', () => {
  for (const p of [INTENT_PROMPT, planPrompt('complete'), lessonPrompt('simpler')]) {
    assert.match(p, /Never invent books, chapters, tools/);
    assert.match(p, /Never state calculated results/);
    assert.match(p, /Tools and Library/);
    assert.doesNotMatch(p, /WORKOS|READOS/);
  }
});

// ---------------------------------------------------------------- Provider

test('the provider tries the fallback model inside one total time budget', async () => {
  const calls: string[] = [];
  const slowThenGood: AiProvider = { name: 'fake', complete: async (m) => { calls.push(m); if (m === 'a') return new Promise(() => {}); return '{"x":1}'; } };
  const t0 = Date.now();
  const r = await completeJson({ provider: slowThenGood, models: ['a', 'b', 'a'], request: { messages: [], maxTokens: 10 }, budgetMs: 1200, parse: jsonObject, label: 't' });
  assert.deepEqual(r, { value: { x: 1 }, model: 'b' });
  assert.deepEqual(calls, ['a', 'b'], 'duplicate models are tried once');
  assert.ok(Date.now() - t0 < 1200);
  const never: AiProvider = { name: 'fake', complete: () => new Promise(() => {}) };
  const t1 = Date.now();
  assert.equal(await completeJson({ provider: never, models: ['a', 'b'], request: { messages: [], maxTokens: 10 }, budgetMs: 600, parse: jsonObject, label: 't' }), null);
  assert.ok(Date.now() - t1 < 1000, 'never more than the budget');
  assert.deepEqual(jsonObject('Sure! {"a": [1]} done'), { a: [1] });
  assert.equal(jsonObject('no json'), null);
});

// ---------------------------------------------------------------- Endpoints

const req = (path: string, body: unknown, headers: Record<string, string> = {}) => new Request(`https://kevos.com/api/learn/${path}`, {
  method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: { 'Content-Type': 'application/json', Origin: 'https://kevos.com', ...headers },
});
const fakeAi = (reply: unknown) => {
  const calls: { model: string; input: any }[] = [];
  return { calls, run: async (model: string, input: Record<string, unknown>) => { calls.push({ model, input }); if (reply instanceof Error) throw reply; return reply; } };
};

test('/api/learn/intent returns a validated intent; no AI or a failing AI gives ai:false', async () => {
  const ai = fakeAi({ response: '{"subject":"manufacturing process improvement","objective":"Learn OEE","outcome":"Less downtime","level":"mixed","depth":"complete","topics":[{"name":"OEE","terms":["oee","availability"]}],"inScope":true}' });
  const data = await (await handleLearnIntent(req('intent', { question: 'I want to learn manufacturing process improvement.' }), { AI: ai })).json();
  assert.equal(data.ai, true);
  assert.equal(data.intent.subject, 'manufacturing process improvement');
  assert.equal(ai.calls[0].input.messages[0].content, INTENT_PROMPT);
  assert.match(ai.calls[0].input.messages[1].content, /Request: I want to learn/);
  assert.deepEqual(await (await handleLearnIntent(req('intent', { question: 'x y z' }), {})).json(), { ok: true, ai: false });
  assert.deepEqual(await (await handleLearnIntent(req('intent', { question: 'x y z' }), { AI: fakeAi(new Error('quota')) })).json(), { ok: true, ai: false });
  assert.deepEqual(await (await handleLearnIntent(req('intent', { question: 'x y z' }), { AI: fakeAi({ response: 'no json' }) })).json(), { ok: true, ai: false });
});

test('/api/learn/plan lists only the candidates sent and returns their ids', async () => {
  const readings = [{ id: '/reados/a/b/', title: 'OEE basics', book: 'Lean', topic: 'OEE', about: 'x' }, { id: '/reados/a/c/', title: 'Downtime', book: 'Lean', topic: 'OEE', about: 'y' }];
  const tools = [{ id: 'oee', name: 'OEE calculator', about: 'z', linked: ['R1'] }];
  const ai = fakeAi({ response: '{"title":"OEE course","modules":[{"title":"Basics","lessons":[{"title":"What OEE is","objective":"Define","reads":[1],"tools":[1]},{"title":"Downtime","objective":"Find","reads":[2],"tools":[]}]}]}' });
  const data = await (await handleLearnPlan(req('plan', { question: 'learn oee', depth: 'structured', intent: { subject: 'oee' }, readings, tools }), { AI: ai })).json();
  assert.equal(data.ai, true);
  assert.deepEqual(data.course.modules[0].lessons[0].reads, ['/reados/a/b/']);
  assert.deepEqual(data.course.modules[0].lessons[0].tools, ['oee']);
  const prompt = ai.calls[0].input.messages[1].content as string;
  assert.match(prompt, /R1\. OEE basics/);
  assert.match(prompt, /T1\. OEE calculator z \(linked to R1\)/);
  assert.doesNotMatch(prompt, /\/reados\//, 'URLs are not sent to the model');
  assert.equal((await handleLearnPlan(req('plan', { question: 'learn oee', readings: readings.slice(0, 1), tools }), { AI: ai })).status, 422, 'too little material');
  const bad = [{ id: 'javascript:alert(1)', title: 'x' }, { id: '<b>', title: 'y' }];
  assert.equal((await handleLearnPlan(req('plan', { question: 'q', readings: bad, tools: [] }), { AI: ai })).status, 422, 'invalid ids are dropped');
});

test('/api/learn/lesson and /api/learn/ask send short excerpts and validate the reply', async () => {
  const lessonReply = { response: JSON.stringify({ explanation: 'OEE has three parts.', key: { principle: 'Separate losses.', remember: ['a', 'b'], basis: 'source' }, checks: [], exercises: [] }) };
  const ai = fakeAi(lessonReply);
  const long = 'word '.repeat(2000);
  const res = await handleLearnLesson(req('lesson', { course: { title: 'C', level: 'beginner' }, module: 'M', style: 'simpler', lesson: { title: 'OEE', objective: 'Define OEE' }, sources: [{ title: 'OEE basics', book: 'Lean', outline: { s: long, h: ['Availability'], t: ['availability'] } }], tools: [] }), { AI: ai });
  const data = await res.json();
  assert.equal(data.ai, true);
  assert.equal(data.lesson.key.basis, 'source');
  const sent = ai.calls[0].input.messages[1].content as string;
  assert.ok(sent.length < 2500, 'only a short excerpt of a chapter is sent, never the whole chapter');
  assert.match(ai.calls[0].input.messages[0].content, /simpler: plain words/);
  assert.equal((await handleLearnLesson(req('lesson', { lesson: {} }), { AI: ai })).status, 400);
  const asked = fakeAi({ response: '{"answer":"Planned stops are excluded from availability.","basis":"source","refs":[1]}' });
  const a = await (await handleLearnAsk(req('ask', { course: { title: 'C' }, lesson: { title: 'OEE', summary: 's' }, sources: [{ title: 'OEE basics', book: 'Lean', outline: { s: 'x' } }], question: 'Are planned stops counted?' }), { AI: asked })).json();
  assert.deepEqual(a.answer, { answer: 'Planned stops are excluded from availability.', basis: 'source', refs: [1] });
  assert.equal((await handleLearnAsk(req('ask', { question: '  ' }), { AI: asked })).status, 422);
});

test('/api/learn validates requests and is rate limited', async () => {
  const env = { AI: fakeAi({ response: '{}' }) };
  assert.equal((await handleLearnIntent(new Request('https://kevos.com/api/learn/intent'), env)).status, 405);
  assert.equal((await handleLearnIntent(req('intent', { question: 'x' }, { Origin: 'https://evil.example' }), env)).status, 403);
  assert.equal((await handleLearnIntent(req('intent', { question: 'x' }, { 'Content-Type': 'text/plain' }), env)).status, 415);
  assert.equal((await handleLearnIntent(req('intent', '{not json'), env)).status, 400);
  assert.equal((await handleLearnIntent(req('intent', [1]), env)).status, 400);
  assert.equal((await handleLearnIntent(req('intent', { question: ' ' }), env)).status, 422, 'empty input');
  assert.equal((await handleLearnIntent(req('intent', { question: 'a'.repeat(1001) }), env)).status, 413, 'very long question');
  assert.equal((await handleLearnPlan(req('plan', { question: 'q', readings: 'x'.repeat(30_000) }), env)).status, 413, 'body limit');
  const kv = new Map<string, string>();
  const limited = { CONTACT_RATE_LIMIT: { get: async (k: string) => kv.get(k) ?? null, put: async (k: string, v: string) => void kv.set(k, v) }, LEARN_RATE_LIMIT_MAX: '2' };
  const h = { 'CF-Connecting-IP': '203.0.113.7' };
  for (let i = 0; i < 2; i++) assert.equal((await handleLearnIntent(req('intent', { question: 'repeat me' }, h), limited)).status, 200, 'repeated question');
  assert.equal((await handleLearnIntent(req('intent', { question: 'repeat me' }, h), limited)).status, 429);
});

test('the Worker routes /api/learn/* and keeps unknown learn paths 404', async () => {
  const env: Env = { ASSETS: { fetch: async () => new Response('asset') } };
  for (const p of ['intent', 'plan', 'lesson', 'ask']) {
    const res = await worker.fetch(new Request(`https://kevos.com/api/learn/${p}`), env);
    assert.equal(res.status, 405, `${p} is routed (GET is not allowed)`);
  }
  assert.equal((await worker.fetch(new Request('https://kevos.com/api/learn/other', { method: 'POST' }), env)).status, 404);
});

test('the homepage keeps one question box and no new credentials reach the browser', () => {
  const box = readFileSync(join(ROOT, 'src/components/discovery/DiscoveryBox.astro'), 'utf8');
  assert.match(box, /Build My Learning Path/);
  assert.match(box, /maxlength="1000"/);
  for (const f of ['src/scripts/learning-ui.ts', 'src/lib/learning/client.ts', 'src/lib/learning/retrieve.ts', 'src/lib/learning/course.ts']) {
    const s = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(s, /api[_-]?key|secret|token|Bearer/i, `${f} holds no credentials`);
    assert.doesNotMatch(s, /localStorage/, `${f} keeps progress in the tab only`);
    assert.doesNotMatch(s, /WORKOS|READOS/, `${f} uses the current names`);
  }
  const ui = readFileSync(join(ROOT, 'src/scripts/learning-ui.ts'), 'utf8');
  assert.match(ui, /THE KEY THINGS TO UNDERSTAND/);
  assert.match(ui, /kept in this browser tab only/);
});
