// Durable Object that fans out board change events to connected browsers via
// hibernatable WebSockets. Authorisation happens in the Worker BEFORE a
// connection is forwarded here; this object only relays server-generated events.
//
// Access is checked again at every event (audit E2): broadcast() asks the room who is connected (GET /users), checks
// each person's access to the board now, and sends the event with the people still allowed (X-Allowed-Users). The room
// closes the sockets of anyone else (code 4403), so a person removed from a board or a workspace stops getting its
// events at the next change, not when they reconnect. The Node hub (src/node/realtime.ts) does the same.

import { DurableObject } from 'cloudflare:workers';
import type { Env } from '../env';
import { loadBoardAuth } from '../services/permissions';

/** Close code for a socket whose person no longer has access to the board. */
export const ACCESS_REVOKED = 4403;

/** The people allowed to receive, from the X-Allowed-Users header (null: the header is absent, everyone connected). */
export function allowedFrom(request: Request): Set<string> | null {
  const h = request.headers.get('X-Allowed-Users');
  return h === null ? null : new Set(h.split(',').filter(Boolean));
}

export class BoardRoom extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/users' && request.method === 'GET') {
      const users = new Set(this.ctx.getWebSockets().flatMap((ws) => this.ctx.getTags(ws)));
      return new Response(JSON.stringify({ users: [...users] }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      const payload = await request.text();
      const allowed = allowedFrom(request);
      for (const ws of this.ctx.getWebSockets()) {
        try {
          if (allowed && !this.ctx.getTags(ws).some((u) => allowed.has(u))) ws.close(ACCESS_REVOKED, 'Access to this board has ended');
          else ws.send(payload);
        } catch {
          /* socket already closed */
        }
      }
      return new Response(JSON.stringify({ delivered: this.ctx.getWebSockets().length }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const userId = request.headers.get('X-WorkOS-User') ?? 'unknown';
      this.ctx.acceptWebSocket(pair[1], [userId]);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    return new Response('Not found', { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // Clients only send keep-alive pings; anything else is ignored.
    if (message === 'ping') ws.send('pong');
  }

  async webSocketClose(ws: WebSocket, code: number) {
    try {
      ws.close(code, 'closing');
    } catch {
      /* ignore */
    }
  }
}

/** The connected people who may still see the board: an active account with access to it now. */
export async function stillAllowed(env: Env, boardId: string, userIds: string[]): Promise<string[]> {
  const ids = [...new Set(userIds)].filter((u) => u && u !== 'unknown').slice(0, 500);
  if (!ids.length) return [];
  const active = await env.DB.prepare(`SELECT id FROM users WHERE disabled_at IS NULL AND id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all<{ id: string }>();
  const out: string[] = [];
  for (const { id } of active.results) if (await loadBoardAuth(env.DB, boardId, id)) out.push(id);
  return out;
}

export async function broadcast(env: Env, boardId: string, event: Record<string, unknown>) {
  try {
    const stub = env.BOARD_ROOMS.get(env.BOARD_ROOMS.idFromName(boardId));
    const who = (await (await stub.fetch('https://board-room/users')).json()) as { users?: string[] };
    if (!who.users?.length) return;
    const allowed = await stillAllowed(env, boardId, who.users);
    await stub.fetch('https://board-room/broadcast', {
      method: 'POST',
      headers: { 'X-Allowed-Users': allowed.join(',') },
      body: JSON.stringify({ boardId, ...event, at: Date.now() }),
    });
  } catch (e) {
    console.warn('broadcast failed', e);
  }
}
