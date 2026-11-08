// What the Worker hands the container: its environment, and the answer while it cannot start.
import { describe, expect, it } from 'vitest';
import { PERSIST_HOST } from '../src/persist';
import { forServer, FROM_FLY, isPaused, PASSED, PAUSED_DETAIL, serverEnv, unavailable, WORKER_HEALTH } from '../src/settings';

describe('server environment', () => {
  it('always points the server at the data store and the edge address header', () => {
    expect(serverEnv({})).toEqual({
      OPENSKETCH_DATA: '/data',
      OPENSKETCH_PERSIST_URL: `http://${PERSIST_HOST}`,
      OPENSKETCH_CLIENT_IP_HEADER: 'cf-connecting-ip',
    });
  });

  it('passes the listed settings, trimmed, and nothing else', () => {
    const env = serverEnv({
      OPENSKETCH_PUBLIC_URL: ' https://bizomat.ai/cad ',
      OPENSKETCH_MCP_URL: 'https://mcp.bizomat.ai/mcp',
      OPENSKETCH_REDIRECT_HOSTS: 'mcp.bizomat.ai,cados.kevos.com',
      OPENSKETCH_ACCESS_CODE: '   ', // blank: left out, so the server's own setting applies
      OPENSKETCH_VERSION: 'abc1234',
      OPENSKETCH_DEBUG_ANYTHING: 'never passed', // not in the list
      DATA: { get() {} }, // a binding, not a setting
      CAD: {},
    });
    expect(env.OPENSKETCH_PUBLIC_URL).toBe('https://bizomat.ai/cad');
    expect(env.OPENSKETCH_MCP_URL).toBe('https://mcp.bizomat.ai/mcp');
    expect(env.OPENSKETCH_REDIRECT_HOSTS).toBe('mcp.bizomat.ai,cados.kevos.com');
    expect(env.OPENSKETCH_VERSION).toBe('abc1234');
    expect(env).not.toHaveProperty('OPENSKETCH_ACCESS_CODE');
    expect(env).not.toHaveProperty('OPENSKETCH_DEBUG_ANYTHING');
    expect(env).not.toHaveProperty('OPENSKETCH_PASSWORD'); // not set here: a fresh server has none
    expect(env).not.toHaveProperty('DATA');
    expect(Object.keys(env).every((k) => k.startsWith('OPENSKETCH_'))).toBe(true);
  });

  it('passes the secrets a Fly server may have, when they are set as Worker secrets', () => {
    const env = serverEnv({ OPENSKETCH_PASSWORD: 'seed', OPENSKETCH_KEY_SECRET: 'k', GOOGLE_CLIENT_ID: 'id',
      GOOGLE_CLIENT_SECRET: 's', OPENSKETCH_MCP_TOKEN: 't', OPENSKETCH_ADDIN_URL: 'https://bizomat.ai/x' });
    expect(env).toMatchObject({ OPENSKETCH_PASSWORD: 'seed', OPENSKETCH_KEY_SECRET: 'k', GOOGLE_CLIENT_ID: 'id',
      GOOGLE_CLIENT_SECRET: 's', OPENSKETCH_MCP_TOKEN: 't', OPENSKETCH_ADDIN_URL: 'https://bizomat.ai/x' });
    for (const k of FROM_FLY) expect(PASSED).toContain(k);
  });

  it('does not let a passed setting replace the data store or the address header', () => {
    expect(PASSED).not.toContain('OPENSKETCH_DATA');
    expect(PASSED).not.toContain('OPENSKETCH_PERSIST_URL');
    expect(PASSED).not.toContain('OPENSKETCH_CLIENT_IP_HEADER');
    expect(PASSED).not.toContain('OPENSKETCH_PERSIST_EMPTY_OK');
  });

  it('keeps the Worker health path away from the server paths', () => {
    expect(WORKER_HEALTH.startsWith('/__worker/')).toBe(true);
  });
});

describe('what the server is told about the visitor', () => {
  it('states the scheme and host the visitor used, over anything a client sent', async () => {
    const r = forServer(new Request('https://mcp.bizomat.ai/mcp?x=1', {
      method: 'POST',
      body: '{"jsonrpc":"2.0"}',
      headers: { 'x-forwarded-proto': 'http', 'x-forwarded-host': 'evil.example', authorization: 'Bearer t', 'cf-connecting-ip': '203.0.113.7' },
    }));
    expect(r.headers.get('x-forwarded-proto')).toBe('https');
    expect(r.headers.get('x-forwarded-host')).toBe('mcp.bizomat.ai');
    expect(r.headers.get('authorization')).toBe('Bearer t');
    expect(r.headers.get('cf-connecting-ip')).toBe('203.0.113.7');
    expect(r.method).toBe('POST');
    expect(r.url).toBe('https://mcp.bizomat.ai/mcp?x=1');
    expect(await r.text()).toBe('{"jsonrpc":"2.0"}');
  });

  it('keeps the path the website Worker handed on', () => {
    const r = forServer(new Request('https://bizomat.ai/cad/login'));
    expect(r.headers.get('x-forwarded-host')).toBe('bizomat.ai');
    expect(new URL(r.url).pathname).toBe('/cad/login');
  });

  it('says http on a local run', () => {
    expect(forServer(new Request('http://127.0.0.1:8787/healthz')).headers.get('x-forwarded-proto')).toBe('http');
  });
});

describe('paused for maintenance', () => {
  it('only CAD_PAUSED=1 pauses', () => {
    expect(isPaused({ CAD_PAUSED: '1' })).toBe(true);
    expect(isPaused({ CAD_PAUSED: ' 1\n' })).toBe(true); // a secret typed or piped with a line end
    for (const v of [undefined, '', '0', 'true', 'yes', 1]) expect(isPaused({ CAD_PAUSED: v }), String(v)).toBe(false);
  });

  it('is not passed to the server', () => {
    expect(PASSED).not.toContain('CAD_PAUSED' as never);
    expect(serverEnv({ CAD_PAUSED: '1' })).not.toHaveProperty('CAD_PAUSED');
    expect(PAUSED_DETAIL).toMatch(/maintenance/);
  });
});

describe('while the server cannot start', () => {
  it('answers 503 with a retry time, never cached', async () => {
    const r = unavailable('the container could not be reached');
    expect(r.status).toBe(503);
    expect(r.headers.get('retry-after')).toBe('30');
    expect(r.headers.get('cache-control')).toBe('no-store');
    expect(r.headers.get('content-type')).toBe('application/json');
    const body = (await r.json()) as { error: string; detail: string };
    expect(body.detail).toBe('the container could not be reached');
    expect(body.error).toMatch(/starting or unavailable/);
    expect(body.error).not.toMatch(/OpenSketch|CADOS/);
  });
});
