import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import type { AppEnv } from './env';
import { HttpError } from './lib/util';
import { isSecureEnv, requireAuth, resolveAuth, sessionCookieName } from './auth/session';
import { authRoutes } from './routes/auth';
import { workspaceRoutes } from './routes/workspaces';
import { orgRoutes } from './routes/org';
import { accessRoutes } from './routes/access';
import { emailAdminRoutes, emailWebhookRoutes } from './routes/email';
import { financeRoutes } from './routes/finance';
import { reportRoutes } from './routes/reports';
import { adminEmailRoutes } from './routes/admin-email';
import { adminSignupRoutes } from './routes/admin-signup';
import { scheduleRoutes } from './routes/schedule';
import { boardRoutes } from './routes/boards';
import { itemRoutes } from './routes/items';
import { fileRoutes } from './routes/files';
import { meRoutes } from './routes/me';
import { notificationRoutes } from './routes/notifications';
import { dashboardRoutes } from './routes/dashboards';
import { documentRoutes } from './routes/documents';
import { goalRoutes } from './routes/goals';
import { searchRoutes } from './routes/search';
import { automationRoutes } from './routes/automations';
import { integrationRoutes } from './routes/integrations';
import { templateRoutes } from './routes/templates';
import { realtimeRoutes } from './routes/realtime';
import { folderRoutes } from './routes/folders';
import { adminRoutes } from './routes/admin';
import { adminCrmRoutes, adminFinRoutes } from './routes/admin-products';
import { requirePlatformAdmin, getPlatformRole } from './services/platform-admin';
import { bumpMetric, recordError } from './services/analytics';
import { CRM_MOUNT, FIN_MOUNT, MOUNT, withBaseHref } from './mount';
import { crmPublicRoutes, crmRoutes } from './crm';
import { finPublicRoutes, finRoutes } from './fin';

export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' wss: ws:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "object-src 'none'",
].join('; ');

function applySecurityHeaders(headers: Headers, isApi: boolean) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  if (!headers.has('Content-Security-Policy')) headers.set('Content-Security-Policy', CSP);
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  if (isApi && !headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store');
}

export const VERSION = '0.1.0';

export function createApp() {
  const app = new Hono<AppEnv>();

  app.onError((err, c) => {
    if (err instanceof HttpError) {
      const res = c.json({ error: err.message, details: err.details ?? undefined }, err.status as 400);
      if (err.status === 429 && (err.details as any)?.retryAfter) res.headers.set('Retry-After', String((err.details as any).retryAfter));
      return res;
    }
    console.error('Unhandled error', err);
    const url = new URL(c.req.url);
    const p = recordError(c.env.DB, { method: c.req.method, path: url.pathname, status: 500, error: err });
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      void p;
    }
    return c.json({ error: 'Internal server error' }, 500);
  });

  // No CORS: the API is same-origin only. Cross-origin preflights are refused.
  app.options('/api/*', (c) => c.body(null, 403));

  app.get('/api/health', async (c) => {
    let db = 'ok';
    try {
      await c.env.DB.prepare('SELECT 1').first();
    } catch {
      db = 'error';
    }
    return c.json({ status: db === 'ok' ? 'ok' : 'degraded', db, version: VERSION, environment: c.env.ENVIRONMENT, time: new Date().toISOString() }, db === 'ok' ? 200 : 503);
  });

  app.route('/api/auth', authRoutes);
  // CRM invitation previews and calendar feeds: no session, the token in the address is the secret.
  app.route('/api/crm-public', crmPublicRoutes);
  // Finance invitation previews: no session, the token in the address is the secret.
  app.route('/api/fin-public', finPublicRoutes);

  // Sessions from before the CRM (or Finance) existed have their cookie on /tasks only (or /tasks and /crm). A CRM or
  // Finance page without a cookie comes here (under /tasks, where that cookie is sent): with a valid session, the same
  // cookie is written for every path and the browser goes back; without one, to that app's sign-in page. A short marker
  // cookie stops any loop.
  const carry = async (c: any) => {
    const to = c.req.query('to') ?? '';
    const target = /^\/finance(\/|\?|$)/.test(to) ? FIN_MOUNT : CRM_MOUNT;
    const pattern = target === FIN_MOUNT ? /^\/finance(\/[^\\\r\n]*)?(\?[^\r\n]*)?$/ : /^\/crm(\/[^\\\r\n]*)?(\?[^\r\n]*)?$/;
    const safe = pattern.test(to) && !to.startsWith('//') ? to : `${target}/`;
    const marker = `${target === FIN_MOUNT ? 'fin' : 'crm'}_carry=1; Path=${target}; Max-Age=60; HttpOnly; SameSite=Lax${isSecureEnv(c.env) ? '; Secure' : ''}`;
    const auth = c.env.BASE_PATH === MOUNT ? await resolveAuth(c) : null;
    const token = getCookie(c, sessionCookieName(c.env));
    if (auth?.session && token) {
      setCookie(c, sessionCookieName(c.env), token, { httpOnly: true, secure: isSecureEnv(c.env), sameSite: 'Lax', path: '/', expires: new Date(auth.session.expiresAt) });
      const res = c.redirect(safe, 302);
      res.headers.append('Set-Cookie', marker);
      return res;
    }
    const inner = safe.slice(target.length) || '/';
    const res = c.redirect(`${target}/login${inner && inner !== '/' ? `?next=${encodeURIComponent(inner)}` : ''}`, 302);
    res.headers.append('Set-Cookie', marker);
    return res;
  };
  app.get('/api/crm-carry', carry);
  app.get('/api/app-carry', carry);
  // Provider callbacks: no session, their own authentication (src/worker/routes/email.ts).
  app.route('/api/email-webhooks', emailWebhookRoutes);

  // Everything below requires authentication.
  const api = new Hono<AppEnv>();
  api.use('*', requireAuth);
  api.route('/', workspaceRoutes);
  api.route('/', orgRoutes);
  api.route('/', accessRoutes);
  api.route('/', emailAdminRoutes);
  api.route('/', financeRoutes);
  api.route('/', reportRoutes);
  api.route('/', scheduleRoutes);
  api.route('/', boardRoutes);
  api.route('/', itemRoutes);
  api.route('/', fileRoutes);
  api.route('/', meRoutes);
  api.route('/', notificationRoutes);
  api.route('/', dashboardRoutes);
  api.route('/', documentRoutes);
  api.route('/', goalRoutes);
  api.route('/', searchRoutes);
  api.route('/', automationRoutes);
  api.route('/', integrationRoutes);
  api.route('/', templateRoutes);
  api.route('/', folderRoutes);
  // BIZOMAT CRM (src/worker/crm): its own organisations, members and records, the same accounts and sessions.
  api.route('/crm', crmRoutes);
  // BIZOMAT Finance (src/worker/fin): personal, household and business workspaces, the same accounts and sessions.
  api.route('/fin', finRoutes);
  // Founder admin API: authenticated session + platform-admin role, enforced server-side.
  const admin = new Hono<AppEnv>();
  admin.use('*', requirePlatformAdmin);
  admin.route('/', adminRoutes);
  admin.route('/', adminEmailRoutes);
  admin.route('/', adminSignupRoutes);
  // The same super admins, for the CRM and Finance (src/worker/routes/admin-products.ts).
  admin.route('/crm', adminCrmRoutes);
  admin.route('/fin', adminFinRoutes);
  api.route('/admin', admin);
  app.route('/api/live', realtimeRoutes);
  app.route('/api', api);

  app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404));

  // Static SPA. Navigations to app pages without a session are redirected to
  // /login server-side; data is never embedded in HTML.
  app.get('*', async (c) => {
    const url = new URL(c.req.url);
    const isNavigation = (c.req.header('Accept') ?? '').includes('text/html');
    const otherApp = c.env.BASE_PATH === CRM_MOUNT || c.env.BASE_PATH === FIN_MOUNT;
    const publicPaths = ['/login', '/signup', '/invite/', '/privacy', '/verify-email', ...(otherApp ? ['/join/'] : [])];
    const isPublic = publicPaths.some((p) => url.pathname === p || url.pathname.startsWith(p)) || /\.[a-z0-9]+$/i.test(url.pathname);
    if (isNavigation) {
      const hasCookie = !!getCookie(c, sessionCookieName(c.env));
      const auth = hasCookie ? await resolveAuth(c) : null;
      // Aggregate page-view counters only (no identifiers, no cookies).
      const pv = bumpMetric(c.env.DB, auth ? 'pageview_authenticated' : 'pageview_anonymous');
      try {
        c.executionCtx.waitUntil(pv);
      } catch {
        void pv;
      }
      if (!auth && !isPublic && otherApp && !hasCookie && !getCookie(c, c.env.BASE_PATH === FIN_MOUNT ? 'fin_carry' : 'crm_carry')) {
        // Maybe signed in with a cookie from before this app existed: see the carry above.
        return c.redirect(`${MOUNT}/api/${c.env.BASE_PATH === FIN_MOUNT ? 'app' : 'crm'}-carry?to=${encodeURIComponent(c.env.BASE_PATH + url.pathname + url.search)}`, 302);
      }
      if (!auth && !isPublic) {
        const next = url.pathname + url.search;
        return c.redirect(`/login${next && next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`, 302);
      }
      // The admin area is not even served to non-admins.
      if (auth && (url.pathname === '/admin' || url.pathname.startsWith('/admin/'))) {
        const role = auth.kind === 'session' ? await getPlatformRole(c.env.DB, auth.user.id) : null;
        if (!role) return c.text('Not found', 404);
      }
    }
    const res = await c.env.ASSETS.fetch(new Request(new URL(url.pathname, url.origin).toString(), { headers: c.req.raw.headers }));
    const out = new Response(res.body, res);
    if (url.pathname.startsWith('/assets/')) out.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    else if ((out.headers.get('Content-Type') ?? '').includes('text/html')) out.headers.set('Cache-Control', 'no-cache');
    // The client builds its addresses from <base href>: "/" here, "/tasks/" under bizomat.ai (src/worker/mount.ts).
    return withBaseHref(out, c.env.BASE_PATH ?? '');
  });

  return app;
}

/** Count failing API responses per day (aggregate only). */
export function apiFailureMetric(req: Request, status: number): string | null {
  const path = new URL(req.url).pathname;
  if (!path.startsWith('/api/') || status < 400) return null;
  if (status === 401 && (path === '/api/auth/me' || path === '/api/heartbeat')) return null; // signed-out page loads, not failures
  if (status === 401 && path === '/api/auth/login') return null; // counted once as auth_login_failed
  if (status >= 500) return 'api_5xx';
  if (status === 429) return 'api_429';
  if (status === 401) return 'api_401';
  if (status === 403) return 'api_403';
  return 'api_4xx';
}

export async function withSecurityHeaders(res: Response, req: Request): Promise<Response> {
  if (res.status === 101) return res;
  const out = new Response(res.body, res);
  applySecurityHeaders(out.headers, new URL(req.url).pathname.startsWith('/api/'));
  return out;
}
