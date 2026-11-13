// BIZOMAT sign-in for other BIZOMAT applications (owner's request, 13 Nov 2026: people who use CAD Automation sign in
// once and reach every tool, as one company account). This app is the sign-in provider: OAuth 2.0 authorization code
// flow with PKCE (S256), for clients configured in the secret BIZOMAT_ID_CLIENTS (never registered from outside).
//
//   1. The client sends the browser to https://bizomat.ai/company/authorize?client_id=...&redirect_uri=...&state=...
//      &code_challenge=...&code_challenge_method=S256 (a page of the company area; sign-in first if needed).
//   2. The page shows which application asks and for which account; Continue posts to /api/company/id/authorize, which
//      returns the client's redirect address with a one-time code (10 minutes).
//   3. The client's server swaps the code at POST /company/api/id/token (client secret, code verifier) for an access
//      token (1 hour), and reads GET /company/api/id/userinfo: the account's id, email, whether the email is confirmed,
//      name, and the companies the person belongs to.
//
// Codes and tokens are stored only as SHA-256 hashes. A client links an existing account of its own by the confirmed
// email address only (email_verified true).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, clientIp, now, randomToken, sha256Hex, timingSafeEqual } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { pkceChallenge } from '../auth/providers';
import { audit } from '../services/audit';

export interface IdClient {
  id: string;
  name: string;
  secretSha256: string;
  redirectUris: string[];
}

/** The configured clients. A malformed setting means no clients (and a log line), never a crash. */
export function idClients(env: Env): IdClient[] {
  if (!env.BIZOMAT_ID_CLIENTS) return [];
  try {
    const raw = JSON.parse(env.BIZOMAT_ID_CLIENTS) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((x): x is IdClient => !!x && typeof x.id === 'string' && typeof x.name === 'string' && typeof x.secretSha256 === 'string' && /^[0-9a-f]{64}$/.test(x.secretSha256) && Array.isArray(x.redirectUris))
      .map((x) => ({ ...x, redirectUris: x.redirectUris.filter((u) => typeof u === 'string' && /^https:\/\//.test(u) || (env.ENVIRONMENT !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(u))) }));
  } catch {
    console.warn('BIZOMAT_ID_CLIENTS is not valid JSON');
    return [];
  }
}

function clientFor(env: Env, clientId: string, redirectUri: string): IdClient {
  const client = idClients(env).find((c) => c.id === clientId);
  if (!client) throw new HttpError(400, 'This application is not allowed to use BIZOMAT sign-in.', { code: 'invalid_client' });
  // Exact match only: no prefixes, no wildcards.
  if (!client.redirectUris.includes(redirectUri)) throw new HttpError(400, 'This return address is not registered for the application.', { code: 'invalid_redirect_uri' });
  return client;
}

const CODE_TTL = 10 * 60_000;
const TOKEN_TTL = 60 * 60_000;

/** Signed in: the application asking, for the consent page. */
export const idAuthorizeRoutes = new Hono<AppEnv>();

idAuthorizeRoutes.get('/client', async (c) => {
  const client = clientFor(c.env, c.req.query('client_id') ?? '', c.req.query('redirect_uri') ?? '');
  const user = c.get('user');
  return c.json({ name: client.name, user: { name: user.name, email: user.email } });
});

idAuthorizeRoutes.post('/authorize', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `id-authorize:${user.id}`, 60, 15 * 60_000);
  const input = await body(
    c,
    z.object({
      clientId: z.string().min(1).max(100),
      redirectUri: z.string().min(1).max(500),
      state: z.string().min(8).max(500),
      codeChallenge: z.string().regex(/^[A-Za-z0-9_-]{43,128}$/),
      codeChallengeMethod: z.literal('S256'),
      scope: z.string().max(200).optional().default('openid email profile'),
      deny: z.boolean().optional(),
    }),
  );
  const client = clientFor(c.env, input.clientId, input.redirectUri);
  const back = new URL(input.redirectUri);
  back.searchParams.set('state', input.state);
  if (input.deny) {
    back.searchParams.set('error', 'access_denied');
    return c.json({ redirect: back.toString() });
  }
  const code = randomToken(32);
  const t = now();
  await c.env.DB.prepare('INSERT INTO id_auth_codes (code_hash, client_id, user_id, redirect_uri, code_challenge, scope, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(await sha256Hex(code), client.id, user.id, input.redirectUri, input.codeChallenge, input.scope, t, t + CODE_TTL)
    .run();
  await audit(c.env.DB, { actorId: user.id, action: 'id.authorized', metadata: { client: client.id }, ip: clientIp(c) });
  back.searchParams.set('code', code);
  return c.json({ redirect: back.toString() });
});

/** No session: the client's server, with its own secret. */
export const idPublicRoutes = new Hono<AppEnv>();

const tokenError = (c: any, error: string, description: string, status = 400) => {
  c.header('Cache-Control', 'no-store');
  return c.json({ error, error_description: description }, status);
};

idPublicRoutes.post('/token', async (c) => {
  await rateLimit(c.env.DB, `id-token:${clientIp(c)}`, 120, 60_000);
  const form = (await c.req.parseBody().catch(() => ({}))) as Record<string, string>;
  let clientId = String(form.client_id ?? '');
  let secret = String(form.client_secret ?? '');
  const basic = c.req.header('Authorization') ?? '';
  if (basic.startsWith('Basic ')) {
    try {
      const [id, sec] = atob(basic.slice(6)).split(':');
      clientId = decodeURIComponent(id ?? '');
      secret = decodeURIComponent(sec ?? '');
    } catch {
      return tokenError(c, 'invalid_client', 'Malformed client credentials', 401);
    }
  }
  const client = idClients(c.env).find((x) => x.id === clientId);
  if (!client || !secret || !timingSafeEqual(await sha256Hex(secret), client.secretSha256)) return tokenError(c, 'invalid_client', 'Unknown client or wrong secret', 401);
  if (form.grant_type !== 'authorization_code') return tokenError(c, 'unsupported_grant_type', 'Only authorization_code is supported');
  const code = String(form.code ?? '');
  const verifier = String(form.code_verifier ?? '');
  if (!code || !/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) return tokenError(c, 'invalid_request', 'code and code_verifier are required');
  const hash = await sha256Hex(code);
  const row = await c.env.DB.prepare('SELECT * FROM id_auth_codes WHERE code_hash = ?').bind(hash).first<{ client_id: string; user_id: string; redirect_uri: string; code_challenge: string; scope: string; expires_at: number; used_at: number | null }>();
  if (!row || row.client_id !== client.id || row.expires_at < now() || row.redirect_uri !== String(form.redirect_uri ?? '')) return tokenError(c, 'invalid_grant', 'The code is not valid');
  if ((await pkceChallenge(verifier)) !== row.code_challenge) return tokenError(c, 'invalid_grant', 'The code verifier does not match');
  // One use only, even when two requests race.
  const used = await c.env.DB.prepare('UPDATE id_auth_codes SET used_at = ? WHERE code_hash = ? AND used_at IS NULL').bind(now(), hash).run();
  if (!used.meta.changes) return tokenError(c, 'invalid_grant', 'The code was already used');
  const user = await c.env.DB.prepare('SELECT disabled_at FROM users WHERE id = ?').bind(row.user_id).first<{ disabled_at: number | null }>();
  if (!user || user.disabled_at) return tokenError(c, 'invalid_grant', 'The account is not active');
  const token = randomToken(32);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO id_access_tokens (token_hash, client_id, user_id, scope, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)').bind(await sha256Hex(token), client.id, row.user_id, row.scope, t, t + TOKEN_TTL),
    // Expired codes and tokens are of no use to anyone.
    c.env.DB.prepare('DELETE FROM id_auth_codes WHERE expires_at < ?').bind(t - CODE_TTL),
    c.env.DB.prepare('DELETE FROM id_access_tokens WHERE expires_at < ?').bind(t),
  ]);
  c.header('Cache-Control', 'no-store');
  return c.json({ access_token: token, token_type: 'Bearer', expires_in: TOKEN_TTL / 1000, scope: row.scope });
});

idPublicRoutes.get('/userinfo', async (c) => {
  const auth = c.req.header('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return tokenError(c, 'invalid_token', 'A bearer token is required', 401);
  const row = await c.env.DB.prepare('SELECT user_id, client_id, expires_at FROM id_access_tokens WHERE token_hash = ?').bind(await sha256Hex(token)).first<{ user_id: string; client_id: string; expires_at: number }>();
  if (!row || row.expires_at < now()) return tokenError(c, 'invalid_token', 'The token is not valid', 401);
  const user = await c.env.DB.prepare('SELECT id, email, name, email_verified_at, disabled_at FROM users WHERE id = ?').bind(row.user_id).first<{ id: string; email: string; name: string; email_verified_at: number | null; disabled_at: number | null }>();
  if (!user || user.disabled_at) return tokenError(c, 'invalid_token', 'The account is not active', 401);
  const companies = await c.env.DB.prepare('SELECT co.id, co.name, co.abn_status, m.role FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL WHERE m.user_id = ? ORDER BY co.name').bind(user.id).all<{ id: string; name: string; abn_status: string; role: string }>();
  c.header('Cache-Control', 'no-store');
  return c.json({
    sub: user.id,
    email: user.email,
    email_verified: !!user.email_verified_at,
    name: user.name,
    companies: companies.results.map((x) => ({ id: x.id, name: x.name, role: x.role, abn_status: x.abn_status })),
  });
});
