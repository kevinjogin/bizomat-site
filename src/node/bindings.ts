// Cloudflare bindings the website's Worker expects, provided on Node.
//   AI: Cloudflare Workers AI over its REST API (the same provider and models as on Workers), when CF_ACCOUNT_ID and
//       CF_AI_TOKEN are set. Without them the binding is absent and the site uses its keyword search, as on Workers.
//   CHAT_LIMITER / FORM_LIMITER: per-key fixed windows in memory (the platform runs one web process).
//   DOWNLOADS: the public downloads (src/server/downloads.ts) from the folder downloads/ of this repository, which the
//       image copies next to the built site (infrastructure/fly/Dockerfile): only the files listed in its SHA256SUMS,
//       each checked against its listed SHA-256 before it is served. No cloud storage, no setting, nothing to rotate.
import { createHash } from 'node:crypto';
import { createReadStream, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { Readable } from 'node:stream';
import { join, sep } from 'node:path';
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

/** A listed file whose bytes no longer match SHA256SUMS: never served (the handler answers 500 and logs it). */
export class DownloadIntegrityError extends Error {}

/** SHA256SUMS: "<64 hex>  <folder>/<file>" per line; blank lines and lines starting with # are ignored. */
export function parseSums(text: string): Map<string, string> {
  const sums = new Map<string, string>();
  for (const [i, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = /^([0-9a-f]{64}) [ *]([^\s]+)$/.exec(line);
    if (!m) throw new Error(`SHA256SUMS line ${i + 1} is not "<sha256>  <folder>/<file>"`);
    if (sums.has(m[2])) throw new Error(`SHA256SUMS lists ${m[2]} twice`);
    sums.set(m[2], m[1]);
  }
  return sums;
}

/**
 * A read-only DownloadsBucket over a folder: <dir>/SHA256SUMS lists the public files; anything not listed does not exist.
 * A listed file must be a regular file inside <dir> (no link out of it), and its SHA-256 must match the list: it is
 * hashed on first use and again whenever its size or time changes. <key>.sha256 answers the listed checksum.
 */
export function folderDownloads(dir: string): DownloadsBucket & { listed(): string[] } {
  let sums: Map<string, string>;
  let root: string;
  try {
    root = realpathSync(dir);
    sums = parseSums(readFileSync(join(root, 'SHA256SUMS'), 'utf8'));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { listed: () => [], async get() { return null; } };
    throw err;
  }
  const verified = new Map<string, string>(); // key -> "size:mtime" last found correct
  return {
    listed: () => [...sums.keys()],
    async get(key: string) {
      const checksumOf = key.endsWith('.sha256') ? key.slice(0, -'.sha256'.length) : null;
      if (checksumOf !== null) {
        const sum = sums.get(checksumOf);
        if (!sum) return null;
        const text = `${sum}  ${checksumOf.slice(checksumOf.indexOf('/') + 1)}\n`;
        return { body: Readable.toWeb(Readable.from([Buffer.from(text)])) as ReadableStream, size: Buffer.byteLength(text), httpEtag: `"${sum.slice(0, 32)}"` };
      }
      const sum = sums.get(key);
      if (!sum) return null;
      const path = join(root, ...key.split('/'));
      let st;
      try {
        st = lstatSync(path);
      } catch {
        console.error(JSON.stringify({ web: 'download_missing', file: key }));
        return null;
      }
      if (!st.isFile() || !realpathSync(path).startsWith(root + sep)) return null;
      const stamp = `${st.size}:${st.mtimeMs}`;
      if (verified.get(key) !== stamp) {
        const actual = createHash('sha256').update(readFileSync(path)).digest('hex');
        if (actual !== sum) {
          verified.delete(key);
          console.error(JSON.stringify({ web: 'download_checksum_mismatch', file: key }));
          throw new DownloadIntegrityError(`${key} does not match SHA256SUMS`);
        }
        verified.set(key, stamp);
      }
      return { body: Readable.toWeb(createReadStream(path)) as ReadableStream, size: st.size, httpEtag: `"${sum.slice(0, 32)}"` };
    },
  };
}
