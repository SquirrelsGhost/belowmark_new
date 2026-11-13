import { redirect } from "next/navigation";
import { connection } from "next/server";
import { err } from "@/lib/api";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { BILLING_STATUS } from "@/lib/billing/billingConfig";
import { BILLING_ACCOUNT_ANCHOR, BILLING_ACCOUNT_PARAM } from "@/lib/billing/billingRoutes";
import { env } from "@/lib/env";
import { AuthService } from "@/services/AuthService";
import { BillingFulfillment } from "@/services/billing/BillingFulfillment";
import { SessionService } from "@/services/SessionService";

/**
 * GET /api/billing/bestaetigen?session_id=… — Stripe's success URL.
 * Grants access right away if Stripe reports the session as paid, so nobody
 * waits for the webhook; the webhook does the same and only one of them wins.
 * Answers with a redirect to /konto (or /login with prefilled 6-digit code if unauthenticated), never with data.
 */
export async function GET(req: Request): Promise<Response> {
  await connection();
  if (!req.url) return err("Invalid request URL", 400);
  const sessionId = new URL(req.url).searchParams.get("session_id") ?? "";
  const isValidSessionId = Boolean(env.stripeSecretKey && /^cs_[A-Za-z0-9_]+$/.test(sessionId));
  const user = await SessionService.getCurrentUser();

  if (!user) {
    let customerEmail: string | undefined;
    if (isValidSessionId) {
      try {
        const res = await BillingFulfillment.confirmAnonymousSession(sessionId);
        customerEmail = res.email;
        if (res.settled && customerEmail) {
          await AuthService.requestLoginCode(customerEmail).catch(() => {});
        }
      } catch (error) {
        console.error("[GET /api/billing/bestaetigen:guest]", error);
      }
    }
    const emailQuery = customerEmail ? `&email=${encodeURIComponent(customerEmail)}&code=1` : "";
    redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent("/app")}${emailQuery}`);
  }

  let status: string = BILLING_STATUS.pending;
  if (isValidSessionId) {
    try {
      status = (await BillingFulfillment.confirmForUser(sessionId, user.id)) === "paid" ? BILLING_STATUS.paid : BILLING_STATUS.pending;
    } catch (error) {
      console.error("[GET /api/billing/bestaetigen]", error);
    }
  }
  redirect(`${AUTH_ROUTES.account}?${BILLING_ACCOUNT_PARAM}=${status}#${BILLING_ACCOUNT_ANCHOR}`);
}
