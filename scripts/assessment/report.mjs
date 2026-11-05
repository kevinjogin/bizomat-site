// BIZOMAT-branded one-page A4 PDF for an Engineering Problem Assessment.
//
//   node scripts/assessment/report.mjs                       → public/assessment/kevos-sample-assessment-report.pdf (fictional sample)
//   node scripts/assessment/report.mjs report.json out.pdf   → a real report from your own data file
//
// Keep real report data and PDFs OUTSIDE this repository (or in the git-ignored assessment-private/ folder):
// they contain customer information. Final technical findings must be prepared or reviewed by the
// responsible BIZOMAT professional before a report is sent. Data file fields (all strings unless noted):
//   reference, customer, date, problem, supplied[], observations[], factors[], options[{ title, text }],
//   nextStep, verification[], assumptions[], followOn, preparedBy, reviewedBy, reviewedOn, sample (boolean)
import fs from 'node:fs';
import path from 'node:path';
import { FONT_CSS, OUT, TOKENS as T, esc, renderPdf, wordmark } from './lib.mjs';
import { ASSESSMENT, SAMPLE_REPORT } from '../../src/config/assessment.ts';

const list = (items = []) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

export function reportHtml(r) {
  const sample = Boolean(r.sample);
  const options = (r.options ?? []).slice(0, 3);
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${esc(`${ASSESSMENT.shortName} ${r.reference}`)}</title><style>
${FONT_CSS}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { width: 210mm; height: 297mm; font-family: 'Inter Tight', 'Segoe UI', Arial, sans-serif; font-size: 9.5pt; line-height: 1.45; color: ${T.ink}; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; height: 297mm; padding: 12mm 13mm 11mm; display: flex; flex-direction: column; overflow: hidden; }
.bar { position: absolute; inset: 0 0 auto 0; height: 4mm; background: ${T.orange}; }
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 8mm; padding-bottom: 4mm; border-bottom: 1.2pt solid ${T.ink}; }
.title { margin: 2.5mm 0 0; font-family: 'BIZOMAT Display', sans-serif; font-weight: 700; font-size: 17pt; letter-spacing: .02em; text-transform: uppercase; line-height: 1.05; }
.sub { margin: 1mm 0 0; color: ${T.muted}; font-size: 8.2pt; }
.meta { display: grid; grid-template-columns: auto auto; gap: .6mm 4mm; font-size: 8pt; text-align: left; }
.meta dt { color: ${T.muted}; text-transform: uppercase; letter-spacing: .08em; font-size: 6.6pt; padding-top: .6mm; }
.meta dd { margin: 0; font-weight: 650; }
.sample { margin-top: 3mm; padding: 2mm 3mm; background: rgba(255,106,19,.1); border-left: 1.2mm solid ${T.accent}; font-size: 8pt; color: ${T.ink}; }
.sample strong { color: ${T.accent}; letter-spacing: .06em; }
.watermark { position: absolute; top: 120mm; left: -20mm; right: -20mm; transform: rotate(-28deg); text-align: center; font-family: 'BIZOMAT Display', sans-serif; font-weight: 800; font-size: 64pt; letter-spacing: .12em; color: rgba(194,65,12,.07); pointer-events: none; }
.body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0 7mm; margin-top: 5mm; }
section { margin-bottom: 3.8mm; break-inside: avoid; }
h2 { margin: 0 0 1.3mm; font-family: 'Inter Tight', sans-serif; font-size: 7pt; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; color: ${T.accent}; }
h2 span { color: ${T.muted}; margin-right: 1.5mm; }
p { margin: 0; }
ul { margin: 0; padding-left: 4mm; }
li { margin-bottom: .7mm; }
.opts { display: grid; gap: 1.6mm; }
.opt { display: grid; grid-template-columns: 6mm 1fr; gap: 2mm; padding: 2mm 2.4mm; border: .8pt solid ${T.line}; border-radius: 1.2mm; }
.opt b { display: grid; place-items: center; width: 6mm; height: 6mm; border-radius: 50%; background: ${T.ink}; color: #fff; font-size: 7.5pt; }
.opt strong { display: block; font-size: 8.6pt; }
.next { padding: 3mm 3.4mm; background: rgba(255,106,19,.1); border-left: 1.2mm solid ${T.orange}; }
.next p { font-weight: 600; font-size: 9.2pt; }
.review { display: grid; grid-template-columns: 1.4fr 1fr 0.7fr; gap: 6mm; margin: 2mm 0 4mm; padding: 3.2mm 3.4mm; border: .8pt solid ${T.line}; border-radius: 1.2mm; font-size: 7.6pt; color: ${T.muted}; }
.review strong { display: block; margin-bottom: 4.5mm; color: ${T.ink}; font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; }
.review span { display: block; padding-top: 1.2mm; border-top: .8pt solid ${T.ink}; }
.foot { display: flex; justify-content: space-between; gap: 6mm; padding-top: 3mm; border-top: .8pt solid ${T.line}; font-size: 7pt; color: ${T.muted}; }
.foot b { color: ${T.ink}; letter-spacing: .06em; }
</style></head><body><div class="page">
<div class="bar"></div>
${sample ? '<div class="watermark">SAMPLE</div>' : ''}
<header class="head">
  <div>${wordmark('light', 22)}<p class="title">Engineering Problem<br>Assessment</p><p class="sub">${esc(ASSESSMENT.priceCaption)} · one defined problem</p></div>
  <dl class="meta"><dt>Reference</dt><dd>${esc(r.reference)}</dd><dt>Customer</dt><dd>${esc(r.customer)}</dd><dt>Date</dt><dd>${esc(r.date)}</dd>${r.preparedBy ? `<dt>Prepared by</dt><dd>${esc(r.preparedBy)}</dd>` : ''}</dl>
</header>
${sample ? '<div class="sample"><strong>SAMPLE REPORT</strong> · A fictional example that shows the format only. It is not client work and contains no real engineering evidence.</div>' : ''}
<main class="body">
  <div>
    <section><h2><span>01</span>Problem description</h2><p>${esc(r.problem)}</p></section>
    <section><h2><span>02</span>Information supplied</h2>${list(r.supplied)}</section>
    <section><h2><span>03</span>Preliminary observations</h2>${list(r.observations)}</section>
    <section><h2><span>04</span>Possible contributing factors</h2>${list(r.factors)}</section>
    <section><h2><span>08</span>Assumptions and limitations</h2>${list(r.assumptions)}</section>
  </div>
  <div>
    <section><h2><span>05</span>Improvement options</h2><div class="opts">${options.map((o, i) => `<div class="opt"><b>${'ABC'[i]}</b><div><strong>${esc(o.title)}</strong>${esc(o.text)}</div></div>`).join('')}</div></section>
    <section class="next"><h2><span>06</span>Recommended next step</h2><p>${esc(r.nextStep)}</p></section>
    <section><h2><span>07</span>Additional verification needed</h2>${list(r.verification)}</section>
    <section><h2><span>09</span>Possible follow-on work</h2><p>${esc(r.followOn)}</p></section>
  </div>
</main>
<div class="review">
  <div><strong>Professional review</strong><span>${r.reviewedBy ? esc(r.reviewedBy) : sample ? 'Not applicable: sample only' : 'Name of responsible BIZOMAT professional'}</span></div>
  <div><strong>Signature</strong><span>${sample ? '—' : '&nbsp;'}</span></div>
  <div><strong>Date</strong><span>${r.reviewedOn ? esc(r.reviewedOn) : sample ? '—' : '&nbsp;'}</span></div>
</div>
<footer class="foot"><span><b>BIZOMAT | kevos.com</b></span><span>Preliminary desktop assessment based on the information supplied. Not certification or design sign-off.</span></footer>
</div></body></html>`;
}

const [, , input, output] = process.argv;
const isMain = import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/').replace(/^\//, '')}`;
if (isMain) {
  const data = input ? JSON.parse(fs.readFileSync(input, 'utf8')) : { ...SAMPLE_REPORT, preparedBy: 'BIZOMAT (sample)', sample: true };
  const out = output ?? path.join(OUT, 'kevos-sample-assessment-report.pdf');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  renderPdf(reportHtml(data), out);
  console.log(`Report written: ${path.relative(process.cwd(), out)}`);
}
