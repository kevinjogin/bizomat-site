import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, type ContactEnv } from '../src/server/contact/handler.ts';
import { composeContactEmail, CONTACT_FAILURE, type ContactEmail } from '../src/server/contact/cloudflare-mail.ts';
import { enquirySubject, normalise, validate } from '../src/lib/contact.ts';

const sent: ContactEmail[] = [];
const verified: URLSearchParams[] = [];
const env: ContactEnv = {
  TURNSTILE_SECRET_KEY: 'test-only-secret',
  EMAIL: { send: async (message) => { sent.push(message); return { messageId: 'test-message-id' }; } },
};
const valid: Record<string, string> = {
  name: 'Alex Example', email: 'alex@example.com', company: 'Example Pty Ltd', phone: '',
  service: 'Factory Fix', contactMethod: 'Email', message: 'Hello KEVOS, we have a recurring rework problem on one assembly line.',
  consent: 'on', 'cf-turnstile-response': 'test-only-token',
};
beforeEach(() => {
  sent.length = 0; verified.length = 0;
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(url), 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(init?.method, 'POST'); assert.ok(init?.signal);
    verified.push(new URLSearchParams(String(init?.body)));
    return Response.json({ success: true, hostname: 'kevos.com', action: 'contact' });
  }) as typeof fetch;
});
function request(fields: Record<string, string> = valid, origin = 'https://kevos.com') {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  return new Request('https://kevos.com/api/contact', { method: 'POST', body, headers: { Origin: origin, 'CF-Connecting-IP': '203.0.113.7' } });
}
const post = (fields: Record<string, string> = valid, e: ContactEnv = env) => handleContact(request(fields), e);

test('contact is POST-only and every method response is JSON', async () => {
  for (const method of ['GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']) {
    const response = await handleContact(new Request('https://kevos.com/api/contact', { method }), env);
    assert.equal(response.status, 405); assert.equal(response.headers.get('Allow'), 'POST');
    assert.match(response.headers.get('Content-Type')!, /application\/json/); assert.equal((await response.json() as any).success, false);
  }
  assert.equal(sent.length, 0); assert.equal(verified.length, 0);
});
test('valid enquiry is verified first and delivered with fixed addresses and escaped content', async () => {
  const fields = { ...valid, name: '  Alex & Example  ', email: ' ALEX@example.com ', subject: 'Tooling <review>', company: 'A < B & C', message: 'Hi <script>alert("x")</script>\nPlease review this assembly.' };
  const req = request(fields);
  Object.defineProperty(req, 'cf', { value: { country: 'AU' } });
  const response = await handleContact(req, env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, message: 'Thank you. Your message has been sent.' });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(verified.length, 1); assert.equal(verified[0].get('secret'), 'test-only-secret');
  assert.equal(verified[0].get('response'), 'test-only-token'); assert.equal(verified[0].get('remoteip'), '203.0.113.7');
  assert.equal(sent.length, 1);
  const email = sent[0]; assert.equal(email.to, 'kevin@kevos.com'); assert.equal(email.from, 'contact-form@kevos.com'); assert.equal(email.replyTo, 'alex@example.com');
  assert.equal(email.subject, 'New KEVOS enquiry: Tooling <review>');
  for (const label of ['Name', 'Visitor email', 'Company', 'Subject', 'Message', 'Submission time (UTC)', 'Request IP country']) { assert.ok(email.text.includes(label)); assert.ok(email.html.includes(label)); }
  assert.ok(email.text.includes('<script>')); assert.ok(!email.html.includes('<script>')); assert.ok(email.html.includes('&lt;script&gt;')); assert.ok(email.html.includes('A &lt; B &amp; C'));
  assert.ok(email.text.includes('Name: Alex & Example')); assert.ok(email.text.includes('Request IP country: AU'));
  assert.match(email.text, /Submission time \(UTC\): \d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/);
});
test('enquiries without an explicit subject use the required fallback', async () => {
  assert.equal((await post()).status, 200); assert.equal(sent[0].subject, 'New KEVOS website enquiry');
  assert.ok(sent[0].text.includes('Service required: Factory Fix'));
  assert.ok(!sent[0].text.includes('Request IP country'), 'absent metadata is not invented');
});
test('missing required form values are rejected before verification or email', async () => {
  for (const key of ['name', 'email', 'company', 'service', 'message', 'consent']) {
    const response = await post({ ...valid, [key]: '' });
    assert.equal(response.status, 422, key); const body = await response.json() as any;
    assert.equal(body.success, false); assert.ok(body.errors[key], key);
  }
  assert.equal(verified.length, 0); assert.equal(sent.length, 0);
});
test('invalid email, header injection and malformed contact preferences are rejected', async () => {
  for (const email of ['not-an-email', 'a@@example.com', '.a@example.com', 'a..b@example.com', 'a@-example.com', 'a@example..com', 'a@example.com\r\nBcc: b@example.com']) assert.equal((await post({ ...valid, email })).status, 422, email);
  assert.equal((await post({ ...valid, subject: 'Quote\r\nBcc: another@example.com' })).status, 422);
  assert.equal((await post({ ...valid, contactMethod: 'Unknown' })).status, 422);
  assert.equal((await post({ ...valid, contactMethod: 'Phone' })).status, 422);
  assert.equal(sent.length, 0);
});
test('each supported field has a server-enforced length limit without silent truncation', async () => {
  for (const [key, length] of Object.entries({ name: 101, email: 201, company: 151, phone: 41, service: 61, subject: 161, message: 5001, source: 81, 'cf-turnstile-response': 2049 })) {
    assert.equal((await post({ ...valid, [key]: 'x'.repeat(length) })).status, 422, key);
  }
  assert.equal(sent.length, 0); assert.equal(verified.length, 0);
});
test('missing or blank Turnstile tokens never reach verification or email', async () => {
  const { 'cf-turnstile-response': _, ...fields } = valid;
  for (const input of [fields, { ...fields, 'cf-turnstile-response': '  ' }]) assert.equal((await post(input)).status, 403);
  assert.equal(sent.length, 0); assert.equal(verified.length, 0);
});
test('failed, replayed, wrong-action and wrong-hostname tokens fail closed', async () => {
  const responses = [
    { success: false, 'error-codes': ['timeout-or-duplicate'] }, { success: 'true', hostname: 'kevos.com', action: 'contact' },
    { success: true, hostname: 'evil.example', action: 'contact' }, { success: true, hostname: 'localhost', action: 'contact' },
    { success: true, hostname: 'kevos.com', action: 'signup' }, { success: true },
  ];
  for (const value of responses) {
    globalThis.fetch = async () => Response.json(value);
    assert.equal((await post()).status, 403);
  }
  assert.equal(sent.length, 0);
});
test('both approved production widget hostnames are accepted', async () => {
  globalThis.fetch = async () => Response.json({ success: true, hostname: 'www.kevos.com', action: 'contact' });
  assert.equal((await post()).status, 200); assert.equal(sent.length, 1);
});
test('Turnstile HTTP failures, invalid JSON and network failures return safe errors', async () => {
  for (const stub of [async () => new Response('provider internals', { status: 500 }), async () => new Response('invalid JSON'), async () => { throw new Error('sensitive provider detail'); }]) {
    globalThis.fetch = stub;
    const response = await post(); assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { success: false, message: CONTACT_FAILURE });
  }
  assert.equal(sent.length, 0);
});
test('missing secret or binding fails before verifying and cannot fall back to log or Resend', async () => {
  for (const e of [{}, { EMAIL: env.EMAIL }, { TURNSTILE_SECRET_KEY: 'test-only-secret' }, { MAIL_PROVIDER: 'log' }, { MAIL_PROVIDER: 'resend', RESEND_API_KEY: 'test-key' }] as ContactEnv[]) {
    assert.equal((await post(valid, e)).status, 503);
  }
  assert.equal(verified.length, 0); assert.equal(sent.length, 0);
});
test('email delivery rejection never reports success or leaks provider details', async () => {
  for (const send of [async () => { throw new Error('sensitive mail details'); }, async () => ({ messageId: '' })]) {
    const response = await post(valid, { ...env, EMAIL: { send } });
    assert.equal(response.status, 502); assert.deepEqual(await response.json(), { success: false, message: CONTACT_FAILURE });
  }
  assert.equal(verified.length, 2);
});
test('same-origin checks reject foreign, malformed and downgrade origins without CORS', async () => {
  for (const origin of ['https://evil.example', 'not a url', 'null', 'http://kevos.com']) {
    const response = await handleContact(request(valid, origin), { ...env, ALLOWED_ORIGINS: origin });
    assert.equal(response.status, 403); assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
  assert.equal(sent.length, 0);
});
test('JSON and URL-encoded inputs work; scalar objects, files and repeated fields do not', async () => {
  const json = new Request('https://kevos.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, consent: true }) });
  assert.equal((await handleContact(json, env)).status, 200);
  const encoded = new Request('https://kevos.com/api/contact', { method: 'POST', body: new URLSearchParams(valid) });
  assert.equal((await handleContact(encoded, env)).status, 200);
  for (const body of ['null', '[]', '{bad', JSON.stringify({ ...valid, name: {} }), JSON.stringify({ ...valid, token: 'unexpected' })]) {
    assert.equal((await handleContact(new Request('https://kevos.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }), env)).status, 400);
  }
  for (const value of ['duplicate', new Blob(['attachment'])]) {
    const body = new FormData(); for (const [key, item] of Object.entries(valid)) body.append(key, item); body.append('name', value);
    assert.equal((await handleContact(new Request('https://kevos.com/api/contact', { method: 'POST', body }), env)).status, 400);
  }
});
test('unsupported types and actual oversized bodies are rejected even without Content-Length', async () => {
  assert.equal((await handleContact(new Request('https://kevos.com/api/contact', { method: 'POST', body: 'plain text' }), env)).status, 415);
  const req = new Request('https://kevos.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(32_001) }) });
  assert.equal(req.headers.get('Content-Length'), null); assert.equal((await handleContact(req, env)).status, 413);
  assert.equal(verified.length, 0); assert.equal(sent.length, 0);
});
test('honeypot is rejected without fake success and genuine fast autofill is not discarded', async () => {
  assert.equal((await post({ ...valid, botcheck: 'on' })).status, 400); assert.equal(sent.length, 0);
  assert.equal((await post({ ...valid, startedAt: String(Date.now()) })).status, 200); assert.equal(sent.length, 1);
});
test('existing optional rate limit stays active and failures fail closed', async () => {
  const store = new Map<string, string>();
  const kv = { get: async (k: string) => store.get(k) ?? null, put: async (k: string, v: string) => void store.set(k, v) };
  const limited = { ...env, CONTACT_RATE_LIMIT: kv, RATE_LIMIT_MAX: '1' };
  assert.equal((await post(valid, limited)).status, 200); assert.equal((await post(valid, limited)).status, 429);
  assert.ok([...store.keys()].every((k) => !k.includes('203.0.113.7')));
  assert.equal((await post(valid, { ...env, CONTACT_RATE_LIMIT: { ...kv, get: async () => { throw new Error('unavailable'); } } })).status, 503);
});
test('public response and logs contain no tokens, secrets or enquiry contents', async () => {
  const logs: unknown[] = []; const original = console.log; const originalError = console.error;
  console.log = (...args) => { logs.push(args); }; console.error = (...args) => { logs.push(args); };
  try {
    const response = await post(); const body = await response.text();
    for (const privateValue of [valid.message, valid.email, 'test-only-secret', 'test-only-token']) assert.ok(!body.includes(privateValue));
    assert.equal(logs.length, 0);
  } finally { console.log = original; console.error = originalError; }
});
test('shared quote validation and separate legacy subject generation remain compatible', () => {
  const base = normalise(valid); assert.deepEqual(validate(base, { requireCompany: true }), {});
  assert.ok(validate({ ...base, company: '' }, { requireCompany: true }).company); assert.equal(validate({ ...base, company: '' }).company, undefined);
  assert.ok(validate({ ...base, phone: 'call me' }).phone); assert.equal(validate({ ...base, phone: '+61 2 9000 0000' }).phone, undefined);
  assert.equal(enquirySubject(base), 'KEVOS® enquiry: Factory Fix — Example Pty Ltd');
  assert.ok(validate(normalise({ ...valid, message: 'http://a http://b http://c http://d and more words' })).message);
});
test('mail composer independently strips subject header breaks and escapes every HTML value', () => {
  const email = composeContactEmail(normalise({ ...valid, name: '<Alex>', phone: '<phone>', service: '<service>' }), 'Quote\r\nBcc: bad@example.com', '<time>', '<country>');
  assert.ok(!/[\r\n]/.test(email.subject)); assert.ok(!email.html.includes('<Alex>'));
  for (const marker of ['Alex', 'phone', 'service', 'time', 'country']) assert.ok(email.html.includes(`&lt;${marker}&gt;`));
});
