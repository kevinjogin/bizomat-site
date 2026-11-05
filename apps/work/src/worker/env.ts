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
  // Secrets (set with `wrangler secret put`), all optional:
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  CF_VERSION_METADATA?: { id: string; tag: string; timestamp: string };
  /** Set to 'node' by the Node runtime (src/node/runtime.ts); absent on Cloudflare. */
  RUNTIME?: 'node';
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
