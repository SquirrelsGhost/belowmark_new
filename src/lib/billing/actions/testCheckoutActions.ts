"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { billingOrders } from "@/db/schema";
import { BILLING_ROUTES, BILLING_STATUS, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { BILLING_ACCOUNT_PARAM } from "@/lib/billing/billingRoutes";
import { BillingFulfillment } from "@/services/billing/BillingFulfillment";
import { BillingService } from "@/services/billing/BillingService";
import { SessionService } from "@/services/SessionService";

async function ownOpenTestOrder(orderId: string) {
  const user = await SessionService.getCurrentUser();
  return user ? BillingService.openTestOrder(orderId, user.id) : null;
}

/** "Testzahlung abschließen": the same fulfilment a paid Stripe session triggers. */
export async function completeTestOrderAction(formData: FormData): Promise<void> {
  const order = await ownOpenTestOrder(String(formData.get("order") ?? ""));
  if (!order) redirect(BILLING_ROUTES.order);
  await BillingFulfillment.fulfilOrder(order.id, { subscription: null, invoiceId: null });
  redirect(`/konto?${BILLING_ACCOUNT_PARAM}=${BILLING_STATUS.paid}#tarif`);
}

/** "Abbrechen": like closing Stripe's page — nothing is charged. */
export async function abortTestOrderAction(formData: FormData): Promise<void> {
  const order = await ownOpenTestOrder(String(formData.get("order") ?? ""));
  if (order) await db.update(billingOrders).set({ status: "expired" }).where(eq(billingOrders.id, order.id));
  redirect(`${BILLING_ROUTES.order}?${OFFER_PARAM}=${order?.offer ?? ""}&status=${BILLING_STATUS.cancelled}`);
}
