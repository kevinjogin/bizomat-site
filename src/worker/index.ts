import type { Env } from './env';
import { createApp, withSecurityHeaders } from './app';
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
  // Housekeeping: expired sessions, OAuth states and stale rate-limit windows.
  // Uses the wall clock (not the schedule time) so a delayed or replayed
  // schedule can never purge still-valid sessions.
  const wall = Date.now();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE expires_at < ? OR (revoked_at IS NOT NULL AND revoked_at < ?)').bind(wall, wall - 86_400_000),
    env.DB.prepare('DELETE FROM oauth_states WHERE expires_at < ?').bind(wall),
    env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(wall - 86_400_000),
  ]);
  return results;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const res = await app.fetch(request, env, ctx);
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
