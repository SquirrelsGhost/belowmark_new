import { sql } from "drizzle-orm";
import { boolean, index, integer, pgSequence, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
// Circular on purpose: schema.ts re-exports this file. `users` and `billingOrders` are only read lazily inside references().
import { billingOrders, users } from "./schema";

/** Same audit columns as `timestamps` in schema.ts — copied, because that constant is not initialised yet when this file runs. */
const auditColumns = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/** Source of the running invoice number (§ 14 Abs. 4 Nr. 4 UStG: unique, ascending; gaps are allowed). */
export const billingInvoiceSeq = pgSequence("billing_invoice_seq", { startWith: 1 });

/**
 * One invoice per payment: the first payment of an order and every monthly
 * renewal Stripe collects. Everything the document prints is frozen here at
 * the time of issue — prices, VAT mode, period and recipient — so a later
 * change of the price table or the account never changes an issued invoice.
 * user_id is set null when the account is deleted; the row stays, because
 * invoices have to be kept for ten years (§ 14b UStG, § 147 AO).
 */
export const billingInvoices = pgTable(
  "billing_invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    /** Value of billing_invoice_seq, the number is built from it once and stored */
    seq: integer("seq").notNull().unique(),
    /** "BM-2026-00001" */
    number: varchar("number", { length: 32 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    /** "order" = first payment of an order, "renewal" = a later month of a subscription */
    kind: varchar("kind", { length: 16 }).notNull(),
    /** The order behind it; unique for kind "order", so an order is invoiced once */
    orderId: uuid("order_id").references(() => billingOrders.id, { onDelete: "set null" }),
    /** Stripe invoice that collected a renewal — unique, Stripe redelivers events */
    stripeInvoiceId: varchar("stripe_invoice_id", { length: 64 }).unique(),
    offer: varchar("offer", { length: 32 }).notNull(),
    market: varchar("market", { length: 2 }).notNull(),
    /** Gross amount paid, smallest unit (cent / kuruş) */
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    /** BILLING_VAT_MODE at issue: "inclusive" | "kleinunternehmer"; null = not decided (the document shows a gap) */
    vatMode: varchar("vat_mode", { length: 16 }),
    /** VAT rate in basis points (1900 = 19 %), only for "inclusive" */
    vatRateBp: integer("vat_rate_bp"),
    netAmount: integer("net_amount"),
    vatAmount: integer("vat_amount"),
    /** Period of service (§ 14 Abs. 4 Nr. 6 UStG) */
    serviceFrom: timestamp("service_from", { withTimezone: true }).notNull(),
    serviceTo: timestamp("service_to", { withTimezone: true }).notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
    recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
    /** Name and address as the customer entered them under Rechnungsadresse; null until given */
    recipientName: text("recipient_name"),
    recipientAddress: text("recipient_address"),
    recipientVatId: varchar("recipient_vat_id", { length: 32 }),
    /** Paid in the local test checkout — the document says it is no invoice */
    isTest: boolean("is_test").notNull().default(false),
    issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
    ...auditColumns(),
  },
  (table) => [
    index("billing_invoices_user_id_idx").on(table.userId),
    index("billing_invoices_order_id_idx").on(table.orderId),
    uniqueIndex("billing_invoices_order_kind_unique").on(table.orderId).where(sql`${table.kind} in ('order', 'upgrade')`),
  ],
);

export type BillingInvoice = typeof billingInvoices.$inferSelect;

/**
 * Billing address of an account, as the customer types it. Only needed for
 * invoices above 250 € (Kleinbetragsrechnung, § 33 UStDV) and for business
 * customers who deduct input tax. Deleted with the account.
 */
export const billingProfiles = pgTable("billing_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  /** Street, postcode and city, country — several lines */
  address: text("address").notNull(),
  vatId: varchar("vat_id", { length: 32 }),
  ...auditColumns(),
});

export type BillingProfile = typeof billingProfiles.$inferSelect;
