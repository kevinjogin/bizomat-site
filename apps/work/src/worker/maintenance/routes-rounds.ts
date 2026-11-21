// Inspection rounds: one work order over many assets, each with its checklist and a supervisor's review.
// Stub made by the field release's shared scaffolding; stream C fills it in.
import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const roundRoutes = new Hono<AppEnv>();
