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
  /**
   * Secret, optional: the Australian Business Register web services GUID (free from abr.business.gov.au). With it,
   * company registration looks the ABN up on the register; without it, only the ABN's check digits are checked
   * (src/worker/company/verify.ts).
   */
  ABR_GUID?: string;
  /**
   * Secret, optional: a Companies House API key (free from developer.company-information.service.gov.uk). With it, and
   * the registry checks switched on, United Kingdom company numbers are looked up (src/worker/company/verification.ts).
   */
  COMPANIES_HOUSE_API_KEY?: string;
  /**
   * Secret, optional: the BIZOMAT applications that may use BIZOMAT sign-in (src/worker/company/id-provider.ts), as
   * JSON: [{"id":"cad","name":"CAD Automation","secretSha256":"<hex>","redirectUris":["https://bizomat.ai/cad/..."]}].
   */
  BIZOMAT_ID_CLIENTS?: string;
  /**
   * Billing (src/worker/billing/config.ts, docs/billing/README.md). Billing is off unless the environment, a key of the
   * same environment, the publishable key, a webhook signing secret and the monthly per-user price are all set.
   * "test" or "live". Live only after the owner's explicit approval.
   */
  STRIPE_ENVIRONMENT?: string;
  /** Secret: a restricted key (rk_test_..., recommended) or secret key of the same environment. Server only. */
  STRIPE_SECRET_KEY?: string;
  /** pk_test_... or pk_live_...: sent to the billing page so it can show Stripe's embedded Checkout. */
  STRIPE_PUBLISHABLE_KEY?: string;
  /** Secret: the webhook destination's signing secret (whsec_...), and the previous one while it is rolled. */
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_WEBHOOK_SECRET_PREVIOUS?: string;
  /** The Stripe Price ids of the per-user price (price_...): monthly (required) and annual (optional). */
  STRIPE_PRICE_SEAT_MONTHLY?: string;
  STRIPE_PRICE_SEAT_ANNUAL?: string;
  /** How seat changes are charged: create_prorations (default), always_invoice or none. */
  STRIPE_PRORATION?: string;
  /** "on" turns on Stripe Tax: only once BIZOMAT's GST registration is recorded in Stripe. */
  STRIPE_AUTOMATIC_TAX?: string;
  /** Days of full access after a failed payment while enforcement is on (default 14). */
  STRIPE_GRACE_DAYS?: string;
  /** Development and tests only: a local stand-in for api.stripe.com (refused in production and in live). */
  STRIPE_API_BASE?: string;
  /** Free mode (Stage 1, owner 19 Nov 2026): "true" locks billing. Nobody can subscribe or be restricted for not
   * paying, whatever the console says; the webhook still records events (src/worker/billing/config.ts billingLocked). */
  BIZOMAT_BILLING_LOCK?: string;
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
  /** An API token's limits (platform/context.ts); null for sessions and for tokens made before R4. */
  tokenScope?: { companyId: string | null; apps: ('tasks' | 'crm' | 'finance' | 'erp' | 'company')[] | null; readOnly: boolean } | null;
};

export type AppEnv = { Bindings: Env; Variables: AppVariables };
