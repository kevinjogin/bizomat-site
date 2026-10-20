// Runs the sketch solver for the server (sketch checks and inspect_design): reads
// {"sketches": [{id, entities, constraints}, ...]} on stdin and prints
// {"<sketch id>": {dof, status, solved, conflicts, under}} on stdout. With "entities": true each result also
// has the solved entities (used when an equation changes a sketch dimension on the server).
import { solveSketch } from './solver.js';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  const out = {};
  const req = JSON.parse(raw);
  for (const s of req.sketches || []) {
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
      if (req.entities) out[s.id].entities = sketch.entities;
    } catch (err) {
      out[s.id] = { error: String(err) };
    }
  }
  process.stdout.write(JSON.stringify(out));
});
