import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_TTL } from "@/lib/auth/authConfig";
import { env } from "@/lib/env";

const DEV_SECRET = "nur-lokal-belowmark-sitzung-nicht-in-produktion-v1";

/**
 * Stateful Session Cookie Payload (Pycie Zero-Trust Standard):
 * Never stores plaintext permissions in the cookie (protects against stale permissions
 * after ban or subscription expiry). Contains only `{ id, version, sessionId, tokenId, exp }.HMAC_SHA256`.
 */
export interface SessionCookiePayload {
  id: string;
  version: number;
  sessionId: string;
  tokenId: string;
  exp?: number;
}

function getSigningSecret(): string {
  const secret = (typeof env?.sessionSecret === "string" ? env.sessionSecret : process.env.SESSION_SECRET) ?? "";
  if (secret.length >= 32) return secret;
  const dbUrl = process.env.DATABASE_URL ?? "";
  const seed = secret || dbUrl || DEV_SECRET;
  return createHmac("sha256", seed).update("belowmark-session-hmac-v1").digest("hex");
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

export function createSessionCookieToken(data: SessionCookiePayload, ttlMs = SESSION_TTL.remember): string {
  const exp = data.exp ?? Date.now() + ttlMs;
  const payload = Buffer.from(
    JSON.stringify({
      id: data.id,
      version: data.version,
      sessionId: data.sessionId,
      tokenId: data.tokenId,
      exp,
    }),
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function readSessionCookieToken(
  rawToken: string | undefined | null,
  nowMs?: number,
): SessionCookiePayload | null {
  if (!rawToken) return null;
  const [payload, signature] = rawToken.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(signPayload(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      id?: unknown;
      version?: unknown;
      sessionId?: unknown;
      tokenId?: unknown;
      exp?: unknown;
    };
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.version !== "number" ||
      typeof parsed.sessionId !== "string" ||
      typeof parsed.tokenId !== "string" ||
      typeof parsed.exp !== "number" ||
      (nowMs !== undefined && parsed.exp < nowMs)
    ) {
      return null;
    }
    return {
      id: parsed.id,
      version: parsed.version,
      sessionId: parsed.sessionId,
      tokenId: parsed.tokenId,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function readCookieFromRequest(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}
