import { boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Reusable audit timestamp columns for all PostgreSQL tables.
 */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

/**
 * Core PostgreSQL Database Schema (Belowmark)
 *
 * Define all database tables, relations, and types here.
 * Run `npm run db:generate` or `npm run db:push` to sync with PostgreSQL.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  /** Always stored canonicalized, trimmed and lower-cased (see normalizeEmail). */
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  /** "scrypt$N$r$p$salt$hash" — same format as the old immo app, so old hashes stay valid. */
  passwordHash: text("password_hash").notNull(),
  /** Booked market: DE (ZVG) or TR (İcra). */
  market: varchar("market", { length: 2 }).notNull().default("DE"),
  /** Language for e-mails, taken from the UI at sign-up. */
  locale: varchar("locale", { length: 2 }).notNull().default("de"),
  /** null until the address is confirmed — no sign-in before that. */
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  /** Trial access starts with the e-mail confirmation. */
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  /** Booked plan ("investor" | "pro", see PAID_PLANS); null = no subscription. Full access while set and planEndsAt has not passed. */
  plan: varchar("plan", { length: 16 }),
  /** End of the paid access (period end of a subscription, end of a one-time term). null = no end (set by hand). */
  planEndsAt: timestamp("plan_ends_at", { withTimezone: true }),
  /** Offer behind `plan` (see BILLING_OFFERS), e.g. "investor-monat". */
  planOffer: varchar("plan_offer", { length: 32 }),
  /** Customer at Stripe — the only payment reference we keep. Card data never reaches this server. */
  stripeCustomerId: varchar("stripe_customer_id", { length: 64 }).unique(),
  /** Running Stripe subscription of the monthly offer, null for one-time terms. */
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }),
  /** Set when the subscription is cancelled: access ends then, nothing renews. */
  planCancelAt: timestamp("plan_cancel_at", { withTimezone: true }),
  /** Granular capability permissions (`*`, `<domain>:*`, `<domain>:<action>`). No rigid role enums. */
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  /** Bumped on password reset / security events to invalidate stale session tokens in real time. */
  sitzungsVersion: integer("sitzungs_version").notNull().default(1),
  /** Real-time ban timestamp (`gesperrtAm`). When set, all access and permissions are immediately revoked. */
  gesperrtAm: timestamp("gesperrt_am", { withTimezone: true }),
  sperrGrund: text("sperr_grund"),
  /** Hardware fingerprint (`HW-...`) recorded at signup/login to detect banned devices across VPNs. */
  hardwareFingerprint: varchar("hardware_fingerprint", { length: 64 }),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Stateful server-side sessions (`Sitzungswachdienst`).
 * Bound to `userAgentHash`, rotates `aktivesTokenId` (`jti`) every 15 minutes
 * with a 60s parallel tolerance window, and immediately revokes all sessions of
 * the user on token reuse (cookie theft detection).
 */
export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    aktivesTokenId: varchar("aktives_token_id", { length: 64 }).notNull().default(""),
    vorherigesTokenId: varchar("vorheriges_token_id", { length: 64 }),
    rotiertAm: timestamp("rotiert_am", { withTimezone: true }).defaultNow().notNull(),
    zuletztAktivAm: timestamp("zuletzt_aktiv_am", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    widerrufenAm: timestamp("widerrufen_am", { withTimezone: true }),
    widerrufGrund: text("widerruf_grund"),
    /** Device binding hash (`uaFingerprint`) */
    userAgentHash: varchar("user_agent_hash", { length: 64 }).notNull().default(""),
    /** Shortened browser description, shown nowhere public. */
    userAgent: varchar("user_agent", { length: 255 }),
    ipKuerzel: varchar("ip_kuerzel", { length: 64 }),
    hardwareFingerprint: varchar("hardware_fingerprint", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export type Session = typeof sessions.$inferSelect;

/**
 * One-time links for e-mail confirmation and password reset. Stored hashed,
 * deleted on use; at most one open link per user and purpose.
 */
export const authTokens = pgTable(
  "auth_tokens",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: varchar("purpose", { length: 32 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("auth_tokens_user_purpose_idx").on(table.userId, table.purpose)],
);

export type AuthToken = typeof authTokens.$inferSelect;

/**
 * Fixed-window counters and persistent exponential backoff locks in Postgres
 * so limits and login lockouts hold across restarts and server instances.
 */
export const rateLimits = pgTable("rate_limits", {
  key: varchar("key", { length: 255 }).primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
});

/**
 * Saved listings ("Merkliste") of a user. listing_id is the stable key of a
 * ZVG/İcra notice as used by the app; one row per user and listing.
 */
export const watchlist = pgTable(
  "watchlist",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: varchar("listing_id", { length: 128 }).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.listingId] })],
);

export type WatchlistEntry = typeof watchlist.$inferSelect;

/** Filters of a saved search, as stored in search_alerts.filters (see src/types/alert.types.ts). */
export interface StoredAlertFilters {
  query: string;
  region: string;
  /** Display name of the region at the time of saving — the code alone means nothing in a mail */
  regionName: string | null;
  segment: string;
  minValue: number | null;
  maxValue: number | null;
}

/**
 * Saved searches ("Alerts"). The runner mails the owner when a new matching
 * proceeding appears or the date of a known match changes.
 */
export const searchAlerts = pgTable(
  "search_alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Market the search runs on: DE (ZVG) or TR (İcra) */
    market: varchar("market", { length: 2 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    filters: jsonb("filters").$type<StoredAlertFilters>().notNull(),
    notifyNew: boolean("notify_new").notNull().default(true),
    notifyChanges: boolean("notify_changes").notNull().default(true),
    /** Paused alerts are kept but not checked */
    isActive: boolean("is_active").notNull().default(true),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("search_alerts_user_id_idx").on(table.userId)],
);

export type SearchAlert = typeof searchAlerts.$inferSelect;

/**
 * What an alert already knows: one row per matching proceeding with the dates
 * it had when last seen. A key that is not here is new; a row whose dates
 * differ from the snapshot is a change.
 */
export const alertSeen = pgTable(
  "alert_seen",
  {
    alertId: uuid("alert_id")
      .notNull()
      .references(() => searchAlerts.id, { onDelete: "cascade" }),
    listingKey: varchar("listing_key", { length: 128 }).notNull(),
    /** Hearing date, rounds and cancellation as the notice stated them */
    schedule: jsonb("schedule").$type<{ hearingAt: string | null; rounds: string[]; cancelled: boolean }>().notNull(),
    seenAt: timestamp("seen_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.alertId, table.listingKey] })],
);

/**
 * One row per order placed with "zahlungspflichtig bestellen". Keeps the
 * proof of what was ordered, at which price, under which terms version and
 * with which consent (start of service before the withdrawal period ends).
 * user_id is set null when the account is deleted: the row then holds no
 * contact data any more, but stays as accounting and legal evidence.
 */
export const billingOrders = pgTable(
  "billing_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    market: varchar("market", { length: 2 }).notNull(),
    offer: varchar("offer", { length: 32 }).notNull(),
    /** Gross amount in the smallest currency unit (cent / kuruş) as shown on the order page */
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    termsVersion: varchar("terms_version", { length: 16 }).notNull(),
    /** Consumer asked for the service to start before the withdrawal period ends (§ 357a Abs. 2 BGB) */
    earlyStartConsentAt: timestamp("early_start_consent_at", { withTimezone: true }).notNull(),
    /** "open" → "paid" | "expired" | "failed"; "withdrawn" after a confirmed withdrawal */
    status: varchar("status", { length: 16 }).notNull().default("open"),
    provider: varchar("provider", { length: 16 }).notNull(),
    checkoutSessionId: varchar("checkout_session_id", { length: 255 }).unique(),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }),
    stripeInvoiceId: varchar("stripe_invoice_id", { length: 64 }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    /** Access granted by this order runs until here */
    accessEndsAt: timestamp("access_ends_at", { withTimezone: true }),
    /** Set for an upgrade: the offer it replaces. The order then pays only the prorated difference and keeps the end date. */
    upgradeFrom: varchar("upgrade_from", { length: 32 }),
    ...timestamps,
  },
  (table) => [index("billing_orders_user_id_idx").on(table.userId)],
);

export type BillingOrder = typeof billingOrders.$inferSelect;

/** Stripe webhook events already processed — Stripe redelivers, access must not be granted twice. */
export const billingEvents = pgTable("billing_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 64 }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Withdrawals (§ 356a BGB, "Vertrag widerrufen") and cancellations
 * (§ 312k BGB, "Verträge hier kündigen") as received, with the confirmation
 * that was sent. Kept as evidence of receipt; user_id is set null on deletion.
 */
export const consumerDeclarations = pgTable(
  "consumer_declarations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kind: varchar("kind", { length: 16 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    /** Contract as the person named it (customer number, e-mail of the account, order date …) */
    contractReference: varchar("contract_reference", { length: 200 }),
    /** Cancellation only: "ordinary" | "extraordinary" */
    cancellationType: varchar("cancellation_type", { length: 16 }),
    reason: text("reason"),
    /** Date the contract should end, as requested (null = next possible date) */
    requestedEnd: timestamp("requested_end", { withTimezone: true }),
    /** Date the contract ends as calculated and confirmed */
    effectiveEnd: timestamp("effective_end", { withTimezone: true }),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
    confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
    /** "received" → "processed" | "manual" (no matching contract found, a person has to look) */
    status: varchar("status", { length: 16 }).notNull().default("received"),
  },
  (table) => [index("consumer_declarations_user_id_idx").on(table.userId)],
);

export type ConsumerDeclaration = typeof consumerDeclarations.$inferSelect;

/**
 * Letterhead of a broker or adviser (Pro): what the shared client links and
 * their PDF show instead of the belowmark mark. One row per account; only
 * business contact data the broker types in, never data of their clients.
 */
export const brokerBrands = pgTable("broker_brands", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  /** Name or company as it should stand on the letterhead */
  displayName: varchar("display_name", { length: 120 }).notNull(),
  /** One line of contact (phone, e-mail), shown as typed */
  contactLine: varchar("contact_line", { length: 200 }),
  website: varchar("website", { length: 200 }),
  /** Link to the broker's own Impressum — their links are their business communication */
  imprintUrl: varchar("imprint_url", { length: 200 }),
  /** Accent colour "#rrggbb", dark enough for white text */
  accentColor: varchar("accent_color", { length: 7 }),
  /** PNG / JPEG / WebP only (checked by magic bytes), base64, at most CLIENT_SHARE.logoMaxBytes */
  logoMime: varchar("logo_mime", { length: 16 }),
  logoData: text("logo_data"),
  ...timestamps,
});

export type BrokerBrand = typeof brokerBrands.$inferSelect;

/**
 * Client links ("Kundenlinks"): a frozen copy of the verdict, bid limit and
 * financing a broker prepared for one proceeding, readable without login by
 * whoever has the link. Only the SHA-256 of the token is stored. Every link
 * expires, can be revoked, and dies with the owner's Pro access.
 */
export const clientShares = pgTable(
  "client_shares",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    market: varchar("market", { length: 2 }).notNull(),
    listingKey: varchar("listing_key", { length: 128 }).notNull(),
    /** Language the client reads: "de" | "tr" */
    locale: varchar("locale", { length: 2 }).notNull(),
    /** The broker's own reference, never shown on the link (no client names needed) */
    label: varchar("label", { length: 80 }),
    /** Note from the broker to the client, shown on the link */
    message: text("message"),
    /** Sections, figures and evidence as they stood when the link was made (see ClientSharePayload) */
    payload: jsonb("payload").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    /** Plain counter — no IP, no device, no cookie */
    viewCount: integer("view_count").notNull().default(0),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("client_shares_owner_id_idx").on(table.ownerId)],
);

export type ClientShare = typeof clientShares.$inferSelect;

/**
 * Termin-Begleiter: proceedings a user follows for deadline reminders,
 * the reminders already mailed, and the hashed token of the calendar feed.
 */
export const deadlineFollows = pgTable(
  "deadline_follows",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingKey: varchar("listing_key", { length: 128 }).notNull(),
    market: varchar("market", { length: 2 }).notNull(),
    mailEnabled: boolean("mail_enabled").notNull().default(true),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.userId, table.listingKey] })],
);

export const deadlineRemindersSent = pgTable(
  "deadline_reminders_sent",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingKey: varchar("listing_key", { length: 128 }).notNull(),
    /** "<entry id>@<date>#<offset>" — a moved date reminds again */
    sentKey: varchar("sent_key", { length: 160 }).notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.listingKey, table.sentKey] })],
);

export const deadlineFeeds = pgTable("deadline_feeds", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  /** sha256 of the token in the feed URL; the token itself is shown once */
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
});


/**
 * Team accounts: several people judge the same proceedings on one shared
 * list. The team works while its owner (role "owner" in team_members) has the
 * Pro plan; without it the content stays readable but cannot be changed.
 */
export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  /** Listing keys belong to one market, so a team works on DE or TR only */
  market: varchar("market", { length: 2 }).notNull(),
  ...timestamps,
});

export type Team = typeof teams.$inferSelect;

/** Who is in a team, and as what ("owner" | "admin" | "member" | "viewer"). Removed with the account. */
export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 16 }).notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.teamId, table.userId] }), index("team_members_user_id_idx").on(table.userId)],
);

/**
 * Open invitations. The address of someone who has not agreed to anything
 * yet is kept only until the link is used, declined, withdrawn or expires.
 * The link token is stored hashed.
 */
export const teamInvites = pgTable(
  "team_invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 16 }).notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("team_invites_team_id_idx").on(table.teamId), index("team_invites_email_idx").on(table.email)],
);

/** The team's shared list: one row per proceeding with the status the team agreed on. */
export const teamListings = pgTable(
  "team_listings",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    listingId: varchar("listing_id", { length: 128 }).notNull(),
    /** "pruefen" | "besichtigen" | "bieten" | "verworfen" */
    status: varchar("status", { length: 16 }).notNull().default("pruefen"),
    /** Set null when the person leaves the team or deletes the account */
    addedBy: uuid("added_by").references(() => users.id, { onDelete: "set null" }),
    statusBy: uuid("status_by").references(() => users.id, { onDelete: "set null" }),
    statusAt: timestamp("status_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.teamId, table.listingId] })],
);

/** Notes on a proceeding inside a team. Deleted with the author's account and when the author leaves. */
export const teamNotes = pgTable(
  "team_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    listingId: varchar("listing_id", { length: 128 }).notNull(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("team_notes_team_listing_idx").on(table.teamId, table.listingId), index("team_notes_author_id_idx").on(table.authorId)],
);

// Tables of the after-Zuschlag module (hearing results, closing cases)
export * from "./closingSchema";

// Tables of the invoices on /konto (billing_invoices, billing_profiles)
export * from "./invoiceSchema";
