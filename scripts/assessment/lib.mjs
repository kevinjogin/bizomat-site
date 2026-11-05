// Shared helpers for the assessment PDF and image generators.
// Rendering uses a locally installed Chromium browser (Microsoft Edge or Google Chrome) in headless mode,
// with a throwaway profile, so no extra npm dependencies are needed. Fonts, the wordmark and the QR code
// are embedded in each page, so the output does not depend on network access or installed fonts.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const OUT = path.join(ROOT, 'public', 'assessment');

const BROWSERS = [
  process.env.CHROME_PATH,
  process.env.EDGE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/microsoft-edge',
].filter(Boolean);

export function browser() {
  const found = BROWSERS.find((p) => fs.existsSync(p));
  if (!found) throw new Error('No Chromium browser found. Set CHROME_PATH or EDGE_PATH to Chrome or Edge.');
  return found;
}

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const b64 = (file) => fs.readFileSync(file).toString('base64');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** @font-face rules with the site's own typefaces embedded (Oxanium display, Inter Tight body). */
export const FONT_CSS = `
@font-face { font-family: 'BIZOMAT Display'; src: url(data:font/ttf;base64,${b64(path.join(ROOT, 'public/fonts/oxanium-variable.ttf'))}) format('truetype'); font-weight: 200 800; }
@font-face { font-family: 'Inter Tight'; src: url(data:font/woff2;base64,${b64(path.join(ROOT, 'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2'))}) format('woff2'); font-weight: 100 900; }
`;

/** Approved BIZOMAT orange wordmark, inline. `variant` 'light' suits white paper, 'dark' suits graphite. */
export const wordmark = (variant = 'light', height = 28) =>
  read(`public/brand/kevos-wordmark-orange-${variant}.svg`).replace('<svg ', `<svg height="${height}" width="${Math.round((height * 2069) / 284)}" `);

export const qrSvg = (size = 160) =>
  read('public/assessment/kevos-assessment-qr.svg').replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);

export const TOKENS = {
  ink: '#121211',
  ink2: '#3b3a36',
  muted: '#67645d',
  line: 'rgba(18,18,17,.14)',
  paper: '#f6f5f1',
  orange: '#ff6a13',
  accent: '#c2410c',
  graphite: '#131412',
  graphite2: '#1c1d1b',
  light: '#f1efea',
  lightMuted: '#a9a49c',
};

function writeTemp(html) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kevos-assessment-'));
  const file = path.join(dir, 'page.html');
  fs.writeFileSync(file, html);
  return { dir, file };
}

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/**
 * Run the browser, then wait until `outFile` exists and its size has settled. On Windows the Edge/Chrome
 * launcher can return before the headless job finishes, so the temporary page must outlive the launcher.
 */
function run(args, dir, outFile, timeoutMs = 60_000) {
  fs.rmSync(outFile, { force: true });
  const profile = path.join(dir, 'profile');
  execFileSync(
    browser(),
    ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--enable-logging=stderr', '--v=0', `--user-data-dir=${profile}`, ...args],
    { stdio: 'pipe', timeout: 120_000 },
  );
  const until = Date.now() + timeoutMs;
  let last = -1;
  while (Date.now() < until) {
    const size = fs.existsSync(outFile) ? fs.statSync(outFile).size : -1;
    if (size > 0 && size === last) break;
    last = size;
    sleep(500);
  }
  sleep(800); // let the detached browser release the profile before it is deleted
  if (!fs.existsSync(outFile) || fs.statSync(outFile).size === 0) throw new Error(`Browser did not create ${outFile}`);
}

const cleanup = (dir) => {
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 400 });
  } catch {
    /* a browser helper may still hold the profile; the OS temp folder is cleaned later */
  }
};

/** Print an HTML document (with its own @page size) to PDF. */
export function renderPdf(html, outFile) {
  const { dir, file } = writeTemp(html);
  try {
    run(['--no-pdf-header-footer', '--print-to-pdf-no-header', `--print-to-pdf=${outFile}`, pathToFileURL(file).href], dir, outFile);
  } finally {
    cleanup(dir);
  }
  return outFile;
}

/** Screenshot an HTML document at an exact pixel size (scale 2 doubles the resolution). */
export function renderPng(html, outFile, width, height, scale = 1) {
  const { dir, file } = writeTemp(html);
  try {
    run(['--hide-scrollbars', `--force-device-scale-factor=${scale}`, `--window-size=${width},${height}`, `--screenshot=${outFile}`, pathToFileURL(file).href], dir, outFile);
  } finally {
    cleanup(dir);
  }
  return outFile;
}

/** Static line drawing of the assessment idea (bracket, datums, options, report) for print and social images. */
export function illustration({ ink, muted, orange, card, panel, soft }) {
  return `<svg viewBox="0 0 480 372" xmlns="http://www.w3.org/2000/svg" font-family="Consolas, 'Cascadia Mono', monospace">
  <defs><marker id="m" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 8 4 0 8z" fill="${ink}"/></marker>
  <marker id="mo" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8z" fill="${orange}"/></marker></defs>
  <text x="48" y="104" font-size="8" fill="${orange}" font-weight="700" letter-spacing=".5">01 · PART DOES NOT LOCATE</text>
  <rect x="48" y="148" width="232" height="124" rx="6" fill="${card}" stroke="${muted}" stroke-width="1.2"/>
  <circle cx="100" cy="210" r="10" fill="${panel}" stroke="${muted}" stroke-width="1.2"/><circle cx="228" cy="210" r="10" fill="${panel}" stroke="${muted}" stroke-width="1.2"/>
  <path d="M34 210H294M100 134V286M228 134V286" stroke="${muted}" stroke-width=".8" stroke-dasharray="14 3 2 3" fill="none"/>
  <path d="M100 132H228" stroke="${ink}" stroke-width=".9" marker-start="url(#m)" marker-end="url(#m)"/>
  <text x="164" y="124" font-size="7.4" fill="${muted}" text-anchor="middle">POSITION FROM A | B</text>
  <path d="M48 244 40 238V250Z" fill="${ink}"/><rect x="16" y="236" width="18" height="16" fill="${card}" stroke="${ink}" stroke-width=".9"/><text x="25" y="248" font-size="8" fill="${ink}" text-anchor="middle" font-weight="700">A</text>
  <path d="M200 272 194 280H206Z" fill="${ink}"/><rect x="191" y="286" width="18" height="16" fill="${card}" stroke="${ink}" stroke-width=".9"/><text x="200" y="298" font-size="8" fill="${ink}" text-anchor="middle" font-weight="700">B</text>
  <circle cx="228" cy="210" r="26" fill="none" stroke="${orange}" stroke-width="1.1" stroke-dasharray="4 3"/>
  <rect x="62" y="174" width="204" height="72" rx="4" fill="none" stroke="${orange}" stroke-dasharray="5 4" opacity=".75"/>
  <g transform="rotate(-3.5 164 210) translate(10 -8)"><rect x="62" y="174" width="204" height="72" rx="4" fill="${soft}" stroke="${ink}" stroke-width="1.6"/><path d="M62 232H266" stroke="${muted}" stroke-width=".9"/><path d="M156 174v-6h16v6" fill="none" stroke="${ink}" stroke-width="1.2"/><circle cx="100" cy="210" r="7" fill="none" stroke="${orange}" stroke-width="1.6"/><circle cx="228" cy="210" r="7" fill="none" stroke="${orange}" stroke-width="1.6"/></g>
  <path d="M270 152 283 174H257Z" fill="${soft}" stroke="${orange}" stroke-width="1.3" stroke-linejoin="round"/><path d="M270 160V167M270 170.5V171" stroke="${orange}" stroke-width="1.8" stroke-linecap="round"/>
  <text x="48" y="326" font-size="8" fill="${orange}" font-weight="700">03 · OPTIONS</text>
  ${['A · PIN FIXTURE', 'B · DATUM + SLOT', 'C · DRILL LATER'].map((t, i) => `<rect x="${48 + i * 88}" y="334" width="84" height="26" rx="3" fill="${i === 1 ? soft : card}" stroke="${i === 1 ? orange : muted}" stroke-width="${i === 1 ? 1.4 : 1}"/><text x="${90 + i * 88}" y="351" font-size="7.4" fill="${ink}" text-anchor="middle" font-weight="700">${t}</text>`).join('')}
  <path d="M326 88H444L464 108V352H326Z" fill="${card}" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/><path d="M444 88V108H464" fill="none" stroke="${muted}" stroke-width=".9"/>
  <rect x="338" y="102" width="56" height="5" fill="${orange}"/><text x="338" y="124" font-size="9.6" fill="${ink}" font-weight="700" letter-spacing=".8">ASSESSMENT</text>
  ${[[163, 110], [171, 84], [195, 104], [203, 92], [231, 80], [242, 92], [253, 70]].map(([y, w], i) => `<rect x="${i > 3 ? 350 : 338}" y="${y}" width="${w}" height="4" fill="${i === 5 ? orange : muted}" opacity="${i === 5 ? 1 : 0.55}"/>`).join('')}
  <rect x="338" y="268" width="114" height="36" rx="3" fill="${soft}" stroke="${orange}" stroke-width="1.1"/><path d="M345 287 350 292 359 281" fill="none" stroke="${orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="366" y="284" font-size="7.4" fill="${ink}" font-weight="700">NEXT STEP</text><text x="366" y="296" font-size="7" fill="${muted}">MEASURE, THEN B</text>
  <text x="338" y="338" font-size="7" fill="${muted}">BIZOMAT · kevos.com</text>
</svg>`;
}
