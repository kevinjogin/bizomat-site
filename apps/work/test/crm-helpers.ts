// Helpers for the BIZOMAT CRM suites: organisations, invitations and waiting for automations (they run after the
// response, in waitUntil).
import { expect } from 'vitest';
import type { Client } from './helpers';

export async function createOrg(c: Client, name = 'ABC Engineering', extra: Record<string, unknown> = {}): Promise<string> {
  const r = await c.json('POST', '/api/crm/orgs', { name, currency: 'AUD', timezone: 'Australia/Sydney', ...extra });
  return r.id as string;
}

/** Invite `invitee` into `orgId` with a role and accept with the token from the link. */
export async function joinOrg(owner: Client, orgId: string, invitee: Client, role: 'admin' | 'manager' | 'sales' | 'member' | 'viewer' = 'member') {
  const inv = await owner.json('POST', `/api/crm/orgs/${orgId}/invitations`, { email: invitee.email, role });
  const token = tokenOf(inv.inviteUrl);
  await invitee.json('POST', `/api/crm/invitations/${token}/accept`, {});
  return inv;
}

export function tokenOf(url: string): string {
  return decodeURIComponent(url.split('/join/')[1]);
}

/** Retry until the check passes (automations finish after the response). */
export async function eventually<T>(fn: () => Promise<T>, check: (v: T) => boolean, tries = 40): Promise<T> {
  let last: T | undefined;
  for (let i = 0; i < tries; i++) {
    last = await fn();
    if (check(last)) return last;
    await new Promise((r) => setTimeout(r, 50));
  }
  expect(check(last as T), `condition not met; last value: ${JSON.stringify(last)?.slice(0, 500)}`).toBe(true);
  return last as T;
}

export const q = (query: unknown) => `query=${encodeURIComponent(JSON.stringify(query))}`;
