// Sketch solver tests: node --test tests/js
import test from 'node:test';
import assert from 'node:assert/strict';
import { solveSketch, measure } from '../../opensketch/solver/solver.js';

function rect(x0, y0, x1, y1) {
  return {
    entities: [
      { id: 'a', type: 'point', x: x0, y: y0 }, { id: 'b', type: 'point', x: x1, y: y0 },
      { id: 'c', type: 'point', x: x1, y: y1 }, { id: 'd', type: 'point', x: x0, y: y1 },
      { id: 'l1', type: 'line', p1: 'a', p2: 'b' }, { id: 'l2', type: 'line', p1: 'b', p2: 'c' },
      { id: 'l3', type: 'line', p1: 'c', p2: 'd' }, { id: 'l4', type: 'line', p1: 'd', p2: 'a' },
    ],
    constraints: [
      { id: 'h1', type: 'horizontal', refs: ['l1'] }, { id: 'h2', type: 'horizontal', refs: ['l3'] },
      { id: 'v1', type: 'vertical', refs: ['l2'] }, { id: 'v2', type: 'vertical', refs: ['l4'] },
    ],
  };
}

test('rectangle is under defined with 4 dof', () => {
  const s = rect(0, 0, 10, 5);
  const r = solveSketch(s);
  assert.equal(r.status, 'under');
  assert.equal(r.dof, 4);
});

test('dimensions and origin make it fully defined and drive geometry', () => {
  const s = rect(1, 1, 11, 6);
  s.constraints.push({ id: 'k', type: 'coincident', refs: ['a', 'origin'] });
  s.constraints.push({ id: 'D1', type: 'distance', refs: ['l1'], value: 40 });
  s.constraints.push({ id: 'D2', type: 'distance', refs: ['l2'], value: 20 });
  const r = solveSketch(s);
  assert.equal(r.status, 'fully');
  assert.equal(r.dof, 0);
  const c = s.entities.find((e) => e.id === 'c');
  assert.ok(Math.abs(c.x - 40) < 1e-6 && Math.abs(c.y - 20) < 1e-6, JSON.stringify(c));
  assert.equal(r.entityState.get('l3'), 'fully');
});

test('redundant dimension is over defined', () => {
  const s = rect(0, 0, 10, 5);
  s.constraints.push({ id: 'D1', type: 'distance', refs: ['l1'], value: 10 });
  s.constraints.push({ id: 'D3', type: 'distance', refs: ['l3'], value: 10 });
  const r = solveSketch(s);
  assert.equal(r.status, 'over');
  assert.ok(r.conflicts.has('D3'));
});

test('circle diameter, tangent line, drag', () => {
  const s = {
    entities: [
      { id: 'cp', type: 'point', x: 0.2, y: 0.1 }, { id: 'c1', type: 'circle', center: 'cp', r: 3 },
      { id: 'p1', type: 'point', x: -10, y: 6 }, { id: 'p2', type: 'point', x: 10, y: 6 },
      { id: 'l', type: 'line', p1: 'p1', p2: 'p2' },
    ],
    constraints: [
      { id: 'k', type: 'coincident', refs: ['cp', 'origin'] },
      { id: 'D', type: 'diameter', refs: ['c1'], value: 10 },
      { id: 'h', type: 'horizontal', refs: ['l'] },
      { id: 't', type: 'tangent', refs: ['l', 'c1'] },
    ],
  };
  const r = solveSketch(s);
  assert.ok(r.ok);
  assert.ok(Math.abs(s.entities[1].r - 5) < 1e-7);
  assert.ok(Math.abs(Math.abs(s.entities[2].y) - 5) < 1e-6);
  // drag the line end: stays tangent and horizontal
  solveSketch(s, { drag: [{ key: 'p2.x', value: 20 }, { key: 'p2.y', value: 9 }] });
  assert.ok(Math.abs(s.entities[3].x - 20) < 1e-3);
  assert.ok(Math.abs(Math.abs(s.entities[3].y) - 5) < 1e-6);
});

test('angle and arc', () => {
  const s = {
    entities: [
      { id: 'a', type: 'point', x: 0, y: 0 }, { id: 'b', type: 'point', x: 10, y: 0 }, { id: 'c', type: 'point', x: 8, y: 6 },
      { id: 'l1', type: 'line', p1: 'a', p2: 'b' }, { id: 'l2', type: 'line', p1: 'a', p2: 'c' },
      { id: 'o', type: 'point', x: 20, y: 0 }, { id: 's', type: 'point', x: 25, y: 0 }, { id: 'e', type: 'point', x: 20, y: 4 },
      { id: 'arc', type: 'arc', center: 'o', start: 's', end: 'e' },
    ],
    constraints: [{ id: 'h', type: 'horizontal', refs: ['l1'] }, { id: 'A', type: 'angle', refs: ['l1', 'l2'], value: 60 }],
  };
  solveSketch(s);
  assert.ok(Math.abs(measure(s, { type: 'angle', refs: ['l1', 'l2'] }) - 60) < 1e-6);
  const [o, st, en] = ['o', 's', 'e'].map((id) => s.entities.find((x) => x.id === id));
  assert.ok(Math.abs(Math.hypot(en.x - o.x, en.y - o.y) - Math.hypot(st.x - o.x, st.y - o.y)) < 1e-7);
});

test('slot: tangent arcs joined at endpoints are not redundant', () => {
  const P = (id, x, y) => ({ id, type: 'point', x, y });
  const s = {
    entities: [P('c1', 0, 0), P('c2', 20, 0), P('q1', 0, 5), P('q2', 20, 5), P('q3', 20, -5), P('q4', 0, -5),
      { id: 'l1', type: 'line', p1: 'q1', p2: 'q2' }, { id: 'l2', type: 'line', p1: 'q3', p2: 'q4' },
      { id: 'a1', type: 'arc', center: 'c1', start: 'q1', end: 'q4' }, { id: 'a2', type: 'arc', center: 'c2', start: 'q3', end: 'q2' }],
    constraints: [['l1', 'a1'], ['l1', 'a2'], ['l2', 'a1'], ['l2', 'a2']].map((refs, i) => ({ id: 't' + i, type: 'tangent', refs }))
      .concat([{ id: 'eq', type: 'equal', refs: ['a1', 'a2'] }]),
  };
  const r = solveSketch(s);
  assert.equal(r.status, 'under');
  assert.equal(r.dof, 5);
  assert.equal(r.conflicts.size, 0);
});

test('sketch fillet corner with virtual sharp stays consistent', () => {
  const P = (id, x, y) => ({ id, type: 'point', x, y });
  const s = {
    entities: [P('a', 0, 0), P('b', 30, 0), P('v', 30, 20), P('t1', 30, 15), P('t2', 25, 20), P('c', 25, 15), P('d', 0, 20),
      { id: 'l1', type: 'line', p1: 'a', p2: 'b' }, { id: 'l2', type: 'line', p1: 'b', p2: 't1' },
      { id: 'l3', type: 'line', p1: 't2', p2: 'd' }, { id: 'l4', type: 'line', p1: 'd', p2: 'a' },
      { id: 'arc', type: 'arc', center: 'c', start: 't1', end: 't2' }],
    constraints: [
      { id: 'h1', type: 'horizontal', refs: ['l1'] }, { id: 'h2', type: 'horizontal', refs: ['l3'] },
      { id: 'v1', type: 'vertical', refs: ['l2'] }, { id: 'v2', type: 'vertical', refs: ['l4'] },
      { id: 'ta', type: 'tangent', refs: ['l2', 'arc'] }, { id: 'tb', type: 'tangent', refs: ['l3', 'arc'] },
      { id: 'k1', type: 'coincident', refs: ['v', 'l2'] }, { id: 'k2', type: 'coincident', refs: ['v', 'l3'] },
      { id: 'R', type: 'radius', refs: ['arc'], value: 5 },
    ],
  };
  const r = solveSketch(s);
  assert.ok(r.ok);
  assert.notEqual(r.status, 'over', [...r.conflicts].join(','));
  assert.equal(r.dof, 4);
});

// Two 50 mm lines from the origin: one along x, one at `deg`. As a V (both from the origin) or as a
// polyline corner (a -> origin -> c), so the stored value is the directional angle or its supplement.
function vee(deg, corner = false) {
  const t = (deg * Math.PI) / 180;
  return {
    entities: [
      { id: 'a', type: 'point', x: 50, y: 0 }, { id: 'c', type: 'point', x: 50 * Math.cos(t), y: 50 * Math.sin(t) },
      { id: 'l1', type: 'line', p1: corner ? 'a' : 'origin', p2: corner ? 'origin' : 'a' }, { id: 'l2', type: 'line', p1: 'origin', p2: 'c' },
    ],
    constraints: [
      { id: 'h', type: 'horizontal', refs: ['l1'] },
      { id: 'L1', type: 'distance', refs: ['l1'], value: 50 }, { id: 'L2', type: 'distance', refs: ['l2'], value: 50 },
    ],
  };
}
const lineAngle = (s) => { const c = s.entities.find((e) => e.id === 'c'); return (Math.atan2(c.y, c.x) * 180) / Math.PI; };

test('an angle dimension can be set across 90 degrees, on a V and on a corner', () => {
  for (const corner of [false, true]) {
    for (const [from, to] of [[30, 150], [45, 135], [150, 30]]) {
      const s = vee(from, corner);
      // the angle between the two lines at the origin; on the corner that is the supplement of the
      // angle between the lines' directions (a -> origin, origin -> c), as feature recognition writes it
      const value = from;
      s.constraints.push({ id: 'A', type: 'angle', refs: ['l1', 'l2'], value, label: [0, 0] });
      assert.equal(solveSketch(s).status, 'fully');
      assert.ok(Math.abs(lineAngle(s) - from) < 1e-6, `${corner} ${from} -> ${lineAngle(s)}`);
      assert.equal(s.constraints[3].supplement, corner); // the side, fixed from the geometry it was drawn with
      s.constraints[3].value = to;
      const r = solveSketch(s);
      assert.ok(r.ok && r.status === 'fully', JSON.stringify(r));
      assert.ok(Math.abs(Math.abs(lineAngle(s)) - to) < 1e-6, `${corner} ${from} -> ${to}: ${lineAngle(s)}`);
      assert.ok(Math.abs(measure(s, s.constraints[3]) - s.constraints[3].value) < 1e-6);
    }
  }
});

test('independent parts of a big sketch are solved apart (441 converted circles + a line)', () => {
  const ents = [], cons = [];
  for (let i = 0; i < 441; i++) {
    ents.push({ id: 'p' + i, type: 'point', x: (i % 21) * 10, y: Math.floor(i / 21) * 10 }, { id: 'c' + i, type: 'circle', center: 'p' + i, r: 2 });
    cons.push({ id: 'f' + i, type: 'fix', refs: ['p' + i] }, { id: 'd' + i, type: 'diameter', refs: ['c' + i], value: 4 });
  }
  ents.push({ id: 'a', type: 'point', x: -5, y: -5 }, { id: 'b', type: 'point', x: 50, y: -7 }, { id: 'L', type: 'line', p1: 'a', p2: 'b' });
  cons.push({ id: 'h', type: 'horizontal', refs: ['L'] }, { id: 'h2', type: 'horizontal', refs: ['a', 'b'] });
  const t = performance.now();
  const r = solveSketch({ entities: ents, constraints: cons });
  assert.ok(performance.now() - t < 1000, `${performance.now() - t} ms`); // 5 to 15 s as one dense problem
  assert.equal(r.dof, 3); // the line: x, x and y of its ends, the second horizontal is redundant
  assert.deepEqual([...r.conflicts], ['h2']);
  assert.equal(r.entityState.get('c7'), 'fully');
  assert.equal(r.entityState.get('a'), 'over'); // the redundant relation's points
  assert.ok(Math.abs(ents.find((e) => e.id === 'b').y - ents.find((e) => e.id === 'a').y) < 1e-9);
});
