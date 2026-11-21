// The asset summary on work orders and requests, and the duplicate warning (GET /assets/:id/summary).
// Stub made by the field release's shared scaffolding; stream A fills it in.
import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const assetSummaryRoutes = new Hono<AppEnv>();
