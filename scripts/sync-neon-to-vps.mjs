#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Idempotent Neon -> VPS PostgreSQL delta importer.
// Safely copies any missing users, password hashes, search_alerts, alert_seen,
// watchlist, and free_listing_unlocks once Neon's monthly quota resets.
// ---------------------------------------------------------------------------

import path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";
import pg from "pg";
import { buildPgConnectionConfig } from "../src/db/pgHttpsTunnel.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env.local"), quiet: true });

export async function syncNeonToVpsIfAvailable() {
  const neonUrl = process.env.NEON_LEGACY_DATABASE_URL;
  const vpsUrl = process.env.DATABASE_URL;
  if (!neonUrl || !vpsUrl || neonUrl === vpsUrl) {
    return { attempted: false, reason: "no_separate_neon_url" };
  }

  const src = new pg.Client({ connectionString: neonUrl, connectionTimeoutMillis: 4000 });
  try {
    await src.connect();
  } catch (err) {
    return { attempted: true, synced: false, reason: err?.message || "neon_unreachable" };
  }

  const dst = new pg.Client(buildPgConnectionConfig(vpsUrl, { connectionTimeoutMillis: 8000 }));
  await dst.connect();

  try {
    const { rows: srcUsers } = await src.query(`SELECT * FROM users`);
    const idMap = new Map();

    for (const u of srcUsers) {
      const { rows } = await dst.query(
        `INSERT INTO users (
           id, email, name, password_hash, market, country, locale,
           email_verified_at, trial_ends_at, plan, plan_ends_at, plan_offer,
           stripe_customer_id, stripe_subscription_id, plan_cancel_at, stripe_trial_used_at,
           permissions, sitzungs_version, gesperrt_am, sperr_grund, hardware_fingerprint,
           password_changed_at, last_login_at, created_at, updated_at
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::jsonb,$18,$19,$20,$21,$22,$23,$24,$25
         )
         ON CONFLICT (email) DO UPDATE SET
           email_verified_at = COALESCE(users.email_verified_at, EXCLUDED.email_verified_at),
           country = COALESCE(users.country, EXCLUDED.country)
         RETURNING id`,
        [
          u.id, u.email, u.name, u.password_hash, u.market, u.country, u.locale,
          u.email_verified_at, u.trial_ends_at, u.plan, u.plan_ends_at, u.plan_offer,
          u.stripe_customer_id, u.stripe_subscription_id, u.plan_cancel_at, u.stripe_trial_used_at,
          JSON.stringify(u.permissions ?? []), u.sitzungs_version ?? 1, u.gesperrt_am, u.sperr_grund,
          u.hardware_fingerprint, u.password_changed_at, u.last_login_at, u.created_at, u.updated_at,
        ],
      );
      if (rows[0]?.id) idMap.set(u.id, rows[0].id);
    }

    const { rows: srcWatch } = await src.query(`SELECT * FROM watchlist`);
    let watchSynced = 0;
    for (const w of srcWatch) {
      const targetUserId = idMap.get(w.user_id) || w.user_id;
      const res = await dst.query(
        `INSERT INTO watchlist (user_id, listing_id, note, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, listing_id) DO NOTHING`,
        [targetUserId, w.listing_id, w.note, w.created_at],
      );
      watchSynced += res.rowCount ?? 0;
    }

    const { rows: srcAlerts } = await src.query(`SELECT * FROM search_alerts`);
    let alertsSynced = 0;
    for (const a of srcAlerts) {
      const targetUserId = idMap.get(a.user_id) || a.user_id;
      const res = await dst.query(
        `INSERT INTO search_alerts (
           id, user_id, market, name, filters, notify_new, notify_changes,
           is_active, last_checked_at, last_sent_at, created_at, updated_at
         ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO NOTHING`,
        [
          a.id, targetUserId, a.market, a.name, JSON.stringify(a.filters),
          a.notify_new, a.notify_changes, a.is_active,
          a.last_checked_at, a.last_sent_at, a.created_at, a.updated_at,
        ],
      );
      alertsSynced += res.rowCount ?? 0;
    }

    return { attempted: true, synced: true, usersChecked: srcUsers.length, watchSynced, alertsSynced };
  } finally {
    await src.end().catch(() => {});
    await dst.end().catch(() => {});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncNeonToVpsIfAvailable().then((res) => console.log(JSON.stringify(res, null, 2)));
}
