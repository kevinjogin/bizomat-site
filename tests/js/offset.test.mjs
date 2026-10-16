import test from 'node:test';
import assert from 'node:assert/strict';
import { planOffset } from '../../opensketch/static/js/sketch/offset.js';

const close = (a, b, tolerance = 1e-7) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const pointClose = (a, b) => a.forEach((v, i) => close(v, b[i]));
const curve = (plan, id) => plan.curves.find((e) => e.source === id);
const radius = (arc) => Math.hypot(arc.start[0] - arc.center[0], arc.start[1] - arc.center[1]);

function sketchBuilder() {
  const sketch = { entities: [], constraints: [] };
  let count = 0;
  const point = ([x, y]) => {
    const id = `p${++count}`; sketch.entities.push({ id, type: 'point', x, y }); return id;
  };
  return {
    sketch,
    // Deliberately use separate coincident point entities, as Convert Entities does.
    line(id, a, b, construction = false) {
      sketch.entities.push({ id, type: 'line', p1: point(a), p2: point(b), construction });
    },
    arc(id, center, start, end, construction = false) {
      sketch.entities.push({ id, type: 'arc', center: point(center), start: point(start), end: point(end), construction });
    },
    circle(id, center, r, construction = false) {
      sketch.entities.push({ id, type: 'circle', center: point(center), r, construction });
    },
  };
}

function slot() {
  const b = sketchBuilder();
  b.line('top', [0, 5], [20, 5]); b.line('bottom', [20, -5], [0, -5]);
  b.arc('left', [0, 0], [0, 5], [0, -5]); b.arc('right', [20, 0], [20, -5], [20, 5]);
  return b.sketch;
}

function rectangle(b, id, x, y, w, h) {
  b.line(id + 'a', [x, y], [x + w, y]); b.line(id + 'b', [x + w, y], [x + w, y + h]);
  b.line(id + 'c', [x + w, y + h], [x, y + h]); b.line(id + 'd', [x, y + h], [x, y]);
}

function assertJoined(plan) {
  const ends = plan.curves.flatMap((e) => e.type === 'line' ? [e.p1, e.p2] : [e.start, e.end]);
  for (const p of ends) assert.equal(ends.filter((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-7).length, 2);
}

test('converted rounded slot offsets the complete line/arc chain in both directions', () => {
  const sketch = slot(), before = structuredClone(sketch);
  for (const amount of [2, -2]) {
    const plan = planOffset(sketch, ['left'], amount);
    assert.deepEqual(new Set(plan.selectedIds), new Set(['top', 'bottom', 'left', 'right']));
    assert.equal(plan.curves.length, 4);
    pointClose(curve(plan, 'top').p1, [0, 5 + amount]);
    pointClose(curve(plan, 'top').p2, [20, 5 + amount]);
    pointClose(curve(plan, 'bottom').p1, [20, -5 - amount]);
    close(radius(curve(plan, 'left')), 5 + amount);
    close(radius(curve(plan, 'right')), 5 + amount);
    assertJoined(plan);
  }
  assert.deepEqual(sketch, before);
});

test('closed offset direction is independent of selection order and reversed lines', () => {
  const a = slot(), b = structuredClone(a);
  for (const e of b.entities) if (e.type === 'line') [e.p1, e.p2] = [e.p2, e.p1];
  b.entities.reverse();
  const p = planOffset(a, ['right', 'top', 'left', 'bottom'], 2);
  const q = planOffset(b, ['bottom', 'left', 'top', 'right'], 2);
  for (const id of ['left', 'right']) {
    pointClose(curve(p, id).start, curve(q, id).start);
    pointClose(curve(p, id).end, curve(q, id).end);
  }
  for (const id of ['top', 'bottom']) {
    pointClose(curve(p, id).p1, curve(q, id).p2);
    pointClose(curve(p, id).p2, curve(q, id).p1);
  }
  assertJoined(q);
});

test('rounded rectangle preserves all four arc radii and tangent joins', () => {
  const b = sketchBuilder();
  b.line('bottom', [2, 0], [18, 0]); b.arc('br', [18, 2], [18, 0], [20, 2]);
  b.line('right', [20, 2], [20, 8]); b.arc('tr', [18, 8], [20, 8], [18, 10]);
  b.line('top', [18, 10], [2, 10]); b.arc('tl', [2, 8], [2, 10], [0, 8]);
  b.line('left', [0, 8], [0, 2]); b.arc('bl', [2, 2], [0, 2], [2, 0]);
  for (const amount of [1, -1]) {
    const plan = planOffset(b.sketch, ['tr'], amount);
    assert.equal(plan.curves.length, 8);
    for (const e of plan.curves.filter((e) => e.type === 'arc')) close(radius(e), 2 + amount);
    pointClose(curve(plan, 'bottom').p1, [2, -amount]);
    assertJoined(plan);
  }
});

test('single arc supports outward/inward offset without turning into a full circle', () => {
  const b = sketchBuilder(); b.arc('arc', [3, 4], [8, 4], [3, 9], true);
  for (const amount of [2, -2]) {
    const plan = planOffset(b.sketch, ['arc'], amount);
    assert.equal(plan.curves.length, 1);
    const result = curve(plan, 'arc');
    assert.equal(result.type, 'arc'); assert.equal(result.construction, true);
    pointClose(result.center, [3, 4]); pointClose(result.start, [8 + amount, 4]); pointClose(result.end, [3, 9 + amount]);
  }
});

test('single circle offsets its radius and preserves center and construction', () => {
  const b = sketchBuilder(); b.circle('circle', [20, -3], 5, true);
  assert.deepEqual(planOffset(b.sketch, ['circle'], 2).curves,
    [{ type: 'circle', source: 'circle', center: [20, -3], construction: true, r: 7 }]);
  close(curve(planOffset(b.sketch, ['circle'], -2), 'circle').r, 3);
});

test('Select chain can be disabled to offset just the selected converted arc', () => {
  const plan = planOffset(slot(), ['left'], 2, { chain: false });
  assert.deepEqual(plan.selectedIds, ['left']);
  pointClose(plan.curves[0].start, [0, 7]); pointClose(plan.curves[0].end, [0, -7]);
});

test('open line chain uses analytic corner intersection without an accidental closing edge', () => {
  const b = sketchBuilder(); b.line('one', [0, 0], [10, 0]); b.line('two', [10, 10], [10, 0]);
  const plan = planOffset(b.sketch, ['two'], 2);
  assert.equal(plan.curves.length, 2);
  pointClose(curve(plan, 'one').p1, [0, 2]); pointClose(curve(plan, 'one').p2, [8, 2]);
  pointClose(curve(plan, 'two').p1, [8, 10]); pointClose(curve(plan, 'two').p2, [8, 2]);
  const reverse = planOffset(b.sketch, ['one'], -2);
  pointClose(curve(reverse, 'one').p2, [12, -2]);
});

test('open tangent line and arc remain joined and keep the same center', () => {
  const b = sketchBuilder(); b.line('line', [-10, 0], [0, 0]); b.arc('arc', [0, 5], [0, 0], [5, 5]);
  const plan = planOffset(b.sketch, ['arc'], 2);
  pointClose(curve(plan, 'line').p1, [-10, 2]); pointClose(curve(plan, 'line').p2, [0, 2]);
  pointClose(curve(plan, 'arc').center, [0, 5]); pointClose(curve(plan, 'arc').start, [0, 2]);
  pointClose(curve(plan, 'arc').end, [3, 5]);
});

test('non-tangent line and arc joins use the analytic circle intersections', () => {
  const b = sketchBuilder(); b.arc('arc', [0, 0], [0, -5], [0, 5]); b.line('line', [0, 5], [0, -5]);
  for (const amount of [2, -2]) {
    const plan = planOffset(b.sketch, ['line'], amount), y = Math.sqrt((5 + amount) ** 2 - amount ** 2);
    pointClose(curve(plan, 'arc').start, [-amount, -y]); pointClose(curve(plan, 'arc').end, [-amount, y]);
    assertJoined(plan);
  }
});

test('arc-to-arc joins use circle intersections and maintain a closed lens', () => {
  const b = sketchBuilder(); b.arc('right', [-3, 0], [0, -4], [0, 4]); b.arc('left', [3, 0], [0, 4], [0, -4]);
  const plan = planOffset(b.sketch, ['right'], 1), y = Math.sqrt(27);
  pointClose(curve(plan, 'right').start, [0, -y]); pointClose(curve(plan, 'right').end, [0, y]);
  for (const c of plan.curves) close(radius(c), 6);
  assertJoined(plan);
});

test('concentric arc pieces join without a false circle-circle failure', () => {
  const b = sketchBuilder();
  b.arc('a', [0, 0], [5, 0], [0, 5]); b.arc('b', [0, 0], [0, 5], [-5, 0]);
  b.arc('c', [0, 0], [-5, 0], [0, -5]); b.arc('d', [0, 0], [0, -5], [5, 0]);
  const plan = planOffset(b.sketch, ['c'], 2);
  assertJoined(plan); for (const c of plan.curves) close(radius(c), 7);
});

test('multiple closed loops each expand outward', () => {
  const b = sketchBuilder(); rectangle(b, 'first', 0, 0, 10, 10); rectangle(b, 'second', 30, 0, 10, 10);
  const plan = planOffset(b.sketch, ['firsta', 'secondc'], 2);
  assert.equal(plan.curves.length, 8);
  pointClose(curve(plan, 'firsta').p1, [-2, -2]); pointClose(curve(plan, 'firsta').p2, [12, -2]);
  pointClose(curve(plan, 'seconda').p1, [28, -2]); assertJoined(plan);
});

test('construction reference lines do not branch a converted contour', () => {
  const b = sketchBuilder(); rectangle(b, 'loop', 0, 0, 10, 10); b.line('axis', [0, 0], [5, 5], true);
  assert.equal(planOffset(b.sketch, ['loopa'], 2).curves.length, 4);
});

test('branched chain reports an actionable error and remains unchanged', () => {
  const b = sketchBuilder(); b.line('a', [0, 0], [10, 0]); b.line('b', [10, 0], [20, 0]); b.line('c', [10, 0], [10, 10]);
  const before = structuredClone(b.sketch);
  assert.throws(() => planOffset(b.sketch, ['a'], 1), /branches/);
  assert.deepEqual(b.sketch, before);
  assert.equal(planOffset(b.sketch, ['a'], 1, { chain: false }).curves.length, 1);
});

test('source crossing and overlapping curves fail instead of creating partial results', () => {
  const b = sketchBuilder(); b.line('a', [0, 0], [10, 10]); b.line('b', [0, 10], [10, 0]);
  assert.throws(() => planOffset(b.sketch, ['a', 'b'], 1), /overlap or intersect/);
  const c = sketchBuilder(); c.line('a', [0, 0], [10, 0]); c.line('b', [5, 0], [15, 0]);
  assert.throws(() => planOffset(c.sketch, ['a', 'b'], 1), /overlap or intersect/);
});

test('offset loops that collide are rejected', () => {
  const b = sketchBuilder(); rectangle(b, 'first', 0, 0, 10, 10); rectangle(b, 'second', 12, 0, 10, 10);
  assert.throws(() => planOffset(b.sketch, ['firsta', 'seconda'], 2), /intersecting curves/);
  const touching = sketchBuilder(); rectangle(touching, 'first', 0, 0, 10, 10); rectangle(touching, 'second', 14, 14, 10, 10);
  assert.throws(() => planOffset(touching.sketch, ['firsta', 'seconda'], 2), /intersecting curves/);
});

test('rounded slot is invariant under rotation and translation', () => {
  const base = planOffset(slot(), ['left'], 2);
  for (const angle of [0.21, 1.24, 2.8]) {
    const transform = ([x, y]) => [x * Math.cos(angle) - y * Math.sin(angle) + 725.4,
      x * Math.sin(angle) + y * Math.cos(angle) - 812.7];
    const sketch = slot();
    for (const p of sketch.entities.filter((e) => e.type === 'point')) [p.x, p.y] = transform([p.x, p.y]);
    const plan = planOffset(sketch, ['left'], 2);
    for (const original of base.curves) {
      const result = curve(plan, original.source);
      for (const key of original.type === 'line' ? ['p1', 'p2'] : ['start', 'end', 'center'])
        pointClose(result[key], transform(original[key]));
    }
    assertJoined(plan);
  }
});

test('closed offset stays outward far from the sketch origin', () => {
  const b = sketchBuilder(); rectangle(b, 'r', 1e8, 1e8, 10, 5);
  const plan = planOffset(b.sketch, ['ra'], 2);
  pointClose(curve(plan, 'ra').p1, [1e8 - 2, 1e8 - 2]);
  pointClose(curve(plan, 'ra').p2, [1e8 + 12, 1e8 - 2]);
});

test('collapsing radii and lines fail atomically', () => {
  const sketch = slot(), before = structuredClone(sketch);
  assert.throws(() => planOffset(sketch, ['top'], -5), /collapses/);
  assert.throws(() => planOffset(sketch, ['top'], -6), /collapses/);
  assert.deepEqual(sketch, before);
  const b = sketchBuilder(); b.circle('large', [0, 0], 10); b.circle('small', [30, 0], 2);
  const beforeCircles = structuredClone(b.sketch);
  assert.throws(() => planOffset(b.sketch, ['large', 'small'], -3), /collapses a circle/);
  assert.deepEqual(b.sketch, beforeCircles);
  const rect = sketchBuilder(); rectangle(rect, 'r', 0, 0, 10, 4);
  assert.throws(() => planOffset(rect.sketch, ['ra'], -3), /collapses or reverses a line/);
});

test('invalid distance, selection, radii, and points produce clear errors', () => {
  const sketch = slot();
  for (const amount of [0, NaN, Infinity, -Infinity, '2'])
    assert.throws(() => planOffset(sketch, ['top'], amount), /finite, non-zero/);
  assert.throws(() => planOffset(sketch, [], 2), /Select at least one/);
  assert.throws(() => planOffset(sketch, ['missing'], 2), /Select lines, arcs, or circles/);
  const circle = sketchBuilder(); circle.circle('bad', [0, 0], -2);
  assert.throws(() => planOffset(circle.sketch, ['bad'], 1), /invalid radius/);
  const arc = sketchBuilder(); arc.arc('bad', [0, 0], [5, 0], [0, 4]);
  assert.throws(() => planOffset(arc.sketch, ['bad'], 1), /different radii/);
  arc.sketch.entities.find((e) => e.id === 'bad').start = 'missing';
  assert.throws(() => planOffset(arc.sketch, ['bad'], 1), /missing or invalid point/);
});
