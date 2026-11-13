// Mailbox synchronisation (Gmail, Microsoft 365): the integration layer, switched off until configured.
//
// What works today without it: emails are written in the person's own mail program (the CRM opens it with the message
// and the template filled in) and logged on the customer's timeline; every logged email is marked "logged", never
// "sent" or "synchronised".
//
// To switch a provider on, an administrator of the BIZOMAT platform must register an OAuth client with the provider and
// set its credentials as secrets of the work process:
//   Gmail:     CRM_GOOGLE_CLIENT_ID, CRM_GOOGLE_CLIENT_SECRET (scope https://www.googleapis.com/auth/gmail.readonly and
//              gmail.send; Google requires app verification for these scopes)
//   Microsoft: CRM_MICROSOFT_CLIENT_ID, CRM_MICROSOFT_CLIENT_SECRET (Graph scopes Mail.Read, Mail.Send, offline_access)
// and implement the provider below (authorise URL, token exchange with PKCE and state cookie as in
// src/worker/auth/providers.ts, refresh, message listing by contact address, sending). Tokens are then stored in
// crm_mail_connections.token_ciphertext, encrypted with AES-256-GCM under SETTINGS_ENCRYPTION_KEY (the same key as the
// founder console's secrets, src/worker/services/email/settings.ts), never returned to the browser, and the sync runs
// in the 15-minute maintenance run with a per-connection cursor. Until then, no button offers it.

import type { Env } from '../env';

export interface MailboxProviderInfo {
  id: 'gmail' | 'microsoft';
  name: string;
  configured: boolean;
  /** What is missing, in plain words, when it is not configured. */
  requirement: string;
}

export interface MailboxProvider {
  info(env: Env): MailboxProviderInfo;
  /** The provider's consent screen for one person (PKCE, state bound to a cookie). */
  authorizeUrl?(env: Env, opts: { state: string; codeChallenge: string; redirectUri: string }): string;
  /** Exchange the code, returning encrypted tokens and the account address. */
  exchange?(env: Env, opts: { code: string; codeVerifier: string; redirectUri: string }): Promise<{ accountEmail: string; tokenCiphertext: string; scopes: string }>;
  /** Messages to or from the given addresses since the cursor. */
  sync?(env: Env, connection: { tokenCiphertext: string; cursor: string | null }, addresses: string[]): Promise<{ messages: { id: string; from: string; to: string[]; subject: string; sentAt: number; snippet: string }[]; cursor: string }>;
}

type SecretEnv = Env & Record<string, string | undefined>;

const gmail: MailboxProvider = {
  info: (env) => {
    const e = env as SecretEnv;
    return { id: 'gmail', name: 'Gmail and Google Workspace', configured: false, requirement: e.CRM_GOOGLE_CLIENT_ID ? 'The Gmail connector is not implemented in this release.' : 'Needs a Google OAuth client with Gmail access (CRM_GOOGLE_CLIENT_ID and CRM_GOOGLE_CLIENT_SECRET) and Google app verification.' };
  },
};

const microsoft: MailboxProvider = {
  info: (env) => {
    const e = env as SecretEnv;
    return { id: 'microsoft', name: 'Outlook and Microsoft 365', configured: false, requirement: e.CRM_MICROSOFT_CLIENT_ID ? 'The Microsoft 365 connector is not implemented in this release.' : 'Needs a Microsoft Entra app registration with Graph mail permissions (CRM_MICROSOFT_CLIENT_ID and CRM_MICROSOFT_CLIENT_SECRET).' };
  },
};

export const MAILBOX_PROVIDERS: MailboxProvider[] = [gmail, microsoft];

export function mailboxStatus(env: Env): MailboxProviderInfo[] {
  return MAILBOX_PROVIDERS.map((p) => p.info(env));
}
