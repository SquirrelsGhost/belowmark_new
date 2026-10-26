import { createHash } from "node:crypto";

const POW_PREFIX = "000"; // 12 bits of work (~4096 SHA-256 hashes in browser ≈ 10ms)
const MAX_AGE_MS = 10 * 60 * 1000;

export interface LoginBotShieldInput {
  honeypot?: unknown;
  powTs?: unknown;
  powNonce?: unknown;
}

/**
 * Mandatory protection against botnets and credential stuffing before any scrypt hash:
 * 1. Invisible honeypot field must be empty.
 * 2. Timestamp (powTs) and nonce (powNonce) must be valid, at most 10 minutes old,
 *    and SHA-256("ec-pow-v1:ts:nonce") must start with "000".
 */
export function verifyLoginPoW(input: LoginBotShieldInput): { ok: true } | { ok: false; reason: "bot_detected" } {
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    return { ok: false, reason: "bot_detected" };
  }

  const ts = typeof input.powTs === "number" ? input.powTs : Number(input.powTs);
  const nonce = typeof input.powNonce === "number" ? input.powNonce : Number(input.powNonce);
  if (
    input.powTs === undefined ||
    input.powTs === "" ||
    input.powNonce === undefined ||
    input.powNonce === "" ||
    !Number.isFinite(ts) ||
    !Number.isFinite(nonce)
  ) {
    return { ok: false, reason: "bot_detected" };
  }

  const age = Date.now() - ts;
  if (age < -60_000 || age > MAX_AGE_MS) {
    return { ok: false, reason: "bot_detected" };
  }

  const digest = createHash("sha256").update(`ec-pow-v1:${ts}:${nonce}`, "utf8").digest("hex");
  if (!digest.startsWith(POW_PREFIX)) {
    return { ok: false, reason: "bot_detected" };
  }

  return { ok: true };
}
