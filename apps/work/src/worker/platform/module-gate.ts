// Module switches on the server (Admin Control Centre, R2). A module a platform admin switched off for a company answers
// 403 MODULE_DISABLED to that company's people. Everyone else gets the module's usual 404 first, so a switched-off module
// never reveals that a company exists. Acts for Maintenance and WHS from R2, the other modules from R4 (flags.ts MODULES).

import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { loadErpAccess } from '../erp/access';
import { MODULES, moduleEnabled, type ModuleKey } from './flags';

export function moduleGate(m: ModuleKey): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const companyId = c.req.param('company');
    if (companyId && !(await moduleEnabled(c.env.DB, m, companyId))) {
      // Not a member: the usual 404 (loadErpAccess throws it), never a hint that the company exists.
      await loadErpAccess(c.env.DB, companyId, c.get('user'));
      throw new HttpError(403, `${MODULES[m].label} is switched off for this company. Ask BIZOMAT support if you need it.`, { code: 'MODULE_DISABLED', module: m });
    }
    await next();
  };
}
