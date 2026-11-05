import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ENGINEERING_PROJECT, ENQUIRY_CATEGORIES } from '../src/lib/contact.ts';
import { SERVICE_OPTIONS } from '../src/data/services.ts';
import { SITE } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const page = read('src/pages/contact/index.astro');
const form = read('src/components/ContactForm.astro');
const widget = read('src/components/ChatWidget.astro');

test('REACHOS presents BIZOMAT as a connection point with enquiry and meeting actions', () => {
  assert.match(page, /exactTitle="REACHOS \| Connect with BIZOMAT"/);
  assert.match(page, /title="Connect with <em>BIZOMAT\.<\/em>"/);
  assert.match(page, /<Button href="#enquiry"[^>]*>Start an Enquiry<\/Button>/);
  assert.match(page, /<Button href=\{SITE\.booking\.url\}[^>]*target="_blank" rel="noopener noreferrer"[^>]*>Book a Meeting/);
  assert.match(page, /<Section [^>]*id="enquiry"/);
  assert.match(page, /<ContactForm \/>/);
  assert.match(page, /<BookingCard [^>]*title="Prefer to talk\?"[^>]*label="Book a Meeting"/);
  for (const banned of ['ASSESSMENT', 'PACKAGES', 'A$', 'hourly', 'Request a quote', 'SERVICE_AREA']) assert.ok(!page.includes(banned), `REACHOS still mentions ${banned}`);
  assert.ok(!read('src/config/site.ts').includes('A$'), 'the shared navigation and footer carry no prices');
  assert.match(page, /Start this enquiry<span class="visually-hidden">: \{p\.title\}<\/span>/, 'each pathway link has its own accessible name');
});

test('every enquiry pathway preselects a real form category', () => {
  const slugs = [...page.matchAll(/slug: '([a-z-]+)', icon:/g)].map((m) => m[1]);
  assert.deepEqual(slugs, ['workos', 'reados', 'feedback', 'collaboration']);
  const known = new Set<string>([...ENQUIRY_CATEGORIES, ENGINEERING_PROJECT, ...SERVICE_OPTIONS].map((c) => c.slug));
  for (const slug of slugs) assert.ok(known.has(slug), `no form category for ${slug}`);
  assert.match(page, /href=\{`\/contact\/\?service=\$\{p\.slug\}#enquiry`\} data-enquiry-category=\{p\.slug\}/);
  // Existing ?service= links from the services, Factory Fix and proof-of-work pages still match an option.
  for (const o of SERVICE_OPTIONS) assert.ok(known.has(o.slug));
  for (const c of ENQUIRY_CATEGORIES) assert.ok(c.value.length <= 60, `${c.value} fits the service field`);
});

test('the form asks only for name, email, category and message, and keeps its protections', () => {
  for (const id of ['cf-name', 'cf-email', 'cf-service', 'cf-message', 'cf-consent']) assert.match(form, new RegExp(`id="${id}"[^>]*required`), id);
  for (const id of ['cf-company', 'cf-website', 'cf-resource', 'cf-phone']) assert.doesNotMatch(form, new RegExp(`id="${id}"[^>]*required`), id);
  assert.match(form, /action="\/api\/contact"/);
  assert.match(form, /name=\{HONEYPOT_FIELD\}/);
  assert.match(form, /mountTurnstile/);
  assert.match(form, /privacy policy/);
  assert.match(form, />Send Enquiry<\/Button>/);
  assert.match(form, /if \(result\.ok\) \{/, 'success is shown only when the endpoint confirms delivery');
});

test('the assistant section, when the assistant is switched on, uses the live BIZOMAT Assistant, labelled as AI-assisted', () => {
  assert.match(page, /\{SITE\.assistant\.enabled && \(/, 'the section is left out while the assistant is off');
  assert.equal(SITE.assistant.starters.length, 5);
  assert.match(page, /SITE\.assistant\.starters\.map/);
  assert.match(page, /data-assistant-ask=\{q\}[^>]*hidden/, 'starters stay hidden until the assistant script can run them');
  assert.match(page, /AI-assisted guidance/);
  assert.match(widget, /document\.querySelectorAll<HTMLButtonElement>\('\[data-assistant-ask\]'\)/);
  assert.match(widget, /const prompts = SITE\.assistant\.starters;/);
  assert.match(widget, /AI-assisted guidance/);
});
