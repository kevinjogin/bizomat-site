// Alerts to platform admins when a scheduled step fails (Admin Control Centre, R2; the audit found failures were only
// visible on the console's health page). One email per admin, per failing step, per day: the outbox's idempotency key
// keeps repeats out, and the 15-minute run keeps trying the step. Error texts are cut short; nothing else is sent.

import type { Env } from '../env';
import { enqueueEmail } from '../services/email/outbox';

export interface StepFailure {
  step: string;
  error: string;
}

/** The steps of a maintenance run that ended with { error }. */
export function failedSteps(results: Record<string, unknown>): StepFailure[] {
  return Object.entries(results)
    .filter(([, v]) => !!v && typeof v === 'object' && 'error' in (v as Record<string, unknown>))
    .map(([step, v]) => ({ step, error: String((v as { error: unknown }).error).replace(/\s+/g, ' ').slice(0, 200) }));
}

export async function alertFailures(env: Env, results: Record<string, unknown>, at: number): Promise<{ failed: string[]; queued: number }> {
  const failed = failedSteps(results);
  if (!failed.length) return { failed: [], queued: 0 };
  const admins = await env.DB
    .prepare('SELECT u.id, u.email, u.name FROM platform_admins p JOIN users u ON u.id = p.user_id WHERE u.disabled_at IS NULL')
    .all<{ id: string; email: string; name: string }>();
  const day = new Date(at).toISOString().slice(0, 10);
  let queued = 0;
  for (const a of admins.results) {
    for (const f of failed) {
      const r = await enqueueEmail(env, {
        userId: a.id,
        to: a.email,
        toName: a.name,
        data: {
          template: 'notification',
          organisation: 'BIZOMAT platform',
          title: `A scheduled job failed: ${f.step}`,
          body: `The maintenance run at ${new Date(at).toISOString()} could not finish "${f.step}": ${f.error}. It is tried again every 15 minutes; the console's System Health page shows the latest run. You get one email a day per failing step.`,
          url: null,
        },
        idempotencyKey: `alert:maintenance:${day}:${f.step}:${a.id}`,
      });
      if (r.queued) queued++;
    }
  }
  return { failed: failed.map((f) => f.step), queued };
}
