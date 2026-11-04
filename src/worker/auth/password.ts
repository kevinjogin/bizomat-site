// PBKDF2-SHA256 password hashing via WebCrypto (Workers cap: 100k iterations).
import { timingSafeEqual } from '../lib/util';

const ITERATIONS = 100_000;

function b64(bytes: ArrayBuffer | Uint8Array): string {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const x of u) s += String.fromCharCode(x);
  return btoa(s);
}

function unb64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password.normalize('NFKC')), 'PBKDF2', false, [
    'deriveBits',
  ]);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(hash)}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) {
    // Spend comparable time to avoid user-enumeration timing differences.
    await derive(password, new Uint8Array(16), ITERATIONS);
    return false;
  }
  const [scheme, iter, salt, hash] = stored.split('$');
  if (scheme !== 'pbkdf2' || !iter || !salt || !hash) return false;
  const actual = await derive(password, unb64(salt), Number(iter));
  return timingSafeEqual(b64(actual), hash);
}

export function passwordProblems(password: string, email?: string): string | null {
  if (typeof password !== 'string' || password.length < 10) return 'Password must be at least 10 characters';
  if (password.length > 256) return 'Password is too long';
  if (!/[a-zA-Z]/.test(password) || !/[0-9\W_]/.test(password)) {
    return 'Password must contain letters and at least one number or symbol';
  }
  const local = email?.split('@')[0]?.toLowerCase() ?? '';
  if (local.length >= 4 && password.toLowerCase().includes(local)) return 'Password must not contain your email name';
  return null;
}
