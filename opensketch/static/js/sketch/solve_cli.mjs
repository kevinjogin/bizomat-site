// Runs the browser's sketch solver for the server (inspect_design): reads
// {"sketches": [{id, entities, constraints}, ...]} on stdin and prints
// {"<sketch id>": {dof, status, solved, conflicts, under}} on stdout.
// The same solver.js the browser uses, so the server never disagrees with the page.
import { solveSketch } from './solver.js';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  const out = {};
  for (const s of JSON.parse(raw).sketches || []) {
    const sketch = { entities: structuredClone(s.entities || []), constraints: structuredClone(s.constraints || []) };
    try {
      const r = solveSketch(sketch);
      const under = [];
      for (const [id, state] of r.entityState) {
        const e = sketch.entities.find((x) => x.id === id);
        if (state === 'under' && e && !e.ref && e.type !== 'point') under.push(id);
      }
      out[s.id] = { dof: r.dof, status: r.status, solved: r.ok, conflicts: [...r.conflicts], under };
      if (r.error) out[s.id].error = r.error;
    } catch (err) {
      out[s.id] = { error: String(err) };
    }
  }
  process.stdout.write(JSON.stringify(out));
});
