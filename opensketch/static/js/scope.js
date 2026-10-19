// Browser storage per signed-in person: the unsaved draft and the last open file belong to whoever is signed in,
// so someone using an early access code on the owner's browser never sees the owner's work (YZ 2026-10-19).
let scope = '';

export const setScope = (id) => { scope = id ? '.' + id : ''; };
export const skey = (k) => k + scope;

// The owner had these keys before they were per person: hand them over once.
export function adopt(keys) {
  if (!scope) return;
  try {
    for (const k of keys) {
      const old = localStorage.getItem(k);
      if (old != null && localStorage.getItem(k + scope) == null) localStorage.setItem(k + scope, old);
      localStorage.removeItem(k);
    }
  } catch (_) { /* storage off */ }
}

