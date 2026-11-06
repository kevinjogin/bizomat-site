import type { Context } from 'hono';
import type { AppEnv, AuthUser, Env } from '../env';

/** Execution context passed to domain services (routes, automations, cron). */
export interface Svc {
  env: Env;
  db: D1Database;
  /** The acting user; null when the system (automation / scheduler) acts. */
  actor: AuthUser | null;
  /** Name of the automation acting, for activity attribution. */
  automationName?: string;
  automationDepth: number;
  /** `${automationId}:${itemId}` keys already fired in this causal chain (loop prevention). */
  chain: string[];
  waitUntil: (p: Promise<unknown>) => void;
}

export function svcFromContext(c: Context<AppEnv>): Svc {
  return {
    env: c.env,
    db: c.env.DB,
    actor: c.get('user'),
    automationDepth: 0,
    chain: [],
    waitUntil: (p) => {
      try {
        c.executionCtx.waitUntil(p);
      } catch {
        void p.catch(() => {});
      }
    },
  };
}

export function systemSvc(env: Env, waitUntil?: (p: Promise<unknown>) => void): Svc {
  return {
    env,
    db: env.DB,
    actor: null,
    automationDepth: 0,
    chain: [],
    waitUntil: waitUntil ?? ((p) => void p.catch(() => {})),
  };
}
