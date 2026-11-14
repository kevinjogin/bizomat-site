import type { Env } from './env';
import { apiFailureMetric, createApp, withSecurityHeaders } from './app';
import { bumpMetric } from './services/analytics';
import { systemSvc } from './services/context';
import { notifyDueDates, retryFailedRuns, runScheduledAutomations } from './services/automations';
import { COMPANY_MOUNT, CRM_MOUNT, FIN_MOUNT, SYSTEM_MOUNT, canonicalRedirect, crmCanonicalRedirect, mountOf, remount, unmount } from './mount';
import { backfillOwnCompanies } from './system/system';
import { processOutbox } from './services/email/outbox';
import { runCrmScheduled } from './crm';
import { financeHousekeeping, runFinanceScheduled } from './fin';
import { recheckPendingAbns } from './company/routes';

export { BoardRoom } from './realtime/board-room';

const app = createApp();

export async function runMaintenance(env: Env, at: number, waitUntil?: (p: Promise<unknown>) => void) {
  const svc = systemSvc(env, waitUntil);
  const results: Record<string, unknown> = {};
  results.scheduled = await runScheduledAutomations(svc, at);
  results.retried = await retryFailedRuns(svc, at);
  results.dueNotifications = await notifyDueDates(svc, at);
  // CRM: scheduled automations (overdue activities, deals close to their expected close date).
  try {
    results.crm = await runCrmScheduled(env, at, waitUntil);
  } catch (e) {
    results.crm = { error: e instanceof Error ? e.message : 'failed' };
  }
  // Finance: recurring records, reminders, budget warnings, monthly summaries and scheduled reports.
  try {
    results.finance = await runFinanceScheduled(env, at, waitUntil);
  } catch (e) {
    results.finance = { error: e instanceof Error ? e.message : 'failed' };
  }
  // Companies: ABNs not yet looked up on the Australian Business Register (only when ABR_GUID is set), a few a run.
  try {
    results.companies = { abnsChecked: await recheckPendingAbns(env, 5) };
  } catch (e) {
    results.companies = { error: e instanceof Error ? e.message : 'failed' };
  }
  // BIZOMAT System: a company of their own for every account that has none yet (system/system.ts), a batch a run.
  try {
    results.system = { ownCompaniesMade: await backfillOwnCompanies(env.DB, 200) };
  } catch (e) {
    results.system = { error: e instanceof Error ? e.message : 'failed' };
  }
  // Email: hand queued and delayed messages to the provider, within the daily limit.
  try {
    results.email = await processOutbox(env, { max: 100 });
  } catch (e) {
    results.email = { error: e instanceof Error ? e.message : 'failed' };
  }
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
    // CRM: read notifications are kept 180 days; automation runs (the execution history) 180 days.
    env.DB.prepare('DELETE FROM crm_notifications WHERE read_at IS NOT NULL AND read_at < ?').bind(wall - 180 * DAY),
    env.DB.prepare('DELETE FROM crm_automation_runs WHERE created_at < ?').bind(wall - 180 * DAY),
    // Finance: read notifications are kept 180 days.
    ...financeHousekeeping(env.DB, wall),
    // Email bodies are kept 30 days for diagnostics, then cleared; the delivery record stays.
    env.DB.prepare("UPDATE email_outbox SET html = '', text = '' WHERE created_at < ? AND status NOT IN ('queued','deferred','sending') AND (html != '' OR text != '')").bind(wall - 30 * DAY),
    env.DB.prepare("INSERT INTO system_kv (key, value, updated_at) VALUES ('last_maintenance', ?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?1, updated_at = ?2").bind(JSON.stringify({ at: wall, ...results }), wall),
  ]);
  return results;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Under https://bizomat.ai/tasks the app sees its own paths; elsewhere it answers at the root of its host.
    const base = mountOf(new URL(request.url));
    if (!base) {
      const moved = canonicalRedirect(request, env);
      if (moved) return withSecurityHeaders(moved, request);
    }
    if (base === CRM_MOUNT || base === FIN_MOUNT || base === COMPANY_MOUNT || base === SYSTEM_MOUNT) {
      const moved = crmCanonicalRedirect(request, env, base);
      if (moved) return withSecurityHeaders(moved, request);
    }
    const inner = base ? unmount(request, base) : request;
    const res = await app.fetch(inner, { ...env, BASE_PATH: base }, ctx);
    const metric = apiFailureMetric(inner, res.status);
    if (metric) ctx.waitUntil(bumpMetric(env.DB, metric));
    return remount(await withSecurityHeaders(res, inner), base);
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
