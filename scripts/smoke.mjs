#!/usr/bin/env node
// Post-deployment smoke test. Usage: node scripts/smoke.mjs https://workos-platform-preview.example.workers.dev
// Verifies: health + DB, security headers, auth enforcement on private APIs,
// login page served, SPA navigation redirects to /login, CORS preflight refused.

const base = (process.argv[2] || process.env.SMOKE_URL || 'http://localhost:8787').replace(/\/$/, '');
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`  ok   ${name}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL ${name}: ${e.message}`);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log(`Smoke testing ${base}`);

await check('health endpoint reports ok + database', async () => {
  const r = await fetch(`${base}/api/health`);
  assert(r.status === 200, `status ${r.status}`);
  const j = await r.json();
  assert(j.status === 'ok' && j.db === 'ok', JSON.stringify(j));
});

await check('security headers present', async () => {
  const r = await fetch(`${base}/api/health`);
  for (const h of ['content-security-policy', 'x-content-type-options', 'x-frame-options', 'referrer-policy']) assert(r.headers.get(h), `missing ${h}`);
});

for (const path of ['/api/workspaces', '/api/notifications', '/api/auth/me', '/api/boards/does-not-exist']) {
  await check(`unauthenticated ${path} -> 401`, async () => {
    const r = await fetch(`${base}${path}`);
    assert(r.status === 401, `status ${r.status}`);
  });
}

await check('unauthenticated mutation rejected', async () => {
  const r = await fetch(`${base}/api/workspaces`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"x"}' });
  assert(r.status === 401 || r.status === 403, `status ${r.status}`);
});

await check('login page served', async () => {
  const r = await fetch(`${base}/login`, { headers: { Accept: 'text/html' } });
  assert(r.status === 200, `status ${r.status}`);
  assert((await r.text()).includes('<div id="root">'), 'no SPA root');
});

await check('private page redirects to /login', async () => {
  const r = await fetch(`${base}/w/anything/home`, { headers: { Accept: 'text/html' }, redirect: 'manual' });
  assert(r.status === 302 && (r.headers.get('location') || '').startsWith('/login'), `status ${r.status} ${r.headers.get('location')}`);
});

await check('admin API requires authentication', async () => {
  const r = await fetch(`${base}/api/admin/overview`);
  assert(r.status === 401, `status ${r.status}`);
});

await check('admin page redirects signed-out visitors to /login', async () => {
  const r = await fetch(`${base}/admin`, { headers: { Accept: 'text/html' }, redirect: 'manual' });
  assert(r.status === 302 && (r.headers.get('location') || '').startsWith('/login'), `status ${r.status}`);
});

await check('privacy notice is public', async () => {
  const r = await fetch(`${base}/privacy`, { headers: { Accept: 'text/html' }, redirect: 'manual' });
  assert(r.status === 200, `status ${r.status}`);
});

await check('heartbeat requires authentication', async () => {
  const r = await fetch(`${base}/api/heartbeat`, { method: 'POST' });
  assert(r.status === 401 || r.status === 403, `status ${r.status}`);
});

await check('CORS preflight refused', async () => {
  const r = await fetch(`${base}/api/workspaces`, { method: 'OPTIONS', headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST' } });
  assert(!r.headers.get('access-control-allow-origin'), 'CORS header present');
});

if (failed) {
  console.error(`${failed} smoke check(s) failed`);
  process.exit(1);
}
console.log('All smoke checks passed');
