// BIZOMAT Finance: the API under /api/fin (signed-in) and /api/fin-public (invitation previews, whose token is the
// secret). Mounted by src/worker/app.ts; runs in the same Worker, database and file store as Project Management and
// the CRM, on the same accounts and sessions. The app shows it at /finance.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { orgRoutes, publicInviteRoutes } from './routes-orgs';
import { setupRoutes } from './routes-setup';
import { moneyRoutes } from './routes-money';
import { docRoutes } from './routes-docs';
import { salesRoutes } from './routes-sales';
import { publicDocRoutes } from './routes-public';
import { bankingRoutes } from './routes-banking';
import { planRoutes } from './routes-plan';
import { fileRoutes } from './routes-files';
import { reportRoutes } from './routes-reports';

export const finRoutes = new Hono<AppEnv>();
finRoutes.route('/', orgRoutes);
finRoutes.route('/', setupRoutes);
finRoutes.route('/', moneyRoutes);
finRoutes.route('/', docRoutes);
finRoutes.route('/', salesRoutes);
finRoutes.route('/', bankingRoutes);
finRoutes.route('/', planRoutes);
finRoutes.route('/', fileRoutes);
finRoutes.route('/', reportRoutes);

export const finPublicRoutes = new Hono<AppEnv>();
finPublicRoutes.route('/', publicInviteRoutes);
finPublicRoutes.route('/', publicDocRoutes);

export { runFinanceScheduled, financeHousekeeping } from './scheduled';
