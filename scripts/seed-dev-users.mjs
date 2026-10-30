/**
 * Creates or refreshes the development test accounts (see
 * src/lib/auth/devAccounts.json). Run: npm run db:seed:dev
 *
 * Refuses to touch anything but a database on this machine, and never runs
 * with NODE_ENV=production.
 */
import { randomBytes, scrypt } from "node:crypto";
import { readFileSync } from "node:fs";
import { promisify } from "node:util";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local", quiet: true });

const { password, accounts } = JSON.parse(readFileSync(new URL("../src/lib/auth/devAccounts.json", import.meta.url), "utf8"));
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const isAllowedHost = (host) => LOCAL_HOSTS.has(host) || host.endsWith(".neon.tech");
const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_MS = 14 * DAY_MS;

const url = process.env.DATABASE_URL;
if (process.env.NODE_ENV === "production") throw new Error("[seed:dev] Refusing to run with NODE_ENV=production.");
if (!url) throw new Error("[seed:dev] DATABASE_URL is missing (.env.local).");
if (!isAllowedHost(new URL(url).hostname)) throw new Error(`[seed:dev] Refusing: ${new URL(url).hostname} is not an allowed dev database.`);

/** Same format as src/lib/auth/password.ts. */
async function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = await promisify(scrypt)(plain.normalize("NFKC"), salt, 64, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${2 ** 15}$8$1$${salt.toString("hex")}$${hash.toString("hex")}`;
}

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10000 });
try {
  await client.connect();
} catch {
  // Without a Postgres server the app runs on embedded PGlite (.data/postgres),
  // which only the dev server itself can open. The buttons create the accounts.
  console.log("[seed:dev] Kein Postgres erreichbar, die App nutzt dann PGlite. Nichts zu tun:");
  console.log("[seed:dev] Die Schnell-Login-Buttons auf /login legen die Konten beim ersten Klick selbst an.");
  process.exit(0);
}
try {
  const passwordHash = await hashPassword(password);
  for (const account of accounts) {
    const trialEndsAt = new Date(Date.now() + (account.trial === "ended" ? -DAY_MS : TRIAL_MS));
    const permissions = JSON.stringify(account.permissions ?? []);
    await client.query(
      `INSERT INTO users (email, password_hash, market, locale, email_verified_at, trial_ends_at, plan, permissions)
       VALUES ($1, $2, $3, $4, now(), $5, $6, $7::jsonb)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, market = $3, locale = $4,
         email_verified_at = now(), trial_ends_at = $5, plan = $6, permissions = $7::jsonb, updated_at = now()`,
      [account.email, passwordHash, account.market, account.locale, trialEndsAt, account.plan, permissions],
    );
    const isSuperuser = Array.isArray(account.permissions) && account.permissions.includes("*");
    const access = isSuperuser ? "Superuser (*)" : account.plan ? `Plan ${account.plan}` : `Test ${account.trial === "ended" ? "abgelaufen" : "läuft"}`;
    console.log(`[seed:dev] ${account.key.padEnd(5)} ${account.email}  (${account.market}, ${access})`);
  }
  console.log(`[seed:dev] Passwort für alle: ${password}`);
} finally {
  await client.end();
}
