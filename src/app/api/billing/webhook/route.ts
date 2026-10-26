import { connection } from "next/server";
import Stripe from "stripe";
import { err, ok } from "@/lib/api";
import { env } from "@/lib/env";
import { BillingFulfillment } from "@/services/billing/BillingFulfillment";
import { stripeClient } from "@/services/billing/StripeClient";

interface WebhookResponse {
  received: true;
  /** false when the event had been processed before */
  processed: boolean;
}

/**
 * POST /api/billing/webhook — Stripe events (payment confirmed, renewal,
 * cancellation). Only signed events are accepted; the signature is checked
 * against the raw body with STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request): Promise<Response> {
  await connection();
  if (!env.stripeSecretKey || !env.stripeWebhookSecret) return err("Webhook not configured", 503);

  const signature = request.headers.get("stripe-signature");
  if (!signature) return err("Missing signature", 400);
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    console.error("[POST /api/billing/webhook] signature", error);
    return err("Invalid signature", 400);
  }

  try {
    const processed = await BillingFulfillment.handleEvent(event);
    return ok<WebhookResponse>({ received: true, processed });
  } catch (error) {
    // 500 makes Stripe deliver the event again later
    console.error(`[POST /api/billing/webhook] ${event.type}`, error);
    return err("Processing failed");
  }
}
