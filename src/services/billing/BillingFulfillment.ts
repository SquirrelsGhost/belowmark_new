import "server-only";
import { and, eq, ne } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { billingEvents, billingOrders, users } from "@/db/schema";
import { isOfferId, OFFERS } from "@/lib/billing/billingConfig";
import { addCalendarMonths, laterOf } from "@/lib/billing/billingDates";
import { BillingMailService } from "@/services/billing/BillingMailService";
import { stripeClient } from "@/services/billing/StripeClient";

/** Stripe statuses that end the access of a subscription. */
const ENDED_STATUSES = new Set<Stripe.Subscription.Status>(["canceled", "unpaid", "incomplete_expired"]);

const fromUnix = (seconds: number | null | undefined): Date | null => (seconds ? new Date(seconds * 1000) : null);

/** End of the period already paid; the dahlia API keeps it on the items. */
function periodEnd(subscription: Stripe.Subscription): Date | null {
  const ends = subscription.items.data.map((item) => item.current_period_end).filter((value) => Number.isFinite(value));
  return ends.length ? fromUnix(Math.max(...ends)) : null;
}

/** When a cancelled subscription stops: an explicit cancel_at, otherwise the end of the paid period. */
function cancelDate(subscription: Stripe.Subscription): Date | null {
  if (subscription.cancel_at) return fromUnix(subscription.cancel_at);
  return subscription.cancel_at_period_end ? periodEnd(subscription) : null;
}

const idOf = (value: string | { id: string } | null | undefined): string | null =>
  typeof value === "string" ? value : (value?.id ?? null);

/**
 * BillingFulfillment
 *
 * Turns a confirmed payment into access and keeps the access in step with
 * Stripe. Every path (success page, webhook, test checkout) ends in
 * `fulfilOrder`, which only the first caller gets through — a webhook that
 * arrives twice never extends a term twice.
 */
export class BillingFulfillment {
  static fulfilOrder = async (orderId: string, details: { subscription: Stripe.Subscription | null; invoiceId: string | null }): Promise<boolean> => {
    const [claimed] = await db
      .update(billingOrders)
      .set({ status: "paid", paidAt: new Date(), stripeInvoiceId: details.invoiceId, stripeSubscriptionId: details.subscription?.id ?? null })
      .where(and(eq(billingOrders.id, orderId), ne(billingOrders.status, "paid")))
      .returning();
    if (!claimed?.userId || !isOfferId(claimed.offer)) return false;

    const offer = OFFERS[claimed.offer];
    const [user] = await db.select({ planEndsAt: users.planEndsAt }).from(users).where(eq(users.id, claimed.userId));
    const now = new Date();
    const endsAt = details.subscription
      ? (periodEnd(details.subscription) ?? addCalendarMonths(now, offer.months))
      : addCalendarMonths(laterOf(user?.planEndsAt ?? null, now), offer.months);
    // A subscription renews (no end set); a one-time term ends by itself. The test checkout has no Stripe object.
    const cancelAt = offer.kind === "one_time" ? endsAt : details.subscription ? cancelDate(details.subscription) : null;

    await db
      .update(users)
      .set({
        plan: offer.plan,
        planOffer: offer.id,
        planEndsAt: endsAt,
        planCancelAt: cancelAt,
        stripeSubscriptionId: details.subscription?.id ?? null,
      })
      .where(eq(users.id, claimed.userId));
    await db.update(billingOrders).set({ accessEndsAt: endsAt }).where(eq(billingOrders.id, orderId));
    await BillingMailService.sendOrderConfirmation(orderId).catch((error) => console.error("[billing] order mail", error));
    return true;
  };

  /** Checkout session finished (success page or webhook). Grants access only when Stripe says "paid". */
  static fromCheckoutSession = async (session: Stripe.Checkout.Session): Promise<boolean> => {
    const orderId = session.metadata?.orderId ?? session.client_reference_id;
    if (!orderId || session.payment_status !== "paid") return false;
    const subscriptionId = idOf(session.subscription);
    const subscription = subscriptionId ? await stripeClient().subscriptions.retrieve(subscriptionId) : null;
    return BillingFulfillment.fulfilOrder(orderId, { subscription, invoiceId: idOf(session.invoice) });
  };

  /** Success URL: confirms the session belongs to this user before anything else. */
  static confirmForUser = async (sessionId: string, userId: string): Promise<"paid" | "pending"> => {
    const session = await stripeClient().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userId !== userId) return "pending";
    if (session.payment_status !== "paid") return "pending";
    await BillingFulfillment.fromCheckoutSession(session);
    return "paid";
  };

  /** Mirrors a subscription change (renewal, cancellation, end) onto the account. */
  static syncSubscription = async (subscription: Stripe.Subscription): Promise<void> => {
    const [user] = await db
      .select({ id: users.id, planCancelAt: users.planCancelAt })
      .from(users)
      .where(eq(users.stripeSubscriptionId, subscription.id));
    if (!user) return;

    if (ENDED_STATUSES.has(subscription.status)) {
      const endedAt = fromUnix(subscription.ended_at) ?? new Date();
      await db.update(users).set({ planEndsAt: endedAt, planCancelAt: endedAt, stripeSubscriptionId: null }).where(eq(users.id, user.id));
      return;
    }
    const cancelAt = cancelDate(subscription);
    await db.update(users).set({ planEndsAt: periodEnd(subscription), planCancelAt: cancelAt }).where(eq(users.id, user.id));
    // Cancelled elsewhere (Stripe portal): the confirmation mail still goes out from here
    if (cancelAt && !user.planCancelAt) {
      await BillingMailService.sendPortalCancellation(user.id, cancelAt).catch((error) => console.error("[billing] cancel mail", error));
    }
  };

  /** Webhook entry point. Returns false when the event was already handled. */
  static handleEvent = async (event: Stripe.Event): Promise<boolean> => {
    const [seen] = await db.select({ id: billingEvents.id }).from(billingEvents).where(eq(billingEvents.id, event.id));
    if (seen) return false;

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await BillingFulfillment.fromCheckoutSession(event.data.object);
        break;
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const orderId = event.data.object.metadata?.orderId;
        const status = event.type === "checkout.session.expired" ? "expired" : "failed";
        if (orderId) await db.update(billingOrders).set({ status }).where(and(eq(billingOrders.id, orderId), eq(billingOrders.status, "open")));
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await BillingFulfillment.syncSubscription(event.data.object);
        break;
      case "invoice.paid": {
        const subscriptionId = idOf(event.data.object.parent?.subscription_details?.subscription);
        if (subscriptionId) await BillingFulfillment.syncSubscription(await stripeClient().subscriptions.retrieve(subscriptionId));
        break;
      }
      default:
        break;
    }
    // Remembered only after success, so Stripe redelivers when processing failed
    await db.insert(billingEvents).values({ id: event.id, type: event.type }).onConflictDoNothing();
    return true;
  };
}
