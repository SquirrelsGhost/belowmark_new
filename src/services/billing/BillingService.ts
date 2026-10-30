import "server-only";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { BillingOrder, billingOrders, users } from "@/db/schema";
import {
  BILLING_ROUTES,
  BILLING_STATUS,
  BillingOffer,
  BillingOfferId,
  isOfferId,
  OFFER_PARAM,
  OFFERS,
  TERMS_VERSION,
} from "@/lib/billing/billingConfig";
import { MarketCode } from "@/lib/constants";
import { env } from "@/lib/env";
import { isStripeTestKey, stripeClient } from "@/services/billing/StripeClient";
import { BillingAccess, BillingAvailability, OrderBlocker, OrderResult } from "@/types/billing.types";

/** What the order needs to know about the person ordering. */
export interface OrderingUser {
  id: string;
  email: string;
  market: MarketCode;
  locale: string;
}

/** Stripe must sell exactly the price shown on the order page — never a swapped id. */
function priceMatches(price: Stripe.Price, offer: BillingOffer, market: MarketCode): boolean {
  const expected = offer.prices[market];
  const cadence =
    offer.kind === "subscription"
      ? price.recurring?.interval === "month" && (price.recurring.interval_count ?? 1) === 1
      : !price.recurring;
  return price.active && cadence && price.currency === expected.currency && price.unit_amount === expected.amount;
}

const absolute = (path: string): string => `${env.appUrl.replace(/\/+$/, "")}${path}`;

/**
 * BillingService
 *
 * Booking of the Investor offers. Payment runs only on Stripe's hosted
 * checkout page: card data never touches this server, we keep the Stripe
 * customer id and what was ordered. Without a Stripe key, development offers
 * a local test checkout that walks the same fulfilment path.
 */
export class BillingService {
  /** Can this market be booked right now? Says honestly why not. */
  static availability = (market: MarketCode): BillingAvailability => {
    const vatMode = env.billingVatMode;
    if (!env.stripeSecretKey) {
      return env.billingTestCheckout
        ? { mode: "test", blocker: null, vatMode, isTest: true }
        : { mode: "off", blocker: "not_configured", vatMode, isTest: false };
    }
    const isTest = isStripeTestKey();
    const base = { mode: "stripe" as const, vatMode, isTest };
    if (!isTest && (!env.billingLegalApproved || !vatMode)) return { ...base, blocker: "legal_not_approved" };
    if (market === "TR" && !env.billingTrEnabled && !isTest) return { ...base, blocker: "market_closed" };
    return { ...base, blocker: null };
  };

  /** Paid access of an account. */
  static access = async (userId: string): Promise<BillingAccess> => {
    const [row] = await db
      .select({
        plan: users.plan,
        offer: users.planOffer,
        endsAt: users.planEndsAt,
        cancelAt: users.planCancelAt,
        subscriptionId: users.stripeSubscriptionId,
        customerId: users.stripeCustomerId,
      })
      .from(users)
      .where(eq(users.id, userId));
    const now = Date.now();
    const isActive = Boolean(row?.plan) && (row?.endsAt === null || (row?.endsAt?.getTime() ?? 0) > now);
    const offer = isOfferId(row?.offer) ? row.offer : null;
    return {
      plan: row?.plan ?? null,
      offer,
      endsAt: row?.endsAt ?? null,
      cancelAt: row?.cancelAt ?? null,
      renews: isActive && offer !== null && OFFERS[offer].kind === "subscription" && !row?.cancelAt,
      isActive,
      hasStripeCustomer: Boolean(row?.customerId),
    };
  };

  /**
   * One paid access at a time, in one market:
   * - Investor running → Pro only as an upgrade (prorated, same end date).
   * - Pro running → no Investor booking on top (that would be a downgrade).
   * - A running monthly subscription blocks every other order (no double charge).
   * - A three-month term may be extended by the same offer.
   * - Another market only once nothing renews; it replaces the current one when paid.
   */
  static orderBlocker = (
    access: BillingAccess,
    offerId: BillingOfferId,
    currentMarket?: MarketCode,
    targetMarket?: MarketCode,
  ): OrderBlocker | null => {
    if (!access.isActive || !access.endsAt) return null;
    if (currentMarket && targetMarket && currentMarket !== targetMarket) return access.renews ? "other_market" : null;
    const wanted = OFFERS[offerId].plan;
    if (access.plan === "investor" && wanted === "pro") return "use_upgrade";
    if (access.plan === "pro" && wanted === "investor") return "pro_running";
    if (access.renews) return "subscription_running";
    if (OFFERS[offerId].kind === "subscription") return "term_running";
    return null;
  };

  /** Records the order and returns where the browser pays for it. */
  static placeOrder = async (
    user: OrderingUser,
    offerId: BillingOfferId,
    consentAt: Date,
    currentMarket: MarketCode = user.market,
  ): Promise<OrderResult> => {
    const availability = BillingService.availability(user.market);
    if (availability.blocker) throw new Error(`billing unavailable: ${availability.blocker}`);
    const access = await BillingService.access(user.id);
    const blocker = BillingService.orderBlocker(access, offerId, currentMarket, user.market);
    if (blocker) throw new Error(`order blocked: ${blocker}`);
    if (!access.isActive && currentMarket !== user.market) {
      await db.update(users).set({ market: user.market }).where(eq(users.id, user.id));
    }

    const offer = OFFERS[offerId];
    const price = offer.prices[user.market];
    const [order] = await db
      .insert(billingOrders)
      .values({
        userId: user.id,
        market: user.market,
        offer: offerId,
        amount: price.amount,
        currency: price.currency,
        termsVersion: TERMS_VERSION,
        earlyStartConsentAt: consentAt,
        provider: availability.mode === "test" ? "test" : "stripe",
      })
      .returning({ id: billingOrders.id });

    if (availability.mode === "test") {
      return { redirectUrl: `${BILLING_ROUTES.testCheckout}?bestellung=${order.id}` };
    }

    const stripe = stripeClient();
    const priceId = env.stripePrice(offer.priceEnv[user.market]);
    if (priceId) {
      const stripePrice = await stripe.prices.retrieve(priceId);
      if (!priceMatches(stripePrice, offer, user.market)) {
        await db.update(billingOrders).set({ status: "failed" }).where(eq(billingOrders.id, order.id));
        throw new Error(`Stripe price ${priceId} does not match ${offerId}/${user.market} (amount, currency or interval)`);
      }
    }

    const productName =
      offerId === "pro-monat"
        ? user.locale === "tr"
          ? "Belowmark Pro · Aylık"
          : "Belowmark Pro · Monatlich"
        : offerId === "pro-quartal"
          ? user.locale === "tr"
            ? "Belowmark Pro · 3 Ay"
            : "Belowmark Pro · 3 Monate"
          : offerId === "investor-monat"
            ? user.locale === "tr"
              ? "Belowmark Investor · Aylık"
              : "Belowmark Investor · Monatlich"
            : user.locale === "tr"
              ? "Belowmark Investor · 3 Ay"
              : "Belowmark Investor · 3 Monate";

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: price.currency,
            unit_amount: price.amount,
            product_data: { name: productName },
            ...(offer.kind === "subscription" ? { recurring: { interval: "month" } } : {}),
          },
          quantity: 1,
        };

    const customer = await BillingService.ensureCustomer(user);
    const metadata = { orderId: order.id, userId: user.id, offer: offerId, market: user.market, termsVersion: TERMS_VERSION };
    const session = await stripe.checkout.sessions.create(
      {
        mode: offer.kind === "subscription" ? "subscription" : "payment",
        customer,
        client_reference_id: order.id,
        line_items: [lineItem],
        locale: user.locale === "tr" ? "tr" : "de",
        success_url: absolute(`${BILLING_ROUTES.confirm}?session_id={CHECKOUT_SESSION_ID}`),
        cancel_url: absolute(`${BILLING_ROUTES.order}?${OFFER_PARAM}=${offerId}&status=${BILLING_STATUS.cancelled}`),
        metadata,
        ...(offer.kind === "subscription"
          ? { subscription_data: { metadata } }
          : { invoice_creation: { enabled: true, invoice_data: { metadata } }, payment_intent_data: { metadata } }),
        ...(env.stripeAutomaticTax
          ? { automatic_tax: { enabled: true }, tax_id_collection: { enabled: true }, customer_update: { address: "auto", name: "auto" } }
          : {}),
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      { idempotencyKey: `order-${order.id}` },
    );
    await db.update(billingOrders).set({ checkoutSessionId: session.id }).where(eq(billingOrders.id, order.id));
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { redirectUrl: session.url };
  };

  /** The Stripe customer of an account, created on the first order (only the e-mail is sent). */
  static ensureCustomer = async (user: OrderingUser): Promise<string> => {
    const [row] = await db.select({ customerId: users.stripeCustomerId }).from(users).where(eq(users.id, user.id));
    if (row?.customerId) return row.customerId;
    const customer = await stripeClient().customers.create(
      { email: user.email, preferred_locales: [user.locale === "tr" ? "tr" : "de"], metadata: { userId: user.id } },
      { idempotencyKey: `customer-${user.id}` },
    );
    await db.update(users).set({ stripeCustomerId: customer.id }).where(and(eq(users.id, user.id)));
    return customer.id;
  };

  /** Stripe's customer portal: invoices, payment method, billing address. */
  static portalUrl = async (userId: string, locale: string): Promise<string | null> => {
    if (!env.stripeSecretKey) return null;
    const [row] = await db.select({ customerId: users.stripeCustomerId }).from(users).where(eq(users.id, userId));
    if (!row?.customerId) return null;
    const session = await stripeClient().billingPortal.sessions.create({
      customer: row.customerId,
      return_url: absolute("/konto?bereich=tarif"),
      locale: locale === "tr" ? "tr" : "de",
    });
    return session.url;
  };

  /**
   * Ordinary cancellation of the monthly subscription to the end of the paid
   * month (never more than one month away). Returns the date access ends, or
   * null when nothing renews that could be cancelled.
   */
  static cancelRenewal = async (userId: string): Promise<Date | null> => {
    const access = await BillingService.access(userId);
    if (!access.renews || !access.endsAt) return access.isActive ? (access.cancelAt ?? access.endsAt) : null;
    const [row] = await db.select({ subscriptionId: users.stripeSubscriptionId }).from(users).where(eq(users.id, userId));
    // Set first, so the webhook that follows does not send a second confirmation
    await db.update(users).set({ planCancelAt: access.endsAt }).where(eq(users.id, userId));
    if (row?.subscriptionId && env.stripeSecretKey) {
      try {
        const subscription = await stripeClient().subscriptions.update(row.subscriptionId, { cancel_at_period_end: true });
        const end = subscription.items.data.map((item) => item.current_period_end).sort((a, b) => b - a)[0];
        return end ? new Date(end * 1000) : access.endsAt;
      } catch (error) {
        await db.update(users).set({ planCancelAt: null }).where(eq(users.id, userId));
        throw error;
      }
    }
    return access.endsAt;
  };

  /** Ends a running subscription at once (account deletion). The paid rest lapses, as the page says. */
  static endSubscriptionNow = async (userId: string): Promise<void> => {
    const [row] = await db.select({ subscriptionId: users.stripeSubscriptionId }).from(users).where(eq(users.id, userId));
    if (row?.subscriptionId && env.stripeSecretKey) {
      await stripeClient().subscriptions.cancel(row.subscriptionId);
    }
  };

  /** An open order of the local test checkout — only while that checkout is allowed (never in production). */
  static openTestOrder = async (orderId: string, userId: string): Promise<BillingOrder | null> => {
    if (process.env.NODE_ENV === "production" || !env.billingTestCheckout || env.stripeSecretKey || !/^[0-9a-f-]{36}$/.test(orderId)) return null;
    const [order] = await db
      .select()
      .from(billingOrders)
      .where(and(eq(billingOrders.id, orderId), eq(billingOrders.userId, userId), eq(billingOrders.provider, "test"), eq(billingOrders.status, "open")));
    return order ?? null;
  };
}
