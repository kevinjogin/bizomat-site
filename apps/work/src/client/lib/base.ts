// The path the app is served under: "" at the root of its host (work.kevos.com), "/tasks" under bizomat.ai. The
// Worker puts <base href> first in every page (src/worker/mount.ts); the Vite dev server has none (the root).
// Every address the client builds outside the router starts here; the router itself uses it as its basename.
const declared = typeof document === 'undefined' ? null : document.querySelector('base')?.getAttribute('href');
export const BASE = declared ? new URL(declared, location.origin).pathname.replace(/\/$/, '') : '';

/** A root path of the app ("/api/files/x", "/login") under BASE. */
export const appUrl = (path: string): string => BASE + path;

/** The current page's path inside the app, without BASE: what the router calls the pathname. */
export const appPath = (): string => (BASE && location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : location.pathname) || '/';
