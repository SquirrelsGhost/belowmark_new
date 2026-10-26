import type { Permission } from "@/types/permissions.types";

export type PolicyAccess = "public" | "authenticated" | Permission;

export interface RoutePolicy {
  access: PolicyAccess;
  kind: "api" | "page";
  loginPath?: string;
}

interface PolicyRule {
  methods: readonly string[] | "*";
  pattern: RegExp;
  policy: RoutePolicy;
}

const API_PUBLIC: RoutePolicy = { access: "public", kind: "api" };
const API_AUTH: RoutePolicy = { access: "authenticated", kind: "api" };
const apiPerm = (access: Permission): RoutePolicy => ({ access, kind: "api" });

const PAGE_PUBLIC: RoutePolicy = { access: "public", kind: "page" };
const PAGE_AUTH: RoutePolicy = { access: "authenticated", kind: "page", loginPath: "/login" };

/**
 * Explicit Zero-Trust Policy Table for all paths monitored by `src/proxy.ts`.
 * Every route requires an explicit rule (Deny-by-default: no match = 403 Forbidden).
 */
const POLICY_RULES: readonly PolicyRule[] = [
  // ─── 1. Public Auth & Marketing Pages ───────────────────────────────────────
  { methods: ["GET"], pattern: /^\/$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/login$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/signup$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/passwort-vergessen$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/passwort-neu$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/email-bestaetigen$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/einladung$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/k\/[^/]+$/, policy: PAGE_PUBLIC },

  // ─── 2. Protected Account Page ──────────────────────────────────────────────
  { methods: ["GET", "POST"], pattern: /^\/konto$/, policy: PAGE_AUTH },
  { methods: ["GET"], pattern: /^\/konto\/export$/, policy: API_AUTH },

  // ─── 2b. Booking (order overview, local test checkout, Stripe success URL) ──
  { methods: ["GET", "POST"], pattern: /^\/buchen$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/bezahlen\/test$/, policy: PAGE_AUTH },
  { methods: ["GET"], pattern: /^\/api\/billing\/bestaetigen$/, policy: PAGE_AUTH },

  // ─── 3. Protected App Routes & Calendar Export ──────────────────────────────
  { methods: ["GET"], pattern: /^\/app\/kalender$/, policy: API_AUTH },
  { methods: ["GET"], pattern: /^\/app\/termine\/kalender$/, policy: API_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/app(\/.*)?$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/mappe\/[^/]+$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/bankmappe\/[^/]+$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/expose\/[^/]+$/, policy: PAGE_AUTH },

  // ─── 4. API Endpoints (Method-exact separation & capabilities) ──────────────
  { methods: ["GET"], pattern: /^\/api\/health$/, policy: API_PUBLIC },
  { methods: ["POST"], pattern: /^\/api\/alerts\/run$/, policy: API_PUBLIC },
  // Termin-Begleiter: the run checks the cron secret, the feed its secret token (calendar apps have no session)
  { methods: ["POST"], pattern: /^\/api\/termine\/run$/, policy: API_PUBLIC },
  { methods: ["GET"], pattern: /^\/api\/termine\/feed\/[A-Za-z0-9_-]{43}(\.ics)?$/, policy: API_PUBLIC },
  // Signed by Stripe; the route verifies the signature itself
  { methods: ["POST"], pattern: /^\/api\/billing\/webhook$/, policy: API_PUBLIC },
  { methods: ["GET"], pattern: /^\/api\/quelle\/[^/]+$/, policy: API_AUTH },
  { methods: ["POST", "DELETE"], pattern: /^\/api\/gutachten$/, policy: apiPerm("gutachten:analyze") },
];

export function findPolicy(method: string, pathname: string): RoutePolicy | null {
  const upper = method.toUpperCase();
  const normalizedMethod = upper === "HEAD" ? "GET" : upper;

  for (const rule of POLICY_RULES) {
    const methodMatch = rule.methods === "*" || rule.methods.includes(normalizedMethod);
    if (methodMatch && rule.pattern.test(pathname)) {
      return rule.policy;
    }
  }
  return null;
}
