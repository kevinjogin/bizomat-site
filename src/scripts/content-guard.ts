// Casual-copy deterrence for published KEVOS content. This is a courtesy barrier, not a security control:
// anything sent to a browser can be saved, inspected or re-typed. See docs/security/CONTENT-PROTECTION-LIMITATIONS.md.
//
// What it does: suppresses the right-click menu on published content and imagery, stops images and SVG
// figures being dragged out, and ignores the Save Page, View Source and developer-tools shortcuts.
// What it never does: block text selection, copy and paste, printing, keyboard navigation, assistive
// technology, touch scrolling or any form, tool, code sample or link. No alerts, overlays or redirects.
// Opt out for any region with data-allow-copy; switch it off for a whole page with
// <html data-content-guard="off">.

const INTERACTIVE = [
  'a[href]', 'button', 'input', 'textarea', 'select', 'option', 'label', 'summary', 'details',
  '[contenteditable]:not([contenteditable="false"])', '[role="textbox"]', '[role="button"]', '[role="menu"]',
  'pre', 'code', 'kbd', 'samp', 'form', 'dialog', 'output', '[aria-live]', '[data-allow-copy]',
].join(',');

// KEVOS® tools are working instruments: their inputs and results stay fully usable, menus included.
const UNGUARDED_PATHS = ['/tools/'];

const MEDIA = 'img, picture, svg, canvas, video, figure';

function guardOff(): boolean {
  return document.documentElement.dataset.contentGuard === 'off' || UNGUARDED_PATHS.some((p) => location.pathname.startsWith(p));
}

/** True when the event target sits inside something people need to use, not just read. */
function isExempt(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return true;
  return target.closest(INTERACTIVE) !== null;
}

/** Only content regions are guarded: the main article area and imagery anywhere on the page. */
function isGuarded(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(MEDIA) !== null || target.closest('main, article') !== null;
}

document.addEventListener('contextmenu', (event) => {
  if (guardOff() || isExempt(event.target) || !isGuarded(event.target)) return;
  event.preventDefault();
});

document.addEventListener('dragstart', (event) => {
  if (guardOff() || isExempt(event.target)) return;
  if (event.target instanceof Element && event.target.closest(MEDIA)) event.preventDefault();
});

document.addEventListener('keydown', (event) => {
  if (guardOff() || isExempt(event.target)) return;
  const key = event.key.toLowerCase();
  const mod = event.ctrlKey || event.metaKey;
  const saveOrSource = mod && !event.shiftKey && !event.altKey && (key === 's' || key === 'u');
  const devtools = key === 'f12' || (mod && event.shiftKey && (key === 'i' || key === 'j' || key === 'c')) || (event.metaKey && event.altKey && (key === 'i' || key === 'j' || key === 'c'));
  if (saveOrSource || devtools) event.preventDefault();
});
