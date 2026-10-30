import "server-only";
import { and, desc, eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { billingOrders, users } from "@/db/schema";
import { BILLING_ROUTES, BILLING_STATUS, BillingOfferId, MIN_UPGRADE_CHARGE, OFFERS, TERMS_VERSION, UPGRADES } from "@/lib/billing/billingConfig";
import { BILLING_ACCOUNT_PARAM } from "@/lib/billing/billingRoutes";
import { isChargeable, proratedUpgradeAmount } from "@/lib/billing/upgradeMath";
import { isPricingCountry, MarketCode, PricingCountryCode } from "@/lib/constants";
import { env } from "@/lib/env";
import { BillingFulfillment } from "@/services/billing/BillingFulfillment";
import { BillingService, OrderingUser } from "@/services/billing/BillingService";
import { stripeClient } from "@/services/billing/StripeClient";
import { OrderResult, UpgradeQuote } from "@/types/billing.types";

const absolute = (path: string): string => `${env.appUrl.replace(/\/+$/, "")}${path}`;
const PAID_URL = `/konto?${BILLING_ACCOUNT_PARAM}=${BILLING_STATUS.paid}#tarif`;

/** Resolves the specific pricing country (DE, AT, CH, IT, ES, FR, GB, TR) from the user's latest paid Investor order. */
async function resolveBookedPricingCountry(userId: string, fallbackMarket: MarketCode | PricingCountryCode): Promise<PricingCountryCode> {
  const [lastOrder] = await db
    .select({ market: billingOrders.market })
    .from(billingOrders)
    .where(and(eq(billingOrders.userId, userId), eq(billingOrders.status, "paid")))
    .orderBy(desc(billingOrders.paidAt))
    .limit(1);
  if (lastOrder && isPricingCountry(lastOrder.market)) return lastOrder.market;
  return isPricingCountry(fallbackMarket) ? fallbackMarket : "DE";
}

/** Fixed Stripe product per offer, so an upgrade never needs a price set up by hand. */
async function ensureProduct(stripe: Stripe, offerId: BillingOfferId, name: string): Promise<string> {
  const id = `belowmark_${offerId.replace("-", "_")}`;
  try {
    return (await stripe.products.retrieve(id)).id;
  } catch {
    return (await stripe.products.create({ id, name, metadata: { belowmark_offer: offerId } })).id;
  }
}

/** The running subscription of an account, if Stripe holds one. */
async function runningSubscription(userId: string): Promise<Stripe.Subscription | null> {
  if (!env.stripeSecretKey) return null;
  const [row] = await db.select({ id: users.stripeSubscriptionId }).from(users).where(eq(users.id, userId));
  if (!row?.id) return null;
  const subscription = await stripeClient().subscriptions.retrieve(row.id);
  return subscription.status === "active" || subscription.status === "trialing" ? subscription : null;
}

/**
 * BillingUpgradeService
 *
 * Investor → Pro while Investor runs. The end date stays; the customer pays
 * the prorated difference for the rest of the paid period (upgradeMath.ts).
 * - Monthly subscription on Stripe: the subscription item is swapped to the
 *   Pro price and Stripe invoices the proration at once. Payment failures or
 *   3-D Secure leave the subscription unchanged until the invoice is paid.
 * - Three-month term (or the test checkout): a one-time payment of the
 *   difference through Checkout, fulfilled like every order.
 */
export class BillingUpgradeService {
  /** What an upgrade would cost now — null when no upgrade applies. */
  static quote = async (userId: string, fallbackMarket: MarketCode | PricingCountryCode): Promise<UpgradeQuote | null> => {
    const access = await BillingService.access(userId);
    const from = access.offer;
    const to = from ? UPGRADES[from] : undefined;
    if (!access.isActive || access.plan !== "investor" || !from || !to || !access.endsAt) return null;
    const market = await resolveBookedPricingCountry(userId, fallbackMarket);
    const currency = OFFERS[to].prices[market].currency;
    const subscription = OFFERS[from].kind === "subscription" ? await runningSubscription(userId) : null;
    const rawAmount = subscription
      ? await BillingUpgradeService.stripePreview(subscription, to, market)
      : proratedUpgradeAmount(from, to, market, access.endsAt);
    const isHigherPlan = OFFERS[to].prices[market].amount > OFFERS[from].prices[market].amount;
    const minCharge = Math.max(100, MIN_UPGRADE_CHARGE[currency]);
    const effectiveAmount = isChargeable(rawAmount, currency) ? Math.max(100, rawAmount) : isHigherPlan ? minCharge : 0;
    return {
      from,
      to,
      market,
      currency,
      amount: effectiveAmount,
      endsAt: access.endsAt,
      renews: access.renews,
      viaSubscription: Boolean(subscription),
    };
  };

  /** Records the upgrade and returns where the browser goes next. */
  static place = async (user: OrderingUser, consentAt: Date): Promise<OrderResult> => {
    const quote = await BillingUpgradeService.quote(user.id, user.market);
    if (!quote) throw new Error("order blocked: no upgrade");
    const availability = BillingService.availability(quote.market);
    if (availability.blocker) throw new Error(`billing unavailable: ${availability.blocker}`);

    const [order] = await db
      .insert(billingOrders)
      .values({
        userId: user.id,
        market: quote.market,
        offer: quote.to,
        upgradeFrom: quote.from,
        amount: quote.amount,
        currency: quote.currency,
        termsVersion: TERMS_VERSION,
        earlyStartConsentAt: consentAt,
        provider: availability.mode === "test" ? "test" : "stripe",
      })
      .returning({ id: billingOrders.id });

    if (availability.mode === "test") return { redirectUrl: `${BILLING_ROUTES.testCheckout}?bestellung=${order.id}` };

    // Nothing left to pay (last hours of the term): switch at once
    if (quote.amount === 0 && !quote.viaSubscription) {
      await BillingFulfillment.fulfilOrder(order.id, { subscription: null, invoiceId: null });
      return { redirectUrl: PAID_URL };
    }
    if (quote.viaSubscription) return BillingUpgradeService.swapSubscription(order.id, user, quote);
    return BillingUpgradeService.checkoutDifference(order.id, user, quote);
  };

  /** Stripe's own number for the switch, to the cent, as it will be invoiced. */
  private static stripePreview = async (subscription: Stripe.Subscription, to: BillingOfferId, market: PricingCountryCode): Promise<number> => {
    const stripe = stripeClient();
    const preview = await stripe.invoices.createPreview({
      customer: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      subscription: subscription.id,
      subscription_details: {
        items: [{ id: subscription.items.data[0].id, ...(await BillingUpgradeService.priceParam(stripe, to, market)) }],
        proration_behavior: "always_invoice",
        proration_date: Math.floor(Date.now() / 1000),
      },
    });
    return preview.amount_due;
  };

  /** A configured Pro price, otherwise the price from the table on a fixed product. */
  private static priceParam = async (stripe: Stripe, to: BillingOfferId, market: PricingCountryCode) => {
    const offer = OFFERS[to];
    const priceId = env.stripePrice(offer.priceEnv[market]);
    if (priceId) return { price: priceId };
    const product = await ensureProduct(stripe, to, market === "TR" ? "Belowmark Pro · Aylık" : "Belowmark Pro · Monatlich");
    const price = offer.prices[market];
    return { price_data: { currency: price.currency, unit_amount: price.amount, product, recurring: { interval: "month" as const } } };
  };

  private static swapSubscription = async (orderId: string, user: OrderingUser, quote: UpgradeQuote): Promise<OrderResult> => {
    const stripe = stripeClient();
    const subscription = await runningSubscription(user.id);
    if (!subscription) throw new Error("order blocked: subscription not running");
    await db.update(billingOrders).set({ stripeSubscriptionId: subscription.id }).where(eq(billingOrders.id, orderId));
    const targetOffer = quote.to;
    const updated = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [{ id: subscription.items.data[0].id, ...(await BillingUpgradeService.priceParam(stripe, targetOffer, quote.market)) }],
        metadata: { orderId: String(orderId), userId: String(user.id), offer: targetOffer },
        proration_behavior: quote.amount === 0 ? "none" : "always_invoice",
        // Not applied until the difference is paid — a declined card changes nothing
        payment_behavior: "pending_if_incomplete",
        expand: ["latest_invoice"],
      },
      { idempotencyKey: `upgrade-${orderId}` },
    );
    const invoice = typeof updated.latest_invoice === "object" ? updated.latest_invoice : null;
    if (invoice?.id) await db.update(billingOrders).set({ stripeInvoiceId: invoice.id }).where(eq(billingOrders.id, orderId));
    if (!updated.pending_update && (!invoice || invoice.status === "paid")) {
      await BillingFulfillment.fulfilUpgradeInvoice(orderId, invoice, updated);
      return { redirectUrl: PAID_URL };
    }
    // 3-D Secure or a failed card: Stripe's invoice page collects it, the webhook (invoice.paid) finishes the switch
    if (invoice?.hosted_invoice_url) return { redirectUrl: invoice.hosted_invoice_url };
    return { redirectUrl: `/konto?${BILLING_ACCOUNT_PARAM}=${BILLING_STATUS.pending}#tarif` };
  };

  private static checkoutDifference = async (orderId: string, user: OrderingUser, quote: UpgradeQuote): Promise<OrderResult> => {
    const customer = await BillingService.ensureCustomer(user);
    const metadata = { orderId, userId: user.id, offer: quote.to, upgradeFrom: quote.from, market: quote.market, termsVersion: TERMS_VERSION };
    const name = user.locale === "tr" ? "Belowmark Pro'ya yükseltme · kalan süre" : "Belowmark Upgrade auf Pro · Restlaufzeit";
    const session = await stripeClient().checkout.sessions.create(
      {
        mode: "payment",
        customer,
        client_reference_id: orderId,
        line_items: [{ price_data: { currency: quote.currency, unit_amount: quote.amount, product_data: { name } }, quantity: 1 }],
        locale: user.locale === "tr" ? "tr" : "de",
        success_url: absolute(`${BILLING_ROUTES.confirm}?session_id={CHECKOUT_SESSION_ID}`),
        cancel_url: absolute(`${BILLING_ROUTES.upgrade}?status=${BILLING_STATUS.cancelled}`),
        metadata,
        invoice_creation: { enabled: true, invoice_data: { metadata } },
        payment_intent_data: { metadata },
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      { idempotencyKey: `upgrade-${orderId}` },
    );
    await db.update(billingOrders).set({ checkoutSessionId: session.id }).where(eq(billingOrders.id, orderId));
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { redirectUrl: session.url };
  };
}
