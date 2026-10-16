// Shared document operations. No rendering or geometry-kernel dependencies.
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function safeUrl(value) {
  try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : null; } catch { return null; }
}

export function featureSketchIds(f) {
  return [...new Set([f.sketch, f.type === 'sweep' && f.path, ...(f.profiles || [])].filter(Boolean))];
}

export function featureReferences(f) {
  return [...featureSketchIds(f), ...(f.features || []), f.plane?.ref, f.base?.ref].filter(Boolean);
}

export function dependentFeatureIds(doc, roots) {
  const removed = new Set(roots);
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of doc.features) {
      if (!removed.has(f.id) && featureReferences(f).some((id) => removed.has(id))) {
        removed.add(f.id); changed = true;
      }
    }
  }
  return removed;
}

export function removeFeatures(doc, removed) {
  if (doc.rollback != null) doc.rollback -= doc.features.slice(0, doc.rollback).filter((f) => removed.has(f.id)).length;
  doc.features = doc.features.filter((f) => !removed.has(f.id));
}

export function mateReferences(mate) {
  return ['refs', 'planes', 'angle_refs'].flatMap((key) => mate[key] || []);
}

// Viewer picks retain part-local geometry for mates. Measurements require assembly coordinates.
export function measurementData(data, matrix) {
  if (!matrix) return data;
  const transform = (v, point) => [0, 1, 2].map((row) =>
    matrix[row * 4] * v[0] + matrix[row * 4 + 1] * v[1] + matrix[row * 4 + 2] * v[2] + (point ? matrix[row * 4 + 3] : 0));
  return { ...data, ...(data.center && { center: transform(data.center, true) }),
    ...(data.mid && { mid: transform(data.mid, true) }), ...(data.normal && { normal: transform(data.normal, false) }) };
}
