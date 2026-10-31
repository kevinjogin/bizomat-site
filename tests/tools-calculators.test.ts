import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

// KEVOS® WORKOS: tool register, guides, calculations, decision rules, sensitivity analysis and decision reports.
// The browser scripts in public/tools/ are loaded into a VM with a minimal document so they run unchanged.

const DIR = join(process.cwd(), 'public', 'tools');
const FILES = ['decide', 'money', 'projects', 'operations', 'manufacturing', 'engineering', 'quoting', 'inventory', 'improvement', 'planning', 'business', 'makeos', 'workshop', 'handbook3', 'handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8', 'handbook9', 'handbook10', 'handbook11', 'handbook12', 'handbook13', 'handbook14', 'handbook15', 'handbook16', 'handbook17', 'handbook18', 'handbook19', 'handbook20', 'handbook21', 'handbook22', 'handbook23', 'handbook24', 'handbook25', 'handbook26', 'handbook27', 'handbook28', 'handbook29', 'handbook30', 'handbook31', 'handbook32', 'handbook33', 'handbook34', 'handbook35', 'handbook36', 'handbook37', 'handbook38', 'handbook39', 'handbook40', 'handbook41', 'handbook42', 'handbook43', 'handbook44', 'handbook45', 'handbook46', 'handbook47', 'handbook48', 'handbook49', 'handbook50', 'handbook51', 'handbook52', 'handbook53', 'handbook54', 'handbook55', 'handbook56', 'handbook57', 'handbook58', 'handbook59', 'handbook60', 'handbook61', 'handbook62', 'handbook63', 'handbook64', 'handbook65', 'handbook66', 'handbook67', 'handbook68', 'handbook69', 'polymers', 'bryanthermo', 'handbook72', 'callen', 'handbook71', 'handbook73', 'handbook74', 'cengel2', 'handbook75', 'greiner', 'handbook77', 'handbook70', 'handbook76', 'handbook78', 'handbook80', 'handbook81', 'handbook82', 'handbook83', 'handbook84', 'handbook85', 'handbook86', 'handbook87', 'handbook88', 'handbook89'];
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

test('the tools page loads its engine up front and each tool\'s data, guide, inputs and calc files on demand', () => {
  const page = readFileSync(join(process.cwd(), 'src', 'pages', 'tools', 'index.astro'), 'utf8');
  // The file list lives in the shared loader used by the tools page and the tool pages.
  const loader = readFileSync(join(process.cwd(), 'src', 'utils', 'workos-tools.ts'), 'utf8');
  const listed = /export const TOOL_FILES = \[([^\]]+)\]/.exec(loader)?.[1].match(/'([a-z0-9]+)'/g)?.map((s) => s.slice(1, -1));
  assert.deepEqual(listed, FILES);
  for (const kind of ['data', 'guides', 'inputs', 'calc']) {
    const onDisk = readdirSync(DIR).filter((n) => n.startsWith(`${kind}-`)).map((n) => n.slice(kind.length + 1, -3)).sort();
    assert.deepEqual(onDisk, [...FILES].sort(), `${kind}-*.js files match the page list`);
  }
  for (let i = 1; i <= 7; i++) assert.ok(!existsSync(join(DIR, `data-${i}.js`)) && !existsSync(join(DIR, `calc-${i}.js`)), `old bundle ${i} removed`);
  // The page loads only the engine; ui.js fetches data-, guides-, inputs- and calc-<file>.js for the tool that opens.
  const order = ['id="workos-tool-files"', '/tools/core.js', '/tools/input-guides.js', '/tools/ui.js'].map((s) => page.indexOf(s));
  assert.ok(order.every((p) => p > 0), 'the file map and engine scripts are on the page');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'map, core, input guides, then ui');
  assert.doesNotMatch(page, /\/tools\/(data|guides|inputs|calc)-\$\{f\}\.js/, 'tool files are not all loaded up front');
  assert.match(page, /set:html=\{JSON\.stringify\(fileOf\)\}/, 'the map comes from the shared loader');
  const ui = read('ui.js');
  for (const kind of ['data', 'guides', 'inputs', 'calc']) assert.ok(ui.includes(`'${kind}'`), `ui.js loads ${kind}-<file>.js`);
  assert.match(page, /<ToolCard id=\{t\.id\} href=\{cardHref\(t\.id\)\}/, 'directory cards are rendered at build time and link to their tool');
  assert.match(readFileSync(join(process.cwd(), 'src', 'components', 'library', 'ToolCard.astro'), 'utf8'), /<a class="lib-card" href=\{href\}[^>]*data-tool-id=\{id\}/, 'cards carry the id ui.js opens');
  // A tool's own page where its guide stands alone, otherwise the calculator itself.
  assert.match(page, /hasStandaloneGuide\(guides\[id\]\) \? toolPageHref\(id\) : toolAppHref\(id\)/);
});

test('register: 981 tools with unique ids and every previously published id kept', () => {
  const ids = engine.tools.map((t) => t.id);
  assert.equal(ids.length, 981);
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

const HB_FILES = ['handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8', 'handbook9', 'handbook10', 'handbook11', 'handbook12', 'handbook13', 'handbook14', 'handbook15', 'handbook16', 'handbook17', 'handbook18', 'handbook19', 'handbook20', 'handbook21', 'handbook22', 'handbook23', 'handbook24', 'handbook25', 'handbook26', 'handbook27', 'handbook28', 'handbook29', 'handbook30', 'handbook31', 'handbook32', 'handbook33', 'handbook34', 'handbook35', 'handbook36', 'handbook37', 'handbook38', 'handbook39', 'handbook40', 'handbook41', 'handbook42', 'handbook43', 'handbook44', 'handbook45', 'handbook46', 'handbook47', 'handbook48', 'handbook49', 'handbook50', 'handbook51', 'handbook52', 'handbook53', 'handbook54', 'handbook55', 'handbook56', 'handbook57', 'handbook58', 'handbook59', 'handbook60', 'handbook61', 'handbook62', 'handbook63', 'handbook64', 'handbook65', 'handbook66', 'handbook67', 'handbook68', 'handbook74', 'handbook75', 'handbook77', 'handbook78', 'handbook82', 'handbook83', 'handbook84', 'handbook85', 'handbook86', 'handbook87', 'handbook88', 'handbook89'];
const hbIds = () => {
  const sandbox: any = createContext({ window: {} });
  for (const f of HB_FILES) runInContext(read(`data-${f}.js`), sandbox);
  return sandbox.window.GOCORE_TOOLS.map((t: any) => t.id) as string[];
};

test('handbook batches: 787 MAKEOS tools, each with bounds, a worked example and a handbook reference', () => {
  const ids = hbIds();
  assert.equal(ids.length, 787);
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

// Tenth handbook pass (handbook26): integrated design checks, cross-checked against the single-purpose tools they chain.
const HB10_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['spur-gear-set-design', {}, { d1: 60, a: 120, Ft: 2 * (7500 / (2 * Math.PI * 1450 / 60)) * 1000 / 60, Kv: (6.1 + Math.PI * 60 * 1450 / 60000) / 6.1 }],
  ['spur-gear-set-design', {}, { eps: (Math.sqrt(33 ** 2 - (30 * Math.cos(Math.PI / 9)) ** 2) + Math.sqrt(93 ** 2 - (90 * Math.cos(Math.PI / 9)) ** 2) - 120 * Math.sin(Math.PI / 9)) / (Math.PI * 3 * Math.cos(Math.PI / 9)) }],
  ['compression-spring-designer', {}, { k: 10, L0: 70 }],
  ['shrink-fit-design', {}, { p: 2 * 20000 / (Math.PI * 50 * 60 * 0.15), Fpress: 40000 }],
  ['bolted-joint-design-check', {}, { At: Math.PI / 4 * (12 - 0.938194 * 1.75) ** 2 }],
  ['turning-cost-per-part', {}, { N: 200000 / (Math.PI * 60), T: 16, Vmc: 400 / 15 ** 0.25, Vmp: 400 / 3 ** 0.25 }],
  ['press-die-tonnage', {}, { Fb: 280, Fp: 4 * Math.PI * 10 * 2 * 350 / 1000, req: (280 + 4 * Math.PI * 7) * 1.1 * 1.2 }],
  ['press-die-tonnage', { bendL: 100, W: 16, blank: 0, holes: 0 }, { Fbend: 100 * 4 * 450 / 16 / 1000 }], // handbook formula 36
  ['hydraulic-cylinder-sizing', {}, { Dmin: Math.sqrt(4 * 50000 / (Math.PI * 16)), dRod: (64 * 3.5 * 50000 * 2000 ** 2 / (Math.PI ** 3 * 206000)) ** 0.25 }],
  ['shaft-design-check', {}, { dS: Math.cbrt(16 / (Math.PI * 30) * Math.hypot(225000, 15000 / (2 * Math.PI * 1450 / 60) * 1000)) }],
  ['milling-cut-planner', {}, { n: 180000 / (Math.PI * 50), fz: 0.125, vf: 0.125 * 4 * 180000 / (Math.PI * 50) }],
];
for (const [id, over, expected, tol] of HB10_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('design checks agree with the single-purpose tools they chain', () => {
  const g = engine.run('spur-gear-set-design').values, gc = engine.run('gear-contact-stress', { Ft: g.Ft, d1: 60, b: 30, u: 3, alpha: 20, E: 206, nu: 0.3, K: 1.25 * g.Kv * 1.3 }).values;
  near(g.sH, gc.sH, 1e-6, 'contact stress matches gear-contact-stress');
  const sp = engine.run('compression-spring-designer').values; // the designed spring re-analysed by the spring calculator
  const chk = engine.run('compression-spring', { d: sp.d, D: 20, Na: sp.Na, ends: 'cg', G: 79.3, L0: sp.L0, Lw: 45, allow: 550 }).values;
  near(chk.k, 10, 1e-6, 'designed rate'); near(chk.F, 250, 1e-4, 'load at the second point'); near(chk.tau, 550, 1e-4, 'stress at the second point');
  const sf = engine.run('shrink-fit-design').values, pf = engine.run('press-fit', { d: 50, D: 100, di: 0, delta: sf.delta, L: 60, mu: 0.15, Eh: 206, nuh: 0.3, Es: 206, nus: 0.3 }).values;
  near(pf.p, sf.p, 1e-6, 'press-fit gives back the design pressure');
  const tc = engine.run('turning-cost-per-part').values, tl = engine.run('taylor-tool-life', { mode: 'nc', n: 0.25, C: 400, V: 200, rate: 90, edge: 6, tc: 1 }).values;
  near(tc.Vmc, tl.Vc, 1e-9, 'minimum-cost speed matches the Taylor tool');
  const bj = engine.run('bolted-joint-design-check').values, bj0 = engine.run('bolted-joint', { d: 12, P: 1.75, grip: 30, Lt: 10, Eb: 207, kmMode: 'frustum', Em: 207 }).values;
  near(bj.C, bj0.C, 1e-12, 'joint constant matches the bolted-joint tool');
  const mp = engine.run('milling-cut-planner').values; near(mp.hm, 0.1 * 50 / 40 * 10 / (50 * Math.acos(0.6) / 2), 1e-12, 'average chip thickness');
});

test('design checks: verdicts and guards', () => {
  assert.equal(engine.run('spur-gear-set-design').text, 'GEAR SET ADEQUATE');
  assert.equal(engine.run('spur-gear-set-design', { b: 15 }).text, 'GEAR SET NOT ADEQUATE');
  assert.equal(engine.run('bolted-joint-design-check').text, 'JOINT DESIGN ADEQUATE');
  assert.equal(engine.run('bolted-joint-design-check', { pct: 75, sc: 25 }).text, 'JOINT DESIGN NOT ADEQUATE'); // highest preload reaches proof
  assert.equal(engine.run('press-die-tonnage', { cap: 400 }).text, 'PRESS TOO SMALL');
  assert.equal(engine.run('hydraulic-cylinder-sizing', { bore: 64 }).text, 'CHOOSE A LARGER BORE');
  assert.equal(engine.run('milling-cut-planner', { Pmax: 2 }).text, 'EXCEEDS SPINDLE POWER');
  assert.equal(engine.run('shaft-design-check').values.governs, 'Twist');
  assert.equal(engine.run('turning-cost-per-part').table.rows.length, 3);
  const cases: Array<[string, Inputs]> = [['compression-spring-designer', { L2: 70 }], ['compression-spring-designer', { F2: 50 }], ['shrink-fit-design', { D: 40 }], ['bolted-joint-design-check', { Lt: 40 }], ['press-die-tonnage', { blank: 0, holes: 0 }], ['hydraulic-cylinder-sizing', { bore: 50 }], ['milling-cut-planner', { ae: 60 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Eleventh handbook pass (handbook27): second round of integrated design checks, cross-checked against existing tools.
const HB11_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['ballscrew-axis-sizing', {}, { ns: 3000, Ff: 500 + 0.01 * 200 * 9.80665, Tc: (500 + 0.01 * 200 * 9.80665) * 0.01 / (2 * Math.PI * 0.9) }],
  ['v-belt-drive-design', {}, { d2: 312.5, n2: 580, eR: Math.exp(0.3 / Math.sin(19 * Math.PI / 180) * (Math.PI - 2 * Math.asin(187.5 / 1000))) }],
  ['roller-chain-drive-design', {}, { D1: 15.875 / Math.sin(Math.PI / 19), links: 120, chord: (1 - Math.cos(Math.PI / 19)) * 100 }],
  ['bearing-selection-check', {}, { P: 0.56 * 4 + 1.6 * 1.5, s0: 45 / 4 }],
  ['bearing-selection-check', { rel: 99, basis: 'abma' }, { a1: 0.2088 }, 0.0005], // handbook (ANSI/ABMA) a1 = 0.21 at 99%
  ['bearing-selection-check', { rel: 99 }, { a1: 0.95 * 0.2088 + 0.05 }, 0.0005], // ISO 281:2007 a1 = 0.25 at 99%
  ['bearing-selection-check', { rel: 95, basis: 'abma' }, { a1: 0.62 }, 0.002], // handbook a1 = 0.62 at 95%
  ['fillet-weld-joint-design', {}, { legReq: 2.5 / Math.SQRT1_2, leg: 5, mass: 12.5 * 1.1 * 200 * 7850 * 1e-9 }],
  ['cam-follower-design', {}, { vmax: 2 * 20 / (2 * Math.PI / 3) * (2 * Math.PI * 600 / 60) / 1000, amax: 2 * Math.PI * 20 / (2 * Math.PI / 3) ** 2 * (20 * Math.PI) ** 2 / 1000 }, 1e-6],
  ['clutch-engagement-design', {}, { Treq: 2 * 2 * Math.PI * 1000 / 60 + 20, F: 4 * 1.5 * (2 * 2 * Math.PI * 1000 / 60 + 20) * 1000 / (0.3 * 2 * 320) }],
  ['screw-jack-design', {}, { d2: 36.5, d3: 33 }],
  ['pump-system-design', {}, { vel: 0.005 / (Math.PI * 0.05 ** 2 / 4), H: 15 + 13.936457306772665 }, 1e-6],
];
for (const [id, over, expected, tol] of HB11_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('second-round design checks agree with the tools they chain', () => {
  const bs = engine.run('ballscrew-axis-sizing').values, bl = engine.run('ballscrew-limits', { dr: 20, L: 1000, ends: 'fs', E: 206, rho: 7850, rpm: 3000, Fa: 1000, speedPct: 80, loadPct: 50 }).values;
  near(bs.nc, bl.nc, 1e-9, 'critical speed'); near(bs.Pcr, bl.Pcr, 1e-6, 'buckling load');
  const ch = engine.run('roller-chain-drive-design').values, cl = engine.run('chain-length', { p: 15.875, z1: 19, z2: 57, C: ch.C, rpm: 300 }).values;
  assert.equal(cl.Leven, 120); near(cl.Cexact, ch.C, 1e-6, 'centre distance for 120 links');
  const cam = engine.run('cam-follower-design', { rpm: 300, beta: 90 }).values, cp = engine.run('cam-pressure-angle', { law: 'cyc', h: 20, beta: 90, Rb: 40, Rr: 10 }).values;
  near(cam.pa, cp.phi, 0.05, 'maximum pressure angle');
  const sj = engine.run('screw-jack-design').values, ps = engine.run('power-screw-torque', { F: 20000, dm: 36.5, lead: 7, flank: 15, mu: 0.12, dc: 50, muc: 0.12 }).values;
  near(sj.Tr, ps.Tr, 1e-6, 'raising torque'); near(sj.Tl, ps.Tl, 1e-6, 'lowering torque');
  const pu = engine.run('pump-system-design').values, pf = engine.run('pipe-friction', { Q: 300, d: 50, L: 80, nu: 1, rho: 1000, eps: 0.045, K: 8 }).values;
  near(pu.hf, pf.head, 1e-6, 'friction head'); near(pu.f, pf.f, 1e-6, 'friction factor');
  const cg = engine.run('clutch-engagement-design').values, ct = engine.run('clutch-torque', { Do: 200, Di: 120, surfaces: 2, mu: 0.3, F: cg.F, Treq: 1 }).values;
  near(ct.Tw, cg.Td, 1e-6, 'clutch capacity equals the design torque');
  const br = engine.run('bearing-selection-check').values, ba = engine.run('bearing-life-adjusted', { type: 'ball', C: 70, Fr: 4, Fa: 1.5, X: 0.56, Y: 1.6, rpm: 1500, rel: 95, aiso: 1, req: 20000 }).values;
  near(br.Lh, ba.Lnm, ba.Lnm * 0.005, 'adjusted life matches the ISO 281:2007 table within its rounding');
});

test('second-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('ballscrew-axis-sizing', { Ls: 2500 }).text, 'AXIS LIMIT EXCEEDED');
  assert.equal(engine.run('roller-chain-drive-design', { Pr: 6 }).text, 'CHAIN UNDERSIZED');
  assert.equal(engine.run('bearing-selection-check', { C: 30 }).text, 'BEARING NOT SUITABLE');
  assert.equal(engine.run('cam-follower-design', { F0: 50 }).text, 'CAM DESIGN NOT ADEQUATE');
  assert.equal(engine.run('clutch-engagement-design', { pall: 0.3 }).text, 'LINING OVERLOADED');
  assert.equal(engine.run('screw-jack-design', { mu: 0.03 }).text, 'SCREW DESIGN NOT ADEQUATE'); // no longer self-locking
  assert.equal(engine.run('pump-system-design', { zs: -6 }).text, 'CAVITATION RISK');
  const cases: Array<[string, Inputs]> = [['v-belt-drive-design', { C: 50 }], ['bearing-selection-check', { Fr: 0, Fa: 0 }], ['clutch-engagement-design', { Di: 250 }], ['screw-jack-design', { p: 45 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twelfth handbook pass (handbook28): third round of integrated design checks.
const HB12_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['conveyor-drive-sizing', {}, { qL: 100 / 5.4, Te: 0.025 * 9.80665 * 50 * (100 / 5.4 + 30) + 100 / 5.4 * 9.80665 * 5 }],
  ['fixture-clamp-force', {}, { Fcl: 2 * 2000 / 0.3 + 600, Fs: (2 * 2000 / 0.3 + 600) / 2 * 2 }],
  ['fixture-clamp-force', { mode: 'stop' }, { Fcl: 600 }],
  ['lifting-beam-design', {}, { M: 5000 * 9.80665 * 1.25 * 3000 / 4, defl: 5000 * 9.80665 * 1.25 * 3000 ** 3 / (48 * 206000 * 2e7) }],
  ['lifting-beam-design', { type: 'spreader' }, { Ts: 5000 * 9.80665 * 1.25 / (2 * Math.cos(Math.PI / 6)), C: 5000 * 9.80665 * 1.25 / 2 * Math.tan(Math.PI / 6) }],
  ['beam-sizing', {}, { M: 5 * 3000 ** 2 / 8 + 10000 * 3000 / 4, Ireq: (5 * 5 * 3000 ** 4 / (384 * 206000) + 10000 * 3000 ** 3 / (48 * 206000)) / (3000 / 360) }, 1e-3],
  ['beam-sizing', { sup: 'cant', P: 0 }, { M: 5 * 3000 ** 2 / 2, Ireq: 5 * 3000 ** 4 / (8 * 206000) / (3000 / 360) }],
  ['beam-sizing', { sup: 'fixed' }, { M: 5 * 3000 ** 2 / 12 + 10000 * 3000 / 8 }],
  ['vibration-isolator-selection', { zeta: 0 }, { r: Math.sqrt(11), delta: 9806.65 / (2 * Math.PI * 25 / Math.sqrt(11)) ** 2 }, 1e-6], // undamped: T = 1/(r² − 1)
  ['motor-gearbox-selection', {}, { nm: 1455, i: 9.7, Prated: 5.5 }],
];
for (const [id, over, expected, tol] of HB12_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('third-round design checks agree with the tools they chain', () => {
  const kh = engine.run('keyed-hub-design').values, ks = engine.run('key-stress', { T: kh.T, d: 40, w: 12, h: 8, L: 60, tauA: 60, sigA: 100 }).values;
  near(kh.Ls, ks.Ls, 1e-9, 'key shear length'); near(kh.Lc, ks.Lc, 1e-9, 'key crushing length');
  const bb = engine.run('band-brake-stop-design').values, bk = engine.run('band-brake', { T: bb.Td, D: 400, wrap: 270, mu: 0.3, a: 600, b: 60, w: 60 }).values;
  near(bb.T1, bk.T1, 1e-9, 'tight tension'); near(bb.Fl, bk.Fl, 1e-9, 'lever force'); near(bb.p, bk.p, 1e-12, 'lining pressure');
  const ca = engine.run('compressed-air-system-sizing').values;
  near(ca.V, engine.run('air-receiver', { deficit: 2, t: 1, p1: 8, p2: 6.5, Vactual: 0 }).values.V, 1e-12, 'receiver volume');
  near(ca.shaft, engine.run('compressor-power', { Q: ca.Qc, p2: 8, p1: 1.01325, stages: 1, k: 1.4, eff: 75 }).values.shaft, 1e-9, 'compressor shaft power');
  near(engine.run('air-pipe-drop', { Q: ca.Qc, d: ca.dReq, L: 100, p: 7, T: 25, eps: 0.045 }).values.dp, 0.1, 1e-6, 'main bore gives the allowed drop');
  const mg = engine.run('motor-gearbox-selection').values, ri = engine.run('reflected-inertia', { JL: 2, Jm: 0.04, i: mg.i, eff: 94, nL: 150, t: 0.5, TL: 200 }).values;
  near(mg.Tstart, ri.Tm, 1e-9, 'starting torque equals the reflected-inertia peak torque');
  const vi = engine.run('vibration-isolator-selection').values, r = vi.r, z = 0.05;
  near(Math.sqrt((1 + (2 * z * r) ** 2) / ((1 - r * r) ** 2 + (2 * z * r) ** 2)), 0.1, 1e-9, 'transmissibility at the design ratio');
});

test('third-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('keyed-hub-design', { hubL: 15 }).text, 'KEYED JOINT NOT ADEQUATE');
  assert.ok(engine.run('keyed-hub-design', { nk: '2' }).values.Lreq < engine.run('keyed-hub-design').values.Lreq);
  assert.equal(engine.run('band-brake-stop-design', { t: 0.1 }).text, 'BRAKE TOO WEAK'); // lever force needed exceeds the 300 N available
  assert.equal(engine.run('fixture-clamp-force', { d: 6, P: 1 }).text, 'CLAMP SCREW OVERLOADED');
  assert.equal(engine.run('lifting-beam-design', { Z: 200000 }).text, 'BEAM OVERSTRESSED');
  assert.equal(engine.run('lifting-beam-design', { type: 'spreader', I: 100000 }).text, 'SPREADER NOT ADEQUATE');
  assert.equal(engine.run('beam-sizing', { Zc: 100000, Ic: 5e6 }).text, 'SECTION TOO SMALL');
  assert.equal(engine.run('beam-sizing', { Zc: 100000, Ic: 8e6 }).text, 'SECTION ADEQUATE');
  assert.equal(engine.run('vibration-isolator-selection', { k: 260 }).text, 'MOUNTS ISOLATE');
  assert.equal(engine.run('vibration-isolator-selection', { k: 20000 }).text, 'MOUNTS AMPLIFY');
  assert.equal(engine.run('motor-gearbox-selection', { JL: 200 }).text, 'STARTING TORQUE TOO LOW');
  const cases: Array<[string, Inputs]> = [['band-brake-stop-design', { dir: 'resist', TL: 5000 }], ['conveyor-drive-sizing', { Hl: -50 }], ['beam-sizing', { a: 4000 }], ['compressed-air-system-sizing', { p2: 9 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirteenth handbook pass (handbook29): fourth round of integrated design checks.
const HB13_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['gear-train-ratio-planner', {}, { ratio: 23.5, err: 0 }, 1e-9], // 17/94 × 20/85
  ['gear-train-ratio-planner', { stages: '1', R: 3.5 }, { ratio: 3.5, err: 0 }, 1e-9],
  ['gearbox-heat-balance', {}, { loss: 1200, Teq: 70, Plim: 15 * 2 * 50 / 0.08 / 1000 }, 1e-6],
  ['gearbox-heat-balance', { A: 1.5 }, { duty: 1200 - 15 * 1.5 * 50, flow: (1200 - 1125) / (870 * 1900 * 5) * 60000 }, 1e-9],
  ['tool-deflection-cut-limit', {}, { Ft: 2 * 10 * 0.05 * 4 * 2000 / (Math.PI * 10) }],
  ['sheet-metal-part-cost', {}, { flat: 180 - 2 * (2 * 4 * Math.tan(Math.PI / 4) - Math.PI / 2 * (2 + 0.8)), F: 1.33 * 100 * 4 * 450 / 16 }],
  ['tapped-hole-design', {}, { drill: 10 - 0.01299 * 75 * 1.5 }],
  ['pneumatic-cylinder-sizing', {}, { bore: 50, minBore: Math.sqrt(4 * 600 / (Math.PI * 0.6 * 0.7)), KE: 0.45 }],
  ['disc-spring-stack-design', {}, { ns: 3, np: 3, s: 1, L0: 3 * (1.4 + 3 * 2), Ls: 18 }],
  ['drilling-cycle-planner', {}, { n: 8000 / Math.PI, pecks: 0 }],
  ['drilling-cycle-planner', { peck: 8 }, { pecks: 3 }],
  ['hydraulic-motor-drive', {}, { Tm: 2000 / (4 * 0.95), nm: 160, Vreq: 20 * Math.PI * 2000 / (4 * 0.95) / (180 * 0.92) }],
];
for (const [id, over, expected, tol] of HB13_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('fourth-round design checks agree with the tools they chain', () => {
  const gt = engine.run('gear-train-ratio-planner'); assert.equal(gt.values.train, '17/94 × 20/85'); assert.equal(gt.table.rows.length, 5);
  const td = engine.run('tool-deflection-cut-limit', { type: 'bore', D: 20, L: 100, k: 1, E: 210, ratio: 0, kc: 2000, f: 0.1, ab: 1 }).values;
  near(td.delta, engine.run('boring-bar-deflection', { D: 20, L: 100, E: 210, F: 200, allow: 0.05 }).values.defl, 1e-12, 'deflection matches the boring-bar tool');
  const sm = engine.run('sheet-metal-part-cost', { c: 0 }).values;
  near(sm.flat, engine.run('bend-allowance', { thickness: 2, radius: 2, angle: 90, k: 0.4, a: 50, b: 80 }).values.flat, 1e-9, 'single-bend flat length');
  near(sm.F, engine.run('press-brake-force', { L: 100, t: 2, uts: 450, V: 16, k: 1.33, cap: 1000 }).values.F, 1e-9, 'bending force');
  const th = engine.run('tapped-hole-design').values;
  near(th.drill, engine.run('tap-drill', { system: 'metric', D: 10, pitch: 1.5, pct: 75, tap: 'cut' }).values.drill, 1e-12, 'tap drill');
  near(th.Lreq, engine.run('thread-engagement', { d: 10, P: 1.5, Knmax: 0, Esmin: 0, Dsmin: 0, Enmax: 0, Sub: 800, Sun: 310 }).values.Lreq, 1e-9, 'engagement length');
  const pc = engine.run('pneumatic-cylinder-sizing').values;
  near(pc.minBore, engine.run('pneumatic-cylinder-force', { bore: 50, rod: 20, p: 6, eff: 90, load: 600, ratio: 70 }).values.minBore, 1e-9, 'minimum bore');
  near(pc.Lpm, engine.run('pneumatic-consumption', { bore: 50, rod: 20, stroke: 100, pressure: 6, ambient: 1.01325, reference: 1.01325, temperature: 20, refTemp: 20, cycles: 10 }).values.demand, 1e-9, 'air consumption');
  const ds = engine.run('disc-spring-stack-design').values, d1 = engine.run('disc-spring', { De: 50, Di: 25.4, t: 2, h0: 1.4, E: 206, nu: 0.3, s: 1, ns: 3, np: 3 }).values;
  near(ds.F1, d1.F, 1e-9, 'force per disc'); near(ds.sI, d1.sI, 1e-9, 'inner edge stress');
  const dc = engine.run('drilling-cycle-planner', { pos: 0 }).values, dp = engine.run('drilling-power', { D: 10, vc: 80, f: 0.15, kc: 2000, point: 118, eta: 80, Pavail: 7.5 }).values;
  near(dc.thrust, dp.thrust, 1e-9, 'thrust'); near(dc.Tq, dp.T, 1e-9, 'torque');
  near(dc.total, engine.run('drilling-time', { rpm: dc.n, feed: 0.15, diameter: 10, thickness: 30, angle: 118, extra: 2, holes: 20 }).values.minutes, 1e-9, 'feed time for all holes');
  const hm = engine.run('hydraulic-motor-drive').values, hy = engine.run('hydraulic-motor', { Vd: hm.V, dp: hm.dpNeed, Q: hm.Q, ev: 95, em: 92 }).values;
  near(hy.T, hm.Tm, 1e-9, 'motor torque'); near(hy.n, hm.nm, 1e-9, 'motor speed');
});

test('fourth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('gearbox-heat-balance', { A: 1.5 }).text, 'COOLER REQUIRED');
  assert.equal(engine.run('tool-deflection-cut-limit').text, 'DEFLECTION TOO LARGE');
  assert.equal(engine.run('tool-deflection-cut-limit', { ap: 3.9 }).text, 'DEFLECTION WITHIN ALLOWANCE');
  assert.equal(engine.run('disc-spring-stack-design', { allow: 1800 }).text, 'DISCS OVERSTRESSED');
  assert.equal(engine.run('drilling-cycle-planner', { Tlim: 500 }).text, 'LIMIT EXCEEDED');
  assert.equal(engine.run('hydraulic-motor-drive', { Vc: 150 }).text, 'MOTOR TOO SMALL');
  assert.equal(engine.run('pneumatic-cylinder-sizing', { mass: 20 }).checks[0].status, 'fail');
  const cases: Array<[string, Inputs]> = [['gear-train-ratio-planner', { stages: '1', R: 10 }], ['gearbox-heat-balance', { Tmax: 20 }], ['sheet-metal-part-cost', { a: 3 }], ['sheet-metal-part-cost', { Ls: 100, Ws: 50 }], ['pneumatic-cylinder-sizing', { rod: 60 }], ['tool-deflection-cut-limit', { ae: 20 }], ['tapped-hole-design', { P: 8, D: 5 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fourteenth handbook pass (handbook30): fifth round of integrated design checks.
const HB14_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['chuck-grip-force', {}, { Fc: 1800, Fdyn: 2 * Math.hypot(1800, 900) / 0.1, Fcf: 3 * 1.5 * 0.08 * (50 * Math.PI) ** 2 }],
  ['rotary-index-table-sizing', {}, { J: 0.5 * 80 * 0.09 + 6 * 10 * 0.0625, wmax: 2 * (Math.PI / 3) / 0.6, al: 2 * Math.PI * (Math.PI / 3) / 0.36, hold: 1000 }],
  ['rotary-index-table-sizing', { law: 'trap' }, { wmax: 1.5 * (Math.PI / 3) / 0.6, al: 4.5 * (Math.PI / 3) / 0.36 }],
  ['rack-pinion-axis-sizing', {}, { Frun: 300 * 9.80665 * 0.05 + 200, Facc: 300 * 9.80665 * 0.05 + 200 + 300 * 5, d: 60 }],
  ['rack-pinion-axis-sizing', { incl: 90, mu: 0 }, { Frun: 300 * 9.80665 + 200 }],
  ['hoist-drive-sizing', {}, { vr: 32, nd: 32 / (Math.PI * 0.4), Td: 12632.252436629104 * 0.2 }, 1e-6],
  ['furnace-heat-treat-plan', {}, { Q: 600 * 0.6 * 830 / 3600, hours: 600 * 0.6 * 830 / 3600 / 36, E: 600 * 0.6 * 830 / 3600 / 0.6 + 6 }],
  ['crank-press-capacity', { hw: 6 }, { Favail: 1000 }, 1e-6], // at the rating point the press gives its rating
  ['pipe-expansion-loop', {}, { growth: 90, sig: 360, leg: Math.sqrt(3 * 200000 * 114.3 * 45 / 150) }],
  ['pipe-expansion-loop', { type: 'L' }, { delta: 90 }],
  ['gear-backlash-temperature', {}, { a: 80, dj: 2 * 80 * (23e-6 * 50 - 11.5e-6 * 70) * Math.tan(Math.PI / 9) }],
];
for (const [id, over, expected, tol] of HB14_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('fifth-round design checks agree with the tools they chain', () => {
  const cs = engine.run('coolant-system-sizing').values;
  near(cs.Qh, engine.run('coolant-flow-heat', { mode: 'flow', kW: 7, dT: 5, Q: 40, cp: 4.0, rho: 1000 }).values.Q, 1e-9, 'flow for heat');
  near(cs.Pp, engine.run('pump-shaft-power', { flow: cs.Q, head: 20, density: 1000, efficiency: 0.6 }).values.shaft, cs.Pp * 1e-3, 'pump power');
  const rp = engine.run('rack-pinion-axis-sizing').values;
  near(engine.run('rack-pinion', { m: 3, z: 20, rpm: rp.np, T: rp.Tp, eff: 97, vreq: 0 }).values.F, rp.Facc, 1e-9, 'pinion thrust');
  near(engine.run('lewis-bending', { Ft: rp.Facc, m: 3, b: 30, Y: 0.32, d: 60, rpm: rp.np, make: 'ground', allow: 200 }).values.sigma, rp.sigma, 1e-9, 'tooth bending stress');
  const hd = engine.run('hoist-drive-sizing').values, wr = engine.run('wire-rope-reeving', { mass: 5000, n: 4, eta: 98, mbl: 120, req: 5, D: 400, d: 14, ratioReq: 20 }).values;
  near(hd.F, wr.F, 1e-9, 'line pull'); near(hd.sf, wr.sf, 1e-9, 'rope safety factor');
  const fh = engine.run('furnace-heat-treat-plan').values;
  near(fh.hours, engine.run('heating-energy', { mass: 600, c: 0.6, T1: 20, T2: 850, P: 60, eff: 60, price: 0.25 }).values.hours, 1e-9, 'heat-up time');
  near(engine.run('pipe-expansion-loop').values.sig, Math.abs(engine.run('thermal-stress', { E: 200, alpha: 12, dT: 150, restraint: 100, A: 2000, Sy: 250 }).values.stress), 1e-9, 'restrained stress');
});

test('fifth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('chuck-grip-force', { rpm: 2500 }).text, 'GRIP INSUFFICIENT');
  assert.equal(engine.run('chuck-grip-force', { grip: 'id', rpm: 4000 }).text, 'GRIP ADEQUATE');
  assert.equal(engine.run('rack-pinion-axis-sizing', { b: 10 }).text, 'TEETH OVERSTRESSED');
  assert.equal(engine.run('hoist-drive-sizing', { mbl: 50 }).text, 'ROPE OR DRUM INADEQUATE');
  assert.equal(engine.run('crank-press-capacity').text, 'PRESS UNDERSIZED AT THIS HEIGHT');
  assert.equal(engine.run('crank-press-capacity', { hw: 6, dw: 6 }).text, 'PRESS CAN DO THE WORK');
  assert.equal(engine.run('gear-backlash-temperature', { ag: 90, ah: 11 }).text, 'GEARS MAY JAM');
  const cases: Array<[string, Inputs]> = [['rotary-index-table-sizing', { tc: 0.5 }], ['coolant-system-sizing', { Pc: 0, nz: 0 }], ['furnace-heat-treat-plan', { T1: 10 }], ['crank-press-capacity', { L: 50 }], ['crank-press-capacity', { hw: 200 }], ['pipe-expansion-loop', { wt: 60 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifteenth handbook pass (handbook31): sixth round of integrated design checks.
const HB15_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['pump-operating-point', {}, { Q: Math.sqrt(35 / (10 / 400 ** 2 + 15 / 300 ** 2)) }],
  ['fan-drive-sizing', {}, { Pair: 4, n2: 1200, p2: 1152, P2: 4 / 0.7 * 1.2 ** 3, df: 150 * 1450 / 1200 }],
  ['machine-foundation-block', {}, { depth: 15000 / (2400 * 6), qb: 20000 * 9.80665 / 6 / 1000, fn: Math.sqrt(30e6 * 6 / 20000) / (2 * Math.PI) }],
  ['measurement-temperature-error', {}, { dev: 500e-6 * (23 * 8 - 11.5 * 2), dTallow: 0.1 * 0.04 / (500e-6 * 11.5) }],
  ['measurement-temperature-error', { Tp: 20, Tg: 20 }, { dev: 0 }, 1e-15],
  ['pressure-vessel-thickness', {}, { tShell: 500 / (117.3 - 0.6) + 1.5, tEll: 1000 / (234.6 - 0.2) + 1.5, tTori: 0.885 * 1000 / (117.3 - 0.1) + 1.5, pt: 1.3 }],
  ['fixture-locating-error', {}, { c1: 0.03, rot: 0.06 / 600, zone: 2 * (0.015 + 150 * 0.0001) }, 1e-9],
  ['flange-bolt-load-check', {}, { H: Math.PI / 4 * 200 ** 2 * 2, Wm2: Math.PI * 8 * 200 * 69, Ab: 12 * Math.PI / 4 * (20 - 0.938194 * 2.5) ** 2 }],
  ['chain-conveyor-sizing', {}, { Tt: 60 * 9.80665 * (0.15 * 30 + 2) + 10 * 9.80665 * 0.15 * 30, PD: 38.1 / Math.sin(Math.PI / 12) }],
  ['travel-drive-sizing', {}, { Facc: 4400, Fadh: 0.15 * 20000 * 9.80665 / 2 }],
];
for (const [id, over, expected, tol] of HB15_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('sixth-round design checks agree with the tools they chain', () => {
  const po = engine.run('pump-operating-point').values; // the operating point lies on both curves
  near(50 - 10 / 400 ** 2 * po.Q ** 2, po.H, 1e-9, 'point lies on the pump curve');
  const sp = engine.run('pump-operating-point', { Qt: 250 }).values; // the speed found delivers the target flow on the system curve
  near(sp.s ** 2 * 50 - 10 / 400 ** 2 * 250 ** 2, 15 + 15 / 300 ** 2 * 250 ** 2, 1e-9, 'speed for target flow');
  const fd = engine.run('fan-drive-sizing').values, pa = engine.run('pump-affinity', { Q1: 5, H1: 800, P1: 4 / 0.7, n1: 1000, n2: 1200, D1: 200, D2: 200 }).values;
  near(fd.p2, pa.H2, 1e-9, 'fan pressure by the fan laws'); near(fd.P2, pa.P2, 1e-9, 'fan power by the fan laws');
  const mt = engine.run('measurement-temperature-error', { Tg: 20 }).values; // gauge at 20 °C: only the part grows
  near(mt.dev, engine.run('thermal-growth', { length: 500, alpha: 23, initial: 20, final: 28 }).values.growth, 1e-12, 'part growth matches thermal growth');
  const td = engine.run('travel-drive-sizing', { mub: 0, flange: 1 }).values;
  near(td.Frun, engine.run('rolling-resistance', { W: 20000 * 9.80665, r: 200, f: 0.5, v: 1, mu: 0.15 }).values.F, 1e-9, 'rolling resistance');
});

test('sixth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('pump-operating-point', { Hd: 70 }).text, 'AWAY FROM BEST EFFICIENCY'); // steep system curve: 57% of BEP flow
  assert.equal(engine.run('machine-foundation-block', { ks: 50 }).text, 'REVISE THE FOUNDATION');
  assert.equal(engine.run('measurement-temperature-error').text, 'CORRECT OR WAIT FOR TEMPERATURE');
  assert.equal(engine.run('measurement-temperature-error', { Tp: 20.5, Tg: 20.5 }).text, 'WITHIN TEMPERATURE ALLOWANCE');
  assert.equal(engine.run('fixture-locating-error').text, 'LOCATING ADEQUATE');
  assert.equal(engine.run('fixture-locating-error', { Lp: 100 }).text, 'LOCATING ERROR TOO LARGE');
  assert.equal(engine.run('flange-bolt-load-check', { nb: 8, d: 16, P: 2 }).text, 'BOLTING INADEQUATE');
  assert.equal(engine.run('chain-conveyor-sizing', { Wc: 2 }).text, 'CHAIN OVERLOADED');
  assert.equal(engine.run('travel-drive-sizing', { a: 1 }).text, 'DRIVEN WHEELS WILL SLIP');
  const cases: Array<[string, Inputs]> = [['pump-operating-point', { Hb: 60 }], ['pump-operating-point', { Hd: 10 }], ['pump-operating-point', { Hs: 60, Hd: 70 }], ['fixture-locating-error', { p1max: 10.01 }], ['travel-drive-sizing', { driven: 6 }], ['chain-conveyor-sizing', { Hl: -100 }], ['pressure-vessel-thickness', { p: 100, S: 50 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Sixteenth handbook pass (handbook32): seventh round of integrated design checks.
const HB16_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['bearing-fit-clearance', {}, { fit: 16, th: 12 * 5 * 70 / 1000, opMin: 25 - 16 - 4.2 }, 1e-9],
  ['overhung-load-check', {}, { OHL: 2 * (7500 / (2 * Math.PI * 100 / 60)) * 1000 / 200, Fallow: 10000 * 60 / 80, Fb: 2 * (7500 / (2 * Math.PI * 100 / 60)) * 1000 / 200 * 200 / 120 }],
  ['injection-moulding-estimate', {}, { F: 220 * 100 * 40 * 1.1 / 1000, shot: 130, tc: 6.25 / (Math.PI ** 2 * 0.09) * Math.log(4 / Math.PI * 190 / 50) }],
  ['press-brake-setup', {}, { V: 24, F: 1.33 * 1000 * 9 * 450 / 24, ri: 0.16 * 24 }],
  ['gearbox-selection-check', {}, { n2: 1450 / 14.5, Preq: 10.5, T2: 7500 * 0.94 / (2 * Math.PI * 100 / 60) }],
  ['riveted-joint-design', {}, { R: 2 * Math.PI * 17 ** 2 / 4 * 100, pBal: 17 + 2 * Math.PI * 17 ** 2 / 4 * 100 / 1500, p: 51 }],
  ['storage-tank-shell', {}, { t1: 4.9 * 20 * 11.7 / (160 * 0.85) + 1.5, cap: Math.PI * 100 * 12, nc: 6 }],
  ['milling-cost-per-part', {}, { Q: 45.84, tc: 120 / 45.84 }],
];
for (const [id, over, expected, tol] of HB16_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('seventh-round design checks agree with the tools they chain', () => {
  const bo = engine.run('bearing-friction-oil-flow').values;
  near(bo.Wb, engine.run('bearing-friction', { P: 5000, d: 50, mu: 0.0015, rpm: 1500, n: 2 }).values.W, 1e-9, 'bearing loss');
  near(bo.Q, engine.run('coolant-flow-heat', { mode: 'flow', kW: bo.heat / 1000, dT: 10, Q: 1, cp: 1.9, rho: 870 }).values.Q, 1e-9, 'oil flow');
  near(engine.run('press-brake-setup').values.F, engine.run('press-brake-force', { L: 1000, t: 3, uts: 450, V: 24, k: 1.33, cap: 1000 }).values.F, 1e-9, 'bending force');
  const rj = engine.run('riveted-joint-design').values, rt = engine.run('riveted-joint', { p: rj.p, d: 17, t: 10, rows: 2, shear: '1', st: 150, tau: 100, sc: 250 }).values;
  near(rj.eff, rt.eff, 1e-9, 'joint efficiency');
  const mc = engine.run('milling-cost-per-part').values; near(mc.cost, mc.mach + mc.toolT + mc.toolC + mc.set, 1e-12, 'cost adds up');
  assert.equal(engine.run('storage-tank-shell').table.rows.length, 6);
});

test('seventh-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('bearing-fit-clearance', { cmin: 10 }).text, 'PRELOAD RISK');
  assert.equal(engine.run('overhung-load-check', { La: 200 }).text, 'OVERHUNG LOAD TOO HIGH');
  assert.equal(engine.run('injection-moulding-estimate', { clamp: 500 }).text, 'MACHINE NOT SUITABLE');
  assert.equal(engine.run('press-brake-setup', { cap: 100 }).text, 'PRESS OR DIE OVERLOADED');
  assert.equal(engine.run('gearbox-selection-check', { Pth: 5 }).text, 'GEARBOX NOT SUITABLE');
  assert.equal(engine.run('riveted-joint-design', { F: 600 }).text, 'JOINT TOO WEAK');
  const cases: Array<[string, Inputs]> = [['bearing-fit-clearance', { cmax: 10 }], ['injection-moulding-estimate', { Te: 30 }], ['press-brake-setup', { t: 40 }], ['riveted-joint-design', { Lj: 20 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Seventeenth handbook pass (handbook33): eighth round of integrated design checks.
const HB17_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['spline-joint-design', {}, { D: 40, Dre: 37.3, sRoot: 16 * 500000 * 1.2 / (Math.PI * 37.3 ** 3), Lreq: Math.max(4 * 500000 * 1.2 / (40 * 20 * Math.PI * 200), 2 * 500000 * 1.2 / (9 * 40 * 20 * 2 * 20)) }],
  ['spline-joint-design', { kind: 'flexible' }, { Lc: 2 * 500000 * 1.2 / (40 * 20 * 2 * 20) }],
  ['ballscrew-axis-stiffness', {}, { ks: 4 * Math.PI * 27 ** 2 / 4 * 206 / 1000, k: 1 / (1000 / (Math.PI * 27 ** 2 * 206) + 1 / 600 + 1 / 1000), FpMin: 3000 / 2.83 }],
  ['tank-heater-sizing', {}, { Q: (1000 * 4.18 + 200 * 0.5) * 45, Lh: 2 * 6 * 17.5, Lhold: 2 * 6 * 40, P: ((1000 * 4.18 + 200 * 0.5) * 45 / 10800 + 0.21) * 1.1, wd: 7 }],
  ['hydraulic-line-sizing', {}, { vel: 0.001 / (Math.PI * 0.016 ** 2 / 4), pb: 2 * 410 * 3 / 22 * 10, pw: 2 * 410 * 3 / 22 * 10 / 4 }],
  ['holding-brake-sizing', {}, { Tnet: 40, tb: 0.05 * (2 * Math.PI * 1450 / 60) / 40, Treq: 0.05 * (2 * Math.PI * 1450 / 60) / 0.45 + 20 }],
  ['holding-brake-sizing', { dir: 'assist' }, { Tnet: 80, Treq: 0 }], // the load alone meets the stop time
  ['weld-preheat-check', {}, { Ct: (360 * 0.18 + 40 * 1.4 + 20 * 0.1 + 28 * 0.02) / 360 * 1.125, Q: 28 * 250 * 60 / 250000 * 0.8, t3: 5950 * 1.344 * (1 / 350 - 1 / 650) }],
  ['snap-fit-joint-design', {}, { Ymax: 2 * 0.025 * 225 / (3 * 1.6), sig: 2300 * 0.0128 }],
  ['worm-gear-drive-design', {}, { i: 40, T1: 1100 / (2 * Math.PI * 1450 / 60) }],
  ['lifting-lug-design', {}, { F: 200000 * 1.25 / (2 * Math.cos(Math.PI / 6)), st: 200000 * 1.25 / (2 * Math.cos(Math.PI / 6)) / ((110 - 34) * 25) }],
];
for (const [id, over, expected, tol] of HB17_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('eighth-round design checks agree with the tools they chain', () => {
  const sj = engine.run('spline-joint-design').values, sc = engine.run('spline-torque-capacity', { T: 500, D: 40, Dre: 37.3, Dh: 0, Nt: 20, Le: 25, t: Math.PI, h: 2, kind: 'fixed', acc: 'good', Ka: 1.2, Km: 1, Kf: 1, Kw: 1, Ss: 200, Sc: 20 }).values;
  near(sj.sRoot, sc.sRoot, 1e-9, 'root shear'); near(sj.sPitch, sc.sPitch, 1e-9, 'tooth shear'); near(sj.sComp, sc.sComp, 1e-9, 'compressive stress');
  near(engine.run('tank-heater-sizing', { mv: 0 }).values.Q, engine.run('heating-energy', { mass: 1000, c: 4.18, T1: 15, T2: 60 }).values.Q, 1e-9, 'heat-up energy');
  const hl = engine.run('hydraulic-line-sizing').values;
  near(hl.dp, engine.run('pipe-friction', { Q: 60, d: 16, L: 10, nu: 46, rho: 870, eps: 0.0015, K: 5 }).values.dp, 1e-12, 'line pressure drop');
  near(hl.dmin, engine.run('pipe-size-velocity', { Q: 60, v: 5, dActual: 16 }).values.dmin, 1e-9, 'least bore');
  const hb = engine.run('holding-brake-sizing').values; near(hb.W, hb.KE * 60 / hb.Tnet, 1e-9, 'friction energy = kinetic energy × T_b ÷ T_net');
  const wp = engine.run('weld-preheat-check').values, ce = engine.run('carbon-equivalent').values;
  near(wp.CE, ce.CE, 1e-12, 'carbon equivalent'); near(wp.Pcm, ce.Pcm, 1e-12, 'Pcm');
  near(wp.Q, engine.run('welding-heat-input', { voltage: 28, current: 250, travel: 250, efficiency: 80 }).values.heat, 1e-12, 'heat input');
  const sf = engine.run('snap-fit-joint-design').values, so = engine.run('snap-fit').values;
  near(sf.eps, so.eps, 1e-12, 'strain'); near(sf.P, so.P, 1e-12, 'deflection force'); near(sf.W, so.W, 1e-12, 'mating force');
  const wd = engine.run('worm-gear-drive-design').values, wg = engine.run('worm-gear', { mx: 4, z1: 1, z2: 40, d1: 40, alphan: 20, mu: 0.05 }).values;
  near(wd.eta, wg.eta, 1e-9, 'worm efficiency'); near(wd.gamma, wg.gamma, 1e-9, 'lead angle'); near(wd.back, wg.back, 1e-9, 'back-driving efficiency');
  const lg = engine.run('lifting-lug-design').values, bs = engine.run('bolt-shear-bearing', { F: lg.F, n: 1, planes: '2', d: 32, t: 25, tauAllow: 120, bAllow: 225 }).values;
  near(lg.tp, bs.tau, 1e-9, 'pin double shear'); near(lg.sb, bs.sb, 1e-9, 'pin bearing');
});

test('eighth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('spline-joint-design', { Le: 3 }).text, 'SPLINE INADEQUATE');
  assert.equal(engine.run('spline-joint-design', { kind: 'flexible' }).text, 'SPLINE INADEQUATE');
  assert.equal(engine.run('ballscrew-axis-stiffness', { ends: 'one' }).text, 'AXIS TOO COMPLIANT');
  assert.equal(engine.run('tank-heater-sizing', { Pinst: 15 }).text, 'HEATER NOT SUITABLE');
  assert.equal(engine.run('tank-heater-sizing', { Ae: 300 }).text, 'HEATER NOT SUITABLE');
  assert.equal(engine.run('hydraulic-line-sizing', { di: 12, do: 18 }).text, 'LINE NOT SUITABLE');
  assert.equal(engine.run('hydraulic-line-sizing', { p: 350 }).text, 'LINE NOT SUITABLE');
  assert.equal(engine.run('holding-brake-sizing', { z: 200 }).text, 'BRAKE NOT SUITABLE');
  assert.equal(engine.run('holding-brake-sizing', { Tb: 30 }).text, 'BRAKE NOT SUITABLE');
  assert.equal(engine.run('weld-preheat-check', { T0: 50 }).text, 'REVIEW PREHEAT OR HEAT INPUT');
  assert.equal(engine.run('snap-fit-joint-design', { Y: 3 }).text, 'REDESIGN THE FINGER');
  assert.equal(engine.run('snap-fit-joint-design', { a2: 90 }).values.lock, 1);
  assert.equal(engine.run('worm-gear-drive-design', { lock: 'yes' }).text, 'DRIVE NOT SUITABLE');
  assert.equal(engine.run('worm-gear-drive-design', { P1: 2.2, Ah: 0.5, kh: 15 }).text, 'DRIVE NOT SUITABLE');
  assert.equal(engine.run('lifting-lug-design', { R: 30 }).text, 'LUG OVERSTRESSED');
  const cases: Array<[string, Inputs]> = [['spline-joint-design', { Dh: 40 }], ['ballscrew-axis-stiffness', { dr: 40 }], ['tank-heater-sizing', { Pinst: 0.4 }], ['tank-heater-sizing', { Ts: 10 }], ['hydraulic-line-sizing', { do: 16 }], ['holding-brake-sizing', { Tb: 15 }], ['holding-brake-sizing', { treq: 0.04 }], ['weld-preheat-check', { tMin: 30, tMax: 20 }], ['lifting-lug-design', { dp: 40 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Eighteenth handbook pass (handbook34): ninth round of integrated design checks.
const HB18_T1 = 7500 / (2 * Math.PI * 1450 / 60), HB18_D1 = 20 * 3 / Math.cos(Math.PI / 12);
const HB18_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['helical-gear-set-design', {}, { T1: HB18_T1, Ft: 2 * HB18_T1 * 1000 / HB18_D1, Fa: 2 * HB18_T1 * 1000 / HB18_D1 * Math.tan(Math.PI / 12) }],
  ['bevel-gear-set-design', {}, { dm1: 72 * (1 - 0.5 * 22 / Math.hypot(36, 72)), Fa1: 2 * (3000 / (2 * Math.PI * 1450 / 60)) * 1000 / (72 * (1 - 0.5 * 22 / Math.hypot(36, 72))) * Math.tan(Math.PI / 9) * Math.sin(Math.atan(0.5)) }],
  ['journal-bearing-design', {}, { p: 2, ld: 1, V: Math.PI * 50 * 1500 / 60000 }],
  ['extension-spring-designer', {}, { K1: (4 * 56.25 - 7.5 - 1) / (4 * 7.5 * 6.5), K2: 1.375 }],
  ['motor-duty-cycle-check', {}, { Ta: 0.008 * 100 * Math.PI / 0.2 + 3, Td: 3 - 0.008 * 100 * Math.PI / 0.2, jr: 3, tt: 2.4 }],
  ['timing-belt-drive-design', {}, { vb: Math.PI * (100 / Math.PI) * 1450 / 60000, Fe: 500 * 1.4 / (1450 / 600), bReq: 500 * 1.4 / (1450 / 600) / 25 }],
  ['heat-exchanger-sizing', {}, { duty: 41.8, Tco: 35, app: 25 }],
  ['heat-exchanger-sizing', { flow: 'parallel' }, { d1: 45, d2: 15, lmtd: 30 / Math.log(3) }],
  ['surface-grinding-planner', {}, { vs: Math.PI * 250 * 2600 / 60000, Q: 100, P: 3, passes: 22, t: 22 * 350 / 15000 }],
  ['compression-strut-sizing', {}, { Dmin: (64 / Math.PI * 2.5 * 50000 * 2000 ** 2 / (Math.PI ** 2 * 200000)) ** 0.25 }, 1e-6],
];
for (const [id, over, expected, tol] of HB18_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('ninth-round design checks agree with the tools they chain', () => {
  const hs = engine.run('helical-gear-set-design').values, hg = engine.run('helical-gear', { mn: 3, beta: 15, alphan: 20, z1: 20, z2: 45, b: 35 }).values;
  for (const k of ['d1', 'd2', 'a', 'at', 'zv1', 'eb']) near(hs[k], hg[k], 1e-9, `helical ${k}`);
  near(hs.sigma, engine.run('lewis-bending', { Ft: hs.Ft, m: 3, b: 35, Y: 0.33, d: hs.d1, rpm: 1450, make: 'hobbed', allow: 150 }).values.sigma, 1e-9, 'helical bending');
  const bs = engine.run('bevel-gear-set-design').values, bg = engine.run('bevel-gear', { m: 4, z1: 18, z2: 36, shaft: 90, b: 22 }).values;
  for (const k of ['d1a', 'd2a', 'Re', 'share']) near(bs[k], bg[k], 1e-9, `bevel ${k}`);
  const jb = engine.run('journal-bearing-design').values, pe = engine.run('journal-bearing-petroff', { d: 50, L: 50, c: 0.04, mu: 25, rpm: 1500, W: 5000 }).values;
  near(jb.Tf, pe.T, 1e-12, 'Petroff torque'); near(jb.S, pe.S, 1e-12, 'Sommerfeld number'); near(jb.Ploss, pe.Ploss, 1e-9, 'power loss');
  near(jb.Qoil, engine.run('coolant-flow-heat', { mode: 'flow', kW: jb.Ploss / 1000, dT: 10, Q: 1, cp: 1.9, rho: 870 }).values.Q, 1e-9, 'oil flow');
  const es = engine.run('extension-spring-designer').values, ex = engine.run('extension-spring').values;
  for (const k of ['k', 'F', 'tau', 'taui']) near(es[k], ex[k], 1e-9, `extension ${k}`);
  const md = engine.run('motor-duty-cycle-check').values, rt = engine.run('rms-torque', { T1: md.Ta, t1: 0.2, T2: 3, t2: 0.6, T3: md.Td, t3: 0.2, T4: 0, t4: 1.4, T5: 0, t5: 0, Tc: 6, Tp: 18 }).values;
  near(md.rms, rt.rms, 1e-12, 'RMS torque'); near(md.peak, rt.peak, 1e-12, 'peak torque');
  const tb = engine.run('timing-belt-drive-design').values, tm = engine.run('timing-belt', { p: 5, z1: 20, z2: 40, C: 200 }).values;
  for (const k of ['L', 'teeth', 'Cx', 'mesh']) near(tb[k], tm[k], 1e-9, `timing ${k}`);
  const hx = engine.run('heat-exchanger-sizing').values, lm = engine.run('lmtd-exchanger', { Thi: 70, Tho: 50, Tci: 25, Tco: 35, flow: 'counter', kW: 41.8, U: 400 }).values;
  near(hx.lmtd, lm.lmtd, 1e-9, 'LMTD'); near(hx.A, lm.A, 1e-9, 'area');
  near(engine.run('surface-grinding-planner').values.lg, engine.run('grinding-geometry', { type: 'surf', ds: 250, dw: 50, ae: 0.01, Vw: 50000, Vs: 2000 }).values.lg, 1e-12, 'contact length');
  for (const sec of ['bar', 'tube']) {
    const cs = engine.run('compression-strut-sizing', { sec, Dc: 80 }).values;
    near(cs.n, engine.run('column-buckling', { E: 200, Sy: 250, A: cs.A, I: cs.I, L: 2000, K: 1, P: 50000, req: 2.5 }).values.n, 1e-9, `strut ${sec} factor`);
    near(engine.run('compression-strut-sizing', { sec, Dc: cs.Dmin }).values.n, 2.5, 1e-6, `strut ${sec} least diameter meets the factor`);
  }
});

test('ninth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('helical-gear-set-design', { b: 10 }).text, 'TEETH OVERSTRESSED');
  assert.equal(engine.run('bevel-gear-set-design', { b: 35 }).text, 'GEAR SET INADEQUATE');
  assert.equal(engine.run('journal-bearing-design', { W: 20000 }).text, 'REVISE THE BEARING');
  assert.equal(engine.run('extension-spring-designer', { r2: 1.2 }).text, 'SPRING OVERSTRESSED');
  assert.equal(engine.run('motor-duty-cycle-check', { ta: 0.1 }).text, 'MOTOR NOT SUITABLE');
  assert.equal(engine.run('motor-duty-cycle-check', { tw: 0.2 }).text, 'MOTOR NOT SUITABLE');
  assert.equal(engine.run('timing-belt-drive-design', { z1: 12 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('heat-exchanger-sizing', { Ainst: 3 }).text, 'EXCHANGER UNDERSIZED');
  assert.equal(engine.run('surface-grinding-planner', { ns: 3000 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('surface-grinding-planner', { u: 60 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('compression-strut-sizing', { Dc: 45 }).text, 'STRUT TOO SMALL');
  const cases: Array<[string, Inputs]> = [['bevel-gear-set-design', { b: 90 }], ['journal-bearing-design', { ldMin: 2, ldMax: 1 }], ['extension-spring-designer', { r2: 0.7 }], ['extension-spring-designer', { tiMin: 200 }], ['timing-belt-drive-design', { z1: 50 }], ['timing-belt-drive-design', { C: 20 }], ['heat-exchanger-sizing', { Qc: 10 }], ['heat-exchanger-sizing', { Tho: 80 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Nineteenth handbook pass (handbook35): tenth round of integrated design checks.
const HB19_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['torsion-spring-designer', {}, { M: 500, Na: 6 + 50 / (60 * Math.PI), Ki: 389 / 360 }],
  ['planetary-gear-set-design', {}, { zp: 24, Ts: 50, nrel: 1125, Ft: 2 * 50000 / (48 * 3) * 1.15 }],
  ['planetary-gear-set-design', { mode: 'sun' }, { Ts: 50 * 24 / 72, nrel: 1500 / (1 + 24 / 72) }],
  ['turning-cut-planner', {}, { passes: 2, Fc: 1500, Ra: 0.0625 / 25.6 * 1000 }],
  ['turning-cut-planner', { nmax: 500 }, { n: 500, vc: Math.PI * 80 * 500 / 1000 }],
  ['flat-belt-drive-design', {}, { wrap: 180 - 2 * Math.asin(0.12) * 180 / Math.PI, L: 2000 + Math.PI * 280 + 240 ** 2 / 4000, Fe: 9000 / (Math.PI * 0.16 * 1450 / 60) }],
  ['disc-brake-design', {}, { Tb: 2 * 2 * Math.PI * 1000 / 60 / 2, re: 100, F: (2 * Math.PI * 1000 / 60) / (0.35 * 0.1 * 2) }],
  ['disc-brake-design', { basis: 'pressure' }, { re: 2 * (120 ** 3 - 80 ** 3) / (3 * (120 ** 2 - 80 ** 2)) }],
  ['disc-brake-design', { TL: 50, dir: 'over' }, { Tb: 2 * 2 * Math.PI * 1000 / 60 / 2 + 50 }],
  ['cover-plate-design', {}, { tS: 100 * Math.sqrt(0.75 / 160), Fend: Math.PI * 1e4 }],
  ['hydraulic-power-unit-sizing', {}, { Vg: 40000 / (1450 * 0.92), Ph: 160 * 40 / 600, V: 120 }],
  ['linear-guide-selection', {}, { sum: 100 * 9.80665, Prun: 100 * 9.80665 * (0.25 + 50 / 600 + 50 / 800), Pacc: 100 * 9.80665 * (0.25 + 50 / 600 + 50 / 800) + 100 * 5 * 100 / 600 }],
  ['hydraulic-cylinder-structure', {}, { F: 16 * Math.PI * 6400 / 4, tcReq: 40 * Math.sqrt(0.75 * 16 / 150) }],
];
for (const [id, over, expected, tol] of HB19_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('tenth-round design checks agree with the tools they chain', () => {
  const ts = engine.run('torsion-spring-designer', { L1: 0, L2: 0 }).values, to = engine.run('torsion-spring').values;
  near(ts.theta, to.theta, 1e-12, 'torsion angle'); near(ts.sigma, to.sigma, 1e-9, 'torsion stress'); near(ts.id, to.id, 1e-9, 'wound inside diameter');
  const pg = engine.run('planetary-gear-set-design').values, po = engine.run('planetary-gear').values;
  for (const k of ['zp', 'i', 'nout', 'Tout']) near(pg[k], po[k], 1e-9, `planetary ${k}`);
  near(pg.sigma, engine.run('lewis-bending', { Ft: pg.Ft, m: 2, b: 20, Y: 0.3, d: 48, rpm: 1125, make: 'hobbed', allow: 150 }).values.sigma, 1e-9, 'sun bending');
  const tc = engine.run('turning-cut-planner').values, tp = engine.run('turning-power', { vc: 200, f: 0.25, ap: 3, D: 80, kc: 2000, eta: 80, Pavail: 15 }).values;
  for (const k of ['Fc', 'Pm', 'T', 'n', 'Q']) near(tc[k], tp[k], 1e-9, `turning ${k}`);
  near(tc.Rt, engine.run('turning-cusp', { feed: 0.25, radius: 0.8 }).values.approximate, 1e-9, 'peak-to-valley');
  near(tc.t, engine.run('turning-time', { rpm: tc.n, feed: 0.25, length: 102, passes: 2, diameter: 80 }).values.minutes, 1e-9, 'cutting time');
  const fb = engine.run('flat-belt-drive-design').values, bt = engine.run('belt-drive-tensions', { kW: 9, d: 160, rpm: 1450, wrap: fb.wrap, mu: 0.3, groove: 0, mass: 0.55 }).values;
  for (const k of ['T1', 'T2', 'Tc', 'shaft']) near(fb[k], bt[k], 1e-9, `belt ${k}`);
  near(engine.run('flat-belt-drive-design', { b: fb.bReq }).values.stress, 3, 1e-9, 'width needed meets the allowable stress');
  const db = engine.run('disc-brake-design').values; near(db.E, db.KE, 1e-9, 'brake energy equals kinetic energy with no load torque');
  const cp = engine.run('cover-plate-design').values, ci = engine.run('circular-plate', { edge: 'clamped', a: 100, t: 12, p: 1, E: 200, nu: 0.3, allow: 160 }).values;
  near(cp.stress, ci.stress, 1e-9, 'cover stress'); near(cp.defl, ci.defl, 1e-12, 'cover deflection');
  for (const edge of ['clamped', 'simple']) {
    const c = engine.run('cover-plate-design', { edge }).values;
    near(engine.run('cover-plate-design', { edge, t: c.tS }).values.stress, 160, 1e-9, `${edge}: thickness for stress meets the allowable`);
    near(engine.run('cover-plate-design', { edge, t: c.tD }).values.defl, 0.1, 1e-9, `${edge}: thickness for deflection meets the limit`);
  }
  near(engine.run('hydraulic-power-unit-sizing').values.Ps, engine.run('hydraulic-power', { pressure: 160, flow: 40, efficiency: 92 * 0.9 }).values.shaft, 1e-9, 'shaft power');
  const hc = engine.run('hydraulic-cylinder-structure').values, pc = engine.run('pressure-cylinder', { di: 80, t: 8, p: 16, ends: 'closed', Sy: 355, req: 2 }).values;
  near(hc.vm, pc.vm, 1e-9, 'barrel von Mises'); near(hc.n, pc.n, 1e-9, 'barrel factor'); near(hc.hoop, pc.hoop, 1e-9, 'hoop stress');
  near(engine.run('pressure-cylinder', { di: 80, t: hc.tMin, p: 16, ends: 'closed', Sy: 355, req: 2 }).values.n, 2, 1e-6, 'least wall meets the factor');
  near(hc.scap, engine.run('circular-plate', { edge: 'clamped', a: 40, t: 25, p: 16, E: 206, nu: 0.3, allow: 150 }).values.stress, 1e-9, 'end cap stress');
  near(hc.nr, engine.run('column-buckling', { E: 206, Sy: 500, A: Math.PI * 56 ** 2 / 4, I: Math.PI * 56 ** 4 / 64, L: 1200, K: 1, P: hc.F, req: 3.5 }).values.n, 1e-9, 'rod buckling');
});

test('tenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('torsion-spring-designer', { F: 40 }).text, 'SPRING NOT ADEQUATE');
  assert.equal(engine.run('torsion-spring-designer', { arbor: 17 }).text, 'SPRING NOT ADEQUATE');
  assert.equal(engine.run('planetary-gear-set-design', { np: 5 }).text, 'GEAR SET NOT ADEQUATE');
  assert.equal(engine.run('planetary-gear-set-design', { np: 4 }).text, 'GEAR SET ADEQUATE');
  assert.equal(engine.run('planetary-gear-set-design', { b: 8 }).text, 'GEAR SET NOT ADEQUATE');
  assert.equal(engine.run('turning-cut-planner', { f: 0.4 }).text, 'CUT NOT FEASIBLE');
  assert.equal(engine.run('turning-cut-planner', { kc: 5000 }).text, 'CUT NOT FEASIBLE');
  assert.equal(engine.run('flat-belt-drive-design', { b: 80 }).text, 'BELT NOT ADEQUATE');
  assert.equal(engine.run('disc-brake-design', { Fmax: 1000 }).text, 'BRAKE NOT ADEQUATE');
  assert.equal(engine.run('disc-brake-design', { md: 0.01 }).text, 'BRAKE NOT ADEQUATE');
  assert.equal(engine.run('cover-plate-design', { t: 8 }).text, 'COVER TOO THIN');
  assert.equal(engine.run('hydraulic-power-unit-sizing', { Pmot: 11 }).text, 'MOTOR TOO SMALL');
  assert.equal(engine.run('hydraulic-power-unit-sizing', { loss: 0 }).values.cool, 0);
  assert.equal(engine.run('linear-guide-selection', { req: 50000 }).text, 'GUIDE NOT ADEQUATE');
  assert.equal(engine.run('linear-guide-selection', { fs: 20 }).text, 'GUIDE NOT ADEQUATE');
  assert.equal(engine.run('hydraulic-cylinder-structure', { Lb: 3000 }).text, 'CYLINDER NOT ADEQUATE');
  const cases: Array<[string, Inputs]> = [['torsion-spring-designer', { D: 2 }], ['planetary-gear-set-design', { zr: 73 }], ['flat-belt-drive-design', { D: 100 }], ['flat-belt-drive-design', { sa: 0.1 }], ['disc-brake-design', { ri: 130 }], ['disc-brake-design', { TL: 200 }], ['cover-plate-design', { t: 2, ca: 2 }], ['hydraulic-cylinder-structure', { p: 1500 }], ['hydraulic-cylinder-structure', { rod: 80 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twentieth handbook pass (handbook36): eleventh round of integrated design checks.
const HB20_D = Math.sqrt(3600 + 4 * 60 * 50 - 0.5 * 4 * 60);
const HB20_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['deep-drawing-plan', {}, { D: HB20_D, draws: 2, B1: 2.5 * Math.PI / 4 * (HB20_D ** 2 - (0.55 * HB20_D + 12) ** 2) }],
  ['broaching-plan', {}, { ze: 6, F: 6 * 0.05 * 20 * 2000, nc: 30, Lt: 34 * 3 * Math.sqrt(10) }],
  ['shaft-critical-speed-check', {}, { nS: 60 / (2 * Math.PI) * (Math.PI / 1.5) ** 2 * Math.sqrt(200e9 * Math.PI * 0.04 ** 4 / 64 / (7850 * Math.PI * 0.04 ** 2 / 4)) }],
  ['geneva-drive-design', {}, { wPeak: 2 * Math.PI * (Math.SQRT1_2 / (1 - Math.SQRT1_2)) }],
  ['friction-grip-joint', {}, { Rs: 4 * 0.3 * 600 * Math.PI / 4 * (16 - 0.938194 * 2) ** 2 * 0.75 / 1.25 }],
  ['flexible-coupling-selection', {}, { T: 15000 / (2 * Math.PI * 1460 / 60), mis: 80 }],
  ['punching-operation-plan', {}, { per: 20 * Math.PI, sp: 144, dmin: 1.92, c: 0.12, tot: 20 * Math.PI * 2 * 300 * 1.2 * 1.1 }],
  ['punching-operation-plan', { shape: 'rect' }, { per: 80, sp: 80 * 2 * 300 * 1.2 / 300 }],
  ['toggle-clamp-design', {}, { angReq: Math.atan(0.6 * Math.PI * 625 * 0.9 / 10000) * 180 / Math.PI, out: 160 * (1 - Math.cos(Math.PI / 36)) }],
  ['cylindrical-grinding-planner', {}, { rate: 0.5 * 40 * 15000 / (Math.PI * 50), Q: 50, P: 1.5, passes: 12 }],
];
for (const [id, over, expected, tol] of HB20_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('eleventh-round design checks agree with the tools they chain', () => {
  const dd = engine.run('deep-drawing-plan').values, sb = engine.run('shell-blank').values;
  near(dd.D, sb.D, 1e-9, 'blank'); near(dd.F1, sb.F, 1e-9, 'first draw force'); assert.equal(dd.draws, sb.draws);
  assert.equal(dd.draws, engine.run('draw-reductions', { D: dd.D, d: 60, m1: 0.55, mr: 0.78 }).values.n);
  const bp = engine.run('broaching-plan').values, bt = engine.run('broach-pitch', { L: 50, d: 0.05, F: 4, b: 20, P: 2000, T: 10 }).values;
  near(bp.pmin, bt.pmin, 1e-9, 'pitch for chip space'); near(bp.pallow, bt.pallow, 1e-9, 'pitch for capacity'); near(bp.pitch, bt.pitch, 1e-9, 'pitch'); near(bp.zeAvg, bt.teeth, 1e-9, 'teeth engaged');
  const one = engine.run('shaft-critical-speed-check', { m2: 0, a1: 750 }).values;
  near(one.nD, engine.run('critical-speed').values.nc, 1e-6, 'single central mass matches the critical speed tool');
  near(one.nR, one.n1, 1e-6, 'Rayleigh is exact for one mass');
  const two = engine.run('shaft-critical-speed-check').values; assert.ok(two.nD < two.nR, 'Dunkerley lies below Rayleigh');
  const gd = engine.run('geneva-drive-design').values, gm = engine.run('geneva-mechanism', { n: 4, C: 100, rpm: 60, roller: 10 }).values;
  near(gd.a, gm.a, 1e-9, 'crank radius'); near(gd.tIndex, gm.tIndex, 1e-12, 'index time'); near(gd.tDwell, gm.tDwell, 1e-12, 'dwell time'); near(gd.peakRpm, gm.ratio * 60, 1e-9, 'peak wheel speed');
  const fg = engine.run('friction-grip-joint').values, bq = engine.run('bolt-torque-preload', { mode: 'torque', d: 16, P: 2, K: 0.2, Sp: 600, pct: 75 }).values;
  near(fg.As, bq.As, 1e-9, 'stress area'); near(fg.Fp, bq.F, 1e-9, 'preload'); near(fg.T, bq.T, 1e-9, 'torque');
  const bs = engine.run('bolt-shear-bearing', { F: 40000, n: 4, planes: '1', d: 16, t: 10, tauAllow: 200, bAllow: 300 }).values;
  near(fg.tau, bs.tau, 1e-9, 'backup shear'); near(fg.sb, bs.sb, 1e-9, 'backup bearing');
  const fc = engine.run('flexible-coupling-selection').values, ks = engine.run('key-stress', { T: fc.Treq, d: 42, w: 12, h: 8, L: 50, tauA: 60, sigA: 100 }).values;
  near(fc.F, ks.F, 1e-9, 'key force'); near(fc.tau, ks.tau, 1e-9, 'key shear'); near(fc.sigma, ks.sigma, 1e-9, 'key crushing');
  near(engine.run('punching-operation-plan').values.F, engine.run('punching-force', { perimeter: 20 * Math.PI, thickness: 2, strength: 300, factor: 1.2 }).values.adjusted, 1e-9, 'punching force');
  const tg = engine.run('toggle-clamp-design').values, tj = engine.run('toggle-joint', { F: tg.F, angle: 5 }).values;
  near(tg.F, engine.run('pneumatic-cylinder-force').values.Fe, 1e-9, 'cylinder force'); near(tg.R, tj.R, 1e-9, 'clamping force'); near(tg.link, tj.link, 1e-9, 'link force');
  near(engine.run('toggle-clamp-design', { ang: tg.angReq }).values.R, 5000, 1e-6, 'angle for the required force gives that force');
  const cg = engine.run('cylindrical-grinding-planner').values, gg = engine.run('grinding-geometry', { type: 'ext', ds: 400, dw: 50, ae: 0.01, Vw: 50000, Vs: 2000 }).values;
  near(cg.De, gg.De, 1e-9, 'equivalent diameter'); near(cg.lg, gg.lg, 1e-12, 'contact length');
  const gc = engine.run('grinding-cycle-time', { type: 'traverse', stock: 0.1, feed: 0.01, spark: 2, Lw: 150, bw: 40, frac: 50, nw: cg.nw }).values;
  near(cg.t, gc.minutes, 1e-9, 'grinding time'); assert.equal(cg.passes, gc.passes);
});

test('eleventh-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('deep-drawing-plan', { press: 80 }).text, 'PRESS TOO SMALL');
  assert.equal(engine.run('broaching-plan', { cap: 1 }).text, 'BROACHING NOT FEASIBLE');
  assert.equal(engine.run('broaching-plan', { strokeMax: 300 }).text, 'BROACHING NOT FEASIBLE');
  assert.equal(engine.run('shaft-critical-speed-check', { rpm: 750 }).text, 'NEAR CRITICAL');
  assert.equal(engine.run('shaft-critical-speed-check', { rpm: 1500 }).text, 'ABOVE CRITICAL');
  assert.equal(engine.run('geneva-drive-design', { J: 0.2 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('geneva-drive-design', { Fallow: 300 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('friction-grip-joint', { V: 80 }).text, 'JOINT WILL SLIP');
  assert.equal(engine.run('flexible-coupling-selection', { ang: 1 }).text, 'COUPLING NOT SUITABLE');
  assert.equal(engine.run('flexible-coupling-selection', { P: 22 }).text, 'COUPLING NOT SUITABLE');
  assert.equal(engine.run('punching-operation-plan', { press: 40 }).text, 'PUNCHING NOT FEASIBLE');
  assert.equal(engine.run('punching-operation-plan', { dp: 1.5 }).text, 'PUNCHING NOT FEASIBLE');
  assert.equal(engine.run('toggle-clamp-design', { ang: 8 }).text, 'CLAMP NOT ADEQUATE');
  assert.equal(engine.run('toggle-clamp-design', { A: 30 }).text, 'CLAMP NOT ADEQUATE');
  assert.equal(engine.run('cylindrical-grinding-planner', { ns: 2000 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('cylindrical-grinding-planner', { u: 150 }).text, 'PLAN NOT FEASIBLE');
  const cases: Array<[string, Inputs]> = [['deep-drawing-plan', { flange: 50 }], ['shaft-critical-speed-check', { a1: 1600 }], ['friction-grip-joint', { Ft: 80 }], ['flexible-coupling-selection', { d: 60 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-first handbook pass (handbook37): twelfth round of integrated design checks.
const HB21_KF = 1 + (1 / (1 + 0.0254 * Math.pow(2070 / 600, 1.8))) * 1.2, HB21_N = 1000 * 100 / (Math.PI * 20);
const HB21_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['fatigue-design-check', {}, { Se: 300 * 0.8 * 0.85 * 0.868, Kf: HB21_KF, sa: HB21_KF * 40, sm: HB21_KF * 60 }],
  ['fatigue-design-check', { Sep: 250 }, { Sep: 250, Se: 250 * 0.8 * 0.85 * 0.868 }],
  ['crane-hook-design', { proof: 2 }, { As: Math.PI / 4 * (30 - 0.938194 * 3.5) ** 2, ss: 20000 / (Math.PI / 4 * (30 - 0.938194 * 3.5) ** 2) }],
  ['universal-joint-drive', {}, { fluct: 0, nImax: 1000 / Math.cos(Math.PI / 12), nImin: 1000 * Math.cos(Math.PI / 12) }, 1e-2],
  ['tolerance-stack-design', {}, { nominal: 0.5, wc: 0.28, sig: Math.sqrt(0.0214) / (3 * 1.33), top: 1 }],
  ['leaf-spring-design', {}, { nReq: 4, nS: 3 * 5000 * 1000 / (2 * 60 * 64 * 700) }],
  ['lathe-threading-plan', {}, { ap: 0.6134 * 2.5, n: HB21_N, t: 9 * 35 / (2.5 * HB21_N) }],
  ['lathe-threading-plan', { nmax: 1000 }, { n: 1000 }],
  ['lathe-threading-plan', { vfMax: 2000 }, { n: 800 }],
  ['clevis-pin-joint', {}, { M: 110000, tau: 20000 / (2 * Math.PI * 100), st: 20000 / (30 * 20), tt: 20000 / (2 * 20 * 15) }],
  ['o-ring-groove-design', {}, { mate: 52.2 }],
  ['flywheel-rim-design', {}, { I: 5000 / ((20 * Math.PI) ** 2 * 0.05), dEc: 5, nmax: 615, nmin: 585 }],
];
for (const [id, over, expected, tol] of HB21_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twelfth-round design checks agree with the tools they chain', () => {
  const fd = engine.run('fatigue-design-check').values;
  near(fd.Kf, engine.run('fatigue-notch-factor', { Kt: 2.2, r: 1, aMode: 'steel', Su: 600 }).values.Kf, 1e-12, 'fatigue notch factor');
  const gf = engine.run('goodman-fatigue', { sa: fd.sa, sm: fd.sm, Se: fd.Se, Su: 600, Sy: 400, req: 1.5 }).values;
  for (const k of ['nG', 'nS', 'nGb', 'ny']) near(fd[k], gf[k], 1e-9, `fatigue ${k}`);
  const ff = engine.run('fatigue-design-check', { smax: 180 }).values;
  near(ff.N, engine.run('sn-fatigue-life', { sa: ff.sar, Su: 600, Se: ff.Se, f: 0.9 }).values.N, ff.N * 1e-9, 'finite life');
  const ch = engine.run('crane-hook-design').values, cb = engine.run('curved-beam', { P: 20000, ri: 40, h: 60, b: 30, allow: 200 }).values;
  for (const k of ['si', 'so', 'e', 'sStraight', 'factor']) near(ch[k], cb[k], 1e-9, `hook ${k}`);
  near(ch.siP, 2 * ch.si, 1e-9, 'proof stress');
  const us = engine.run('universal-joint-drive', { mode: 'single' }).values, uj = engine.run('universal-joint', { angle: 15, rpm: 1000, pos: 45, Tin: 100 }).values;
  near(us.nmax, uj.nmax, 1e-2, 'single joint top speed'); near(us.nmin, uj.nmin, 1e-2, 'single joint bottom speed');
  const out = engine.run('universal-joint-drive', { phase: 'out' }).values; assert.ok(out.fluct > 2 * us.fluct * 0.9, 'out-of-phase joints add their fluctuation');
  const ts = engine.run('tolerance-stack-design').values, rs = engine.run('rss-tolerance-stack').values;
  for (const k of ['nominal', 'wc', 'rss']) near(ts[k], rs[k], 1e-12, `stack ${k}`);
  const ls = engine.run('leaf-spring-design').values, lo = engine.run('leaf-spring', { type: 'semi', F: 5000, L: 1000, b: 60, t: 8, n: 6, E: 207, allow: 700 }).values;
  for (const k of ['sigma', 'k']) near(ls[k], lo[k], 1e-9, `leaf ${k}`); near(ls.defl, lo.defl, 1e-12, 'leaf deflection');
  near(engine.run('leaf-spring-design', { n: 1, dMax: 2000 }).values.nS, engine.run('leaf-spring', { type: 'semi', F: 5000, L: 1000, b: 60, t: 8, n: 1, E: 207, allow: 700 }).values.sigma / 700, 1e-12, 'leaves for stress');
  for (const passes of [2, 5, 8]) {
    const lt = engine.run('lathe-threading-plan', { passes }).values, ti = engine.run('thread-infeed', { type: 'ext', d: 20, P: 2.5, passes, depth: 0 }).values;
    near(lt.ap, ti.ap, 1e-12, `depth ${passes}`); near(lt.first, ti.first, 1e-12, `first pass ${passes}`); near(lt.last, ti.last, 1e-12, `last pass ${passes}`);
  }
  const cp = engine.run('clevis-pin-joint').values, bs = engine.run('bolt-shear-bearing', { F: 20000, n: 1, planes: '2', d: 20, t: 20, tauAllow: 120, bAllow: 200 }).values;
  near(cp.tau, bs.tau, 1e-9, 'pin double shear'); near(cp.be, bs.sb, 1e-9, 'eye bearing');
  const og = engine.run('o-ring-groove-design').values, oo = engine.run('o-ring-gland').values;
  for (const k of ['stretch', 'cs2', 'squeeze', 'fill']) near(og[k], oo[k], 1e-9, `o-ring ${k}`);
  const od = engine.run('o-ring-groove-design', { depth: 0, width: 0 }).values; near(od.squeeze, 20, 1e-9, 'design depth gives the target squeeze'); near(od.fill, 75, 1e-9, 'design width gives the target fill');
  const fw = engine.run('flywheel-rim-design').values, fe = engine.run('flywheel-energy', { mass: fw.mass, outer: 800, inner: fw.Di, nmax: 615, nmin: 585, vmax: 30 }).values;
  near(fe.J, fw.I, 1e-9, 'flywheel inertia'); near(fe.dE, fw.dEc * 1000, 1e-6, 'energy fluctuation');
  near(fw.smax, engine.run('rotating-disc', { Do: 800, Di: fw.Di, rpm: 615, rho: 7200, nu: 0.26, Sy: 150, req: 5 }).values.smax, 1e-9, 'rotating stress');
});

test('twelfth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('fatigue-design-check').text, 'INFINITE LIFE');
  assert.equal(engine.run('fatigue-design-check', { smax: 180 }).text, 'FATIGUE FAILURE EXPECTED');
  assert.equal(engine.run('fatigue-design-check', { smax: 180, Nreq: 1e5 }).text, 'FINITE LIFE ADEQUATE');
  assert.equal(engine.run('fatigue-design-check', { smax: 120 }).text, 'MARGIN TOO SMALL');
  assert.equal(engine.run('crane-hook-design', { W: 40 }).text, 'HOOK NOT ADEQUATE');
  assert.equal(engine.run('crane-hook-design', { Sy: 200 }).text, 'HOOK NOT ADEQUATE');
  assert.equal(engine.run('universal-joint-drive', { b1: 30, b2: 30 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('universal-joint-drive', { mode: 'single' }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('tolerance-stack-design', { Cp: 0.5, reqMin: 0.35 }).text, 'STACK FAILS');
  assert.equal(engine.run('tolerance-stack-design', { reqMin: 0.3 }).text, 'STACK MEETS STATISTICALLY');
  assert.equal(engine.run('leaf-spring-design', { n: 3 }).text, 'SPRING NOT ADEQUATE');
  assert.equal(engine.run('lathe-threading-plan', { passes: 2 }).text, 'CHANGE THE PASS COUNT');
  assert.equal(engine.run('lathe-threading-plan', { passes: 30 }).text, 'CHANGE THE PASS COUNT');
  assert.equal(engine.run('clevis-pin-joint', { g: 10 }).text, 'PIN JOINT OVERSTRESSED');
  assert.equal(engine.run('o-ring-groove-design', { gap: 0.2 }).text, 'REVISE THE GROOVE');
  assert.equal(engine.run('o-ring-groove-design', { gd: 46 }).text, 'REVISE THE GROOVE');
  assert.equal(engine.run('flywheel-rim-design', { vMax: 20 }).text, 'FLYWHEEL NOT ADEQUATE');
  assert.equal(engine.run('flywheel-rim-design', { Sy: 15 }).text, 'FLYWHEEL NOT ADEQUATE');
  const cases: Array<[string, Inputs]> = [['fatigue-design-check', { smin: 200 }], ['fatigue-design-check', { Sy: 700 }], ['tolerance-stack-design', { reqMin: 1, reqMax: 0.5 }], ['tolerance-stack-design', { dir1: 'off', dir2: 'off', dir3: 'off', dir4: 'off' }], ['clevis-pin-joint', { R: 9 }], ['o-ring-groove-design', { sqLo: 30, sqHi: 20 }], ['flywheel-rim-design', { Do: 400 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-second handbook pass (handbook38): thirteenth round of integrated design checks.
const HB22_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['rotor-balancing-check', {}, { perm: 6.3 / (100 * Math.PI) * 1000 * 25 / 2 }],
  ['thread-wire-inspection', {}, { k: 3 * 0.75 / Math.cos(Math.PI / 6) - 0.75 / Math.tan(Math.PI / 6), E: 10.25 - (3 * 0.75 / Math.cos(Math.PI / 6) - 0.75 / Math.tan(Math.PI / 6)) }],
  ['torsion-bar-design', {}, { T: 200000, dS: Math.cbrt(16 * 200000 / (Math.PI * 600)), dT: Math.pow(32 * 200000 * 800 / (Math.PI * 79300 * Math.PI / 18), 0.25) }],
  ['tube-bending-plan', {}, { length: 400 + 2 * Math.PI * 120 / 2, tout: 240 / 145, strain: 2500 / 120, bendTo: 92.7 }],
  ['shaft-deflection-check', {}, { RA: 5000 * 400 / 600 + 3000 * 200 / 600, RB: 5000 * 200 / 600 + 3000 * 400 / 600, Mmax: (5000 * 400 / 600 + 3000 * 200 / 600) * 200 }],
  ['electroplating-plan', {}, { loads: 25, I: 80 }],
  ['bracket-bolt-tension', {}, { Tmax: 60000 * 200 * 250 / 175000, V: 10000, sy2: 175000 }],
  ['gear-centre-distance-design', {}, { a0: 54, y: 0.5, awDeg: Math.acos(54 * Math.cos(Math.PI / 9) / 55) * 180 / Math.PI }],
];
for (const [id, over, expected, tol] of HB22_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirteenth-round design checks agree with the tools they chain', () => {
  const rb = engine.run('rotor-balancing-check').values, tp = engine.run('two-plane-balance').values;
  near(rb.perm, engine.run('balance-grade', { mass: 25, rpm: 3000, grade: '6.3', planes: '2' }).values.per, 1e-9, 'permissible unbalance per plane');
  for (const k of ['UA', 'UB', 'mA', 'mB', 'angA', 'angB']) near(rb[k], tp[k], 1e-9, `balance ${k}`);
  const gt = engine.run('gear-tooth-measurement').values, sm = engine.run('span-measurement', { mn: 3, z: 30, alphan: 20, beta: 0, x: 0, k: 0, b: 30 }).values;
  near(gt.W, sm.W, 1e-12, 'span'); assert.equal(gt.k, sm.k); near(gt.Wmax, gt.W - 0.04, 1e-12, 'span at the smallest backlash'); near(gt.Wmin, gt.W - 0.08, 1e-12, 'span at the largest backlash');
  near(gt.M, engine.run('gear-over-pins', { m: 3, z: 30, alpha: 20, x: 0, thin: 0, dp: 0 }).values.M, 1e-9, 'over pins nominal');
  near(gt.Mmax, engine.run('gear-over-pins', { m: 3, z: 30, alpha: 20, x: 0, thin: gt.thinMin, dp: 0 }).values.M, 1e-9, 'over pins at the smallest backlash');
  near(engine.run('gear-tooth-measurement', { beta: 20, b: 40 }).values.need, engine.run('span-measurement', { mn: 3, z: 30, alphan: 20, beta: 20, x: 0, k: 0, b: 40 }).values.need, 1e-9, 'helical anvil width');
  const tw = engine.run('thread-wire-inspection').values, lim = engine.run('metric-thread-limits', { d: 10, P: 1.5, ext: '6g', int: '6H' }).values, w3 = engine.run('three-wire', { angle: '60', P: 1.5, E: 8.994, W: 0, Mmeas: 10.25 }).values;
  near(lim.d2max, 8.994, 1e-9, 'default upper limit from the limits tool'); near(lim.d2min, 8.862, 1e-9, 'default lower limit from the limits tool');
  near(tw.Mmax, w3.M, 1e-12, 'over-wire upper limit'); near(tw.E, w3.Efrom, 1e-12, 'pitch diameter from the reading');
  const tb = engine.run('torsion-bar-design').values, to = engine.run('torsion-bar').values;
  for (const k of ['tau', 'deg', 'rate', 'tip']) near(tb[k], to[k], 1e-9, `torsion bar ${k}`);
  near(engine.run('torsion-bar-design', { d: tb.dT }).values.deg, 10, 1e-9, 'diameter for twist gives the twist limit');
  const tu = engine.run('tube-bending-plan').values, th = engine.run('tube-bend-thinning', { D: 50, t: 2, R: 120, tmin: 1.6 }).values;
  near(tu.length, engine.run('tube-bend-length', { radius: 120, angle: 90, bends: 2, straight: 400 }).values.length, 1e-9, 'developed length');
  for (const k of ['tout', 'tin', 'pct']) near(tu[k], th[k], 1e-12, `tube ${k}`);
  const sd = engine.run('shaft-deflection-check', { P2: 0 }).values, bc = engine.run('beam-cases', { case: 'ss-offset', load: 5000, L: 600, a: 200, E: 206, I: Math.PI * 70 ** 4 / 64, c: 35, allow: 80 }).values;
  near(sd.RA, bc.R1, 1e-9, 'reaction A'); near(sd.RB, bc.R2, 1e-9, 'reaction B'); near(sd.Mmax, bc.M, 1e-6, 'moment'); near(sd.yMaxAll, bc.defl, bc.defl * 1e-5, 'largest deflection');
  const ep = engine.run('electroplating-plan').values, et = engine.run('electroplating-thickness', { metal: 'ni', J: 4, eff: 95, area: 20, thick: 20 }).values;
  for (const k of ['rate', 'minutes', 'I', 'mass']) near(ep[k], et[k], 1e-9, `plating ${k}`);
  near(engine.run('bracket-bolt-tension').values.tau, engine.run('bolt-shear-bearing', { F: 60000, n: 6, planes: '1', d: 16, t: 10, tauAllow: 150, bAllow: 300 }).values.tau, 1e-9, 'bolt shear');
  const gc = engine.run('gear-centre-distance-design', { short: 'no' }).values, ps = engine.run('profile-shift', { m: 2, z1: 14, z2: 40, alpha: 20, x1: gc.x1, x2: gc.x2, aAct: 0 }).values;
  near(ps.awd, 55, 1e-9, 'shifts give the required centre distance'); near(ps.aw, gc.awDeg, 1e-9, 'working pressure angle');
  near(gc.eps, engine.run('contact-ratio', { m: 2, z1: 14, z2: 40, alpha: 20, x1: gc.x1, x2: gc.x2 }).values.eps, 1e-9, 'contact ratio');
});

test('thirteenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('rotor-balancing-check').text, 'CORRECT AND RE-CHECK');
  assert.equal(engine.run('rotor-balancing-check', { m1: 1, m2: 1 }).text, 'WITHIN GRADE');
  assert.equal(engine.run('rotor-balancing-check', { rA: 10 }).text, 'CORRECTIONS TOO LARGE');
  assert.equal(engine.run('gear-tooth-measurement', { beta: 20, b: 5 }).text, 'SPAN NOT MEASURABLE');
  assert.equal(engine.run('thread-wire-inspection', { Mmeas: 10.35 }).text, 'REJECT');
  assert.equal(engine.run('thread-wire-inspection', { Mmeas: 10.1 }).text, 'REJECT');
  assert.equal(engine.run('torsion-bar-design', { d: 17 }).text, 'BAR NOT ADEQUATE');
  assert.equal(engine.run('tube-bending-plan', { R: 60 }).text, 'BEND NOT FEASIBLE');
  assert.equal(engine.run('shaft-deflection-check', { d: 50 }).text, 'SHAFT TOO FLEXIBLE');
  assert.equal(engine.run('electroplating-plan', { np: 60 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('electroplating-plan', { J: 8 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('bracket-bolt-tension', { P: 150 }).text, 'BOLTS OVERSTRESSED');
  assert.equal(engine.run('gear-centre-distance-design', { share: 0 }).text, 'REVISE THE SHIFTS');
  const cases: Array<[string, Inputs]> = [['rotor-balancing-check', { m1: 0, m2: 0 }], ['gear-tooth-measurement', { jnMin: 0.2, jnMax: 0.1 }], ['thread-wire-inspection', { d2max: 8, d2min: 9 }], ['tube-bending-plan', { R: 20 }], ['shaft-deflection-check', { a1: 700 }], ['shaft-deflection-check', { P1: 0, P2: 0 }], ['bracket-bolt-tension', { n1: 0, n2: 0, n3: 0 }], ['gear-centre-distance-design', { aw: 40 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-third handbook pass (handbook39): fourteenth round of integrated design checks.
const HB23_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['sine-bar-setup', { angle: 37.5 }, { height: 200 * Math.sin(37.5 * Math.PI / 180), stack: Math.round(200 * Math.sin(37.5 * Math.PI / 180) / 0.0005) * 0.0005 }],
  ['internal-taper-inspection', {}, { Hd: 30, Hexp: 5 / Math.sin(11.5 * Math.PI / 180) + 5 }],
  ['thread-milling-plan', {}, { n: 120000 / (Math.PI * 14), pathD: 6, passes: 2, depth: 0.5413 * 2.5 }],
  ['gear-hobbing-plan', {}, { sharp: 0.4, hob: 1200 / 2200 }],
  ['accumulator-circuit-sizing', {}, { V: Math.PI * 0.64 / 4 * 3, pumpV: 1, dV: Math.PI * 0.64 / 4 * 3 - 1 }],
  ['cylinder-speed-control', {}, { A1: Math.PI * 63 ** 2 / 4, p2: (10 * Math.PI * 63 ** 2 / 4 - 15000) / (Math.PI * (63 ** 2 - 36 ** 2) / 4) * 10 }],
  ['pipe-insulation-design', {}, { qBare: 130 * 2 * Math.PI * 0.03015 * 10 }],
  ['sheet-metal-flat-pattern', {}, { nb: 2, flat: 110 - 2 * (10 - Math.PI / 2 * 3.8) }],
  ['ball-nose-finishing-plan', {}, { n: 15000, vf: 1500, passes: 283, t: 283 * 100 / 1500 }],
];
for (const [id, over, expected, tol] of HB23_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('fourteenth-round design checks agree with the tools they chain', () => {
  const sb = engine.run('sine-bar-setup').values, so = engine.run('sine-bar', { length: 200, angle: 30 }).values;
  near(sb.height, so.height, 1e-12, 'sine-bar height'); near(sb.perUm, so.arcseconds, 1e-12, 'angle per micrometre');
  const s37 = engine.run('sine-bar-setup', { angle: 37.5 }).values; near(engine.run('gauge-block-stack', { set: 'm88', target: s37.stack }).values.total, s37.stack, 1e-9, 'stack can be built from the set');
  const ti = engine.run('internal-taper-inspection').values, tb = engine.run('taper-balls').values;
  for (const k of ['angle', 'taper', 'top']) near(ti[k], tb[k], 1e-9, `taper ${k}`);
  const tm = engine.run('thread-milling-plan').values, tp = engine.run('thread-milling-path', { type: 'int', D: 20, P: 2.5, dc: 14, rpm: tm.n, fz: 0.08, z: 3, L: 25, passes: 2 }).values;
  near(tm.fc, tp.fc, 1e-9, 'centre feed'); near(tm.pathD, tp.pathD, 1e-12, 'path diameter'); near(tm.tMill, tp.minutes, 1e-9, 'milling time');
  const gh = engine.run('gear-hobbing-plan').values, ht = engine.run('hobbing-time').values;
  for (const k of ['n', 'nw', 'tCut', 'tFloor']) near(gh[k], ht[k], 1e-9, `hobbing ${k}`);
  const ac = engine.run('accumulator-circuit-sizing').values;
  near(ac.V0, engine.run('accumulator-size', { dV: ac.dV, p0: 90, p1: 100, p2: 200, n: 1.4 }).values.V0, 1e-9, 'gas volume');
  const cs = engine.run('cylinder-speed-control').values;
  near(engine.run('orifice-flow', { mode: 'flow', d: cs.dOr, Cd: 0.62, dp: cs.p2, Q: 10, rho: 870 }).values.Q, cs.Q2, 1e-9, 'orifice passes the rod-side flow');
  const pi = engine.run('pipe-insulation-design').values, ip = engine.run('insulated-pipe').values;
  near(pi.q, ip.q, 1e-9, 'heat loss'); near(pi.Ts, ip.Ts, 1e-9, 'surface temperature'); near(pi.annual, ip.cost, 1e-9, 'annual cost');
  near(pi.qBare, engine.run('insulated-pipe', { t: 0 }).values.q, 1e-9, 'bare pipe loss');
  near(engine.run('pipe-insulation-design', { t: pi.tQ }).values.q, 40, 1e-6, 'thickness for loss meets the target');
  near(engine.run('pipe-insulation-design', { t: pi.tS, qMax: 1e4 }).values.Ts, 50, 1e-6, 'thickness for surface temperature meets the limit');
  const one = engine.run('sheet-metal-flat-pattern', { L1: 30, A1: 90, L2: 40, A2: 0 }).values, ba = engine.run('bend-allowance', { thickness: 2, radius: 3, angle: 90, k: 0.4, a: 30, b: 40 }).values;
  near(one.flat, ba.flat, 1e-9, 'single-bend flat length'); near(one.ded, ba.deduction, 1e-9, 'bend deduction');
  const bn = engine.run('ball-nose-finishing-plan').values, bd = engine.run('ball-nose-diameter', { diameter: 10, depth: 0.3, rpm: 15000, speed: 200 }).values;
  near(bn.sT, engine.run('scallop-height', { mode: 'step', D: 10, h: 0.002 }).values.s, 1e-12, 'stepover for the scallop');
  near(bn.De, bd.effective, 1e-12, 'effective diameter'); near(bn.vcA, bd.surface, 1e-9, 'cutting speed reached');
});

test('fourteenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('sine-bar-setup', { angTol: 0.2 }).text, 'SET-UP TOO COARSE');
  assert.equal(engine.run('sine-bar-setup', { L: 100, angTol: 0.5 }).text, 'SET-UP TOO COARSE');
  assert.equal(engine.run('internal-taper-inspection', { h2: 10.5 }).text, 'REJECT');
  assert.equal(engine.run('thread-milling-plan', { dc: 16 }).text, 'CUTTER TOO LARGE');
  assert.equal(engine.run('gear-hobbing-plan', { Vc: 300 }).text, 'HOB SPEED TOO HIGH');
  assert.equal(engine.run('accumulator-circuit-sizing', { Vinst: 1 }).text, 'ACCUMULATOR NOT ADEQUATE');
  assert.equal(engine.run('accumulator-circuit-sizing', { t2: 0.5 }).text, 'ACCUMULATOR NOT ADEQUATE');
  assert.equal(engine.run('accumulator-circuit-sizing', { Qp: 60 }).text, 'PUMP ALONE IS ENOUGH');
  assert.equal(engine.run('cylinder-speed-control', { v: 0.2 }).text, 'CONTROL NOT ADEQUATE');
  assert.equal(engine.run('cylinder-speed-control', { F: -25 }).text, 'CONTROL NOT ADEQUATE');
  assert.equal(engine.run('pipe-insulation-design', { t: 20 }).text, 'INSULATION TOO THIN');
  assert.equal(engine.run('sheet-metal-flat-pattern', { minFl: 40 }).text, 'CHECK FLANGES OR RADIUS');
  assert.equal(engine.run('sheet-metal-flat-pattern', { rMin: 2 }).text, 'CHECK FLANGES OR RADIUS');
  assert.equal(engine.run('ball-nose-finishing-plan', { step: 0.5 }).text, 'SCALLOP TOO HIGH');
  const cases: Array<[string, Inputs]> = [['internal-taper-inspection', { d2: 8 }], ['thread-milling-plan', { dc: 25 }], ['accumulator-circuit-sizing', { p0: 120 }], ['cylinder-speed-control', { F: 40 }], ['cylinder-speed-control', { rod: 70 }], ['pipe-insulation-design', { Ti: 10 }], ['sheet-metal-flat-pattern', { L1: 3 }], ['ball-nose-finishing-plan', { ap: 6 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-fourth handbook pass (handbook40): fifteenth round of integrated design checks.
const HB24_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['drop-impact-design', {}, { Feq: 20 * 9.80665 * (1 + Math.sqrt(1 + 200 / (20 * 9.80665 * 2000 ** 3 / (48 * 200000 * 8e6)))) }],
  ['centerless-grinding-plan', {}, { passes: 4, pph: 1561.973428688577 / 85 * 60 / 4 }, 1e-6],
  ['sawing-plan', {}, { ppb: 23, bars: 9, blades: 200 * 25 * Math.PI / 5000, changes: 3 }],
  ['motor-load-assessment', {}, { ns: 1500, load: 62.5, Pout: 11 * 0.625 }],
  ['bolted-joint-temperature', { dT: 0 }, { dF: 0 }, 1e-9],
  ['bolted-joint-temperature', { am: 11.5 }, { dF: 0 }, 1e-9],
  ['bolt-circle-layout', {}, { step: 90, lig: 100 * Math.SQRT1_2 - 11, eOut: 14.5, eIn: 14.5, nMax: 12 }],
  ['tapping-plan', { drillHave: 0 }, { pctHave: 75, drill: 10 - 0.01299 * 75 * 1.5 }],
  ['machine-tipping-stability', {}, { sf: 0.4 / (0.3 * 1.2), aTip: 0.4 / 1.2, Ta: (1.5 * 2000 * 9.80665 * 0.36 - 2000 * 9.80665 * 0.4) / 1.6 }],
  ['rope-winch-drum', {}, { ratio: Math.exp(0.25 * 6 * Math.PI), T: 480, sf: 6 }],
];
for (const [id, over, expected, tol] of HB24_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('fifteenth-round design checks agree with the tools they chain', () => {
  const di = engine.run('drop-impact-design').values, bi = engine.run('beam-impact').values;
  for (const k of ['dst', 'sst', 'k', 'dd', 'sd']) near(di[k], bi[k], 1e-12, `impact ${k}`);
  near(di.E, engine.run('impact-load', { mode: 'drop', mass: 20, height: 100, speed: 1.5, stop: di.dd }).values.E, 1e-9, 'energy absorbed');
  near(engine.run('drop-impact-design', { h: di.hAllow }).values.sd, 250, 1e-6, 'safe drop height reaches the allowable');
  const cg = engine.run('centerless-grinding-plan').values, cf = engine.run('centerless-feed').values;
  for (const k of ['feed', 'nw', 'ppm']) near(cg[k], cf[k], 1e-9, `centerless ${k}`);
  near(engine.run('centerless-grinding-plan', { angle: cg.angReq }).values.pph, 250, 1e-6, 'inclination for the target gives the target');
  const sp = engine.run('sawing-plan').values, bt = engine.run('bandsaw-time', { shape: 'round', a: 100, b: 50, rate: 40, handle: 30 }).values;
  for (const k of ['area', 'tcut', 'perHour']) near(sp[k], bt[k], 1e-9, `sawing ${k}`);
  const ml = engine.run('motor-load-assessment').values, mp = engine.run('motor-power', { mode: 'current', V: 415, kW: 11, I: 20, pf: 0.85, eff: 91, rpm: 1460 }).values, ms = engine.run('motor-slip', { f: 50, poles: '4', n: 1475, nRated: 1460 }).values;
  near(ml.Ir, mp.I, 1e-9, 'rated current'); near(ml.Tr, mp.T, 1e-6, 'rated torque');
  for (const k of ['ns', 'slip', 'sr', 'load']) near(ml[k], ms[k], 1e-9, `motor ${k}`);
  const bj = engine.run('bolted-joint-temperature').values, bd = engine.run('bolted-joint-design-check', { d: 12, P: 1.75, Sp: 600, Sut: 830, Se: 129, Eb: 207, grip: 30, Lt: 10, Em: 70, pct: 70, K: 0.2, sc: 25, Pext: 10, req: 1.5 }).values;
  near(bj.kb, bd.kb, 1e-6, 'bolt stiffness'); near(bj.km, bd.km, 1e-6, 'member stiffness'); near(bj.Fi, bd.Fi, 1e-9, 'assembly preload');
  const bc = engine.run('bolt-circle-layout').values, bo = engine.run('bolt-circle', { diameter: 100, holes: 4, angle: 45, x: 0, y: 0, direction: 'ccw' }).values;
  near(bc.chord, bo.chord, 1e-12, 'chord'); near(bc.step, bo.step, 1e-12, 'step'); near(bc.x1, bo.coordinates[0].x, 1e-12, 'first hole x'); near(bc.y1, bo.coordinates[0].y, 1e-12, 'first hole y');
  const tp = engine.run('tapping-plan').values, td = engine.run('tap-drill', { system: 'metric', D: 10, pitch: 1.5, tpi: 13, pct: 75, tap: 'cut' }).values, tf = engine.run('tapping-feed', { pitch: 1.5, starts: 1, rpm: tp.n, depth: 15 }).values;
  near(tp.drill, td.drill, 1e-12, 'tap drill'); near(tp.minor, td.minor, 1e-12, 'minor diameter'); near(tp.feed, tf.feed, 1e-9, 'synchronous feed'); near(tp.tF, tf.seconds, 1e-9, 'forward time');
  near(engine.run('machine-tipping-stability', { aH: 0.4 / 1.2 }).values.sf, 1, 1e-9, 'tipping acceleration gives a factor of one');
  near(engine.run('machine-tipping-stability', { req: 0.4 / 0.36 }).values.Ta, 0, 1e-6, 'no anchor force at the existing factor');
  const rw = engine.run('rope-winch-drum').values, bf = engine.run('belt-friction', { slack: 200, mu: 0.25, wrap: 1080, groove: 0 }).values;
  near(rw.ratio, bf.ratio, 1e-9, 'tension ratio'); near(rw.Fmax, bf.T1, 1e-9, 'load held');
  near(engine.run('rope-winch-drum', { wraps: rw.need }).values.Fmax, 5000, 1e-6, 'turns needed hold the load');
});

test('fifteenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('drop-impact-design', { h: 2000 }).text, 'BEAM OVERLOADED');
  assert.equal(engine.run('drop-impact-design', { dMax: 1 }).text, 'BEAM OVERLOADED');
  assert.equal(engine.run('centerless-grinding-plan', { target: 400 }).text, 'OUTPUT TOO LOW');
  assert.equal(engine.run('sawing-plan', { avail: 8 }).text, 'BATCH OVERRUNS');
  assert.equal(engine.run('motor-load-assessment', { n: 1450 }).text, 'MOTOR OVERLOADED');
  assert.equal(engine.run('motor-load-assessment', { n: 1490 }).text, 'MOTOR OVERSIZED');
  assert.equal(engine.run('bolted-joint-temperature', { dT: -150 }).text, 'PRELOAD OUT OF RANGE');
  assert.equal(engine.run('bolted-joint-temperature', { dT: 150 }).text, 'PRELOAD OUT OF RANGE');
  assert.equal(engine.run('bolt-circle-layout', { n: 14 }).text, 'LAYOUT NOT ADEQUATE');
  assert.equal(engine.run('bolt-circle-layout', { OD: 115 }).text, 'LAYOUT NOT ADEQUATE');
  assert.equal(engine.run('tapping-plan', { drillHave: 8.8 }).text, 'DRILL ACCEPTABLE');
  assert.equal(engine.run('tapping-plan', { drillHave: 9 }).text, 'DRILL OUT OF RANGE');
  assert.equal(engine.run('tapping-plan', { drillHave: 8.4 }).text, 'DRILL OUT OF RANGE');
  assert.equal(engine.run('machine-tipping-stability', { aH: 0.1 }).text, 'STABLE');
  assert.equal(engine.run('machine-tipping-stability', { cap: 1 }).text, 'UNSTABLE');
  assert.equal(engine.run('machine-tipping-stability', { nA: 0 }).text, 'UNSTABLE');
  assert.equal(engine.run('rope-winch-drum', { wraps: 1 }).text, 'WINCH NOT ADEQUATE');
  assert.equal(engine.run('rope-winch-drum', { MBL: 20 }).text, 'WINCH NOT ADEQUATE');
  const cases: Array<[string, Inputs]> = [['sawing-plan', { piece: 7000 }], ['sawing-plan', { shape: 'tube', b: 60 }], ['motor-load-assessment', { n: 1500 }], ['bolted-joint-temperature', { Lt: 40 }], ['bolt-circle-layout', { OD: 90 }], ['tapping-plan', { pMin: 90, pMax: 80 }], ['machine-tipping-stability', { tilt: 30 }], ['machine-tipping-stability', { aH: 0 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-fifth handbook pass (handbook41): sixteenth round of integrated design checks.
const HB25_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['casting-pour-plan', {}, { mc: 14, feedNeed: 2000 * 5 / 15, mr: Math.PI * 169 * 16 / 4 * 7 / 1000 }],
  ['coating-job-estimate', {}, { qtyTot: 2 * 50 / 5.2, wft: 75 * 100 / 60 * 1.1, labH: 5 }],
  ['valve-closure-surge', {}, { ptot: 6 + 7.984 }, 1e-6],
  ['control-valve-sizing', {}, { auth: 0.5, Qopen: Math.sqrt(1 / (1 / 256 + 0.5 / 100)) }],
  ['vacuum-gripper-sizing', {}, { nReq: 2, tEv: 0.5 / 100 * 60 * Math.log(101.325 / 41.325) }],
  ['wind-load-on-post', {}, { I: Math.PI * (114.3 ** 4 - 106.3 ** 4) / 64, dMax: 30 }],
  ['noise-exposure-check', { r2: 1, LB: 0 }, { Lop: 10 * Math.log10(10 ** 9 + 10 ** 8.5) }],
  ['process-capability-check', {}, { sigma: 0.03 / 2.326, Cp: 0.12 / (6 * 0.03 / 2.326) }],
  ['corrosion-remaining-life', { mode: 'thick' }, { rate: 0.1, life: 35, next: 5 }],
];
for (const [id, over, expected, tol] of HB25_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('sixteenth-round design checks agree with the tools they chain', () => {
  const cp = engine.run('casting-pour-plan').values, cs = engine.run('casting-solidification', { Vc: 2000, Ac: 900, Dr: 130, Hr: 160, B: 2, ratio: 1.2, part: 250, shrink: 1 }).values;
  for (const k of ['Mc', 'Mr', 'tc', 'tr', 'ratio', 'pattern']) near(cp[k], cs[k], 1e-9, `casting ${k}`);
  const gc = engine.run('gating-choke-area', { W: cp.W, rho: 7000, h: 200, t: 12, Cd: 0.8, runner: 2, gate: 2 }).values;
  near(cp.A, gc.A, 1e-9, 'choke area'); near(cp.vel, gc.vel, 1e-12, 'choke velocity');
  const cj = engine.run('coating-job-estimate').values, cc = engine.run('coating-coverage').values;
  for (const k of ['theo', 'prac', 'qty', 'cost']) near(cj[k], cc[k], 1e-9, `coating ${k}`);
  const vs = engine.run('valve-closure-surge').values, wh = engine.run('water-hammer').values;
  near(vs.a, wh.a, 1e-9, 'wave speed'); near(vs.tcrit, wh.tcrit, 1e-12, 'critical time'); near(vs.dpJ, wh.dpJ / 1e5, 1e-9, 'Joukowsky surge'); near(vs.dp, wh.dp / 1e5, 1e-9, 'surge');
  near(engine.run('valve-closure-surge', { tc: vs.tNeed }).values.ptot, 16, 1e-9, 'closing time needed meets the rating');
  const cv = engine.run('control-valve-sizing').values, vk = engine.run('valve-flow-coefficient', { mode: 'kv', Q: 10, dp: 0.5, Kv: 20, sg: 1 }).values;
  near(cv.Kv, vk.Kv, 1e-12, 'Kv'); near(cv.Cv, vk.Cv, 1e-12, 'Cv');
  near(engine.run('valve-flow-coefficient', { mode: 'flow', Q: 10, dp: cv.dpOpen, Kv: 16, sg: 1 }).values.Q, cv.Qopen, 1e-9, 'flow through the open valve');
  const vg = engine.run('vacuum-gripper-sizing').values, vc = engine.run('vacuum-cup').values;
  for (const k of ['per', 'Fh', 'req']) near(vg[k], vc[k], 1e-9, `vacuum ${k}`);
  const vd = engine.run('vacuum-gripper-sizing', { D: vg.Dreq }).values; near(vd.Fh, vd.req, 1e-6, 'cup diameter needed gives the force needed');
  const wl = engine.run('wind-load-on-post').values, wp = engine.run('wind-pressure', { V: 20, rho: 1.2, Cd: 1.2, A: 2, h: 3 }).values;
  for (const k of ['q', 'p', 'F', 'M']) near(wl[k], wp[k], 1e-9, `wind ${k}`);
  const ne = engine.run('noise-exposure-check').values;
  near(ne.Ls, engine.run('sound-level', { mode: 'sum', L1: 90, L2: 85, L3: 0, L4: 0 }).values.L, 1e-6, 'combined level');
  near(ne.Ld, engine.run('sound-level', { mode: 'distance', Lr: ne.Ls, r1: 1, r2: 3 }).values.L, 1e-9, 'level at distance');
  const pc = engine.run('process-capability-check').values, xr = engine.run('xbar-r-limits', { xbar: 25.01, rbar: 0.03, n: '5' }).values;
  for (const k of ['ucl', 'lcl', 'rucl', 'rlcl', 'sigma']) near(pc[k], xr[k], 1e-9, `control ${k}`);
  near(pc.ppm, engine.run('normal-out-of-spec', { mean: 25.01, sd: pc.sigma, lsl: 24.95, usl: 25.07, qty: 10000 }).values.ppm, 1e-6, 'predicted ppm');
  near(engine.run('corrosion-remaining-life').values.rate, engine.run('corrosion-rate', { W: 120, A: 20, hours: 720, rho: 7.86, allowance: 1.5 }).values.mmy, 1e-12, 'coupon corrosion rate');
});

test('sixteenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('casting-pour-plan', { ladle: 25 }).text, 'REVISE THE PLAN');
  assert.equal(engine.run('casting-pour-plan', { Dr: 100, Hr: 120 }).text, 'REVISE THE PLAN');
  assert.equal(engine.run('casting-pour-plan', { shrinkV: 10, effR: 5 }).text, 'REVISE THE PLAN');
  assert.equal(engine.run('coating-job-estimate', { dft: 120 }).text, 'WET FILM TOO THICK');
  assert.equal(engine.run('valve-closure-surge', { tc: 0.5 }).text, 'SURGE EXCEEDS RATING');
  assert.equal(engine.run('valve-closure-surge', { rating: 10 }).text, 'SURGE EXCEEDS RATING');
  assert.equal(engine.run('control-valve-sizing', { Kvs: 12 }).text, 'VALVE NOT SUITABLE');
  assert.equal(engine.run('control-valve-sizing', { Kvs: 63 }).text, 'VALVE NOT SUITABLE');
  assert.equal(engine.run('control-valve-sizing', { dps: 1 }).text, 'VALVE NOT SUITABLE');
  assert.equal(engine.run('vacuum-gripper-sizing', { mass: 15 }).text, 'GRIPPER NOT ADEQUATE');
  assert.equal(engine.run('vacuum-gripper-sizing', { Qp: 10 }).text, 'GRIPPER NOT ADEQUATE');
  assert.equal(engine.run('wind-load-on-post', { V: 40 }).text, 'POST NOT ADEQUATE');
  assert.equal(engine.run('wind-load-on-post', { OD: 60.3, t: 3 }).text, 'POST NOT ADEQUATE');
  assert.equal(engine.run('noise-exposure-check', { r2: 1.5 }).text, 'EXPOSURE OVER LIMIT');
  assert.equal(engine.run('process-capability-check', { xbar: 25.05 }).text, 'PROCESS NOT CAPABLE');
  assert.equal(engine.run('process-capability-check', { rbar: 0.06 }).text, 'PROCESS NOT CAPABLE');
  assert.equal(engine.run('corrosion-remaining-life', { tNow: 2 }).text, 'BELOW MINIMUM THICKNESS');
  assert.equal(engine.run('corrosion-remaining-life', { lifeReq: 50 }).text, 'LIFE SHORTER THAN REQUIRED');
  const cases: Array<[string, Inputs]> = [['valve-closure-surge', { rating: 5 }], ['control-valve-sizing', { openMin: 0.9, openMax: 0.5 }], ['wind-load-on-post', { t: 60 }], ['noise-exposure-check', { L1: 0, L2: 0 }], ['process-capability-check', { usl: 24 }], ['corrosion-remaining-life', { mode: 'thick', t1: 5 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-sixth handbook pass (handbook42): seventeenth round of integrated design checks.
const HB26_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['hydraulic-filter-selection', {}, { d4: 1500, d6: 40, d14: 5, R4: 18, R6: 12, R14: 9, dp: 0.2 * 0.8 * 46 / 32 }],
  ['submerged-tank-flotation', {}, { Fb: 98066.5, Ws: 43200, Wb: 12000 * 9.80665 * (1 - 1000 / 2400) }],
  ['cable-span-design', {}, { clearance: 7 }],
  ['system-reliability', {}, { Rs: Math.exp(-0.04) * Math.exp(-(0.1 ** 1.5)) * (1 - (1 - Math.exp(-0.04)) ** 2), weak: 1 }],
  ['learning-curve-quote', {}, { unit: ((255.131114563279 + 6) * 105 + 2000) * 1.15 / 50 }, 1e-6],
  ['acceptance-sampling-plan', {}, { n: 132, c: 3 }],
  ['measurement-uncertainty-budget', {}, { temp: 0.5 * 11.5 * 0.5, U: 2 * Math.sqrt(1 + 1 / 12 + 2.25 + (30 * Math.tan(Math.PI / 180 / 180) * 1000) ** 2 / 3 + 2.875 ** 2 / 3) }],
  ['furnace-wall-design', {}, { R: 0.115 / 1.2 + 0.23 / 0.15 + 0.006 / 50 }],
  ['fastener-position-tolerance', {}, { tot: 1, Thole: 1, Tthread: 1 }],
  ['fastener-position-tolerance', { mode: 'fixed', share: 60 }, { Thole: 0.6, Tthread: 0.4 }],
];
for (const [id, over, expected, tol] of HB26_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('seventeenth-round design checks agree with the tools they chain', () => {
  const hf = engine.run('hydraulic-filter-selection').values, ic = engine.run('iso-cleanliness-code', { vol: 1, c4: 1500, c6: 40, c14: 5, t4: 18, t6: 16, t14: 13 }).values, fb = engine.run('filter-beta-ratio', { mode: 'rating', up: 15000, down: 25, beta: 10 }).values;
  assert.equal(hf.codeOut, ic.code); near(hf.d4, fb.down, 1e-9, 'downstream count'); near(hf.e4, fb.eff, 1e-9, 'efficiency');
  const st = engine.run('submerged-tank-flotation').values;
  near(st.Fb, engine.run('buoyancy', { V: 10000, mass: 1500, rho: 1000 }).values.Fb, 1e-9, 'uplift');
  near(engine.run('submerged-tank-flotation', { mB: st.mBreq }).values.sf, 1.25, 1e-9, 'ballast needed gives the factor');
  const cs = engine.run('cable-span-design').values, cc = engine.run('catenary-cable').values;
  for (const k of ['a', 'H', 'Tmax', 'L', 'ang']) near(cs[k], cc[k], 1e-9, `cable ${k}`);
  const sr = engine.run('system-reliability', { e2: 0, e3: 0 }).values, wr = engine.run('weibull-reliability').values;
  near(sr.Rs, wr.R, 1e-12, 'single-block reliability'); near(sr.mttf, wr.mttf, wr.mttf * 1e-4, 'single-block MTTF');
  const lq = engine.run('learning-curve-quote').values, lc = engine.run('learning-curve', { T1: 10, rate: 85, n: 50, cost: 80 }).values;
  for (const k of ['Tn', 'cum', 'avg', 'b']) near(lq[k], lc[k], 1e-12, `learning ${k}`);
  const sp = engine.run('acceptance-sampling-plan').values;
  near(sp.paA, engine.run('sampling-oc', { n: 132, c: 3, p: 1 }).values.Pa, 1e-12, 'acceptance at AQL');
  near(sp.paR, engine.run('sampling-oc', { n: 132, c: 3, p: 5 }).values.Pa, 1e-12, 'acceptance at RQL');
  const smaller = engine.run('acceptance-sampling-plan', { nU: 131, cU: 3 }).values; assert.ok(smaller.paR > 0.1, 'one fewer sample breaks the consumer risk');
  near(engine.run('measurement-uncertainty-budget').values.abbe, engine.run('abbe-error', { offset: 30, tilt: 20, tolerance: 0.05 }).values.error * 1000, 1e-12, 'Abbe error');
  const fw = engine.run('furnace-wall-design').values, wh = engine.run('wall-heat-loss', { Thot: 900, Tcold: 25, area: 10, hin: 0, hout: fw.hcomb, t1: 115, k1: 1.2, t2: 230, k2: 0.15, t3: 6, k3: 50 }).values;
  near(fw.flux, wh.qf, 1e-6, 'flux through the wall'); near(fw.Ts, wh.Tsurf, 1e-6, 'surface temperature');
  near(fw.qrad, engine.run('radiant-heat', { area: 10, eps: 0.8, Ts: fw.Ts, Ta: 25 }).values.flux, 1e-9, 'radiation from the surface');
  const fp = engine.run('fastener-position-tolerance').values, tp = engine.run('true-position', { feature: 'hole', mod: 'mmc', dx: 0.3, dy: 0.4, tol: 1, size: 11.1, lower: 11, upper: 11.3 }).values;
  for (const k of ['pos', 'bonus', 'allowed']) near(fp[k], tp[k], 1e-12, `position ${k}`);
});

test('seventeenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('hydraulic-filter-selection', { b4: 2 }).text, 'FILTER NOT SUITABLE');
  assert.equal(engine.run('hydraulic-filter-selection', { nu: 300 }).text, 'FILTER NOT SUITABLE');
  assert.equal(engine.run('submerged-tank-flotation', { mB: 3000 }).text, 'TANK WILL FLOAT');
  assert.equal(engine.run('cable-span-design', { d: 1 }).text, 'SPAN NOT ADEQUATE');
  assert.equal(engine.run('cable-span-design', { hSup: 10 }).text, 'SPAN NOT ADEQUATE');
  assert.equal(engine.run('system-reliability', { target: 95 }).text, 'TARGET NOT MET');
  assert.equal(engine.run('system-reliability', { k3: 1 }).text, 'TARGET NOT MET');
  assert.equal(engine.run('learning-curve-quote', { offer: 800 }).text, 'OFFER BELOW TARGET');
  assert.equal(engine.run('acceptance-sampling-plan', { nU: 50, cU: 1 }).text, 'PLAN DOES NOT PROTECT BOTH');
  assert.equal(engine.run('measurement-uncertainty-budget', { dT: 1 }).text, 'MEASUREMENT NOT CAPABLE');
  assert.equal(engine.run('measurement-uncertainty-budget', { tol: 0.01 }).text, 'MEASUREMENT NOT CAPABLE');
  assert.equal(engine.run('furnace-wall-design', { t2: 115 }).text, 'WALL NOT ADEQUATE');
  assert.equal(engine.run('furnace-wall-design', { T12Max: 800 }).text, 'WALL NOT ADEQUATE');
  assert.equal(engine.run('fastener-position-tolerance', { dx: 0.4 }).text, 'REJECT');
  assert.equal(engine.run('fastener-position-tolerance', { size: 11.4 }).text, 'REJECT');
  assert.equal(engine.run('fastener-position-tolerance', { mode: 'fixed' }).text, 'REJECT');
  const cases: Array<[string, Inputs]> = [['hydraulic-filter-selection', { c6: 20000 }], ['cable-span-design', { d: 200 }], ['system-reliability', { e1: 0, e2: 0, e3: 0 }], ['acceptance-sampling-plan', { rql: 0.5 }], ['acceptance-sampling-plan', { nU: 5, cU: 5 }], ['furnace-wall-design', { Thot: 20 }], ['fastener-position-tolerance', { H: 9 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-seventh handbook pass (handbook43): eighteenth round of integrated design checks.
const HB27_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['investment-appraisal', {}, { A: 25000, pay: 4, euac: 90000 * 0.08 * 1.08 ** 6 / (1.08 ** 6 - 1) + 800 + 5000 }],
  ['air-leak-audit', {}, { pct: 65.21138031763928 * 0.06 / 50 * 100, repairCost: 750 }, 1e-6],
  ['two-point-lift-plan', {}, { M: 1950, X: 1200000 / 1950, RA: 1950 * (2000 - 1200000 / 1950) / 2000 }],
  ['rotor-run-up-time', {}, { J: 2.25 + 10 * 0.0225 / 8 + 0.05, t: (2.25 + 10 * 0.0225 / 8 + 0.05) * (2 * Math.PI * 1480 / 60) / 90 }],
  ['tensile-test-evaluation', {}, { el: 22, sy: 23000 / (25 * Math.PI), RA: (1 - 0.65 ** 2) * 100 }],
  ['brinell-test-check', {}, { d: 4.01, valid: 1 }],
  ['compressor-staging-check', {}, { pi: Math.sqrt(1.013 * 8.01325) }, 1e-9],
  ['spherical-vessel-design', {}, { thin: 60, treq: 2 * 600 * 2 / 1000 + 1, cap: Math.PI * 216 / 6 }],
  ['motor-efficiency-test', {}, { T: 70, Pin: Math.sqrt(3) * 415 * 19.5 * 0.85 }],
];
for (const [id, over, expected, tol] of HB27_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('eighteenth-round design checks agree with the tools they chain', () => {
  const ia = engine.run('investment-appraisal').values, ir = engine.run('irr-uneven', { P: 100000, hurdle: 8, cf1: 25000, cf2: 25000, cf3: 25000, cf4: 25000, cf5: 25000, cf6: 35000, cf7: 0, cf8: 0 }).values;
  near(ia.irr, ir.irr, 1e-6, 'IRR'); near(ia.npv, ir.npv, 1e-6, 'NPV');
  const bc = engine.run('benefit-cost-ratio', { P: 100000, B: 30000, C: 5000, S: 10000, n: 6, rate: 8 }).values;
  near(ia.bc, bc.bc, 1e-12, 'benefit–cost ratio'); near(ia.PVB, bc.PVB, 1e-9, 'PV of benefits');
  near(ia.ap, engine.run('interest-factors', { rate: 8, n: 6, m: 1, amount: 10000 }).values.AP, 1e-9, 'capital recovery factor');
  const la = engine.run('air-leak-audit').values, l1 = engine.run('air-leak-cost', { d: 1, p: 7, Cd: 0.65, Tair: 25, measured: 0, spec: 6.5, hours: 6000, price: 0.25 }).values, l3 = engine.run('air-leak-cost').values;
  near(la.per1, l1.Ls, 1e-12, 'flow through one small leak');
  near(la.Ls, 10 * l1.Ls + 4 * l3.Ls + engine.run('air-leak-cost', { d: 6 }).values.Ls, 1e-9, 'total leak flow');
  const lp = engine.run('two-point-lift-plan').values;
  near(lp.X, engine.run('combined-cg', { m1: 1200, x1: 0, y1: 0, z1: 0, m2: 450, x2: 2000, y2: 0, z2: 0, m3: 300, x3: 1000, y3: 0, z3: 0, m4: 0, x4: 0, y4: 0, z4: 0, m5: 0, x5: 0, y5: 0, z5: 0 }).values.X, 1e-9, 'centre of gravity');
  const sym = engine.run('two-point-lift-plan', { m1: 2000, x1: 1000, m2: 0, m3: 0, h: 1000 / Math.tan(Math.PI / 6) }).values;
  near(sym.TA, engine.run('sling-tension', { mass: 2000, legs: 2, angle: 30, wll: 1500 }).values.kg, 1e-9, 'symmetric leg tension');
  const rr = engine.run('rotor-run-up-time').values;
  near(rr.J1, engine.run('mass-moment-inertia', { shape: 'disc', mass: 50, dimA: 600, dimB: 0, offset: 0 }).values.J, 1e-12, 'disc inertia');
  const aa = engine.run('angular-acceleration-torque', { J: rr.J, n0: 0, n1: 1480, t: rr.t, Tf: 30 }).values;
  near(aa.T, 120, 1e-9, 'torque to accelerate in the run-up time'); near(aa.revs, rr.revs, 1e-9, 'revolutions');
  const tt = engine.run('tensile-test-evaluation').values;
  near(tt.uts, engine.run('true-stress-strain', { F: 33, A0: tt.A0, A: 0, l0: 50, l: 61, K: 530, nexp: 0.26 }).values.sN, 1e-9, 'tensile strength');
  const tf = engine.run('true-stress-strain', { F: 26, A0: tt.A0, A: tt.Af, l0: 50, l: 61, K: 530, nexp: 0.26 }).values;
  near(tt.sf, tf.sT, 1e-9, 'true fracture stress'); near(tt.RA, tf.RA, 1e-9, 'reduction of area');
  const bt = engine.run('brinell-test-check').values, bh = engine.run('brinell-hardness', { F: 3000, D: 10, d: 4.01 }).values;
  near(bt.HB, bh.HB, 1e-9, 'Brinell hardness'); near(bt.depth, bh.depth, 1e-12, 'depth'); near(bt.uts, bh.uts, 1e-9, 'tensile estimate');
  const cs = engine.run('compressor-staging-check').values;
  near(cs.P1s, engine.run('compressor-power', { Q: 10, p2: 7, p1: 1.013, stages: 1, k: 1.4, eff: 75 }).values.shaft, 1e-9, 'single-stage power');
  near(cs.P2s, engine.run('compressor-power', { Q: 10, p2: 7, p1: 1.013, stages: 2, k: 1.4, eff: 75 }).values.shaft, 1e-9, 'two-stage power');
  near(cs.Ti1, engine.run('gas-compression-process', { process: 'adi', p1: 1.013, V1: 100, T1: 20, p2: 7 + 1.01325, k: 1.4, n: 1.3 }).values.T2c, 1e-9, 'ideal discharge temperature');
  const sv = engine.run('spherical-vessel-design').values, ss = engine.run('spherical-shell', { di: 600, t: 5, p: 2, Sy: 250, req: 2 }).values;
  near(sv.thin, ss.thin, 1e-12, 'membrane stress'); near(sv.thick, ss.thick, 1e-9, 'thick-wall stress'); near(sv.n, ss.n, 1e-9, 'safety factor');
  const me = engine.run('motor-efficiency-test').values;
  near(me.Pout / 1000, engine.run('prony-brake', { L: 0.5, tare: 190, zero: 50, n: 1460 }).values.P / 1000, 1e-12, 'brake output');
  near(me.Pin / 1000, engine.run('motor-power', { mode: 'power', V: 415, kW: 11, I: 19.5, pf: 0.85, eff: 91, rpm: 1460 }).values.Pin, 1e-9, 'electrical input');
});

test('eighteenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('investment-appraisal', { S: 20000 }).text, 'INVESTMENT NOT JUSTIFIED');
  assert.equal(engine.run('investment-appraisal', { payMax: 3 }).text, 'INVESTMENT NOT JUSTIFIED');
  assert.equal(engine.run('air-leak-audit', { Qc: 20 }).text, 'LEAKAGE TOO HIGH');
  assert.equal(engine.run('two-point-lift-plan', { wll: 1400 }).text, 'RIGGING NOT ADEQUATE');
  assert.equal(engine.run('two-point-lift-plan', { h: 800 }).text, 'RIGGING NOT ADEQUATE');
  assert.equal(engine.run('rotor-run-up-time', { Tm: 40 }).text, 'START NOT ACCEPTABLE');
  assert.equal(engine.run('rotor-run-up-time', { starts: 20 }).text, 'START NOT ACCEPTABLE');
  assert.equal(engine.run('tensile-test-evaluation', { Lf: 59 }).text, 'DOES NOT MEET SPECIFICATION');
  assert.equal(engine.run('brinell-test-check', { thick: 3 }).text, 'TEST NOT VALID');
  assert.equal(engine.run('brinell-test-check', { d1: 3.5, d2: 3.5 }).text, 'OUT OF SPECIFICATION');
  assert.equal(engine.run('compressor-staging-check', { stages: '1' }).text, 'DISCHARGE TOO HOT');
  assert.equal(engine.run('spherical-vessel-design', { t: 2 }).text, 'SPHERE NOT ADEQUATE');
  assert.equal(engine.run('spherical-vessel-design', { Sy: 100 }).text, 'SPHERE NOT ADEQUATE');
  assert.equal(engine.run('motor-efficiency-test', { I: 21 }).text, 'EFFICIENCY BELOW RATING');
  const cases: Array<[string, Inputs]> = [['air-leak-audit', { n1: 0, n2: 0, n3: 0 }], ['two-point-lift-plan', { xA: 700 }], ['two-point-lift-plan', { xB: -1 }], ['rotor-run-up-time', { Tm: 20 }], ['tensile-test-evaluation', { df: 11 }], ['spherical-vessel-design', { t: 1 }], ['motor-efficiency-test', { tare: 40 }], ['motor-efficiency-test', { I: 10 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-eighth handbook pass (handbook44): nineteenth round of integrated design checks.
const HB28_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['gyroscopic-bearing-load', {}, { J: 0.4, Om: 0.5, Tg: 0.4 * 100 * Math.PI * 0.5, Wb: 20 * 9.80665 / 2 }],
  ['gyroscopic-bearing-load', { pmode: 'rpm' }, { Om: 2 * Math.PI * 10 / 60 }],
  ['centrifugal-attachment-check', {}, { Fos: 7402.203300817018 * 1.44 }, 1e-6],
  ['ratchet-pawl-design', {}, { Ft: 200 * 2000 / 150.65173459301312, tau: 200 * 2000 / 150.65173459301312 / (Math.PI * 25) }, 1e-6],
  ['torsion-member-comparison', {}, { mT: 7850 * Math.PI * (1600 - 1156) / 4 / 1e6, mR: 6.28 }],
  ['inertia-matching-ratio', {}, { iOpt: Math.sqrt(2 / (0.9 * 0.0012)), iMaxSpeed: 20, iBest: 20 }],
  ['bolt-preload-verification', {}, { Ft: 0.75 * 600 * Math.PI / 4 * (20 - 0.938194 * 2.5) ** 2 }],
  ['spindle-speed-range-design', {}, { R: 50, zNeed: 18 }],
  ['vacuum-tube-design', {}, { Dt: 100 / 1.5, pcr: 2 * 200000 / 0.91 * (1.5 / 98.5) ** 3 }],
  ['journal-bearing-oil-check', { rho: 1000 }, { mu: 20.62274755695607 }, 1e-6],
];
for (const [id, over, expected, tol] of HB28_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('nineteenth-round design checks agree with the tools they chain', () => {
  const gb = engine.run('gyroscopic-bearing-load').values, gp = engine.run('gyroscope-precession', { shape: 'disc', M: 20, R: 0.2, J: 0.4, ns: 3000, np: gb.npEq, L: 300 }).values;
  near(gb.H, gp.H, 1e-12, 'angular momentum'); near(gb.Tg, gp.Tg, 1e-9, 'gyroscopic couple'); near(gb.F, gp.F, 1e-9, 'bearing reaction');
  const ca = engine.run('centrifugal-attachment-check').values;
  near(ca.F, engine.run('centrifugal-force', { mass: 2, radius: 150, rpm: 1500 }).values.F, 1e-9, 'centrifugal force');
  near(engine.run('centrifugal-attachment-check', { rpm: ca.nLim, os: 1 }).values.sOs, 200, 1e-9, 'limiting speed reaches the allowable');
  const rp = engine.run('ratchet-pawl-design').values, rw = engine.run('ratchet-wheel-pitch', { M: 200, L: 25, S: 20, Nt: 16 }).values;
  for (const k of ['F', 'P', 'D']) near(rp[k], rw[k], 1e-12, `ratchet ${k}`);
  const tm = engine.run('torsion-member-comparison').values;
  const so = engine.run('shaft-torsion', { outer: 30, inner: 0, length: 500, torque: 200, modulus: 79300 }).values, tu = engine.run('shaft-torsion', { outer: 40, inner: 34, length: 500, torque: 200, modulus: 79300 }).values, rb = engine.run('rect-bar-torsion', { T: 200, b: 40, c: 20, L: 500, G: 79.3, allow: 100 }).values;
  near(tm.tS, so.stress, 1e-9, 'solid stress'); near(tm.twS, so.degrees, 1e-9, 'solid twist'); near(tm.tT, tu.stress, 1e-9, 'tube stress'); near(tm.twT, tu.degrees, 1e-9, 'tube twist');
  near(tm.tR, rb.tau, 1e-12, 'rectangle stress'); near(tm.twR, rb.twist, 1e-9, 'rectangle twist');
  const im = engine.run('inertia-matching-ratio').values, ri = engine.run('reflected-inertia').values;
  for (const k of ['Jr', 'ratio', 'nm', 'alpha', 'Ta', 'Tl', 'Tm']) near(im[k], ri[k], 1e-12, `inertia ${k}`);
  near(im.TmBest, engine.run('reflected-inertia', { i: 20 }).values.Tm, 1e-9, 'torque at the best usable ratio');
  const bp = engine.run('bolt-preload-verification').values, bs = engine.run('bolt-stretch', { d: 20, P: 2.5, grip: 80, Lt: 20, Eb: 207, Em: 207, F: bp.F / 1000 }).values;
  near(bs.db, 0.15, 1e-9, 'stretch of that preload'); near(bp.angle, bs.angle, 1e-9, 'turn angle'); near(bp.kb, bs.kb, 1e-6, 'bolt stiffness');
  near(engine.run('bolt-torque-preload', { mode: 'preload', d: 20, P: 2.5, K: bp.K, Sp: 600, pct: 75, T: 480 }).values.F, bp.F, 1e-6, 'torque and nut factor give the preload');
  const sd = engine.run('spindle-speed-range-design').values;
  near(sd.phi, engine.run('speed-series', { min: sd.nmin, max: sd.nmax, steps: 18 }).values.phi, 1e-12, 'step ratio');
  const vt = engine.run('vacuum-tube-design').values, tc = engine.run('tube-collapse', { D: 100, t: 1.5, E: 200, nu: 0.3, Sy: 250, p: 0.5, req: 3 }).values;
  near(vt.pcr, tc.pcr, 1e-12, 'elastic collapse'); near(vt.py, tc.py, 1e-12, 'yield pressure'); near(vt.n, tc.n, 1e-12, 'safety factor');
  near(engine.run('vacuum-tube-design', { t: vt.tReq }).values.n, 3, 1e-6, 'wall needed meets the factor');
  const jo = engine.run('journal-bearing-oil-check').values, ov = engine.run('oil-viscosity-temperature', { T1: 40, v1: 46, T2: 100, v2: 6.8, T: 60 }).values, pe = engine.run('journal-bearing-petroff', { d: 50, L: 50, c: 0.04, mu: jo.mu, rpm: 1500, W: 5000 }).values;
  near(jo.nu, ov.nu, 1e-12, 'viscosity at temperature'); near(jo.S, pe.S, 1e-12, 'Sommerfeld number'); near(jo.Tf, pe.T, 1e-12, 'friction torque'); near(jo.Ploss, pe.Ploss, 1e-9, 'power loss');
});

test('nineteenth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('gyroscopic-bearing-load', { ns: 15000 }).text, 'BEARINGS OVERLOADED');
  assert.equal(engine.run('gyroscopic-bearing-load', { allow: 200 }).text, 'BEARINGS OVERLOADED');
  assert.equal(engine.run('centrifugal-attachment-check', { rpm: 3000 }).text, 'ATTACHMENT OVERSTRESSED');
  assert.equal(engine.run('centrifugal-attachment-check', { nb: 1 }).text, 'ATTACHMENT OVERSTRESSED');
  assert.equal(engine.run('ratchet-pawl-design', { h: 1 }).text, 'RATCHET NOT ADEQUATE');
  assert.equal(engine.run('ratchet-pawl-design', { dp: 5 }).text, 'RATCHET NOT ADEQUATE');
  assert.equal(engine.run('torsion-member-comparison', { sel: 'rect', allow: 45 }).text, 'SECTION NOT ADEQUATE');
  assert.equal(engine.run('torsion-member-comparison', { sel: 'solid', twMax: 1.5 }).text, 'SECTION NOT ADEQUATE');
  assert.equal(engine.run('inertia-matching-ratio', { i: 30 }).text, 'RATIO NOT SUITABLE');
  assert.equal(engine.run('inertia-matching-ratio', { Tpk: 8 }).text, 'RATIO NOT SUITABLE');
  assert.equal(engine.run('bolt-preload-verification', { dl: 0.12 }).text, 'PRELOAD OUT OF TOLERANCE');
  assert.equal(engine.run('bolt-preload-verification', { dl: 0.2 }).text, 'PRELOAD OUT OF TOLERANCE');
  assert.equal(engine.run('spindle-speed-range-design', { z: 12 }).text, 'STEPS TOO COARSE');
  assert.equal(engine.run('vacuum-tube-design', { t: 1.5 }).text, 'WALL TOO THIN');
  assert.equal(engine.run('journal-bearing-oil-check', { Top: 100 }).text, 'OIL NOT SUITABLE');
  assert.equal(engine.run('journal-bearing-oil-check', { c: 0.1 }).text, 'OIL NOT SUITABLE');
  const cases: Array<[string, Inputs]> = [['ratchet-pawl-design', { h: 40 }], ['torsion-member-comparison', { t: 25 }], ['bolt-preload-verification', { Lt: 100 }], ['spindle-speed-range-design', { dmax: 10 }], ['vacuum-tube-design', { t: 0.4 }], ['journal-bearing-oil-check', { T2: 40 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Twenty-ninth handbook pass (handbook45): twentieth round of integrated design checks.
const HB29_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['air-main-sizing', {}, { dBest: 50, V: 2 * 1.01325 / 1.5 }],
  ['anodizing-plan', {}, { I: 75, heat: 1.35, loads: 20 }],
  ['repair-or-replace', { aD: 10000, gD: 1000 }, { keep: 1 }],
  ['make-or-buy', {}, { vM: 10, vB: 12.5, q0: 1800, make: 1, save: 500 }],
  ['block-and-tackle-check', {}, { eta: (1 - 0.96 ** 4) / (4 * 0.04), ideal: 500 * 9.80665 / 4 }],
  ['restrained-bar-thermal-check', {}, { sig: 96, dTy: 250 / 2.4, lam: 100 }],
  ['buffer-stop-design', {}, { E: 1000, Fpk: 1000 / (0.9 * 0.1) }],
  ['buffer-stop-design', { type: 'spring' }, { Fpk: 20000 }],
  ['gas-vessel-temperature-check', {}, { P2: 201.013 * 333.15 / 293.15, pFill: 231.013 * 293.15 / 333.15 - 1.013 }],
  ['blow-off-nozzle-cost', {}, { choked: 1 }],
];
for (const [id, over, expected, tol] of HB29_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twentieth-round design checks agree with the tools they chain', () => {
  const am = engine.run('air-main-sizing').values, ap = engine.run('air-pipe-drop', { Q: 5, d: 50, L: 100, p: 7, T: 25, eps: 0.045 }).values;
  near(am.vel, ap.vel, 1e-12, 'air velocity'); near(am.dp, ap.dp, 1e-12, 'pressure drop'); near(am.f, ap.f, 1e-12, 'friction factor');
  near(am.V, engine.run('air-receiver', { deficit: 2, t: 1, p1: 8, p2: 6.5, Vactual: 2 }).values.V, 1e-12, 'receiver volume');
  assert.ok(engine.run('air-pipe-drop', { Q: 5, d: 40, L: 100, p: 7, T: 25, eps: 0.045 }).values.vel > 8, 'the next smaller bore breaks the velocity limit');
  const an = engine.run('anodizing-plan').values, at = engine.run('anodizing-time', { J: 1.5, thick: 20, area: 50, eff: 100 }).values;
  for (const k of ['rate', 'minutes', 'build', 'I']) near(an[k], at[k], 1e-12, `anodizing ${k}`);
  const rr = engine.run('repair-or-replace', { gD: 0 }).values, ec = engine.run('euac-compare', { rate: 8, pA: 15000, aA: 14000, sA: 3000, nA: 4, pB: 80000, aB: 6000, sB: 10000, nB: 10 }).values;
  near(rr.eD, ec.eA, 1e-9, 'defender EUAC without gradient'); near(rr.eC, ec.eB, 1e-9, 'challenger EUAC');
  near(engine.run('repair-or-replace').values.agD, engine.run('interest-factors', { rate: 8, n: 4, m: 1, amount: 10000 }).values.AG, 1e-9, 'gradient factor');
  const mb = engine.run('make-or-buy').values, pb = engine.run('process-breakeven', { sA: 6000, cA: 10, sB: 1500, cB: 12.5, qty: 2000 }).values;
  near(mb.q0, pb.q0, 1e-9, 'break-even quantity'); near(mb.tM, pb.tA, 1e-9, 'make total'); near(mb.tB, pb.tB, 1e-9, 'buy total');
  const bt = engine.run('block-and-tackle-check').values;
  near(bt.F, engine.run('hoist-advantage', { type: 'block', W: bt.W, R: 150, r: 135, g1: 4, g2: 1, n: 4, crank: 300, eff: bt.eta * 100 }).values.F, 1e-9, 'pull with the reeving efficiency');
  const rb = engine.run('restrained-bar-thermal-check').values, ts = engine.run('thermal-stress', { E: 200, alpha: 12, dT: 40, restraint: 100, A: rb.A, Sy: 250 }).values;
  near(rb.sig, Math.abs(ts.stress), 1e-9, 'thermal stress'); near(rb.Fth, Math.abs(ts.force), 1e-6, 'restraint force');
  near(rb.nb, engine.run('column-buckling', { E: 200, Sy: 250, A: rb.A, I: rb.I, L: 2000, K: 0.5, P: rb.Fth, req: 1.5 }).values.n, 1e-9, 'buckling factor');
  near(engine.run('restrained-bar-thermal-check', { dT: rb.dTb }).values.nb, 1, 1e-9, 'buckling temperature gives a factor of one');
  const bs = engine.run('buffer-stop-design', { type: 'spring' }).values, il = engine.run('impact-load', { mode: 'moving', mass: 2000, height: 300, speed: 1, stop: 100 }).values;
  near(bs.E, il.E, 1e-9, 'impact energy'); near(bs.Fpk, il.Fpeak, 1e-9, 'spring buffer peak force');
  near(engine.run('buffer-stop-design', { s: engine.run('buffer-stop-design').values.sNeed }).values.ag, 1, 1e-6, 'stroke needed meets the deceleration limit');
  const gv = engine.run('gas-vessel-temperature-check').values;
  near(engine.run('gas-law', { V1: 50, p1: 200, T1: 20, p2: gv.p2, T2: 60, patm: 1.013 }).values.V2, 50, 1e-9, 'constant volume');
  const bo = engine.run('blow-off-nozzle-cost').values, ea = engine.run('escaping-air-velocity', { p1: 6, p2: 1.01325, T: 21, k: 1.4, d: 2, Cd: 0.65 }).values;
  near(bo.mdot, ea.mdot, 1e-12, 'mass flow'); near(bo.Qper, ea.Q, 1e-9, 'free-air flow per opening'); near(bo.vJet, ea.vOr, 1e-9, 'jet velocity');
});

test('twentieth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('air-main-sizing', { d: 40 }).text, 'MAIN TOO SMALL');
  assert.equal(engine.run('anodizing-plan', { np: 70 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('anodizing-plan', { chill: 1 }).text, 'PLAN NOT FEASIBLE');
  assert.equal(engine.run('repair-or-replace').text, 'REPLACE THE MACHINE');
  assert.equal(engine.run('repair-or-replace', { aD: 10000, gD: 1000 }).text, 'KEEP THE OLD MACHINE');
  assert.equal(engine.run('make-or-buy', { qty: 1000 }).text, 'BUY FROM SUPPLIER');
  assert.equal(engine.run('block-and-tackle-check', { op: 'hand' }).text, 'TACKLE NOT ADEQUATE');
  assert.equal(engine.run('block-and-tackle-check', { MBL: 5 }).text, 'TACKLE NOT ADEQUATE');
  assert.equal(engine.run('restrained-bar-thermal-check', { dT: 60 }).text, 'BAR NOT ADEQUATE');
  assert.equal(engine.run('restrained-bar-thermal-check', { Sy: 120 }).text, 'BAR NOT ADEQUATE');
  assert.equal(engine.run('buffer-stop-design', { v: 2 }).text, 'BUFFER NOT ADEQUATE');
  assert.equal(engine.run('buffer-stop-design', { type: 'spring', s: 50 }).text, 'BUFFER NOT ADEQUATE');
  assert.equal(engine.run('gas-vessel-temperature-check', { T2: 80 }).text, 'EXCEEDS RATING');
  assert.equal(engine.run('blow-off-nozzle-cost', { n: 200 }).text, 'EXCEEDS COMPRESSOR CAPACITY');
  const cases: Array<[string, Inputs]> = [['air-main-sizing', { p2: 9 }], ['blow-off-nozzle-cost', { p1: 0, p2: 1.5 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirtieth handbook pass (handbook46): twenty-first round of integrated design checks.
const HB30_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['tank-calibration-chart', {}, { Vh: 0.5 * Math.PI * 160000 * (1800 - 400) / 3 / 1e6, headFull: 0.5 * Math.PI * 1440000 * 600 / 3 / 1e6 }],
  ['tank-calibration-chart', { head: 'flat', h: 1200 }, { Vh: 0, V: Math.PI * 360000 * 3000 / 1e6, pct: 100 }],
  ['guillotine-shear-check', {}, { E: 300 * 1000 * 3 * 1.8 / 1000, P: 1.62 * 20 / 60 / 0.7 }],
  ['machine-axis-error-budget', {}, { therm: 0.5 * 11.5 * 5 * 0.2, allow: 25 }],
  ['plastic-gear-drive-check', {}, { a: 67.5, dj: -2 * Math.tan(Math.PI / 9) * 67.5 * (80e-6 * 40 + 0.002 - 23e-6 * 40) }],
  ['set-screw-hub-check', {}, { Treq: 2237 / (2 * Math.PI * 1000 / 60) * 1.5, nReq: 2 }],
  ['tank-wall-panel-check', {}, { pb: 19613.3, W: 0.0196133 * 600000 }],
  ['crane-wheel-rail-check', {}, { pMean: 2.5, Fw: 125, Ftot: 500, P: 250 }],
  ['bar-stock-plan', {}, { yieldPct: 25400 / 30480 * 100, hours: (45000 + 600) / 3600 }],
  ['stockpile-haulage-plan', {}, { loads: 8, passes: 51 }],
];
for (const [id, over, expected, tol] of HB30_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-first-round design checks agree with the tools they chain', () => {
  const tc = engine.run('tank-calibration-chart').values;
  near(tc.Vs, engine.run('tank-volume', { orient: 'h', diameter: 1200, length: 3000, depth: 400 }).values.litres, 1e-9, 'shell volume at the dip');
  near(tc.full, engine.run('vessel-head-volume', { D: 1200, L: 3000, head: 'ell', heads: 2, coneAngle: 30 }).values.total, 1e-9, 'full capacity with ellipsoidal heads');
  near(engine.run('tank-calibration-chart', { head: 'hemi' }).values.full, engine.run('vessel-head-volume', { D: 1200, L: 3000, head: 'hemi', heads: 2, coneAngle: 30 }).values.total, 1e-9, 'full capacity with hemispherical heads');
  const gs = engine.run('guillotine-shear-check').values, sb = engine.run('shearing-blade-force').values;
  near(gs.F, sb.F, 1e-9, 'shearing force'); near(gs.FM, sb.FM, 1e-9, 'machine force');
  near(engine.run('guillotine-shear-check', { T: gs.Tmax }).values.FM, 300000, 1e-6, 'thickest sheet reaches the capacity');
  const ab = engine.run('machine-axis-error-budget').values;
  near(ab.abbe, engine.run('abbe-error', { offset: 100, tilt: 5, tolerance: 0.05 }).values.error * 1000, 1e-12, 'Abbe error');
  near(engine.run('machine-axis-error-budget', { comp: 0 }).values.therm, engine.run('thermal-growth', { length: 500, alpha: 11.5, initial: 20, final: 25 }).values.growth * 1000, 1e-9, 'thermal growth');
  const pg = engine.run('plastic-gear-drive-check').values;
  near(pg.kW, engine.run('plastic-gear-power', { type: 'spur', F: 10, Y: 0.308, m: 1.5, Ss: 40, d: 45, rpm: 600, Cs: 1.25, C: 60 }).values.kW, 1e-12, 'plastic gear rating');
  const dry = engine.run('plastic-gear-drive-check', { swell: 0 }).values;
  near(dry.gGrow - dry.hGrow, engine.run('plastic-thermal-mismatch', { am: 23, ap: 80, emode: 'entered', Ep: 2000, sc: 10, ec: 1, dT: 40, L: 67.5, allow: 20 }).values.dLrel, 1e-12, 'thermal mismatch over the centre distance');
  const sh = engine.run('set-screw-hub-check').values, ss = engine.run('set-screw-holding', { D: 25.4, d: 12.7, rpm: 1000, P: 2.237 }).values;
  near(sh.T1, ss.T, 1e-9, 'torque per screw'); near(sh.Fh, ss.Fh, 1e-9, 'holding force'); near(sh.kW1, ss.kW, 1e-12, 'power per screw');
  const tw = engine.run('tank-wall-panel-check').values, hf = engine.run('hydrostatic-force', { h: 2, rho: 1000, w: 3, floor: 6, ps: 0 }).values, rp = engine.run('rectangular-plate', { case: 'rect-ss', L: 1000, l: 600, t: 7, p: 19.6133, W: 5000, r0: 25, E: 200, allow: 160 }).values;
  near(tw.pb, hf.pb, 1e-9, 'floor pressure'); near(tw.F, hf.F, 1e-9, 'wall force'); near(tw.y, hf.y, 1e-12, 'centre of pressure');
  near(tw.S, rp.S, 1e-9, 'panel stress'); near(tw.d, rp.d, 1e-9, 'panel deflection');
  near(engine.run('tank-wall-panel-check', { t: tw.tReq }).values.S, 160, 1e-9, 'thickness needed meets the allowable');
  const cw = engine.run('crane-wheel-rail-check').values, hc = engine.run('hertz-contact', { geom: 'cyl', R1: 200, R2: 0, F: 50000, L: 50, E1: 210, nu1: 0.3, E2: 210, nu2: 0.3, allow: 1500 }).values;
  near(cw.size, hc.size, 1e-12, 'contact half-width'); near(cw.p0, hc.p0, 1e-9, 'peak contact pressure');
  near(cw.Fw, engine.run('rolling-resistance', { W: 50000, r: 200, f: 0.5, v: 0.5, mu: 0.15 }).values.F, 1e-12, 'rolling resistance');
  const bp = engine.run('bar-stock-plan').values, sm = engine.run('screw-machine-stock').values;
  for (const k of ['perBar', 'bars', 'stockM', 'mass']) near(bp[k], sm[k], 1e-12, `bar stock ${k}`);
  const sp = engine.run('stockpile-haulage-plan').values, sw = engine.run('stockpile-weight', { shape: 'circle', D: 10, A: 3, B: 6, theta: 35, rho: 1600 }).values;
  for (const k of ['h', 'V', 'mass']) near(sp[k], sw[k], 1e-9, `stockpile ${k}`);
});

test('twenty-first-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('guillotine-shear-check', { T: 8 }).text, 'SHEAR CANNOT CUT IT');
  assert.equal(engine.run('guillotine-shear-check', { b: 3000 }).text, 'SHEAR CANNOT CUT IT');
  assert.equal(engine.run('guillotine-shear-check', { cpm: 200 }).text, 'SHEAR CANNOT CUT IT');
  assert.equal(engine.run('machine-axis-error-budget').text, 'CAPABLE WORST CASE');
  assert.equal(engine.run('machine-axis-error-budget', { fix: 12 }).text, 'CAPABLE STATISTICALLY');
  assert.equal(engine.run('machine-axis-error-budget', { comp: 0 }).text, 'NOT CAPABLE');
  assert.equal(engine.run('plastic-gear-drive-check', { j0: 0.15 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('plastic-gear-drive-check', { Preq: 200 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('set-screw-hub-check', { P: 5 }).text, 'SET SCREWS WILL SLIP');
  assert.equal(engine.run('set-screw-hub-check', { Fax: 4000 }).text, 'SET SCREWS WILL SLIP');
  assert.equal(engine.run('tank-wall-panel-check', { t: 5 }).text, 'PANEL NOT ADEQUATE');
  assert.equal(engine.run('tank-wall-panel-check', { h: 4 }).text, 'PANEL NOT ADEQUATE');
  assert.equal(engine.run('crane-wheel-rail-check', { W: 300 }).text, 'WHEEL NOT ADEQUATE');
  assert.equal(engine.run('crane-wheel-rail-check', { b: 20 }).text, 'WHEEL NOT ADEQUATE');
  assert.equal(engine.run('bar-stock-plan', { rem: 1000 }).text, 'YIELD TOO LOW');
  assert.equal(engine.run('stockpile-haulage-plan', { qAllow: 50 }).text, 'GROUND OVERLOADED');
  const cases: Array<[string, Inputs]> = [['tank-calibration-chart', { h: 1300 }], ['plastic-gear-drive-check', { type: 'bevel', C: 5 }], ['tank-wall-panel-check', { l: 1200 }], ['bar-stock-plan', { bar: 120 }], ['stockpile-haulage-plan', { shape: 'rect', A: 30 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-first handbook pass (handbook47): twenty-second round of integrated design checks.
const HB31_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['melt-furnace-batch-plan', {}, { Q: 500 * (0.9 * 640 + 397 + 1.18 * 60), melts: 6, perShift: 3000 }],
  ['vickers-test-check', {}, { d: 0.301, HV: 1.8544 * 10 / 0.301 ** 2, tmin: 0.4515 }],
  ['gear-mesh-interference-check', {}, { db1: 20 * Math.cos(Math.PI / 9), db2: 40 * Math.cos(Math.PI / 9) }],
  ['finish-turning-setup', {}, { Ra: 1.6, n: 250000 / (Math.PI * 50) }],
  ['coolant-tank-maintenance', {}, { conc: 6.4, cm: 7 * 5 / 15, month: 15 * 7 / 3 / 100 * 22 }],
  ['compound-angle-sine-setup', { A: 0 }, { Bp: 30, H1: 0, H2: 100 }],
  ['dovetail-inspection', {}, { k: 1 + Math.sqrt(3), contact: 7.5 }],
  ['gear-tooth-caliper-setting', { jnMin: 0, jnMax: 0 }, { sHi: 3 * Math.PI / 2, sLo: 3 * Math.PI / 2 }],
  ['perforated-plate-design', {}, { lig: 3, Fhit: 20 * Math.PI * 5 * 1.5 * 300 * 1.2 }],
];
for (const [id, over, expected, tol] of HB31_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-second-round design checks agree with the tools they chain', () => {
  const mf = engine.run('melt-furnace-batch-plan').values, me = engine.run('melting-energy', { mass: 500, T0: 20, Tm: 660, Tp: 720, cs: 0.9, L: 397, cl: 1.18, P: 250, eff: 60, price: 0.25 }).values;
  for (const k of ['Q', 'kWh', 'drawn', 'hours']) near(mf[k], me[k], 1e-9, `melting ${k}`);
  const vt = engine.run('vickers-test-check').values, vk = engine.run('vickers-knoop-hardness', { type: 'hv', F: 10, d: 0.301 }).values;
  near(vt.HV, vk.H, 1e-9, 'Vickers hardness'); near(vt.depth, vk.depth, 1e-12, 'indentation depth'); near(vt.tmin, vk.tmin, 1e-12, 'least thickness');
  const gm = engine.run('gear-mesh-interference-check').values, sc = engine.run('spur-contact-diameters').values;
  near(gm.dc1, sc.dc1, 1e-9, 'pinion contact start'); near(gm.dc2, sc.dc2, 1e-9, 'gear contact start');
  near(gm.eps, engine.run('contact-ratio', { m: 1, z1: 20, z2: 40, alpha: 20, x1: 0, x2: 0 }).values.eps, 1e-9, 'contact ratio');
  const ft = engine.run('finish-turning-setup').values, ff = engine.run('feed-for-finish', { mode: 'feed', R: 0.8, Ra: 1.6 }).values, nr = engine.run('nose-radius-compensation', { r: 0.8, angle: 45 }).values;
  near(ft.fDes, ff.f, 1e-12, 'feed for the finish'); near(ft.Rt, ff.Rt, 1e-9, 'peak-to-valley height');
  for (const k of ['dz', 'dx', 'err']) near(ft[k], nr[k], 1e-12, `nose radius ${k}`);
  near(ft.t, engine.run('turning-time', { rpm: ft.n, feed: ft.f, length: 82, passes: 1, diameter: 50 }).values.minutes, 1e-12, 'finishing time');
  const ct = engine.run('coolant-tank-maintenance').values, rc = engine.run('refractometer-concentration', { brix: 4, factor: 1.6, target: 7, volume: 400 }).values;
  near(ct.conc, rc.conc, 1e-12, 'concentration'); near(ct.add, rc.add, 1e-9, 'concentrate to add');
  const cs = engine.run('compound-angle-sine-setup').values, ca = engine.run('compound-angle', { angleA: 20, angleB: 30 }).values;
  near(cs.compound, ca.compound, 1e-9, 'compound angle'); near(cs.direction, ca.direction, 1e-9, 'direction');
  near(cs.H1, engine.run('sine-bar', { length: 200, angle: 20 }).values.height, 1e-9, 'lower plate stack');
  near(cs.H2, engine.run('sine-bar', { length: 200, angle: cs.Bp }).values.height, 1e-9, 'upper plate stack');
  const dv = engine.run('dovetail-inspection').values, dm = engine.run('dovetail-measurement', { type: 'male', angle: 60, width: 50, rod: 10, depth: 12 }).values;
  near(dv.M, dm.reading, 1e-9, 'reading at nominal'); near(dv.k, dm.factor, 1e-12, 'rod factor'); near(dv.contact, dm.contact, 1e-12, 'rod contact');
  near(engine.run('dovetail-inspection', { Mmeas: dv.Mhi }).values.wMeas, 50.05, 1e-9, 'upper reading gives the upper width');
  near(engine.run('dovetail-inspection', { type: 'female', Mmeas: engine.run('dovetail-measurement', { type: 'female', angle: 60, width: 50, rod: 10, depth: 12 }).values.reading }).values.wMeas, 50, 1e-9, 'female reading gives the width');
  const gc = engine.run('gear-tooth-caliper-setting', { jnMin: 0, jnMax: 0 }).values, ch = engine.run('chordal-tooth', { m: 3, z: 30, a: 3 }).values;
  near(gc.tcHi, ch.tc, 1e-9, 'chordal thickness without backlash'); near(gc.acHi, ch.ac, 1e-9, 'chordal addendum');
  near(engine.run('gear-tooth-caliper-setting').values.sHi, 3 * Math.PI / 2 - 0.5 * 0.08 / Math.cos(Math.PI / 9), 1e-12, 'thinning for the least backlash');
  near(engine.run('gear-tooth-caliper-setting', { tipMeas: 96.2 }).values.tipCorr, 0.1, 1e-12, 'tip correction');
  const pp = engine.run('perforated-plate-design').values, po = engine.run('perforated-open-area', { pattern: 'stag60', d: 5, p: 8, A: 2, t: 1.5, rho: 7850 }).values;
  for (const k of ['OA', 'perM2', 'mass']) near(pp[k], po[k], 1e-9, `perforated ${k}`);
  near(pp.Fhit, 20 * engine.run('punching-force', { perimeter: Math.PI * 5, thickness: 1.5, strength: 300, factor: 1.2 }).values.adjusted, 1e-6, 'force per hit');
  near(engine.run('perforated-plate-design', { d: pp.dReq }).values.OA, 35, 1e-9, 'hole for the target gives the open area');
});

test('twenty-second-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('melt-furnace-batch-plan').text, 'DEMAND MET');
  assert.equal(engine.run('melt-furnace-batch-plan', { demand: 4000 }).text, 'DEMAND NOT MET');
  assert.equal(engine.run('vickers-test-check').text, 'WITHIN SPECIFICATION');
  assert.equal(engine.run('vickers-test-check', { thick: 0.4 }).text, 'TEST NOT VALID');
  assert.equal(engine.run('vickers-test-check', { space: 0.8 }).text, 'TEST NOT VALID');
  assert.equal(engine.run('vickers-test-check', { d2: 0.33 }).text, 'TEST NOT VALID');
  assert.equal(engine.run('vickers-test-check', { d1: 0.25, d2: 0.25 }).text, 'OUT OF SPECIFICATION');
  assert.equal(engine.run('gear-mesh-interference-check', { tif1: 19 }).text, 'MESH PROBLEM');
  assert.equal(engine.run('gear-mesh-interference-check', { epsMin: 1.7 }).text, 'MESH PROBLEM');
  assert.equal(engine.run('finish-turning-setup', { fCh: 0.3 }).text, 'FEED TOO COARSE');
  assert.equal(engine.run('coolant-tank-maintenance', { brix: 3 }).text, 'ADJUST CONCENTRATION');
  assert.equal(engine.run('coolant-tank-maintenance', { brix: 5 }).text, 'ADJUST CONCENTRATION');
  assert.equal(engine.run('compound-angle-sine-setup', { A: 50 }).text, 'ANGLE BEYOND PLATE LIMIT');
  assert.equal(engine.run('dovetail-inspection').text, 'ACCEPT');
  assert.equal(engine.run('dovetail-inspection', { Mmeas: 77.45 }).text, 'REJECT');
  assert.equal(engine.run('dovetail-inspection', { rod: 20 }).text, 'ROD SIZE UNSUITABLE');
  assert.equal(engine.run('gear-tooth-caliper-setting', { tcMeas: 4.7 }).text, 'REJECT');
  assert.equal(engine.run('perforated-plate-design', { nHit: 40 }).text, 'DESIGN NOT FEASIBLE');
  assert.equal(engine.run('perforated-plate-design', { p: 6 }).text, 'DESIGN NOT FEASIBLE');
  const cases: Array<[string, Inputs]> = [['melt-furnace-batch-plan', { Tp: 600 }], ['vickers-test-check', { hvMax: 150 }], ['gear-mesh-interference-check', { do1: 18 }], ['dovetail-inspection', { tolU: -0.1 }], ['gear-tooth-caliper-setting', { jnMax: 0.05 }], ['perforated-plate-design', { d: 9 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-second handbook pass (handbook48): twenty-third round of integrated design checks.
const HB32_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['water-line-design-check', {}, { vel: 0.005 / (Math.PI * 0.0009), lift: 998 * 9.80665 * 10 / 1e5 }],
  ['pipe-run-expansion-check', {}, { growth: 90, sig: 360, delta: 45 }],
  ['pivot-pin-retention-check', {}, { M: 110000, Ps: Math.PI * 20 * 1.2 * 1000 / 3, PG: Math.PI * 20 * 0.5 * 400 / 3 }],
  ['maintenance-interval-plan', { Tuse: 8000 }, { R: Math.exp(-1), T: 8000 }],
  ['process-change-trial', {}, { nRaw: 2 * ((1.96 + 0.8416) * 2.2 / 2) ** 2, nPlan: 19, diff: 2.2 }],
  ['timber-order-plan', {}, { qtyOrder: 220, vol: 2.1384, cost: 2.1384 * 650, MC: 18, trips: 1 }],
  ['orifice-restrictor-design', {}, { dUse: 1, dT: 70e5 / (870 * 1880) }],
  ['machine-levelling-wedge-check', {}, { W: 4000 * 9.80665 * 0.35, travel: 5 / Math.tan(Math.PI / 30) }],
  ['ramp-winch-pull-check', {}, { mue: 0.008, P: 0.25 * 2000 * 9.80665 * (Math.sin(Math.PI / 18) + 0.008 * Math.cos(Math.PI / 18)) }],
];
for (const [id, over, expected, tol] of HB32_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-third-round design checks agree with the tools they chain', () => {
  const wl = engine.run('water-line-design-check').values, pf = engine.run('pipe-friction', { Q: 300, d: 60, L: 120, nu: 1, rho: 998, eps: 0.045, K: 8 }).values;
  near(wl.vel, pf.vel, 1e-12, 'velocity'); near(wl.f, pf.f, 1e-12, 'friction factor'); near(wl.dp, pf.dp, 1e-12, 'friction loss');
  const vs = engine.run('valve-closure-surge', { dv: wl.vel, L: 120, tc: 2, D: 60, t: 3.7, E: 200, K: 2.2, rho: 998, p: 6, rating: 16 }).values;
  near(wl.a, vs.a, 1e-9, 'wave speed'); near(wl.surge, vs.dp, 1e-12, 'surge'); near(wl.ptot, vs.ptot, 1e-12, 'peak pressure');
  near(wl.dmin, engine.run('pipe-size-velocity', { Q: 300, v: 2, dActual: 60 }).values.dmin, 1e-12, 'smallest bore');
  const pe = engine.run('pipe-run-expansion-check').values, pl = engine.run('pipe-expansion-loop', { L: 50, alpha: 12, dT: 150, OD: 114.3, wt: 6.02, E: 200, Sa: 150, type: 'U' }).values;
  for (const k of ['growth', 'sig', 'Fa', 'delta']) near(pe[k], pl[k], 1e-9, `expansion ${k}`);
  near(pe.legReq, pl.leg, 1e-9, 'leg needed');
  near(pe.Fa, Math.abs(engine.run('thermal-stress', { E: 200, alpha: 12, dT: 150, restraint: 100, A: pe.A, Sy: 250 }).values.force), 1e-6, 'restrained force');
  near(engine.run('pipe-run-expansion-check', { leg: pe.legReq }).values.sLeg, 150, 1e-9, 'leg needed meets the allowable stress');
  near(engine.run('pipe-run-expansion-check', { T1: 170, T2: 20 }).values.growth, 90, 1e-9, 'cooling gives the same movement');
  const pp = engine.run('pivot-pin-retention-check').values, cp = engine.run('clevis-pin-joint').values, rr = engine.run('retaining-ring-thrust', { D: 20, t: 1.2, dg: 0.5, Ss: 1000, Sy: 400, Sc: 300, K: 3, P: 2, ring: 'spiral', contact: 70 }).values;
  for (const k of ['M', 'sb', 'tau', 'be', 'bfk', 'st', 'tt', 'umax']) near(pp[k], cp[k], 1e-9, `clevis ${k}`);
  for (const k of ['Ps', 'PG', 'Pallow', 'Y']) near(pp[k], rr[k], 1e-9, `ring ${k}`);
  const mi = engine.run('maintenance-interval-plan').values, wr = engine.run('weibull-reliability', { beta: 2.5, eta: 8000, t: mi.T }).values;
  near(mi.R, wr.R, 1e-12, 'reliability'); near(mi.h, wr.h, 1e-15, 'hazard rate'); near(mi.b10, wr.b10, 1e-9, 'B10 life'); near(mi.mttf, wr.mttf, 1e-6, 'mean life');
  near(engine.run('weibull-reliability', { beta: 2.5, eta: 8000, t: mi.tR }).values.R, 0.9, 1e-12, 'interval for the reliability wanted');
  assert.ok(engine.run('maintenance-interval-plan', { Tuse: mi.Topt * 0.8 }).values.cT > mi.cT && engine.run('maintenance-interval-plan', { Tuse: mi.Topt * 1.2 }).values.cT > mi.cT, 'lowest-cost interval is a minimum');
  near(mi.cRTF, 4000 / mi.mttf, 1e-12, 'run-to-failure cost');
  const pt = engine.run('process-change-trial').values, ts = engine.run('two-sample-t').values;
  for (const k of ['diff', 'se', 't', 'df', 'p', 'lo', 'hi']) near(pt[k], ts[k], 1e-9, `t-test ${k}`);
  near(pt.nRaw, engine.run('sample-size-mean', { sd: 2.2, E: 2 / (Math.SQRT2 * (1 + 0.8416 / 1.96)), conf: '95', pop: 0 }).values.n0, 1e-9, 'sample size equivalence');
  const to = engine.run('timber-order-plan').values, lb = engine.run('lumber-board-feet', { t: 45, w: 90, L: 2.4, qty: 220, pmode: 'm3', price: 650, rho: to.rho }).values, wm = engine.run('wood-moisture-density', { wet: 11.8, dry: 10, G: 0.45, M: to.MC, V: to.vol * 1000 }).values;
  for (const k of ['bf', 'vol', 'cost', 'mass']) near(to[k], lb[k], 1e-9, `timber ${k}`);
  near(to.MC, wm.MC, 1e-12, 'moisture content'); near(to.rho, wm.rho, 1e-9, 'density'); near(to.mass, wm.mass, 1e-9, 'mass');
  const ori = engine.run('orifice-restrictor-design').values;
  near(ori.Quse, engine.run('orifice-flow', { mode: 'flow', d: 1, Cd: 0.62, dp: 70, Q: 4, rho: 870 }).values.Q, 1e-12, 'flow at the drill size');
  near(engine.run('orifice-flow', { mode: 'dp', d: ori.dExact, Cd: 0.62, dp: 70, Q: 4, rho: 870 }).values.dp, 70, 1e-9, 'exact diameter gives the pressure drop');
  near(ori.dpNeed, engine.run('orifice-flow', { mode: 'dp', d: 1, Cd: 0.62, dp: 70, Q: 4, rho: 870 }).values.dp, 1e-9, 'pressure drop for the target');
  const mw = engine.run('machine-levelling-wedge-check').values, wf = engine.run('wedge-force', { W: mw.W, angle: 6, mu: 0.15 }).values;
  near(mw.drive, wf.drive, 1e-9, 'drive force'); near(mw.withdraw, wf.withdraw, 1e-9, 'withdraw force');
  const rw = engine.run('ramp-winch-pull-check').values, ip = engine.run('inclined-plane', { mass: 2000, angle: 10, mu: rw.mue }).values;
  near(rw.pull, ip.up, 1e-9, 'pull up the ramp'); near(rw.hold, ip.hold, 1e-9, 'holding force');
  near(rw.mue * 2000 * 9.80665 * Math.cos(Math.PI / 18), engine.run('rolling-resistance', { W: 2000 * 9.80665 * Math.cos(Math.PI / 18), r: 100, f: 0.8, v: 0.2, mu: 0.15 }).values.F, 1e-9, 'rolling resistance');
  near(engine.run('ramp-winch-pull-check', { mode: 'skid' }).values.pull, engine.run('inclined-plane', { mass: 2000, angle: 10, mu: 0.3 }).values.up, 1e-9, 'pull on skids');
});

test('twenty-third-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('water-line-design-check').text, 'LINE ADEQUATE');
  assert.equal(engine.run('water-line-design-check', { tc: 0.1 }).text, 'LINE NOT ADEQUATE');
  assert.equal(engine.run('water-line-design-check', { d: 50 }).text, 'LINE NOT ADEQUATE');
  assert.equal(engine.run('water-line-design-check', { rise: 30 }).text, 'LINE NOT ADEQUATE');
  assert.equal(engine.run('pipe-run-expansion-check').text, 'LOOP ADEQUATE');
  assert.equal(engine.run('pipe-run-expansion-check', { leg: 4000 }).text, 'LOOP NOT ADEQUATE');
  assert.equal(engine.run('pipe-run-expansion-check', { Fallow: 2 }).text, 'LOOP NOT ADEQUATE');
  assert.equal(engine.run('pipe-run-expansion-check', { type: 'L' }).text, 'LOOP NOT ADEQUATE');
  assert.equal(engine.run('pivot-pin-retention-check').text, 'PIN ASSEMBLY ADEQUATE');
  assert.equal(engine.run('pivot-pin-retention-check', { Fax: 5 }).text, 'PIN ASSEMBLY NOT ADEQUATE');
  assert.equal(engine.run('pivot-pin-retention-check', { F: 40 }).text, 'PIN ASSEMBLY NOT ADEQUATE');
  assert.equal(engine.run('pivot-pin-retention-check', { ext: 0.2 }).text, 'PIN ASSEMBLY NOT ADEQUATE');
  assert.equal(engine.run('maintenance-interval-plan').text, 'PLANNED REPLACEMENT PAYS');
  assert.equal(engine.run('maintenance-interval-plan', { beta: 1 }).text, 'RUN TO FAILURE');
  assert.equal(engine.run('maintenance-interval-plan', { Cf: 500 }).text, 'RUN TO FAILURE');
  assert.equal(engine.run('process-change-trial').text, 'IMPROVEMENT CONFIRMED');
  assert.equal(engine.run('process-change-trial', { m2: 51.8 }).text, 'NO PROVEN DIFFERENCE');
  assert.equal(engine.run('process-change-trial', { m2: 54.5 }).text, 'CHANGE MADE IT WORSE');
  assert.equal(engine.run('process-change-trial', { goal: 'higher' }).text, 'CHANGE MADE IT WORSE');
  assert.equal(engine.run('timber-order-plan', { wet: 13 }).text, 'TIMBER TOO WET');
  assert.equal(engine.run('orifice-restrictor-design').text, 'RESTRICTOR SUITABLE');
  assert.equal(engine.run('orifice-restrictor-design', { tol: 5 }).text, 'RESTRICTOR NOT SUITABLE');
  assert.equal(engine.run('orifice-restrictor-design', { dMin: 1.2 }).text, 'RESTRICTOR NOT SUITABLE');
  assert.equal(engine.run('orifice-restrictor-design', { dp: 250 }).text, 'RESTRICTOR NOT SUITABLE');
  assert.equal(engine.run('machine-levelling-wedge-check').text, 'WEDGES ADEQUATE');
  assert.equal(engine.run('machine-levelling-wedge-check', { angle: 20 }).text, 'WEDGES NOT ADEQUATE');
  assert.equal(engine.run('machine-levelling-wedge-check', { Favail: 3000 }).text, 'WEDGES NOT ADEQUATE');
  assert.equal(engine.run('machine-levelling-wedge-check', { h: 8 }).text, 'WEDGES NOT ADEQUATE');
  assert.equal(engine.run('ramp-winch-pull-check').text, 'WINCH ADEQUATE');
  assert.equal(engine.run('ramp-winch-pull-check', { mode: 'skid' }).text, 'WINCH NOT ADEQUATE');
  assert.equal(engine.run('ramp-winch-pull-check', { mass: 4000 }).text, 'WINCH NOT ADEQUATE');
  assert.equal(engine.run('ramp-winch-pull-check', { v: 0.4 }).text, 'WINCH NOT ADEQUATE');
  const cases: Array<[string, Inputs]> = [['water-line-design-check', { rating: 5 }], ['pipe-run-expansion-check', { wt: 60 }], ['pivot-pin-retention-check', { R: 9 }], ['pivot-pin-retention-check', { dg: 10 }], ['timber-order-plan', { wet: 9 }], ['machine-levelling-wedge-check', { share: 20 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-third handbook pass (handbook49): twenty-fourth round of integrated design checks.
const HB33_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['pump-suction-check', {}, { vel: 0.005 / (Math.PI * 0.0016) }],
  ['shoe-brake-stop-check', {}, { T: 8 * 20 * Math.PI / 3, E: 4 * (20 * Math.PI) ** 2, revs: 15 }],
  ['drive-torsional-check', {}, { Jeff: 0.025 / 0.55, tau: 16 * 150000 / (Math.PI * 27000) }],
  ['flange-coupling-design', {}, { T: 9549.2966 * 30 / 1000 * 1.5, Tf: 960 }],
  ['gear-milling-setup', {}, { whole: 0, rem: 40, circle: 47, holes: 40, Do: 98, depth: 4.5 }],
  ['lubricant-viscosity-check', { Top: 40, Tcold: 100 }, { nu: 68, nuCold: 8.6 }, 1e-9],
  ['rolled-plate-plan', {}, { target: 300, blank: 301.5 * Math.PI }],
  ['hopper-bin-design', {}, { Vcyl: Math.PI * 1.5 }],
  ['knurling-setup', {}, { lower: 62 / Math.PI, upper: 63 / Math.PI, n: 20000 / (Math.PI * 20.05) }],
];
for (const [id, over, expected, tol] of HB33_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-fourth-round design checks agree with the tools they chain', () => {
  const ps = engine.run('pump-suction-check').values, pf = engine.run('pipe-friction', { Q: 300, d: 80, L: 6, nu: 1, rho: 998, eps: 0.045, K: 3 }).values, ns = engine.run('npsh-available', { ps: 101.3, pv: 2.34, rho: 998, z: -2, hf: ps.hf, npshr: 3, margin: 1 }).values;
  near(ps.vel, pf.vel, 1e-12, 'suction velocity'); near(ps.f, pf.f, 1e-12, 'friction factor'); near(ps.hf, pf.head, 1e-12, 'suction head loss');
  near(ps.npsha, ns.npsha, 1e-12, 'NPSH available'); near(ps.marg, ns.marg, 1e-12, 'margin');
  near(engine.run('pump-suction-check', { z: ps.zMin }).values.marg, 1, 1e-9, 'lowest level leaves exactly the margin');
  const sb = engine.run('shoe-brake-stop-check').values, sh = engine.run('shoe-brake', { T: sb.T, D: 300, mu: 0.35, a: 500, b: 200, c: 40, dir: 'energ', area: 6000 }).values, aa = engine.run('angular-acceleration-torque', { J: 8, n0: 600, n1: 0, t: 3, Tf: 0 }).values;
  near(sb.T, Math.abs(aa.Ta), 1e-9, 'decelerating torque'); near(sb.E, Math.abs(aa.E), 1e-9, 'energy per stop'); near(sb.revs, aa.revs, 1e-12, 'revolutions to stop');
  near(sb.Nf, sh.Nf, 1e-9, 'shoe normal force'); near(sb.F, sh.F, 1e-9, 'lever force'); near(sb.p, sh.p, 1e-12, 'lining pressure');
  near(engine.run('shoe-brake-stop-check', { Td: 50 }).values.T, sb.T - 50, 1e-9, 'drag reduces the brake torque');
  const dt = engine.run('drive-torsional-check').values, tv = engine.run('torsional-vibration', { mode: 'two', kMode: 'shaft', G: 79.3, d: 30, di: 0, Ls: 800, J1: 0.05, J2: 0.5, bw: 50 }).values;
  near(dt.K, tv.K, 1e-9, 'torsional stiffness'); near(dt.Jeff, tv.Jeff, 1e-15, 'effective inertia'); near(dt.fn, tv.fn, 1e-12, 'natural frequency');
  near(dt.ncNear, 60 * dt.fn / 2, 1e-9, 'second-order critical speed is nearest');
  const fc = engine.run('flange-coupling-design').values, fb = engine.run('flange-coupling-bolts', { T: fc.T, n: 4, Dbc: 120, d: 10, tau: 100, Fi: 20, mu: 0.2, Df: 0 }).values, ks = engine.run('key-stress', { T: fc.T, d: 40, w: 12, h: 8, L: 60, tauA: 60, sigA: 100 }).values;
  near(fc.Fb, fb.Fb, 1e-9, 'bolt force'); near(fc.tauBolt, fb.tauB, 1e-9, 'bolt shear'); near(fc.dreq, fb.dreq, 1e-12, 'bolt shank needed'); near(fc.Tf, fb.Tf, 1e-9, 'friction torque');
  near(fc.Fk, ks.F, 1e-9, 'key force'); near(fc.tauKey, ks.tau, 1e-9, 'key shear'); near(fc.sigKey, ks.sigma, 1e-9, 'key crushing'); near(fc.Lmin, Math.max(ks.Ls, ks.Lc), 1e-9, 'least key length');
  near(engine.run('flange-coupling-design', { Lk: fc.Lmin }).values.sigKey, 100, 1e-9, 'least key length meets the crushing limit');
  const gm = engine.run('gear-milling-setup').values, si = engine.run('simple-indexing', { divisions: 47, ratio: 40, plates: 'bs' }).values, ct = engine.run('chordal-tooth', { m: 2, z: 47, a: 0, t: 0 }).values;
  near(gm.whole, si.whole, 0, 'whole turns'); near(gm.rem, si.rem, 0, 'remainder'); near(gm.count, si.count, 0, 'circles that work'); assert.equal(gm.setting, si.best);
  assert.equal(gm.cutter, engine.run('gear-cutter-number', { type: 'spur', Nt: 47 }).values.cutter);
  near(gm.D, ct.D, 1e-12, 'pitch diameter'); near(gm.tc, ct.tc, 1e-12, 'chordal thickness'); near(gm.ac, ct.ac, 1e-12, 'chordal addendum');
  for (const z of [30, 41, 60, 120]) assert.equal(engine.run('gear-milling-setup', { z }).values.cutter, engine.run('gear-cutter-number', { type: 'spur', Nt: z }).values.cutter, `cutter for ${z} teeth`);
  const lv = engine.run('lubricant-viscosity-check').values, ov = engine.run('oil-viscosity-temperature', { T1: 40, v1: 68, T2: 100, v2: 8.6, T: 70 }).values, vu = engine.run('viscosity-units', { unit: 'cst', val: lv.nu, sg: 0.88 }).values;
  near(lv.nu, ov.nu, 1e-12, 'operating viscosity'); near(lv.nuCold, engine.run('oil-viscosity-temperature', { T1: 40, v1: 68, T2: 100, v2: 8.6, T: 5 }).values.nu, 1e-9, 'cold-start viscosity');
  near(lv.cP, vu.cP, 1e-12, 'dynamic viscosity'); near(lv.sus, vu.sus40, 1e-12, 'Saybolt seconds');
  const rp = engine.run('rolled-plate-plan').values;
  near(engine.run('bending-springback', { Ri: rp.Ri, t: 3, YS: 250, E: 200, angle: 90 }).values.Rf, 300, 1e-9, 'roll-to radius springs back to the target');
  near(rp.Rm, engine.run('arc-radius-rolls', { type: 'concave', D: 20, L: 200, Hh: 34.3 }).values.R, 1e-12, 'measured radius');
  near(engine.run('rolled-plate-plan', { surf: 'out', type: 'convex', Hh: 5 }).values.Rm, engine.run('arc-radius-rolls', { type: 'convex', D: 20, L: 200, Hh: 5 }).values.R, 1e-12, 'convex set-up');
  const hb = engine.run('hopper-bin-design').values, fv = engine.run('frustum-volume', { shape: 'round', top1: 2000, bot1: 300, height: 1500 }).values;
  near(hb.Vcone * 1000, fv.litres, 1e-9, 'cone volume'); near(hb.side, fv.sideArea, 1e-12, 'slant area'); near(hb.angle, fv.angle, 1e-12, 'wall angle');
  near(hb.mass, hb.Vtot * 0.9 * 1400, 1e-9, 'mass held');
  const kn = engine.run('knurling-setup').values, kb = engine.run('knurl-blank', { system: 'cp', t: 1, D: 20.05 }).values;
  near(kn.teeth, kb.teeth, 1e-12, 'teeth'); near(kn.lower, kb.lower, 1e-12, 'lower tracking diameter'); near(kn.upper, kb.upper, 1e-12, 'upper tracking diameter');
  near(engine.run('knurling-setup', { system: 'dp', D: 19.05 }).values.teeth, engine.run('knurl-blank', { system: 'dp', P: 96, D: 0.75 }).values.teeth, 1e-9, 'diametral pitch teeth');
});

test('twenty-fourth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('pump-suction-check').text, 'SUCTION ADEQUATE');
  assert.equal(engine.run('pump-suction-check', { z: -6.5 }).text, 'CAVITATION RISK');
  assert.equal(engine.run('pump-suction-check', { d: 50 }).text, 'SUCTION VELOCITY TOO HIGH');
  assert.equal(engine.run('shoe-brake-stop-check').text, 'BRAKE ADEQUATE');
  assert.equal(engine.run('shoe-brake-stop-check', { t: 2 }).text, 'BRAKE NOT ADEQUATE');
  assert.equal(engine.run('shoe-brake-stop-check', { c: 600 }).text, 'BRAKE NOT ADEQUATE');
  assert.equal(engine.run('shoe-brake-stop-check', { area: 2000 }).text, 'BRAKE NOT ADEQUATE');
  assert.equal(engine.run('shoe-brake-stop-check', { mDrum: 0.5 }).text, 'BRAKE NOT ADEQUATE');
  assert.equal(engine.run('drive-torsional-check').text, 'NO TORSIONAL PROBLEM');
  assert.equal(engine.run('drive-torsional-check', { Ls: 1500 }).text, 'TORSIONAL PROBLEM');
  assert.equal(engine.run('drive-torsional-check', { T: 400 }).text, 'TORSIONAL PROBLEM');
  assert.equal(engine.run('flange-coupling-design').text, 'COUPLING ADEQUATE');
  assert.equal(engine.run('flange-coupling-design', { Lk: 50 }).text, 'COUPLING NOT ADEQUATE');
  assert.equal(engine.run('flange-coupling-design', { db: 4 }).text, 'COUPLING NOT ADEQUATE');
  assert.equal(engine.run('flange-coupling-design', { hubL: 55 }).text, 'COUPLING NOT ADEQUATE');
  assert.equal(engine.run('gear-milling-setup').text, 'SET-UP FOUND');
  assert.equal(engine.run('gear-milling-setup', { z: 67 }).text, 'NEEDS DIFFERENTIAL INDEXING');
  assert.equal(engine.run('lubricant-viscosity-check').text, 'GRADE SUITABLE');
  assert.equal(engine.run('lubricant-viscosity-check', { Top: 90 }).text, 'GRADE NOT SUITABLE');
  assert.equal(engine.run('lubricant-viscosity-check', { Tcold: -10 }).text, 'GRADE NOT SUITABLE');
  assert.equal(engine.run('rolled-plate-plan').text, 'RADIUS WITHIN TOLERANCE');
  assert.equal(engine.run('rolled-plate-plan', { Hh: 33 }).text, 'RADIUS OUT OF TOLERANCE');
  assert.equal(engine.run('hopper-bin-design').text, 'HOPPER ADEQUATE');
  assert.equal(engine.run('hopper-bin-design', { Hh: 1200 }).text, 'HOPPER NOT ADEQUATE');
  assert.equal(engine.run('hopper-bin-design', { need: 9000 }).text, 'HOPPER NOT ADEQUATE');
  assert.equal(engine.run('knurling-setup').text, 'BLANK TRACKS');
  assert.equal(engine.run('knurling-setup', { D: 20 }).text, 'ADJUST BLANK DIAMETER');
  const cases: Array<[string, Inputs]> = [['pump-suction-check', { pv: 110 }], ['shoe-brake-stop-check', { Td: 200 }], ['drive-torsional-check', { di: 40 }], ['drive-torsional-check', { nMax: 500 }], ['lubricant-viscosity-check', { T2: 40 }], ['rolled-plate-plan', { L: 15 }], ['rolled-plate-plan', { Hh: 15 }], ['hopper-bin-design', { d: 2500 }], ['knurling-setup', { D: 0.2 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-fourth handbook pass (handbook50): twenty-fifth round of integrated design checks.
const HB34_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['shaft-alignment-plan', {}, { th: 11e-6 * (250 * 60 - 300 * 20), runOff: 0.12 - 11e-6 * 9000 }],
  ['helical-gear-milling-setup', {}, { D: 60 / Math.cos(Math.PI / 6), whole: 1, rem: 10, holes: 5, circle: 15, depth: 4.5 }],
  ['machine-rate-quote-check', {}, { jobH: 12 }],
  ['crane-load-swing-check', {}, { T: 2 * Math.PI * Math.sqrt(6 / 9.80665), Tmax: 2000 * 9.80665 + 2000 * 0.25 / 6 }],
  ['nested-spring-check', {}, { clear: 2.75, LsO: 40, LsI: 35 }],
  ['spun-cone-plan', {}, { T: 4, red: 50, Lax: 100 * Math.sqrt(3) }],
  ['moulded-part-cost', {}, { cMould: 0.2 }],
  ['dynamometer-cooling-plan', {}, { T: 200, P: 2 * Math.PI * 10 * 200 }],
  ['internal-gear-drive-check', {}, { C: 81, ratio: 4, nOut: 362.5 }],
];
for (const [id, over, expected, tol] of HB34_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-fifth-round design checks agree with the tools they chain', () => {
  const sa = engine.run('shaft-alignment-plan').values, rf = engine.run('rim-face-alignment', { rim: 0.24, face: 0.05, dia: 120, front: 250, back: 650 }).values, tg = engine.run('alignment-thermal-growth', { H1: 300, a1: 11, dT1: 20, H2: 250, a2: 11, dT2: 60 }).values;
  for (const k of ['offset', 'slope', 'front', 'back']) near(sa[k], rf[k], 1e-12, `alignment ${k}`);
  near(sa.g1, tg.g1, 1e-12, 'stationary growth'); near(sa.g2, tg.g2, 1e-12, 'movable growth'); near(sa.th, tg.offset, 1e-12, 'cold offset');
  near(sa.cFront, rf.front - tg.offset, 1e-12, 'cold front correction'); near(sa.cBack, rf.back - tg.offset, 1e-12, 'cold back correction');
  near(engine.run('shaft-alignment-plan', { dT1: 0, dT2: 0 }).values.cBack, rf.back, 1e-12, 'no growth leaves the plain correction');
  const hg = engine.run('helical-gear-milling-setup').values, hm = engine.run('helical-milling', { D: hg.D, beta: 30, Lm: 254, set: 'std' }).values, gc = engine.run('gear-cutter-number', { type: 'helical', Nt: 30, helix: 30 }).values;
  near(hg.lead, hm.lead, 1e-9, 'lead'); near(hg.req, hm.req, 1e-12, 'gear ratio'); near(hg.err, hm.err, 1e-9, 'lead error'); assert.equal(hg.train, hm.train);
  near(hg.Nf, gc.Nf, 1e-9, 'formative teeth'); assert.equal(hg.cutter, gc.cutter);
  assert.equal(hg.setting, engine.run('simple-indexing', { divisions: 30, ratio: 40, plates: 'bs' }).values.best);
  const mq = engine.run('machine-rate-quote-check').values, mh = engine.run('machine-hour-rate').values;
  near(mq.capital, mh.capital, 1e-9, 'capital recovery'); near(mq.machine, mh.machine, 1e-12, 'machine rate'); near(mq.total, mh.total, 1e-12, 'total rate');
  near(mq.perPart, (12 * mh.total + 450) / 100, 1e-12, 'cost per part');
  near(engine.run('machine-rate-quote-check', { quote: mq.minPrice }).values.margin, 15, 1e-9, 'least price gives the margin wanted');
  const cs = engine.run('crane-load-swing-check').values, pp = engine.run('pendulum-period', { type: 'simple', L: 6, amp: cs.theta }).values;
  near(cs.T, pp.T, 1e-12, 'small-swing period'); near(cs.Tc, pp.Tc, 1e-12, 'period corrected for amplitude');
  near(engine.run('crane-load-swing-check', { v: cs.vMax }).values.A, 0.5, 1e-9, 'largest speed swings to the clearance');
  const ns = engine.run('nested-spring-check').values, so = engine.run('compression-spring', { d: 4, D: 32, Na: 8, ends: 'cg', G: 79.3, L0: 80, Lw: 60, allow: 700, rho: 7850 }).values, si = engine.run('compression-spring', { d: 2.5, D: 20, Na: 12, ends: 'cg', G: 79.3, L0: 80, Lw: 60, allow: 700, rho: 7850 }).values;
  near(ns.ko, so.k, 1e-12, 'outer rate'); near(ns.Fo, so.F, 1e-9, 'outer load'); near(ns.tauO, so.tau, 1e-9, 'outer stress'); near(ns.tauSO, so.tauS, 1e-9, 'outer stress at solid'); near(ns.LsO, so.Ls, 1e-12, 'outer solid length');
  near(ns.ki, si.k, 1e-12, 'inner rate'); near(ns.Fi, si.F, 1e-9, 'inner load'); near(ns.tauI, si.tau, 1e-9, 'inner stress'); near(ns.LsI, si.Ls, 1e-12, 'inner solid length');
  const sc = engine.run('spring-combination', { arr: 'parallel', k1: so.k, k2: si.k, k3: 0, k4: 0, F: ns.F }).values;
  near(ns.k, sc.k, 1e-12, 'combined rate'); near(sc.defl, 20, 1e-9, 'combined deflection');
  const sp = engine.run('spun-cone-plan').values, ss = engine.run('shear-spinning', { Tw: 2, alpha: 30, sf: 300, f: 0.5, Dr: 300, rpm: 400 }).values;
  for (const k of ['T', 'red', 'Ft', 'P']) near(sp[k], ss[k], 1e-9, `spinning ${k}`);
  const mp = engine.run('moulded-part-cost').values, im = engine.run('injection-moulding-estimate').values;
  for (const k of ['F', 'shot', 'use', 'mass', 'tc', 'cycle', 'pph']) near(mp[k], im[k], 1e-9, `moulding ${k}`);
  near(mp.cMach, 60 / (im.pph * 0.97), 1e-12, 'machine cost per part'); near(mp.cMat, im.mass / 4 / 1000 * 2.5 / 0.97, 1e-12, 'plastic cost per part');
  const dc = engine.run('dynamometer-cooling-plan').values, pb = engine.run('prony-brake', { L: 1, tare: 250, zero: 50, n: 600 }).values;
  near(dc.W, pb.W, 1e-12, 'net force'); near(dc.T, pb.T, 1e-12, 'torque'); near(dc.P, pb.P, 1e-9, 'power');
  near(dc.Q, engine.run('coolant-flow-heat', { mode: 'flow', kW: dc.heat, dT: 10, Q: 40, cp: 4.18, rho: 998 }).values.Q, 1e-9, 'cooling water flow');
  const ig = engine.run('internal-gear-drive-check').values, ip = engine.run('internal-gear', { m: 3, Zg: 72, Zp: 18, form: '20fd' }).values, lb = engine.run('lewis-bending', { Ft: ig.Ft, m: 3, b: 30, Y: 0.31, d: 54, rpm: 1450, make: 'hobbed', allow: 150 }).values;
  for (const k of ['Dg', 'Dp', 'C', 'Di', 'DiC', 'Dop', 'DopC']) near(ig[k], ip[k], 1e-12, `internal gear ${k}`);
  near(ig.V, lb.V, 1e-12, 'pitch-line velocity'); near(ig.Kv, lb.Kv, 1e-12, 'velocity factor'); near(ig.sigma, lb.sigma, 1e-9, 'bending stress');
});

test('twenty-fifth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('shaft-alignment-plan').text, 'ALIGNMENT OK WHEN HOT');
  assert.equal(engine.run('shaft-alignment-plan', { rim: 0.4 }).text, 'REALIGN');
  assert.equal(engine.run('shaft-alignment-plan', { face: 0.1 }).text, 'REALIGN');
  assert.equal(engine.run('helical-gear-milling-setup').text, 'SET-UP FOUND');
  assert.equal(engine.run('helical-gear-milling-setup', { z: 67 }).text, 'SET-UP NOT FOUND');
  assert.equal(engine.run('helical-gear-milling-setup', { tol: 0.01 }).text, 'SET-UP NOT FOUND');
  assert.equal(engine.run('helical-gear-milling-setup', { z: 8, beta: 10 }).text, 'SET-UP NOT FOUND');
  assert.equal(engine.run('machine-rate-quote-check').text, 'QUOTE COVERS COST');
  assert.equal(engine.run('machine-rate-quote-check', { quote: 18 }).text, 'QUOTE TOO LOW');
  assert.equal(engine.run('crane-load-swing-check').text, 'SWING WITHIN LIMITS');
  assert.equal(engine.run('crane-load-swing-check', { v: 0.8 }).text, 'SWING NOT ACCEPTABLE');
  assert.equal(engine.run('crane-load-swing-check', { SWL: 19 }).text, 'SWING NOT ACCEPTABLE');
  assert.equal(engine.run('nested-spring-check').text, 'SPRING SET ADEQUATE');
  assert.equal(engine.run('nested-spring-check', { need: 300 }).text, 'SPRING SET NOT ADEQUATE');
  assert.equal(engine.run('nested-spring-check', { allow: 300 }).text, 'SPRING SET NOT ADEQUATE');
  assert.equal(engine.run('nested-spring-check', { Di: 24 }).text, 'SPRING SET NOT ADEQUATE');
  assert.equal(engine.run('spun-cone-plan').text, 'SPINNING FEASIBLE');
  assert.equal(engine.run('spun-cone-plan', { alpha: 15 }).text, 'SPINNING NOT FEASIBLE');
  assert.equal(engine.run('spun-cone-plan', { sf: 1500 }).text, 'SPINNING NOT FEASIBLE');
  assert.equal(engine.run('moulded-part-cost').text, 'COST WITHIN TARGET');
  assert.equal(engine.run('moulded-part-cost', { target: 0.3 }).text, 'COST ABOVE TARGET');
  assert.equal(engine.run('moulded-part-cost', { clamp: 900 }).text, 'MACHINE NOT SUITABLE');
  assert.equal(engine.run('dynamometer-cooling-plan').text, 'TEST SET-UP ADEQUATE');
  assert.equal(engine.run('dynamometer-cooling-plan', { n: 1000 }).text, 'TEST SET-UP NOT ADEQUATE');
  assert.equal(engine.run('dynamometer-cooling-plan', { dT: 5 }).text, 'TEST SET-UP NOT ADEQUATE');
  assert.equal(engine.run('internal-gear-drive-check').text, 'DRIVE ADEQUATE');
  assert.equal(engine.run('internal-gear-drive-check', { Zp: 62 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('internal-gear-drive-check', { P: 15 }).text, 'DRIVE NOT ADEQUATE');
  const cases: Array<[string, Inputs]> = [['machine-rate-quote-check', { salvage: 400000 }], ['crane-load-swing-check', { v: 15, L: 2 }], ['nested-spring-check', { Lw: 38 }], ['nested-spring-check', { Lw: 90 }], ['nested-spring-check', { di: 25 }], ['spun-cone-plan', { Ds: 400 }], ['moulded-part-cost', { Te: 30 }], ['dynamometer-cooling-plan', { tare: 40 }], ['internal-gear-drive-check', { Zp: 80 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-fifth handbook pass (handbook51): twenty-sixth round of integrated design checks.
const HB35_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['c-frame-throat-check', {}, { A: 30000, M: 200000 * 400, sStraight: 200000 / 30000 + 6 * 8e7 / (100 * 90000) }],
  ['bolt-pattern-hole-plan', {}, { chord: 100 * Math.SQRT1_2, tot: 1, Thole: 1, bonus: 0.3 }],
  ['interference-fit-limits-check', {}, { dMin: 0.045 - 0.0249798879941631 }, 1e-9],
  ['pontoon-float-check', {}, { mass: 1000, Vd: 1, Vfull: 4 * Math.PI * 0.09 * 2 }],
  ['spade-drilling-plan', {}, { n: 30000 / (Math.PI * 40), Bs: 22500 * 0.0359 * 0.3 * 40 * 1.25 }],
  ['thrust-pad-bearing-check', {}, { A: Math.PI * (22500 - 6400) / 4 * 0.8 }],
  ['tube-post-eccentric-check', {}, { A: Math.PI * (114.3 ** 2 - 102.3 ** 2) / 4, I: Math.PI * (114.3 ** 4 - 102.3 ** 4) / 64, c: 57.15 }],
  ['hot-surface-insulation-check', {}, { U: 1 / (0.05 / 0.04 + 0.1), Qc: 8 * 10 * 175 }],
  ['plug-gauge-plan', {}, { lower: 25 }],
];
for (const [id, over, expected, tol] of HB35_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-sixth-round design checks agree with the tools they chain', () => {
  const cf = engine.run('c-frame-throat-check', { a: 100 }).values, cb = engine.run('curved-beam', { P: 200000, ri: 100, h: 300, b: 100, allow: 120 }).values;
  near(cf.si, cb.si, 1e-9, 'inner fibre with the load at the centre of curvature'); near(cf.so, cb.so, 1e-9, 'outer fibre'); near(cf.e, cb.e, 1e-12, 'neutral-axis shift');
  near(engine.run('c-frame-throat-check').values.sStraight, engine.run('axial-bending-stress', { P: 200, Mx: 80, My: 0, b: 100, h: 300, allow: 120 }).values.max, 1e-9, 'straight-beam stress');
  const cr = engine.run('c-frame-throat-check').values;
  near(engine.run('c-frame-throat-check', { h: cr.hReq }).values.si, 120, 1e-6, 'throat depth needed meets the allowable');
  const bp = engine.run('bolt-pattern-hole-plan').values, bl = engine.run('bolt-circle-layout', { BCD: 100, n: 4, start: 45, dh: 11.3, OD: 140, ID: 60, wrench: 24, minLig: 3, minEdge: 10 }).values, fp = engine.run('fastener-position-tolerance', { mode: 'floating', H: 11, F: 10, share: 50, dx: 0, dy: 0, size: 11, upper: 11.3 }).values;
  for (const k of ['step', 'chord', 'lig', 'eOut', 'eIn', 'x1', 'y1']) near(bp[k], bl[k], 1e-12, `layout ${k}`);
  near(bp.tot, fp.tot, 1e-12, 'total tolerance'); near(bp.Thole, fp.Thole, 1e-12, 'hole tolerance'); near(bp.Tthread, fp.Tthread, 1e-12, 'other part tolerance');
  const fx = engine.run('bolt-pattern-hole-plan', { mode: 'fixed', share: 60 }).values, ff = engine.run('fastener-position-tolerance', { mode: 'fixed', H: 11, F: 10, share: 60, dx: 0, dy: 0, size: 11, upper: 11.3 }).values;
  near(fx.Thole, ff.Thole, 1e-12, 'fixed hole tolerance'); near(fx.Tthread, ff.Tthread, 1e-12, 'fixed threaded tolerance');
  const ifit = engine.run('interference-fit-limits-check').values, pf = { d: 50, D: 100, di: 0, L: 60, mu: 0.15, Eh: 200, nuh: 0.3, Es: 200, nus: 0.3, Sy: 350, req: 1.5, alpha: 11.5, clear: 0.03 };
  near(ifit.ITh, engine.run('it-tolerance-grade', { size: 50, grade: '7' }).values.it, 1e-12, 'hole IT'); near(ifit.ITs, engine.run('it-tolerance-grade', { size: 50, grade: '6' }).values.it, 1e-12, 'shaft IT');
  const pLo = engine.run('press-fit', { ...pf, delta: ifit.dMin }).values, pHi = engine.run('press-fit', { ...pf, delta: ifit.dMax }).values;
  near(ifit.pMin, pLo.p, 1e-9, 'pressure at least interference'); near(ifit.Tmin, pLo.T, 1e-9, 'holding torque at least interference');
  near(ifit.pMax, pHi.p, 1e-9, 'pressure at most interference'); near(ifit.vm, pHi.vm, 1e-9, 'hub stress'); near(ifit.nMax, pHi.n, 1e-12, 'hub safety factor'); near(ifit.Fmax, pHi.F, 1e-6, 'press force'); near(ifit.dT, pHi.dT, 1e-9, 'heating');
  const pt = engine.run('pontoon-float-check').values;
  near(engine.run('circular-segment', { mode: 'rh', radius: 300, height: pt.h }).values.area, pt.Aimm, 1e-6, 'immersed segment area');
  near(pt.Fb, engine.run('buoyancy', { V: pt.Vfull * 1000, mass: 1000, rho: 1000 }).values.Fb, 1e-9, 'full buoyancy');
  near(engine.run('pontoon-float-check', { pay: pt.payMax }).values.res, 100, 1e-9, 'largest payload leaves the reserve wanted');
  const sd = engine.run('spade-drilling-plan').values, sp = engine.run('spade-drill-power', { D: 40, f: 0.3, n: sd.n, ukw: 0.0359, em: 0.8, dull: 25, avail: 15 }).values;
  for (const k of ['MRR', 'kWc', 'kWm', 'Bs']) near(sd[k], sp[k], 1e-9, `spade drilling ${k}`);
  near(engine.run('spade-drilling-plan', { f: sd.fMaxT }).values.Bs, 20000, 1e-6, 'largest feed meets the thrust limit');
  const tb = engine.run('thrust-pad-bearing-check').values, tp = engine.run('thrust-bearing-pads', { Do: 150, Di: 80, fill: 80, W: 20000, rpm: 1500, Pallow: 2, PVallow: 20 }).values;
  for (const k of ['A', 'P', 'V', 'PV']) near(tb[k], tp[k], 1e-9, `thrust pads ${k}`);
  near(tb.Q, engine.run('coolant-flow-heat', { mode: 'flow', kW: tb.Pf / 1000, dT: 15, Q: 40, cp: 1.88, rho: 870 }).values.Q, 1e-12, 'oil flow');
  const tpo = engine.run('tube-post-eccentric-check').values, ec = engine.run('eccentric-column', { P: 20000, e: 50, A: tpo.A, I: tpo.I, c: tpo.c, L: 3000, K: 2, E: 200, Sy: 250, req: 2 }).values;
  near(tpo.smax, ec.smax, 1e-9, 'peak stress'); near(tpo.PE, ec.PE, 1e-6, 'Euler load'); near(tpo.n, ec.n, 1e-9, 'load factor');
  const hs = engine.run('hot-surface-insulation-check').values, wl = engine.run('wall-heat-loss', { Thot: 200, Tcold: 25, area: 10, hin: 0, hout: 10, t1: 50, k1: 0.04, t2: 0, k2: 1, t3: 0, k3: 1 }).values;
  near(hs.Qr, engine.run('radiant-heat', { area: 10, eps: 0.8, Ts: 200, Ta: 25 }).values.Q, 1e-9, 'radiant loss');
  near(hs.U, wl.U, 1e-12, 'insulated U'); near(hs.Qins, wl.Q, 1e-9, 'insulated loss'); near(hs.To, wl.Tsurf, 1e-9, 'outer surface temperature');
  const pg = engine.run('plug-gauge-plan').values, gg = engine.run('go-nogo-gauge', { feature: 'hole', lower: pg.lower, upper: pg.upper, gpct: 10, wpct: 5 }).values;
  near(pg.it, engine.run('it-tolerance-grade', { size: 25, grade: '7' }).values.it, 1e-12, 'work tolerance');
  near(pg.goLo, gg.go[0], 1e-12, 'go low'); near(pg.goHi, gg.go[1], 1e-12, 'go high'); near(pg.nogoLo, gg.nogo[0], 1e-12, 'no-go low'); near(pg.nogoHi, gg.nogo[1], 1e-12, 'no-go high');
  const sh = engine.run('plug-gauge-plan', { feature: 'shaft' }).values, gs = engine.run('go-nogo-gauge', { feature: 'shaft', lower: sh.lower, upper: sh.upper, gpct: 10, wpct: 5 }).values;
  near(sh.upper, 25, 1e-12, 'shaft upper limit'); near(sh.goLo, gs.go[0], 1e-12, 'ring go low'); near(sh.nogoHi, gs.nogo[1], 1e-12, 'ring no-go high');
});

test('twenty-sixth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('c-frame-throat-check').text, 'THROAT ADEQUATE');
  assert.equal(engine.run('c-frame-throat-check', { b: 80 }).text, 'THROAT OVERSTRESSED');
  assert.equal(engine.run('bolt-pattern-hole-plan').text, 'PATTERN WORKS');
  assert.equal(engine.run('bolt-pattern-hole-plan', { mode: 'fixed', Hm: 10.3 }).text, 'PATTERN DOES NOT WORK');
  assert.equal(engine.run('bolt-pattern-hole-plan', { OD: 120 }).text, 'PATTERN DOES NOT WORK');
  assert.equal(engine.run('bolt-pattern-hole-plan', { n: 14 }).text, 'PATTERN DOES NOT WORK');
  assert.equal(engine.run('interference-fit-limits-check').text, 'FIT WORKS OVER ITS LIMITS');
  assert.equal(engine.run('interference-fit-limits-check', { ei: 30 }).text, 'FIT DOES NOT WORK');
  assert.equal(engine.run('interference-fit-limits-check', { Sy: 280 }).text, 'FIT DOES NOT WORK');
  assert.equal(engine.run('interference-fit-limits-check', { ei: 20 }).text, 'FIT DOES NOT WORK');
  assert.equal(engine.run('pontoon-float-check').text, 'FLOAT ADEQUATE');
  assert.equal(engine.run('pontoon-float-check', { pay: 1200 }).text, 'FLOAT NOT ADEQUATE');
  assert.equal(engine.run('pontoon-float-check', { minFb: 350 }).text, 'FLOAT NOT ADEQUATE');
  assert.equal(engine.run('spade-drilling-plan').text, 'MACHINE CAN DRILL IT');
  assert.equal(engine.run('spade-drilling-plan', { f: 0.6 }).text, 'MACHINE CANNOT DRILL IT');
  assert.equal(engine.run('spade-drilling-plan', { avail: 4 }).text, 'MACHINE CANNOT DRILL IT');
  assert.equal(engine.run('thrust-pad-bearing-check').text, 'BEARING ADEQUATE');
  assert.equal(engine.run('thrust-pad-bearing-check', { W: 25000 }).text, 'BEARING NOT ADEQUATE');
  assert.equal(engine.run('thrust-pad-bearing-check', { rpm: 2000 }).text, 'BEARING NOT ADEQUATE');
  assert.equal(engine.run('thrust-pad-bearing-check', { supply: 2 }).text, 'BEARING NOT ADEQUATE');
  assert.equal(engine.run('tube-post-eccentric-check').text, 'POST ADEQUATE');
  assert.equal(engine.run('tube-post-eccentric-check', { P: 60000 }).text, 'POST NOT ADEQUATE');
  assert.equal(engine.run('tube-post-eccentric-check', { slMax: 150 }).text, 'POST NOT ADEQUATE');
  assert.equal(engine.run('hot-surface-insulation-check').text, 'INSULATION ADEQUATE');
  assert.equal(engine.run('hot-surface-insulation-check', { t: 10 }).text, 'INSULATION NOT ADEQUATE');
  assert.equal(engine.run('hot-surface-insulation-check', { cost: 20000 }).text, 'INSULATION NOT ADEQUATE');
  assert.equal(engine.run('plug-gauge-plan').text, 'GAUGES MAKEABLE');
  assert.equal(engine.run('plug-gauge-plan', { grade: '5' }).text, 'GAUGE TOLERANCE TOO TIGHT');
  const cases: Array<[string, Inputs]> = [['bolt-pattern-hole-plan', { Hm: 9 }], ['bolt-pattern-hole-plan', { Hl: 10.5 }], ['bolt-pattern-hole-plan', { OD: 90 }], ['interference-fit-limits-check', { D: 40 }], ['pontoon-float-check', { pay: 3000 }], ['thrust-pad-bearing-check', { Di: 160 }], ['tube-post-eccentric-check', { t: 60 }], ['tube-post-eccentric-check', { P: 200000 }], ['hot-surface-insulation-check', { Ts: 20 }], ['plug-gauge-plan', { gpct: 50, wpct: 50 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-sixth handbook pass (handbook52): twenty-seventh round of integrated design checks.
const HB36_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['pusher-move-check', {}, { a: 4 * 0.3 / 0.36, vmax: 1, Fimp: 2000, E: 10 }],
  ['lid-counterbalance-spring', {}, { rate: 207000 * 625 / (64 * 32 * 8) }],
  ['triaxial-stress-check', {}, { ev: 0.4 * 70 / 200000 * 1e6 }],
  ['machine-noise-acceptance', {}, { diff: 8, L: 10 * Math.log10(10 ** 8.8 - 10 ** 8) }],
  ['melt-charge-blend', {}, { sA: 0.6, qA: 300, qB: 200, cost: 2.4 }],
  ['melt-charge-blend', { loss: 10 }, { aim: 10, sA: 0.4 }],
  ['angle-ring-cut-plan', {}, { joints: 4, bars: 13 }],
  ['two-span-stringer-check', {}, { wN: 2000 + 15 * 9.80665, RB: 1.25 * (2000 + 15 * 9.80665) * 3 }],
  ['inch-spur-gear-check', {}, { pd1: 2, pd2: 4.5, cd: 3.25, mod: 2.54, ratio: 2.25 }],
  ['equipment-finance-plan', {}, { d1: 18000, book: 10000 }],
];
for (const [id, over, expected, tol] of HB36_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-seventh-round design checks agree with the tools they chain', () => {
  const pm = engine.run('pusher-move-check').values, ua = engine.run('uniform-acceleration', { mode: 'time', u: 0, a: pm.a, t: 0.3 }).values;
  near(pm.vmax, ua.v, 1e-12, 'peak speed at half time'); near(ua.s, 0.15, 1e-12, 'half the stroke at half time');
  near(pm.Fimp, Math.abs(engine.run('impulse-momentum', { mode: 'force', m: 20, v0: pm.vmax, vf: 0, t: 0.01 }).values.F), 1e-9, 'hard-stop force');
  const lc = engine.run('lid-counterbalance-spring').values, ts = engine.run('torsion-spring', { d: 5, D: 32, Nb: 8, E: 207, F: lc.Mmax / 100, arm: 100, arbor: 0, allow: 1300 }).values;
  near(lc.rate, ts.rate, 1e-9, 'spring rate'); near(lc.sigma, ts.sigma, 1e-9, 'spring stress at full wind-up'); near(ts.degrees, 90, 1e-9, 'wind-up angle');
  near(lc.netClosed, 10 * 9.80665 * 250 - 2 * lc.rate * Math.PI / 2, 1e-9, 'out-of-balance closed');
  const tx = engine.run('triaxial-stress-check').values, ps = engine.run('principal-stress-3d').values, ecn = engine.run('elastic-constants', { mode: 'Enu', E: 200, nu: 0.3 }).values;
  for (const k of ['s1', 's2', 's3', 'tmax', 'vm']) near(tx[k], ps[k], 1e-9, `principal ${k}`);
  near(tx.nVM, ps.n, 1e-12, 'von Mises factor'); near(tx.G, ecn.G, 1e-12, 'shear modulus'); near(tx.K, ecn.K, 1e-9, 'bulk modulus');
  near(tx.e1 + tx.e2 + tx.e3, tx.ev, 1e-9, 'strains add to the volume change');
  const mn = engine.run('machine-noise-acceptance').values;
  near(mn.L, engine.run('sound-level', { mode: 'machine', T: 88, B: 80 }).values.L, 1e-12, 'machine level');
  near(mn.LOp, engine.run('sound-level', { mode: 'distance', Lr: mn.L, r1: 1, r2: 3 }).values.L, 1e-12, 'operator level');
  const mb = engine.run('melt-charge-blend').values, mxb = engine.run('mixture-cost', { mode: 'blend', vA: 7, vB: 12, vT: 9, batch: 500 }).values;
  near(mb.sA, mxb.sA, 1e-12, 'share of A'); near(mb.qA, mxb.qA, 1e-9, 'mass of A'); near(mb.qB, mxb.qB, 1e-9, 'mass of B');
  near(mb.cost, engine.run('mixture-cost', { mode: 'cost', q1: mb.qA, p1: 2, q2: mb.qB, p2: 3, q3: 0, p3: 0, q4: 0, p4: 0 }).values.avg, 1e-12, 'charge cost');
  near(engine.run('mixture-cost', { mode: 'cost', q1: mb.qA, p1: 7, q2: mb.qB, p2: 12, q3: 0, p3: 0, q4: 0, p4: 0 }).values.avg, 9, 1e-12, 'blend reaches the target content');
  const ar = engine.run('angle-ring-cut-plan').values, al = engine.run('angle-ring-length', { mode: 'axis', place: 'inside', D: 6096, x: 22.5, k: 109.7 }).values;
  near(ar.L, al.L, 1e-9, 'cut length'); near(ar.Dn, al.Dn, 1e-9, 'neutral diameter'); near(ar.corr, al.corr, 1e-12, 'correction');
  near(engine.run('angle-ring-cut-plan', { mode: 'constant', place: 'outside' }).values.L, engine.run('angle-ring-length', { mode: 'constant', place: 'outside', D: 6096, x: 22.5, k: 109.7 }).values.L, 1e-9, 'outside ring by length constant');
  const st = engine.run('two-span-stringer-check').values, tsb = engine.run('two-span-beam', { case: 'udl', L1: 3000, L2: 3000, w1: st.wN, w2: st.wN, a1: 1500, a2: 1500, E: 200, I: 8000000, c: 50, allow: 150 }).values;
  for (const k of ['RA', 'RB', 'RC', 'MB', 'M1', 'M2', 'd1', 'd2', 'stress']) near(st[k], tsb[k], 1e-9, `two-span ${k}`);
  const ig = engine.run('inch-spur-gear-check').values, dp = engine.run('dp-spur-gear', { P: 10, n1: 20, n2: 45, system: '20fd' }).values, lb = engine.run('lewis-bending', { Ft: ig.Ft, m: 2.54, b: 31.75, Y: 0.32, d: 50.8, rpm: 1200, make: 'hobbed', allow: 150 }).values;
  for (const k of ['pd1', 'pd2', 'od1', 'od2', 'cd']) near(ig[k], dp[k], 1e-12, `DP gear ${k}`);
  near(ig.V, lb.V, 1e-12, 'pitch-line velocity'); near(ig.Kv, lb.Kv, 1e-12, 'velocity factor'); near(ig.sigma, lb.sigma, 1e-9, 'bending stress');
  near(engine.run('inch-spur-gear-check', { system: '20stub' }).values.od1, engine.run('dp-spur-gear', { P: 10, n1: 20, n2: 45, system: '20stub' }).values.od1, 1e-12, 'stub outside diameter');
  const ef = engine.run('equipment-finance-plan').values;
  near(ef.AP, engine.run('interest-factors', { rate: 8, n: 5, m: 1, amount: 100000 }).values.AP, 1e-12, 'capital recovery factor');
  for (const meth of ['sl', 'syd', 'ddb']) { const e = engine.run('equipment-finance-plan', { method: meth }).values, ds = engine.run('depreciation-schedule', { cost: 100000, salvage: 10000, life: 5, method: meth }).values; near(e.d1, ds.first, 1e-9, `${meth} first-year depreciation`); near(e.book, ds.end, 1e-6, `${meth} end book value`); }
  near(ef.cf1, 30000 - ef.pay - 0.3 * (30000 - 18000 - 8000), 1e-9, 'year-1 cash flow');
});

test('twenty-seventh-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('pusher-move-check').text, 'MOVE ACHIEVABLE');
  assert.equal(engine.run('pusher-move-check', { t: 0.2 }).text, 'MOVE NOT ACHIEVABLE');
  assert.equal(engine.run('pusher-move-check', { Fact: 100 }).text, 'MOVE NOT ACHIEVABLE');
  assert.equal(engine.run('lid-counterbalance-spring').text, 'LID BALANCED');
  assert.equal(engine.run('lid-counterbalance-spring', { mass: 20 }).text, 'LID NOT BALANCED');
  assert.equal(engine.run('lid-counterbalance-spring', { allow: 1000 }).text, 'LID NOT BALANCED');
  assert.equal(engine.run('triaxial-stress-check').text, 'WITHIN YIELD MARGIN');
  assert.equal(engine.run('triaxial-stress-check', { Sy: 150 }).text, 'YIELD MARGIN TOO LOW');
  assert.equal(engine.run('machine-noise-acceptance').text, 'MACHINE MEETS LIMIT');
  assert.equal(engine.run('machine-noise-acceptance', { limit: 85 }).text, 'MACHINE EXCEEDS LIMIT');
  assert.equal(engine.run('machine-noise-acceptance', { B: 86 }).text, 'MEASUREMENT NOT VALID');
  assert.equal(engine.run('melt-charge-blend').text, 'BLEND WITHIN COST');
  assert.equal(engine.run('melt-charge-blend', { maxCost: 2.3 }).text, 'BLEND TOO COSTLY');
  assert.equal(engine.run('angle-ring-cut-plan').text, 'CUT PLAN OK');
  assert.equal(engine.run('angle-ring-cut-plan', { maxWaste: 2 }).text, 'WASTE TOO HIGH');
  assert.equal(engine.run('two-span-stringer-check').text, 'STRINGER ADEQUATE');
  assert.equal(engine.run('two-span-stringer-check', { I: 200000 }).text, 'STRINGER NOT ADEQUATE');
  assert.equal(engine.run('two-span-stringer-check', { Rmax: 5 }).text, 'STRINGER NOT ADEQUATE');
  assert.equal(engine.run('inch-spur-gear-check').text, 'GEAR PAIR ADEQUATE');
  assert.equal(engine.run('inch-spur-gear-check', { hp: 15 }).text, 'PINION OVERSTRESSED');
  assert.equal(engine.run('equipment-finance-plan').text, 'PAYS ITS WAY EVERY YEAR');
  assert.equal(engine.run('equipment-finance-plan', { save: 20000 }).text, 'CASH SHORT IN SOME YEARS');
  assert.equal(engine.run('equipment-finance-plan', { method: 'ddb' }).text, 'CASH SHORT IN SOME YEARS');
  const cases: Array<[string, Inputs]> = [['machine-noise-acceptance', { B: 90 }], ['melt-charge-blend', { cT: 13 }], ['melt-charge-blend', { cB: 7 }], ['melt-charge-blend', { loss: 30 }], ['angle-ring-cut-plan', { D: 30, x: 22.5 }], ['equipment-finance-plan', { salvage: 200000 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-seventh handbook pass (handbook53): twenty-eighth round of integrated design checks.
const HB37_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['porter-governor-check', {}, { k: 6, C: 0.1 }],
  ['overhang-beam-uplift-check', {}, { R1: -4000 * 800 / 3000, Tb: 4000 * 800 / 3000 / 2, stress: 20 }],
  ['beam-drop-impact-check', {}, { A: 3080, mpm: 3080e-6 * 7850 }],
  ['silent-chain-drive-check', {}, { Leven: 96, speed: 12.7 * 21 * 1200 / 60000, ratio: 2 }],
  ['jaw-clutch-milling-setup', {}, { idx: 72, whole: 8, rem: 0 }],
  ['jaw-clutch-milling-setup', { type: 'straight', Nt: 7 }, { alpha: 90 }],
  ['snatch-block-load-check', {}, { R: 10 * Math.sqrt(3), dfAct: 6 }],
  ['snatch-block-load-check', { theta: 0 }, { R: 20, factor: 2 }],
  ['crossed-belt-drive-check', {}, { v: Math.PI * 0.2 * 1450 / 60, n2: 2900 }],
  ['square-round-spring-compare', {}, { Ls: 30 }],
  ['crossed-helical-drive-check', {}, { C: 60 / (16 * Math.cos(Math.PI / 4)), ratio: 2 }],
];
for (const [id, over, expected, tol] of HB37_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-eighth-round design checks agree with the tools they chain', () => {
  const pg = engine.run('porter-governor-check').values, fg = engine.run('flyball-governor', { w: 2, c: 10, n: 200, nmax: 210, nmin: 190 }).values;
  near(pg.h, fg.h, 1e-12, 'governor height'); near(pg.dh, fg.dh, 1e-12, 'sleeve travel'); near(pg.C, fg.C, 1e-12, 'speed variation');
  near(pg.Fc, engine.run('centrifugal-force', { mass: 2, radius: pg.r, rpm: 200 }).values.F, 1e-9, 'ball centrifugal force');
  near(pg.r ** 2 + (pg.h * 1000) ** 2, 200 ** 2, 1e-6, 'ball on the arm circle');
  const ob = engine.run('overhang-beam-uplift-check').values, oh = engine.run('overhanging-beam', { case: 'one-point', L: 3000, a: 800, load: 4000, E: 200, I: 8000000, c: 50, allow: 150 }).values;
  for (const k of ['R1', 'R2', 'Mneg', 'tip', 'mid', 'stress']) near(ob[k], oh[k], 1e-9, `overhang ${k}`);
  const bd = engine.run('beam-drop-impact-check').values, ss = engine.run('section-shapes', { shape: 'I', H: 200, B: 100, tf: 10, tw: 6, rho: 7850 }).values, bi = engine.run('beam-impact', { support: 'ss', mass: 20, h: 100, L: 2000, E: 200, I: ss.Ix, c: 100, allow: 250 }).values;
  near(bd.A, ss.A, 1e-9, 'area'); near(bd.Ix, ss.Ix, 1e-6, 'second moment'); near(bd.Zx, ss.Zx, 1e-6, 'section modulus');
  for (const k of ['dst', 'sst', 'k', 'sd', 'dd']) near(bd[k], bi[k], 1e-9, `impact ${k}`);
  near(engine.run('beam-drop-impact-check', { support: 'cant' }).values.sd, engine.run('beam-impact', { support: 'cant', mass: 20, h: 100, L: 2000, E: 200, I: ss.Ix, c: 100, allow: 250 }).values.sd, 1e-9, 'cantilever impact');
  const sc = engine.run('silent-chain-drive-check').values, s1 = engine.run('silent-chain-sprocket', { P: 12.7, Nt: 21 }).values, s2 = engine.run('silent-chain-sprocket', { P: 12.7, Nt: 42 }).values, cl = engine.run('chain-length', { p: 12.7, z1: 21, z2: 42, C: 400, rpm: 1200 }).values;
  near(sc.PD1, s1.PD, 1e-12, 'small pitch diameter'); near(sc.OD1, s1.OD, 1e-12, 'small outside diameter'); near(sc.G1, s1.G, 1e-12, 'small guide groove'); near(sc.OPD1, s1.OPD, 1e-12, 'small over-pin');
  near(sc.PD2, s2.PD, 1e-12, 'large pitch diameter'); near(sc.OPD2, s2.OPD, 1e-12, 'large over-pin');
  for (const k of ['Lp', 'Leven', 'Cexact', 'speed', 'wrap']) near(sc[k], cl[k], 1e-9, `chain ${k}`);
  const jc = engine.run('jaw-clutch-milling-setup').values;
  near(jc.alpha, engine.run('clutch-teeth-dividing-head', { type: 'single', Nt: 5, theta: 60 }).values.alpha, 1e-12, 'saw-tooth head angle');
  near(engine.run('jaw-clutch-milling-setup', { type: 'double', Nt: 9, theta: 90 }).values.alpha, engine.run('clutch-teeth-dividing-head', { type: 'double', Nt: 9, theta: 90 }).values.alpha, 1e-12, 'V-tooth head angle');
  assert.equal(engine.run('jaw-clutch-milling-setup', { Nt: 7 }).values.setting, engine.run('simple-indexing', { divisions: 7, ratio: 40, plates: 'bs' }).values.best);
  const sb = engine.run('snatch-block-load-check').values;
  near(sb.R, engine.run('force-resultant', { F1: 10, a1: -30, F2: 10, a2: 30, F3: 0, a3: 0, F4: 0, a4: 0 }).values.R, 1e-12, 'block resultant');
  const cb = engine.run('crossed-belt-drive-check').values, bl = engine.run('belt-length-crossed-three', { mode: 'crossed', D1: 200, D2: 100, D3: 80, C: 600, x2: 600, y2: 0, x3: 300, y3: 250 }).values, bf = engine.run('belt-friction', { slack: cb.T2, mu: 0.3, wrap: cb.wrap, groove: 0 }).values;
  near(cb.L, bl.L, 1e-9, 'crossed belt length'); near(cb.Lopen, bl.Lopen, 1e-9, 'open belt length'); near(cb.wrap, bl.wrap, 1e-12, 'wrap');
  near(cb.ratio, bf.ratio, 1e-12, 'tension ratio'); near(cb.T1, bf.T1, 1e-9, 'tight side'); near(bf.net, cb.pull, 1e-9, 'effective pull');
  const sr = engine.run('square-round-spring-compare').values, sq = engine.run('square-wire-spring', { a: 3, D: 20, Na: 8, G: 79.3, L0: 60, Lw: 45, allow: 600 }).values, rd = engine.run('compression-spring', { d: 3, D: 20, Na: 8, ends: 'cg', G: 79.3, L0: 60, Lw: 45, allow: 600, rho: 7850 }).values;
  near(sr.ks, sq.k, 1e-12, 'square rate'); near(sr.Fs, sq.F, 1e-9, 'square load'); near(sr.Ss, sq.Sc, 1e-9, 'square stress');
  near(sr.kr, rd.k, 1e-12, 'round rate'); near(sr.Fr, rd.F, 1e-9, 'round load'); near(sr.Sr, rd.tau, 1e-9, 'round stress'); near(sr.Ls, rd.Ls, 1e-12, 'solid length');
  const ch = engine.run('crossed-helical-drive-check').values, cg = engine.run('crossed-helical-gears', { Pn: 8, n: 20, Nt: 40, psi: 45 }).values;
  for (const k of ['D', 'd', 'C', 'LG', 'LP']) near(ch[k], cg[k], 1e-12, `crossed helical ${k}`);
  const c30 = engine.run('crossed-helical-drive-check', { psi: 30 }).values;
  near(c30.V1 * Math.cos(Math.PI / 3), c30.V2 * Math.cos(Math.PI / 6), 1e-12, 'normal velocities match');
});

test('twenty-eighth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('porter-governor-check').text, 'GOVERNOR SUITABLE');
  assert.equal(engine.run('porter-governor-check', { travel: 30 }).text, 'GOVERNOR NOT SUITABLE');
  assert.equal(engine.run('porter-governor-check', { Cmax: 0.05 }).text, 'GOVERNOR NOT SUITABLE');
  assert.equal(engine.run('overhang-beam-uplift-check').text, 'OVERHANG ADEQUATE');
  assert.equal(engine.run('overhang-beam-uplift-check', { P: 20000 }).text, 'OVERHANG NOT ADEQUATE');
  assert.equal(engine.run('overhang-beam-uplift-check', { Tbolt: 0.4 }).text, 'OVERHANG NOT ADEQUATE');
  assert.equal(engine.run('overhang-beam-uplift-check', { Rmax: 4 }).text, 'OVERHANG NOT ADEQUATE');
  assert.equal(engine.run('beam-drop-impact-check').text, 'BEAM SURVIVES THE DROP');
  assert.equal(engine.run('beam-drop-impact-check', { h: 1500 }).text, 'BEAM NOT ADEQUATE');
  assert.equal(engine.run('beam-drop-impact-check', { dMax: 1 }).text, 'BEAM NOT ADEQUATE');
  assert.equal(engine.run('silent-chain-drive-check').text, 'DRIVE LAYOUT OK');
  assert.equal(engine.run('silent-chain-drive-check', { rpm: 4000 }).text, 'DRIVE LAYOUT NOT OK');
  assert.equal(engine.run('silent-chain-drive-check', { z1: 17 }).text, 'DRIVE LAYOUT NOT OK');
  assert.equal(engine.run('silent-chain-drive-check', { z2: 120, C: 200 }).text, 'DRIVE LAYOUT NOT OK');
  assert.equal(engine.run('jaw-clutch-milling-setup').text, 'SET-UP FOUND');
  assert.equal(engine.run('jaw-clutch-milling-setup', { Nt: 51 }).text, 'NEEDS DIFFERENTIAL INDEXING');
  assert.equal(engine.run('snatch-block-load-check').text, 'RIGGING ADEQUATE');
  assert.equal(engine.run('snatch-block-load-check', { T: 12 }).text, 'RIGGING NOT ADEQUATE');
  assert.equal(engine.run('snatch-block-load-check', { MBL: 40 }).text, 'RIGGING NOT ADEQUATE');
  assert.equal(engine.run('crossed-belt-drive-check').text, 'BELT DRIVE ADEQUATE');
  assert.equal(engine.run('crossed-belt-drive-check', { P: 15 }).text, 'BELT DRIVE NOT ADEQUATE');
  assert.equal(engine.run('crossed-belt-drive-check', { n1: 3000 }).text, 'BELT DRIVE NOT ADEQUATE');
  assert.equal(engine.run('square-round-spring-compare').text, 'SQUARE WIRE MEETS THE NEED');
  assert.equal(engine.run('square-round-spring-compare', { need: 300 }).text, 'NEITHER MEETS THE NEED');
  assert.equal(engine.run('square-round-spring-compare', { allow: 500, need: 150 }).text, 'ROUND WIRE MEETS THE NEED');
  assert.equal(engine.run('square-round-spring-compare', { need: 150 }).text, 'BOTH MEET THE NEED');
  assert.equal(engine.run('crossed-helical-drive-check').text, 'SLIDING WITHIN LIMIT');
  assert.equal(engine.run('crossed-helical-drive-check', { rpm: 1200 }).text, 'SLIDING TOO FAST');
  const cases: Array<[string, Inputs]> = [['porter-governor-check', { La: 120 }], ['porter-governor-check', { nmax: 180 }], ['beam-drop-impact-check', { tf: 120 }], ['silent-chain-drive-check', { z2: 15 }], ['jaw-clutch-milling-setup', { Nt: 4 }], ['jaw-clutch-milling-setup', { type: 'double', Nt: 3, theta: 20 }], ['crossed-belt-drive-check', { C: 100 }], ['square-round-spring-compare', { Lw: 25 }], ['square-round-spring-compare', { Lw: 70 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-eighth handbook pass (handbook54): twenty-ninth round of integrated design checks.
const HB38_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['heating-coil-plan', {}, { Aneed: 1, Lneed: 1000 / (Math.PI * 0.025) }],
  ['polygon-milling-setup', {}, { depth: 3, passes: 2, whole: 6, holes: 10, circle: 15 }],
  ['bolt-circle-inspection', { x1: 0, y1: 50, x2: -50 * Math.sqrt(3) / 2, y2: -25, x3: 50 * Math.sqrt(3) / 2, y3: -25 }, { D: 100, pos: 0 }, 1e-9],
  ['oval-tank-capacity', {}, { area: Math.PI * 800 * 500, V: Math.PI * 0.8 * 0.5 * 3 * 1000 }],
  ['bent-bracket-plan', {}, { nb: 2, F: 1.33 * 300 * 4 * 450 / 16 }],
  ['bent-bracket-plan', { A2: 0 }, { nb: 1 }],
  ['guard-band-acceptance', {}, { dev: 0.012 }, 1e-9],
  ['rotary-axis-feed-plan', {}, { arc: Math.PI * 40 / 2, fAch: 300 }],
  ['column-formula-compare', {}, { lam: 100, I: 937500 }],
  ['hollow-shaft-conversion', { k: 0 }, { B: 1, Di: 0 }],
];
for (const [id, over, expected, tol] of HB38_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('twenty-ninth-round design checks agree with the tools they chain', () => {
  const hc = engine.run('heating-coil-plan').values, hl = engine.run('helix-length', { D: 300, p: 50, turns: 14, ends: 500 }).values, pf = engine.run('pipe-friction', { Q: 20, d: 21, L: hc.L / 1000, nu: 1, rho: 998, eps: 0.0015, K: 1.5 }).values;
  near(hc.per, hl.per, 1e-12, 'length per turn'); near(hc.L, hl.L, 1e-9, 'developed length');
  near(hc.vel, pf.vel, 1e-12, 'tube velocity'); near(hc.f, pf.f, 1e-12, 'friction factor'); near(hc.dp, pf.dp, 1e-12, 'pressure drop');
  near(engine.run('heating-coil-plan', { turns: hc.turnsNeed }).values.Aprov, 1, 1e-9, 'turns needed give the area needed');
  const pm = engine.run('polygon-milling-setup').values, rp = engine.run('regular-polygon', { sides: 6, basis: 'flats', size: 24 }).values;
  near(pm.side, rp.side, 1e-12, 'side length'); near(pm.corners, rp.corners, 1e-12, 'across corners'); near(pm.area, rp.area, 1e-9, 'area');
  assert.equal(pm.setting, engine.run('simple-indexing', { divisions: 6, ratio: 40, plates: 'bs' }).values.best);
  const bc = engine.run('bolt-circle-inspection').values, c3 = engine.run('circle-three-points', { x1: 0.02, y1: 50.03, x2: -43.3, y2: -24.99, x3: 43.31, y3: -25.02 }).values;
  near(bc.cx, c3.cx, 1e-12, 'centre X'); near(bc.cy, c3.cy, 1e-12, 'centre Y'); near(bc.r, c3.r, 1e-12, 'radius'); near(bc.spread, c3.spread, 1e-9, 'spread');
  near(bc.pos, engine.run('true-position', { feature: 'hole', mod: 'rfs', dx: bc.cx, dy: bc.cy, tol: 0.1, size: 10, lower: 10, upper: 10 }).values.pos, 1e-12, 'centre position');
  const ot = engine.run('oval-tank-capacity').values, el = engine.run('ellipse', { major: 1600, minor: 1000 }).values;
  near(ot.area, el.area, 1e-6, 'section area'); near(ot.per, el.perimeter, 1e-9, 'perimeter');
  near(ot.plateA, (el.perimeter * 3000 + 2 * el.area) / 1e6, 1e-12, 'plate area');
  const bb = engine.run('bent-bracket-plan').values, fp = engine.run('sheet-metal-flat-pattern', { t: 2, R: 3, K: 0.4, L1: 30, A1: 90, L2: 50, A2: 90, L3: 30, A3: 0, L4: 0, A4: 0, L5: 0, minFl: 10, rMin: 1 }).values, sb = engine.run('bending-springback', { Ri: 3, t: 2, YS: 250, E: 200, angle: 90 }).values;
  near(bb.ded, fp.ded, 1e-12, 'bend deductions'); near(bb.flat, fp.flat, 1e-12, 'flat length');
  near(bb.F, engine.run('press-brake-force', { L: 300, t: 2, uts: 450, V: 16, k: 1.33, cap: 100 }).values.F, 1e-9, 'bend force');
  near(bb.Rf, sb.Rf, 1e-12, 'radius after springback'); near(bb.bendTo1, sb.bendTo, 1e-12, 'bend-to angle');
  near(engine.run('bent-bracket-plan', { A1: 60, A2: 0 }).values.flat, engine.run('sheet-metal-flat-pattern', { t: 2, R: 3, K: 0.4, L1: 30, A1: 60, L2: 50, A2: 0, L3: 0, A3: 0, L4: 0, A4: 0, L5: 0, minFl: 10, rMin: 1 }).values.flat, 1e-12, 'single bend flat length');
  const gb = engine.run('guard-band-acceptance').values, mu = engine.run('measurement-uncertainty-budget', { tol: 0.05, Ucal: 2, res: 1, srep: 1.5, offset: 30, tilt: 20, L: 500, alpha: 11.5, dT: 0.5, k: 2, turMin: 4 }).values;
  for (const k of ['abbe', 'temp', 'uc', 'U', 'tur', 'accHalf']) near(gb[k], mu[k], 1e-12, `uncertainty ${k}`);
  near(engine.run('guard-band-acceptance', { reading: gb.hi }).values.dev * 1000, gb.accHalf, 1e-6, 'upper acceptance limit');
  const ra = engine.run('rotary-axis-feed-plan').values, it = engine.run('inverse-time-feed', { mode: 'combined', dist: 50, angle: 90, radius: 40, feed: 300 }).values;
  near(ra.path, it.path, 1e-12, 'path length'); near(ra.t, it.t, 1e-12, 'block time'); near(ra.F, it.F, 1e-12, 'inverse-time F');
  const rf = engine.run('rotary-axis-feed-plan', { feed: 3000 }).values;
  near(rf.rot * rf.fAch / 3000, 2000, 1e-9, 'achievable feed runs the rotary axis at its limit');
  const cc = engine.run('column-formula-compare').values, rk = engine.run('rankine-column', { Sc: 320, E: 200, A: 1500, I: 937500, L: 2500, K: 1, aRank: 0, P: 60000, req: 3 }).values, cs = engine.run('column-safe-stress-classic', { L: 2500, r: 25, A: 1500, member: 'main', P: 60 }).values;
  near(cc.lam, rk.lambda, 1e-12, 'slenderness'); near(cc.Pcr, rk.Pcr, 1e-9, 'Rankine load'); near(cc.n, rk.n, 1e-12, 'Rankine factor');
  near(cc.Sa, cs.Sa, 1e-12, 'classic safe stress'); near(cc.Pa, cs.Pa, 1e-9, 'classic safe load');
  near(engine.run('column-formula-compare', { K: 1.4, member: 'secondary' }).values.Pa, engine.run('column-safe-stress-classic', { L: 3500, r: 25, A: 1500, member: 'secondary', P: 60 }).values.Pa, 1e-9, 'effective length in the classic formula');
  const hs = engine.run('hollow-shaft-conversion').values, sbh = engine.run('shaft-brittle-hollow', { M: 300, T: 500, Km: 1.5, Kt: 1, St: 40, k: 0.6 }).values;
  near(hs.Ds, sbh.Ds, 1e-12, 'solid diameter'); near(hs.B, sbh.B, 1e-12, 'hollow factor'); near(hs.Do, sbh.Do, 1e-12, 'hollow outside'); near(hs.Di, sbh.Di, 1e-12, 'hollow bore');
  near(hs.mH / hs.mS, sbh.w, 1e-12, 'weight ratio'); near(hs.twS / hs.twH, sbh.s, 1e-12, 'stiffness ratio');
});

test('twenty-ninth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('heating-coil-plan').text, 'COIL ADEQUATE');
  assert.equal(engine.run('heating-coil-plan', { turns: 10 }).text, 'COIL NOT ADEQUATE');
  assert.equal(engine.run('heating-coil-plan', { flow: 80 }).text, 'COIL NOT ADEQUATE');
  assert.equal(engine.run('polygon-milling-setup').text, 'SET-UP FOUND');
  assert.equal(engine.run('polygon-milling-setup', { stock: 26 }).text, 'STOCK TOO SMALL FOR SHARP CORNERS');
  assert.equal(engine.run('polygon-milling-setup', { sides: 51 }).text, 'NEEDS DIFFERENTIAL INDEXING');
  assert.equal(engine.run('bolt-circle-inspection').text, 'CONFORMS');
  assert.equal(engine.run('bolt-circle-inspection', { y1: 50.1 }).text, 'DOES NOT CONFORM');
  assert.equal(engine.run('bolt-circle-inspection', { x1: 0.06, x2: -43.24, x3: 43.37 }).text, 'DOES NOT CONFORM');
  assert.equal(engine.run('oval-tank-capacity').text, 'TANK ADEQUATE');
  assert.equal(engine.run('oval-tank-capacity', { need: 4000 }).text, 'TANK NOT ADEQUATE');
  assert.equal(engine.run('oval-tank-capacity', { support: 4000 }).text, 'TANK NOT ADEQUATE');
  assert.equal(engine.run('bent-bracket-plan').text, 'BRACKET CAN BE MADE');
  assert.equal(engine.run('bent-bracket-plan', { cap: 40 }).text, 'BRACKET NEEDS CHANGES');
  assert.equal(engine.run('bent-bracket-plan', { L1: 8 }).text, 'BRACKET NEEDS CHANGES');
  assert.equal(engine.run('bent-bracket-plan', { R: 1 }).text, 'BRACKET NEEDS CHANGES');
  assert.equal(engine.run('guard-band-acceptance').text, 'ACCEPT');
  assert.equal(engine.run('guard-band-acceptance', { reading: 25.022 }).text, 'INDETERMINATE');
  assert.equal(engine.run('guard-band-acceptance', { reading: 24.97 }).text, 'REJECT');
  assert.equal(engine.run('rotary-axis-feed-plan').text, 'FEED ACHIEVABLE');
  assert.equal(engine.run('rotary-axis-feed-plan', { feed: 3000 }).text, 'AXIS LIMIT GOVERNS');
  assert.equal(engine.run('column-formula-compare').text, 'COLUMN ADEQUATE');
  assert.equal(engine.run('column-formula-compare', { P: 70 }).text, 'COLUMN NOT ADEQUATE');
  assert.equal(engine.run('column-formula-compare', { P: 130, Sc: 800 }).text, 'COLUMN NOT ADEQUATE');
  assert.equal(engine.run('hollow-shaft-conversion').text, 'HOLLOW SHAFT WORKS');
  assert.equal(engine.run('hollow-shaft-conversion', { k: 0.9 }).text, 'HOLLOW SHAFT DOES NOT WORK');
  assert.equal(engine.run('hollow-shaft-conversion', { twMax: 0.5 }).text, 'HOLLOW SHAFT DOES NOT WORK');
  const cases: Array<[string, Inputs]> = [['heating-coil-plan', { t: 13 }], ['polygon-milling-setup', { stock: 20 }], ['bolt-circle-inspection', { x1: 0, x2: 0, y2: 0, x3: 0, y3: -50 }], ['bent-bracket-plan', { L1: 3 }], ['bent-bracket-plan', { R: 10, YS: 1500, E: 10 }], ['rotary-axis-feed-plan', { mode: 'linear', dist: 0 }], ['column-formula-compare', { L: 6000 }], ['hollow-shaft-conversion', { M: 0, T: 0 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thirty-ninth handbook pass (handbook55): thirtieth round of integrated design checks.
const HB39_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['ring-blank-make-plan', {}, { Vpl: 416 * 416 * 56 }],
  ['thread-rolling-setup', {}, { d2: 12 - 0.649519053 * 1.75, lead: 17.5, nsMin: 8, nsMax: 17 }],
  ['shear-legs-check', {}, { hgt: Math.sqrt(4000 ** 2 - 1200 ** 2), Fleg: 10000 / (2 * Math.cos(Math.asin(0.3))), Hf: 10000 * Math.tan(Math.asin(0.3)) / 2 }],
  ['stock-removal-plan', {}, { Q: 180, Pm: 7.5 }],
  ['pump-speed-control-plan', {}, { a: 10 / 160000, H: 30, Hthr: 50 - 10 / 160000 * 90000 }],
  ['lot-acceptance-from-capability', {}, { Cpk: 0.08 / 0.09 }],
  ['sump-pumpout-plan', {}, { A: 500 / 3 * 25400, net: 500 }],
  ['outdoor-cabinet-wind-tipping', {}, { q: 135, F: 351 }],
  ['segmented-flange-plan', {}, { len: 1510, weld: 1200 }],
];
for (const [id, over, expected, tol] of HB39_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirtieth-round design checks agree with the tools they chain', () => {
  const rb = engine.run('ring-blank-make-plan').values;
  near(rb.Vp, engine.run('pappus-revolution', { shape: 'custom', d: 3, Dp: 10, L: 0, A: 2500, rL: 0, rA: 175, ang: 360 }).values.V, 1e-6, 'finished ring volume');
  near(rb.Vr, engine.run('pappus-revolution', { shape: 'custom', d: 3, Dp: 10, L: 0, A: 56 * 56, rL: 0, rA: 175, ang: 360 }).values.V, 1e-6, 'rolled blank volume');
  const tr = engine.run('thread-rolling-setup').values, mt = engine.run('metric-thread', { d: 12, P: 1.75, starts: 1, Sp: 0 }).values;
  near(tr.d2, mt.d2, 1e-12, 'pitch diameter'); near(tr.d3, mt.d3, 1e-12, 'root diameter'); near(tr.As, mt.As, 1e-9, 'stress area');
  near(tr.D, engine.run('thread-roll-diameter', { d: tr.d2, T: tr.h3, Ns: 10, P: 1.75 }).values.D, 1e-9, 'roll pitch diameter');
  assert.ok(engine.run('thread-rolling-setup', { Ns: tr.nsMax }).values.D <= 180 && engine.run('thread-rolling-setup', { Ns: tr.nsMin }).values.D >= 80, 'start range fits the machine');
  const sl = engine.run('shear-legs-check').values, cb = engine.run('column-buckling', { E: 200, Sy: 250, A: sl.A, I: sl.I, L: 4000, K: 1, P: sl.Fleg, req: 3 }).values;
  near(sl.C, engine.run('triangle-solver', { mode: 'sss', a: 4000, b: 4000, c: 2400, A: 40, B: 60, C: 90 }).values.C, 1e-9, 'apex angle');
  near(sl.lam, cb.lambda, 1e-9, 'leg slenderness'); near(sl.Pcr, cb.Pcr, 1e-6, 'leg buckling load'); near(sl.n, cb.n, 1e-9, 'buckling factor');
  const sr = engine.run('stock-removal-plan').values, tp = engine.run('turning-power', { vc: 200, f: 0.3, ap: 3, D: 60, kc: 2000, eta: 80, Pavail: 15 }).values, sv = engine.run('solid-volume', { shape: 'cylinder', A: 60, B: 0, C: 100, angle: 90, rho: 7850 }).values;
  near(sr.Vstock, sv.V, 1e-6, 'stock volume'); near(sr.mStock, sv.mass, 1e-9, 'stock mass');
  near(sr.Q, tp.Q, 1e-12, 'removal rate'); near(sr.Pc, tp.Pc, 1e-12, 'cutting power'); near(sr.Pm, tp.Pm, 1e-12, 'motor power');
  const ps = engine.run('pump-speed-control-plan').values, po = engine.run('pump-operating-point').values;
  near(ps.s, po.s, 1e-12, 'speed ratio'); near(ps.nt, po.nt, 1e-9, 'speed for the target flow');
  near(engine.run('pump-affinity', { Q1: 24, H1: 40, P1: 7, n1: 1450, n2: ps.nt, D1: 200, D2: 200 }).values.H2, ps.s * ps.s * 50 - ps.a * (400 * ps.s) ** 2, 1e-9, 'affinity scaling of the best-efficiency head');
  const la = engine.run('lot-acceptance-from-capability').values, no = engine.run('normal-out-of-spec', { mean: 10.02, sd: 0.03, lsl: 9.9, usl: 10.1, qty: 10000 }).values;
  near(la.ppm, no.ppm, 1e-9, 'parts per million'); near(la.zl, no.zl, 1e-12, 'lower z'); near(la.zu, no.zu, 1e-12, 'upper z');
  near(la.Pa, engine.run('sampling-oc', { n: 50, c: 1, p: la.p * 100 }).values.Pa, 1e-12, 'probability of acceptance');
  const sp = engine.run('sump-pumpout-plan').values, sa = engine.run('simpson-area', { W: 500, Ns: 8, V0: 0, V1: 800, V2: 1200, V3: 1400, V4: 1500, V5: 1400, V6: 1200, V7: 800, V8: 0, V9: 0, V10: 0 }).values;
  near(sp.A, sa.A, 1e-9, 'Simpson area'); near(sp.At, sa.At, 1e-9, 'trapezoidal area');
  const wt = engine.run('outdoor-cabinet-wind-tipping', { V: 25, mu: 0.6 }).values, wp = engine.run('wind-pressure', { V: 25, rho: 1.2, Cd: 1.3, A: 2, h: 1 }).values, ms = engine.run('machine-tipping-stability', { mass: 300, hcg: 900, b: 300, aH: 0, Fh: wp.F, hF: 1000, tilt: 0, req: 1.5, nA: 2, La: 600, cap: 5 }).values;
  near(wt.F, wp.F, 1e-12, 'wind force'); near(wt.Mo, wp.M, 1e-9, 'overturning moment');
  near(wt.Mr, ms.Mr, 1e-9, 'restoring moment'); near(wt.sf, ms.sf, 1e-12, 'tipping factor'); near(wt.Ta, ms.Ta, 1e-9, 'anchor tension');
  near(engine.run('segmented-flange-plan').values.area, engine.run('plane-area', { shape: 'ringsector', A: 1500, B: 1300, C: 0, angle: 60 }).values.area, 1e-9, 'segment area');
});

test('thirtieth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('ring-blank-make-plan').text, 'ROLLED RING CHEAPER');
  assert.equal(engine.run('ring-blank-make-plan', { OD: 200, ID: 40 }).text, 'PLATE BLANK CHEAPER');
  assert.equal(engine.run('ring-blank-make-plan', { budget: 80 }).text, 'OVER BUDGET');
  assert.equal(engine.run('thread-rolling-setup').text, 'ROLLS FIT THE MACHINE');
  assert.equal(engine.run('thread-rolling-setup', { Ns: 5 }).text, 'ROLL SIZE OUT OF RANGE');
  assert.equal(engine.run('shear-legs-check').text, 'SHEAR LEGS ADEQUATE');
  assert.equal(engine.run('shear-legs-check', { W: 80 }).text, 'SHEAR LEGS NOT ADEQUATE');
  assert.equal(engine.run('shear-legs-check', { tie: 1 }).text, 'SHEAR LEGS NOT ADEQUATE');
  assert.equal(engine.run('stock-removal-plan').text, 'PLAN WORKABLE');
  assert.equal(engine.run('stock-removal-plan', { ap: 8 }).text, 'NOT ENOUGH POWER');
  assert.equal(engine.run('stock-removal-plan', { Vf: 50 }).text, 'YIELD TOO LOW');
  assert.equal(engine.run('pump-speed-control-plan').text, 'SPEED CONTROL SAVES');
  assert.equal(engine.run('pump-speed-control-plan', { Qt: 500 }).text, 'TARGET NOT REACHABLE');
  assert.equal(engine.run('pump-speed-control-plan', { Qt: 100, sMin: 70 }).text, 'SPEED CONTROL NOT SUITABLE');
  assert.equal(engine.run('lot-acceptance-from-capability').text, 'LOTS WILL PASS');
  assert.equal(engine.run('lot-acceptance-from-capability', { sd: 0.05 }).text, 'LOTS AT RISK OF REJECTION');
  assert.equal(engine.run('sump-pumpout-plan').text, 'EMPTIES IN TIME');
  assert.equal(engine.run('sump-pumpout-plan', { pump: 400 }).text, 'TOO SLOW');
  assert.equal(engine.run('outdoor-cabinet-wind-tipping').text, 'STABLE IN WIND');
  assert.equal(engine.run('outdoor-cabinet-wind-tipping', { V: 25 }).text, 'WILL SLIDE');
  assert.equal(engine.run('outdoor-cabinet-wind-tipping', { V: 25, mu: 0.6 }).text, 'ANCHORS NEEDED');
  assert.equal(engine.run('outdoor-cabinet-wind-tipping', { V: 25, mu: 0.6, cap: 0.3 }).text, 'UNSTABLE IN WIND');
  assert.equal(engine.run('segmented-flange-plan').text, 'SEGMENT PLAN OK');
  assert.equal(engine.run('segmented-flange-plan', { yMin: 60 }).text, 'YIELD TOO LOW');
  assert.equal(engine.run('segmented-flange-plan', { n: 4, pl: 2000, pw: 1000 }).text, 'SEGMENT DOES NOT FIT THE PLATE');
  const cases: Array<[string, Inputs]> = [['ring-blank-make-plan', { ID: 500 }], ['thread-rolling-setup', { P: 15 }], ['thread-rolling-setup', { Dmax: 50 }], ['shear-legs-check', { s: 9000 }], ['shear-legs-check', { t: 40 }], ['stock-removal-plan', { Vf: 400 }], ['pump-speed-control-plan', { Hb: 60 }], ['lot-acceptance-from-capability', { c: 60 }], ['sump-pumpout-plan', { Ns: 7 }], ['sump-pumpout-plan', { pump: 90 }], ['segmented-flange-plan', { ID: 3200 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fortieth handbook pass (handbook56): thirty-first round of integrated design checks.
const HB40_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['three-leg-sling-check', { x1: 1000, y1: 0, x2: -500, y2: 500 * Math.sqrt(3), x3: -500, y3: -500 * Math.sqrt(3) }, { T1: 10 * Math.hypot(1000, 1500) / 1500, T2: 10 * Math.hypot(1000, 1500) / 1500, T3: 10 * Math.hypot(1000, 1500) / 1500 }],
  ['instrument-calibration-check', {}, { worst: 0.4, worstPoint: 3, k: 3 }],
  ['npt-port-check', {}, { L2: 7.472 / 14, need: (7.472 + 2) / 14 * 25.4 }],
  ['fit-at-temperature-check', {}, { dHot: 0.08 - 50 * 11.5e-6 * 80 }],
  ['fit-at-temperature-check', { Top: 20 }, { dHot: 0.08 }],
  ['spring-fatigue-check', {}, { k: 79300 * 16 / (8 * 4096 * 8), Ls: 20 }],
  ['cam-return-spring-check', {}, { xs: 0.75, Ffull: 120 }],
  ['cam-return-spring-check', { law: 'shm' }, { s: 20 }],
  ['angular-cutter-fluting-setup', {}, { idx: 40, whole: 4, holes: 8, circle: 18 }],
  ['gearbox-oil-temperature-check', {}, { loss: 1200, Teq: 70, Trun: 70 }],
  ['small-tool-substitution-check', {}, { ratio: 0.8 ** 4 / 1.44 }],
];
for (const [id, over, expected, tol] of HB40_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-first-round design checks agree with the tools they chain', () => {
  const sl = engine.run('three-leg-sling-check').values, pts = [[1200, 0, -1500], [-600, 1000, -1500], [-600, -1000, -1500]], Ls = pts.map((p) => Math.hypot(...p)), ls: Inputs = { size: '3' };
  for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) ls[`a${i + 1}${j + 1}`] = pts[j][i] / Ls[j]; ls[`b${i + 1}`] = [0, 0, -30][i]; }
  const sys = engine.run('linear-system', ls).values;
  near(sl.T1, sys.x1, 1e-9, 'leg 1 tension'); near(sl.T2, sys.x2, 1e-9, 'leg 2 tension'); near(sl.T3, sys.x3, 1e-9, 'leg 3 tension');
  const c3 = engine.run('coordinates-3d', { mode: 'rect', p1: 1200, p2: 0, p3: -1500 }).values;
  near(sl.L1, c3.rho, 1e-9, 'leg 1 length'); near(sl.a1, 180 - c3.ph, 1e-9, 'leg 1 angle from vertical');
  const ic = engine.run('instrument-calibration-check').values;
  near(ic.corr, engine.run('linear-interpolation', { mode: 'x', x1: 5, y1: 5.04, x2: 7.5, y2: 7.52, x: 0, y: 6 }).values.result, 1e-12, 'corrected reading');
  const np = engine.run('npt-port-check').values, nt = engine.run('npt-thread', { D: 0.84, n: 14 }).values;
  near(np.E0, nt.E0, 1e-12, 'small-end pitch diameter'); near(np.L2, nt.L2, 1e-12, 'effective length'); near(np.E2, nt.E2, 1e-12, 'pitch diameter at L2'); near(np.h, nt.h, 1e-12, 'thread height');
  const ft = engine.run('fit-at-temperature-check').values, pf = { d: 50, D: 100, di: 0, L: 60, mu: 0.15, Eh: 70, nuh: 0.33, Es: 200, nus: 0.3, Sy: 250, req: 1.5, alpha: 23, clear: 0 };
  const pc = engine.run('press-fit', { ...pf, delta: 0.08 }).values, ph = engine.run('press-fit', { ...pf, delta: ft.dHot }).values;
  near(ft.pCold, pc.p, 1e-9, 'pressure at assembly'); near(ft.Tcold, pc.T, 1e-9, 'torque at assembly'); near(ft.vmCold, pc.vm, 1e-9, 'hub stress at assembly');
  near(ft.pHot, ph.p, 1e-9, 'pressure hot'); near(ft.Thot, ph.T, 1e-9, 'torque hot'); near(ft.n, pc.n, 1e-12, 'hub factor at the tightest');
  const sf = engine.run('spring-fatigue-check').values, cs1 = engine.run('compression-spring', { d: 2, D: 16, Na: 8, ends: 'cg', G: 79.3, L0: 50, Lw: 42, allow: 700, rho: 7850 }).values, cs2 = engine.run('compression-spring', { d: 2, D: 16, Na: 8, ends: 'cg', G: 79.3, L0: 50, Lw: 35, allow: 700, rho: 7850 }).values;
  near(sf.F1, cs1.F, 1e-9, 'preload'); near(sf.tau1, cs1.tau, 1e-9, 'preload stress'); near(sf.F2, cs2.F, 1e-9, 'working load'); near(sf.tau2, cs2.tau, 1e-9, 'working stress'); near(sf.Ls, cs2.Ls, 1e-12, 'solid length');
  const gf = engine.run('goodman-fatigue', { sa: sf.ta, sm: sf.tm, Se: 310, Su: 1100, Sy: 800, req: 1.3 }).values;
  for (const k of ['nG', 'nS', 'nGb', 'ny', 'gov']) near(sf[k], gf[k], 1e-9, `fatigue ${k}`);
  const cr = engine.run('cam-return-spring-check').values, cm = engine.run('cam-motion', { law: 'cyc', h: 20, beta: 120, rpm: 300, mass: 1.5 }).values;
  near(cr.a, cm.a, 1e-12, 'peak acceleration'); near(cr.Fi, cm.F, 1e-12, 'inertia force'); near(cr.vel, cm.vel, 1e-12, 'peak velocity');
  near(engine.run('cam-return-spring-check', { rpm: cr.rpmJump }).values.ratio, 1, 1e-9, 'jump speed gives a ratio of one');
  for (const law of ['shm', 'parab', 'poly']) near(engine.run('cam-return-spring-check', { law }).values.Fi, engine.run('cam-motion', { law, h: 20, beta: 120, rpm: 300, mass: 1.5 }).values.F, 1e-12, `${law} inertia force`);
  const ac = engine.run('angular-cutter-fluting-setup').values, as = engine.run('angular-cutter-setting', { Nt: 9, B: 35, C: 55 }).values;
  near(ac.A, as.A, 1e-12, 'setting angle'); near(ac.D, as.D, 1e-12, 'angle D'); near(ac.E, as.E, 1e-12, 'angle E');
  assert.equal(ac.setting, engine.run('simple-indexing', { divisions: 9, ratio: 40, plates: 'bs' }).values.best);
  const go = engine.run('gearbox-oil-temperature-check').values, gh = engine.run('gearbox-heat-balance', { mode: 'gear', P: 15, eff: 92, A: 2, h: 15, Tamb: 30, Tmax: 80, dT: 5, cp: 1.9, rho: 870 }).values;
  for (const k of ['loss', 'Teq', 'Plim', 'duty', 'flow']) near(go[k], gh[k], 1e-9, `heat balance ${k}`);
  near(go.nu, engine.run('oil-viscosity-temperature', { T1: 40, v1: 220, T2: 100, v2: 19, T: 70 }).values.nu, 1e-9, 'viscosity hot');
  const gc = engine.run('gearbox-oil-temperature-check', { P: 30 }).values, gh2 = engine.run('gearbox-heat-balance', { mode: 'gear', P: 30, eff: 92, A: 2, h: 15, Tamb: 30, Tmax: 80, dT: 5, cp: 1.9, rho: 870 }).values;
  near(gc.duty, gh2.duty, 1e-9, 'cooler duty'); near(gc.flow, gh2.flow, 1e-9, 'cooler oil flow'); near(gc.Trun, 80, 1e-12, 'cooler holds the limit');
  const st = engine.run('small-tool-substitution-check').values, mt = engine.run('microtool-stiffness', { D1: 1, L1: 1, D2: 0.8, L2: 1.2, Lo: 3, k: 0.8, E: 600, F: 2 }).values;
  near(st.ratio, mt.ratio, 1e-12, 'stiffness ratio'); near(st.dD, mt.dD, 1e-9, 'diameter change'); near(st.delta, mt.delta * 1000, 1e-9, 'deflection');
  near(engine.run('small-tool-substitution-check', { F: st.Fok }).values.delta, 5, 1e-9, 'force for the limit gives the limit');
});

test('thirty-first-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('three-leg-sling-check').text, 'SLING ADEQUATE');
  assert.equal(engine.run('three-leg-sling-check', { W: 40 }).text, 'SLING NOT ADEQUATE');
  assert.equal(engine.run('three-leg-sling-check', { angMax: 30 }).text, 'SLING NOT ADEQUATE');
  assert.equal(engine.run('three-leg-sling-check', { x1: 200, x2: -100, x3: 2000, y3: 0 }).text, 'A LEG GOES SLACK');
  assert.equal(engine.run('instrument-calibration-check').text, 'WITHIN ACCURACY CLASS');
  assert.equal(engine.run('instrument-calibration-check', { m4: 7.65 }).text, 'OUT OF ACCURACY CLASS');
  assert.equal(engine.run('npt-port-check').text, 'PORT ADEQUATE');
  assert.equal(engine.run('npt-port-check', { depth: 15 }).text, 'PORT NOT ADEQUATE');
  assert.equal(engine.run('npt-port-check', { boss: 28 }).text, 'PORT NOT ADEQUATE');
  assert.equal(engine.run('fit-at-temperature-check').text, 'FIT HOLDS AT TEMPERATURE');
  assert.equal(engine.run('fit-at-temperature-check', { Top: 150 }).text, 'FIT DOES NOT WORK');
  assert.equal(engine.run('fit-at-temperature-check', { Top: 200 }).text, 'FIT GOES LOOSE');
  assert.equal(engine.run('fit-at-temperature-check', { Sy: 160 }).text, 'FIT DOES NOT WORK');
  assert.equal(engine.run('spring-fatigue-check').text, 'INFINITE LIFE EXPECTED');
  assert.equal(engine.run('spring-fatigue-check', { L2: 30 }).text, 'FATIGUE FAILURE LIKELY');
  assert.equal(engine.run('cam-return-spring-check').text, 'FOLLOWER STAYS IN CONTACT');
  assert.equal(engine.run('cam-return-spring-check', { rpm: 500 }).text, 'FOLLOWER WILL JUMP');
  assert.equal(engine.run('cam-return-spring-check', { Fmax: 100 }).text, 'SPRING OVERLOADED');
  assert.equal(engine.run('angular-cutter-fluting-setup').text, 'SET-UP FOUND');
  assert.equal(engine.run('angular-cutter-fluting-setup', { Nt: 51 }).text, 'NEEDS DIFFERENTIAL INDEXING');
  assert.equal(engine.run('gearbox-oil-temperature-check').text, 'TEMPERATURE AND GRADE OK');
  assert.equal(engine.run('gearbox-oil-temperature-check', { P: 30, nuMin: 30 }).text, 'COOLER REQUIRED');
  assert.equal(engine.run('gearbox-oil-temperature-check', { v40: 100, v100: 11 }).text, 'OIL TOO THIN WHEN HOT');
  assert.equal(engine.run('small-tool-substitution-check').text, 'DEFLECTION WITHIN LIMIT');
  assert.equal(engine.run('small-tool-substitution-check', { dMax: 2 }).text, 'REDUCE FEED');
  const cases: Array<[string, Inputs]> = [['three-leg-sling-check', { x1: 1000, y1: 0, x2: -1000, y2: 0, x3: 0, y3: 0 }], ['instrument-calibration-check', { m3: 2 }], ['instrument-calibration-check', { hi: -5 }], ['npt-port-check', { n: 0.5 }], ['fit-at-temperature-check', { D: 40 }], ['spring-fatigue-check', { L2: 19 }], ['spring-fatigue-check', { L1: 30 }], ['angular-cutter-fluting-setup', { Nt: 5, B: 10, C: 20 }], ['gearbox-oil-temperature-check', { Tmax: 20 }], ['gearbox-oil-temperature-check', { v100: 300 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-first handbook pass (handbook57): thirty-second round of integrated design checks.
const HB41_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['acme-lead-screw-check', {}, { d2: 18, d3: 15.5, nThr: 10, pNut: 10000 / (Math.PI * 18 * 2 * 10) }],
  ['gear-shaft-sizing', {}, { M: Math.hypot(2469.645672413793 * 60, 930.5864792913799 * 60 + 661.7395635142929 * 40) / 1000 }, 1e-6],
  ['face-milling-power-plan', {}, { z: 10, n: 200000 / (Math.PI * 125) }],
  ['ballscrew-duty-life', {}, { nm: 1800, km: 986426767.6767681 * 10 / 1e6 }, 1e-3],
  ['turn-of-nut-fatigue-check', {}, { C: 369.77868670945026 / (369.77868670945026 + 1200) }, 1e-9],
  ['unified-thread-wire-limits', {}, { d2max: 0.4485, d2min: 0.4435 }],
  ['change-gear-threading-setup', {}, { err2: 0, err4: 0, passes: 10 }],
  ['panel-material-substitution', {}, { tStiff: 2 * Math.cbrt(200 / 70), tStr: 2 * Math.sqrt(250 / 150), m1: 15.7 }],
  ['cone-clutch-engagement', {}, { Ek: 0.25 * (2 * Math.PI * 1000 / 60) ** 2 }],
];
for (const [id, over, expected, tol] of HB41_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-second-round design checks agree with the tools they chain', () => {
  const ls = engine.run('acme-lead-screw-check').values, at = engine.run('acme-thread', { system: 'tr', d: 20, P: 4, tpi: 5, starts: 1 }).values, ps = engine.run('power-screw-torque', { F: 10000, dm: 18, lead: 4, flank: '15', mu: 0.12, dc: 30, muc: 0.12 }).values;
  near(ls.d2, at.d2, 1e-12, 'pitch diameter'); near(ls.d3, at.d3, 1e-12, 'root diameter'); near(ls.area, at.area, 1e-9, 'root area'); near(ls.lead, at.lead, 1e-12, 'lead');
  near(ls.Tr, ps.Tr, 1e-12, 'raising torque'); near(ls.Tl, ps.Tl, 1e-12, 'lowering torque'); near(ls.eff, ps.eff, 1e-9, 'efficiency');
  near(engine.run('acme-lead-screw-check', { Lnut: ls.Lneed }).values.pNut, 10, 1e-9, 'nut length gives the allowable pressure');
  const gs = engine.run('gear-shaft-sizing').values, gf = engine.run('gear-forces', { kW: 15, rpm: 1450, d: 80, alphan: 20, beta: 15 }).values;
  near(gs.Ft, gf.Ft, 1e-9, 'tangential force'); near(gs.Fr, gf.Fr, 1e-9, 'radial force'); near(gs.Fa, gf.Fa, 1e-9, 'axial force'); near(gs.T, gf.T, 1e-12, 'torque');
  near(gs.dreq, engine.run('shaft-diameter', { M: gs.M, T: gs.T, Km: 1.5, Kt: 1, tau: 40, keyway: 'yes', d: 40 }).values.dreq, 1e-12, 'diameter needed');
  const sc = engine.run('shaft-combined-stress', { d: 40, di: 0, P: -gs.Fa, M: gs.M, T: gs.T, Sy: 350, req: 2 }).values;
  near(gs.vm, sc.vm, 1e-9, 'von Mises stress'); near(gs.n, sc.n, 1e-9, 'yield factor');
  const fm = engine.run('face-milling-power-plan').values, ck = engine.run('chip-thickness-kc', { op: 'mill', fz: 0.15, ae: 80, D: 125, kappa: 90, kc1: 1700, mc: 0.25, rake: 0 }).values, mp = engine.run('milling-power', { ae: 80, ap: 3, vf: fm.vf, D: 125, rpm: fm.n, kc: fm.kc, eta: 80, Pavail: 15 }).values;
  near(fm.Tt, engine.run('milling-cutter-teeth', { mode: 'face', D: 125, W: 80, d: 3, helix: 0, zc: 2, H: 7.5, F: 0.2, n: 272, mat: 'steel', K: 14278 }).values.T, 1e-12, 'teeth suggested');
  near(fm.hm, ck.hm, 1e-12, 'mean chip thickness'); near(fm.kc, ck.kc, 1e-9, 'specific cutting force');
  near(fm.Q, mp.Q, 1e-9, 'removal rate'); near(fm.Pc, mp.Pc, 1e-9, 'cutting power'); near(fm.Pm, mp.Pm, 1e-9, 'motor power'); near(fm.T, mp.T, 1e-9, 'spindle torque');
  const bd = engine.run('ballscrew-duty-life').values, dc = engine.run('bearing-duty-cycle', { type: 'ball', C: 50, P1: 4, n1: 1500, t1: 50, P2: 8, n2: 750, t2: 20, P3: 2, n3: 3000, t3: 30, P4: 0, n4: 0, t4: 0 }).values, bl = engine.run('ball-screw-life', { Ca: 50, Fm: bd.Fm, fw: 1.2, lead: 10, rpm: bd.nm, req: 8000 }).values;
  near(bd.nm, dc.nm, 1e-12, 'mean speed'); near(bd.Fm, dc.Pm, 1e-12, 'cubic mean load');
  near(bd.L, bl.L, 1e-3, 'life in revolutions'); near(bd.hours, bl.hours, 1e-9, 'life in hours'); near(bd.km, bl.km, 1e-6, 'travel');
  const tn = engine.run('turn-of-nut-fatigue-check').values, tp = engine.run('turn-of-nut-preload', { mode: 'preload', Ft: 35, theta: 25, lead: 1.5, d: 10, At: 58, Ls: 30, Lt: 10, E: 205, kj: 1200 }).values, bj = engine.run('bolted-joint-fatigue', { At: 58, Fi: tn.F, P: 5, C: tn.C, Se: 129, Sut: 830, req: 2 }).values;
  near(tn.F, tp.F, 1e-9, 'preload'); near(tn.kb, tp.kb, 1e-9, 'bolt stiffness');
  near(tn.sa, bj.sa, 1e-9, 'alternating stress'); near(tn.si, bj.si, 1e-9, 'preload stress'); near(tn.n, bj.n, 1e-9, 'fatigue factor');
  const uw = engine.run('unified-thread-wire-limits').values, ul = engine.run('unified-thread-limits', { D: 0.5, n: 13, cls: '2', LE: 0 }).values;
  near(uw.d2max, ul.d2max, 1e-12, 'pitch diameter max'); near(uw.d2min, ul.d2min, 1e-12, 'pitch diameter min');
  const tw = engine.run('three-wire', { angle: '60', P: uw.P, E: ul.d2max, W: 0, Mmeas: 0.5126 }).values;
  near(uw.Mmax, tw.M, 1e-12, 'reading at maximum pitch diameter'); near(uw.W, tw.W, 1e-12, 'best wire'); near(uw.E, tw.Efrom, 1e-12, 'pitch diameter from the reading');
  near(uw.Mmin, engine.run('three-wire', { angle: '60', P: uw.P, E: ul.d2min, W: 0, Mmeas: 0 }).values.M, 1e-12, 'reading at minimum pitch diameter');
  const cg = engine.run('change-gear-threading-setup').values, ch = engine.run('change-gears').values, mt = engine.run('metric-thread', { d: 12, P: 1.5, starts: 1, Sp: 0 }).values;
  near(cg.req, ch.req, 1e-12, 'ratio needed'); assert.equal(cg.best4, ch.best4); near(cg.d2, mt.d2, 1e-12, 'pitch diameter');
  const cf = engine.run('change-gear-threading-setup', { fixed: 1.37, set: 'g4', tolPct: 0.0001 }).values, chf = engine.run('change-gears', { cutUnit: 'mm', cut: 1.5, screwUnit: 'tpi', screw: 8, fixed: 1.37, set: 'g4' }).values;
  near(cf.err2, chf.err2, 1e-9, 'simple train error'); near(cf.err4, chf.err4, 1e-9, 'compound train error');
  const pm = engine.run('panel-material-substitution').values, es = engine.run('equivalent-stiffness-thickness', { t1: 2, E1: 200, S1: 250, rho1: 7850, E2: 70, S2: 150, rho2: 2700 }).values;
  for (const k of ['tStiff', 'tStr', 't2', 'mr']) near(pm[k], es[k], 1e-12, `substitution ${k}`);
  const cc = engine.run('cone-clutch-engagement').values, cl = engine.run('cone-clutch', { Do: 200, Di: 160, alpha: 12, mu: 0.25, F: 1500, Treq: 150 }).values;
  near(cc.T, cl.T, 1e-12, 'torque capacity'); near(cc.Fe, cl.Fe, 1e-9, 'engaging force');
  near(engine.run('angular-acceleration-torque', { J: 0.5, n0: 0, n1: 1000, t: cc.ts, Tf: 40 }).values.T, cc.T, 1e-9, 'slip time accelerates the load at clutch torque');
  near(cc.E, cc.Ek + 40 * (2 * Math.PI * 1000 / 60) * cc.ts / 2, 1e-6, 'slip energy = kinetic energy + work against load');
});

test('thirty-second-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('acme-lead-screw-check').text, 'LEAD SCREW ADEQUATE');
  assert.equal(engine.run('acme-lead-screw-check', { Lnut: 30 }).text, 'LEAD SCREW NOT ADEQUATE');
  assert.equal(engine.run('acme-lead-screw-check', { starts: 4, mu: 0.05 }).text, 'SCREW BACKDRIVES');
  assert.equal(engine.run('acme-lead-screw-check', { F: 30000, Lnut: 200 }).text, 'LEAD SCREW NOT ADEQUATE');
  assert.equal(engine.run('gear-shaft-sizing').text, 'SHAFT ADEQUATE');
  assert.equal(engine.run('gear-shaft-sizing', { d: 30 }).text, 'SHAFT TOO SMALL');
  assert.equal(engine.run('gear-shaft-sizing', { req: 15 }).text, 'SHAFT TOO SMALL');
  assert.equal(engine.run('face-milling-power-plan').text, 'WITHIN SPINDLE POWER');
  assert.equal(engine.run('face-milling-power-plan', { ap: 5 }).text, 'EXCEEDS SPINDLE POWER');
  assert.equal(engine.run('ballscrew-duty-life').text, 'LIFE ADEQUATE');
  assert.equal(engine.run('ballscrew-duty-life', { req: 12000 }).text, 'LIFE TOO SHORT');
  assert.equal(engine.run('turn-of-nut-fatigue-check').text, 'JOINT ADEQUATE');
  assert.equal(engine.run('turn-of-nut-fatigue-check', { theta: 35 }).text, 'PRELOAD TOO HIGH');
  assert.equal(engine.run('turn-of-nut-fatigue-check', { P: 20 }).text, 'FATIGUE RISK');
  assert.equal(engine.run('unified-thread-wire-limits').text, 'ACCEPT');
  assert.equal(engine.run('unified-thread-wire-limits', { Mmeas: 0.516 }).text, 'REJECT');
  assert.equal(engine.run('unified-thread-wire-limits', { Mmeas: 0.508 }).text, 'REJECT');
  assert.equal(engine.run('change-gear-threading-setup').text, 'GEAR TRAIN FOUND');
  assert.equal(engine.run('change-gear-threading-setup', { fixed: 1.37, set: 'g4', tolPct: 0.0001 }).text, 'NO ACCURATE TRAIN');
  assert.equal(engine.run('panel-material-substitution').text, 'SUBSTITUTION SAVES WEIGHT');
  assert.equal(engine.run('panel-material-substitution', { tMax: 2.5 }).text, 'TOO THICK FOR AVAILABLE STOCK');
  assert.equal(engine.run('panel-material-substitution', { E2: 100, S2: 100, rho2: 8900 }).text, 'NO WEIGHT SAVING');
  assert.equal(engine.run('cone-clutch-engagement').text, 'CLUTCH ADEQUATE');
  assert.equal(engine.run('cone-clutch-engagement', { Treq: 200 }).text, 'CLUTCH SLIPS UNDER LOAD');
  assert.equal(engine.run('cone-clutch-engagement', { J: 5 }).text, 'CLUTCH OVERHEATS');
  const cases: Array<[string, Inputs]> = [['face-milling-power-plan', { W: 150 }], ['ballscrew-duty-life', { n1: 0, n2: 0, n3: 0 }], ['ballscrew-duty-life', { P1: 0, P2: 0, P3: 0 }], ['turn-of-nut-fatigue-check', { Ls: 0, Lt: 0 }], ['turn-of-nut-fatigue-check', { theta: 80 }], ['unified-thread-wire-limits', { n: 2 }], ['change-gear-threading-setup', { P: 5, d: 4 }], ['cone-clutch-engagement', { Tl: 200 }], ['cone-clutch-engagement', { Di: 250 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-second handbook pass (handbook58): thirty-third round of integrated design checks.
const HB42_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['eccentric-bracket-bolt-check', {}, { xc: 50, yc: 50, J: 20000, crit: 2 }],
  ['pulley-shaft-bush-check', {}, { R2: 613.8833528571428 * 80 / 200 }, 1e-9],
  ['torque-tube-end-weld-check', {}, { Aw: 5000, per: 300, qf: 150 }],
  ['arc-segmentation-feed-check', {}, { arcLen: 25 * Math.PI, tArc: 25 * Math.PI / 3000 * 60 }],
  ['involute-spline-design', {}, { Dmm: 31.75, hmm: 1.5875 }],
  ['balance-correction-check', { angErr: 0, step: 0.001 }, { Ures: 0 }, 1e-1],
  ['bend-feasibility-check', {}, { Rmin: 0.75, Rmax: 1200 }],
  ['whitworth-wire-inspection', {}, { d2: 0.5 - 0.640327 / 12 }],
  ['casting-pattern-plan', {}, { Cx: 306, Cy: 206, Cz: 103, Vc: 306 * 206 * 103 / 1e6 }],
];
for (const [id, over, expected, tol] of HB42_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-third-round design checks agree with the tools they chain', () => {
  const eb = engine.run('eccentric-bracket-bolt-check').values, bg = engine.run('bolt-group-eccentric').values, bs = engine.run('bolt-shear-bearing', { F: eb.Fc * 1000, n: 1, planes: '1', d: 16, t: 10, tauAllow: 150, bAllow: 250 }).values;
  near(eb.Fc, bg.Fmax, 1e-12, 'critical bolt force'); near(eb.M, bg.M, 1e-9, 'moment about the centroid');
  near(eb.tau, bs.tau, 1e-9, 'bolt shear stress'); near(eb.sb, bs.sb, 1e-9, 'bearing stress');
  const pb = engine.run('pulley-shaft-bush-check').values, jb = engine.run('journal-bearing-pv', { W: pb.R1, d: 30, L: 30, rpm: 700, Pmax: 25, Vmax: 2.5, PVmax: 1.6 }).values;
  near(pb.P1, jb.P, 1e-12, 'near bush pressure'); near(pb.V, jb.V, 1e-12, 'sliding speed'); near(pb.PV1, jb.PV, 1e-12, 'near bush PV');
  near(pb.R1 - pb.R2, pb.Fs, 1e-9, 'bush loads balance the belt pull');
  near(engine.run('pulley-shaft-bush-check', { L: pb.Lneed }).values.PV1, 1.6, 1e-9, 'bush length for the PV limit');
  const tt = engine.run('torque-tube-end-weld-check').values, tz = engine.run('thin-tube-torsion').values, fw = engine.run('fillet-weld-strength', { leg: 5, L: 300, nw: 1, tau: 145, F: tt.Fw }).values;
  for (const k of ['Am', 'tau', 'J', 'twist']) near(tt[k], tz[k], 1e-9, `tube ${k}`);
  near(tt.tauWeld, fw.use * 145, 1e-9, 'weld throat stress'); near(tt.legReq, fw.legReq, 1e-12, 'weld leg needed');
  const rt = engine.run('torque-tube-end-weld-check', { shape: 'round', b: 100, T: 1500 }).values, rz = engine.run('thin-tube-torsion', { shape: 'round', b: 100, h: 50, t: 4, T: 1500, L: 1000, G: 79.3, allow: 100 }).values;
  near(rt.tau, rz.tau, 1e-9, 'round tube stress'); near(rt.per, Math.PI * 100, 1e-12, 'round weld perimeter');
  const ar = engine.run('arc-segmentation-feed-check').values, ce = engine.run('cnc-chord-error', { mode: 'seg', R: 50, tol: 0.005, L: 1, angle: 90 }).values;
  near(ar.L, ce.L, 1e-12, 'segment length'); near(ar.th, ce.th, 1e-12, 'segment angle'); near(ar.nSeg, ce.n, 0, 'segments');
  near(engine.run('arc-segmentation-feed-check', { feed: ar.fMax }).values.bps, 100, 1e-9, 'largest feed uses the full block rate');
  const sp = engine.run('involute-spline-design').values, is = engine.run('involute-spline').values, stc = engine.run('spline-torque-capacity', { T: 300, D: sp.Dmm, Dre: sp.Dremm, Dh: 0, Nt: 20, Le: 25, t: sp.tmm, h: sp.hmm, kind: 'fixed', acc: 'good', Ka: 1.2, Km: 1, Kf: 1, Kw: 1, Ss: 200, Sc: 20 }).values;
  for (const k of ['D', 'Do', 'Di', 'Dre', 'Dri', 'sv']) near(sp[k], is[k], 1e-12, `spline ${k}`);
  near(sp.sRoot, stc.sRoot, 1e-9, 'root shear'); near(sp.sPitch, stc.sPitch, 1e-9, 'pitch shear'); near(sp.sComp, stc.sComp, 1e-9, 'compressive stress');
  const bc = engine.run('balance-correction-check').values, rb = engine.run('rotating-balance-plane').values, bgd = engine.run('balance-grade', { mass: 20, rpm: 1500, grade: '6.3', planes: '1', measured: 0 }).values;
  near(bc.U, rb.U, 1e-9, 'unbalance'); near(bc.mc, rb.mc, 1e-12, 'correction mass'); near(bc.ac, rb.ac, 1e-12, 'correction angle'); near(bc.F, rb.F, 1e-9, 'force');
  near(bc.Uper, bgd.U, 1e-9, 'permissible residual'); near(bc.e, bgd.e, 1e-12, 'permissible eccentricity');
  const bf = engine.run('bend-feasibility-check').values, br = engine.run('bend-radius-limits', { t: 3, r: 40, E: 200, YS: 250, R: 4 }).values, bsb = engine.run('bending-springback', { Ri: 4, t: 3, YS: 250, E: 200, angle: 90 }).values;
  near(bf.Rmin, br.Rmin, 1e-12, 'minimum radius'); near(bf.Rmax, br.Rmax, 1e-9, 'maximum radius');
  near(bf.Rf, bsb.Rf, 1e-12, 'radius after springback'); near(bf.bendTo, bsb.bendTo, 1e-12, 'bend-to angle');
  near(bf.F, engine.run('press-brake-force', { L: 1000, t: 3, uts: 450, V: 24, k: 1.33, cap: 1000 }).values.F, 1e-9, 'bending force');
  const ww = engine.run('whitworth-wire-inspection').values, wt = engine.run('whitworth-thread', { D: 0.5, n: 12 }).values, tw = engine.run('three-wire', { angle: '55', P: 1 / 12, E: wt.d2, W: 0, Mmeas: 0.5138 }).values, tl = engine.run('three-wire-lead-angle', { angle: 55, plane: 'axial', P: 1 / 12, starts: 1, E: wt.d2 }).values;
  near(ww.d2, wt.d2, 1e-12, 'pitch diameter'); near(ww.d1, wt.d1, 1e-12, 'minor diameter'); near(ww.h, wt.h, 1e-12, 'thread depth');
  near(ww.Mbasic, tw.M, 1e-12, 'reading at basic'); near(ww.E, tw.Efrom, 1e-12, 'pitch diameter from the reading'); near(ww.best, tw.best, 1e-12, 'best wire');
  near(ww.Mlead, tl.M, 1e-12, 'lead-angle reading'); near(ww.MsimpleL, tl.Msimple, 1e-12, 'simple reading with the lead-angle wire');
  const cp = engine.run('casting-pattern-plan').values, ps = { mach: 3, shrink: 10.4, Wp: 4, rhoP: 500, rhoM: 7200, cores: 0 };
  near(cp.Px, engine.run('pattern-shrinkage', { ...ps, Lp: 300, faces: 2 }).values.pattern, 1e-9, 'pattern length');
  near(cp.Py, engine.run('pattern-shrinkage', { ...ps, Lp: 200, faces: 2 }).values.pattern, 1e-9, 'pattern width');
  near(cp.Pz, engine.run('pattern-shrinkage', { ...ps, Lp: 100, faces: 1 }).values.pattern, 1e-9, 'pattern height');
  near(cp.pour, cp.mass / 0.6, 1e-9, 'metal to pour');
});

test('thirty-third-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('eccentric-bracket-bolt-check').text, 'BOLTS ADEQUATE');
  assert.equal(engine.run('eccentric-bracket-bolt-check', { d: 12 }).text, 'BOLTS NOT ADEQUATE');
  assert.equal(engine.run('eccentric-bracket-bolt-check', { t: 5 }).text, 'BOLTS NOT ADEQUATE');
  assert.equal(engine.run('pulley-shaft-bush-check').text, 'BUSHES ADEQUATE');
  assert.equal(engine.run('pulley-shaft-bush-check', { P: 6 }).text, 'BUSHES NOT ADEQUATE');
  assert.equal(engine.run('torque-tube-end-weld-check').text, 'TUBE AND WELD ADEQUATE');
  assert.equal(engine.run('torque-tube-end-weld-check', { leg: 1 }).text, 'WELD TOO SMALL');
  assert.equal(engine.run('torque-tube-end-weld-check', { twMax: 0.5 }).text, 'TUBE NOT ADEQUATE');
  assert.equal(engine.run('arc-segmentation-feed-check').text, 'FEED WITHIN BLOCK RATE');
  assert.equal(engine.run('arc-segmentation-feed-check', { feed: 9000 }).text, 'BLOCK RATE LIMITS FEED');
  assert.equal(engine.run('involute-spline-design').text, 'SPLINE ADEQUATE');
  assert.equal(engine.run('involute-spline-design', { T: 1000 }).text, 'SPLINE OVERSTRESSED');
  assert.equal(engine.run('involute-spline-design', { Sc: 3 }).text, 'SPLINE OVERSTRESSED');
  assert.equal(engine.run('balance-correction-check').text, 'BALANCE GRADE REACHED');
  assert.equal(engine.run('balance-correction-check', { angErr: 20 }).text, 'GRADE NOT REACHED');
  assert.equal(engine.run('bend-feasibility-check').text, 'BEND FEASIBLE');
  assert.equal(engine.run('bend-feasibility-check', { R: 0.5 }).text, 'RADIUS OUT OF RANGE');
  assert.equal(engine.run('bend-feasibility-check', { rA: 20 }).text, 'RADIUS OUT OF RANGE');
  assert.equal(engine.run('bend-feasibility-check', { cap: 200 }).text, 'EXCEEDS PRESS CAPACITY');
  assert.equal(engine.run('whitworth-wire-inspection').text, 'ACCEPT');
  assert.equal(engine.run('whitworth-wire-inspection', { Mmeas: 0.517 }).text, 'REJECT');
  assert.equal(engine.run('whitworth-wire-inspection', { Mmeas: 0.511 }).text, 'REJECT');
  assert.equal(engine.run('casting-pattern-plan').text, 'POUR WITHIN CAPACITY');
  assert.equal(engine.run('casting-pattern-plan', { ladle: 50 }).text, 'POUR EXCEEDS CAPACITY');
  const cases: Array<[string, Inputs]> = [['eccentric-bracket-bolt-check', { x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 }], ['torque-tube-end-weld-check', { t: 60 }], ['arc-segmentation-feed-check', { tol: 60 }], ['involute-spline-design', { Dh: 40 }], ['balance-correction-check', { m1: 0, m2: 0, m3: 0 }], ['bend-feasibility-check', { R: 1300 }], ['whitworth-wire-inspection', { n: 2 }], ['casting-pattern-plan', { cores: 10 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-third handbook pass (handbook59): thirty-fourth round of integrated design checks.
const HB43_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['buttress-thread-inspection', {}, { h: 0.6 * 4.233, Es: 50.8 - 0.6 * 4.233 }],
  ['unified-tapped-hole-check', {}, { p: 1 / 13, drill: 0.5 - 0.01299 * 75 / 13 }],
  ['weldment-cost-estimate', {}, { length: 6.6, fitCost: 142.5 }],
  ['brazed-sleeve-joint-plan', {}, { Lreq: 5.625, joint: Math.PI * 25 * 10 * 70, vol: Math.PI * 25 * 10 * 0.05 }],
  ['gear-train-output-check', {}, { ratio: 9, nout: 1450 / 9, Tout: 20 * 9 * 0.98 * 0.98 }],
  ['linear-move-drive-check', {}, { t: 0.7, peak: 1000, rpm: 2400, cycle: 2.4 }],
  ['plate-lift-plan', {}, { area: 3.6e6, cx: 1200, cy: 760, s: 0.5625, off: 160 }],
  ['tapered-pad-footing-check', {}, { Vb: 0.36, base: 1.44 }],
  ['bolt-circle-pin-check', {}, { mNom: 100 * Math.sin(Math.PI / 3) + 10 }],
];
for (const [id, over, expected, tol] of HB43_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-fourth-round design checks agree with the tools they chain', () => {
  const bi = engine.run('buttress-thread-inspection').values, bt = engine.run('buttress-thread', { D: 50.8, p: 4.233, G: 0 }).values, bw = engine.run('three-wire-taper-buttress', { mode: 'buttress', E: bi.Es, P: 4.233, W: bi.best, ang: 60, tpf: 19.05, A: 52, a: 7, Mm: 52.65 }).values;
  for (const k of ['H', 'h', 'Dn', 'En', 'Kn', 'Ds', 'Es', 'Ks']) near(bi[k], bt[k], 1e-12, `buttress ${k}`);
  near(bi.Mmax, bw.M, 1e-12, 'reading at the largest pitch diameter'); near(bi.best, bw.wire, 1e-12, 'pitch-line wire'); near(bi.E, bw.E2, 1e-12, 'pitch diameter from the reading');
  const ut = engine.run('unified-tapped-hole-check').values, un = engine.run('unified-thread', { D: 0.5, n: 13 }).values, td = engine.run('tap-drill', { system: 'unified', D: 0.5, pitch: 1.5, tpi: 13, pct: 75, tap: 'cut' }).values, te = engine.run('thread-engagement', { d: 12.7, P: 25.4 / 13, Knmax: 0, Esmin: 0, Dsmin: 0, Enmax: 0, Sub: 830, Sun: 310 }).values;
  for (const k of ['p', 'E', 'minor', 'At']) near(ut[k], un[k], 1e-12, `unified ${k}`);
  near(ut.drill, td.drill, 1e-12, 'tap drill');
  near(ut.Atm, te.At, 1e-9, 'stress area for engagement'); near(ut.Le, te.Le, 1e-9, 'engagement for the screw'); near(ut.J, te.J, 1e-9, 'strength ratio'); near(ut.Lreq, te.Lreq, 1e-9, 'engagement needed');
  near(engine.run('unified-tapped-hole-check', { tap: 'form' }).values.drill, engine.run('tap-drill', { system: 'unified', D: 0.5, pitch: 1.5, tpi: 13, pct: 75, tap: 'form' }).values.drill, 1e-12, 'forming tap drill');
  const wc = engine.run('weldment-cost-estimate').values, wr = [[6, 2.4], [8, 1.2], [5, 3]].map(([leg, len]) => [engine.run('weld-cost', { leg }).values, len] as const);
  near(wc.mass, wr.reduce((s, [r, len]) => s + r.mass * len, 0), 1e-12, 'weld metal');
  near(wc.paidWeld, wr.reduce((s, [r, len]) => s + r.paid * len, 0), 1e-12, 'paid welding time');
  near(wc.total, wr.reduce((s, [r, len]) => s + r.total * len, 0) + 1.5 * 95, 1e-9, 'total cost');
  const bs = engine.run('brazed-sleeve-joint-plan').values, lj = engine.run('lap-joint-length', { t: 1.5, w: Math.PI * 25, sm: 210, tau: 70, factor: 1.25, L: 10, load: 8000 }).values;
  near(bs.Lreq, lj.Lreq, 1e-12, 'overlap needed'); near(bs.joint, lj.joint, 1e-9, 'joint capacity');
  near(bs.tube, Math.PI * 23.5 * 1.5 * 210, 1e-9, 'tube capacity');
  const gt = engine.run('gear-train-output-check').values, gr = engine.run('gear-train').values;
  for (const k of ['ratio', 'nout', 'Tout', 'effAll']) near(gt[k], gr[k], 1e-12, `train ${k}`);
  near(engine.run('gear-train-output-check', { d: gt.dReq }).values.tau, 40, 1e-9, 'shaft diameter for the allowable stress');
  const lm = engine.run('linear-move-drive-check').values, mp = engine.run('move-profile').values;
  for (const k of ['t', 'peak', 'ta', 'F']) near(lm[k], mp[k], 1e-12, `move ${k}`);
  const kt = 0.025 / (2 * Math.PI * 0.9), Ff = 0.1 * 20 * 9.80665;
  near(lm.Tacc, (100 + Ff) * kt, 1e-12, 'accelerating torque');
  near(lm.Trms, Math.sqrt(2 * (((100 + Ff) * kt) ** 2 * 0.2 + (Ff * kt) ** 2 * 0.3 + ((100 - Ff) * kt) ** 2 * 0.2) / 2.4), 1e-12, 'RMS torque');
  const tri = engine.run('linear-move-drive-check', { distance: 100 }).values, mpt = engine.run('move-profile', { distance: 100 }).values;
  near(tri.t, mpt.t, 1e-12, 'triangular move time'); near(tri.peak, mpt.peak, 1e-12, 'triangular peak speed');
  const corners = { n: 5, x1: 0, y1: 0, x2: 2400, y2: 0, x3: 2400, y3: 1200, x4: 1200, y4: 1800, x5: 0, y5: 1200 };
  const pl = engine.run('plate-lift-plan').values, pa = engine.run('polygon-area', corners).values;
  for (const k2 of ['area', 'per', 'cx', 'cy']) near(pl[k2], pa[k2], 1e-9, `plate ${k2}`);
  near(pl.RA + pl.RB, pl.W, 1e-12, 'lift loads add to the weight'); near(pl.mass, 3.6 * 0.02 * 7850, 1e-9, 'plate mass');
  const pf = engine.run('tapered-pad-footing-check').values, pv = engine.run('prismoidal-volume', { mode: 'rect', h: 400, a1: 1200, b1: 1200, a2: 400, b2: 400 }).values;
  near(pf.Vt, pv.V / 1e9, 1e-12, 'taper volume');
  assert.equal(engine.run('tapered-pad-footing-check', { qa: pf.qb }).text, 'BEARING ADEQUATE');
  const bp = engine.run('bolt-circle-pin-check').values, bc = engine.run('bolt-circle-pins', { n: 6, d: 10, mode: 'alt', m: 96.62 }).values;
  near(bp.pcdM, bc.pcd, 1e-12, 'pitch circle'); near(bp.x, bc.x, 1e-12, 'across opposite plugs');
  near(engine.run('bolt-circle-pin-check', { m: bp.mNom }).values.pcdM, 100, 1e-9, 'nominal reading gives nominal PCD');
  const ba = engine.run('bolt-circle-pin-check', { n: 5, mode: 'adj', m: 70 }).values, bca = engine.run('bolt-circle-pins', { n: 5, d: 10, mode: 'adj', m: 70 }).values;
  near(ba.pcdM, bca.pcd, 1e-12, 'adjacent plug pitch circle'); near(ba.x, bca.x, 1e-12, 'odd-number size across');
});

test('thirty-fourth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('buttress-thread-inspection').text, 'ACCEPT');
  assert.equal(engine.run('buttress-thread-inspection', { Mmeas: 52.72 }).text, 'REJECT');
  assert.equal(engine.run('buttress-thread-inspection', { Mmeas: 52.55 }).text, 'REJECT');
  assert.equal(engine.run('unified-tapped-hole-check').text, 'ENGAGEMENT ADEQUATE');
  assert.equal(engine.run('unified-tapped-hole-check', { L: 0.5 }).text, 'ENGAGEMENT TOO SHORT');
  assert.equal(engine.run('weldment-cost-estimate').text, 'WITHIN QUOTE');
  assert.equal(engine.run('weldment-cost-estimate', { quote: 200 }).text, 'OVER QUOTE');
  assert.equal(engine.run('brazed-sleeve-joint-plan').text, 'JOINT ADEQUATE');
  assert.equal(engine.run('brazed-sleeve-joint-plan', { L: 5 }).text, 'JOINT NOT ADEQUATE');
  assert.equal(engine.run('brazed-sleeve-joint-plan', { gap: 0.3 }).text, 'JOINT NOT ADEQUATE');
  assert.equal(engine.run('brazed-sleeve-joint-plan', { load: 30000 }).text, 'JOINT NOT ADEQUATE');
  assert.equal(engine.run('gear-train-output-check').text, 'TRAIN MEETS DUTY');
  assert.equal(engine.run('gear-train-output-check', { nreq: 180 }).text, 'TRAIN DOES NOT MEET DUTY');
  assert.equal(engine.run('gear-train-output-check', { Treq: 200 }).text, 'TRAIN DOES NOT MEET DUTY');
  assert.equal(engine.run('gear-train-output-check', { d: 25 }).text, 'TRAIN DOES NOT MEET DUTY');
  assert.equal(engine.run('linear-move-drive-check').text, 'DRIVE ADEQUATE');
  assert.equal(engine.run('linear-move-drive-check', { lead: 10 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('linear-move-drive-check', { accel: 20000 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('linear-move-drive-check', { cycleReq: 2 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('linear-move-drive-check', { Tcont: 0.2 }).text, 'DRIVE NOT ADEQUATE');
  assert.equal(engine.run('plate-lift-plan').text, 'LIFT POINTS ADEQUATE');
  assert.equal(engine.run('plate-lift-plan', { wll: 3 }).text, 'LIFT POINT OVERLOADED');
  assert.equal(engine.run('plate-lift-plan', { xB: 1000 }).text, 'CG OUTSIDE LIFT POINTS');
  assert.equal(engine.run('tapered-pad-footing-check').text, 'BEARING ADEQUATE');
  assert.equal(engine.run('tapered-pad-footing-check', { P: 400 }).text, 'BEARING EXCEEDED');
  assert.equal(engine.run('bolt-circle-pin-check').text, 'ACCEPT');
  assert.equal(engine.run('bolt-circle-pin-check', { m: 96.7 }).text, 'REJECT');
  assert.equal(engine.run('bolt-circle-pin-check', { m: 96.5 }).text, 'REJECT');
  const cases: Array<[string, Inputs]> = [['buttress-thread-inspection', { p: 40 }], ['unified-tapped-hole-check', { n: 2 }], ['weldment-cost-estimate', { len1: 0, len2: 0, len3: 0 }], ['brazed-sleeve-joint-plan', { t: 13 }], ['brazed-sleeve-joint-plan', { gapMin: 0.3 }], ['gear-train-output-check', { a1: 0, a2: 0 }], ['plate-lift-plan', { xB: 300 }], ['plate-lift-plan', { x2: 0, x3: 0, x4: 0 }], ['tapered-pad-footing-check', { a2: 1500 }], ['tapered-pad-footing-check', { hb: 0, h: 0 }], ['bolt-circle-pin-check', { n: 5 }], ['bolt-circle-pin-check', { m: 5 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-fourth handbook pass (handbook60): thirty-fifth round of integrated design checks.
const HB44_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['sprocket-bore-key-plan', {}, { pd: 15.875 / Math.sin(Math.PI / 17), Y: (30 - Math.sqrt(900 - 64)) / 2 }],
  ['pinned-hub-drive-check', {}, { T: 60, sb: 50, ratio: 8 / 30 }],
  ['press-flywheel-check', {}, { E: 1601.4 * 101.6, Pneed: 1601.4 * 101.6 * 20 / 60 / 1000 / 0.9 }],
  ['drop-hammer-forging-plan', {}, { Freq: 450000, blows: 3 }],
  ['v-belt-motor-load-check', {}, { d2: 312.5, n2: 580, err: 0, nb: 3 }],
  ['conveyor-drive-train-check', {}, { va: Math.PI * 0.4 * 1450 / 20 / 60 }],
  ['vessel-shell-plan', {}, { pt: 1.3, vol: (Math.PI * 1e6 * 3000 / 4 + 2 * Math.PI * 1e9 / 24) / 1e9 }],
  ['turning-cut-power-check', {}, { A: 2.4, Fc: 3600, P: 12, Pc: 14.8 }],
  ['pressure-tube-torsion-check', {}, { Dm: 96, sh: 120, sa: 60, tau: 2 * 2e6 / (Math.PI * 96 * 96 * 4) }],
];
for (const [id, over, expected, tol] of HB44_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-fifth-round design checks agree with the tools they chain', () => {
  const sk = engine.run('sprocket-bore-key-plan').values, sd = engine.run('sprocket-diameters', { p: 15.875, N: 17, Dr: 10.16 }).values, ks = engine.run('keyseat-depth', { D: 30, w: 8, t: 4, h: 7 }).values;
  for (const k of ['pd', 'bottom', 'cal', 'od']) near(sk[k], sd[k], 1e-12, `sprocket ${k}`);
  for (const k of ['Y', 'depth', 'S', 'T']) near(sk[k], ks[k], 1e-12, `keyseat ${k}`);
  near(sk.wall, sd.bottom / 2 - (ks.T - 15), 1e-12, 'wall under the teeth');
  const ph = engine.run('pinned-hub-drive-check').values, tp = engine.run('taper-pin-torque', { mode: 'torque', T: 60, P: 3, rpm: 500, D: 30, S: 80, dp: 8 }).values;
  near(ph.dreq, tp.dreq, 1e-12, 'pin needed'); near(ph.tau, tp.tau, 1e-12, 'pin shear');
  const pp = engine.run('pinned-hub-drive-check', { mode: 'power' }).values, tpp = engine.run('taper-pin-torque', { mode: 'power', T: 60, P: 3, rpm: 500, D: 30, S: 80, dp: 8 }).values;
  near(pp.T, tpp.T, 1e-12, 'torque from power'); near(pp.tau, tpp.tau, 1e-12, 'pin shear from power');
  near(ph.tauS, 2 * 16 * 60000 / (Math.PI * 27000), 1e-12, 'shaft stress at the hole');
  const pf = engine.run('press-flywheel-check').values, ps = engine.run('press-flywheel-sizing').values;
  for (const k of ['E', 'P', 'E1', 'mass', 'v1', 'sigma', 'a', 'b']) near(pf[k], ps[k], 1e-12, `flywheel ${k}`);
  const dh = engine.run('drop-hammer-forging-plan').values, db = engine.run('drop-hammer-blow', { m: 500, h: 1.5, d: dh.d, eff: 80 }).values;
  near(db.F, dh.Freq, 1e-6, 'blow force at the set equals the force needed'); near(db.E, dh.E, 1e-9, 'energy per blow'); near(db.vImp, dh.vImp, 1e-12, 'impact speed');
  const vb = engine.run('v-belt-motor-load-check').values, vd = engine.run('v-belt-drive-design').values;
  for (const k of ['d2', 'n2', 'vel', 'Lb', 'wrap', 'Fe', 'Tc', 'nb', 'T1', 'T2', 'Fs']) near(vb[k], vd[k], 1e-12, `belt ${k}`);
  const cd = engine.run('conveyor-drive-train-check').values, cs = engine.run('conveyor-drive-sizing').values;
  for (const k of ['qL', 'Te', 'Pp', 'Pmotor', 'T1', 'T2', 'Tq', 'np']) near(cd[k], cs[k], 1e-12, `conveyor ${k}`);
  near(cd.iNeed * cd.np, 1450, 1e-9, 'ratio needed'); near(engine.run('conveyor-drive-train-check', { iR: cd.iNeed }).values.va, 1.5, 1e-12, 'exact ratio gives the design speed');
  const vs = engine.run('vessel-shell-plan').values, pv = engine.run('pressure-vessel-thickness', { p: 1, D: 1000, S: 138, E: 0.85, CA: 1.5, tf: 1.3 }).values;
  near(vs.tShell, pv.tShell, 1e-12, 'shell thickness'); near(vs.tEll, pv.tEll, 1e-12, 'head thickness'); near(vs.pt, pv.pt, 1e-12, 'test pressure');
  near(engine.run('vessel-shell-plan', { tUse: pv.tShell }).values.mawpS, 1, 1e-9, 'MAWP at the required shell thickness');
  near(engine.run('vessel-shell-plan', { tUse: pv.tEll }).values.mawpH, 1, 1e-9, 'MAWP at the required head thickness');
  const tc = engine.run('turning-cut-power-check').values, ec = engine.run('ect-cutting-forces').values, fp = engine.run('full-power-cutting-speed', { op: 'turn', P: 18.5, eta: 80, kc: 1500, ap: 3, f: 0.8, D: 100, ae: 50 }).values;
  for (const k of ['ECT', 'A', 'MRR', 'Fc', 'FH', 'FA', 'FR', 'P']) near(tc[k], ec[k], 1e-12, `cut ${k}`);
  near(tc.vcMax, fp.vc, 1e-12, 'speed at full power');
  near(engine.run('turning-cut-power-check', { V: tc.vcMax }).values.P, tc.Pc, 1e-9, 'full power at the highest speed');
  const pt = engine.run('pressure-tube-torsion-check').values, pr = engine.run('principal-stress', { sx: pt.sa, sy: pt.sh, txy: pt.tau, Sy: 250, req: 1.5 }).values;
  for (const k of ['s1', 's2', 'theta', 'tmax', 'vm', 'n']) near(pt[k], pr[k], 1e-12, `stress ${k}`);
  near(engine.run('pressure-tube-torsion-check', { N: 50 }).values.sa, 60 + 50000 / (Math.PI * 96 * 4), 1e-9, 'axial load adds to axial stress');
});

test('thirty-fifth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('sprocket-bore-key-plan').text, 'BLANK FEASIBLE');
  assert.equal(engine.run('sprocket-bore-key-plan', { D: 70 }).text, 'WALL TOO THIN');
  assert.equal(engine.run('pinned-hub-drive-check').text, 'PIN DRIVE ADEQUATE');
  for (const over of [{ dp: 4 }, { tauA: 20 }, { sbA: 40 }, { ratioMax: 0.25 }] as Inputs[]) assert.equal(engine.run('pinned-hub-drive-check', over).text, 'PIN DRIVE NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('press-flywheel-check').text, 'FLYWHEEL AND MOTOR ADEQUATE');
  for (const over of [{ mFit: 2500 }, { Pmot: 55 }, { sA: 3 }] as Inputs[]) assert.equal(engine.run('press-flywheel-check', over).text, 'FLYWHEEL OR MOTOR SHORT', JSON.stringify(over));
  assert.equal(engine.run('drop-hammer-forging-plan').text, 'PLAN FEASIBLE');
  assert.equal(engine.run('drop-hammer-forging-plan', { maxBlows: 2 }).text, 'TOO MANY BLOWS');
  assert.equal(engine.run('v-belt-motor-load-check').text, 'DRIVE SUITS MOTOR');
  for (const over of [{ nG: 2 }, { Fr: 1000 }, { n2req: 620 }] as Inputs[]) assert.equal(engine.run('v-belt-motor-load-check', over).text, 'DRIVE DOES NOT SUIT MOTOR', JSON.stringify(over));
  assert.equal(engine.run('conveyor-drive-train-check').text, 'DRIVE TRAIN ADEQUATE');
  for (const over of [{ iR: 25 }, { Pinst: 2.5 }, { TgR: 400 }] as Inputs[]) assert.equal(engine.run('conveyor-drive-train-check', over).text, 'DRIVE TRAIN NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('vessel-shell-plan').text, 'PLATE ADEQUATE');
  assert.equal(engine.run('vessel-shell-plan', { tUse: 5.7 }).text, 'PLATE TOO THIN');
  assert.equal(engine.run('vessel-shell-plan', { tUse: 5.775 }).text, 'PLATE TOO THIN');
  assert.equal(engine.run('turning-cut-power-check').text, 'CUT WITHIN LATHE');
  assert.equal(engine.run('turning-cut-power-check', { Pavail: 11 }).text, 'CUT EXCEEDS LATHE');
  assert.equal(engine.run('turning-cut-power-check', { nMax: 500 }).text, 'CUT EXCEEDS LATHE');
  assert.equal(engine.run('pressure-tube-torsion-check').text, 'TUBE ADEQUATE');
  assert.equal(engine.run('pressure-tube-torsion-check', { T: 8000 }).text, 'TUBE OVERSTRESSED');
  const cases: Array<[string, Inputs]> = [['sprocket-bore-key-plan', { D: 80 }], ['sprocket-bore-key-plan', { w: 40 }], ['pinned-hub-drive-check', { dp: 30 }], ['press-flywheel-check', { tcut: 3 }], ['press-flywheel-check', { emode: 'energy', E: 0 }], ['drop-hammer-forging-plan', { sf: 1 }], ['v-belt-motor-load-check', { C: 50 }], ['conveyor-drive-train-check', { Hl: -50 }], ['vessel-shell-plan', { tUse: 1 }], ['vessel-shell-plan', { p: 80, S: 50 }], ['pressure-tube-torsion-check', { t: 50 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-fifth handbook pass (handbook61): thirty-sixth round of integrated design checks.
const HB45_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['inch-milling-setup-check', {}, { rpm: 9600 / Math.PI, sfmUse: 400 }],
  ['index-table-drive-check', {}, { J: 7.35, hold: 1000, holdBrake: 1250 }],
  ['hand-lever-design-check', {}, { F: 80000 / 600, R: 80000 / 600 + 800, Mmax: 80000, sb: 6 * 80000 / 9000 }],
  ['plate-shear-capacity-check', {}, { use: 0.8 * 0.8 * 450 * 0.4 * 36 / Math.tan(2 * Math.PI / 180) / 500000 }],
  ['vee-groove-pin-inspection', {}, { depth: 5, centre: 3 * Math.SQRT2 }],
  ['special-section-beam-check', {}, { c: 30, M: 2.4e6, dAllow: 8 }],
  ['force-group-support-check', {}, { RAy: 1900, RBy: 1100, RAx: 0 }],
  ['grain-size-acceptance', {}, { avg: 63.6, G: 1 + Math.log2(63.6) }],
  ['polar-hole-position-check', {}, { worst: 2 * Math.hypot(0.01, 0.03) / 0.07 }],
];
for (const [id, over, expected, tol] of HB45_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-sixth-round design checks agree with the tools they chain', () => {
  const im = engine.run('inch-milling-setup-check').values, sf = engine.run('inch-speeds-feeds', { sfm: 400, D: 0.5, teeth: 4, ipt: 0.002 }).values;
  near(im.rpm, sf.rpm, 1e-12, 'spindle speed'); near(im.ipm, sf.ipm, 1e-12, 'table feed');
  near(im.hpNeed, 0.25 * 0.5 * sf.ipm * 1 / 0.8, 1e-12, 'spindle power');
  const ic = engine.run('inch-milling-setup-check', { nMax: 2000 }).values;
  near(ic.ipm, 2000 * 4 * 0.002, 1e-12, 'feed at the capped speed'); near(ic.sfmUse, 2000 * Math.PI * 0.5 / 12, 1e-9, 'surface speed at the capped speed');
  const it = engine.run('index-table-drive-check').values, ri = engine.run('rotary-index-table-sizing').values;
  for (const k of ['J', 'th', 'wmax', 'al', 'Ttab', 'Tmot', 'nmot', 'dwell', 'hold', 'ratio']) near(it[k], ri[k], 1e-12, `index ${k}`);
  const itt = engine.run('index-table-drive-check', { law: 'trap' }).values, rit = engine.run('rotary-index-table-sizing', { law: 'trap' }).values;
  near(itt.Tmot, rit.Tmot, 1e-12, 'trapezoidal motor torque'); near(itt.nmot, rit.nmot, 1e-12, 'trapezoidal motor speed');
  const lv = engine.run('hand-lever-design-check').values, lf = engine.run('lever-force').values;
  for (const k of ['F', 'x', 'MA', 'R']) near(lv[k], lf[k], 1e-12, `lever ${k}`);
  const l2 = engine.run('hand-lever-design-check', { type: 'second' }).values, lf2 = engine.run('lever-force', { type: 'second' }).values;
  near(l2.R, lf2.R, 1e-12, 'second-class reaction'); near(l2.Mmax, lf2.R * 100, 1e-9, 'second-class moment under the load');
  const la = engine.run('hand-lever-design-check', { mode: 'arm', F: 160 }).values, lfa = engine.run('lever-force', { mode: 'arm', F: 160 }).values;
  near(la.x, lfa.x, 1e-12, 'arm for a given effort'); near(la.Mmax, 80000, 1e-9, 'moment at the fulcrum in arm mode');
  near(lv.tau, 2 * lv.R / (Math.PI * 100), 1e-12, 'pin double shear');
  const ps = engine.run('plate-shear-capacity-check').values, sh = engine.run('shear-force', { blades: 'inclined', t: 6, b: 1200, uts: 450, ratio: 0.8, rake: 2, pen: 0.4, n: 0.8, cap: 500 }).values;
  for (const k of ['F', 'Fm', 'use']) near(ps[k], sh[k], 1e-12, `shear ${k}`);
  near(engine.run('plate-shear-capacity-check', { t: ps.tMax }).values.use, 1, 1e-9, 'largest thickness uses the full capacity');
  const pp = engine.run('plate-shear-capacity-check', { blades: 'parallel', b: 100 }).values;
  near(engine.run('plate-shear-capacity-check', { blades: 'parallel', b: 100, t: pp.tMax }).values.use, 1, 1e-9, 'parallel blade largest thickness');
  const vg = engine.run('vee-groove-pin-inspection').values, vp = engine.run('v-groove-pin', { angle: 90, width: 10, pin: 6 }).values;
  for (const k of ['above', 'centre', 'depth', 'contact']) near(vg[k], vp[k], 1e-12, `groove ${k}`);
  near(engine.run('v-groove-pin', { angle: 90, width: vg.wMeas, pin: 6 }).values.above, 2.25, 1e-9, 'width from the reading gives the reading');
  near(vg.hLow, engine.run('v-groove-pin', { angle: 90, width: 10.05, pin: 6 }).values.above, 1e-12, 'height at the widest limit');
  for (const [shape, c] of [['hex', 30], ['tri', 80 / 3], ['half', 30 - 40 / Math.PI], ['ellipse', 20], ['cirhex', 30], ['cirsq', 30], ['hellipse', 20]] as Array<[string, number]>) {
    const sb = engine.run('special-section-beam-check', { shape }).values, ss = engine.run('section-shapes-more', { shape, A: 60, B: 40, C: 20, D: 10 }).values;
    near(sb.area, ss.area, 1e-9, `${shape} area`); near(sb.Ix, ss.Ix, 1e-6, `${shape} Ix`); near(sb.c, c, 1e-9, `${shape} extreme fibre`);
    const bc = engine.run('beam-cases-more', { case: 'ss-two', load: 4000, L: 2000, a: 600, cl: 800, E: 200, I: ss.Ix, c, allow: 150 }).values;
    for (const k of ['R1', 'R2', 'M', 'd', 'stress']) near(sb[k], bc[k], 1e-9, `${shape} beam ${k}`);
  }
  for (const kase of ['ff-offset', 'guided-point', 'guided-udl', 'prop-point']) {
    const sb = engine.run('special-section-beam-check', { case: kase }).values, bc = engine.run('beam-cases-more', { case: kase, load: 4000, L: 2000, a: 600, cl: 800, E: 200, I: sb.Ix, c: 30, allow: 150 }).values;
    for (const k of ['R1', 'R2', 'M', 'd', 'stress']) near(sb[k], bc[k], 1e-9, `${kase} ${k}`);
  }
  const fg = engine.run('force-group-support-check').values, fs = engine.run('force-system').values;
  for (const k of ['Rx', 'Ry', 'R', 'M', 'x0']) near(fg[k], fs[k], 1e-12, `forces ${k}`);
  near(fg.RAy + fg.RBy, -fg.Ry, 1e-9, 'vertical equilibrium'); near(fg.RBy * 1000, fs.R * fs.x0, 1e-6, 'moment equilibrium about A');
  const gs = engine.run('grain-size-acceptance').values, gz = engine.run('grain-size', { mode: 'n100', value: 63.6 }).values;
  for (const k of ['G', 'NA', 'n100', 'lbar']) near(gs[k], gz[k], 1e-12, `grain ${k}`);
  near(gs.Gfine, engine.run('grain-size', { mode: 'n100', value: 70 }).values.G, 1e-12, 'finest field'); near(gs.Gcoarse, engine.run('grain-size', { mode: 'n100', value: 58 }).values.G, 1e-12, 'coarsest field');
  const gl = engine.run('grain-size-acceptance', { mode: 'lbar', v1: 30, v2: 40, v3: 0, v4: 0, v5: 0, Gmin: 1, Gmax: 12 }).values;
  near(gl.G, engine.run('grain-size', { mode: 'lbar', value: 35 }).values.G, 1e-12, 'intercept mode average');
  const pc = engine.run('polar-coordinates', { mode: 'toxy', radius: 50, angle: 270, x: 0, y: 0 }).values, td = engine.run('two-point-distance', { x1: pc.x, y1: pc.y, z1: 0, x2: 0.01, y2: -50.03, z2: 0 }).values;
  near(engine.run('polar-hole-position-check').values.worst, 2 * td.dist / (0.05 + 0.02), 1e-9, 'worst hole from the polar and distance tools');
  near(engine.run('polar-hole-position-check', { n: 1 }).values.worst, 2 * Math.hypot(0.02, 0.01) / 0.1, 1e-9, 'single hole with bonus');
});

test('thirty-sixth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('inch-milling-setup-check').text, 'SETUP WITHIN MACHINE');
  assert.equal(engine.run('inch-milling-setup-check', { nMax: 2000 }).text, 'SETUP WITHIN MACHINE');
  assert.equal(engine.run('inch-milling-setup-check', { hp: 3 }).text, 'SETUP EXCEEDS MACHINE POWER');
  assert.equal(engine.run('inch-milling-setup-check', { woc: 0.6 }).text, 'WIDTH EXCEEDS CUTTER');
  assert.equal(engine.run('index-table-drive-check').text, 'DRIVE ADEQUATE');
  for (const over of [{ TmPk: 3 }, { nMaxM: 1500 }, { ratioMax: 5 }, { Tb: 15 }] as Inputs[]) assert.equal(engine.run('index-table-drive-check', over).text, 'DRIVE NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('hand-lever-design-check').text, 'LEVER ADEQUATE');
  for (const over of [{ h: 15 }, { tauA: 5 }, { pA: 5 }] as Inputs[]) assert.equal(engine.run('hand-lever-design-check', over).text, 'LEVER NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('plate-shear-capacity-check').text, 'CUT WITHIN SHEAR');
  for (const over of [{ cap: 100 }, { b: 3000 }, { blades: 'parallel' }] as Inputs[]) assert.equal(engine.run('plate-shear-capacity-check', over).text, 'CUT EXCEEDS SHEAR', JSON.stringify(over));
  assert.equal(engine.run('vee-groove-pin-inspection').text, 'ACCEPT');
  assert.equal(engine.run('vee-groove-pin-inspection', { hm: 2.3 }).text, 'REJECT');
  assert.equal(engine.run('vee-groove-pin-inspection', { hm: 2.2 }).text, 'REJECT');
  assert.equal(engine.run('special-section-beam-check').text, 'BEAM ADEQUATE');
  assert.equal(engine.run('special-section-beam-check', { load: 6000 }).text, 'DEFLECTION EXCEEDED');
  assert.equal(engine.run('special-section-beam-check', { allow: 80 }).text, 'OVERSTRESSED');
  assert.equal(engine.run('force-group-support-check').text, 'SUPPORTS ADEQUATE');
  assert.equal(engine.run('force-group-support-check', { capA: 1500 }).text, 'SUPPORT OVERLOADED');
  assert.equal(engine.run('force-group-support-check', { xB: 300 }).text, 'UPLIFT AT A SUPPORT');
  assert.equal(engine.run('grain-size-acceptance').text, 'ACCEPT');
  assert.equal(engine.run('grain-size-acceptance', { Gmin: 7.5 }).text, 'REJECT');
  assert.equal(engine.run('grain-size-acceptance', { Gmax: 6 }).text, 'REJECT');
  assert.equal(engine.run('polar-hole-position-check').text, 'ACCEPT');
  assert.equal(engine.run('polar-hole-position-check', { md4: 10 }).text, 'REJECT');
  assert.equal(engine.run('polar-hole-position-check', { md1: 9.99 }).text, 'REJECT');
  const cases: Array<[string, Inputs]> = [['index-table-drive-check', { tc: 0.5 }], ['hand-lever-design-check', { W1: 0 }], ['vee-groove-pin-inspection', { pin: 20 }], ['special-section-beam-check', { shape: 'cirsq', C: 50 }], ['special-section-beam-check', { case: 'ff-offset', a: 0 }], ['force-group-support-check', { xB: 0 }], ['force-group-support-check', { F1: 0, F2: 0, F3: 0 }], ['grain-size-acceptance', { Gmin: 9 }], ['grain-size-acceptance', { v1: 0, v2: 0, v3: 0, v4: 0, v5: 0 }], ['polar-hole-position-check', { dLMC: 9 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-sixth handbook pass (handbook62): thirty-seventh round of integrated design checks.
const HB46_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['intermittent-fillet-weld-plan', {}, { nI: 4, LI: 200, pitch: 550 / 3, gap: 550 / 3 - 50 }],
  ['acme-nut-bore-inspection', {}, { min: 0.8, max: 0.81, drill64: 51 / 64 }],
  ['form-tool-profile-plan', {}, { deep: 8 * Math.cos(15 * Math.PI / 180), steps: 3 }],
  ['taper-disc-gauge-check', {}, { Cm: 8.005, Mnom: 0.25 * Math.sqrt(1 + (0.75 / 24) ** 2) / (0.75 / 24) + 1.25 }],
  ['composite-rotor-inertia', {}, { J1: 10 * (0.04 + 0.75 * 0.03 ** 2), J2: 5 * 0.05 ** 2, J3: 0.3 * 2 * 0.075 ** 2, mass: 17 }],
  ['preferred-size-selection', {}, { distinct: 5, worst: (1000 / 900 - 1) * 100 }],
  ['stacked-solid-cg', {}, { height: 1800, zg: 800 + (Math.PI * 0.25 * 0.6 / 3 * 450 + Math.PI * 0.25 * 1.2 * 1200) / (Math.PI * 0.25 * 0.6 / 3 + Math.PI * 0.25 * 1.2) }],
  ['three-point-support-loads', {}, { W: 7000, xg: 3100000 / 7000, yg: 1900000 / 7000 }],
  ['sine-bar-dms-setup', {}, { decv: 12 + 30 / 60 + 15 / 3600 }],
];
for (const [id, over, expected, tol] of HB46_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-seventh-round design checks agree with the tools they chain', () => {
  const fw = { F: 60, tau: 120, amin: 5, t: 10, excess: 10, rho: 7850, dep: 3, of: 40, eff: 90, rate: 80, wire: 4 };
  const iw = engine.run('intermittent-fillet-weld-plan').values, wc = engine.run('fillet-weld-joint-design', { ...fw, L: 600 }).values, wi = engine.run('fillet-weld-joint-design', { ...fw, L: 200 }).values;
  near(iw.throatC, wc.throat, 1e-12, 'continuous throat'); near(iw.legC, wc.leg, 0, 'continuous leg'); near(iw.costC, wc.cost, 1e-12, 'continuous cost');
  near(iw.legI, wi.leg, 0, 'intermittent leg'); near(iw.costI, wi.cost, 1e-12, 'intermittent cost'); near(iw.saving, (1 - wi.cost / wc.cost) * 100, 1e-9, 'saving');
  const ab = engine.run('acme-nut-bore-inspection').values, at = engine.run('acme-tap-drill', { D: 1, tpi: 5, cls: 'G', over: 0.0046 }).values;
  for (const k of ['min', 'max', 'dmin', 'dmax']) near(ab[k], at[k], 1e-12, `acme ${k}`);
  for (const cls of ['C24', 'C56']) { const a2 = engine.run('acme-nut-bore-inspection', { cls }).values, t2 = engine.run('acme-tap-drill', { D: 1, tpi: 5, cls, over: 0.0046 }).values; near(a2.min, t2.min, 1e-12, `${cls} minimum`); near(a2.max, t2.max, 1e-12, `${cls} maximum`); }
  const fd = { R: 16, r: 10, F: 10, E: 15, Rt: 38.1, off: 6.35 };
  near(engine.run('form-tool-profile-plan').values.deep, engine.run('forming-tool-depth', { ...fd, mode: 'flat', D: 8, C: 15, A: 60 }).values.depth, 1e-12, 'flat tool deepest step');
  const fc = engine.run('form-tool-profile-plan', { mode: 'circular' }).values, fcs = engine.run('forming-tool-depth', { ...fd, mode: 'circular', D: 8, C: 15, A: 45 }).values;
  near(fc.rSmall, fcs.rr, 1e-12, 'circular tool radius'); near(fc.k, fcs.k, 1e-12, 'circular k');
  const td = engine.run('taper-disc-gauge-check').values, tc = engine.run('taper-discs', { mode: 'cTaper', D: 1.5, d: 1, C: 5, angle: 20, T: 0.75 }).values, ta = engine.run('taper-discs', { mode: 'angle', D: 1.5, d: 1, C: td.Cm, angle: 20, T: 0.75 }).values;
  near(td.C, tc.C, 1e-12, 'centre distance for the taper'); near(td.angleNom, tc.angleOut, 1e-12, 'nominal angle');
  near(td.Tm, ta.Tc, 1e-12, 'taper from the setting'); near(td.angle, ta.angleOut, 1e-12, 'angle from the setting');
  near(engine.run('taper-disc-gauge-check', { Mm: td.Mnom }).values.Tm, 0.75, 1e-9, 'nominal reading gives the nominal taper');
  near(engine.run('taper-disc-gauge-check', { Mm: td.Mlo }).values.Tm, 0.752, 1e-9, 'reading at the steep limit');
  const cr = engine.run('composite-rotor-inertia').values, mi = (shape: string, mass: number, A: number, B: number, offset = 0) => engine.run('mass-inertia-more', { shape, mass, A, B, C: 0, offset }).values.J;
  near(cr.J1, mi('torus', 10, 400, 60), 1e-12, 'body 1'); near(cr.J2, mi('tube', 5, 100, 0), 1e-12, 'body 2'); near(cr.J3, mi('cone', 2, 150, 0), 1e-12, 'body 3');
  near(engine.run('composite-rotor-inertia', { o2: 120 }).values.J2, mi('tube', 5, 100, 0, 120), 1e-12, 'offset body');
  near(engine.run('composite-rotor-inertia', { Ereq: cr.dE }).values.Jneed, cr.J, 1e-9, 'inertia needed at the released energy');
  for (const [r, over] of [[12, 1], [47, 2], [150, 3], [300, 4], [900, 5]] as Array<[number, number]>) {
    const first = engine.run('preferred-numbers', { series: '10', min: r, max: r * 10 }).values.first, one = engine.run('preferred-size-selection', { r1: r, r2: 0, r3: 0, r4: 0, r5: 0 }).values;
    near(one.worst, (first / r - 1) * 100, 1e-9, `requirement ${over}`);
  }
  near(engine.run('preferred-size-selection').values.ratio, engine.run('preferred-numbers', { series: '10', min: 1, max: 10 }).values.ratio, 1e-12, 'series ratio');
  const cone = engine.run('centroid-shapes', { shape: 'cone', A: 1000, B: 0, C: 600, angle: 90 }).values, fr = engine.run('centroid-shapes', { shape: 'frustum', A: 1000, B: 600, C: 500, angle: 90 }).values;
  const one = (o: Inputs) => engine.run('stacked-solid-cg', { type2: 'none', z0: 0, rho1: 1000, ...o }).values;
  near(one({ type1: 'coneUp' }).zs, cone.cg, 1e-9, 'cone point up'); near(one({ type1: 'coneDown' }).zs, 600 - cone.cg, 1e-9, 'cone point down');
  const fu = one({ type1: 'frustum', Da1: 1000, Db1: 600, h1: 500 }), fdn = one({ type1: 'frustum', Da1: 600, Db1: 1000, h1: 500 });
  near(fu.zs, fr.cg, 1e-9, 'frustum large end down'); near(fdn.zs, 500 - fr.cg, 1e-9, 'frustum large end up'); near(fu.mass, fr.size / 1e9 * 1000, 1e-9, 'frustum volume');
  const hm = engine.run('centroid-shapes', { shape: 'hemisphere', A: 500, B: 0, C: 0, angle: 90 }).values;
  near(one({ type1: 'hemiUp' }).zs, hm.cg, 1e-9, 'hemisphere flat down'); near(one({ type1: 'hemiUp' }).mass, hm.size / 1e9 * 1000, 1e-9, 'hemisphere volume');
  const tp = engine.run('three-point-support-loads').values, mx = engine.run('matrix-3x3', { a11: 1, a12: 1, a13: 1, a21: 0, a22: 1000, a23: 500, a31: 0, a32: 0, a33: 800 }).values;
  const b = [7000, 3100000, 1900000];
  near(tp.R1, mx.i11 * b[0] + mx.i12 * b[1] + mx.i13 * b[2], 1e-6, 'support 1'); near(tp.R2, mx.i21 * b[0] + mx.i22 * b[1] + mx.i23 * b[2], 1e-6, 'support 2'); near(tp.R3, mx.i31 * b[0] + mx.i32 * b[1] + mx.i33 * b[2], 1e-6, 'support 3');
  near(tp.det, mx.det, 1e-9, 'determinant'); near(tp.R1 + tp.R2 + tp.R3, 7000, 1e-9, 'reactions add to the load');
  const sd = engine.run('sine-bar-dms-setup').values, dm = engine.run('dms-converter', { mode: 'dms', d: 12, mi: 30, s: 15, dec: 0, r: 0 }).values, sb = engine.run('sine-bar-setup', { L: 200, angle: dm.decv, res: 0.0005, tolS: 0.25, angTol: 10 }).values;
  near(sd.decv, dm.decv, 1e-12, 'decimal degrees'); near(sd.radv, dm.radv, 1e-12, 'radians');
  for (const k of ['height', 'stack', 'angSet', 'errR', 'perUm', 'errTot']) near(sd[k], sb[k], 1e-12, `sine bar ${k}`);
  near(engine.run('sine-bar-dms-setup', { Hm: sd.stack }).values.angM, sd.angSet, 1e-12, 'angle from the measured stack');
});

test('thirty-seventh-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('intermittent-fillet-weld-plan').text, 'INTERMITTENT WELD FEASIBLE');
  assert.equal(engine.run('intermittent-fillet-weld-plan', { F: 300 }).text, 'CONTINUOUS WELD NEEDED');
  assert.equal(engine.run('intermittent-fillet-weld-plan', { t: 4 }).text, 'JOINT TOO SHORT');
  assert.equal(engine.run('acme-nut-bore-inspection').text, 'ACCEPT');
  assert.equal(engine.run('acme-nut-bore-inspection', { Bm: 0.815 }).text, 'REJECT');
  assert.equal(engine.run('acme-nut-bore-inspection', { Bm: 0.79 }).text, 'REJECT');
  assert.equal(engine.run('form-tool-profile-plan').text, 'PROFILE FEASIBLE');
  assert.equal(engine.run('form-tool-profile-plan', { hMax: 7 }).text, 'PROFILE TOO DEEP');
  assert.equal(engine.run('form-tool-profile-plan', { mode: 'circular', rMin: 31 }).text, 'PROFILE TOO DEEP');
  assert.equal(engine.run('taper-disc-gauge-check').text, 'ACCEPT');
  assert.equal(engine.run('taper-disc-gauge-check', { Mm: 9.3 }).text, 'REJECT');
  assert.equal(engine.run('composite-rotor-inertia').text, 'ENERGY ADEQUATE');
  assert.equal(engine.run('composite-rotor-inertia', { Ereq: 1200 }).text, 'ENERGY SHORT');
  assert.equal(engine.run('preferred-size-selection').text, 'SIZES SELECTED');
  assert.equal(engine.run('preferred-size-selection', { r4: 330 }).text, 'OVERSIZE TOO LARGE');
  assert.equal(engine.run('stacked-solid-cg').text, 'STABLE');
  assert.equal(engine.run('stacked-solid-cg', { thMin: 20 }).text, 'TIPS TOO EASILY');
  assert.equal(engine.run('three-point-support-loads').text, 'SUPPORTS ADEQUATE');
  assert.equal(engine.run('three-point-support-loads', { wx1: 2000 }).text, 'SUPPORT LIFTS OFF');
  assert.equal(engine.run('three-point-support-loads', { cap: 2500 }).text, 'SUPPORT OVERLOADED');
  assert.equal(engine.run('sine-bar-dms-setup').text, 'SET-UP ADEQUATE');
  assert.equal(engine.run('sine-bar-dms-setup', { angTol: 0.2 }).text, 'SET-UP TOO COARSE');
  const cases: Array<[string, Inputs]> = [['intermittent-fillet-weld-plan', { ls: 700 }], ['acme-nut-bore-inspection', { D: 0.1 }], ['form-tool-profile-plan', { D1: 0, D2: 0, D3: 0 }], ['form-tool-profile-plan', { mode: 'circular', off: 40 }], ['form-tool-profile-plan', { mode: 'circular', D3: 40 }], ['taper-disc-gauge-check', { D: 1 }], ['taper-disc-gauge-check', { Mm: 1 }], ['composite-rotor-inertia', { m1: 0, m2: 0, m3: 0 }], ['composite-rotor-inertia', { shape1: 'hsphere', B1: 400 }], ['preferred-size-selection', { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 }], ['stacked-solid-cg', { type1: 'none', type2: 'none' }], ['stacked-solid-cg', { h2: 0 }], ['three-point-support-loads', { sy3: 0 }], ['three-point-support-loads', { W1: 0, W2: 0 }], ['sine-bar-dms-setup', { d: 0, mi: 0, s: 0 }], ['sine-bar-dms-setup', { Hm: 300 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-seventh handbook pass (handbook63): thirty-eighth round of integrated design checks.
const HB47_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['gear-tooth-top-land-check', {}, { r: 12, ra: 14.6, xMin: 1 - 12 * Math.sin(Math.PI / 9) ** 2 / 2 }],
  ['relief-valve-spring-check', {}, { A: 25 * Math.PI, over: 1.5 / 15 * 100 }],
  ['pipe-support-span-check', {}, { A: Math.PI * (60.3 ** 2 - 52.48 ** 2) / 4, I: Math.PI * (60.3 ** 4 - 52.48 ** 4) / 64 }],
  ['cart-push-force-check', {}, { Fa: 90, Fw: 300 * 9.80665 / 3 }],
  ['taper-turning-setup', {}, { tpu: 5 / 60, tpf: 1, offset: 6.25 }],
  ['wall-jib-crane-check', {}, { Tmax: 20000, M: 7.5e6, Fbolt: 20000 * Math.cos(Math.PI / 6) / 4 }],
  ['step-cone-pulley-design', {}, { r: 2, dSmall: 80 }],
  ['hydraulic-hand-jack-check', {}, { Fp: 3750, Flift: 37500, strokes: 84 }],
  ['capstan-rope-turns-check', {}, { ratio: Math.exp(0.25 * 6 * Math.PI), WLL: 24000 }],
];
for (const [id, over, expected, tol] of HB47_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-eighth-round design checks agree with the tools they chain', () => {
  const gt = engine.run('gear-tooth-top-land-check').values, tf = (angle: number) => engine.run('trig-functions', { mode: 'angle', angle, invValue: 0 }).values.inv;
  near(gt.invP, tf(20), 1e-12, 'involute of the pressure angle'); near(gt.invA, tf(gt.phiA), 1e-12, 'involute at the tip');
  near(gt.phiP, engine.run('trig-functions', { mode: 'inv', angle: 20, invValue: gt.s / 24 + gt.invP }).values.deg, 1e-9, 'pointed angle from the involute value');
  near(engine.run('gear-tooth-top-land-check', { x: 0.3, ha: 1 + (gt.rp - gt.ra) / 2 }).values.sa, 0, 1e-9, 'top land vanishes at the pointed radius');
  const sp = { d: 2, D: 16, Na: 8, ends: 'cg', G: 79.3, L0: 50, allow: 700, rho: 7850 }, rv = engine.run('relief-valve-spring-check').values, cs = engine.run('compression-spring', { ...sp, Lw: 35 }).values, cf = engine.run('compression-spring', { ...sp, Lw: 33.5 }).values;
  for (const k of ['k', 'K', 'Ls']) near(rv[k], cs[k], 1e-12, `spring ${k}`);
  near(rv.F, cs.F, 1e-12, 'installed load'); near(rv.tau, cs.tau, 1e-12, 'installed stress'); near(rv.Ff, cf.F, 1e-12, 'full-lift load'); near(rv.tauFull, cf.tau, 1e-12, 'full-lift stress');
  near(engine.run('relief-valve-spring-check', { Lw: rv.LwNeed }).values.pCrack, 0.9, 1e-9, 'installed length for the wanted pressure');
  const ps = engine.run('pipe-support-span-check').values;
  near(ps.stress, ps.w * 9e6 / 8 / ps.Z, 1e-12, 'simply supported stress'); near(ps.defl, 5 * ps.w * 8.1e13 / (384 * 200000 * ps.I), 1e-12, 'simply supported sag');
  for (const [ends, kase] of [['ff', 'ff-udl'], ['prop', 'prop-udl']]) {
    const pe = engine.run('pipe-support-span-check', { ends }).values, bc = engine.run('beam-cases', { case: kase, load: pe.P, L: 3000, a: 600, E: 200, I: pe.I, c: 30.15, allow: 60 }).values;
    near(pe.M, bc.M, 1e-9, `${ends} moment`); near(pe.defl, bc.defl, 1e-9, `${ends} sag`); near(pe.stress, bc.stress, 1e-9, `${ends} stress`);
  }
  near(engine.run('pipe-support-span-check', { L: ps.Ls }).values.stress, 60, 1e-9, 'span at the stress limit'); near(engine.run('pipe-support-span-check', { L: ps.Ld }).values.defl, 2.5, 1e-9, 'span at the sag limit');
  const cp = engine.run('cart-push-force-check').values, th = 2 * Math.PI / 180;
  near(cp.Fr, engine.run('rolling-resistance', { W: cp.W * Math.cos(th), r: 75, f: 0.5, v: 1, mu: 0.15 }).values.F, 1e-12, 'rolling resistance');
  near(cp.Fg, engine.run('inclined-plane', { mass: 300, angle: 2, mu: 0 }).values.up, 1e-9, 'slope force');
  const tt = engine.run('taper-turning-setup').values, ti = engine.run('trig-functions', { mode: 'angle', angle: tt.alpha, invValue: 0 }).values.inv;
  near(tt.tanA, ti + tt.alpha * Math.PI / 180, 1e-12, 'tangent of the half angle');
  const jb = engine.run('wall-jib-crane-check').values, ss = engine.run('section-shapes', { shape: 'I', H: 200, B: 100, tf: 8.5, tw: 5.6, rho: 7850 }).values, bm = engine.run('beam-cases', { case: 'ss-offset', load: 10000, L: 3000, a: 1500, E: 200, I: ss.Ix, c: 100, allow: 160 }).values;
  near(jb.A, ss.A, 1e-9, 'jib area'); near(jb.Ix, ss.Ix, 1e-6, 'jib I'); near(jb.Zx, ss.Zx, 1e-6, 'jib Z');
  near(jb.M, bm.M, 1e-9, 'mid-reach moment'); near(jb.defl, bm.defl, 1e-9, 'mid-reach deflection'); near(jb.sb, bm.stress, 1e-9, 'bending stress');
  const sc = engine.run('step-cone-pulley-design').values, pr = engine.run('progression', { type: 'geom', a: 100, d: 0, r: 2, n: 4, l: 800 }).values;
  near(sc.r, pr.fit, 1e-12, 'step ratio'); near(sc.last, pr.last, 1e-9, 'top speed');
  const bl = (D1: number, D2: number) => engine.run('belt-length-crossed-three', { mode: 'crossed', D1, D2, D3: 80, C: 600, x2: 600, y2: 0, x3: 300, y3: 250 }).values;
  near(sc.L, bl(80, 320).L, 1e-9, 'belt length on the first step'); near(sc.L, bl(800 / 3, 400 / 3).L, 1e-9, 'same belt on the last step'); near(sc.wrap, bl(80, 320).wrap, 1e-9, 'wrap');
  const hj = engine.run('hydraulic-hand-jack-check').values, lf = engine.run('lever-force', { mode: 'force', type: 'second', x: 500, F: 100, W1: hj.Fp, a1: 40, W2: 0, a2: 0, W3: 0, a3: 0 }).values;
  near(lf.F, 300, 1e-9, 'handle effort from the lever force tool'); near(hj.Freq, engine.run('lever-force', { mode: 'force', type: 'second', x: 500, F: 100, W1: hj.pReq * 36 * Math.PI, a1: 40, W2: 0, a2: 0, W3: 0, a3: 0 }).values.F, 1e-9, 'effort for the load');
  near(engine.run('hydraulic-hand-jack-check', { F: hj.Freq }).values.Flift, 30000, 1e-6, 'effort for the load lifts the load');
  const cr = engine.run('capstan-rope-turns-check').values, bf = engine.run('belt-friction', { slack: cr.T2, mu: 0.25, wrap: 1080, groove: 0 }).values;
  near(bf.T1, 20000, 1e-9, 'capstan equation'); near(cr.ratio, bf.ratio, 1e-12, 'tension ratio');
  near(engine.run('capstan-rope-turns-check', { turns: cr.turnsNeed }).values.T2, 300, 1e-9, 'turns needed hold with the person’s force');
});

test('thirty-eighth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('gear-tooth-top-land-check').text, 'TOOTH FORM ADEQUATE');
  assert.equal(engine.run('gear-tooth-top-land-check', { x: 0 }).text, 'TEETH UNDERCUT');
  assert.equal(engine.run('gear-tooth-top-land-check', { x: 0.9 }).text, 'TOP LAND TOO THIN');
  assert.equal(engine.run('relief-valve-spring-check').text, 'VALVE SPRING ADEQUATE');
  for (const over of [{ preq: 1 }, { overMax: 8 }, { allow: 450 }] as Inputs[]) assert.equal(engine.run('relief-valve-spring-check', over).text, 'VALVE SPRING NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('pipe-support-span-check').text, 'SPAN ADEQUATE');
  assert.equal(engine.run('pipe-support-span-check', { L: 4000 }).text, 'SPAN TOO LONG');
  assert.equal(engine.run('cart-push-force-check').text, 'PUSH FORCE ACCEPTABLE');
  assert.equal(engine.run('cart-push-force-check', { slope: 4 }).text, 'TOO HARD TO PUSH');
  assert.equal(engine.run('cart-push-force-check', { wheelRating: 900 }).text, 'WHEEL OVERLOADED');
  assert.equal(engine.run('taper-turning-setup').text, 'OFFSET METHOD SUITABLE');
  assert.equal(engine.run('taper-turning-setup', { Lw: 300 }).text, 'USE COMPOUND OR ATTACHMENT');
  assert.equal(engine.run('wall-jib-crane-check').text, 'JIB ADEQUATE');
  for (const over of [{ dt: 12 }, { Fb: 4000 }, { W: 40000 }, { dlim: 2500 }] as Inputs[]) assert.equal(engine.run('wall-jib-crane-check', over).text, 'JIB NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('step-cone-pulley-design').text, 'STEPS FEASIBLE');
  assert.equal(engine.run('step-cone-pulley-design', { dMin: 90 }).text, 'PULLEY TOO SMALL');
  assert.equal(engine.run('hydraulic-hand-jack-check').text, 'JACK ADEQUATE');
  for (const over of [{ Wreq: 40000 }, { pRated: 25 }, { maxStrokes: 50 }] as Inputs[]) assert.equal(engine.run('hydraulic-hand-jack-check', over).text, 'JACK NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('capstan-rope-turns-check').text, 'HOLD ADEQUATE');
  assert.equal(engine.run('capstan-rope-turns-check', { turns: 2 }).text, 'MORE TURNS NEEDED');
  assert.equal(engine.run('capstan-rope-turns-check', { MBL: 90 }).text, 'ROPE OVERLOADED');
  const cases: Array<[string, Inputs]> = [['gear-tooth-top-land-check', { x: -1, ha: 0.5 }], ['relief-valve-spring-check', { Lw: 55 }], ['relief-valve-spring-check', { lift: 16 }], ['pipe-support-span-check', { t: 31 }], ['cart-push-force-check', { nShare: 5 }], ['taper-turning-setup', { d: 30 }], ['taper-turning-setup', { Lw: 50 }], ['wall-jib-crane-check', { tf: 120 }], ['step-cone-pulley-design', { nMax: 50 }], ['step-cone-pulley-design', { C: 150 }], ['hydraulic-hand-jack-check', { a: 600 }], ['hydraulic-hand-jack-check', { dp: 50 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-eighth handbook pass (handbook64): thirty-ninth round of integrated design checks.
const HB48_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['hinged-flap-cylinder-check', {}, { W: 50 * 9.80665, Lmin: Math.hypot(50, 300), Lmax: Math.hypot(100, 450) }],
  ['tank-stand-leg-check', {}, { litres: Math.PI * 0.36 * 1.5 * 1000 }],
  ['nozzle-manifold-check', {}, { Qt: 6 * 0.8 * Math.PI * 0.0025 ** 2 / 4 * Math.sqrt(600) * 60000 }],
  ['drilling-fixture-clamp-check', {}, { Fcut: 25000 / 60, Fcl: 2 * 25000 / 60 / 0.3 }],
  ['conveyor-takeup-plan', {}, { travel: 1500, Tsag: (100 / 5.4 + 10) * 9.80665 * 1.2 / 0.16 }],
  ['forklift-load-centre-check', {}, { M: 1400, X: 860000 / 1400, cap: 2500 * 950 / (450 + 860000 / 1400) }],
  ['cylinder-air-consumption-check', {}, { swept: (Math.PI * 2500 / 4 + Math.PI * 2100 / 4) * 200 * 1.1 / 1e6 }],
  ['winch-drum-brake-check', {}, { Tdrum: 750, TL: 750 / 40 * 0.85 }],
  ['tank-drain-time-check', {}, { vol: Math.PI * 0.36 * 1.4 * 1000 }],
];
for (const [id, over, expected, tol] of HB48_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thirty-ninth-round design checks agree with the tools they chain', () => {
  const hf = engine.run('hinged-flap-cylinder-check').values, pc = engine.run('pneumatic-cylinder-force', { bore: 63, rod: 20, p: 6, eff: 90, load: hf.Fmax, ratio: 80 }).values;
  near(hf.Fe, pc.Fe, 1e-12, 'extend force'); near(hf.lr, pc.lr, 1e-12, 'load ratio'); near(hf.minBore, pc.minBore, 1e-12, 'smallest bore');
  assert.ok(hf.Fmax >= 50 * 9.80665 * 400 * Math.hypot(50, 300) / (150 * 300) - 1e-9, 'largest force at least the closed-position force');
  const ts = engine.run('tank-stand-leg-check').values, tv = engine.run('tank-volume', { orient: 'v', diameter: 1200, length: 1500, depth: 1500 }).values, cb = engine.run('column-buckling', { E: 200, Sy: 250, A: ts.A, I: ts.I, L: 1500, K: 1.2, P: ts.Pleg, req: 2.5 }).values;
  near(ts.litres, tv.full, 1e-9, 'full volume');
  for (const k of ['r', 'lambda', 'Cc', 'scr', 'Pcr', 'n']) near(ts[k], cb[k], 1e-9, `buckling ${k}`);
  const tl = engine.run('tank-stand-leg-check', { L: 6000 }).values, cbl = engine.run('column-buckling', { E: 200, Sy: 250, A: tl.A, I: tl.I, L: 6000, K: 1.2, P: tl.Pleg, req: 2.5 }).values;
  near(tl.Pcr, cbl.Pcr, 1e-9, 'Euler buckling load');
  const nm = engine.run('nozzle-manifold-check').values, of = engine.run('orifice-flow', { mode: 'flow', d: 2.5, Cd: 0.8, dp: 3, Q: 10, rho: 1000 }).values, pf = engine.run('pipe-friction', { Q: nm.Qt, d: 20, L: 6, nu: 1, rho: 1000, eps: 0.045, K: 4 }).values;
  near(nm.Q1, of.Q, 1e-12, 'nozzle flow'); near(nm.vN, of.vel, 1e-12, 'jet velocity');
  near(nm.vel, pf.vel, 1e-12, 'pipe velocity'); near(nm.Re, pf.Re, 1e-9, 'Reynolds number'); near(nm.f, pf.f, 1e-12, 'friction factor'); near(nm.dpPipe, pf.dp, 1e-12, 'pipe drop');
  const dc = engine.run('drilling-fixture-clamp-check').values, dpw = engine.run('drilling-power', { D: 20, vc: 80, f: 0.25, kc: 2000, point: 118, eta: 80, Pavail: 7.5 }).values, fc = engine.run('fixture-clamp-force', { mode: 'friction', Fcut: dc.Fcut, Flift: 0, n: 2, mu1: 0.15, mu2: 0.15, nc: 2, A: 40, B: 40, d: 12, P: 1.75, K: 0.2, Sp: 600 }).values;
  for (const k of ['n', 'Pc', 'Pm', 'T', 'thrust']) near(dc[k], dpw[k], 1e-12, `drilling ${k}`);
  for (const k of ['Fcl', 'per', 'Fs', 'Tq', 'At', 's']) near(dc[k], fc[k], 1e-9, `clamp ${k}`);
  const ct = engine.run('conveyor-takeup-plan').values, cs = engine.run('conveyor-drive-sizing').values;
  for (const k of ['qL', 'Te', 'Pmotor', 'T1', 'T2']) near(ct[k], cs[k], 1e-12, `conveyor ${k}`);
  near(ct.mCw, 2 * ct.Tsag / 9.80665, 1e-9, 'counterweight from sag tension');
  near(engine.run('conveyor-takeup-plan', { sag: 10, a: 0.5 }).values.Tt, cs.T2, 1e-12, 'slip governs with a loose sag limit');
  const fk = engine.run('forklift-load-centre-check').values, cg = engine.run('combined-cg', { m1: 800, x1: 400, y1: 0, z1: 0, m2: 600, x2: 900, y2: 50, z2: 0, m3: 0, x3: 0, y3: 0, z3: 0, m4: 0, x4: 0, y4: 0, z4: 0, m5: 0, x5: 0, y5: 0, z5: 0 }).values;
  near(fk.M, cg.M, 1e-12, 'load mass'); near(fk.X, cg.X, 1e-12, 'load centre'); near(fk.Y, cg.Y, 1e-12, 'side offset');
  near(engine.run('forklift-load-centre-check', { m1: 1000, x1: 500, m2: 0 }).values.cap, 2500, 1e-9, 'rated capacity at the rated load centre');
  const ca = engine.run('cylinder-air-consumption-check').values, cp = engine.run('compressor-power', { Q: ca.Q, p2: 6, p1: 1.01325, stages: 1, k: 1.4, eff: 75 }).values;
  near(ca.ad, cp.ad, 1e-9, 'adiabatic power'); near(ca.shaft, cp.shaft, 1e-9, 'shaft power');
  near(ca.freeCycle, ca.swept * 7.01325 / 1.01325, 1e-12, 'atmospheric air per cycle');
  const wb = engine.run('winch-drum-brake-check').values, hb = engine.run('holding-brake-sizing', { n: 1450, J: wb.J, TL: wb.TL, dir: 'over', Tb: 40, td: 0.05, treq: 0.5, SFh: 2, Wmax: 5, z: 20, Wh: 100 }).values;
  for (const k of ['w', 'Tnet', 'tb', 'ttot', 'ang', 'W', 'Whr', 'Treq']) near(wb[k], hb[k], 1e-9, `brake ${k}`);
  near(wb.J, 0.02 + 5000 / 9.80665 * (0.15 / 40) ** 2, 1e-12, 'reflected inertia');
  const td = engine.run('tank-drain-time-check').values, tvd = engine.run('tank-volume', { orient: 'v', diameter: 1200, length: 1600, depth: 1400 }).values, od = engine.run('orifice-flow', { mode: 'flow', d: 25, Cd: 0.6, dp: td.dp, Q: 10, rho: 1000 }).values;
  near(td.vol, tvd.litres, 1e-9, 'volume drained'); near(td.Q0, od.Q, 1e-9, 'outflow at the start');
  near(engine.run('tank-drain-time-check', { d: td.dNeed }).values.tMin, 30, 1e-9, 'outlet for the time allowed');
});

test('thirty-ninth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('hinged-flap-cylinder-check').text, 'CYLINDER ADEQUATE');
  assert.equal(engine.run('hinged-flap-cylinder-check', { bore: 50 }).text, 'CYLINDER TOO SMALL');
  assert.equal(engine.run('hinged-flap-cylinder-check', { strokeAv: 150 }).text, 'STROKE TOO SHORT');
  assert.equal(engine.run('tank-stand-leg-check').text, 'LEGS ADEQUATE');
  assert.equal(engine.run('tank-stand-leg-check', { L: 6000 }).text, 'LEGS MAY BUCKLE');
  assert.equal(engine.run('nozzle-manifold-check').text, 'SUPPLY ADEQUATE');
  assert.equal(engine.run('nozzle-manifold-check', { pPump: 3.1 }).text, 'PUMP PRESSURE SHORT');
  assert.equal(engine.run('nozzle-manifold-check', { vMax: 1.5 }).text, 'PIPE VELOCITY TOO HIGH');
  assert.equal(engine.run('drilling-fixture-clamp-check').text, 'CLAMPING ADEQUATE');
  assert.equal(engine.run('drilling-fixture-clamp-check', { Pavail: 3 }).text, 'MACHINE POWER SHORT');
  assert.equal(engine.run('drilling-fixture-clamp-check', { Sp: 40 }).text, 'CLAMP SCREW OVERSTRESSED');
  assert.equal(engine.run('conveyor-takeup-plan').text, 'TAKE-UP ADEQUATE');
  assert.equal(engine.run('conveyor-takeup-plan', { travelAv: 1000 }).text, 'TRAVEL TOO SHORT');
  assert.equal(engine.run('forklift-load-centre-check').text, 'WITHIN CAPACITY');
  assert.equal(engine.run('forklift-load-centre-check', { x2: 2500 }).text, 'OVER CAPACITY');
  assert.equal(engine.run('forklift-load-centre-check', { y2: 300 }).text, 'LOAD OFF CENTRE');
  assert.equal(engine.run('cylinder-air-consumption-check').text, 'SUPPLY ADEQUATE');
  assert.equal(engine.run('cylinder-air-consumption-check', { fad: 0.2 }).text, 'SUPPLY SHORT');
  assert.equal(engine.run('winch-drum-brake-check').text, 'BRAKE ADEQUATE');
  for (const over of [{ Tb: 25 }, { treq: 0.2 }, { Wh: 5 }] as Inputs[]) assert.equal(engine.run('winch-drum-brake-check', over).text, 'BRAKE NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('tank-drain-time-check').text, 'DRAINS IN TIME');
  assert.equal(engine.run('tank-drain-time-check', { tMax: 20 }).text, 'DRAINS TOO SLOWLY');
  const cases: Array<[string, Inputs]> = [['hinged-flap-cylinder-check', { bx: -100, by: 0 }], ['hinged-flap-cylinder-check', { rod: 70 }], ['tank-stand-leg-check', { legT: 40 }], ['drilling-fixture-clamp-check', { rf: 8 }], ['conveyor-takeup-plan', { Hl: -50 }], ['forklift-load-centre-check', { m1: 0, m2: 0 }], ['cylinder-air-consumption-check', { rod: 60 }], ['winch-drum-brake-check', { Tb: 15 }], ['winch-drum-brake-check', { treq: 0.04 }], ['tank-drain-time-check', { H2: 1600 }], ['tank-drain-time-check', { d: 1500 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Forty-ninth handbook pass (handbook65): fortieth round of integrated design checks.
const HB49_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['sluice-gate-lift-check', {}, { F: 1000 * 9.80665 * 1.2 * 4 / 2, y: 2 / 3 }],
  ['ball-detent-check', {}, { k: 79300 / (8 * 216 * 8), P: 79300 / (8 * 216 * 8) * 3 }],
  ['expansion-vessel-sizing', {}, { Ve: 500 * 0.00041 * 70, af: 1.5 / 3.513 }],
  ['torque-arm-reaction-check', {}, { T: 9549.2966 * 4 / 50 * 1.5, Fr: 9549.2966 * 4 / 50 * 1.5 / 300 }],
  ['traction-hoist-check', {}, { mcw: 850, unb: 250 }],
  ['shear-pin-overload-design', {}, { Tbreak: 1000, tau: 400 }],
  ['portable-gantry-check', {}, { M: 2e7, Fc: 10000 }],
  ['press-tie-rod-check', {}, { F: 20 * Math.PI * 1e4, Frod: 5 * Math.PI * 1e4 }],
  ['centrifuge-bowl-check', {}, { sSelf: 7850 * (2000 * Math.PI / 30 * 0.253) ** 2 / 1e6 }],
];
for (const [id, over, expected, tol] of HB49_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thread engagement uses the handbook shear areas for both threads', () => {
  const d = 10, P = 1.5, n = 1 / P, d2 = d - 0.649519 * P, D1 = d - 1.082532 * P, ext = Math.PI * D1 * (0.5 + 0.57735 * n * (d2 - D1)), int = Math.PI * d * (0.5 + 0.57735 * n * (d - d2));
  const te = engine.run('thread-engagement', { d, P, Knmax: 0, Esmin: 0, Dsmin: 0, Enmax: 0, Sub: 800, Sun: 310 }).values;
  near(te.J, ext * 800 / (int * 310), 1e-12, 'strength ratio from the external and internal shear areas');
  near(engine.run('tapped-hole-design').values.Lreq, te.Lreq, 1e-9, 'tapped hole design uses the same engagement');
});

test('fortieth-round design checks agree with the tools they chain', () => {
  const sg = engine.run('sluice-gate-lift-check').values, hf = engine.run('hydrostatic-force', { h: 2, rho: 1000, w: 1.2, floor: 0, ps: 0 }).values, ps = engine.run('power-screw-torque', { F: sg.Flift, dm: 30, lead: 6, flank: '15', mu: 0.12, dc: 45, muc: 0.12 }).values;
  near(sg.F, hf.F, 1e-9, 'water force'); near(sg.y, hf.y, 1e-12, 'centre of pressure'); near(sg.Tr, ps.Tr, 1e-12, 'spindle torque'); near(sg.locks, ps.locks ? 1 : 0, 0, 'self-locking');
  near(sg.effort, sg.Tr * 1000 / 300, 1e-12, 'handwheel effort');
  const sp = { d: 1, D: 6, Na: 8, ends: 'cg', G: 79.3, L0: 15, allow: 700, rho: 7850 }, bd = engine.run('ball-detent-check').values, c1 = engine.run('compression-spring', { ...sp, Lw: 12 }).values, c2 = engine.run('compression-spring', { ...sp, Lw: 11 }).values;
  near(bd.k, c1.k, 1e-12, 'spring rate'); near(bd.P, c1.F, 1e-12, 'preload'); near(bd.tau, c1.tau, 1e-12, 'preload stress'); near(bd.Prise, c2.F, 1e-12, 'load at full rise'); near(bd.tauRise, c2.tau, 1e-12, 'stress at full rise'); near(bd.Ls, c1.Ls, 1e-12, 'solid length');
  near(bd.Frel, engine.run('wedge-force', { W: bd.P, angle: 45, mu: Math.tan(Math.atan(0.15) / 2) }).values.drive, 1e-9, 'release force from the wedge tool');
  const ev = engine.run('expansion-vessel-sizing').values, gl = engine.run('gas-law', { V1: ev.Vneed, p1: 1, T1: 20, p2: 2.5, T2: 20, patm: 1.013 }).values;
  near(ev.Vneed - gl.V2, ev.Ve, 1e-9, 'vessel accepts the expansion between the pressures');
  const ta = engine.run('torque-arm-reaction-check').values, cp = engine.run('clevis-pin-joint', { F: ta.Fr, d: 12, a: 12, bf: 8, g: 1, R: 20, sbA: 250, tpA: 120, bA: 200, stA: 150, tA: 90 }).values;
  for (const k of ['M', 'sb', 'tau', 'be', 'bfk', 'st', 'tt', 'umax']) near(ta[k], cp[k], 1e-9, `pin joint ${k}`);
  const th = engine.run('traction-hoist-check').values, bf = engine.run('belt-friction', { slack: 1, mu: 0.1, wrap: 180, groove: 40 }).values;
  near(th.trac, bf.ratio, 1e-12, 'traction available'); near(th.mue, bf.mue, 1e-12, 'groove friction');
  near(th.rFull, 1100 / 850 * (9.80665 + 0.5) / (9.80665 - 0.5), 1e-12, 'full car ratio');
  const sh = engine.run('shear-pin-overload-design').values, bs = engine.run('bolt-shear-bearing', { F: sh.FbCh, n: 1, planes: '1', d: 7.5, t: 10, tauAllow: 400, bAllow: 300 }).values;
  near(sh.tau, bs.tau, 1e-9, 'pin shear at break'); near(sh.sb, bs.sb, 1e-9, 'bearing at break');
  near(engine.run('bolt-shear-bearing', { F: sh.Fb, n: 1, planes: '1', d: sh.dReq, t: 10, tauAllow: 400, bAllow: 300 }).values.us, 1, 1e-9, 'pin needed shears at the break torque');
  const pg = engine.run('portable-gantry-check').values, ss = engine.run('section-shapes', { shape: 'I', H: 300, B: 150, tf: 10.7, tw: 7.1, rho: 7850 }).values, bm = engine.run('beam-cases', { case: 'ss-offset', load: 20000, L: 4000, a: 2000, E: 200, I: ss.Ix, c: 150, allow: 160 }).values, cb = engine.run('column-buckling', { E: 200, Sy: 250, A: pg.Al, I: pg.Il, L: pg.Lleg, K: 1, P: pg.Pleg, req: 3 }).values;
  near(pg.A, ss.A, 1e-9, 'beam area'); near(pg.Ix, ss.Ix, 1e-6, 'beam I'); near(pg.Zx, ss.Zx, 1e-6, 'beam Z');
  near(pg.M, bm.M, 1e-9, 'beam moment'); near(pg.defl, bm.defl, 1e-9, 'beam deflection'); near(pg.sb, bm.stress, 1e-9, 'beam stress');
  near(pg.lambda, cb.lambda, 1e-9, 'leg slenderness'); near(pg.Pcr, cb.Pcr, 1e-6, 'leg buckling load'); near(pg.nLeg, cb.n, 1e-9, 'leg safety factor');
  const pt = engine.run('press-tie-rod-check').values, mt = engine.run('metric-thread', { d: 42, P: 4.5, starts: 1, Sp: 0 }).values, te = engine.run('thread-engagement', { d: 42, P: 4.5, Knmax: 0, Esmin: 0, Dsmin: 0, Enmax: 0, Sub: 800, Sun: 800 }).values;
  near(pt.As, mt.As, 1e-9, 'tensile stress area'); near(pt.Le, te.Le, 1e-9, 'engagement for the rod'); near(pt.J, te.J, 1e-12, 'strength ratio'); near(pt.Lreq, te.Lreq, 1e-9, 'engagement needed');
  near(engine.run('hydraulic-cylinder-sizing', { Fpush: pt.F / 1000, p: 200, bore: 0 }).values.Dmin, 200, 1e-9, 'bore for the press force');
  const cf = engine.run('centrifuge-bowl-check').values, cfg = engine.run('centrifugal-force', { mass: 1, radius: 250, rpm: 2000 }).values, pc = engine.run('pressure-cylinder', { di: 500, t: 6, p: cf.p, ends: 'open', Sy: 355, req: 2 }).values;
  near(cf.gLevel, cfg.g, 1e-9, 'g at the wall'); near(cf.sLiq, pc.thin, 1e-9, 'liquid hoop stress');
  near(engine.run('centrifuge-bowl-check', { rpm: cf.nMax }).values.sTot, 100, 1e-9, 'speed limit reaches the allowable');
});

test('fortieth-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('sluice-gate-lift-check').text, 'EFFORT ACCEPTABLE');
  assert.equal(engine.run('sluice-gate-lift-check', { h: 3 }).text, 'EFFORT TOO HIGH');
  assert.equal(engine.run('ball-detent-check').text, 'DETENT FORCE IN RANGE');
  assert.equal(engine.run('ball-detent-check', { alpha: 60 }).text, 'DETENT FORCE OUT OF RANGE');
  assert.equal(engine.run('ball-detent-check', { allow: 400 }).text, 'SPRING OVERSTRESSED');
  assert.equal(engine.run('expansion-vessel-sizing').text, 'VESSEL ADEQUATE');
  assert.equal(engine.run('expansion-vessel-sizing', { Vv: 30 }).text, 'VESSEL TOO SMALL');
  assert.equal(engine.run('torque-arm-reaction-check').text, 'TORQUE ARM ADEQUATE');
  assert.equal(engine.run('torque-arm-reaction-check', { L: 100 }).text, 'TORQUE ARM NOT ADEQUATE');
  assert.equal(engine.run('traction-hoist-check').text, 'TRACTION AND POWER ADEQUATE');
  assert.equal(engine.run('traction-hoist-check', { mu: 0.04 }).text, 'ROPES MAY SLIP');
  assert.equal(engine.run('traction-hoist-check', { Pfit: 3 }).text, 'MOTOR TOO SMALL');
  assert.equal(engine.run('shear-pin-overload-design').text, 'SHEAR PIN SUITABLE');
  assert.equal(engine.run('shear-pin-overload-design', { dCh: 6 }).text, 'BREAKS TOO EARLY');
  assert.equal(engine.run('shear-pin-overload-design', { dCh: 9 }).text, 'BREAKS TOO LATE');
  assert.equal(engine.run('shear-pin-overload-design', { bA: 200 }).text, 'HUB BEARING TOO HIGH');
  assert.equal(engine.run('portable-gantry-check').text, 'GANTRY ADEQUATE');
  for (const over of [{ W: 50000 }, { legOD: 42.4, legT: 2.6 }, { castor: 8000 }, { dlim: 2500 }] as Inputs[]) assert.equal(engine.run('portable-gantry-check', over).text, 'GANTRY NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('press-tie-rod-check').text, 'TIE RODS ADEQUATE');
  for (const over of [{ p: 300 }, { dMax: 0.5 }, { mNut: 20 }] as Inputs[]) assert.equal(engine.run('press-tie-rod-check', over).text, 'TIE RODS NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('centrifuge-bowl-check').text, 'BOWL ADEQUATE');
  assert.equal(engine.run('centrifuge-bowl-check', { rpm: 3000 }).text, 'BOWL OVERSTRESSED');
  const cases: Array<[string, Inputs]> = [['ball-detent-check', { Lw: 16 }], ['ball-detent-check', { rise: 3 }], ['ball-detent-check', { alpha: 80, muB: 0.9 }], ['expansion-vessel-sizing', { T2: 5 }], ['expansion-vessel-sizing', { pf: 0.5 }], ['torque-arm-reaction-check', { R: 5 }], ['shear-pin-overload-design', { fMin: 3 }], ['portable-gantry-check', { tf: 200 }], ['press-tie-rod-check', { d: 4, P: 4.5 }], ['centrifuge-bowl-check', { r0: 300 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fiftieth handbook pass (handbook66): forty-first round of integrated design checks.
const HB50_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['screw-clamp-force-check', {}, { T: 11.25 }],
  ['scissor-lift-screw-check', {}, { Fmax: 5000 / Math.tan(Math.PI / 18), travel: 1200 * (Math.cos(Math.PI / 18) - Math.cos(5 * Math.PI / 18)) }],
  ['rope-drum-fleet-angle-check', {}, { fleet: Math.atan(250 / 10000) * 180 / Math.PI, turns: 50, layers: 1, Tdrum: 1550 }],
  ['enclosure-cooling-airflow', {}, { Pwall: 110, Pfan: 390, Qair: 390 * 3.6 / (1.005 * 10) / 1.16 }],
  ['ramp-traction-check', {}, { Fa: 750 }],
  ['two-pump-arrangement-check', {}, { Q2: Math.sqrt(35 / (10 / 160000 / 4 + 15 / 90000)), Hp: 47 }],
  ['cantilever-rack-arm-check', {}, { M: 3.6e6, Fbolt: 3.6e6 / 120 / 2 }],
  ['centrifugal-clutch-check', {}, { nEng: Math.sqrt(250 / 0.015) * 30 / Math.PI }],
  ['expansion-gap-plan', {}, { move: 18, g0: 11, gCold: 20, sR: 60 }],
];
for (const [id, over, expected, tol] of HB50_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-first-round design checks agree with the tools they chain', () => {
  const sc = engine.run('screw-clamp-force-check').values, pst = engine.run('power-screw-torque', { F: sc.F, dm: 10, lead: 2, flank: '15', mu: 0.15, dc: 8, muc: 0.15 }).values;
  near(pst.Tr, 11.25, 1e-9, 'clamp force gives the handle torque'); near(sc.eff, pst.eff, 1e-9, 'screw efficiency');
  const sl = engine.run('scissor-lift-screw-check').values, pss = engine.run('power-screw-torque', { F: sl.Fmax, dm: 25, lead: 5, flank: '15', mu: 0.1, dc: 0, muc: 0.01 }).values;
  near(sl.Tr, pss.Tr, 1e-12, 'screw torque at the bottom');
  near(sl.Hmax - sl.Hmin, 1200 * (Math.sin(5 * Math.PI / 18) - Math.sin(Math.PI / 18)), 1e-9, 'lift height');
  const rd = engine.run('rope-drum-fleet-angle-check').values, rw = engine.run('rope-winch-drum', { F: 10, tail: 1, mu: 0.25, wraps: 3, D: rd.Deff, v: 10, eta: 85, MBL: 30, SFreq: 5 }).values;
  near(rd.Tdrum, rw.T + rd.Deff / 2000, 1e-9, 'drum torque from the rope winch drum tool');
  const r4 = engine.run('rope-drum-fleet-angle-check', { lift: 100 }).values;
  near(r4.cap, [1, 2, 3, 4].reduce((s, i) => s + Math.PI * (300 + (2 * i - 1) * 10) * 50 / 1000, 0), 1e-9, 'capacity of four layers'); near(r4.layers, 4, 0, 'layers used');
  const ec = engine.run('enclosure-cooling-airflow').values, he = engine.run('heating-energy', { mass: ec.mHr, c: 1.005, T1: 35, T2: 45, P: 9, eff: 85, price: 0.3 }).values;
  near(he.kWh, ec.Pfan / 1000, 1e-12, 'air heated by the fan heat in one hour');
  const rt = engine.run('ramp-traction-check').values, th = 6 * Math.PI / 180;
  near(rt.Fr, engine.run('rolling-resistance', { W: rt.W * Math.cos(th), r: 150, f: 1, v: 1, mu: 0.15 }).values.F, 1e-9, 'rolling resistance');
  near(rt.Fg, engine.run('inclined-plane', { mass: 2500, angle: 6, mu: 0 }).values.up, 1e-9, 'climbing force');
  near(rt.Nr + rt.Nf, rt.W * Math.cos(th), 1e-9, 'axle loads add up');
  const tp = engine.run('two-pump-arrangement-check').values, po = engine.run('pump-operating-point').values;
  near(tp.Q1, po.Q, 1e-9, 'one pump alone'); near(tp.H1, po.H, 1e-9, 'one pump head');
  near(tp.Q2, engine.run('pump-operating-point', { Qb: 800 }).values.Q, 1e-9, 'parallel pair as one pump of double flow');
  near(engine.run('two-pump-arrangement-check', { mode: 'series' }).values.Q2, engine.run('pump-operating-point', { H0: 100, Hb: 80 }).values.Q, 1e-9, 'series pair as one pump of double head');
  const ca = engine.run('cantilever-rack-arm-check').values, ss = engine.run('section-shapes', { shape: 'I', H: 150, B: 75, tf: 7, tw: 5, rho: 7850 }).values, bc = engine.run('beam-cases', { case: 'cant-udl', load: 8000, L: 900, a: 600, E: 200, I: ss.Ix, c: 75, allow: 160 }).values;
  near(ca.A, ss.A, 1e-9, 'arm area'); near(ca.Ix, ss.Ix, 1e-6, 'arm I'); near(ca.Zx, ss.Zx, 1e-6, 'arm Z');
  near(ca.M, bc.M, 1e-9, 'moment at the column'); near(ca.defl, bc.defl, 1e-9, 'tip deflection'); near(ca.stress, bc.stress, 1e-9, 'bending stress');
  for (const shape of ['T', 'C', 'L']) { const cs = engine.run('cantilever-rack-arm-check', { shape }).values, sh = engine.run('section-shapes', { shape, H: 150, B: 75, tf: 7, tw: 5, rho: 7850 }).values; near(cs.Zx, sh.Zx, 1e-6, `${shape} section modulus`); }
  const cc = engine.run('centrifugal-clutch-check').values;
  near(cc.Fc, engine.run('centrifugal-force', { mass: 0.25, radius: 60, rpm: 3000 }).values.F, 1e-9, 'shoe force at speed');
  near(engine.run('centrifugal-force', { mass: 0.25, radius: 60, rpm: cc.nEng }).values.F, 250, 1e-9, 'shoe force equals the spring force at engagement');
  const eg = engine.run('expansion-gap-plan').values, ts = engine.run('thermal-stress', { E: 200, alpha: 12, dT: 25, restraint: 100, A: 2000, Sy: 250 }).values;
  near(eg.sR, -ts.stress, 1e-9, 'restrained stress'); near(eg.FR, -ts.force, 1e-6, 'restrained force'); near(eg.strain, ts.strain, 1e-15, 'strain'); near(eg.nR, ts.n, 1e-9, 'margin to yield');
});

test('forty-first-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('screw-clamp-force-check').text, 'CLAMP FORCE ADEQUATE');
  assert.equal(engine.run('screw-clamp-force-check', { Freq: 8000 }).text, 'CLAMP FORCE TOO LOW');
  assert.equal(engine.run('screw-clamp-force-check', { sA: 100 }).text, 'SCREW OVERSTRESSED');
  assert.equal(engine.run('scissor-lift-screw-check').text, 'DRIVE ADEQUATE');
  assert.equal(engine.run('scissor-lift-screw-check', { Tav: 50 }).text, 'SCREW TORQUE TOO HIGH');
  assert.equal(engine.run('scissor-lift-screw-check', { tMax: 10 }).text, 'LIFT TOO SLOW');
  assert.equal(engine.run('rope-drum-fleet-angle-check').text, 'DRUM ARRANGEMENT ADEQUATE');
  for (const over of [{ Ls: 5000 }, { ratioMin: 40 }, { lift: 100 }] as Inputs[]) assert.equal(engine.run('rope-drum-fleet-angle-check', over).text, 'DRUM ARRANGEMENT NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('enclosure-cooling-airflow').text, 'FAN ADEQUATE');
  assert.equal(engine.run('enclosure-cooling-airflow', { fan: 100 }).text, 'FAN TOO SMALL');
  assert.equal(engine.run('enclosure-cooling-airflow', { P: 100 }).text, 'NO FAN NEEDED');
  assert.equal(engine.run('ramp-traction-check').text, 'TRACTION ADEQUATE');
  assert.equal(engine.run('ramp-traction-check', { mu: 0.2 }).text, 'WHEELS WILL SLIP');
  assert.equal(engine.run('ramp-traction-check', { slope: 30, hcg: 1500 }).text, 'TIPS BACKWARD');
  assert.equal(engine.run('two-pump-arrangement-check').text, 'FLOW MET');
  assert.equal(engine.run('two-pump-arrangement-check', { Qreq: 500 }).text, 'FLOW NOT MET');
  assert.equal(engine.run('two-pump-arrangement-check', { Qreq: 500, mode: 'series' }).text, 'FLOW MET');
  assert.equal(engine.run('cantilever-rack-arm-check').text, 'ARM ADEQUATE');
  for (const over of [{ P: 30000 }, { dlim: 2000 }, { Fb: 10000 }] as Inputs[]) assert.equal(engine.run('cantilever-rack-arm-check', over).text, 'ARM NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('centrifugal-clutch-check').text, 'CLUTCH ADEQUATE');
  assert.equal(engine.run('centrifugal-clutch-check', { Fs: 150 }).text, 'ENGAGES AT IDLE');
  assert.equal(engine.run('centrifugal-clutch-check', { Treq: 60 }).text, 'CLUTCH SLIPS AT SPEED');
  assert.equal(engine.run('expansion-gap-plan').text, 'GAP PLAN WORKS');
  assert.equal(engine.run('expansion-gap-plan', { L: 60 }).text, 'MORE GAPS NEEDED');
  const cases: Array<[string, Inputs]> = [['screw-clamp-force-check', { lead: 40, mu: 1 }], ['scissor-lift-screw-check', { thMax: 5 }], ['rope-drum-fleet-angle-check', { Ld: 5 }], ['enclosure-cooling-airflow', { Ti: 30 }], ['ramp-traction-check', { a: 2000 }], ['two-pump-arrangement-check', { Hb: 60 }], ['two-pump-arrangement-check', { H0: 10, Hb: 5 }], ['cantilever-rack-arm-check', { tf: 80 }], ['expansion-gap-plan', { Ti: 50 }], ['expansion-gap-plan', { gMax: 1 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-first handbook pass (handbook67): forty-second round of integrated design checks.
const HB51_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['cylinder-cushion-check', {}, { KE: 25, a: 6.25 }],
  ['pipe-bend-thrust-check', {}, { F: 2 * (1e6 * Math.PI * 0.0225 / 4 + 1000 * 0.05 * 0.05 / (Math.PI * 0.0225 / 4)) * Math.SQRT1_2 }],
  ['jet-impact-force-check', {}, { vel: Math.sqrt(1000), R: 1000 * 0.95 * Math.PI * 1e-4 / 4 * 1000 }],
  ['spring-clamp-hydraulic-release', {}, { Ap: Math.PI * (6400 - 1600) / 4 }],
  ['extraction-duct-check', {}, { Qt: 3200 }],
  ['gravity-chute-check', {}, { a: 9.80665 * (0.5 - 0.3 * Math.sqrt(3) / 2), thMin: Math.atan(0.3) * 180 / Math.PI }],
  ['torque-wrench-adapter-check', {}, { Leff: 450, Tact: 81 * 1.125 }],
  ['friction-wheel-drive-check', {}, { n2: 150, R: 100 / 3 }],
  ['taper-bush-grip-check', {}, { F: 10000, Fa: 20000 }],
];
for (const [id, over, expected, tol] of HB51_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-second-round design checks agree with the tools they chain', () => {
  const cc = engine.run('cylinder-cushion-check').values, ua = engine.run('uniform-acceleration', { mode: 'distance', u: 0.5, a: 0, t: 1, v: 0, s: 0.02, h: 1 }).values;
  near(cc.a, -ua.a, 1e-12, 'deceleration'); near(cc.t, ua.t, 1e-12, 'stopping time');
  near(engine.run('cylinder-cushion-check', { v: cc.vMax }).values.pCush, 250, 1e-9, 'largest speed reaches the rating');
  const pb = engine.run('pipe-bend-thrust-check').values;
  near(pb.vel, engine.run('pipe-friction', { Q: 3000, d: 150, L: 1, nu: 1, rho: 1000, eps: 0.045, K: 0 }).values.vel, 1e-12, 'pipe velocity');
  const jf = engine.run('jet-impact-force-check').values, of = engine.run('orifice-flow', { mode: 'flow', d: 10, Cd: 0.95, dp: 5, Q: 10, rho: 1000 }).values;
  near(jf.Q, of.Q, 1e-9, 'nozzle flow'); near(jf.vel, of.vel, 1e-12, 'jet velocity');
  near(engine.run('jet-impact-force-check', { beta: 30 }).values.Fp, jf.R / 2, 1e-9, 'inclined plate');
  const sp = { d: 4, D: 22, Na: 6, ends: 'cg', G: 79.3, L0: 48, allow: 700, rho: 7850 }, sc = engine.run('spring-clamp-hydraulic-release').values, c1 = engine.run('compression-spring', { ...sp, Lw: 40 }).values, c2 = engine.run('compression-spring', { ...sp, Lw: 38.5 }).values;
  near(sc.k, c1.k, 1e-12, 'spring rate'); near(sc.F1, c1.F, 1e-12, 'clamped load'); near(sc.tau, c1.tau, 1e-12, 'clamped stress'); near(sc.Ls, c1.Ls, 1e-12, 'solid length');
  near(sc.Frel1, c2.F, 1e-12, 'load at release'); near(sc.tauRel, c2.tau, 1e-12, 'stress at release');
  const ed = engine.run('extraction-duct-check').values, pf = engine.run('pipe-friction', { Q: ed.Qlmin, d: 250, L: 25, nu: 15, rho: 1.2, eps: 0.15, K: 3 }).values;
  near(ed.vel, pf.vel, 1e-12, 'duct velocity'); near(ed.Re, pf.Re, 1e-9, 'Reynolds number'); near(ed.f, pf.f, 1e-12, 'friction factor'); near(ed.dpDuct, pf.dp * 1e5, 1e-9, 'duct loss');
  const gc = engine.run('gravity-chute-check').values, ip = engine.run('inclined-plane', { mass: 20, angle: 30, mu: 0.3 }).values, uat = engine.run('uniform-acceleration', { mode: 'time', u: 0, a: gc.a, t: gc.t, v: 1, s: 1, h: 1 }).values;
  near(gc.Fdrive, -ip.down, 1e-9, 'driving force down the chute'); near(uat.v, gc.vExit, 1e-12, 'exit speed'); near(uat.s, 3, 1e-12, 'chute length');
  const tw = engine.run('torque-wrench-adapter-check').values, bt = engine.run('bolt-torque-preload', { mode: 'torque', d: 12, P: 1.75, K: 0.2, Sp: 600, pct: 75, T: 80 }).values, bp = engine.run('bolt-torque-preload', { mode: 'preload', d: 12, P: 1.75, K: 0.2, Sp: 600, pct: 75, T: tw.Tact }).values;
  near(tw.Ttarget, bt.T, 1e-12, 'target torque'); near(tw.As, bt.As, 1e-12, 'stress area'); near(tw.F, bp.F, 1e-9, 'preload'); near(tw.share, bp.share, 1e-12, 'share of proof');
  near(engine.run('torque-wrench-adapter-check', { Tset: tw.Tneed }).values.share, 75, 1e-9, 'corrected setting gives the target');
  near(engine.run('torque-wrench-adapter-check', { phi: 90 }).values.Tact, 81, 1e-9, 'adapter at right angles needs no correction');
  const fw = engine.run('friction-wheel-drive-check').values, hc = engine.run('hertz-contact', { geom: 'cyl', R1: 50, R2: 100, F: fw.Nf, L: 20, E1: 210, nu1: 0.3, E2: 210, nu2: 0.3, allow: 600 }).values;
  near(fw.size, hc.size, 1e-12, 'contact half-width'); near(fw.p0, hc.p0, 1e-9, 'peak contact pressure'); near(fw.Es, hc.Es, 1e-9, 'contact modulus'); near(fw.R, hc.R, 1e-12, 'relative radius');
  const tb = engine.run('taper-bush-grip-check').values, bq = engine.run('bolt-torque-preload', { mode: 'preload', d: 10, P: 1.5, K: 0.2, Sp: 830, pct: 75, T: 20 }).values;
  near(tb.F, bq.F, 1e-9, 'screw preload'); near(tb.share, bq.share, 1e-12, 'screw share of proof'); near(tb.As, bq.As, 1e-12, 'screw stress area');
  near(tb.Nn, 20000 / (Math.sin(8 * Math.PI / 180) + 0.15 * Math.cos(8 * Math.PI / 180)), 1e-9, 'wedge normal force');
});

test('forty-second-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('cylinder-cushion-check').text, 'CUSHION ADEQUATE');
  assert.equal(engine.run('cylinder-cushion-check', { v: 3 }).text, 'CUSHION PRESSURE TOO HIGH');
  assert.equal(engine.run('pipe-bend-thrust-check').text, 'THRUST BLOCK ADEQUATE');
  assert.equal(engine.run('pipe-bend-thrust-check', { Ab: 0.3 }).text, 'THRUST BLOCK TOO SMALL');
  assert.equal(engine.run('jet-impact-force-check').text, 'REACTION ACCEPTABLE');
  assert.equal(engine.run('jet-impact-force-check', { dp: 50 }).text, 'REACTION TOO HIGH');
  assert.equal(engine.run('spring-clamp-hydraulic-release').text, 'CLAMP ADEQUATE');
  for (const over of [{ Fc: 4000 }, { pAv: 10 }, { allow: 400 }] as Inputs[]) assert.equal(engine.run('spring-clamp-hydraulic-release', over).text, 'CLAMP NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('extraction-duct-check').text, 'EXTRACTION ADEQUATE');
  assert.equal(engine.run('extraction-duct-check', { d: 315 }).text, 'DUCT VELOCITY TOO LOW');
  assert.equal(engine.run('extraction-duct-check', { pFan: 1000 }).text, 'FAN PRESSURE SHORT');
  assert.equal(engine.run('gravity-chute-check').text, 'CHUTE WORKS');
  assert.equal(engine.run('gravity-chute-check', { angle: 15 }).text, 'PART WILL NOT SLIDE');
  assert.equal(engine.run('gravity-chute-check', { vMax: 3 }).text, 'EXIT SPEED TOO HIGH');
  assert.equal(engine.run('torque-wrench-adapter-check').text, 'CORRECT SETTING');
  assert.equal(engine.run('torque-wrench-adapter-check', { Tset: 91 }).text, 'OVER-TIGHTENED');
  assert.equal(engine.run('torque-wrench-adapter-check', { Tset: 70 }).text, 'UNDER-TIGHTENED');
  assert.equal(engine.run('friction-wheel-drive-check').text, 'DRIVE ADEQUATE');
  assert.equal(engine.run('friction-wheel-drive-check', { allow: 400 }).text, 'CONTACT STRESS TOO HIGH');
  assert.equal(engine.run('taper-bush-grip-check').text, 'GRIP ADEQUATE');
  assert.equal(engine.run('taper-bush-grip-check', { Pw: 15 }).text, 'BUSH WILL SLIP');
  assert.equal(engine.run('taper-bush-grip-check', { T: 100 }).text, 'SCREWS OVERLOADED');
  const cases: Array<[string, Inputs]> = [['cylinder-cushion-check', { rod: 70 }], ['jet-impact-force-check', { u: 40 }], ['spring-clamp-hydraulic-release', { stroke: 9 }], ['spring-clamp-hydraulic-release', { Lw: 50 }], ['spring-clamp-hydraulic-release', { Di: 90 }], ['torque-wrench-adapter-check', { phi: 180, E: 500 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-second handbook pass (handbook68): forty-third round of integrated design checks.
// Expected values are independent hand calculations (closed forms, binomial sums and a Simpson integral of the t density).
const HB52_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['machine-economic-life', {}, { nStar: 7, Emin: 42579.166435704436, MC: 40400 }, 1e-6],
  ['machine-economic-life', { i: 0 }, { nStar: 5, Emin: 36230.295 }, 1e-6],
  ['groove-weld-cost-check', {}, { At: 24 + 100 * Math.tan(Math.PI / 6) + 2 / 3 * (5 + 20 * Math.tan(Math.PI / 6)) * 2, total: 660.5314530152626 }, 1e-8],
  ['groove-weld-cost-check', { prep: 'dv', caps: '2' }, { At: 81.59685397120464 }, 1e-9],
  ['groove-weld-cost-check', { prep: 'sb', ang: 45 }, { At: 94 }, 1e-9],
  ['groove-weld-cost-check', { prep: 'sq' }, { At: 24 + 2 / 3 * 5 * 2 }, 1e-9],
  ['insert-consumption-reorder-plan', {}, { T: 16, tc: 0.7539822368615503, ppe: 16, im: 93.75, ROP: 51.60932659358612, cpp: 0.28125 }, 1e-9],
  ['bearing-fleet-spares-plan', {}, { L10h: 1e9 / 87000, eta: 51526.283937896114, F: 0.021397273109916348, expF: 0.8558909243966539, s: 3, cover: 98.96249521303739 }, 1e-6],
  ['hydraulic-press-cycle-check', {}, { cyc: 4.478921164768997, F: 157.07963267948963, pApp: 5.196896100959848, pNeed: 152.7887453682195, Psh: 11.983431009272119 }, 1e-9],
  ['vacuum-table-workholding-check', {}, { Fh: 7680, R: 2318.709975, pk: 1086.4977448406723, sf: 2.1341139325972773, vfMax: 2134.113932597277 }, 1e-8],
  ['gauge-repeatability-bias-check', {}, { Cg: 0.008 / 0.0048, Cgk: 0.0038 / 0.0024, t: 1.25, p: 0.22335147816560041, varRep: 12 }, 1e-6],
];
for (const [id, over, expected, tol] of HB52_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-third-round design checks agree with the tools they chain', () => {
  const el = engine.run('machine-economic-life').values, f7 = engine.run('interest-factors', { rate: 8, n: 7, m: 1, amount: 1 }).values;
  near(el.Emin, 120000 * f7.AP - el.Lstar * f7.AF + 15000 + 3000 * f7.AG, 1e-6, 'EUAC at the economic life from the interest factors');
  near(engine.run('machine-economic-life', { G: 0, Nmax: 1 }).values.Emin, engine.run('euac-compare', { rate: 8, pA: 120000, aA: 15000, sA: 84000, nA: 1 }).values.eA, 1e-6, 'one-year life as the EUAC comparison');
  const gw = engine.run('groove-weld-cost-check').values, wc = engine.run('weld-cost', { leg: Math.sqrt(2 * gw.At), excess: 0, rho: 7.85, dep: 3, of: 30, eff: 92, rate: 95, wire: 6, gasFlow: 15, gasPrice: 12 }).values;
  near(gw.mpm, wc.mass, 1e-12, 'weld metal per metre'); near(gw.total, wc.total * 6 + 95, 1e-9, 'cost as the weld cost tool plus other time');
  near(engine.run('insert-consumption-reorder-plan').values.T, engine.run('taylor-tool-life', { mode: 'nc', n: 0.25, C: 400, V: 200 }).values.T, 1e-12, 'Taylor life');
  const bf = engine.run('bearing-fleet-spares-plan').values;
  near(bf.L10h, engine.run('bearing-l10-life', { type: 'ball', C: 30, P: 3, rpm: 1450 }).values.hours, 1e-9, 'rating life');
  near(bf.F, engine.run('weibull-reliability', { beta: 1.5, eta: bf.eta, t: 4000 }).values.F, 1e-12, 'Weibull probability of failure');
  const a1 = (Math.log(100 / 95) / Math.log(1 / 0.9)) ** (2 / 3);
  near(engine.run('bearing-fleet-spares-plan', { yrs: a1 * bf.L10h / 4000 }).values.F, 0.05, 1e-12, 'slope 1.5 matches the a1 reliability factor');
  const hp = engine.run('hydraulic-press-cycle-check').values, hc = engine.run('hydraulic-cylinder', { bore: 100, rod: 70, pressure: 200, back: 0, flow: 40, stroke: 280 }).values;
  near(hp.F * 1000, hc.extension, 1e-9, 'pressing force'); near(hp.vP, hc.extendSpeed, 1e-9, 'pressing speed'); near(hp.vR, hc.retractSpeed, 1e-9, 'return speed');
  near(hp.Psh, engine.run('hydraulic-power', { pressure: hp.pNeed, flow: 40, efficiency: 85 }).values.shaft, 1e-12, 'motor power at the pressing load');
  near(engine.run('hydraulic-press-cycle-check', { circuit: 'std' }).values.vA, hp.vP, 1e-12, 'standard approach at full-bore speed');
  const vt = engine.run('vacuum-table-workholding-check').values, mp = engine.run('milling-power', { ae: 40, ap: 4, vf: 2000, D: 50, rpm: 3000, kc: 800 }).values;
  near(vt.Pc, mp.Pc, 1e-12, 'cutting power'); near(vt.vc, mp.vc, 1e-12, 'cutting speed');
  near(vt.Fh, 0.8 * engine.run('vacuum-cup', { D: Math.sqrt(4 * 120000 / Math.PI), n: 1, vac: 80 }).values.per, 1e-9, 'holding force as the vacuum cup tool');
  near(engine.run('vacuum-table-workholding-check', { vf: vt.vfMax }).values.sf, 2, 1e-9, 'largest feed gives the required factor');
});

test('forty-third-round design checks: verdicts and guards', () => {
  assert.equal(engine.run('machine-economic-life').text, 'KEEP FOR ANOTHER YEAR');
  assert.equal(engine.run('machine-economic-life', { Ad: 40000 }).text, 'REPLACE NOW');
  assert.equal(engine.run('groove-weld-cost-check').text, 'QUOTE COVERS THE WELDING');
  assert.equal(engine.run('groove-weld-cost-check', { quote: 500 }).text, 'QUOTE TOO LOW');
  assert.equal(engine.run('insert-consumption-reorder-plan').text, 'STOCK ABOVE REORDER POINT');
  assert.equal(engine.run('insert-consumption-reorder-plan', { onHand: 40 }).text, 'ORDER NOW');
  assert.equal(engine.run('bearing-fleet-spares-plan').text, 'SPARES ENOUGH');
  assert.equal(engine.run('bearing-fleet-spares-plan', { Nb: 200 }).text, 'SPARES SHORT');
  assert.equal(engine.run('bearing-fleet-spares-plan', { Nb: 200 }).values.s, 8);
  assert.equal(engine.run('hydraulic-press-cycle-check').text, 'PRESS CYCLE ADEQUATE');
  for (const over of [{ Freq: 200 }, { tMax: 4 }, { Pmot: 10 }, { Fapp: 100 }] as Inputs[]) assert.equal(engine.run('hydraulic-press-cycle-check', over).text, 'PRESS CYCLE NOT ADEQUATE', JSON.stringify(over));
  assert.equal(engine.run('vacuum-table-workholding-check').text, 'PART HELD');
  assert.equal(engine.run('vacuum-table-workholding-check', { vf: 3000 }).text, 'PART MAY SLIDE');
  assert.equal(engine.run('gauge-repeatability-bias-check').text, 'GAUGE CAPABLE');
  for (const over of [{ s: 0.001 }, { res: 0.01 }] as Inputs[]) assert.equal(engine.run('gauge-repeatability-bias-check', over).text, 'GAUGE NOT CAPABLE', JSON.stringify(over));
  const cases: Array<[string, Inputs]> = [['machine-economic-life', { MV1: 40000 }], ['machine-economic-life', { s1: 150 }], ['groove-weld-cost-check', { c: 20 }], ['groove-weld-cost-check', { t: 500 }], ['groove-weld-cost-check', { prep: 'sb', ang: 85 }], ['insert-consumption-reorder-plan', { V: 1000 }], ['insert-consumption-reorder-plan', { use: 0 }], ['bearing-fleet-spares-plan', { P: 40 }], ['bearing-fleet-spares-plan', { tgt: 100 }], ['hydraulic-press-cycle-check', { rod: 120 }], ['vacuum-table-workholding-check', { ae: 60 }], ['vacuum-table-workholding-check', { vac: 150 }], ['gauge-repeatability-bias-check', { USL: 9.97 }], ['gauge-repeatability-bias-check', { n: 2 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Batch handbook69: thermodynamics tools from Fermi's Thermodynamics. Expected values are independent hand calculations
// (closed forms, a bisection solution of the van der Waals cubic and a Simpson integral of the Carnot efficiency).
const TD_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['vapour-pressure-boiling-check', {}, { TbC: 58.8894570347307, pv: 10.514502532437835, slope: 0.5079915816397658, mar: 13.889457034730697 }, 1e-9],
  ['real-gas-cylinder-contents', {}, { x: 0.00011928810112447864, mass: 11.742160255685116, Z: 1.000850018956593, mIdeal: 11.752141314493798, Tc: 126.15417851397955, pc: 3387933.466921776 }, 1e-8],
  ['ro-pressure-check', {}, { pif: 1.527078252293655, CF: Math.log(4) / 0.75, NDP: 10.92736003980865, tail: 6.89168699082538, Qp: 7.277621786512562, Pneed: 10.078645966197355 }, 1e-9],
  ['battery-heat-check', {}, { qcell: 5.4 - 60 * 298.15 * 0.0001, Q: 361.11, dT: 2.89998 }, 1e-9],
  ['battery-heat-check', { mode: 'chg' }, { Q: 718.89 }, 1e-9],
  ['heat-pump-cop-check', {}, { COPc: 323.15 / 48, COP: 50 / 15, eta2: 49.51261024292125, cost: 9000, Pmin: 18.567228841095467 }, 1e-9],
  ['heat-pump-cop-check', { mode: 'cool' }, { COPc: 275.15 / 48 }, 1e-12],
  ['waste-heat-recovery-limit', {}, { Q: 313.5, Ex: 41.22284650758613, ofEx: 36.38758909392536, value: 22500 }, 1e-6],
];
for (const [id, over, expected, tol] of TD_CASES) test(`thermodynamics: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thermodynamics tools: identities and links to existing tools', () => {
  const vp = engine.run('vapour-pressure-boiling-check').values;
  near(engine.run('vapour-pressure-boiling-check', { p: vp.pv }).values.TbC, 45, 1e-9, 'boiling at the vapour pressure returns the liquid temperature');
  near(engine.run('vapour-pressure-boiling-check', { p: 101.325 }).values.TbC, 100, 1e-9, 'reference point reproduced');
  const ideal = engine.run('real-gas-cylinder-contents', { a: 0, b: 0 }).values;
  near(ideal.mass, ideal.mIdeal, 1e-9, 'a = b = 0 reduces to the ideal gas'); near(ideal.Z, 1, 1e-12, 'ideal compressibility');
  const co2 = engine.run('real-gas-cylinder-contents', { M: 44.01, a: 0.364, b: 42.67, pg: 40 });
  assert.equal(co2.checks.find((c: any) => c.label === 'Critical temperature').status, 'warn', 'carbon dioxide at 15 °C is below its critical temperature');
  const hp = engine.run('heat-pump-cop-check').values, hpc = engine.run('heat-pump-cop-check', { mode: 'cool' }).values;
  near(hp.COPc - hpc.COPc, 1, 1e-12, 'heating Carnot COP is one more than cooling');
  near(engine.run('heat-pump-cop-check', { P: 50 / hp.COPc }).values.eta2, 100, 1e-9, 'COP at the Carnot limit is 100 % efficient');
  near(engine.run('waste-heat-recovery-limit', { T2: 89.999 }).values.etaC, (1 - 293.15 / 363.15) * 100, 1e-3, 'mean Carnot efficiency tends to the point value');
  near(engine.run('ro-pressure-check', { Pf: engine.run('ro-pressure-check').values.Pneed }).values.Qp, 4, 1e-9, 'feed pressure needed gives the flow wanted');
});

test('thermodynamics tools: verdicts and guards', () => {
  assert.equal(engine.run('vapour-pressure-boiling-check').text, 'LIQUID STAYS BELOW BOILING');
  assert.equal(engine.run('vapour-pressure-boiling-check', { Tw: 55 }).text, 'MARGIN TOO SMALL');
  assert.equal(engine.run('vapour-pressure-boiling-check', { Tw: 65 }).text, 'LIQUID WILL BOIL');
  assert.equal(engine.run('real-gas-cylinder-contents').text, 'CONTENTS SUFFICIENT');
  assert.equal(engine.run('real-gas-cylinder-contents', { mreq: 20 }).text, 'CONTENTS SHORT');
  assert.equal(engine.run('ro-pressure-check').text, 'PRESSURE ADEQUATE');
  assert.equal(engine.run('ro-pressure-check', { Qreq: 10 }).text, 'PERMEATE FLOW SHORT');
  assert.equal(engine.run('ro-pressure-check', { rec: 95 }).text, 'CONCENTRATE END STOPS PRODUCING');
  assert.equal(engine.run('battery-heat-check').text, 'TEMPERATURE RISE ACCEPTABLE');
  assert.equal(engine.run('battery-heat-check', { I: 100 }).text, 'PACK RUNS TOO HOT');
  near(engine.run('battery-heat-check', { I: 100 }).values.dT, (100 * (15 - 100 * 298.15 * 0.0001) - 200) * 1800 / 100000, 1e-9, 'temperature rise at 100 A');
  assert.equal(engine.run('heat-pump-cop-check').text, 'COP PLAUSIBLE');
  assert.equal(engine.run('heat-pump-cop-check', { P: 5 }).text, 'COP EXCEEDS THE CARNOT LIMIT');
  assert.equal(engine.run('heat-pump-cop-check', { P: 25 }).text, 'COP BELOW EXPECTATION');
  assert.equal(engine.run('waste-heat-recovery-limit').text, 'CLAIM PLAUSIBLE');
  assert.equal(engine.run('waste-heat-recovery-limit', { W: 25 }).text, 'CLAIM OPTIMISTIC');
  assert.equal(engine.run('waste-heat-recovery-limit', { W: 50 }).text, 'EXCEEDS THE SECOND-LAW LIMIT');
  const cases: Array<[string, Inputs]> = [['vapour-pressure-boiling-check', { M: 0.5 }], ['vapour-pressure-boiling-check', { p1: 0.001, p: 100000 }], ['real-gas-cylinder-contents', { pg: 2000 }], ['ro-pressure-check', { rec: 100 }], ['battery-heat-check', { Nc: 0 }], ['heat-pump-cop-check', { Tsrc: 50, Tsink: 40 }], ['heat-pump-cop-check', { etaMin: 0 }], ['waste-heat-recovery-limit', { T2: 10 }], ['waste-heat-recovery-limit', { T2: 95 }], ['waste-heat-recovery-limit', { share: 0 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Polymer thermodynamics (batch polymers): Flory–Huggins, Hansen, Flory–Rehner, single-point viscosity, Flory melting and DLS.
// Expected values are independent hand calculations in node: closed forms, the exact regular-solution binodal and equal chemical potentials.
const RG = 8.31446261815324;
const POLY_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['polymer-solution-phase-check', {}, { Nw: (200000 / 1.05) / (92 / 0.87), chi: 0.34 + (92 / 0.87) * 4 / (RG * 298.15), chis: 0.5 * (1 / (1801.2422360248447 * 0.05) + 1 / 0.95), pc: 0.028048156150781343, chic: 0.5243255507299315, chib: 0.5273276043686248, Tb: -1.5732405913831826 }, 1e-7],
  ['polymer-solution-phase-check', { M1: 100, rho1: 1, M2: 100, rho2: 1, PDz: 1, phi: 10 }, { Nw: 1, pc: 0.5, chic: 2, chib: Math.log(1 / 9) / (2 * 0.1 - 1), chis: 0.5 * (1 / 0.1 + 1 / 0.9) }, 1e-9], // regular solution
  ['hansen-solvent-compatibility', {}, { Ra: Math.sqrt(4 * 9 + 4.5 ** 2 + 16.1 ** 2), RED: Math.sqrt(4 * 9 + 4.5 ** 2 + 16.1 ** 2) / 8.6, best: 337.45 / 370.25 }],
  ['hansen-solvent-compatibility', { xB: 100 }, { Ra: Math.sqrt(4 * 0.25 + 9 + 0.81), dD: 18, dH: 2 }],
  ['hansen-solvent-compatibility', { xB: 50 }, { dD: 16.75, dP: 5.25, dH: 10.5, Ra: Math.sqrt(4 * 1.75 ** 2 + 0.75 ** 2 + 7.6 ** 2) }],
  ['rubber-swelling-crosslink-density', {}, { v2: (1.95 * 0.6 / 0.92) / (1.95 * 0.6 / 0.92 + 4.25 / 0.867), nu: 156.68428196613112, Mc: 5871.6802250711235, G: 156.68428196613112 * RG * 296.15, dV: 272.0098039215687, dm: 210, ext: 2.5 }, 1e-6],
  ['rubber-swelling-crosslink-density', { f: 3 }, { nu: 168.55236405801892 }, 1e-6],
  ['polymer-intrinsic-viscosity', {}, { er: 1.35, sc: Math.sqrt(2 * (0.35 - Math.log(1.35))) / 0.5, bm: 0.25 * (0.35 + 3 * Math.log(1.35)) / 0.5, hg: (Math.sqrt(1 + 4 * 0.35 * 0.35) - 1) / (2 * 0.35 * 0.5), Mv: (Math.sqrt(2 * (0.35 - Math.log(1.35))) / 0.5 / 5e-4) ** (1 / 0.7) }],
  ['polymer-intrinsic-viscosity', { method: 'bm' }, { iv: 0.6251568886755072 }],
  ['polymer-melting-point-depression', {}, { phi1: 17 / 35, Tm: 1 / (1 / 413.15 + RG / 8000 * 33 / 150 * (17 / 35 - 0.3 * (17 / 35) ** 2)) - 273.15, dT: 15.583618577018228 }, 1e-7],
  ['polymer-melting-point-depression', { w1: 0 }, { phi1: 0, Tm: 140 }, 1e-9],
  ['dls-particle-size', {}, { q: 4 * Math.PI * 1.332 * Math.SQRT1_2 / 632.8e-9, G1: 3000, D: 8.575432121651589e-12, d: 57.22699592593687, qR: 0.5351845574327894 }],
  ['dls-particle-size', { corr: 'g1' }, { G1: 6000, d: 57.22699592593687 / 2 }],
];
for (const [id, over, expected, tol] of POLY_CASES) test(`polymer tool: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('polymer tools: the binodal has equal chemical potentials and the boundaries are ordered', () => {
  for (const phi of [1, 5, 30]) {
    const v = engine.run('polymer-solution-phase-check', { phi }).values, N = v.Nw, a = phi / 100, b = v.phib, c = v.chib;
    const mu1 = (p: number) => Math.log1p(-p) + (1 - 1 / N) * p + c * p * p, mu2 = (p: number) => Math.log(p) - (N - 1) * (1 - p) + N * c * (1 - p) ** 2;
    near(mu1(a) - mu1(b), 0, 1e-12, `solvent potential at ${phi} %`); near(mu2(a) - mu2(b), 0, 1e-9, `polymer potential at ${phi} %`);
    assert.ok(v.chib <= v.chis + 1e-12 && v.Ts < v.Tb, `binodal before spinodal at ${phi} %`);
  }
  const mono = engine.run('polymer-solution-phase-check', { PDz: 1, phi: 100 / (1 + Math.sqrt(1801.2422360248447)) }).values;
  near(mono.chib, mono.chic, 1e-9, 'binodal meets the critical point'); near(mono.chis, mono.chic, 1e-9, 'spinodal meets the critical point');
  const sw = engine.run('rubber-swelling-crosslink-density').values;
  near(sw.E, 3 * sw.G, 1e-6, 'E = 3G');
});

test('polymer tools: verdicts and guards', () => {
  assert.equal(engine.run('polymer-solution-phase-check').text, 'ONE PHASE');
  assert.equal(engine.run('polymer-solution-phase-check', { T: 0 }).text, 'ONE PHASE, SMALL MARGIN');
  assert.equal(engine.run('polymer-solution-phase-check', { T: -5 }).text, 'METASTABLE: CAN SEPARATE');
  assert.equal(engine.run('polymer-solution-phase-check', { T: -10 }).text, 'UNSTABLE: SEPARATES SPONTANEOUSLY');
  assert.equal(engine.run('polymer-solution-phase-check', { d1: 19 }).text, 'ONE PHASE', 'equal solubility parameters: χ = χS at every temperature');
  assert.equal(engine.run('hansen-solvent-compatibility').text, 'LIKELY TO RESIST');
  assert.equal(engine.run('hansen-solvent-compatibility', { xB: 100 }).text, 'LIKELY TO DISSOLVE OR SWELL THE PART');
  assert.equal(engine.run('hansen-solvent-compatibility', { R0: 17 }).text, 'BORDERLINE: TEST IT');
  assert.equal(engine.run('hansen-solvent-compatibility', { purpose: 'dissolve', xB: 100 }).text, 'LIKELY TO DISSOLVE THE POLYMER');
  assert.equal(engine.run('hansen-solvent-compatibility', { purpose: 'dissolve' }).text, 'UNLIKELY TO DISSOLVE THE POLYMER');
  assert.equal(engine.run('rubber-swelling-crosslink-density').text, 'CROSSLINK DENSITY IN RANGE');
  assert.equal(engine.run('rubber-swelling-crosslink-density', { numin: 200 }).text, 'CROSSLINK DENSITY BELOW RANGE');
  assert.equal(engine.run('rubber-swelling-crosslink-density', { numax: 100 }).text, 'CROSSLINK DENSITY ABOVE RANGE');
  assert.ok(engine.run('rubber-swelling-crosslink-density', { chi: 0.44 }).values.nu < sw0(), 'a higher χ gives a lower crosslink density');
  assert.equal(engine.run('polymer-intrinsic-viscosity').text, 'IV WITHIN SPECIFICATION');
  assert.equal(engine.run('polymer-intrinsic-viscosity', { t: 120 }).text, 'IV OUTSIDE SPECIFICATION');
  assert.equal(engine.run('polymer-melting-point-depression').text, 'CRYSTALS MELT AT THIS TEMPERATURE');
  assert.equal(engine.run('polymer-melting-point-depression', { Tp: 127 }).text, 'MELTS, SMALL MARGIN');
  assert.equal(engine.run('polymer-melting-point-depression', { Tp: 115 }).text, 'CRYSTALS DO NOT MELT');
  assert.equal(engine.run('polymer-melting-point-depression', { purpose: 'keep', Tp: 100 }).text, 'CRYSTALS SURVIVE AT THIS TEMPERATURE');
  assert.equal(engine.run('polymer-melting-point-depression', { purpose: 'keep', Tp: 130 }).text, 'CRYSTALS MELT');
  assert.ok(engine.run('polymer-melting-point-depression', { chi: 0.6 }).checks.some((c: any) => c.label === 'Liquid–liquid separation' && c.status === 'warn'));
  assert.equal(engine.run('dls-particle-size').text, 'SIZE IN RANGE');
  assert.equal(engine.run('dls-particle-size', { Gm: 2000 }).text, 'SIZE OUT OF RANGE');
  assert.ok(engine.run('dls-particle-size', { Gm: 2000 }).checks.some((c: any) => c.label === 'Internal motion (qRh)' && c.status === 'warn'));
  const cases: Array<[string, Inputs]> = [['polymer-solution-phase-check', { M1: 1, rho1: 25, M2: 100000000, rho2: 0.1 }], ['polymer-solution-phase-check', { phi: 100 }], ['hansen-solvent-compatibility', { band: 1 }], ['rubber-swelling-crosslink-density', { ms: 1.9 }], ['rubber-swelling-crosslink-density', { md: 2.1 }], ['rubber-swelling-crosslink-density', { chi: 1.2 }], ['rubber-swelling-crosslink-density', { numin: 400 }], ['polymer-intrinsic-viscosity', { t: 90 }], ['polymer-intrinsic-viscosity', { IVmin: 0.8 }], ['polymer-melting-point-depression', { w1: 100 }], ['dls-particle-size', { dmin: 90 }], ['dls-particle-size', { theta: 180 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});
const sw0 = () => engine.run('rubber-swelling-crosslink-density').values.nu;

// Thermodynamics first principles (bryanthermo), after Bryan, Thermodynamics (1907).
// Expected values are independent closed forms; the Bryan cross-checks use his own forms of the same results.
const BT_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['liquid-adiabatic-compression', {}, { dT: 313.15 * (Math.exp(700e-6 * 35e6 / (870 * 1900)) - 1), dTlin: 313.15 * 700e-6 * 35e6 / (870 * 1900), dcv: 313.15 * 4.9e-7 * 1.6e9 / 870, g: 1900 / (1900 - 313.15 * 4.9e-7 * 1.6e9 / 870) }],
  ['gas-mixture-properties', {}, { Mm: 0.82 * 39.948 + 0.18 * 44.01, R: 8.314462618 / 40.67916, pc: 18.2385, ds: -(8.314462618 / 40.67916) * (0.82 * Math.log(0.82) + 0.18 * Math.log(0.18)) }],
  ['thermoelectric-cooler-check', {}, { S: 15.4 / 300.15, R: 232.15 * 15.4 / (300.15 * 6), K: 232.15 * 15.4 * 6 / (2 * 300.15 * 68), Qc: 22.923306034891056, P: 29.705756843800323, V: 8.487359098228664 }, 1e-9],
];
for (const [id, over, expected, tol] of BT_CASES) test(`thermodynamics check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thermodynamics checks agree with Bryan’s own forms', () => {
  // (179) and (166): Bryan’s mixing constant and mixture gas constant in mass-fraction form.
  const g = engine.run('gas-mixture-properties').values, R1 = 8.314462618 / 39.948, R2 = 8.314462618 / 44.01;
  near(g.ds, g.x1 * R1 * Math.log(g.R / (g.x1 * R1)) + g.x2 * R2 * Math.log(g.R / (g.x2 * R2)), 1e-12, 'mixing entropy as Bryan (179)');
  near(g.R, g.x1 * R1 + g.x2 * R2, 1e-12, 'gas constant as Bryan (166)');
  const pure = engine.run('gas-mixture-properties', { y1: 100, y2: 0 }).values;
  assert.equal(pure.ds, 0); near(pure.g, 0.5203 / (0.5203 - R1), 1e-12, 'pure argon γ');
  near(pure.rho, engine.run('gas-mixture-properties', { y1: 100, y2: 0, p: 202.65 }).values.rho / 2, 1e-12, 'density proportional to pressure');
  // (35): adiabatic and isothermal moduli are in the ratio of the specific heats; α = 0 gives no heating and γ = 1.
  const lq = engine.run('liquid-adiabatic-compression').values; near(lq.Ks / 1600, lq.g, 1e-12, 'K_s ÷ K_T = γ');
  const flat = engine.run('liquid-adiabatic-compression', { alpha: 0 }).values; assert.equal(flat.dT, 0); assert.equal(flat.g, 1);
  near(engine.run('liquid-adiabatic-compression', { alpha: -60 }).values.dT, 313.15 * (Math.exp(-60e-6 * 35e6 / (870 * 1900)) - 1), 1e-12, 'negative expansion cools');
  // Thermoelectric module fit: at the rated point (hot side at rating, ΔT = ΔT_max, I = I_max) no heat is pumped and V = V_max.
  const rated = engine.run('thermoelectric-cooler-check', { Th: 27, Tc: 27 - 68, I: 6 }).values;
  near(rated.Qc, 0, 1e-9, 'zero heat at the rated maximum'); near(rated.V, 15.4, 1e-9, 'rated voltage');
  near(engine.run('thermoelectric-cooler-check', { I: engine.run('thermoelectric-cooler-check').values.Iopt }).values.Qc, engine.run('thermoelectric-cooler-check').values.QcMax, 1e-9, 'heat at the optimum current');
});

test('thermodynamics checks: verdicts and guards', () => {
  assert.equal(engine.run('liquid-adiabatic-compression').text, 'TEMPERATURE RISE WITHIN LIMIT');
  assert.equal(engine.run('liquid-adiabatic-compression', { Tmax: 44 }).text, 'TEMPERATURE LIMIT EXCEEDED');
  assert.equal(engine.run('gas-mixture-properties').text, 'PARTIAL PRESSURE WITHIN LIMIT');
  assert.equal(engine.run('gas-mixture-properties', { lim: 15 }).text, 'PARTIAL PRESSURE OUTSIDE LIMIT');
  assert.equal(engine.run('gas-mixture-properties', { kind: 'min' }).text, 'PARTIAL PRESSURE OUTSIDE LIMIT');
  assert.equal(engine.run('thermoelectric-cooler-check').text, 'MODULES PUMP THE HEAT LOAD');
  assert.equal(engine.run('thermoelectric-cooler-check', { Qreq: 60 }).text, 'MODULES TOO SMALL FOR THE LOAD');
  assert.equal(engine.run('thermoelectric-cooler-check', { Th: 90 }).text, 'NO NET COOLING AT THIS TEMPERATURE DIFFERENCE');
  assert.equal(engine.run('thermoelectric-cooler-check', { I: 6.5, Qreq: 10 }).text, 'OUTSIDE THE MODULE RATINGS');
  const cases: Array<[string, Inputs]> = [
    ['liquid-adiabatic-compression', { rho: 0 }], ['liquid-adiabatic-compression', { alpha: 20000, KT: 1000000 }],
    ['gas-mixture-properties', { y1: 90, y2: 20 }], ['gas-mixture-properties', { cp1: 0.1, y1: 100, y2: 0 }],
    ['thermoelectric-cooler-check', { Tc: 50 }], ['thermoelectric-cooler-check', { Thr: -100, dTmax: 200 }], ['thermoelectric-cooler-check', { n: 2.5 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Engineering thermodynamics (handbook72): cycles, second-law limits, moist air, combustion and machine efficiency.
// Expected values are independent hand calculations: closed forms, and Hyland–Wexler saturation pressures solved separately.
const TH72 = 273.15;
const TH72_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['otto-diesel-cycle-check', {}, { eta: 100 * (1 - 10 ** -0.4), P3: 9867.865837065985, wnet: 963.0285271144043, MEP: 1229.8642382668195 }, 1e-8],
  ['otto-diesel-cycle-check', { cycle: 'diesel', r: 18, rc: 2 }, { eta: 100 * (1 - (2 ** 1.4 - 1) / (1.4 * 18 ** 0.4)), qin: 967.6460222919304, P3: 100 * 18 ** 1.4, MEP: 743.7505528745002 }, 1e-8],
  ['brayton-regenerator-check', {}, { P: 1341.6360673018862, eta: 42.43040641949687, eta0: 34.69714333392603, rbw: 54.164324404357416, T5: 470.7525458047538 + TH72 }, 1e-8],
  ['brayton-regenerator-check', { eps: 0 }, { eta: 34.69714333392603 }, 1e-8],
  ['vapour-compression-cycle-check', {}, { COPR: 3.5, COPHP: 4.5, W: 20 / 7, mdot: 1 / 14, eta2: 3.5 / (263.15 / 50) * 100 }, 1e-9],
  ['vapour-compression-cycle-check', { mode: 'heat' }, { mdot: 10 / 180, W: 10 / 180 * 40, eta2: 71.85055085422321 }, 1e-9],
  ['surface-dew-point-check', {}, { Td: 16.701131854536442, w: 0.011896100440418013, h: 55.417230161480425, gap: 22 - 16.701131854536442 }, 1e-6],
  ['surface-dew-point-check', { T: 5, RH: 50, Ts: -10 }, { Td: -4.033231092521106 }, 1e-6],
  ['cooling-coil-dehumidification-check', {}, { Q: 37.21505750809022, mw: 0.0074675042911664935, SHR: 0.5048037978715498, w1: 0.016042321199132754, w2: 0.009464872956121062 }, 1e-9],
  ['combustion-air-flue-gas-check', {}, { AFRs: 4.76 * 2 * 28.97 / 16.043, AFR: 1.15 * 4.76 * 2 * 28.97 / 16.043, O2d: 0.3 / 9.948 * 100, CO2d: 1 / 9.948 * 100, Td: 56.54141862056926 }, 1e-6],
  ['combustion-air-flue-gas-check', { x: 3, y: 8, ex: 0 }, { AFRs: 15.63566682540762, O2d: 0 }, 1e-9],
  ['compressor-turbine-efficiency-check', {}, { eta: 83.80542697676256, W: 85.425, Ws: 71.59078599489943, Sgen: 0.03079443067913218 }, 1e-9],
  ['compressor-turbine-efficiency-check', { machine: 'turb', P1: 500, T1: 400, P2: 100, T2: 200 }, { eta: 80.60188220278407, W: 100.5 }, 1e-9],
];
for (const [id, over, expected, tol] of TH72_CASES) test(`thermodynamics check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thermodynamics checks agree with closed forms and energy balances', () => {
  const ot = engine.run('otto-diesel-cycle-check').values;
  near(ot.eta, ot.etaClosed, 1e-9, 'Otto efficiency from the energy balance equals 1 − r^(1−k)');
  const di = engine.run('otto-diesel-cycle-check', { cycle: 'diesel', r: 18, rc: 2 }).values;
  near(di.eta, di.etaClosed, 1e-9, 'Diesel efficiency from the energy balance equals the closed form');
  const vc = engine.run('vapour-compression-cycle-check').values;
  near(vc.COPHP, vc.COPR + 1, 1e-12, 'heat-pump COP is the refrigerator COP plus one');
  near(vc.QH, vc.QL + vc.W, 1e-12, 'heat rejected = heat absorbed + compressor power');
  const cc = engine.run('cooling-coil-dehumidification-check').values;
  near(cc.Q, cc.Qs + cc.Ql, 1e-12, 'sensible + latent = total');
  const dp = engine.run('surface-dew-point-check').values;
  near(engine.run('surface-dew-point-check', { T: dp.Td, RH: 100 }).values.Td, dp.Td, 1e-6, 'saturated air at the dew point has the same dew point');
  const comb = engine.run('combustion-air-flue-gas-check').values;
  near(comb.xCO2 + comb.xH2O + comb.xO2 + comb.xN2, 1, 1e-12, 'flue mole fractions sum to one');
  near(comb.mflue, 10 * (1 + comb.AFR), 1e-9, 'flue gas = fuel + air');
  const cp = engine.run('compressor-turbine-efficiency-check').values;
  near(engine.run('compressor-turbine-efficiency-check', { T2: cp.T2s - TH72 }).values.eta, 100, 1e-9, 'an isentropic outlet temperature gives 100 %');
  near(engine.run('compressor-turbine-efficiency-check', { T2: cp.T2s - TH72 }).values.ds, 0, 1e-12, 'and no entropy change');
});

test('thermodynamics checks: verdicts and guards', () => {
  assert.equal(engine.run('otto-diesel-cycle-check').text, 'PEAK PRESSURE WITHIN LIMIT');
  assert.equal(engine.run('otto-diesel-cycle-check', { Pmax: 9000 }).text, 'PEAK PRESSURE OVER LIMIT');
  assert.equal(engine.run('brayton-regenerator-check').text, 'NET POWER MEETS DEMAND');
  assert.equal(engine.run('brayton-regenerator-check', { Preq: 1500 }).text, 'NET POWER SHORT OF DEMAND');
  const hi = engine.run('brayton-regenerator-check', { rp: 30 });
  assert.ok(hi.checks.some((c: any) => c.label === 'Regenerator' && c.status === 'warn'), 'a regenerator that would cool the air is left out');
  near(hi.values.eta, hi.values.eta0, 1e-12, 'no regenerator gain when the exhaust is colder than the compressed air');
  assert.equal(engine.run('vapour-compression-cycle-check').text, 'COP MEETS TARGET');
  assert.equal(engine.run('vapour-compression-cycle-check', { COPreq: 4 }).text, 'COP BELOW TARGET');
  assert.equal(engine.run('vapour-compression-cycle-check', { Tc: 70 }).text, 'INPUTS EXCEED THE CARNOT LIMIT');
  assert.equal(engine.run('surface-dew-point-check').text, 'SURFACE STAYS DRY');
  assert.equal(engine.run('surface-dew-point-check', { Ts: 18 }).text, 'MARGIN TOO SMALL');
  assert.equal(engine.run('surface-dew-point-check', { Ts: 12 }).text, 'SURFACE WILL SWEAT');
  assert.equal(engine.run('surface-dew-point-check', { T: 5, RH: 50, Ts: -10 }).text, 'FROST WILL FORM');
  assert.equal(engine.run('cooling-coil-dehumidification-check').text, 'COIL CAN MEET THE LOAD');
  assert.equal(engine.run('cooling-coil-dehumidification-check', { Qcoil: 30 }).text, 'COIL UNDERSIZED');
  assert.equal(engine.run('combustion-air-flue-gas-check').text, 'FLUE ABOVE DEW POINT');
  assert.equal(engine.run('combustion-air-flue-gas-check', { Ts: 60 }).text, 'MARGIN TOO SMALL');
  assert.equal(engine.run('combustion-air-flue-gas-check', { Ts: 50 }).text, 'CONDENSATE WILL FORM');
  assert.equal(engine.run('compressor-turbine-efficiency-check').text, 'EFFICIENCY ACCEPTABLE');
  assert.equal(engine.run('compressor-turbine-efficiency-check', { etamin: 90 }).text, 'EFFICIENCY BELOW MINIMUM');
  assert.equal(engine.run('compressor-turbine-efficiency-check', { T2: 150 }).text, 'CHECK THE MEASUREMENTS');
  const cases: Array<[string, Inputs]> = [['otto-diesel-cycle-check', { r: 40 }], ['otto-diesel-cycle-check', { cycle: 'diesel', r: 5, rc: 6 }], ['otto-diesel-cycle-check', { cycle: 'stirling' }], ['brayton-regenerator-check', { T3: 200 }], ['brayton-regenerator-check', { etac: 0 }], ['vapour-compression-cycle-check', { h3: 400 }], ['vapour-compression-cycle-check', { h2s: 390 }], ['vapour-compression-cycle-check', { Tc: -20 }], ['surface-dew-point-check', { RH: 0 }], ['surface-dew-point-check', { T: -5 }], ['cooling-coil-dehumidification-check', { T2: 35 }], ['cooling-coil-dehumidification-check', { T2: 25, RH2: 100 }], ['combustion-air-flue-gas-check', { y: 0 }], ['combustion-air-flue-gas-check', { ex: -5 }], ['compressor-turbine-efficiency-check', { P2: 50 }], ['compressor-turbine-efficiency-check', { machine: 'turb' }], ['compressor-turbine-efficiency-check', { mdot: 'abc' }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// ---------------------------------------------------------------- Thermodynamics tool from Callen (batch callen)
// Expected values come from an independent hand calculation (kelvin = °C + 273.15), not from the tool.

test('callen liquid throttling: hand-calculated values', () => {
  const lt = engine.run('liquid-throttling-temperature-rise').values; // oil 870 kg/m³, β 700e-6/K, cp 1.9 kJ/(kg·K), 40 °C, 300 bar dropped
  near(lt.dT, 14.170508167, 1e-8, 'v (1 − T β) Δp ÷ cp (Callen eq. 6.41)');
  near(lt.dTsimple, 18.1488203267, 1e-9, 'v Δp ÷ cp ignoring expansion'); near(lt.work, 34.4827586207, 1e-9, 'v Δp in kJ/kg');
  near(lt.share, 21.9205, 1e-9, 'T β = 313.15 × 0.0007'); near(lt.Tout, 54.170508167, 1e-8, 'outlet temperature');
  near(engine.run('liquid-throttling-temperature-rise', { rho: 998.2, beta: 207, cp: 4.182, T: 20, dp: 10 }).values.dT, 0.225014770729, 1e-11, 'water: about 0.23 K per 10 bar');
  near(engine.run('liquid-throttling-temperature-rise', { beta: 0 }).values.dT, 300e5 / 870 / 1900, 1e-9, 'with no expansion the rise is Δp ÷ (ρ cp)');
});

test('callen liquid throttling: verdicts and guards', () => {
  assert.equal(engine.run('liquid-throttling-temperature-rise', { limit: 15 }).text, 'VALVE HEATING WITHIN LIMIT');
  assert.equal(engine.run('liquid-throttling-temperature-rise').text, 'VALVE HEATING ABOVE LIMIT');
  const cases: Array<[string, Inputs]> = [
    ['liquid-throttling-temperature-rise', { T: -300 }], ['liquid-throttling-temperature-rise', { rho: 0 }],
    ['liquid-throttling-temperature-rise', { dp: 0 }], ['liquid-throttling-temperature-rise', { cp: 100 }], ['liquid-throttling-temperature-rise', { beta: -1 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-fifth handbook pass (handbook71): classical thermodynamics checks after Guggenheim’s methods.
// Expected values are independent hand calculations (closed forms; the throttling case by fourth-order Runge–Kutta integration of dT/dp).
const HB71_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['trapped-liquid-pressure-check', {}, { rate: 3.2990933303428744, dp: 9.897279991028624, pf: 14.897279991028624, dTa: 3.3342494129612184, V: 43.295073757284335, relief: 0 }, 1e-9],
  ['trapped-liquid-pressure-check', { dT: 20 }, { pf: 70.9818666068575, relief: 123.38417805156563, sigma: 7.09818666068575 * 52.5 / (2 * 3.91) }, 1e-8],
  ['trapped-liquid-pressure-check', { wall: 'rigid' }, { rate: 207e-6 * 2200 * 10, pf: 5 + 3 * 4.554 }, 1e-9],
  ['ro-concentrate-pressure-check', {}, { cf: 35000 / 58.44, Pif: 27.317733180423303, Pic: 49.556851419576994, Pip: 0.13658866590211666, ndpIn: 32.318855485478814, ndpOut: 8.579737246325124, pmin: 54.420262753674876 }, 1e-8],
  ['ph-electrode-calibration-check', {}, { Sth: 59.159349684782335, S: 171 / 2.99, pct: 96.67218412006355, off: -3, pHz: 7 - 3 / (171 / 2.99), pHs: 6.07327485380117 }, 1e-9],
  ['ph-electrode-calibration-check', { Ts: 40 }, { Ss: 171 / 2.99 * 313.15 / 298.15, pHs: 6.115152660244469 }, 1e-9],
  ['clausius-boiling-margin-check', {}, { pv: 21.006285197667232, Tbo: 68.28950253936489, margin: 8.28950253936489 }, 1e-9],
  ['gas-throttling-temperature-check', {}, { mu1: 0.41779303722704747, Tinv: 1012.173590085374, T2: -13.048203651068434, T1r: 26.520077998604563, n: 11.747928716432623, heat: 4.831532868332002 }, 1e-6],
  ['gas-throttling-temperature-check', { model: 'mu' }, { T2: 15 - 0.45 * 63, T1r: 0.45 * 63 }, 1e-9],
  ['filter-bubble-point-check', {}, { pmt: 3.2, margin: 100 * (3.45 / 3.2 - 1), d: 4 * 0.072 / 345000 * 1e6, dmin: 4 * 0.072 / 320000 * 1e6 }, 1e-9],
  ['filter-bubble-point-check', { gt: 21.7 }, { pmt: 3.2 * 21.7 / 72 }, 1e-12],
  ['gas-separation-energy-check', {}, { xW: 69, rec: 100 * 0.99 / (3 * 0.79), W: 603.6601228909326, Emin: 0.007481199041202577, Wlim: 470.3422586911442, eff: 2.992479616481031, kWh: 100000, cost: 25000 }, 1e-8],
];
for (const [id, over, expected, tol] of HB71_CASES) test(`thermodynamics check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thermodynamics checks agree with their limiting cases', () => {
  const tl = engine.run('trapped-liquid-pressure-check').values;
  near(engine.run('trapped-liquid-pressure-check', { dT: tl.dTa }).values.pf, 16, 1e-9, 'the largest rise reaches the design pressure exactly');
  near(engine.run('trapped-liquid-pressure-check', { dT: 20, pd: 5 }).values.relief, tl.V * 1000 * (207e-6 - 36e-6) * 20, 1e-6, 'relief volume equals the free expansion when no rise is allowed');
  const ro = engine.run('ro-concentrate-pressure-check').values;
  near(engine.run('ro-concentrate-pressure-check', { pf: ro.pmin }).values.ndpOut, 3, 1e-9, 'the least feed pressure leaves exactly the required driving pressure');
  near(engine.run('ro-concentrate-pressure-check', { rej: 100 }).values.Pic, ro.Pif / 0.55, 1e-9, 'full rejection concentrates by 1 ÷ (1 − recovery)');
  near(engine.run('ph-electrode-calibration-check', { Tc: 0 }).values.Sth, Math.LN10 * 8.31446261815324 * 273.15 / 96485.33212331002 * 1000, 1e-9, 'ideal slope at 0 °C');
  near(engine.run('ph-electrode-calibration-check', { Es: 168 }).values.pHs, 4.01, 1e-12, 'a sample reading like the second buffer reads its pH');
  const vp = engine.run('clausius-boiling-margin-check').values;
  near(engine.run('clausius-boiling-margin-check', { pop: vp.pReq }).values.margin, 5, 1e-9, 'the pressure for the margin gives the margin');
  near(engine.run('clausius-boiling-margin-check', { Top: 100 }).values.pv, 101.325, 1e-9, 'the known point is reproduced');
  const jt = engine.run('gas-throttling-temperature-check', { p2: 69.999 }).values;
  near(jt.dT, -jt.mu1 * 0.001, 1e-8, 'a small drop cools by the coefficient times the drop');
  const h2 = engine.run('gas-throttling-temperature-check', { a: 0.02452, b: 26.61, Cp: 28.8, Tmin: 30 }).values; // a gas above its model inversion temperature (−51.5 °C)
  near(h2.T2, 16.35379173214119, 1e-6, 'it warms on throttling (hand RK4 integration)'); near(h2.T1r, 28.44608417914924, 1e-6, 'inlet temperature for the lowest outlet lies below it');
  near(engine.run('gas-separation-energy-check', { AF: 1000 }).values.W, 470.6363220564003, 1e-6, 'a very large feed ratio approaches the least work for the purity');
  near(engine.run('gas-separation-energy-check', { T: 40 }).values.W, 603.6601228909326 * 313.15 / 293.15, 1e-9, 'least work scales with absolute temperature');
});

test('thermodynamics checks: verdicts and guards', () => {
  assert.equal(engine.run('trapped-liquid-pressure-check').text, 'PRESSURE WITHIN DESIGN');
  assert.equal(engine.run('trapped-liquid-pressure-check', { dT: 20 }).text, 'THERMAL RELIEF NEEDED');
  assert.equal(engine.run('trapped-liquid-pressure-check', { wall: 'rigid' }).text, 'THERMAL RELIEF NEEDED');
  assert.equal(engine.run('ro-concentrate-pressure-check').text, 'FEED PRESSURE ADEQUATE');
  assert.equal(engine.run('ro-concentrate-pressure-check', { pf: 50 }).text, 'FEED PRESSURE TOO LOW');
  assert.equal(engine.run('ph-electrode-calibration-check').text, 'ELECTRODE IN LIMITS');
  for (const over of [{ E2: 150 }, { E1: -40, E2: 131 }, { E1: 168, E2: -3 }] as Inputs[]) assert.equal(engine.run('ph-electrode-calibration-check', over).text, 'ELECTRODE OUT OF LIMITS', JSON.stringify(over));
  assert.equal(engine.run('clausius-boiling-margin-check').text, 'NO BOILING EXPECTED');
  assert.equal(engine.run('clausius-boiling-margin-check', { pop: 25 }).text, 'BOILING MARGIN TOO SMALL');
  assert.equal(engine.run('clausius-boiling-margin-check', { pop: 20 }).text, 'LIQUID WILL BOIL OR FLASH');
  assert.equal(engine.run('clausius-boiling-margin-check', { goal: 'boil' }).text, 'BOILING NOT ASSURED');
  assert.equal(engine.run('clausius-boiling-margin-check', { goal: 'boil', pop: 15 }).text, 'BOILING ASSURED');
  assert.equal(engine.run('gas-throttling-temperature-check').text, 'PREHEAT NEEDED');
  assert.equal(engine.run('gas-throttling-temperature-check', { Tmin: -20 }).text, 'OUTLET TEMPERATURE ACCEPTABLE');
  assert.equal(engine.run('filter-bubble-point-check').text, 'INTEGRITY TEST PASSED');
  assert.equal(engine.run('filter-bubble-point-check', { pb: 3 }).text, 'INTEGRITY TEST FAILED');
  assert.equal(engine.run('gas-separation-energy-check').text, 'WITHIN TARGET ENERGY');
  assert.equal(engine.run('gas-separation-energy-check', { Eact: 0.35 }).text, 'ABOVE TARGET ENERGY');
  const cases: Array<[string, Inputs]> = [['trapped-liquid-pressure-check', { nu: 0.6 }], ['ro-concentrate-pressure-check', { rec: 99 }], ['ph-electrode-calibration-check', { pH2: 6.8 }], ['ph-electrode-calibration-check', { sMin: 105, sMax: 100 }], ['clausius-boiling-margin-check', { H: 1, pop: 200 }], ['gas-throttling-temperature-check', { p2: 80 }], ['gas-throttling-temperature-check', { model: 'mu', mu: 5, p1: 1000, p2: 1 }], ['filter-bubble-point-check', { k: 2 }], ['gas-separation-energy-check', { xP: 70 }], ['gas-separation-energy-check', { AF: 1.2 }], ['gas-separation-energy-check', { Eact: 0.001 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Batch handbook73: project, business, operations, maintenance, quality and machining tools. Expected values are independent
// hand calculations (closed forms, Simpson integration of the normal and chi-square densities, direct Poisson sums and a
// numerical integration of the parting time).
const PB_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['earned-value-check', {}, { CPI: 0.975, SPI: 0.975, EAC1: 512820.5128205128, EAC2: 520841.5516107824, VAC: -12820.512820512813, TCPI: 305000 / 300000, durF: 12 / 0.975 }, 1e-6],
  ['pert-schedule-check', {}, { T: 109 / 3, sd: 2.8771127502720115, P: 89.87437200004945, Tc: 39.315269053053534 }, 1e-6],
  ['early-payment-discount-check', {}, { nom: 37.24489795918367, eff: 44.585292731248515, save: 220 }, 1e-9],
  ['economic-production-quantity', {}, { Qs: 3394.1125496954282, Cs: 6363.961030678927, Cn: 6847.5, extra: 7.598081870552997, peak: 2545.584412271571 }, 1e-8],
  ['wip-lead-time-check', {}, { LT: 5, fe: 0.9375, wipLim: 720 }, 1e-12],
  ['critical-spares-poisson-plan', {}, { lam: 1.08, s: 3, cov: 97.57095636978082 }, 1e-9],
  ['critical-spares-poisson-plan', { held: 1 }, { cov: 70.63586933414734 }, 1e-9],
  ['capability-confidence-check', {}, { Cp: 0.1 / 0.048, Cpk: 0.046 / 0.024, chi: 33.93030561852787, cpL: 1.7336227932193007, cpkL: 1.5888986779221228 }, 1e-6],
  ['parting-off-plan', {}, { dlim: 15.915494309189535, F: 480, Pm: 1.5, Tq: 14.4, tsec: 15.131885335435372 }, 1e-6],
  ['parting-off-plan', { di: 20 }, { tsec: Math.PI * (900 - 100) / 12000 * 60 }, 1e-9],
];
for (const [id, over, expected, tol] of PB_CASES) test(`business and operations: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('business and operations tools: identities', () => {
  const epq = engine.run('economic-production-quantity').values;
  near(epq.Cs, Math.sqrt(2 * 24000 * 450 * 2.5 * 0.75), 1e-9, 'minimum cost in closed form');
  near(engine.run('economic-production-quantity', { Qnow: epq.Qs }).values.extra, 0, 1e-9, 'running at the optimum costs nothing extra');
  near(engine.run('pert-schedule-check', { dl: 109 / 3 }).values.P, 50, 1e-6, 'deadline at the expected duration is a coin toss');
  near(engine.run('wip-lead-time-check', { wip: 720 }).values.LT, 6, 1e-12, 'WIP limit gives the target lead time');
  const cc = engine.run('capability-confidence-check', { n: 100000 }).values;
  near(cc.cpkL, 0.046 / 0.024 - 1.6448536269514722 * Math.sqrt(1 / 900000 + (0.046 / 0.024) ** 2 / 199998), 1e-9, 'a very large sample has a bound close to the sample Cpk');
  near(engine.run('early-payment-discount-check', { d: 2, nd: 0, N: 365 }).values.eff, 2 / 98 * 100, 1e-9, 'one period a year: effective equals nominal');
});

test('business and operations tools: verdicts and guards', () => {
  assert.equal(engine.run('earned-value-check').text, 'PROJECT ON TRACK');
  assert.equal(engine.run('earned-value-check', { AC: 230000 }).text, 'RECOVERY NEEDED');
  assert.equal(engine.run('earned-value-check', { AC: 520000 }).text, 'RECOVERY NEEDED');
  assert.equal(engine.run('pert-schedule-check').text, 'DEADLINE ACHIEVABLE');
  assert.equal(engine.run('pert-schedule-check', { dl: 36 }).text, 'DEADLINE AT RISK');
  assert.equal(engine.run('early-payment-discount-check').text, 'TAKE THE DISCOUNT');
  assert.equal(engine.run('early-payment-discount-check', { i: 50 }).text, 'PAY ON NET TERMS');
  assert.equal(engine.run('economic-production-quantity').text, 'BATCH SIZE CLOSE TO OPTIMAL');
  assert.equal(engine.run('economic-production-quantity', { Qnow: 10000 }).text, 'BATCH SIZE COSTLY');
  assert.equal(engine.run('wip-lead-time-check').text, 'LEAD TIME WITHIN TARGET');
  assert.equal(engine.run('wip-lead-time-check', { target: 4 }).text, 'LEAD TIME TOO LONG');
  assert.equal(engine.run('critical-spares-poisson-plan').text, 'SPARES ENOUGH');
  assert.equal(engine.run('critical-spares-poisson-plan', { held: 1 }).text, 'SPARES SHORT');
  assert.equal(engine.run('capability-confidence-check').text, 'CAPABILITY PROVEN');
  assert.equal(engine.run('capability-confidence-check', { s: 0.0115 }).text, 'NOT YET PROVEN: MORE DATA NEEDED');
  assert.equal(engine.run('capability-confidence-check', { s: 0.013 }).text, 'NOT CAPABLE');
  assert.equal(engine.run('parting-off-plan').text, 'PARTING PLAN WORKS');
  for (const over of [{ Pav: 1 }, { tMax: 10 }] as Inputs[]) assert.equal(engine.run('parting-off-plan', over).text, 'PARTING PLAN NOT ADEQUATE', JSON.stringify(over));
  const cases: Array<[string, Inputs]> = [['earned-value-check', { EV: 600000 }], ['earned-value-check', { cpiMin: 3 }], ['pert-schedule-check', { m1: 20 }], ['pert-schedule-check', { conf: 100 }], ['early-payment-discount-check', { nd: 30 }], ['early-payment-discount-check', { d: 60 }], ['economic-production-quantity', { p: 90 }], ['economic-production-quantity', { wd: 0 }], ['wip-lead-time-check', { hpd: 30 }], ['critical-spares-poisson-plan', { Nu: 0 }], ['capability-confidence-check', { USL: 9.9 }], ['capability-confidence-check', { n: 4 }], ['parting-off-plan', { di: 70 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-fourth handbook pass (handbook74): forty-fourth round of integrated design checks.
// Expected values are independent hand calculations (cantilever and simply supported beam formulas, drilling power and torque).
const HB54_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['boring-bar-overhang-check', {}, { Fc: 300, Fr: 120, k: 12080.098704599422, err: 19.867387334229434, fn: 1808.9386398699503, Lmax: 100.22200318281597, fMax: 0.1510012338074928, errAlt: 6.953585566980302, LmaxAlt: 142.21336003085887 }, 1e-8],
  ['boring-bar-overhang-check', { L: 150 }, { err: 67.05243225302436, LD: 6 }, 1e-8],
  ['slender-work-turning-check', {}, { Fr: 240, delta: 0.03832443544411542, err: 76.64887088823085, Lmax: 292.59382452426576, rests: 1, fMax: 0.07827903960580426 }, 1e-8],
  ['slender-work-turning-check', { hold: 'chuck' }, { delta: 0.6131909671058468, err: 1226.3819342116935, Lmax: 116.11593621230456, rests: 0 }, 1e-8],
  ['reaming-plan', {}, { Dd: 9.75, stock: 0.125, nD: 816.179195343053, nR: 318.3098861837907, tD: 0.20362518149609066, tR: 0.34557519189487723, perHole: 0.6492003733909678, total: 32.46001866954839, perReamer: 1500, reamers: 1 }, 1e-9],
  ['reaming-plan', { retract: 'rapid' }, { perHole: 0.4764127774435293 }, 1e-9],
  ['dowel-pin-joint-check', {}, { tau: 59.683103659460755, sb: 31.25, iMax: 15, iMin: -9, e1: 1.5, e2: 2 }, 1e-9],
  ['taper-shank-holding-check', {}, { n: 397.88735772973837, Pc: 1.0416666666666667, Tq: 25, thrust: 2142.9182517552804, Dm: 22.125, Nn: 17148.70247285567, Th: 18.97075211059659, ratio: 0.7588300844238635 }, 1e-8],
];
for (const [id, over, expected, tol] of HB54_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-fourth-round design checks agree with the tools they chain', () => {
  const bb = engine.run('boring-bar-overhang-check').values;
  near(bb.dr, engine.run('boring-bar-deflection', { D: 25, L: 100, E: 210, F: bb.Fr, allow: 1 }).values.defl, 1e-12, 'radial deflection as the boring bar deflection tool');
  const sw = engine.run('slender-work-turning-check').values, I = Math.PI * 30 ** 4 / 64;
  near(sw.delta, engine.run('beam-deflection', { case: 'simple-point', load: sw.Fr, length: 400, modulus: 210000, inertia: I }).values.deflection, 1e-12, 'mid-span deflection as the beam tool');
  near(engine.run('slender-work-turning-check', { hold: 'chuck' }).values.delta, engine.run('beam-deflection', { case: 'cantilever-point', load: sw.Fr, length: 400, modulus: 210000, inertia: I }).values.deflection, 1e-12, 'free-end deflection as the beam tool');
  const dw = engine.run('dowel-pin-joint-check').values, bs = engine.run('bolt-shear-bearing', { F: 6000, n: 2, planes: '1', d: 8, t: 12, tauAllow: 150, bAllow: 120 }).values;
  near(dw.tau, bs.tau, 1e-12, 'pin shear as the shear and bearing tool'); near(dw.sb, bs.sb, 1e-12, 'bearing as the shear and bearing tool');
  const tp = engine.run('taper-shank-holding-check').values, dc = engine.run('drilling-cycle-planner', { D: 20, vc: 25, f: 0.25, kc: 2000, point: 118 }).values;
  near(tp.Tq, dc.Tq, 1e-12, 'drilling torque as the drilling cycle planner'); near(tp.thrust, dc.thrust, 1e-9, 'thrust as the drilling cycle planner');
  const rp = engine.run('reaming-plan').values, dp = engine.run('drilling-cycle-planner', { D: 9.75, vc: 25, f: 0.15, point: 118, depth: 20, clear: 2, peck: 0, pos: 0, holes: 1 }).values;
  near(rp.tD, dp.perHole, 1e-12, 'pilot drilling time as the drilling cycle planner');
});

test('forty-fourth-round design checks give pass and fail verdicts', () => {
  assert.equal(engine.run('boring-bar-overhang-check').text, 'OVERHANG ACCEPTABLE');
  assert.equal(engine.run('boring-bar-overhang-check', { L: 150 }).text, 'DEFLECTION TOO HIGH');
  assert.equal(engine.run('boring-bar-overhang-check', { L: 125, allow: 100 }).text, 'OVERHANG RATIO TOO HIGH');
  assert.equal(engine.run('slender-work-turning-check').text, 'SUPPORT OR LIGHTER CUT NEEDED');
  assert.equal(engine.run('slender-work-turning-check', { L: 250 }).text, 'WORK STIFF ENOUGH');
  assert.equal(engine.run('reaming-plan').text, 'REAMING PLAN FEASIBLE');
  assert.equal(engine.run('reaming-plan', { allow: 0.6 }).text, 'STOCK OUTSIDE RANGE');
  assert.equal(engine.run('reaming-plan', { Df: 2, allow: 0.2, nMax: 2000 }).text, 'SPINDLE SPEED TOO HIGH');
  assert.equal(engine.run('dowel-pin-joint-check').text, 'DOWELS ADEQUATE');
  assert.equal(engine.run('dowel-pin-joint-check', { F: 20000 }).text, 'PIN SHEAR TOO HIGH');
  assert.equal(engine.run('dowel-pin-joint-check', { t1: 8 }).text, 'ENGAGEMENT TOO SHORT');
  assert.equal(engine.run('taper-shank-holding-check').text, 'TANG OR DRAWBAR NEEDED');
  assert.equal(engine.run('taper-shank-holding-check', { mu: 0.2, SF: 0.5 }).text, 'TAPER HOLDS THE DRILL');
  assert.ok(engine.run('taper-shank-holding-check', { c: 0.2917 }).checks.some((c: any) => c.label === 'Self-holding' && c.status === 'warn'), 'a steep taper is self-releasing');
  const cases: Array<[string, Inputs]> = [
    ['reaming-plan', { allow: 10 }], ['reaming-plan', { sMin: 0.3, sMax: 0.2 }], ['reaming-plan', { lifeM: 0.01 }],
    ['dowel-pin-joint-check', { pinLo: 20 }], ['dowel-pin-joint-check', { holeLo: 20 }],
    ['taper-shank-holding-check', { Le: 1000 }], ['slender-work-turning-check', { rr: 0 }], ['boring-bar-overhang-check', { rr: 0 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Engineering thermodynamics, second Çengel batch (cengel2): steam cycle, steam dryness, CHP and air processes.
// Expected values are independent hand calculations: closed forms, and Hyland–Wexler states with a secant wet-bulb solution.
const CG2_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['rankine-cycle-check', {}, { eta: 29.069619249225802, mdot: 5.888954275526295, HR: 12384.06313180685, x4: 0.8660549308139293, Qb: 17200.08768306507, wp: 0.00101 * 2990 / 0.85 }, 1e-8],
  ['steam-dryness-throttling-check', {}, { x: (2776.6 - 762.51) / 2014.6, sup: 50.39 }, 1e-9],
  ['steam-dryness-throttling-check', { h2: 2700 }, { x: 0.9617244117939046 }, 1e-12],
  ['cogeneration-saving-check', {}, { u: 80, Fsep: 900 / 0.4 + 1100 / 0.85, PES: 29.460580912863065, PHR: 900 / 1100 }, 1e-9],
  ['cogeneration-saving-check', { Qh: 0 }, { PES: -100 / 9, PHR: 0 }, 1e-9],
  ['air-stream-mixing-check', {}, { T3: 17.56067018944977, RH3: 57.732898813536316, w3: 0.0071984915235847454, share: 26.249035534777327 }, 1e-8],
  ['air-stream-mixing-check', { T1: 0, RH1: 100, V1: 1, T2: 30, RH2: 95, V2: 1 }, { T3: 14.251004361637719, RH3: 137.4475155415736 }, 1e-8],
  ['evaporative-cooler-check', {}, { Twb: 20.761082968498428, T2: 24.208866374798742, w2: 0.013972250576503862, mw: 69.20846565707711 / 3600, Qs: 47.257439930669854 }, 1e-6],
  ['heating-humidification-check', {}, { Q: 20.805942563464097, Mh: 23.87446944060214, w1: 0.002149764974893166, w3: 0.007392694301167118 }, 1e-8],
  ['heating-humidification-check', { kind: 'spray', hw: 62.7 }, { Q: 38.13018604115437 }, 1e-8],
];
for (const [id, over, expected, tol] of CG2_CASES) test(`thermodynamics (cengel2): ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('thermodynamics (cengel2): balances and limiting cases', () => {
  const rk = engine.run('rankine-cycle-check').values;
  near(rk.qin, rk.wnet + rk.qout, 1e-9, 'heat added = net work + heat rejected');
  near(engine.run('rankine-cycle-check', { etat: 100, etap: 100 }).values.wt, 3116.1 - 2136.1, 1e-9, 'ideal turbine work is the isentropic drop');
  const ev = engine.run('evaporative-cooler-check', { eps: 100 }).values;
  near(ev.T2, ev.Twb, 1e-12, 'a perfect cooler reaches the wet-bulb');
  near(ev.RH2, 100, 1e-6, 'and leaves the air saturated');
  const mx = engine.run('air-stream-mixing-check', { V1: 0 }).values;
  near(mx.T3, 22, 1e-9, 'one stream alone keeps its temperature');
  near(mx.RH3, 50, 1e-9, 'and its humidity');
  near(engine.run('heating-humidification-check', { kind: 'spray', hw: 62.7 }).values.Mh, 23.87446944060214, 1e-8, 'water added is unchanged by the humidifier type');
  near(engine.run('cogeneration-saving-check', { etaE: 80, etaH: 80 }).values.PES, 0, 1e-9, 'separate production as efficient as the CHP utilisation factor gives no saving');
});

test('thermodynamics (cengel2): verdicts and guards', () => {
  assert.equal(engine.run('rankine-cycle-check').text, 'EXHAUST DRY ENOUGH');
  assert.equal(engine.run('rankine-cycle-check', { xmin: 0.9 }).text, 'EXHAUST TOO WET');
  assert.equal(engine.run('steam-dryness-throttling-check').text, 'STEAM DRY ENOUGH');
  assert.equal(engine.run('steam-dryness-throttling-check', { h2: 2700 }).text, 'STEAM TOO WET');
  assert.equal(engine.run('steam-dryness-throttling-check', { T2: 102 }).text, 'READING NOT VALID');
  assert.equal(engine.run('cogeneration-saving-check').text, 'CHP SAVES PRIMARY ENERGY');
  assert.equal(engine.run('cogeneration-saving-check', { pesReq: 30 }).text, 'SAVING BELOW TARGET');
  assert.ok(engine.run('cogeneration-saving-check', { Qf: 1500 }).checks.some((c: any) => c.label === 'Energy balance' && c.status === 'warn'), 'outputs above the fuel input are flagged');
  assert.equal(engine.run('air-stream-mixing-check').text, 'MIXED AIR CLEAR');
  assert.equal(engine.run('air-stream-mixing-check', { rhMax: 50 }).text, 'MIXED AIR NEAR SATURATION');
  assert.equal(engine.run('air-stream-mixing-check', { T1: 0, RH1: 100, V1: 1, T2: 30, RH2: 95, V2: 1 }).text, 'FOG FORMS');
  assert.equal(engine.run('evaporative-cooler-check').text, 'COOLER REACHES TARGET');
  assert.equal(engine.run('evaporative-cooler-check', { Treq: 22 }).text, 'COOLER CANNOT REACH TARGET');
  assert.ok(engine.run('evaporative-cooler-check', { Treq: 20 }).checks.some((c: any) => c.label === 'Target against the wet-bulb' && c.status === 'fail'), 'a target below the wet-bulb is unreachable');
  assert.equal(engine.run('heating-humidification-check').text, 'EQUIPMENT MEETS THE DUTY');
  assert.equal(engine.run('heating-humidification-check', { Qcap: 20 }).text, 'HEATER UNDERSIZED');
  assert.equal(engine.run('heating-humidification-check', { Mcap: 20 }).text, 'HUMIDIFIER UNDERSIZED');
  assert.equal(engine.run('heating-humidification-check', { Qcap: 20, Mcap: 20 }).text, 'HEATER AND HUMIDIFIER UNDERSIZED');
  assert.ok(engine.run('heating-humidification-check', { kind: 'spray' }).checks.some((c: any) => c.label === 'Humidifier enthalpy' && c.status === 'warn'), 'steam enthalpy with a spray humidifier is flagged');
  const cases: Array<[string, Inputs]> = [['rankine-cycle-check', { Pb: 5 }], ['rankine-cycle-check', { h4s: 3200 }], ['rankine-cycle-check', { h4s: 150 }], ['rankine-cycle-check', { etat: 10 }], ['steam-dryness-throttling-check', { P2: 1000 }], ['steam-dryness-throttling-check', { T2: 90 }], ['cogeneration-saving-check', { We: 0, Qh: 0 }], ['cogeneration-saving-check', { etaE: 0 }], ['air-stream-mixing-check', { V1: 0, V2: 0 }], ['air-stream-mixing-check', { T1: -5 }], ['evaporative-cooler-check', { T1: 2, RH1: 5 }], ['evaporative-cooler-check', { eps: 0 }], ['heating-humidification-check', { T3: 4 }], ['heating-humidification-check', { RH3: 10 }], ['heating-humidification-check', { kind: 'mist' }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-fifth handbook pass (handbook75): forty-fifth round of integrated design checks.
// Expected values are independent hand calculations (unit power, annulus and core volumes, clearance geometry, key stresses, hook equilibrium).
const HB55_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['trepanning-plan', {}, { n: 424.4131815783876, vm: 72, Pc: 1.728, Pm: 2.16, Tq: 38.88, t: 3.0041479749952393, Dc: 48, Vr: 152681.40296446395, core: 2.1307538013707417, value: 3.1961307020561125, PcS: 10, PmS: 12.5, tS: 1.6118803655888712 }, 1e-8],
  ['grinding-wheel-cost-plan', {}, { Vw: 2349.125906721756, wear: 117.4562953360878, dress: 87.96459430051421, usable: 2199114.857512855, parts: 10705.41005543876, wheelPP: 0.04203482142857131, tg: 35.36407383402195, cpp: 1.2208372825626364 }, 1e-7],
  ['drill-bushing-position-check', {}, { c: 0.024, tilt: 0.003, e: 0.042, err: 0.084, gr: 0.75 }, 1e-12],
  ['woodruff-key-check', {}, { F: 4800, tau: 32, sh: 76.8, ss: 25.6, Ls: 13.333333333333334, Lb: 19.2, tauShaft: 39.1139188142642 }, 1e-9],
  ['eyebolt-lift-check', {}, { T1: 517.6380902050414, T2: 732.0508075688772, V1: 366.0254037844386, V2: 633.9745962155613, H: 366.02540378443854, naive: 500 }, 1e-9],
  ['eyebolt-lift-check', { a1: 60, a2: 10 }, { T1: 184.79253090409537, T2: 921.6049851068763 }, 1e-9],
];
for (const [id, over, expected, tol] of HB55_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-fifth-round design checks agree with the tools they chain', () => {
  const tp = engine.run('trepanning-plan').values, dc = engine.run('drilling-cycle-planner', { D: 60, vc: 80, f: 0.25, kc: 2000, point: 118, eta: 80, depth: 150, clear: 3, peck: 0, pos: 0, holes: 1 }).values;
  near(tp.PmS, dc.Pm, 1e-12, 'solid drill power as the drilling cycle planner'); near(tp.tS, dc.perHole, 1e-12, 'solid drill time as the drilling cycle planner');
  const gw = engine.run('grinding-wheel-cost-plan').values;
  near(engine.run('grinding-geometry', { Vw: gw.Vw, Vs: gw.wear }).values.G, 20, 1e-9, 'grinding ratio as the grinding geometry tool');
  const wk = engine.run('woodruff-key-check').values, ks = engine.run('key-stress', { T: 60, d: 25, w: 6, h: 5, L: 25, tauA: 60, sigA: 100 }).values;
  near(wk.tau, ks.tau, 1e-12, 'key shear as the parallel key tool'); near(wk.sh, ks.sigma, 1e-12, 'hub bearing as the parallel key tool with h ÷ 2 equal to the height in the hub');
  const ey = engine.run('eyebolt-lift-check', { a1: 30, a2: 30 }).values, sl = engine.run('sling-tension', { mass: 1000, legs: 2, angle: 30, wll: 1500 }).values;
  near(ey.T1, sl.kg, 1e-9, 'equal legs as the sling tension tool'); near(ey.T2, sl.kg, 1e-9, 'equal legs as the sling tension tool');
});

test('forty-fifth-round design checks give pass and fail verdicts', () => {
  assert.equal(engine.run('trepanning-plan').text, 'TREPANNING FEASIBLE');
  assert.equal(engine.run('trepanning-plan', { Pav: 2 }).text, 'NOT ENOUGH SPINDLE POWER');
  assert.equal(engine.run('grinding-wheel-cost-plan').text, 'WITHIN TARGET COST');
  assert.equal(engine.run('grinding-wheel-cost-plan', { target: 1 }).text, 'ABOVE TARGET COST');
  assert.ok(engine.run('grinding-wheel-cost-plan', { pd: 2 }).checks.some((c: any) => c.label === 'Dressing share' && c.status === 'warn'), 'frequent dressing is flagged');
  assert.equal(engine.run('drill-bushing-position-check').text, 'BUSHING HOLDS POSITION');
  assert.equal(engine.run('drill-bushing-position-check', { g: 12 }).text, 'POSITION ERROR TOO LARGE');
  assert.equal(engine.run('drill-bushing-position-check', { g: 2 }).text, 'CHIP GAP OUTSIDE RANGE');
  assert.equal(engine.run('woodruff-key-check').text, 'KEY AND SHAFT ADEQUATE');
  assert.equal(engine.run('woodruff-key-check', { T: 90 }).text, 'BEARING TOO HIGH');
  assert.equal(engine.run('woodruff-key-check', { T: 90, sigA: 300, tauA: 300, tauS: 50 }).text, 'SHAFT OVERSTRESSED');
  assert.equal(engine.run('eyebolt-lift-check').text, 'EYEBOLTS ADEQUATE');
  assert.equal(engine.run('eyebolt-lift-check', { a1: 60, a2: 10 }).text, 'EYEBOLT OVERLOADED AT ITS ANGLE');
  assert.equal(engine.run('eyebolt-lift-check', { Le: 20 }).text, 'THREAD ENGAGEMENT TOO SHORT');
  const cases: Array<[string, Inputs]> = [
    ['trepanning-plan', { w: 30 }], ['grinding-wheel-cost-plan', { Dmin: 400 }], ['grinding-wheel-cost-plan', { s: 50 }],
    ['drill-bushing-position-check', { bushUp: -40 }], ['drill-bushing-position-check', { gMin: 2, gMax: 1 }],
    ['woodruff-key-check', { t1: 10 }], ['woodruff-key-check', { d: 12, t1: 7 }], ['eyebolt-lift-check', { a1: 0, a2: 0 }], ['eyebolt-lift-check', { s1: 0 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// ---------------------------------------------------------------- Thermodynamics topic tools (greiner)
// Greiner, Neise and Stöcker, Thermodynamics and Statistical Mechanics: expected values are independent hand calculations.

const RGAS = 8.314462618;
/** Largest real root of z³ + a2 z² + a1 z + a0 = 0 by Cardano (independent of the tools' Newton iteration). */
const largestRoot = (a2: number, a1: number, a0: number) => {
  const Q = (3 * a1 - a2 * a2) / 9, Rr = (9 * a2 * a1 - 27 * a0 - 2 * a2 ** 3) / 54, D = Q ** 3 + Rr ** 2;
  if (D >= 0) return Math.cbrt(Rr + Math.sqrt(D)) + Math.cbrt(Rr - Math.sqrt(D)) - a2 / 3;
  const th = Math.acos(Rr / Math.sqrt(-(Q ** 3)));
  return Math.max(...[0, 1, 2].map((k) => 2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI * k) / 3) - a2 / 3));
};
const zVdw = (p: number, T: number, Tc: number, pc: number) => {
  const a = 27 * RGAS ** 2 * Tc ** 2 / (64 * pc), b = RGAS * Tc / (8 * pc), A = a * p / (RGAS * T) ** 2, B = b * p / (RGAS * T);
  return largestRoot(-(1 + B), A, -A * B);
};
const zPr = (p: number, T: number, Tc: number, pc: number, w: number) => {
  const k = 0.37464 + 1.54226 * w - 0.26992 * w * w, a = 0.45724 * RGAS ** 2 * Tc ** 2 / pc * (1 + k * (1 - Math.sqrt(T / Tc))) ** 2, b = 0.0778 * RGAS * Tc / pc;
  const A = a * p / (RGAS * T) ** 2, B = b * p / (RGAS * T);
  return largestRoot(-(1 - B), A - 3 * B * B - 2 * B, -(A * B - B * B - B ** 3));
};

test('thermodynamics tools match independent hand calculations', () => {
  // Blocked-in water in DN50 steel pipe, anchored: (210 − 36)×10⁻⁶ ÷ (1/2200 + 0.91 × 52.5 ÷ (200000 × 3.91)) MPa/K
  const bl = engine.run('blocked-in-liquid-pressure-check').values;
  near(bl.rate, 3.3744551, 1e-6, 'pressure rise per kelvin, bar/K'); near(bl.pF, 38.744551, 1e-5, 'final pressure'); near(bl.dTa, 3.2597855, 1e-6, 'warming to the limit'); near(bl.hoop, 26.011367, 1e-5, 'hoop stress');
  near(engine.run('blocked-in-liquid-pressure-check', { wall: 'rigid' }).values.rate, 174e-6 * 2200 * 10, 1e-9, 'rigid container: (β − 3αₛ) K');
  near(engine.run('blocked-in-liquid-pressure-check', { wall: 'joint' }).values.rate, 174e-6 / (1 / 2200 + 0.85 * 52.5 / (200000 * 3.91)) * 10, 1e-9, 'expansion joints: c₁ = 1 − ν/2');
  near(engine.run('blocked-in-liquid-pressure-check', { wall: 'free' }).values.rate, 174e-6 / (1 / 2200 + 0.95 * 52.5 / (200000 * 3.91)) * 10, 1e-9, 'closed ends free: c₁ = 5/4 − ν');
  // Nitrogen in a 50 L cylinder at 200 bar g and 20 °C, Peng–Robinson and van der Waals against Cardano roots
  const T = 293.15, pF = 200e5 + 101325, pM = 10e5 + 101325, zf = zPr(pF, T, 126.2, 33.98e5, 0.037), zm = zPr(pM, T, 126.2, 33.98e5, 0.037);
  const gc = engine.run('gas-cylinder-real-gas-duration').values, nUse = pF * 0.05 / (zf * RGAS * T) - pM * 0.05 / (zm * RGAS * T);
  near(gc.zF, zf, 1e-9, 'Peng–Robinson Z at 200 bar g'); near(gc.zF, 1.0228, 5e-4, 'nitrogen Z by Peng–Robinson');
  near(gc.mass, pF * 0.05 / (zf * RGAS * T) * 28.014 / 1000, 1e-9, 'contents now'); near(gc.massId, pF * 0.05 / (RGAS * T) * 28.014 / 1000, 1e-9, 'ideal contents');
  near(gc.Vstd, nUse * RGAS * 288.15 / 101325 * 1000, 1e-6, 'usable standard litres at 15 °C'); near(gc.hours, nUse * RGAS * 288.15 / 101325 * 1000 / 15 / 60, 1e-9, 'running time');
  near(engine.run('gas-cylinder-real-gas-duration', { eos: 'vdw' }).values.zF, zVdw(pF, T, 126.2, 33.98e5), 1e-9, 'van der Waals Z');
  near(engine.run('gas-cylinder-real-gas-duration', { pFull: 1, pMin: 0 }).values.zF, 1, 2e-3, 'near-ideal at low pressure');
  // Water: 100 °C at 101.325 kPa, 2257 kJ/kg, 18.015 g/mol → boils at 58.89 °C at 20 kPa abs (steam tables 60.06 °C)
  const bp = engine.run('boiling-point-at-pressure').values;
  near(bp.TbC, 58.889457, 1e-5, 'boiling point at 20 kPa'); near(bp.pv, 13.337571, 1e-5, 'vapour pressure at 50 °C'); near(bp.mg, 8.889457, 1e-5, 'margin');
  near(engine.run('boiling-point-at-pressure', { p: 101.325 }).values.TbC, 100, 1e-9, 'reference point returned');
  // Heat pump 12 kW from 3.5 kW between 7 °C and 55 °C: COP 3.4286 against 328.15 ÷ 48 = 6.8365
  const cl = engine.run('carnot-limit-check').values;
  near(cl.lim, 328.15 / 48, 1e-9, 'Carnot heating COP'); near(cl.eta2, 50.151281, 1e-5, 'second-law efficiency'); near(cl.cost, 2100, 1e-9, 'yearly cost'); near(cl.save, 5100, 1e-9, 'saving over resistance heating');
  near(engine.run('carnot-limit-check', { mode: 'ch' }).values.lim, 280.15 / 48, 1e-9, 'Carnot cooling COP');
  near(engine.run('carnot-limit-check', { mode: 'en', Th: 500, Tc: 30, out: 30, inp: 100 }).values.eta2, 0.3 / (1 - 303.15 / 773.15) * 100, 1e-9, 'engine second-law efficiency');
  // 500 L receiver at 10 bar g: pV ln(p/p0) − (p − p0)V, isentropic and Brode energies
  const se = engine.run('compressed-gas-stored-energy').values;
  near(se.Xkj, 813.84554, 1e-4, 'exergy'); near(se.Eskj, 680.40067, 1e-4, 'isentropic energy'); near(se.Ebkj, 1250, 1e-9, 'Brode energy'); near(se.share, 42.288666, 1e-5, 'share kept'); near(se.pV, 500, 1e-9, 'pV product');
  // Nitrogen generator, 1 % O₂ product at air factor 3 from 20.95 % O₂ air, 20 °C
  const gs = engine.run('gas-generator-energy-check').values;
  near(gs.xW, 0.30925, 1e-12, 'waste oxygen'); near(gs.Wmin, 0.0074574312, 1e-9, 'minimum work, kWh/m³'); near(gs.eta2, 2.4858104, 1e-6, 'second-law efficiency'); near(gs.cost, 15000, 1e-9, 'yearly cost');
  near(gs.WminInf, 468.87362 * 101325 / (RGAS * 273.15) / 3.6e6, 1e-9, 'complete-recovery minimum');
  // Pure oxygen, complete recovery: RT ln(1 ÷ 0.2095) per mole, as in Industrial Gases by the Numbers
  near(engine.run('gas-generator-energy-check', { xP: 99.999, AF: 1000, T: 15, Tref: 15 }).values.WminInf, RGAS * 288.15 * Math.log(1 / 0.2095) * 101325 / (RGAS * 288.15) / 3.6e6, 2e-5, 'oxygen minimum');
  near(engine.run('gas-generator-energy-check', { xP: 93, AF: 6 }).values.rec, 0.93 / (6 * 0.2095) * 100, 1e-9, 'oxygen recovery');
  // Quench: 150 kg at 600 J/kg·K from 850 °C into 3000 L of oil (870 kg/m³, 2000 J/kg·K) at 60 °C
  const qt = engine.run('quench-tank-temperature-check').values;
  near(qt.Tf, 73.389831, 1e-5, 'mixture temperature'); near(qt.QMJ, 69.894915, 1e-5, 'heat per load'); near(qt.P, 38.830508, 1e-5, 'average heat input'); near(qt.dS, 99.863175, 1e-5, 'entropy generated, kJ/K'); assert.equal(qt.n, 1);
});

test('thermodynamics tools: verdicts and guards', () => {
  assert.equal(engine.run('blocked-in-liquid-pressure-check').text, 'EXCEEDS THE LIMIT: PROVIDE THERMAL RELIEF');
  assert.equal(engine.run('blocked-in-liquid-pressure-check', { dT: 2 }).text, 'WITHIN THE LIMIT');
  assert.equal(engine.run('gas-cylinder-real-gas-duration').text, 'LASTS THE REQUIRED TIME');
  assert.equal(engine.run('gas-cylinder-real-gas-duration', { need: 12 }).text, 'RUNS OUT TOO SOON');
  assert.equal(engine.run('boiling-point-at-pressure').text, 'BELOW BOILING WITH MARGIN');
  assert.equal(engine.run('boiling-point-at-pressure', { Tl: 56 }).text, 'MARGIN TOO SMALL');
  assert.equal(engine.run('boiling-point-at-pressure', { Tl: 65 }).text, 'LIQUID WILL BOIL OR FLASH');
  assert.equal(engine.run('carnot-limit-check').text, 'WITHIN THE LIMIT AND ACCEPTABLE');
  assert.equal(engine.run('carnot-limit-check', { out: 30 }).text, 'CLAIM EXCEEDS THE CARNOT LIMIT');
  assert.equal(engine.run('carnot-limit-check', { etaMin: 60 }).text, 'BELOW YOUR ACCEPTANCE LEVEL');
  assert.equal(engine.run('compressed-gas-stored-energy').text, 'WITHIN YOUR pV LIMIT');
  assert.equal(engine.run('compressed-gas-stored-energy', { pVlim: 400 }).text, 'ABOVE YOUR pV LIMIT');
  assert.equal(engine.run('gas-generator-energy-check').text, 'ABOVE THE THERMODYNAMIC MINIMUM');
  assert.equal(engine.run('gas-generator-energy-check', { SE: 0.005 }).text, 'BELOW THE THERMODYNAMIC MINIMUM: CLAIM NOT POSSIBLE');
  assert.equal(engine.run('quench-tank-temperature-check').text, 'BATH STAYS WITHIN ITS LIMIT');
  assert.equal(engine.run('quench-tank-temperature-check', { cool: 30 }).text, 'COOLER TOO SMALL FOR THE LOAD RATE');
  assert.equal(engine.run('quench-tank-temperature-check', { Vq: 500 }).text, 'ONE LOAD OVERHEATS THE BATH');
  const cases: Array<[string, Inputs]> = [['blocked-in-liquid-pressure-check', { p0: 20 }], ['blocked-in-liquid-pressure-check', { nu: 0.6 }], ['blocked-in-liquid-pressure-check', { beta: 30 }], ['gas-cylinder-real-gas-duration', { Tc: 300 }], ['gas-cylinder-real-gas-duration', { pMin: 250 }], ['gas-cylinder-real-gas-duration', { pFull: 2000 }], ['boiling-point-at-pressure', { p: 1e6 }], ['boiling-point-at-pressure', { p0: 0.001, p: 1000 }], ['carnot-limit-check', { Tc: 60 }], ['carnot-limit-check', { mode: 'en' }], ['carnot-limit-check', { Tc: -300 }], ['compressed-gas-stored-energy', { k: 2 }], ['gas-generator-energy-check', { AF: 1.1 }], ['gas-generator-energy-check', { xP: 20.95 }], ['quench-tank-temperature-check', { Tmax: 50 }], ['quench-tank-temperature-check', { Tl: 40 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-seventh handbook pass (handbook77): forty-sixth round of integrated design checks.
// Expected values are independent hand calculations (two-plane reactions, rating life, parabolic case growth, reference depth).
const HB57_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['countershaft-bearing-check', {}, { Ft1: 1500, Ft2: 3750, PA: 2063.6287337392832, PB: 3308.661371420991, LA: 102411.28383121315, LB: 24847.662881538523, s0A: 7.753332631208373, s0B: 4.835792546859633, Mmax: 165.43306857104957, vm: 49.97108141964413 }, 1e-6],
  ['carburizing-case-depth-plan', {}, { removed: 0.15, before: 0.95, total: 1.3571428571428574, t: 5.11621315192744, cycle: 8.11621315192744, cpp: 5.748984315948603, share: 0.22619047619047625, t10: 6.190617913832204 }, 1e-9],
  ['induction-hardening-plan', {}, { delta: 5.278654932840373, ratio: 2.6393274664201867, fT: 30.96021988888889, Dd: 7.577687973340689, mass: 0.27374267587054657, E: 144.5361328596486, Pw: 36.13403321491215, Pg: 51.620047449874505, dens: 0.2875455 }, 1e-6],
  ['induction-hardening-plan', { f: 30 }, { delta: 3.047632846434535, ratio: 1.5238164232172675 }, 1e-9],
];
for (const [id, over, expected, tol] of HB57_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-sixth-round design checks agree with the tools they chain', () => {
  const cs = engine.run('countershaft-bearing-check').values, kW = 150 * 500 / 9549.2966;
  near(cs.Ft1, engine.run('gear-forces', { kW, rpm: 500, d: 200, alphan: 20, beta: 0 }).values.Ft, 1e-6, 'driven gear force as the gear forces tool');
  near(cs.Fr2, engine.run('gear-forces', { kW, rpm: 500, d: 80, alphan: 20, beta: 0 }).values.Fr, 1e-6, 'driving gear radial force as the gear forces tool');
  near(cs.LB, engine.run('bearing-l10-life', { type: 'ball', C: 30, P: cs.PB / 1000, rpm: 500 }).values.hours, 1e-6, 'life as the bearing L10 tool');
  near(cs.s0B, engine.run('bearing-static-ratio', { C0: 16, P0: cs.PB / 1000 }).values.s0, 1e-12, 'static factor as the bearing static ratio tool');
  const same = engine.run('countershaft-bearing-check', { th2: 0 }).values;
  assert.ok(same.PB < cs.PB, 'meshes on the same side partly cancel at bearing B');
});

test('forty-sixth-round design checks give pass and fail verdicts', () => {
  assert.equal(engine.run('countershaft-bearing-check').text, 'SHAFT AND BEARINGS ADEQUATE');
  assert.equal(engine.run('countershaft-bearing-check', { C: 20 }).text, 'BEARING LIFE TOO SHORT');
  assert.equal(engine.run('countershaft-bearing-check', { C0: 6 }).text, 'STATIC LOAD TOO HIGH');
  assert.equal(engine.run('countershaft-bearing-check', { ds: 20 }).text, 'SHAFT OVERSTRESSED');
  assert.equal(engine.run('carburizing-case-depth-plan').text, 'CASE PLAN SUITS THE SECTION');
  assert.equal(engine.run('carburizing-case-depth-plan', { sect: 8 }).text, 'CASE TOO DEEP FOR THE SECTION');
  assert.equal(engine.run('induction-hardening-plan').text, 'FREQUENCY TOO LOW FOR THE CASE');
  assert.equal(engine.run('induction-hardening-plan', { f: 30 }).text, 'FREQUENCY SUITS THE CASE');
  assert.equal(engine.run('induction-hardening-plan', { f: 500 }).text, 'FREQUENCY TOO HIGH FOR THE CASE');
  assert.equal(engine.run('induction-hardening-plan', { f: 30, D: 10, case: 1, hf: 1.2, rMax: 4 }).text, 'BAR TOO SMALL FOR THE FREQUENCY');
  const cases: Array<[string, Inputs]> = [
    ['countershaft-bearing-check', { x1: 0, x2: 0 }], ['induction-hardening-plan', { rMin: 3, rMax: 2 }], ['induction-hardening-plan', { case: 10, hf: 2 }], ['induction-hardening-plan', { T1: 10 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Thermodynamics pass (handbook70): Carnot limits, Joule–Thomson throttling, Clausius–Clapeyron, Raoult’s law, van ’t Hoff and mixing entropy.
// Expected values are independent closed forms; the van der Waals throttling case uses the exact separable integral, not the tool’s Runge–Kutta steps.
{
  const RG = 8.314462618, K0 = 273.15;
  // dP = Cp T dT ÷ (A − bT), A = 2a ÷ R, integrated exactly; solved for the outlet temperature by bisection.
  const vdwOutlet = (T1: number, P1: number, P2: number, a: number, b: number, Cp: number) => {
    const A = 2 * a / RG, F = (T2: number) => Cp * (-(T2 - T1) / b - A / (b * b) * Math.log((A - b * T2) / (A - b * T1))) - (P2 - P1);
    let lo = 1, hi = T1; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (F(mid) > 0) hi = mid; else lo = mid; } return (lo + hi) / 2;
  };
  const T2v = vdwOutlet(288.15, 70e5, 7e5, 0.1408, 0.03913e-3, 29.1);
  let lo = 288.15, hi = 388.15; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (vdwOutlet(mid, 70e5, 7e5, 0.1408, 0.03913e-3, 29.1) < 273.15) lo = mid; else hi = mid; }
  const Tneed = (lo + hi) / 2, ndot = 100 / 3600 / 0.028014;
  const osm = (c: number) => 2 * c / 58.44 * 1000 * RG * 298.15 / 1e5, ccRO = (3 - 0.75 * 0.06) / 0.25;
  const Pst = 3.8 * Math.exp(-38000 / RG * (1 / 308.15 - 1 / 298.15)), yHead = 100 * Pst / 101.325;
  const Sblend = 4.18 * (0.25 * Math.log(313.15 / 338.15) + 0.25 * Math.log(313.15 / 288.15));
  const HB70_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
    ['heat-engine-second-law-check', {}, { eff: 4, carnot: 318.15 / 40, share: 400 * 40 / 318.15, Qo: 7.5, Sgen: (10 / 318.15 - 7.5 / 278.15) * 1000, Wrev: 400 / 318.15, lost: 2.5 - 400 / 318.15 }],
    ['heat-engine-second-law-check', { mode: 'engine', Q: 100, W: 30, Th: 400, Tc: 30 }, { carnot: 1 - 303.15 / 673.15, Qo: 70, Sgen: (70 / 303.15 - 100 / 673.15) * 1000, lost: 100 * (1 - 303.15 / 673.15) - 30 }],
    ['heat-engine-second-law-check', { mode: 'fridge', Q: 50, W: 12, Th: 35, Tc: 7 }, { eff: 50 / 12, carnot: 280.15 / 28, Qo: 62, Sgen: (62 / 308.15 - 50 / 280.15) * 1000, lost: 12 - 50 * 28 / 280.15 }],
    ['gas-throttling-cooling-check', {}, { muIn: (2 * 0.1408 / (RG * 288.15) - 0.03913e-3) / 29.1 * 1e5, drop: 288.15 - T2v, T2C: T2v - K0, TneedC: Tneed - K0, Qpre: ndot * 29.1 * (Tneed - 288.15) / 1000, TinvC: 2 * 0.1408 / (RG * 0.03913e-3) - K0 }, 1e-7],
    ['gas-throttling-cooling-check', { model: 'mu' }, { T2C: 15 - 0.25 * 63, TneedC: 0.25 * 63, Qpre: ndot * 29.1 * (0.25 * 63 - 15) / 1000 }, 1e-9],
    ['vacuum-boiling-point', {}, { TbC: 1 / (1 / 373.15 - RG * Math.log(20 / 101.325) / 40656) - K0, Pneed: 101.325 * Math.exp(-40656 / RG * (1 / 338.15 - 1 / 373.15)) }],
    ['solvent-headspace-lel-check', {}, { Pstar: Pst, y: yHead, shareLEL: 100 * yHead / 1.1, TlimC: 1 / (1 / 298.15 - RG * Math.log(0.25 * 0.011 * 101.325 / 3.8) / 38000) - K0, TLELC: 1 / (1 / 298.15 - RG * Math.log(0.011 * 101.325 / 3.8) / 38000) - K0 }],
    ['solvent-headspace-lel-check', { x: 0.1, T: 0 }, { Pi: 0.38 * Math.exp(-38000 / RG * (1 / 273.15 - 1 / 298.15)) }],
    ['ro-osmotic-pressure-check', {}, { cp: 0.06, cc: ccRO, piF: osm(3), piC: osm(ccRO), piP: osm(0.06), ndpFeed: 14.5 - osm(3) + osm(0.06), ndpTail: 12.5 - osm(ccRO) + osm(0.06), pfMin: 3.5 + osm(ccRO) - osm(0.06) }],
    ['hot-cold-water-blend-check', {}, { f: 50, Qh: 15, Qc: 15, P: 52.25, Sgen: Sblend * 1000, lost: 288.15 * Sblend }],
  ];
  for (const [id, over, expected, tol] of HB70_CASES) test(`thermodynamics check: ${id} ${JSON.stringify(over)}`, () => {
    const r = engine.run(id, over);
    assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
    for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-9), `${id}/${key}`);
  });
}

test('thermodynamics checks agree with their sources and with each other', () => {
  // Linder’s nitrogen constants (1.390 L²·atm/mol², 0.03913 L/mol) give an inversion temperature 2a ÷ Rb of about 866 K.
  near(engine.run('gas-throttling-cooling-check', { a: 1.390 * 1.01325 }).values.TinvC + 273.15, 2 * 1.390 / (0.082057366 * 0.03913), 1e-3, 'van der Waals inversion temperature');
  // An entered coefficient equal to the van der Waals value at the inlet gives the same drop for a small pressure step.
  const vdw = engine.run('gas-throttling-cooling-check', { P1: 7.01 }).values, mu = engine.run('gas-throttling-cooling-check', { model: 'mu', mu: vdw.muIn, P1: 7.01 }).values;
  near(vdw.drop, mu.drop, 1e-5, 'small step matches the coefficient');
  // Lost work equals T × S_gen: the cold reservoir for a heat pump, the hot reservoir for a refrigerator.
  const hp = engine.run('heat-engine-second-law-check').values, fr = engine.run('heat-engine-second-law-check', { mode: 'fridge', Q: 50, W: 12, Th: 35, Tc: 7 }).values;
  near(hp.lost, 278.15 * hp.Sgen / 1000, 1e-12, 'heat pump lost work'); near(fr.lost, 308.15 * fr.Sgen / 1000, 1e-12, 'refrigerator lost work');
  // At exactly the Carnot COP no entropy is generated.
  near(engine.run('heat-engine-second-law-check', { W: 10 * 40 / 318.15 }).values.Sgen, 0, 1e-9, 'reversible heat pump');
  // The pressure for the temperature limit gives back that limit as the boiling point; the headspace limit temperature gives back the limit.
  const vb = engine.run('vacuum-boiling-point').values;
  near(engine.run('vacuum-boiling-point', { P: vb.Pneed }).values.TbC, 65, 1e-9, 'Clausius–Clapeyron round trip');
  const sh = engine.run('solvent-headspace-lel-check').values;
  near(engine.run('solvent-headspace-lel-check', { T: sh.TlimC }).values.shareLEL, 25, 1e-9, 'temperature at the limit');
  near(engine.run('solvent-headspace-lel-check', { T: 25 }).values.y, 100 * 3.8 / 101.325, 1e-12, 'Raoult at the reference temperature');
  // The least feed pressure gives exactly the required tail pressure; a seawater-strength ideal feed follows van ’t Hoff.
  const ro = engine.run('ro-osmotic-pressure-check').values;
  near(engine.run('ro-osmotic-pressure-check', { pf: ro.pfMin }).values.ndpTail, 1, 1e-9, 'least feed pressure');
  near(engine.run('ro-osmotic-pressure-check', { c: 35, pf: 80 }).values.piF, 2 * 35 / 58.44 * 1000 * 8.314462618 * 298.15 / 1e5, 1e-9, 'van ’t Hoff seawater strength');
  // Blending: the energy balance closes and mixing always generates entropy.
  const bl = engine.run('hot-cold-water-blend-check').values;
  near(bl.Qh * 65 + bl.Qc * 15, 30 * 40, 1e-9, 'energy balance');
  assert.ok(engine.run('hot-cold-water-blend-check', { Th: 40.001, Tt: 40 }).values.Sgen > 0, 'mixing always generates entropy');
});

test('thermodynamics checks: verdicts and guards', () => {
  assert.equal(engine.run('heat-engine-second-law-check').text, 'CLAIM WITHIN THE LIMIT');
  assert.equal(engine.run('heat-engine-second-law-check', { W: 1.6 }).text, 'CLAIM CLOSE TO THE CARNOT LIMIT');
  assert.equal(engine.run('heat-engine-second-law-check', { W: 1 }).text, 'CLAIM BREAKS THE SECOND LAW');
  assert.equal(engine.run('heat-engine-second-law-check', { mode: 'engine', Q: 100, W: 60, Th: 400, Tc: 30 }).text, 'CLAIM BREAKS THE SECOND LAW');
  assert.equal(engine.run('gas-throttling-cooling-check', { P1: 30 }).text, 'OUTLET ABOVE THE LIMIT');
  assert.equal(engine.run('gas-throttling-cooling-check').text, 'PREHEAT NEEDED');
  assert.ok(engine.run('gas-throttling-cooling-check', { model: 'mu', mu: -0.05 }).values.drop < 0, 'a negative coefficient warms the gas');
  assert.equal(engine.run('vacuum-boiling-point').text, 'BOILS BELOW THE LIMIT');
  assert.equal(engine.run('vacuum-boiling-point', { P: 30 }).text, 'PRESSURE TOO HIGH');
  assert.equal(engine.run('solvent-headspace-lel-check', { x: 0.001 }).text, 'BELOW THE LIMIT');
  assert.equal(engine.run('solvent-headspace-lel-check', { x: 0.1 }).text, 'ABOVE THE LIMIT');
  assert.equal(engine.run('solvent-headspace-lel-check').text, 'FLAMMABLE HEADSPACE POSSIBLE');
  assert.equal(engine.run('solvent-headspace-lel-check', { T: 120 }).text, 'LIQUID BOILING');
  assert.equal(engine.run('ro-osmotic-pressure-check').text, 'FEED PRESSURE ENOUGH');
  assert.equal(engine.run('ro-osmotic-pressure-check', { r: 90 }).text, 'CONCENTRATE END STARVED');
  assert.equal(engine.run('hot-cold-water-blend-check').text, 'HOT SUPPLY ENOUGH');
  assert.equal(engine.run('hot-cold-water-blend-check', { hotCap: 10 }).text, 'HOT SUPPLY SHORT');
  const cases: Array<[string, Inputs]> = [
    ['heat-engine-second-law-check', { share: 101 }], ['heat-engine-second-law-check', { Q: 0 }], ['heat-engine-second-law-check', { Th: 5, Tc: 45 }], ['heat-engine-second-law-check', { W: 12 }], ['heat-engine-second-law-check', { mode: 'cooler' }],
    ['gas-throttling-cooling-check', { mu: 6 }], ['gas-throttling-cooling-check', { P2: 80 }], ['gas-throttling-cooling-check', { T1: 700 }], ['gas-throttling-cooling-check', { model: 'mu', mu: 5, P1: 1000, P2: 1, T1: -150 }],
    ['vacuum-boiling-point', { P: 0 }], ['vacuum-boiling-point', { dH: 0.05 }],
    ['solvent-headspace-lel-check', { x: 0 }], ['solvent-headspace-lel-check', { x: 1.5 }], ['solvent-headspace-lel-check', { LEL: 0 }],
    ['ro-osmotic-pressure-check', { r: 100 }], ['ro-osmotic-pressure-check', { dp: 15 }], ['ro-osmotic-pressure-check', { c: 500 }],
    ['hot-cold-water-blend-check', { Tt: 70 }], ['hot-cold-water-blend-check', { Tt: 15 }], ['hot-cold-water-blend-check', { Th: 100 }], ['hot-cold-water-blend-check', { Q: 0 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Batch handbook76: quality charts, reliability demonstration, bearing frequencies, queueing and nesting. Expected values are
// independent hand calculations (closed forms, a Poisson-identity chi-square CDF, birth–death state probabilities for the
// queue, a separate two-block count) and NIST's published reliability test examples.
const QR_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['bearing-defect-frequency-check', {}, { bpfo: 88.42469262295081, bpfi: 133.5753073770492, ftf: 9.824965846994536, bsf: 58.13311026345129, err: 0.14101561368442167, match: 1 }, 1e-9],
  ['individuals-chart-check', {}, { mean: 10.015, mrbar: 0.04454545454545424, ucl: 10.133471953578336, lcl: 9.896528046421665, nOut: 0 }, 1e-9],
  ['p-chart-check', {}, { pbar: 0.025, ucl: 0.058119103248729424, lcl: 0, thr: 12, nOut: 0 }, 1e-12],
  ['reliability-demonstration-test', {}, { factor: 7.9935895860526305, T: 1598.7179172105261, daysNeed: 49.95993491282894, more: 9.274673893351622, fewer: 6.680783068255863 }, 1e-6],
  ['reliability-demonstration-test', { r: 0 }, { factor: Math.log(10) }, 1e-9], // NIST example: factor 2.3 for no failures at 90 %
  ['reliability-demonstration-test', { M: 400, conf: 80, r: 1 }, { factor: 2.9943083470021215 }, 1e-6], // NIST example: 2.99 at 80 % with one failure
  ['queue-wait-check', {}, { Pw: 0.2997601918465228, WqMin: 4.496402877697842, Lq: 0.3747002398081535, cNeed: 3 }, 1e-9],
  ['queue-wait-check', { c: 2 }, { WqMin: 45.45454545454544 }, 1e-9],
  ['sheet-nesting-yield', {}, { A: 42, B: 36, best: 45, util: 87.1875, sheets: 12, cpp: 4.32 }, 1e-9],
];
for (const [id, over, expected, tol] of QR_CASES) test(`quality and reliability: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('quality and reliability tools: identities', () => {
  const b = engine.run('bearing-defect-frequency-check').values;
  near(b.bpfo + b.bpfi, 9 * 1480 / 60, 1e-9, 'BPFO + BPFI = elements × shaft frequency');
  near(b.ftf, b.bpfo / 9, 1e-12, 'cage frequency = BPFO ÷ elements');
  assert.equal(engine.run('bearing-defect-frequency-check', { fm: 2 * b.bpfo }).text, 'PEAK MATCHES OUTER RACE DEFECT', 'second harmonic matched');
  near(engine.run('reliability-demonstration-test', { units: 1 }).values.perUnit, engine.run('reliability-demonstration-test').values.T, 1e-9, 'one unit runs every hour');
  near(engine.run('queue-wait-check', { c: 1, lam: 2, ts: 20 }).values.WqMin, (2 / 3) / (3 - 2) * 60, 1e-9, 'M/M/1: Wq = ρ ÷ (μ − λ)');
});

test('quality and reliability tools: verdicts and guards', () => {
  assert.equal(engine.run('bearing-defect-frequency-check').text, 'PEAK MATCHES OUTER RACE DEFECT');
  assert.equal(engine.run('bearing-defect-frequency-check', { fm: 133.5 }).text, 'PEAK MATCHES INNER RACE DEFECT');
  assert.equal(engine.run('bearing-defect-frequency-check', { fm: 70 }).text, 'NO BEARING FREQUENCY MATCH');
  assert.equal(engine.run('individuals-chart-check').text, 'PROCESS IN CONTROL');
  assert.equal(engine.run('individuals-chart-check', { x5: 10.5 }).text, 'POINT OUT OF CONTROL');
  assert.equal(engine.run('p-chart-check').text, 'PROCESS IN CONTROL');
  assert.equal(engine.run('p-chart-check', { d10: 15 }).text, 'SAMPLE OUT OF CONTROL');
  assert.equal(engine.run('reliability-demonstration-test').text, 'TEST FITS THE TIME AVAILABLE');
  assert.equal(engine.run('reliability-demonstration-test', { days: 30 }).text, 'TEST TOO LONG FOR THE TIME AVAILABLE');
  assert.equal(engine.run('queue-wait-check').text, 'WAIT WITHIN TARGET');
  assert.equal(engine.run('queue-wait-check', { c: 2 }).text, 'WAIT TOO LONG');
  assert.equal(engine.run('sheet-nesting-yield').text, 'LAYOUT ACCEPTABLE');
  assert.equal(engine.run('sheet-nesting-yield', { umin: 90 }).text, 'UTILISATION TOO LOW');
  const cases: Array<[string, Inputs]> = [['bearing-defect-frequency-check', { nb: 2 }], ['bearing-defect-frequency-check', { d: 50 }], ['individuals-chart-check', { k: 2 }], ['p-chart-check', { k: 1 }], ['p-chart-check', { d1: 300 }], ['reliability-demonstration-test', { conf: 40 }], ['queue-wait-check', { c: 0 }], ['queue-wait-check', { lam: 10 }], ['sheet-nesting-yield', { umin: 0 }], ['sheet-nesting-yield', { edge: 700 }], ['sheet-nesting-yield', { pl: 3000, pw: 3000 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-eighth handbook pass (handbook78): forty-seventh round of integrated design checks.
// Expected values are independent hand calculations (cavity volumes and electrode wear, kerf and wire mass, Gaussian spot and depth of focus).
const HB58_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['edm-sinker-plan', {}, { I: 48, duty: 0.4, freq: 10, Vc: 9, Vf: 0.42, Vr: 8.58, tR: 1.43, tF: 0.42, tT: 1.85, endR: 0.74, nR: 2, eachR: 0.37, uR: 0.45, uF: 0.05, cost: 616.5 }, 1e-9],
  ['wire-edm-cut-plan', {}, { kerf: 0.31, offset: 0.155, rCorner: 0.135, feed: 4, tMain: 60, tSkim: 40, tTot: 104, wireL: 800, wireM: 333.79421944391555, wireC: 8.34485548609789, Fb: 44.178646691106465, u: 0.3395305452627101, vol: 2232, cost: 147.01152215276457 }, 1e-9],
  ['wire-edm-cut-plan', { skims: 0 }, { rCorner: 0.155, tSkim: 0, tTot: 64 }, 1e-9],
  ['laser-cutting-plan', {}, { d0: 0.1285526306341857, Fn: 6.35, H: 15409132.081866648, zR: 0.8163092045270792, dof: 0.522692925274687, v: 3, tCut: 30, tPierce: 3, tPart: 33, cost: 1.375 }, 1e-6],
  ['laser-cutting-plan', { P: 1000 }, { H: 7704566.040933324, v: 1.5, tCut: 60 }, 1e-6],
];
for (const [id, over, expected, tol] of HB58_CASES) test(`design check: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('forty-seventh-round design checks follow their scaling laws', () => {
  const base = engine.run('laser-cutting-plan').values, short = engine.run('laser-cutting-plan', { fl: 63.5 }).values;
  near(short.d0, base.d0 / 2, 1e-12, 'half the focal length halves the spot');
  near(short.H, base.H * 4, 1e-3, 'and quadruples the power density');
  near(short.dof, base.dof / 4, 1e-12, 'and quarters the depth of focus');
  near(engine.run('laser-cutting-plan', { lam: 1.06 }).values.d0, base.d0 / 10, 1e-12, 'a tenth of the wavelength gives a tenth of the spot');
  near(engine.run('wire-edm-cut-plan', { t: 60 }).values.tMain, 120, 1e-9, 'twice the thickness doubles the main-cut time');
  near(engine.run('edm-sinker-plan', { endMax: 0.2 }).values.nR, 4, 0, 'a smaller wear allowance needs more roughing electrodes');
});

test('forty-seventh-round design checks give pass and fail verdicts', () => {
  assert.equal(engine.run('edm-sinker-plan').text, 'EDM PLAN WORKABLE');
  assert.equal(engine.run('edm-sinker-plan', { J: 12 }).text, 'CURRENT ABOVE MACHINE LIMIT');
  assert.equal(engine.run('edm-sinker-plan', { fin: 0.05 }).text, 'FINISHING STOCK TOO SMALL');
  assert.equal(engine.run('wire-edm-cut-plan').text, 'WIRE AND SETTINGS SUIT THE CUT');
  assert.equal(engine.run('wire-edm-cut-plan', { rMin: 0.1 }).text, 'WIRE TOO LARGE FOR THE CORNERS');
  assert.equal(engine.run('wire-edm-cut-plan', { Tw: 30 }).text, 'WIRE TENSION TOO HIGH');
  assert.equal(engine.run('laser-cutting-plan').text, 'BEAM SUITS THE CUT');
  assert.equal(engine.run('laser-cutting-plan', { Hreq: 2e7 }).text, 'POWER DENSITY TOO LOW');
  assert.equal(engine.run('laser-cutting-plan', { flat: 1 }).text, 'DEPTH OF FOCUS TOO SHORT');
  const cases: Array<[string, Inputs]> = [
    ['edm-sinker-plan', { fin: 15 }], ['edm-sinker-plan', { perim: 10000, fin: 1 }], ['wire-edm-cut-plan', { dw: 0 }], ['laser-cutting-plan', { M2: 0.5 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Heat engine Carnot limit and least work to chill (bryanthermo), after Bryan, Thermodynamics (1907) §§63–65, 74, 77, 90 and 93.
// Expected values are independent closed forms; the cross-checks integrate Bryan’s element of work dQ (T₀ ÷ T − 1) numerically.
const BT2_CASES: Array<[string, Inputs, Record<string, number>]> = [
  ['heat-engine-carnot-limit', {}, { etaC: 100 * 420 / 723.15, eta2: 35 / (100 * 420 / 723.15) * 100, Wmax: 1000 * 420 / 723.15, QrMin: 1000 * 303.15 / 723.15, W: 350, Qr: 650, Sgen: 650 / 303.15 - 1000 / 723.15 }],
  ['chilling-least-work-check', {}, { Q: 54.6, Qa: 9.75, W: 1.95 * (298.15 * Math.log(298.15 / 275.15) - 23), cop: 2.73, Ew: 4000 * 1.95 * (298.15 * Math.log(298.15 / 275.15) - 23), Ep: 80000 }],
  ['chilling-least-work-check', { T1: 10 }, { Q: 15.6, Qa: 0, W: 1.95 * (298.15 * Math.log(283.15 / 275.15) - 8) }],
];
for (const [id, over, expected] of BT2_CASES) test(`Carnot and chilling limit: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, Math.max(1e-9, Math.abs(value) * 1e-9), `${id}/${key}`);
});

test('Carnot and chilling limits agree with Bryan’s reversible-cycle forms', () => {
  // Work lost equals T_C × entropy generated and equals the most work less the stated work; at the Carnot efficiency nothing is lost.
  const e = engine.run('heat-engine-carnot-limit').values;
  near(e.lost, e.Wmax - e.W, 1e-9, 'Gouy–Stodola: work lost'); near(e.Wmax + e.QrMin, 1000, 1e-9, 'first law at the limit');
  const atLimit = engine.run('heat-engine-carnot-limit', { eff: e.etaC }).values;
  near(atLimit.Sgen, 0, 1e-12, 'reversible engine generates no entropy'); near(atLimit.eta2, 100, 1e-9, 'second-law efficiency 100 %');
  // Least work to chill: sum dQ (T₀ ÷ T − 1) over the cooling below ambient (Bryan §§90, 93) by the midpoint rule.
  const c = engine.run('chilling-least-work-check').values, C = 0.5 * 3.9, n = 20000, a = 275.15, b = 298.15;
  let sum = 0; for (let i = 0; i < n; i++) { const T = a + (i + 0.5) * (b - a) / n; sum += C * (b - a) / n * (298.15 / T - 1); }
  near(c.W, sum, 1e-6, 'integral of the Carnot work'); near(c.copId, c.Q / c.W, 1e-12, 'ideal COP'); near(c.eta2, c.W / 20 * 100, 1e-12, 'second-law efficiency');
  // A narrow chilling range near T matches the fixed-temperature Carnot refrigerator: W ≈ Q (T₀ − T) ÷ T.
  const thin = engine.run('chilling-least-work-check', { T1: 5.001, T2: 4.999 }).values;
  near(thin.W, thin.Q * (25 - 5) / 278.15, 1e-9, 'narrow range is a Carnot refrigerator');
  // Starting above ambient adds heat but no work.
  near(engine.run('chilling-least-work-check', { T1: 60 }).values.W, c.W, 1e-12, 'heat above ambient needs no work');
});

test('Carnot and chilling limits: verdicts and guards', () => {
  assert.equal(engine.run('heat-engine-carnot-limit').text, 'INSIDE THE CARNOT LIMIT');
  assert.equal(engine.run('heat-engine-carnot-limit', { eff: 50 }).text, 'INSIDE THE LIMIT: ASK FOR TEST EVIDENCE');
  assert.equal(engine.run('heat-engine-carnot-limit', { eff: 60 }).text, 'IMPOSSIBLE: ABOVE THE CARNOT LIMIT');
  assert.equal(engine.run('chilling-least-work-check').text, 'INSIDE THE SECOND-LAW LIMIT');
  assert.equal(engine.run('chilling-least-work-check', { P: 2.5 }).text, 'INSIDE THE LIMIT: ASK FOR TEST EVIDENCE');
  assert.equal(engine.run('chilling-least-work-check', { P: 1.8 }).text, 'IMPOSSIBLE: BELOW THE LEAST WORK');
  const cases: Array<[string, Inputs]> = [
    ['heat-engine-carnot-limit', { Th: 30 }], ['heat-engine-carnot-limit', { Th: 20 }], ['heat-engine-carnot-limit', { Tc: -274, Th: 100 }], ['heat-engine-carnot-limit', { eff: 0 }],
    ['chilling-least-work-check', { T2: 30 }], ['chilling-least-work-check', { T2: 25 }], ['chilling-least-work-check', { T2: 40, T1: 50 }], ['chilling-least-work-check', { P: 0 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Batch handbook80: EWMA, CUSUM and c charts, Grubbs outlier test, linear calibration and exponential smoothing. Expected
// values are independent hand calculations (explicit EWMA weights, the max-of-partial-sums CUSUM identity, a t quantile from
// Simpson integration of the density, normal equations with bisection of the calibration limits, explicit smoothing
// weights) and NIST e-Handbook worked examples.
const SQ_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['ewma-chart-check', {}, { sd: 0.8628105793755388, ucl: 52.588431738126616, lcl: 47.411568261873384, last: 51.988243258644616, nOut: 0 }, 1e-9],
  ['cusum-chart-check', {}, { k: 0.3175, shi: 19.06, slo: 0, first: 14, start: 13 }, 1e-9],
  ['c-chart-check', {}, { cbar: 16, ucl: 28, lcl: 4, thr: 29, nOut: 0 }, 1e-12],
  ['grubbs-outlier-check', {}, { mean: 206.43375, s: 15.852564404987783, G: 2.468764611212452, t: 4.115170117554614, Gcrit: 2.126645087189912, out: 1 }, 1e-6],
  ['grubbs-outlier-check', { test: 'max' }, { G: 2.468764611212452, Gcrit: 2.031652001546452 }, 1e-6], // NIST example: G 2.4687 against 2.032
  ['linear-calibration-check', {}, { a: 0.3238095238095238, b: 1.0078571428571428, s: 0.24299715851758263, t: 2.7764451051922983, ta: 1.8412032276511978, tb: 2.7052815726087784, xstar: 49.288920387432086, lo: 48.56578537417677, hi: 50.01196435474368 }, 1e-6],
  ['exponential-smoothing-forecast', {}, { mse: 16.49652420390736, rmse: 4.06159133886059, fc: 72.40185546875, bestA: 1, bestMse: 12.636363636363637, bestFc: 70 }, 1e-9],
  ['exponential-smoothing-forecast', { alpha: 0.1 }, { mse: 18.98349179142248 }, 1e-9], // NIST example: MSE 19.0 at α = 0.1
];
for (const [id, over, expected, tol] of SQ_CASES) test(`quality statistics: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('quality statistics tools: NIST examples and identities', () => {
  near(engine.run('cusum-chart-check').values.shi, 19.04, 0.03, 'NIST CUSUM table: upper sum 19.04 at group 20 (NIST used unrounded means)');
  const c = engine.run('c-chart-check', { k: 2, c1: 12, c2: 20 }).values;
  near(c.ucl, 28, 1e-12, 'NIST wafer example: UCL 28'); near(c.lcl, 4, 1e-12, 'NIST wafer example: LCL 4');
  const e1 = engine.run('ewma-chart-check', { lam: 1 }).values;
  near(e1.last, 52.1, 1e-12, 'λ = 1: EWMA is the last reading'); near(e1.sd, 2.0539, 1e-12, 'λ = 1: EWMA spread is s');
  const cal = engine.run('linear-calibration-check').values;
  near(cal.a + cal.b * cal.xstar, 50, 1e-9, 'calibrated value maps back to the reading');
  assert.ok(cal.lo < cal.xstar && cal.xstar < cal.hi, 'calibrated value lies inside its interval');
  near(engine.run('exponential-smoothing-forecast', { alpha: 1 }).values.fc, 70, 1e-12, 'α = 1: forecast is the last demand');
});

test('quality statistics tools: verdicts and guards', () => {
  assert.equal(engine.run('ewma-chart-check').text, 'PROCESS IN CONTROL');
  assert.equal(engine.run('ewma-chart-check', { s: 1 }).text, 'EWMA OUT OF CONTROL');
  assert.equal(engine.run('cusum-chart-check').text, 'UPWARD SHIFT SIGNALLED');
  assert.equal(engine.run('cusum-chart-check', { n: 12 }).text, 'PROCESS IN CONTROL');
  assert.equal(engine.run('cusum-chart-check', { n: 12, mu0: 328 }).text, 'DOWNWARD SHIFT SIGNALLED');
  assert.equal(engine.run('c-chart-check').text, 'PROCESS IN CONTROL');
  assert.equal(engine.run('c-chart-check', { c5: 30 }).text, 'COUNT OUT OF CONTROL');
  assert.equal(engine.run('grubbs-outlier-check').text, 'OUTLIER DETECTED');
  assert.equal(engine.run('grubbs-outlier-check', { n: 7 }).text, 'NO OUTLIER DETECTED');
  assert.equal(engine.run('linear-calibration-check').text, 'CALIBRATION INTERVAL WITHIN TOLERANCE');
  assert.equal(engine.run('linear-calibration-check', { tol: 0.5 }).text, 'CALIBRATION INTERVAL TOO WIDE');
  assert.equal(engine.run('exponential-smoothing-forecast').text, 'FORECAST ERROR WITHIN TARGET');
  assert.equal(engine.run('exponential-smoothing-forecast', { target: 5 }).text, 'FORECAST ERROR TOO HIGH');
  const cases: Array<[string, Inputs]> = [['ewma-chart-check', { n: 2 }], ['ewma-chart-check', { lam: 0 }], ['cusum-chart-check', { n: 2 }], ['cusum-chart-check', { h: 0 }], ['c-chart-check', { k: 2, c1: 0, c2: 0 }], ['grubbs-outlier-check', { n: 2 }], ['grubbs-outlier-check', { n: 3, x1: 5, x2: 5, x3: 5 }], ['linear-calibration-check', { n: 2 }], ['linear-calibration-check', { n: 3, r1: 10, r2: 10, r3: 10 }], ['linear-calibration-check', { n: 3, r1: 0, r2: 1, r3: 2, y1: 0, y2: 1, y3: 2 }], ['exponential-smoothing-forecast', { n: 2 }], ['exponential-smoothing-forecast', { n: 3, y1: 0, y2: 0, y3: 0 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Batch handbook81: tolerance intervals, one-way ANOVA, F and chi-square tests of spread, Holt trend forecast, Arrhenius
// acceleration, MTBF confidence bounds and power-law reliability growth. Expected values are independent hand calculations
// (closed-form chi-square tails for integer degrees of freedom, the closed-form F tail for 2 numerator degrees of freedom,
// Simpson integration of the F and normal densities, raw-sum ANOVA, the MTBF as 1 ÷ m(T)) and NIST e-Handbook worked examples.
const RS_CASES: Array<[string, Inputs, Record<string, number>, number?]> = [
  ['normal-tolerance-interval-check', {}, { chi: 23.650094677826175, k2: 2.21731589665361, k1: 1.8739536058512567, k1nat: 1.8751895812770476, lo: 95.56536820669278, hi: 104.43463179330722 }, 1e-6],
  ['normal-tolerance-interval-check', { side: 'lower', n: 6 }, { k1: 4.411080572399033 }, 1e-6], // NIST: 4.4111 (non-central t)
  ['one-way-anova-check', {}, { sstot: 45.34933333333345, sst: 27.89733333333345, sse: 17.452, F: 9.591107036442855, Fcrit: 3.8852938346523933, p: 0.0032482226008592506 }, 1e-9],
  ['two-variance-f-test', {}, { F: 1.1230374607443194, lo: 0.7755639034053803, hi: 1.2893844022516303, p: 0.3703831598772964 }, 1e-6],
  ['standard-deviation-chi-square-check', {}, { T: 0.392931, lo: 73.36108019128417, hi: 128.42198864384108, ciLo: 0.005531443126044369, ciHi: 0.007318554108356088 }, 1e-6],
  ['holt-trend-forecast', {}, { S: 22.815058506216722, b: 2.956837242775862, fc: 37.59924472009603, fc1: 25.771895748992584, mse: 3.674309454248838, rmse: 1.9168488344803922, b1: 0.8 }, 1e-9],
  ['arrhenius-acceleration-check', {}, { AF: 132.6646146803523 }, 1e-6],
  ['arrhenius-acceleration-check', { ea: 1 }, { AF: 17599.899988286343 }, 1e-4],
  ['mtbf-confidence-bounds', {}, { mtbf: 400, lower: 127.06896827442839, upper: 2251.2286106257047, zero: 267.04656055626725 }, 1e-6],
  ['reliability-growth-check', {}, { L: 18.61404074174158, b: 0.483505979430769, beta: 0.516494020569231, a: 0.2913002685663814, mtbf: 310.23401236235964, ML: 157.71383403939075, MU: 548.5565977314178, cum: 150 }, 1e-9],
];
for (const [id, over, expected, tol] of RS_CASES) test(`reliability statistics: ${id} ${JSON.stringify(over)}`, () => {
  const r = engine.run(id, over);
  assert.ok(r.primary && Number.isFinite(r.primary.value), `${id}: ${r.summary}`);
  for (const [key, value] of Object.entries(expected)) near(r.values[key], value, tol ?? Math.max(1e-9, Math.abs(value) * 1e-8), `${id}/${key}`);
});

test('reliability statistics tools: NIST worked examples', () => {
  const t = engine.run('normal-tolerance-interval-check').values;
  near(t.chi, 23.650, 5e-4, 'NIST: chi-square 23.650'); near(t.k2, 2.217, 5e-4, 'NIST: k2 = 2.217'); near(t.k1, 1.8740, 5e-5, 'NIST: k1 = 1.8740 (non-central t)'); near(t.k1nat, 1.8752, 5e-5, 'NIST: k1 = 1.8752 (Natrella)');
  near(engine.run('normal-tolerance-interval-check', { side: 'lower', n: 6 }).values.k1nat, 5.2808, 5e-5, 'NIST: Natrella k1 = 5.2808 for N = 6');
  const a = engine.run('one-way-anova-check').values;
  near(a.sst, 27.897, 5e-4, 'NIST: SST 27.897'); near(a.sse, 17.452, 5e-4, 'NIST: SSE 17.452'); near(a.F, 9.59, 5e-3, 'NIST: F 9.59'); near(a.Fcrit, 3.89, 5e-3, 'NIST: F(0.05; 2, 12) = 3.89');
  const f = engine.run('two-variance-f-test').values;
  near(f.F, 1.123037, 5e-7, 'NIST: F = 1.123037'); near(f.lo, 0.7756, 5e-5, 'NIST: lower critical 0.7756'); near(f.hi, 1.2894, 5e-5, 'NIST: upper critical 1.2894');
  const c = engine.run('standard-deviation-chi-square-check').values;
  near(c.lo, 73.361, 5e-4, 'NIST: 73.361'); near(c.hi, 128.422, 5e-4, 'NIST: 128.422');
  const h = engine.run('holt-trend-forecast').values;
  [25.8, 28.7, 31.7, 34.6, 37.6].forEach((x, k) => near(h.S + (k + 1) * h.b, x, 0.05, `NIST: Holt forecast for period ${11 + k} = ${x}`));
  const g = engine.run('holt-trend-forecast', { alpha: 0.977, gamma: 0.01 }).values; assert.ok(Number.isFinite(g.mse));
  near(engine.run('arrhenius-acceleration-check').values.AF, 133, 0.5, 'NIST: AF 133 from 25 to 125 °C at 0.5 eV');
  near(engine.run('arrhenius-acceleration-check', { ea: 1 }).values.AF, 17597, 0.0005 * 17597, 'NIST: AF 17,597 at 1.0 eV (NIST uses 11605 and 273.16)');
  const mt = engine.run('mtbf-confidence-bounds').values;
  near(mt.lower, 127, 0.5, 'NIST: lower 127'); near(mt.upper, 2251, 0.5, 'NIST: upper 2251'); near(mt.zero, 267, 0.5, 'NIST: zero-failure bound 267');
  near(engine.run('mtbf-confidence-bounds', { r: 0 }).values.lower, mt.zero, 1e-9, 'no failures: 2T ÷ χ²(C; 2) = T ÷ (−ln(1 − C))');
  const gr = engine.run('reliability-growth-check').values;
  near(gr.beta, 0.5165, 5e-5, 'NIST: β 0.5165'); near(gr.a, 0.2913, 5e-5, 'NIST: a 0.2913'); near(gr.mtbf, 310.234, 5e-4, 'NIST: MTBF 310.234'); near(gr.ML, 157.7139, 5e-4, 'NIST: 157.7139'); near(gr.MU, 548.5565, 5e-3, 'NIST: 548.5565');
  near(gr.mtbf, 1 / (gr.a * gr.b * Math.pow(1500, gr.b - 1)), 1e-9, 'MTBF = 1 ÷ m(T)');
});

test('reliability statistics tools: verdicts and guards', () => {
  assert.equal(engine.run('normal-tolerance-interval-check').text, 'TOLERANCE INTERVAL WITHIN SPEC');
  assert.equal(engine.run('normal-tolerance-interval-check', { n: 6 }).text, 'TOLERANCE INTERVAL OUTSIDE SPEC');
  assert.equal(engine.run('normal-tolerance-interval-check', { side: 'upper', usl: 103 }).text, 'TOLERANCE INTERVAL OUTSIDE SPEC');
  assert.equal(engine.run('normal-tolerance-interval-check', { side: 'lower', usl: 101 }).text, 'TOLERANCE INTERVAL WITHIN SPEC');
  assert.equal(engine.run('one-way-anova-check').text, 'GROUP MEANS DIFFER');
  assert.equal(engine.run('one-way-anova-check', { k: 2, g2x1: 5.3, g2x2: 6.1, g2x3: 5.0, g2x4: 4.9, g2x5: 5.6 }).text, 'NO SIGNIFICANT DIFFERENCE');
  assert.equal(engine.run('two-variance-f-test').text, 'NO EVIDENCE SPREADS DIFFER');
  assert.equal(engine.run('two-variance-f-test', { s1: 80 }).text, 'SPREADS DIFFER');
  assert.equal(engine.run('two-variance-f-test', { test: 'greater', s1: 80 }).text, 'SAMPLE 1 SPREAD LARGER');
  assert.equal(engine.run('two-variance-f-test', { test: 'less', s1: 50 }).text, 'SAMPLE 1 SPREAD SMALLER');
  assert.equal(engine.run('standard-deviation-chi-square-check').text, 'SPREAD DIFFERS FROM TARGET');
  assert.equal(engine.run('standard-deviation-chi-square-check', { test: 'upper', s: 0.12 }).text, 'SPREAD ABOVE TARGET');
  assert.equal(engine.run('standard-deviation-chi-square-check', { test: 'lower' }).text, 'SPREAD BELOW TARGET');
  assert.equal(engine.run('standard-deviation-chi-square-check', { test: 'lower', s: 0.1 }).text, 'SPREAD NOT SHOWN BELOW TARGET');
  assert.equal(engine.run('standard-deviation-chi-square-check', { s: 0.1 }).text, 'SPREAD CONSISTENT WITH TARGET');
  assert.equal(engine.run('holt-trend-forecast').text, 'FORECAST ERROR WITHIN TARGET');
  assert.equal(engine.run('holt-trend-forecast', { target: 5 }).text, 'FORECAST ERROR TOO HIGH');
  assert.equal(engine.run('arrhenius-acceleration-check').text, 'TEST COVERS TARGET LIFE');
  assert.equal(engine.run('arrhenius-acceleration-check', { th: 500 }).text, 'TEST TOO SHORT FOR TARGET LIFE');
  assert.equal(engine.run('mtbf-confidence-bounds').text, 'MTBF REQUIREMENT DEMONSTRATED');
  assert.equal(engine.run('mtbf-confidence-bounds', { req: 200 }).text, 'MTBF REQUIREMENT NOT DEMONSTRATED');
  near(engine.run('mtbf-confidence-bounds', { T: 800 + engine.run('mtbf-confidence-bounds', { req: 200 }).values.more, req: 200 }).values.lower, 200, 1e-6, 'further hours bring the lower bound to the requirement');
  assert.equal(engine.run('reliability-growth-check').text, 'MTBF GOAL DEMONSTRATED');
  assert.equal(engine.run('reliability-growth-check', { goal: 200 }).text, 'MTBF GOAL NOT DEMONSTRATED');
  const cases: Array<[string, Inputs]> = [['one-way-anova-check', { k: 2, n1: 1, n2: 1 }], ['one-way-anova-check', { k: 2, n1: 2, n2: 2, g1x1: 5, g1x2: 5, g2x1: 7, g2x2: 7 }], ['holt-trend-forecast', { n: 4, y1: 0, y2: 0, y3: 0, y4: 0 }], ['arrhenius-acceleration-check', { ts: 20 }], ['reliability-growth-check', { t3: 30 }], ['reliability-growth-check', { T: 1400 }], ['reliability-growth-check', { r: 2, T: 40, t1: 40, t2: 40 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Fifty-ninth handbook pass (handbook82): tools from pages no earlier tool cited, found with the page ledger.
// Expected values are the handbook's own tables and worked examples (AGMA I factors, ANSI B6.9 worm Examples 1 and 2, Van Keuren
// internal-gear measurements, the rope bending and drum capacity examples) and independent closed forms and integrations.
const IN82 = 25.4;
const gearI = (n1: number, n2: number, phin: number, over: Inputs = {}) => engine.run('gear-pitting-geometry-factor', { mn: 1, n1, n2, phin, psi: 0, F: 10, Cr: (n1 + n2) / 2, do1: n1 + 2, do2: n2 + 2, Iused: 0.01, ...over });

test('gear pitting geometry factor reproduces the handbook I tables (25°, equal addendum)', () => {
  // Tables 6 and 7: rows are gear teeth, columns pinion teeth 14, 17, 21, 26, 35, 55, 135; printed to three decimals.
  const P = [14, 17, 21, 26, 35, 55, 135];
  const T25: Record<number, number[]> = { 14: [0.086], 17: [0.091, 0.090], 21: [0.095, 0.096, 0.092], 26: [0.100, 0.101, 0.099, 0.094], 35: [0.106, 0.109, 0.108, 0.104, 0.095], 55: [0.113, 0.119, 0.121, 0.119, 0.112, 0.095], 135: [0.123, 0.132, 0.139, 0.142, 0.141, 0.131, 0.096] };
  let cells = 0;
  for (const [g, row] of Object.entries(T25)) row.forEach((I, i) => { near(gearI(P[i], Number(g), 25).values.I, I, 0.0006, `I ${P[i]}/${g}`); cells++; });
  assert.equal(cells, 28);
  // Hand check of 14/14 by the handbook equations: C6 = 14 sin 25°, C2 = √(8² − 7² cos² 25°) − 2π·7 cos 25° ÷ 14, ρ2 = C6 − C2.
  const rb = 7 * Math.cos(25 * Math.PI / 180), c2 = Math.sqrt(64 - rb * rb) - 2 * Math.PI * rb / 14, c6 = 14 * Math.sin(25 * Math.PI / 180);
  near(gearI(14, 14, 25).values.I, Math.cos(25 * Math.PI / 180) / ((1 / c2 + 1 / (c6 - c2)) * 14), 1e-12, '14/14 by hand');
});

test('gear pitting geometry factor: module independence, helical load sharing and continuity with spur', () => {
  const base = engine.run('gear-pitting-geometry-factor').values;
  near(base.I, 0.121, 0.0006, 'default 21/55 at 25° is the table value');
  near(engine.run('gear-pitting-geometry-factor', { mn: 8, F: 80, Cr: 304, do1: 184, do2: 456 }).values.I, base.I, 1e-12, 'doubling every length keeps I');
  // Independent re-implementation of AGMA 908-B89 eqs (1)–(39) (scratch proto82.cjs): 21/55, 20°, 15° helix.
  const h = (F: number) => gearI(21, 55, 20, { psi: 15, F, Cr: 76 / (2 * Math.cos(15 * Math.PI / 180)), do1: 21 / Math.cos(15 * Math.PI / 180) + 2, do2: 55 / Math.cos(15 * Math.PI / 180) + 2 }).values;
  const lacr = h(3), conv = h(30);
  near(lacr.mF, 3 * Math.sin(15 * Math.PI / 180) / Math.PI, 1e-12, 'axial contact ratio F sin ψ ÷ π');
  near(lacr.mN, 1, 0, 'low axial contact ratio helicals have m_N = 1');
  near(lacr.I, 0.12597581394939325, 1e-9, 'LACR helical I');
  assert.ok(conv.mF > 1 && conv.mN < 1, 'conventional helical shares load');
  const na = conv.mF % 1, nr = conv.mp % 1, px = Math.PI / Math.sin(15 * Math.PI / 180), cb = Math.cos(conv.psib * Math.PI / 180);
  near(conv.Lmin, (na <= 1 - nr ? conv.mp * 30 - na * nr * px : conv.mp * 30 - (1 - na) * (1 - nr) * px) / cb, 1e-9, 'minimum contact length, case I or II');
  near(conv.mN, 30 / conv.Lmin, 1e-12, 'm_N = F ÷ L_min');
  near(gearI(21, 55, 20, { psi: 1e-6, F: 10 }).values.I, gearI(21, 55, 20).values.I, 1e-6, 'a vanishing helix angle gives the spur I');
});

test('fine-pitch worm design reproduces the handbook Examples 1 and 2 (ANSI B6.9)', () => {
  const e1 = engine.run('fine-pitch-worm-design').values; // Px 0.160 in, 30°, 10 threads, 100 teeth, C ≈ 3 in
  near(e1.l, 1.6 * IN82, 1e-9, 'lead 1.600 in');
  near(e1.d, 0.8821 * IN82, 0.00006 * IN82, 'd = 0.8821 in');
  near(e1.D, 5.0930 * IN82, 0.0001 * IN82, 'D = 5.0930 in');
  near(e1.C, 2.9876 * IN82, 0.0001 * IN82, 'C = 2.9876 in');
  near(e1.Pn, 0.1386 * IN82, 0.00006 * IN82, 'Pn = 0.1386 in');
  near(e1.a, 0.0441 * IN82, 0.00006 * IN82, 'a = 0.0441 in');
  near(e1.dO, 0.9703 * IN82, 0.0001 * IN82, 'do = 0.9703 in');
  near(e1.FG, 0.6689 * IN82, 0.0005 * IN82, 'FG = 0.6689 in (handbook works from rounded dimensions)');
  near(e1.FW, 0.9525 * IN82, 0.001 * IN82, 'FW = 0.9525 in');
  near(e1.nEst, 2 * Math.PI * 3 / (0.16 * (Math.sqrt(3) + 10)), 1e-6, 'threads for 3 in: 10.04');
  const e2 = engine.run('fine-pitch-worm-design', { Px: 0.05 * IN82, lam: 3, n: 1, N: 50, Ct: 0.55 * IN82, dmin: 1 }).values;
  near(e2.d, 0.3037 * IN82, 0.0001 * IN82, 'd = 0.3037 in');
  near(e2.D, 0.7958 * IN82, 0.0001 * IN82, 'D = 0.7958 in');
  near(e2.C, 0.5498 * IN82, 0.0001 * IN82, 'C = 0.5498 in');
  near(e2.FG, 0.2405 * IN82, 0.0003 * IN82, 'FG = 0.2405 in');
  near(e2.FW, 0.2276 * IN82, 0.0005 * IN82, 'FW = 0.2276 in');
  near(e2.lamT, Math.atan(1 / (2 * Math.PI * 0.55 / 0.05 - 50)) * 180 / Math.PI, 1e-9, 'cot λ = 19.1152');
});

test('internal gear measurement between pins reproduces the Van Keuren tables (1.44 pins)', () => {
  // Tables 3 (even) and 4 (odd), measurements for 1 diametral pitch, which equal module-1 values in consistent units.
  const rows: Array<[number, number, number]> = [[10, 20, 8.6617], [10, 14.5, 8.8337], [12, 17.5, 10.7404], [50, 25, 48.5212], [94, 14.5, 92.8749], [94, 30, 92.4003],
    [7, 20, 5.4823], [21, 14.5, 19.7945], [45, 17.5, 43.7217], [61, 25, 59.5010], [111, 30, 109.3893]];
  for (const [z, phi, M] of rows) near(engine.run('internal-gear-pin-measurement', { m: 1, z, phi, dp: 1.44, Di: z - 2, Dr: z + 2.5, eMin: 0, eMax: 0.1, Mmeas: z }).values.M0, M, 0.00011, `z ${z} at ${phi}°`);
  const v = engine.run('internal-gear-pin-measurement').values;
  near(v.M0, 2 * 58.6648, 0.0002, 'module 2 doubles the 60-tooth 20° table value');
  // A reading made at a limit returns that limit's space-width increase.
  near(engine.run('internal-gear-pin-measurement', { Mmeas: v.Mhi }).values.esM, 0.1, 1e-9, 'reading at the upper limit');
  near(engine.run('internal-gear-pin-measurement', { Mmeas: v.M0 }).values.esM, 0, 1e-9, 'reading at the standard space');
});

test('wire rope sheave and drum check reproduces the handbook bending and drum examples', () => {
  const PSI = 0.00689475729; // MPa per psi
  const b = engine.run('wire-rope-sheave-drum-check', { d: 0.5 * IN82, Ds: 24 * IN82, E: 12e6 * PSI }).values; // 1/2 in 6 × 19 FC over a 24 in sheave
  near(b.dw, 0.0315 * IN82, 1e-12, 'dw = 0.0315 in');
  near(b.sb, 15750 * PSI, 1e-9, 'sb = 15 750 psi');
  near(b.A, 0.10125 * IN82 * IN82, 1e-9, 'A = 0.101 in²');
  near(b.Pb, 15750 * 0.10125 * 4.4482216152605, 1e-3, 'Pb ≈ 1 590 lb (7 094 N)');
  const v = engine.run('wire-rope-sheave-drum-check').values; // drum B 24, D 18, H 30 in with K 0.741
  near(v.L, (6 + 18) * 6 * 24 * 0.741 * 0.3048, 1e-9, 'L = (A + D) A B K = 2 560 ft');
  near(v.p, 2 * 12000 / (609.6 * 14.2875), 1e-12, 'p = 2T ÷ (D d)');
  near(v.SF, 150000 / (12000 + v.Pb), 1e-12, 'factor on tension plus bending load');
  near(engine.run('wire-rope-sheave-drum-check', { Y: 25.4 }).values.depth, 127, 1e-9, 'unfilled depth comes off the winding depth');
});

test('shock stress check follows the handbook beam and spring formulas', () => {
  const Q = 20 * 9.81, s = engine.run('shock-stress-check').values;
  near(s.ps, Q * 50 * 1000 / (4 * 8.33e6), 1e-12, 'static stress QaL ÷ 4I');
  near(s.y, Q * 1000 ** 3 / (48 * 200000 * 8.33e6), 1e-12, 'static deflection QL³ ÷ 48EI');
  near(s.p, s.ps * (1 + Math.sqrt(1 + 2 * 50 / s.y)), 1e-9, 'p = ps(1 + √(1 + 2h ÷ y))');
  near(s.approx, 50 * Math.sqrt(6 * Q * 50 * 200000 / (1000 * 8.33e6)), 1e-9, 'approximation a√(6QhE ÷ LI)');
  near(engine.run('shock-stress-check', { h: 0 }).values.factor, 2, 1e-12, 'a sudden load doubles the static stress');
  for (const member of ['cant', 'fixed']) {
    const r = engine.run('shock-stress-check', { member, h: 1e6 }).values;
    near(r.p / r.approx, 1, 0.01, `${member}: the approximation holds for a large drop`);
  }
  near(engine.run('shock-stress-check', { member: 'cant' }).values.y, Q * 1e9 / (3 * 200000 * 8.33e6), 1e-12, 'cantilever deflection QL³ ÷ 3EI');
  near(engine.run('shock-stress-check', { member: 'fixed' }).values.y, Q * 1e9 / (192 * 200000 * 8.33e6), 1e-12, 'fixed-ended deflection QL³ ÷ 192EI');
  const r = engine.run('shock-stress-check', { member: 'round' }).values, fsr = 8 * Q * 50 / (Math.PI * 216);
  near(r.ps, fsr, 1e-12, 'round wire 8QD ÷ πd³');
  near(r.p, fsr * (1 + Math.sqrt(1 + 79300 * 50 * 6 ** 4 / (4 * Q * 50 ** 3 * 8))), 1e-9, 'round wire table formula');
  const sq = engine.run('shock-stress-check', { member: 'square' }).values;
  near(sq.p, 9 * Q * 50 / (4 * 216) * (1 + Math.sqrt(1 + 79300 * 50 * 6 ** 4 / (0.9 * Math.PI * Q * 50 ** 3 * 8))), 1e-9, 'square wire table formula');
  near(r.approx / (r.ps * Math.sqrt(2 * 50 / r.y)), 1.27 * Math.PI / 4, 1e-12, 'round spring: the approximation is f_s √(2h ÷ y) with 4 ÷ π printed as 1.27');
  const mv = engine.run('shock-stress-check', { load: 'move', M: 20, vel: 2 }).values;
  near(mv.E0, 0.5 * 20 * 4, 1e-12, 'kinetic energy ½Mv²');
  near(mv.peak, 50 * Math.sqrt(6 * 40000 * 200000 / (1000 * 8.33e6)), 1e-9, 'moving body: ½Mv² in place of Qh');
});

test('thin ring check matches the handbook constants and a direct energy integration', () => {
  const v = engine.run('thin-ring-load-check').values, P = 3000, D = 200, d = 20, E = 200000, I = Math.PI * d ** 4 / 64;
  near(v.S, 1.621 * P * D / d ** 3, 0.0002 * v.S, 'S = 1.621 PD ÷ d³ for a round bar');
  near(v.Pallow, 0.617 * 150 * d ** 3 / D, 0.001 * v.Pallow, 'P = 0.617 S d³ ÷ D');
  near(v.dv, 0.0186 * P * D ** 3 / (E * I), 0.0003 * v.dv, 'increase = 0.0186 PD³ ÷ EI');
  near(v.dh / v.dv, 0.92, 0.002, 'decrease about 92 % of the increase');
  // Castigliano on a quarter ring: M(θ) = PR(1/π − sin θ ÷ 2); δ = 4 ∫ M (∂M/∂P) R dθ ÷ EI, by Simpson's rule.
  const R = D / 2, n = 2000, h = Math.PI / 2 / n; let s = 0;
  for (let i = 0; i <= n; i++) { const t = i * h, M = P * R * (1 / Math.PI - Math.sin(t) / 2); s += M * M / P * R * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2); }
  near(v.dv, 4 * s * h / 3 / (E * I), 1e-9, 'vertical diameter change by integration');
  near(engine.run('thin-ring-load-check', { sec: 'rect', b: 10 }).values.I, 10 * 20 ** 3 / 12, 1e-9, 'rectangular section b d³ ÷ 12');
  near(engine.run('thin-ring-load-check', { sec: 'user', Iu: I }).values.S, v.S, 1e-12, 'other section with the same I gives the same stress');
});

test('fifty-ninth-pass tools give pass and fail verdicts and reject bad inputs', () => {
  assert.equal(engine.run('gear-pitting-geometry-factor').text, 'GEOMETRY FACTOR SUPPORTS THE RATING');
  assert.equal(engine.run('gear-pitting-geometry-factor', { Iused: 0.13 }).text, 'GEOMETRY FACTOR BELOW THE VALUE USED');
  assert.equal(engine.run('fine-pitch-worm-design').text, 'WORM SET MEETS THE CENTRE DISTANCE');
  assert.equal(engine.run('fine-pitch-worm-design', { Ct: 80 }).text, 'CENTRE DISTANCE OFF TARGET');
  assert.equal(engine.run('fine-pitch-worm-design', { dmax: 20 }).text, 'WORM DIAMETER OUTSIDE RANGE');
  assert.equal(engine.run('internal-gear-pin-measurement').text, 'READING WITHIN LIMITS');
  assert.equal(engine.run('internal-gear-pin-measurement', { Mmeas: 117.3 }).text, 'READING OUTSIDE LIMITS');
  assert.equal(engine.run('wire-rope-sheave-drum-check').text, 'ROPE, SHEAVE AND DRUM SUIT THE DUTY');
  assert.equal(engine.run('wire-rope-sheave-drum-check', { pAllow: 2 }).text, 'SHEAVE PRESSURE TOO HIGH');
  assert.equal(engine.run('wire-rope-sheave-drum-check', { SFreq: 8 }).text, 'ROPE FACTOR TOO LOW WITH BENDING');
  assert.equal(engine.run('wire-rope-sheave-drum-check', { Lreq: 900 }).text, 'DRUM TOO SMALL FOR THE ROPE');
  assert.equal(engine.run('shock-stress-check').text, 'SHOCK STRESS WITHIN ALLOWABLE');
  assert.equal(engine.run('shock-stress-check', { h: 2000 }).text, 'SHOCK STRESS ABOVE ALLOWABLE');
  assert.equal(engine.run('thin-ring-load-check').text, 'RING WITHIN LIMITS');
  assert.equal(engine.run('thin-ring-load-check', { P: 4000 }).text, 'RING OVERSTRESSED');
  assert.equal(engine.run('thin-ring-load-check', { dMax: 0.1 }).text, 'RING DEFLECTS TOO MUCH');
  const cases: Array<[string, Inputs]> = [
    ['gear-pitting-geometry-factor', { n1: 60 }], ['gear-pitting-geometry-factor', { Cr: 100 }], ['gear-pitting-geometry-factor', { do1: 86 }], ['gear-pitting-geometry-factor', { do1: 110, do2: 245 }],
    ['fine-pitch-worm-design', { dmin: 60 }], ['internal-gear-pin-measurement', { eMin: 0.2 }], ['internal-gear-pin-measurement', { Di: 125 }], ['internal-gear-pin-measurement', { dp: 20 }],
    ['wire-rope-sheave-drum-check', { Hf: 400 }], ['shock-stress-check', { load: 'move', vel: 0 }], ['shock-stress-check', { member: 'round', dw: 60 }], ['thin-ring-load-check', { d: 250 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Sixtieth handbook pass (handbook83): tools from the page ledger's candidate pages.
// Expected values are the handbook's own worked examples (worm Example 3, the industrial worm examples and commercial 29/4 series,
// the tap marking examples, the slot and high-speed milling costs) and independent closed forms.
const IN83 = 25.4;
const D2R83 = Math.PI / 180;

test('worm cutter profile correction reproduces the handbook Example 3 (2 in cutter, 20 in wheel)', () => {
  // Worm of Example 1: r = 0.4410 in, λ = 30°, φn = 20°, 10 threads, addendum 0.0441 in.
  const v = engine.run('worm-cutter-profile-correction', { d: 0.882 * IN83, a: 0.0441 * IN83, Dc: 2 * IN83, Dw: 20 * IN83 }).values;
  near(v.rni / IN83, 0.6033, 0.00006, 'ρ_ni = 0.6033 in');
  near(v.rnC / IN83, 0.9581, 0.0001, 'ρ_n cutter = 0.9581 in');
  near(v.rnW / IN83, 0.6387, 0.0001, 'ρ_n wheel = 0.6387 in');
  near(v.dphiC, 24.99, 0.01, 'Δφ cutter = 24.99 minutes');
  near(v.dphiW, 3.749, 0.001, 'Δφ wheel = 3.749 minutes');
  near(v.q / IN83, 0.0469, 0.00005, 'q = 0.0469 in');
  near(v.yC / IN83, 0.00115, 0.000005, 'y cutter = 0.00115 in');
  near(v.yW / IN83, 0.00172, 0.000005, 'y wheel = 0.00172 in');
  near(v.sC / IN83, 0.000682, 0.000002, 's cutter = 0.000682 in');
  near(v.sW / IN83, 0.000102, 0.000001, 's wheel = 0.000102 in');
  near(v.dy / IN83, 0.00057, 0.000006, 'Δy = 0.00057 in');
  near(v.ds / IN83, 0.00058, 0.000003, 'Δs = 0.000580 in');
  // Lengths scale: Δφ is dimensionless and y, s grow with the scale.
  const k = engine.run('worm-cutter-profile-correction', { d: 2 * 0.882 * IN83, a: 2 * 0.0441 * IN83, Dc: 4 * IN83, Dw: 40 * IN83 }).values;
  near(k.dphiC, v.dphiC, 1e-9, 'pressure angle change is scale-free');
  near(k.dy, 2 * v.dy, 1e-12, 'profile correction scales with size');
  near(0.000582, 2 * Math.tan(Math.PI / 10800), 3e-7, '0.000582 is twice tan 1′');
});

test('industrial worm gearing reproduces the handbook examples and the commercial 29/4 series', () => {
  const r = (over: Inputs) => engine.run('industrial-worm-gearing-design', over).values;
  const fixed = r({ P: 0.5 * IN83, t: 6, T: 36, C: 3.6 * IN83 });
  near(fixed.D / IN83, 5.729, 0.0006, '36/6 at 0.5 in: D = 5.729 in');
  near(fixed.d / IN83, 1.471, 0.0007, 'd = 1.471 in');
  near(fixed.lamDeg, 33, 0.05, 'lead angle about 33°');
  // Commercial series, ratio 7¼ (29 teeth, 4 threads): C, P → d, D, lead angle (degrees and minutes).
  const series: Array<[number, number, number, number, number]> = [[4, 0.6875, 1.654, 6.346, 27 + 54 / 60], [5, 0.875, 1.923, 8.077, 30 + 5 / 60], [6, 1.0625, 2.192, 9.808, 31 + 41 / 60], [7, 1.25, 2.461, 11.539, 32 + 53 / 60], [8.25, 1.4687, 2.942, 13.558, 32 + 27 / 60]];
  for (const [C, P, d, D, lam] of series) {
    const x = r({ P: P * IN83, t: 4, T: 29, C: C * IN83 });
    near(x.d / IN83, d, 0.0006, `C ${C}: d`);
    near(x.D / IN83, D, 0.0006, `C ${C}: D`);
    near(x.lamDeg, lam, 1.2 / 60, `C ${C}: lead angle`);
  }
  // Choosing the worm instead gives C = (D + d) ÷ 2.
  const chosen = r({ mode: 'd', dw: 40 });
  near(chosen.C, (chosen.D + 40) / 2, 1e-12, 'centre distance from the chosen worm');
  // AGMA proportions on axial pitch, single and double thread; dedendum and clearance.
  const two = r({ t: 2, T: 41, depth: 'axial', mode: 'd', dw: 50 });
  near(two.a, 0.318 * 12.7, 1e-12, 'a = 0.318 P');
  near(two.W, 0.686 * 12.7, 1e-12, 'W = 0.686 P');
  near(two.c, two.W - 2 * two.a, 1e-12, 'clearance');
  near(two.F, 2.38 * 12.7 + 0.25 * IN83, 1e-9, 'face width 2.38 P + 0.25 in');
  near(two.D0thr, two.Dt + 0.4775 * 12.7, 1e-9, 'D0 = Dt + 0.4775 P');
  near(two.G, 12.7 * (4.5 + 0.02 * 41), 1e-9, 'thread length');
  near(fixed.a, 0.286 * fixed.Pn, 1e-12, 'triple-and-over addendum on the normal pitch');
  const integ = r({ mount: 'integral' });
  near(integ.F / IN83, 3.6 ** 0.875 / 3, 1e-9, 'integral worm face width C^0.875 ÷ 3');
  near(fixed.dEmp / IN83, 3.6 ** 0.75 + 2.2, 1e-9, 'empirical worm diameter');
  // Rubbing speed against 0.262 d n sec λ ft/min; efficiency formulas.
  near(fixed.V, 0.262 * (fixed.d / IN83) * 1450 / Math.cos(fixed.lamDeg * D2R83) * 0.3048 / 60, 0.002 * fixed.V, 'rubbing speed');
  const lam = fixed.lamDeg * D2R83, pf = Math.atan(0.05);
  near(fixed.Ew, 100 * Math.tan(lam) / Math.tan(lam + pf), 1e-9, 'worm driving efficiency');
  near(fixed.Eg, 100 * Math.tan(lam - pf) / Math.tan(lam), 1e-9, 'wormgear driving efficiency');
  near(fixed.EwEmp, 97, 1e-12, '100 − R ÷ 2');
  near(fixed.EgEmp, 88, 1e-12, '100 − 2R');
  assert.equal(r({ t: 1, T: 60, mode: 'd', dw: 80, f: 0.1 }).Eg, 0, 'self-locking at a lead angle below the friction angle');
});

test('worm hob design solves the AGMA sharpening allowance with the diameters and the flute rules', () => {
  const v = engine.run('worm-hob-design').values, L = 2 * 12.7;
  near(v.O, 50.8 + 2 * 4.04 + 2 * 0.84 + v.S, 1e-9, 'O = D + 2A + 2C + S');
  near(v.Dh, v.O - 2 * 4.04 - 2 * 0.84, 1e-9, 'D_h = O − (2A + 2C)');
  near(v.root, 50.8 - 2 * 4.04, 1e-12, 'root = D − 2A');
  const H = Math.atan(Math.PI * v.Dh / L) / D2R83, h = Math.atan(Math.PI * v.O / L) / D2R83;
  near(v.S, 0.075 * v.Pn * (16 - (h - H)) / 16 + 0.010 * IN83, 1e-9, 'S satisfies the AGMA formula at its own diameters');
  near(v.setDeg, Math.atan(L / (Math.PI * 50.8)) / D2R83 - Math.atan(L / (Math.PI * v.Dh)) / D2R83, 1e-9, 'setting angle = worm − hob lead angle');
  assert.ok(v.setDeg > 0, 'an over-size hob has a smaller lead angle');
  near(v.Frule, 3 * v.O / (2 * 12.7), 1e-12, 'flutes ≈ 3 × diameter ÷ (2 × pitch)');
  near(v.gash, 0.4 * Math.PI * v.O / 9, 1e-9, 'gash width 0.4 × flute pitch');
  // Helical flutes: N = F ÷ cos² α (F = 7, α = 35° gives 10.432) and the modified flute lead L F ÷ (N − F).
  near(7 / Math.cos(35 * D2R83) ** 2, 10.432, 0.0005, 'handbook N for F = 7, α = 35°');
  const hel = engine.run('worm-hob-design', { Fl: 7, fl: 'helical', Nrel: 10 }).values;
  near(hel.Nex, 7 / Math.cos(hel.lamHdeg * D2R83) ** 2, 1e-9, 'teeth per turn along the thread');
  near(hel.Lf, L * 7 / 3, 1e-9, 'flute lead = hob lead × 7 ÷ 3 for N = 10');
  near(engine.run('worm-hob-design', { Fl: 7, fl: 'helical', Nrel: 10.5 }).values.Lf, L * 7 / 3.5, 1e-9, 'flute lead for N = 10½');
  near(hel.angF, Math.atan(Math.PI * hel.Dh / hel.Lf) / D2R83, 1e-9, 'flute angle from the axis');
  // Common factors: 2 threads with 8 flutes, and 3 threads with 36 teeth (the handbook prefers 5 threads there).
  const bad = engine.run('worm-hob-design', { Fl: 8 });
  assert.equal(bad.text, 'CHANGE THE FLUTES OR THREADS');
  assert.equal(bad.values.Fsug, 7, 'suggested flutes nearest the rule with no common factor');
  assert.equal(engine.run('worm-hob-design', { t: 3, Tg: 36, Fl: 7 }).text, 'CHANGE THE FLUTES OR THREADS');
  assert.equal(engine.run('worm-hob-design', { t: 3, Tg: 28, Fl: 7 }).text, 'HOB LAYOUT FOLLOWS THE HANDBOOK RULES');
});

test('metric and Unified tap thread limits reproduce the handbook marking examples', () => {
  // M1.6 × 0.35 HS G D3: maximum 1.412, minimum 1.397 (Z = 0.015); M6 × 1 DU4: minimum 5.298, maximum 5.323 (Z = 0.025).
  const d3 = engine.run('metric-tap-thread-limits', { D: 1.6, P: 0.35, lim: 'D', num: 3, X: 0.025, Y: 0.039, Z: 0.015, PDm: 1.405, Mm: 1.64 }).values;
  near(d3.bPD, 1.3727, 0.00005, 'basic PD 1.3727');
  near(d3.maxPD, 1.412, 0.0005, 'maximum tap PD');
  near(d3.minPD, 1.397, 0.0005, 'minimum tap PD');
  near(d3.limNo, 3, 1e-9, 'D3');
  near(d3.minMaj, 1.6 + 0.08 * 0.35, 1e-8, 'standard-size tap: minimum major = basic + W');
  const du4 = engine.run('metric-tap-thread-limits', { lim: 'DU', num: 4 }).values;
  near(du4.minPD, 5.298, 0.0005, 'DU4 minimum');
  near(du4.maxPD, 5.323, 0.0005, 'DU4 maximum');
  const std = engine.run('metric-tap-thread-limits').values;
  near(std.maxPD - std.bPD, 0.065, 1e-12, 'standard maximum = basic + Y');
  near(std.limNo, 5, 1e-9, 'Y = 0.065 is D5');
  near(std.maxMaj - std.minMaj, 0.041, 1e-12, 'major tolerance X');
  const over = engine.run('metric-tap-thread-limits', { lim: 'D', num: 7 }).values;
  near(over.minMaj - std.minMaj, 0.026, 1e-9, 'an oversize tap carries a larger major diameter');
  // 3/8-16 NC HS H1: maximum 0.3349, minimum 0.3344; L2: minimum 0.3334, maximum 0.3339 (D = 0.0005).
  const u = (o: Inputs) => engine.run('unified-tap-thread-limits', o).values;
  const h1 = u({ lim: 'H', num: 1 });
  near(h1.bPD, 0.3344, 0.00005, 'basic PD 0.3344');
  near(h1.maxPD, 0.3349, 0.00005, 'H1 maximum');
  near(h1.minPD, 0.3344, 0.00005, 'H1 minimum');
  const l2 = u({ lim: 'L', num: 2 });
  near(l2.minPD, 0.3334, 0.00005, 'L2 minimum');
  near(l2.maxPD, 0.3339, 0.00005, 'L2 maximum');
  near(l2.limNo, 2, 1e-9, 'L2 number');
  const plus = u({ D: 7 / 16, n: 14, C: 0.0017 });
  near(plus.minPD - plus.bPD, 0.0017, 1e-12, '7/16-14 plus 0.0017: minimum = basic + 0.0017');
  near(plus.maxPD - plus.minPD, 0.0005, 1e-12, 'maximum = minimum + 0.0005');
  // Table 2 constants by formula: A = 0.130 P, B by threads per inch.
  for (const [n, A, B] of [[80, 0.0016, 0.0011], [48, 0.0027, 0.0018], [40, 0.0032, 0.0019], [16, 0.0081, 0.0041], [12, 0.0108, 0.0054], [4, 0.0325, 0.0162]]) {
    const x = u({ n, D: 1, PDm: 0.9, Mm: 1 });
    near(x.A, A, 0.00006, `A at ${n} TPI`);
    near(x.B, B, 0.00006, `B at ${n} TPI`);
  }
  const s = u({});
  near(s.maxMaj, 0.375 + 0.13 / 16, 1e-8, 'standard tap: maximum major = basic + A');
});

test('slot against high-speed milling reproduces the handbook cost examples', () => {
  // HR = $50, Dist = 1000 mm, T = 45 min; T_V = 14 min (6 teeth) and 6 min (2 teeth).
  const speed = (FR: number, z: number, fz: number) => FR * Math.PI * 25 / (1000 * z * fz);
  const cost = (FR: number, z: number, fz: number, TV: number) => engine.run('slot-vs-high-speed-milling-cost', { VS: speed(FR, z, fz), zS: z, fzS: fz, trS: TV, ceS: 0 }).values;
  near(cost(3230, 6, 0.17, 14).cS, 0.338, 0.0005, 'slot, 6 teeth, FR 3230');
  near(cost(1480, 2, 0.17, 6).cS, 0.638, 0.0005, 'slot, 2 teeth, FR 1480');
  const hs = (FR: number, z: number, TV: number) => engine.run('slot-vs-high-speed-milling-cost', { VH: speed(FR, z, 0.628), zH: z, trH: TV, ceH: 0 }).values.cH;
  near(hs(18000, 6, 14), 0.0607, 0.0002, 'high-speed, 6 teeth, FR 18000 (printed 0.0606)');
  near(hs(5250, 2, 6), 0.180, 0.0005, 'high-speed, 2 teeth, FR 5250');
  const v = engine.run('slot-vs-high-speed-milling-cost').values;
  near(v.TVS, 2 + 60 * 10 / 50, 1e-12, 'T_V = T_RPL + 60 C_E ÷ HR');
  near(v.rpmH, 1000 * 375 / (Math.PI * 25), 1e-9, 'rpm = 1000 V ÷ (π D)');
  near(v.FRH, 6 * 0.628 * v.rpmH, 1e-9, 'FR = z f_z rpm');
  near(v.saveBatch, 100 * (v.cS - v.cH), 1e-9, 'saving per batch');
  near(engine.run('slot-vs-high-speed-milling-cost', { pH: 4 }).values.cH, 4 * v.cH, 1e-12, 'cost grows with passes');
});

test('sixtieth-pass tools give pass and fail verdicts and reject bad inputs', () => {
  assert.equal(engine.run('worm-cutter-profile-correction').text, 'CORRECT THE CUTTER OR WHEEL');
  assert.equal(engine.run('worm-cutter-profile-correction', { tolY: 0.02, tolS: 0.02 }).text, 'WORMS ALIKE WITHIN TOLERANCE');
  assert.equal(engine.run('industrial-worm-gearing-design').text, 'WORM SET FOLLOWS THE HANDBOOK RULES');
  assert.equal(engine.run('industrial-worm-gearing-design', { phi: 14.5 }).text, 'REVIEW THE WORM SET PROPORTIONS');
  assert.equal(engine.run('industrial-worm-gearing-design', { depth: 'axial' }).text, 'REVIEW THE WORM SET PROPORTIONS');
  assert.equal(engine.run('industrial-worm-gearing-design', { T: 30, t: 5 }).text, 'REVIEW THE WORM SET PROPORTIONS');
  assert.equal(engine.run('worm-hob-design').text, 'HOB LAYOUT FOLLOWS THE HANDBOOK RULES');
  assert.equal(engine.run('metric-tap-thread-limits').text, 'TAP WITHIN ITS LIMITS');
  assert.equal(engine.run('metric-tap-thread-limits', { PDm: 5.42 }).text, 'TAP OUTSIDE ITS LIMITS');
  assert.equal(engine.run('metric-tap-thread-limits', { Mm: 6.2 }).text, 'TAP OUTSIDE ITS LIMITS');
  assert.equal(engine.run('unified-tap-thread-limits').text, 'TAP WITHIN ITS LIMITS');
  assert.equal(engine.run('unified-tap-thread-limits', { PDm: 0.334 }).text, 'TAP OUTSIDE ITS LIMITS');
  assert.equal(engine.run('slot-vs-high-speed-milling-cost').text, 'HIGH-SPEED MILLING COSTS LESS');
  assert.equal(engine.run('slot-vs-high-speed-milling-cost', { pH: 10 }).text, 'SLOT MILLING COSTS LESS');
  const slow = engine.run('slot-vs-high-speed-milling-cost', { nmax: 4000 });
  assert.equal(slow.tone, 'bad');
  assert.ok(slow.checks.some((c: { status: string }) => c.status === 'fail'), 'spindle speed above the machine fails');
  const cases: Array<[string, Inputs]> = [
    ['worm-cutter-profile-correction', { Dw: 40 }], ['industrial-worm-gearing-design', { C: 50 }], ['worm-hob-design', { A: 30 }], ['worm-hob-design', { fl: 'helical', Nrel: 9 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});
// Sixty-first handbook pass (handbook84): tools from open pages of the page ledger.
// Expected values are the handbook's own tables and examples (compound indexing Table 1b and the 127-division example, the
// Heim factor table and hammer example, the hydraulic press capacity table, the silent chain hub and hob tables, the helical
// gear example) and independent closed forms.
const IN84 = 25.4;

test('compound indexing reproduces the handbook Table 1b movements and the 127-division example', () => {
  const chk = (N: number, w: number, a: number, A: number, b: number, B: number, R: number, sign = 'plus') =>
    engine.run('compound-indexing', { mode: 'check', N, w, a, A, b, B, R, sign }).values;
  // Approximate movements: [N, whole, a, A, b, B, revolutions, precise divisions, diameter at which error = 0.001]
  const rows: Array<[number, number, number, number, number, number, number, number, number]> = [
    [51, 7, 41, 47, 37, 49, 11, 51.00005, 322.55], [53, 0, 26, 29, 19, 31, 2, 52.99926, 22.89], [53, 5, 43, 47, 43, 49, 9, 53.00006, 263.9],
    [167, 0, 6, 37, 39, 49, 4, 167.00058, 92.34], [199, 0, 26, 37, 13, 43, 5, 198.99937, 101.29], [209, 0, 9, 41, 8, 49, 2, 208.9987, 51.16],
    [219, 0, 24, 39, 14, 47, 5, 218.99642, 19.45], [242, 0, 4, 37, 19, 49, 3, 242.00222, 34.63], [244, 0, 36, 39, 11, 49, 7, 243.99453, 14.19],
  ];
  for (const [N, w, a, A, b, B, R, Np, D] of rows) {
    const x = chk(N, w, a, A, b, B, R);
    near(x.Np, Np, 0.000006, `${N}: precise divisions`);
    near(x.measure, D, 0.006, `${N}: diameter at which error = 0.001`);
    assert.equal(x.exact, 0);
  }
  // Exact movements from the table.
  for (const [N, a, A, b, B] of [[51, 10, 15, 2, 17], [52, 30, 39, 0, 15], [54, 20, 27, 0, 15], [152, 5, 19, 0, 15], [160, 4, 16, 0, 15]]) {
    const x = chk(N, 0, a, A, b, B, 1);
    assert.equal(x.exact, 1, `${N}: exact`);
    near(x.Np, N, 1e-12, `${N}: divisions`);
    near(x.err, 0, 1e-12, `${N}: no error`);
  }
  // Example: 127 teeth, 16 DP (about 7.9 in), first approximation 42/47 + 2/39 over 3 revolutions.
  const ex = engine.run('compound-indexing', { mode: 'check', N: 127, w: 0, a: 42, A: 47, b: 2, B: 39, R: 3, dia: 7.9 * IN84 }).values;
  near(ex.Np, 126.99769, 0.000006, '127: precise divisions 126.99769');
  near(ex.measure, 17.5, 0.006, '127: diameter at which error = 0.001 is 17.50');
  near(ex.err / IN84, 0.00045, 0.000005, '127: error at 7.9 in about 0.00045 in');
  near(ex.err / IN84, (7.9 / ex.measure) * 0.001, 1e-12, 'error = (diameter ÷ measure) × 0.001');
});

test('compound indexing search finds simple, exact compound and the best approximate movements', () => {
  const s35 = engine.run('compound-indexing', { N: 35 });
  assert.equal(s35.text, 'SIMPLE INDEXING IS EXACT');
  assert.deepEqual([s35.values.w, s35.values.a, s35.values.A], [1, 3, 21], '35 divisions: 1 turn and 3 holes in 21 (fewest holes)');
  const s51 = engine.run('compound-indexing', { N: 51 });
  assert.equal(s51.text, 'COMPOUND INDEXING IS EXACT');
  const v = s51.values;
  near(v.w + v.a / v.A + v.sign * v.b / v.B, 40 / 51, 1e-12, '51: movement = 40 ÷ 51 turns');
  const cin = engine.run('compound-indexing', { N: 51, plates: 'cin' });
  assert.equal(cin.text, 'SIMPLE INDEXING IS EXACT', 'Cincinnati side 2 has a 51-hole circle');
  // 53 has no exact movement on the Brown & Sharpe plates; the search does at least as well as the table at each revolution count.
  const b2 = engine.run('compound-indexing', { N: 53, Rmax: 2, tol: 0.000001 });
  assert.equal(b2.text, 'NO MOVEMENT WITHIN TOLERANCE');
  assert.ok(b2.values.measure >= 22.89 - 0.006, '53 within 2 revolutions: at least the table’s 22.89');
  const b13 = engine.run('compound-indexing', { N: 53, Rmax: 13, tol: 0.000001 }).values;
  assert.ok(b13.measure >= 263.9 - 0.006, '53 within 13 revolutions: at least the table’s 263.90');
  const c127 = engine.run('compound-indexing', { N: 127, tol: 0.000001 }).values;
  assert.ok(c127.measure >= 218.98 - 0.01, '127: at least the table’s best 218.98');
  // The recommended approximation is the fewest revolutions within tolerance.
  const loose = engine.run('compound-indexing', { N: 127, tol: 1 });
  assert.equal(loose.text, 'APPROXIMATE INDEXING WITHIN TOLERANCE');
  assert.ok(loose.values.err <= 1);
  assert.equal(engine.run('compound-indexing', { mode: 'check', N: 52, w: 0, a: 30, A: 39, b: 0, B: 15, R: 2 }).text, 'MOVEMENT REPEATS DIVISIONS');
});

test('Unified thread gauge sizes follow the ANSI B1.2 Table 5 formulas', () => {
  const v = engine.run('unified-thread-gauge-limits').values; // 1/4-20 UNC-2A/2B
  const p = 1 / 20, Hs = 0.866025 * p;
  near(v.H, Hs, 1e-12, 'H = 0.866025 p');
  near(v.goRingPD, 0.2164, 1e-12, 'GO ring PD = max PD');
  near(v.goRingMinor, 0.2164 - Hs / 2, 1e-12, 'GO ring minor = max PD − H/2');
  near(v.ngRingMinor, 0.2127 - Hs / 4, 1e-12, 'NOT GO ring minor = min PD − H/4');
  near(v.ngPlugMaj, 0.2224 + Hs / 2, 1e-12, 'NOT GO plug major = max PD + H/2');
  near(v.trunc, 0.06 * Math.cbrt(p * p) + 0.017 * p, 1e-12, 'truncation 0.060 ∛p² + 0.017p');
  near(v.trunc, 0.0089933, 0.0000001, '20 TPI truncation');
  near(v.setGoTrunc, 0.2489 - v.trunc, 1e-12, 'GO setting plug truncated major');
  near(v.setNgTrunc, 0.2127 + Hs / 2, 1e-12, 'NOT GO setting plug truncated major');
  assert.equal(v.crest, 0, 'coarse pitch: full NOT GO setting plug major = max major');
  near(v.setNgFull, 0.2489, 1e-12, 'full portion = max major');
  // Fine pitch: the 0.001 in crest rule applies (sample limits for 80 TPI).
  const f = engine.run('unified-thread-gauge-limits', { n: 80, eMaj: 0.0595, eMajMin: 0.0563, ePDmax: 0.0514, ePDmin: 0.0496, iMaj: 0.06, iPDmin: 0.0519, iPDmax: 0.0542, iMinMin: 0.0465, iMinMax: 0.0514, xPD: 0.0002, xMaj: 0.0003, plain: 0.00004 }).values;
  assert.equal(f.crest, 1);
  near(f.setNgFull, 0.0595 + 0.216506 / 80 - (0.0018 + 0.0017), 1e-12, 'max major + 0.216506p − (PD tol + 0.0017)');
  // The rule is the diameter at which a 60° thread on the minimum pitch diameter has a 0.001 in crest (0.0017 ≈ 0.001 √3).
  near(f.setNgFull, 0.0496 + 0.0595 - 0.0514 - 0.649519 / 80 + 0.866025 / 80 - 0.0017, 0.00001, 'crest-width geometry');
  near(0.0017, 0.001 * Math.sqrt(3), 0.00004, '0.0017 ≈ 0.001 √3');
});

test('Heim hammer test reproduces Table 6 and the handbook example', () => {
  const B = [[0.1, 1.01], [0.15, 1.63], [0.2, 2.31], [0.25, 3.08], [0.3, 3.94], [0.35, 4.9], [0.4, 5.97], [0.45, 7.17], [0.5, 8.52], [0.55, 10.03], [0.6, 11.73]];
  for (const [A, b] of B) {
    const x = engine.run('forging-hammer-efficiency', { D: 60, H0: 90, H1: 90 * (1 - A) }).values;
    near(x.A, A, 1e-12, `A = ${A}`);
    near(x.B, b, 0.0076, `Table 6: B at A = ${A}`);
  }
  // 100 kg (220 lb) hammer, 180 blows/min, 1.97 in × 2.95 in cylinder with A = 0.35, 10.3 hp supplied.
  const ex = engine.run('forging-hammer-efficiency', { D: 1.97 * IN84, H0: 2.95 * IN84, H1: 2.95 * 0.65 * IN84, bpm: 180, Pin: 10.3 * 0.7456999 }).values;
  near(ex.Wft, 1376, 1.5, 'work per blow 1376 ft·lb (handbook rounds B to 4.9)');
  near(ex.PuFt, 4128, 5, '4128 ft·lb per second');
  near(ex.eff, 4128 / (10.3 * 550) * 100, 0.1, 'efficiency 4128 ÷ 5665 (handbook: 72 per cent)');
  near(ex.WJ, ex.Wft * 1.3558179483, 1e-9, 'joules');
});

test('hydraulic press capacity reproduces the handbook table and pressure rules', () => {
  const PSI = 0.0689476; // bar per psi
  const cases: Array<[number, number, number]> = [[10, 3100, 122], [10, 3200, 126], [10, 3900, 153], [10, 4000, 157], [20, 4000, 628]];
  for (const [D, P, C] of cases) {
    const x = engine.run('press-gauge-pressure-for-work', { D: D * IN84, P: P * PSI, Pmax: 300 }).values;
    near(x.Fst, C, 0.55, `${D} in ram at ${P} psi: ${C} tons`);
    near(x.Fst, 0.7854 * D * D * P / 2000, 0.0001 * C, 'C = 0.7854 D² P ÷ 2000 (printed rounded as 0.00039 D² P)');
  }
  const v = engine.run('press-gauge-pressure-for-work').values;
  near(v.Pneed / 10, 20000 * 40 / (0.7854 * 250 * 250), 0.0002, 'P = A Pa ÷ (0.7854 D²)');
  near(v.PaAt, v.FkN * 1000 / 20000, 1e-12, 'Pa = force ÷ area of work');
  near(v.FneedkN, 800, 1e-12, 'force for the pressure wanted');
});

test('permanent-magnet motor constants follow the handbook definitions', () => {
  const v = engine.run('pm-dc-motor-constants').values;
  const w = 4580 * 2 * Math.PI / 60;
  near(v.Ist, 48 / 1.2, 1e-12, 'I_STo = V ÷ R');
  near(v.KT, 4 / 40, 1e-12, 'K_T = T_STo ÷ I_STo');
  near(v.KE, 48 / w, 1e-12, 'K_E = V ÷ ω_NL');
  near(v.KM, 0.1 / Math.sqrt(1.2), 1e-12, 'K_M = K_T ÷ √R');
  near(v.DM, 4 / w, 1e-12, 'D_M = T_STo ÷ ω_NL');
  near(v.TM, 0.00012 / v.DM, 1e-12, 'T_M = J_M ÷ D_M');
  near(v.TL, 0.1 * 20, 1e-12, 'T_L = K_T × I_L');
  near(v.nL, 4580 * (1 - 2 / 4), 1e-9, 'speed on the straight-line characteristic');
  near(v.fn, Math.sqrt(2000 / 0.0004) / (2 * Math.PI), 1e-9, 'f_n = √(K ÷ J_L) ÷ 2π');
  near(engine.run('pm-dc-motor-constants', { IL: 60 }).values.TL, 4, 1e-12, 'current limit above stall current: torque capped at stall');
});

test('silent chain sprocket reproduces the handbook hub and hob tables', () => {
  const hob = [4.019, 4.341, 4.662, 4.983, 5.304, 5.626, 5.946, 6.265, 6.586, 6.905, 7.226, 7.546, 7.865, 8.185, 8.503];
  hob.forEach((h, i) => {
    const Nt = 17 + i;
    near(engine.run('silent-chain-sprocket-tooth-form', { Nt, P: IN84 }).values.MHD / IN84, h, 0.001, `Table 5 hobbed, ${Nt} teeth`);
    near(engine.run('silent-chain-sprocket-tooth-form', { Nt, P: IN84, cut: 'straddle' }).values.MHD / IN84, h + 0.08, 0.001, `Table 5 straddle, ${Nt} teeth`);
  });
  const hgd: Array<[number, number]> = [[20, 6.163], [28, 8.659], [38, 11.809], [51, 15.924], [69, 21.636], [95, 29.899], [130, 41.026]];
  // Table 10 prints 41.026 in for 130 teeth where the formula gives 41.030 in (0.01 %); the other entries agree to the last digit.
  for (const [Nt, d] of hgd) near(engine.run('silent-chain-sprocket-tooth-form', { Nt, P: IN84 }).values.HGD / IN84, d, Nt === 130 ? 0.005 : 0.0006, `Table 10, 1 in pitch, ${Nt} teeth`);
  near(engine.run('silent-chain-sprocket-tooth-form', { Nt: 20, P: 9.525 }).values.HGD / IN84, 2.311, 0.0006, 'Table 10, 3/8 in pitch, 20 teeth');
  near(engine.run('silent-chain-sprocket-tooth-form', { Nt: 28, P: 9.525 }).values.HGD / IN84, 3.247, 0.0006, 'Table 10, 3/8 in pitch, 28 teeth');
  const v = engine.run('silent-chain-sprocket-tooth-form').values;
  const t = Math.PI / 21, cot = 1 / Math.tan(t);
  near(v.E, 25.4 * (cot - 0.22), 1e-9, 'E');
  near(v.B, 25.4 * Math.sqrt(1.515213 + (cot - 1.1) ** 2), 1e-9, 'B');
  near(v.face, 60 - 720 / 21, 1e-12, 'faces 60° − 720°/N apart');
  near(engine.run('silent-chain-sprocket-tooth-form', { size: 'small', P: 4.7625 }).values.face, 70 - 720 / 21, 1e-12, '3/16 in: 70° − 720°/N');
  near(engine.run('silent-chain-sprocket-tooth-form', { Nt: 12 }).values.face, 0, 1e-12, '12 teeth: faces parallel');
});

test('helical gear helix angle for a centre distance reproduces the handbook example', () => {
  const v = engine.run('helical-gear-helix-for-centre-distance', { mn: IN84 / 6, z1: 18, z2: 30, C: 4.5 * IN84 }).values;
  near(v.cos, 0.88889, 0.000005, 'cos ψ = 0.88889');
  near(v.psi, 27.266, 0.0005, 'ψ = 27.266°');
  near(v.L1 / IN84, 20.5728, 0.0003, 'L1 = 20.5728 in');
  near(v.L2 / IN84, 34.288, 0.0004, 'L2 = 34.2880 in (the handbook rounds sin ψ to 0.45812)');
  near(v.sumD, 2 * 4.5 * IN84, 1e-9, 'pitch diameters add up to 2C');
  near(v.L1, 2 * Math.PI * (v.d1 / 2) / Math.tan(v.psi * Math.PI / 180), 1e-9, 'L = 2πR ÷ tan ψ');
});

test('sixty-first-pass tools give pass and fail verdicts and reject bad inputs', () => {
  assert.equal(engine.run('compound-indexing').text, 'APPROXIMATE INDEXING WITHIN TOLERANCE');
  assert.equal(engine.run('compound-indexing', { mode: 'check' }).text, 'MOVEMENT TOO COARSE');
  assert.equal(engine.run('compound-indexing', { mode: 'check', tol: 0.02 }).text, 'MOVEMENT WITHIN TOLERANCE');
  assert.equal(engine.run('unified-thread-gauge-limits').text, 'GAUGE SIZES SET');
  assert.equal(engine.run('unified-thread-gauge-limits', { xPD: 0.002 }).text, 'GAUGE TOLERANCES OVERLAP');
  assert.equal(engine.run('forging-hammer-efficiency').text, 'HAMMER TESTED');
  assert.equal(engine.run('forging-hammer-efficiency', { Pin: 3 }).text, 'CHECK THE POWER MEASUREMENT');
  assert.equal(engine.run('forging-hammer-efficiency', { H1: 70 }).tone, 'warn');
  assert.equal(engine.run('press-gauge-pressure-for-work').text, 'PRESS REACHES THE PRESSURE ON THE WORK');
  assert.equal(engine.run('press-gauge-pressure-for-work', { Pa: 80 }).text, 'PRESS CANNOT REACH THE PRESSURE');
  assert.equal(engine.run('pm-dc-motor-constants').text, 'RESONANCE ABOVE THE CONTROL BANDWIDTH');
  assert.equal(engine.run('pm-dc-motor-constants', { K: 10 }).text, 'RESONANCE INSIDE THE CONTROL BANDWIDTH');
  assert.equal(engine.run('silent-chain-sprocket-tooth-form').text, 'SPROCKET FORM AND HUB FIT');
  assert.equal(engine.run('silent-chain-sprocket-tooth-form', { hub: 150 }).text, 'CHANGE THE TEETH OR THE HUB');
  assert.equal(engine.run('silent-chain-sprocket-tooth-form', { Nt: 15, hub: 50 }).text, 'CHANGE THE TEETH OR THE HUB');
  assert.equal(engine.run('silent-chain-sprocket-tooth-form', { Nt: 19, hub: 100 }).tone, 'warn');
  assert.equal(engine.run('helical-gear-helix-for-centre-distance').text, 'HELIX ANGLE FITS THE CENTRE DISTANCE');
  assert.equal(engine.run('helical-gear-helix-for-centre-distance', { psiMax: 20 }).text, 'HELIX ANGLE OUTSIDE THE ACCEPTED RANGE');
  const cases: Array<[string, Inputs]> = [
    ['compound-indexing', { mode: 'check', a: 47 }], ['compound-indexing', { mode: 'check', a: 0, b: 2, sign: 'minus' }],
    ['unified-thread-gauge-limits', { ePDmin: 0.22 }], ['unified-thread-gauge-limits', { iMinMax: 0.22 }],
    ['forging-hammer-efficiency', { H1: 80 }], ['helical-gear-helix-for-centre-distance', { C: 96 }], ['helical-gear-helix-for-centre-distance', { psiMin: 50 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});
// Sixty-second handbook pass (handbook85): tools from open and candidate pages of the page ledger.
// Expected values are the handbook's own tables and examples (cutter grinding offset Tables and indicator drop Tables 3 and 4,
// the top knurling example, ASME B94.9 Table 3 constant C) and independent closed forms.
const IN85 = 25.4;

test('cutter clearance grinding reproduces the handbook offset and indicator drop tables', () => {
  const r = (over: Inputs) => engine.run('cutter-clearance-grinding-setup', over).values;
  const above: Array<[number, number[]]> = [[3, [0.026, 0.052, 0.079, 0.105, 0.131, 0.157, 0.183, 0.209, 0.235, 0.26, 0.286, 0.312]], [10, [0.087, 0.175, 0.262, 0.349, 0.436, 0.523, 0.609, 0.696, 0.782, 0.868, 0.954, 1.04]]];
  for (const [w, row] of above) row.forEach((o, i) => near(r({ Dw: w * IN85, cl: i + 1 }).offAbove / IN85, o, 0.0006, `wheel ${w} in above centre, ${i + 1}°`));
  const below = [0.017, 0.035, 0.052, 0.07, 0.087, 0.105, 0.122, 0.139, 0.156, 0.174, 0.191, 0.208];
  below.forEach((o, i) => near(r({ Dc: 2 * IN85, cl: i + 1, d: 1 }).offBelow / IN85, o, 0.0006, `cutter 2 in below centre, ${i + 1}°`));
  const x = r({ Dc: 4 * IN85, Dw: 6 * IN85, cl: 6 });
  near(x.offInline, (6 * IN85) * (4 * IN85) * Math.sin(3 * Math.PI / 180) / (10 * IN85), 1e-12, 'in-line: wheel × cutter × sin(½ clearance) ÷ (wheel + cutter)');
  near(x.offCup, x.offBelow, 1e-12, 'cup wheel: same as the wheel-below table');
  // Table 4 (face rake) and Table 3 (side and end relief): drop = distance × tan(angle).
  const rake: Array<[number, number, number]> = [[1, 0.125, 0.0022], [10, 0.031, 0.0055], [15, 0.094, 0.0252], [20, 0.125, 0.0455], [12, 0.062, 0.0132]];
  for (const [a, dist, drop] of rake) near(r({ rake: a, dist: dist * IN85 }).dropRake / IN85, drop, 0.00006, `Table 4: ${a}° over ${dist} in`);
  const relief: Array<[number, number, number]> = [[1, 0.005, 0.00009], [1, 0.015, 0.00026], [9, 0.005, 0.0008], [9, 0.015, 0.0024]];
  for (const [a, dist, drop] of relief) near(r({ cl: a, dist: dist * IN85 }).dropRelief / IN85, drop, 0.00005, `Table 3: ${a}° over ${dist} in`);
  // Clearance needed, closed form in inches.
  const D = 4, B = 200, L = 1 / 32, F = 0.04, d = 0.125;
  near(r({ Dc: D * IN85, B, L: L * IN85, F: F * IN85, d: d * IN85 }).Cneed, 45860 / (D * B) * (1.5 * L + F / (Math.PI * D) * Math.sqrt(d * (D - d))), 1e-9, 'C = 45860 ÷ DB (1.5L + F ÷ πD √(d(D − d)))');
});

test('spline shaft milling cutter follows the handbook formulas', () => {
  const v = engine.run('spline-shaft-milling-cutter', { Ns: 10, W: 5, d: 42 }).values;
  const A = Math.asin(5 / 42);
  near(v.Bdeg, 36, 1e-12, 'B = 360° ÷ N');
  near(v.A, A * 180 / Math.PI, 1e-9, 'sin A = W ÷ d');
  near(v.C, 42 * Math.sin(Math.PI / 10 - A), 1e-9, 'C = d sin(180°/N − A)');
  // The chord plus the spline widths' chords add up around the root circle: N (C-arc + W-arc) = π d in angle.
  near(10 * (2 * Math.asin(v.C / 42) + 2 * A), 2 * Math.PI, 1e-9, 'angles close around the root circle');
});

test('top knurling reproduces the handbook screw machine example', () => {
  // 5/16 in brass stock, 0.3125 in knurl radius, 32 pitch 90° knurl (depth 0.0156 in), feed 0.005 and 0.008 in/rev.
  const v = engine.run('top-knurling-cam-rise', { Dst: 0.3125 * IN85, Dk: 0.625 * IN85, pc: 0.03125 * IN85, ang: 90, f: 0.005 * IN85 }).values;
  near(v.depth / IN85, 0.0156, 0.00005, 'depth 0.0156 in');
  near(v.c / IN85, 0.12, 0.0005, 'cam rise 0.120 in');
  near(v.revs, 24, 0.1, '24 revolutions at 0.005 in');
  near(engine.run('top-knurling-cam-rise', { Dst: 0.3125 * IN85, Dk: 0.625 * IN85, pc: 0.03125 * IN85, ang: 90, f: 0.008 * IN85 }).values.revs, 15, 0.05, '15 revolutions at 0.008 in');
  const g = engine.run('top-knurling-cam-rise', { depthFrom: 'given', dg: 0.5 }).values;
  near(g.c, Math.sqrt((7.9375 / 2 + 15.875 / 2) ** 2 - (7.9375 / 2 + 15.875 / 2 - 0.5) ** 2), 1e-12, 'c = √((R + r)² − (R + r − d)²)');
});

test('rubber pad pressure matches the handbook inch formula', () => {
  // 1000 tons on 400 sq in: p = 1000 × 2000 ÷ 400 = 5000 psi.
  const v = engine.run('rubber-pad-forming-pressure', { F: 1000 * 8.896443, A: 400 * IN85 * IN85 }).values;
  near(v.ppsi, 5000, 0.5, 'p = F × 2000 ÷ A');
  near(engine.run('rubber-pad-forming-pressure').values.ratio, 3, 1e-12, 'pad thickness ÷ block height');
});

test('angular backlash follows the handbook formulas', () => {
  const v = engine.run('gear-angular-backlash', { Bk: 0.004 * IN85, D: 8 * IN85, d: 2 * IN85, dC: 0, phi: 20 }).values;
  near(v.thD, 6875 * 0.004 / 8, 1e-9, 'θ_D = 6875 B ÷ D');
  near(v.thd, 6875 * 0.004 / 2, 1e-9, 'θ_d = 6875 B ÷ d');
  near(6875, 2 * 180 * 60 / Math.PI, 0.5, '6875 ≈ 2 × 180 × 60 ÷ π');
  near(engine.run('gear-angular-backlash', { dC: 0.05, phi: 20 }).values.dB, 2 * 0.05 * Math.tan(20 * Math.PI / 180), 1e-12, 'Δ backlash = 2 Δc tan φ');
});

test('Unified cut thread tap limits reproduce the ASME B94.9 Table 3 constant C', () => {
  const C: Array<[number, number]> = [[2, 0.0217], [2.5, 0.0173], [3, 0.0144], [3.5, 0.0124], [4, 0.0108], [4.5, 0.0096], [5, 0.0087], [5.5, 0.0079], [7, 0.0077], [8, 0.0068], [9, 0.006], [10, 0.0054], [11, 0.0049], [12, 0.0045], [13, 0.0042], [14, 0.0039], [16, 0.0034], [18, 0.003], [20, 0.0027], [22, 0.0025], [24, 0.0023], [26, 0.0021], [27, 0.002], [28, 0.0019], [30, 0.0018], [32, 0.0017], [36, 0.0015], [40, 0.0014], [48, 0.0011], [50, 0.0011], [56, 0.001], [60, 0.0009], [64, 0.0008], [72, 0.0008], [80, 0.0007]];
  for (const [n, c] of C) near(engine.run('unified-cut-thread-tap-limits', { n, Dn: 3 }).values.C, c, 0.00006, `C at ${n} TPI`);
  // The table prints 0.0078 at 6 TPI; 25 % of the truncation gives 0.0090.
  near(engine.run('unified-cut-thread-tap-limits', { n: 6, Dn: 3 }).values.C, 0.25 * 0.216506 / 6, 1e-12, '6 TPI by the formula');
  const v = engine.run('unified-cut-thread-tap-limits').values; // 1/4-20, A 0.0025, B 0.0005, D 0.0020
  near(v.PDb, 0.25 - 0.649519 / 20, 1e-12, 'basic PD');
  near(v.Mmin, 0.25 + 0.0005 + 0.25 * 0.216506 / 20, 1e-12, 'min major = basic + B + C');
  near(v.Mmax, v.Mmin + 0.0025, 1e-12, 'max major = min major + A');
  near(v.PDmin, v.PDb + 0.0005, 1e-12, 'min PD = basic PD + B');
  near(v.PDmax, v.PDmin + 0.002, 1e-12, 'max PD = min PD + D');
});

test('silent chain width follows the handbook capacity rules', () => {
  const v = engine.run('silent-chain-width').values;
  near(v.capIn, 9 / 1.4, 1e-12, 'capacity per inch = rating ÷ service factor');
  near(v.wNeed / IN85, 30 * 1.4 / 9, 1e-12, 'width = power × SF ÷ rating per inch');
  near(v.capChosen, 127 / IN85 * 9 / 1.4, 1e-12, 'capacity of the chosen width');
});

test('sixty-second-pass tools give pass and fail verdicts and reject bad inputs', () => {
  assert.equal(engine.run('cutter-clearance-grinding-setup').text, 'CLEARANCE SUITS THE CUT');
  assert.equal(engine.run('cutter-clearance-grinding-setup', { cl: 2 }).text, 'GRIND MORE CLEARANCE');
  assert.equal(engine.run('spline-shaft-milling-cutter').text, 'CUTTER PROPORTIONS SET');
  assert.equal(engine.run('top-knurling-cam-rise').text, 'KNURLING CAM SET');
  assert.equal(engine.run('rubber-pad-forming-pressure').text, 'PAD FORMS THE PART');
  assert.equal(engine.run('rubber-pad-forming-pressure', { preq: 12 }).text, 'CHANGE THE PRESS, PAD OR PART');
  assert.equal(engine.run('rubber-pad-forming-pressure', { t: 60 }).text, 'CHANGE THE PRESS, PAD OR PART');
  assert.equal(engine.run('rubber-pad-forming-pressure', { t: 100 }).tone, 'warn');
  assert.equal(engine.run('gear-angular-backlash').text, 'ANGULAR PLAY ACCEPTED');
  assert.equal(engine.run('gear-angular-backlash', { maxSmall: 10 }).text, 'ANGULAR PLAY TOO LARGE');
  assert.equal(engine.run('unified-cut-thread-tap-limits').text, 'TAP WITHIN ITS LIMITS');
  assert.equal(engine.run('unified-cut-thread-tap-limits', { PDm: 0.2175 }).text, 'TAP OUTSIDE ITS LIMITS');
  assert.equal(engine.run('silent-chain-width').text, 'CHAIN WIDTH CARRIES THE POWER');
  assert.equal(engine.run('silent-chain-width', { wChosen: 101.6 }).text, 'WIDEN THE CHAIN OR IMPROVE LUBRICATION');
  assert.equal(engine.run('silent-chain-width', { lubeHave: 'I' }).text, 'WIDEN THE CHAIN OR IMPROVE LUBRICATION');
  const cases: Array<[string, Inputs]> = [
    ['cutter-clearance-grinding-setup', { d: 120 }], ['spline-shaft-milling-cutter', { W: 30 }], ['spline-shaft-milling-cutter', { Ns: 12, W: 10 }],
    ['top-knurling-cam-rise', { depthFrom: 'given', dg: 5 }], ['gear-angular-backlash', { D: 40 }], ['gear-angular-backlash', { dC: -0.5 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Sixty-third handbook pass (handbook86): tools from open and candidate pages of the page ledger.
// Expected values are the handbook's own examples (spherical sections Examples 7 to 11, the parabola and hyperbola examples,
// the disk method example, the metal ball marking examples and the engine flywheel Examples 1 and 2) and independent closed forms.
const IN86 = 25.4;

test('spherical sections reproduce the handbook examples', () => {
  const r = (over: Inputs) => engine.run('sphere-sections', over).values;
  // Example 7: wall G, R1 12.5 cm, R2 10 cm: 3220.13 cm² and 3992.44 cm³ (here in mm).
  const g = r({ sec: 'G', R1: 125, R2: 100 });
  near(g.area / 100, 3220.13, 0.01, 'Example 7 area');
  near(g.vol / 1000, 3992.44, 0.01, 'Example 7 volume');
  // Example 8: sector K, R 15 cm, φ 90°: area 414.07 cm²; the volume follows 2πR²F ÷ 3 with F = R(1 − cos ½φ).
  const k = r({ sec: 'K', R: 150, phi: 90 });
  near(k.area / 100, 414.07, 0.01, 'Example 8 area');
  near(k.Fdep, 150 * (1 - Math.cos(Math.PI / 4)), 1e-9, 'depth of the sector');
  near(k.vol, 2 * Math.PI * 150 ** 2 * k.Fdep / 3, 1e-6, 'Kv = 2πR²F ÷ 3');
  // Example 9: segment S, E 20 cm, F 5 cm: 392.70 cm² and 850.85 cm³.
  const s = r({ sec: 'S', E: 200, F: 50 });
  near(s.area / 100, 392.7, 0.01, 'Example 9 area');
  near(s.vol / 1000, 850.85, 0.01, 'Example 9 volume');
  near(s.Rsph, 125, 1e-9, 'segment sphere radius');
  // Example 10: hollow sector U, R1 5 in, R2 4 in, φ 30°: area 8.78 in². The printed volume 13.06 in³ is three times (2π/3)(R1³ − R2³)(1 − cos ½φ).
  const u = r({ sec: 'U', R1: 5, R2: 4, phi: 30 });
  near(u.area, 8.78, 0.005, 'Example 10 area');
  near(3 * u.vol, 13.06, 0.005, 'printed Example 10 volume is 3 × the sector volume');
  near(u.vol, r({ sec: 'K', R: 5, phi: 30 }).vol - r({ sec: 'K', R: 4, phi: 30 }).vol, 1e-9, 'U = K(R1) − K(R2)');
  // Example 11: ring W, R1 5 in, R2 4 in: 789.56 in² and 1579.13 in³; part ring Z scales by φ ÷ 360.
  const w = r({ sec: 'W', R1: 5, R2: 4 });
  near(w.area, 789.56, 0.01, 'Example 11 area');
  near(w.vol, 1579.13, 0.01, 'Example 11 volume');
  near(r({ sec: 'Z', R1: 5, R2: 4, phi: 90 }).vol, w.vol / 4, 1e-9, 'quarter ring');
  // Zone T cut 20 and 60 mm from the centre of a 100 mm sphere: radius 100, area 2πRH, volume π∫(R² − z²)dz.
  const t = r({ sec: 'T', P: 2 * Math.sqrt(100 ** 2 - 20 ** 2), Q: 2 * Math.sqrt(100 ** 2 - 60 ** 2), H: 40 });
  near(t.Rsph, 100, 1e-9, 'zone sphere radius');
  near(t.area, 2 * Math.PI * 100 * 40, 1e-6, 'zone area');
  near(t.vol, Math.PI * (100 ** 2 * 40 - (60 ** 3 - 20 ** 3) / 3), 1e-6, 'zone volume');
  near(r({ sec: 'fromvol', Nv: 4 / 3 * Math.PI * 50 ** 3 / 1e6 }).Rsph, 50, 1e-9, 'radius from volume');
});

test('conic sections reproduce the handbook parabola and hyperbola examples', () => {
  const c = (A: number, C: number, D: number, E: number, F: number) => engine.run('conic-section-equation', { A, C, D, E, F });
  // 4y² − 8x − 12y + 1 = 0: vertex (−1, 3/2), p = 1/2, focus (1/2, 3/2), directrix x = −3/2.
  const p = c(0, 4, -8, -12, 1);
  assert.equal(p.text, 'PARABOLA IDENTIFIED');
  near(p.values.h, -1, 1e-12, 'h'); near(p.values.k, 1.5, 1e-12, 'k'); near(p.values.p, 0.5, 1e-12, 'p');
  // 9x² − 4y² − 36x + 8y − 4 = 0: h 2, k 1, a 2, b 3, c √13, e √13 ÷ 2.
  const h = c(9, -4, -36, 8, -4);
  assert.equal(h.text, 'HYPERBOLA IDENTIFIED');
  near(h.values.h, 2, 1e-12, 'h'); near(h.values.k, 1, 1e-12, 'k'); near(h.values.a, 2, 1e-12, 'a'); near(h.values.b, 3, 1e-12, 'b');
  near(h.values.c, Math.sqrt(13), 1e-12, 'c'); near(h.values.e, Math.sqrt(13) / 2, 1e-12, 'e');
  const v = c(1, 0, 0, -4, 0); // x² = 4y
  near(v.values.p, 1, 1e-12, 'vertical parabola p');
  const e = c(9, 25, 0, 0, -225); // x²/25 + y²/9 = 1
  assert.equal(e.text, 'ELLIPSE IDENTIFIED');
  near(e.values.a, 5, 1e-12, 'a'); near(e.values.b, 3, 1e-12, 'b'); near(e.values.e, 0.8, 1e-12, 'e');
  assert.equal(c(1, 1, 0, 0, -4).text, 'CIRCLE IDENTIFIED');
  const vert = c(-4, 9, 0, 0, -36); // y²/4 − x²/9 = 1
  near(vert.values.a, 2, 1e-12, 'vertical hyperbola a'); near(vert.values.b, 3, 1e-12, 'vertical hyperbola b');
});

test('four-arc oval follows the handbook equations and closes tangentially', () => {
  const v = engine.run('four-arc-oval', { A: 400, B: 100 }).values;
  near(v.r, 100 ** 2 / 800 * 4 ** 0.38, 1e-12, 'r = (B² ÷ 2A)(A ÷ B)^0.38');
  near(v.X, (400 ** 2 / 4 - 400 * v.r + 100 * v.r - 100 ** 2 / 4) / (100 - 2 * v.r), 1e-9, 'equation (2)');
  near(v.R, 50 + v.X, 1e-12, 'R = B/2 + X');
  near(v.tang, 0, 1e-9, 'arcs meet tangentially');
  near(v.area, 30631.7048, 0.001, 'area against a numerical integration of the outline');
  near(v.aEll, Math.PI * 100 * 400 / 4, 1e-9, 'ellipse area');
});

test('disk method reproduces the handbook hole location example', () => {
  // x = 0.930, y = 0.720, z = 0.860 in: disk A 1.070 in, radius B 0.395 in, radius C 0.325 in.
  const v = engine.run('hole-location-disks', { x: 0.93 * IN86, y: 0.72 * IN86, z: 0.86 * IN86 }).values;
  near(v.dA / IN86, 1.07, 1e-9, 'disk A diameter');
  near(v.rB / IN86, 0.395, 1e-9, 'disk B radius');
  near(v.rC / IN86, 0.325, 1e-9, 'disk C radius');
  near(v.angA + v.angB + v.angC, 180, 1e-9, 'angles');
  near(Math.hypot(v.Cx - 0.93 * IN86, v.Cy), 0.72 * IN86, 1e-9, 'hole C is y from hole B');
});

test('metal ball lot check reproduces the handbook marking examples', () => {
  // 1/4 in, Grade 16, −0.0002 in ball gauge: accepted 0.249760 to 0.249850 in; measured 0.249823 marks −0.000180 in.
  const D = 0.249823 * IN86;
  const i = engine.run('metal-ball-lot-check', { Dw: 6.35, gage: -0.0002 * IN86 * 1000, devMinus: 0.00004 * IN86 * 1000, devPlus: 0.00005 * IN86 * 1000, inc: 0.00001 * IN86 * 1000, Dmax: D, Dmin: D });
  near(i.values.lo / IN86, 0.24976, 1e-9, 'lower limit');
  near(i.values.hi / IN86, 0.24985, 1e-9, 'upper limit');
  near(i.values.spec / 1000 / IN86, -0.00018, 1e-9, 'specific diameter −0.000180 in');
  assert.equal(i.text, 'LOT ACCEPTED');
  // 6 mm, Grade 16, −4 µm: accepted 5.99500 to 5.99725 mm; measured 5.99627 mm marks −3.75 µm.
  const mm = engine.run('metal-ball-lot-check').values;
  near(mm.DwmL, 5.99627, 1e-9, 'lot mean diameter');
  near(mm.lo, 5.995, 1e-12, 'lower limit'); near(mm.hi, 5.99725, 1e-12, 'upper limit');
  near(mm.spec, -3.75, 1e-9, 'specific diameter −3.75 µm');
  // Balls per kilogram: handbook 1,910,000 ÷ (D³ ρ) with D in mm and ρ in g/cm³.
  near(mm.perKg, 1910000 / (6 ** 3 * 7.833), 0.2, 'balls per kilogram');
});

test('engine flywheel rim weight reproduces the handbook examples', () => {
  // Example 1: 150 hp non-condensing engine, 200 rpm, 2 %, cut-off ¼ (c 0.209), 6 ft mean diameter: 2110 lb nearly.
  const a = engine.run('engine-flywheel-rim-and-arms', { given: 'power', P: 150 * 0.745699872, N: 200, pct: 2, c: 0.209, Dm: 6 * 0.3048 }).values;
  near(a.lb, 2110, 5, 'Example 1');
  // Example 2: 158,340 ft·lb per revolution, c 0.163, 1 %, 18 ft, 75 rpm: 16,650 lb nearly (11,745 uses g = 32.2 ft/s²).
  const b = engine.run('engine-flywheel-rim-and-arms', { given: 'work', Wrev: 158340 * 1.3558179483, N: 75, pct: 1, c: 0.163, Dm: 18 * 0.3048 }).values;
  near(b.lb, 16650, 40, 'Example 2');
  near(b.mass, 100 * b.E / (Math.PI * 18 * 0.3048 * 75 / 60) ** 2, 1e-9, 'm = nE ÷ v²');
  near(engine.run('engine-flywheel-rim-and-arms', { arms: '6', ds: 100 }).values.Wa, 130, 1e-12, '6 arms: 1.3 D');
  const e8 = engine.run('engine-flywheel-rim-and-arms', { arms: '8', ds: 100 }).values;
  near(e8.Wa, 120, 1e-12, '8 arms: 1.2 D'); near(e8.ta, 60, 1e-12, 'thickness half the width'); near(e8.AtipMin, 2 / 3 * e8.Ahub, 1e-12, 'rim area two-thirds of hub area');
});

test('sixty-third-pass tools give their verdicts and reject bad inputs', () => {
  assert.equal(engine.run('sphere-sections').text, 'SECTION CALCULATED');
  assert.equal(engine.run('conic-section-equation').text, 'HYPERBOLA IDENTIFIED');
  assert.equal(engine.run('four-arc-oval').text, 'OVAL LAID OUT');
  assert.equal(engine.run('hole-location-disks').text, 'DISK SIZES SET');
  assert.equal(engine.run('metal-ball-lot-check').text, 'LOT ACCEPTED');
  assert.equal(engine.run('metal-ball-lot-check', { Dmax: 5.998, Dmin: 5.9979 }).text, 'LOT REJECTED');
  assert.equal(engine.run('metal-ball-lot-check', { Dmax: 5.9975, Dmin: 5.995 }).text, 'LOT REJECTED');
  assert.equal(engine.run('engine-flywheel-rim-and-arms').text, 'RIM AND ARMS SIZED');
  const cases: Array<[string, Inputs]> = [
    ['sphere-sections', { sec: 'G', R1: 100, R2: 120 }], ['sphere-sections', { sec: 'W', R1: 10, R2: 20 }],
    ['conic-section-equation', { A: 0, C: 0 }], ['conic-section-equation', { A: 1, C: 1, D: 0, E: 0, F: 1 }], ['conic-section-equation', { A: 1, C: -1, D: 0, E: 0, F: 0 }], ['conic-section-equation', { A: 0, C: 1, D: 0 }],
    ['four-arc-oval', { A: 100, B: 200 }], ['four-arc-oval', { rFrom: 'given', rg: 60 }],
    ['hole-location-disks', { x: 50, y: 10, z: 10 }], ['metal-ball-lot-check', { Dmax: 5.99, Dmin: 5.995 }],
  ];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

// Sixty-fourth handbook pass (handbook87): tools from open and candidate pages of the page ledger.
// Expected values are the handbook's own conversion tables (Tables 16, 21, 57 and 58), the ANSI silent chain sprocket
// Tables 3a and 4a, and the fuel oil heating value text, with independent closed forms.
const IN87 = 25.4;

test('area and volume converters reproduce the handbook square and cubic measure tables', () => {
  const a = (value: number, from: string) => engine.run('area-converter', { value, from }).values.si;
  near(a(1, 'acre'), 4046.856, 0.001, '1 acre = 4046.856 m²');
  near(a(1, 'ha') / a(1, 'acre'), 2.471, 0.0005, '1 hectare = 2.471 acres');
  near(1 / a(1, 'ft2'), 10.764, 0.0005, '1 m² = 10.764 ft²');
  near(1 / a(1, 'yd2'), 1.196, 0.0005, '1 m² = 1.196 yd²');
  near(a(1, 'mi2') / 1e6, 2.5899, 0.0001, '1 mile² = 2.5899 km²');
  near(a(1, 'cm2') / a(1, 'in2'), 0.155, 0.00001, '1 cm² = 0.155 in²');
  near(a(1, 'in2') / a(1, 'cmil'), 1273239, 1, '1 in² = 1,273,239 circular mils');
  near(a(1, 'yd2'), 0.83612736, 1e-12, '1 yd² = 0.83612736 m² exactly');
  const v = (value: number, from: string) => engine.run('volume-converter', { value, from }).values.si;
  near(1 / v(1, 'yd3'), 1.30795, 0.00001, '1 m³ = 1.30795 yd³');
  near(1 / v(1, 'ft3'), 35.314667, 0.000001, '1 m³ = 35.314667 ft³');
  near(1 / v(1, 'in3'), 61023.74, 0.01, '1 m³ = 61,023.74 in³');
  near(1 / v(1, 'usgal'), 264.17205, 0.00001, '1 m³ = 264.17205 US gal');
  near(1 / v(1, 'ukgal'), 219.96925, 0.00001, '1 m³ = 219.96925 Imperial gal');
  near(v(1, 'in3') / v(1, 'usfloz'), 0.55411256, 1e-8, '1 in³ = 0.55411256 US fl oz');
  near(v(1, 'usfloz') * 1e6, 29.57353, 0.00001, '1 US fl oz = 29.57353 mL');
  near(v(1, 'ukfloz') * 1e6, 28.41306, 0.00001, '1 Imperial fl oz = 28.41306 mL');
  near(v(1, 'ft3') / v(1, 'usgal'), 7.4805, 0.00005, '1 ft³ = 7.4805 US gal');
  near(v(1, 'yd3') / v(1, 'usgal'), 201.97403, 0.00001, '1 yd³ = 201.97403 US gal');
  near(v(1, 'usbu') / v(1, 'ft3'), 1.2445, 0.00005, '1 US bushel = 1.2445 ft³');
});

test('inertia converter reproduces the handbook Tables 57 and 58', () => {
  const c = (from: string, value = 1) => engine.run('inertia-converter', { value, from }).values.si;
  near(1 / c('lbft2'), 23.73036, 0.00001, 'kg·m² to lb·ft²');
  near(1 / c('lbin2'), 3417.171, 0.001, 'kg·m² to lb·in²');
  near(c('lbft2'), 0.04214011, 1e-8, 'lb·ft² to kg·m²');
  near(c('lbin2'), 0.0002926397, 1e-10, 'lb·in² to kg·m²');
  near(c('ft4'), 0.008630975, 1e-9, 'ft⁴ to m⁴');
  near(c('in4') / c('cm4'), 41.62314, 0.00001, 'in⁴ to cm⁴');
  near(1 / c('ft4'), 115.8618, 0.0001, 'm⁴ to ft⁴');
  near(c('cm4') / c('in4'), 0.0240251, 1e-7, 'cm⁴ to in⁴');
  near(c('ft3'), 0.02831685, 1e-8, 'ft³ to m³');
  near(c('in3'), 0.00001638706, 5e-12, 'in³ to m³');
  near(1 / c('ft3'), 35.31466, 0.00001, 'm³ to ft³');
  near(1 / c('in3'), 61023.76, 0.02, 'm³ to in³ (Table 57 prints 61,023.76; exact and Table 21 61,023.74)');
  near(1 / c('lbfts'), 7.233011, 0.000005, 'kg·m/s to lb·ft/s');
  near(1 / c('lbins'), 86.79614, 0.00005, 'kg·m/s to lb·in/s');
  near(c('lbfts'), 0.138255, 0.000001, 'lb·ft/s to kg·m/s');
  near(c('slugft2') / c('lbft2'), 9.80665 / 0.3048, 1e-9, 'slug·ft² = 32.174 lb·ft²');
});

test('silent chain sprocket inspection reproduces the handbook Tables 3a and 4a', () => {
  const s = (Nt: number, P = IN87) => engine.run('silent-chain-sprocket-inspection', { Nt, P }).values;
  // Table 3a, 1 in pitch: pitch, rounded-tooth outside and over-pin diameters.
  const t3: Array<[number, number, number, number]> = [[96, 30.563, 30.627, 30.923], [124, 39.475, 39.542, 39.838], [125, 39.793, 39.86, 40.153], [150, 47.75, 47.82, 48.115]];
  for (const [n, pd, od, opd] of t3) {
    const x = s(n);
    near(x.PD / IN87, pd, 0.0006, `PD ${n}`); near(x.OD / IN87, od, 0.0006, `OD ${n}`); near(x.OPD / IN87, opd, 0.0011, `OPD ${n}`);
  }
  // Table 4a tolerances (in) by tooth band, against (0.004 + 0.001 P √N) at each band's top tooth number; the printed table departs from its own formula by up to 0.0014 in.
  const bands = [15, 24, 35, 48, 63, 80, 99, 120, 143, 144];
  const t4: Array<[number, number[]]> = [[0.375, [0.005, 0.006, 0.006, 0.006, 0.007, 0.007, 0.008, 0.008, 0.008, 0.009]], [1, [0.008, 0.009, 0.01, 0.011, 0.012, 0.013, 0.014, 0.015, 0.016, 0.016]], [2, [0.012, 0.014, 0.017, 0.019, 0.021, 0.023, 0.025, 0.027, 0.028, 0.028]]];
  for (const [p, row] of t4) row.forEach((tol, i) => { const n = Math.max(17, bands[i]); near(s(n, p * IN87).tolIn, 0.004 + 0.001 * p * Math.sqrt(n), 1e-12, 'formula'); near(0.004 + 0.001 * p * Math.sqrt(bands[i]), tol, 0.0015, `Table 4a ${p} in, ${bands[i]} teeth`); });
  near(s(25).tir / IN87, 0.001 * s(25).PD / IN87, 1e-12, 'eccentricity 0.001 × PD');
  near(s(17, 9.525).tir / IN87, 0.006, 1e-12, 'eccentricity not less than 0.006 in');
  near(s(150, 2 * IN87).tir / IN87, 0.032, 1e-12, 'eccentricity not more than 0.032 in');
  near(s(25).Gmin, s(25).G - 0.03 * IN87, 1e-12, 'guide groove +0, −0.030 in');
});

test('fuel oil heating value follows the handbook formula and Baumé scale', () => {
  const v = engine.run('fuel-oil-heating-value', { from: 'be', be: 26.9 }).values;
  near(v.sg, 140 / 156.9, 1e-12, 'SG = 140 ÷ (130 + °Bé)');
  near(v.hv, 18650 + 40 * 16.9, 1e-9, 'BTU/lb = 18,650 + 40 (°Bé − 10)');
  // The handbook gives 19,376 BTU/lb and 143,950 BTU per gallon for 26.9 °Bé mid-continent oil; the gallon figure follows from the pound figure and the gravity.
  near(v.BTUgal / v.hv * 19376, 143950, 250, 'BTU per gallon from BTU per pound');
  near(engine.run('fuel-oil-heating-value', { from: 'sg', sg: 140 / 156.9 }).values.be, 26.9, 1e-9, 'Baumé from specific gravity');
  near(v.kgh, 100 * 3.6 / 0.8 / v.MJkg, 1e-9, 'oil burned = output ÷ (efficiency × heating value)');
});

test('sixty-fourth-pass tools give their verdicts and reject bad inputs', () => {
  for (const id of ['area-converter', 'volume-converter', 'inertia-converter']) assert.equal(engine.run(id).text, 'CONVERTED');
  assert.equal(engine.run('silent-chain-sprocket-inspection').text, 'SPROCKET ACCEPTED');
  assert.equal(engine.run('silent-chain-sprocket-inspection', { OPDm: 209.7 }).text, 'SPROCKET REJECTED');
  assert.equal(engine.run('silent-chain-sprocket-inspection', { OPDm: 210 }).text, 'SPROCKET REJECTED');
  assert.equal(engine.run('silent-chain-sprocket-inspection', { TIRm: 0.3 }).text, 'SPROCKET REJECTED');
  assert.equal(engine.run('silent-chain-sprocket-inspection', { Gm: 170 }).text, 'SPROCKET REJECTED');
  assert.equal(engine.run('fuel-oil-heating-value').text, 'HEATING VALUE ESTIMATED');
  assert.equal(engine.run('fuel-oil-heating-value', { be: 90 }).tone, 'warn');
  const cases: Array<[string, Inputs]> = [['silent-chain-sprocket-inspection', { P: 9.51 }]];
  for (const [id, over] of cases) { const r = engine.run(id, over); assert.equal(r.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(r.primary, undefined); }
});

test('surface roughness acceptance applies the 16 % and max rules', () => {
  const r = (over: Inputs) => engine.run('surface-roughness-acceptance', over);
  const d = r({});
  assert.equal(d.text, 'SURFACE ACCEPTED');
  near(d.values.shareAbove, 100 / 12, 1e-9, '1 of 12 above'); near(d.values.ln, 4, 1e-12, 'ln = 5 lr');
  const exc = r({ nAbove: 2 }); // 16.7 % above, mean + σ = 0.73 within 0.8: the handbook exception
  assert.equal(exc.text, 'SURFACE ACCEPTED'); assert.equal(exc.tone, 'warn');
  assert.equal(r({ nAbove: 2, mean: 0.75, sd: 0.1 }).text, 'SURFACE REJECTED');
  assert.equal(r({ nAbove: 1, n: 6, mean: 0.75, sd: 0.1 }).text, 'SURFACE REJECTED'); // 1 in 6 is 16.7 %
  assert.equal(r({ rule: 'max' }).text, 'SURFACE REJECTED');
  assert.equal(r({ rule: 'max', vmax: 0.79 }).text, 'SURFACE ACCEPTED');
  assert.equal(r({ lower: 'yes', Lw: 0.6, nBelow: 3 }).text, 'SURFACE REJECTED');
  assert.equal(r({ nAbove: 13 }).text, 'CHECK INPUTS');
});

// Sixty-fifth handbook pass (handbook88): the grip gauging length, body length and thread length rules of the fastener
// standards as given in the handbook, checked by closed form.
test('bolt grip and thread lengths follow the handbook rules', () => {
  const r = (over: Inputs) => engine.run('bolt-grip-thread-length', over);
  const s = r({}).values; // M10 × 1.5 socket head cap screw, L 40, LT 28
  near(s.Lg, 12, 1e-12, 'LG = L − LT'); near(s.LTT, 35.5, 1e-12, 'LTT = LT + 5P'); near(s.Lb, 4.5, 1e-12, 'LB = L − LTT');
  near(s.Lb, s.Lg - 5 * 1.5, 1e-12, 'BS 4168: Ls min = Lg max − 5P');
  near(r({ std: 'metric', L: 60, Lt: 26 }).values.Lg, 34, 1e-12, 'metric: Lg max = L − B');
  // Structural bolt, 3/4 in, 10 threads per inch: full length when LB min ≤ 2.5P; over 1 in diameter the limit is 3.5P.
  const st = (L: number, d = 19.05, P = 2.54) => r({ std: 'structural', L, Lt: 35.052, Y: 8.636, d, P }).values;
  near(st(101.6).Lb, 101.6 - 35.052 - 8.636, 1e-9, 'LB min = LG max − Y max');
  assert.equal(st(101.6).full, 0); assert.equal(st(38.1).full, 1);
  near(st(101.6).fullLim, 2.5 * 2.54, 1e-12, '2.5 P up to 1 in');
  near(st(101.6, 31.75, 3.175).fullLim, 3.5 * 3.175, 1e-12, '3.5 P over 1 in');
});

test('sixty-fifth-pass tool gives its verdicts and rejects bad inputs', () => {
  assert.equal(engine.run('bolt-grip-thread-length').text, 'LENGTH SUITS THE JOINT');
  assert.equal(engine.run('bolt-grip-thread-length', { grip: 10 }).text, 'CHOOSE ANOTHER LENGTH');
  assert.equal(engine.run('bolt-grip-thread-length', { need: 30 }).text, 'CHOOSE ANOTHER LENGTH');
  assert.equal(engine.run('bolt-grip-thread-length', { std: 'structural', L: 38.1, Lt: 35.052, Y: 8.636, d: 19.05, P: 2.54, grip: 1, need: 1 }).text, 'LENGTH SUITS THE JOINT');
  const bad = engine.run('bolt-grip-thread-length', { Lt: 50 });
  assert.equal(bad.text, 'CHECK INPUTS'); assert.equal(bad.primary, undefined);
});

// Sixty-sixth handbook pass (handbook89): deep audit of pages cited only within wide ranges. Expected values are the
// handbook's grinding Examples 6 and 7 and Tables 1 and 6, the double Acme thread tool example, and milling Tables 2a and 2b.
test('grinding wheel life plan reproduces the handbook Taylor tables and Examples 6 and 7', () => {
  const g = (over: Inputs) => engine.run('grinding-wheel-life-plan', over).values;
  near(g({ C: 4690, T: 15 }).V, 2319, 1, 'Example 6: V15');
  near(g({ C: 4690, T: 45 }).V, 1743, 1, 'Example 6: V45');
  const t1 = g({ C: 6965, ECT: 0.00033, T: 10 }); // Table 1, group 1, ECT 0.00033
  near(t1.V10, 3830, 3, 'Table 1 V10'); near(t1.V100, 2105, 3, 'Table 1 V100'); near(t1.SMRR, 1265, 2, 'Table 1 SMRR10');
  // Example 7: shop VU 1800 m/min, TU 7 min at ECT 0.00017 on group 6 (standard C 5290).
  const e7 = g({ cal: 'yes', VU: 1800, TU: 7, CshopStd: 5290, C: 5290, ECT: 0.00017, T: 1 });
  near(e7.CU, 2985, 1, 'CU = VU TU^0.26'); near(e7.ratio, 0.564, 0.0005, 'ratio to the standard constant');
  near(e7.V10, 1640, 1, 'V10U'); near(e7.V100, 900, 2, 'V100U (printed rounded to 900)'); near(e7.SMRR, 507, 1, 'SMRR1U');
  const e33 = g({ cal: 'yes', VU: 1800, TU: 7, CshopStd: 5290, C: 4690, ECT: 0.00033, T: 10 });
  near(e33.V10, 1455, 3, 'ECT 0.00033 V10U'); near(e33.V100, 800, 2, 'ECT 0.00033 V100U'); near(e33.SMRR, 480, 2, 'ECT 0.00033 SMRR10U');
  const e50 = g({ cal: 'yes', VU: 1800, TU: 7, CshopStd: 5290, C: 3590, ECT: 0.0005, T: 9 });
  near(e50.V, 1144, 1, 'V9 at ECT 0.00050'); near(e50.SMRR, 572, 1, 'SMRR at T = 9');
  const d = g({});
  near(d.Vw, d.SMRR / (1000 * 0.01), 1e-9, 'Vw = SMRR ÷ 1000 ar'); near(d.tc, 200 / d.FR + 0.05, 1e-12, 'time per pass');
});

test('thread tool relief angles reproduce the handbook double Acme example', () => {
  // 1 in, 5 tpi double Acme: lead 0.400 in, K 0.780 in, 29°, effective relief 10°.
  const v = engine.run('thread-tool-relief-angles', { lead: 0.4 * 25.4, Dmaj: 25.4, Kmin: 0.78 * 25.4, ang: 29, ae: 10 }).values;
  near(v.psi, 9.27, 0.005, 'ψ'); near(v.phi, 7.26, 0.005, 'φ'); near(v.a, 19.27, 0.005, 'a'); near(v.at, 2.74, 0.005, "a′");
  near(v.b, 18.70, 0.005, 'b'); near(v.bt, 2.65, 0.01, "b′"); near(v.n, 30.26, 0.01, 'n');
});

test('milling chip thickness reproduces the handbook Tables 2a and 2b', () => {
  const r = (mode: string, ar: number, over: Inputs = {}) => engine.run('milling-chip-thickness-ect', { mode, D: 100, ar: ar * 100, ...over }).values;
  const end: Array<[number, number, number, number]> = [[1, 180, 0.637, 1], [0.9, 143.13, 0.721, 0.884], [0.8, 126.87, 0.723, 0.881], [0.7355, 118.102, 0.714, 0.892], [0.6137, 103.144, 0.682, 0.934], [0.393, 77.643, 0.58, 1.098], [0.217, 55.528, 0.448, 1.422], [0.125, 41.41, 0.346, 1.84], [0.0625, 28.955, 0.247, 2.574], [0.03, 19.948, 0.172, 3.694], [0.01, 11.478, 0.1, 6.377]];
  for (const [a, AE, hf, fr] of end) { const x = r('end', a); near(x.AE, AE, 0.01, `end AE ${a}`); near(x.hf, hf, 0.0011, `end hm/fz ${a}`); near(x.feedRatio, fr, 0.003, `end fz/fz0 ${a}`); }
  const face: Array<[number, number, number, number]> = [[1, 180, 0.637, 1.398], [0.9, 128.316, 0.804, 1.107], [0.8, 106.26, 0.863, 1.032], [0.7355, 94.702, 0.89, 1], [0.6137, 75.715, 0.929, 0.958], [0.393, 46.282, 0.973, 0.915], [0.217, 25.066, 0.992, 0.897], [0.125, 14.361, 0.997, 0.892], [0.03, 3.438, 1, 0.89]];
  for (const [a, AE, hf, fr] of face) { const x = r('face', a); near(x.AE, AE, 0.01, `face AE ${a}`); near(x.hf, hf, 0.0011, `face hm/fz ${a}`); near(x.feedRatio, fr, 0.003, `face fz/fz0 ${a}`); }
  // Table 2b ECT at fz0 = 0.17 mm with aa/CEL = 0.95: end milling z = 2, face milling z = 8.
  for (const [a, e] of [[1, 0.103], [0.9, 0.093], [0.125, 0.013], [0.0625, 0.006]]) near(r('end', a, { z: 2, fz: 0.17 }).ECT, e, 0.0006, `end ECT ${a}`);
  for (const [a, e] of [[1, 0.411], [0.9, 0.37], [0.217, 0.089], [0.125, 0.051]]) near(r('face', a, { z: 8, fz: 0.17 }).ECT, e, 0.0006, `face ECT ${a}`);
  near(r('end', 1, { fz: 0.17 }).hm, 0.108, 0.0005, 'hm = 0.108 mm at full slot and 0.17 mm/tooth');
});

test('sixty-sixth-pass tools give their verdicts and reject bad inputs', () => {
  assert.equal(engine.run('grinding-wheel-life-plan').text, 'WHEEL SPEED WITHIN THE WHEEL RATING');
  assert.equal(engine.run('grinding-wheel-life-plan', { T: 2 }).text, 'WHEEL SPEED ABOVE THE WHEEL RATING');
  assert.equal(engine.run('thread-tool-relief-angles').text, 'TOOL ANGLES SET');
  assert.equal(engine.run('thread-tool-relief-angles', { ae: 5, lead: 30 }).text, 'TRAILING FLANK WOULD RUB');
  assert.equal(engine.run('milling-chip-thickness-ect').text, 'CHIP THICK ENOUGH');
  assert.equal(engine.run('milling-chip-thickness-ect', { ar: 0.25 }).text, 'RAISE THE FEED PER TOOTH');
  const cases: Array<[string, Inputs]> = [['thread-tool-relief-angles', { Kmin: 30 }], ['milling-chip-thickness-ect', { ar: 30 }]];
  for (const [id, over] of cases) { const x = engine.run(id, over); assert.equal(x.text, 'CHECK INPUTS', `${id}/${JSON.stringify(over)}`); assert.equal(x.primary, undefined); }
});
