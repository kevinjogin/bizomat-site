// The one place that builds addresses of this application for emails and other messages sent outside the browser.
//
// Links in emails must never come from the request that caused them (its Host or X-Forwarded-Host header): an
// invitation created through an old or alternative host, a preview or an internal address would otherwise carry that
// host. They come from configuration only:
//
//   APP_BASE_URL   the public address of the app, when it differs from APP_URL (optional)
//   APP_URL        the app's public address (production: https://bizomat.ai/tasks; the app is mounted at /tasks)
//   CANONICAL_URL  when set, every link must use exactly this address (production: https://bizomat.ai/tasks)
//
// In production the address must be https, a public host (not localhost or an IP address), without credentials,
// query or fragment, and equal to CANONICAL_URL when that is set. A wrong configuration is refused (AppUrlError)
// instead of producing wrong links.

export class AppUrlError extends Error {}

interface UrlEnv {
  APP_BASE_URL?: string;
  APP_URL?: string;
  CANONICAL_URL?: string;
  ENVIRONMENT?: string;
}

/** Environments where http and local addresses are acceptable. */
const LOCAL_ENVIRONMENTS = new Set(['development', 'test', 'local']);

const trimSlash = (p: string) => p.replace(/\/+$/, '');

export interface AppBase {
  /** https://bizomat.ai */
  origin: string;
  /** /tasks (no trailing slash; empty when the app is at the root of its host) */
  path: string;
  /** https://bizomat.ai/tasks */
  href: string;
}

/** The validated public address of the app. Throws AppUrlError when the configuration cannot give correct links. */
export function appBase(env: UrlEnv): AppBase {
  const raw = (env.APP_BASE_URL || env.APP_URL || '').trim();
  if (!raw) throw new AppUrlError('APP_URL (or APP_BASE_URL) is not set, so links in emails cannot be built');
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new AppUrlError(`The app address "${raw}" is not a URL`);
  }
  const local = LOCAL_ENVIRONMENTS.has((env.ENVIRONMENT ?? '').trim());
  if (u.protocol !== 'https:' && !(local && u.protocol === 'http:')) throw new AppUrlError(`The app address must use https (it is ${u.protocol}//${u.host})`);
  if (u.username || u.password) throw new AppUrlError('The app address must not contain a user name or password');
  if (u.search || u.hash) throw new AppUrlError('The app address must not have a query or fragment');
  if (!local && (u.hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(u.hostname) || u.hostname.includes(':') || u.hostname.endsWith('.internal'))) {
    throw new AppUrlError(`The app address must be the public host, not ${u.hostname}`);
  }
  const base: AppBase = { origin: u.origin, path: trimSlash(u.pathname), href: u.origin + trimSlash(u.pathname) };
  const canonRaw = (env.CANONICAL_URL ?? '').trim();
  if (canonRaw) {
    let c: URL;
    try {
      c = new URL(canonRaw);
    } catch {
      throw new AppUrlError(`CANONICAL_URL "${canonRaw}" is not a URL`);
    }
    const canon = c.origin + trimSlash(c.pathname);
    if (canon !== base.href) throw new AppUrlError(`The app address ${base.href} differs from CANONICAL_URL ${canon}: links must use the canonical address`);
  }
  return base;
}

/** Problems with the configuration, in plain words; null when links can be built. */
export function appUrlProblem(env: UrlEnv): string | null {
  try {
    appBase(env);
    return null;
  } catch (e) {
    return e instanceof AppUrlError ? e.message : 'The app address cannot be read';
  }
}

/**
 * An address in the app. `segments` are path segments, each encoded once (a token is one segment); `query` values
 * are encoded once. Example: appUrl(env, ['invite', token]) -> https://bizomat.ai/tasks/invite/<token>.
 */
export function appUrl(env: UrlEnv, segments: string[] = [], query?: Record<string, string>): string {
  const b = appBase(env);
  for (const s of segments) if (!s || s === '.' || s === '..') throw new AppUrlError('Empty or relative path segment in an app link');
  const path = segments.map((s) => encodeURIComponent(s)).join('/');
  const u = new URL(`${b.href}/${path}`);
  if (query) for (const [k, v] of Object.entries(query)) u.searchParams.set(k, v);
  return u.toString();
}

/** An app-relative link such as "/w/<ws>/boards/<id>?item=<id>" made absolute on the app's address. */
export function appLink(env: UrlEnv, link: string | null | undefined): string {
  const b = appBase(env);
  if (!link) return `${b.href}/`;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('//')) {
    // Only links to this app are allowed in its messages.
    const u = new URL(link);
    if (u.origin !== b.origin || !(u.pathname === b.path || u.pathname.startsWith(`${b.path}/`))) throw new AppUrlError(`A link outside the app (${u.origin}) was given for an email`);
    return u.toString();
  }
  return new URL(`${b.href}${link.startsWith('/') ? '' : '/'}${link}`).toString();
}

/** The invitation acceptance page: https://bizomat.ai/tasks/invite/<token>. */
export function inviteUrl(env: UrlEnv, token: string): string {
  return appUrl(env, ['invite', token]);
}

/** The email confirmation page: https://bizomat.ai/tasks/verify-email?token=<token>. */
export function verifyEmailUrl(env: UrlEnv, token: string): string {
  return appUrl(env, ['verify-email'], { token });
}
