import type { Context, MiddlewareHandler } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import type { AppEnv, AuthUser, Env, SessionInfo } from '../env';
import { HttpError, clientIp, newId, now, randomToken, sha256Hex, timingSafeEqual } from '../lib/util';

const TOUCH_INTERVAL_MS = 5 * 60_000;

export function isSecureEnv(env: Env): boolean {
  return env.ENVIRONMENT !== 'development' && env.ENVIRONMENT !== 'test';
}

/** `__Host-` cookies require Secure + Path=/ + no Domain: strongest browser guarantees. */
export function sessionCookieName(env: Env): string {
  return isSecureEnv(env) ? '__Host-workos_sid' : 'workos_sid';
}

function ttlMs(env: Env): number {
  const h = Number(env.SESSION_TTL_HOURS || '336');
  return (Number.isFinite(h) && h > 0 ? h : 336) * 3_600_000;
}

export async function createSession(c: Context<AppEnv>, userId: string, provider: string): Promise<SessionInfo> {
  const token = randomToken(32);
  const csrf = randomToken(24);
  const t = now();
  const expiresAt = t + ttlMs(c.env);
  const id = newId();
  await c.env.DB.prepare(
    `INSERT INTO sessions (id, token_hash, user_id, csrf_token, provider, user_agent, ip, created_at, last_seen_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, await sha256Hex(token), userId, csrf, provider, (c.req.header('User-Agent') ?? '').slice(0, 300), clientIp(c), t, t, expiresAt)
    .run();
  setCookie(c, sessionCookieName(c.env), token, {
    httpOnly: true,
    secure: isSecureEnv(c.env),
    sameSite: 'Lax',
    path: '/',
    expires: new Date(expiresAt),
  });
  return { id, csrfToken: csrf, provider, expiresAt };
}

export async function destroySession(c: Context<AppEnv>) {
  const token = getCookie(c, sessionCookieName(c.env));
  if (token) {
    await c.env.DB.prepare('UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL')
      .bind(now(), await sha256Hex(token))
      .run();
  }
  deleteCookie(c, sessionCookieName(c.env), { path: '/', secure: isSecureEnv(c.env) });
}

interface Resolved {
  user: AuthUser;
  session: SessionInfo | null;
  kind: 'session' | 'token';
}

export async function resolveAuth(c: Context<AppEnv>): Promise<Resolved | null> {
  const db = c.env.DB;
  const t = now();

  // 1. Personal API token (External API access): Authorization: Bearer wos_...
  const authz = c.req.header('Authorization');
  if (authz?.startsWith('Bearer ')) {
    const raw = authz.slice(7).trim();
    if (!raw.startsWith('wos_')) return null;
    const row = await db
      .prepare(
        `SELECT t.id AS token_id, u.id, u.email, u.name FROM api_tokens t JOIN users u ON u.id = t.user_id
         WHERE t.token_hash = ? AND t.revoked_at IS NULL AND (t.expires_at IS NULL OR t.expires_at > ?) AND u.disabled_at IS NULL`,
      )
      .bind(await sha256Hex(raw), t)
      .first<{ token_id: string; id: string; email: string; name: string }>();
    if (!row) return null;
    c.executionCtx?.waitUntil?.(db.prepare('UPDATE api_tokens SET last_used_at = ? WHERE id = ?').bind(t, row.token_id).run());
    return { user: { id: row.id, email: row.email, name: row.name }, session: null, kind: 'token' };
  }

  // 2. Session cookie.
  const token = getCookie(c, sessionCookieName(c.env));
  if (!token || token.length > 100) return null;
  const row = await db
    .prepare(
      `SELECT s.id AS sid, s.csrf_token, s.provider, s.expires_at, s.last_seen_at, u.id, u.email, u.name
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ? AND u.disabled_at IS NULL`,
    )
    .bind(await sha256Hex(token), t)
    .first<{ sid: string; csrf_token: string; provider: string; expires_at: number; last_seen_at: number; id: string; email: string; name: string }>();
  if (!row) return null;
  if (t - row.last_seen_at > TOUCH_INTERVAL_MS) {
    const p = db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').bind(t, row.sid).run();
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      await p;
    }
  }
  return {
    user: { id: row.id, email: row.email, name: row.name },
    session: { id: row.sid, csrfToken: row.csrf_token, provider: row.provider, expiresAt: row.expires_at },
    kind: 'session',
  };
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Reject cross-site requests: the Origin header (when sent) must match our host. */
export function checkOrigin(c: Context<AppEnv>) {
  const origin = c.req.header('Origin');
  if (!origin) return;
  const reqUrl = new URL(c.req.url);
  let ok = false;
  try {
    const o = new URL(origin);
    ok = o.host === reqUrl.host || (!!c.env.APP_URL && o.origin === new URL(c.env.APP_URL).origin);
  } catch {
    ok = false;
  }
  if (!ok) throw new HttpError(403, 'Cross-origin request rejected');
}

/** Requires an authenticated user; enforces CSRF for cookie sessions on unsafe methods. */
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const auth = await resolveAuth(c);
  if (!auth) throw new HttpError(401, 'Authentication required');
  if (!SAFE_METHODS.has(c.req.method) && auth.kind === 'session') {
    checkOrigin(c);
    const header = c.req.header('X-CSRF-Token') ?? '';
    if (!auth.session || !timingSafeEqual(header, auth.session.csrfToken)) {
      throw new HttpError(403, 'Invalid or missing CSRF token');
    }
  }
  c.set('user', auth.user);
  c.set('session', auth.session);
  c.set('authKind', auth.kind);
  await next();
};
