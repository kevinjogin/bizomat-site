// Small fetch wrapper for the SEO connectors: timeout, retries with exponential backoff on 429/5xx and
// network errors, and error messages that never include request bodies, headers or tokens.

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Remove anything that looks like a credential from a URL before it is logged. */
export function redact(url) {
  return String(url).replace(/([?&](?:apikey|key|token|access_token)=)[^&]+/gi, '$1REDACTED');
}

/**
 * fetchJson(url, options): JSON response or HttpError after retries.
 * options: { method, headers, body, retries = 3, timeoutMs = 30000, baseDelayMs = 1000, fetchImpl = fetch }
 */
export async function fetchJson(url, { retries = 3, timeoutMs = 30_000, baseDelayMs = 1_000, fetchImpl = globalThis.fetch, ...init } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (res.ok) {
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }
      const retryable = res.status === 429 || res.status >= 500;
      lastError = new HttpError(res.status, `${init.method ?? 'GET'} ${redact(url)} returned ${res.status}`);
      if (!retryable) throw lastError;
    } catch (error) {
      if (error instanceof HttpError && !(error.status === 429 || error.status >= 500)) throw error;
      lastError = error instanceof HttpError ? error : new HttpError(0, `${init.method ?? 'GET'} ${redact(url)} failed: ${error.name}`);
    }
    if (attempt < retries) await sleep(baseDelayMs * 2 ** attempt);
  }
  throw lastError;
}

/** A connector result that is honest about missing configuration or failure. */
export const skipped = (source, reason) => ({ source, status: 'UNKNOWN', reason, fetchedAt: new Date().toISOString() });
export const failed = (source, error) => ({ source, status: 'FAILED', reason: error.message, fetchedAt: new Date().toISOString() });
