// Email settings entered in the founder console (Founder console > Email). They are stored in system_kv, with the
// Brevo API key and the webhook token encrypted (AES-256-GCM) under SETTINGS_ENCRYPTION_KEY. On the Node runtime that
// key is a random file in the data folder (settings.key, created on first start, src/node/runtime.ts), so database
// copies and exports never hold a usable API key. Secrets are never returned to the browser: only whether one is set
// and its last four characters.
//
// Precedence: a value saved in the console wins over the environment (Fly secrets WORK_BREVO_API_KEY, ...), so the
// founder can change email without a deploy; clearing it in the console falls back to the environment.

import type { Env } from '../../env';
import { now, parseJson } from '../../lib/util';

const KV_KEY = 'email_settings';

export interface StoredEmailSettings {
  enabled?: boolean;
  apiKeyEnc?: string | null;
  apiKeyLast4?: string | null;
  webhookTokenEnc?: string | null;
  fromName?: string | null;
  fromAddress?: string | null;
  replyTo?: string | null;
  dailyLimit?: number | null;
  criticalReserve?: number | null;
  sandbox?: boolean | null;
  updatedBy?: string | null;
  updatedAt?: number | null;
}

function b64(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function unb64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function canEncrypt(env: Env): boolean {
  try {
    return !!env.SETTINGS_ENCRYPTION_KEY && unb64(env.SETTINGS_ENCRYPTION_KEY).length === 32;
  } catch {
    return false;
  }
}

async function aesKey(env: Env): Promise<CryptoKey> {
  if (!canEncrypt(env)) throw new Error('No settings encryption key');
  return crypto.subtle.importKey('raw', unb64(env.SETTINGS_ENCRYPTION_KEY!), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptSecret(env: Env, plain: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(env), new TextEncoder().encode(plain)));
  return `v1.${b64(iv)}.${b64(ct)}`;
}

export async function decryptSecret(env: Env, enc: string): Promise<string | null> {
  const [v, iv, ct] = enc.split('.');
  if (v !== 'v1' || !iv || !ct) return null;
  try {
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, await aesKey(env), unb64(ct));
    return new TextDecoder().decode(pt);
  } catch {
    // Another key (a restored database on a new volume): the saved secret has to be entered again.
    return null;
  }
}

export async function loadEmailSettings(db: D1Database): Promise<StoredEmailSettings> {
  const row = await db.prepare('SELECT value FROM system_kv WHERE key = ?').bind(KV_KEY).first<{ value: string }>();
  return parseJson<StoredEmailSettings>(row?.value, {});
}

export async function saveEmailSettings(db: D1Database, s: StoredEmailSettings) {
  const t = now();
  await db
    .prepare('INSERT INTO system_kv (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = ?3')
    .bind(KV_KEY, JSON.stringify({ ...s, updatedAt: t }), t)
    .run();
}

// The settings row is read on every use (one primary-key lookup), so a change saved anywhere applies at once; only
// the decrypted result is kept, for as long as the stored row is unchanged, so the key is not decrypted per email.
type Overrides = Partial<Env> & { EMAIL_KEY_UNREADABLE?: string };
let cache: { raw: string; keyId: string; overrides: Overrides } | null = null;

export function invalidateEmailSettings() {
  cache = null;
}

async function computeOverrides(env: Env, s: StoredEmailSettings): Promise<Overrides> {
  const out: Overrides = {};
  if (s.enabled === false) {
    // Switched off in the console: no provider, whatever the environment says.
    out.EMAIL_PROVIDER = 'none';
    return out;
  }
  if (s.apiKeyEnc) {
    const k = canEncrypt(env) ? await decryptSecret(env, s.apiKeyEnc) : null;
    if (k) {
      out.BREVO_API_KEY = k;
      if (!env.EMAIL_PROVIDER || env.EMAIL_PROVIDER === 'none') out.EMAIL_PROVIDER = 'brevo';
    } else out.EMAIL_KEY_UNREADABLE = '1';
  }
  if (s.webhookTokenEnc) {
    const w = canEncrypt(env) ? await decryptSecret(env, s.webhookTokenEnc) : null;
    if (w) out.BREVO_WEBHOOK_TOKEN = w;
  }
  if (s.fromName) out.EMAIL_FROM_NAME = s.fromName;
  if (s.fromAddress) out.EMAIL_FROM_ADDRESS = s.fromAddress;
  if (s.replyTo) out.EMAIL_REPLY_TO = s.replyTo;
  if (s.dailyLimit) out.EMAIL_DAILY_LIMIT = String(s.dailyLimit);
  if (s.criticalReserve != null) out.EMAIL_CRITICAL_RESERVE = String(s.criticalReserve);
  if (s.sandbox != null) out.EMAIL_SANDBOX = s.sandbox ? '1' : '0';
  return out;
}

/** The environment with the console's email settings applied on top (decrypted). */
export async function emailEnv(env: Env): Promise<Env & { EMAIL_KEY_UNREADABLE?: string }> {
  let raw = '';
  try {
    const row = await env.DB.prepare('SELECT value FROM system_kv WHERE key = ?').bind(KV_KEY).first<{ value: string }>();
    raw = row?.value ?? '';
  } catch {
    raw = '';
  }
  if (!raw) return env;
  const keyId = env.SETTINGS_ENCRYPTION_KEY ?? '';
  if (!cache || cache.raw !== raw || cache.keyId !== keyId) cache = { raw, keyId, overrides: await computeOverrides(env, parseJson<StoredEmailSettings>(raw, {})) };
  return { ...env, ...cache.overrides };
}

// ------------------------------------------------------------------ checks against Brevo

export interface BrevoCheck {
  ok: boolean;
  error: string | null;
  account: { email: string | null; companyName: string | null; plans: { type: string; credits: number | null; creditsType: string | null }[] } | null;
  senders: { email: string; name: string; active: boolean }[] | null;
  domains: { name: string; authenticated: boolean | null; verified: boolean | null }[] | null;
}

/**
 * Reads the account, its senders and its domains with the key (GET /v3/account, /v3/senders, /v3/senders/domains),
 * so the console can say whether the key works and whether the sender address is ready. Nothing is sent.
 */
export async function checkBrevo(apiKey: string, fetchImpl: typeof fetch = fetch): Promise<BrevoCheck> {
  const get = async (path: string) => {
    const res = await fetchImpl(`https://api.brevo.com/v3${path}`, { headers: { 'api-key': apiKey, accept: 'application/json' }, signal: AbortSignal.timeout(15_000) });
    const data = await res.json().catch(() => null);
    return { status: res.status, data: data as any };
  };
  try {
    const acct = await get('/account');
    if (acct.status === 401 || acct.status === 403) {
      return { ok: false, error: `Brevo refused the key (${acct.status}${acct.data?.message ? `: ${String(acct.data.message).slice(0, 160)}` : ''}). Check that it is an API key (xkeysib-...), not an SMTP key, and that Authorised IPs does not block it.`, account: null, senders: null, domains: null };
    }
    if (acct.status >= 400) return { ok: false, error: `Brevo answered ${acct.status}`, account: null, senders: null, domains: null };
    const [snd, dom] = await Promise.all([get('/senders').catch(() => ({ status: 0, data: null })), get('/senders/domains').catch(() => ({ status: 0, data: null }))]);
    return {
      ok: true,
      error: null,
      account: {
        email: typeof acct.data?.email === 'string' ? acct.data.email : null,
        companyName: typeof acct.data?.companyName === 'string' ? acct.data.companyName : null,
        plans: Array.isArray(acct.data?.plan)
          ? acct.data.plan.map((p: any) => ({ type: String(p?.type ?? ''), credits: typeof p?.credits === 'number' ? p.credits : null, creditsType: typeof p?.creditsType === 'string' ? p.creditsType : null }))
          : [],
      },
      senders: Array.isArray(snd.data?.senders) ? snd.data.senders.map((x: any) => ({ email: String(x?.email ?? ''), name: String(x?.name ?? ''), active: !!x?.active })) : null,
      domains: Array.isArray(dom.data?.domains)
        ? dom.data.domains.map((x: any) => ({ name: String(x?.domain_name ?? x?.name ?? ''), authenticated: typeof x?.authenticated === 'boolean' ? x.authenticated : null, verified: typeof x?.verified === 'boolean' ? x.verified : null }))
        : null,
    };
  } catch (e) {
    return { ok: false, error: `Could not reach Brevo: ${e instanceof Error ? e.message : 'network error'}`, account: null, senders: null, domains: null };
  }
}
