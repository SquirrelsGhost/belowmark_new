import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_PARAMS, AUTH_ROUTES, SESSION_COOKIE_NAME } from "@/lib/auth/authConfig";
import { createSessionCookieToken, readCookieFromRequest, readSessionCookieToken } from "@/lib/auth/sessionToken";
import { hasPermission } from "@/lib/permissions";
import { resolvePseoCanonicalRedirect } from "@/lib/pseo/legacyPseoRedirects";
import { findPolicy } from "@/lib/routePolicies";
import { isAutomatedBotRequest } from "@/lib/sicherheit/antiScrapingRules";
import { getSessionUser, type SessionUser } from "@/services/sicherheit/SessionUserService";

/**
 * Encodes non-ISO-8859-1 characters (> 255 or control bytes) so `Headers.set()`
 * never throws `TypeError` on international user names (TR/FR/AR/emojis).
 */
function headerSafeValue(value: string): string {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code > 255 || code < 32) return encodeURIComponent(value);
  }
  return value;
}

/**
 * Allows `tokenId` cookie rotation ONLY on genuine top-level document navigations
 * or non-prefetch API requests — never on speculative `<Link>` / RSC prefetches
 * where mobile browsers (e.g. iOS Safari) may discard `Set-Cookie` or abort mid-flight.
 */
function darfCookieRotieren(req: NextRequest, kind: "api" | "page"): boolean {
  const method = req.method.toUpperCase();
  if (method === "HEAD" || method === "OPTIONS") return false;

  const h = req.headers;
  if (
    h.has("rsc") ||
    h.has("next-router-prefetch") ||
    h.has("next-router-segment-prefetch") ||
    h.has("x-middleware-prefetch") ||
    (h.get("purpose") ?? "").toLowerCase().includes("prefetch") ||
    (h.get("sec-purpose") ?? "").toLowerCase().includes("prefetch") ||
    (h.get("moz") ?? "").toLowerCase().includes("prefetch")
  ) {
    return false;
  }

  if (kind === "page") {
    const secMode = (h.get("sec-fetch-mode") ?? "").toLowerCase();
    return secMode === "" || secMode === "navigate";
  }

  return !(h.get("accept") ?? "").toLowerCase().includes("text/event-stream");
}

/**
 * Persists a rotated `tokenId` (`user.neuesTokenId`) onto the outgoing `NextResponse`
 * so a 15-minute rotation in `Sitzungswachdienst` is never lost (even on 403/redirect in Step 4).
 */
function attachRotatedCookie(response: NextResponse, user: SessionUser, rawCookie?: string): NextResponse {
  if (!user.neuesTokenId) return response;
  const currentCookie = readSessionCookieToken(rawCookie);
  const rotatedExp = currentCookie?.exp;
  const rotatedCookie = createSessionCookieToken({
    id: user.id,
    version: user.sitzungsVersion,
    sessionId: user.sessionId,
    tokenId: user.neuesTokenId,
    exp: rotatedExp,
  });
  response.cookies.set(SESSION_COOKIE_NAME, rotatedCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rotatedExp ? { expires: new Date(rotatedExp) } : {}),
  });
  return response;
}

/**
 * Next.js 16 Zero-Trust Proxy (`src/proxy.ts` — 5-Step Engine):
 * 1. Deny by default: Every route in the matcher requires an explicit policy in `routePolicies.ts`
 * 2. Public routes skip auth (`policy.access === "public"`)
 * 3. Unified session & ban check (`getSessionUser(req)`) against PostgreSQL
 * 4. Granular capability check (`hasPermission(user.permissions, policy.access)`)
 * 5. Anti-spoofing user headers (`x-user-id`, `x-user-name`, `x-user-permissions`)
 */
export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(",")[0].trim().toLowerCase();
  if (host === "belowmark.com") {
    return NextResponse.redirect(new URL(`${pathname}${search}`, "https://www.belowmark.com"), 301);
  }
  const policy = findPolicy(req.method, pathname);

  // 1. Deny by default: no policy = no access (403 Forbidden)
  if (!policy) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  // 1b. Block automated HTTP scrapers & headless bots on protected app/API surfaces
  if (isAutomatedBotRequest(req.headers, pathname)) {
    return NextResponse.json({ success: false, error: "Automated access forbidden" }, { status: 403 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("x-user-id");
  requestHeaders.delete("x-user-name");
  requestHeaders.delete("x-user-permissions");
  requestHeaders.set("x-pathname", pathname);

  // 2. Public routes skip session validation (with O(1) canonical 308 pSEO redirect check)
  if (policy.access === "public") {
    if (req.method === "GET" || req.method === "HEAD") {
      const canonicalRedirect = resolvePseoCanonicalRedirect(pathname);
      if (canonicalRedirect) {
        return NextResponse.redirect(new URL(`${canonicalRedirect}${search}`, req.url), 308);
      }
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 3. Unified Session + Ban Check (with two-phase ACK-confirmed 15-min tokenId rotation)
  const rawCookie =
    readCookieFromRequest(req, SESSION_COOKIE_NAME) ??
    readCookieFromRequest(req, "__Host-bm_session") ??
    readCookieFromRequest(req, "bm_session");
  const erlaubeRotation = darfCookieRotieren(req, policy.kind);
  const user = await getSessionUser(req, erlaubeRotation);
  if (!user) {
    if (policy.kind === "page") {
      const loginUrl = new URL(policy.loginPath ?? AUTH_ROUTES.login, req.url);
      if (loginUrl.pathname === AUTH_ROUTES.login) {
        loginUrl.searchParams.set(AUTH_PARAMS.next, `${pathname}${search}`);
      }
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  if (user.banned) {
    if (policy.kind === "page") {
      return NextResponse.redirect(new URL(AUTH_ROUTES.login, req.url));
    }
    return NextResponse.json(
      { success: false, error: user.banReason ?? "account_banned" },
      { status: 403 },
    );
  }

  // 4. Granular Capability Check (`<domain>:<action>` or `<domain>:*`)
  if (policy.access !== "authenticated" && !hasPermission(user.permissions, policy.access)) {
    const deniedResponse =
      policy.kind === "page"
        ? NextResponse.redirect(new URL(policy.loginPath ?? AUTH_ROUTES.login, req.url))
        : NextResponse.json({ success: false, error: "plan" }, { status: 403 });
    return attachRotatedCookie(deniedResponse, user, rawCookie);
  }

  // 5. Anti-Spoofing: strip any client-sent x-user-* headers and set verified values
  // Never rewrite incoming `cookie` header to `neuesTokenId` here — otherwise downstream SSR
  // (`SessionService.getCurrentUser`) would see `neuesTokenId` in the same request and prematurely
  // ACK-confirm (`aktivesTokenBestaetigt = true`) before the browser ever receives `Set-Cookie`.
  const headers = new Headers(requestHeaders);
  headers.delete("x-user-id");
  headers.delete("x-user-name");
  headers.delete("x-user-permissions");
  headers.set("x-user-id", headerSafeValue(user.id));
  headers.set("x-user-name", headerSafeValue(user.name));
  headers.set("x-user-permissions", user.permissions.join(","));

  const response = NextResponse.next({ request: { headers } });
  return attachRotatedCookie(response, user, rawCookie);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico$|icon\\.svg$|og/|file\\.svg$|globe\\.svg$|next\\.svg$|vercel\\.svg$|window\\.svg$).*)"],
};
