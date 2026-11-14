// BIZOMAT System API (/api/system/*, signed in): the person's companies, the tools in each with their figures, and
// CAD Automation's status in a company. Everything is read through system.ts, which keeps each tool's permissions.
import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, now } from '../lib/util';
import { getPlatformRole } from '../services/platform-admin';
import { idClients } from '../company/id-provider';
import { cadFor, companiesFor, companyFor, toolNumbers } from './system';

export const systemRoutes = new Hono<AppEnv>();

systemRoutes.get('/me', async (c) => {
  const user = c.get('user');
  const companies = await companiesFor(c.env.DB, user);
  return c.json({
    user: { id: user.id, name: user.name, email: user.email },
    platformRole: await getPlatformRole(c.env.DB, user.id),
    companies: companies.map(({ tools, ...co }) => ({ ...co, toolCount: tools.length, apps: [...new Set(tools.map((t) => t.app))] })),
    // CAD Automation can report to the System once its BIZOMAT client is configured (company/id-provider.ts).
    cadConnected: idClients(c.env).some((x) => x.id === 'cad'),
  });
});

systemRoutes.get('/companies/:id', async (c) => {
  const user = c.get('user');
  const company = await companyFor(c.env.DB, user, c.req.param('id'));
  const tools = await Promise.all(company.tools.map(async (t) => ({ ...t, numbers: await toolNumbers(c.env.DB, user, t) })));
  let people: number | null = null;
  if (company.kind === 'registered' && company.role !== 'guest') {
    const r = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM co_members WHERE company_id = ?').bind(company.id).first<{ n: number }>();
    people = r?.n ?? 0;
  }
  return c.json({ company: { ...company, tools: undefined }, tools, people });
});

systemRoutes.get('/companies/:id/cad', async (c) => {
  const user = c.get('user');
  const company = await companyFor(c.env.DB, user, c.req.param('id'));
  return c.json(await cadFor(c.env.DB, user, company));
});

/** The owner renames their own company (a registered company's name is changed in the company area). */
systemRoutes.patch('/companies/:id', async (c) => {
  const user = c.get('user');
  const company = await companyFor(c.env.DB, user, c.req.param('id'));
  if (company.kind !== 'own' || company.role !== 'owner') throw new HttpError(403, 'Only the owner can rename their own company here. A registered company is renamed in the company area.');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100) }));
  await c.env.DB.prepare('UPDATE sys_companies SET name = ?, updated_at = ? WHERE id = ? AND owner_id = ?').bind(input.name, now(), company.id, user.id).run();
  return c.json({ ok: true, name: input.name });
});
