// Entry point of the Node runtime: `node dist/node/server.mjs`.
// Configuration comes from environment variables (src/node/config.ts,
// docs/NODE-RUNTIME.md). SIGTERM / SIGINT stop it gracefully; a second signal
// exits at once.

import { ConfigError, configFromEnv } from './config.ts';
import { errorSummary, jsonLogger as log } from './log.ts';
import { installOutboundGuard } from './outbound.ts';
import { startServer, type RunningServer } from './runtime.ts';

// workerd logs a rejected promise nobody handled and carries on; Node would
// exit. Keep the Worker's behaviour.
process.on('unhandledRejection', (reason) => log({ event: 'unhandled_rejection', ...errorSummary(reason) }));

let running: RunningServer | null = null;
let stopping = false;

async function stop(reason: string, code: number) {
  if (stopping) {
    log({ event: 'forced_exit', reason });
    process.exit(code || 1);
  }
  stopping = true;
  log({ event: 'shutdown', reason });
  try {
    await running?.close();
  } catch (e) {
    log({ event: 'shutdown_failed', ...errorSummary(e) });
    code = code || 1;
  }
  process.exit(code);
}

process.on('uncaughtException', (e) => {
  log({ event: 'uncaught_exception', ...errorSummary(e) });
  void stop('uncaught exception', 1);
});
for (const signal of ['SIGTERM', 'SIGINT'] as const) process.on(signal, () => void stop(signal, 0));

try {
  const config = configFromEnv();
  installOutboundGuard();
  running = await startServer(config, { log });
  const r = running.runtime;
  log({
    event: 'listening',
    host: config.host,
    port: running.port,
    environment: config.vars.ENVIRONMENT,
    version: config.version,
    trustProxy: config.trustProxy,
    cron: config.cron,
    migrationsApplied: r.migrationsApplied,
    staticFiles: r.assets.size,
  });
  void r.assets.precompress();
} catch (e) {
  if (e instanceof ConfigError) log({ event: 'config_error', message: e.message });
  else log({ event: 'startup_failed', ...errorSummary(e) });
  process.exit(1);
}
