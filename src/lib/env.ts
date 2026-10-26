/**
 * Typed environment variable access.
 *
 * Import `env` instead of reading `process.env` directly anywhere in the app.
 * This gives you:
 *   - TypeScript types (no more `string | undefined`)
 *   - Startup validation — the server crashes immediately with a clear error
 *     if a required variable is missing, rather than failing silently at runtime
 *
 * RULES:
 *  - Server-only vars (e.g. DATABASE_URL) must NEVER be accessed in Client Components.
 *  - Public vars (NEXT_PUBLIC_*) are safe everywhere.
 *  - Add new variables here AND in .env.example (and .env.local for real values).
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: "${key}"\n` +
        `Check .env.example for the full list of required variables.`
    );
  }
  return value;
}

function optionalEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  // ── App ────────────────────────────────────────────────────
  /** Public URL of the app. Safe to use in Client Components. */
  get appUrl(): string {
    return optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
  },

  // ── PostgreSQL ─────────────────────────────────────────────
  /** Full PostgreSQL connection string. SERVER ONLY. */
  get databaseUrl(): string {
    return requireEnv("DATABASE_URL");
  },

  // ── Mail (SMTP) ────────────────────────────────────────────
  /** SMTP host. Empty = no mail transport (dev prints mails to the console). SERVER ONLY. */
  get smtpHost(): string {
    return optionalEnv("SMTP_HOST");
  },
  /** SMTP port — 465 uses implicit TLS, everything else STARTTLS. SERVER ONLY. */
  get smtpPort(): number {
    return Number(optionalEnv("SMTP_PORT", "465"));
  },
  /** SMTP user name. SERVER ONLY. */
  get smtpUser(): string {
    return optionalEnv("SMTP_USER");
  },
  /** SMTP password. SERVER ONLY. */
  get smtpPass(): string {
    return optionalEnv("SMTP_PASS");
  },
  /** Sender, e.g. `Belowmark <contact@belowmark.com>`. SERVER ONLY. */
  get mailFrom(): string {
    return optionalEnv("MAIL_FROM", "Belowmark <contact@belowmark.com>");
  },

  // ── Auth ───────────────────────────────────────────────────
  /** Check new passwords against known breaches (k-anonymity). On unless "off". SERVER ONLY. */
  get authBreachCheck(): boolean {
    return optionalEnv("AUTH_BREACH_CHECK", "on") !== "off";
  },
  /** Secret for HMAC-SHA256 session cookie signing. SERVER ONLY. */
  get sessionSecret(): string {
    return optionalEnv("SESSION_SECRET", "");
  },

  // ── Alerts ─────────────────────────────────────────────────
  /** Bearer token the scheduler sends to POST /api/alerts/run. Empty = only allowed outside production. SERVER ONLY. */
  get alertsCronSecret(): string {
    return optionalEnv("ALERTS_CRON_SECRET");
  },

  // ── Billing (Stripe) ───────────────────────────────────────
  /** Stripe secret key (sk_test_… / sk_live_…). Empty = no real checkout. SERVER ONLY. */
  get stripeSecretKey(): string {
    return optionalEnv("STRIPE_SECRET_KEY");
  },
  /** Signing secret of the webhook endpoint (whsec_…). SERVER ONLY. */
  get stripeWebhookSecret(): string {
    return optionalEnv("STRIPE_WEBHOOK_SECRET");
  },
  /** Stripe price id from the variable named in BILLING_OFFERS (priceEnv). SERVER ONLY. */
  stripePrice(variable: string): string {
    return optionalEnv(variable).trim();
  },
  /** "on" = Stripe Tax computes VAT per customer country (needs Stripe Tax set up). SERVER ONLY. */
  get stripeAutomaticTax(): boolean {
    return optionalEnv("STRIPE_AUTOMATIC_TAX") === "on";
  },
  /**
   * The operator confirms that Impressum, AGB, Widerruf and Datenschutz were
   * checked and completed. Enabled by default unless explicitly set to "no" or "off". SERVER ONLY.
   */
  get billingLegalApproved(): boolean {
    const val = optionalEnv("BILLING_LEGAL_APPROVED", "yes").trim().toLowerCase();
    return val !== "no" && val !== "off" && val !== "false";
  },
  /** "inclusive" (19 % USt included) or "kleinunternehmer" (§ 19 UStG). Defaults to "inclusive". SERVER ONLY. */
  get billingVatMode(): "inclusive" | "kleinunternehmer" | null {
    const value = optionalEnv("BILLING_VAT_MODE", "inclusive").trim().toLowerCase();
    return value === "inclusive" || value === "kleinunternehmer" ? value : null;
  },
  /** Turkish market bookable. Enabled by default unless explicitly set to "no" or "off". SERVER ONLY. */
  get billingTrEnabled(): boolean {
    const val = optionalEnv("BILLING_TR_ENABLED", "yes").trim().toLowerCase();
    return val !== "no" && val !== "off" && val !== "false";
  },
  /** Local/fallback checkout without Stripe key. Enabled unless explicitly set to "off". SERVER ONLY. */
  get billingTestCheckout(): boolean {
    return optionalEnv("BILLING_TEST_CHECKOUT", "on").trim().toLowerCase() !== "off";
  },
  /** Where withdrawals and cancellations are reported to the operator. Empty = MAIL_FROM address. SERVER ONLY. */
  get operatorEmail(): string {
    return optionalEnv("OPERATOR_EMAIL");
  },
} as const;
