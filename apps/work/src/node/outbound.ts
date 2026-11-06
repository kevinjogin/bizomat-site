// Outbound fetch guard for the Node runtime.
//
// On Cloudflare a Worker's fetch() cannot reach the operator's private
// network. On a Fly Machine it could: the private network, the metadata
// address and loopback are reachable. The Worker already refuses non-https
// webhook URLs, IP literals and internal host names; this guard adds what the
// Cloudflare network gave for free by refusing destinations whose DNS
// answers are private, loopback, link-local or otherwise non-public.
// (A DNS answer can change between this check and the connection; https
// certificate checks still apply to the real connection.)

import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';

const blocked = new BlockList();
for (const [net, bits] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const)
  blocked.addSubnet(net, bits, 'ipv4');
for (const [net, bits] of [
  ['::', 128],
  ['::1', 128],
  // (IPv4-mapped ::ffff:a.b.c.d is checked as IPv4 below; a ::ffff:0:0/96 rule
  // here would also match every plain IPv4 address in Node's BlockList.)
  ['64:ff9b::', 96],
  ['100::', 64],
  ['2001:db8::', 32],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const)
  blocked.addSubnet(net, bits, 'ipv6');

export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return !blocked.check(address, 'ipv4');
  if (family === 6) {
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address);
    if (mapped) return !blocked.check(mapped[1], 'ipv4');
    const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(address);
    if (hex) {
      const hi = Number.parseInt(hex[1], 16);
      const lo = Number.parseInt(hex[2], 16);
      return !blocked.check(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`, 'ipv4');
    }
    return !blocked.check(address, 'ipv6');
  }
  return false;
}

type Resolver = (host: string) => Promise<string[]>;
const resolveAll: Resolver = async (host) => (await lookup(host, { all: true, verbatim: true })).map((a) => a.address);

/** Wraps fetch so requests to non-public destinations fail as a network error would. */
export function guardFetch(original: typeof fetch, resolver: Resolver = resolveAll): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      const host = url.hostname.replace(/^\[(.*)\]$/, '$1');
      const addresses = isIP(host) ? [host] : await resolver(host);
      if (addresses.length === 0 || !addresses.every(isPublicAddress)) {
        throw new TypeError('fetch failed', { cause: new Error('Destination address is not public') });
      }
    }
    return original(input, init);
  };
}

export function installOutboundGuard(): void {
  globalThis.fetch = guardFetch(globalThis.fetch.bind(globalThis));
}
