import { describe, expect, it } from 'vitest';
import { guardFetch, isPublicAddress, serviceOrigin } from '../src/node/outbound.ts';

describe('outbound fetch guard', () => {
  it('classifies addresses', () => {
    for (const a of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', '::', 'fe80::1', 'fdaa:0:1::3', '::ffff:127.0.0.1', '::ffff:10.0.0.1', '::ffff:7f00:1', '::ffff:a9fe:a9fe']) {
      expect(isPublicAddress(a), a).toBe(false);
    }
    for (const a of ['93.184.216.34', '1.1.1.1', '2606:4700:4700::1111', '::ffff:93.184.216.34']) expect(isPublicAddress(a), a).toBe(true);
  });

  it('refuses private destinations before connecting and lets public ones through', async () => {
    const calls: string[] = [];
    const original = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response('ok');
    }) as typeof fetch;
    const dns: Record<string, string[]> = { 'hooks.example.com': ['93.184.216.34'], 'internal.example.com': ['93.184.216.34', '10.0.0.8'], 'meta.example.com': ['169.254.169.254'] };
    const guarded = guardFetch(original, async (h) => dns[h] ?? []);
    expect(await (await guarded('https://hooks.example.com/x', { method: 'POST' })).text()).toBe('ok');
    for (const url of ['https://internal.example.com/', 'https://meta.example.com/', 'http://127.0.0.1:8002/', 'https://[::1]/', 'https://unknown.example.com/']) {
      await expect(guarded(url), url).rejects.toThrow('fetch failed');
    }
    expect(calls).toEqual(['https://hooks.example.com/x']);
  });

  it('lets the one configured private service through, and nothing else on that network', async () => {
    const calls: string[] = [];
    const original = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response('ok');
    }) as typeof fetch;
    const dns: Record<string, string[]> = { 'cados.internal': ['fdaa:0:1::3'], 'bizomat.internal': ['fdaa:0:1::4'] };
    const guarded = guardFetch(original, async (h) => dns[h] ?? [], serviceOrigin('http://cados.internal:8080'));
    expect(await (await guarded('http://cados.internal:8080/api/erp/v1/state', { method: 'POST' })).text()).toBe('ok');
    for (const url of ['http://cados.internal:8081/', 'https://cados.internal:8080/', 'http://bizomat.internal:8080/', 'http://169.254.169.254/']) {
      await expect(guarded(url), url).rejects.toThrow('fetch failed');
    }
    expect(calls).toEqual(['http://cados.internal:8080/api/erp/v1/state']);
    expect(serviceOrigin('')).toEqual([]);
    expect(serviceOrigin('ftp://cados.internal')).toEqual([]);
    expect(serviceOrigin('http://user:pw@cados.internal:8080')).toEqual([]);
    expect(serviceOrigin(' http://cados.internal:8080/ ')).toEqual(['http://cados.internal:8080']);
  });
});
