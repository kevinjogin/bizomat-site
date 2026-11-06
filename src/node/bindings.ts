// Cloudflare bindings the website's Worker expects, provided on Node.
//   AI: Cloudflare Workers AI over its REST API (the same provider and models as on Workers), when CF_ACCOUNT_ID and
//       CF_AI_TOKEN are set. Without them the binding is absent and the site uses its keyword search, as on Workers.
//   CHAT_LIMITER / FORM_LIMITER: per-key fixed windows in memory (the platform runs one web process).
import type { AiBinding } from '../server/ai/provider.ts';
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
