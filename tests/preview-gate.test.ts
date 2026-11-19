import test from 'node:test';
import assert from 'node:assert/strict';
// The review preview's gate (infrastructure/preview/gate.mjs): links must stay on the preview, never reach production.
import { authorisedBy, isLoopback, pinnedOrigin, publicOrigin, toPreview, toProduction } from '../infrastructure/preview/gate.mjs';

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

// Staging (fly.staging.toml): the gate takes its address from GATE_PUBLIC_ORIGIN and must have a password.

const STAGING = 'https://bizomat-staging.fly.dev';
const basic = (user: string, password: string) => `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;

test('a pinned address wins over the request headers, so a forged X-Forwarded-Host cannot move the links', () => {
  assert.equal(publicOrigin({ headers: { host: 'bizomat-staging.fly.dev', 'x-forwarded-host': 'evil.example' } }, STAGING), STAGING);
  assert.equal(publicOrigin({ headers: { host: 'evil.example', 'x-forwarded-proto': 'http' } }, STAGING), STAGING);
});

test('the pinned address must be an https origin and nothing more', () => {
  assert.equal(pinnedOrigin(''), '');
  assert.equal(pinnedOrigin(undefined), '');
  assert.equal(pinnedOrigin('https://bizomat-staging.fly.dev'), STAGING);
  assert.equal(pinnedOrigin('https://bizomat-staging.fly.dev/'), STAGING);
  for (const bad of ['http://bizomat-staging.fly.dev', 'https://bizomat-staging.fly.dev/erp', 'https://u:p@bizomat-staging.fly.dev', 'https://bizomat-staging.fly.dev/?x=1', 'not a url']) {
    assert.throws(() => pinnedOrigin(bad), bad);
  }
});

test('sign-in: user "review" with the exact password; no password means open (this computer only)', () => {
  assert.equal(authorisedBy(basic('review', 'correct horse'), 'correct horse'), true);
  assert.equal(authorisedBy(basic('review', 'correct hors'), 'correct horse'), false);
  assert.equal(authorisedBy(basic('admin', 'correct horse'), 'correct horse'), false);
  assert.equal(authorisedBy(basic('review', 'a:b'), 'a:b'), true);
  assert.equal(authorisedBy('Bearer wos_abc', 'correct horse'), false);
  assert.equal(authorisedBy('', 'correct horse'), false);
  assert.equal(authorisedBy(undefined, 'correct horse'), false);
  assert.equal(authorisedBy(undefined, ''), true);
});

test('only loopback addresses count as this computer (the gate refuses to start elsewhere without a password)', () => {
  for (const h of ['127.0.0.1', '::1', 'localhost']) assert.equal(isLoopback(h), true, h);
  for (const h of ['::', '0.0.0.0', 'fdaa::1', '10.0.0.1']) assert.equal(isLoopback(h), false, h);
});
