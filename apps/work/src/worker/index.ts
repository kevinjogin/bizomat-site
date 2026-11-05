import type { Env } from './env';
import { apiFailureMetric, createApp, withSecurityHeaders } from './app';
import { bumpMetric } from './services/analytics';
import { systemSvc } from './services/context';
import { notifyDueDates, retryFailedRuns, runScheduledAutomations } from './services/automations';

export { BoardRoom } from './realtime/board-room';

const app = createApp();

export async function runMaintenance(env: Env, at: number, waitUntil?: (p: Promise<unknown>) => void) {
  const svc = systemSvc(env, waitUntil);
  const results: Record<string, unknown> = {};
  results.scheduled = await runScheduledAutomations(svc, at);
  results.retried = await retryFailedRuns(svc, at);
  results.dueNotifications = await notifyDueDates(svc, at);
  // Housekeeping & retention. Uses the wall clock (not the schedule time) so a
  // delayed or replayed schedule can never end still-valid sessions.
  //  * sessions are kept as login history for 365 days after they end;
  //  * ended sessions lose their token hash (credential-derived data);
  //  * IP addresses are removed from sessions after 30 days;
  //  * sanitised error records are kept for 90 days;
  //  * activity events, daily activity and daily counters are kept indefinitely.
  const wall = Date.now();
  const DAY = 86_400_000;
  await env.DB.batch([
    env.DB.prepare("UPDATE sessions SET ended_at = expires_at, end_reason = 'expired' WHERE ended_at IS NULL AND expires_at < ?").bind(wall),
    env.DB.prepare("UPDATE sessions SET token_hash = 'ended:' || id WHERE ended_at IS NOT NULL AND token_hash NOT LIKE 'ended:%'"),
    env.DB.prepare('UPDATE sessions SET ip = NULL WHERE ip IS NOT NULL AND created_at < ?').bind(wall - 30 * DAY),
    env.DB.prepare('DELETE FROM sessions WHERE ended_at IS NOT NULL AND ended_at < ?').bind(wall - 365 * DAY),
    env.DB.prepare('DELETE FROM app_errors WHERE created_at < ?').bind(wall - 90 * DAY),
    env.DB.prepare('DELETE FROM oauth_states WHERE expires_at < ?').bind(wall),
    env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(wall - DAY),
    env.DB.prepare("INSERT INTO system_kv (key, value, updated_at) VALUES ('last_maintenance', ?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?1, updated_at = ?2").bind(JSON.stringify({ at: wall, ...results }), wall),
  ]);
  return results;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const res = await app.fetch(request, env, ctx);
    const metric = apiFailureMetric(request, res.status);
    if (metric) ctx.waitUntil(bumpMetric(env.DB, metric));
    return withSecurityHeaders(res, request);
  },
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      runMaintenance(env, controller.scheduledTime, (p) => ctx.waitUntil(p)).then(
        (r) => console.log('maintenance', JSON.stringify(r)),
        (e) => console.error('maintenance failed', e),
      ),
    );
  },
} satisfies ExportedHandler<Env>;
