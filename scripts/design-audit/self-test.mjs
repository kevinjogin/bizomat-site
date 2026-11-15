// The design audit's self-test: a page with one of each flaw the CI check fails on (the homepage's card button that ran
// past its card, a page wider than the screen, text cut off, faint text, two H1s, a control without a focus ring, a
// link to a missing anchor). run.mjs --ci runs it first, so a check that stops finding anything fails CI instead of
// passing quietly.
import { inPageAudit, focusAudit } from './checks.mjs';

const FIXTURE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fixture</title><style>
  body { margin: 0; font: 16px/1.5 sans-serif; background: #fff; color: #111; }
  .card { width: 220px; margin: 20px; padding: 16px; border: 1px solid #ccc; border-radius: 12px; }
  .button { display: inline-flex; align-items: center; min-height: 46px; padding: 0 20px; white-space: nowrap; background: #111; color: #fff; border-radius: 8px; text-decoration: none; }
  .wide { width: 2000px; height: 10px; }
  .clip { width: 80px; overflow: hidden; white-space: nowrap; }
  .faint { color: #bbb; }
  .nofocus:focus { outline: none; }
</style></head><body>
  <h1>One</h1><h1>Two</h1>
  <div class="card"><p>Card</p><a class="button" href="#product">Explore Engineering Automation →</a></div>
  <div class="wide"></div>
  <div class="clip">This text is far too long for its box</div>
  <p class="faint">Faint text</p>
  <a class="nofocus" href="/elsewhere/">No focus ring</a>
</body></html>`;

export const EXPECTED = ['outside-its-box', 'button-wider-than-parent', 'page-horizontal-scroll', 'text-clipped', 'contrast', 'h1-count', 'focus-not-visible', 'link-missing-anchor'];

/** The expected finding types the checks did not report on the fixture (an empty list when they all work). */
export async function selfTest(browser) {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  try {
    await page.setContent(FIXTURE);
    const { findings } = await page.evaluate(inPageAudit, { contrast: true });
    await page.keyboard.press('Tab');
    findings.push(...(await page.evaluate(focusAudit)));
    const found = new Set(findings.map((f) => f.type));
    return EXPECTED.filter((t) => !found.has(t));
  } finally {
    await page.close();
  }
}
