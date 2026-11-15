#!/usr/bin/env node
// BIZOMAT website design audit: loads every page template (scripts/design-audit/pages.mjs) at each width and in both
// themes in Chromium, with the site's real headers (the CSP included), and reports layout flaws: a page wider than the
// screen, content outside its card or box, text cut off or on top of other text, button labels that overflow or wrap
// to three lines, stretched images and images without a size, text below WCAG AA contrast, controls without a
// visible focus ring, an H1 count other than one, broken internal links and anchors, console errors and CSP
// violations. docs/design/AUDIT-2026-11-15.md explains the checks, the first findings and how to run it.
//
//   npm run build && npm run build:server
//   npm run audit:design                    the full audit (every template, 7 widths, light and dark, screenshots)
//   npm run audit:layout                    the CI check: the main templates at 1440 and 390, fails on layout errors
//
// Options: --base <url> (use a running server instead of starting dist-server/server.mjs), --out <dir> (report,
// default .design-audit/), --pages a,b (names from pages.mjs), --viewports 1440,390, --themes light,dark,
// --shots (screenshots of the key pages at 1440 and 390), --no-links, --no-focus, --jobs <n>, --ci (which first runs
// --self-test: a fixture page with one of each flaw, so a check that stops working fails instead of passing quietly).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { inPageAudit, focusAudit } from './checks.mjs';
import { selfTest } from './self-test.mjs';
import { PAGES, VIEWPORTS, CI_VIEWPORTS, THEMES, APP_PATH } from './pages.mjs';

// Playwright through require(): it finds the devDependency, and a copy on NODE_PATH where one is installed globally.
const { chromium } = createRequire(import.meta.url)('playwright');
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => { const i = argv.indexOf(`--${name}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback; };
const list = (v) => (typeof v === 'string' ? v.split(',').map((x) => x.trim()).filter(Boolean) : v);

const ci = flag('ci');
const pageNames = list(opt('pages', ''));
const pages = PAGES.filter((p) => (pageNames.length ? pageNames.includes(p.name) : ci ? p.ci : true));
const viewports = list(opt('viewports', ci ? CI_VIEWPORTS : VIEWPORTS)).map(Number);
const themes = list(opt('themes', THEMES));
const outDir = resolve(root, opt('out', '.design-audit'));
const shots = flag('shots') || (!ci && !flag('no-shots'));
const checkLinks = !flag('no-links');
const checkFocus = !flag('no-focus');
const jobs = Number(opt('jobs', '6'));
// The CI check fails on these: each is a flaw a visitor sees. Contrast, focus and the rest are in the full report.
const FAIL_ON = new Set(list(opt('fail-on', 'page-horizontal-scroll,page-content-cut,outside-its-box,text-clipped,text-outside-its-element,button-label-overflows,button-wider-than-parent,button-label-3-lines,items-overlap,text-overlap,img-stretched,contrast,focus-not-visible,focus-low-contrast,h1-count,link-missing-anchor,broken-link,console-error,csp-violation,page-status')));

const freePort = () => new Promise((ok) => { const s = createServer(); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => ok(port)); }); });

async function startServer() {
  const bundle = join(root, 'dist-server/server.mjs');
  if (!existsSync(join(root, 'dist/index.html')) || !existsSync(bundle)) {
    console.error('Build the site first: npm run build && npm run build:server');
    process.exit(2);
  }
  const port = await freePort();
  const child = spawn(process.execPath, [bundle], { cwd: root, env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', WEB_DIST_DIR: join(root, 'dist'), WEB_TRUST_PROXY: '0' }, stdio: ['ignore', 'ignore', 'inherit'] });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`${base}/healthz`)).ok) return { base, stop: () => child.kill() }; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  child.kill();
  throw new Error('The website server did not start');
}

async function auditOne(page, base, p, width, theme, state) {
  const where = `${p.path} @${width} ${theme}`;
  const findings = [];
  const consoleErrors = [];
  // "Failed to load resource" names no address: same-origin failures are caught by onResponse and onFailed below, and
  // other hosts (the contact form's captcha) are not this site's to check (and are blocked in a sandbox).
  // Messages from other sites' frames (the captcha's own page and its own policy) are not this site's.
  const ownFrame = (m) => { const u = m.location()?.url; return !u || u.startsWith(base) || u.startsWith('about:'); };
  const onConsole = (m) => { if (m.type() === 'error' && ownFrame(m) && !/^Failed to load resource/.test(m.text())) consoleErrors.push(m.text()); };
  const onFailed = (r) => { const u = new URL(r.url()); if (u.origin === base && r.resourceType() !== 'document') consoleErrors.push(`failed ${u.pathname}: ${r.failure()?.errorText}`); };
  const onError = (e) => consoleErrors.push(`pageerror: ${e.message}`);
  const onResponse = (r) => {
    const u = new URL(r.url());
    if (u.origin === base && r.status() >= 400 && r.request().resourceType() !== 'document') consoleErrors.push(`${r.status()} ${u.pathname}`);
  };
  page.on('console', onConsole);
  page.on('pageerror', onError);
  page.on('response', onResponse);
  page.on('requestfailed', onFailed);
  try {
    await page.setViewportSize({ width, height: width < 700 ? 800 : 900 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    const res = await page.goto(base + p.path, { waitUntil: 'load', timeout: 60000 });
    const status = res?.status() ?? 0;
    if (status !== (p.status ?? 200)) findings.push({ type: 'page-status', severity: 'error', sel: '', text: `HTTP ${status}` });
    await page.evaluate(() => document.fonts.ready);
    // scroll through once, so lazy images load and scroll-triggered content is shown, then back to the top
    await page.evaluate(async () => {
      const step = innerHeight * 0.9;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 150));
    });
    const { findings: f, links } = await page.evaluate(inPageAudit, { contrast: true });
    findings.push(...f);
    if (checkFocus && (width === 1440 || width === 390)) {
      await page.keyboard.press('Tab');
      findings.push(...(await page.evaluate(focusAudit)));
      await page.evaluate(() => { document.activeElement?.blur?.(); scrollTo(0, 0); });
    }
    const csp = await page.evaluate(() => window.__bzCsp || []);
    for (const v of csp) findings.push({ type: 'csp-violation', severity: 'error', sel: '', text: v });
    for (const e of consoleErrors) {
      if (/Content Security Policy/i.test(e)) findings.push({ type: 'csp-violation', severity: 'error', sel: '', text: e.slice(0, 200) });
      else findings.push({ type: 'console-error', severity: 'error', sel: '', text: e.slice(0, 200) });
    }
    for (const href of links) state.links.push({ href, from: base + p.path });
    if (shots && p.key && (width === 1440 || width === 390)) {
      mkdirSync(join(outDir, 'shots'), { recursive: true });
      await page.screenshot({ path: join(outDir, 'shots', `${p.name}-${width}-${theme}.png`), fullPage: true, animations: 'disabled' });
    }
  } catch (e) {
    findings.push({ type: 'audit-failed', severity: 'error', sel: '', text: String(e.message || e).slice(0, 200) });
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onError);
    page.off('response', onResponse);
    page.off('requestfailed', onFailed);
  }
  return findings.map((x) => ({ ...x, page: p.path, name: p.name, width, theme, where }));
}

async function checkAllLinks(base, links) {
  const findings = [];
  const targets = new Map();
  for (const { href, from } of links) {
    if (!href || /^(mailto|tel|javascript|data):/i.test(href)) continue;
    let u;
    try { u = new URL(href, from); } catch { findings.push({ type: 'broken-link', severity: 'error', sel: '', text: href, page: new URL(from).pathname }); continue; }
    if (u.origin !== base) continue;
    if (APP_PATH.test(u.pathname)) continue;
    // a link to a place on the same page is checked in the page (link-missing-anchor)
    const page = new URL(from);
    if (u.pathname === page.pathname && u.search === page.search) continue;
    const key = u.pathname + u.search;
    if (!targets.has(key)) targets.set(key, { from: new URL(from).pathname, hashes: new Set() });
    if (u.hash && u.hash.length > 1 && new URL(from).pathname !== u.pathname) targets.get(key).hashes.add(decodeURIComponent(u.hash.slice(1)));
  }
  const entries = [...targets];
  let i = 0;
  const worker = async () => {
    while (i < entries.length) {
      const [path, info] = entries[i++];
      let url = base + path, res, hops = 0;
      for (; hops < 6; hops++) {
        res = await fetch(url, { redirect: 'manual' });
        if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
          const next = new URL(res.headers.get('location'), url);
          if (next.origin !== base || APP_PATH.test(next.pathname)) { res = null; break; }
          url = next.href;
          continue;
        }
        break;
      }
      if (!res) continue;
      if (res.status >= 400) { findings.push({ type: 'broken-link', severity: 'error', sel: '', text: `${path} (HTTP ${res.status})`, page: info.from }); continue; }
      if (info.hashes.size && (res.headers.get('content-type') || '').includes('text/html')) {
        const html = await res.text();
        for (const h of info.hashes) {
          const esc = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (!new RegExp(`id=["']?${esc}["'\\s>]`).test(html)) findings.push({ type: 'link-missing-anchor', severity: 'error', sel: '', text: `${path}#${h}`, page: info.from });
        }
      } else await res.body?.cancel();
    }
  };
  await Promise.all(Array.from({ length: 12 }, worker));
  return { findings, checked: entries.length };
}

function summarise(all) {
  const byType = new Map();
  for (const f of all) {
    if (!byType.has(f.type)) byType.set(f.type, { severity: f.severity, items: new Map() });
    const t = byType.get(f.type);
    const key = `${f.sel}|${f.text}`;
    if (!t.items.has(key)) t.items.set(key, { ...f, at: [] });
    t.items.get(key).at.push(f.where || f.page);
  }
  const lines = [];
  for (const [type, t] of [...byType].sort((a, b) => (a[1].severity === b[1].severity ? a[0].localeCompare(b[0]) : a[1].severity === 'error' ? -1 : 1))) {
    lines.push(`\n## ${type} (${t.severity}): ${t.items.size} distinct, ${[...t.items.values()].reduce((n, x) => n + x.at.length, 0)} in all`);
    for (const x of [...t.items.values()].slice(0, 60)) {
      const extra = Object.entries(x).filter(([k]) => !['type', 'severity', 'sel', 'text', 'page', 'name', 'width', 'theme', 'where', 'at'].includes(k)).map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(';') : v}`).join(' ');
      const at = [...new Set(x.at)];
      lines.push(`- ${x.sel || '(page)'} "${x.text}" ${extra}\n    at ${at.slice(0, 6).join(', ')}${at.length > 6 ? ` and ${at.length - 6} more` : ''}`);
    }
    if (t.items.size > 60) lines.push(`- ... and ${t.items.size - 60} more`);
  }
  return lines.join('\n');
}

const started = Date.now();
const browser = await chromium.launch();
if (ci || flag('self-test')) {
  const missed = await selfTest(browser);
  if (missed.length) {
    console.error(`Design audit self-test: the checks missed ${missed.join(', ')} on a page that has them (scripts/design-audit/self-test.mjs).`);
    await browser.close();
    process.exit(1);
  }
  if (flag('self-test')) { console.log('Design audit self-test: every check found its flaw.'); await browser.close(); process.exit(0); }
}
const server = opt('base') ? { base: opt('base').replace(/\/$/, ''), stop: () => {} } : await startServer();
const state = { links: [] };
const queue = [];
for (const p of pages) for (const width of viewports) for (const theme of themes) queue.push({ p, width, theme });
const all = [];
let done = 0;
const run = async () => {
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    window.__bzCsp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__bzCsp.push(`${e.violatedDirective} blocked ${e.blockedURI || 'inline'} (${(e.sourceFile || '').split('/').pop()}:${e.lineNumber})`));
  });
  const page = await context.newPage();
  while (queue.length) {
    const job = queue.shift();
    all.push(...(await auditOne(page, server.base, job.p, job.width, job.theme, state)));
    done++;
    if (!ci && done % 20 === 0) console.log(`${done} page loads, ${Math.round((Date.now() - started) / 1000)} s`);
  }
  await context.close();
};
try {
  await Promise.all(Array.from({ length: Math.max(1, jobs) }, run));
  let linkCount = 0;
  if (checkLinks) {
    const { findings, checked } = await checkAllLinks(server.base, state.links);
    linkCount = checked;
    all.push(...findings.map((f) => ({ ...f, where: f.page })));
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'report.json'), JSON.stringify(all, null, 1));
  const summary = `# Design audit: ${pages.length} pages x ${viewports.length} widths x ${themes.length} themes = ${pages.length * viewports.length * themes.length} page loads, ${linkCount} internal links, ${Math.round((Date.now() - started) / 1000)} s\n${summarise(all)}\n`;
  writeFileSync(join(outDir, 'summary.md'), summary);
  const failing = all.filter((f) => f.severity === 'error' && FAIL_ON.has(f.type));
  if (ci) {
    if (failing.length) {
      console.error(summarise(failing));
      console.error(`\nDesign audit: ${failing.length} layout error(s). The full report is in ${outDir}/summary.md.`);
      process.exitCode = 1;
    } else console.log(`Design audit: no layout errors (${pages.length} pages x ${viewports.length} widths x ${themes.length} themes, ${linkCount} links, ${Math.round((Date.now() - started) / 1000)} s).`);
  } else {
    console.log(summary.split('\n').filter((l) => l.startsWith('#')).join('\n'));
    console.log(`\nReport: ${join(outDir, 'summary.md')}${shots ? `, screenshots in ${join(outDir, 'shots')}` : ''}`);
  }
} finally {
  await browser.close();
  server.stop();
}
