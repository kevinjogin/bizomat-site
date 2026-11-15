// .github/scripts/stripe-check.sh (the "Stripe live settings check" workflow): it names what is missing or wrong, sees a
// missing permission as Stripe's 403, makes nothing (writes carry a made-up parameter), and never prints a value.
// Stripe is a local stand-in here; no request leaves the machine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { spawn } from 'node:child_process';
import type { AddressInfo } from 'node:net';

// Not keys: shaped like Stripe's so the format checks accept them, built at run time (secret scanners read this repo).
const fake = (...parts: string[]) => parts.join('_');
const SECRET = fake('rk', 'live', 'checkScriptNotAKey123');
const PUBLISHABLE = fake('pk', 'live', 'checkScriptNotAKey456');
const WEBHOOK = fake('whsec', 'checkScriptNotASecret789');

async function withStripe(lacking: string[], run: (base: string, seen: string[]) => Promise<void>) {
  const seen: string[] = [];
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const path = (req.url ?? '').split('?')[0];
      seen.push(`${req.method} ${path} ${req.headers.authorization === `Bearer ${SECRET}` ? 'key' : 'nokey'} ${body}`);
      const send = (status: number, obj: unknown) => res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify(obj));
      if (lacking.some((p) => path.startsWith(p))) return send(403, { error: { type: 'invalid_request_error', code: 'more_permissions_required' } });
      if (req.method === 'POST') return send(400, { error: { type: 'invalid_request_error', code: 'parameter_unknown' } });
      if (path.startsWith('/v1/prices/')) return send(200, { id: path.split('/').pop(), object: 'price', livemode: true });
      return send(200, { object: 'list', data: [] });
    });
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  try {
    await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`, seen);
  } finally {
    server.close();
  }
}

// Asynchronous on purpose: the stand-in answers from this same process, so a synchronous child would wait for ever.
function check(base: string, env: Record<string, string>): Promise<{ code: number | null; out: string }> {
  return new Promise((resolve) => {
    const child = spawn('bash', ['.github/scripts/stripe-check.sh'], {
      env: { PATH: process.env.PATH ?? '', STRIPE_API: base, NO_PROXY: '127.0.0.1', no_proxy: '127.0.0.1', ...env },
    });
    let out = '';
    child.stdout.on('data', (c) => (out += c));
    child.stderr.on('data', (c) => (out += c));
    child.on('close', (code) => resolve({ code, out }));
  });
}

test('all three set and every permission held: ready, nothing made, no value printed', async () => {
  await withStripe([], async (base, seen) => {
    const r = await check(base, { STRIPE_SECRET: SECRET, STRIPE_PUBLISHABLE: PUBLISHABLE, STRIPE_WEBHOOK: WEBHOOK });
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /All live Stripe settings are ready/);
    assert.match(r.out, /reads the configured price price_1UbyE5Rs74vQph6MdBU51OeG/);
    for (const v of [SECRET, PUBLISHABLE, WEBHOOK]) assert.ok(!r.out.includes(v), 'a value was printed');
    // Every request carried the key (on standard input to curl), and every write a made-up parameter only.
    assert.ok(seen.length >= 12 && seen.every((s) => s.includes(' key ')), seen.join('\n'));
    for (const w of seen.filter((s) => s.startsWith('POST'))) assert.match(w, / bizomat_check_unknown_parameter=1$/);
  });
});

test('a missing permission, a missing secret and a test key are each named', async () => {
  await withStripe(['/v1/customers', '/v1/invoices'], async (base) => {
    const r = await check(base, { STRIPE_SECRET: SECRET, STRIPE_PUBLISHABLE: '', STRIPE_WEBHOOK: WEBHOOK });
    assert.equal(r.code, 1);
    assert.match(r.out, /FAILED: the key lacks Customers: Write \(HTTP 403\)/);
    assert.match(r.out, /FAILED: the key lacks Invoices: Write \(HTTP 403\)/);
    assert.match(r.out, /ok: Checkout Sessions: Write/);
    assert.match(r.out, /FAILED: WORK_STRIPE_PUBLISHABLE_KEY is not set/);
  });
  await withStripe([], async (base, seen) => {
    const r = await check(base, { STRIPE_SECRET: fake('sk', 'test', 'checkScriptNotAKey'), STRIPE_PUBLISHABLE: PUBLISHABLE, STRIPE_WEBHOOK: WEBHOOK });
    assert.equal(r.code, 1);
    assert.match(r.out, /not a live secret or restricted key/);
    assert.equal(seen.length, 0, 'a test key is never sent anywhere');
  });
});
