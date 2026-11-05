#!/usr/bin/env node
// BIZOMAT edge proxy: entry point (`node server.mjs`; the image runs it as the bzproxy user through
// infrastructure/fly/entrypoint.sh proxy). Settings: config.mjs. Routing: routes.mjs.
//
// SIGTERM or SIGINT (Fly's kill signal): stop taking connections, let open requests finish for up to
// PROXY_SHUTDOWN_GRACE_MS, then close what is left (long polls and WebSockets reconnect) and exit 0.
// A second signal exits at once.

import { loadConfig } from './config.mjs';
import { createProxy, defaultLog, listen } from './proxy.mjs';

function note(message, extra = {}) {
  process.stdout.write(`${JSON.stringify({ t: new Date().toISOString(), msg: message, ...extra })}\n`);
}

let config;
try {
  config = loadConfig();
} catch (err) {
  process.stderr.write(`bizomat-proxy: ${err.message}\n`);
  process.exit(64);
}

const proxy = createProxy(config, { log: defaultLog });

// An unexpected exception in one request must not drop every other connection (long polls, WebSockets).
// Log it and carry on; if they keep coming, exit so the Machine's restart policy starts a clean process.
let faults = [];
process.on('uncaughtException', (err) => {
  const now = Date.now();
  faults = faults.filter((t) => now - t < 60_000);
  faults.push(now);
  note('uncaught exception', { err: err && (err.code || err.name), stack: String(err && err.stack).split('\n').slice(0, 6).join(' | ') });
  if (faults.length > 20) process.exit(70);
});
process.on('unhandledRejection', (err) => {
  note('unhandled rejection', { err: err && (err.code || err.name) });
});

let stopping = false;
async function stop(signal) {
  if (stopping) {
    note('second signal: exiting now', { signal });
    process.exit(1);
  }
  stopping = true;
  note('stopping', { signal, ...proxy.stats(), graceMs: config.shutdownGraceMs });
  await proxy.close();
  note('stopped');
  process.exit(0);
}
process.on('SIGTERM', () => stop('SIGTERM'));
process.on('SIGINT', () => stop('SIGINT'));

try {
  const addr = await listen(proxy.server, config.port, config.host);
  note('listening', {
    address: addr && addr.address,
    port: addr && addr.port,
    clientIpMode: config.trust.mode,
    previewRouting: config.previewRouting,
    version: config.version,
  });
} catch (err) {
  process.stderr.write(`bizomat-proxy: cannot listen on port ${config.port}: ${err.code || err.message}\n`);
  process.exit(71);
}
