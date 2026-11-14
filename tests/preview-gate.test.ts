import test from 'node:test';
import assert from 'node:assert/strict';
// The review preview's gate (infrastructure/preview/gate.mjs): links must stay on the preview, never reach production.
import { publicOrigin, toPreview, toProduction } from '../infrastructure/preview/gate.mjs';

const PREVIEW = 'https://quiet-river-mesa.trycloudflare.com';

test('production addresses in pages, scripts and JSON become the preview address', () => {
  assert.equal(toPreview('<a href="https://bizomat.ai/erp/login">', PREVIEW), `<a href="${PREVIEW}/erp/login">`);
  assert.equal(toPreview('https://www.bizomat.ai/systems/', PREVIEW), `${PREVIEW}/systems/`);
  assert.equal(toPreview('{"url":"https:\\/\\/bizomat.ai\\/erp\\/"}', PREVIEW), '{"url":"https:\\/\\/quiet-river-mesa.trycloudflare.com\\/erp\\/"}');
  assert.equal(toPreview('see https://bizomat.ai.', PREVIEW), `see ${PREVIEW}.`);
  assert.equal(toPreview("Location: https://bizomat.ai", PREVIEW), `Location: ${PREVIEW}`);
});

test('other hosts are left alone', () => {
  for (const s of ['https://mcp.bizomat.ai/mcp', 'https://bizomat.ai.example.com/', 'https://kevos.com/', 'bizomat.ai/erp']) {
    assert.equal(toPreview(s, PREVIEW), s);
  }
});

test('Origin and Referer from the preview reach the apps as bizomat.ai; anything else is unchanged', () => {
  assert.equal(toProduction(PREVIEW, PREVIEW), 'https://bizomat.ai');
  assert.equal(toProduction(`${PREVIEW}/erp/login?next=/erp/`, PREVIEW), 'https://bizomat.ai/erp/login?next=/erp/');
  assert.equal(toProduction('https://evil.example', PREVIEW), 'https://evil.example');
});

test('the preview address comes from the tunnel request', () => {
  assert.equal(publicOrigin({ headers: { host: 'quiet-river-mesa.trycloudflare.com', 'x-forwarded-proto': 'https' } }), PREVIEW);
  assert.equal(publicOrigin({ headers: { host: '127.0.0.1:8090' } }), 'http://127.0.0.1:8090');
});
