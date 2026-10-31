import "server-only";
import { createHash, randomBytes, randomInt } from "node:crypto";

/** 256 bits of randomness, URL-safe — for session cookies and e-mail links. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Cryptographically secure 6-digit numeric OTP code (e.g. "482915"). */
export function generateVerificationCode(): string {
  return String(randomInt(100_000, 1_000_000));
}

/** What gets stored: a leaked table holds no usable token. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Binds a 6-digit verification code to a specific userId so codes cannot collide across users. */
export function hashVerificationCode(userId: string, code: string): string {
  const cleanCode = code.replace(/\D/g, "");
  return createHash("sha256").update(`bm-otp:${userId}:${cleanCode}`).digest("hex");
}
