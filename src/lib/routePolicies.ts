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
  { methods: ["GET", "POST"], pattern: /^\/$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/(agb|datenschutz|impressum|widerruf)$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/(widerruf\/erklaeren|kuendigen)$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/login$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/anmelden$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/signup$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/registrieren$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/passwort-vergessen$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/passwort-neu$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/email-bestaetigen$/, policy: PAGE_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/einladung$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/k\/[^/]+$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/blog$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/blog\/cover\/[^/]+\/[^/]+$/, policy: API_PUBLIC },
  { methods: ["GET"], pattern: /^\/blog\/[^/]+$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/(de|tr|en|it|es|fr|ar|ru)\/blog(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/zwangsversteigerung(en)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/bundesland\/[^/]+$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/amtsgericht\/[^/]+$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/zwangsversteigerung\/[^/]+$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/tr\/icra-ihale(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/rechner\/(5-10-und-7-10-grenze|zvg-verkehrswert-50-70-grenze)$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/tr\/hesaplama\/icra-ihale-teminat$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/oesterreich\/ediktsdatei(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/oesterreich\/rechner\/geringstes-gebot-vadium$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/schweiz\/shab-versteigerungen(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/schweiz\/rechner\/betreibungsamtliche-steigerung-schkg$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/it\/aste-giudiziarie(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/it\/calcolatore\/offerta-minima-75-asta-giudiziaria$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/es\/subastas-boe(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/es\/calculadora\/subasta-judicial-boe-70-por-ciento$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/fr\/encheres-immobilieres(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/fr\/calculateur\/encheres-judiciaires-licitor-frais$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/en\/uk-property-auctions(\/[^/]+)?$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/en\/calculator\/uk-property-auction-stamp-duty-deposit$/, policy: PAGE_PUBLIC },
  { methods: ["GET"], pattern: /^\/karten\/(de|tr)\.svg$/, policy: API_PUBLIC },
  { methods: ["GET"], pattern: /^\/(sitemap\.xml|sitemap-blog\.xml|robots\.txt|llms\.txt|llms-full\.txt|pycie2026seoindexnowkey\.txt|sw\.js|favicon\.ico|icon\.svg)$/, policy: API_PUBLIC },

  // ─── 2. Protected Account Page ──────────────────────────────────────────────
  { methods: ["GET", "POST"], pattern: /^\/konto$/, policy: PAGE_AUTH },
  { methods: ["GET"], pattern: /^\/konto\/export$/, policy: API_AUTH },
  { methods: ["GET"], pattern: /^\/konto\/rechnungen\/[0-9a-f-]{36}\/pdf$/i, policy: API_AUTH },

  // ─── 2b. Booking (order overview, local test checkout, Stripe success URL) ──
  { methods: ["GET", "POST"], pattern: /^\/buchen$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/buchen\/upgrade$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/bezahlen\/test$/, policy: PAGE_AUTH },
  { methods: ["GET"], pattern: /^\/api\/billing\/bestaetigen$/, policy: PAGE_AUTH },

  // ─── 3. Protected App Routes & Calendar Export ──────────────────────────────
  { methods: ["GET"], pattern: /^\/app\/kalender$/, policy: API_AUTH },
  { methods: ["GET"], pattern: /^\/app\/termine\/kalender$/, policy: apiPerm("app:investor") },
  { methods: ["GET", "POST"], pattern: /^\/app(\/(?!kalender$|termine\/kalender$).*)?$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/mappe\/[^/]+$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/bankmappe\/[^/]+$/, policy: PAGE_AUTH },
  { methods: ["GET", "POST"], pattern: /^\/expose\/[^/]+$/, policy: PAGE_AUTH },

  // ─── 4. API Endpoints (Method-exact separation & capabilities) ──────────────
  { methods: ["GET"], pattern: /^\/api\/health$/, policy: API_PUBLIC },
  { methods: ["GET", "POST"], pattern: /^\/api\/alerts\/run$/, policy: API_PUBLIC },
  // Termin-Begleiter: the run checks the cron secret, the feed its secret token (calendar apps have no session)
  { methods: ["GET", "POST"], pattern: /^\/api\/termine\/run$/, policy: API_PUBLIC },
  { methods: ["GET"], pattern: /^\/api\/termine\/feed\/[A-Za-z0-9_-]{43}(\.ics)?$/, policy: API_PUBLIC },
  // Signed by Stripe; the route verifies the signature itself
  { methods: ["POST"], pattern: /^\/api\/billing\/webhook$/, policy: API_PUBLIC },
  { methods: ["GET"], pattern: /^\/api\/quelle\/[^/]+$/, policy: apiPerm("app:investor") },
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
