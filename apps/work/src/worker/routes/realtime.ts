import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { checkOrigin, enforcePasswordReset, resolveAuth } from '../auth/session';
import { loadBoardAuth } from '../services/permissions';

export const realtimeRoutes = new Hono<AppEnv>();

/** WebSocket endpoint: authenticated + authorised here, then handed to the board's Durable Object. */
realtimeRoutes.get('/boards/:id', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') throw new HttpError(426, 'Expected a WebSocket upgrade');
  checkOrigin(c); // blocks cross-site WebSocket hijacking
  const auth = await resolveAuth(c);
  if (!auth) throw new HttpError(401, 'Authentication required');
  enforcePasswordReset(c, auth.user); // no live board data until a required new password is chosen
  const board = await loadBoardAuth(c.env.DB, c.req.param('id'), auth.user.id);
  if (!board) throw new HttpError(404, 'Board not found');
  const stub = c.env.BOARD_ROOMS.get(c.env.BOARD_ROOMS.idFromName(board.board.id));
  const headers = new Headers(c.req.raw.headers);
  headers.set('X-WorkOS-User', auth.user.id);
  return stub.fetch(new Request('https://board-room/connect', { headers }));
});
