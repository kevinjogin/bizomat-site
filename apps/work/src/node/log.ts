// Structured logs for the Node runtime: one JSON object per line on stdout.
// Request lines carry method, path (no query string, secrets in the path
// replaced), status and duration only: no IP addresses, headers or bodies.

export type LogFields = Record<string, unknown>;
export type Logger = (fields: LogFields) => void;

export const jsonLogger: Logger = (fields) => {
  process.stdout.write(`${JSON.stringify({ t: new Date().toISOString(), ...fields })}\n`);
};

export const silentLogger: Logger = () => {};

const TOKEN_ROUTES: [RegExp, string][] = [
  [/^\/invite\/[^/]+/, '/invite/:token'],
  [/^\/api\/auth\/invitations\/[^/]+/, '/api/auth/invitations/:token'],
];

/**
 * The path as it may be logged: invitation tokens are replaced, and so is any
 * other segment long enough to be a secret (ids are 16 characters, bearer
 * tokens 32 bytes or more).
 */
export function loggablePath(pathname: string): string {
  let p = pathname.length > 512 ? pathname.slice(0, 512) : pathname;
  for (const [re, replacement] of TOKEN_ROUTES) p = p.replace(re, replacement);
  return p
    .split('/')
    .map((seg) => (seg.length >= 32 && /^[A-Za-z0-9_\-.%=+]+$/.test(seg) ? ':redacted' : seg))
    .join('/');
}

/** Error summary for logs: name and a short message, never a stack or request data. */
export function errorSummary(e: unknown): { error: string; message: string } {
  if (e instanceof Error) return { error: e.name, message: e.message.slice(0, 300) };
  return { error: typeof e, message: String(e).slice(0, 300) };
}
