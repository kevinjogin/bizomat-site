import type { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { describe, expect, it } from 'vitest';
import { HttpProblem, requestHeaders, requestUrl } from '../src/node/http.ts';
import { loggablePath } from '../src/node/log.ts';

function fakeRequest(url: string, headers: Record<string, string>, remoteAddress = '203.0.113.9'): IncomingMessage {
  const socket = new Socket();
  Object.defineProperty(socket, 'remoteAddress', { value: remoteAddress });
  return { url, method: 'GET', headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])), socket } as unknown as IncomingMessage;
}

describe('request URL', () => {
  it('uses the Host header and the socket scheme without a trusted proxy', () => {
    const req = fakeRequest('/api/health?x=1', { Host: 'work.example.com', 'X-Forwarded-Host': 'evil.example', 'X-Forwarded-Proto': 'https' });
    expect(requestUrl(req, false).toString()).toBe('http://work.example.com/api/health?x=1');
  });

  it('uses X-Forwarded-Host and X-Forwarded-Proto behind the trusted proxy', () => {
    const req = fakeRequest('/w/1', { Host: '10.0.0.5:8002', 'X-Forwarded-Host': 'work.example.com', 'X-Forwarded-Proto': 'https' });
    expect(requestUrl(req, true).toString()).toBe('https://work.example.com/w/1');
    expect(requestUrl(fakeRequest('/', { Host: 'a.test', 'X-Forwarded-Proto': 'gopher' }), true).protocol).toBe('http:');
  });

  it('keeps the host fixed whatever the request target says', () => {
    expect(requestUrl(fakeRequest('//evil.example/x', { Host: 'work.example.com' }), false).host).toBe('work.example.com');
    expect(requestUrl(fakeRequest('http://evil.example/y?z=1', { Host: 'work.example.com' }), false).toString()).toBe('http://work.example.com/y?z=1');
    expect(requestUrl(fakeRequest('/a/../b', { Host: 'w.test' }), false).pathname).toBe('/b');
  });

  it('refuses missing or malformed hosts', () => {
    for (const host of ['', 'bad host', 'a/b', 'x@y', 'evil.example/..']) {
      expect(() => requestUrl(fakeRequest('/', { Host: host }), false), host).toThrow(HttpProblem);
    }
    expect(requestUrl(fakeRequest('/', { Host: '[::1]:8002' }), false).host).toBe('[::1]:8002');
  });
});

describe('client address headers', () => {
  it('replaces spoofed addresses with the socket address without a trusted proxy', () => {
    const h = requestHeaders(fakeRequest('/', { Host: 'a', 'CF-Connecting-IP': '1.1.1.1', 'X-Forwarded-For': '2.2.2.2', 'X-Real-IP': '3.3.3.3', 'True-Client-IP': '4.4.4.4' }, '::ffff:198.51.100.7'), false);
    expect(h.get('cf-connecting-ip')).toBe('198.51.100.7');
    expect(h.get('x-forwarded-for')).toBe('198.51.100.7');
    expect(h.get('x-real-ip')).toBeNull();
    expect(h.get('true-client-ip')).toBeNull();
  });

  it('trusts CF-Connecting-IP from the platform proxy', () => {
    const h = requestHeaders(fakeRequest('/', { Host: 'a', 'CF-Connecting-IP': '1.1.1.1', 'X-Forwarded-For': '9.9.9.9, 1.1.1.1' }), true);
    expect(h.get('cf-connecting-ip')).toBe('1.1.1.1');
  });

  it('falls back to the last X-Forwarded-For hop, then the socket, behind the proxy', () => {
    expect(requestHeaders(fakeRequest('/', { Host: 'a', 'X-Forwarded-For': '6.6.6.6, 7.7.7.7' }), true).get('cf-connecting-ip')).toBe('7.7.7.7');
    expect(requestHeaders(fakeRequest('/', { Host: 'a' }, '10.1.2.3'), true).get('cf-connecting-ip')).toBe('10.1.2.3');
  });

  it('drops hop-by-hop headers and keeps cookies whole', () => {
    const h = requestHeaders(fakeRequest('/', { Host: 'a', Connection: 'keep-alive', 'Keep-Alive': 'timeout=5', Cookie: 'a=1; b=2', Upgrade: 'websocket' }), false);
    expect(h.get('connection')).toBeNull();
    expect(h.get('keep-alive')).toBeNull();
    expect(h.get('cookie')).toBe('a=1; b=2');
    expect(h.get('upgrade')).toBe('websocket');
  });
});

describe('loggable paths', () => {
  it('never logs invitation tokens or other long secrets', () => {
    expect(loggablePath('/invite/abcDEF123_-xyz')).toBe('/invite/:token');
    expect(loggablePath('/api/auth/invitations/abcDEF123_-xyz/accept')).toBe('/api/auth/invitations/:token/accept');
    expect(loggablePath('/api/boards/AbCdEfGhIjKlMnOp')).toBe('/api/boards/AbCdEfGhIjKlMnOp');
    expect(loggablePath('/api/x/AbCdEfGhIjKlMnOpQrStUvWxYz0123456789abcd')).toBe('/api/x/:redacted');
  });
});
