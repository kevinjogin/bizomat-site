// BIZOMAT edge proxy: the few answers the proxy writes itself (gateway errors, unknown hosts).
// Plain HTML for browsers, plain text for everything else. No script, no style, nothing loaded from anywhere:
// the Content-Security-Policy below forbids it all.

const MESSAGES = {
  400: ['Bad request', 'The request could not be read.'],
  404: ['Not found', 'There is nothing at this address.'],
  405: ['Method not allowed', 'This address does not accept that request.'],
  421: ['Unknown address', 'This address is not served here.'],
  502: ['Service unavailable', 'This service is not answering right now. Please try again in a minute.'],
  503: ['Service unavailable', 'This service is restarting. Please try again in a minute.'],
  504: ['Service timed out', 'This service took too long to answer. Please try again.'],
};

export const PAGE_CSP = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** True when the client prefers a page (a browser navigation). */
export function wantsHtml(accept) {
  return typeof accept === 'string' && /\btext\/html\b/i.test(accept);
}

/**
 * The body and headers of a proxy-made answer.
 * @returns {{status: number, headers: object, body: Buffer}}
 */
export function errorPage(status, { html = false, retryAfter } = {}) {
  const [title, text] = MESSAGES[status] || ['Error', 'Something went wrong.'];
  const body = html
    ? `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n<title>${escapeHtml(title)} | BIZOMAT</title>\n</head>\n<body>\n<main>\n<p><strong>BIZOMAT</strong></p>\n<h1>${escapeHtml(title)}</h1>\n<p>${escapeHtml(text)}</p>\n<p>Error ${status}</p>\n</main>\n</body>\n</html>\n`
    : `BIZOMAT: ${title} (${status}). ${text}\n`;
  const buf = Buffer.from(body, 'utf8');
  const headers = {
    'Content-Type': html ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8',
    'Content-Length': String(buf.length),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': PAGE_CSP,
    'Referrer-Policy': 'no-referrer',
  };
  if (retryAfter) headers['Retry-After'] = String(retryAfter);
  return { status, headers, body: buf };
}

/** A complete HTTP/1.1 response as bytes, for a raw socket (an upgrade request the proxy refuses itself). */
export function rawResponse(status, statusText, headers, body = Buffer.alloc(0)) {
  const lines = [`HTTP/1.1 ${status} ${statusText}`];
  for (const [name, value] of Object.entries(headers)) lines.push(`${name}: ${value}`);
  if (!Object.keys(headers).some((h) => h.toLowerCase() === 'content-length')) lines.push(`Content-Length: ${body.length}`);
  lines.push('Connection: close', '', '');
  return Buffer.concat([Buffer.from(lines.join('\r\n'), 'latin1'), body]);
}
