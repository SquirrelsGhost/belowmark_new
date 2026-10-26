import "server-only";
import { createHash, randomBytes } from "node:crypto";

/** 256 bits of randomness, URL-safe — for session cookies and e-mail links. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** What gets stored: a leaked table holds no usable token. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
