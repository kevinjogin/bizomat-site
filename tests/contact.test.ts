// Contact endpoint tests. Run with: npm test  (Node's built-in test runner, no extra dependencies)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, type ContactEnv } from '../src/server/contact/handler.ts';
import { enquirySubject, normalise, validate } from '../src/lib/contact.ts';

type Sent = { to: string[]; reply_to: string; subject: string; html: string };
const sent: Sent[] = [];
globalThis.fetch = (async (_url: string, init: { body: string }) => {
  sent.push(JSON.parse(init.body));
  return new Response('{}', { status: 200 });
}) as unknown as typeof fetch;

const env: ContactEnv = { MAIL_PROVIDER: 'resend', RESEND_API_KEY: 'test-key', CONTACT_TO: 'inbox@example.com', CONTACT_FROM: 'site@example.com' };
const valid = {
  name: 'Alex Example',
  email: 'alex@example.com',
  company: 'Example Pty Ltd',
  phone: '',
  service: 'Factory Fix',
  contactMethod: 'Email',
  message: 'Hello GoCore, we have a recurring rework problem on one assembly line.',
  consent: 'on',
  startedAt: String(Date.now() - 10_000),
};

function post(fields: Record<string, string>, { json = true, origin = 'https://gocore.com.au', e = env, ip = '203.0.113.7' } = {}) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  const headers: Record<string, string> = { Origin: origin, 'CF-Connecting-IP': ip };
  if (json) headers.Accept = 'application/json';
  return handleContact(new Request('https://gocore.com.au/api/contact', { method: 'POST', body, headers }), e);
}

test('valid enquiry is delivered with reply-to and escaped HTML', async () => {
  const res = await post({ ...valid, message: 'Hi <script>alert(1)</script>, a message long enough to pass.' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, message: 'Thank you. Your message has been sent and GoCore will reply as soon as possible.' });
  const last = sent.at(-1)!;
  assert.equal(last.reply_to, 'alex@example.com');
  assert.ok(!last.html.includes('<script>'));
});

test('honeypot submissions are accepted silently but not sent', async () => {
  const before = sent.length;
  const res = await post({ ...valid, botcheck: 'on' });
  assert.equal(res.status, 200);
  assert.equal(sent.length, before);
});

test('submissions faster than a person can type are dropped', async () => {
  const before = sent.length;
  await post({ ...valid, startedAt: String(Date.now()) });
  assert.equal(sent.length, before);
});

test('field errors are returned for the UI to display', async () => {
  const res = await post({ ...valid, email: 'not-an-email', message: 'short', consent: '' });
  assert.equal(res.status, 422);
  const body = (await res.json()) as { errors: Record<string, string> };
  assert.deepEqual(Object.keys(body.errors).sort(), ['consent', 'email', 'message']);
});

test('cross-origin posts are refused unless allowed', async () => {
  assert.equal((await post(valid, { origin: 'https://evil.example' })).status, 403);
  const res = await post(valid, { origin: 'https://gocore.com.au', e: { ...env, ALLOWED_ORIGINS: 'https://gocore.com.au' } });
  assert.equal(res.status, 200);
});

test('header injection in the subject line is neutralised', async () => {
  await post({ ...valid, name: 'Bad\r\nBcc: victim@example.com' });
  assert.ok(!/[\r\n]/.test(sent.at(-1)!.subject));
});

test('missing mail configuration returns 503, never a false success', async () => {
  assert.equal((await post(valid, { e: {} })).status, 503);
});

test('rate limit applies when a KV namespace is bound', async () => {
  const store = new Map<string, string>();
  const kv = { get: async (k: string) => store.get(k) ?? null, put: async (k: string, v: string) => void store.set(k, v) };
  const limited: ContactEnv = { ...env, CONTACT_RATE_LIMIT: kv, RATE_LIMIT_MAX: '2' };
  assert.equal((await post(valid, { e: limited, ip: '198.51.100.1' })).status, 200);
  assert.equal((await post(valid, { e: limited, ip: '198.51.100.1' })).status, 200);
  assert.equal((await post(valid, { e: limited, ip: '198.51.100.1' })).status, 429);
  assert.equal((await post(valid, { e: limited, ip: '198.51.100.2' })).status, 200);
});

test('plain HTML form posts (no JavaScript) redirect to result pages', async () => {
  const ok = await post(valid, { json: false });
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('Location'), '/contact/sent/');
  const bad = await post({ ...valid, email: 'x' }, { json: false });
  assert.equal(bad.headers.get('Location'), '/contact/error/');
});

test('shared validation matches between browser and server', () => {
  assert.deepEqual(validate(normalise(valid)), {});
  assert.ok(validate(normalise({ ...valid, message: 'http://a http://b http://c http://d and more words' })).message);
});

test('quote form rules: company required on the page, phone checked, phone needed for phone contact', () => {
  const base = normalise(valid);
  assert.deepEqual(validate(base, { requireCompany: true }), {});
  assert.ok(validate({ ...base, company: '' }, { requireCompany: true }).company);
  assert.equal(validate({ ...base, company: '' }).company, undefined); // assistant quick message
  assert.ok(validate({ ...base, phone: 'call me' }).phone);
  assert.equal(validate({ ...base, phone: '+61 2 9000 0000' }).phone, undefined);
  assert.ok(validate({ ...base, contactMethod: 'Phone' }).phone);
  assert.ok(validate({ ...base, service: '' }).service);
});

test('older field names still work and the subject names the service and company', () => {
  const legacy = normalise({ ...valid, company: undefined, service: undefined, organisation: 'Legacy Co', subject: 'Other' });
  assert.equal(legacy.company, 'Legacy Co');
  assert.equal(legacy.service, 'Other');
  assert.equal(enquirySubject(normalise(valid)), 'GoCore enquiry: Factory Fix — Example Pty Ltd');
  assert.equal(normalise({ ...valid, contactMethod: 'Carrier pigeon' }).contactMethod, 'Email');
});
