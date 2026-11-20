// The ERP's signing key for CAD Automation (docs/cad/README.md, "How the ERP and CAD Automation trust each other").
//
// CAD Automation already proves itself to the ERP with its client secret (company/id-provider.ts). The other way, the
// ERP vouches for a signed-in person to CAD Automation with a short assertion signed by this key (ES256, a P-256 key
// made on first use). Its private half is kept in system_kv encrypted with the server's settings key and never leaves
// the server; its public half is published at /api/id/jwks, where CAD Automation fetches it. No secret is shared.

import type { Env } from '../env';
import { HttpError, base64url, now, randomToken } from '../lib/util';
import { canEncrypt, decryptSecret, encryptSecret } from '../services/email/settings';

const KV = 'cad_signing_key';

interface Stored {
  kid: string;
  pub: JsonWebKey;
  enc: string;
  created: number;
}

let cached: { kid: string; key: CryptoKey; pub: JsonWebKey } | null = null;

const enc = new TextEncoder();
const b64u = (s: string | Uint8Array) => base64url(typeof s === 'string' ? enc.encode(s) : s);

/** RFC 7638 thumbprint of a P-256 public key: its kid. */
async function thumbprint(jwk: JsonWebKey): Promise<string> {
  const canon = JSON.stringify({ crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y });
  return b64u(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(canon))));
}

async function load(env: Env): Promise<{ kid: string; key: CryptoKey; pub: JsonWebKey }> {
  const db = env.DB;
  const row = await db.prepare('SELECT value FROM system_kv WHERE key = ?').bind(KV).first<{ value: string }>();
  if (row) {
    const s = JSON.parse(row.value) as Stored;
    if (cached?.kid === s.kid) return cached;
    const plain = await decryptSecret(env, s.enc);
    if (plain) {
      const key = await crypto.subtle.importKey('jwk', JSON.parse(plain) as JsonWebKey, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
      cached = { kid: s.kid, key, pub: s.pub };
      return cached;
    }
    // The settings key changed: the old private key cannot be read, so a new pair replaces it (CAD Automation fetches
    // the new public key when it meets an unknown kid).
  }
  if (!canEncrypt(env)) throw new HttpError(503, 'CAD Automation in the ERP needs the server’s settings key, which is not set here.', { code: 'CAD_NO_SETTINGS_KEY' });
  const pair = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair;
  const priv = (await crypto.subtle.exportKey('jwk', pair.privateKey)) as JsonWebKey;
  const full = (await crypto.subtle.exportKey('jwk', pair.publicKey)) as JsonWebKey;
  const pub: JsonWebKey = { kty: full.kty, crv: full.crv, x: full.x, y: full.y };
  const kid = await thumbprint(pub);
  const stored: Stored = { kid, pub, enc: await encryptSecret(env, JSON.stringify(priv)), created: now() };
  // Two first requests at once: the first key written wins, and both use it.
  await db.prepare('INSERT INTO system_kv (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at WHERE ? = 1').bind(KV, JSON.stringify(stored), now(), row ? 1 : 0).run();
  cached = null;
  return load(env);
}

/** The public keys CAD Automation trusts (GET /api/id/jwks). */
export async function jwks(env: Env): Promise<{ keys: (JsonWebKey & { kid: string; alg: string; use: string })[] }> {
  const k = await load(env);
  return { keys: [{ ...k.pub, kid: k.kid, alg: 'ES256', use: 'sig' }] };
}

export interface AssertionClaims {
  sub: string;
  email: string;
  ev: boolean;
  name: string;
  co: { id: string; name: string; kind: string };
  perm: CadPerms;
  lim: CadLimits;
}

export interface CadPerms {
  view: boolean;
  /** Pair computers, cancel and send work: on every computer of the company ('all'), only one's own ('own'), or none. */
  operate: 'all' | 'own' | false;
  /** Download or save CAD Automation's exports (source CAD files): a separate permission, every download recorded. */
  export: boolean;
  /** Company computers and settings (the brief's "manage templates and automation rules"). */
  manage: boolean;
  /** Remove other people's computers and AI connections (the brief's "delete designs"). */
  delete: boolean;
  /** Whose computers, commands and exports the person sees. */
  scope: 'all' | 'team' | 'own';
  /** For scope 'team': the BIZOMAT ids of the person's team, themselves included. */
  team: string[];
}

export interface CadLimits {
  /** Commands queued or running at once in the company. */
  concurrent: number;
  /** The longest a command may wait and run, in seconds. */
  commandSeconds: number;
  /** The largest upload, in MB. */
  uploadMb: number;
  /** Exports held at once for the company, in MB. */
  storageMb: number;
}

/** A one-minute assertion for one request: bound to its method, path and body (SHA-256), used once. */
export async function signAssertion(env: Env, claims: AssertionClaims, req: { method: string; path: string; body: string }): Promise<string> {
  const k = await load(env);
  const t = Math.floor(now() / 1000);
  const bh = b64u(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(req.body))));
  const header = { alg: 'ES256', typ: 'bizomat-erp+jwt', kid: k.kid };
  const payload = { iss: 'bizomat-erp', aud: 'cad', iat: t, exp: t + 60, jti: randomToken(16), htm: req.method.toUpperCase(), htu: req.path, bh, ...claims };
  const input = `${b64u(JSON.stringify(header))}.${b64u(JSON.stringify(payload))}`;
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, k.key, enc.encode(input)));
  return `${input}.${b64u(sig)}`;
}
