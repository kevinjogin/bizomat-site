// Engineering Problem Assessment: shared validation, the /api/assessment endpoint, Stripe webhook
// verification and the page's commercial safeguards. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ASSESSMENT, CONDITIONS, EXCLUSIONS, INCLUSIONS, JOURNEY, SAMPLE_REPORT } from '../src/config/assessment.ts';
import { composeAssessment, normaliseAssessment, validateAssessment } from '../src/lib/assessment.ts';
import { handleAssessment } from '../src/server/assessment/handler.ts';
import { handleStripeWebhook, stripeSignature, verifyStripeSignature } from '../src/server/assessment/stripe.ts';
import worker, { type Env } from '../src/worker.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

type Sent = { to: string[]; reply_to?: string; subject: string; text: string; html: string };
const sent: Sent[] = [];
globalThis.fetch = (async (_url: string, init: { body: string }) => {
  sent.push(JSON.parse(init.body));
  return new Response('{}', { status: 200 });
}) as unknown as typeof fetch;

const env = { MAIL_PROVIDER: 'resend', RESEND_API_KEY: 'test-key', CONTACT_TO: 'inbox@example.com', CONTACT_FROM: 'site@example.com' };
const valid: Record<string, string | string[]> = {
  name: 'Alex Example',
  company: 'Example Fabrication Pty Ltd',
  email: 'alex@example.com',
  phone: '',
  state: 'NSW',
  industry: 'Fabrication',
  category: 'Assembly Problem',
  description: 'A welded bracket does not seat on its mounting plate and the holes need reaming on most builds.',
  impact: 'About twenty minutes of rework per assembly.',
  outcome: 'Brackets that fit first time without reaming.',
  materials: ['Photographs', 'Drawings or CAD models'],
  contactMethod: 'Email',
  consent: 'on',
  startedAt: String(Date.now() - 20_000),
};

function post(fields: Record<string, string | string[]>, { json = true, origin = 'https://kevos.com', ip = '203.0.113.9' } = {}) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) for (const item of Array.isArray(v) ? v : [v]) body.append(k, item);
  const headers: Record<string, string> = { Origin: origin, 'CF-Connecting-IP': ip };
  if (json) headers.Accept = 'application/json';
  return handleAssessment(new Request('https://kevos.com/api/assessment', { method: 'POST', body, headers }), env);
}

test('the offer is A$195 for one defined problem, with five inclusions and the required exclusions', () => {
  assert.equal(ASSESSMENT.price, 195);
  assert.equal(ASSESSMENT.currency, 'AUD');
  assert.equal(ASSESSMENT.priceLabel, 'A$195');
  assert.equal(INCLUSIONS.length, 5);
  for (const item of ['Physical inspection', 'Site visits', 'Formal certification', 'Regulated design sign-off', 'Guaranteed root-cause identification', 'Guaranteed savings'])
    assert.ok((EXCLUSIONS as readonly string[]).includes(item), item);
  assert.equal(JOURNEY.flatMap((p) => p.steps).length, 12);
  assert.ok(CONDITIONS.some((c) => /Australian Consumer Law/.test(c.text)));
});

test('valid enquiries normalise and validate; materials accept arrays or comma lists', () => {
  const input = normaliseAssessment({ ...valid, state: 'nsw' });
  assert.equal(input.state, 'NSW');
  assert.deepEqual(validateAssessment(input), {});
  assert.deepEqual(normaliseAssessment({ ...valid, materials: 'Photographs, Video, Bogus' }).materials, ['Photographs', 'Video']);
});

test('invalid enquiries get field errors', () => {
  const errors = validateAssessment(normaliseAssessment({ ...valid, email: 'nope', state: 'XX', category: 'Plumbing', description: 'short', materials: [], consent: '' }));
  for (const field of ['email', 'state', 'category', 'description', 'materials', 'consent']) assert.ok(errors[field as keyof typeof errors], field);
  assert.ok(validateAssessment(normaliseAssessment({ ...valid, contactMethod: 'Phone', phone: '' })).phone);
});

test('composed email escapes HTML and carries the NEW status', () => {
  const { subject, html, text } = composeAssessment(normaliseAssessment({ ...valid, description: 'Bracket <script>alert(1)</script> does not locate on the plate at all.' }));
  assert.match(subject, /^KEVOS® assessment enquiry: Assembly Problem — Example Fabrication Pty Ltd$/);
  assert.ok(!html.includes('<script>'));
  assert.match(text, /Status: NEW/);
});

test('/api/assessment validates server-side and delivers with reply-to', async () => {
  const res = await post(valid);
  assert.equal(res.status, 200);
  const body = (await res.json()) as { ok: boolean; message: string };
  assert.equal(body.ok, true);
  assert.equal(body.message, ASSESSMENT.successMessage);
  assert.doesNotMatch(body.message, /booked|booking confirmed|paid/i);
  const last = sent.at(-1)!;
  assert.equal(last.reply_to, 'alex@example.com');
  assert.match(last.text, /Photographs, Drawings or CAD models/);

  const bad = await post({ ...valid, category: '', consent: '' });
  assert.equal(bad.status, 422);
  const errors = ((await bad.json()) as { errors: Record<string, string> }).errors;
  assert.ok(errors.category && errors.consent);
});

test('/api/assessment drops spam, refuses files and other origins, and requires POST', async () => {
  const before = sent.length;
  assert.equal((await post({ ...valid, botcheck: 'on' })).status, 200);
  assert.equal((await post({ ...valid, startedAt: String(Date.now()) })).status, 200);
  assert.equal(sent.length, before);
  assert.equal((await post(valid, { origin: 'https://evil.example' })).status, 403);

  const withFile = new FormData();
  for (const [k, v] of Object.entries(valid)) for (const item of Array.isArray(v) ? v : [v]) withFile.append(k, item);
  withFile.append('drawing', new Blob(['%PDF-1.4'], { type: 'application/pdf' }), 'drawing.pdf');
  const res = await handleAssessment(new Request('https://kevos.com/api/assessment', { method: 'POST', body: withFile, headers: { Accept: 'application/json' } }), env);
  assert.equal(res.status, 400);
  assert.equal(sent.length, before);

  assert.equal((await handleAssessment(new Request('https://kevos.com/api/assessment'), env)).status, 405);
});

test('without JavaScript a successful enquiry lands on the received page, not a booking page', async () => {
  const res = await post(valid, { json: false });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('Location'), '/assessment/received/');
});

test('Stripe signatures are verified with HMAC-SHA256 and a time tolerance', async () => {
  const secret = 'whsec_test_secret';
  const payload = '{"id":"evt_1"}';
  const t = String(Math.floor(Date.now() / 1000));
  const sig = await stripeSignature(payload, t, secret);
  assert.equal(await verifyStripeSignature(payload, `t=${t},v1=${sig}`, secret), true);
  assert.equal(await verifyStripeSignature(payload, `t=${t},v1=${sig.replace(/.$/, sig.endsWith('0') ? '1' : '0')}`, secret), false);
  assert.equal(await verifyStripeSignature(payload + ' ', `t=${t},v1=${sig}`, secret), false);
  assert.equal(await verifyStripeSignature(payload, `t=${Number(t) - 3600},v1=${await stripeSignature(payload, String(Number(t) - 3600), secret)}`, secret), false);
  assert.equal(await verifyStripeSignature(payload, null, secret), false);
});

test('the Stripe webhook is off until configured and only reports genuinely paid A$195 sessions', async () => {
  const off = await handleStripeWebhook(new Request('https://kevos.com/api/assessment/stripe-webhook', { method: 'POST', body: '{}' }), env);
  assert.equal(off.status, 503);

  const secret = 'whsec_test_secret';
  const stripeEnv = { ...env, STRIPE_WEBHOOK_SECRET: secret };
  const send = async (session: Record<string, unknown>, type = 'checkout.session.completed', sign = true) => {
    const payload = JSON.stringify({ id: 'evt_test', type, data: { object: session } });
    const t = String(Math.floor(Date.now() / 1000));
    const header = sign ? `t=${t},v1=${await stripeSignature(payload, t, secret)}` : `t=${t},v1=deadbeef`;
    const res = await handleStripeWebhook(new Request('https://kevos.com/api/assessment/stripe-webhook', { method: 'POST', body: payload, headers: { 'Stripe-Signature': header } }), stripeEnv);
    return { status: res.status, body: (await res.json()) as { verified?: boolean } };
  };
  const paid = { id: 'cs_test_1', amount_total: 19500, currency: 'aud', payment_status: 'paid', client_reference_id: 'KEVOS-A-2026-001', customer_details: { email: 'buyer@example.com' } };

  const before = sent.length;
  assert.equal((await send(paid, 'checkout.session.completed', false)).status, 400);
  assert.equal(sent.length, before, 'forged events never notify');

  assert.deepEqual((await send({ ...paid, payment_status: 'unpaid' })).body.verified, false);
  assert.deepEqual((await send({ ...paid, amount_total: 1000 })).body.verified, false);
  assert.equal(sent.length, before);

  const ok = await send(paid);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.verified, true);
  assert.match(sent.at(-1)!.subject, /payment verified: KEVOS-A-2026-001/);
});

test('the Worker routes both assessment endpoints', async () => {
  const assets = { fetch: async () => new Response('page') };
  const e = { ASSETS: assets } as unknown as Env;
  const r1 = await worker.fetch(new Request('https://kevos.com/api/assessment', { method: 'GET' }), e);
  assert.equal(r1.status, 405);
  const r2 = await worker.fetch(new Request('https://kevos.com/api/assessment/stripe-webhook', { method: 'POST', body: '{}' }), e);
  assert.equal(r2.status, 503);
});

test('the page states price, inclusions, process and safeguards, with no fake proof', () => {
  const page = read('src/pages/assessment/index.astro');
  const config = read('src/config/assessment.ts');
  for (const text of ['Request an Assessment', 'See What You Receive', 'Request a Free Quote', 'id="included"', 'id="request"', 'id="terms"'])
    assert.ok(page.includes(text), text);
  assert.match(config, /Engineering problems\. <em>Clear next steps\.<\/em>/);
  assert.doesNotMatch(page + config, /testimonial|five stars|trusted by|★/i);
  assert.match(SAMPLE_REPORT.customer, /fictional/i);
  assert.match(read('src/components/assessment/AssessmentHeroArt.astro'), /prefers-reduced-motion: no-preference/);
  assert.match(read('src/components/assessment/AssessmentForm.astro'), /not a booking or a purchase/);
});
