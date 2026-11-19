// scrypt password hashing for the Node server (Stage 1, audit S7). Memory-hard, at OWASP's recommended cost: N = 2^15,
// r = 8, p = 3 (32 MiB a hash, about a fifth of a second). Format: scrypt$<log2 N>$<r>$<p>$<salt>$<hash> (base64).
// Registered at start-up (runtime.ts); hashes made with a lower cost, and PBKDF2 hashes, are replaced at the next
// sign-in (routes/auth.ts).
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import type { StrongHasher } from '../worker/auth/password.ts';

const KEY_LEN = 32;

function scrypt(password: string, salt: Buffer, logN: number, r: number, p: number): Promise<Buffer> {
  const N = 2 ** logN;
  return new Promise((resolve, reject) =>
    scryptCb(password, salt, KEY_LEN, { N, r, p, maxmem: 128 * N * r * 2 + 1024 * 1024 }, (e, key) => (e ? reject(e) : resolve(key))),
  );
}

/** The scrypt hasher. logN can be lowered for tests (WORK_SCRYPT_LOG_N), never below 10. */
export function scryptHasher(logN = 15, r = 8, p = 3): StrongHasher {
  const n = Math.min(20, Math.max(10, Math.floor(logN)));
  return {
    scheme: 'scrypt',
    async hash(password) {
      const salt = randomBytes(16);
      const key = await scrypt(password, salt, n, r, p);
      return ['scrypt', n, r, p, salt.toString('base64'), key.toString('base64')].join('$');
    },
    async verify(password, stored) {
      const [scheme, ln, rr, pp, salt, hash] = stored.split('$');
      if (scheme !== 'scrypt' || !salt || !hash) return false;
      const L = Number(ln);
      const R = Number(rr);
      const P = Number(pp);
      if (!Number.isInteger(L) || L < 10 || L > 22 || !Number.isInteger(R) || R < 1 || R > 32 || !Number.isInteger(P) || P < 1 || P > 16) return false;
      const want = Buffer.from(hash, 'base64');
      const got = await scrypt(password, Buffer.from(salt, 'base64'), L, R, P);
      return want.length === got.length && timingSafeEqual(want, got);
    },
    outdated(stored) {
      const [, ln, rr, pp] = stored.split('$');
      return Number(ln) < n || Number(rr) < r || Number(pp) < p;
    },
  };
}
