import { HttpError } from '../lib/util';

/**
 * Fixed-window rate limiter backed by D1 (strongly consistent, unlike KV).
 * Returns the remaining budget, throws 429 when exhausted.
 */
export async function rateLimit(db: D1Database, key: string, limit: number, windowMs: number): Promise<number> {
  const t = Date.now();
  const windowStart = t - (t % windowMs);
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN rate_limits.window_start < ?2 THEN 1 ELSE rate_limits.count + 1 END,
         window_start = CASE WHEN rate_limits.window_start < ?2 THEN ?2 ELSE rate_limits.window_start END
       RETURNING count, window_start`,
    )
    .bind(key, windowStart)
    .first<{ count: number; window_start: number }>();
  const count = row?.count ?? 1;
  if (count > limit) {
    const retry = Math.max(1, Math.ceil((windowStart + windowMs - t) / 1000));
    throw new HttpError(429, `Too many attempts. Try again in ${retry} seconds.`, { retryAfter: retry });
  }
  return limit - count;
}

export async function resetRateLimit(db: D1Database, key: string) {
  await db.prepare('DELETE FROM rate_limits WHERE key = ?').bind(key).run();
}
