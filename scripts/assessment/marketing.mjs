// Marketing assets for the KEVOS® Engineering Problem Assessment, written to public/assessment/:
//   kevos-engineering-problem-assessment-brochure.pdf  one-page A4 brochure for email and print
//   kevos-assessment-qr-card.pdf                       printable A6 QR card
//   kevos-assessment-social.png                        1200 × 630 social sharing (Open Graph) image
//   kevos-assessment-banner.png                        1600 × 600 promotional banner
// Run `python scripts/assessment/qr.py` first (the QR code is embedded). Then: node scripts/assessment/marketing.mjs
import fs from 'node:fs';
import path from 'node:path';
import { FONT_CSS, OUT, TOKENS as T, esc, illustration, qrSvg, renderPdf, renderPng, wordmark } from './lib.mjs';
import { ASSESSMENT, EXAMPLES, EXCLUSIONS } from '../../src/config/assessment.ts';

const URL_TEXT = 'kevos.com/assessment';
const darkArt = illustration({ ink: T.light, muted: '#8f8b83', orange: '#ff8c47', card: '#1c1d1b', panel: T.graphite, soft: 'rgba(255,140,71,.14)' });
const grid = (c) => `background-image: linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px); background-size: 22px 22px;`;
const base = `${FONT_CSS} * { box-sizing: border-box; } html, body { margin: 0; } body { font-family: 'Inter Tight', 'Segoe UI', Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.display { font-family: 'KEVOS Display', sans-serif; font-weight: 700; letter-spacing: -.01em; }
.mono { font-family: Consolas, 'Cascadia Mono', monospace; letter-spacing: .08em; text-transform: uppercase; }`;

const steps = [
  ['Submit', 'Describe one problem using the enquiry form. No payment is taken.'],
  ['Confirm', 'KEVOS® checks suitability and confirms the scope in writing.'],
  ['Pay', `Pay ${ASSESSMENT.priceLabel} using the payment instructions provided.`],
  ['Book', 'After payment is verified, book a 30-minute remote meeting.'],
  ['Receive', 'Receive the one-page PDF recommendation.'],
];
const audience = [
  'Manufacturers, fabricators and equipment builders',
  'Product businesses with a mechanical design question',
  'Production and operations teams with one recurring problem',
  'Teams that want an engineering view before a larger engagement',
];
const inclusions = [
  ['Problem understanding', 'One clearly defined engineering or manufacturing problem.'],
  ['Technical discussion', 'Up to 30 minutes of remote discussion.'],
  ['Preliminary review', 'Drawings, photographs or process information you supply.'],
  ['Improvement options', 'Up to three, where the evidence permits.'],
  ['Written recommendation', 'A professional one-page PDF.'],
];

function brochureHtml() {
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>KEVOS® Engineering Problem Assessment brochure</title><style>${base}
@page { size: A4; margin: 0; }
body { width: 210mm; height: 297mm; color: ${T.ink}; font-size: 8.4pt; line-height: 1.4; }
.page { height: 297mm; display: flex; flex-direction: column; overflow: hidden; }
.hero { position: relative; padding: 9mm 12mm 8mm; background: ${T.graphite}; color: ${T.light}; ${grid('rgba(255,140,71,.07)')} display: grid; grid-template-columns: minmax(0, 1fr) 76mm; gap: 6mm; align-items: center; }
.hero::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1.6mm; background: ${T.orange}; }
.eyebrow { margin: 5mm 0 0; color: #ff8c47; font-size: 6.8pt; }
h1 { margin: 2mm 0 0; font-size: 22pt; line-height: 1.02; }
h1 em { display: block; font-style: normal; color: #ff8c47; }
.lines { margin: 3mm 0 0; color: #cfcbc3; font-size: 8.6pt; line-height: 1.45; }
.price { display: flex; align-items: center; gap: 3.5mm; margin-top: 4mm; padding: 2.6mm 3.5mm; border: .8pt solid rgba(241,239,234,.22); border-left: 1.4mm solid ${T.orange}; border-radius: 1mm; background: rgba(28,29,27,.85); max-width: 100%; }
.price b { font-family: 'KEVOS Display', sans-serif; font-size: 23pt; line-height: 1; flex: none; }
.price span { display: block; font-weight: 650; font-size: 8.8pt; }
.price small { display: block; color: ${T.lightMuted}; font-size: 6.8pt; line-height: 1.35; }
.art { padding: 2.5mm; border: .7pt solid rgba(241,239,234,.16); border-radius: 3mm; background: rgba(19,20,18,.85); }
.art svg { width: 100%; height: auto; display: block; }
.inc { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 2.4mm; margin: 6mm 12mm 0; padding: 0; list-style: none; }
.inc li { padding: 2.6mm 2.8mm; border: .8pt solid ${T.line}; border-top: 1.1mm solid ${T.orange}; border-radius: 1mm; }
.inc b { display: block; font-family: Consolas, monospace; color: ${T.accent}; font-size: 7.4pt; }
.inc strong { display: block; margin: .6mm 0 .8mm; font-size: 8.2pt; line-height: 1.2; }
.inc span { display: block; font-size: 7.4pt; color: ${T.ink2}; line-height: 1.35; }
.body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0 8mm; padding: 6mm 12mm 0; }
h2 { margin: 0 0 1.8mm; font-size: 6.8pt; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; color: ${T.accent}; }
section { margin-bottom: 5mm; }
ul { margin: 0; padding-left: 4mm; }
li { margin-bottom: .6mm; }
.cols { columns: 2; column-gap: 5mm; }
.steps { display: grid; gap: 1.5mm; margin: 0; padding: 0; list-style: none; counter-reset: s; }
.steps li { counter-increment: s; display: grid; grid-template-columns: 7mm 1fr; gap: 2mm; align-items: start; margin: 0; }
.steps li::before { content: counter(s); display: grid; place-items: center; width: 5.6mm; height: 5.6mm; border-radius: 50%; background: ${T.ink}; color: #fff; font-size: 7pt; font-weight: 700; }
.steps strong { display: block; }
.gate { margin: 2mm 0 0; padding: 1.8mm 2.4mm; background: rgba(255,106,19,.1); border-left: 1mm solid ${T.orange}; font-size: 7.6pt; }
.preview { display: grid; grid-template-columns: 30mm 1fr; gap: 4mm; align-items: center; }
.preview p { margin: 0; }
.mini { height: 40mm; padding: 2.6mm; border: .8pt solid ${T.line}; border-top: 1.4mm solid ${T.orange}; border-radius: 1mm; box-shadow: 0 1.5mm 4mm rgba(0,0,0,.12); background: #fff; }
.mini .t { font-family: 'KEVOS Display', sans-serif; font-weight: 700; font-size: 5pt; margin-bottom: 1.4mm; }
.mini i { display: block; height: 1mm; margin: .95mm 0; background: #d9d6cf; border-radius: .5mm; }
.mini i.o { background: ${T.orange}; width: 70%; }
.mini i.s { width: 60%; }
.excl { display: flex; flex-wrap: wrap; gap: 1.1mm; margin: 0; padding: 0; list-style: none; }
.excl li { margin: 0; padding: .5mm 1.8mm; border: .7pt solid ${T.line}; border-radius: 4mm; font-size: 7.2pt; color: ${T.ink2}; }
.note { margin: 1.8mm 0 0; font-size: 7.4pt; color: ${T.muted}; }
.qr { display: grid; grid-template-columns: 28mm 1fr; gap: 4mm; align-items: center; padding: 2.6mm; border: .8pt solid ${T.line}; border-radius: 1.5mm; }
.qr svg { width: 28mm; height: 28mm; display: block; }
.qr strong { display: block; font-family: 'KEVOS Display', sans-serif; font-size: 10.5pt; margin-bottom: 1mm; }
.qr span { color: ${T.accent}; font-weight: 700; font-size: 9.6pt; }
.foot { display: flex; justify-content: space-between; gap: 6mm; margin: 0 12mm; padding: 2.6mm 0 6mm; border-top: .8pt solid ${T.line}; font-size: 6.6pt; color: ${T.muted}; }
</style></head><body><div class="page">
<header class="hero">
  <div>
    ${wordmark('dark', 22)}
    <p class="eyebrow mono">${esc(ASSESSMENT.name)}</p>
    <h1 class="display">Engineering problems.<em>Clear next steps.</em></h1>
    <p class="lines">${ASSESSMENT.heroLines.map(esc).join(' ')}</p>
    <div class="price"><b>${ASSESSMENT.priceLabel}</b><div><span>${esc(ASSESSMENT.priceCaption)}, one defined problem</span><small>${esc(ASSESSMENT.gstNote)}</small></div></div>
  </div>
  <div class="art">${darkArt}</div>
</header>
<ol class="inc">${inclusions.map(([t, d], i) => `<li><b>0${i + 1}</b><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('')}</ol>
<main class="body">
  <div>
    <section><h2>Who it is for</h2><ul>${audience.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></section>
    <section><h2>Typical problems</h2><ul class="cols">${EXAMPLES.map((e) => `<li>${esc(e.title)}</li>`).join('')}</ul></section>
    <section><h2>Deliverable preview</h2><div class="preview"><div class="mini"><div class="t">ENGINEERING PROBLEM ASSESSMENT</div><i></i><i class="s"></i><i></i><i class="o"></i><i></i><i class="s"></i><i></i><i class="o"></i><i class="s"></i></div>
      <p>A one-page PDF: problem statement, information reviewed, preliminary findings, up to three improvement options, the recommended next action, assumptions and limitations, and possible follow-on work.</p></div></section>
  </div>
  <div>
    <section><h2>How the process works</h2><ol class="steps">${steps.map(([t, d]) => `<li><div><strong>${t}</strong>${esc(d)}</div></li>`).join('')}</ol>
      <p class="gate">Payment is requested only after the scope is confirmed. The meeting is booked only after payment is verified.</p></section>
    <section><h2>Scope exclusions</h2><ul class="excl">${EXCLUSIONS.map((e) => `<li>${esc(e)}</li>`).join('')}</ul><p class="note">Further engineering services are scoped and quoted separately.</p></section>
    <section class="qr">${qrSvg(160)}<div><strong>Request an assessment</strong>Scan the code or visit<br><span>${URL_TEXT}</span></div></section>
  </div>
</main>
<footer class="foot"><span>KEVOS® | kevos.com · KEVOS® is a registered Australian trade mark.</span><span>A preliminary desktop assessment, not certification or design sign-off.</span></footer>
</div></body></html>`;
}

function qrCardHtml() {
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>KEVOS® assessment QR card</title><style>${base}
@page { size: 105mm 148mm; margin: 0; }
body { width: 105mm; height: 148mm; color: ${T.ink}; }
.card { position: relative; height: 148mm; padding: 9mm 9mm 7mm; display: flex; flex-direction: column; align-items: center; text-align: center; border-top: 3mm solid ${T.orange}; }
.e { margin: 5mm 0 0; font-size: 6.6pt; color: ${T.accent}; }
h1 { margin: 1.5mm 0 0; font-size: 15pt; line-height: 1.05; }
.p { margin: 2mm 0 0; font-size: 9pt; }
.p b { font-family: 'KEVOS Display', sans-serif; font-size: 16pt; margin-right: 1.5mm; }
.qr { margin-top: 5mm; padding: 2mm; border: .8pt solid ${T.line}; border-radius: 2mm; }
.qr svg { width: 58mm; height: 58mm; display: block; }
.cta { margin: 4mm 0 0; font-weight: 700; font-size: 10pt; }
.u { margin: 1mm 0 0; color: ${T.accent}; font-weight: 700; font-size: 10pt; }
.f { margin-top: auto; font-size: 6pt; color: ${T.muted}; }
</style></head><body><div class="card">
${wordmark('light', 18)}
<p class="e mono">Engineering problems. Clear next steps.</p>
<h1 class="display">Engineering Problem Assessment</h1>
<p class="p"><b>${ASSESSMENT.priceLabel}</b>${esc(ASSESSMENT.priceCaption)}</p>
<div class="qr">${qrSvg(220)}</div>
<p class="cta">Scan to request an assessment</p>
<p class="u">${URL_TEXT}</p>
<p class="f">One defined problem. Payment only after the scope is confirmed.</p>
</div></body></html>`;
}

function socialHtml(width, height, { banner = false } = {}) {
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>KEVOS® assessment</title><style>${base}
body { width: ${width}px; height: ${height}px; overflow: hidden; background: ${T.graphite}; color: ${T.light}; ${grid('rgba(255,140,71,.07)')} }
.wrap { position: relative; height: 100%; display: grid; grid-template-columns: ${banner ? '1.15fr .85fr' : '1.05fr .95fr'}; align-items: center; gap: 30px; padding: ${banner ? '56px 72px' : '58px 64px'}; }
.wrap::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: ${T.orange}; }
.e { margin: ${banner ? '26px' : '30px'} 0 0; color: #ff8c47; font-size: 17px; }
h1 { margin: 14px 0 0; font-size: ${banner ? 64 : 58}px; line-height: 1.02; }
h1 em { display: block; font-style: normal; color: #ff8c47; }
.price { display: flex; align-items: center; gap: 18px; margin-top: 30px; }
.price b { font-family: 'KEVOS Display', sans-serif; font-size: ${banner ? 64 : 60}px; line-height: 1; }
.price span { font-size: 22px; font-weight: 650; }
.price small { display: block; margin-top: 4px; color: ${T.lightMuted}; font-size: 17px; font-weight: 450; }
.url { margin-top: 22px; font-size: 21px; color: ${T.lightMuted}; }
.url b { color: ${T.light}; }
.art { padding: 18px; border: 1px solid rgba(241,239,234,.16); border-radius: 22px; background: rgba(19,20,18,.8); }
.art svg { display: block; width: 100%; height: auto; }
</style></head><body><div class="wrap">
<div>
  ${wordmark('dark', banner ? 40 : 38)}
  <p class="e mono">${esc(ASSESSMENT.shortName)}</p>
  <h1 class="display">Engineering problems.<em>Clear next steps.</em></h1>
  <div class="price"><b>${ASSESSMENT.priceLabel}</b><span>${esc(ASSESSMENT.priceCaption)}<small>One defined problem · remote · one-page PDF</small></span></div>
  ${banner ? `<p class="url">Request an assessment at <b>${URL_TEXT}</b></p>` : ''}
</div>
<div class="art">${darkArt}</div>
</div></body></html>`;
}

fs.mkdirSync(OUT, { recursive: true });
const out = (name) => path.join(OUT, name);
renderPdf(brochureHtml(), out('kevos-engineering-problem-assessment-brochure.pdf'));
renderPdf(qrCardHtml(), out('kevos-assessment-qr-card.pdf'));
renderPng(socialHtml(1200, 630), out('kevos-assessment-social.png'), 1200, 630);
renderPng(socialHtml(1600, 600, { banner: true }), out('kevos-assessment-banner.png'), 1600, 600);
console.log(`Marketing assets written to ${path.relative(process.cwd(), OUT)}`);
