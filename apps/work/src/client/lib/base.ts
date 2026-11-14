// The path the app is served under: "" at the root of its host (work.kevos.com), "/tasks" under bizomat.ai. The
// Worker puts <base href> first in every page (src/worker/mount.ts); the Vite dev server has none (the root).
// Every address the client builds outside the router starts here; the router itself uses it as its basename.
const declared = typeof document === 'undefined' ? null : document.querySelector('base')?.getAttribute('href');
export const BASE = declared ? new URL(declared, location.origin).pathname.replace(/\/$/, '') : '';

/** A root path of the app ("/api/files/x", "/login") under BASE. */
export const appUrl = (path: string): string => BASE + path;

/** The current page's path inside the app, without BASE: what the router calls the pathname. */
export const appPath = (): string => (BASE && location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : location.pathname) || '/';

/**
 * BIZOMAT ERP, the one workspace: every tool opens inside it, at /erp/<tool> (src/worker/mount.ts). The workspace's
 * earlier address /system answers 302 there, so a page only runs under /system in a tab opened before. '' elsewhere.
 */
export const SUITE = BASE === '/erp' || BASE.startsWith('/erp/') ? '/erp' : BASE === '/system' || BASE.startsWith('/system/') ? '/system' : '';

/** The tool this page is: '/crm' at /crm and at /erp/crm; '/erp' for the ERP's own pages. */
export const APP_BASE = SUITE && BASE !== SUITE ? BASE.slice(SUITE.length) : BASE;

/** An address of a BIZOMAT tool ('/crm/o/x'): inside the ERP when this page is ('/erp/crm/o/x'). */
export const toolUrl = (path: string): string => (SUITE && /^\/(tasks|crm|finance|company)(\/|\?|$)/.test(path) ? SUITE + path : path);
