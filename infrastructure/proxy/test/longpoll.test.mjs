// A 25 second long poll (the CAD add-in's GET /mcp/sw/next is held 25 s) passes with the default timeouts.
// The poll starts when this file is loaded, so in the single-process run (all.mjs loads this file last) its
// wait overlaps the other tests instead of adding 25 s to them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { request, startProxy, startUpstream } from './helpers.mjs';

const run = (async () => {
  const cad = await startUpstream('cad');
  const other = await startUpstream('other');
  const px = await startProxy({ web: other.url, work: other.url, cad: cad.url });
  try {
    const t0 = performance.now();
    const r = await request(px.port, { host: 'cados.kevos.com', path: '/slow?ms=25000' });
    return { r, ms: performance.now() - t0, idle: px.config.idleTimeoutMs };
  } finally {
    await px.close();
    await cad.close();
    await other.close();
  }
})();
run.catch(() => {}); // reported by the test below

test('a 25 s long poll is held open and answered (default idle timeout)', { timeout: 60_000 }, async () => {
  const { r, ms, idle } = await run;
  assert.equal(idle, 620_000);
  assert.equal(r.status, 200);
  assert.deepEqual(r.json(), { name: 'cad', waited: 25000 });
  assert.ok(ms >= 24_900, `answered after ${Math.round(ms)} ms`);
});
