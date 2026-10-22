import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { buildSync, transformSync } from 'esbuild';
import { normalise, validate, HONEYPOT_FIELD } from '../src/lib/contact.ts';

const fallback = 'Your message could not be sent. Please try again or email kevin@kevos.com.';
const valid = { name: 'Alex Example', company: 'Example Pty Ltd', email: 'alex@example.com', phone: '', service: 'Other', message: 'Please help review this recurring engineering problem.', contactMethod: 'Email', consent: 'on' };
function bundle(path: string, globalName: string) {
  return buildSync({ entryPoints: [path], bundle: true, write: false, platform: 'browser', format: 'iife', globalName, define: { 'import.meta.env': '{}' } }).outputFiles[0].text;
}
const clientCode = bundle('src/lib/contact-client.ts', 'ContactClient');
const turnstileCode = bundle('src/lib/turnstile.ts', 'ContactTurnstile');
const component = readFileSync('src/components/ContactForm.astro', 'utf8');
const formCode = transformSync(component.match(/<script>([\s\S]*?)<\/script>/)![1].replace(/^\s*import .*;$/gm, ''), { loader: 'ts', target: 'es2022' }).code;

test('contact client always posts the existing fields and token to the same-origin endpoint', async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const ctx: any = createContext({ FormData, fetch: async (url: string, init: RequestInit) => { calls.push({ url, init }); return Response.json({ success: true, message: 'Thank you. Your message has been sent.' }); } });
  runInContext(clientCode, ctx);
  const response = await ctx.ContactClient.submitContact({ ...normalise(valid), source: 'Contact page', captcha: 'fresh-token', startedAt: Date.now() }, 'worker');
  assert.equal(response.ok, true); assert.equal(calls.length, 1, 'fast autofill is still sent');
  assert.equal(calls[0].url, '/api/contact'); assert.equal(calls[0].init.method, 'POST'); assert.equal(calls[0].init.credentials, 'same-origin');
  const form = calls[0].init.body as FormData;
  assert.equal(form.get('cf-turnstile-response'), 'fresh-token'); assert.equal(form.get('message'), valid.message); assert.equal(form.get('consent'), 'on');
  assert.equal(form.has('captcha'), false); assert.equal(form.has('access_key'), false);
});
test('contact client preserves safe endpoint errors and uses the required fallback on transport failure', async () => {
  for (const reply of [async () => Response.json({ success: false, message: 'Please check the highlighted fields.', errors: { email: 'Invalid email' } }, { status: 422 }), async () => { throw new Error('network internals'); }, async () => new Response('not JSON', { status: 502 })]) {
    const ctx: any = createContext({ FormData, fetch: reply }); runInContext(clientCode, ctx);
    const response = await ctx.ContactClient.submitContact({ ...normalise(valid), source: 'Contact page', captcha: 'token' }, 'worker');
    assert.equal(response.ok, false);
    assert.ok(response.message === fallback || response.message === 'Please check the highlighted fields.');
    assert.ok(!response.message.includes('internals'));
  }
});
function formHarness(send: () => Promise<any>, captchaPromise?: Promise<any>) {
  const listeners: Record<string, Function> = {};
  const status = { dataset: {} as Record<string, string>, textContent: '', focus: () => {} };
  const submit = { disabled: false };
  const captchaError = { textContent: '' };
  const stats = { formResets: 0, widgetResets: 0, consumed: 0, requests: 0 };
  const widget = { token: () => 'fresh-token', reset: () => { stats.widgetResets++; }, consume: () => { stats.consumed++; } };
  const form = {
    dataset: { email: 'kevin@kevos.com' },
    querySelector: (selector: string) => ({ '[data-status]': status, '[data-submit]': submit, '[data-captcha]': {}, '[data-captcha-error]': captchaError } as Record<string, unknown>)[selector] || null,
    querySelectorAll: () => [],
    addEventListener: (event: string, fn: Function) => { listeners[event] = fn; },
    elements: { namedItem: () => null },
    reset: () => { stats.formResets++; },
  };
  class FormValues { [Symbol.iterator]() { return Object.entries(valid)[Symbol.iterator](); } }
  const ctx = createContext({ document: { querySelector: () => form }, window: {}, location: { search: '' }, URLSearchParams, FormData: FormValues, RadioNodeList: class {}, normalise, validate, HONEYPOT_FIELD, CONTACT_FAILURE_MESSAGE: fallback,
    mountTurnstile: async () => captchaPromise ? await captchaPromise : widget,
    submitContact: async () => { stats.requests++; return send(); },
  });
  runInContext(formCode, ctx);
  return { listeners, status, submit, stats, widget, fire: () => listeners.submit({ preventDefault: () => {} }) as Promise<void> };
}
test('form blocks duplicate submissions before CAPTCHA finishes and resets only on success', async () => {
  let completeCaptcha!: (value: unknown) => void;
  let completeSend!: (value: unknown) => void;
  const captcha = new Promise((resolve) => { completeCaptcha = resolve; });
  const sending = new Promise((resolve) => { completeSend = resolve; });
  const h = formHarness(() => sending, captcha);
  const first = h.fire(); const duplicate = h.fire();
  assert.equal(h.submit.disabled, true); assert.equal(h.stats.requests, 0);
  completeCaptcha(h.widget); await duplicate;
  // Flush the async mount and handler continuations without timers.
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  assert.equal(h.stats.requests, 1); assert.equal(h.status.textContent, 'Sending your enquiry');
  completeSend({ ok: true, message: 'Thank you. Your message has been sent.' }); await first;
  assert.equal(h.stats.formResets, 1); assert.equal(h.stats.widgetResets, 1); assert.equal(h.stats.consumed, 0); assert.equal(h.submit.disabled, false);
  assert.equal(h.status.dataset.kind, 'success');
});
test('form keeps entered values and widget on delivery failure, discarding only the consumed token', async () => {
  const h = formHarness(async () => ({ ok: false, message: fallback })); await h.fire();
  assert.equal(h.stats.requests, 1); assert.equal(h.stats.formResets, 0); assert.equal(h.stats.widgetResets, 0); assert.equal(h.stats.consumed, 1);
  assert.equal(h.submit.disabled, false); assert.equal(h.status.dataset.kind, 'error'); assert.equal(h.status.textContent, fallback);
});
test('form handles missing CAPTCHA and unexpected submission exceptions without clearing values', async () => {
  const missing = formHarness(async () => ({ ok: true }), Promise.resolve({ token: () => '' })); await missing.fire();
  assert.equal(missing.stats.requests, 0); assert.equal(missing.submit.disabled, false); assert.match(missing.status.textContent, /fresh spam check/);
  const rejected = formHarness(async () => { throw new Error('internal'); }); await rejected.fire();
  assert.equal(rejected.stats.formResets, 0); assert.equal(rejected.submit.disabled, false); assert.equal(rejected.status.textContent, fallback);
});
test('Turnstile uses the supplied public key, contact action and automatic expiration in the existing slot', async () => {
  let options: any; const resets: string[] = [];
  const element = {};
  const ctx: any = createContext({ WeakMap, window: { turnstile: { render: (el: unknown, opts: unknown) => { assert.equal(el, element); options = opts; return 'widget-1'; }, reset: (id: string) => { resets.push(id); } } }, document: { documentElement: { dataset: { theme: 'dark' } } } });
  runInContext(turnstileCode, ctx);
  const widget = await ctx.ContactTurnstile.mountTurnstile(element);
  assert.equal(options.sitekey, '0x4AAAAAAFfDUjBHF2Y7_omi'); assert.equal(options.action, 'contact'); assert.equal(options.theme, 'dark');
  assert.equal(options['response-field-name'], 'cf-turnstile-response'); assert.equal(options['refresh-expired'], 'auto');
  options.callback('one-use-token'); assert.equal(widget.token(), 'one-use-token'); widget.consume(); assert.equal(widget.token(), ''); assert.equal(resets.length, 0);
  options.callback('fresh-token'); assert.equal(widget.token(), 'fresh-token'); widget.reset(); assert.deepEqual(resets, ['widget-1']);
  assert.ok(!turnstileCode.includes('siteverify'), 'verification never runs in the browser');
});
