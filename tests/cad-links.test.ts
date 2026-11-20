// CAD Automation opens inside BIZOMAT ERP (owner, 20 Nov 2026: "all CAD Automation data and details in ERP, not at
// bizomat.ai/cad ... delete access links to bizomat.ai/cad and its sub links"). People reach it at bizomat.ai/erp/cad
// (Products and Engineering, then CAD Automation); its own pages at bizomat.ai/cad answer 302 into the ERP once the
// owner switches cad_redirect on. Only program addresses keep /cad: the AI connector (/cad/mcp), sign-in for AI apps,
// the computers' link and the installer the ERP hands out.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { APP_LINKS } from '../src/config/platform.ts';

const ROOT = new URL('..', import.meta.url).pathname;
const PAGES = /bizomat\.ai\/cad\/(login|dashboard|docs|overview|assistant|solidworks|tools|history|settings|admin|download)\b/;

function files(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(astro|ts|tsx|mjs|md|mdx|json|txt)$/.test(name)) out.push(p);
  }
  return out;
}

test('no page of the website links to CAD Automation\'s own pages: they open in BIZOMAT ERP', () => {
  for (const f of [...files(join(ROOT, 'src')), join(ROOT, 'public/_redirects')]) {
    const text = readFileSync(f, 'utf8');
    assert.doesNotMatch(text, PAGES, `${f.slice(ROOT.length)} links a CAD Automation page; link https://bizomat.ai/erp/cad`);
    assert.doesNotMatch(text, /APP_LINKS\.cad\.(home|signIn|dashboard|docs|download)\b/, `${f.slice(ROOT.length)} uses a retired CAD Automation link`);
    assert.doesNotMatch(text, /href[=:]\s*\{?['"`]https:\/\/bizomat\.ai\/cad\/?['"`]/, `${f.slice(ROOT.length)} links bizomat.ai/cad itself`);
  }
});

test('the links people use open CAD Automation in BIZOMAT ERP, and only the connector keeps its /cad-style address', () => {
  assert.equal(APP_LINKS.erp.cad, 'https://bizomat.ai/erp/cad');
  assert.deepEqual(Object.keys(APP_LINKS.cad), ['mcp']);
  const engineering = readFileSync(join(ROOT, 'src/components/systems/full/Engineering.astro'), 'utf8');
  assert.match(engineering, /href=\{APP_LINKS\.erp\.cad\}/, 'the Engineering section sets up in BIZOMAT ERP');
  const room = readFileSync(join(ROOT, 'src/pages/engine-room.astro'), 'utf8');
  assert.match(room, /href=\{APP_LINKS\.erp\.cad\}/, 'the founder\'s letter opens CAD Automation in BIZOMAT ERP');
});

test('BIZOMAT ERP links CAD Automation inside itself, never its old pages', () => {
  const brand = readFileSync(join(ROOT, 'apps/work/src/client/lib/brand.ts'), 'utf8');
  assert.match(brand, /cad: 'https:\/\/bizomat\.ai\/erp\/cad'/, 'the platform links name the ERP\'s CAD Automation');
  const docs = readFileSync(join(ROOT, 'apps/work/src/client/system/erp/Documents.tsx'), 'utf8');
  assert.doesNotMatch(docs, /bizomat\.ai\/cad/, 'engineering documents open CAD Automation in the ERP');
  const cad = readFileSync(join(ROOT, 'apps/work/src/client/system/cad/Cad.tsx'), 'utf8');
  assert.doesNotMatch(cad.replace(/^\/\/.*$/gm, ''), PAGES, 'the ERP\'s CAD Automation module links none of the old pages');
  // The links to CAD Automation's own pages that remain show only while the module is off for a company (flag-off view).
  const app = readFileSync(join(ROOT, 'apps/work/src/client/system/SystemApp.tsx'), 'utf8');
  assert.match(app, /app: 'https:\/\/bizomat\.ai\/cad\/login'/, 'the flag-off view opens the sign-in page, never the root that sends visitors to the ERP');
  assert.match(app, /docs: 'https:\/\/bizomat\.ai\/learn\/#cad-automation'/, 'the flag-off view\'s guide is the Knowledge Centre');
});
