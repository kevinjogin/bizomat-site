// The Worker on Node: bindings, request handling, WebSockets, cron, shutdown.
//
// createRuntime() opens WORK_DATA_DIR, applies pending D1 migrations and
// builds the Worker's Env from the Node bindings. startServer() serves it over
// HTTP. Every request goes through the Worker's own default export
// (fetch(request, env, ctx)), so routing, authentication, security headers and
// metrics are exactly the Worker's.

import { randomBytes } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Duplex } from 'node:stream';
import { WebSocketServer, type WebSocket } from 'ws';
import worker from '../worker/index.ts';
import { withSecurityHeaders } from '../worker/app.ts';
import type { Env } from '../worker/env.ts';
import { StaticAssets } from './assets.ts';
import { NodeD1Database } from './bindings/d1.ts';
import { NodeKVNamespace } from './bindings/kv.ts';
import { NodeR2Bucket } from './bindings/r2.ts';
import type { NodeConfig } from './config.ts';
import { WaitUntilTracker } from './context.ts';
import { HttpProblem, problemResponse, toFetchRequest, writeRawResponse, writeResponse, type BodyState } from './http.ts';
import { errorSummary, loggablePath, silentLogger, type Logger } from './log.ts';
import { BoardHub, ticketOf } from './realtime.ts';
import { CRON, QuarterHourScheduler } from './scheduler.ts';
import { FileStore, openRuntimeDatabase } from './store/file-store.ts';
import { CACHE_NAMESPACE, dataLayout, FILES_BUCKET, type DataLayout } from './store/layout.ts';
import { acquireServerLock } from './store/server-lock.ts';
import { applyMigrations, migrationStatus, readMigrationsDir, type Migration } from './store/migrations.ts';
import { integrityProblems, openDatabase, type DatabaseSync } from './store/sqlite.ts';

declare const __WORK_MIGRATIONS__: Migration[] | undefined;

/** Migrations embedded by the build (src/node/build.mjs), else read from WORK_MIGRATIONS_DIR or ./migrations. */
export function bundledMigrations(): Migration[] {
  if (typeof __WORK_MIGRATIONS__ !== 'undefined') return __WORK_MIGRATIONS__;
  return readMigrationsDir(process.env.WORK_MIGRATIONS_DIR || 'migrations');
}

export interface Runtime {
  config: NodeConfig;
  layout: DataLayout;
  env: Env;
  hub: BoardHub;
  assets: StaticAssets;
  store: FileStore;
  kv: NodeKVNamespace;
  db: DatabaseSync;
  runtimeDb: DatabaseSync;
  tracker: WaitUntilTracker;
  migrationsApplied: string[];
  /** The Worker's fetch handler with the Node env and a tracked ExecutionContext. */
  fetch(request: Request): Promise<Response>;
  /** One cron run: the Worker's scheduled handler plus Node housekeeping; resolves when its waitUntil work is done. */
  scheduled(scheduledTime: number): Promise<void>;
  close(): void;
}

export interface RuntimeOptions {
  migrations?: Migration[];
  log?: Logger;
}

/**
 * The key that encrypts secrets saved in the founder console (the Brevo API key, the webhook token): a random file in
 * the data folder, created on first start and readable only by the server. It is not in the database, so a database
 * copy or export never holds a usable secret. SETTINGS_ENCRYPTION_KEY in the environment replaces it.
 */
export function settingsKey(root: string): string {
  const file = join(root, 'settings.key');
  try {
    const k = readFileSync(file, 'utf8').trim();
    if (Buffer.from(k, 'base64').length === 32) return k;
    throw new Error(`${file} is not a 32-byte base64 key`);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }
  const k = randomBytes(32).toString('base64');
  try {
    writeFileSync(file, k + '\n', { mode: 0o600, flag: 'wx' });
    return k;
  } catch (e) {
    // Another process wrote it first: use theirs.
    if ((e as NodeJS.ErrnoException).code === 'EEXIST') return readFileSync(file, 'utf8').trim();
    throw e;
  }
}

export function createRuntime(config: NodeConfig, options: RuntimeOptions = {}): Runtime {
  const log = options.log ?? silentLogger;
  const layout = dataLayout(config.dataDir);
  mkdirSync(layout.root, { recursive: true, mode: 0o700 });
  const db = openDatabase(layout.db);
  const problems = integrityProblems(db, true);
  if (problems.length) {
    db.close();
    throw new Error(`db.sqlite failed its integrity check: ${problems.slice(0, 5).join('; ')}`);
  }
  let migrationsApplied: string[];
  try {
    const migrations = options.migrations ?? bundledMigrations();
    // Before changing an existing database, keep a transaction-consistent copy of it on the same volume
    // (pre-migration-backups/, the newest five kept). Restoring it: docs/deployment/fly-deployment.md.
    const status = migrationStatus(db, migrations);
    if (status.pending.length && status.applied.length) {
      const dir = join(layout.root, 'pre-migration-backups');
      mkdirSync(dir, { recursive: true, mode: 0o700 });
      const file = join(dir, `db-before-${status.pending[0].replace(/\.sql$/, '')}-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`);
      db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
      log({ event: 'pre_migration_backup', file, pending: status.pending });
      const old = readdirSync(dir).filter((f) => f.startsWith('db-before-') && f.endsWith('.sqlite')).sort((a, b) => statSync(join(dir, b)).mtimeMs - statSync(join(dir, a)).mtimeMs);
      for (const f of old.slice(5)) rmSync(join(dir, f), { force: true });
    }
    migrationsApplied = applyMigrations(db, migrations);
  } catch (e) {
    db.close();
    throw e;
  }
  const runtimeDb = openRuntimeDatabase(layout.runtime);
  const store = new FileStore(layout.files, runtimeDb);
  const kv = new NodeKVNamespace(runtimeDb, CACHE_NAMESPACE);
  const hub = new BoardHub();
  const assets = new StaticAssets(config.staticDir, log);
  const tracker = new WaitUntilTracker(log);
  const startedAt = new Date().toISOString();

  const env: Env = {
    DB: new NodeD1Database(db),
    FILES: new NodeR2Bucket(store, FILES_BUCKET),
    CACHE: kv,
    ASSETS: assets.binding,
    BOARD_ROOMS: hub.namespace,
    RUNTIME: 'node',
    SETTINGS_ENCRYPTION_KEY: config.vars.SETTINGS_ENCRYPTION_KEY ?? settingsKey(layout.root),
    ...config.vars,
    ...(config.version ? { CF_VERSION_METADATA: { id: config.version, tag: config.version, timestamp: startedAt } } : {}),
  };

  return {
    config,
    layout,
    env,
    hub,
    assets,
    store,
    kv,
    db,
    runtimeDb,
    tracker,
    migrationsApplied,
    fetch: (request) => worker.fetch(request, env, tracker.context()),
    async scheduled(scheduledTime) {
      const own = new WaitUntilTracker(log);
      await worker.scheduled({ scheduledTime, cron: CRON, noRetry() {} } as ScheduledController, env, own.context());
      await own.drain();
      kv.purgeExpired();
      await store.cleanTemp(60 * 60_000);
    },
    close() {
      db.close();
      runtimeDb.close();
    },
  };
}

export interface RunningServer {
  runtime: Runtime;
  url: string;
  port: number;
  /** Graceful stop: stop accepting, close sockets, wait for requests and waitUntil work (up to the shutdown timeout), close the databases. */
  close(): Promise<void>;
}

export interface ServerOptions extends RuntimeOptions {
  /** Interval of WebSocket protocol pings that detect dead connections. */
  heartbeatMs?: number;
}

const WS_HANDSHAKE_KEY = /^[A-Za-z0-9+/]{22}==$/;

export async function startServer(config: NodeConfig, options: ServerOptions = {}): Promise<RunningServer> {
  const log = options.log ?? silentLogger;
  mkdirSync(config.dataDir, { recursive: true, mode: 0o700 });
  const lock = acquireServerLock(config.dataDir);
  const releaseLock = lock.release;
  if (lock.previous) log({ event: 'lock_taken_over', previousPid: lock.previous.pid, previousStartedAt: lock.previous.startedAt, note: 'server.lock named a live process; if another server really uses this folder, stop one of them' });
  let runtime: Runtime;
  try {
    runtime = createRuntime(config, options);
  } catch (e) {
    releaseLock();
    throw e;
  }
  const bridge = { trustProxy: config.trustProxy, maxBodyBytes: config.maxBodyBytes };
  let inflight = 0;

  const secured = (res: Response, path: string) => {
    let req: Request;
    try {
      req = new Request(`http://node.invalid${path.startsWith('/') ? path : '/'}`);
    } catch {
      req = new Request('http://node.invalid/');
    }
    return withSecurityHeaders(res, req);
  };

  const server = createServer({ requestTimeout: 300_000, headersTimeout: 66_000, keepAliveTimeout: 65_000 }, (req, res) => {
    void handle(req, res);
  });
  server.keepAliveTimeout = 65_000;

  async function handle(req: IncomingMessage, res: ServerResponse) {
    const started = performance.now();
    const method = (req.method ?? 'GET').toUpperCase();
    let path = (req.url ?? '/').split('?')[0];
    let status = 500;
    inflight++;
    try {
      let response: Response;
      let body: BodyState | undefined;
      try {
        const built = toFetchRequest(req, bridge);
        path = built.url.pathname;
        body = built.body;
        response = await runtime.fetch(built.request);
        if (body.tooLarge) {
          await response.body?.cancel().catch(() => {});
          response = await secured(problemResponse(413, 'Request body is too large'), path);
        } else if (ticketOf(response)) {
          response = await secured(problemResponse(426, 'Expected a WebSocket upgrade'), path);
        }
      } catch (e) {
        if (e instanceof HttpProblem) response = await secured(problemResponse(e.status, e.message), path);
        else {
          log({ event: 'request_failed', method, path: loggablePath(path), ...errorSummary(e) });
          response = await secured(problemResponse(500, 'Internal server error'), path);
        }
      }
      status = response.status;
      if (body?.tooLarge || status === 413) res.setHeader('Connection', 'close');
      await writeResponse(res, response, method);
    } catch (e) {
      log({ event: 'response_failed', method, path: loggablePath(path), ...errorSummary(e) });
      res.destroy();
    } finally {
      inflight--;
      log({ method, path: loggablePath(path), status, ms: Math.round((performance.now() - started) * 10) / 10 });
    }
  }

  const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 * 1024, perMessageDeflate: false, clientTracking: false });
  const alive = new WeakSet<WebSocket>();
  const sockets = new Set<WebSocket>();

  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    void upgrade(req, socket, head);
  });

  async function upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    const started = performance.now();
    let path = (req.url ?? '/').split('?')[0];
    let status = 500;
    inflight++;
    socket.on('error', () => {});
    try {
      if ((req.headers.upgrade ?? '').toLowerCase() !== 'websocket' || req.method !== 'GET') {
        status = 400;
        await writeRawResponse(socket, await secured(problemResponse(400, 'Unsupported upgrade'), path));
        return;
      }
      const { request, url } = toFetchRequest(req, bridge);
      path = url.pathname;
      const response = await runtime.fetch(request);
      const ticket = ticketOf(response);
      const key = req.headers['sec-websocket-key'];
      if (ticket && response.status === 101) {
        if (typeof key !== 'string' || !WS_HANDSHAKE_KEY.test(key) || req.headers['sec-websocket-version'] !== '13') {
          status = 400;
          await writeRawResponse(socket, await secured(problemResponse(400, 'Invalid WebSocket handshake'), path));
          return;
        }
        status = 101;
        wss.handleUpgrade(req, socket, head, (ws) => {
          alive.add(ws);
          sockets.add(ws);
          ws.on('pong', () => alive.add(ws));
          ws.on('close', () => sockets.delete(ws));
          runtime.hub.attach(ticket.room, ws);
        });
        return;
      }
      status = response.status;
      await writeRawResponse(socket, response);
    } catch (e) {
      status = e instanceof HttpProblem ? e.status : 500;
      if (!(e instanceof HttpProblem)) log({ event: 'upgrade_failed', path: loggablePath(path), ...errorSummary(e) });
      await writeRawResponse(socket, await secured(problemResponse(status, e instanceof HttpProblem ? e.message : 'Internal server error'), path)).catch(() =>
        socket.destroy(),
      );
    } finally {
      inflight--;
      log({ method: 'GET', path: loggablePath(path), status, ms: Math.round((performance.now() - started) * 10) / 10, websocket: true });
    }
  }

  const heartbeat = setInterval(() => {
    for (const ws of sockets) {
      if (!alive.has(ws)) {
        ws.terminate();
        continue;
      }
      alive.delete(ws);
      try {
        ws.ping();
      } catch {
        /* closing */
      }
    }
  }, options.heartbeatMs ?? 30_000);
  heartbeat.unref();

  const scheduler = new QuarterHourScheduler((t) => runtime.scheduled(t), log);
  if (config.cron) scheduler.start();

  const listen = (host: string) =>
    new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(config.port, host, () => {
        server.off('error', reject);
        resolve();
      });
    });
  try {
    try {
      await listen(config.host);
    } catch (e) {
      // "::" (the default) needs IPv6; on a host without it, listen on every IPv4 address instead.
      if (config.host !== '::' || (e as NodeJS.ErrnoException).code !== 'EAFNOSUPPORT') throw e;
      log({ event: 'listen_fallback', from: '::', to: '0.0.0.0', reason: 'IPv6 is not available' });
      await listen('0.0.0.0');
    }
  } catch (e) {
    clearInterval(heartbeat);
    await scheduler.stop();
    runtime.close();
    releaseLock();
    throw e;
  }
  const address = server.address() as AddressInfo;
  const hostForUrl = address.family === 'IPv6' ? `[${address.address === '::' ? '::1' : address.address}]` : address.address === '0.0.0.0' ? '127.0.0.1' : address.address;

  let closing: Promise<void> | null = null;
  const close = () => {
    closing ??= (async () => {
      const deadline = Date.now() + config.shutdownTimeoutMs;
      server.close();
      server.closeIdleConnections();
      clearInterval(heartbeat);
      const schedulerStopped = scheduler.stop(deadline);
      runtime.hub.closeAll(1001, 'Server shutting down');
      while (inflight > 0 && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 20));
        server.closeIdleConnections();
      }
      await runtime.tracker.drain(deadline);
      await schedulerStopped;
      runtime.hub.terminateAll();
      for (const ws of sockets) ws.terminate();
      server.closeAllConnections();
      wss.close();
      log({ event: 'stopped', pendingRequests: inflight, pendingBackgroundTasks: runtime.tracker.size });
      runtime.close();
      releaseLock();
    })();
    return closing;
  };

  return { runtime, url: `http://${hostForUrl}:${address.port}`, port: address.port, close };
}
