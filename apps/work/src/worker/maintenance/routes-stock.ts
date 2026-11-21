// Parts reserved for a work order, purchase requisitions raised from one, and the maintenance stores' stocktakes.
// Stub made by the field release's shared scaffolding; stream B fills it in.
import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const stockRoutes = new Hono<AppEnv>();
