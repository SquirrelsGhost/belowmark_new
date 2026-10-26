import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { hasPermission } from "@/lib/permissions";
import { findPolicy } from "@/lib/routePolicies";
import { getSessionUser } from "@/services/sicherheit/SessionUserService";

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

  // 2. Public routes skip session validation
  if (policy.access === "public") {
    return NextResponse.next();
  }

  // 3. Unified Session + Ban Check
  const user = await getSessionUser(req, false);
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
    if (policy.kind === "page") {
      return NextResponse.redirect(new URL(policy.loginPath ?? AUTH_ROUTES.login, req.url));
    }
    return NextResponse.json(
      { success: false, error: "plan" },
      { status: 403 },
    );
  }

  // 5. Anti-Spoofing: strip any client-sent x-user-* headers and set verified values
  const headers = new Headers(req.headers);
  headers.delete("x-user-id");
  headers.delete("x-user-name");
  headers.delete("x-user-permissions");
  headers.set("x-user-id", user.id);
  headers.set("x-user-name", user.name);
  headers.set("x-user-permissions", user.permissions.join(","));

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/app",
    "/app/:path*",
    "/mappe/:path*",
    "/bankmappe/:path*",
    "/expose/:path*",
    "/konto",
    "/konto/:path*",
    "/buchen",
    "/bezahlen/:path*",
    "/api/:path*",
    "/login",
    "/signup",
    "/passwort-vergessen",
    "/passwort-neu",
    "/email-bestaetigen",
  ],
};
