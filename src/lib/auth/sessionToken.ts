import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_TTL } from "@/lib/auth/authConfig";
import { env } from "@/lib/env";
import type { CurrentUser } from "@/types/auth.types";
import type { Permission } from "@/types/permissions.types";

const DEV_SECRET = "nur-lokal-belowmark-sitzung-nicht-in-produktion-v1";
const INTERNAL_CTX_MAX_AGE_MS = 20_000;

export const VERIFIED_SESSION_HEADER = "x-bm-verified-session";

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
  const dbUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
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

interface SerializedSessionContext {
  iat: number;
  id: string;
  name: string;
  email: string;
  market: string;
  country: string | null;
  locale: string;
  emailVerifiedAt: number | null;
  trialEndsAt: number | null;
  hasTrialEnded: boolean;
  plan: string | null;
  permissions: Permission[];
  hasFullAccess: boolean;
  teamSeat: boolean;
  paidMarkets?: string[];
  createdAt: number;
  sessionId: string;
}

function signInternalPayload(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(`bm-internal-ctx-v1:${payload}`).digest("base64url");
}

/**
 * Signs the PostgreSQL-verified session user resolved in `src/proxy.ts` so downstream
 * RSC layouts/pages in the exact same HTTP request do not repeat the DB round-trip.
 * Stripped unconditionally from incoming client headers in `src/proxy.ts`.
 */
export function signInternalSessionContext(user: CurrentUser): string {
  const data: SerializedSessionContext = {
    iat: Date.now(),
    id: user.id,
    name: user.name,
    email: user.email,
    market: user.market,
    country: user.country,
    locale: user.locale,
    emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.getTime() : null,
    trialEndsAt: user.trialEndsAt ? user.trialEndsAt.getTime() : null,
    hasTrialEnded: user.hasTrialEnded,
    plan: user.plan,
    permissions: user.permissions,
    hasFullAccess: user.hasFullAccess,
    teamSeat: user.teamSeat,
    paidMarkets: user.paidMarkets,
    createdAt: user.createdAt.getTime(),
    sessionId: user.sessionId,
  };
  const payload = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  return `${payload}.${signInternalPayload(payload)}`;
}

export function verifyInternalSessionContext(
  rawHeader: string | undefined | null,
  expectedSessionId: string | undefined,
): CurrentUser | null {
  if (!rawHeader || !expectedSessionId) return null;
  const [payload, signature] = rawHeader.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(signInternalPayload(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SerializedSessionContext;
    if (
      typeof parsed.iat !== "number" ||
      Math.abs(Date.now() - parsed.iat) > INTERNAL_CTX_MAX_AGE_MS ||
      parsed.sessionId !== expectedSessionId ||
      typeof parsed.id !== "string"
    ) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      market: parsed.market,
      country: parsed.country,
      locale: parsed.locale,
      emailVerifiedAt: parsed.emailVerifiedAt !== null ? new Date(parsed.emailVerifiedAt) : null,
      trialEndsAt: parsed.trialEndsAt !== null ? new Date(parsed.trialEndsAt) : null,
      hasTrialEnded: parsed.hasTrialEnded,
      plan: parsed.plan,
      permissions: parsed.permissions,
      hasFullAccess: parsed.hasFullAccess,
      teamSeat: parsed.teamSeat,
      paidMarkets: parsed.paidMarkets,
      createdAt: new Date(parsed.createdAt),
      sessionId: parsed.sessionId,
    };
  } catch {
    return null;
  }
}
