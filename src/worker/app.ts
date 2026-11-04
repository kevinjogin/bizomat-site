import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import type { AppEnv } from './env';
import { HttpError } from './lib/util';
import { requireAuth, resolveAuth, sessionCookieName } from './auth/session';
import { authRoutes } from './routes/auth';
import { workspaceRoutes } from './routes/workspaces';
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
import { requirePlatformAdmin, getPlatformRole } from './services/platform-admin';
import { bumpMetric, recordError } from './services/analytics';

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

  // Everything below requires authentication.
  const api = new Hono<AppEnv>();
  api.use('*', requireAuth);
  api.route('/', workspaceRoutes);
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
  // Founder admin API: authenticated session + platform-admin role, enforced server-side.
  const admin = new Hono<AppEnv>();
  admin.use('*', requirePlatformAdmin);
  admin.route('/', adminRoutes);
  api.route('/admin', admin);
  app.route('/api/live', realtimeRoutes);
  app.route('/api', api);

  app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404));

  // Static SPA. Navigations to app pages without a session are redirected to
  // /login server-side; data is never embedded in HTML.
  app.get('*', async (c) => {
    const url = new URL(c.req.url);
    const isNavigation = (c.req.header('Accept') ?? '').includes('text/html');
    const publicPaths = ['/login', '/signup', '/invite/', '/privacy'];
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
    return out;
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
