// Realtime for the Node runtime: an in-process hub in place of the BoardRoom
// Durable Object, served to the Worker as env.BOARD_ROOMS.
//
// The flow is the Worker's own: GET /api/live/boards/:id goes through the
// same Hono route (Upgrade check, Origin check, authentication, board
// permission), which then calls BOARD_ROOMS.get(idFromName(boardId)).fetch()
// with a /connect request. The hub answers that request with an "accept"
// response (status 101, like the Durable Object) carrying a private ticket.
// The Node server completes the WebSocket handshake only when the Worker's
// final response is such a ticket, so no socket is ever accepted unless the
// route authorised it. Like the Durable Object, the hub answers the text
// message "ping" with "pong", ignores every other client message, and fans
// broadcast payloads out unchanged to every socket of the board.

import type { WebSocket } from 'ws';

const TICKET = Symbol('work.node.websocket-ticket');

export interface AcceptTicket {
  room: string;
  userId: string;
}

/** The ticket a hub accept response carries, or null for any other response. */
export function ticketOf(res: Response): AcceptTicket | null {
  return ((res as unknown as Record<symbol, AcceptTicket | undefined>)[TICKET] ?? null) as AcceptTicket | null;
}

/**
 * Stand-in for the client end of a WebSocketPair on the 101 response. The
 * Node server never uses it (it upgrades the real socket); it exists so code
 * that calls res.webSocket.accept()/close(), like the test suite, still works.
 */
class DetachedWebSocket {
  readyState = 1;
  accept() {}
  send() {}
  close() {
    this.readyState = 3;
  }
  addEventListener() {}
  removeEventListener() {}
}

function acceptResponse(ticket: AcceptTicket): Response {
  // undici's Response refuses status 101, so the status is set on the instance.
  const res = new Response(null, { status: 200 });
  Object.defineProperty(res, 'status', { value: 101 });
  Object.defineProperty(res, 'statusText', { value: 'Switching Protocols' });
  Object.defineProperty(res, 'ok', { value: false });
  Object.defineProperty(res, 'webSocket', { value: new DetachedWebSocket() });
  Object.defineProperty(res, TICKET, { value: Object.freeze({ ...ticket }) });
  return res;
}

class HubId {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  toString() {
    return this.name;
  }
  equals(other: { toString(): string }) {
    return other?.toString() === this.name;
  }
}

export class BoardHub {
  readonly #rooms = new Map<string, Set<WebSocket>>();
  readonly namespace: DurableObjectNamespace;

  constructor() {
    const get = (id: HubId) => ({
      id,
      name: id.name,
      fetch: (input: RequestInfo | URL, init?: RequestInit) => this.#fetch(id.name, new Request(input, init)),
    });
    const ns = {
      idFromName: (name: string) => new HubId(String(name)),
      idFromString: (id: string) => new HubId(String(id)),
      newUniqueId: () => new HubId(crypto.randomUUID()),
      get,
      getByName: (name: string) => get(new HubId(String(name))),
      jurisdiction: () => ns,
    };
    this.namespace = ns as unknown as DurableObjectNamespace;
  }

  async #fetch(room: string, request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      const delivered = this.broadcast(room, await request.text());
      return new Response(JSON.stringify({ delivered }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (request.headers.get('Upgrade') === 'websocket') {
      return acceptResponse({ room, userId: request.headers.get('X-WorkOS-User') ?? 'unknown' });
    }
    return new Response('Not found', { status: 404 });
  }

  /** Adds an upgraded socket to a board's room. */
  attach(room: string, ws: WebSocket): void {
    let sockets = this.#rooms.get(room);
    if (!sockets) this.#rooms.set(room, (sockets = new Set()));
    sockets.add(ws);
    ws.on('message', (data, isBinary) => {
      try {
        if (!isBinary && data.toString() === 'ping') ws.send('pong');
      } catch {
        /* socket closing */
      }
    });
    const remove = () => {
      const set = this.#rooms.get(room);
      if (!set) return;
      set.delete(ws);
      if (set.size === 0) this.#rooms.delete(room);
    };
    ws.on('close', remove);
    ws.on('error', remove);
  }

  /** Sends the payload to every socket of the room; returns how many sockets the room has (as the Durable Object does). */
  broadcast(room: string, payload: string): number {
    const sockets = this.#rooms.get(room);
    if (!sockets) return 0;
    for (const ws of sockets) {
      try {
        if (ws.readyState === ws.OPEN) ws.send(payload);
      } catch {
        /* socket already closed */
      }
    }
    return sockets.size;
  }

  get connections(): number {
    let n = 0;
    for (const s of this.#rooms.values()) n += s.size;
    return n;
  }

  /** Closes every socket (shutdown). Clients reconnect on their own. */
  closeAll(code = 1001, reason = 'Server shutting down'): void {
    for (const sockets of this.#rooms.values()) {
      for (const ws of sockets) {
        try {
          ws.close(code, reason);
        } catch {
          /* already closed */
        }
      }
    }
  }

  terminateAll(): void {
    for (const sockets of this.#rooms.values()) for (const ws of sockets) ws.terminate();
    this.#rooms.clear();
  }
}
