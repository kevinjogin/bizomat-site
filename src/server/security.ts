// Shared request and response safeguards for the Worker's own responses (APIs and redirects).
// Static pages get their headers from dist/_headers; anything the Worker builds itself gets them here,
// because `wrangler deploy` compiles src/worker.ts directly and never sees the build-time CSP.

/** Baseline headers for every Worker-generated response. Existing values are never overwritten. */
export const BASELINE_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/** API responses are data, never documents: nothing in them may load, frame or run. */
export const API_HEADERS: Record<string, string> = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cache-Control': 'no-store',
};

/** True when the request comes from this site, or carries no browser origin at all (server-to-server). */
export function isSameOrigin(request: Request): boolean {
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return false;
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/** Read at most `max` bytes of the body, counting streamed bytes as well as Content-Length. Null if larger. */
export async function readBoundedText(request: Request, max: number): Promise<string | null> {
  if (Number(request.headers.get('Content-Length') || 0) > max) return null;
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(bytes);
}

/** Cloudflare Workers Rate Limiting binding (`[[ratelimits]]` in wrangler.toml). */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * Per-IP burst limit at the edge. Allows the request when the binding is absent (local tests, older
 * deployments) or the limiter itself errors, so a limiter fault never takes the site's forms down;
 * the longer-window KV limit and Turnstile still apply where configured.
 */
export async function withinEdgeLimit(limiter: RateLimiter | undefined, scope: string, request: Request): Promise<boolean> {
  if (!limiter) return true;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  try {
    return (await limiter.limit({ key: `${scope}:${ip}` })).success;
  } catch {
    return true;
  }
}
