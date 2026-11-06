import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDiscoveryDetails, buildDiscoveryIndex } from '../src/utils/discovery-index.ts';
import { prepare, search, shortlist } from '../src/lib/discovery/search.ts';
import { aiPath, buildPath, classify, WORKFLOWS, type DiscoveryDetails, type QuestionType, type SolutionPath } from '../src/lib/discovery/plan.ts';
import { handleDiscover, parseIntent, SYSTEM_PROMPT } from '../src/server/discover/handler.ts';

const index = JSON.parse(JSON.stringify(buildDiscoveryIndex()));
const engine = prepare(index);
const details: DiscoveryDetails = JSON.parse(JSON.stringify(buildDiscoveryDetails()));
const urls = new Set<string>([...index.tools.map((t: { id: string; p: number }) => (t.p ? `/tools/${t.id}/` : `/tools/?tool=${t.id}`)), ...index.chapters.map((c: { u: string }) => c.u), ...index.books.map((b: { u: string }) => b.u)]);
const apps = new Set<string>(index.tools.map((t: { id: string }) => `/tools/?tool=${t.id}`));
const linked = new Set<string>(index.links.map(([t, r]: [string, string]) => `${t}|${r}`));

/** Questions across the five kinds of work, with the type expected and a tool the path should use. */
const CASES: { q: string; type: QuestionType; tool: RegExp }[] = [
  // Calculation
  { q: 'what torque should I tighten an M12 bolt to', type: 'calculation', tool: /bolt/i },
  { q: 'how much will this beam deflect', type: 'calculation', tool: /beam/i },
  { q: 'convert psi to bar', type: 'calculation', tool: /pressure/i },
  { q: 'spring rate calculation', type: 'calculation', tool: /spring/i },
  { q: 'how long will my bearing last', type: 'calculation', tool: /bearing/i },
  { q: 'calculate the flow through a pipe', type: 'calculation', tool: /flow|pipe|pressure/i },
  // Engineering design
  { q: 'pressure vessel wall thickness', type: 'design', tool: /vessel|thickness/i },
  { q: 'design a shaft for a gearbox', type: 'design', tool: /shaft/i },
  { q: 'select a bearing for a pump', type: 'design', tool: /bearing/i },
  { q: 'weld size for a fillet weld', type: 'design', tool: /weld/i },
  { q: 'what size hydraulic cylinder do I need', type: 'calculation', tool: /cylinder/i },
  { q: 'choose a fit and tolerance for a shaft and hole', type: 'design', tool: /fit|tolerance|interference|clearance/i },
  // Manufacturing
  { q: 'What speed should I run my cutter?', type: 'manufacturing', tool: /cutting|speed/i },
  { q: 'what feed per tooth should I use for an end mill', type: 'manufacturing', tool: /mill|chip|feed/i },
  { q: 'bend allowance for sheet metal', type: 'manufacturing', tool: /bend|sheet/i },
  { q: 'Help me calculate CNC machining parameters', type: 'manufacturing', tool: /mill|cut|machin/i },
  { q: 'is my process capable cpk', type: 'manufacturing', tool: /capab/i },
  { q: 'how to calculate OEE', type: 'manufacturing', tool: /oee/i },
  // Troubleshooting
  { q: 'why does my bearing keep failing', type: 'troubleshooting', tool: /bearing/i },
  { q: 'How can I reduce machine downtime?', type: 'troubleshooting', tool: /downtime|oee|availab/i },
  { q: 'our compressed air system keeps leaking', type: 'troubleshooting', tool: /air|leak/i },
  { q: 'why is my bolted joint coming loose', type: 'troubleshooting', tool: /bolt|joint|preload/i },
  { q: 'too many defects and scrap on the line', type: 'troubleshooting', tool: /./ },
  // Business decisions
  { q: 'How much money am I losing when my machine is sitting idle?', type: 'business', tool: /downtime|machine/i },
  { q: 'should I buy or lease equipment', type: 'business', tool: /lease|buy/i },
  { q: 'what is my break even point', type: 'business', tool: /break/i },
  { q: 'margin vs markup', type: 'business', tool: /margin/i },
  { q: 'is this new machine worth buying', type: 'business', tool: /invest|roi|apprais|payback|machine/i },
  { q: 'How do I calculate manufacturing costs?', type: 'business', tool: /cost|rate/i },
  { q: 'how many staff do I need for the workload', type: 'business', tool: /staff|workload/i },
  // Learning
  { q: 'I want to understand OEE', type: 'learning', tool: /oee/i },
  { q: 'explain how bolt preload works', type: 'learning', tool: /bolt|preload/i },
];

function assertPathIsGrounded(p: SolutionPath, label: string) {
  assert.ok(p.steps.length >= 2 && p.steps.length <= 6, `${label}: 2–6 steps (${p.steps.length})`);
  const seenReads = new Set<string>();
  for (const s of p.steps) {
    assert.ok(s.do.length > 3 && s.why.length > 3, `${label}: every step says what to do and why`);
    for (const l of [...s.reads, ...s.tools]) assert.ok(urls.has(l.url), `${label}: ${l.url} is a real catalogue page`);
    for (const t of s.tools) assert.ok(t.app && apps.has(t.app), `${label}: ${t.title} opens its calculator`);
    for (const r of s.reads) { assert.ok(!seenReads.has(r.url), `${label}: ${r.title} is not repeated`); seenReads.add(r.url); }
    if (s.tools.length && s.inputsFrom === 'tool') {
      const id = s.tools[0].app!.replace('/tools/?tool=', '');
      assert.deepEqual(s.inputs, details.tools[id].i, `${label}: inputs are the tool's own fields`);
      assert.deepEqual(s.output, details.tools[id].o, `${label}: outputs are the tool guide's`);
    }
    for (const r of s.reads.filter((x) => x.verified)) {
      assert.ok(s.tools.some((t) => linked.has(`${t.app!.replace('/tools/?tool=', '')}|${r.url}`) || [...linked].some((k) => k.startsWith(`${t.app!.replace('/tools/?tool=', '')}|`) && index.books.some((b: { u: string; id: string }) => b.u === r.url && k.endsWith(`|${b.id}`)))), `${label}: "verified" means a reviewed knowledge link`);
    }
    if (!s.reads.length && !s.tools.length && s.gap) assert.match(s.gap, /does not have/);
  }
  assert.ok(p.outcome.length > 10 && !/\{tool\}/.test(p.outcome), `${label}: an outcome is stated`);
}

test('every tool has its inputs, outputs and a check from its own definition', () => {
  assert.equal(Object.keys(details.tools).length, index.tools.length);
  for (const [id, d] of Object.entries(details.tools)) {
    assert.ok(d.i.length <= 6 && d.o.length >= 1 && d.o.length <= 4, id);
    assert.ok(!d.i.includes('Calculate'), `${id}: mode selectors are not inputs`);
  }
  const bolt = details.tools['bolt-torque-preload'];
  assert.ok(bolt.i.includes('Nominal diameter (mm)') && bolt.o.includes('Tightening torque'));
  assert.ok(bolt.c.length > 20);
});

test(`questions are classified into the six workflows (${CASES.length} questions)`, () => {
  for (const c of CASES) assert.equal(classify(c.q), c.type, c.q);
  for (const t of Object.keys(WORKFLOWS)) assert.ok(WORKFLOWS[t as QuestionType].steps.length >= 3, t);
});

for (const c of CASES) {
  test(`solution path without AI: ${c.q}`, () => {
    const outcome = search(engine, { question: c.q });
    assert.equal(outcome.mode, 'results', 'the page shows a path only with results (not a clarifying question)');
    const p = buildPath(engine, c.q, outcome, details);
    assert.ok(p, 'a path is built');
    assert.equal(p!.type, c.type);
    assert.equal(p!.source, 'workflow');
    assertPathIsGrounded(p!, c.q);
    assert.ok(p!.steps.some((s) => s.tools.some((t) => c.tool.test(t.title))), `${c.q}: a fitting tool is in the path (${p!.steps.flatMap((s) => s.tools.map((t) => t.title)).join(', ')})`);
    if (c.type !== 'learning') assert.ok(p!.steps.some((s) => s.inputsFrom === 'tool' && s.inputs.length), `${c.q}: required inputs come from a tool`);
  });
}

test('no path for out-of-scope questions or broad ones that need a clarifying question', () => {
  assert.equal(buildPath(engine, 'weather forecast tomorrow', search(engine, { question: 'weather forecast tomorrow' }), details), null);
  const broad = search(engine, { question: 'cost' });
  assert.equal(broad.mode, 'clarify');
});

test('missing resources are named, not invented', () => {
  const outcome = { mode: 'results' as const, platform: [], tools: [], readings: search(engine, { question: 'bolt preload' }).readings.slice(0, 1), related: [], concepts: [], corrections: [] };
  const p = buildPath(engine, 'calculate bolt preload', outcome, details)!;
  const gap = p.steps.find((s) => s.gap);
  assert.ok(gap && /does not have a tool/.test(gap.gap!), 'a step without a tool says so');
});

test('the AI plan is used only with real catalogue entries, and tool facts override AI text', () => {
  const p = aiPath(engine, {
    type: 'design',
    steps: [
      { do: 'Set the joint loads and bolt grade', why: 'They decide the preload you need', need: ['External load on the joint', 'Bolt grade'] },
      { do: 'Calculate the tightening torque', why: 'The tool applies the nut factor method', tools: ['bolt-torque-preload', 'not-a-tool'], reads: ['/reados/publications/bolted-joints-by-the-numbers/torque-and-the-nut-factor/', '/made/up/'], need: ['Ignored because a tool is attached'], check: 'Check the preload against proof load' },
      { do: '' },
    ],
    missing: ['the bolt grade'], assumptions: ['A dry, unlubricated thread'], outcome: 'A tightening torque with preload checked against proof load',
  }, details, 'calculation')!;
  assert.equal(p.source, 'ai');
  assert.equal(p.type, 'design');
  assert.equal(p.steps.length, 2, 'a step without "do" is dropped');
  assert.deepEqual(p.steps[0].inputs, ['External load on the joint', 'Bolt grade']);
  assert.equal(p.steps[0].inputsFrom, 'guide');
  const s = p.steps[1];
  assert.deepEqual(s.tools.map((t) => t.title), ['Bolt Tightening Torque and Preload'], 'an unknown tool id is dropped');
  assert.equal(s.reads.length, 1, 'an unknown reading is dropped');
  assert.deepEqual(s.inputs, details.tools['bolt-torque-preload'].i, 'inputs come from the tool, not the AI');
  assert.equal(s.checkTip, 'Check the preload against proof load');
  assert.ok(s.checkFact, 'the tool guide’s own check is shown as well');
  assertPathIsGrounded(p, 'ai plan');
  // Too thin to be useful: fall back to the workflow.
  assert.equal(aiPath(engine, { steps: [{ do: 'Think about it' }] }, details, 'calculation'), null);
  const q = 'what torque should I tighten an M12 bolt to';
  assert.equal(buildPath(engine, q, search(engine, { question: q }), details, { steps: [{ do: 'Only one step' }] })!.source, 'workflow');
});

test('the Worker restricts the AI plan: list numbers by kind, no results, no links, short text', () => {
  const candidates = [
    { id: 'bolt-torque-preload', kind: 'tool', name: 'Bolt Tightening Torque and Preload', about: '' },
    { id: '/reados/publications/bolted-joints-by-the-numbers/torque-and-the-nut-factor/', kind: 'chapter', name: 'Torque and the nut factor', about: '' },
  ];
  const reply = {
    summary: 'tighten an M12 bolt to the right torque', type: 'calculation', terms: ['bolt torque'],
    steps: [
      { do: 'Read how torque turns into preload', why: 'Friction takes most of the torque', reads: [2, 1, 9], tools: [2] },
      { do: 'Calculate the torque with the tool', tools: [1, 2], reads: [], need: ['ignored'], check: 'Compare with the fastener supplier table' },
      { do: 'Tighten to 85 N·m', why: 'The torque is 85 N·m' },
      { do: 'Visit https://evil.example', why: 'x' },
      { do: 'x'.repeat(130) },
    ],
    missing: ['the bolt property class', 'the lubrication', 'the joint material', 'extra one'],
    assumptions: ['A steel joint', 'answer = 85'],
    outcome: 'A tightening torque for your bolt, checked against the joint',
  };
  const intent = parseIntent(JSON.stringify(reply), 'what torque should I tighten an M12 bolt to', candidates as never)!;
  const plan = intent.plan!;
  assert.equal(plan.type, 'calculation');
  assert.equal(plan.steps!.length, 2, 'a step stating a result, a link or overlong text is dropped');
  assert.deepEqual(plan.steps![0].reads, ['/reados/publications/bolted-joints-by-the-numbers/torque-and-the-nut-factor/'], 'reading numbers only point at readings');
  assert.equal(plan.steps![0].tools, undefined, 'a reading number in "tools" is dropped');
  assert.deepEqual(plan.steps![1].tools, ['bolt-torque-preload']);
  assert.equal(plan.steps![1].need, undefined, 'a tool step lists the tool inputs, not the AI’s');
  assert.equal(plan.missing!.length, 3);
  assert.deepEqual(plan.assumptions, ['A steel joint'], 'an assumption stating a result is dropped');
  assert.equal(plan.outcome, 'A tightening torque for your bolt, checked against the joint');
  assert.equal(parseIntent('{"summary":"x","terms":["bolt"]}', 'bolt', candidates as never)!.plan, undefined, 'no plan fields, no plan');
});

test('the prompt asks for a typed, ordered plan with workflows, and leaves calculation to the tools', async () => {
  for (const t of ['calculation', 'troubleshooting', 'design', 'manufacturing', 'business', 'learning']) assert.match(SYSTEM_PROMPT, new RegExp(`${t}:`));
  assert.match(SYSTEM_PROMPT, /never give numbers or results \(the tools calculate\)/);
  assert.match(SYSTEM_PROMPT, /"missing"/);
  assert.match(SYSTEM_PROMPT, /"assumptions"/);
  const calls: any[] = [];
  const ai = { run: async (model: string, input: any) => { calls.push(input); return { response: '{"summary":"x","terms":["bolt torque"]}' }; } };
  const question = 'what torque should I tighten an M12 bolt to';
  const candidates = shortlist(engine, { question }, 14, 8);
  const res = await handleDiscover(new Request('https://kevos.com/api/discover', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://kevos.com' }, body: JSON.stringify({ question, candidates }) }), { AI: ai });
  assert.equal(res.status, 200);
  assert.equal(calls[0].max_tokens, 900, 'room for a plan');
  assert.ok(candidates.filter((c) => c.kind !== 'tool').length > 0 && candidates.length <= 22);
});
