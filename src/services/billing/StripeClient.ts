import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";

const globalForStripe = globalThis as unknown as { stripeClient: Stripe | undefined; stripeKey: string | undefined };

/** One Stripe client instance per secret key (supports hot-reload key updates). */
export function stripeClient(): Stripe {
  const key = env.stripeSecretKey;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!globalForStripe.stripeClient || globalForStripe.stripeKey !== key) {
    globalForStripe.stripeClient = new Stripe(key, { maxNetworkRetries: 2, timeout: 20_000 });
    globalForStripe.stripeKey = key;
  }
  return globalForStripe.stripeClient;
}

/** sk_test_ keys move no real money — the legal release is not needed to try the flow. */
export const isStripeTestKey = (): boolean => env.stripeSecretKey.startsWith("sk_test_") || env.stripeSecretKey.startsWith("rk_test_");
