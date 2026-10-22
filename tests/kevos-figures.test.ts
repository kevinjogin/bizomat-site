import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { FIGURE_TYPES, parseFigure, renderFigure } from '../src/utils/kevos-figures.ts';

const sample: Record<string, string> = {
  steps: 'title: T\n- One | first\n- *Two | second',
  timeline: 'title: T\n- 1907 | Taylor | tool life\n- 1950 | Gilbert',
  compare: 'title: T\ncols: A | B\nbest: 2\n- Cost | high | low',
  matrix: 'title: T\nx: Interest\ny: Power\nhot: 2\n- A | a\n- B | b\n- C | c\n- D | d',
  tree: 'title: T\n- Root\n  - Child | detail\n    - Leaf\n  - Child 2',
  stats: 'title: T\n- 31% | Cutting share',
  checklist: 'title: T\n- Do this\n- x Avoid this\n- ? Ask this',
  layers: 'title: T\nshape: pyramid\n- Top\n- Middle\n- Base',
  decision: 'title: T\nquestion: Is it?\n- Yes | Go\n- No | Stop',
  formula: 'title: T\nformula: n = 1000 × vc ÷ (π × D)\nstep: n = 1000 × 220 ÷ (π × 100)\nstep: n = 700 rev/min\n- vc | cutting speed',
  bars: 'title: T\nunit: min\n- A | 2.8\n- *B | 4.2 | note',
  funnel: 'title: T\n- Enquiries | 100\n- Quotes | 40\n- Orders | 10',
  stack: 'title: T\n- Cutting | 2.79\n- Non-cutting | 4.20\n- Handling | 2.00',
  line: 'title: T\nx: Speed\ny: Life\nlegend: Test | Model\nmark: 245 | optimum\n- 180 | 64.9 | 60\n- 260 | 12 | 13',
  range: 'title: T\nmin: 0\nmax: 0.6\nunit: mm\n- Requirement | 0.05 | 0.40\n- *Worst case | 0.10 | 0.60',
  gauge: 'title: T\nmin: 0\nmax: 2\nvalue: 1.33\nlabel: Cpk\n- 0 | 1 | Poor\n- 1 | 1.33 | Marginal\n- 1.33 | 2 | Capable',
  cycle: 'title: T\n- Plan\n- Do\n- Check\n- Act',
  venn: 'title: T\ncentre: Fit\n- Function\n- Cost\n- Capability',
  balance: 'title: T\nleft: Tight\nright: Loose\ntilt: left\n- Cost | Risk',
  svg: 'title: T\nalt: A beam\nviewbox: 0 0 100 50\nbody:\n<path class="la draw" pathLength="1" d="M0 25H100"/>',
};

test('every figure type renders accessible, CSP-safe markup', () => {
  assert.deepEqual(Object.keys(sample).sort(), [...FIGURE_TYPES].sort());
  for (const [type, src] of Object.entries(sample)) {
    const html = renderFigure(parseFigure(`type: ${type}\n${src}`), `kfx-${type}`, 1);
    assert.match(html, /^<figure class="kf kf-/, type);
    assert.match(html, /aria-labelledby="kfx-[a-z]+-t"/, `${type} is labelled`);
    assert.doesNotMatch(html, /\sstyle=/, `${type} has no inline style`);
    assert.doesNotMatch(html, /NaN|undefined|Infinity/, `${type} has no bad values`);
    for (const svg of html.match(/<svg\b[^>]*>/g) ?? []) assert.match(svg, /viewBox=/, `${type} svg has a viewBox`);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${type} ids are unique`);
  }
});

test('malformed figures fail loudly instead of rendering', () => {
  assert.throws(() => renderFigure(parseFigure('type: nope\ntitle: T\n- a'), 'x', 1), /Unknown figure type/);
  assert.throws(() => renderFigure(parseFigure('type: steps\n- a'), 'x', 1), /needs a title/);
  assert.throws(() => renderFigure(parseFigure('type: bars\ntitle: T\n- a | lots'), 'x', 1), /numeric/);
  assert.throws(() => renderFigure(parseFigure('type: svg\ntitle: T\nalt: a\nbody:\n<rect style="fill:red"/>'), 'x', 1), /style/);
});

test('every figure block in the READOS content parses and renders', () => {
  const roots = ['src/content/reados-chapters', 'src/content/reados-publications', 'src/pages/library'];
  const files: string[] = [];
  const walk = (dir: string) => { for (const e of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) walk(p); else if (/\.mdx?$/.test(e.name)) files.push(p); } };
  roots.forEach(walk);
  for (const file of files) {
    const md = readFileSync(file, 'utf8');
    let n = 0;
    for (const m of md.matchAll(/```figure\n([\s\S]*?)```/g)) {
      n += 1;
      assert.doesNotThrow(() => renderFigure(parseFigure(m[1]), `t-${n}`, n), `${file} figure ${n}`);
    }
  }
});

test('values are written with their units the way a reader expects', () => {
  const val = (unit: string, v: string) => {
    const html = renderFigure(parseFigure(`type: bars\ntitle: T\nunit: ${unit}\n- A | ${v}`), 'kfq', 1);
    return /kf-bar-val">([^<]*)</.exec(html)?.[1];
  };
  assert.equal(val('$', '130000'), '$130,000');
  assert.equal(val('$', '−83000'), '−$83,000');
  assert.equal(val('$m', '1.0'), '$1.0m');
  assert.equal(val("$'000", '33'), '$33k');
  assert.equal(val('$ a year', '−7000'), '−$7,000 a year');
  assert.equal(val('A$', '2500'), 'A$2,500');
  assert.equal(val('%', '40'), '40%');
  assert.equal(val('% of votes', '12'), '12% of votes');
  assert.equal(val('hours a year', '2400'), '2,400 hours a year');
  assert.equal(val('mm', '0.05'), '0.05 mm');
  assert.equal(val('$', 'about 5000'), 'about 5000 $');
});
