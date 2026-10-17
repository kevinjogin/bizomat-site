// Materialize a validated preview as ordinary editable sketch geometry.
// Work on a detached sketch so a failed solve cannot leave a partial offset.
export function buildOffsetSketch(sketch, plan, uid) {
  const result = JSON.parse(JSON.stringify(sketch));
  const sources = new Map(result.entities.map((e) => [e.id, e]));
  const points = [], ids = [];
  const point = (xy) => {
    const found = points.find((p) => Math.hypot(p.x - xy[0], p.y - xy[1]) < 1e-8);
    if (found) return found.id;
    const p = { id: uid('p'), type: 'point', x: xy[0], y: xy[1] };
    result.entities.push(p); points.push(p); return p.id;
  };
  for (const curve of plan.curves) {
    const source = sources.get(curve.source);
    if (!source) throw new Error('The source selection changed. Select the entities again.');
    let entity;
    if (curve.type === 'line') entity = { type: 'line', p1: point(curve.p1), p2: point(curve.p2) };
    else if (curve.type === 'arc') entity = {
      type: 'arc', center: source.center, start: point(curve.start), end: point(curve.end),
    };
    else if (curve.type === 'circle') entity = { type: 'circle', center: source.center, r: curve.r };
    else throw new Error('This sketch entity cannot be offset.');
    entity.id = uid(entity.type[0]);
    if (curve.construction) entity.construction = true;
    result.entities.push(entity); ids.push(entity.id);
  }
  return { sketch: result, ids };
}
