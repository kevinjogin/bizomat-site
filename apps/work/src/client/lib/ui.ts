// The new UI (owner's UI brief of 19 Nov 2026; docs/ui/README.md): the flag new_ui_enabled and the person's density,
// both from /auth/me, put on the root element as data-ui="new" and data-density. Every new style is scoped to them.
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { useQueryClient, type Query } from '@tanstack/react-query';

export type Density = 'comfortable' | 'compact';
export interface UiSettings {
  newUi: boolean;
  density: Density;
}

const PREVIEW_KEY = 'bizomat-ui-preview';

/** Applies the settings to <html>. A platform admin's preview on the UI kit page (this computer only) also counts. */
export function applyUi(ui: UiSettings | null | undefined): void {
  const root = document.documentElement;
  let preview = false;
  try {
    preview = sessionStorage.getItem(PREVIEW_KEY) === '1';
  } catch {
    preview = false;
  }
  if (ui?.newUi || preview) root.dataset.ui = 'new';
  else delete root.dataset.ui;
  if (ui?.density === 'compact') root.dataset.density = 'compact';
  else delete root.dataset.density;
}

/** The UI kit's preview switch: the new UI on this browser tab only, whatever the flag says. */
export function setUiPreview(on: boolean, ui: UiSettings | null | undefined): void {
  try {
    if (on) sessionStorage.setItem(PREVIEW_KEY, '1');
    else sessionStorage.removeItem(PREVIEW_KEY);
  } catch {
    // private browsing: the preview lasts until the page changes
  }
  applyUi(ui);
  if (on) document.documentElement.dataset.ui = 'new';
}

export function uiPreviewOn(): boolean {
  try {
    return sessionStorage.getItem(PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * While the company in the address changes, the page is covered by a skeleton (owner's UI brief: the old company's data
 * is never visible during a switch) until the new company's own data has loaded: no query whose key names the new
 * company is still fetching, for at least 120 ms and at most 2 s. It reads the query cache directly, so no screen is
 * rendered again for it. Only under the new UI.
 */
export function useCompanySwitchCover(companyId: string | undefined): void {
  const qc = useQueryClient();
  const last = useRef(companyId);
  // A layout effect: the cover is up in the same render as the new company's page, before the browser paints it.
  useLayoutEffect(() => {
    if (!companyId || last.current === companyId) return;
    last.current = companyId;
    const root = document.documentElement;
    if (root.dataset.ui !== 'new') return;
    root.dataset.switching = '1';
    const started = performance.now();
    const mine = (q: Query) => JSON.stringify(q.queryKey).includes(companyId);
    let done = false;
    let settle = 0;
    const end = () => {
      if (done) return;
      done = true;
      unsubscribe();
      window.clearTimeout(settle);
      window.clearTimeout(max);
      delete root.dataset.switching;
    };
    // Once nothing of the new company is loading, wait a moment for queries that start after it, then uncover.
    const check = () => {
      window.clearTimeout(settle);
      if (done || qc.isFetching({ predicate: mine }) > 0) return;
      settle = window.setTimeout(() => {
        if (qc.isFetching({ predicate: mine }) === 0) end();
      }, Math.max(120 - (performance.now() - started), 60));
    };
    const unsubscribe = qc.getQueryCache().subscribe(check);
    const max = window.setTimeout(end, 2000);
    check();
    return end;
  }, [companyId, qc]);
}

/**
 * Route changes: a short fade of the page (only under the new UI; the class does nothing otherwise), and the cover
 * while the company in the address changes. No wrapper element is added, so layouts are unchanged.
 */
export function useUiRouteEffects(pathname: string): void {
  const company = /\/c\/([^/]+)/.exec(pathname)?.[1];
  useCompanySwitchCover(company);
  useEffect(() => {
    if (document.documentElement.dataset.ui !== 'new') return;
    const el = document.getElementById('main')?.lastElementChild as HTMLElement | null | undefined;
    if (!el) return;
    el.classList.remove('ui-route-in');
    void el.offsetWidth; // restart the animation
    el.classList.add('ui-route-in');
  }, [pathname]);
}

/** True while the new UI is on and the person has not asked for reduced motion. */
function motionOn(): boolean {
  if (document.documentElement.dataset.ui !== 'new') return false;
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The closing animation of a modal or a drawer (owner's UI brief: they close in 200 ms). React removes an overlay at
 * once, whoever closes it (its own close button, Escape, or a Save in the screen that opened it), so when it goes, an
 * inert copy of it, hidden from assistive technology and taking no input, plays the closing animation and is removed.
 * Only under the new UI and without reduced motion. An overlay with a frame, video, audio or canvas is not copied: a copy
 * would load or draw it again. Visual only: the overlay itself, focus and the screen behind it behave as before.
 */
export function useExitAnimation(refs: RefObject<HTMLElement | null>[]): void {
  useLayoutEffect(() => {
    const els = refs.map((r) => r.current).filter((e): e is HTMLElement => !!e);
    const opened = performance.now();
    return () => {
      // React's development mode mounts twice at once; a real overlay is open for longer than that.
      if (performance.now() - opened < 50 || !motionOn()) return;
      for (const el of els) {
        if (el.querySelector('iframe, video, audio, object, embed, canvas')) return;
      }
      for (const el of els) {
        const ghost = el.cloneNode(true) as HTMLElement;
        const from = [el, ...el.querySelectorAll<HTMLElement>('*')];
        const to = [ghost, ...ghost.querySelectorAll<HTMLElement>('*')];
        to.forEach((n, i) => {
          const src = from[i];
          if ((n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement || n instanceof HTMLSelectElement) && src && 'value' in src) n.value = (src as HTMLInputElement).value;
          n.removeAttribute('id');
          if (/^(alert)?dialog$/.test(n.getAttribute('role') ?? '')) n.removeAttribute('role');
          n.removeAttribute('aria-modal');
        });
        ghost.setAttribute('aria-hidden', 'true');
        ghost.setAttribute('inert', '');
        ghost.classList.add('ui-exit');
        document.body.appendChild(ghost);
        from.forEach((n, i) => {
          if (n.scrollTop || n.scrollLeft) {
            to[i].scrollTop = n.scrollTop;
            to[i].scrollLeft = n.scrollLeft;
          }
        });
        window.setTimeout(() => ghost.remove(), 220);
      }
    };
    // The overlay's elements are fixed for its lifetime: the effect runs once, at mount and unmount.
  }, []);
}
