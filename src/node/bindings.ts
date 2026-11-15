// Cloudflare bindings the website's Worker expects, provided on Node.
//   AI: Cloudflare Workers AI over its REST API (the same provider and models as on Workers), when CF_ACCOUNT_ID and
//       CF_AI_TOKEN are set. Without them the binding is absent and the site uses its keyword search, as on Workers.
//   CHAT_LIMITER / FORM_LIMITER: per-key fixed windows in memory (the platform runs one web process).
//   DOWNLOADS: the R2 bucket bizomat-downloads (public downloads, src/server/downloads.ts) through R2's S3 API, when
//       WEB_DOWNLOADS_R2_ACCESS_KEY_ID and WEB_DOWNLOADS_R2_SECRET_ACCESS_KEY are set (an R2 API token with Object Read
//       only, for that bucket alone), with the account id in WEB_DOWNLOADS_R2_ACCOUNT_ID or CF_ACCOUNT_ID. Without them
//       /downloads/ answers 404, as on a Worker without the binding.
import { createHash, createHmac } from 'node:crypto';
import type { AiBinding } from '../server/ai/provider.ts';
import type { DownloadsBucket } from '../server/downloads.ts';
import type { RateLimiter } from '../server/security.ts';

export function workersAiRest(accountId: string, token: string, fetchImpl: typeof fetch = fetch, timeoutMs = 20_000): AiBinding {
  if (!/^[0-9a-f]{32}$/i.test(accountId)) throw new Error('CF_ACCOUNT_ID must be the 32-character Cloudflare account id');
  return {
    async run(model: string, input: Record<string, unknown>) {
      if (!/^@cf\/[\w.\-/]+$/.test(model)) throw new Error('unknown model');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetchImpl(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => null)) as { success?: boolean; result?: unknown; errors?: { message?: string }[] } | null;
        if (!res.ok || !data || data.success === false) throw new Error(`Workers AI ${res.status}: ${data?.errors?.[0]?.message ?? 'no result'}`.slice(0, 200));
        return data.result;
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

export function memoryLimiter(limit: number, periodSeconds: number, now: () => number = Date.now): RateLimiter & { size(): number } {
  const windows = new Map<string, { start: number; count: number }>();
  const period = periodSeconds * 1000;
  let calls = 0;
  return {
    async limit({ key }: { key: string }) {
      const t = now();
      // Drop expired windows now and then, so the map cannot grow without bound.
      if (++calls % 500 === 0) for (const [k, w] of windows) if (t - w.start >= period) windows.delete(k);
      const w = windows.get(key);
      if (!w || t - w.start >= period) { windows.set(key, { start: t, count: 1 }); return { success: true }; }
      w.count += 1;
      return { success: w.count <= limit };
    },
    size: () => windows.size,
  };
}

const sha256Hex = (data: string) => createHash('sha256').update(data).digest('hex');
const hmac = (key: string | Buffer, data: string) => createHmac('sha256', key).update(data).digest();
/** RFC 3986 encoding of one path segment, as AWS Signature Version 4 expects. */
const encodeSegment = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
export const EMPTY_SHA256 = sha256Hex('');

export interface SigV4Credentials { accessKeyId: string; secretAccessKey: string; region: string; service: string }

/**
 * AWS Signature Version 4 for a request without a query string (the only kind sent here): returns the headers to send,
 * the given ones plus x-amz-date, x-amz-content-sha256 and Authorization. `path` is the encoded path as sent.
 */
export function signV4(method: string, host: string, path: string, headers: Record<string, string>, cred: SigV4Credentials, now: Date, payloadSha256 = EMPTY_SHA256): Record<string, string> {
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const day = amzDate.slice(0, 8);
  const all: Record<string, string> = { ...headers, host, 'x-amz-content-sha256': payloadSha256, 'x-amz-date': amzDate };
  const names = Object.keys(all).map((n) => n.toLowerCase()).sort();
  const lower = Object.fromEntries(Object.entries(all).map(([k, v]) => [k.toLowerCase(), String(v).trim().replace(/\s+/g, ' ')]));
  const canonical = [method, path, '', ...names.map((n) => `${n}:${lower[n]}`), '', names.join(';'), payloadSha256].join('\n');
  const scope = `${day}/${cred.region}/${cred.service}/aws4_request`;
  const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256Hex(canonical)].join('\n');
  const key = hmac(hmac(hmac(hmac(`AWS4${cred.secretAccessKey}`, day), cred.region), cred.service), 'aws4_request');
  const signature = createHmac('sha256', key).update(toSign).digest('hex');
  const { host: _host, ...rest } = all;
  return { ...rest, Authorization: `AWS4-HMAC-SHA256 Credential=${cred.accessKeyId}/${scope}, SignedHeaders=${names.join(';')}, Signature=${signature}` };
}

export interface R2Options {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  /** For tests: the S3 endpoint (default https://<accountId>.r2.cloudflarestorage.com). */
  endpoint?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  now?: () => Date;
}

/** A read-only DownloadsBucket over R2's S3 API (GetObject). A missing object is null; any other refusal is an error. */
export function r2Downloads(o: R2Options): DownloadsBucket {
  if (!/^[0-9a-f]{32}$/i.test(o.accountId)) throw new Error('the R2 account id must be the 32-character Cloudflare account id');
  if (!/^[A-Za-z0-9]{16,128}$/.test(o.accessKeyId) || !/^[A-Za-z0-9]{16,128}$/.test(o.secretAccessKey)) throw new Error('the R2 access key id and secret must be the values R2 showed for the token');
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(o.bucket)) throw new Error('the R2 bucket name is not valid');
  const base = new URL(o.endpoint ?? `https://${o.accountId}.r2.cloudflarestorage.com`);
  const cred: SigV4Credentials = { accessKeyId: o.accessKeyId, secretAccessKey: o.secretAccessKey, region: 'auto', service: 's3' };
  const fetchImpl = o.fetchImpl ?? fetch;
  return {
    async get(key: string) {
      const path = `/${encodeSegment(o.bucket)}/${key.split('/').map(encodeSegment).join('/')}`;
      const headers = signV4('GET', base.host, path, {}, cred, (o.now ?? (() => new Date()))());
      const controller = new AbortController();
      // Only the wait for the answer's headers is limited; the file itself then streams for as long as it takes.
      const timer = setTimeout(() => controller.abort(), o.timeoutMs ?? 15_000);
      let res: Response;
      try {
        res = await fetchImpl(new URL(path, base), { headers, signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
      if (res.status === 404) { await res.body?.cancel(); return null; }
      const size = Number(res.headers.get('content-length'));
      if (!res.ok || !res.body || !Number.isFinite(size)) {
        await res.body?.cancel();
        throw new Error(`R2 downloads: HTTP ${res.status}`);
      }
      return { body: res.body, size, httpEtag: res.headers.get('etag') ?? undefined };
    },
  };
}
