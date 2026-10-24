import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

// KEVOS® WORKOS: tool register, guides, calculations, decision rules, sensitivity analysis and decision reports.
// The browser scripts in public/tools/ are loaded into a VM with a minimal document so they run unchanged.

const DIR = join(process.cwd(), 'public', 'tools');
const FILES = ['decide', 'money', 'projects', 'operations', 'manufacturing', 'engineering', 'quoting', 'inventory', 'improvement', 'planning', 'business', 'makeos', 'workshop', 'handbook3', 'handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8'];
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
  // The file list lives in the shared loader used by the tools page and the tool pages.
  const loader = readFileSync(join(process.cwd(), 'src', 'utils', 'workos-tools.ts'), 'utf8');
  assert.match(page, /TOOL_FILES as FILES/);
  const listed = /export const TOOL_FILES = \[([^\]]+)\]/.exec(loader)?.[1].match(/'([a-z0-9]+)'/g)?.map((s) => s.slice(1, -1));
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
  assert.match(page, /href=\{cardHref\(t\.id\)\}/, 'each card links to its tool');
  // A tool's own page where its guide stands alone, otherwise the calculator itself.
  assert.match(page, /hasStandaloneGuide\(guides\[id\]\) \? toolPageHref\(id\) : toolAppHref\(id\)/);
});

test('register: 237 tools with unique ids and every previously published id kept', () => {
  const ids = engine.tools.map((t) => t.id);
  assert.equal(ids.length, 237);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const id of LEGACY_IDS) assert.ok(ids.includes(id), `${id} still exists`);
  assert.ok(ids.includes('retention-selector'));
  const categories = new Set(engine.tools.map((t) => t.category));
  assert.deepEqual([...categories].sort(), ['Business', 'Decide', 'Engineering', 'Fabrication', 'Fasteners', 'Gears', 'Geometry', 'Hydraulics', 'Improvement', 'Inventory', 'Maintenance', 'Manufacturing', 'Materials', 'Mechanics', 'Money', 'Operations', 'Planning', 'Pneumatics', 'Power Transmission', 'Projects', 'Quality', 'Quoting', 'Springs', 'Strength', 'Threads', 'Units']);
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

// ---------------------------------------------------------------- MAKEOS numerical reference cases
// Independently evaluated SI examples. Raw values are checked before presentation rounding.
const MAKEOS_CASES: Array<[string, Record<string, number>]> = [
  ['cutting-speed', { rpm: 1909.859317102744, actual: 62.831853071796 }],
  ['milling-feed-time', { feed: 200, removal: 4, minutes: 0.5 }],
  ['turning-time', { feed: 200, perPass: 0.5, minutes: 1.5, speed: 157.07963267949 }],
  ['drilling-time', { point: 3.004303095138, travel: 25.004303095138, feed: 100, minutes: 1.500258185708 }],
  ['tapping-feed', { lead: 1.5, feed: 1500, seconds: 0.6 }],
  ['bolt-circle', { step: 90, chord: 70.710678118655 }],
  ['taper-geometry', { taper: 0.1, halfAngle: 2.862405226112, includedAngle: 5.724810452224 }],
  ['sine-bar', { height: 100, arcseconds: 1.190870414111 }],
  ['fit-clearance', { minimum: 0.007, maximum: 0.041 }],
  ['thermal-growth', { changeT: 40, growth: 0.48, finalLength: 1000.48 }],
  ['beam-deflection', { moment: 250000, deflection: 0.104166666667, stress: 12.5 }],
  ['shaft-torsion', { polar: 251327.41228718345, stress: 15.91549430919, degrees: 0.284965828994 }],
  ['torque-power', { omega: 157.07963267949, torque: 31.830988618379 }],
  ['gear-pair', { driverDiameter: 40, drivenDiameter: 120, centre: 80, ratio: 3, outputRpm: 400 }],
  ['belt-drive', { length: 1476.243077261245, wrap: 168.521659045466, outputRpm: 750, speed: 7.853981633974 }],
  ['hydraulic-cylinder', { piston: 1963.495408493621, annulus: 1472.621556370216, extension: 18898.6433067511, retraction: 13744.4678594553, extendTime: 1.178097245096, retractTime: 0.883572933822 }],
  ['hydraulic-power', { fluid: 5, shaft: 5.882352941176, loss: 0.882352941176 }],
  ['pipe-flow', { velocity: 0.679061090525, reynolds: 16976.5272631355 }],
  ['pneumatic-consumption', { swept: 0.361283155163, absolute: 7, referenceCycle: 2.52898208614, demand: 25.289820861398 }],
  ['stock-mass', { section: 1000, volume: 0.001, mass: 7.85 }],
  ['bend-allowance', { allowance: 5.969026041821, setback: 5, deduction: 4.030973958179, flat: 65.969026041821 }],
  ['punching-force', { nominal: 60000, adjusted: 72000, tonnes: 7.341956733441 }],
  ['process-capability', { cp: 1.666666666667, cpu: 1.333333333333, cpl: 2, cpk: 1.333333333333 }],
  ['maintenance-availability', { availability: 90, mtbf: 180, mttr: 20 }],
];
for (const [id, expected] of MAKEOS_CASES) {
  test(`MAKEOS reference example: ${id}`, () => {
    const r = engine.run(id);
    for (const [key, value] of Object.entries(expected)) near(r.values[key], value, Math.max(1e-8, Math.abs(value) * 1e-9), `${id}/${key}`);
  });
}

// Handbook tools (calc-handbook3.js): defaults evaluated independently by hand from the formulas in each guide.
const HANDBOOK3_CASES: Array<[string, Record<string, number>]> = [
  ['bearing-l10-life', { exponent: 3, revolutions: 27, hours: 450 }],
  ['bearing-static-ratio', { s0: 2.916666666667 }],
  ['chain-linear-speed', { speed: 2.54, variation: 1.236243519926 }],
  ['pulley-speed-ratio', { ratio: 2.5, drivenRpm: 600, beltSpeed: 7.853981633974 }],
  ['leadscrew-speed', { speed: 25 }],
  ['leadscrew-torque', { ideal: 1.591549430919, torque: 5.305164769730 }],
  ['pipe-flow-velocity', { flowArea: 490.873852123405, velocity: 3.395305452627 }],
  ['darcy-pipe-drop', { pa: 40000, kpa: 40, headLoss: 4.078864851912 }],
  ['pump-shaft-power', { hydraulic: 0.588399, shaft: 0.840570 }],
  ['shaft-angular-offset', { radians: 0.001499998875, degrees: 0.085943604812, per100: 0.15 }],
  ['differential-expansion', { boreGrowth: 0.069, shaftGrowth: 0.036, change: 0.033 }],
  ['cylinder-swept-volume', { extend: 0.392699081699, retract: 0.329867228627, total: 0.722566310326 }],
];
for (const [id, expected] of HANDBOOK3_CASES) {
  test(`handbook reference example: ${id}`, () => {
    const r = engine.run(id);
    assert.equal(r.text, 'CALCULATED');
    for (const [key, value] of Object.entries(expected)) near(r.values[key], value, Math.max(1e-9, Math.abs(value) * 1e-9), `${id}/${key}`);
  });
}

test('handbook tools state units, physical bounds and specific guides', () => {
  for (const [id] of HANDBOOK3_CASES) {
    const t = engine.tool(id), g = engine.guides[id];
    for (const f of t.fields.filter((f: any) => f.type === 'number')) {
      assert.ok(f.unit && f.unit !== 'SI', `${id}/${f.key} has an explicit unit`);
      assert.ok(f.max < 1e8, `${id}/${f.key} has a physical upper bound`);
      assert.ok(g.inputs[f.key] && !/^Enter \w+ from verified drawing/.test(g.inputs[f.key]), `${id}/${f.key} has a specific input note`);
    }
    assert.ok(g.method.some((s: string) => s.startsWith('Example:')), `${id} guide has a worked example`);
    assert.ok(!g.method.includes('Compute idealised relation from provided inputs.'), `${id} guide method is specific`);
    assert.ok(g.refs.length >= 1 && !g.refs.some((r: string) => r.startsWith('Manufacturer engineering application manuals')), `${id} has a specific reference`);
  }
  for (const id of ['leadscrew-torque', 'pump-shaft-power']) {
    assert.equal(engine.run(id, { efficiency: 1.5 }).text, 'CHECK INPUTS', `${id} rejects efficiency above 1`);
    assert.equal(engine.run(id, { efficiency: 0 }).text, 'CHECK INPUTS', `${id} rejects zero efficiency`);
  }
  assert.equal(engine.run('darcy-pipe-drop', { friction: 2 }).text, 'CHECK INPUTS');
  assert.equal(engine.run('chain-linear-speed', { teeth: 20.5 }).text, 'CHECK INPUTS');
});

test('handbook tools model assumptions, warnings and limiting cases', () => {
  const roller = engine.run('bearing-l10-life', { type: 'roller' }).values;
  near(roller.revolutions, 38.940738398300, 1e-9, 'roller exponent 10/3');
  near(roller.hours, 649.012306638334, 1e-8, 'roller hours');
  assert.equal(engine.run('bearing-l10-life', { type: 'unknown' }).text, 'CHECK INPUTS');
  const warned = (r: any, label: string) => r.checks.some((c: any) => c.label === label && c.status === 'warn');
  assert.ok(warned(engine.run('bearing-l10-life', { P: 40 }), 'Load level'), 'load above C is flagged');
  assert.ok(!warned(engine.run('bearing-l10-life'), 'Load level'));
  assert.ok(warned(engine.run('bearing-static-ratio', { P0: 40 }), 'Static rating'), 's0 below 1 is flagged');
  assert.ok(warned(engine.run('darcy-pipe-drop', { friction: 0.0062 }), 'Friction factor'), 'Fanning-sized factor is flagged');
  assert.ok(!warned(engine.run('darcy-pipe-drop'), 'Friction factor'));
  near(engine.run('chain-linear-speed', { teeth: 40 }).values.variation, 0.308583778835, 1e-9, 'more teeth reduce chordal variation');
  near(engine.run('differential-expansion', { deltaT: -60 }).values.change, -0.033, 1e-12, 'cooling tightens the fit');
  assert.equal(engine.run('pipe-flow-velocity', { flow: 0 }).values.velocity, 0);
  assert.equal(engine.run('darcy-pipe-drop', { velocity: 0 }).values.kpa, 0);
  near(engine.run('cylinder-swept-volume', { rod: 0 }).values.retract, 0.392699081699, 1e-9, 'no rod: equal strokes');
  assert.equal(engine.run('cylinder-swept-volume', { rod: 50 }).text, 'CHECK INPUTS');
});

test('MAKEOS rejects empty, non-finite, out-of-range and fractional count inputs without a result', () => {
  for (const t of engine.tools.filter((t) => t.collection === 'MAKEOS')) {
    for (const f of t.fields.filter((f: any) => f.type !== 'heading')) {
      const bad = f.type === 'select' ? ['', 'unknown'] : ['', 'abc', Infinity, -Infinity, NaN, f.min - 1, f.max + 1, ...(f.integer ? [f.default + 0.5] : [])];
      for (const value of bad) {
        const r = engine.run(t.id, { [f.key]: value });
        assert.equal(r.text, 'CHECK INPUTS', `${t.id}/${f.key}/${value} rejected`);
        assert.equal(r.primary, undefined, 'invalid values do not reach sensitivity or a numerical result');
        assert.ok(r.checks.some((c: any) => c.status === 'fail'));
        assert.doesNotMatch(JSON.stringify(r), /NaN|Infinity|undefined/);
      }
    }
  }
});

test('MAKEOS rejects impossible geometry and contradictory specification limits', () => {
  for (const [id, values] of [
    ['taper-geometry', { large: 10, small: 20 }], ['fit-clearance', { holeMin: 21 }],
    ['fit-clearance', { shaftMin: 21 }], ['shaft-torsion', { inner: 40 }],
    ['belt-drive', { centre: 150 }], ['hydraulic-cylinder', { rod: 50 }],
    ['pneumatic-consumption', { rod: 50 }], ['stock-mass', { shape: 'tube', thickness: 50 }],
    ['bend-allowance', { a: 4 }], ['process-capability', { upper: 9.9 }],
    ['thermal-growth', { alpha: -1000, final: 2000 }],
    ['maintenance-availability', { uptime: 0, downtime: 0 }],
  ] as Array<[string, Inputs]>) assert.equal(engine.run(id, values).text, 'CHECK INPUTS', id);
});

test('MAKEOS geometric sign conventions and alternative modes agree with known cases', () => {
  const p = engine.run('bolt-circle', { x: 10, y: 20, direction: 'cw' }).values.coordinates;
  near(p[0].x, 60, 1e-9, 'first X'); near(p[1].y, -30, 1e-9, 'clockwise second Y');
  assert.equal(engine.run('taper-geometry', { large: 20, small: 20 }).values.halfAngle, 0);
  assert.equal(engine.run('sine-bar', { angle: 0 }).values.height, 0);
  assert.equal(engine.run('fit-clearance', { shaftMin: 20.1, shaftMax: 20.2 }).text, 'INTERFERENCE');
  assert.equal(engine.run('fit-clearance', { shaftMin: 20, shaftMax: 20.01 }).text, 'CONTACT / TRANSITION');
  assert.equal(engine.run('fit-clearance', { holeMax: 20, shaftMin: 20, shaftMax: 20 }).text, 'LINE-TO-LINE');
  near(engine.run('thermal-growth', { final: -20 }).values.growth, -0.48, 1e-10, 'cooling contraction');
  near(engine.run('stock-mass', { shape: 'round', width: 20 }).values.mass, 2.466150233068, 1e-10, 'round bar');
  near(engine.run('stock-mass', { shape: 'tube', width: 20, thickness: 2 }).values.mass, 0.887814083904, 1e-10, 'tube');
  near(engine.run('belt-drive', { driver: 100, driven: 100 }).values.length, 1314.159265358979, 1e-9, 'equal pulleys');
});

test('MAKEOS beam cases and mechanical scaling preserve dimensions and limiting behaviour', () => {
  near(engine.run('beam-deflection', { case: 'cantilever-point' }).values.deflection, 1.666666666667, 1e-9, 'cantilever');
  near(engine.run('beam-deflection', { case: 'simple-udl' }).values.deflection, 0.065104166667, 1e-9, 'uniform total load');
  near(engine.run('beam-deflection', { length: 2000 }).values.deflection, 0.833333333333, 1e-9, 'cubic span effect');
  near(engine.run('beam-deflection', { inertia: 2000000 }).values.deflection, 0.052083333333, 1e-9, 'inverse stiffness');
  assert.equal(engine.run('beam-deflection', { load: 0 }).values.stress, 0);
  assert.equal(engine.run('shaft-torsion', { torque: 0 }).values.twist, 0);
  const hollow = engine.run('shaft-torsion', { inner: 40 * Math.pow(0.5, 0.25) });
  near(hollow.values.stress, 31.830988618379, 1e-9, 'half polar area moment doubles stress');
  near(engine.run('torque-power', { rpm: 3000 }).values.torque, 15.91549430919, 1e-9, 'twice speed at constant power');
});

test('MAKEOS machining, fluid power and pneumatic reference conversions remain explicit', () => {
  near(engine.run('tapping-feed', { starts: 2 }).values.feed, 3000, 1e-9, 'lead, not pitch');
  const c = engine.run('hydraulic-cylinder', { back: 0 }).values;
  near(c.extension, 19634.9540849362, 1e-8, 'bar to N/mm²');
  assert.ok(c.retractTime < c.extendTime, 'smaller annulus fills faster at the same inlet flow');
  assert.ok(engine.run('hydraulic-cylinder', { back: 200 }).values.extension < 0, 'opposing pressure is not silently clamped');
  assert.equal(engine.run('hydraulic-power', { efficiency: 100 }).values.loss, 0);
  assert.equal(engine.run('hydraulic-power', { flow: 0 }).values.shaft, 0);
  near(engine.run('pipe-flow', { viscosity: 10 }).values.reynolds, 1697.65272631355, 1e-7, 'centistokes conversion');
  assert.equal(metric(engine.run('pipe-flow', { flow: 0 }), 'Regime indication'), 'No mean flow');
  const air = engine.run('pneumatic-consumption').values;
  near(engine.run('pneumatic-consumption', { reference: 2 }).values.demand, air.demand / 2, 1e-9, 'absolute reference pressure');
  near(engine.run('pneumatic-consumption', { temperature: 313.15 }).values.demand, air.demand / 2, 1e-9, 'Kelvin ratio, not Celsius');
  near(engine.run('pneumatic-consumption', { cycles: 0 }).values.demand, 0, 1e-9, 'idle demand excludes leakage');
});

test('MAKEOS quality and maintenance do not imply unsupported capability or infinite reliability', () => {
  assert.equal(engine.run('process-capability').text, 'ASSUMPTIONS UNVERIFIED');
  assert.equal(engine.run('process-capability', { stable: 'yes' }).text, 'INDICES CALCULATED');
  assert.ok(engine.run('process-capability', { mean: 10.2 }).values.cpk < 0);
  const zero = engine.run('maintenance-availability', { failures: 0, downtime: 0 });
  assert.equal(zero.values.mtbf, null); assert.equal(zero.values.mttr, null);
  assert.equal(zero.values.availability, 100);
  assert.ok(engine.run('maintenance-availability', { failures: 0 }).checks.some((c: any) => c.status === 'warn'));
});

test('MAKEOS shares inputs, preserves fine precision, links sources and fails visibly on invalid shared values', () => {
  const { ui, document } = loadUi('?tool=fit-clearance&shaftMax=19.999');
  const { t, r, sens } = ui.state();
  assert.equal(document.title, 'Hole and Shaft Clearance Limits | KEVOS® MAKEOS');
  assert.match(ui.summaryText(t, r), /KEVOS® MAKEOS/);
  assert.equal(new URL(ui.shareUrl(t)).searchParams.get('shaftMax'), '19.999');
  const html = ui.reportBody(t, r, sens);
  assert.match(html, /KEVOS® MAKEOS/); assert.match(html, /<h2>References<\/h2>/);
  assert.match(html, /href="https:\/\/eprintspublications\.npl\.co\.uk/);
  assert.match(html, /0\.001/);
  near(Number(runInContext('fmtPrimary("engineering", 0.00000123456789)', engine.ctx)), 0.0000012345679, 1e-14, 'small result precision');
  const tinyGrowth = engine.run('thermal-growth', { length: 0.001, alpha: 1, initial: 20, final: 21 });
  assert.ok(tinyGrowth.metrics.some((x: any) => x.value === '0.000000001 mm'), 'small non-zero metrics must not round to zero');
  for (const search of ['?tool=shaft-torsion&outer=0', '?tool=shaft-torsion&outer=abc', '?tool=shaft-torsion&outer=', '?tool=stock-mass&shape=unknown', '?tool=bolt-circle&holes=4.5']) {
    const state = loadUi(search).ui.state();
    assert.equal(state.r.text, 'CHECK INPUTS'); assert.equal(state.sens.length, 0);
    assert.equal(state.r.primary, undefined);
  }
});

// Independent numeric examples for the second MAKEOS batch; raw values precede display rounding.
const WORKSHOP_CASES: Array<[string, Record<string, number>]> = [
  ['signed-tolerance-stack', { nominal: 10, minimum: 9.77, maximum: 10.27, width: .5 }],
  ['measurement-uncertainty', { combined: .005033222956847167, expanded: .010066445913694334 }],
  ['section-properties', { area: 3200, ix: 1706666.666666667, iy: 426666.666666667, zx: 42666.666666667, zy: 21333.333333333, rx: 23.094010767585, cx: 20, cy: 40 }],
  ['countersink-depth', { depth: 3, remaining: 2, breakthroughDiameter: 16 }],
  ['turning-cusp', { exact: 6.274606680623, approximate: 6.25, difference: .024606680623 }],
  ['radial-chip-thinning', { engagement: .1, factor: .6, multiplier: 1.666666666667, perTooth: .083333333333, feed: 666.666666666667 }],
  ['ball-nose-diameter', { effective: 6, surface: 94.247779607694, rpm: 5305.164769729845 }],
  ['circular-interpolation-feed', { centreDiameter: 40, centreFeed: 800, path: 125.663706143592, minutes: .157079632679 }],
  ['coolant-blend', { strongVolume: 5, weakVolume: 95, concentrate: 5 }],
  ['coolant-topup', { addition: 13.333333333333, finalVolume: 113.333333333333, margin: 36.666666666667 }],
  ['stock-cut-plan', { bars: 3, toBuy: 1, lowerBound: 3, pieces: 14, net: 2580, kerf: 28, trim: 30, offcut: 362, gross: 3000, yieldPercent: 86 }],
  ['fillet-weld-quantity', { area: 18, throat: 4.242640687119, volume: 19800, deposited: .15543, consumable: .163610526316 }],
  ['welding-heat-input', { power: 4.8, arc: .96, heat: .768 }],
  ['tube-bend-length', { perBend: 78.539816339745, arcs: 157.07963267949, length: 557.07963267949 }],
  ['thermal-fit', { hole: 50.0890276, shaft: 50.024, referenceClearance: .02, clearanceChange: .0450276, clearance: .0650276 }],
  ['axial-stress', { stress: 50, strain: .00025, extension: .25, energy: 1.25 }],
];
for (const [id, expected] of WORKSHOP_CASES) test(`MAKEOS workshop reference example: ${id}`, () => {
  const r = engine.run(id);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, Math.max(1e-10, Math.abs(value) * 1e-9), `${id}/${key}`);
});

test('workshop rejects impossible geometry, unattainable balances and unsupported precision', () => {
  const cases: Array<[string, Inputs]> = [
    ['measurement-uncertainty', { sd: 0, cal: 0, resolution: 0, bound: 0 }],
    ['section-properties', { shape: 'rect-tube', wall: 20 }], ['section-properties', { shape: 'circ-tube', wall: 20 }],
    ['countersink-depth', { mouth: 5 }], ['turning-cusp', { feed: 1.6 }], ['radial-chip-thinning', { width: 11 }],
    ['ball-nose-diameter', { depth: 6 }], ['circular-interpolation-feed', { cutter: 50 }],
    ['coolant-blend', { strong: 0 }], ['coolant-blend', { weak: 10 }], ['coolant-blend', { strong: 4 }],
    ['coolant-topup', { addition: 5 }], ['coolant-topup', { addition: 4 }],
    ['stock-cut-plan', { stock: 1000.0001 }], ['stock-cut-plan', { trim: 500 }], ['stock-cut-plan', { length1: 989 }],
    ['stock-cut-plan', { count1: 0, count2: 0, count3: 0 }], ['thermal-fit', { holeAlpha: -1000, holeTemp: 2000 }],
  ];
  for (const [id, over] of cases) {
    const r = engine.run(id, over);
    assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined);
    assert.ok(r.checks.some((c: any) => c.status === 'fail'));
  }
});
test('signed stacks contain every endpoint combination and reverse their bounds', () => {
  const over = { n1: 12, l1: .2, u1: .1, c1: -2, n2: 4, l2: .3, u2: .5, c2: 3, n3: 9, l3: .6, u3: .7, c3: 0 };
  const r = engine.run('signed-tolerance-stack', over).values, corners: number[] = [];
  for (const a of [11.8, 12.1]) for (const b of [3.7, 4.5]) for (const c of [8.4, 9.7]) corners.push(-2 * a + 3 * b + 0 * c);
  near(r.minimum, Math.min(...corners), 1e-12, 'minimum endpoint'); near(r.maximum, Math.max(...corners), 1e-12, 'maximum endpoint');
  const rev = engine.run('signed-tolerance-stack', { ...over, c1: 2, c2: -3 }).values;
  near(rev.minimum, -r.maximum, 1e-12, 'reversed lower'); near(rev.maximum, -r.minimum, 1e-12, 'reversed upper');
});
test('uncertainty distinguishes a mean without reducing calibration or resolution', () => {
  const single = engine.run('measurement-uncertainty', { mode: 'single' }).values;
  near(single.combined, .010739335795724674, 1e-10, 'single observation');
  const avg = engine.run('measurement-uncertainty', { count: 100 }).values;
  near(avg.components[0].u, .001, 1e-12, 'mean standard error'); near(avg.components[1].u, .002, 1e-12, 'calibration');
  near(avg.components[2].u, .002886751345948129, 1e-12, 'resolution');
  near(single.components.reduce((s: number, c: any) => s + c.share, 0), 100, 1e-10, 'variance shares');
  assert.equal(engine.run('measurement-uncertainty').text, 'ASSUMPTIONS UNVERIFIED');
});
test('section axes and machining boundaries retain their physical meaning', () => {
  near(engine.run('section-properties', { width: 80, height: 40 }).values.ix, 426666.666666667, 1e-6, 'rotation swaps I');
  const circle = engine.run('section-properties', { shape: 'circle', width: 20 }).values;
  near(circle.area, 314.1592653589793, 1e-9, 'circle area'); near(circle.ix, 7853.981633974483, 1e-9, 'circle I'); assert.equal(circle.ix, circle.iy);
  near(engine.run('section-properties', { shape: 'circ-tube', width: 20, wall: 5 }).values.ix, 7363.107781851077, 1e-9, 'annulus I');
  const rect = engine.run('section-properties', { shape: 'rect-tube', width: 40, height: 80, wall: 10 }).values;
  assert.equal(rect.area, 2000); near(rect.ix, 1346666.666666667, 1e-6, 'hollow rectangle I');
  assert.equal(engine.run('countersink-depth', { thickness: 3 }).text, 'BREAKTHROUGH');
  assert.ok(engine.run('countersink-depth', { thickness: 2 }).values.remaining < 0);
  assert.equal(engine.run('countersink-depth', { mouth: 6 }).values.depth, 0);
  assert.equal(engine.run('turning-cusp', { feed: 0 }).values.exact, 0);
  assert.ok(engine.run('turning-cusp', { feed: .000001 }).values.exact > 0);
  assert.equal(engine.run('radial-chip-thinning', { width: 5 }).values.factor, 1);
  assert.equal(engine.run('radial-chip-thinning', { width: 10 }).values.factor, 1);
  assert.equal(engine.run('ball-nose-diameter', { depth: 5 }).values.effective, 10);
  const out = engine.run('circular-interpolation-feed', { side: 'external' }).values;
  assert.equal(out.centreFeed, 1200); near(out.minutes, .15707963267948966, 1e-12, 'constant wall feed time');
});
test('coolant conserves volume and concentrate and reports capacity failure without clipping', () => {
  for (const target of [2, 3, 5, 8]) {
    const v = engine.run('coolant-blend', { volume: 120, weak: 2, strong: 8, target }).values;
    near(v.strongVolume + v.weakVolume, 120, 1e-12, 'volume'); near(v.strongVolume * 8 + v.weakVolume * 2, 120 * target, 1e-10, 'concentrate');
  }
  const d = engine.run('coolant-topup', { volume: 100, current: 10, target: 5, addition: 0, capacity: 200 });
  assert.equal(d.values.addition, 100); assert.equal(d.values.margin, 0);
  assert.ok(d.checks.some((c: any) => c.label === 'Working capacity' && c.status === 'pass'));
  const over = engine.run('coolant-topup', { capacity: 110 }); assert.equal(over.text, 'CAPACITY EXCEEDED');
  near(over.values.addition, 13.333333333333, 1e-9, 'no clipping'); assert.ok(over.checks.some((c: any) => c.status === 'fail'));
  assert.equal(engine.run('coolant-topup', { current: 5, addition: 5 }).values.addition, 0);
});
test('stock plans meet counts and material conservation and do not assert false optimality', () => {
  const scenarios: Inputs[] = [{}, { stock: 1.003, trim: .001, kerf: .001, length1: .5, count1: 3, count2: 0, count3: 0 }, { stock: 1000, trim: 0, kerf: 0, length1: 1000, count1: 1, count2: 0, count3: 0 }, { stock: 1000, trim: 0, kerf: 0, length1: 400, count1: 2, length2: 300, count2: 4, count3: 0 }, { count1: 100, count2: 100, count3: 100 }];
  for (const over of scenarios) {
    const input: any = Object.fromEntries(engine.tool('stock-cut-plan').fields.map((f: any) => [f.key, f.default])); Object.assign(input, over);
    const r = engine.run('stock-cut-plan', over), v = r.values, counts = [0, 0, 0]; assert.ok(r.primary, JSON.stringify(over));
    for (const b of v.barRows) {
      assert.ok(b.offcut >= 0); near(b.net + b.kerf + b.trim + b.offcut, input.stock, 1e-9, 'bar conservation');
      for (const cut of b.cuts) counts[cut.part - 1] += cut.count;
    }
    assert.deepEqual(counts, [input.count1, input.count2, input.count3]); near(v.net + v.kerf + v.trim + v.offcut, v.gross, 1e-8, 'total conservation');
    assert.ok(v.bars >= v.lowerBound); assert.equal(v.minimumProven, v.bars === v.lowerBound);
  }
  // A counterexample: FFD uses 3 bars; 400+300+300 twice would use 2.
  const r = engine.run('stock-cut-plan', { stock: 1000, trim: 0, kerf: 0, length1: 400, count1: 2, length2: 300, count2: 4, count3: 0 });
  assert.equal(r.values.bars, 3); assert.equal(r.values.lowerBound, 2); assert.equal(r.text, 'FEASIBLE PLAN');
});
test('thermal, weld, tube and axial models retain signs, units and scaling', () => {
  near(engine.run('thermal-fit', { holeTemp: 20, shaftTemp: 100 }).values.clearance, -.028, 1e-10, 'thermal interference');
  assert.equal(engine.run('thermal-fit', { holeTemp: 20, shaftTemp: 20 }).values.clearanceChange, 0);
  const c = engine.run('axial-stress', { force: -10000 }).values; assert.equal(c.stress, -50); assert.equal(c.extension, -.25); assert.equal(c.energy, 1.25);
  assert.equal(engine.run('axial-stress', { force: 0 }).values.energy, 0);
  near(engine.run('fillet-weld-quantity', { leg: 12 }).values.deposited, .62172, 1e-12, 'square leg effect');
  assert.equal(engine.run('fillet-weld-quantity', { length: 0 }).values.consumable, 0);
  near(engine.run('welding-heat-input', { travel: 600 }).values.heat, .384, 1e-12, 'inverse travel');
  assert.equal(engine.run('welding-heat-input', { efficiency: 100 }).values.heat, .96);
  assert.equal(engine.run('tube-bend-length', { bends: 0 }).values.length, 400);
});
test('all workshop shared URLs render finite results and export inputs, methods, references and tables', () => {
  for (const [id] of WORKSHOP_CASES) {
    const { ui, document } = loadUi(`?tool=${id}`), { t, r, sens } = ui.state();
    assert.equal(t.id, id); assert.equal(document.title, `${t.name} | KEVOS® MAKEOS`);
    assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
    const report: string = ui.reportBody(t, r, sens);
    for (const h of ['Inputs and assumptions', 'Method and calculations', 'Limitations', 'References']) assert.ok(report.includes(`<h2>${h}</h2>`), `${id}/${h}`);
    for (const f of t.fields) assert.ok(report.includes(`<th>${f.label}</th>`), `${id}/${f.key}`);
    if (r.table) assert.ok(report.includes(r.table.caption));
    assert.doesNotMatch(report, /NaN|undefined|\[object Object\]/); assert.equal(new URL(ui.shareUrl(t)).searchParams.get('tool'), id);
  }
  const invalid = loadUi('?tool=stock-cut-plan&length1=999').ui.state(); assert.equal(invalid.r.text, 'CHECK INPUTS'); assert.equal(invalid.sens.length, 0);
});

// ---------------------------------------------------------------- Machinery's Handbook topic tools (handbook4–8)

const HB_FILES = ['handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8'];
const hbIds = () => {
  const sandbox: any = createContext({ window: {} });
  for (const f of HB_FILES) runInContext(read(`data-${f}.js`), sandbox);
  return sandbox.window.GOCORE_TOOLS.map((t: any) => t.id) as string[];
};

test('handbook batches: 122 MAKEOS tools, each with bounds, a worked example and a handbook reference', () => {
  const ids = hbIds();
  assert.equal(ids.length, 122);
  for (const id of ids) {
    const t = engine.tool(id), g = engine.guides[id];
    assert.equal(t.collection, 'MAKEOS');
    for (const f of t.fields.filter((f: any) => f.type === 'number')) assert.ok(f.max < 1e16 && f.min > -1e16, `${id}/${f.key} has bounds`);
    assert.ok(g.method.some((s: string) => s.startsWith('Example')), `${id} has a worked example computed from its defaults`);
    assert.ok(g.refs.some((r: string) => r.startsWith('Machinery’s Handbook, 29th edition')), `${id} cites the handbook topic`);
    assert.ok(g.refs.every((r: string) => !r.startsWith('Machinery’s Handbook') || /Topic reference; no source tables/.test(r)), `${id} reproduces no tables`);
  }
});

// Independent reference values: handbook worked examples, ISO/ASME tabulated values and hand calculations.
const HB_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['broach-pitch', {}, { pmin: 3 * Math.sqrt(88), pallow: 0.1 * 220 * 75 * 1586 / (9810 * 8) }], // handbook example: 28.14 and 33.34 mm
  ['brinell-hardness', {}, { HB: 6000 / (Math.PI * 10 * (10 - Math.sqrt(84))) }], // 229 HBW 10/3000 for a 4.00 mm indent
  ['circular-segment', { mode: 'ch', chord: 80, height: 20 }, { radius: 50 }],
  ['triangle-solver', {}, { C: 90, area: 600, R: 25, r: 10 }],
  ['regular-polygon', {}, { corners: 24 / Math.cos(Math.PI / 6) }],
  ['tank-volume', { depth: 600 }, { percent: 50 }],
  ['metric-thread', {}, { d2: 10.863, As: 84.27 }, 0.005], // ISO 724 / ISO 898-1: M12 × 1.75
  ['unified-thread', {}, { E: 0.45, At: 0.1419 }, 0.0001], // ASME B1.1: 1/2-13 UNC
  ['three-wire', {}, { M: 10.863 - 0.866025 * 1.75 + 3 * 0.57735 * 1.75 }, 1e-4],
  ['span-measurement', {}, { k: 4, W: 3 * 10.7526 }, 0.001], // W for m = 1, z = 30, k = 4 is 10.7526
  ['chordal-tooth', {}, { tc: 90 * Math.sin(Math.PI / 60), ac: 3 + 45 * (1 - Math.cos(Math.PI / 60)) }],
  ['column-buckling', {}, { Pcr: (250 - (250 * 100 / (2 * Math.PI)) ** 2 / 200000) * 1000 }],
  ['column-buckling', { L: 4000 }, { Pcr: Math.PI ** 2 * 200000 / 200 ** 2 * 1000 }],
  ['press-fit', {}, { p: 60, T: 0.15 * 60 * Math.PI * 2500 * 60 / 2000 }],
  ['pressure-cylinder', {}, { hoop: 25 * 4100 / 900 }],
  ['principal-stress', {}, { s1: 40 + Math.sqrt(6400 + 2500), s2: 40 - Math.sqrt(6400 + 2500) }],
  ['compression-spring', {}, { k: 79300 * 16 / (8 * 4096 * 8) }],
  ['bearing-life-adjusted', {}, { P: 4.64, L10h: (52 / 4.64) ** 3 * 1e6 / 90000 }],
  ['balance-grade', {}, { U: 6.3 * 1000 * 25 / (2 * Math.PI * 3000 / 60) }],
  ['critical-speed', { disc: 0 }, { ns: 2114.3 }, 0.1],
  ['worm-gear', {}, { gamma: Math.atan(0.1) * 180 / Math.PI, ratio: 40 }],
  ['irr-uneven', { P: 100, cf1: 110, cf2: 0, cf3: 0, cf4: 0, cf5: 0 }, { irr: 10 }, 1e-6],
  ['interest-factors', {}, { PA: 6.710081 }, 1e-6],
  ['euac-compare', {}, { eA: 50000 * 0.08 * 1.08 ** 5 / (1.08 ** 5 - 1) + 12000 - 5000 * 0.08 / (1.08 ** 5 - 1) }],
  ['normal-out-of-spec', { mean: 0, sd: 1, lsl: -3, usl: 3 }, { ppm: 2699.796 }, 0.5],
  ['two-sample-t', { m1: 2.228139 * Math.sqrt(1 / 3), m2: 0, s1: 1, s2: 1, n1: 6, n2: 6 }, { df: 10, p: 0.05 }, 1e-5],
  ['pump-affinity', { n2: 1450 }, { P2: 7 / 8 }],
  ['gas-law', { p1: 0, p2: 1.013, T1: 20, T2: 20 }, { V2: 0.5 }],
  ['hydrostatic-force', {}, { F: 1000 * 9.80665 * 3 * 4 / 2, y: 2 / 3 }],
  ['change-gears', {}, { req: 1.5 / 3.175, err4: 0 }],
  ['taylor-tool-life', {}, { n: Math.log(200 / 280) / Math.log(10 / 40) }],
];
for (const [id, over, expected, tol] of HB_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('handbook tools reproduce exact handbook and standard procedures', () => {
  // Gauge blocks: the handbook's 81-piece inch example, 3.6742 in = 0.1002 + 0.124 + 0.450 + 3.000
  const inch = engine.run('gauge-block-stack', { set: 'i81', target: 3.6742 }).values;
  assert.equal(inch.count, 4); assert.equal(inch.list, '0.1002 + 0.124 + 0.45 + 3');
  assert.equal(engine.run('gauge-block-stack').values.list, '1.0005 + 1.007 + 1.32 + 8 + 30');
  // ISO 286-1 tabulated IT values (µm) are matched by the formula to within rounding
  for (const [size, grade, table] of [[25, '7', 21], [100, '6', 22], [10, '8', 22], [400, '9', 140]] as Array<[number, string, number]>) {
    near(engine.run('it-tolerance-grade', { size, grade }).values.it, table, 0.6 + table * 0.02, `IT${grade} at ${size} mm`);
  }
  // Simple indexing: 27 divisions = 1 turn + 13 holes in the 27 circle; 51 needs the Cincinnati plate
  assert.equal(engine.run('simple-indexing').text, 'SIMPLE INDEXING POSSIBLE');
  assert.equal(engine.run('simple-indexing', { divisions: 51 }).text, 'NOT POSSIBLE BY SIMPLE INDEXING');
  assert.match(engine.run('simple-indexing', { divisions: 51, plates: 'cin' }).values.best, /40 holes in the 51-hole circle/);
  // Best rational approximation of π with denominator ≤ 120 is 355/113
  assert.equal(engine.run('decimal-fraction', { value: 3.14159265, maxDen: 120 }).values.best, '355/113');
  // Disc spring force at flat equals the flat-load formula
  const disc = engine.run('disc-spring', { s: 1.4 }).values; near(disc.F, disc.Fflat, 1e-9, 'force at flat');
  // Temperature readings convert with the offset, differences without
  assert.equal(engine.run('temperature-converter').values.F, 212);
  near(engine.run('temperature-converter', { kind: 'diff' }).values.F, 180, 1e-12, 'difference');
  near(engine.run('pressure-converter', { value: 1, from: 'bar' }).values.si, 1e5, 1e-9, 'bar to Pa');
});

test('handbook tools turn requirements into decisions and never pass unchecked evidence', () => {
  assert.equal(engine.run('column-buckling').text, 'ADEQUATE');
  assert.equal(engine.run('column-buckling', { P: 100000 }).text, 'INADEQUATE');
  assert.equal(engine.run('grinding-wheel', { rpm: 3000 }).text, 'OVERSPEED: DO NOT RUN');
  assert.equal(engine.run('sling-tension', { angle: 70 }).text, 'LEG OVERLOADED');
  assert.ok(engine.run('sling-tension', { angle: 65, wll: 5000 }).checks.some((c: any) => c.label === 'Leg angle' && c.status === 'warn'));
  assert.equal(engine.run('bolted-joint', { Pext: 60 }).text, 'JOINT SEPARATES');
  assert.equal(engine.run('npsh-available', { z: -6 }).text, 'CAVITATION RISK');
  assert.equal(engine.run('critical-speed', { rpm: 1050 }).text, 'NEAR CRITICAL');
  assert.equal(engine.run('rss-tolerance-stack', { tol4: 0.2 }).text, 'MEETS RSS ONLY');
  assert.equal(engine.run('balance-grade').checks[0].status, 'verify', 'no measurement, no pass');
  assert.equal(engine.run('balance-grade', { measured: 600 }).text, 'OUT OF TOLERANCE');
  assert.equal(engine.run('carbon-equivalent', { C: 0.1, Mn: 0.6 }).text, 'READILY WELDABLE');
  assert.equal(engine.run('two-sample-t', { m1: 50.3 }).text, 'NO SIGNIFICANT DIFFERENCE');
  assert.equal(engine.run('screw-efficiency', { starts: 4 }).values.locks, false, 'four-start screw back-drives');
});

test('handbook tools reject impossible geometry and contradictory inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['tank-volume', { depth: 1300 }], ['triangle-solver', { a: 1, b: 2, c: 10 }], ['triangle-solver', { mode: 'asa', A: 100, B: 90 }],
    ['circular-segment', { height: 120 }], ['gauge-block-stack', { target: 0.3 }], ['gauge-block-stack', { target: 41.3271 }],
    ['rss-tolerance-stack', { reqMin: 1, reqMax: 0.5 }], ['flywheel-energy', { nmin: 700 }], ['press-fit', { D: 40 }],
    ['compression-spring', { Lw: 10 }], ['disc-spring', { s: 2 }], ['bolted-joint', { Lt: 50 }], ['riveted-joint', { p: 10 }],
    ['scallop-height', { step: 12 }], ['taylor-tool-life', { V2: 200 }], ['shell-blank', { flange: 50 }],
    ['npsh-available', { pv: 200 }], ['accumulator-size', { p0: 120 }], ['air-receiver', { p2: 9 }], ['normal-out-of-spec', { usl: 9 }],
    ['depreciation-schedule', { salvage: 200000 }], ['irr-uneven', { cf1: 0, cf2: 0, cf3: 0, cf4: 0, cf5: 0 }], ['clutch-torque', { Di: 300 }],
    ['hertz-contact', { R2: -20 }], ['mass-moment-inertia', { shape: 'ring', dimB: 400 }], ['heating-energy', { T2: 10 }],
    ['ellipse', { major: 0 }], ['combined-cg', { m1: 0, m2: 0, m3: 0 }], ['frustum-volume', { height: 0 }],
  ];
  for (const [id, over] of cases) {
    const r = engine.run(id, over);
    assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined);
    assert.ok(r.checks.some((c: any) => c.status === 'fail'));
  }
});

test('all handbook tool shared URLs render finite results and export inputs, methods, references and tables', () => {
  for (const id of hbIds()) {
    const { ui, document } = loadUi(`?tool=${id}`), { t, r, sens } = ui.state();
    assert.equal(t.id, id); assert.equal(document.title, `${t.name} | KEVOS® MAKEOS`);
    assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
    const report: string = ui.reportBody(t, r, sens);
    for (const h of ['Inputs and assumptions', 'Method and calculations', 'Limitations', 'References']) assert.ok(report.includes(`<h2>${h}</h2>`), `${id}/${h}`);
    for (const f of t.fields.filter((f: any) => f.type !== 'heading')) assert.ok(report.includes(`<th>${f.label}</th>`), `${id}/${f.key}`);
    if (r.table) assert.ok(report.includes(r.table.caption));
    assert.doesNotMatch(report, /NaN|undefined|\[object Object\]/);
  }
});
