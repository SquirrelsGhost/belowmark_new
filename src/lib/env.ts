import { createDecipheriv, createHash } from "node:crypto";

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

const SMTP_PASS_ENC = "WTUJ7wfK2f6eRctp.86vS-paSoNgC2n6i2IBMBA.vyw_G2sK2lucQaqGTtoE";
const STRIPE_SK_ENC =
  "0Kd-0uUbbI_p8EY-.1P_i0xoZNxz6-XrYj7Zdig.FbLYzYHS7oPPvaIGUVW5MtgeFW8clTvnTsQEZqBdy7Ojm2qs7Or5kBuqGKprw_jX-5ujgmSSfApt-ZFQFBL6ey_EfyzogvP5tocU4Vq8HGfDMLM_qciK_WaX5d-VdaMYpDh4oNfXK02pkjI";
const STRIPE_WH_ENC = "EwqNEoO3fU_7WTCO.0_PWCVAJl1lw82AdEtXXoQ._18xc_KK5WZj31ntccjJs1XvLx9dmAb4L47fbW8RlqUQkYSXWwI";

const DEFAULT_STRIPE_PRICES: Readonly<Record<string, string>> = {
  STRIPE_PRICE_DE_INVESTOR_MONAT: "price_1UWAzSLy4gh2xV0YerVnrm28",
  STRIPE_PRICE_AT_INVESTOR_MONAT: "price_1UWAzSLy4gh2xV0YerVnrm28",
  STRIPE_PRICE_FR_INVESTOR_MONAT: "price_1UWAzSLy4gh2xV0YerVnrm28",
  STRIPE_PRICE_IT_INVESTOR_MONAT: "price_1UWMiTLy4gh2xV0YSTHNAO4V",
  STRIPE_PRICE_ES_INVESTOR_MONAT: "price_1UWMiTLy4gh2xV0YSTHNAO4V",
  STRIPE_PRICE_CH_INVESTOR_MONAT: "price_1UWMiTLy4gh2xV0YnobDAMDb",
  STRIPE_PRICE_GB_INVESTOR_MONAT: "price_1UWMiTLy4gh2xV0Ynx3yKtUk",
  STRIPE_PRICE_TR_INVESTOR_MONAT: "price_1UWAzULy4gh2xV0YITOQE0cS",
  STRIPE_PRICE_DE_INVESTOR_QUARTAL: "price_1UWAzTLy4gh2xV0YXb5QYxar",
  STRIPE_PRICE_AT_INVESTOR_QUARTAL: "price_1UWAzTLy4gh2xV0YXb5QYxar",
  STRIPE_PRICE_FR_INVESTOR_QUARTAL: "price_1UWAzTLy4gh2xV0YXb5QYxar",
  STRIPE_PRICE_IT_INVESTOR_QUARTAL: "price_1UWMiULy4gh2xV0YjbKKZObi",
  STRIPE_PRICE_ES_INVESTOR_QUARTAL: "price_1UWMiULy4gh2xV0YjbKKZObi",
  STRIPE_PRICE_CH_INVESTOR_QUARTAL: "price_1UWMiVLy4gh2xV0YffeJ6Hed",
  STRIPE_PRICE_GB_INVESTOR_QUARTAL: "price_1UWMiVLy4gh2xV0Ymi1xP3ni",
  STRIPE_PRICE_TR_INVESTOR_QUARTAL: "price_1UWAzULy4gh2xV0Y4QL2CDVB",
  STRIPE_PRICE_DE_PRO_MONAT: "price_1UWAzTLy4gh2xV0YU3sZysCT",
  STRIPE_PRICE_AT_PRO_MONAT: "price_1UWAzTLy4gh2xV0YU3sZysCT",
  STRIPE_PRICE_FR_PRO_MONAT: "price_1UWAzTLy4gh2xV0YU3sZysCT",
  STRIPE_PRICE_IT_PRO_MONAT: "price_1UWMiWLy4gh2xV0Y5dkcpAYT",
  STRIPE_PRICE_ES_PRO_MONAT: "price_1UWMiWLy4gh2xV0Y5dkcpAYT",
  STRIPE_PRICE_CH_PRO_MONAT: "price_1UWMiWLy4gh2xV0Yi9dEYrAo",
  STRIPE_PRICE_GB_PRO_MONAT: "price_1UWMiXLy4gh2xV0YNEybPVab",
  STRIPE_PRICE_TR_PRO_MONAT: "price_1UWAzVLy4gh2xV0YKIoQ71DS",
  STRIPE_PRICE_DE_PRO_QUARTAL: "price_1UWAzULy4gh2xV0YJuQXylgM",
  STRIPE_PRICE_AT_PRO_QUARTAL: "price_1UWAzULy4gh2xV0YJuQXylgM",
  STRIPE_PRICE_FR_PRO_QUARTAL: "price_1UWAzULy4gh2xV0YJuQXylgM",
  STRIPE_PRICE_IT_PRO_QUARTAL: "price_1UWMiYLy4gh2xV0Yno52aX76",
  STRIPE_PRICE_ES_PRO_QUARTAL: "price_1UWMiYLy4gh2xV0Yno52aX76",
  STRIPE_PRICE_CH_PRO_QUARTAL: "price_1UWMiYLy4gh2xV0YQyjGzLDg",
  STRIPE_PRICE_GB_PRO_QUARTAL: "price_1UWMiZLy4gh2xV0YzMaqxaXt",
  STRIPE_PRICE_TR_PRO_QUARTAL: "price_1UWAzVLy4gh2xV0Y7MLgUSTM",
};

function runtimeDbSecret(): string {
  const direct = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  if (direct) return direct;
  const conn = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
  if (!conn) return "";
  try {
    return decodeURIComponent(new URL(conn).password);
  } catch {
    return "";
  }
}

function decryptRuntimeSecret(envelope: string): string {
  const secret = runtimeDbSecret();
  if (!secret || !envelope) return "";
  try {
    const [ivB64, tagB64, dataB64] = envelope.split(".");
    if (!ivB64 || !tagB64 || !dataB64) return "";
    const key = createHash("sha256").update(`bm-env-v1:${secret}`).digest();
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64url"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

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
  const val = process.env[key];
  return val !== undefined && val !== "" ? val : fallback;
}

export const env = {
  // ── App ────────────────────────────────────────────────────
  /** Public URL of the app. Safe to use in Client Components. */
  get appUrl(): string {
    const explicit = optionalEnv("NEXT_PUBLIC_APP_URL").trim();
    if (explicit) return explicit.replace(/\/+$/, "");
    if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
      return "https://belowmark.com";
    }
    return "http://localhost:3000";
  },

  // ── PostgreSQL ─────────────────────────────────────────────
  /** Full PostgreSQL connection string (supports DATABASE_URL & POSTGRES_URL). SERVER ONLY. */
  get databaseUrl(): string {
    const val = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (val) return val;
    return requireEnv("DATABASE_URL");
  },
  /** Direct (non-pooled) PostgreSQL connection string when available. SERVER ONLY. */
  get databaseUrlUnpooled(): string {
    return optionalEnv("DATABASE_URL_UNPOOLED", optionalEnv("POSTGRES_URL_NON_POOLING", this.databaseUrl));
  },

  // ── Mail (SMTP) ────────────────────────────────────────────
  /** SMTP host. Defaults to IONOS when runtime credentials are present. SERVER ONLY. */
  get smtpHost(): string {
    const explicit = optionalEnv("SMTP_HOST").trim();
    if (explicit) return explicit;
    return this.smtpPass ? "smtp.ionos.de" : "";
  },
  /** SMTP port — 465 uses implicit TLS, everything else STARTTLS. SERVER ONLY. */
  get smtpPort(): number {
    return Number(optionalEnv("SMTP_PORT", "465"));
  },
  /** SMTP user name. SERVER ONLY. */
  get smtpUser(): string {
    return optionalEnv("SMTP_USER", "contact@belowmark.com").trim();
  },
  /** SMTP password. SERVER ONLY. */
  get smtpPass(): string {
    return optionalEnv("SMTP_PASS") || decryptRuntimeSecret(SMTP_PASS_ENC);
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
    return optionalEnv("ALERTS_CRON_SECRET", optionalEnv("CRON_SECRET"));
  },

  // ── Billing (Stripe) ───────────────────────────────────────
  /** Stripe secret key (sk_test_… / sk_live_…). Empty = no real checkout. SERVER ONLY. */
  get stripeSecretKey(): string {
    return optionalEnv("STRIPE_SECRET_KEY") || decryptRuntimeSecret(STRIPE_SK_ENC);
  },
  /** Signing secret of the webhook endpoint (whsec_…). SERVER ONLY. */
  get stripeWebhookSecret(): string {
    return optionalEnv("STRIPE_WEBHOOK_SECRET") || decryptRuntimeSecret(STRIPE_WH_ENC);
  },
  /** Stripe price id from the variable named in BILLING_OFFERS (priceEnv). SERVER ONLY. */
  stripePrice(variable: string): string {
    return optionalEnv(variable, DEFAULT_STRIPE_PRICES[variable] ?? "").trim();
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
  /**
   * "inclusive" = TRY prices contain 20 % Turkish KDV (only once registered as
   * a foreign e-service provider in Türkiye). Empty = KDV not charged, shown as open. SERVER ONLY.
   */
  get billingTrKdvIncluded(): boolean {
    return optionalEnv("BILLING_TR_KDV").trim().toLowerCase() === "inclusive";
  },
  /** Local/fallback checkout without Stripe key. Enabled outside production unless explicitly set to "off". SERVER ONLY. */
  get billingTestCheckout(): boolean {
    if (process.env.NODE_ENV === "production") return false;
    return optionalEnv("BILLING_TEST_CHECKOUT", "on").trim().toLowerCase() !== "off";
  },
  /** Where withdrawals and cancellations are reported to the operator. Empty = MAIL_FROM address. SERVER ONLY. */
  get operatorEmail(): string {
    return optionalEnv("OPERATOR_EMAIL", "contact@belowmark.com");
  },
} as const;
