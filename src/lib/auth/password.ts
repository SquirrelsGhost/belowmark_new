import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * scrypt password hashing with per-password salt.
 *
 * Format: `scrypt$N$r$p$saltHex$hashHex` — identical to the old immo app, so
 * accounts can be migrated without a password reset. Parameters live in the
 * hash, so raising them later only needs `needsRehash()`.
 */

const PARAMS = { N: 2 ** 15, r: 8, p: 1, keylen: 64 } as const;
/** 128 · N · r = 32 MiB per hash; Node's default cap is exactly that, so lift it. */
const MAX_MEM = 64 * 1024 * 1024;
const SALT_BYTES = 16;

function derive(password: string, salt: Buffer, keylen: number, N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, keylen, { N, r, p, maxmem: MAX_MEM }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await derive(password, salt, PARAMS.keylen, PARAMS.N, PARAMS.r, PARAMS.p);
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, N, r, p, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await derive(password, Buffer.from(saltHex, "hex"), expected.length, Number(N), Number(r), Number(p));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** True when the stored hash uses weaker parameters than today's. */
export function needsRehash(stored: string): boolean {
  const [, N, r, p] = stored.split("$");
  return Number(N) < PARAMS.N || Number(r) < PARAMS.r || Number(p) < PARAMS.p;
}

/**
 * Burns the same CPU time as a real check. Used when no account exists, so
 * response times do not reveal which e-mail addresses are registered.
 */
let dummyHash: Promise<string> | null = null;
export async function simulatePasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword(randomBytes(12).toString("hex"));
  await verifyPassword(password, await dummyHash);
}
