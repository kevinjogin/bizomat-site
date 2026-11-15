// The design audit's checks, run inside the page (page.evaluate). The function is self-contained: Playwright sends
// its source to the browser, so it may not use anything from this module's scope.
//
// Each finding is { type, severity, sel, text, ...detail }. Severity "error" is a visible flaw (content outside its
// box, text cut off, a page wider than the screen, unreadable text); "warn" is worth a look (a label on three lines,
// an image without a size). The layout check in CI fails on the error types it is given (run.mjs --ci).
export function inPageAudit(opts) {
  const out = [];
  const doc = document.documentElement;
  const vw = doc.clientWidth;
  const TOL = 1;

  // ---------- helpers ----------
  const describe = (el) => {
    if (!el || el.nodeType !== 1) return '';
    const part = (e) => {
      let s = e.tagName.toLowerCase();
      if (e.id) return `${s}#${e.id}`;
      const cls = [...e.classList].filter((c) => !/^astro-|^svelte-/.test(c)).slice(0, 2);
      if (cls.length) s += `.${cls.join('.')}`;
      return s;
    };
    const parts = [];
    let e = el;
    for (let i = 0; e && e.nodeType === 1 && i < 4; i++, e = e.parentElement) {
      parts.unshift(part(e));
      if (e.id) break;
    }
    return parts.join(' > ');
  };
  const label = (el) => (el.innerText || el.textContent || el.getAttribute?.('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 70);
  const add = (type, severity, el, detail = {}) => out.push({ type, severity, sel: describe(el), text: el ? label(el) : '', ...detail });
  const cs = (el) => getComputedStyle(el);
  const rect = (el) => el.getBoundingClientRect();
  const visible = (el) => {
    if (!el.isConnected) return false;
    const s = cs(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse') return false;
    const r = rect(el);
    return r.width > 0 && r.height > 0;
  };
  const hiddenByAncestor = (el) => {
    for (let e = el; e && e !== doc; e = e.parentElement) {
      const s = cs(e);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return true;
      if (e.tagName === 'DETAILS' && !e.open && e !== el) {
        // only the summary of a closed <details> is shown
        if (!(el.closest('summary') && el.closest('summary').parentElement === e)) return true;
      }
      if (e.classList?.contains('visually-hidden') || e.classList?.contains('sr-only')) return true;
      if (s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(50%)') return true;
    }
    return false;
  };
  const inSvg = (el) => !!el.closest('svg') && el.tagName.toLowerCase() !== 'svg';
  const positioned = (s) => s.position === 'absolute' || s.position === 'fixed';
  const clips = (s) => s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.contain.includes('paint');
  const scrolls = (s) => /auto|scroll/.test(s.overflowX) || /auto|scroll/.test(s.overflowY);
  const parseColor = (str) => {
    const m = /rgba?\(([^)]+)\)/.exec(str || '');
    if (!m) {
      const c = /color\(srgb ([^)]+)\)/.exec(str || '');
      if (!c) return null;
      const [rgb, a] = c[1].split('/');
      const [r, g, b] = rgb.trim().split(/\s+/).map((v) => Number(v) * 255);
      return { r, g, b, a: a === undefined ? 1 : Number(a) };
    }
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const blend = (top, bottom) => {
    const a = top.a + bottom.a * (1 - top.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / a,
      g: (top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / a,
      b: (top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / a,
      a,
    };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // The colour behind an element: its own and its ancestors' backgrounds, composited. `image` is true when one of
  // them has a background image (a gradient or picture), where the result is only an estimate.
  const backdrop = (el) => {
    const layers = [];
    let image = false;
    for (let e = el; e; e = e.parentElement) {
      const s = cs(e);
      const c = parseColor(s.backgroundColor);
      if (s.backgroundImage && s.backgroundImage !== 'none') image = true;
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let colour = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) colour = blend(layers[i], colour);
    return { colour, image };
  };
  // the number of lines an element's text takes: line boxes whose tops are more than half a line apart
  const lineCount = (el, lh) => {
    const tops = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.nodeValue.trim() || hiddenByAncestor(n.parentElement)) continue; // a visually hidden part of the label
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const x of rg.getClientRects()) if (x.width > 1 && x.height > 1) tops.push(x.top);
    }
    tops.sort((a, b) => a - b);
    let n = 0, last = -Infinity;
    for (const t of tops) if (t > last + lh * 0.5) { n++; last = t; }
    return n;
  };
  // text that is part of a labelled illustration (src/components/visuals, MotionVisual), not its caption: WCAG exempts
  // text that is part of a picture, so it is reported as a warning
  const illustration = (el) => {
    const f = el.closest('figure');
    if (!f || el.closest('figcaption')) return false;
    return f.matches('.mv, .viz, [class*="visual"]') || /\bIllustration\b/.test(f.querySelector('figcaption')?.textContent || '');
  };
  const effectiveOpacity = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(cs(e).opacity); return o; };

  const all = [...document.body.querySelectorAll('*')].filter((el) => !['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META'].includes(el.tagName));
  const shown = all.filter((el) => !inSvg(el) && visible(el) && !hiddenByAncestor(el));

  // ---------- 1. the page wider than the screen ----------
  if (doc.scrollWidth > vw + TOL) {
    const culprits = shown.filter((el) => {
      const r = rect(el);
      if (r.right <= vw + TOL && r.left >= -TOL) return false;
      // inside a scroll or clip box: the box is what shows, not the page
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) if (clips(cs(e))) return false;
      const p = el.parentElement;
      return !(p && p !== document.body && (rect(p).right > vw + TOL || rect(p).left < -TOL));
    });
    add('page-horizontal-scroll', 'error', culprits[0] || doc, { width: doc.scrollWidth, viewport: vw, culprits: culprits.slice(0, 5).map(describe) });
  }
  for (const el of [doc, document.body]) {
    const s = cs(el);
    if (s.overflowX === 'hidden' || s.overflowX === 'clip') {
      // overflow hidden on the page hides a horizontal scroll bar but still cuts content off
      const cut = shown.filter((e) => { const r = rect(e); return r.right > vw + 2 && !positioned(cs(e)) && ![...ancestors(e)].some((a) => clips(cs(a))); });
      if (cut.length) add('page-content-cut', 'error', cut[0], { count: cut.length });
    }
  }
  function* ancestors(el) { for (let e = el.parentElement; e && e !== document.body && e !== doc; e = e.parentElement) yield e; }

  // ---------- 2. children outside their card or box ----------
  // A box is an element that draws an edge: a border, a background of its own or a shadow (cards, panels, chips,
  // buttons, table wrappers). Content that crosses that edge is the flaw the owner saw (a button past its card).
  const boxCache = new Map();
  const isBox = (el) => {
    if (boxCache.has(el)) return boxCache.get(el);
    let box = false;
    if (el !== document.body && el !== doc && !['MAIN', 'HEADER', 'FOOTER', 'SECTION', 'NAV'].includes(el.tagName)) {
      const s = cs(el);
      const border = ['Left', 'Right', 'Top', 'Bottom'].some((side) => parseFloat(s[`border${side}Width`]) > 0 && s[`border${side}Style`] !== 'none' && (parseColor(s[`border${side}Color`])?.a ?? 0) > 0);
      const bg = (parseColor(s.backgroundColor)?.a ?? 0) > 0.05 || (s.backgroundImage !== 'none' && !s.backgroundImage.startsWith('url('));
      const shadow = s.boxShadow !== 'none';
      const r = rect(el);
      // a full-width band is a section, not a card
      box = (border || bg || shadow) && r.width < vw - 2;
    }
    boxCache.set(el, box);
    return box;
  };
  const reported = new Set();
  for (const el of shown) {
    if (['HTML', 'BODY'].includes(el.tagName)) continue;
    const s = cs(el);
    if (positioned(s)) continue;
    // the nearest box ancestor, stopping at anything that takes the element out of flow or clips it
    let box = null;
    let skip = false;
    for (const a of ancestors(el)) {
      const as = cs(a);
      if (isBox(a)) { box = a; if (clips(as)) skip = true; break; }
      if (positioned(as) || clips(as) || as.position === 'sticky') { skip = true; break; }
    }
    if (!box || skip || reported.has(box)) continue;
    const r = rect(el), b = rect(box);
    const over = Math.max(r.right - b.right, b.left - r.left, r.bottom - b.bottom, b.top - r.top);
    if (over > TOL + 0.5) {
      // report the outermost child that crosses the edge
      const p = el.parentElement;
      if (p !== box) { const pr = rect(p); if (Math.max(pr.right - b.right, b.left - pr.left, pr.bottom - b.bottom, b.top - pr.top) > TOL + 0.5) continue; }
      reported.add(box);
      add('outside-its-box', 'error', el, { box: describe(box), by: Math.round(over), boxText: label(box).slice(0, 40) });
    }
  }

  // ---------- 3. text cut off by overflow hidden ----------
  const textNodes = [];
  {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'OPTION', 'TEXTAREA', 'TITLE'].includes(p.tagName)) continue;
      if (!visible(p) || hiddenByAncestor(p)) continue;
      textNodes.push(n);
    }
  }
  // the part of a rectangle left visible by the element's clipping ancestors (overflow hidden, line clamps), or null
  const visiblePart = (x, el) => {
    let l = x.left, t = x.top, r = x.right, b = x.bottom;
    for (let a = el; a && a !== doc; a = a.parentElement) {
      if (!clips(cs(a))) continue;
      const c = rect(a);
      l = Math.max(l, c.left); t = Math.max(t, c.top); r = Math.min(r, c.right); b = Math.min(b, c.bottom);
      if (r - l < 1 || b - t < 1) return null;
    }
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  };
  const rangeRects = (n) => { const r = document.createRange(); r.selectNodeContents(n); return [...r.getClientRects()].filter((x) => x.width > 0.5 && x.height > 0.5); };
  const clipReported = new Set();
  for (const n of textNodes) {
    const p = n.parentElement;
    if (inSvg(p)) continue;
    for (const a of [p, ...ancestors(p)]) {
      const s = cs(a);
      if (!clips(s)) continue;
      if (clipReported.has(a)) break;
      const b = rect(a);
      if (b.width <= 2 || b.height <= 2) break; // a visually hidden label
      const intentional = !!p.closest('[aria-hidden="true"]') || s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none' && s.webkitLineClamp !== '' || cs(p).textOverflow === 'ellipsis' || (cs(p).webkitLineClamp || 'none') !== 'none';
      const scroller = scrolls(s);
      const bl = b.left + parseFloat(s.borderLeftWidth), br = b.right - parseFloat(s.borderRightWidth);
      const bt = b.top + parseFloat(s.borderTopWidth), bb = b.bottom - parseFloat(s.borderBottomWidth);
      const cut = rangeRects(n).some((x) => x.right > br + 1 || x.left < bl - 1 || x.bottom > bb + 1.5 || x.top < bt - 1.5);
      if (cut && !scroller) {
        clipReported.add(a);
        add(intentional ? 'text-truncated' : 'text-clipped', intentional ? 'warn' : 'error', a, { node: n.nodeValue.trim().slice(0, 60) });
      }
      break;
    }
  }
  // text that runs out of its own box (overflow visible): a long word or a no-wrap label wider than its element
  for (const el of shown) {
    const s = cs(el);
    if (clips(s) || s.display.startsWith('inline') && s.display !== 'inline-block' && s.display !== 'inline-flex' && s.display !== 'inline-grid') continue;
    if (!['visible'].includes(s.overflowX)) continue;
    const own = [...el.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim());
    if (!own) continue;
    const r = rect(el);
    const textRight = Math.max(...[...el.childNodes].filter((c) => c.nodeType === 3 && c.nodeValue.trim()).flatMap((c) => rangeRects(c).map((x) => x.right)));
    const contentRight = r.right - parseFloat(s.borderRightWidth) - Math.max(0, parseFloat(s.paddingRight) - 0.5);
    if (Number.isFinite(textRight) && textRight > r.right + 1) {
      add('text-outside-its-element', 'error', el, { by: Math.round(textRight - r.right) });
    } else if (Number.isFinite(textRight) && textRight > contentRight + 2 && (parseFloat(s.paddingRight) > 4)) {
      add('text-in-padding', 'warn', el, { by: Math.round(textRight - contentRight) });
    }
  }

  // ---------- 4. overlapping text ----------
  {
    const lines = [];
    textNodes.forEach((n, i) => {
      const p = n.parentElement;
      if (positioned(cs(p)) && p.getAttribute('aria-hidden') === 'true') return;
      for (const raw of rangeRects(n)) {
        const x = visiblePart(raw, p);
        // a line mostly hidden by a clamp or a thumbnail's crop is not drawn over anything
        if (x && x.height > raw.height * 0.5) lines.push({ i, x, el: p, svg: inSvg(p) });
      }
    });
    lines.sort((a, b) => a.x.top - b.x.top);
    const seen = new Set();
    for (let a = 0; a < lines.length; a++) {
      const A = lines[a];
      for (let b = a + 1; b < lines.length && lines[b].x.top < A.x.bottom; b++) {
        const B = lines[b];
        if (A.i === B.i) continue;
        const w = Math.min(A.x.right, B.x.right) - Math.max(A.x.left, B.x.left);
        const h = Math.min(A.x.bottom, B.x.bottom) - Math.max(A.x.top, B.x.top);
        const minH = Math.min(A.x.height, B.x.height);
        // line boxes of inline text touch and a little overlap is normal leading; a real overlap covers glyphs
        if (w > 3 && h > minH * 0.45) {
          if (A.el.contains(B.el) || B.el.contains(A.el)) {
            // text in an inline child sits on its parent's line: only an overlap in the middle of the line counts
            if (Math.abs(A.x.top - B.x.top) < 2 || Math.abs(A.x.bottom - B.x.bottom) < 2) continue;
          }
          const key = `${describe(A.el)}|${describe(B.el)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ type: A.svg || B.svg ? 'svg-text-overlap' : 'text-overlap', severity: A.svg || B.svg ? 'warn' : 'error', sel: describe(A.el), text: A.el.textContent.trim().slice(0, 40), other: describe(B.el), otherText: B.el.textContent.trim().slice(0, 40) });
        }
      }
    }
  }
  // grid and flex items on top of each other
  for (const el of shown) {
    const s = cs(el);
    if (!/flex|grid/.test(s.display)) continue;
    const kids = [...el.children].filter((k) => visible(k) && !positioned(cs(k)) && !hiddenByAncestor(k));
    if (kids.length < 2 || kids.length > 60) continue;
    for (let a = 0; a < kids.length; a++) for (let b = a + 1; b < kids.length; b++) {
      const A = rect(kids[a]), B = rect(kids[b]);
      const w = Math.min(A.right, B.right) - Math.max(A.left, B.left);
      const h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
      if (w > 2 && h > 2) add('items-overlap', 'error', kids[a], { other: describe(kids[b]), w: Math.round(w), h: Math.round(h) });
    }
  }

  // ---------- 5. buttons ----------
  const buttons = shown.filter((el) => el.matches('.button, .bz-btn, button, [role="button"], input[type="submit"], input[type="button"], .site-header__cta, .site-nav__cta, .cta-button, [class*="__cta"], [class*="-btn"], [class*="__button"]'));
  for (const el of buttons) {
    const s = cs(el);
    const r = rect(el);
    if (el.scrollWidth > el.clientWidth + 1 && !clips(s)) add('button-label-overflows', 'error', el, { scroll: el.scrollWidth, client: el.clientWidth });
    const p = el.parentElement;
    if (p) {
      const ps = cs(p), pr = rect(p);
      const inner = pr.width - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight) - parseFloat(ps.borderLeftWidth) - parseFloat(ps.borderRightWidth);
      if (r.width > inner + 1.5 && !/auto|scroll/.test(ps.overflowX)) add('button-wider-than-parent', 'error', el, { width: Math.round(r.width), parent: Math.round(inner) });
    }
    const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
    const textH = lineCount(el, lh);
    // a button (the site's .button) on three lines is a flaw; a tile or chip that wraps (a tab with an icon) is a warning
    if (textH >= 3) add(el.matches('.button, .bz-btn') ? 'button-label-3-lines' : 'control-label-3-lines', el.matches('.button, .bz-btn') ? 'error' : 'warn', el, { lines: textH });
    else if (textH === 2) add('button-label-wraps', 'warn', el, { lines: textH });
  }

  // ---------- 6. images ----------
  for (const img of document.images) {
    if (!visible(img) || hiddenByAncestor(img)) continue;
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) add('img-no-size', 'warn', img, { src: img.currentSrc?.split('/').slice(-2).join('/') });
    if (img.complete && img.naturalWidth && img.naturalHeight) {
      const s = cs(img);
      if (s.objectFit === 'fill' || s.objectFit === '') {
        const r = rect(img);
        const w = r.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) - parseFloat(s.borderLeftWidth) - parseFloat(s.borderRightWidth);
        const h = r.height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) - parseFloat(s.borderTopWidth) - parseFloat(s.borderBottomWidth);
        const a = img.naturalWidth / img.naturalHeight, b = w / h;
        if (Math.abs(a - b) / a > 0.03) add('img-stretched', 'error', img, { natural: `${img.naturalWidth}x${img.naturalHeight}`, shown: `${Math.round(w)}x${Math.round(h)}` });
      }
    }
  }

  // ---------- 7. contrast ----------
  if (opts.contrast) {
    const checked = new Set();
    for (const n of textNodes) {
      const el = n.parentElement;
      if (checked.has(el)) continue;
      checked.add(el);
      if (el.closest('[disabled], [aria-disabled="true"]')) continue;
      // SVG text sits on the drawing's own shapes, which this check cannot see: illustrations are reviewed by eye
      if (inSvg(el)) continue;
      const svg = illustration(el);
      const s = cs(el);
      let fg = parseColor(s.color);
      if (!fg) continue;
      const { colour: bg, image } = backdrop(el);
      fg = { ...fg, a: fg.a * effectiveOpacity(el) };
      const shownFg = blend(fg, bg);
      const c = ratio(shownFg, bg);
      const px = parseFloat(s.fontSize);
      const bold = Number(s.fontWeight) >= 700;
      const large = px >= 24 || (bold && px >= 18.66);
      const need = large ? 3 : 4.5;
      if (c + 0.005 < need) {
        out.push({ type: svg ? 'contrast-illustration' : 'contrast', severity: svg || image ? 'warn' : 'error', sel: describe(el), text: n.nodeValue.trim().slice(0, 50), ratio: Math.round(c * 100) / 100, need, fg: s.color, bg: `rgb(${Math.round(bg.r)} ${Math.round(bg.g)} ${Math.round(bg.b)})`, size: px, estimate: image || undefined });
      }
    }
  }

  // ---------- 9. one H1 ----------
  const h1s = [...document.querySelectorAll('h1')].filter((h) => visible(h) && !hiddenByAncestor(h));
  if (h1s.length !== 1) out.push({ type: 'h1-count', severity: 'error', sel: '', text: h1s.map(label).join(' | '), count: h1s.length });

  // headings in cards on three or more lines (the CRM card's heading on the homepage)
  for (const h of shown.filter((e) => /^H[2-4]$/.test(e.tagName))) {
    const s = cs(h);
    const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.15;
    const lines = Math.round((rect(h).height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom)) / lh);
    const card = [...ancestors(h)].find(isBox);
    if (card && lines >= 3) add('card-heading-3-lines', 'warn', h, { lines, card: describe(card) });
  }

  // ---------- links (collected here, checked by run.mjs) ----------
  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
  const badHash = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)).filter((h) => h && !ids.includes(decodeURIComponent(h)));
  for (const h of [...new Set(badHash)]) out.push({ type: 'link-missing-anchor', severity: 'error', sel: '', text: `#${h}` });

  return { findings: out, links, ids };
}

// Focus indicators: every focusable control is focused in turn (after a Tab press, so the browser is in keyboard
// mode and :focus-visible applies) and its look compared with its look unfocused. No change at all is a missing focus
// indicator; an outline with less than 3:1 against the colour behind it is too faint.
export function focusAudit() {
  const out = [];
  const sel = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  const list = [...document.querySelectorAll(sel)].filter((el) => {
    if (el.tagName === 'IFRAME') return false; // a third-party frame (the captcha) draws its own focus
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      if (e.tagName === 'DETAILS' && !e.open && !(el.closest('summary')?.parentElement === e)) return false;
    }
    return true;
  });
  // what a person sees change: an outline only counts when one is drawn (the browser's own :focus-visible moves the
  // offset of an outline that a page has turned off), then shadows, colours, underline and position
  const snap = (el) => {
    const s = getComputedStyle(el);
    const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 ? `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor} ${s.outlineOffset}` : 'none';
    return [outline, s.top, s.left, s.transform, s.boxShadow, s.backgroundColor, s.borderTopColor, s.borderBottomColor, s.textDecorationLine, s.color].join('|');
  };
  const describe = (el) => {
    const parts = [];
    for (let e = el, i = 0; e && e.nodeType === 1 && i < 3; i++, e = e.parentElement) {
      let s = e.tagName.toLowerCase();
      if (e.id) { parts.unshift(`${s}#${e.id}`); break; }
      const cls = [...e.classList].slice(0, 2);
      if (cls.length) s += `.${cls.join('.')}`;
      parts.unshift(s);
    }
    return parts.join(' > ');
  };
  const parse = (str) => { const m = /rgba?\(([^)]+)\)/.exec(str || ''); if (!m) return null; const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a >= 0.9) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const seen = new Set();
  document.activeElement?.blur?.();
  for (const el of list.slice(0, 600)) {
    const key = describe(el);
    if (seen.has(key)) continue;
    seen.add(key);
    // the ring may be drawn on the element or on a wrapper (a card around a stretched link, a field around an input)
    const around = [el.parentElement, el.parentElement?.parentElement, el.parentElement?.parentElement?.parentElement].filter(Boolean);
    const before = snap(el), beforeP = around.map(snap).join('#');
    el.focus({ preventScroll: true, focusVisible: true });
    if (document.activeElement !== el) continue;
    const s = getComputedStyle(el);
    const after = snap(el), afterP = around.map(snap).join('#');
    if (before === after && beforeP === afterP) {
      out.push({ type: 'focus-not-visible', severity: 'error', sel: key, text: (el.innerText || el.getAttribute('aria-label') || el.value || '').trim().slice(0, 50) });
    } else if (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) {
      const oc = parse(s.outlineColor);
      // the outline sits outside the element (outline-offset), so it is seen against the parent's background
      const bg = bgOf(el.parentElement || el);
      if (oc && oc.a > 0.5) {
        const r = (Math.max(lum(oc), lum(bg)) + 0.05) / (Math.min(lum(oc), lum(bg)) + 0.05);
        if (r < 3) out.push({ type: 'focus-low-contrast', severity: 'error', sel: key, text: (el.innerText || '').trim().slice(0, 50), ratio: Math.round(r * 100) / 100, outline: s.outlineColor });
      }
    }
    el.blur();
  }
  return out;
}
