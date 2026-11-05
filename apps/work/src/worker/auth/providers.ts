// Provider-independent authentication.
//
// Every external identity provider implements `OAuthProvider`. Users are linked
// through the `user_identities` table, so adding a provider never changes the
// user/session model. The Google provider is real OpenID Connect
// (authorization code + PKCE + state + nonce-less ID token verification via the
// token endpoint over TLS) and is ENABLED ONLY when GOOGLE_CLIENT_ID and
// GOOGLE_CLIENT_SECRET are configured as Worker secrets.

import type { Env } from '../env';
import { base64url } from '../lib/util';

export interface ExternalProfile {
  subject: string;
  email: string;
  emailVerified: boolean;
  name: string;
}

export interface OAuthProvider {
  id: string;
  name: string;
  isConfigured(env: Env): boolean;
  authorizeUrl(env: Env, params: { state: string; codeChallenge: string; redirectUri: string }): string;
  exchange(env: Env, params: { code: string; codeVerifier: string; redirectUri: string }): Promise<ExternalProfile>;
}

export const googleProvider: OAuthProvider = {
  id: 'google',
  name: 'Google',
  isConfigured: (env) => !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
  authorizeUrl(env, { state, codeChallenge, redirectUri }) {
    const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    u.searchParams.set('client_id', env.GOOGLE_CLIENT_ID!);
    u.searchParams.set('redirect_uri', redirectUri);
    u.searchParams.set('response_type', 'code');
    u.searchParams.set('scope', 'openid email profile');
    u.searchParams.set('state', state);
    u.searchParams.set('code_challenge', codeChallenge);
    u.searchParams.set('code_challenge_method', 'S256');
    u.searchParams.set('prompt', 'select_account');
    return u.toString();
  },
  async exchange(env, { code, codeVerifier, redirectUri }) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    });
    if (!res.ok) throw new Error(`Google token exchange failed (${res.status})`);
    const tokens = (await res.json()) as { id_token?: string; access_token?: string };
    if (!tokens.id_token) throw new Error('Google did not return an ID token');
    // The ID token came directly from Google's token endpoint over TLS, so per
    // OIDC Core §3.1.3.7 signature validation may be skipped; we still check
    // the audience, issuer and expiry claims.
    const claims = decodeJwtPayload(tokens.id_token);
    const iss = String(claims.iss ?? '');
    if (claims.aud !== env.GOOGLE_CLIENT_ID) throw new Error('ID token audience mismatch');
    if (iss !== 'https://accounts.google.com' && iss !== 'accounts.google.com') throw new Error('ID token issuer mismatch');
    if (typeof claims.exp !== 'number' || claims.exp * 1000 < Date.now()) throw new Error('ID token expired');
    if (!claims.sub || !claims.email) throw new Error('ID token missing subject or email');
    return {
      subject: String(claims.sub),
      email: String(claims.email).toLowerCase(),
      emailVerified: claims.email_verified === true || claims.email_verified === 'true',
      name: String(claims.name ?? String(claims.email).split('@')[0]),
    };
  },
};

export const providers: OAuthProvider[] = [googleProvider];

export function getProvider(id: string): OAuthProvider | undefined {
  return providers.find((p) => p.id === id);
}

export function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const parts = jwt.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return JSON.parse(json) as Record<string, unknown>;
}

export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}
