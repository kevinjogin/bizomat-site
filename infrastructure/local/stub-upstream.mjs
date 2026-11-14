#!/usr/bin/env node
// A stand-in backend for the local stack while a real one is not built yet (compose.stubs.yml).
// It answers the health paths of every app, echoes what reached it on /__stub/echo (to check the proxy's header
// hygiene end to end), accepts WebSockets on /__stub/ws, and says 404 to everything else. Never deployed.
// Under an application's path on bizomat.ai the same paths answer (/tasks/__stub/echo is /__stub/echo), as the real
// apps take their prefix off themselves; the echo shows the path exactly as it arrived.
//   STUB_NAME=web PORT=8003 node stub-upstream.mjs

import http from 'node:http';
import { createHash } from 'node:crypto';

const name = process.env.STUB_NAME || 'stub';
const port = Number(process.env.PORT || 8000);
const ownPath = (path) => path.replace(/^\/(?:cad|tasks|crm|finance|company|system)(?=\/)/, '');

const server = http.createServer((req, res) => {
  const url = new URL(ownPath(req.url), 'http://stub');
  const send = (status, body) => {
    const text = JSON.stringify(body);
    res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(text), 'X-Bizomat-Stub': name });
    res.end(req.method === 'HEAD' ? undefined : text);
  };
  req.resume();
  if (url.pathname === '/healthz' || url.pathname === '/api/health') return send(200, { ok: true, stub: name });
  if (url.pathname === '/__stub/echo') return send(200, { stub: name, method: req.method, url: req.url, headers: req.headers });
  return send(404, { stub: name, error: 'stand-in backend: not built yet' });
});

server.on('upgrade', (req, socket) => {
  socket.on('error', () => {});
  if (!ownPath(req.url).startsWith('/__stub/ws')) {
    socket.end('HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n');
    return;
  }
  const accept = createHash('sha1').update(`${req.headers['sec-websocket-key']}258EAFA5-E914-47DA-95CA-C5AB0DC11B65`).digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\nX-Bizomat-Stub: ${name}\r\n\r\n`);
  socket.on('data', () => {});
  setTimeout(() => socket.end(), 30_000).unref();
});

server.listen(port, '0.0.0.0', () => process.stdout.write(`stand-in ${name} on port ${port}\n`));
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => server.close(() => process.exit(0)));
