// Authenticator-app codes (TOTP, RFC 6238 over HOTP, RFC 4226): HMAC-SHA1, 6 digits, 30-second steps, the defaults
// every authenticator app uses. WebCrypto only, so it runs the same on Workers and on Node.

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export const STEP_SECONDS = 30;
export const DIGITS = 6;

export function base32Encode(bytes: Uint8Array): string {
  let out = '';
  let bits = 0;
  let value = 0;
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text: string): Uint8Array {
  const clean = text.toUpperCase().replace(/[\s=-]/g, '');
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of clean) {
    const i = B32.indexOf(ch);
    if (i < 0) throw new Error('not base32');
    value = (value << 5) | i;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/** A new secret: 20 random bytes (160 bits, as RFC 4226 recommends), in base32 for the authenticator app. */
export function newSecret(): string {
  return base32Encode(crypto.getRandomValues(new Uint8Array(20)));
}

/** The HOTP code for a counter. */
export async function hotp(key: Uint8Array, counter: number, digits = DIGITS): Promise<string> {
  const msg = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const h = new Uint8Array(await crypto.subtle.sign('HMAC', k, msg));
  const o = h[h.length - 1] & 0x0f;
  const bin = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}

export const stepAt = (ms: number) => Math.floor(ms / 1000 / STEP_SECONDS);

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/**
 * The step a code belongs to, or null. One step of clock drift either way is accepted, and never a step at or before
 * `lastStep`, so the same code (or an older one) cannot be used twice.
 */
export async function matchStep(secret: string, code: string, nowMs: number, lastStep: number): Promise<number | null> {
  const clean = String(code ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean)) return null;
  let key: Uint8Array;
  try {
    key = base32Decode(secret);
  } catch {
    return null;
  }
  const s = stepAt(nowMs);
  for (const step of [s - 1, s, s + 1]) {
    if (step <= lastStep) continue;
    if (sameText(await hotp(key, step), clean)) return step;
  }
  return null;
}

/** The address an authenticator app reads from the QR code (otpauth://, the common Key URI format). */
export function otpauthUri(secret: string, account: string, issuer = 'BIZOMAT'): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}
