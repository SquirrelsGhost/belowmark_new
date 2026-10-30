import "server-only";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { BillingInvoice, billingInvoices, BillingProfile, billingProfiles, billingOrders, users } from "@/db/schema";
import { isOfferId, OFFERS } from "@/lib/billing/billingConfig";
import { env } from "@/lib/env";
import { INVOICE_KINDS, InvoiceKind, TR_KDV_RATE_BP, TR_VAT_MODES, VAT_RATE_BP } from "@/lib/invoice/invoiceConfig";
import { invoiceNumber, orderServicePeriod, splitGross } from "@/lib/invoice/invoiceMath";
import { isStripeTestKey } from "@/services/billing/StripeClient";

/** What a new invoice row needs besides number, VAT and recipient. */
interface InvoiceDraft {
  kind: InvoiceKind;
  userId: string;
  orderId: string | null;
  stripeInvoiceId: string | null;
  offer: string;
  market: string;
  amount: number;
  currency: string;
  serviceFrom: Date;
  serviceTo: Date;
  paidAt: Date;
  isTest: boolean;
}

export interface BillingProfileInput {
  name: string;
  address: string;
  vatId: string | null;
}

const fromUnix = (seconds: number | null | undefined): Date | null => (seconds ? new Date(seconds * 1000) : null);

/**
 * VAT columns as the settings say now — frozen into the invoice. Market TR:
 * the place of supply of an electronic service is the customer's (§ 3a Abs. 2 / Abs. 5 UStG),
 * so no German VAT; Turkish KDV only once BILLING_TR_KDV=inclusive is set.
 */
function vatColumns(amount: number, market: string) {
  if (market === "TR") {
    if (!env.billingTrKdvIncluded) return { vatMode: TR_VAT_MODES.open, vatRateBp: null, netAmount: null, vatAmount: null };
    const { net, vat } = splitGross(amount, TR_KDV_RATE_BP);
    return { vatMode: TR_VAT_MODES.kdv, vatRateBp: TR_KDV_RATE_BP, netAmount: net, vatAmount: vat };
  }
  const vatMode = env.billingVatMode;
  if (vatMode !== "inclusive") return { vatMode, vatRateBp: null, netAmount: null, vatAmount: null };
  const { net, vat } = splitGross(amount, VAT_RATE_BP);
  return { vatMode, vatRateBp: VAT_RATE_BP, netAmount: net, vatAmount: vat };
}

/**
 * InvoiceService
 *
 * Belowmark's own invoices: one per payment, numbered from a database
 * sequence, frozen at issue and kept when the account goes. Issued when a
 * payment is confirmed (BillingFulfillment) and for every renewal Stripe
 * collects; paid orders that have none yet (paid before this existed, or a
 * failed issue) get theirs the next time the account opens its invoices.
 */
export class InvoiceService {
  /** Inserts one invoice with the next number. Returns null when this payment already has one. */
  private static issue = async (draft: InvoiceDraft): Promise<BillingInvoice | null> => {
    const [account] = await db.select({ email: users.email }).from(users).where(eq(users.id, draft.userId));
    if (!account) return null;
    const [profile] = await db.select().from(billingProfiles).where(eq(billingProfiles.userId, draft.userId));
    const seqResult = await db.execute(sql`select nextval('billing_invoice_seq')::int as seq`);
    const seq = Number((seqResult.rows[0] as { seq: number | string }).seq);
    const issuedAt = new Date();
    const [row] = await db
      .insert(billingInvoices)
      .values({
        ...draft,
        ...vatColumns(draft.amount, draft.market),
        seq,
        number: invoiceNumber(seq, issuedAt),
        issuedAt,
        recipientEmail: account.email,
        recipientName: profile?.name ?? null,
        recipientAddress: profile?.address ?? null,
        recipientVatId: profile?.vatId ?? null,
      })
      .onConflictDoNothing()
      .returning();
    return row ?? null;
  };

  /** Invoice for the first payment of an order, or for the difference of an upgrade. Safe to call more than once. */
  static issueForOrder = async (orderId: string): Promise<BillingInvoice | null> => {
    const [order] = await db.select().from(billingOrders).where(eq(billingOrders.id, orderId));
    if (!order?.userId || order.status !== "paid" || !order.paidAt || !isOfferId(order.offer) || order.amount <= 0) return null;
    const kind = order.upgradeFrom ? INVOICE_KINDS.upgrade : INVOICE_KINDS.order;
    const [existing] = await db
      .select({ id: billingInvoices.id })
      .from(billingInvoices)
      .where(and(eq(billingInvoices.orderId, orderId), inArray(billingInvoices.kind, [INVOICE_KINDS.order, INVOICE_KINDS.upgrade])));
    if (existing) return null;
    // An upgrade covers the rest of the running period: from payment to the unchanged end
    const period = order.upgradeFrom
      ? { from: order.paidAt, to: order.accessEndsAt ?? order.paidAt }
      : orderServicePeriod(order.paidAt, order.accessEndsAt, OFFERS[order.offer].months);
    return InvoiceService.issue({
      kind,
      userId: order.userId,
      orderId: order.id,
      stripeInvoiceId: order.stripeInvoiceId,
      offer: order.offer,
      market: order.market,
      amount: order.amount,
      currency: order.currency,
      serviceFrom: period.from,
      serviceTo: period.to,
      paidAt: order.paidAt,
      isTest: order.provider === "test" || isStripeTestKey(),
    });
  };

  /** Invoice for a month Stripe collected on a running subscription (not the first one — that is the order's). */
  static issueForRenewal = async (invoice: Stripe.Invoice): Promise<BillingInvoice | null> => {
    if (invoice.billing_reason !== "subscription_cycle" || invoice.amount_paid <= 0) return null;
    const subscription = invoice.parent?.subscription_details?.subscription;
    const subscriptionId = typeof subscription === "string" ? subscription : subscription?.id;
    if (!subscriptionId) return null;
    const [user] = await db.select({ id: users.id, offer: users.planOffer, market: users.market }).from(users).where(eq(users.stripeSubscriptionId, subscriptionId));
    if (!user || !isOfferId(user.offer)) return null;
    const line = invoice.lines.data[0];
    const from = fromUnix(line?.period.start) ?? new Date();
    return InvoiceService.issue({
      kind: INVOICE_KINDS.renewal,
      userId: user.id,
      orderId: null,
      stripeInvoiceId: invoice.id ?? null,
      offer: user.offer,
      market: user.market,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      serviceFrom: from,
      serviceTo: fromUnix(line?.period.end) ?? from,
      paidAt: fromUnix(invoice.status_transitions.paid_at) ?? new Date(),
      isTest: !invoice.livemode,
    });
  };

  /** Issues the invoices missing for paid orders of this account. */
  static catchUp = async (userId: string): Promise<void> => {
    // Two plain queries: subqueries do not pass through the lazy db proxy
    const [paid, invoiced] = await Promise.all([
      db
        .select({ id: billingOrders.id })
        .from(billingOrders)
        .where(and(eq(billingOrders.userId, userId), eq(billingOrders.status, "paid")))
        .orderBy(billingOrders.paidAt),
      db
        .select({ orderId: billingInvoices.orderId })
        .from(billingInvoices)
        .where(and(eq(billingInvoices.userId, userId), inArray(billingInvoices.kind, [INVOICE_KINDS.order, INVOICE_KINDS.upgrade]))),
    ]);
    const done = new Set(invoiced.map((row) => row.orderId));
    for (const order of paid) if (!done.has(order.id)) await InvoiceService.issueForOrder(order.id);
  };

  /** Invoices of an account, newest first. */
  static listForUser = async (userId: string): Promise<BillingInvoice[]> => {
    await InvoiceService.catchUp(userId).catch((error) => console.error("[invoice] catch up", error));
    return db.select().from(billingInvoices).where(eq(billingInvoices.userId, userId)).orderBy(desc(billingInvoices.seq));
  };

  /** One invoice, only for its own account. */
  static getForUser = async (invoiceId: string, userId: string): Promise<BillingInvoice | null> => {
    if (!/^[0-9a-f-]{36}$/.test(invoiceId)) return null;
    const [row] = await db.select().from(billingInvoices).where(and(eq(billingInvoices.id, invoiceId), eq(billingInvoices.userId, userId)));
    return row ?? null;
  };

  static profile = async (userId: string): Promise<BillingProfile | null> => {
    const [row] = await db.select().from(billingProfiles).where(eq(billingProfiles.userId, userId));
    return row ?? null;
  };

  /**
   * Saves the billing address. Invoices issued without any address get it
   * filled in once (completing a missing mandatory detail, § 31 Abs. 5 UStDV);
   * invoices that already name a recipient stay as issued.
   */
  static saveProfile = async (userId: string, input: BillingProfileInput): Promise<void> => {
    await db
      .insert(billingProfiles)
      .values({ userId, ...input })
      .onConflictDoUpdate({ target: billingProfiles.userId, set: { ...input, updatedAt: new Date() } });
    const incomplete = await db
      .select({ id: billingInvoices.id })
      .from(billingInvoices)
      .where(and(eq(billingInvoices.userId, userId), isNull(billingInvoices.recipientName)));
    if (!incomplete.length) return;
    await db
      .update(billingInvoices)
      .set({ recipientName: input.name, recipientAddress: input.address, recipientVatId: input.vatId })
      .where(inArray(billingInvoices.id, incomplete.map((row) => row.id)));
  };

  /** For the Art. 15 export. */
  static exportFor = async (userId: string): Promise<{ invoices: BillingInvoice[]; billingProfile: BillingProfile | null }> => ({
    invoices: await db.select().from(billingInvoices).where(eq(billingInvoices.userId, userId)).orderBy(billingInvoices.seq),
    billingProfile: await InvoiceService.profile(userId),
  });
}
