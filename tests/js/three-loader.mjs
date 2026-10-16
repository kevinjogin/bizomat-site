// The browser uses an import map. Node tests resolve the same vendored Three.js.
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'three') return { url: new URL('../../opensketch/static/vendor/three.module.js', import.meta.url).href, shortCircuit: true };
  return nextResolve(specifier, context);
}
