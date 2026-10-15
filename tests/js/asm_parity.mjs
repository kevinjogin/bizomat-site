// Runs the browser mate solver on cases written by tests/test_solver_parity.py and prints its
// results as JSON, so the test can compare them with assembly.py. Usage: node asm_parity.mjs cases.json
import { readFileSync } from 'node:fs';
import { solve } from '../../opensketch/static/js/asmsolver.js';

const cases = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = cases.map(({ asm, size, drag }) => {
  const t = performance.now();
  const s = solve(asm, size, drag || null);
  return {
    ms: performance.now() - t,
    poses: Object.fromEntries(Object.entries(s.poses).map(([k, p]) => [k, p.matrix()])),
    mates: s.mates, comp_state: s.comp_state, dof: s.dof, updates: s.updates,
  };
});
process.stdout.write(JSON.stringify(out));
