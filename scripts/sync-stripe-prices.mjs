import fs from "node:fs";
import Stripe from "stripe";

const envPath = ".env.local";
const envText = fs.readFileSync(envPath, "utf8");
const envMap = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, "")];
    }),
);

if (!envMap.STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY in .env.local");
  process.exit(1);
}

const stripe = new Stripe(envMap.STRIPE_SECRET_KEY);

const OFFERS = [
  {
    id: "investor-monat",
    envSuffix: "INVESTOR_MONAT",
    productName: "Belowmark Investor · Monatlich",
    recurring: { interval: "month" },
    prices: {
      DE: { amount: 3_900, currency: "eur" },
      AT: { amount: 3_900, currency: "eur" },
      FR: { amount: 3_900, currency: "eur" },
      IT: { amount: 2_900, currency: "eur" },
      ES: { amount: 2_900, currency: "eur" },
      CH: { amount: 4_900, currency: "chf" },
      GB: { amount: 3_500, currency: "gbp" },
      TR: { amount: 59_900, currency: "try" },
    },
  },
  {
    id: "investor-quartal",
    envSuffix: "INVESTOR_QUARTAL",
    productName: "Belowmark Investor · 3 Monate",
    recurring: null,
    prices: {
      DE: { amount: 9_900, currency: "eur" },
      AT: { amount: 9_900, currency: "eur" },
      FR: { amount: 9_900, currency: "eur" },
      IT: { amount: 7_900, currency: "eur" },
      ES: { amount: 7_900, currency: "eur" },
      CH: { amount: 12_900, currency: "chf" },
      GB: { amount: 8_900, currency: "gbp" },
      TR: { amount: 149_000, currency: "try" },
    },
  },
  {
    id: "pro-monat",
    envSuffix: "PRO_MONAT",
    productName: "Belowmark Pro · Monatlich",
    recurring: { interval: "month" },
    prices: {
      DE: { amount: 12_900, currency: "eur" },
      AT: { amount: 12_900, currency: "eur" },
      FR: { amount: 12_900, currency: "eur" },
      IT: { amount: 9_900, currency: "eur" },
      ES: { amount: 9_900, currency: "eur" },
      CH: { amount: 15_900, currency: "chf" },
      GB: { amount: 11_900, currency: "gbp" },
      TR: { amount: 199_000, currency: "try" },
    },
  },
  {
    id: "pro-quartal",
    envSuffix: "PRO_QUARTAL",
    productName: "Belowmark Pro · 3 Monate",
    recurring: null,
    prices: {
      DE: { amount: 32_900, currency: "eur" },
      AT: { amount: 32_900, currency: "eur" },
      FR: { amount: 32_900, currency: "eur" },
      IT: { amount: 24_900, currency: "eur" },
      ES: { amount: 24_900, currency: "eur" },
      CH: { amount: 39_900, currency: "chf" },
      GB: { amount: 29_900, currency: "gbp" },
      TR: { amount: 499_000, currency: "try" },
    },
  },
];

async function ensureProduct(offer) {
  const productId = `belowmark_${offer.id.replace("-", "_")}`;
  try {
    const existing = await stripe.products.retrieve(productId);
    return existing.id;
  } catch {
    const created = await stripe.products.create({
      id: productId,
      name: offer.productName,
      metadata: { belowmark_offer: offer.id },
    });
    return created.id;
  }
}

async function run() {
  const allPrices = await stripe.prices.list({ limit: 100, active: true });
  const resolvedEnv = {};

  for (const offer of OFFERS) {
    const productId = await ensureProduct(offer);
    for (const [country, spec] of Object.entries(offer.prices)) {
      const envKey = `STRIPE_PRICE_${country}_${offer.envSuffix}`;
      // 1. Check if existing env var already points to a matching active Stripe price
      const configuredId = envMap[envKey];
      let matched = null;
      if (configuredId) {
        const found = allPrices.data.find((p) => p.id === configuredId);
        if (
          found &&
          found.active &&
          found.currency === spec.currency &&
          found.unit_amount === spec.amount &&
          Boolean(found.recurring) === Boolean(offer.recurring)
        ) {
          matched = found;
        }
      }

      // 2. Otherwise search all active Stripe prices for a matching price (same currency, unit_amount, cadence, and offer metadata or product)
      if (!matched) {
        matched = allPrices.data.find((p) => {
          const sameCadence = offer.recurring
            ? p.recurring?.interval === "month" && (p.recurring?.interval_count ?? 1) === 1
            : !p.recurring;
          return (
            p.active &&
            sameCadence &&
            p.currency === spec.currency &&
            p.unit_amount === spec.amount &&
            (p.product === productId || p.metadata?.belowmark_offer === offer.id || envMap[`STRIPE_PRICE_DE_${offer.envSuffix}`] === p.id || envMap[`STRIPE_PRICE_TR_${offer.envSuffix}`] === p.id)
          );
        });
      }

      // 3. Create the price in Stripe if it doesn't exist yet
      if (!matched) {
        matched = await stripe.prices.create({
          product: productId,
          currency: spec.currency,
          unit_amount: spec.amount,
          ...(offer.recurring ? { recurring: offer.recurring } : {}),
          nickname: `${offer.productName} (${country} · ${(spec.amount / 100).toFixed(2)} ${spec.currency.toUpperCase()})`,
          metadata: {
            belowmark_offer: offer.id,
            belowmark_country: country,
          },
        });
        allPrices.data.push(matched);
        console.log(`[CREATED] ${envKey}=${matched.id} (${spec.amount / 100} ${spec.currency.toUpperCase()})`);
      } else {
        console.log(`[VERIFIED] ${envKey}=${matched.id} (${spec.amount / 100} ${spec.currency.toUpperCase()})`);
      }

      resolvedEnv[envKey] = matched.id;
    }
  }

  // Update .env.local with all 32 STRIPE_PRICE_* keys cleanly
  const lines = envText.split(/\r?\n/).filter((line) => !line.trim().startsWith("STRIPE_PRICE_"));
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  for (const [k, v] of Object.entries(resolvedEnv)) {
    lines.push(`${k}=${v}`);
  }
  lines.push("");
  fs.writeFileSync(envPath, lines.join("\n"), "utf8");
  console.log(`\nSuccessfully wrote all ${Object.keys(resolvedEnv).length} verified Stripe Price IDs to .env.local!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
