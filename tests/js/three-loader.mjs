// Use the app's vendored Three.js for non-rendering Sketcher integration tests.
export function resolve(specifier, context, nextResolve) {
  if (specifier === 'three') return {
    url: new URL('../../opensketch/static/vendor/three.module.min.js', import.meta.url).href,
    shortCircuit: true,
  };
  return nextResolve(specifier, context);
}
