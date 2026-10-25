import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

// KEVOS® WORKOS: tool register, guides, calculations, decision rules, sensitivity analysis and decision reports.
// The browser scripts in public/tools/ are loaded into a VM with a minimal document so they run unchanged.

const DIR = join(process.cwd(), 'public', 'tools');
const FILES = ['decide', 'money', 'projects', 'operations', 'manufacturing', 'engineering', 'quoting', 'inventory', 'improvement', 'planning', 'business', 'makeos', 'workshop', 'handbook3', 'handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8', 'handbook9', 'handbook10', 'handbook11', 'handbook12', 'handbook13', 'handbook14', 'handbook15', 'handbook16', 'handbook17', 'handbook18', 'handbook19', 'handbook20', 'handbook21', 'handbook22', 'handbook23', 'handbook24', 'handbook25'];
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

test('register: 459 tools with unique ids and every previously published id kept', () => {
  const ids = engine.tools.map((t) => t.id);
  assert.equal(ids.length, 459);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const id of LEGACY_IDS) assert.ok(ids.includes(id), `${id} still exists`);
  assert.ok(ids.includes('retention-selector'));
  const categories = new Set(engine.tools.map((t) => t.category));
  assert.deepEqual([...categories].sort(), ['Business', 'Decide', 'Engineering', 'Fabrication', 'Fasteners', 'Gears', 'Geometry', 'Hydraulics', 'Improvement', 'Inventory', 'Maintenance', 'Manufacturing', 'Materials', 'Mathematics', 'Mechanics', 'Money', 'Operations', 'Planning', 'Pneumatics', 'Power Transmission', 'Projects', 'Quality', 'Quoting', 'Springs', 'Strength', 'Threads', 'Units']);
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

const HB_FILES = ['handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8', 'handbook9', 'handbook10', 'handbook11', 'handbook12', 'handbook13', 'handbook14', 'handbook15', 'handbook16', 'handbook17', 'handbook18', 'handbook19', 'handbook20', 'handbook21', 'handbook22', 'handbook23', 'handbook24', 'handbook25'];
const hbIds = () => {
  const sandbox: any = createContext({ window: {} });
  for (const f of HB_FILES) runInContext(read(`data-${f}.js`), sandbox);
  return sandbox.window.GOCORE_TOOLS.map((t: any) => t.id) as string[];
};

test('handbook batches: 344 MAKEOS tools, each with bounds, a worked example and a handbook reference', () => {
  const ids = hbIds();
  assert.equal(ids.length, 344);
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

// Second handbook pass (handbook9–13): handbook worked examples, standard values and hand calculations.
const HB2_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['feed-for-finish', {}, { f: 0.178 }, 0.0005], // handbook example: Ra 1 µm with a 1 mm nose radius → 0.178 mm/rev
  ['differential-indexing', {}, { A: 70 }], // handbook example: 67 divisions use A = 70, 12/21 turn and 48/28 gears
  ['helical-milling', { D: 48 / Math.PI, beta: 45, Lm: 10 }, { lead: 48, err: 0 }, 1e-9], // handbook: 48 in lead on a 10 in machine = 72/24 × 64/40
  ['toggle-joint', {}, { R: 500 / (2 * Math.tan(Math.PI / 18)) }],
  ['npt-thread', {}, { E0: 0.75843, L2: 0.5337 }, 0.00005], // ASME B1.20.1 ½ NPT
  ['nose-radius-compensation', {}, { dz: 0.8 * (1 - Math.tan(Math.PI / 8)), dx: 0.8 * (1 - Math.tan(Math.PI / 8)) }],
  ['bending-springback', {}, { Rf: 6 / (4 * 0.00375 ** 3 - 3 * 0.00375 + 1) }],
  ['grain-size', {}, { G: 7, lbar: 28.28 }, 0.01], // ASTM E112: G 7 = 64 grains/in² at 100×, 28.3 µm intercept
  ['grain-size', { mode: 'na', value: 992 }, { G: 7 }, 0.005],
  ['sampling-oc', {}, { Pa: 0.98 ** 50 + 50 * 0.02 * 0.98 ** 49 }],
  ['weibull-reliability', {}, { R: Math.exp(-0.04), mttf: 10000 * 0.886226925452758 }, 1e-6],
  ['xbar-r-limits', {}, { ucl: 25.01 + 0.577 * 0.03, rucl: 2.114 * 0.03, sigma: 0.03 / 2.326 }],
  ['oil-viscosity-temperature', { T: 40 }, { nu: 46 }, 1e-6],
  ['oil-viscosity-temperature', { T: 100 }, { nu: 6.8 }, 1e-6],
  ['section-shapes', {}, { Ix: (100 * 200 ** 3 - 94 * 180 ** 3) / 12, A: 3080 }, 1e-6],
  ['circle-three-points', {}, { cx: 0, cy: 0, r: 50 }, 1e-9],
  ['true-position', {}, { pos: 0.2, allowed: 0.32 }, 1e-9],
  ['taper-balls', {}, { angle: 2 * Math.asin(0.2) * 180 / Math.PI }],
  ['wire-rope-reeving', {}, { F: 5000 * 9.80665 * 0.02 / (1 - 0.98 ** 4) }],
  ['process-breakeven', {}, { q0: 275 }],
  ['learning-curve', { n: 2 }, { Tn: 8.5 }],
  ['pneumatic-cylinder-force', {}, { Fe: 0.6 * Math.PI * 2500 / 4 * 0.9 }],
  ['vacuum-cup', {}, { per: 60 * Math.PI * 1600 / 4000 }],
  ['valve-flow-coefficient', {}, { Kv: 10 * Math.SQRT2 }],
  ['motor-slip', {}, { ns: 1500, slip: 25 / 15 }],
  ['lmtd-exchanger', {}, { lmtd: 10 / Math.log(1.4) }],
  ['rotating-disc', { Di: 0 }, { smax: 3.3 / 8 * 7850 * (100 * Math.PI) ** 2 * 0.0625 / 1e6 }],
  ['rect-bar-torsion', {}, { tau: 200000 * 156 / (1600 * 400) }],
  ['tube-collapse', {}, { pcr: 2 * 200000 / 0.91 * (2 / 98) ** 3 }],
  ['radiant-heat', {}, { Q: 0.8 * 5.670374e-8 * 2 * (573.15 ** 4 - 298.15 ** 4) }],
  ['vessel-head-volume', {}, { total: (Math.PI * 1e6 * 2000 / 4 + 2 * Math.PI * 1e9 / 24) / 1e6 }],
  ['acme-thread', {}, { d2: 18, d3: 15.5 }],
  ['planetary-gear', {}, { i: 4, zp: 24 }],
  ['contact-ratio', {}, { eps: 1.6557 }, 0.0005],
  ['profile-shift', { x1: 0 }, { awd: 54 }, 1e-9],
  ['bolt-group-eccentric', {}, { Fmax: Math.hypot(12.5, 17.5) }],
  ['refractometer-concentration', {}, { conc: 6.4, add: 400 * 0.6 / 93 }],
  ['knurl-blank', {}, { teeth: 72 }],
  ['coating-coverage', {}, { theo: 8, qty: 50 / 5.2 }],
  ['weld-cost', {}, { mass: 0.5 * 36 * 1.15 * 7.85 / 1000 }],
  ['linear-interpolation', {}, { result: 4.18 + 5 * (-0.001 / 20) }],
];
for (const [id, over, expected, tol] of HB2_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('second handbook pass: procedures, decisions and conventions', () => {
  const di = engine.run('differential-indexing');
  assert.match(metric(di, 'Crank movement per division'), /12 holes in the 21-hole circle/);
  assert.match(metric(di, 'Change gears'), /48 on the spindle driving 28 on the worm/);
  assert.equal(engine.run('differential-indexing', { divisions: 27 }).text, 'USE SIMPLE INDEXING');
  assert.equal(engine.run('true-position', { size: 10.0, dx: 0.1 }).text, 'DOES NOT CONFORM', 'no bonus at MMC size');
  assert.equal(engine.run('true-position', { mod: 'rfs' }).values.bonus, 0);
  assert.equal(engine.run('shoe-brake', { b: 10 }).text, 'SELF-LOCKING');
  assert.equal(engine.run('planetary-gear', { np: 5 }).text, 'CHECK TOOTH COUNTS');
  assert.equal(engine.run('wire-rope-reeving', { mbl: 50 }).text, 'NOT ADEQUATE');
  assert.equal(engine.run('vacuum-cup', { orient: 'vertical', mu: 0.3 }).text, 'CUPS INSUFFICIENT');
  assert.equal(engine.run('process-breakeven', { qty: 400 }).text, 'PROCESS B');
  assert.ok(engine.run('weibull-reliability', { beta: 0.8 }).checks.some((c: any) => c.label === 'Preventive replacement' && c.status === 'warn'));
  assert.ok(engine.run('wedge-force', { angle: 30 }).values.locks === false, 'steep wedge is not self-locking');
  near(engine.run('rim-face-alignment', { face: 0 }).values.back, 0.15, 1e-12, 'pure offset moves both feet equally');
});

test('second handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['circle-three-points', { x3: 100, y3: -50 }], ['taper-balls', { h1: 12 }], ['go-nogo-gauge', { gpct: 50, wpct: 50 }], ['npt-thread', { n: 1 }],
    ['motor-slip', { n: 1600 }], ['lmtd-exchanger', { Tco: 75 }], ['tube-bend-thinning', { R: 20 }], ['bending-springback', { Ri: 400, t: 1 }],
    ['planetary-gear', { zr: 71 }], ['cone-clutch', { Di: 250 }], ['eccentric-column', { P: 300000 }], ['rotating-disc', { Di: 600 }],
    ['linear-interpolation', { x2: 20 }], ['section-shapes', { tf: 150 }], ['oil-viscosity-temperature', { T2: 40 }], ['thin-tube-torsion', { t: 60 }],
  ];
  for (const [id, over] of cases) {
    const r = engine.run(id, over);
    assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined);
  }
});

// Third handbook pass (handbook14–16): the remaining entries of the handbook's index of interactive equations.
const HB3_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['unified-thread-limits', {}, { es: 0.0015, dmax: 0.4985, dmin: 0.4876, d2max: 0.4485, d2min: 0.4435, D2min: 0.45, D2max: 0.4565, D1min: 0.417 }, 1e-9], // ASME B1.1 table, ½-13 UNC-2A/2B
  ['unified-thread-limits', { n: 28 }, { es: 0.0011, dmax: 0.4989, dmin: 0.4924, d2max: 0.4757, d2min: 0.472, Td2: 0.003668 }, 1e-9], // handbook worked example, ½-28 UNEF-2A
  ['metric-thread-limits', {}, { dmax: 9.968, dmin: 9.732, d2max: 8.994, d2min: 8.862, D1min: 8.376, D1max: 8.676, D2min: 9.026 }, 1e-9], // ISO 965-2, M10 × 1.5-6g / 6H
  ['taper-discs', {}, { angleOut: 5.732, Tc: 1.2015 }, 0.0005], // handbook: discs 1 and 1.5 in at 5 in
  ['taper-discs', { mode: 'cTaper', D: 1.5, d: 1.25, T: 0.75 }, { C: 4.002 }, 0.0005], // handbook: ¾ in per foot
  ['taper-discs', { mode: 'cAngle', D: 3, d: 1, angle: 20 }, { C: 5.759 }, 0.0005], // handbook: 20°
  ['taper-discs', { mode: 'angle', D: 3, d: 2, C: 5 }, { Ts: 2.4367 }, 0.0005], // handbook: taper from one side
  ['taper-discs', { mode: 'cSide', D: 5, d: 2, T: 6.9 }, { C: 5.815 }, 0.0005], // handbook: 6.9 in per foot from one side
  ['taper-discs', { mode: 'disk', d: 1, angle: 15 }, { D: 1.3002 }, 0.0001], // handbook: disc touching a 1 in disc at 15°
  ['bolt-circle-pins', {}, { x: 5.0801 }, 0.0001], // handbook: six ¾ in holes, 4½ in over alternate plugs
  ['three-wire-lead-angle', { angle: 60, starts: 1, P: 1.75, E: 10.863 }, { W: 1.75 * 0.57735 }, 0.002],
  ['gear-cutter-number', { type: 'spur', Nt: 30 }, { Nf: 30 }],
  ['crossed-helical-gears', {}, { D: 40 / (8 * Math.SQRT1_2), d: 20 / (8 * Math.SQRT1_2) }], // handbook: D = N ÷ 0.70711 Pn at 45°
  ['involute-spline', {}, { D: 1.25, sv: Math.PI / 32, Do: 21 / 16, Dri: 21.35 / 16 }],
  ['involute-spline', { type: '37fillet', Pd: 2.5 }, { sv: 0.6683 }, 0.00005], // ANSI B92.1 table 3
  ['whitworth-thread', {}, { d2: 0.5 - 0.640327 / 12, d1: 0.5 - 2 * 0.640327 / 12 }],
  ['keyseat-depth', {}, { Y: (40 - Math.sqrt(1600 - 144)) / 2 }],
  ['arc-radius-rolls', {}, { R: 82.5 }],
  ['full-power-cutting-speed', {}, { vc: 8.8 * 60000 / (2000 * 4 * 0.3) }],
  ['belt-length-crossed-three', { mode: 'crossed', D1: 200, D2: 100, C: 600 }, { L: 2 * Math.sqrt(600 ** 2 - 150 ** 2) + 150 * (Math.PI + 2 * Math.asin(0.25)) }],
  ['two-span-beam', {}, { RA: 2250, RB: 7500, MB: -2.25e6, M1: 9 * 2 * 9e6 / 128 }, 1e-3],
  ['two-span-beam', { case: 'point', w1: 1000, w2: 1000 }, { RA: 5000 / 16 * 1000 / 1000 * 1, MB: -3 * 1000 * 3000 / 16 }, 1e-6],
  ['overhanging-beam', {}, { R1: 9200, Mneg: -1.28e6, Mpos: 3.22e6 }, 1e-6],
  ['beam-cases-more', {}, { R1: 3920, M: 1.47e6 }, 1e-6],
  ['beam-cases-more', { case: 'guided-point' }, { M: 5000 * 2000 / 2 }],
  ['force-system', {}, { x0: 1100000 / 3000, R: 3000 }, 1e-9],
  ['gas-compression-process', {}, { T2c: 293.15 * Math.pow(8 / 1.013, 0.4 / 1.4) - 273.15 }],
  ['principal-stress-3d', { sx: 100, sy: 50, sz: -20, txy: 0, tyz: 0, tzx: 0 }, { s1: 100, s2: 50, s3: -20 }, 1e-9],
  ['shaft-combined-stress', { P: 0, M: 0 }, { tau: 500000 * 16 / (Math.PI * 64000) }],
  ['section-shapes-more', {}, { Ix: 5 * Math.sqrt(3) / 16 * (30 / Math.sqrt(3)) ** 4 }],
  ['mass-inertia-more', {}, { J: 10 * (0.2 ** 2 + 0.75 * 0.03 ** 2) }],
  ['journal-bearing-petroff', {}, { S: (0.025 / 0.00004) ** 2 * 0.025 * 25 / 2e6 }],
  ['square-wire-spring', {}, { k: 79300 * 81 / (5.58 * 8 * 8000) }],
  ['plane-area', {}, { area: 3200 }],
  ['polygon-area', { n: 4, x1: 0, y1: 0, x2: 10, y2: 0, x3: 10, y3: 5, x4: 0, y4: 5 }, { area: 50, cx: 5, cy: 2.5 }, 1e-9],
  ['solid-volume', { shape: 'sphere', A: 10 }, { V: Math.PI * 1000 / 6 }],
  ['centroid-shapes', { shape: 'hemisphere', A: 8 }, { cg: 3 }],
  ['complex-number', {}, { re: 11, im: -2 }],
  ['equation-solver', {}, { first: 1 }, 1e-9],
  ['linear-system', {}, { x1: 2, x2: 3, x3: -1 }, 1e-9],
  ['combinations', {}, { C: 120, P: 720 }],
  ['trig-functions', {}, { inv: Math.tan(Math.PI / 9) - Math.PI / 9 }],
  ['trig-functions', { mode: 'inv', invValue: Math.tan(Math.PI / 9) - Math.PI / 9 }, { deg: 20 }, 1e-9],
  ['dms-converter', {}, { decv: 12 + 30 / 60 + 15 / 3600 }],
  ['circle-packing', { mode: 'shaft', n: 6, d: 30 }, { roller: 30 }, 1e-9],
  ['wind-chill', {}, { wct: 13.12 + 0.6215 * -5 - 11.37 * 30 ** 0.16 + 0.3965 * -5 * 30 ** 0.16 }],
  ['density-converter', {}, { si: 7850 }],
];
for (const [id, over, expected, tol] of HB3_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('third handbook pass: lookups and procedures', () => {
  assert.equal(metric(engine.run('drill-size-lookup', { mode: 'code', code: '#7' }), 'Drill #7'), '0.201 in (5.105 mm)'); // ¼-20 tap drill
  assert.equal(metric(engine.run('drill-size-lookup', { mode: 'code', code: 'F' }), 'Drill F'), '0.257 in (6.528 mm)');
  assert.match(metric(engine.run('drill-size-lookup', { dia: 0.201, unit: 'in' }), 'Nearest number / letter'), /^No\. 7 /);
  assert.equal(engine.run('gear-cutter-number', { type: 'spur', Nt: 13 }).values.cutter, '8');
  assert.equal(engine.run('gear-cutter-number', { type: 'spur', Nt: 140 }).values.cutter, '1');
  assert.equal(engine.run('gear-cutter-number', { type: 'spur', Nt: 24 }).values.halfC, '4½');
  assert.equal(engine.run('triangle-ssa').values.count, 2);
  assert.equal(engine.run('triangle-ssa', { a: 60 }).values.count, 1);
  near(engine.run('circle-packing', { mode: 'incircle', n: 7, d: 10 }).values.D, 30, 1e-9, 'seven circles in a circle');
  assert.equal(engine.run('equation-solver', { degree: '2', a: 1, b: 0, c: 1 }).values.nreal, 0, 'x² + 1 has no real roots');
  const belt = engine.run('belt-length-crossed-three'); assert.ok(belt.metrics.filter((x: any) => x.label.startsWith('Wrap on pulley')).length === 3);
});

test('third handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['linear-system', { a31: 4, a32: 2, a33: -2, a11: 2, a12: 1, a13: -1 }], ['equation-solver', { a: 0 }], ['triangle-ssa', { a: 10 }], ['combinations', { r: 11 }],
    ['polygon-area', { n: 3, x1: 0, y1: 0, x2: 1, y2: 1, x3: 2, y3: 2 }], ['plane-area', { shape: 'ring', B: 120 }], ['arc-radius-rolls', { Hh: 10 }],
    ['bolt-circle-pins', { n: 5 }], ['taper-discs', { D: 1, d: 1.5 }], ['keyseat-depth', { w: 50 }], ['crossed-helical-gears', { psi: 90 }],
    ['overhanging-beam', { case: 'two-udl', allow: 0.001 }], ['two-span-beam', { case: 'point', a1: 4000 }], ['beam-cases-more', { a: 2500 }],
    ['square-wire-spring', { Lw: 70 }], ['thrust-bearing-pads', { Di: 200 }], ['section-shapes-more', { shape: 'cirsq', C: 25 }],
  ];
  for (const [id, over] of cases) {
    const r = engine.run(id, over);
    if (id === 'overhanging-beam') { assert.equal(r.text, 'OVERSTRESSED'); continue; }
    if (id === 'crossed-helical-gears') continue; // 90° is outside the field range and rejected by the input check below
    assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined);
  }
  assert.equal(engine.run('crossed-helical-gears', { psi: 90 }).text, 'CHECK INPUTS');
});

// Fourth handbook pass (handbook17–18): plates and shells, fatigue, drives, machining geometry and engineering economics.
const HB4_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['universal-joint', {}, { nmax: 100 / Math.cos(25 * Math.PI / 180), nmin: 100 * Math.cos(25 * Math.PI / 180) }], // handbook: 25° joint at 100 rpm
  ['vickers-knoop-hardness', {}, { H: 1.8544 * 10 / 0.09 }],
  ['elastic-constants', {}, { G: 200 / 2.6, K: 200 / 1.2, lam: 200 * 0.3 / (1.3 * 0.4) }],
  ['spherical-shell', {}, { thin: 2 * 600 / 24 }],
  ['fatigue-notch-factor', {}, { a: 0.0254 * (2070 / 700) ** 1.8, Kf: 1 + 1.2 / (1 + 0.0254 * (2070 / 700) ** 1.8) }],
  ['sn-fatigue-life', {}, { a: 630 ** 2 / 250, b: -Math.log10(630 / 250) / 3 }],
  ['melting-energy', {}, { Q: 500 * (0.9 * 640 + 397 + 1.18 * 60) }],
  ['snap-fit', {}, { eps: 1.5 * 1.2 * 1.6 / 225 * 100 }],
  ['gear-contact-stress', {}, { ZE: Math.sqrt(206000 / (2 * Math.PI * 0.91)), ZH: Math.sqrt(2 / (Math.sin(Math.PI / 9) * Math.cos(Math.PI / 9))) }],
  ['bearing-duty-cycle', {}, { nm: 1800, Pm: Math.cbrt((64 * 75000 + 512 * 15000 + 8 * 90000) / 180000) }],
  ['rms-torque', {}, { rms: Math.sqrt((144 * 0.2 + 9 * 0.6 + 100 * 0.2) / 2), peak: 12 }],
  ['ball-screw-life', {}, { L: (15 / 2.4) ** 3 * 1e6, km: (15 / 2.4) ** 3 * 10 }],
  ['timing-belt', {}, { L: 400 * Math.cos(Math.asin(100 / Math.PI / 400)) + 150 + Math.asin(100 / Math.PI / 400) * 100 / Math.PI, teeth: 110 }], // exact open-belt length
  ['alignment-thermal-growth', {}, { g1: 0.066, g2: 0.165, offset: 0.099 }, 1e-12],
  ['bend-radius-limits', {}, { Rmin: 0.75, Rmax: 200000 * 3 / 500 }],
  ['anodizing-time', {}, { rate: 1.5 * 9.290304 / 720 * 25.4 }], // the 720 rule in metric units
  ['cnc-chord-error', {}, { L: 2 * Math.sqrt(2 * 50 * 0.005 - 0.005 ** 2), n: 56 }],
  ['grinding-geometry', {}, { De: 400 * 50 / 450, lg: Math.sqrt(0.02 * 400 * 50 / 450) }],
  ['thread-milling-path', {}, { pathD: 6, fe: 720, fc: 720 * 6 / 20 }],
  ['angular-indexing', {}, { turns: (17 + 25 / 60) / 9 }],
  ['bolted-joint-fatigue', {}, { sa: 0.2 * 10000 / (2 * 84.3), sm: 0.2 * 10000 / (2 * 84.3) + 35000 / 84.3 }],
  ['benefit-cost-ratio', {}, { PVB: 30000 * (1 - 1.08 ** -6) / 0.08, PVC: 100000 + 5000 * (1 - 1.08 ** -6) / 0.08 - 10000 / 1.08 ** 6 }],
  ['speed-series', {}, { phi: 40 ** (1 / 11) }],
  ['factors-gcd', {}, { g: 6, l: 360 }],
  ['rack-pinion', {}, { d: 40, v: Math.PI * 40 * 300 / 1000, F: 20000 / 20 * 0.97 }],
];
for (const [id, over, expected, tol] of HB4_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('fourth handbook pass: verdicts and factorisation', () => {
  assert.equal(engine.run('factors-gcd').values.fa, '2 × 2 × 2 × 3 × 3');
  assert.equal(engine.run('angular-indexing').values.setting, '1 turns and 29 holes in the 31-hole circle');
  assert.equal(engine.run('gear-contact-stress', { allow: 500 }).text, 'ABOVE ALLOWABLE');
  assert.equal(engine.run('benefit-cost-ratio', { P: 1e7 }).text, 'COSTS EXCEED BENEFITS');
  assert.equal(engine.run('snap-fit', { Y: 3 }).text, 'STRAIN TOO HIGH');
  assert.equal(engine.run('spherical-shell', { p: 20 }).text, 'INADEQUATE');
});

test('fourth handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['cnc-chord-error', { tol: 60 }], ['timing-belt', { C: 20 }], ['elastic-constants', { nu: 0.6 }], ['thread-milling-path', { dc: 22 }],
    ['grinding-geometry', { type: 'int', dw: 300 }], ['bolted-joint-fatigue', { Fi: 80 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifth handbook pass (handbook19–20): mechanics and mechanisms, machine elements, forming and shop calculations.
const g0 = 9.80665;
const HB5_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['uniform-acceleration', {}, { v: 10, s: 25 }],
  ['uniform-acceleration', { mode: 'fall', u: 0, h: 10 }, { v: Math.sqrt(2 * g0 * 10), t: Math.sqrt(2 * 10 / g0) }],
  ['uniform-acceleration', { mode: 'distance', u: 10, v: 0, s: 25 }, { a: -2, t: 5 }],
  ['angular-acceleration-torque', {}, { alpha: 50 * Math.PI / 2, T: 0.5 * 25 * Math.PI + 2, revs: 25 }],
  ['impulse-momentum', {}, { F: 500 }],
  ['impulse-momentum', { mode: 'collision' }, { v1p: 1, v2p: 4, loss: 0 }, 1e-9], // elastic impact, 2 kg at 3 m/s on 1 kg at rest
  ['impulse-momentum', { mode: 'collision', e: 0 }, { v1p: 2, v2p: 2, loss: 3 }, 1e-9],
  ['pendulum-period', {}, { T: 2 * Math.PI * Math.sqrt(1 / g0) }],
  ['pendulum-period', { type: 'compound' }, { T: 2 * Math.PI * Math.sqrt(0.36 / (g0 * 0.4)) }],
  ['pendulum-period', { type: 'torsional' }, { T: 8 * Math.sqrt(Math.PI * 2 * 0.01 * 1 / (0.003 ** 4 * 79.3e9)) }], // handbook SI form
  ['flyball-governor', {}, { h: 2933 / 200 ** 2 * 6 * 0.3048, C: 0.1 }, 0.0002], // handbook: h = 2933 ÷ n² × (c + w) ÷ w in feet
  ['geneva-mechanism', {}, { a: 100 * Math.SQRT1_2, tIndex: 0.25, ratio: 1 + Math.SQRT2 }],
  ['gyroscope-precession', {}, { Tg: 0.4 * 100 * Math.PI * Math.PI / 3, F: 0.4 * 100 * Math.PI * Math.PI / 3 / 0.3 }],
  ['prony-brake', {}, { P: 2 * Math.PI * 1 * 600 * 200 / 60 }],
  ['rolling-resistance', {}, { F: 10000 * 0.5 / 150 }],
  ['rotating-balance-plane', {}, { mc: Math.hypot(5000 + 2400 * Math.cos(200 * Math.PI / 180), 2400 + 2400 * Math.sin(200 * Math.PI / 180)) / 100 }],
  ['two-plane-balance', {}, { mA: Math.hypot(2625, 1500 * Math.sqrt(3) * 0.25) / 100, mB: Math.hypot(125, 1500 * Math.sqrt(3) * 0.75) / 100 }],
  ['torsional-vibration', {}, { K: 79.3e9 * Math.PI * 0.02 ** 4 / 32 / 0.5 }],
  ['torsional-vibration', { mode: 'single', kMode: 'entered', K: 2000, J2: 0.05 }, { fn: Math.sqrt(2000 / 0.05) / (2 * Math.PI) }],
  ['buoyancy', {}, { Fb: 1000 * g0 * 0.01, app: (78.5 - 10) * g0 }],
  ['wind-pressure', { V: 100 * 0.44704, Cd: 1.6 }, { p: 0.6 * (100 * 0.44704) ** 2 * 1.6 }], // about the handbook's 40 lb/ft² at 100 mph
  ['escaping-air-velocity', {}, { vSonic: Math.sqrt(2 * 1.4 * 287.05 * 294.15 / 2.4) }],
  ['escaping-air-velocity', { p1: 0.2 }, { vOr: Math.sqrt(7 * 287.05 * 294.15 * (1 - (1.01325 / 1.21325) ** (0.4 / 1.4))) }],
  ['ratchet-wheel-pitch', {}, { F: 35, P: Math.sqrt(35 * 200000 / (25 * 20 * 16)) }],
  ['lever-force', {}, { F: 800 * 100 / 600, R: 800 + 800 / 6 }],
  ['lever-force', { mode: 'arm', W1: 9000, a1: 1.5, F: 400 }, { x: 9000 * 1.5 / 400 }],
  ['hoist-advantage', {}, { ideal: 10000 * 15 / 300 }],
  ['hoist-advantage', { type: 'geared', W: 2000, R: 12, r: 2, g1: 1, eff: 100 }, { F: 2000 * 2 / 12 }], // handbook windlass example
  ['hoist-advantage', { type: 'block', W: 200, n: 5, eff: 100 }, { F: 40 }], // handbook: five parts of rope
  ['agma-bending-stress', {}, { sF: 3000 * 1.25 * 1.2 * 1.3 / (30 * 2.5 * 0.35) }],
  ['spline-torque-capacity', {}, { sRoot: 16 * 500000 * 1.2 / (Math.PI * 28 ** 3), sComp: 2 * 500000 * 1.2 / (9 * 30 * 24 * 25 * 1.125) }],
  ['internal-gear', {}, { Di: 11.8 * 25.4, Dop: 3.41667 * 25.4, C: 27 * 4.2333 }, 0.005], // handbook: 72 teeth with an 18-tooth pinion, 6 DP
  ['film-thickness-ratio', {}, { lam: 0.25 / Math.hypot(0.06, 0.04) }],
  ['turn-of-nut-preload', {}, { theta: 360 * 35000 * (30 / (Math.PI * 25) + 10 / 58) / 205000 / 1.5 }],
  ['turn-of-nut-preload', { mode: 'preload', theta: 360 * 35000 * (30 / (Math.PI * 25) + 10 / 58) / 205000 / 1.5 }, { F: 35 }, 1e-9],
  ['deep-draw-force', {}, { F: Math.PI * 80 * 1.5 * 350 / 1000 }],
  ['deep-draw-force', { op: 'redraw' }, { F: Math.PI * 60 * 1.5 * 350 * (2 - 0.7) / 1000 }],
  ['thread-roll-diameter', { d: 0.45, T: 0.0499, Ns: 2 }, { D: 0.8001 }, 0.0002], // handbook: double roll for a ½ in. thread
  ['hobbing-time', {}, { tCut: (30 + Math.sqrt(5.625 * 74.375) + 3) / (1.5 * 60000 / (80 * Math.PI) / 40) }],
  ['angle-ring-length', { mode: 'constant', D: 240, k: 4.319 }, { L: Math.PI * 240 - 4.319 }], // handbook: 20 ft stand-pipe, inches
  ['perforated-open-area', {}, { OA: 90.69 * 25 / 64 }],
  ['sound-level', {}, { L: 46.7 }, 0.05], // handbook example 1
  ['sound-level', { B: 41 }, { L: 50.5 }, 0.05], // handbook example 2
  ['sound-level', { mode: 'sum', L1: 85, L2: 85 }, { L: 85 + 10 * Math.log10(2) }],
  ['sound-level', { mode: 'distance' }, { L: 90 - 20 * Math.log10(4) }],
  ['equivalent-stiffness-thickness', {}, { tStiff: 2 * Math.cbrt(200 / 3), tStr: 2 * Math.sqrt(250 / 60) }],
  ['matrix-3x3', {}, { det: 1, i11: 3, i12: -1, i13: 1, i21: -15, i22: 6, i23: -5, i31: 5, i32: -2, i33: 2 }, 1e-12],
  ['wood-moisture-density', {}, { MC: 25, rho: 1000 * 0.5 * 1.12 / (1 + 0.009 * 0.5 * 12) }],
];
for (const [id, over, expected, tol] of HB5_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('fifth handbook pass: self-consistency and verdicts', () => {
  const cat = engine.run('catenary-cable').values;
  near(cat.a * (Math.cosh(100 / (2 * cat.a)) - 1), 5, 1e-9, 'catenary sag');
  near(cat.Tmax, cat.H + 10 * 5, 1e-9, 'catenary tension');
  near(cat.L, 2 * cat.a * Math.sinh(50 / cat.a), 1e-9, 'catenary length');
  const tp = engine.run('two-plane-balance').values; // corrections must cancel the force and the moment about plane A
  const vec = (mass: number, r: number, aDeg: number) => [mass * r * Math.cos(aDeg * Math.PI / 180), mass * r * Math.sin(aDeg * Math.PI / 180)];
  const u1 = vec(40, 100, 0), u2 = vec(30, 100, 120), uA = vec(tp.mA, 100, tp.angA), uB = vec(tp.mB, 100, tp.angB);
  near(u1[0] + u2[0] + uA[0] + uB[0], 0, 1e-6, 'two-plane force x'); near(u1[1] + u2[1] + uA[1] + uB[1], 0, 1e-6, 'two-plane force y');
  near(u1[0] * 100 + u2[0] * 300 + uB[0] * 400, 0, 1e-4, 'two-plane moment x'); near(u1[1] * 100 + u2[1] * 300 + uB[1] * 400, 0, 1e-4, 'two-plane moment y');
  assert.equal(engine.run('internal-gear', { Zp: 65 }).text, 'INTERFERENCE LIKELY');
  assert.equal(engine.run('torsional-vibration', { Ls: 20000 }).text, 'WITHIN BANDWIDTH');
  assert.equal(engine.run('film-thickness-ratio', { h: 0.03 }).text, 'BOUNDARY');
  assert.equal(engine.run('buoyancy').text, 'SINKS');
  assert.equal(engine.run('buoyancy', { mass: 5 }).text, 'FLOATS');
  assert.equal(engine.run('agma-bending-stress', { allow: 300 }).text, 'BENDING OVERSTRESSED');
  assert.equal(engine.run('deep-draw-force', { press: 100 }).text, 'EXCEEDS PRESS CAPACITY');
});

test('fifth handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['uniform-acceleration', { mode: 'distance', u: 0, v: 0 }], ['pendulum-period', { type: 'compound', k0: 0.3 }], ['flyball-governor', { nmax: 180 }], ['prony-brake', { tare: 40 }],
    ['catenary-cable', { d: 150 }], ['rotating-balance-plane', { m1: 0, m2: 0, m3: 0 }], ['torsional-vibration', { di: 25 }], ['escaping-air-velocity', { p2: 9 }],
    ['lever-force', { W1: 0 }], ['hoist-advantage', { r: 200 }], ['spline-torque-capacity', { Dh: 30 }], ['internal-gear', { Zp: 72 }], ['deep-draw-force', { op: 'iron', c: 2 }],
    ['perforated-open-area', { d: 9 }], ['sound-level', { B: 60 }], ['matrix-3x3', { a11: 1, a12: 2, a13: 3, a21: 2, a22: 4, a23: 6 }], ['wood-moisture-density', { wet: 5 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Sixth handbook pass (handbook21–22): prismoids, Pappus, Simpson, spherical triangles, series, lines, mixtures,
// classic columns, retaining rings, oil cleanliness, filters, inverse-time feed, bar stock, shearing, pitting power,
// grinding time and pattern shrinkage.
const HB6_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['prismoidal-volume', {}, { V: 500 / 3 * (240000 + 60000 + Math.sqrt(240000 * 60000)) }], // exact for a frustum of a pyramid
  ['prismoidal-volume', { mode: 'circ' }, { V: Math.PI * 500 / 12 * (600 ** 2 + 600 * 300 + 300 ** 2) }], // frustum of a cone
  ['pappus-revolution', {}, { S: 296.089, V: 222.067 }, 0.002], // handbook torus example
  ['pappus-revolution', { shape: 'custom', ang: 180 }, { S: 20 * Math.PI * 30, V: 50 * Math.PI * 30 }],
  ['simpson-area', { Ns: 2, W: 1, V0: 0, V1: 1, V2: 4 }, { A: 8 / 3 }], // ∫x² from 0 to 2, exact by Simpson
  ['spherical-triangle', {}, { C: 120, area: 100 * 2 * Math.PI / 3 }, 1e-9], // handbook: one sixth of a 20 mm sphere, 209.4 mm²
  ['spherical-triangle', { a: 90, b: 90, c: 90 }, { A: 90, area: 4 * Math.PI * 100 / 8 }, 1e-9],
  ['spherical-triangle', { mode: 'gc', R: 1000, lat1: 0, lon1: 0, lat2: 0, lon2: 90 }, { ca: 90, dist: 500 * Math.PI, brg: 90 }, 1e-9],
  ['progression', {}, { last: 2 * 1.5 ** 7, sum: 2 * (1.5 ** 8 - 1) / 0.5 }],
  ['progression', { type: 'arith', l: 23 }, { last: 23, sum: 100, fit: 3 }],
  ['preferred-numbers', {}, { count: 11, ratio: 10 ** 0.1 }],
  ['preferred-numbers', { series: '5', min: 1, max: 100 }, { count: 11, ratio: 10 ** 0.2 }],
  ['line-intersection', {}, { ix: 160 / 3, iy: 80 / 3, angle: Math.atan(3) * 180 / Math.PI, dist: 30 / Math.sqrt(1.25) }],
  ['drop-hammer-blow', {}, { F: 500 * 9.80665 * 1.51 / 0.01, vImp: Math.sqrt(2 * 9.80665 * 1.5) }],
  ['mixture-cost', {}, { total: 150.8, avg: 150.8 / 85 }], // handbook alloy example
  ['mixture-cost', { mode: 'blend' }, { sA: 0.625, qA: 62.5 }],
  ['column-safe-stress-classic', {}, { lr: 100, psi: 17000 - 0.485 * 100 ** 2 }],
  ['column-safe-stress-classic', { L: 3500, member: 'secondary' }, { psi: 18000 / (1 + 140 ** 2 / 18000) }],
  ['column-safe-stress-classic', { L: 3500 }, { psi: 18000 / (1 + 140 ** 2 / 18000) * (1.6 - 140 / 200) }],
  ['retaining-ring-thrust', {}, { Ps: Math.PI * 25 * 1.2 * 1000 / 3, PG: Math.PI * 25 * 0.5 * 250 / 3, Y: 3 * 3000 / (Math.PI * 25 * 200) }],
  ['iso-cleanliness-code', {}, { R4: 21, R6: 19, R14: 17 }], // handbook example code 21/19/17
  ['iso-cleanliness-code', { vol: 10, c4: 150000, c6: 30000, c14: 10000 }, { R4: 21, R6: 19, R14: 17 }],
  ['filter-beta-ratio', {}, { beta: 200, eff: 99.5 }],
  ['filter-beta-ratio', { mode: 'rating', beta: 75 }, { down: 5000 / 75 }],
  ['inverse-time-feed', {}, { F: 300 / (20 * Math.PI) }],
  ['inverse-time-feed', { mode: 'linear', dist: 50, feed: 500 }, { F: 10 }],
  ['screw-machine-stock', {}, { perBar: 109, bars: 10 }],
  ['screw-machine-stock', { W: 0.062 * 25.4 }, { hb: 1.062 * 84 * 0.3048 }], // handbook: F = (L + W) × 84 ft per 1000
  ['shearing-blade-force', { blades: 'parallel' }, { F: 900000, FM: 1170000 }],
  ['shearing-blade-force', {}, { F: 0.8 * 0.75 * 400 * 0.6 * 9 / Math.tan(2 * Math.PI / 180) }],
  ['agma-pitting-power', {}, { I: Math.cos(Math.PI / 9) * Math.sin(Math.PI / 9) / 2 * 0.75, Pac: 1500 * 30 / 1.91e7 * Math.cos(Math.PI / 9) * Math.sin(Math.PI / 9) / 2 * 0.75 * 0.8 / (1.3 * 1.25) * (60 * 1000 / 191) ** 2 }],
  ['agma-pitting-power', { kind: 'int' }, { I: Math.cos(Math.PI / 9) * Math.sin(Math.PI / 9) / 2 * 1.5 }],
  ['grinding-cycle-time', {}, { passes: 12, strokes: 20, minutes: 12 * 20 * 350 / 15000 }],
  ['grinding-cycle-time', { type: 'traverse' }, { rate: 3000, minutes: 12 * 190 / 3000 }],
  ['grinding-cycle-time', { type: 'plunge' }, { minutes: 0.4 + 5 / 60 }],
  ['pattern-shrinkage', {}, { cast: 306, pattern: 306 * 1.0104, W: 57.6 }],
];
for (const [id, over, expected, tol] of HB6_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('sixth handbook pass: codes and verdicts', () => {
  assert.equal(engine.run('iso-cleanliness-code').values.code, '21/19/17');
  assert.equal(engine.run('iso-cleanliness-code').text, 'DIRTIER THAN TARGET');
  assert.equal(engine.run('iso-cleanliness-code', { c4: 100, c6: 30, c14: 5 }).text, 'MEETS TARGET');
  assert.equal(engine.run('retaining-ring-thrust', { P: 5 }).text, 'THRUST EXCEEDS CAPACITY');
  assert.equal(engine.run('shearing-blade-force', { cap: 40 }).text, 'EXCEEDS CAPACITY');
  assert.equal(engine.run('agma-pitting-power', { P: 20 }).text, 'PITTING RATING EXCEEDED');
  assert.equal(engine.run('column-safe-stress-classic', { L: 3500, member: 'secondary' }).text, 'OVER SAFE LOAD');
  const par = engine.run('line-intersection', { x3: 0, y3: 10, x4: 100, y4: 60 }); // parallel to line 1
  assert.equal(par.checks[0].status, 'warn'); near(par.values.dist, 30 / Math.sqrt(1.25), 1e-9, 'distance with parallel lines');
});

test('sixth handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['prismoidal-volume', { mode: 'areas', A1: 0, Am: 0, A2: 0 }], ['pappus-revolution', { d: 20 }], ['simpson-area', { Ns: 7 }], ['spherical-triangle', { a: 20, b: 20, c: 60 }],
    ['progression', { l: -5 }], ['preferred-numbers', { max: 0.5 }], ['line-intersection', { x2: 0, y2: 0 }], ['mixture-cost', { mode: 'blend', vT: 12 }],
    ['mixture-cost', { q1: 0, q2: 0, q3: 0, q4: 0 }], ['column-safe-stress-classic', { L: 6000 }], ['iso-cleanliness-code', { c6: 20000 }], ['filter-beta-ratio', { down: 6000 }],
    ['inverse-time-feed', { angle: 0 }], ['screw-machine-stock', { bar: 20 }], ['agma-pitting-power', { kind: 'int', mg: 1 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Seventh handbook pass (handbook23): gear contact geometry, clutch teeth, silent chain, microtools, stockpiles, timber,
// packed-joint bolts, press flywheels, equivalent chip thickness and draw sequences.
const HB7_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['spur-contact-diameters', {}, { dc1: 20 * Math.cos(Math.PI / 9) / Math.cos(Math.atan(Math.tan(Math.PI / 9) - 2 * (Math.tan(Math.acos(40 * Math.cos(Math.PI / 9) / 42)) - Math.tan(Math.PI / 9)))) }],
  ['spur-contact-diameters', {}, { mf: (Math.sqrt(21 ** 2 - (20 * Math.cos(Math.PI / 9)) ** 2) + Math.sqrt(11 ** 2 - (10 * Math.cos(Math.PI / 9)) ** 2) - 30 * Math.sin(Math.PI / 9)) / (Math.PI * Math.cos(Math.PI / 9)) }], // formula 7c
  ['spur-contact-diameters', {}, { rc: (0.785398 * Math.cos(Math.PI / 9) - 1.25 * Math.sin(Math.PI / 9)) / (1 - Math.sin(Math.PI / 9)) }],
  ['clutch-teeth-dividing-head', {}, { alpha: 27 + 19.2 / 60 }, 0.01], // handbook table: 5 teeth, 60° single-angle cutter
  ['clutch-teeth-dividing-head', { Nt: 5, theta: 70 }, { alpha: 55 + 56.3 / 60 }, 0.01], // handbook table
  ['clutch-teeth-dividing-head', { type: 'double', Nt: 10, theta: 60 }, { alpha: 73 + 39.4 / 60 }, 0.01], // handbook table, double-angle cutter
  ['clutch-teeth-dividing-head', { type: 'double', Nt: 10, theta: 90 }, { alpha: 80 + 39 / 60 }, 0.01],
  ['silent-chain-sprocket', {}, { PD: 12.7 / Math.sin(Math.PI / 21), OD: 12.7 * (1 / Math.tan(Math.PI / 21) + 0.08), G: 12.7 * (1 / Math.tan(Math.PI / 21) - 1.16) }],
  ['silent-chain-sprocket', { Nt: 20 }, { OPD: 12.7 / Math.sin(Math.PI / 20) - 0.125 * 12.7 / Math.sin(Math.PI / 6 - Math.PI / 20) + 0.625 * 12.7 }],
  ['microtool-stiffness', {}, { dD: -59.04, dL: (1 / 1.44 - 1) * 100 }], // handbook examples: −59% and −30%
  ['stockpile-weight', {}, { V: Math.PI * 9 * 1.5 * Math.tan(35 * Math.PI / 180) / 12 }],
  ['stockpile-weight', { shape: 'rect', A: 4, B: 4 }, { V: 16 * 2 * Math.tan(35 * Math.PI / 180) / 3 }], // square base = pyramid
  ['lumber-board-feet', {}, { bf: 100, cost: 250 }],
  ['bolt-working-strength-packed', {}, { Wlb: 3000 }, 1], // handbook example: 1-in. bolt at 10,000 psi
  ['press-flywheel-sizing', {}, { P: 72.7 * 745.7, E1: 90000 * 1.355818 }, 60], // handbook example 1: 72.7 hp, 90,000 ft-lb
  ['press-flywheel-sizing', {}, { mass: 6570 * 0.4535924 }, 10], // handbook: 6,570 lb of rim
  ['ect-cutting-forces', {}, { ECT: 0.6, MRR: 480000 }], // handbook example 1
  ['ect-cutting-forces', { f: 0.4, a: 5, CEL: 5, Kc: 1500, ratio: 0.5, cfa: 30 }, { Fc: 3000, FH: 1500, FA: 1500 * Math.cos(Math.PI / 6), FR: 750 }], // handbook roughing example (A = 2 mm²)
  ['draw-reductions', {}, { n: 4, d1: 55 }],
];
for (const [id, over, expected, tol] of HB7_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('seventh handbook pass: consistency and tables', () => {
  const sc = engine.run('spur-contact-diameters').values;
  near(sc.mf, sc.mf2, 1e-9, 'both contact ratio formulas agree');
  assert.ok(sc.dc1 > 20 * Math.cos(Math.PI / 9) && sc.dL1 > sc.dc1, 'contact starts above the base circle and LPSTC lies above it');
  assert.equal(engine.run('clutch-teeth-dividing-head').values.alphaText, '27° 19.2′');
  const draws = engine.run('draw-reductions');
  assert.equal(draws.table.rows.length, 4); assert.equal(draws.table.rows[3][1], '30 mm');
  assert.equal(engine.run('bolt-working-strength-packed', { d: 12 }).checks[0].status, 'warn');
});

test('seventh handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['spur-contact-diameters', { do1: 17 }], ['spur-contact-diameters', { z1: 12, z2: 12 }], ['clutch-teeth-dividing-head', { Nt: 4 }], ['clutch-teeth-dividing-head', { type: 'double', Nt: 3, theta: 30 }],
    ['stockpile-weight', { shape: 'rect', A: 8 }], ['bolt-working-strength-packed', { d: 3 }], ['press-flywheel-sizing', { tcut: 5 }], ['press-flywheel-sizing', { emode: 'energy', E: 0 }], ['draw-reductions', { d: 120 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Eighth handbook pass (handbook24): plastics gears, plastic–metal thermal mismatch and set-screw holding power.
const usPlasticGearKW = (SsPsi: number, Fin: number, Y: number, Vfpm: number, P: number, Cs: number) => SsPsi * Fin * Y * Vfpm / (55 * (600 + Vfpm) * P * Cs) * 0.7457;
const HB8_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['plastic-gear-power', {}, { kW: 10 * 0.308 * 1.5 * 40 * (Math.PI * 45 * 600 / 60000) / (327 * (3.05 + Math.PI * 45 * 600 / 60000) * 1.25) }],
  ['plastic-gear-power', {}, { kW: usPlasticGearKW(40 / 0.0068948, 10 / 25.4, 0.308, Math.PI * 45 * 600 / 60000 * 196.85, 25.4 / 1.5, 1.25) }, 0.002], // metric and US forms agree
  ['plastic-gear-power', { type: 'bevel' }, { kW: 10 * 0.308 * 1.5 * 40 * (Math.PI * 45 * 600 / 60000) / (327 * (3.05 + Math.PI * 45 * 600 / 60000) * 1.25) * 50 / 60 }],
  ['plastic-thermal-mismatch', {}, { sigma: (11.7 - 80) * 1e-6 * 2000 * 40, dLrel: 68.3e-6 * 100 * 40 }],
  ['plastic-thermal-mismatch', { emode: 'creep', dT: -40 }, { E: 1000, sigma: (11.7 - 80) * 1e-6 * 1000 * -40 }],
  ['set-screw-holding', {}, { hp: 4.1, n: 1 }, 0.05], // handbook: ½-in. screw, 1-in. shaft, 1000 rpm
  ['set-screw-holding', { d: 9.525 }, { hp: 2.1, n: 2 }, 0.05], // handbook: 3/8-in. screws, two needed for 3 hp
  ['set-screw-holding', { d: 6.35 }, { Fh: 100 * 4.448222 }, 0.04 * 445], // handbook holding force ≈ 100 lb for ¼ in.
];
for (const [id, over, expected, tol] of HB8_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('eighth handbook pass: verdicts and guards', () => {
  assert.equal(engine.run('plastic-thermal-mismatch', { allow: 5 }).text, 'STRESS TOO HIGH');
  assert.equal(engine.run('set-screw-holding', { P: 10 }).checks[0].status, 'warn');
  const bad = engine.run('plastic-gear-power', { type: 'bevel', C: 8 });
  assert.equal(bad.text, 'CHECK INPUTS'); assert.equal(bad.primary, undefined);
});

// Ninth handbook pass (handbook25): uncited formula pages found by a page-by-page coverage map.
const HB9_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['forming-tool-depth', { D: 0.5, C: 15 }, { depth: 0.48296 }, 0.00001], // handbook table: 0.5 in. step at 15° clearance
  ['forming-tool-depth', {}, { Ap: 44 }, 0.02], // handbook table: 45° on the work, 15° clearance → 44° 0′
  ['forming-tool-depth', { mode: 'rake' }, { depth: 5.490, B: 6.23 }, 0.002], // handbook example: 16 and 10 mm radii
  ['forming-tool-depth', { mode: 'circular', Rt: 1.5, off: 0.25, D: 0.25 }, { k: 1.4790, rr: Math.sqrt((Math.sqrt(2.1875) - 0.25) ** 2 + 0.0625) }, 0.0001], // B&S No. 2 constant
  ['spade-drill-power', { D: 25.4, f: 0.254, n: 300, dull: 0, em: 1 }, { kWc: 0.79 * Math.PI / 4 * 0.01 * 300 * 0.7457 }, 0.005], // metric form agrees with uhp form
  ['spade-drill-power', { D: 25.4, f: 0.254, dull: 0 }, { Bs: 148500 * 0.79 * 0.01 * 4.448222 }, 15], // thrust agrees with the US form
  ['true-stress-strain', {}, { sN: 30000 / 78.54, eN: 0.2, eT: Math.log(1.2), sT: 30000 * 1.2 / 78.54, flow: 530 * Math.log(1.2) ** 0.26 }],
  ['viscosity-units', {}, { cP: 68 * 0.88, sus40: 68 * 4.632, sus100: 68 * 4.664 }],
  ['viscosity-units', { unit: 'reyn', val: 1e-5, sg: 1 }, { cP: 68.95 }, 1e-9],
  ['buttress-thread', { D: 2, p: 0.1, G: 0 }, { H: 0.089064, En: 1.94, Kn: 1.88, Dn: 2.012542, Ks: 2 - 0.132542 }],
  ['three-wire-taper-buttress', {}, { M: 3.495 * 25.4 }, 0.0005 * 25.4], // handbook: 3-in. pipe thread gauge, 3.495 in.
  ['three-wire-taper-buttress', { Mm: 3.495 * 25.4 }, { E2: 3.3885 * 25.4 }, 0.0005 * 25.4], // and back to 3.3885 in.
  ['three-wire-taper-buttress', { mode: 'buttress', E: 10, P: 1, W: 0.5, A: 45, a: 0 }, { M: 10 - 1 + 0.5 * 3.4142, wire: 0.586 }, 0.0005], // handbook 45° buttress formula (3)
  ['three-wire-taper-buttress', { mode: 'buttress', E: 10, P: 1, W: 0.6, A: 50, a: 5 }, { M: 10 - 0.91955 + 0.6 * 3.2235, wire: 0.606 }, 0.0005], // handbook formula (4)
  ['multi-start-threading', { P: 0.0625 * 25.4 }, { lead: 0.1875 * 25.4, spacing: 120 }], // handbook: triple start, 16 TPI → F0.1875
  ['shear-spinning', {}, { T: 4, Ft: 300 * 2 * 0.5 }],
  ['machine-positioning-accuracy', { nt: 1 }, { mean1: 0.0004 * 25400, acc: 6 * Math.sqrt(0.00000066 / 4) * 25400 }, 1e-6], // handbook example: X̄ = 0.0004 in.
  ['acme-tap-drill', {}, { min: 0.4, max: 0.405 }, 1e-12], // handbook ½-10 Acme 2G
  ['acme-tap-drill', { cls: 'C24' }, { min: 0.41, max: 0.415 }, 1e-12], // handbook 2C
  ['acme-tap-drill', { cls: 'C56' }, { min: 0.3923, max: 0.3973 }, 0.00005], // handbook 5C
  ['milling-cutter-teeth', {}, { T: 9.45 }], // handbook: about 10 teeth
  ['milling-cutter-teeth', { mode: 'periph', D: 101.6, d: 6.35 }, { T: 12.6 * 4 / 5 }, 1e-9], // handbook: about 10 teeth
  ['milling-cutter-teeth', { mode: 'power', d: 3.2, W: 152.4 }, { T: 14278 * 7.5 / (0.2032 * 272 * 3.2 * 152.4) }],
  ['angular-cutter-setting', {}, { A: 21 + 52 / 60, D: 47 + 34 / 60 }, 0.02], // handbook: 21° 52′
  ['angular-cutter-setting', { B: 0 }, { A: Math.acos(Math.tan(40 * Math.PI / 180) / Math.tan(55 * Math.PI / 180)) * 180 / Math.PI }, 1e-9], // 0° blank: cos A = tan(360/N) cot C
];
for (const [id, over, expected, tol] of HB9_CASES) test(`handbook reference example: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('ninth handbook pass: verdicts and tables', () => {
  assert.equal(engine.run('angular-cutter-setting').values.Atext, '21° 52.2′');
  assert.equal(engine.run('machine-positioning-accuracy').table.rows.length, 3);
  assert.equal(engine.run('machine-positioning-accuracy', { req: 40 }).text, 'OUTSIDE REQUIRED ACCURACY');
  assert.equal(engine.run('spade-drill-power', { avail: 2 }).text, 'EXCEEDS MACHINE POWER');
  assert.equal(engine.run('multi-start-threading', { rpm: 2000 }).text, 'SPEED EXCEEDS AXIS LIMIT');
});

test('ninth handbook pass rejects impossible inputs', () => {
  const cases: Array<[string, Inputs]> = [
    ['forming-tool-depth', { mode: 'rake', r: 20 }], ['forming-tool-depth', { mode: 'rake', F: 0 }], ['forming-tool-depth', { mode: 'circular', off: 40 }], ['true-stress-strain', { l: 40 }],
    ['buttress-thread', { D: 5, p: 10 }], ['acme-tap-drill', { D: 0.1, tpi: 1 }], ['milling-cutter-teeth', { W: 200 }], ['angular-cutter-setting', { Nt: 5, C: 20, B: 0 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});
