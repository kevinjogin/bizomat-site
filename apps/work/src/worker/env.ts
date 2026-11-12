export interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  CACHE: KVNamespace;
  ASSETS: Fetcher;
  BOARD_ROOMS: DurableObjectNamespace;
  ENVIRONMENT: string;
  APP_NAME: string;
  APP_URL: string;
  ALLOW_SIGNUP: string;
  SESSION_TTL_HOURS: string;
  /** Pages on other hosts answer 301 to the same path here, e.g. "https://bizomat.ai/tasks" (src/worker/mount.ts). */
  CANONICAL_URL?: string;
  /** Set per request, never configured: the path the request came in under ("/tasks"), or "" (src/worker/mount.ts). */
  BASE_PATH?: string;
  // Secrets (set with `wrangler secret put`), all optional:
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  CF_VERSION_METADATA?: { id: string; tag: string; timestamp: string };
  /** Set to 'node' by the Node runtime (src/node/runtime.ts); absent on Cloudflare. */
  RUNTIME?: 'node';
  // Email (docs/email/brevo-setup.md). All optional: without a provider, invitations show a link to share.
  /** 'brevo' (default when BREVO_API_KEY is set), 'log' (development: stored, never sent) or 'none'. */
  EMAIL_PROVIDER?: string;
  /** Secret. Brevo API key (v3), sent only in the api-key header to api.brevo.com. */
  BREVO_API_KEY?: string;
  /** Secret. The bearer token Brevo sends to the transactional webhook. */
  BREVO_WEBHOOK_TOKEN?: string;
  EMAIL_FROM_NAME?: string;
  EMAIL_FROM_ADDRESS?: string;
  EMAIL_REPLY_TO?: string;
  /** Public address for links in emails; APP_URL when unset. */
  APP_BASE_URL?: string;
  /** Messages handed to the provider per UTC day (default 250, under Brevo Free's 300). */
  EMAIL_DAILY_LIMIT?: string;
  /** Extra sends per day kept for invitations and security messages (default 40). */
  EMAIL_CRITICAL_RESERVE?: string;
  /** '1': Brevo accepts and drops every message (X-Sib-Sandbox: drop), for testing the integration. */
  EMAIL_SANDBOX?: string;
  /**
   * Secret: base64 of 32 bytes, encrypting secrets saved in the founder console (the Brevo key). The Node runtime
   * creates one in the data folder when none is set (src/node/runtime.ts).
   */
  SETTINGS_ENCRYPTION_KEY?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  /** Set by the founder's password reset or a security reset: only changing the password is allowed until then. */
  passwordResetRequired?: boolean;
}

export interface SessionInfo {
  id: string;
  csrfToken: string;
  provider: string;
  expiresAt: number;
}

export type AppVariables = {
  user: AuthUser;
  session: SessionInfo | null;
  authKind: 'session' | 'token';
  platformRole?: 'founder' | 'admin';
};

export type AppEnv = { Bindings: Env; Variables: AppVariables };
