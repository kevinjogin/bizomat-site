// Durable Object that fans out board change events to connected browsers via
// hibernatable WebSockets. Authorisation happens in the Worker BEFORE a
// connection is forwarded here; this object only relays server-generated events.

import { DurableObject } from 'cloudflare:workers';
import type { Env } from '../env';

export class BoardRoom extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      const payload = await request.text();
      for (const ws of this.ctx.getWebSockets()) {
        try {
          ws.send(payload);
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

export async function broadcast(env: Env, boardId: string, event: Record<string, unknown>) {
  try {
    const stub = env.BOARD_ROOMS.get(env.BOARD_ROOMS.idFromName(boardId));
    await stub.fetch('https://board-room/broadcast', { method: 'POST', body: JSON.stringify({ boardId, ...event, at: Date.now() }) });
  } catch (e) {
    console.warn('broadcast failed', e);
  }
}
