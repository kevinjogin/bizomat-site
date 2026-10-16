import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

// KEVOS® WORKOS: tool register, guides, calculations, decision rules, sensitivity analysis and decision reports.
// The browser scripts in public/tools/ are loaded into a VM with a minimal document so they run unchanged.

const DIR = join(process.cwd(), 'public', 'tools');
const FILES = ['decide', 'money', 'projects', 'operations', 'manufacturing', 'engineering', 'quoting', 'inventory', 'improvement', 'planning', 'business'];
const read = (name: string) => readFileSync(join(DIR, name), 'utf8');

// Tool ids published before the upgrade; their /tools/?tool=<id> links must keep working.
const LEGACY_IDS = ['make-buy', 'project-gate', 'priority', 'option-compare', 'change-impact', 'risk-score', 'roi', 'break-even', 'margin', 'true-cost', 'investment-check', 'savings-check', 'project-health', 'project-size', 'resource-fit', 'schedule-risk', 'contingency', 'business-case', 'capacity', 'bottleneck', 'takt-time', 'oee', 'cycle-time', 'staffing-need', 'shift-output', 'batch-fit', 'machine-load', 'scrap-impact', 'setup-worth', 'tooling-payback', 'downtime-cost', 'yield-check', 'quote-check', 'price-builder', 'labour-quote', 'job-cost', 'supplier-compare', 'moq-check', 'reorder-point', 'safety-stock', 'inventory-cost', 'stock-days', 'order-quantity', 'improvement-value', 'waste-check', 'before-after', 'automation-check', 'process-score', 'demand-capacity', 'deadline-check', 'workload', 'what-if', 'hire-outsource', 'subscription-value', 'buy-lease', 'process-or-software', 'build-buy-software', 'manufacturing-quote', 'make-vs-buy-pro', 'oee-downtime-pro', 'capacity-planner-pro', 'jig-fixture-roi'];
const GUIDE_SECTIONS = ['purpose', 'uses', 'users', 'inputs', 'outputs', 'method', 'limitations', 'interpret', 'refs'];
const CHECK_STATUSES = ['pass', 'warn', 'fail', 'verify'];

type Inputs = Record<string, string | number>;

/** Load data, guides, engine and calculations; `run` calculates a tool with its defaults plus overrides. */
function loadEngine() {
  const inputs: Inputs = {};
  const document = {
    querySelector: (s: string) => {
      const k = /\[name="([^"]+)"\]/.exec(s)?.[1];
      return k && k in inputs ? { value: String(inputs[k]) } : null;
    },
  };
  const ctx: any = createContext({ window: {}, document, console });
  for (const kind of ['data', 'guides']) for (const f of FILES) runInContext(read(`${kind}-${f}.js`), ctx, { filename: `${kind}-${f}.js` });
  runInContext(read('core.js'), ctx, { filename: 'core.js' });
  for (const f of FILES) runInContext(read(`calc-${f}.js`), ctx, { filename: `calc-${f}.js` });
  const tools: any[] = ctx.window.GOCORE_TOOLS;
  const guides: Record<string, any> = ctx.window.WORKOS_GUIDES;
  const tool = (id: string) => {
    const t = tools.find((x) => x.id === id);
    assert.ok(t, `tool ${id} exists`);
    return t;
  };
  const set = (id: string, over: Inputs = {}) => {
    for (const k of Object.keys(inputs)) delete inputs[k];
    for (const f of tool(id).fields) if (f.type !== 'heading') inputs[f.key] = f.default;
    Object.assign(inputs, over);
  };
  const run = (id: string, over: Inputs = {}) => {
    set(id, over);
    return runInContext(`calc(${JSON.stringify(id)})`, ctx);
  };
  const sensitivity = (id: string, over: Inputs = {}) => {
    const r = run(id, over);
    ctx.__tool = tool(id);
    ctx.__result = r;
    return { r, rows: runInContext('sensitivity(__tool, __result)', ctx) as any[] };
  };
  return { ctx, tools, guides, tool, run, sensitivity };
}
const engine = loadEngine();
const metric = (r: any, label: string) => r.metrics.find((x: any) => x.label === label)?.value;
const near = (actual: number, expected: number, tol: number, what: string) => assert.ok(Math.abs(actual - expected) <= tol, `${what}: ${actual} should be ${expected} ± ${tol}`);

// ---------------------------------------------------------------- Files and register

test('every WORKOS browser script parses', () => {
  for (const name of readdirSync(DIR).filter((n) => n.endsWith('.js'))) {
    assert.doesNotThrow(() => new Function(read(name)), `${name} must parse`);
  }
});

test('the tools page loads exactly the category files that exist, in data → guides → core → calc → ui order', () => {
  const page = readFileSync(join(process.cwd(), 'src', 'pages', 'tools', 'index.astro'), 'utf8');
  const listed = /const FILES = \[([^\]]+)\]/.exec(page)?.[1].match(/'([a-z]+)'/g)?.map((s) => s.slice(1, -1));
  assert.deepEqual(listed, FILES);
  for (const kind of ['data', 'guides', 'calc']) {
    const onDisk = readdirSync(DIR).filter((n) => n.startsWith(`${kind}-`)).map((n) => n.slice(kind.length + 1, -3)).sort();
    assert.deepEqual(onDisk, [...FILES].sort(), `${kind}-*.js files match the page list`);
  }
  for (let i = 1; i <= 7; i++) assert.ok(!existsSync(join(DIR, `data-${i}.js`)) && !existsSync(join(DIR, `calc-${i}.js`)), `old bundle ${i} removed`);
  const order = ['/tools/data-${f}.js', '/tools/guides-${f}.js', '/tools/core.js', '/tools/calc-${f}.js', '/tools/ui.js'].map((s) => page.indexOf(s));
  assert.ok(order.every((p) => p > 0), 'all script groups are loaded');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'scripts load in dependency order');
  assert.match(page, /data-tool-id=\{t\.id\}/, 'directory cards are rendered at build time');
  assert.match(page, /href=\{`\/tools\/\?tool=\$\{t\.id\}`\}/, 'each card links to its tool');
});

test('register: 63 tools with unique ids, every published id kept, and the Retention Method Selector added', () => {
  const ids = engine.tools.map((t) => t.id);
  assert.equal(ids.length, 63);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const id of LEGACY_IDS) assert.ok(ids.includes(id), `${id} still exists`);
  assert.ok(ids.includes('retention-selector'));
  const categories = new Set(engine.tools.map((t) => t.category));
  assert.deepEqual([...categories].sort(), ['Business', 'Decide', 'Engineering', 'Improvement', 'Inventory', 'Manufacturing', 'Money', 'Operations', 'Planning', 'Projects', 'Quoting']);
  assert.equal(engine.tool('retention-selector').category, 'Engineering');
  for (const t of engine.tools) {
    for (const k of ['name', 'category', 'question', 'description']) assert.ok(typeof t[k] === 'string' && t[k].length > 3, `${t.id}.${k}`);
    assert.ok(Array.isArray(t.keywords) && t.keywords.length, `${t.id} has search keywords`);
  }
});

test('every default is accepted by its field constraints', () => {
  for (const t of engine.tools) {
    const keys = new Set<string>();
    for (const field of t.fields) {
      const label = `${t.id}/${field.key}`;
      assert.ok(field.key && !keys.has(field.key), `${label} has a unique key`);
      keys.add(field.key);
      assert.ok(field.label, `${label} has a label`);
      if (field.type === 'heading') continue;
      if (field.type === 'select') {
        assert.ok(field.options.some((o: string[]) => o[0] === field.default), `${label} default is one of its options`);
        continue;
      }
      assert.ok(field.type === 'number' || field.type === 'range', `${label} has a known type`);
      assert.ok(Number.isFinite(field.default), `${label} has a numeric default`);
      if (field.min !== undefined) assert.ok(field.default >= field.min, `${label} meets its minimum`);
      if (field.max !== undefined) assert.ok(field.default <= field.max, `${label} meets its maximum`);
      if (typeof field.step === 'number') {
        const steps = (field.default - (field.min ?? 0)) / field.step;
        assert.ok(Math.abs(steps - Math.round(steps)) < 1e-8, `${label} aligns with its HTML input step`);
      }
    }
  }
});

test('WORKOS has no Free or Pro tiers', () => {
  const sources = [...readdirSync(DIR).filter((n) => n.endsWith('.js')).map((n) => [n, read(n)]), ['index.astro', readFileSync(join(process.cwd(), 'src', 'pages', 'tools', 'index.astro'), 'utf8')], ['tools.css', readFileSync(join(process.cwd(), 'src', 'styles', 'tools.css'), 'utf8')]];
  for (const [name, text] of sources) {
    assert.doesNotMatch(text, /\b(Pro|PRO|Free|FREE|Premium|premium)\b|\bupgrade\b|\bunlock\b|pro-label|featured-tools|tier/, `${name} has no tier wording`);
  }
  for (const t of engine.tools) for (const k of ['pro', 'featured', 'tier', 'badge']) assert.ok(!(k in t), `${t.id} has no ${k} flag`);
});

// ---------------------------------------------------------------- Guides

test('every tool has a complete guide with a source for every input', () => {
  for (const t of engine.tools) {
    const g = engine.guides[t.id];
    assert.ok(g, `${t.id} has a guide`);
    for (const s of GUIDE_SECTIONS) assert.ok(s in g, `${t.id} guide has ${s}`);
    assert.ok(typeof g.purpose === 'string' && g.purpose.length > 20, `${t.id} purpose`);
    for (const s of ['uses', 'users', 'outputs', 'method', 'limitations', 'interpret']) assert.ok(Array.isArray(g[s]) && g[s].length, `${t.id} guide ${s} is filled`);
    const keys = t.fields.filter((f: any) => f.type !== 'heading').map((f: any) => f.key);
    for (const k of keys) assert.ok(g.inputs[k], `${t.id} explains where to find ${k}`);
    for (const k of Object.keys(g.inputs)) assert.ok(keys.includes(k), `${t.id} guide input ${k} matches a field`);
  }
  assert.equal(Object.keys(engine.guides).length, engine.tools.length, 'no guides without a tool');
});

// ---------------------------------------------------------------- Calculations

test('every tool returns a complete decision with its default inputs', () => {
  for (const t of engine.tools) {
    const r = engine.run(t.id);
    assert.ok(r.text && r.summary, `${t.id} has a decision and summary`);
    assert.ok(['good', 'warn', 'bad'].includes(r.tone), `${t.id} tone`);
    assert.ok(r.metrics.length >= 2, `${t.id} reports metrics`);
    // The selector has no cost measure until costs are entered (a blank cost is unknown, not zero)
    assert.ok(r.primary && (Number.isFinite(r.primary.value) || t.id === 'retention-selector'), `${t.id} has a finite primary measure`);
    assert.ok(r.checks.length >= 1, `${t.id} runs at least one feasibility or verification check`);
    for (const c of r.checks) assert.ok(CHECK_STATUSES.includes(c.status), `${t.id} check status ${c.status}`);
    assert.ok(r.actions.length + r.verify.length >= 1, `${t.id} gives next actions or verification items`);
    const strings = JSON.stringify([r.text, r.summary, r.metrics, r.recommendation, r.checks, r.actions, r.verify, r.table, r.risks, r.guidance]);
    assert.doesNotMatch(strings, /NaN|undefined|Infinity|\[object/, `${t.id} output has no broken values`);
    if (r.table) for (const row of r.table.rows) assert.equal(row.length, r.table.head.length, `${t.id} table rows match the header`);
  }
});

test('finance: ROI/NPV, break-even, buy vs lease and price match hand calculations', () => {
  // NPV = 15,000 × (1 − 1.08⁻³) / 0.08 − 25,000
  const af = (r: number, n: number) => (1 - Math.pow(1 + r, -n)) / r;
  near(engine.run('roi').primary.value, 15000 * af(0.08, 3) - 25000, 0.01, 'ROI NPV');
  near(engine.run('roi').primary.value, 13656.45, 0.01, 'ROI NPV value');
  assert.equal(metric(engine.run('roi'), 'Simple payback'), '1.67 years');
  // Break-even = 20,000 / (25 − 14) = 1,818.2 units; margin of safety = (2,500 − 1,818.2) / 2,500
  const be = engine.run('break-even');
  assert.equal(metric(be, 'Break-even units'), '1,818');
  assert.equal(metric(be, 'Margin of safety'), '27.3%');
  near(be.primary.value, 2500 * 11 - 20000, 1e-9, 'profit at expected volume');
  // Buy PV = 60,000 + 3,000 × AF(8 %, 4) − 15,000 / 1.08⁴; lease at the equivalent monthly rate
  const rm = Math.pow(1.08, 1 / 12) - 1;
  const pvBuy = 60000 + 3000 * af(0.08, 4) - 15000 / Math.pow(1.08, 4);
  const pvLease = 3000 + 1500 * af(rm, 48);
  near(engine.run('buy-lease').primary.value, pvLease - pvBuy, 0.01, 'lease − buy present value');
  assert.equal(engine.run('buy-lease').text, 'BUY');
  // Price for 30 % margin on $700 = 700 / 0.7
  near(engine.run('price-builder').primary.value, 1000, 1e-9, 'price builder');
  // Manufacturing quote: (100 × 8 + 12 × 55 + 8 × 75) × 1.15 / 0.7
  const mq = engine.run('manufacturing-quote');
  near(mq.primary.value, ((800 + 660 + 600) * 1.15) / 0.7, 1e-6, 'manufacturing quote');
  assert.equal(metric(mq, 'Quote / unit'), '$33.84');
  // Make or buy crossover = (5,000 − 1,000) / (3.20 − 2.50)
  assert.equal(metric(engine.run('make-buy'), 'Crossover volume'), '5,714 units');
});

test('operations and inventory: OEE, capacity, EOQ and safety stock match hand calculations', () => {
  near(engine.run('oee').primary.value, 90 * 0.92 * 0.98, 1e-9, 'OEE');
  // Availability 420/480, performance 700 × 0.5 min / 420, quality 665/700
  near(engine.run('oee-downtime-pro').primary.value, (420 / 480) * (350 / 420) * (665 / 700) * 100, 1e-9, 'OEE from counts');
  // Performance is capped at 100 % and flagged when the count exceeds the ideal rate
  const fast = engine.run('oee-downtime-pro', { totalCount: 900, goodCount: 880 });
  near(fast.primary.value, (420 / 480) * 1 * (880 / 900) * 100, 1e-9, 'performance capped');
  assert.ok(fast.checks.some((c: any) => c.status === 'fail'), 'impossible performance is a FAIL check');
  // 2 machines × 2 shifts × 8 h × 3,600 s × 22 days / 45 s × 85 %
  near(engine.run('capacity-planner-pro').primary.value, (40000 / (((2 * 2 * 8 * 3600 * 22) / 45) * 0.85)) * 100, 1e-9, 'capacity load');
  near(engine.run('order-quantity').primary.value, Math.sqrt((2 * 24000 * 80) / 2), 1e-9, 'EOQ');
  assert.equal(engine.run('order-quantity').text, '1,386 UNITS');
  assert.equal(engine.run('reorder-point').primary.value, 40 * 10 + 150);
  // Without variation data the max − average rule applies: 60 × 14 − 40 × 9
  const ssRule = engine.run('safety-stock');
  assert.equal(ssRule.primary.value, 480);
  assert.equal(metric(ssRule, 'Statistical method'), 'Needs variation data');
  // Statistical: z(95 %) × √(L σd² + d² σL²)
  const ss = engine.run('safety-stock', { sdDaily: 8, sdLead: 2, service: '95' });
  near(ss.primary.value, 1.6449 * Math.sqrt(9 * 64 + 1600 * 4), 0.5, 'statistical safety stock');
  const ss99 = engine.run('safety-stock', { sdDaily: 8, sdLead: 2, service: '99' });
  assert.ok(ss99.primary.value > ss.primary.value, 'higher service level needs more safety stock');
  assert.equal(engine.run('takt-time').primary.value, 420 / 120);
});

test('technical gates override scores and costs in the general tools', () => {
  // A supplier rated 2 for quality is excluded even with the best price and lead time
  const s = engine.run('supplier-compare', { aQuality: 2, aPrice: 5000, aLead: 5 });
  assert.equal(s.text, 'SUPPLIER B');
  const both = engine.run('supplier-compare', { aQuality: 2, bReliability: 1 });
  assert.equal(both.text, 'BOTH REJECTED');
  assert.equal(both.tone, 'bad');
  // Weighted score A = (40 × 92 + 15 × 100 + 20 × 80 + 25 × 80) / 100; B = (40 × 100 + 15 × 60 + 20 × 60 + 25 × 60) / 100
  near(engine.run('supplier-compare').primary.value, 87.8 - 76, 1e-9, 'supplier score margin');
  // A high project-gate score cannot be GO when readiness is 2 or less
  const strong = { benefit: 100000, cost: 30000, strategic: 5, urgency: 5, risk: 1 };
  assert.equal(engine.run('project-gate', { ...strong, resource: 4 }).text, 'GO');
  assert.equal(engine.run('project-gate', { ...strong, resource: 2 }).text, 'HOLD / REVIEW');
});

// ---------------------------------------------------------------- Retention Method Selector

const RS = 'retention-selector';
const statuses = (r: any) => Object.fromEntries(r.table.rows.map((row: string[]) => [row[0][0], row[1]]));

test('retention selector: example inputs never claim a PASS without evidence', () => {
  const t = engine.tool(RS);
  for (const f of t.fields) {
    if (/^(rating|maxRpm|maxTemp|part|feature|time|tooling)[ABC]$/.test(f.key) || f.key === 'designFactor') assert.equal(f.default, 0, `${f.key} has no invented default`);
  }
  const r = engine.run(RS);
  assert.equal(r.text, 'VERIFICATION REQUIRED');
  assert.equal(r.tone, 'warn');
  assert.deepEqual(statuses(r), { A: 'VERIFY', B: 'VERIFY', C: 'REJECT' }, 'press fit is rejected for occasional disassembly');
  assert.ok(r.checks.some((c: any) => c.label === 'Required design factor' && c.status === 'verify'));
  assert.match(r.summary, /evidence is missing for A and B\.$/, 'no leading candidate is named without costs');
  assert.ok(Number.isNaN(r.primary.value), 'no cost measure without costs');
  assert.doesNotMatch(JSON.stringify(r.table.rows), /\$/, 'no costs are shown when none were entered');
});

test('retention selector: a missing design factor or load keeps every candidate at VERIFY', () => {
  const evidence = { ratingA: 9000, ratingB: 9000, methodC: 'collar', ratingC: 9000 };
  const noDf = engine.run(RS, evidence);
  assert.equal(noDf.text, 'VERIFICATION REQUIRED');
  assert.deepEqual(statuses(noDf), { A: 'VERIFY', B: 'VERIFY', C: 'VERIFY' });
  const noLoad = engine.run(RS, { ...evidence, designFactor: 2, load: 0 });
  assert.equal(noLoad.text, 'VERIFICATION REQUIRED', 'no load means capacity cannot be accepted');
  assert.ok(noLoad.checks.some((c: any) => /rated capacity vs load/.test(c.label) && c.status === 'verify'));
});

test('retention selector: only PASS candidates are recommended, cheapest first, and rejection overrides cost', () => {
  const base = { designFactor: 2, load: 1500, methodC: 'collar', ratingA: 6000, ratingB: 4000, ratingC: 2000 };
  const costs = { partA: 0.5, featureA: 0.3, timeA: 12, toolingA: 1000, partB: 0.2, featureB: 0.4, timeB: 20, toolingB: 500, partC: 0.05, featureC: 0, timeC: 6, toolingC: 0 };
  const r = engine.run(RS, { ...base, ...costs });
  // C (collar) is the cheapest but its 2,000 N rating gives 1.33 < 2 → REJECT, whatever its cost
  assert.deepEqual(statuses(r), { A: 'PASS', B: 'PASS', C: 'REJECT' });
  // Lifecycle = volume × years × (unit + service) + tooling, unit = part + feature + time/3600 × rate,
  // service = disassemblies × (2 × handling labour + replacement part for replace-type methods)
  const life = (part: number, feature: number, time: number, tooling: number) => {
    const lab = (time / 3600) * 60;
    return 5000 * 5 * (part + feature + lab + 1 * (2 * lab + part)) + tooling;
  };
  const a = life(0.5, 0.3, 12, 1000), b = life(0.2, 0.4, 20, 500);
  near(a, 48500, 1e-6, 'candidate A lifecycle');
  const winner = a < b ? 'A' : 'B';
  assert.equal(r.text, `RECOMMENDED: ${winner === 'A' ? 'RETAINING RING (CIRCLIP)' : 'SPRING PIN THROUGH CROSS-HOLE'}`);
  near(r.primary.value, Math.min(a, b), 1e-6, 'recommended lifecycle cost');
  assert.equal(r.table.rows[0][4], '$48,500');
  // Rejected candidates get no risks or guidance; passing ones get both
  assert.ok(!r.guidance.some((g: any) => g.title.includes('C ·')));
  assert.ok(r.guidance.some((g: any) => g.title.startsWith('Assembly guidance: A')) && r.guidance.some((g: any) => g.title.startsWith('Drawing requirements: B')));
  assert.ok(r.risks.every((x: any) => !x.risk.startsWith('C ·')) && r.risks.length >= 4);
  // Making the cheapest passing candidate fail a speed rating hands the recommendation to the other one
  const fast = engine.run(RS, { ...base, ...costs, rpm: 3000, maxRpmA: 2000, maxRpmB: 5000 });
  assert.equal(statuses(fast).A, 'REJECT');
  assert.equal(statuses(fast).B, 'PASS');
  assert.equal(fast.text, 'RECOMMENDED: SPRING PIN THROUGH CROSS-HOLE');
});

test('retention selector: a blank cost is unknown, not zero, so it never wins on cost', () => {
  const pass = { designFactor: 2, ratingA: 6000, ratingB: 6000, methodC: 'collar', ratingC: 6000 };
  // A and B have costs, C has none: three candidates pass but cannot be ranked
  const r = engine.run(RS, { ...pass, partA: 1, partB: 2 });
  assert.deepEqual(statuses(r), { A: 'PASS', B: 'PASS', C: 'PASS' });
  assert.equal(r.text, 'ELIGIBLE: ENTER COSTS TO CHOOSE');
  assert.equal(r.tone, 'warn');
  assert.match(r.summary, /Candidates A, B, C pass every technical check/);
  assert.ok(Number.isNaN(r.primary.value));
  // With every passing candidate costed, the cheapest is recommended
  assert.equal(engine.run(RS, { ...pass, partA: 1, partB: 2, partC: 3 }).text, 'RECOMMENDED: RETAINING RING (CIRCLIP)');
  assert.equal(engine.run(RS, { ...pass, partA: 3, partB: 2, partC: 1 }).text, 'RECOMMENDED: SHAFT COLLAR (SET SCREW OR CLAMP)');
  // A single passing candidate is recommended on technical grounds even without costs, and says so
  const single = engine.run(RS, { ...pass, ratingB: 1000, ratingC: 1000 });
  assert.equal(single.text, 'RECOMMENDED: RETAINING RING (CIRCLIP)');
  assert.match(single.summary, /No costs were entered, so cost was not compared\./);
});

test('retention selector: load, joint, disassembly, speed and temperature rules', () => {
  const df = { designFactor: 2, ratingA: 9000, ratingB: 9000, ratingC: 9000 };
  // Impact: E-clips are rejected, collars need verification
  const impact = engine.run(RS, { ...df, loadType: 'impact', methodA: 'eclip', methodB: 'collar', methodC: 'ring' });
  assert.deepEqual(statuses(impact), { A: 'REJECT', B: 'VERIFY', C: 'PASS' });
  // Cyclic loads always need fatigue evidence
  const cyclic = engine.run(RS, { ...df, loadType: 'cyclic', methodC: 'collar' });
  assert.deepEqual(statuses(cyclic), { A: 'VERIFY', B: 'VERIFY', C: 'VERIFY' });
  assert.equal(cyclic.text, 'VERIFICATION REQUIRED');
  // Shaft-only methods are rejected in a bore
  const boreInputs = { ...df, joint: 'bore', methodA: 'eclip', methodB: 'collar', methodC: 'nut' };
  const bore = engine.run(RS, boreInputs);
  assert.deepEqual(statuses(bore), { A: 'REJECT', B: 'REJECT', C: 'REJECT' });
  assert.equal(bore.text, 'NO ELIGIBLE METHOD');
  assert.equal(bore.tone, 'bad');
  assert.equal(engine.sensitivity(RS, boreInputs).rows.length, 0, 'no sensitivity without a candidate');
  // Frequent disassembly rejects pins, press fits and staking
  const frequent = engine.run(RS, { ...df, service: 'frequent', methodA: 'pin', methodB: 'press', methodC: 'stake' });
  assert.deepEqual(statuses(frequent), { A: 'REJECT', B: 'REJECT', C: 'REJECT' });
  // Rings at speed need the catalogue speed limit
  const speed = engine.run(RS, { ...df, rpm: 1500, methodB: 'collar', methodC: 'nut' });
  assert.equal(statuses(speed).A, 'VERIFY');
  assert.equal(statuses(engine.run(RS, { ...df, rpm: 1500, maxRpmA: 2000, methodB: 'collar', methodC: 'nut' })).A, 'PASS');
  // Adhesive needs a datasheet temperature; above it, it is rejected
  const glue = { ...df, methodA: 'adhesive', methodB: 'collar', methodC: 'nut', temp: 120 };
  assert.equal(statuses(engine.run(RS, glue)).A, 'VERIFY');
  assert.equal(statuses(engine.run(RS, { ...glue, maxTempA: 100 })).A, 'REJECT');
  assert.equal(statuses(engine.run(RS, { ...glue, maxTempA: 150 })).A, 'PASS');
  // A press fit needs a temperature check unless a limit is entered
  const pressInputs = { ...df, service: 'never', methodA: 'press', methodB: 'stake', methodC: 'nut' };
  assert.equal(statuses(engine.run(RS, pressInputs)).A, 'VERIFY');
  assert.equal(statuses(engine.run(RS, { ...pressInputs, maxTempA: 150 })).A, 'PASS');
});

// ---------------------------------------------------------------- Sensitivity

test('sensitivity analysis stays within field limits, ranks by influence and detects decision changes', () => {
  const { r, rows } = engine.sensitivity('roi');
  assert.ok(rows.length >= 4);
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].swing >= rows[i].swing, 'sorted by swing');
  const t = engine.tool('roi');
  for (const row of rows) {
    const f = t.fields.find((x: any) => x.key === row.key);
    if (f.min !== undefined) assert.ok(row.lowInput >= f.min);
    if (f.max !== undefined) assert.ok(row.highInput <= f.max);
    assert.ok(row.low !== r.primary.value || row.high !== r.primary.value, `${row.key} moves the result`);
  }
  // Near the make-or-buy crossover (5,714 units) a 10 % volume change flips the decision
  const flip = engine.sensitivity('make-buy', { qty: 6000 }).rows.find((x) => x.key === 'qty');
  assert.ok(flip && flip.flips, 'volume flips the decision near the crossover');
  assert.deepEqual([flip.lowText, flip.highText], ['BUY', 'MAKE']);
  // Fields marked sens: false (e.g. the selector diameter) are never varied
  const sel = engine.sensitivity(RS, { designFactor: 2, ratingA: 6000, ratingB: 4000, partA: 1, partB: 1, methodC: 'collar', ratingC: 6000, partC: 2 }).rows;
  assert.ok(sel.length > 0 && !sel.some((x) => x.key === 'dia'));
  // Repeated labels are named by their form heading, so candidates can be told apart
  assert.equal(sel.find((x) => x.key === 'partB')?.label, 'Candidate B · Part or material cost');
  assert.equal(engine.sensitivity('roi').rows.find((x) => x.key === 'investment')?.label, engine.tool('roi').fields.find((f: any) => f.key === 'investment').label);
  // The engine leaves no override behind
  assert.equal(engine.ctx.window.WORKOS_OVERRIDE, null);
});

// ---------------------------------------------------------------- Workspace, reports and sharing

/** A small document stand-in: elements by selector, and form inputs parsed from the HTML the UI writes. */
function loadUi(search: string) {
  const inputs = new Map<string, { value: string }>();
  const elements = new Map<string, any>();
  const element = (sel: string) => {
    if (!elements.has(sel)) {
      let inner = '';
      const e: any = {
        hidden: false, textContent: '', dataset: {}, parentElement: null,
        classList: { toggle() {}, add() {}, remove() {} },
        insertAdjacentHTML(_where: string, html: string) { inner = html + inner; },
        addEventListener() {}, setAttribute() {}, scrollIntoView() {}, append() {}, click() {}, remove() {},
        querySelector: () => null, querySelectorAll: () => [],
      };
      Object.defineProperty(e, 'innerHTML', {
        get: () => inner,
        set: (v: string) => {
          inner = v;
          if (sel !== '#tool-form') return;
          inputs.clear();
          for (const m of v.matchAll(/<input [^>]*name="([^"]+)"[^>]*value="([^"]*)"/g)) inputs.set(m[1], { value: m[2] });
          for (const m of v.matchAll(/<select [^>]*name="([^"]+)">(.*?)<\/select>/g)) inputs.set(m[1], { value: /<option value="([^"]*)" selected>/.exec(m[2])?.[1] ?? '' });
        },
      });
      elements.set(sel, e);
    }
    return elements.get(sel);
  };
  const location = new URL(`https://kevos.com/tools/${search}`);
  const document = {
    title: '',
    body: { append() {}, classList: { add() {}, remove() {} } },
    querySelector: (sel: string) => {
      const k = /^\[name="([^"]+)"\]$/.exec(sel)?.[1];
      if (k) return inputs.get(k) ?? null;
      return sel.startsWith('[data-range') ? null : element(sel);
    },
    querySelectorAll: () => [],
    createElement: () => element(`created-${Math.random()}`),
  };
  const ctx: any = createContext({
    window: { addEventListener() {} }, document, location, console, URL, URLSearchParams, setTimeout, clearTimeout,
    history: { pushState: (_s: unknown, _t: string, u: URL) => (location.href = String(u)) },
    navigator: {},
  });
  for (const kind of ['data', 'guides']) for (const f of FILES) runInContext(read(`${kind}-${f}.js`), ctx);
  runInContext(read('core.js'), ctx);
  for (const f of FILES) runInContext(read(`calc-${f}.js`), ctx);
  runInContext(read('ui.js'), ctx);
  return { ctx, ui: ctx.window.WORKOS_UI, inputs, element, document };
}

test('shared links reopen a tool with valid inputs and ignore invalid ones', () => {
  const { ui, inputs, document } = loadUi('?tool=roi&discountRate=10&years=abc&bogus=1');
  const { t, r } = ui.state();
  assert.equal(t.id, 'roi');
  assert.equal(document.title, 'Return on Investment and NPV | KEVOS® WORKOS');
  assert.equal(inputs.get('discountRate')?.value, '10');
  assert.equal(inputs.get('years')?.value, '3', 'non-numeric value ignored');
  near(r.primary.value, 15000 * ((1 - Math.pow(1.1, -3)) / 0.1) - 25000, 0.01, 'NPV at the shared 10 % rate');
  const url = new URL(ui.shareUrl(t));
  assert.equal(url.pathname, '/tools/');
  assert.equal(url.searchParams.get('tool'), 'roi');
  assert.equal(url.searchParams.get('discountRate'), '10');
  assert.ok(!url.searchParams.has('investment') && !url.searchParams.has('bogus'), 'only changed inputs are shared');
  const summary: string = ui.summaryText(t, r);
  assert.match(summary, /^Return on Investment and NPV \(KEVOS® WORKOS\)\nDecision: POSITIVE NPV/);
  assert.ok(summary.includes(url.href));
});

test('a shared select value must be one of the options', () => {
  const ok = loadUi('?tool=safety-stock&service=99&sdDaily=8');
  assert.equal(ok.inputs.get('service')?.value, '99');
  const bad = loadUi('?tool=safety-stock&service=100');
  assert.equal(bad.inputs.get('service')?.value, '95');
});

test('the decision report contains the decision, inputs with sources, method, checks, sensitivity and limitations', () => {
  const { ui } = loadUi('?tool=break-even');
  const { t, r, sens } = ui.state();
  const html: string = ui.reportBody(t, r, sens);
  for (const h of ['Decision', 'Purpose', 'Inputs and assumptions', 'Method and calculations', 'Results', 'Feasibility and verification checks', 'Sensitivity (each input ±10%)', 'Next actions', 'Limitations']) {
    assert.ok(html.includes(`<h2>${h}</h2>`), `report has ${h}`);
  }
  assert.ok(html.includes('<h1>Break-even and Margin of Safety</h1>'));
  assert.ok(html.includes('ABOVE BREAK-EVEN'));
  for (const f of t.fields) assert.ok(html.includes(`<th>${f.label}</th>`), `report lists input ${f.key}`);
  assert.ok(html.includes(engine.guides['break-even'].inputs.fixed), 'report gives the input source');
  assert.match(html, /KEVOS® \| kevos\.com\/tools\//);
  assert.doesNotMatch(html, /NaN|undefined|\[object/);
});

test('the retention selector report carries the comparison, risks, assembly guidance and drawing requirements', () => {
  const { ui } = loadUi('?tool=retention-selector&designFactor=2&ratingA=6000&ratingB=4000&partA=0.5&partB=0.2&timeA=12&timeB=20');
  const { t, r, sens } = ui.state();
  assert.match(r.text, /^RECOMMENDED: /);
  const html: string = ui.reportBody(t, r, sens);
  for (const h of ['Candidate comparison (technical status overrides cost)', 'Risks', 'Verification required']) assert.ok(html.includes(`<h2>${h}</h2>`), `report has ${h}`);
  assert.match(html, /<h2>Assembly guidance: A · Retaining ring \(circlip\)<\/h2>/);
  assert.match(html, /<h2>Drawing requirements: B · Spring pin through cross-hole<\/h2>/);
  assert.ok(html.includes('DIN 471'));
  assert.ok(html.includes(engine.guides[RS].verify[0]), 'tool-level verification note included');
  const analysis: string = ui.analysisHtml(t, r, sens);
  assert.ok(analysis.includes('FAIL and VERIFY items override any score or cost preference'));
  const guide: string = ui.guideHtml(t);
  assert.ok(guide.includes('Inputs, units and where to find them'));
  assert.ok(guide.includes('Candidate B: same inputs as Candidate A') && guide.includes('Candidate C: same inputs as Candidate A'), 'identical candidate inputs are listed once');
  assert.equal((guide.match(/Rated axial capacity/g) || []).length, 1);
  assert.ok(html.includes('<th colspan="3" class="wr-group">Candidate C</th>'), 'report inputs are grouped by candidate');
  assert.equal((html.match(/<th>Rated axial capacity \(0 = not supplied\)<\/th>/g) || []).length, 3, 'report lists every candidate value');
  assert.ok(guide.includes('<h3>References</h3>'));
});

test('a report without an eligible candidate does not show a cost of $0', () => {
  const { ui } = loadUi('?tool=retention-selector&joint=bore&methodA=eclip&methodB=collar&methodC=nut');
  const { t, r, sens } = ui.state();
  assert.equal(r.text, 'NO ELIGIBLE METHOD');
  const html: string = ui.reportBody(t, r, sens);
  assert.ok(!html.includes('(primary measure)'));
  assert.ok(!html.includes('<h2>Sensitivity'));
});

test('user text in the report is escaped', () => {
  const { ui } = loadUi('?tool=margin');
  const { t, r, sens } = ui.state();
  const html: string = ui.reportBody({ ...t, name: '<script>x</script>' }, { ...r, summary: 'a & "b"' }, sens);
  assert.ok(html.includes('&lt;script&gt;x&lt;/script&gt;') && !html.includes('<script>x'));
  assert.ok(html.includes('a &amp; &quot;b&quot;'));
});
