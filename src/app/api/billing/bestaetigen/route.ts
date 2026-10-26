import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { BILLING_STATUS } from "@/lib/billing/billingConfig";
import { BILLING_ACCOUNT_ANCHOR, BILLING_ACCOUNT_PARAM } from "@/lib/billing/billingRoutes";
import { env } from "@/lib/env";
import { BillingFulfillment } from "@/services/billing/BillingFulfillment";
import { SessionService } from "@/services/SessionService";

/**
 * GET /api/billing/bestaetigen?session_id=… — Stripe's success URL.
 * Grants access right away if Stripe reports the session as paid, so nobody
 * waits for the webhook; the webhook does the same and only one of them wins.
 * Answers with a redirect to /konto, never with data.
 */
export async function GET(request: Request): Promise<Response> {
  await connection();
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(AUTH_ROUTES.account)}`);

  let status: string = BILLING_STATUS.pending;
  if (env.stripeSecretKey && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    try {
      status = (await BillingFulfillment.confirmForUser(sessionId, user.id)) === "paid" ? BILLING_STATUS.paid : BILLING_STATUS.pending;
    } catch (error) {
      console.error("[GET /api/billing/bestaetigen]", error);
    }
  }
  redirect(`${AUTH_ROUTES.account}?${BILLING_ACCOUNT_PARAM}=${status}#${BILLING_ACCOUNT_ANCHOR}`);
}
