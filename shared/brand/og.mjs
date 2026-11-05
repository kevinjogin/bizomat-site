#!/usr/bin/env node
// Renders the BIZOMAT social sharing images (1200 x 630) in Chromium with the real brand fonts, then copies them into
// the apps. Run after changing the logo or the wording: node shared/brand/og.mjs (needs Playwright's Chromium).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { COLORS, GLYPHS, WORDMARK_WIDTH, wordmarkPath } from './glyphs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const require = createRequire(path.join(root, 'package.json'));
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }

const font = (p) => `data:font/woff2;base64,${fs.readFileSync(p).toString('base64')}`;
const oxanium = font(path.join(here, 'fonts/oxanium-latin.woff2'));
const inter = font(path.join(root, 'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2'));

const CARDS = [
  { file: 'og-bizomat.png', kicker: 'Intelligent Business Automation Platform', title: 'Automate work. Connect systems. Get business done.', foot: 'CAD Automation  ·  Project Management  ·  Resources' },
  { file: 'og-cad.png', kicker: 'BIZOMAT CAD Automation', title: 'Your AI assistant, working in SOLIDWORKS on your own computer.', foot: 'Native parts, assemblies and drawings  ·  MCP connector' },
  { file: 'og-work.png', kicker: 'BIZOMAT Project Management', title: 'Projects, tasks and teams in one shared workspace.', foot: 'Boards  ·  Timelines  ·  Dashboards  ·  Documents' },
  { file: 'og-resources.png', kicker: 'BIZOMAT Resources', title: 'Calculators, tools, books and guides. Free, no sign-in.', foot: 'Engineering  ·  Manufacturing  ·  Operations  ·  Business' },
];

const html = (c) => `<!doctype html><html><head><style>
@font-face { font-family: Ox; src: url(${oxanium}) format('woff2'); font-weight: 200 800; }
@font-face { font-family: It; src: url(${inter}) format('woff2'); font-weight: 100 900; }
html, body { margin: 0; width: 1200px; height: 630px; }
body { background: ${COLORS.navy}; color: #eef4fa; font-family: It; position: relative; overflow: hidden; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgb(255 255 255 / .05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .05) 1px, transparent 1px); background-size: 48px 48px; }
.node { position: absolute; width: 12px; height: 12px; border-radius: 3px; background: ${COLORS.tealMark}; }
.line { position: absolute; height: 2px; background: linear-gradient(90deg, ${COLORS.tealMark}, transparent); }
.wrap { position: absolute; left: 80px; right: 80px; top: 78px; bottom: 70px; display: flex; flex-direction: column; }
svg { width: 430px; height: auto; }
.kicker { margin-top: 64px; font: 600 22px/1.2 It; letter-spacing: .12em; text-transform: uppercase; color: ${COLORS.tealBright}; }
h1 { margin: 18px 0 0; font: 650 60px/1.06 Ox; letter-spacing: -.01em; max-width: 960px; }
.foot { margin-top: auto; font: 500 22px/1.3 It; color: #a9b8c9; }
</style></head><body><div class="grid"></div>
<div class="line" style="left:860px;top:150px;width:260px"></div><div class="node" style="left:854px;top:145px"></div>
<div class="line" style="left:940px;top:226px;width:180px"></div><div class="node" style="left:934px;top:221px"></div>
<div class="wrap"><svg viewBox="0 0 ${WORDMARK_WIDTH} 241" aria-label="BIZOMAT"><path fill="#fff" fill-rule="evenodd" d="${wordmarkPath()}"/><path fill="${COLORS.tealBright}" d="${GLYPHS.B.bar}"/></svg>
<div class="kicker">${c.kicker}</div><h1>${c.title}</h1><div class="foot">${c.foot}</div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const out = path.join(here, 'dist');
fs.mkdirSync(out, { recursive: true });
for (const c of CARDS) {
  await page.setContent(html(c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, c.file), type: 'png' });
}
await browser.close();
const copies = [
  ['og-bizomat.png', 'public/brand/bizomat-social.png'],
  ['og-cad.png', 'public/brand/bizomat-social-cad.png'],
  ['og-work.png', 'public/brand/bizomat-social-work.png'],
  ['og-resources.png', 'public/brand/bizomat-social-resources.png'],
  ['og-cad.png', 'apps/cad/opensketch/static/ui/og.png'],
  ['og-work.png', 'apps/work/public/og.png'],
];
for (const [from, to] of copies) fs.copyFileSync(path.join(out, from), path.join(root, to));
console.log(`Social images written: ${CARDS.length} cards, ${copies.length} copies.`);
