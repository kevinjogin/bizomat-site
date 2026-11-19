// The new UI (owner's UI brief of 19 Nov 2026; docs/ui/README.md): the flag new_ui_enabled and the person's density,
// both from /auth/me, put on the root element as data-ui="new" and data-density. Every new style is scoped to them.
import { useEffect, useRef } from 'react';

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

/** While the company in the address changes, the page is covered until the new company's first render. */
export function useCompanySwitchCover(companyId: string | undefined): void {
  const last = useRef(companyId);
  useEffect(() => {
    if (!companyId || last.current === companyId) return;
    last.current = companyId;
    const root = document.documentElement;
    root.dataset.switching = '1';
    const t = window.setTimeout(() => delete root.dataset.switching, 180);
    return () => {
      window.clearTimeout(t);
      delete root.dataset.switching;
    };
  }, [companyId]);
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
