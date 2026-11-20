// The BIZOMAT ERP Knowledge Centre (/learn/, owner's brief of 20 Nov 2026): every guide complete (A to J where they
// apply), every link real, every status honest, no claim the code does not back, and the coverage tracker in step.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { FEATURE_STATUS } from '../src/config/systems.ts';
import { GUIDES, SECTIONS, WORKFLOWS, answerParts, searchEntries } from '../src/data/learn/index.ts';
import { coverageMarkdown } from '../src/data/learn/coverage.ts';
import type { Faq, Tutorial } from '../src/data/learn/types.ts';

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const files = (dir: string) => readdirSync(join(root, dir)).filter((f) => f.endsWith('.ts')).map((f) => f.replace(/\.ts$/, '')).sort();
const guideIds = new Set(GUIDES.map((g) => g.id));
const workflowIds = new Set(WORKFLOWS.map((w) => w.id));
const today = new Date().toISOString().slice(0, 10);

/** Every piece of text a guide or workflow shows, with where it is. */
function texts(): [string, string][] {
  const out: [string, string][] = [];
  const tut = (where: string, t: Tutorial) => {
    out.push([`${where} tutorial ${t.id}`, [t.title, t.outcome, t.needs ?? '', t.after ?? ''].join(' ')]);
    t.steps.forEach((s, i) => out.push([`${where} tutorial ${t.id} step ${i + 1}`, [s.title, s.body, s.where ?? ''].join(' ')]));
  };
  const faqs = (where: string, list: Faq[]) => list.forEach((f, i) => out.push([`${where} question ${i + 1}`, `${f.q} ${f.a}`]));
  for (const g of GUIDES) {
    const where = `guide ${g.id}`;
    out.push([where, [g.title, g.short ?? '', g.what, ...g.purpose, ...g.who, ...(g.access?.path ?? []), g.access?.note ?? ''].join(' ')]);
    g.tutorials.forEach((t) => tut(where, t));
    (g.buttons ?? []).forEach((b) => out.push([`${where} button ${b.label}`, [b.label, b.does, b.when ?? '', b.after ?? ''].join(' ')]));
    faqs(where, g.faqs);
    (g.notYet ?? []).forEach((n) => out.push([`${where} not yet`, n.text]));
  }
  for (const w of WORKFLOWS) {
    const where = `workflow ${w.id}`;
    out.push([where, [w.title, w.summary, ...w.stages.map((s) => `${s.label} ${s.detail}`)].join(' ')]);
    tut(where, w.tutorial);
    faqs(where, w.faqs);
  }
  return out;
}

test('every guide and workflow file is listed once, under its own id', () => {
  assert.deepEqual([...guideIds].sort(), files('src/data/learn/guides'), 'src/data/learn/index.ts lists every guide file');
  assert.deepEqual([...workflowIds].sort(), files('src/data/learn/workflows'), 'src/data/learn/index.ts lists every workflow file');
  assert.equal(guideIds.size, GUIDES.length, 'guide ids are unique');
  assert.equal(workflowIds.size, WORKFLOWS.length, 'workflow ids are unique');
  for (const id of guideIds) assert.ok(!workflowIds.has(id) && id !== 'workflows' && id !== 'search', `${id} does not clash with another /learn/ address`);
  for (const s of SECTIONS) if (s.id !== 'workflows') assert.ok(GUIDES.some((g) => g.section === s.id), `section ${s.title} has guides`);
});

test('every guide is complete: what, purpose, who, access, tutorials, questions and connections', () => {
  for (const g of GUIDES) {
    const at = `guide ${g.id}`;
    assert.ok(SECTIONS.some((s) => s.id === g.section), `${at}: section`);
    assert.ok(g.status in FEATURE_STATUS, `${at}: status`);
    assert.ok(g.what.length >= 40 && g.what.length <= 500, `${at}: A, what it is, in one or two sentences`);
    assert.ok(g.purpose.length >= 2, `${at}: B, at least two uses`);
    assert.ok(g.who.length >= 1, `${at}: C, who uses it`);
    const module = g.section === 'modules';
    if (module) {
      assert.ok(g.access, `${at}: D, how to open it`);
      assert.ok(g.tutorials.length >= 2, `${at}: E, at least two tutorials`);
      assert.ok(g.faqs.length >= 5, `${at}: G, at least five questions`);
      assert.ok((g.buttons ?? []).length >= 3, `${at}: F, the important buttons`);
    } else {
      assert.ok(g.faqs.length >= 3, `${at}: G, at least three questions`);
      if (g.section !== 'troubleshooting') assert.ok(g.tutorials.length >= 1, `${at}: E, at least one tutorial`);
    }
    if (g.access) {
      assert.ok(g.access.path.length >= 1 && g.access.label.length > 0, `${at}: the access path is named`);
      // CAD Automation opens inside BIZOMAT ERP too (owner, 20 Nov 2026): no guide links to its own pages at bizomat.ai/cad.
      assert.match(g.access.href, /^https:\/\/bizomat\.ai\/erp(\/|$)/, `${at}: the access link opens BIZOMAT ERP`);
    }
    const ids = g.tutorials.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length, `${at}: tutorial ids are unique`);
    for (const t of g.tutorials) {
      assert.match(t.id, /^[a-z0-9-]+$/, `${at}: tutorial id ${t.id}`);
      assert.ok(t.steps.length >= 2 && t.steps.length <= 12, `${at}: tutorial ${t.id} has 2 to 12 steps`);
      for (const s of t.steps) assert.ok(s.title.length > 0 && s.body.length > 0, `${at}: tutorial ${t.id} has no empty step`);
    }
    assert.ok(g.related.length >= 1, `${at}: H, related guides`);
    for (const r of g.related) assert.ok(guideIds.has(r) && r !== g.id, `${at}: related guide ${r} exists`);
    for (const r of g.chain ?? []) assert.ok(guideIds.has(r), `${at}: guide ${r} in the chain exists`);
    for (const w of g.workflows ?? []) assert.ok(workflowIds.has(w), `${at}: workflow ${w} exists`);
    for (const n of g.notYet ?? []) assert.ok(n.status === 'planned' || n.status === 'in-development', `${at}: what is not built says Planned or In development`);
    assert.ok(g.sources.length >= 1, `${at}: where the facts come from`);
    assert.match(g.updated, /^\d{4}-\d{2}-\d{2}$/, `${at}: checked date`);
    assert.ok(g.updated <= today, `${at}: checked date is not in the future`);
  }
});

test('every workflow runs through real modules, with its walk-through and questions', () => {
  for (const w of WORKFLOWS) {
    const at = `workflow ${w.id}`;
    assert.ok(w.status in FEATURE_STATUS, `${at}: status`);
    assert.ok(w.stages.length >= 2, `${at}: at least two stages`);
    for (const s of w.stages) assert.ok(guideIds.has(s.guide), `${at}: stage ${s.label} names guide ${s.guide}`);
    assert.ok(w.tutorial.steps.length >= 4, `${at}: a walk-through of at least four steps`);
    assert.ok(w.faqs.length >= 3, `${at}: at least three questions`);
    assert.ok(w.sources.length >= 1, `${at}: sources`);
    assert.match(w.updated, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('the facts were read from files that exist', () => {
  for (const x of [...GUIDES, ...WORKFLOWS]) {
    for (const src of x.sources) {
      const path = src.split(/[\s(#:]/)[0].replace(/[,.;]+$/, '');
      if (!/^(apps|src|docs|tests|test-node|infrastructure|shared|public|scripts)\//.test(path) && !/^[A-Z][A-Za-z-]*\.md$/.test(path)) continue;
      assert.ok(existsSync(join(root, path)), `${x.id}: source ${path} exists`);
    }
  }
});

test('every link in the text leads to a real page', () => {
  const pageExists = (path: string) => {
    const p = path.replace(/^\//, '').replace(/\/$/, '');
    if (p === '') return true;
    return ['index.astro', '.astro', '/index.astro', '/index.md'].some((suffix) => existsSync(join(root, 'src/pages', suffix === 'index.astro' ? `${p}/index.astro` : `${p}${suffix}`)));
  };
  for (const [where, text] of texts()) {
    for (const part of answerParts(text)) {
      if (!('href' in part)) continue;
      const path = part.href.split('#')[0].split('?')[0];
      if (path === '/learn/') {
        // A place on the one page: a guide, a workflow (workflow-<id>), a section, or a question or tutorial inside one.
        const anchor = part.href.split('#')[1] ?? '';
        const ok = !anchor || guideIds.has(anchor) || SECTIONS.some((x) => x.id === anchor) || (anchor.startsWith('workflow-') && workflowIds.has(anchor.slice(9)))
          || [...guideIds].some((id) => anchor.startsWith(`${id}-`)) || anchor.startsWith('tutorial-');
        assert.ok(ok, `${where}: ${part.href} is a place in the Knowledge Centre`);
        continue;
      }
      assert.ok(pageExists(path), `${where}: ${part.href} is a page of the website`);
    }
  }
});

// Only what the code does: no compliance or certification claims, no prices, no invented customers or numbers, no
// emojis, and the registration checks named for what they prove (CLAUDE.md).
const CLAIMS: readonly RegExp[] = [
  /\bcompliant\b/i,
  /\bcertified\b/i,
  /\blegally (verified|approved|checked)\b/i,
  /\b(ensure|ensures|guarantee|guarantees|guaranteed|achieve|achieves)\s+(full\s+|legal\s+|regulatory\s+|WHS\s+|tax\s+)?compliance\b/i,
  /\bmeets?\s+(all\s+)?(your\s+|the\s+)?(legal|regulatory|statutory|WHS|OHS|tax)\s+(requirements|obligations)\b/i,
  // BIZOMAT's own billing never issues tax invoices (CLAUDE.md); Finance's PDF for a GST-registered business is titled
  // "Tax invoice" by the application itself, so only a claim about BIZOMAT's invoices is refused.
  /\bBIZOMAT(?:'s|’s)? (?:own )?(?:invoices?|bills?|billing)\b[^.]{0,40}\btax invoices?\b/i,
  /\bconfirmed with the register\b/i,
  /\b(trusted by|customers love|testimonial|award-winning|industry-leading|world-class)\b/i,
];
const NEGATED = /\b(not|never|no|nor|isn't|is not|cannot|without)\b[^.]{0,40}$/i;

test('the Knowledge Centre makes no claim the code does not back', () => {
  for (const [where, text] of texts()) {
    for (const re of CLAIMS) {
      const m = text.match(re);
      if (!m) continue;
      const before = text.slice(0, m.index);
      assert.match(before, NEGATED, `${where}: "${m[0]}" is only allowed when the text says it is not so`);
    }
    assert.doesNotMatch(text, /A\$\s?\d|\$\s?\d|\bAUD\s?\d/, `${where}: no prices or amounts`);
    assert.doesNotMatch(text, /\p{Extended_Pictographic}/u, `${where}: no emojis`);
    assert.doesNotMatch(text, /\bphone (number )?(is |was )?verified\b/i, `${where}: a phone number is never called verified (no SMS provider)`);
  }
});

test('the search index covers every guide, tutorial, question and workflow', () => {
  const entries = searchEntries();
  for (const g of GUIDES) {
    assert.ok(entries.some((e) => e.kind === 'guide' && e.url === `/learn/#${g.id}`), `${g.id} is searchable`);
    for (const t of g.tutorials) assert.ok(entries.some((e) => e.url === `/learn/#tutorial-${g.id}-${t.id}`), `${g.id}: tutorial ${t.id} is searchable`);
    assert.equal(entries.filter((e) => e.kind === 'question' && new RegExp(`^/learn/#${g.id}-q\\d+$`).test(e.url)).length, g.faqs.length, `${g.id}: every question is searchable`);
  }
  for (const w of WORKFLOWS) assert.ok(entries.some((e) => e.kind === 'workflow' && e.url === `/learn/#workflow-${w.id}`), `${w.id} is searchable`);
});

test('the pages, components and diagrams follow the site rules', () => {
  for (const f of ['src/pages/learn/index.astro', ...readdirSync(join(root, 'src/components/learn')).map((f) => `src/components/learn/${f}`)]) {
    assert.doesNotMatch(read(f), /\sstyle="/, `${f}: no inline styles (the CSP forbids them)`);
  }
  for (const f of readdirSync(join(root, 'src/assets/learn'))) {
    const svg = read(`src/assets/learn/${f}`);
    assert.match(svg, /role="img"/, `${f}: an image to assistive technology`);
    assert.match(svg, /<title[^>]*>[^<]+<\/title>/, `${f}: has a title`);
    assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/, `${f}: has a description`);
    assert.doesNotMatch(svg, /<style|\sstyle=|<image|<script|https?:\/\/(?!www\.w3\.org)/, `${f}: drawn, not a photo; no styles, scripts or outside files`);
  }
  // Tutorials only explain: the stepper never sends anything to the ERP.
  assert.doesNotMatch(read('src/scripts/learn.ts'), /fetch\((?!'\/learn\/search\.json')/, 'the only request is the search index');
});

test('the Knowledge Centre is one page: every guide and workflow is a toggle there, and their old addresses answer 301 to it', () => {
  const hub = read('src/pages/learn/index.astro');
  assert.match(hub, /<details class="lv-guide" id=\{g\.id\}>/, 'each guide is a toggle with the guide\'s id');
  assert.match(hub, /<details class="lv-guide" id=\{`workflow-\$\{w\.id\}`\}>/, 'each workflow is a toggle');
  assert.match(hub, /<GuideBody g=\{g\} \/>/);
  assert.match(hub, /<WorkflowBody w=\{w\} \/>/);
  for (const page of ['[guide].astro', 'workflows/index.astro', 'workflows/[workflow].astro']) assert.ok(!existsSync(join(root, 'src/pages/learn', page)), `src/pages/learn/${page} is gone`);
  const redirects = read('public/_redirects');
  const moved = (from: string, to: string) => assert.match(redirects, new RegExp(`^${from.replace(/[/#]/g, '\\$&')} ${to.replace(/[/#]/g, '\\$&')} 301$`, 'm'), `${from} -> ${to}`);
  for (const g of GUIDES) { moved(`/learn/${g.id}/`, `/learn/#${g.id}`); moved(`/learn/${g.id}`, `/learn/#${g.id}`); }
  for (const w of WORKFLOWS) { moved(`/learn/workflows/${w.id}/`, `/learn/#workflow-${w.id}`); moved(`/learn/workflows/${w.id}`, `/learn/#workflow-${w.id}`); }
  moved('/learn/workflows/', '/learn/#workflows');
  // The systems' old user guides go to their guide's toggle.
  for (const [from, to] of [['erp', 'getting-started'], ['crm', 'crm'], ['finance', 'finance'], ['projects', 'projects'], ['engineering', 'cad-automation'], ['manufacturing', 'manufacturing'], ['whs', 'whs']]) {
    moved(`/systems/${from}/guide/`, `/learn/#${to}`);
    assert.ok(to === 'getting-started' || guideIds.has(to), `${to} is a guide`);
  }
  assert.match(read('infrastructure/proxy/routes.mjs'), /LEARN_ALIASES/, 'bizomat.ai/erp/learn is sent to /learn/ by the router');
});

test('docs/learn/COVERAGE.md is in step with the content', () => {
  assert.equal(read('docs/learn/COVERAGE.md'), coverageMarkdown(), 'run: node scripts/learn/coverage.ts');
});
