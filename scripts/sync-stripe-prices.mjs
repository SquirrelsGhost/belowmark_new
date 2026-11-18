import fs from "node:fs";
import Stripe from "stripe";

const envPath = ".env.local";
const envTsPath = "src/lib/env.ts";
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
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
      NL: { amount: 3_900, currency: "eur" },
      PL: { amount: 12_900, currency: "pln" },
      CZ: { amount: 79_000, currency: "czk" },
      SE: { amount: 42_900, currency: "sek" },
      TR: { amount: 59_900, currency: "try" },
    },
  },
  {
    id: "investor-pass",
    envSuffix: "INVESTOR_PASS",
    productName: "Belowmark Investor · 14-Tage-Einmalpass",
    recurring: null,
    prices: {
      DE: { amount: 1_490, currency: "eur" },
      AT: { amount: 1_490, currency: "eur" },
      FR: { amount: 1_490, currency: "eur" },
      IT: { amount: 1_290, currency: "eur" },
      ES: { amount: 1_290, currency: "eur" },
      CH: { amount: 1_900, currency: "chf" },
      GB: { amount: 1_290, currency: "gbp" },
      NL: { amount: 1_490, currency: "eur" },
      PL: { amount: 5_900, currency: "pln" },
      CZ: { amount: 34_900, currency: "czk" },
      SE: { amount: 16_900, currency: "sek" },
      TR: { amount: 24_900, currency: "try" },
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
      NL: { amount: 9_900, currency: "eur" },
      PL: { amount: 32_900, currency: "pln" },
      CZ: { amount: 199_000, currency: "czk" },
      SE: { amount: 109_000, currency: "sek" },
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
      NL: { amount: 12_900, currency: "eur" },
      PL: { amount: 39_900, currency: "pln" },
      CZ: { amount: 249_000, currency: "czk" },
      SE: { amount: 139_000, currency: "sek" },
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
      NL: { amount: 32_900, currency: "eur" },
      PL: { amount: 99_000, currency: "pln" },
      CZ: { amount: 649_000, currency: "czk" },
      SE: { amount: 359_000, currency: "sek" },
      TR: { amount: 499_000, currency: "try" },
    },
  },
];

async function ensureProduct(offer) {
  const productId = `belowmark_${offer.id.replace(/-/g, "_")}`;
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
  const activePrices = [];
  for await (const p of stripe.prices.list({ limit: 100, active: true })) {
    activePrices.push(p);
  }
  const resolvedEnv = {};

  for (const offer of OFFERS) {
    const productId = await ensureProduct(offer);
    for (const [country, spec] of Object.entries(offer.prices)) {
      const envKey = `STRIPE_PRICE_${country}_${offer.envSuffix}`;
      const configuredId = envMap[envKey];
      let matched = null;
      if (configuredId) {
        const found = activePrices.find((p) => p.id === configuredId);
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

      if (!matched) {
        matched = activePrices.find((p) => {
          const sameCadence = offer.recurring
            ? p.recurring?.interval === "month" && (p.recurring?.interval_count ?? 1) === 1
            : !p.recurring;
          return (
            p.active &&
            sameCadence &&
            p.currency === spec.currency &&
            p.unit_amount === spec.amount &&
            (p.product === productId ||
              p.metadata?.belowmark_offer === offer.id ||
              envMap[`STRIPE_PRICE_DE_${offer.envSuffix}`] === p.id ||
              envMap[`STRIPE_PRICE_TR_${offer.envSuffix}`] === p.id)
          );
        });
      }

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
        activePrices.push(matched);
        console.log(`[CREATED] ${envKey}=${matched.id} (${spec.amount / 100} ${spec.currency.toUpperCase()})`);
      } else {
        console.log(`[VERIFIED] ${envKey}=${matched.id} (${spec.amount / 100} ${spec.currency.toUpperCase()})`);
      }

      resolvedEnv[envKey] = matched.id;
    }
  }

  // 1. Update .env.local with all 60 STRIPE_PRICE_* keys cleanly
  if (fs.existsSync(envPath)) {
    const lines = envText.split(/\r?\n/).filter((line) => !line.trim().startsWith("STRIPE_PRICE_"));
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    for (const [k, v] of Object.entries(resolvedEnv)) {
      lines.push(`${k}=${v}`);
    }
    lines.push("");
    fs.writeFileSync(envPath, lines.join("\n"), "utf8");
  }

  // 2. Update DEFAULT_STRIPE_PRICES in src/lib/env.ts so Vercel production has all 60 Price IDs built-in
  if (fs.existsSync(envTsPath)) {
    const envTs = fs.readFileSync(envTsPath, "utf8");
    const dictBody = Object.entries(resolvedEnv)
      .map(([k, v]) => `  ${k}: "${v}",`)
      .join("\n");
    const updatedEnvTs = envTs.replace(
      /const DEFAULT_STRIPE_PRICES: Readonly<Record<string, string>> = \{[\s\S]*?\};/,
      `const DEFAULT_STRIPE_PRICES: Readonly<Record<string, string>> = {\n${dictBody}\n};`,
    );
    fs.writeFileSync(envTsPath, updatedEnvTs, "utf8");
  }

  console.log(`\nSuccessfully synced all ${Object.keys(resolvedEnv).length} verified Stripe Price IDs to .env.local & src/lib/env.ts!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
