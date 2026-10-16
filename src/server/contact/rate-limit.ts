// Optional rate limiting. Bind a Workers KV namespace as CONTACT_RATE_LIMIT to enable it;
// without the binding every request is allowed (the honeypot and validation still apply).
// IP addresses are hashed before storage so no raw IPs are kept.

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface RateLimitEnv {
  CONTACT_RATE_LIMIT?: KV;
  /** Messages allowed per IP per window. Default 5. */
  RATE_LIMIT_MAX?: string;
  /** Window length in seconds. Default 3600 (one hour). */
  RATE_LIMIT_WINDOW?: string;
}

async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** `scope` keeps separate counters per form, e.g. 'contact' and 'assessment'. */
export async function checkRateLimit(env: RateLimitEnv, ip: string, scope = 'contact'): Promise<boolean> {
  const kv = env.CONTACT_RATE_LIMIT;
  if (!kv) return true;
  const max = Number(env.RATE_LIMIT_MAX ?? 5);
  const window = Number(env.RATE_LIMIT_WINDOW ?? 3600);
  const bucket = Math.floor(Date.now() / 1000 / window);
  const key = `${scope}:${await hash(ip)}:${bucket}`;
  const count = Number((await kv.get(key)) ?? 0);
  if (count >= max) return false;
  await kv.put(key, String(count + 1), { expirationTtl: Math.max(60, window * 2) });
  return true;
}
