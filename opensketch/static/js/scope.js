// Browser storage per signed-in person: the unsaved draft, unsent edits and the last open file belong to whoever is
// signed in, so someone using an early access code on the owner's browser never sees the owner's work (YZ 2026-10-19).
// Until the page knows who is signed in (a slow or failed /api/account), person data is neither read nor written:
// it never falls back to keys another person could pick up.
let scope = '';
let known = false;

export const setScope = (id) => { scope = id ? '.' + id : ''; known = true; };
export const scopeKnown = () => known;
export const skey = (k) => k + scope;

// The owner had these keys before they were per person: hand them over, once per browser (later unscoped
// writes, from an older page, are never adopted).
const ADOPTED = 'opensketch.adopted';
export function adopt(keys) {
  if (!scope) return;
  try {
    if (localStorage.getItem(ADOPTED)) return;
    for (const k of keys) {
      const old = localStorage.getItem(k);
      if (old != null && localStorage.getItem(k + scope) == null) localStorage.setItem(k + scope, old);
      localStorage.removeItem(k);
    }
    localStorage.setItem(ADOPTED, '1');
  } catch (_) { /* storage off */ }
}
