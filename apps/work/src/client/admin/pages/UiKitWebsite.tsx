// The website's part of the UI kit (owner's UI brief, deliverable 4; docs/ui/README.md). The website is a separate
// application whose pages refuse to be framed, and its components' styles are scoped to them, so the kit reads a few of
// the website's own pages on this address (bizomat.ai), takes their stylesheets and one real example of each component,
// and shows them in a sandboxed frame without scripts, with the new UI on or off as the preview switch says. On an
// address without the website (a local run of this app alone, work.kevos.com) it says so. Read only: nothing is sent.
import { useEffect, useRef, useState } from 'react';

/** Pages that hold one of each component between them. */
const PAGES = ['/', '/learn/', '/tools/air-pipe-drop/', '/contact/', '/systems/'];

/** [label, selectors tried in order]: the first element found on any page is shown. */
const PARTS: { group: string; items: [string, string[]][] }[] = [
  {
    group: 'Buttons',
    items: [
      ['Accent (the one main action)', ['.button.button--accent']],
      ['Primary', ['.button.button--primary']],
      ['Secondary (outline)', ['.button.button--secondary']],
      ['Text (link style)', ['.button.button--text']],
      ['Small', ['.button.button--small']],
      ['Knowledge Centre, accent', ['.bz-btn.bz-btn--accent']],
      ['Knowledge Centre, secondary small', ['.bz-btn.bz-btn--secondary.bz-btn--sm', '.bz-btn.bz-btn--secondary']],
      ['Tools', ['a.btn', 'button.btn']],
      ['Header, Sign in (a link)', ['.site-header__cta']],
    ],
  },
  {
    group: 'Links and navigation',
    items: [
      ['Text link in running text', ['main p > a:not([class])', 'main li > a:not([class])']],
      ['Navigation link', ['.site-nav__link']],
    ],
  },
  {
    group: 'Cards',
    items: [
      ['Product card (Home)', ['.product-card']],
      ['System card', ['.sys-card']],
      ['Content card', ['.pp-card', '.v-card']],
      ['Card that is a link', ['a.tool-card', 'a.guide-card', 'a.res-card', 'a.sys-card']],
      ['Contact card', ['.reach-card']],
    ],
  },
  {
    group: 'Forms',
    items: [
      ['Text field', ['.field:has(input[type="text"])', '.field:has(input)']],
      ['Email field', ['.field:has(input[type="email"])']],
      ['Select', ['.field:has(select)']],
      ['Text area', ['.field:has(textarea)']],
    ],
  },
];

interface Harvest {
  css: string[];
  groups: { group: string; items: { label: string; html: string; states: boolean }[] }[];
}

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/** An element's markup without scripts, ids or event handlers (the frame runs no script either). */
function clean(el: Element): string {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll('script, iframe').forEach((n) => n.remove());
  for (const n of [copy, ...copy.querySelectorAll('*')]) {
    n.removeAttribute('id');
    for (const a of [...n.attributes]) if (a.name.startsWith('on')) n.removeAttribute(a.name);
  }
  return copy.outerHTML;
}

async function harvest(): Promise<Harvest | null> {
  const docs: Document[] = [];
  for (const p of PAGES) {
    try {
      const r = await fetch(p, { credentials: 'omit', headers: { Accept: 'text/html' } });
      if (!r.ok || !(r.headers.get('content-type') ?? '').includes('text/html')) continue;
      const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
      // Only the website's pages: they carry its header.
      if (doc.querySelector('.site-header')) docs.push(doc);
    } catch {
      // this page is not here
    }
  }
  if (!docs.length) return null;
  const css = [...new Set(docs.flatMap((d) => [...d.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((l) => l.getAttribute('href') ?? '').filter((h) => h.startsWith('/') && !h.startsWith('//'))))];
  const groups = PARTS.map(({ group, items }) => ({
    group,
    items: items.flatMap(([label, selectors]) => {
      for (const sel of selectors) {
        for (const d of docs) {
          const el = d.querySelector(sel);
          // Disabled and loading are states of the button classes; a link styled as a button has neither.
          if (el) return [{ label, html: clean(el), states: el.matches('.button, .bz-btn, .btn') }];
        }
      }
      return [];
    }),
  })).filter((g) => g.items.length);
  return { css, groups };
}

/** The frame's document: the website's stylesheets, then each example, buttons also disabled and loading. */
function frameDoc(h: Harvest, newUi: boolean, theme: string): string {
  const state = (html: string, attr: string) => html.replace(/^<(\w+)/, `<$1 ${attr}`);
  const body = h.groups
    .map(
      (g) =>
        `<section class="k-group"><h2>${escapeHtml(g.group)}</h2>${g.items
          .map(
            (it) =>
              `<div class="k-row"><p class="k-label">${escapeHtml(it.label)}</p><div class="k-items">${it.html}${
                it.states ? state(it.html, 'aria-disabled="true"') + state(it.html, 'aria-busy="true"') : ''
              }</div></div>`,
          )
          .join('')}</section>`,
    )
    .join('');
  return `<!doctype html><html lang="en-AU" data-theme="${theme}"${newUi ? ' data-ui="new"' : ''}><head><meta charset="utf-8"><base target="_blank">${h.css
    .map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`)
    .join('')}<style>body{margin:0;padding:24px}.k-group+.k-group{margin-top:32px}.k-row{display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:center;margin-top:12px}.k-label{margin:0;font-size:13px;opacity:.75}.k-items{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.k-items>li{list-style:none}.k-items>.field,.k-items>article,.k-items>a[class*="card"],.k-items>div[class*="card"]{flex:1 1 320px;max-width:420px}</style></head><body><main>${body}</main></body></html>`;
}

export function WebsiteKit({ newUi }: { newUi: boolean }) {
  const [h, setH] = useState<Harvest | null | 'loading'>('loading');
  const [height, setHeight] = useState(600);
  const frame = useRef<HTMLIFrameElement>(null);
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  useEffect(() => {
    let live = true;
    harvest().then((r) => live && setH(r));
    return () => {
      live = false;
    };
  }, []);
  const measure = () => {
    const doc = frame.current?.contentDocument;
    if (doc?.documentElement) setHeight(Math.max(200, doc.documentElement.scrollHeight));
  };
  if (h === 'loading') return <p className="muted small">Reading the website’s pages…</p>;
  if (!h) return <p className="muted small">The website is not served at this address, so its components cannot be shown here. Open the UI kit on bizomat.ai.</p>;
  return (
    <>
      <p className="muted small">
        The website’s own stylesheets and one real example of each component, from its pages. Hover and the keyboard work; links do not open. Buttons are shown as they are, then disabled and loading.
      </p>
      <iframe
        ref={frame}
        title="Website components"
        style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}
        sandbox="allow-same-origin"
        srcDoc={frameDoc(h, newUi, theme)}
        onLoad={() => {
          measure();
          window.setTimeout(measure, 600);
        }}
        height={height}
      />
    </>
  );
}
