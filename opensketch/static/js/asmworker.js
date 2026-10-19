// The browser's mate solver (asmsolver.js) off the main thread, for drag frames: a long linkage can take a large
// fraction of a second per solve, and the page must keep answering meanwhile. Same code, same results.
import { regenLocal } from './asmsolver.js';

self.onmessage = (e) => {
  const { id, asm, parts, drag } = e.data;
  try { self.postMessage({ id, res: regenLocal(asm, parts, drag) }); } catch (err) { self.postMessage({ id, error: String(err?.message || err) }); }
};
