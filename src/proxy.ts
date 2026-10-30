import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_PARAMS, AUTH_ROUTES, SESSION_COOKIE_NAME } from "@/lib/auth/authConfig";
import { createSessionCookieToken, readCookieFromRequest, readSessionCookieToken } from "@/lib/auth/sessionToken";
import { hasPermission } from "@/lib/permissions";
import { findPolicy } from "@/lib/routePolicies";
import { getSessionUser, type SessionUser } from "@/services/sicherheit/SessionUserService";

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
  const policy = findPolicy(req.method, pathname);

  // 1. Deny by default: no policy = no access (403 Forbidden)
  if (!policy) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("x-user-id");
  requestHeaders.delete("x-user-name");
  requestHeaders.delete("x-user-permissions");
  requestHeaders.set("x-pathname", pathname);

  // 2. Public routes skip session validation
  if (policy.access === "public") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 3. Unified Session + Ban Check (with 15-min tokenId rotation persisted to response cookie)
  const rawCookie =
    readCookieFromRequest(req, SESSION_COOKIE_NAME) ??
    readCookieFromRequest(req, "__Host-bm_session") ??
    readCookieFromRequest(req, "bm_session");
  const user = await getSessionUser(req, true);
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
  const headers = new Headers(requestHeaders);
  headers.delete("x-user-id");
  headers.delete("x-user-name");
  headers.delete("x-user-permissions");
  headers.set("x-user-id", user.id);
  headers.set("x-user-name", user.name);
  headers.set("x-user-permissions", user.permissions.join(","));

  if (user.neuesTokenId) {
    const currentCookie = readSessionCookieToken(rawCookie);
    const rotatedCookie = createSessionCookieToken({
      id: user.id,
      version: user.sitzungsVersion,
      sessionId: user.sessionId,
      tokenId: user.neuesTokenId,
      exp: currentCookie?.exp,
    });
    const existingCookieHeader = headers.get("cookie") ?? "";
    const filteredCookies = existingCookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c && !c.startsWith(`${SESSION_COOKIE_NAME}=`) && !c.startsWith("__Host-bm_session=") && !c.startsWith("bm_session="));
    filteredCookies.push(`${SESSION_COOKIE_NAME}=${encodeURIComponent(rotatedCookie)}`);
    headers.set("cookie", filteredCookies.join("; "));
  }

  const response = NextResponse.next({ request: { headers } });
  return attachRotatedCookie(response, user, rawCookie);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og/|file\\.svg$|globe\\.svg$|next\\.svg$|vercel\\.svg$|window\\.svg$).*)"],
};
