// BIZOMAT WHS (Release 1): what the public pages, the system catalogue, the AI search catalogue and the application's
// own screens say about the law. The legal packs are Not verified until a platform administrator verifies them in the
// application, BIZOMAT does not submit notifications to regulators, and no independent body has assessed the product.
// So no WHS text may call the product, its rules or a business using it compliant, certified or legally verified, or
// say it ensures or guarantees compliance (owner's WHS brief). This test fails on any such claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { systemById } from '../src/config/systems.ts';
import { screenshots } from '../src/data/screenshots.ts';
import { ERP_DOMAINS } from '../src/data/erp-capabilities.ts';
import { PLATFORM_CATALOG } from '../src/data/platform-catalog.ts';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(join(process.cwd(), dir)).flatMap((f) => {
    const p = join(dir, f);
    return statSync(join(process.cwd(), p)).isDirectory() ? walk(p) : /\.(astro|ts|tsx)$/.test(f) ? [p] : [];
  });

/** Claims the WHS text must never make. */
const CLAIMS: readonly RegExp[] = [
  /\bcompliant\b/i,
  /\bnon-?compliant\b/i,
  /\bcertif(y|ied|ies|ication|icate)\b/i,
  /\blegally (verified|approved|checked|binding)\b/i,
  /\b(ensure|ensures|ensuring|guarantee|guarantees|guaranteed|achieve|achieves|deliver|delivers|prove|proves)\s+(full\s+|legal\s+|regulatory\s+|WHS\s+|total\s+)?compliance\b/i,
  /\bcompliance\s+(is\s+)?(guaranteed|assured|ensured)\b/i,
  /\b(approved|endorsed|accredited)\s+by\s+(a\s+|the\s+)?(regulator|safe\s?work|worksafe|comcare)/i,
  /\bmeets?\s+(all\s+)?(your\s+|the\s+)?(legal|regulatory|statutory|WHS|OHS)\s+(requirements|obligations)\b/i,
];

const claimsIn = (text: string) => CLAIMS.filter((re) => re.test(text)).map((re) => `${re} ("${text.match(re)![0]}")`);

/** The text of the systems page's WHS entry, between `whs: {` and the end of that entry. */
const detailsBlock = () => {
  const page = read('src/pages/systems/index.astro');
  const start = page.indexOf('\n  whs: {');
  assert.ok(start > 0, 'the systems page has a WHS entry');
  return page.slice(start, page.indexOf('\n  },', start));
};

test('the claim check catches the claims it is meant to catch', () => {
  for (const bad of ['BIZOMAT WHS is fully compliant.', 'Certified to ISO 45001.', 'Every rule is legally verified.', 'It ensures compliance with the WHS Act.', 'Compliance guaranteed.', 'Approved by SafeWork NSW.', 'It meets all legal requirements.', 'Achieve full compliance today.']) {
    assert.ok(claimsIn(bad).length > 0, `caught: ${bad}`);
  }
  for (const fine of ['Every instrument and rule is Not verified until a competent person verifies it.', 'The compliance register is planned.', 'Manage workplace safety and regulatory compliance from one connected platform.', 'BIZOMAT does not submit notifications to regulators.']) {
    assert.deepEqual(claimsIn(fine), [], `allowed: ${fine}`);
  }
});

test('no WHS page, catalogue entry or screen claims compliance, certification or legal verification', () => {
  const sys = systemById('whs');
  const sources: [string, string][] = [
    ['src/components/systems/full/Whs.astro', read('src/components/systems/full/Whs.astro')],
    // The guide moved into the Knowledge Centre (owner, 20 Nov 2026), with the workflow from an incident to its actions.
    ['src/data/learn/guides/whs.ts', read('src/data/learn/guides/whs.ts')],
    ['src/data/learn/workflows/incident-to-action.ts', read('src/data/learn/workflows/incident-to-action.ts')],
    ['src/config/systems.ts (whs)', JSON.stringify(sys)],
    ['src/pages/systems/index.astro (whs)', detailsBlock()],
    ['src/data/screenshots.ts (WHS screens)', JSON.stringify(screenshots('erp').filter((s) => s.src.includes('/erp-whs')))],
    ['src/data/erp-capabilities.ts (health-safety)', JSON.stringify(ERP_DOMAINS.find((d) => d.id === 'health-safety'))],
    ['src/data/platform-catalog.ts (doc:whs-guide)', JSON.stringify(PLATFORM_CATALOG.find((e) => e.id === 'doc:whs-guide'))],
    // The application's own WHS screens and messages.
    ...[...walk('apps/work/src/client/system/whs'), ...walk('apps/work/src/worker/whs')].map((f): [string, string] => [f, read(f)]),
  ];
  for (const [where, text] of sources) {
    assert.ok(text && text !== 'undefined', `${where} exists`);
    assert.deepEqual(claimsIn(text), [], `${where} makes no compliance or certification claim`);
  }
});

test('the WHS pages say what the product does not do, and label what is planned', () => {
  const sys = systemById('whs');
  assert.equal(sys.status, 'partial', 'Available, some modules planned: Release 1 is the core');
  assert.match(sys.statusNote ?? '', /Not verified/);
  assert.match(sys.statusNote ?? '', /does not submit to regulators/);
  assert.match(sys.statusNote ?? '', /Planned: inspections and audits/);
  const page = read('src/components/systems/full/Whs.astro');
  assert.match(page, /Not verified until a competent person verifies it against the official source/);
  assert.match(page, /never decides whether an incident must be notified/);
  assert.match(page, /does not submit notifications to regulators/);
  assert.match(page, /not legal advice/);
  // Each part the brief keeps for later is listed with the Planned label, never as Live.
  const planned = page.slice(page.indexOf('const planned: Item[]'), page.indexOf('];', page.indexOf('const planned: Item[]')));
  for (const part of ['inspections and audits', 'SWMS acknowledgement', 'Permits to work', 'Contractor and visitor', 'Training', 'Chemicals', 'Plant and equipment', 'PPE', 'Emergency', 'consultation', 'Health surveillance', 'compliance and obligations register']) {
    assert.match(planned, new RegExp(part, 'i'), `${part} is listed`);
  }
  assert.doesNotMatch(planned, /st: '(live|connected|in-development)'/, 'every later part is labelled Planned');
  // Every product screen is a real screen of the example company, labelled as one.
  assert.match(read('src/components/systems/full/Whs.astro'), /viz__tag viz__tag--real">Product screen/);
  // The Knowledge Centre's guide says the same: BIZOMAT never works out a deadline from an unverified rule, and sending a
  // notification to a regulator is not built (labelled Planned).
  const guide = read('src/data/learn/guides/whs.ts');
  assert.match(guide, /Deadline not verified: check with the regulator/);
  assert.match(guide, /text: 'Sending a notification to a regulator from BIZOMAT[^']*', status: 'planned'/);
});
