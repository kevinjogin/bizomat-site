#!/usr/bin/env node
// Builds every BIZOMAT brand asset from shared/brand/glyphs.mjs and copies them into the three apps.
//
//   node shared/brand/build.mjs           write shared/brand/dist/ and copy into the website, apps/cad and apps/work
//   node shared/brand/build.mjs --check   fail (exit 1) when any copy differs from what this script would write
//
// Run from the repository root (it uses the website's sharp for PNG rendering). Output is deterministic, so the
// --check mode can run in CI. The social images (og-*.png) are rendered separately by shared/brand/og.mjs (Chromium).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { ARROW, B as BGLYPH, CAP, COLORS, LOCKUP, MARK, WORD, WORDMARK_WIDTH } from './glyphs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const require = createRequire(path.join(root, 'package.json'));
const sharp = require('sharp');
const check = process.argv.includes('--check');

const W = WORDMARK_WIDTH;
const H = CAP.height;
const B = BGLYPH.d;
const BW = BGLYPH.width;
const TILE = MARK.size;
const svgOpen = (w, h, label = 'BIZOMAT') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'}>`;

// The mark's inside: the white B with its teal arrow, placed on a tile of MARK.size.
const markInner = (letter = '#ffffff', arrow = COLORS.tealMark) =>
  `<g transform="${MARK.transform}"><path fill="${letter}" fill-rule="evenodd" d="${B}"/><path fill="${arrow}" d="${ARROW}"/></g>`;
const lockup = (tile, ink) =>
  `${svgOpen(LOCKUP.width, LOCKUP.height)}<rect width="${TILE}" height="${TILE}" rx="${MARK.radius}" fill="${tile}"/>${markInner()}` +
  `<g transform="${LOCKUP.wordTransform}"><path fill="${ink}" fill-rule="evenodd" d="${WORD}"/><path fill="${COLORS.tealMark}" d="${ARROW}"/></g></svg>\n`;

// ---------- SVG sources ----------
const svg = {
  // One colour, follows CSS `color`: the arrow is a hole in the B.
  'bizomat-wordmark.svg': `${svgOpen(W, H)}<path fill="currentColor" fill-rule="evenodd" d="${WORD}"/></svg>\n`,
  // Full colour on light backgrounds: navy word, teal arrow in the B.
  'bizomat-logo-light.svg': `${svgOpen(W, H)}<path fill="${COLORS.navy}" fill-rule="evenodd" d="${WORD}"/><path fill="${COLORS.tealMark}" d="${ARROW}"/></svg>\n`,
  // Full colour on dark backgrounds: white word, the same teal arrow.
  'bizomat-logo-dark.svg': `${svgOpen(W, H)}<path fill="#ffffff" fill-rule="evenodd" d="${WORD}"/><path fill="${COLORS.tealMark}" d="${ARROW}"/></svg>\n`,
  // The lockup: the mark, then the wordmark (headers and footers). On dark paper the tile is lifted (tileDark).
  'bizomat-lockup-light.svg': lockup(COLORS.navy, COLORS.navy),
  'bizomat-lockup-dark.svg': lockup(COLORS.tileDark, '#ffffff'),
};

// The mark: the B on a navy tile with the teal arrow. `inset` leaves the safe zone a maskable icon needs (the platform
// may crop it to a circle).
function markSvg({ size = TILE, inset = 0, radius = MARK.radius, label = true } = {}) {
  const k = (size - inset * 2) / TILE;
  return `${svgOpen(size, size, label ? 'BIZOMAT' : '')}<rect width="${size}" height="${size}" rx="${radius}" fill="${COLORS.navy}"/><g transform="translate(${inset} ${inset}) scale(${k.toFixed(5)})">${markInner()}</g></svg>\n`;
}
svg['bizomat-mark.svg'] = markSvg();
svg['bizomat-mark-maskable.svg'] = markSvg({ inset: 0, radius: 0, label: false });
// The B alone in one colour (for UI where the tile is not wanted); the arrow is a hole.
svg['bizomat-b.svg'] = `${svgOpen(BW, H)}<path fill="currentColor" fill-rule="evenodd" d="${B}"/></svg>\n`;

// ---------- Raster ----------
async function png(source, size) {
  return sharp(Buffer.from(source), { density: 384 }).resize(size, size).png({ compressionLevel: 9, palette: false }).toBuffer();
}
async function ico(source, sizes = [16, 32, 48]) {
  const images = await Promise.all(sizes.map((s) => png(source, s)));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((img, i) => {
    const pos = 6 + 16 * i;
    header.writeUInt8(sizes[i], pos);
    header.writeUInt8(sizes[i], pos + 1);
    header.writeUInt16LE(1, pos + 4);
    header.writeUInt16LE(32, pos + 6);
    header.writeUInt32LE(img.length, pos + 8);
    header.writeUInt32LE(offset, pos + 12);
    offset += img.length;
  });
  return Buffer.concat([header, ...images]);
}

const files = new Map(); // name in dist -> Buffer
for (const [name, text] of Object.entries(svg)) files.set(name, Buffer.from(text));
const mark = svg['bizomat-mark.svg'];
for (const size of [16, 32, 48, 180, 192, 512]) files.set(`bizomat-icon-${size}.png`, await png(mark, size));
files.set('bizomat-maskable-512.png', await png(markSvg({ inset: 64, radius: 0, label: false }), 512));
files.set('favicon.ico', await ico(mark));

// ---------- Generated modules for apps that draw the logo inline ----------
// BAR_PATH keeps its earlier name for callers that colour the accent: it is now the arrow (also ARROW_PATH).
const header = 'Generated by shared/brand/build.mjs from shared/brand/glyphs.mjs. Do not edit by hand.';
const consts = {
  WORDMARK_VIEWBOX: `0 0 ${W} ${H}`, WORDMARK_PATH: WORD, B_VIEWBOX: `0 0 ${BW} ${H}`, B_PATH: B, BAR_PATH: ARROW, ARROW_PATH: ARROW,
  MARK_SIZE: TILE, MARK_RADIUS: MARK.radius, MARK_TRANSFORM: MARK.transform,
  LOCKUP_VIEWBOX: `0 0 ${LOCKUP.width} ${LOCKUP.height}`, LOCKUP_WORD_TRANSFORM: LOCKUP.wordTransform,
};
const pyConsts = Object.entries(consts).map(([k, v]) => `${k} = ${typeof v === 'number' ? v : JSON.stringify(v)}`).join('\n');
const pyColors = `NAVY = "${COLORS.navy}"\nTEAL = "${COLORS.teal}"\nTEAL_BRIGHT = "${COLORS.tealBright}"\nTEAL_MARK = "${COLORS.tealMark}"\nTILE_DARK = "${COLORS.tileDark}"\n`;
files.set('bizomat_brand.py', Buffer.from(`"${'""'}${header}"${'""'}\n\n${pyConsts}\n${pyColors}`));
const tsConsts = Object.entries(consts).map(([k, v]) => `export const ${k} = ${typeof v === 'number' ? v : `'${v}'`};`).join('\n');
const tsColors = JSON.stringify({ navy: COLORS.navy, teal: COLORS.teal, tealBright: COLORS.tealBright, tealMark: COLORS.tealMark, tileDark: COLORS.tileDark });
files.set('bizomat-brand.ts', Buffer.from(`// ${header}\n${tsConsts}\nexport const BRAND_COLORS = ${tsColors} as const;\n`));
files.set('brand.json', Buffer.from(JSON.stringify({ name: 'BIZOMAT', tagline: 'Intelligent Business Automation Platform', statement: 'Automate work. Connect systems. Get business done.', wordmark: { viewBox: `0 0 ${W} ${H}`, path: WORD }, b: { viewBox: `0 0 ${BW} ${H}`, path: B, arrow: ARROW }, mark: MARK, lockup: LOCKUP, colors: COLORS }, null, 2) + '\n'));

// Copies kept beside the sources: tokens, components and the heading font.
const copyFrom = (rel) => fs.readFileSync(path.join(here, rel));
files.set('tokens.css', copyFrom('tokens.css'));
// CAD Automation is served under a path of bizomat.ai (/cad) as well as at the root of a host: its copy finds the fonts
// beside its own folder (/ui/bizomat-tokens.css -> /fonts/..., /cad/ui/bizomat-tokens.css -> /cad/fonts/...).
files.set('tokens-fonts-relative.css', Buffer.from(copyFrom('tokens.css').toString().replaceAll("url('/fonts/", "url('../fonts/")));
files.set('components.css', copyFrom('components.css'));
files.set('oxanium-latin.woff2', copyFrom('fonts/oxanium-latin.woff2'));
files.set('inter-tight-latin.woff2', copyFrom('fonts/inter-tight-latin.woff2'));
files.set('OFL-InterTight.txt', copyFrom('fonts/OFL-InterTight.txt'));
files.set('OFL-Oxanium.txt', fs.readFileSync(path.join(root, 'public/fonts/OFL-Oxanium.txt')));

// ---------- Where each app keeps its copy ----------
const T = (from, to) => ({ from, to });
const targets = [
  // Website (repository root)
  T('bizomat-wordmark.svg', 'public/brand/bizomat-wordmark.svg'),
  T('bizomat-logo-light.svg', 'public/brand/bizomat-logo-light.svg'),
  T('bizomat-logo-dark.svg', 'public/brand/bizomat-logo-dark.svg'),
  T('bizomat-lockup-light.svg', 'public/brand/bizomat-lockup-light.svg'),
  T('bizomat-lockup-dark.svg', 'public/brand/bizomat-lockup-dark.svg'),
  T('bizomat-mark.svg', 'public/brand/bizomat-mark.svg'),
  T('bizomat-b.svg', 'public/brand/bizomat-b.svg'),
  T('bizomat-icon-32.png', 'public/brand/bizomat-icon-32.png'),
  T('bizomat-icon-180.png', 'public/brand/bizomat-icon-180.png'),
  T('bizomat-icon-192.png', 'public/brand/bizomat-icon-192.png'),
  T('bizomat-icon-512.png', 'public/brand/bizomat-icon-512.png'),
  T('bizomat-maskable-512.png', 'public/brand/bizomat-maskable-512.png'),
  T('bizomat-mark.svg', 'public/favicon.svg'),
  T('favicon.ico', 'public/favicon.ico'),
  T('bizomat-icon-32.png', 'public/favicon-32.png'),
  T('bizomat-icon-180.png', 'public/apple-touch-icon.png'),
  T('bizomat-icon-192.png', 'public/icon-192.png'),
  T('bizomat-icon-512.png', 'public/icon-512.png'),
  T('oxanium-latin.woff2', 'public/fonts/oxanium-latin.woff2'),
  T('inter-tight-latin.woff2', 'public/fonts/inter-tight-latin.woff2'),
  T('tokens.css', 'src/styles/bizomat/tokens.css'),
  T('components.css', 'src/styles/bizomat/components.css'),
  T('bizomat-brand.ts', 'src/data/bizomat-brand.ts'),
  // CAD Automation (apps/cad, Python server)
  T('bizomat-mark.svg', 'apps/cad/opensketch/static/favicon.svg'),
  T('favicon.ico', 'apps/cad/opensketch/static/favicon.ico'),
  T('bizomat-icon-32.png', 'apps/cad/opensketch/static/ui/icon-32.png'),
  T('bizomat-icon-180.png', 'apps/cad/opensketch/static/ui/icon-180.png'),
  T('bizomat-logo-light.svg', 'apps/cad/opensketch/static/ui/bizomat-logo-light.svg'),
  T('tokens-fonts-relative.css', 'apps/cad/opensketch/static/ui/bizomat-tokens.css'),
  T('oxanium-latin.woff2', 'apps/cad/opensketch/static/fonts/oxanium-latin.woff2'),
  T('OFL-Oxanium.txt', 'apps/cad/opensketch/static/fonts/OFL-Oxanium.txt'),
  T('bizomat_brand.py', 'apps/cad/opensketch/bizomat_brand.py'),
  // Project Management (apps/work, React + Worker)
  T('bizomat-mark.svg', 'apps/work/public/favicon.svg'),
  T('bizomat-icon-180.png', 'apps/work/public/apple-touch-icon.png'),
  T('oxanium-latin.woff2', 'apps/work/public/fonts/oxanium-latin.woff2'),
  T('OFL-Oxanium.txt', 'apps/work/public/fonts/OFL-Oxanium.txt'),
  T('inter-tight-latin.woff2', 'apps/work/public/fonts/inter-tight-latin.woff2'),
  T('OFL-InterTight.txt', 'apps/work/public/fonts/OFL-InterTight.txt'),
  T('tokens.css', 'apps/work/src/client/styles/bizomat-tokens.css'),
  T('bizomat-brand.ts', 'apps/work/src/client/lib/bizomat-brand.ts'),
];

let problems = 0;
const dist = path.join(here, 'dist');
if (!check) fs.mkdirSync(dist, { recursive: true });
// shared/brand/dist/ is build output (git-ignored), absent on a fresh checkout: --check compares only the committed
// copies below.
if (!check) for (const [name, buf] of files) fs.writeFileSync(path.join(dist, name), buf);
for (const { from, to } of targets) {
  const buf = files.get(from);
  if (!buf) throw new Error(`no such brand file: ${from}`);
  const p = path.join(root, to);
  if (check) {
    if (!fs.existsSync(p) || !fs.readFileSync(p).equals(buf)) { console.error(`out of date: ${to} (run node shared/brand/build.mjs)`); problems++; }
  } else {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    if (!fs.existsSync(p) || !fs.readFileSync(p).equals(buf)) fs.writeFileSync(p, buf);
  }
}
if (check && problems) process.exit(1);
console.log(check ? `BIZOMAT brand assets in step (${targets.length} copies).` : `BIZOMAT brand assets written: ${files.size} files, ${targets.length} copies.`);
