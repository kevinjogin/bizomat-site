// Cloudflare bindings the website's Worker expects, provided on Node.
//   FORM_LIMITER: per-key fixed windows in memory (the platform runs one web process).
import type { RateLimiter } from '../server/security.ts';

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
